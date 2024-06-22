import logging

import sys
from typing import AsyncGenerator
from fastapi import FastAPI
from tortoise.contrib.fastapi import RegisterTortoise
from contextlib import asynccontextmanager
from logger import setup_logger
from config import get_config
from poset import poset, repository
from chats import chat


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # app startup
    async with RegisterTortoise(
            app,
            db_url="sqlite://:memory:",
            modules={"models": ["chats.models"]},
            generate_schemas=True,
            add_exception_handlers=True,
    ):
        # db connected
        print("root db connected")
        await repository.connect_to_database()
        await repository.create_tables()
        yield
        # app teardown
        await repository.disconnect_from_database()
        print("root db disconnected")
    # db connections closed


try:

    conf = get_config()
    setup_logger()
    log = logging.getLogger(__name__)
    app = FastAPI(title="Soverant POC API", lifespan=lifespan)
    app.include_router(poset.router)
    app.include_router(chat.router)

except Exception as e:
    print("the app is ended with this error: %s", str(e))
    sys.exit(1)






if __name__ == "__main__":
    import uvicorn
    log.info("API is ready on http://%s:%d", conf.HOST, conf.PORT)
    log.info("Docs available is ready on http://%s:%d/docs", conf.HOST, conf.PORT)
    uvicorn.run("main:app", host=conf.HOST, port=conf.PORT, reload=conf.RELOAD, workers=2)
