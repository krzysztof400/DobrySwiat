# DobrySwiat Shop API

Backend module for the shop system described in `bdproject.pdf`. Built with FastAPI and SQLAlchemy 2.0 and designed for MariaDB (with a SQLite fallback for local dev).

## Features

- Users with roles (`client`, `admin`)
- Categories, products, orders, order items, reviews
- Ready SQL script for MariaDB trigger and procedure

## Environment

The app reads `DATABASE_URL` from `.env`.

Example:

```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/dobry_swiat
```

If `DATABASE_URL` is not set, the app uses `sqlite:///./dev.db`.

## API overview

All endpoints are prefixed with `/api`.

- `GET /health`
- `POST /users`
- `GET /users/{user_id}`
- `GET /categories`
- `POST /categories` (admin only, use header `X-User-Role: admin`)
- `GET /products`
- `POST /products` (admin only)
- `GET /orders` (requires `X-User-Id` header)
- `GET /orders/{order_id}` (requires `X-User-Id` header)
- `POST /orders`
- `GET /reviews`
- `POST /reviews`

## MariaDB trigger & procedure

The SQL script in `sql/mariadb_triggers.sql` adds:

- `after_order_item_insert` trigger to decrease stock after inserting order items
- `CalculateUserTotal` procedure to return total spend by user

Apply it after creating tables.
