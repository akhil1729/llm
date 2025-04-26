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
