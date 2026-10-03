import os
from datetime import datetime, timedelta
from typing import Optional, Any, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from backend.db import get_db
from backend.models.user import User
from backend.security import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    hash_password,
    verify_password,
    create_access_token,
)

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def success_response(data: Any = None, meta: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Uniform JSON success envelope: { "data": ..., "error": null } with optional meta."""
    res: Dict[str, Any] = {"data": data, "error": None}
    if meta is not None:
        res["meta"] = meta
    return res


def error_response(message: str) -> Dict[str, Any]:
    """Uniform JSON error envelope: { "data": null, "error": ... }"""
    return {"data": None, "error": message}


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Extracts and verifies current authenticated user from Bearer token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or missing token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


def require_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Shared role-check dependency for admin-only endpoints.
    Used across /admin/*, /products (POST/PUT/DELETE), and /coupons.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required for this operation",
        )
    return current_user
