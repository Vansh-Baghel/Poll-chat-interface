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


class PollCreate(BaseModel):
    question: str
    options: list[PollOptionCreate]
