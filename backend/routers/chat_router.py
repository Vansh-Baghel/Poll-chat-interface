from fastapi import APIRouter, Depends, Body
from middleware.token import get_current_user
from schemas.chat import AddChatRequest, AddChatResponse, GetChatResponse, ChatItem
from models import User
from services.chats_service import add_chat, get_all_chats

router = APIRouter(tags=["Chats"])

@router.post("/add-chat", response_model=ChatItem)
def add_chat_router(
    chat: AddChatRequest = Body(...),
    current_user: User = Depends(get_current_user)
):
    return add_chat(message=chat.message, current_user=current_user)

@router.get("/get-all-chats", response_model=GetChatResponse)
def get_all_chats_router():
    return get_all_chats()