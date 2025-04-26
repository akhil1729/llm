# reset_demographics_table.py

from sqlalchemy import create_engine, MetaData
from database import Base
from models import Demographics
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

# Use DB URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL is missing in your .env file")

# Connect to DB
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Drop existing demographics table if exists
metadata.reflect(bind=engine)
if "demographics" in metadata.tables:
    metadata.tables["demographics"].drop(engine)
    print("✅ Dropped existing demographics table.")

# Recreate with updated schema
Base.metadata.create_all(bind=engine, tables=[Demographics.__table__])
print("✅ Recreated demographics table with updated schema.")
