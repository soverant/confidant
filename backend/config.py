import logging
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Configs(BaseSettings):
    log_level: str = Field("DEBUG")
    host: str = Field("0.0.0.0")
    port: int = Field(8000)
    environment: str = Field("development")
    orm_db_url: str = Field("sqlite://./data/orm_database.db")
    unmanaged_db_url: str = Field("sqlite://./data/um_database.db")

    def get_log_level(self):
        return getattr(logging, self.log_level, logging.INFO)


conf = Configs()


def get_config():
    return conf
