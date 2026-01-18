from __future__ import annotations

import os
import sys
from decimal import Decimal
from pathlib import Path

from sqlalchemy import select

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from app import models
from app.database import Base, SessionLocal, engine

DEFAULT_USERS = [
    {
        "email": "admin@dobryswiat.pl",
        "password": "admin123",
        "role": models.UserRole.admin,
    },
    {
        "email": "client@dobryswiat.pl",
        "password": "client123",
        "role": models.UserRole.client,
    },
]

DEFAULT_CATEGORIES = ["Książki", "Ikony", "Świece"]

DEFAULT_PRODUCTS = [
    {"name": "Modlitewnik", "price": Decimal("29.90"), "stock": 15, "category": "Książki"},
    {"name": "Ikona św. Michała", "price": Decimal("129.00"), "stock": 5, "category": "Ikony"},
    {"name": "Świeca woskowa", "price": Decimal("14.50"), "stock": 40, "category": "Świece"},
]


def ensure_tables() -> None:
    Base.metadata.create_all(bind=engine)


def seed_users(db) -> dict[str, models.User]:
    from app import crud, schemas

    users: dict[str, models.User] = {}
    for user in DEFAULT_USERS:
        existing = db.scalar(select(models.User).where(models.User.email == user["email"]))
        if existing:
            users[user["email"]] = existing
            continue
        payload = schemas.UserCreate(
            email=user["email"],
            password=user["password"],
            role=user["role"],
        )
        users[user["email"]] = crud.create_user(db, payload)
    return users


def seed_categories(db) -> dict[str, models.Category]:
    categories: dict[str, models.Category] = {}
    for name in DEFAULT_CATEGORIES:
        existing = db.scalar(select(models.Category).where(models.Category.name == name))
        if existing:
            categories[name] = existing
            continue
        category = models.Category(name=name)
        db.add(category)
        db.commit()
        db.refresh(category)
        categories[name] = category
    return categories


def seed_products(db, categories: dict[str, models.Category]) -> None:
    for product in DEFAULT_PRODUCTS:
        existing = db.scalar(select(models.Product).where(models.Product.name == product["name"]))
        if existing:
            continue
        db_product = models.Product(
            name=product["name"],
            price=product["price"],
            stock_quantity=product["stock"],
            category_id=categories[product["category"]].id,
        )
        db.add(db_product)
    db.commit()


def main() -> None:
    if not os.getenv("DATABASE_URL"):
        os.environ["DATABASE_URL"] = "sqlite:///./dev.db"
    ensure_tables()
    with SessionLocal() as db:
        categories = seed_categories(db)
        seed_users(db)
        seed_products(db, categories)
    print("Seed data inserted.")


if __name__ == "__main__":
    main()
