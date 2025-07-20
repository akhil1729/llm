# routes/utils.py

from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from models import ModelAssignment

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --------------------------
# Password & Token Utilities
# --------------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=1)) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --------------------------
# Step 2: Round-Robin Model Assignment
# --------------------------

def assign_model_round_robin(db: Session) -> int:
    """
    Assign one of the three model personalities (0, 1, 2)
    using round-robin logic to ensure even distribution.
    """
    assignment = db.query(ModelAssignment).first()

    if not assignment:
        raise Exception("ModelAssignment row not found. Please seed the table with initial counts.")

    counts = {
        0: assignment.default_count,
        1: assignment.benevolent_count,
        2: assignment.authoritarian_count
    }

    selected = min(counts, key=counts.get)

    # Increment the count of the selected model
    if selected == 0:
        assignment.default_count += 1
    elif selected == 1:
        assignment.benevolent_count += 1
    elif selected == 2:
        assignment.authoritarian_count += 1

    db.commit()
    return selected

def assign_llm_version_to_user(db: Session) -> int:
    """Assign fixed LLM behavior to user using round-robin from ModelAssignment"""
    assignment = db.query(ModelAssignment).first()
    if not assignment:
        raise Exception("ModelAssignment table not seeded")

    counts = {
        0: assignment.default_count,
        1: assignment.benevolent_count,
        2: assignment.authoritarian_count,
    }
    selected = min(counts, key=counts.get)

    if selected == 0:
        assignment.default_count += 1
    elif selected == 1:
        assignment.benevolent_count += 1
    else:
        assignment.authoritarian_count += 1

    db.commit()
    return selected

