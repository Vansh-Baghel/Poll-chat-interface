from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Poll(Base):
    __tablename__ = "polls"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    likes = Column(Integer, default=0)

    creator = relationship("User", back_populates="polls")
    options = relationship("Option", back_populates="poll", cascade="all, delete-orphan")
