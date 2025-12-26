from typing import List, Optional, Union

from pydantic import BaseModel


class ProjectDefinitionCreate(BaseModel):
    name: str
    nodes_json: Optional[Union[dict, list]] = None


class ProjectDefinitionItem(BaseModel):
    id: str
    name: str
    nodes_json: Optional[Union[dict, list]] = None
    created_at: str
    updated_at: str


class ProjectDefinitionList(BaseModel):
    items: List[ProjectDefinitionItem]


class ProjectCreate(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    definition_id: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due: Optional[str] = None
    department: Optional[str] = None
    desc: Optional[str] = None
    health: Optional[str] = None
    progress: Optional[float] = None
    archived: Optional[bool] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    definition_id: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due: Optional[str] = None
    department: Optional[str] = None
    desc: Optional[str] = None
    health: Optional[str] = None
    progress: Optional[float] = None
    archived: Optional[bool] = None


class ProjectItem(BaseModel):
    id: str
    name: Optional[str] = None
    definition_id: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due: Optional[str] = None
    department: Optional[str] = None
    desc: Optional[str] = None
    health: Optional[str] = None
    progress: Optional[float] = None
    archived: Optional[bool] = None
    archived_at: Optional[str] = None
    created_at: str
    updated_at: str


class ProjectList(BaseModel):
    items: List[ProjectItem]


class MaterialBindingCreate(BaseModel):
    node_key: Optional[str] = None
    file_id: str
    role: Optional[str] = None
    project_name: Optional[str] = None


class MaterialBindingItem(BaseModel):
    id: str
    project_id: str
    node_key: Optional[str] = None
    file_id: str
    role: str
    created_at: str


class MaterialBindingList(BaseModel):
    items: List[MaterialBindingItem]
