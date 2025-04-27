# routes/finalanswer.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import FinalAnswer, User
from database import get_db
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class FinalAnswerRequest(BaseModel):
    email: str
    task_number: int
    final_answer: str

@router.post("/")
def submit_final_answer(data: FinalAnswerRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    answer = FinalAnswer(
        user_id=user.id,
        task_number=data.task_number,
        final_answer=data.final_answer,
        timestamp=datetime.utcnow()
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)

    return {"message": "✅ Final answer saved successfully"}
