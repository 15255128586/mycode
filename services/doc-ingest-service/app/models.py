from typing import Any, List, Optional

from pydantic import BaseModel


class SourceLocation(BaseModel):
    data: dict[str, Any]


class FactItem(BaseModel):
    id: str
    content: str
    source: dict[str, Any]


class ReferenceItem(BaseModel):
    id: str
    title: str
    doc_kind: str
    note: Optional[str] = None
    source: dict[str, Any]


class IngestResponse(BaseModel):
    job_id: str
    status: str
    kind: str
    filename: str
    items: List[dict]


class ConfirmRequest(BaseModel):
    items: List[dict]
