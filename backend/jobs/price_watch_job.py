"""
Background job script for Price-Drop Watcher.
Runs periodically to scan wishlist items and trigger alerts.
"""

import os
import sys

# Ensure root directory is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.db import SessionLocal
from backend.services.price_watch_service import check_price_drops


import logging

logger = logging.getLogger("price_watch_job")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


def run_price_watch_job():
    db = SessionLocal()
    try:
        updated = check_price_drops(db)
        logger.info(f"Check completed. {updated} items triggered price-drop alerts.")
    finally:
        db.close()


if __name__ == "__main__":
    run_price_watch_job()
