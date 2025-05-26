# schemas.py

from pydantic import BaseModel

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
    first_name: str
    last_name: str
    age: int
    gender: str
    education: str
    ethnicity: str
    race: str
    social_class: str
    country: str
    city: str
    consent1: bool
    consent2: bool
    
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