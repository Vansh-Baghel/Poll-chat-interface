from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.poll import PollResponse

class ChatItem(BaseModel):
    id: int
    name: str
    user_id: int
    message: Optional[str] = None
    likes: int
    created_at: datetime
    is_liked: bool
    poll: Optional[PollResponse] = None

class GetChatResponse(BaseModel):
    totalMessages: int
    messages: list[ChatItem]

class AddChatResponse(BaseModel):
    message: str
    result: str

class AddChatRequest(BaseModel):
    message: str
    user_id: int

