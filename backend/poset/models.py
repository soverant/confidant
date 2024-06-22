from pydantic import BaseModel
from typing import List

class Edge(BaseModel):
    id: int | None = None
    from_node: int
    to_node: int


class Node(BaseModel):
    id: int | None = None
    prompt: str
    response: str
    parents: List['Node'] = []
    children: List['Node'] = []