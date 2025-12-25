import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    pytest.skip("DATABASE_URL not set for PostgreSQL tests", allow_module_level=True)

from app.db import Draft, FactLink, ReferenceLink, get_session, init_db  # noqa: E402
from app.main import app  # noqa: E402


def setup_module() -> None:
    init_db()
    session = get_session()
    try:
        session.execute(delete(ReferenceLink))
        session.execute(delete(FactLink))
        session.execute(delete(Draft))
        session.commit()
    finally:
        session.close()


def test_compose_success() -> None:
    payload = {
        "target_doc_kind": "unknown",
        "references": [
            {"id": "ref-1", "title": "Sample Ref", "doc_kind": "unknown"}
        ],
        "facts": [{"id": "fact-1", "content": "Fact A."}],
        "output_format": ["Intro", "Details"],
    }
    with TestClient(app) as client:
        response = client.post("/compose", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["version"] == 1
    assert "Draft" in body["content"]


def test_compose_missing_fields() -> None:
    payload = {
        "references": [],
        "facts": [],
        "output_format": [],
    }
    with TestClient(app) as client:
        response = client.post("/compose", json=payload)
    assert response.status_code == 400
    body = response.json()
    assert "missing_fields" in body["detail"]
