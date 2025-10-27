from datetime import datetime
import logging
from fastapi import HTTPException
from sqlalchemy import func, exists, and_
from database import SessionLocal
from models import Chat, User, ChatLikes

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

        return {"id": new_chat.id, "user_id":current_user.id, "name": current_user.name, "message": new_chat.message, "likes": new_chat.likes, "created_at": new_chat.created_at, "is_liked": False}
    finally:
        db.close()

def get_all_chats(current_user: User | None):
    db = SessionLocal()

    try:
        # Default query
        base_query = (
            db.query(
                Chat.id,
                Chat.user_id,
                User.name.label("name"),
                Chat.message,
                func.count(ChatLikes.id).label("likes_count"),
                Chat.created_at
            )
            .join(User, Chat.user_id == User.id)
            .outerjoin(ChatLikes, ChatLikes.chat_id == Chat.id)
            .group_by(Chat.id, User.name)
            .order_by(Chat.created_at.asc())
        )

        chats = base_query.all()

        if not current_user:
            chat_list = [
                {
                    "id": c.id,
                    "user_id": c.user_id,
                    "name": c.name,
                    "message": c.message,
                    "likes": c.likes_count,
                    "is_liked": False,  # always false when user not logged in
                    "created_at": c.created_at,
                }
                for c in chats
            ]
        else:
            # When user logged in, only then run EXISTS subquery
            liked_subquery = (
                db.query(ChatLikes.id)
                .filter(
                    and_(
                        ChatLikes.chat_id == Chat.id,
                        ChatLikes.user_id == current_user.id
                    )
                )
                .correlate(Chat)
                .exists()
            )

            chats = (
                db.query(
                    Chat.id,
                    Chat.user_id,
                    User.name.label("name"),
                    Chat.message,
                    func.count(ChatLikes.id).label("likes_count"),
                    liked_subquery.label("is_liked"),
                    Chat.created_at,
                )
                .join(User, Chat.user_id == User.id)
                .outerjoin(ChatLikes, ChatLikes.chat_id == Chat.id)
                .group_by(Chat.id, User.name)
                .order_by(Chat.created_at.asc())
                .all()
            )

            chat_list = [
                {
                    "id": c.id,
                    "user_id": c.user_id,
                    "name": c.name,
                    "message": c.message,
                    "likes": c.likes_count,
                    "is_liked": c.is_liked,
                    "created_at": c.created_at,
                }
                for c in chats
            ]

        return {"totalMessages": len(chat_list), "messages": chat_list}
    finally:
        db.close()


