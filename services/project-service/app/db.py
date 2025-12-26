from sqlalchemy import Boolean, Float, String, Text, UniqueConstraint, create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

from app.config import load_settings


class Base(DeclarativeBase):
    pass


class ProjectDefinition(Base):
    __tablename__ = "project_definitions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    nodes_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[str] = mapped_column(String)
    updated_at: Mapped[str] = mapped_column(String)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str | None] = mapped_column(String, nullable=True)
    definition_id: Mapped[str | None] = mapped_column(String, nullable=True)
    owner: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[str | None] = mapped_column(String, nullable=True)
    due: Mapped[str | None] = mapped_column(String, nullable=True)
    department: Mapped[str | None] = mapped_column(String, nullable=True)
    desc: Mapped[str | None] = mapped_column(Text, nullable=True)
    health: Mapped[str | None] = mapped_column(String, nullable=True)
    progress: Mapped[float | None] = mapped_column(Float, nullable=True)
    archived: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    archived_at: Mapped[str | None] = mapped_column(String, nullable=True)
    flow_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(String)
    updated_at: Mapped[str] = mapped_column(String)


class MaterialBinding(Base):
    __tablename__ = "material_bindings"
    __table_args__ = (
        UniqueConstraint("project_id", "node_key", "file_id", name="uq_material_binding"),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True)
    project_id: Mapped[str] = mapped_column(String, index=True)
    node_key: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    file_id: Mapped[str] = mapped_column(String, index=True)
    role: Mapped[str] = mapped_column(String)
    created_at: Mapped[str] = mapped_column(String)


settings = load_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

PROJECT_COLUMN_DEFS = {
    "due": "VARCHAR",
    "department": "VARCHAR",
    "desc": "TEXT",
    "health": "VARCHAR",
    "progress": "DOUBLE PRECISION",
    "archived": "BOOLEAN DEFAULT FALSE",
    "archived_at": "VARCHAR",
    "flow_json": "TEXT",
}


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_project_columns()


def ensure_project_columns() -> None:
    inspector = inspect(engine)
    existing = {col["name"] for col in inspector.get_columns("projects")}
    missing = {
        name: ddl for name, ddl in PROJECT_COLUMN_DEFS.items() if name not in existing
    }
    if not missing:
        return

    with engine.begin() as conn:
        for name, ddl in missing.items():
            column_name = f"\"{name}\"" if name == "desc" else name
            conn.execute(text(f"ALTER TABLE projects ADD COLUMN {column_name} {ddl}"))


def get_session():
    return SessionLocal()
