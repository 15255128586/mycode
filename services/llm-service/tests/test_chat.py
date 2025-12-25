import os

from fastapi.testclient import TestClient

os.environ.setdefault("MODELSCOPE_BASE_URL", "http://example.invalid")
os.environ.setdefault("MODELSCOPE_API_KEY", "test-key")
os.environ.setdefault("MODELSCOPE_MODEL", "test-model")

from app.main import app  # noqa: E402


class FakeMessage:
    def __init__(self, content: str):
        self.content = content


class FakeChoice:
    def __init__(self, content: str):
        self.message = FakeMessage(content)


class FakeResponse:
    def __init__(self, content: str):
        self.choices = [FakeChoice(content)]


class FakeCompletions:
    def create(self, model, messages, stream):
        return FakeResponse("hello")


class FakeChat:
    def __init__(self):
        self.completions = FakeCompletions()


class FakeClient:
    def __init__(self):
        self.chat = FakeChat()


class FakeErrorCompletions:
    def create(self, model, messages, stream):
        raise RuntimeError("boom")


class FakeErrorChat:
    def __init__(self):
        self.completions = FakeErrorCompletions()


class FakeErrorClient:
    def __init__(self):
        self.chat = FakeErrorChat()


def test_chat_non_stream() -> None:
    with TestClient(app) as client:
        app.state.client = FakeClient()
        response = client.post(
            "/chat",
            json={"messages": [{"role": "user", "content": "hi"}]},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["content"] == "hello"


def test_chat_error() -> None:
    with TestClient(app) as client:
        app.state.client = FakeErrorClient()
        response = client.post(
            "/chat",
            json={"messages": [{"role": "user", "content": "hi"}]},
        )
    assert response.status_code == 502
    body = response.json()
    assert body["detail"]["error"] == "llm_request_failed"


def test_openai_models() -> None:
    with TestClient(app) as client:
        response = client.get("/v1/models")
    assert response.status_code == 200
    body = response.json()
    assert body["object"] == "list"
    assert body["data"][0]["id"] == "test-model"


def test_openai_chat_completions_non_stream() -> None:
    with TestClient(app) as client:
        app.state.client = FakeClient()
        response = client.post(
            "/v1/chat/completions",
            json={
                "messages": [{"role": "user", "content": "hi"}],
            },
        )
    assert response.status_code == 200
    body = response.json()
    assert body["object"] == "chat.completion"
    assert body["model"] == "test-model"
    assert body["choices"][0]["message"]["content"] == "hello"
