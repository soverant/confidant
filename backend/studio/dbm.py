import logging
from databases import Database
from .models import *

log = logging.getLogger(__name__)

current_version = 2  # Update this whenever you change the schema


class UnmanagedDatabase:
    database: Optional[Database]

    def init_db(self, url):
        self.database = Database(url)

    def get_db(self):
        return self.database

    # Connect to the database
    async def connect_to_database(self):
        await self.database.connect()

    # Disconnect from the database
    async def disconnect_from_database(self):
        await self.database.disconnect()

    async def create_all_tables(self):
        await self.database.execute("""
        CREATE TABLE IF NOT EXISTS schema_version (
            version INTEGER PRIMARY KEY
        );
        """)
        log.debug("table schema_version created")

        await self.database.execute("""
        CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            prompt TEXT,
            response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        log.debug("table nodes created")

        await self.database.execute("""
        CREATE TABLE IF NOT EXISTS edges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_node INTEGER NOT NULL,
            to_node INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (from_node) REFERENCES nodes (id),
            FOREIGN KEY (to_node) REFERENCES nodes (id)
        );
        """)
        log.debug("table edges created")

        await self.database.execute("""
        CREATE TABLE IF NOT EXISTS project (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            root_node_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (root_node_id) REFERENCES nodes (id)
        );
        """)
        log.debug("table project created")

        await self.database.execute("""
        CREATE TRIGGER IF NOT EXISTS set_nodes_modified_at
        AFTER UPDATE ON nodes
        FOR EACH ROW
        BEGIN
            UPDATE nodes SET modified_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
        """)
        log.debug("trigger set_nodes_modified_at created")

        await self.database.execute("""
        CREATE TRIGGER IF NOT EXISTS set_edges_modified_at
        AFTER UPDATE ON edges
        FOR EACH ROW
        BEGIN
            UPDATE edges SET modified_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
        """)
        log.debug("trigger set_edges_modified_at created")

        await self.database.execute("""
        CREATE TRIGGER IF NOT EXISTS set_project_modified_at
        AFTER UPDATE ON project
        FOR EACH ROW
        BEGIN
            UPDATE project SET modified_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
        """)
        log.debug("trigger set_project_modified_at created")

    async def drop_all_tables(self):
        await self.database.execute("DROP TABLE IF EXISTS nodes")
        await self.database.execute("DROP TABLE IF EXISTS edges")
        await self.database.execute("DROP TABLE IF EXISTS project")
        await self.database.execute("DROP TABLE IF EXISTS schema_version")
        log.debug("all tables dropped")

    async def create_tables(self):
        try:
            version = await self.database.fetch_one("SELECT version FROM schema_version")
        except:
            version = None

        if not version or version['version'] != current_version:
            await self.drop_all_tables()
            await self.create_all_tables()
            await self.database.execute("INSERT INTO schema_version (version) VALUES (:version)",
                                        values={"version": current_version})
        log.debug("schema version checked and updated")


database = UnmanagedDatabase()


def get_database():
    return database
