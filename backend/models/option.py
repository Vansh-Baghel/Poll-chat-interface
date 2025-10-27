from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String(255), nullable=False)
    votes = Column(Integer, default=0)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)

    poll = relationship("Poll", back_populates="options")
