from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: bool = False
    model: Optional[str] = None


class ChatResponse(BaseModel):
    model: str
    content: str


class OpenAIChatCompletionsRequest(BaseModel):
    model: Optional[str] = None
    messages: List[Dict[str, Any]]
    stream: bool = False

    class Config:
        extra = "allow"
