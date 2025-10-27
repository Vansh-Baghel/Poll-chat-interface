from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

    # Relationships
    polls = relationship("Poll", back_populates="creator")
    chats = relationship("Chat", back_populates="user")
