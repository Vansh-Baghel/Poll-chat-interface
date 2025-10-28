from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, SessionLocal
from models import *  # imports all models
import uvicorn
from routers import auth_router, chat_router, chat_likes_router, poll_router
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
)

Base.metadata.create_all(bind=engine)

# Create tables
app = FastAPI(title="Polls & Chats API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(chat_router.router)
app.include_router(chat_likes_router.router)
app.include_router(poll_router.router)

# Add dummy users only once
def create_dummy_users():
    db = SessionLocal()
    if db.query(User).count() == 0:
        users = [
            User(name="Alice Johnson", email="alice@example.com", password="alice123"),
            User(name="Bob Smith", email="bob@example.com", password="bob123"),
            User(name="Charlie Brown", email="charlie@example.com", password="charlie123"),
            User(name="Diana Prince", email="diana@example.com", password="diana123"),
        ]
        db.add_all(users)
        db.commit()
    db.close()

create_dummy_users()

@app.get("/")
def root():
    return {"message": "Welcome to Polls & Chats API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
