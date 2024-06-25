import logging
from typing import List
from fastapi import APIRouter, HTTPException

from .repository import NodeRepository, EdgeRepository, ProjectRepository
from .models import *

log = logging.getLogger(__name__)
router = APIRouter(
    prefix="/studio",
    tags=["Studio"],
)

node_repo = NodeRepository()
edge_repo = EdgeRepository()
project_repo = ProjectRepository()


@router.post("/poset/nodes/", response_model=Node)
async def create_node(node: NodeCreate):
    return await node.create_node(**node.dict())


@router.get("/poset/nodes/{node_id}", response_model=Node)
async def read_node(node_id: int):
    node = await node_repo.get_node(node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return node


@router.get("/poset/nodes/", response_model=List[Node])
async def read_all_nodes():
    return await node_repo.get_all_nodes()


@router.put("/poset/nodes/{node_id}", response_model=Node)
async def update_node(node_id: int, node: NodeUpdate):
    updated_node = await node_repo.update_node(node_id, **node.dict(exclude_unset=True))
    if not updated_node:
        raise HTTPException(status_code=404, detail="Node not found")
    return updated_node


@router.delete("/poset/nodes/{node_id}", response_model=int)
async def delete_node(node_id: int):
    deleted_rows = await node_repo.delete_node(node_id)
    if not deleted_rows:
        raise HTTPException(status_code=404, detail="Node not found")
    return deleted_rows


@router.get("/poset/nodes/{node_id}/children", response_model=List[Node])
async def read_node_children(node_id: int):
    children = await node_repo.get_child_nodes(node_id)
    if not children:
        raise HTTPException(status_code=404, detail="No children found for this node")
    return children


@router.get("/poset/nodes/{node_id}/parents", response_model=List[Node])
async def read_node_parents(node_id: int):
    parents = await node_repo.get_parent_nodes(node_id)
    if not parents:
        raise HTTPException(status_code=404, detail="No parents found for this node")
    return parents


@router.post("/poset/edges/", response_model=Edge)
async def create_edge(edge: EdgeCreate):
    edge_id = await edge_repo.create_edge(**edge.dict())
    return await edge_repo.get_edge(edge_id)


@router.get("/poset/edges/{edge_id}", response_model=Edge)
async def read_edge(edge_id: int):
    edge = await edge_repo.get_edge(edge_id)
    if not edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    return edge


@router.get("/poset/edges/", response_model=List[Edge])
async def read_all_edges():
    return await edge_repo.get_all_edges()


@router.put("/poset/edges/{edge_id}", response_model=Edge)
async def update_edge(edge_id: int, edge: EdgeUpdate):
    updated_edge = await edge_repo.update_edge(edge_id, **edge.dict(exclude_unset=True))
    if not updated_edge:
        raise HTTPException(status_code=404, detail="Edge not found")
    return await edge_repo.get_edge(edge_id)


@router.delete("/poset/edges/{edge_id}", response_model=int)
async def delete_edge(edge_id: int):
    deleted_rows = await edge_repo.delete_edge(edge_id)
    if not deleted_rows:
        raise HTTPException(status_code=404, detail="Edge not found")
    return deleted_rows


@router.post("/projects/", response_model=Project)
async def create_project(project: ProjectCreate):
    project_id = await project_repo.create_project(**project.dict())
    return await project_repo.get_project(project_id)


@router.get("/projects/{project_id}", response_model=Project)
async def read_project(project_id: int):
    project = await project_repo.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/projects/", response_model=List[Project])
async def read_all_projects():
    return await project_repo.get_all_projects()


@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectUpdate):
    updated_project = await project_repo.update_project(project_id, **project.dict(exclude_unset=True))
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project


@router.delete("/projects/{project_id}", response_model=int)
async def delete_project(project_id: int):
    deleted_rows = await project_repo.delete_project(project_id)
    if not deleted_rows:
        raise HTTPException(status_code=404, detail="Project not found")
    return deleted_rows
