import logging
import uuid
from fastapi import APIRouter, HTTPException, Response, Cookie
from typing import Union
from typing_extensions import Annotated
from .models import *
from .services import ConfidantsService

log = logging.getLogger(__name__)

CHAT_COOKIE_KEY = "chat_id"
router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

confidants_service = ConfidantsService()


@router.get("/create/{confidant_id}")
async def create_chat(response: Response, confidant_id: str) -> Chat:
    try:
        confidant = confidants_service.get_confidant(confidant_id=confidant_id)
        chat_id = uuid.uuid4()
        chat_obj = await Chats.create(id=chat_id, confidant_id=confidant_id)
        rep_msg = confidant.chat(chat_obj)
        msg_obj = await Messages.create(**rep_msg.model_dump(exclude_unset=True, exclude="chat"), chat=chat_obj)
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


@router.get("/{chat_id}")
async def get_chat(chat_id: str) -> Chat:
    try:
        log.debug("request chats with confidant: %s  chat_id: %s")
        if chat_id is None:
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


@router.post("/")
async def send(req: MessageIn) -> Chat:
    log.debug("request chats with confidant: %s  chat_id: %s")
    chat_obj = await Chats.get(id=req.chat_id)
    await Messages.create(**req.model_dump(exclude_unset=True), chat=chat_obj, id=uuid.uuid4())
    if chat_obj is None:
        log.error("chat not found")
        raise HTTPException(
            status_code=404,
            detail="chat not found"
        )
    log.debug("confidant %d", chat_obj.confidant_id)
    confidant = confidants_service.get_confidant(confidant_id=str(chat_obj.confidant_id))
    rep_msg = confidant.chat(chat_obj)
    await Messages.create(**rep_msg.model_dump(exclude_unset=True, exclude=["chat"]), chat=chat_obj)
    data = await Chat.from_queryset_single(Chats.get(id=req.chat_id))
    return data
