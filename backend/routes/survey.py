# routes/survey.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Survey
from schemas import SurveySchema

router = APIRouter()

@router.post("/")
def submit_survey(data: SurveySchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    new_survey = Survey(
        user_id=user.id,
        trust_answers=data.trust_answers,
        verify_needed=data.verify_needed,
        comfort_communication=data.comfort_communication,
        reuse_chatbot=data.reuse_chatbot,
        comments=data.comments
    )
    db.add(new_survey)
    db.commit()

    return {"message": "Exit survey submitted successfully"}

