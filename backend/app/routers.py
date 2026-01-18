from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter()


def require_admin(x_user_role: str = Header("client")) -> None:
	if x_user_role != "admin":
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")


def get_user_id_header(x_user_id: int | None = Header(None)) -> int:
	if x_user_id is None:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="X-User-Id header required")
	return x_user_id


@router.get("/health")
def health_check() -> dict:
	return {"status": "ok"}


@router.post("/users", response_model=schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
	if crud.get_user_by_email(db, user.email):
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
	return crud.create_user(db, user)


@router.get("/users/{user_id}", response_model=schemas.UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
	user = crud.get_user(db, user_id)
	if not user:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
	return user


@router.get("/categories", response_model=list[schemas.CategoryRead])
def list_categories(db: Session = Depends(get_db)):
	return crud.list_categories(db)


@router.post(
	"/categories",
	response_model=schemas.CategoryRead,
	status_code=status.HTTP_201_CREATED,
	dependencies=[Depends(require_admin)],
)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
	return crud.create_category(db, category)


@router.get("/products", response_model=list[schemas.ProductRead])
def list_products(category_id: int | None = None, db: Session = Depends(get_db)):
	return crud.list_products(db, category_id)


@router.post(
	"/products",
	response_model=schemas.ProductRead,
	status_code=status.HTTP_201_CREATED,
	dependencies=[Depends(require_admin)],
)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
	return crud.create_product(db, product)


@router.get("/orders", response_model=list[schemas.OrderRead])
def list_orders(user_id: int = Depends(get_user_id_header), db: Session = Depends(get_db)):
	return crud.list_orders(db, user_id)


@router.get("/orders/{order_id}", response_model=schemas.OrderRead)
def get_order(order_id: int, user_id: int = Depends(get_user_id_header), db: Session = Depends(get_db)):
	order = crud.get_order(db, order_id)
	if not order:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
	if order.user_id != user_id:
		raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
	return order


@router.post("/orders", response_model=schemas.OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
	try:
		return crud.create_order(db, order)
	except ValueError as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/reviews", response_model=list[schemas.ReviewRead])
def list_reviews(product_id: int | None = None, db: Session = Depends(get_db)):
	return crud.list_reviews(db, product_id)


@router.post("/reviews", response_model=schemas.ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
	try:
		return crud.create_review(db, review)
	except ValueError as exc:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
