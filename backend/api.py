import sys
import logging
import uuid
from typing import Union, AsyncGenerator
from typing_extensions import Annotated
from fastapi import FastAPI, HTTPException, Cookie, Response
from fastapi.responses import JSONResponse
from tortoise import Tortoise
from tortoise.contrib.fastapi import RegisterTortoise
from contextlib import asynccontextmanager
from models import *
from config import get_config
from services import ConfidantsService,ChatService

CHAT_COOKIE_KEY = "chat_id"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:

    # app startup
    async with RegisterTortoise(
            app,
            db_url="sqlite://:memory:",
            modules={"models": ["models"]},
            generate_schemas=True,
            add_exception_handlers=True,
    ):
        # db connected
        print("db connected")
        yield
        # app teardown
        print("db disconnected")
    # db connections closed


try:

    conf = get_config()
    log = logging.getLogger(__name__)
    confidants_service = ConfidantsService()
    chat_service = ChatService()
    app = FastAPI(title="Soverant POC API", lifespan=lifespan)

except Exception as e:
    print("the app is ended with this error: %s", str(e))
    sys.exit(1)


@app.post("/chats/{confidant_id}/create")
async def create_chat(response: Response, confidant_id: str) -> Chat:
    try:
        confidant = confidants_service.get_confidant(confidant_id=confidant_id)
        chat_id = uuid.uuid4()
        chat_obj = await Chats.create(id=chat_id)
        rep_msg = confidant.chat(chat_obj)
        msg_obj = await Messages.create(**rep_msg.model_dump(exclude_unset=True,exclude="chat"),chat=chat_obj)
        response.set_cookie(key=CHAT_COOKIE_KEY, value=str(chat_id))
        data = await Chat.from_queryset_single(Chats.get(id=chat_id))
        log.debug(data)
        return data
    except ValueError as e:
        err = str(e)
        log.error("confidant not found: %s", err)
        raise HTTPException(
            status_code=404,
            detail=err
        )
    except Exception as e:
        err = str(e)
        log.error("create chat failed with error: %s", err)
        raise HTTPException(
            status_code=500,
            detail=err
        )


@app.get("/chats")
async def get_chat(chat_id: Annotated[Union[str, None], Cookie()] = None) -> Chat:
    try:
        log.debug("request chats with confidant: %s  chat_id: %s")
        if chat_id == None:
            raise ValueError("chat id not found")    
        chat = await Chat.from_queryset_single(Chats.get(id=chat_id))
        return chat 
    except ValueError as e:
        err = str(e)
        log.error("inputs are not valid: %s", err)
        raise HTTPException(
            status_code=404,
            detail=err
        )
    except Exception as e:
        err = str(e)
        log.error("sample post error: %s", err)
        raise HTTPException(
            status_code=500,
            detail=err
        )


@app.post("/chats")
async def send(req: MessageIn, chat_id: Annotated[Union[str, None], Cookie()] = None) -> Chat:
    try:
        log.debug("request chats with confidant: %s  chat_id: %s")
        if chat_id == None:
            raise ValueError("chat not found")    
        chat = await Chat.from_queryset_single(Chats.get(id=chat_id))
        return chat 
    except ValueError as e:
        err = str(e)
        log.error("inputs are not valid: %s", err)
        raise HTTPException(
            status_code=404,
            detail=err
        )
    except Exception as e:
        err = str(e)
        log.error("sample post error: %s", err)
        raise HTTPException(
            status_code=500,
            detail=err
        )