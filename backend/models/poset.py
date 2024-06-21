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

Tortoise.init_models(["models.poset","models.chat"], "models")

Node = pydantic_model_creator(NodeModel, name="Node")
NodeIn = pydantic_model_creator(NodeModel, name="NodeIn",
                                exclude=("id", "in_edges", "out_edges"),
                                exclude_readonly=True)
EdgeIn = pydantic_model_creator(EdgeModel, name="Edge", exclude=("id",), exclude_readonly=True)

