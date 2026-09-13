"""
Security Utilities for SkyB Backend:
- Password hashing and verification using passlib bcrypt (with standard hashlib PBKDF2 fallback)
- JWT access token generation and configuration
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", os.getenv("JWT_SECRET", "skyb_secret_academic_key_2026_super_secure"))
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password Hashing Setup
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def hash_password(password: str) -> str:
        """Hashes a plaintext password using bcrypt."""
        return pwd_context.hash(password)

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifies a plaintext password against a bcrypt or fallback hash."""
        if hashed_password.startswith("pbkdf2:"):
            # Support PBKDF2 fallback hashes created before bcrypt install
            parts = hashed_password.split(":")
            if len(parts) == 3:
                import hashlib
                salt, key_hex = parts[1], parts[2]
                check_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
                return check_key.hex() == key_hex
        return pwd_context.verify(plain_password, hashed_password)

except ImportError:
    # Standard library fallback (zero third-party dependencies)
    import hashlib
    import secrets

    def hash_password(password: str) -> str:
        """Standard library PBKDF2-SHA256 fallback if passlib is not installed."""
        salt = secrets.token_hex(16)
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return f"pbkdf2:{salt}:{key.hex()}"

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifies standard library PBKDF2-SHA256 hash."""
        if not hashed_password.startswith("pbkdf2:"):
            return False
        parts = hashed_password.split(":")
        if len(parts) != 3:
            return False
        salt, key_hex = parts[1], parts[2]
        check_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return check_key.hex() == key_hex


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Encodes a signed JWT access token with expiration time."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
