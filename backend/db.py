"""
Database connection and session management for SkyB.

Note: Using Base.metadata.create_all (not Alembic) intentionally for this
project's academic/semester scope. Schema changes require dropping and
recreating tables or running seed.py with a fresh database.
"""

import os
from typing import Generator
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./skyb.db")

# Fallback/compatibility configuration:
# If sqlite is used locally, allow multiple threads.
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True if not DATABASE_URL.startswith("sqlite") else False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for injecting database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
