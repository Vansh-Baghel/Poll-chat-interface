from datetime import datetime

from pydantic import BaseModel

class ChatItem(BaseModel):
    id: int
    name: str
    user_id: int
    message: str
    likes: int
    created_at: datetime
    is_liked: bool

class GetChatResponse(BaseModel):
    totalMessages: int
    messages: list[ChatItem]

class AddChatResponse(BaseModel):
    message: str
    result: str

class AddChatRequest(BaseModel):
    message: str
    user_id: int

