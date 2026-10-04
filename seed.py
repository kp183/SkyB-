"""
SkyB Root Seeding Entrypoint.
Delegates to backend.seed.seed_database() to populate tables, admin account,
categories, sample products, deterministic catalog (412 total products),
demo reviews, and coupons idempotently.
"""

import os
import sys

# Ensure root workspace directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.seed import seed_database

if __name__ == "__main__":
    seed_database()
