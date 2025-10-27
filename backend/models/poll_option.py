from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class PollOption(Base):
    __tablename__ = "poll_options"

    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id", ondelete="CASCADE"), nullable=False)
    text = Column(String, nullable=False)

    poll = relationship("Poll", back_populates="options")
    votes = relationship("PollVote", back_populates="option", cascade="all, delete-orphan")
