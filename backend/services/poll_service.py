from datetime import datetime

from fastapi import HTTPException

from database import SessionLocal
from models import PollVote, Chat
from models.poll_option import PollOption
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
            created_at=datetime.now(),
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
            "type": chat.type,
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

def vote_poll_service(poll_id: int, option_id: int, user_id: int):
    db: Session = SessionLocal()

    try:
        # Validate poll
        poll = db.query(Poll).filter(Poll.id == poll_id).first()
        if not poll:
            raise HTTPException(status_code=404, detail="Poll not found")

        # Validate option belongs to poll
        option = (
            db.query(PollOption)
            .filter(PollOption.id == option_id, PollOption.poll_id == poll_id)
            .first()
        )
        if not option:
            raise HTTPException(status_code=400, detail="Invalid option for this poll")

        # Check if user already voted
        existing_vote = (
            db.query(PollVote)
            .filter(PollVote.poll_id == poll_id, PollVote.user_id == user_id)
            .first()
        )

        if existing_vote:
            if existing_vote.option_id == option_id:
                # Toggle vote (remove if same option clicked again)
                db.delete(existing_vote)
                db.commit()
                action = "removed"
            else:
                # Move vote to another option
                existing_vote.option_id = option_id
                db.commit()
                action = "moved"
        else:
            # Add new vote
            new_vote = PollVote(poll_id=poll_id, option_id=option_id, user_id=user_id)
            db.add(new_vote)
            db.commit()
            action = "added"

        # Recalculate vote percentages
        total_votes = (
            db.query(PollVote)
            .filter(PollVote.poll_id == poll_id)
            .count()
        )

        options = db.query(PollOption).filter(PollOption.poll_id == poll_id).all()

        for opt in options:
            vote_count = (
                db.query(PollVote)
                .filter(PollVote.poll_id == poll_id, PollVote.option_id == opt.id)
                .count()
            )
            opt.vote_percentage = (
                (vote_count / total_votes) * 100 if total_votes > 0 else 0
            )

        db.commit()

        # Prepare response
        poll_response = {
            "id": poll.id,
            "question": poll.question,
            "options": [
                {"id": opt.id, "text": opt.text, "vote_percentage": opt.vote_percentage}
                for opt in options
            ],
        }

        return {
            "message": f"Vote {action} successfully",
            "action": action,
            "poll": poll_response,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()
