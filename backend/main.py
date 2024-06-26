import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import RegisterTortoise
from openai import AsyncAzureOpenAI

from chats.services import NarratorConfidant
from chats import chat
from chats.chat import confidants_service
from config import get_config
from logger import setup_logger
from studio import studio
from studio.dbm import get_database

conf = get_config()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # app startup
    async with RegisterTortoise(
            app,
            db_url=conf.orm_db_url,
            modules={"models": ["chats.models"]},
            generate_schemas=True,
            add_exception_handlers=True,
    ):
        # db connected
        log.info("orm db connected")
        umdatabase = get_database()
        umdatabase.init_db(conf.unmanaged_db_url)
        await umdatabase.connect_to_database()
        await umdatabase.create_tables()
        log.info("unmanaged db connected")
        client = AsyncAzureOpenAI(
            # This is the default and can be omitted
            api_key=conf.openai_token,
            api_version="2023-07-01-preview",
            azure_endpoint="https://mlk-openai-farhoud.openai.azure.com/",
        )
        confidant = NarratorConfidant(client)
        confidants_service.set_confidant("0", confidant)
        yield
        # app teardown
        await umdatabase.disconnect_from_database()
        print("root db disconnected")
    # db connections closed


try:
    setup_logger(conf.get_log_level())
    log = logging.getLogger(__name__)
    app = FastAPI(title="Soverant POC API", lifespan=lifespan)
    app.include_router(studio.router, prefix="/api")
    app.include_router(chat.router, prefix="/api")
    # Allow all origins (for development purposes)
    if conf.is_dev:
        origins = [
            "*"
        ]

        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

except Exception as e:
    print("the app is ended with this error: %s", str(e))
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn

    log.info("API is ready on http://%s:%d", conf.HOST, conf.PORT)
    log.info("Docs available is ready on http://%s:%d/docs", conf.HOST, conf.PORT)
    uvicorn.run("main:app", host=conf.HOST, port=conf.PORT, reload=conf.RELOAD, workers=2)
