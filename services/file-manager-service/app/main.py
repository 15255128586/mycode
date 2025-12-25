from contextlib import asynccontextmanager
from datetime import datetime, timezone
import io
import json
import os
import uuid

import httpx
from minio.error import S3Error
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse

from app.config import load_settings
from app.minio_client import build_client, ensure_bucket
from app.models import FileListResponse, FileItem, OnlyOfficeCallback, OnlyOfficeConfigResponse, UploadResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = load_settings()
    client = build_client(settings)
    ensure_bucket(client, settings.minio_bucket)
    app.state.settings = settings
    app.state.client = client
    yield


app = FastAPI(title="File Manager Service", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


def _file_type(filename: str) -> str:
    if "." not in filename:
        return "docx"
    return filename.rsplit(".", 1)[-1].lower()


def _document_type(file_type: str) -> str:
    if file_type in {"xls", "xlsx"}:
        return "cell"
    if file_type in {"ppt", "pptx"}:
        return "slide"
    return "word"


def _last_modified_ts(last_modified: datetime) -> str:
    if last_modified.tzinfo is None:
        last_modified = last_modified.replace(tzinfo=timezone.utc)
    return str(int(last_modified.timestamp()))


def _object_url(settings, file_id: str) -> str:
    return f"{settings.public_base_url}/files/{file_id}"


def _callback_url(settings, file_id: str) -> str:
    return f"{settings.public_base_url}/onlyoffice/callback/{file_id}"


def _editor_config(settings, file_id: str, filename: str, last_modified: datetime) -> OnlyOfficeConfigResponse:
    file_type = _file_type(filename)
    document_type = _document_type(file_type)
    document = {
        "fileType": file_type,
        "key": f"{file_id}-{_last_modified_ts(last_modified)}",
        "title": filename,
        "url": _object_url(settings, file_id),
    }
    editor_config = {
        "mode": "edit",
        "lang": "zh",
        "callbackUrl": _callback_url(settings, file_id),
    }
    return OnlyOfficeConfigResponse(document=document, editorConfig=editor_config, documentType=document_type)


def _read_metadata(stat) -> tuple[str, str | None]:
    metadata = stat.metadata or {}
    filename = metadata.get("x-amz-meta-filename") or metadata.get("filename") or "document"
    content_type = metadata.get("x-amz-meta-content-type") or metadata.get("content-type")
    return filename, content_type


def _raise_storage_unavailable(exc: Exception) -> None:
    raise HTTPException(status_code=503, detail={"error": "storage_unavailable"}) from exc


def _raise_missing_file(exc: Exception) -> None:
    raise HTTPException(status_code=404, detail={"error": "file_not_found"}) from exc


@app.get("/files", response_model=FileListResponse)
async def list_files() -> FileListResponse:
    settings = app.state.settings
    client = app.state.client
    items = []
    try:
        for obj in client.list_objects(settings.minio_bucket, recursive=True):
            stat = client.stat_object(settings.minio_bucket, obj.object_name)
            filename, _content_type = _read_metadata(stat)
            items.append(
                FileItem(
                    id=obj.object_name,
                    filename=filename,
                    size=stat.size,
                    last_modified=stat.last_modified,
                )
            )
    except Exception as exc:
        _raise_storage_unavailable(exc)
    return FileListResponse(items=items)


@app.post("/files", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    settings = app.state.settings
    client = app.state.client

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail={"error": "empty_file"})

    file_id = str(uuid.uuid4())
    content_type = file.content_type or "application/octet-stream"
    metadata = {
        "filename": file.filename or "document",
        "content-type": content_type,
    }

    try:
        client.put_object(
            settings.minio_bucket,
            file_id,
            io.BytesIO(data),
            length=len(data),
            content_type=content_type,
            metadata=metadata,
        )

        stat = client.stat_object(settings.minio_bucket, file_id)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    return UploadResponse(
        id=file_id,
        filename=file.filename or "document",
        size=stat.size,
        last_modified=stat.last_modified,
        content_type=content_type,
    )


@app.get("/files/{file_id}")
def download_file(file_id: str):
    settings = app.state.settings
    client = app.state.client

    try:
        obj = client.get_object(settings.minio_bucket, file_id)
    except S3Error as exc:
        if exc.code in {"NoSuchKey", "NoSuchObject"}:
            _raise_missing_file(exc)
        _raise_storage_unavailable(exc)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    try:
        stat = client.stat_object(settings.minio_bucket, file_id)
        filename, content_type = _read_metadata(stat)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    headers = {
        "Content-Disposition": f"attachment; filename=\"{filename}\""
    }
    return StreamingResponse(
        obj.stream(1024 * 1024),
        media_type=content_type or "application/octet-stream",
        headers=headers,
    )


@app.get("/files/{file_id}/config", response_model=OnlyOfficeConfigResponse)
def get_editor_config(file_id: str) -> OnlyOfficeConfigResponse:
    settings = app.state.settings
    client = app.state.client
    try:
        stat = client.stat_object(settings.minio_bucket, file_id)
    except S3Error as exc:
        if exc.code in {"NoSuchKey", "NoSuchObject"}:
            _raise_missing_file(exc)
        _raise_storage_unavailable(exc)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    filename, _content_type = _read_metadata(stat)
    return _editor_config(settings, file_id, filename, stat.last_modified)


@app.get("/files/{file_id}/editor", response_class=HTMLResponse)
def editor_page(file_id: str):
    settings = app.state.settings
    client = app.state.client
    try:
        stat = client.stat_object(settings.minio_bucket, file_id)
    except S3Error as exc:
        if exc.code in {"NoSuchKey", "NoSuchObject"}:
            _raise_missing_file(exc)
        _raise_storage_unavailable(exc)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    filename, _content_type = _read_metadata(stat)
    config = _editor_config(settings, file_id, filename, stat.last_modified)

    html = f"""<!DOCTYPE html>
<html lang=\"zh-CN\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>{filename}</title>
  <style>
    html, body {{ height: 100%; margin: 0; }}
    #doc-editor {{ height: 100%; }}
  </style>
  <script src=\"{settings.docserver_url}/web-apps/apps/api/documents/api.js\"></script>
</head>
<body>
  <div id=\"doc-editor\"></div>
  <script>
    const config = {json.dumps(config.dict(), ensure_ascii=False)};
    new DocsAPI.DocEditor("doc-editor", config);
  </script>
</body>
</html>"""
    return HTMLResponse(content=html)


@app.post("/onlyoffice/callback/{file_id}")
async def onlyoffice_callback(file_id: str, payload: OnlyOfficeCallback):
    settings = app.state.settings
    client = app.state.client

    if payload.status not in (2, 6):
        return {"error": 0}

    if not payload.url:
        raise HTTPException(status_code=400, detail={"error": "missing_url"})

    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(payload.url)
        response.raise_for_status()
        data = response.content

    if not data:
        raise HTTPException(status_code=400, detail={"error": "empty_document"})

    try:
        stat = client.stat_object(settings.minio_bucket, file_id)
        filename, content_type = _read_metadata(stat)

        client.put_object(
            settings.minio_bucket,
            file_id,
            io.BytesIO(data),
            length=len(data),
            content_type=content_type or "application/octet-stream",
            metadata={
                "filename": filename,
                "content-type": content_type or "application/octet-stream",
            },
        )
    except S3Error as exc:
        if exc.code in {"NoSuchKey", "NoSuchObject"}:
            _raise_missing_file(exc)
        _raise_storage_unavailable(exc)
    except Exception as exc:
        _raise_storage_unavailable(exc)

    return {"error": 0}
