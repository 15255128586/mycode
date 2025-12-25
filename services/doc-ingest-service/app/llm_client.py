import json
from typing import Any, List

import httpx


class LLMError(RuntimeError):
    pass


def build_prompt(kind: str, segments: List[dict]) -> tuple[str, str]:
    if kind == "project":
        system_prompt = (
            "You extract project facts. Return a JSON array of objects with fields "
            "id, content, source. source MUST be copied from provided segments."
        )
    else:
        system_prompt = (
            "You extract writing references. Return a JSON array of objects with fields "
            "id, title, doc_kind, note, source. Use doc_kind='unknown' when unsure. "
            "source MUST be copied from provided segments."
        )
    user_prompt = json.dumps({"segments": segments}, ensure_ascii=True)
    return system_prompt, user_prompt


def parse_llm_json(content: str) -> List[dict]:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("[")
        end = content.rfind("]")
        if start == -1 or end == -1:
            raise LLMError("invalid_llm_json")
        try:
            return json.loads(content[start : end + 1])
        except json.JSONDecodeError as exc:
            raise LLMError("invalid_llm_json") from exc


def request_llm(base_url: str, kind: str, segments: List[dict]) -> List[dict]:
    system_prompt, user_prompt = build_prompt(kind, segments)
    payload = {
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "stream": False,
    }
    try:
        response = httpx.post(f"{base_url}/chat", json=payload, timeout=60)
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise LLMError("llm_request_failed") from exc

    data = response.json()
    content = data.get("content", "")
    return parse_llm_json(content)
