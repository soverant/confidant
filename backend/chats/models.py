from pydantic import BaseModel as PydanticBaseModel
from typing import Optional, Literal
import datetime
from tortoise import Tortoise
from enum import Enum
from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class TimestampMixin:
    created_at = fields.DatetimeField(null=True, auto_now_add=True)
    modified_at = fields.DatetimeField(null=True, auto_now=True)

class SenderTypeEnum(str, Enum):
    USER = 'user'
    CONFIDANT = 'confidant'
    SYSTEM = 'system'


class TortoiseAbstractBaseModel(models.Model):
    id = fields.UUIDField(primary_key=True)

    class Meta:
        abstract = True


class Chats(TortoiseAbstractBaseModel, TimestampMixin):
    messages = fields.ReverseRelation["Messages"]


class Messages(TortoiseAbstractBaseModel, TimestampMixin):
    content = fields.data.TextField()
    chat: fields.ForeignKeyRelation[Chats] = fields.ForeignKeyField(
        "models.Chats", related_name="messages", to_field="id"
    )
    sender_type = fields.CharEnumField(SenderTypeEnum)
    sender = fields.CharField(max_length=50)


class SuccessDTO(PydanticBaseModel):
    msg: Optional[str]


Tortoise.init_models(["chats.models"], "models")
Chat = pydantic_model_creator(Chats, name="Chat")
Message = pydantic_model_creator(Messages, name="Message")
MessageIn = pydantic_model_creator(Messages, name="Message", exclude=["chat"])

