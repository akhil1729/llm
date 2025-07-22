from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, user, chat, demographics, finalanswer, survey, consent, google_click
from database import engine, Base, SessionLocal
from models import ModelAssignment
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ✅ Seed ModelAssignment table if empty
def seed_model_assignment():
    db: Session = SessionLocal()
    if not db.query(ModelAssignment).first():
        initial_counts = ModelAssignment(default_count=0, benevolent_count=0, authoritarian_count=0)
        db.add(initial_counts)
        db.commit()
        print("✅ Seeded initial model assignment row")
    db.close()

seed_model_assignment()

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/user", tags=["user"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(demographics.router, prefix="/user/demographics", tags=["demographics"])
app.include_router(finalanswer.router, prefix="/finalanswer", tags=["finalanswer"])
app.include_router(survey.router, prefix="/survey", tags=["survey"])
app.include_router(consent.router)
app.include_router(google_click.router, prefix="/google-click", tags=["Google Click"])

@app.get("/")
def root():
    return {"message": "FastAPI is running with CORS enabled!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=10000, reload=True)

