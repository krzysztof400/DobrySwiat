from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models import UserRole


class UserBase(BaseModel):
	email: str
	role: UserRole = UserRole.client


class UserCreate(UserBase):
	password: str = Field(min_length=6)


class UserRead(UserBase):
	id: int
	model_config = ConfigDict(from_attributes=True)


class CategoryBase(BaseModel):
	name: str


class CategoryCreate(CategoryBase):
	pass


class CategoryRead(CategoryBase):
	id: int
	model_config = ConfigDict(from_attributes=True)


class ProductBase(BaseModel):
	name: str
	price: Decimal
	stock_quantity: int = Field(ge=0)
	category_id: int


class ProductCreate(ProductBase):
	pass


class ProductRead(ProductBase):
	id: int
	model_config = ConfigDict(from_attributes=True)


class OrderItemBase(BaseModel):
	product_id: int
	quantity: int = Field(gt=0)


class OrderItemCreate(OrderItemBase):
	pass


class OrderItemRead(OrderItemBase):
	id: int
	price_at_purchase: Decimal
	model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
	user_id: int
	status: str = "pending"


class OrderCreate(OrderBase):
	items: list[OrderItemCreate]


class OrderRead(OrderBase):
	id: int
	created_at: datetime
	items: list[OrderItemRead]
	model_config = ConfigDict(from_attributes=True)


class ReviewBase(BaseModel):
	product_id: int
	user_id: int
	rating: int = Field(ge=1, le=5)


class ReviewCreate(ReviewBase):
	pass


class ReviewRead(ReviewBase):
	id: int
	model_config = ConfigDict(from_attributes=True)
