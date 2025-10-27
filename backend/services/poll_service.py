from fastapi import HTTPException

from database import SessionLocal
from models import PollVote, Chat
from models.poll_option import PollOption
from schemas.poll import PollCreate
from sqlalchemy.orm import Session, joinedload
from models.poll import Poll


def create_poll_service(poll_data: PollCreate, current_user_id: int):
    db: Session = SessionLocal()
    try:
        poll = Poll(user_id=current_user_id, question=poll_data.question)
        db.add(poll)
        db.flush()  # ensures poll.id is available

        for option in poll_data.options:
            db.add(PollOption(poll_id=poll.id, text=option.text))

        db.commit()

        # ✅ Reload the poll with options eagerly loaded
        db.refresh(poll)
        poll = (
            db.query(Poll)
            .options(joinedload(Poll.options))
            .filter(Poll.id == poll.id)
            .first()
        )

        return poll
    finally:
        db.close()

def get_poll_service(poll_id: int):
    db = SessionLocal()

    poll = db.query(Poll).filter(Poll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")

    total_votes = db.query(PollVote).filter(PollVote.poll_id == poll_id).count()
    options = []
    for option in poll.options:
        count = db.query(PollVote).filter(PollVote.option_id == option.id).count()
        percentage = (count / total_votes * 100) if total_votes > 0 else 0
        options.append({"id": option.id, "text": option.text, "vote_percentage": round(percentage, 2)})

    return {"id": poll.id, "question": poll.question, "options": options}
