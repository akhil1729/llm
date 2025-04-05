from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Chat, User
from schemas import ChatRequest
from datetime import datetime
from routes.llm_handler import get_llm_response

router = APIRouter()

@router.get("/{email}")
def get_chat_history(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chats = db.query(Chat).filter(Chat.user_id == user.id).all()
    return chats

@router.post("/")
def chat_and_save(request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get LLM (Gemini) response
    response = get_llm_response(request.message)

    # Save to database
    new_chat = Chat(
        user_id=user.id,
        message=request.message,
        response=response,
        timestamp=datetime.utcnow()
    )
    db.add(new_chat)
    db.commit()

    return {"response": response}
