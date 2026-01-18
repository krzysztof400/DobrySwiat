import importlib
import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))


@pytest.fixture()
def client(tmp_path: Path):
    db_path = tmp_path / "test.db"
    os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

    import app.database as database
    import app.models as models
    import app.routers as routers
    import main as main_app

    importlib.reload(database)
    importlib.reload(models)
    importlib.reload(routers)
    importlib.reload(main_app)

    database.Base.metadata.create_all(bind=database.engine)

    with TestClient(main_app.app) as test_client:
        yield test_client


def test_health_and_order_flow(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

    user_resp = client.post(
        "/api/users",
        json={"email": "client@example.com", "password": "secret123", "role": "client"},
    )
    assert user_resp.status_code == 201
    user_id = user_resp.json()["id"]

    category_resp = client.post(
        "/api/categories",
        json={"name": "Books"},
        headers={"X-User-Role": "admin"},
    )
    assert category_resp.status_code == 201
    category_id = category_resp.json()["id"]

    product_resp = client.post(
        "/api/products",
        json={
            "name": "Novel",
            "price": "19.90",
            "stock_quantity": 10,
            "category_id": category_id,
        },
        headers={"X-User-Role": "admin"},
    )
    assert product_resp.status_code == 201
    product_id = product_resp.json()["id"]

    order_resp = client.post(
        "/api/orders",
        json={
            "user_id": user_id,
            "status": "pending",
            "items": [{"product_id": product_id, "quantity": 2}],
        },
    )
    assert order_resp.status_code == 201
    assert order_resp.json()["items"][0]["quantity"] == 2

    orders_resp = client.get("/api/orders", headers={"X-User-Id": str(user_id)})
    assert orders_resp.status_code == 200
    assert len(orders_resp.json()) == 1
