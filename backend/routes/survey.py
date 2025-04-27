# routes/survey.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SurveySchema

router = APIRouter()

@router.post("/")
def submit_survey(data: SurveySchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    print(f"Survey response from {user.email}:")
    print(f"Satisfaction: {data.satisfaction}")
    print(f"Ease of Use: {data.ease_of_use}")
    print(f"Trustworthiness: {data.trustworthiness}")
    print(f"Comments: {data.comments}")

    # 🚀 TODO: You can also save survey responses in a Survey table if needed.

    return {"message": "✅ Survey submitted successfully"}
