from fastapi import HTTPException
import logging

from middleware.token import create_access_token
from models import User
from database import SessionLocal
from jose import jwt, JWTError

logger = logging.getLogger(__name__)

def login_user(email: str, password: str):
    logger.info(f"Login attempt: email={email}")

    db = SessionLocal()

    # Fetch user from DB
    user = db.query(User).filter(User.email == email, User.password == password).first()

    if not user:
        logger.warning(f"❌ Invalid credentials for {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "id":user.id,
        "name": user.name,
        "email": user.email,
    }
    logger.info(f"✅ {email} logged in successfully")
