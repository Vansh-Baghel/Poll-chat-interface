from datetime import datetime
import logging
from fastapi import HTTPException

from database import SessionLocal
from models import Chat, User

logger = logging.getLogger(__name__)

def add_chat(message: str, current_user: User):
    db = SessionLocal()
    user: User = User(id=current_user.id)
    logger.info(f"{user}")
    try:
        # Create a new Chat instance
        new_chat = Chat(user_id=current_user.id, message=message, created_at=datetime.now(), likes=0)
        db.add(new_chat)

        # Add to the session
        db.add(new_chat)

        # Commit to DB
        db.commit()

        # Refresh to get updated fields like id, created_at
        db.refresh(new_chat)

        return {"id": new_chat.id, "user_id":current_user.id, "name": current_user.name, "message": new_chat.message, "likes": new_chat.likes, "created_at": new_chat.created_at}
    finally:
        db.close()

def get_all_chats():
    db = SessionLocal()

    try:
        # Fetch only the required fields
        chats = (
            db.query(
                Chat.id,
                Chat.user_id,
                User.name.label("name"),
                Chat.message,
                Chat.likes,
                Chat.created_at
            )
            .join(User, Chat.user_id == User.id)
            .order_by(Chat.created_at.asc())
            .all()
        )

        # Transform into dicts
        chat_list = [
            {
                "id": c.id,
                "user_id": c.user_id,
                "name": c.name,
                "message": c.message,
                "likes": c.likes,
                "created_at": c.created_at,
            } for c in chats
        ]

        return {"totalMessages": len(chat_list), "messages": chat_list}
    finally:
        db.close()


