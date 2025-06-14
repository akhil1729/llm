# routes/demographics.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, Demographics
from schemas import DemographicBase
from database import get_db

router = APIRouter()

@router.post("/")
def submit_demographics(data: DemographicBase, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if db.query(Demographics).filter(Demographics.user_id == user.id).first():
        raise HTTPException(status_code=400, detail="Demographic info already submitted")

    demographic = Demographics(
        user_id=user.id,
        name=data.name,
        age=data.age,
        identity=",".join(data.identity),  # 👈 saving gender+ethnicity combined
        education=data.education,
        college_major=data.college_major,
        chatbot_usage=data.chatbot_usage,
        consent1=data.consent1
    )
    db.add(demographic)
    db.commit()
    db.refresh(demographic)
    return {"message": "Demographic information saved successfully"}

@router.get("/{email}")
def get_demographics(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    demographic = db.query(Demographics).filter(Demographics.user_id == user.id).first()
    if not demographic:
        raise HTTPException(status_code=404, detail="Demographics not filled")
    
    return demographic
