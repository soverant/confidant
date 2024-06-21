from uuid import uuid4
from models.chat import Chat, Message, SenderTypeEnum


class ConfidantsService:
    confidantes = {}

    def __init__(self):
        self.confidantes["0"] = NarratorConfidant()

    def get_confidant(self, confidant_id: str):
        confidant = self.confidantes.get(confidant_id)
        if confidant == None:
            raise ValueError("confidant not found")
        return confidant


class NarratorConfidant:
    def chat(self, chat: Chat) -> Message:
        print(chat)
        return Message(id=uuid4(),chat=chat, sender_type=SenderTypeEnum.CONFIDANT, sender="fixed",
                       content="Hello world!")


# class ChatService:
#     def create_chat(self, confidant: NarratorConfidant)->Chat:
#         chat_id = uuid.uuid4()
#         chat_obj = await Chats.create(id=chat_id)
#         rep_msg = confidant.chat(chat_obj)
#         msg_obj = await Messages.create(**rep_msg.model_dump(exclude_unset=True,exclude="chat"),chat=chat_obj)
#         response.set_cookie(key=CHAT_COOKIE_KEY, value=str(chat_id))
#         data = await Chat.from_queryset_single(Chats.get(id=chat_id))
#         return chat

