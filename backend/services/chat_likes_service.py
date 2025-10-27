from database import SessionLocal
from models import ChatLikes, Chat, User

def toggle_like(chat_id: int, current_user: User):
    db = SessionLocal()
    try:
        existing_like = (
            db.query(ChatLikes)
            .filter(ChatLikes.chat_id == chat_id, ChatLikes.user_id == current_user.id)
            .first()
        )

        if existing_like:
            # Unlike
            db.delete(existing_like)
            db.commit()
            liked = False
        else:
            # Like
            new_like = ChatLikes(chat_id=chat_id, user_id=current_user.id)
            db.add(new_like)
            db.commit()
            liked = True

        # Return new like count
        likes_count = db.query(ChatLikes).filter(ChatLikes.chat_id == chat_id).count()

        return {"chat_id": chat_id, "liked": liked, "likes_count": likes_count}
    finally:
        db.close()