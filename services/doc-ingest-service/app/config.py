import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    llm_base_url: str
    database_url: str


def load_settings() -> Settings:
    llm_base_url = os.getenv("LLM_BASE_URL", "http://llm-service:9001")
    database_url = os.getenv("DATABASE_URL", "sqlite:///./data/ingest.db")
    return Settings(llm_base_url=llm_base_url, database_url=database_url)
