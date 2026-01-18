from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserRole(str, Enum):
	client = "client"
	admin = "admin"


class User(Base):
	__tablename__ = "users"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
	hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
	role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.client, nullable=False)

	orders: Mapped[list["Order"]] = relationship(
		"Order", back_populates="user", cascade="all, delete-orphan"
	)
	reviews: Mapped[list["Review"]] = relationship(
		"Review", back_populates="user", cascade="all, delete-orphan"
	)


class Category(Base):
	__tablename__ = "categories"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

	products: Mapped[list["Product"]] = relationship(
		"Product", back_populates="category", cascade="all, delete-orphan"
	)


class Product(Base):
	__tablename__ = "products"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	name: Mapped[str] = mapped_column(String(255), nullable=False)
	price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
	stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
	category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)

	category: Mapped[Category] = relationship("Category", back_populates="products")
	order_items: Mapped[list["OrderItem"]] = relationship(
		"OrderItem", back_populates="product", cascade="all, delete-orphan"
	)
	reviews: Mapped[list["Review"]] = relationship(
		"Review", back_populates="product", cascade="all, delete-orphan"
	)


class Order(Base):
	__tablename__ = "orders"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
	status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)
	created_at: Mapped[datetime] = mapped_column(
		DateTime(timezone=True), server_default=func.now(), nullable=False
	)

	user: Mapped[User] = relationship("User", back_populates="orders")
	items: Mapped[list["OrderItem"]] = relationship(
		"OrderItem", back_populates="order", cascade="all, delete-orphan"
	)


class OrderItem(Base):
	__tablename__ = "order_items"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
	product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
	quantity: Mapped[int] = mapped_column(Integer, nullable=False)
	price_at_purchase: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

	order: Mapped[Order] = relationship("Order", back_populates="items")
	product: Mapped[Product] = relationship("Product", back_populates="order_items")


class Review(Base):
	__tablename__ = "reviews"

	id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
	product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
	user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
	rating: Mapped[int] = mapped_column(Integer, nullable=False)

	product: Mapped[Product] = relationship("Product", back_populates="reviews")
	user: Mapped[User] = relationship("User", back_populates="reviews")
