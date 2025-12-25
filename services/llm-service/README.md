# LLM Service

Minimal proxy service for ModelScope OpenAI-compatible APIs.

## Setup

```bash
cd services/llm-service
cp .env.example .env
# Edit .env and set MODELSCOPE_API_KEY
```

## Docker

```bash
docker compose up --build
```

Service listens on `http://127.0.0.1:9001`.

## Example (non-stream)

```bash
curl -X POST http://127.0.0.1:9001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

## Example (stream)

```bash
curl -N -X POST http://127.0.0.1:9001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "stream": true,
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

Streaming returns Server-Sent Events (SSE) with JSON payloads and a final `data: [DONE]` marker.
