from fastapi import Depends, APIRouter

from middleware.token import get_current_user
from models import User
from services.chat_likes_service import toggle_like

router = APIRouter(tags=["ChatLikes"])

@router.get("/like-chat/{chat_id}")
def toggle_like_chat_router(chat_id: int, current_user: User = Depends(get_current_user)):
    return toggle_like(chat_id, current_user)

