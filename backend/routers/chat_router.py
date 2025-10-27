from typing import Optional

from fastapi import APIRouter, Depends, Body, Header
from middleware.token import get_current_user
from schemas.chat import AddChatRequest, GetChatResponse, ChatItem
from services.chats_service import add_chat, get_all_chats
from jose import jwt
from jose.exceptions import JWTError
from database import SessionLocal
from models import User

router = APIRouter(tags=["Chats"])

@router.post("/add-chat", response_model=ChatItem)
def add_chat_router(
    chat: AddChatRequest = Body(...),
    current_user: User = Depends(get_current_user)
):
    return add_chat(message=chat.message, current_user=current_user)

@router.get("/get-all-chats", response_model=GetChatResponse)
def get_all_chats_route(authorization: Optional[str] = Header(None)):
    current_user = None

    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        try:
            # decode token safely using same logic as get_current_user
            SECRET_KEY = "vansh-my-super-secret-key"
            ALGORITHM = "HS256"

            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                db = SessionLocal()
                current_user = db.query(User).get(int(user_id))
                db.close()
        except JWTError:
            pass

    # pass current_user (or None if not authenticated)
    return get_all_chats(current_user)
