# File Manager Service (MVP)

Provides file upload/list/download plus OnlyOffice editor launch config.

## Docker (dev)

```bash
cd services/file-manager-service
docker compose up --build
```

Service runs at `http://127.0.0.1:9300`.

## Endpoints

- `GET /files` list files
- `POST /files` upload file
- `GET /files/{id}` download file
- `GET /files/{id}/config` OnlyOffice config
- `GET /files/{id}/editor` editor page
- `POST /onlyoffice/callback/{id}` save callback

## Env

- `MINIO_ENDPOINT` (default `http://127.0.0.1:9200`)
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`
- `MINIO_BUCKET` (default `documents`)
- `PUBLIC_BASE_URL` (default `http://host.docker.internal:9300`)
- `DOCSERVER_URL` (default `http://127.0.0.1:8082`)
