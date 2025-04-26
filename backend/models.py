# models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chats = relationship("Chat", back_populates="user")
    demographics = relationship("Demographics", back_populates="user", uselist=False)

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    original_response = Column(Text, nullable=True)
    was_hallucinated = Column(Boolean, default=False)
    personality_index = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chats")

class Demographics(Base):
    __tablename__ = "demographics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String)
    last_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    education = Column(String)
    ethnicity = Column(String)
    race = Column(String)
    social_class = Column(String)
    country = Column(String)
    city = Column(String)

    user = relationship("User", back_populates="demographics")

class ModelAssignment(Base):
    __tablename__ = "model_assignment"

    id = Column(Integer, primary_key=True)
    default_count = Column(Integer, default=0)
    benevolent_count = Column(Integer, default=0)
    authoritarian_count = Column(Integer, default=0)
