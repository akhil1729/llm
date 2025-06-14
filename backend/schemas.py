from pydantic import BaseModel
from typing import List

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    email: str

class DemographicBase(BaseModel):
    email: str
    name: str
    age: int
    identity: List[str]  # 👈 combined field (gender + race/ethnicity)
    education: str
    college_major: str
    chatbot_usage: str
    consent1: bool

class FinalAnswerSchema(BaseModel):
    email: str
    task1_answer: str
    task2_answer: str
    task3_answer: str

class SurveySchema(BaseModel):
    email: str
    satisfaction: int
    ease_of_use: int
    trustworthiness: int
    comments: str = ""
