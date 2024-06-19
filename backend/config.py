import logging
import os
from dotenv import load_dotenv


class Config:
    _instance = None

    def __new__(cls, telegram_token="", gemini_token="", log_level=logging.DEBUG):
        if not cls._instance:
            cls._instance = super(Config, cls).__new__(cls)
        return cls._instance

    def __init__(self, host="0.0.0.0", port=8000, env="", log_level=logging.DEBUG):
        load_dotenv()
        self.LOG_LEVEL = getattr(logging, os.environ.get("LOG_LEVEL", "").upper(), log_level)
        self.HOST = os.environ.get("HOST", host)
        self.PORT = os.environ.get("PORT", port)
        self.RELOAD = False if os.environ.get("env", env) == "prod" else True


def get_config():
    return Config()
