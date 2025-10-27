from fastapi import APIRouter, Depends

from database import SessionLocal
from middleware.token import get_current_user
from schemas.chat import GetChatResponse, ChatItem
from schemas.poll import PollResponse, PollCreate
from services.poll_service import create_poll_service, get_poll_service

router = APIRouter(tags=["Polls"])

@router.post("/add-poll", response_model=ChatItem)
def create_poll(poll_data: PollCreate, current_user=Depends(get_current_user)):
    return create_poll_service(poll_data, current_user.id)


@router.get("/get-poll/{poll_id}", response_model=PollResponse)
def get_poll(poll_id: int):
    return get_poll_service(poll_id)
