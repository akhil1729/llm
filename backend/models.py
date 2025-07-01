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
    task_number = Column(Integer, nullable=False)
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
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    identity1 = Column(Text, nullable=False)  # gender values as comma-separated if multiple
    identity2 = Column(Text, nullable=False)  # race/ethnicity values as comma-separated if multiple
    education = Column(String, nullable=False)
    college_major = Column(String, nullable=False)
    chatbot_usage = Column(String, nullable=False)

    user = relationship("User", back_populates="demographics")


class ModelAssignment(Base):
    __tablename__ = "model_assignment"

    id = Column(Integer, primary_key=True)
    default_count = Column(Integer, default=0)
    benevolent_count = Column(Integer, default=0)
    authoritarian_count = Column(Integer, default=0)

class FinalAnswer(Base):
    __tablename__ = "final_answers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    task_number = Column(Integer, nullable=False)
    final_answer = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class ConsentLog(Base):
    __tablename__ = "consent_log"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    consent_given = Column(Boolean, nullable=False)
    consent_version = Column(String, default="v1")  # You can adjust versioning later
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")

class Survey(Base):
    __tablename__ = "surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    trust_answers = Column(String, nullable=False)
    verify_needed = Column(String, nullable=False)
    comfort_communication = Column(String, nullable=False)
    reuse_chatbot = Column(String, nullable=False)
    comments = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


