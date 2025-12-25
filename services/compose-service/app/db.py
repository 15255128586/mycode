import os

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DEFAULT_DATABASE_URL = "postgresql+psycopg://compose:compose@localhost:5432/compose"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


class Base(DeclarativeBase):
    pass


class Draft(Base):
    __tablename__ = "drafts"
    __table_args__ = (UniqueConstraint("document_id", "version", name="uq_document_version"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    document_id: Mapped[str] = mapped_column(String, index=True)
    version: Mapped[int] = mapped_column()
    target_doc_kind: Mapped[str | None] = mapped_column(String, nullable=True)
    output_format: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[str] = mapped_column(String)


class ReferenceLink(Base):
    __tablename__ = "reference_links"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    draft_id: Mapped[str] = mapped_column(ForeignKey("drafts.id"), index=True)
    reference_id: Mapped[str] = mapped_column(String)
    reference_title: Mapped[str | None] = mapped_column(String, nullable=True)
    reference_doc_kind: Mapped[str | None] = mapped_column(String, nullable=True)
    reference_note: Mapped[str | None] = mapped_column(String, nullable=True)


class FactLink(Base):
    __tablename__ = "fact_links"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    draft_id: Mapped[str] = mapped_column(ForeignKey("drafts.id"), index=True)
    fact_id: Mapped[str] = mapped_column(String)
    fact_content: Mapped[str] = mapped_column(Text)


engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def get_session():
    return SessionLocal()
