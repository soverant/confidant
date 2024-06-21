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


class NodeModel(models.Model, TimestampMixin):
    id = fields.UUIDField(primary_key=True)
    spec = fields.data.TextField()
    prompt = fields.data.TextField()
    response = fields.data.TextField()

    in_edges = fields.ReverseRelation["EdgeModel"]
    out_edges = fields.ReverseRelation["EdgeModel"]

    async def children_ids(self):
        return await self.out_edges.all().values_list('tail', flat=True)

    async def parents_ids(self):
        return await self.in_edges.all().values_list('head', flat=True)

    class PydanticMeta:
        computed = ["parents_ids", "children_ids"]


class EdgeModel(models.Model, TimestampMixin):
    id = fields.UUIDField(primary_key=True)
    head: fields.ForeignKeyRelation[NodeModel] = fields.ForeignKeyField(
        "models.NodeModel", related_name="out_edges", to_field="id"
    )
    tail: fields.ForeignKeyRelation[NodeModel] = fields.ForeignKeyField(
        "models.NodeModel", related_name="in_edges", to_field="id"
    )


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


Tortoise.init_models(["models"], "models")
Chat = pydantic_model_creator(Chats, name="Chat")
Message = pydantic_model_creator(Messages, name="Message")
MessageIn = pydantic_model_creator(Messages, name="Message", exclude=["chat"])

Node = pydantic_model_creator(NodeModel, name="Node")
NodeIn = pydantic_model_creator(NodeModel, name="NodeIn",
                                exclude=("id", "in_edges", "out_edges"),
                                exclude_readonly=True)
EdgeIn = pydantic_model_creator(EdgeModel, name="Edge", exclude=("id",), exclude_readonly=True)

