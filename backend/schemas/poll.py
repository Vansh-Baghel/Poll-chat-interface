from pydantic import BaseModel
from typing import List, Optional


class PollOptionResponse(BaseModel):
    id: int
    text: str
    vote_percentage: Optional[float]

    class Config:
        orm_mode = True


class PollResponse(BaseModel):
    id: int
    question: str
    options: list[PollOptionResponse]

    class Config:
        orm_mode = True


class PollOptionCreate(BaseModel):
    text: str


class PollCreateRequest(BaseModel):
    question: str
    options: list[PollOptionCreate]

class PollVoteResponse(BaseModel):
    message: str
    action: str
    poll: PollResponse

class VotePollRequest(BaseModel):
    poll_id: int
    option_id: int