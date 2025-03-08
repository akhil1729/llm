from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ChatHistory, User
from schemas import ChatMessage
from schemas import ChatRequest
from datetime import datetime
import openai

router = APIRouter()

@router.post("/chat")
def save_chat(chat: ChatMessage, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == chat.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_chat = ChatHistory(
        user_id=user.id,
        message=chat.message,
        response=chat.response,
        timestamp=datetime.utcnow()
    )

    db.add(new_chat)
    db.commit()
    return {"message": "Chat saved successfully"}

@router.get("/chat/{email}")
def get_chat_history(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chats = db.query(ChatHistory).filter(ChatHistory.user_id == user.id).all()
    return chats


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}]
        )
        return {"response": response["choices"][0]["message"]["content"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
