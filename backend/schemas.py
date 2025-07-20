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
    task_number: int

class DemographicBase(BaseModel):
    email: str
    name: str
    age: int
    identity1: List[str]
    identity2: List[str]
    education: str
    college_major: str
    chatbot_usage: str


class FinalAnswerSchema(BaseModel):
    email: str
    task1_answer: str
    task2_answer: str
    task3_answer: str

class SurveySchema(BaseModel):
    email: str
    trust_answers: str
    verify_needed: str
    comfort_communication: str
    reuse_chatbot: str
    comments: str = ""


class ConsentLogSchema(BaseModel):
    email: str
    consent_given: bool

class GoogleClickRequest(BaseModel):
    email: str
    task_number: int


