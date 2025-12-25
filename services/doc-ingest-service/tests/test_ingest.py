import os
from pathlib import Path

from fastapi.testclient import TestClient

data_dir = Path(__file__).resolve().parents[1] / "data"
data_dir.mkdir(parents=True, exist_ok=True)
db_path = data_dir / "test.db"
os.environ.setdefault("DATABASE_URL", f"sqlite:///{db_path}")

from app.main import app


def test_ingest_project(monkeypatch) -> None:
    def fake_request_llm(base_url, kind, segments):
        assert kind == "project"
        return [{"id": "fact-1", "content": "Scope defined", "source": {"line": 1}}]

    monkeypatch.setattr("app.main.request_llm", fake_request_llm)

    with TestClient(app) as client:
        response = client.post(
            "/ingest/projects",
            files={"file": ("notes.md", b"Scope defined\n")},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "pending"
    assert body["items"][0]["content"] == "Scope defined"


def test_confirm_job(monkeypatch) -> None:
    def fake_request_llm(base_url, kind, segments):
        return [{"id": "ref-1", "title": "Guide", "doc_kind": "unknown", "note": None, "source": {"line": 1}}]

    monkeypatch.setattr("app.main.request_llm", fake_request_llm)

    with TestClient(app) as client:
        ingest = client.post(
            "/ingest/references",
            files={"file": ("ref.md", b"Guide\n")},
        )
        job_id = ingest.json()["job_id"]

        confirm = client.put(
            f"/ingest/{job_id}/confirm",
            json={"items": [{"id": "ref-2", "title": "Updated", "doc_kind": "unknown", "note": "", "source": {"line": 1}}]},
        )

    assert confirm.status_code == 200
    body = confirm.json()
    assert body["status"] == "confirmed"
    assert body["items"][0]["title"] == "Updated"
