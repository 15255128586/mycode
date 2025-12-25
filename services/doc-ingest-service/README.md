# Document Ingest Service

Uploads project/reference files, extracts facts or references via LLM, and stores pending items for manual confirmation.

## Docker

```bash
cd services/doc-ingest-service
docker compose up --build
```

Service listens on `http://127.0.0.1:9100`.

## Endpoints

- `POST /ingest/projects` (multipart file upload) -> facts
- `POST /ingest/references` (multipart file upload) -> references
- `GET /ingest/{job_id}` -> fetch job + items
- `PUT /ingest/{job_id}/confirm` -> replace items and mark confirmed

## Example (projects)

```bash
curl -X POST http://127.0.0.1:9100/ingest/projects \
  -F "file=@/path/to/project.docx"
```

## Example (confirm)

```bash
curl -X PUT http://127.0.0.1:9100/ingest/123/confirm \
  -H "Content-Type: application/json" \
  -d '{"items": [{"id": "fact-1", "content": "Scope defined", "source": {"page": 1, "line": 3}}]}'
```

## Notes

- Supported formats: PDF, DOCX, XLSX, Markdown.
- Set `LLM_BASE_URL` to reach the running LLM service. The Docker compose file uses `http://host.docker.internal:9001`.
