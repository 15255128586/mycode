from typing import List, Optional

from pydantic import BaseModel, Field


class Reference(BaseModel):
    id: str
    title: Optional[str] = None
    doc_kind: Optional[str] = None
    note: Optional[str] = None


class Fact(BaseModel):
    id: str
    content: str


class ComposeRequest(BaseModel):
    target_doc_kind: Optional[str] = None
    references: List[Reference] = Field(default_factory=list)
    facts: List[Fact] = Field(default_factory=list)
    output_format: List[str] = Field(default_factory=list)
    document_id: Optional[str] = None


class ComposeResponse(BaseModel):
    draft_id: str
    document_id: str
    version: int
    content: str
    references_used: List[Reference]
    facts_used: List[Fact]
