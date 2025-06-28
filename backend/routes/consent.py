from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, ConsentLog
from schemas import ConsentLogSchema

router = APIRouter()

@router.post("/user/consent")
def log_consent(consent: ConsentLogSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == consent.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    consent_record = ConsentLog(
        user_id=user.id,
        consent_given=consent.consent_given,
    )
    db.add(consent_record)
    db.commit()
    return {"message": "Consent logged successfully."}
