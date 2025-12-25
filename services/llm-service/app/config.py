import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    base_url: str
    api_key: str
    model: str


def load_settings() -> Settings:
    base_url = os.getenv("MODELSCOPE_BASE_URL")
    api_key = os.getenv("MODELSCOPE_API_KEY")
    model = os.getenv("MODELSCOPE_MODEL")

    missing = []
    if not base_url:
        missing.append("MODELSCOPE_BASE_URL")
    if not api_key:
        missing.append("MODELSCOPE_API_KEY")
    if not model:
        missing.append("MODELSCOPE_MODEL")

    if missing:
        missing_list = ", ".join(missing)
        raise RuntimeError(f"Missing required env vars: {missing_list}")

    return Settings(base_url=base_url, api_key=api_key, model=model)
