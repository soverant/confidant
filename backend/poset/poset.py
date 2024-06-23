import logging
from typing import AsyncGenerator, Optional
from contextlib import asynccontextmanager
from fastapi import APIRouter, HTTPException
from .repository import NodeModel, EdgeModel, connect_to_database, disconnect_from_database, create_tables
from .models import *

log = logging.getLogger(__name__)
router = APIRouter(
    prefix="/poset",
    tags=["poset"],
)

# Node CRUD endpoints
@router.post("/nodes/", response_model=Node)
async def create_node(node: Node, parent_id: Optional[int] = None):
    return await NodeModel.create(node, parent_id)

@router.get("/nodes/{node_id}", response_model=Node)
async def read_node(node_id: int):
    node = await read_node(node_id)
    if node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return node

@router.put("/nodes/{node_id}", response_model=Node)
async def update_node(node_id: int, node: Node):
    updated_node = await NodeModel.update(node_id, node)
    if updated_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return updated_node

@router.delete("/nodes/{node_id}")
async def delete_node(node_id: int):
    await NodeModel.delete(node_id)
    return {"message": "Node deleted"}

# Edge CRUD endpoints
@router.post("/edges/", response_model=Edge)
async def create_edge(edge: Edge):
    return await EdgeModel.create(edge)

@router.get("/edges/{edge_id}", response_model=Edge)
async def read_edge(edge_id: int):
    edge = await read_edge(edge_id)
    if edge is None:
        raise HTTPException(status_code=404, detail="Edge not found")
    return edge

@router.put("/edges/{edge_id}", response_model=Edge)
async def update_edge(edge_id: int, edge: Edge):
    updated_edge = await EdgeModel.update(edge_id, edge)
    if updated_edge is None:
        raise HTTPException(status_code=404, detail="Edge not found")
    return updated_edge

@router.delete("/edges/{edge_id}")
async def delete_edge(edge_id: int):
    await EdgeModel.delete(edge_id)
    return {"message": "Edge deleted"}