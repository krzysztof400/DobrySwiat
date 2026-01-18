from __future__ import annotations

from decimal import Decimal

from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
	return pwd_context.hash(password)


def get_user_by_email(db: Session, email: str) -> models.User | None:
	return db.scalar(select(models.User).where(models.User.email == email))


def get_user(db: Session, user_id: int) -> models.User | None:
	return db.get(models.User, user_id)


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
	db_user = models.User(
		email=user.email,
		hashed_password=hash_password(user.password),
		role=user.role,
	)
	db.add(db_user)
	db.commit()
	db.refresh(db_user)
	return db_user


def list_categories(db: Session) -> list[models.Category]:
	return list(db.scalars(select(models.Category).order_by(models.Category.name)))


def create_category(db: Session, category: schemas.CategoryCreate) -> models.Category:
	db_category = models.Category(name=category.name)
	db.add(db_category)
	db.commit()
	db.refresh(db_category)
	return db_category


def list_products(db: Session, category_id: int | None = None) -> list[models.Product]:
	stmt = select(models.Product)
	if category_id is not None:
		stmt = stmt.where(models.Product.category_id == category_id)
	return list(db.scalars(stmt.order_by(models.Product.name)))


def get_product(db: Session, product_id: int) -> models.Product | None:
	return db.get(models.Product, product_id)


def create_product(db: Session, product: schemas.ProductCreate) -> models.Product:
	db_product = models.Product(
		name=product.name,
		price=product.price,
		stock_quantity=product.stock_quantity,
		category_id=product.category_id,
	)
	db.add(db_product)
	db.commit()
	db.refresh(db_product)
	return db_product


def create_order(db: Session, order: schemas.OrderCreate) -> models.Order:
	db_user = get_user(db, order.user_id)
	if not db_user:
		raise ValueError("User not found")

	db_order = models.Order(user_id=order.user_id, status=order.status)
	db.add(db_order)

	for item in order.items:
		product = get_product(db, item.product_id)
		if not product:
			raise ValueError(f"Product {item.product_id} not found")
		if product.stock_quantity < item.quantity:
			raise ValueError(f"Insufficient stock for product {product.id}")
		db_item = models.OrderItem(
			order=db_order,
			product_id=product.id,
			quantity=item.quantity,
			price_at_purchase=Decimal(product.price),
		)
		db.add(db_item)

	db.commit()
	db.refresh(db_order)
	return db_order


def list_orders(db: Session, user_id: int | None = None) -> list[models.Order]:
	stmt = select(models.Order)
	if user_id is not None:
		stmt = stmt.where(models.Order.user_id == user_id)
	return list(db.scalars(stmt.order_by(models.Order.created_at.desc())))


def get_order(db: Session, order_id: int) -> models.Order | None:
	return db.get(models.Order, order_id)


def create_review(db: Session, review: schemas.ReviewCreate) -> models.Review:
	if not get_user(db, review.user_id):
		raise ValueError("User not found")
	if not get_product(db, review.product_id):
		raise ValueError("Product not found")

	db_review = models.Review(
		product_id=review.product_id,
		user_id=review.user_id,
		rating=review.rating,
	)
	db.add(db_review)
	db.commit()
	db.refresh(db_review)
	return db_review


def list_reviews(db: Session, product_id: int | None = None) -> list[models.Review]:
	stmt = select(models.Review)
	if product_id is not None:
		stmt = stmt.where(models.Review.product_id == product_id)
	return list(db.scalars(stmt.order_by(models.Review.id.desc())))
