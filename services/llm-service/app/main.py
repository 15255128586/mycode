from contextlib import asynccontextmanager
import json
import time
import uuid
from typing import Iterable

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from app.config import load_settings
from app.llm import build_client, create_chat_completion
from app.models import ChatRequest, ChatResponse, OpenAIChatCompletionsRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = load_settings()
    app.state.settings = settings
    app.state.client = build_client(settings)
    yield


app = FastAPI(title="LLM Service", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def stream_chunks(response) -> Iterable[str]:
    for chunk in response:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta
        reasoning_chunk = getattr(delta, "reasoning_content", None)
        content_chunk = delta.content

        if reasoning_chunk:
            payload = {"type": "reasoning", "content": reasoning_chunk}
            yield f"data: {json.dumps(payload)}\n\n"
        if content_chunk:
            payload = {"type": "content", "content": content_chunk}
            yield f"data: {json.dumps(payload)}\n\n"

    yield "data: [DONE]\n\n"


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    settings = app.state.settings
    client = app.state.client
    model = request.model or settings.model
    messages = [message.dict() for message in request.messages]

    try:
        if request.stream:
            response = create_chat_completion(client, model, messages, stream=True)
            return StreamingResponse(stream_chunks(response), media_type="text/event-stream")

        response = create_chat_completion(client, model, messages, stream=False)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={"error": "llm_request_failed", "message": str(exc)},
        ) from exc

    content = ""
    if response.choices and response.choices[0].message:
        content = response.choices[0].message.content or ""

    return ChatResponse(model=model, content=content)


@app.get("/v1/models")
def list_models():
    settings = app.state.settings
    return {
        "object": "list",
        "data": [
            {
                "id": settings.model,
                "object": "model",
                "owned_by": "modelscope",
            }
        ],
    }


def stream_openai_chunks(
    response,
    *,
    request_id: str,
    created: int,
    model: str,
) -> Iterable[str]:
    sent_role = False
    for chunk in response:
        if not chunk.choices:
            continue
        delta = chunk.choices[0].delta
        content_chunk = getattr(delta, "content", None)

        delta_payload = {}
        if not sent_role:
            delta_payload["role"] = "assistant"
            sent_role = True
        if content_chunk:
            delta_payload["content"] = content_chunk
        if not delta_payload:
            continue

        payload = {
            "id": request_id,
            "object": "chat.completion.chunk",
            "created": created,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "delta": delta_payload,
                    "finish_reason": None,
                }
            ],
        }
        yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"

    payload = {
        "id": request_id,
        "object": "chat.completion.chunk",
        "created": created,
        "model": model,
        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
    }
    yield f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"
    yield "data: [DONE]\n\n"


@app.post("/v1/chat/completions")
def chat_completions(request: OpenAIChatCompletionsRequest):
    settings = app.state.settings
    client = app.state.client
    model = request.model or settings.model
    created = int(time.time())
    request_id = f"chatcmpl-{uuid.uuid4().hex}"

    try:
        if request.stream:
            response = create_chat_completion(client, model, request.messages, stream=True)
            return StreamingResponse(
                stream_openai_chunks(
                    response,
                    request_id=request_id,
                    created=created,
                    model=model,
                ),
                media_type="text/event-stream",
            )

        response = create_chat_completion(client, model, request.messages, stream=False)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={"error": "llm_request_failed", "message": str(exc)},
        ) from exc

    content = ""
    if response.choices and response.choices[0].message:
        content = response.choices[0].message.content or ""

    return {
        "id": request_id,
        "object": "chat.completion",
        "created": created,
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": content},
                "finish_reason": "stop",
            }
        ],
    }
