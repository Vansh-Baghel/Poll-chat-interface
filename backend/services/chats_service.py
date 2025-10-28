from datetime import datetime
import logging
from fastapi import HTTPException
from sqlalchemy import func, exists, and_
from sqlalchemy.orm import joinedload

from database import SessionLocal
from models import Chat, User, ChatLikes, Poll

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

        return {"id": new_chat.id, "user_id":current_user.id, "type": new_chat.type, "name": current_user.name, "message": new_chat.message, "likes": new_chat.likes, "created_at": new_chat.created_at, "is_liked": False}
    finally:
        db.close()

def get_all_chats(current_user: User | None):
    db = SessionLocal()
    try:
        # Base query with joins for user, poll, and poll options
        base_query = (
            db.query(
                Chat.id,
                Chat.user_id,
                User.name.label("name"),
                Chat.message,
                Chat.type,
                Chat.poll_id,
                func.count(ChatLikes.id).label("likes_count"),
                Chat.created_at,
            )
            .join(User, Chat.user_id == User.id)
            .outerjoin(ChatLikes, ChatLikes.chat_id == Chat.id)
            .group_by(Chat.id, User.name)
            .order_by(Chat.created_at.asc())
        )

        if current_user:
            # Add EXISTS subquery to check if current user has liked chat or not
            liked_subquery = (
                db.query(ChatLikes.id)
                .filter(
                    and_(
                        ChatLikes.chat_id == Chat.id,
                        ChatLikes.user_id == current_user.id,
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
                    Chat.type,
                    Chat.poll_id,
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
        else:
            # If no user logged in, skip is_liked check
            chats = base_query.all()

        # Fetch all polls and their options in one go
        poll_ids = [c.poll_id for c in chats if c.poll_id]
        polls_map = {}
        if poll_ids:
            polls = (
                db.query(Poll)
                .options(joinedload(Poll.options))
                .filter(Poll.id.in_(poll_ids))
                .all()
            )
            for poll in polls:
                polls_map[poll.id] = {
                    "id": poll.id,
                    "question": poll.question,
                    "options": [{"id": o.id, "text": o.text, "vote_percentage": 0} for o in poll.options],
                }

        # Final chat list mapping
        chat_list = []
        for c in chats:
            chat_item = {
                "id": c.id,
                "user_id": c.user_id,
                "name": c.name,
                "message": c.message,
                "type": c.type,
                "likes": c.likes_count,
                "is_liked": getattr(c, "is_liked", False),
                "created_at": c.created_at,
                "poll": polls_map.get(c.poll_id) if c.poll_id else None,
            }
            chat_list.append(chat_item)

        return {"totalMessages": len(chat_list), "messages": chat_list}
    finally:
        db.close()


def delete_chat(user_id: int, chat_id: int, current_user: User):
    db = SessionLocal()

    try:
        chat = (
            db.query(Chat)
            .filter(Chat.user_id == user_id)
            .filter(Chat.id == chat_id)
            .first()
        )

        if not chat:
            raise HTTPException(
                status_code=404,
                detail="Chat not found"
            )

        if chat.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to delete this chat"
            )

        db.delete(chat)
        db.commit()

        return {"id": chat.id, "message": "Chat deleted successfully"}

    finally:
        db.close()