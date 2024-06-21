from fastapi import APIRouter, Depends, HTTPException
from models.poset import *


router = APIRouter(
    prefix="/poset",
    tags=["poset"],
)


@router.get("/poset/{node_id}")
async def get_node(node_id: str) -> Node:
    node = await Node.from_queryset_single(NodeModel.get(id=node_id))
    return node


@router.post("/poset")
async def add_node(node: NodeIn, parent_id: Optional[str] = None):
    node_obj = await NodeModel.create(**node.model_dump(exclude_unset=True))
    if parent_id:
        parent = await NodeModel.get(id=parent_id)
        await EdgeModel.create(head=parent, tail=node_obj)
    new_node = await Node.from_queryset_single(NodeModel.get(id=node_obj.id))
    return new_node