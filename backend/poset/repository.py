import logging
from typing import Optional, List
from databases import Database
from .models import *

log = logging.getLogger(__name__)
# SQLite database URL
DATABASE_URL = "sqlite:///./test.db"

# Initialize the database connection
database = Database(DATABASE_URL)

# Connect to the database
async def connect_to_database():
    await database.connect()

# Disconnect from the database
async def disconnect_from_database():
    await database.disconnect()

async def create_tables():
    await database.execute("""
    CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL
    );
    """)
    log.debug("table nodes created")
    await database.execute("""
    CREATE TABLE IF NOT EXISTS edges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_node INTEGER NOT NULL,
        to_node INTEGER NOT NULL,
        FOREIGN KEY (from_node) REFERENCES nodes (id),
        FOREIGN KEY (to_node) REFERENCES nodes (id)
    );
    """)
    log.debug("table edges created")

class NodeModel:
    # CRUD operations for Nodes
    @classmethod
    async def create(cls, node: Node, parent_id: Optional[int] = None) -> Node:
        async with database.transaction():
            query = "INSERT INTO nodes (prompt, response) VALUES (:prompt, :response)"
            values = {"prompt": node.prompt, "response": node.response}
            node_id = await database.execute(query=query, values=values)
            node.id = node_id
            
            if parent_id:
                # Check if the parent node exists
                query = "SELECT * FROM nodes WHERE id = :id"
                parent_node = await database.fetch_one(query=query, values={"id": parent_id})
                if not parent_node:
                    raise HTTPException(status_code=404, detail="Parent node not found")
                
                # Create an edge from the parent to the new node
                query = "INSERT INTO edges (from_node, to_node) VALUES (:from_node, :to_node)"
                values = {"from_node": parent_id, "to_node": node_id}
                await database.execute(query=query, values=values)

            node.parents = await cls.get_parents(node_id)
            node.children = await cls.get_children(node_id)
            return node

    @staticmethod
    async def get(node_id: int) -> Node:
        query = "SELECT * FROM nodes WHERE id = :id"
        node_data = await database.fetch_one(query=query, values={"id": node_id})
        if node_data is None:
            return None
        node = Node(**node_data)
        node.parents = await get_parents(node_id)
        node.children = await get_children(node_id)
        return node

    @staticmethod
    async def update(node_id: int, node: Node) -> Node:
        async with database.transaction():
            query = "UPDATE nodes SET prompt = :prompt, response = :response WHERE id = :id"
            values = {"id": node_id, "prompt": node.prompt, "response": node.response}
            await database.execute(query=query, values=values)
            node.id = node_id
            node.parents = await get_parents(node_id)
            node.children = await get_children(node_id)
            return node

    @staticmethod
    async def delete(node_id: int) -> None:
        async with database.transaction():
            query = "DELETE FROM nodes WHERE id = :id"
            await database.execute(query=query, values={"id": node_id})

    # Helper functions for fetching parent and child nodes
    async def get_parents(node_id: int) -> List[Node]:
        query = """
        SELECT nodes.* FROM nodes
        INNER JOIN edges ON edges.from_node = nodes.id
        WHERE edges.to_node = :node_id
        """
        rows = await database.fetch_all(query=query, values={"node_id": node_id})
        return [Node(**row) for row in rows]

    @staticmethod
    async def get_children(node_id: int) -> List[Node]:
        query = """
        SELECT nodes.* FROM nodes
        INNER JOIN edges ON edges.to_node = nodes.id
        WHERE edges.from_node = :node_id
        """
        rows = await database.fetch_all(query=query, values={"node_id": node_id})
        return [Node(**row) for row in rows]

class EdgeModel:
    @staticmethod
    async def create(edge: Edge) -> Edge:
        query = "INSERT INTO edges (from_node, to_node) VALUES (:from_node, :to_node)"
        values = {"from_node": edge.from_node, "to_node": edge.to_node}
        edge_id = await database.execute(query=query, values=values)
        return {**edge.dict(), "id": edge_id}

    @staticmethod
    async def read(edge_id: int) -> Edge:
        query = "SELECT * FROM edges WHERE id = :id"
        edge = await database.fetch_one(query=query, values={"id": edge_id})
        if edge is None:
            return None
        return Edge(**edge)

    @staticmethod
    async def update(edge_id: int, edge: Edge) -> Edge:
        query = "UPDATE edges SET from_node = :from_node, to_node = :to_node WHERE id = :id"
        values = {"id": edge_id, "from_node": edge.from_node, "to_node": edge.to_node}
        await database.execute(query=query, values=values)
        return {**edge.dict(), "id": edge_id}

    @staticmethod
    async def delete(edge_id: int) -> None:
        query = "DELETE FROM edges WHERE id = :id"
        await database.execute(query=query, values={"id": edge_id})