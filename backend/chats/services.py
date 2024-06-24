import logging
from uuid import uuid4
import yaml

from pydantic import BaseModel

from .models import Chats, Message, SenderTypeEnum

log = logging.getLogger(__name__)

class ConfidantsService:
    confidantes = {}

    def set_confidant(self, key: str, confidant):
        self.confidantes[key] = confidant

    def get_confidant(self, confidant_id: str):
        confidant = self.confidantes.get(confidant_id)
        if confidant is None:
            raise ValueError("confidant not found")
        return confidant


class NarratorConfidant:
    class ConfidantSpec(BaseModel):
        name: str
        prompt: str

    def __init__(self, client):
        self.client = client
        with open("./confidants/narrator.yaml", 'r') as stream:
            self.spec = self.ConfidantSpec(**yaml.safe_load(stream))

    async def chat(self, chat: Chats) -> Message:
        log.debug(chat)
        msgs = [
            {
                "role": "system",
                "content": self.spec.prompt,
            }
        ]
        for msg in chat.messages:
            role = "user"
            if msg.sender_type is "confidant":
                role = "assistant"
            msgs.append({
                "role": role,
                "content": msg.content
            })
        chat_completion = await self.client.chat.completions.create(
            messages=msgs,
            model="gpt-35-turbo",
        )
        return Message(id=uuid4(), chat=chat, sender_type=SenderTypeEnum.CONFIDANT, sender="fixed",
                       content=chat_completion.choices[0].message.content)
