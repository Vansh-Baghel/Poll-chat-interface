from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from models import User

from database import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "vansh-my-super-secret-key"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=1)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        db = SessionLocal()
        user = db.query(User).get(int(user_id))
        db.close()
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
