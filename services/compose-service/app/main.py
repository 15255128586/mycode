from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json
import uuid
from typing import List

from fastapi import FastAPI, HTTPException
from sqlalchemy import func, select

from app.db import Draft, FactLink, ReferenceLink, get_session, init_db
from app.models import ComposeRequest, ComposeResponse, Fact, Reference

@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Compose Service MVP", version="0.1.0", lifespan=lifespan)


def is_unknown(value: str | None) -> bool:
    if value is None:
        return True
    return value.strip().lower() in {"", "unknown"}


def validate_request(payload: ComposeRequest) -> dict:
    missing_fields: List[str] = []
    inconsistencies: List[dict] = []

    if "target_doc_kind" not in payload.__fields_set__:
        missing_fields.append("target_doc_kind")

    if not payload.references:
        missing_fields.append("references")

    if not payload.facts:
        missing_fields.append("facts")

    if not payload.output_format:
        missing_fields.append("output_format")

    target_unknown = is_unknown(payload.target_doc_kind)

    if payload.references:
        if target_unknown:
            for ref in payload.references:
                if ref.doc_kind is None or ref.doc_kind.strip() == "":
                    inconsistencies.append(
                        {
                            "field": "references.doc_kind",
                            "reference_id": ref.id,
                            "issue": "doc_kind_required_when_target_unknown",
                        }
                    )
        else:
            for ref in payload.references:
                if ref.doc_kind is None or ref.doc_kind.strip() == "":
                    inconsistencies.append(
                        {
                            "field": "references.doc_kind",
                            "reference_id": ref.id,
                            "issue": "doc_kind_missing",
                        }
                    )
                elif ref.doc_kind.strip() != payload.target_doc_kind:
                    inconsistencies.append(
                        {
                            "field": "references.doc_kind",
                            "reference_id": ref.id,
                            "issue": "doc_kind_mismatch",
                        }
                    )

    if missing_fields or inconsistencies:
        return {
            "valid": False,
            "missing_fields": missing_fields,
            "inconsistencies": inconsistencies,
        }

    return {"valid": True}


def compose_markdown(
    target_doc_kind: str | None, output_format: List[str], facts: List[Fact]
) -> str:
    header = "# Draft\n"
    doc_kind_line = (
        f"\n**Target Doc Kind**: {target_doc_kind.strip()}\n"
        if target_doc_kind and target_doc_kind.strip()
        else "\n**Target Doc Kind**: unknown\n"
    )
    body_sections = []
    for section in output_format:
        lines = [f"## {section}"]
        for fact in facts:
            lines.append(f"- {fact.content}")
        body_sections.append("\n".join(lines))
    return header + doc_kind_line + "\n\n".join(body_sections) + "\n"


@app.post("/compose", response_model=ComposeResponse)
def compose(payload: ComposeRequest) -> ComposeResponse:
    validation = validate_request(payload)
    if not validation.get("valid"):
        raise HTTPException(
            status_code=400,
            detail={
                "error": "invalid_input",
                "missing_fields": validation.get("missing_fields", []),
                "inconsistencies": validation.get("inconsistencies", []),
            },
        )

    document_id = payload.document_id or str(uuid.uuid4())
    session = get_session()
    try:
        max_version = session.execute(
            select(func.coalesce(func.max(Draft.version), 0)).where(
                Draft.document_id == document_id
            )
        ).scalar_one()
        version = int(max_version) + 1

        draft_id = str(uuid.uuid4())
        content = compose_markdown(
            payload.target_doc_kind, payload.output_format, payload.facts
        )
        created_at = (
            datetime.now(timezone.utc)
            .isoformat(timespec="seconds")
            .replace("+00:00", "Z")
        )

        session.add(
            Draft(
                id=draft_id,
                document_id=document_id,
                version=version,
                target_doc_kind=payload.target_doc_kind,
                output_format=json.dumps(payload.output_format),
                content=content,
                created_at=created_at,
            )
        )

        for ref in payload.references:
            session.add(
                ReferenceLink(
                    draft_id=draft_id,
                    reference_id=ref.id,
                    reference_title=ref.title,
                    reference_doc_kind=ref.doc_kind,
                    reference_note=ref.note,
                )
            )

        for fact in payload.facts:
            session.add(
                FactLink(
                    draft_id=draft_id,
                    fact_id=fact.id,
                    fact_content=fact.content,
                )
            )

        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

    return ComposeResponse(
        draft_id=draft_id,
        document_id=document_id,
        version=version,
        content=content,
        references_used=payload.references,
        facts_used=payload.facts,
    )


@app.get("/drafts/{draft_id}", response_model=ComposeResponse)
def get_draft(draft_id: str) -> ComposeResponse:
    session = get_session()
    try:
        draft_row = session.get(Draft, draft_id)
        if draft_row is None:
            raise HTTPException(status_code=404, detail={"error": "draft_not_found"})

        reference_rows = session.execute(
            select(ReferenceLink).where(ReferenceLink.draft_id == draft_id)
        ).scalars().all()
        references = [
            Reference(
                id=row.reference_id,
                title=row.reference_title,
                doc_kind=row.reference_doc_kind,
                note=row.reference_note,
            )
            for row in reference_rows
        ]

        fact_rows = session.execute(
            select(FactLink).where(FactLink.draft_id == draft_id)
        ).scalars().all()
        facts = [
            Fact(id=row.fact_id, content=row.fact_content) for row in fact_rows
        ]
    finally:
        session.close()

    return ComposeResponse(
        draft_id=draft_row.id,
        document_id=draft_row.document_id,
        version=draft_row.version,
        content=draft_row.content,
        references_used=references,
        facts_used=facts,
    )
