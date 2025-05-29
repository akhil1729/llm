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
    gender: str
    education: str
    race_ethnicity: List[str]
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
