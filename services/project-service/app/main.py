import json
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.db import MaterialBinding, Project, ProjectDefinition, get_session, init_db
from app.models import (
    MaterialBindingCreate,
    MaterialBindingItem,
    MaterialBindingList,
    ProjectCreate,
    ProjectDefinitionCreate,
    ProjectDefinitionItem,
    ProjectDefinitionList,
    ProjectItem,
    ProjectList,
)


app = FastAPI(title="Project Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _serialize_nodes(nodes) -> str:
    return json.dumps(nodes or {}, ensure_ascii=False)


def _parse_nodes(raw: str):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def _definition_item(definition: ProjectDefinition) -> ProjectDefinitionItem:
    return ProjectDefinitionItem(
        id=definition.id,
        name=definition.name,
        nodes_json=_parse_nodes(definition.nodes_json),
        created_at=definition.created_at,
        updated_at=definition.updated_at,
    )


def _project_item(project: Project) -> ProjectItem:
    return ProjectItem(
        id=project.id,
        name=project.name,
        definition_id=project.definition_id,
        owner=project.owner,
        status=project.status,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


def _binding_item(binding: MaterialBinding) -> MaterialBindingItem:
    return MaterialBindingItem(
        id=binding.id,
        project_id=binding.project_id,
        node_key=binding.node_key,
        file_id=binding.file_id,
        role=binding.role,
        created_at=binding.created_at,
    )


@app.post("/project-definitions", response_model=ProjectDefinitionItem)
def create_project_definition(payload: ProjectDefinitionCreate) -> ProjectDefinitionItem:
    now = _now()
    definition = ProjectDefinition(
        id=str(uuid.uuid4()),
        name=payload.name,
        nodes_json=_serialize_nodes(payload.nodes_json),
        created_at=now,
        updated_at=now,
    )
    with get_session() as session:
        session.add(definition)
        session.commit()
        session.refresh(definition)
    return _definition_item(definition)


@app.get("/project-definitions", response_model=ProjectDefinitionList)
def list_project_definitions() -> ProjectDefinitionList:
    with get_session() as session:
        items = session.execute(select(ProjectDefinition)).scalars().all()
    return ProjectDefinitionList(items=[_definition_item(item) for item in items])


@app.post("/projects", response_model=ProjectItem)
def create_project(payload: ProjectCreate) -> ProjectItem:
    project_id = payload.id or str(uuid.uuid4())
    now = _now()
    with get_session() as session:
        existing = session.get(Project, project_id)
        if existing:
            existing.name = payload.name or existing.name
            existing.definition_id = payload.definition_id or existing.definition_id
            existing.owner = payload.owner or existing.owner
            existing.status = payload.status or existing.status
            existing.updated_at = now
            session.commit()
            session.refresh(existing)
            return _project_item(existing)

        project = Project(
            id=project_id,
            name=payload.name,
            definition_id=payload.definition_id,
            owner=payload.owner,
            status=payload.status,
            created_at=now,
            updated_at=now,
        )
        session.add(project)
        session.commit()
        session.refresh(project)
    return _project_item(project)


@app.get("/projects", response_model=ProjectList)
def list_projects() -> ProjectList:
    with get_session() as session:
        items = session.execute(select(Project)).scalars().all()
    return ProjectList(items=[_project_item(item) for item in items])


@app.get("/projects/{project_id}", response_model=ProjectItem)
def get_project(project_id: str) -> ProjectItem:
    with get_session() as session:
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail={"error": "project_not_found"})
    return _project_item(project)


@app.post("/projects/{project_id}/materials", response_model=MaterialBindingItem)
def create_material_binding(
    project_id: str,
    payload: MaterialBindingCreate,
) -> MaterialBindingItem:
    node_key = payload.node_key or None
    role = payload.role or ("project" if node_key is None else "node")
    now = _now()

    with get_session() as session:
        project = session.get(Project, project_id)
        if not project:
            project = Project(
                id=project_id,
                name=payload.project_name or project_id,
                definition_id=None,
                owner=None,
                status=None,
                created_at=now,
                updated_at=now,
            )
            session.add(project)
            session.commit()

        if node_key is None:
            node_clause = MaterialBinding.node_key.is_(None)
        else:
            node_clause = MaterialBinding.node_key == node_key

        existing = session.execute(
            select(MaterialBinding).where(
                MaterialBinding.project_id == project_id,
                node_clause,
                MaterialBinding.file_id == payload.file_id,
            )
        ).scalar_one_or_none()
        if existing:
            return _binding_item(existing)

        binding = MaterialBinding(
            id=str(uuid.uuid4()),
            project_id=project_id,
            node_key=node_key,
            file_id=payload.file_id,
            role=role,
            created_at=now,
        )
        session.add(binding)
        session.commit()
        session.refresh(binding)

    return _binding_item(binding)


@app.get("/projects/{project_id}/materials", response_model=MaterialBindingList)
def list_material_bindings(project_id: str, node_key: str | None = None) -> MaterialBindingList:
    if node_key in {"", "null", "None"}:
        node_key = None
    with get_session() as session:
        query = select(MaterialBinding).where(MaterialBinding.project_id == project_id)
        if node_key is not None:
            query = query.where(MaterialBinding.node_key == node_key)
        items = session.execute(query).scalars().all()
    return MaterialBindingList(items=[_binding_item(item) for item in items])
