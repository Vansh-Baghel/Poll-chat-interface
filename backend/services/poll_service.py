from fastapi import HTTPException

from database import SessionLocal
from models import PollVote, Chat
from models.poll_option import PollOption
from schemas.poll import PollCreate
from sqlalchemy.orm import Session, joinedload
from models.poll import Poll

def create_poll_service(poll_data, current_user_id: int):
    db: Session = SessionLocal()
    try:
        # Create poll
        poll = Poll(user_id=current_user_id, question=poll_data.question)
        db.add(poll)
        db.flush()

        # Add poll options
        for option in poll_data.options:
            db.add(PollOption(poll_id=poll.id, text=option.text))

        # Create linked chat
        chat = Chat(
            type="poll",
            poll_id=poll.id,
            user_id=current_user_id,
        )
        db.add(chat)
        db.commit()

        # Reload with poll + options joined
        chat = (
            db.query(Chat)
            .options(joinedload(Chat.poll).joinedload(Poll.options))
            .filter(Chat.id == chat.id)
            .first()
        )

        return {
            "id": chat.id,
            "name": chat.user.name if chat.user else "",
            "user_id": chat.user_id,
            "message": chat.message or "",
            "likes": chat.likes,
            "created_at": chat.created_at,
            "is_liked": False,
            "poll": {
                "id": chat.poll.id,
                "question": chat.poll.question,
                "options": [
                    {
                        "id": o.id,
                        "text": o.text,
                        "vote_percentage": getattr(o, "vote_percentage", 0)
                    }
                    for o in chat.poll.options
                ],
            } if chat.poll else None,
        }
    finally:
        db.close()

def get_poll_service(poll_id: int):
    db = SessionLocal()
    try:
        poll = (
            db.query(Poll)
            .options(joinedload(Poll.options))
            .filter(Poll.id == poll_id)
            .first()
        )

        if not poll:
            raise HTTPException(status_code=404, detail="Poll not found")

        total_votes = db.query(PollVote).filter(PollVote.poll_id == poll_id).count()

        for option in poll.options:
            count = db.query(PollVote).filter(PollVote.option_id == option.id).count()
            option.vote_percentage = (count / total_votes * 100) if total_votes > 0 else 0

        return poll
    finally:
        db.close()