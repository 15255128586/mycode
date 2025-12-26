# Project Service

Provides project definitions, projects, and node material bindings.

## Docker (dev)

```bash
cd services/project-service
docker compose up --build
```

Service runs at `http://127.0.0.1:9400`.

## Env

- `DATABASE_URL` (default `postgresql+psycopg://project:project@localhost:5433/project`)

## Endpoints

- `POST /project-definitions`
- `GET /project-definitions`
- `POST /projects`
- `GET /projects`
- `GET /projects/{project_id}`
- `PATCH /projects/{project_id}`
- `DELETE /projects/{project_id}`
- `POST /projects/{project_id}/materials`
- `GET /projects/{project_id}/materials`
