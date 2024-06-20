from uuid import uuid4
from models import Chat, Message, SenderTypeEnum


class ConfidantsService:
    confidantes = {}

    def __init__(self):
        self.confidantes["0"] = SoverantNarrator()

    def get_confidant(self, confidant_id: str):
        confidant = self.confidantes.get(confidant_id)
        if confidant == None:
            raise ValueError("confidant not found")
        return confidant


class SoverantNarrator:
    def chat(self, chat: Chat) -> Message:
        print(chat)
        return Message(id=uuid4(),chat=chat, sender_type=SenderTypeEnum.CONFIDANT, sender="fixed",
                       content="Hello world!")
