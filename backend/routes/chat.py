from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Chat, User
from schemas import ChatRequest
from datetime import datetime
from routes.llm_handler import generate_response  # LLM with personality + hallucination
from routes.utils import assign_model_round_robin
import random

router = APIRouter()

@router.get("/{email}")
def get_chat_history(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chats = db.query(Chat).filter(Chat.user_id == user.id).all()
    return chats

def flip_coin(probability: float = 0.5) -> bool:
    """Returns True with given probability (e.g., 0.5 for 50%)."""
    return random.random() < probability

@router.post("/")
def chat_and_save(request: ChatRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Optional: enforce per-user daily/total limits
    query_count = db.query(Chat).filter(Chat.user_id == user.id).count()
    if query_count >= 100:
        raise HTTPException(status_code=403, detail="❌ You have exceeded the 100-query limit.")

    # Personality is fixed per user (your existing logic)
    personality_index = user.llm_version

    # If you actually use this coin flip elsewhere, keep it; otherwise remove
    hallucinate = flip_coin(probability=0.5)  # currently unused here

    # ---- NEW: pass a session_id so history is per-user (or per-user:task) ----
    # Option A (per user):
    session_id = str(user.id)
    # Option B (per user & task):
    # session_id = f"{user.id}:{request.task_number}"

    response_data = generate_response(
        query=request.message,
        personality_index=personality_index,
        session_id=session_id,
    )

    new_chat = Chat(
        user_id=user.id,
        message=request.message,
        response=response_data["response"],
        original_response=response_data["original_response"],
        was_hallucinated=response_data["was_hallucinated"],
        personality_index=personality_index,
        task_number=request.task_number,
        timestamp=datetime.utcnow()
    )
    db.add(new_chat)
    db.commit()

    return {"response": response_data["response"]}
