# File Storage Service (MinIO)

MinIO-based object storage for project and reference documents.

## Docker

```bash
cd services/file-storage-service
docker compose up
```

## Default Settings

- API: `http://127.0.0.1:9200`
- Console: `http://127.0.0.1:9201`
- Root user/password: `minioadmin` / `minioadmin`
- Buckets: `projects`, `references`, `documents`

## Notes

This setup is intended for internal use without additional auth. Do not expose publicly.
