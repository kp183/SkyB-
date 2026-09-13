from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.user import User
from backend.dependencies import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    success_response,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new customer account."""
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        role="customer",  # Always customer; admins created via seed.py
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return success_response({
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "token": token,
    })


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Log in with email and password to receive a JWT access token."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return success_response({
        "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
        "token": token,
    })


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve the authenticated user's profile."""
    return success_response({
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    })
