from pydantic import BaseModel
from typing import Optional


class SampleDTO(BaseModel):
    msg: Optional[str]
