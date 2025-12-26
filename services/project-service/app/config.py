import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    database_url: str


def load_settings() -> Settings:
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://project:project@localhost:5433/project",
    )
    if not database_url:
        raise RuntimeError("DATABASE_URL is required")
    return Settings(database_url=database_url)
