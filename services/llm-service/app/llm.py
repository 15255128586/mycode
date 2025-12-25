from openai import OpenAI

from app.config import Settings


def build_client(settings: Settings) -> OpenAI:
    return OpenAI(base_url=settings.base_url, api_key=settings.api_key)


def create_chat_completion(client: OpenAI, model: str, messages, stream: bool):
    return client.chat.completions.create(
        model=model,
        messages=messages,
        stream=stream,
    )
