from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class FileItem(BaseModel):
    id: str
    filename: str
    size: int
    last_modified: datetime


class FileListResponse(BaseModel):
    items: List[FileItem]


class UploadResponse(FileItem):
    content_type: Optional[str] = None


class OnlyOfficeConfigResponse(BaseModel):
    document: dict
    editorConfig: dict
    documentType: str


class OnlyOfficeCallback(BaseModel):
    status: int
    url: Optional[str] = None
    key: Optional[str] = None
