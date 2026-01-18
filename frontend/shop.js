const defaultApiBase = "http://localhost:8000/api";

const state = {
	categories: [],
	products: [],
	cart: new Map(),
};

const elements = {
	apiBase: document.getElementById("apiBase"),
	userId: document.getElementById("userId"),
	categorySelect: document.getElementById("categorySelect"),
	productGrid: document.getElementById("productGrid"),
	cartList: document.getElementById("cartList"),
	cartTotal: document.getElementById("cartTotal"),
	ordersList: document.getElementById("ordersList"),
	status: document.getElementById("status"),
	savePrefs: document.getElementById("savePrefs"),
	refreshBtn: document.getElementById("refreshBtn"),
	checkoutBtn: document.getElementById("checkoutBtn"),
};

function loadPrefs() {
	elements.apiBase.value = localStorage.getItem("shopApiBase") || defaultApiBase;
	elements.userId.value = localStorage.getItem("shopUserId") || "";
}

function savePrefs() {
	localStorage.setItem("shopApiBase", elements.apiBase.value.trim() || defaultApiBase);
	localStorage.setItem("shopUserId", elements.userId.value.trim());
}

function setStatus(message, isError = true) {
	elements.status.textContent = message;
	elements.status.style.color = isError ? "#b42318" : "#027a48";
}

function clearStatus() {
	elements.status.textContent = "";
}

async function fetchJson(path, options = {}) {
	const base = (elements.apiBase.value || defaultApiBase).replace(/\/$/, "");
	const response = await fetch(`${base}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
		...options,
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(detail || `Request failed (${response.status})`);
	}
	return response.json();
}

async function loadCategories() {
	state.categories = await fetchJson("/categories");
	elements.categorySelect.innerHTML = "<option value=\"\">Wszystkie</option>";
	state.categories.forEach((category) => {
		const option = document.createElement("option");
		option.value = category.id;
		option.textContent = category.name;
		elements.categorySelect.appendChild(option);
	});
}

async function loadProducts() {
	const categoryId = elements.categorySelect.value;
	const path = categoryId ? `/products?category_id=${categoryId}` : "/products";
	state.products = await fetchJson(path);
	renderProducts();
}

function renderProducts() {
	elements.productGrid.innerHTML = "";
	if (!state.products.length) {
		elements.productGrid.textContent = "Brak produktów.";
		return;
	}

	state.products.forEach((product) => {
		const card = document.createElement("div");
		card.className = "productCard";

		const title = document.createElement("h3");
		title.textContent = product.name;

		const price = document.createElement("div");
		price.className = "productMeta";
		price.textContent = `Cena: ${Number(product.price).toFixed(2)} zł`;

		const stock = document.createElement("div");
		stock.className = "productMeta";
		stock.textContent = `Dostępne: ${product.stock_quantity}`;

		const actions = document.createElement("div");
		actions.className = "productActions";

		const qtyInput = document.createElement("input");
		qtyInput.type = "number";
		qtyInput.min = "1";
		qtyInput.max = String(product.stock_quantity);
		qtyInput.value = "1";

		const addBtn = document.createElement("button");
		addBtn.className = "primaryBtn";
		addBtn.textContent = "Dodaj";
		addBtn.addEventListener("click", () => addToCart(product, Number(qtyInput.value || 1)));

		actions.appendChild(qtyInput);
		actions.appendChild(addBtn);

		card.appendChild(title);
		card.appendChild(price);
		card.appendChild(stock);
		card.appendChild(actions);

		elements.productGrid.appendChild(card);
	});
}

function addToCart(product, qty) {
	if (!product || qty <= 0) return;
	const existing = state.cart.get(product.id);
	const nextQty = Math.min(product.stock_quantity, (existing?.quantity || 0) + qty);
	state.cart.set(product.id, { product, quantity: nextQty });
	renderCart();
}

function updateCartItem(productId, qty) {
	const item = state.cart.get(productId);
	if (!item) return;
	if (qty <= 0) {
		state.cart.delete(productId);
	} else {
		item.quantity = Math.min(item.product.stock_quantity, qty);
	}
	renderCart();
}

function renderCart() {
	elements.cartList.innerHTML = "";
	let total = 0;

	if (!state.cart.size) {
		elements.cartList.textContent = "Koszyk jest pusty.";
	} else {
		state.cart.forEach((item) => {
			const row = document.createElement("div");
			row.className = "cartItem";

			const name = document.createElement("span");
			name.textContent = `${item.product.name} x${item.quantity}`;

			const price = document.createElement("span");
			price.textContent = `${(Number(item.product.price) * item.quantity).toFixed(2)} zł`;

			const qtyInput = document.createElement("input");
			qtyInput.type = "number";
			qtyInput.min = "0";
			qtyInput.max = String(item.product.stock_quantity);
			qtyInput.value = String(item.quantity);
			qtyInput.addEventListener("change", (event) =>
				updateCartItem(item.product.id, Number(event.target.value))
			);

			row.appendChild(name);
			row.appendChild(qtyInput);
			row.appendChild(price);
			elements.cartList.appendChild(row);

			total += Number(item.product.price) * item.quantity;
		});
	}

	elements.cartTotal.textContent = `${total.toFixed(2)} zł`;
}

async function loadOrders() {
	const userId = elements.userId.value.trim();
	if (!userId) {
		elements.ordersList.textContent = "Podaj User ID, aby zobaczyć zamówienia.";
		return;
	}
	const orders = await fetchJson("/orders", {
		headers: { "X-User-Id": userId },
	});
	renderOrders(orders);
}

function renderOrders(orders) {
	elements.ordersList.innerHTML = "";
	if (!orders.length) {
		elements.ordersList.textContent = "Brak zamówień.";
		return;
	}
	orders.forEach((order) => {
		const card = document.createElement("div");
		card.className = "orderCard";
		card.innerHTML = `#${order.id} • ${order.status} • ${new Date(order.created_at).toLocaleString()}`;
		elements.ordersList.appendChild(card);
	});
}

async function checkout() {
	clearStatus();
	const userId = Number(elements.userId.value.trim());
	if (!userId) {
		setStatus("Podaj poprawny User ID.");
		return;
	}
	if (!state.cart.size) {
		setStatus("Koszyk jest pusty.");
		return;
	}

	const items = Array.from(state.cart.values()).map((item) => ({
		product_id: item.product.id,
		quantity: item.quantity,
	}));

	try {
		await fetchJson("/orders", {
			method: "POST",
			body: JSON.stringify({ user_id: userId, status: "pending", items }),
		});
		state.cart.clear();
		renderCart();
		setStatus("Zamówienie zapisane!", false);
		await loadOrders();
	} catch (error) {
		setStatus(error.message || "Nie udało się złożyć zamówienia.");
	}
}

async function refreshAll() {
	clearStatus();
	try {
		await loadCategories();
		await loadProducts();
		await loadOrders();
	} catch (error) {
		setStatus(error.message || "Nie udało się pobrać danych.");
	}
}

elements.savePrefs.addEventListener("click", () => {
	savePrefs();
	refreshAll();
});
elements.refreshBtn.addEventListener("click", refreshAll);
elements.categorySelect.addEventListener("change", loadProducts);
elements.checkoutBtn.addEventListener("click", checkout);

loadPrefs();
refreshAll();
