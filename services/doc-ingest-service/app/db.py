from sqlalchemy import String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from app.config import load_settings


class Base(DeclarativeBase):
    pass


class IngestJob(Base):
    __tablename__ = "ingest_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    kind: Mapped[str] = mapped_column(String, index=True)
    filename: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, index=True)
    created_at: Mapped[str] = mapped_column(String)


class IngestItem(Base):
    __tablename__ = "ingest_items"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    job_id: Mapped[str] = mapped_column(String, index=True)
    item_kind: Mapped[str] = mapped_column(String, index=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    title: Mapped[str | None] = mapped_column(Text, nullable=True)
    doc_kind: Mapped[str | None] = mapped_column(String, nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_json: Mapped[str] = mapped_column(Text)


settings = load_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_session():
    return SessionLocal()
