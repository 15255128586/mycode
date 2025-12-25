# Compose Service MVP

Minimal FastAPI service for controlled draft generation with traceable references and facts.

## Setup

```bash
cd services/compose-service
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

## Docker

```bash
cd services/compose-service
docker compose up --build
```

## Run

```bash
export DATABASE_URL=postgresql+psycopg://compose:compose@localhost:5432/compose
uvicorn app.main:app --reload
```

## Example

```bash
curl -X POST http://127.0.0.1:8000/compose \
  -H "Content-Type: application/json" \
  -d '{
    "target_doc_kind": "unknown",
    "references": [
      {"id": "ref-1", "title": "Sample Ref", "doc_kind": "unknown"}
    ],
    "facts": [
      {"id": "fact-1", "content": "Project scope and goals are defined."}
    ],
    "output_format": ["Overview", "Scope", "Risks"]
  }'
```

## Notes

- `target_doc_kind` must be provided. Use `"unknown"` to express unknown.
- When `target_doc_kind` is known, every reference must match it.
- When `target_doc_kind` is unknown, every reference must provide a `doc_kind` or `"unknown"`.
- Docker mode runs PostgreSQL and exposes port `5432`.
- Docker mode uses bind mounts for `app/` and runs with `--reload` for development.
