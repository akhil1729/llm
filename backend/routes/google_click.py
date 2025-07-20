# routes/google_click.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from models import User, GoogleClick
from database import get_db
from schemas import GoogleClickRequest

router = APIRouter()

@router.post("/")
def log_google_click(request: GoogleClickRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_click = GoogleClick(
        user_id=user.id,
        task_number=request.task_number,
        timestamp=datetime.utcnow()
    )
    db.add(new_click)
    db.commit()
    return {"message": "Google click logged"}
