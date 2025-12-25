from contextlib import asynccontextmanager
from datetime import datetime, timezone
import json
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile

from app.config import load_settings
from app.db import IngestItem, IngestJob, get_session, init_db
from app.llm_client import LLMError, request_llm
from app.models import ConfirmRequest, IngestResponse
from app.parser import parse_file


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    app.state.settings = load_settings()
    yield


app = FastAPI(title="Doc Ingest Service", version="0.1.0", lifespan=lifespan)


def _store_items(session, job_id: str, kind: str, items: list[dict]) -> list[dict]:
    stored = []
    for item in items:
        raw_id = item.get("id")
        item_id = str(uuid.uuid4())
        source = item.get("source")
        if not isinstance(source, dict):
            source = {}
        if raw_id:
            source = {**source, "llm_id": raw_id}
        payload = {"id": item_id, "source": source}
        if kind == "project":
            content = item.get("content") or ""
            payload.update({"content": content})
            session.add(
                IngestItem(
                    id=item_id,
                    job_id=job_id,
                    item_kind="fact",
                    content=content,
                    title=None,
                    doc_kind=None,
                    note=None,
                    source_json=json.dumps(source, ensure_ascii=True),
                )
            )
        else:
            title = item.get("title") or "Untitled Reference"
            doc_kind = item.get("doc_kind") or "unknown"
            note = item.get("note")
            payload.update({
                "title": title,
                "doc_kind": doc_kind,
                "note": note,
            })
            session.add(
                IngestItem(
                    id=item_id,
                    job_id=job_id,
                    item_kind="reference",
                    content=None,
                    title=title,
                    doc_kind=doc_kind,
                    note=note,
                    source_json=json.dumps(source, ensure_ascii=True),
                )
            )
        stored.append(payload)
    return stored


def _ingest(kind: str, upload: UploadFile) -> IngestResponse:
    data = upload.file.read()
    if not data:
        raise HTTPException(status_code=400, detail={"error": "empty_file"})

    try:
        segments = parse_file(upload.filename, data)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc)}) from exc

    settings = load_settings()
    try:
        items = request_llm(settings.llm_base_url, kind, segments)
    except LLMError as exc:
        raise HTTPException(status_code=502, detail={"error": str(exc)}) from exc

    job_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds").replace(
        "+00:00", "Z"
    )

    session = get_session()
    try:
        session.add(
            IngestJob(
                id=job_id,
                kind=kind,
                filename=upload.filename or "upload",
                status="pending",
                created_at=created_at,
            )
        )
        stored_items = _store_items(session, job_id, kind, items)
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

    return IngestResponse(
        job_id=job_id,
        status="pending",
        kind=kind,
        filename=upload.filename or "upload",
        items=stored_items,
    )


@app.post("/ingest/projects", response_model=IngestResponse)
async def ingest_projects(file: UploadFile = File(...)) -> IngestResponse:
    return _ingest("project", file)


@app.post("/ingest/references", response_model=IngestResponse)
async def ingest_references(file: UploadFile = File(...)) -> IngestResponse:
    return _ingest("reference", file)


@app.get("/ingest/{job_id}", response_model=IngestResponse)
def get_job(job_id: str) -> IngestResponse:
    session = get_session()
    try:
        job = session.get(IngestJob, job_id)
        if job is None:
            raise HTTPException(status_code=404, detail={"error": "job_not_found"})
        rows = session.query(IngestItem).filter(IngestItem.job_id == job_id).all()
    finally:
        session.close()

    items = []
    for row in rows:
        source = json.loads(row.source_json)
        if row.item_kind == "fact":
            items.append({"id": row.id, "content": row.content or "", "source": source})
        else:
            items.append(
                {
                    "id": row.id,
                    "title": row.title or "Untitled Reference",
                    "doc_kind": row.doc_kind or "unknown",
                    "note": row.note,
                    "source": source,
                }
            )

    return IngestResponse(
        job_id=job.id,
        status=job.status,
        kind=job.kind,
        filename=job.filename,
        items=items,
    )


@app.put("/ingest/{job_id}/confirm", response_model=IngestResponse)
def confirm_job(job_id: str, payload: ConfirmRequest) -> IngestResponse:
    session = get_session()
    try:
        job = session.get(IngestJob, job_id)
        if job is None:
            raise HTTPException(status_code=404, detail={"error": "job_not_found"})

        job_kind = job.kind
        job_filename = job.filename
        session.query(IngestItem).filter(IngestItem.job_id == job_id).delete()
        stored_items = _store_items(session, job_id, job_kind, payload.items)
        job.status = "confirmed"
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

    return IngestResponse(
        job_id=job_id,
        status="confirmed",
        kind=job_kind,
        filename=job_filename,
        items=stored_items,
    )
