import logging
from typing import List
from .models import *
from .dbm import database

log = logging.getLogger(__name__)


class NodeRepository:

    async def create_node(self, title: str, prompt: Optional[str] = None, response: Optional[str] = None) -> int:
        query = "INSERT INTO nodes (prompt, response) VALUES (:prompt, :response)"
        values = {"title": title, "prompt": prompt, "response": response}
        return await database.get_db().execute(query, values)

    async def get_node(self, node_id: int) -> Optional[dict]:
        query = "SELECT * FROM nodes WHERE id = :node_id"
        return await database.get_db().fetch_one(query, {"node_id": node_id})

    async def get_all_nodes(self) -> List[dict]:
        query = "SELECT * FROM nodes"
        return await database.get_db().fetch_all(query)

    async def update_node(self, node_id: int, prompt: Optional[str] = None, response: Optional[str] = None) -> int:
        values = {"prompt": prompt, "response": response, "node_id": node_id}
        query = """
        UPDATE nodes SET 
            prompt = COALESCE(:prompt, prompt),
            response = COALESCE(:response, response)
        WHERE id = :node_id
        """
        return await database.get_db().execute(query, values)

    async def delete_node(self, node_id: int) -> int:
        query = "DELETE FROM nodes WHERE id = :node_id"
        return await database.get_db().execute(query, {"node_id": node_id})

    async def get_child_nodes(self, node_id: int) -> List[dict]:
        query = """
        SELECT n.* FROM nodes n
        JOIN edges e ON n.id = e.to_node
        WHERE e.from_node = :node_id
        """
        children = await database.get_db().fetch_all(query, {"node_id": node_id})
        return [dict(child) for child in children]

    async def get_parent_nodes(self, node_id: int) -> List[dict]:
        query = """
        SELECT n.* FROM nodes n
        JOIN edges e ON n.id = e.from_node
        WHERE e.to_node = :node_id
        """
        parents = await database.get_db().fetch_all(query, {"node_id": node_id})
        return [dict(parent) for parent in parents]


class EdgeRepository:

    async def create_edge(self, from_node: int, to_node: int) -> int:
        query = "INSERT INTO edges (from_node, to_node) VALUES (:from_node, :to_node)"
        values = {"from_node": from_node, "to_node": to_node}
        return await database.get_db().execute(query, values)

    async def get_edge(self, edge_id: int) -> Optional[dict]:
        query = "SELECT * FROM edges WHERE id = :edge_id"
        return await database.get_db().fetch_one(query, {"edge_id": edge_id})

    async def get_all_edges(self) -> List[dict]:
        query = "SELECT * FROM edges"
        return await database.get_db().fetch_all(query)

    async def update_edge(self, edge_id: int, from_node: Optional[int] = None, to_node: Optional[int] = None) -> int:
        values = {"from_node": from_node, "to_node": to_node, "edge_id": edge_id}
        query = """
        UPDATE edges SET 
            from_node = COALESCE(:from_node, from_node),
            to_node = COALESCE(:to_node, to_node)
        WHERE id = :edge_id
        """
        return await database.get_db().execute(query, values)

    async def delete_edge(self, edge_id: int) -> int:
        query = "DELETE FROM edges WHERE id = :edge_id"
        return await database.get_db().execute(query, {"edge_id": edge_id})


class ProjectRepository:

    async def create_project(self, title: str, description: Optional[str] = None,
                             root_node_id: Optional[int] = None) -> int:
        query = """
        INSERT INTO project (title, description, root_node_id) 
        VALUES (:title, :description, :root_node_id)
        """
        values = {"title": title, "description": description, "root_node_id": root_node_id}
        return await database.get_db().execute(query, values)

    async def get_project(self, project_id: int) -> Optional[dict]:
        query = "SELECT * FROM project WHERE id = :project_id"
        return await database.get_db().fetch_one(query, {"project_id": project_id})

    async def get_all_projects(self) -> List[dict]:
        query = "SELECT * FROM project"
        return await database.get_db().fetch_all(query)

    async def update_project(self, project_id: int, title: Optional[str] = None, description: Optional[str] = None,
                             root_node_id: Optional[int] = None) -> int:
        values = {"title": title, "description": description, "root_node_id": root_node_id, "project_id": project_id}
        query = """
        UPDATE project SET 
            title = COALESCE(:title, title),
            description = COALESCE(:description, description),
            root_node_id = COALESCE(:root_node_id, root_node_id)
        WHERE id = :project_id
        """
        return await database.get_db().execute(query, values)

    async def delete_project(self, project_id: int) -> int:
        query = "DELETE FROM project WHERE id = :project_id"
        return await database.get_db().execute(query, {"project_id": project_id})
