# Online Editor Service (OnlyOffice)

OnlyOffice DocumentServer for online editing of Office files.

## Docker

```bash
cd services/online-editor-service
docker compose up
```

Service listens on `http://127.0.0.1:8082`.

## Notes

JWT is disabled for internal use. Do not expose publicly.
