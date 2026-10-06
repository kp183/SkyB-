import os
import sys
import pytest

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from sqlalchemy import text
from backend.db import engine

@pytest.fixture(scope="session", autouse=True)
def db_connection_info():
    with engine.connect() as conn:
        print(f"\n[DATABASE CONNECTION TEST INFO]")
        print(f"engine.url.drivername: {engine.url.drivername}")
        if "sqlite" in engine.url.drivername:
            ver = conn.execute(text("SELECT sqlite_version();")).scalar()
            print(f"SQLite version: {ver}")
        else:
            ver = conn.execute(text("SELECT version();")).scalar()
            print(f"SELECT version(): {ver}")
    yield
