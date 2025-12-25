import os
from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass(frozen=True)
class Settings:
    minio_endpoint: str
    minio_access_key: str
    minio_secret_key: str
    minio_secure: bool
    minio_bucket: str
    public_base_url: str
    docserver_url: str


def _parse_endpoint(raw: str) -> tuple[str, bool]:
    parsed = urlparse(raw)
    if parsed.scheme:
        return parsed.netloc, parsed.scheme == "https"
    return raw, False


def load_settings() -> Settings:
    minio_endpoint_raw = os.getenv("MINIO_ENDPOINT", "http://127.0.0.1:9200")
    minio_access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    minio_secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    minio_bucket = os.getenv("MINIO_BUCKET", "documents")
    public_base_url = os.getenv("PUBLIC_BASE_URL", "http://127.0.0.1:9300")
    docserver_url = os.getenv("DOCSERVER_URL", "http://127.0.0.1:8082")

    endpoint, secure = _parse_endpoint(minio_endpoint_raw)
    if not endpoint:
        raise RuntimeError("MINIO_ENDPOINT is required")

    if not public_base_url:
        raise RuntimeError("PUBLIC_BASE_URL is required")
    if not docserver_url:
        raise RuntimeError("DOCSERVER_URL is required")

    return Settings(
        minio_endpoint=endpoint,
        minio_access_key=minio_access_key,
        minio_secret_key=minio_secret_key,
        minio_secure=secure,
        minio_bucket=minio_bucket,
        public_base_url=public_base_url.rstrip("/"),
        docserver_url=docserver_url.rstrip("/"),
    )
