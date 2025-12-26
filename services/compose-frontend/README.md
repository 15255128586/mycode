# Compose Frontend (MVP)

React dev UI for the compose workflow.

## Docker (dev)

```bash
cd services/compose-frontend
docker compose up --build
```

App runs at `http://127.0.0.1:5173`.

## Notes

- Defaults to dev proxies (`/api/ingest`, `/api/compose`).
- Defaults to dev proxies (`/api/ingest`, `/api/compose`, `/api/files`).
- To override, set `VITE_DOC_INGEST_BASE_URL`, `VITE_COMPOSE_BASE_URL`, `VITE_FILE_MANAGER_BASE_URL`, `VITE_PROJECT_SERVICE_BASE_URL`.
- Docker uses proxy targets via `VITE_DOC_INGEST_PROXY_TARGET`, `VITE_COMPOSE_PROXY_TARGET`, `VITE_FILE_MANAGER_PROXY_TARGET`.
