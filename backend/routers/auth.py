import time
from collections import defaultdict
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from backend.db import get_db
from backend.models.user import User
from backend.schemas.user import UserRegister, UserLogin, UserResponse, AuthResponse
from backend.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from backend.dependencies import (
    get_current_user,
    success_response,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

# Basic in-memory rate limiting per PRODUCTION_CHECKLIST.md (max 10 attempts per minute per IP)
login_attempts = defaultdict(list)


def check_auth_rate_limit(client_ip: str, max_requests: int = 10, window_seconds: int = 60):
    now = time.time()
    attempts = [t for t in login_attempts[client_ip] if now - t < window_seconds]
    if len(attempts) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many authentication requests. Please try again in 1 minute.",
        )
    attempts.append(now)
    login_attempts[client_ip] = attempts


@router.post("/register")
def register(req: UserRegister, request: Request, db: Session = Depends(get_db)):
    """Register a new customer account."""
    client_ip = request.client.host if request.client else "unknown"
    check_auth_rate_limit(client_ip)

    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=hash_password(req.password),
        role="customer",  # Always customer; admins created via seed.py
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return success_response({
        "user": UserResponse.from_orm(user).dict(),
        "token": token,
    })


@router.post("/login")
def login(req: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Log in with email and password to receive a JWT access token."""
    client_ip = request.client.host if request.client else "unknown"
    check_auth_rate_limit(client_ip)

    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return success_response({
        "user": UserResponse.from_orm(user).dict(),
        "token": token,
    })


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve the authenticated user's profile."""
    return success_response(UserResponse.from_orm(current_user).dict())
