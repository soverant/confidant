from datetime import datetime

from pydantic import BaseModel
from typing import Optional


class NodeCreate(BaseModel):
    title: str
    prompt: Optional[str] = None
    response: Optional[str] = None
    spec: Optional[str] = None


class NodeUpdate(BaseModel):
    title: Optional[str] = None
    prompt: Optional[str] = None
    response: Optional[str] = None
    spec: Optional[str] = None


class Node(BaseModel):
    id: int
    title: str
    prompt: Optional[str] = None
    response: Optional[str] = None
    spec: Optional[str] = None
    created_at: datetime
    modified_at: datetime


class EdgeCreate(BaseModel):
    from_node: int
    to_node: int


class EdgeUpdate(BaseModel):
    from_node: Optional[int] = None
    to_node: Optional[int] = None


class Edge(BaseModel):
    id: int
    from_node: int
    to_node: int
    created_at: datetime
    modified_at: datetime


class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    root_node_id: Optional[int] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    root_node_id: Optional[int] = None


class Project(BaseModel):
    id: int
    title: str
    description: Optional[str]
    root_node_id: Optional[int]
    created_at: datetime
    modified_at: datetime


class CreateUpdateDeleteSuccessful(BaseModel):
    id: int
