from pydantic import BaseModel
from typing import List, Optional

class PollOptionCreate(BaseModel):
    text: str

class PollCreate(BaseModel):
    question: str
    options: List[PollOptionCreate]

class PollOptionResponse(BaseModel):
    id: int
    text: str
    vote_percentage: Optional[float] = None

    class Config:
        orm_mode = True

class PollResponse(BaseModel):
    id: int
    question: str
    options: List[PollOptionResponse]

    class Config:
        orm_mode = True

