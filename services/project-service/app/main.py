import json
import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import delete, select

from app.db import MaterialBinding, Project, ProjectDefinition, get_session, init_db
from app.models import (
  MaterialBindingCreate,
  MaterialBindingItem,
  MaterialBindingList,
  ProjectCreate,
  ProjectUpdate,
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


def _serialize_flow(flow) -> str | None:
    if flow is None:
        return None
    return json.dumps(flow, ensure_ascii=False)


def _parse_flow(raw: str | None):
    if raw is None:
        return None
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
    due=project.due,
    department=project.department,
    desc=project.desc,
    health=project.health,
    progress=project.progress,
    archived=project.archived,
    archived_at=project.archived_at,
    flow_json=_parse_flow(project.flow_json),
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


def _apply_project_updates(project: Project, payload: ProjectCreate | ProjectUpdate, now: str) -> None:
  if payload.name is not None:
    project.name = payload.name
  if payload.definition_id is not None:
    project.definition_id = payload.definition_id
  if payload.owner is not None:
    project.owner = payload.owner
  if payload.status is not None:
    project.status = payload.status
  if payload.due is not None:
    project.due = payload.due
  if payload.department is not None:
    project.department = payload.department
  if payload.desc is not None:
    project.desc = payload.desc
  if payload.health is not None:
    project.health = payload.health
  if payload.progress is not None:
    project.progress = payload.progress
  if payload.archived is not None:
    project.archived = payload.archived
    if payload.archived:
      project.archived_at = project.archived_at or now
    else:
      project.archived_at = None
  if payload.flow_json is not None:
    project.flow_json = _serialize_flow(payload.flow_json)
  project.updated_at = now


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
      _apply_project_updates(existing, payload, now)
      session.commit()
      session.refresh(existing)
      return _project_item(existing)

    project = Project(
      id=project_id,
      created_at=now,
      updated_at=now,
    )
    _apply_project_updates(project, payload, now)
    if project.archived is None:
      project.archived = False
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


@app.patch("/projects/{project_id}", response_model=ProjectItem)
def update_project(project_id: str, payload: ProjectUpdate) -> ProjectItem:
  now = _now()
  with get_session() as session:
    project = session.get(Project, project_id)
    if not project:
      raise HTTPException(status_code=404, detail={"error": "project_not_found"})
    _apply_project_updates(project, payload, now)
    session.commit()
    session.refresh(project)
  return _project_item(project)


@app.delete("/projects/{project_id}")
def delete_project(project_id: str) -> dict:
  with get_session() as session:
    project = session.get(Project, project_id)
    if not project:
      raise HTTPException(status_code=404, detail={"error": "project_not_found"})
    session.execute(
      delete(MaterialBinding).where(MaterialBinding.project_id == project_id)
    )
    session.delete(project)
    session.commit()
  return {"status": "deleted"}


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
        due=None,
        department=None,
        desc=None,
        health=None,
        progress=None,
        archived=False,
        archived_at=None,
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
