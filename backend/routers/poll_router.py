from fastapi import APIRouter, Depends

from middleware.token import get_current_user
from schemas.chat import ChatItem
from schemas.poll import PollCreateRequest, PollVoteResponse, VotePollRequest
from services.poll_service import create_poll_service, vote_poll_service

router = APIRouter(tags=["Polls"])

@router.post("/add-poll", response_model=ChatItem)
def create_poll_router(poll_data: PollCreateRequest, current_user=Depends(get_current_user)):
    return create_poll_service(poll_data, current_user.id)

@router.post("/vote-poll", response_model=PollVoteResponse)
def vote_poll_router(request: VotePollRequest, current_user=Depends(get_current_user)):
    return vote_poll_service(request.poll_id, request.option_id, current_user.id)
