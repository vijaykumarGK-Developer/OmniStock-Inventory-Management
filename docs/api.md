# OmniStock API Documentation

Base URL: `http://localhost:3001/api`

All protected endpoints require an `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/login

Authenticate with email and password.

**Request:**
```json
{
  "email": "admin@omni.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "data": {
    "user": { "id": 1, "name": "Admin User", "email": "admin@omni.com", "role": "admin", "status": "active" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:** `401` — invalid credentials

---

### POST /auth/signup

Register a new user.

**Request:**
```json
{
  "name": "New User",
  "email": "new@example.com",
  "password": "securepass"
}
```

**Response (201):**
```json
{
  "data": {
    "user": { "id": 4, "name": "New User", "email": "new@example.com", "role": "staff", "status": "active" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:** `409` — email already exists

---

### GET /auth/me

Returns the currently authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "data": {
    "id": 1, "name": "Admin User", "email": "admin@omni.com",
    "role": "admin", "status": "active", "createdAt": "2026-05-25T..."
  }
}
```

---

### GET /auth/users

Returns all users (admin only).

**Response (200):**
```json
{
  "data": [
    { "id": 1, "name": "Admin User", "email": "admin@omni.com", "role": "admin", "status": "active", "createdAt": "..." },
    { "id": 2, "name": "Manager User", "email": "manager@omni.com", "role": "manager", "status": "active", "createdAt": "..." }
  ]
}
```

---

## Products

### GET /products

List products with search, filter, sorting, and pagination.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name or SKU |
| `categoryId` | number | Filter by category |
| `stockStatus` | `in_stock` \| `low_stock` \| `out_of_stock` | Filter by stock level |
| `sortBy` | `name` \| `price` \| `stock` \| `createdAt` | Sort field |
| `sortOrder` | `asc` \| `desc` | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1, "name": "Wireless Mouse", "sku": "ELE-001",
      "categoryId": 1, "categoryName": "Electronics",
      "price": 799, "costPrice": 450, "stock": 45,
      "minStock": 10, "unit": "pcs", "brand": "LogiTech",
      "createdAt": "...", "updatedAt": "..."
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 20, "totalPages": 2 }
}
```

### GET /products/:id

**Response (200):**
```json
{
  "data": { "id": 1, "name": "Wireless Mouse", "sku": "ELE-001", ... }
}
```

### POST /products

**Request:**
```json
{
  "name": "New Product", "sku": "NEW-001", "categoryId": 1,
  "price": 999, "costPrice": 500, "stock": 50,
  "minStock": 10, "unit": "pcs", "brand": "BrandName"
}
```

**Response (201):** Created product object

### PUT /products/:id

Same body as POST. Updates the product.

### DELETE /products/:id

Deletes a product. **Fails if** the product has associated purchases or sale items.

**Response (200):** `{ "data": { "message": "Product deleted" } }`

---

## Sales

### POST /sales

Creates a sale and atomically decrements stock.

**Request:**
```json
{
  "customerName": "Ravi Kumar",
  "customerPhone": "9876543210",
  "paymentMethod": "upi",
  "discount": 0,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Response (201):**
```json
{
  "data": {
    "id": 3, "invoiceNo": "INV-2026-0003",
    "subtotal": 4097, "tax": 737.46, "discount": 0, "total": 4834.46,
    "paymentMethod": "upi", "customerName": "Ravi Kumar", "userName": "Admin User",
    "items": [
      { "id": 1, "productId": 1, "productName": "Wireless Mouse", "quantity": 2, "unitPrice": 799, "total": 1598 },
      { "id": 2, "productId": 3, "productName": "USB-C Hub 7-in-1", "quantity": 1, "unitPrice": 1499, "total": 1499 }
    ],
    "createdAt": "..."
  }
}
```

### GET /sales

**Query Parameters:** `search`, `page`, `limit`

**Response (200):** Paginated list of sales with items.

### GET /sales/:id

Returns full sale detail with items and user info.

---

## Suppliers

### GET /suppliers

**Query Parameters:** `search`, `status` (`active` | `inactive`), `page`, `limit`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1, "name": "TechSource India",
      "contactPerson": "Rahul Sharma", "phone": "9876543210",
      "email": "rahul@techsource.in", "city": "Mumbai",
      "state": "Maharashtra", "address": null,
      "status": "active", "purchaseCount": 1,
      "createdAt": "..."
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

### POST /suppliers

**Request:**
```json
{
  "name": "New Supplier", "contactPerson": "John Doe",
  "phone": "9876543215", "email": "john@supplier.com",
  "address": "123 Street", "city": "Mumbai",
  "state": "Maharashtra", "status": "active"
}
```

### PUT /suppliers/:id

Update supplier fields.

### DELETE /suppliers/:id

Admin only. Fails if supplier has active purchases.

---

## Purchases

### POST /purchases

Creates a purchase order (PO‑YYYY‑NNNN).

**Request:**
```json
{
  "supplierId": 1,
  "orderDate": "2026-05-25",
  "expectedDate": "2026-06-10",
  "notes": "Urgent restock",
  "items": [
    { "productId": 1, "quantity": 20, "unitPrice": 450 },
    { "productId": 2, "quantity": 10, "unitPrice": 600 }
  ]
}
```

**Response (201):** Purchase with items.

### GET /purchases

**Query Parameters:** `search` (PO number), `supplierId`, `page`, `limit`

**Response (200):** Paginated purchases with supplier and user names.

### PUT /purchases/:id/status

Updates PO status with atomic stock update.

**Request:**
```json
{ "status": "received" }
```

**Status transitions:**
- `pending` → `received`: increments stock, creates StockMovement IN
- `pending` → `cancelled`: no stock change
- `received` → `cancelled`: decrements stock, creates StockMovement OUT

---

## Dashboard

All dashboard endpoints require authentication.

### GET /dashboard/stats

**Response (200):**
```json
{
  "data": {
    "totalProducts": 20,
    "totalStock": 2621,
    "outOfStock": 2,
    "lowStock": 4,
    "totalRevenue": 9921.74,
    "revenueChange": 0,
    "monthlyRevenue": [
      { "month": "2025-12", "revenue": 0 },
      { "month": "2026-01", "revenue": 0 },
      { "month": "2026-02", "revenue": 0 },
      { "month": "2026-03", "revenue": 0 },
      { "month": "2026-04", "revenue": 0 },
      { "month": "2026-05", "revenue": 8036.1 }
    ]
  }
}
```

### GET /dashboard/recent-sales

Returns last 5 sales with user name and items.

### GET /dashboard/low-stock

Returns products where `stock <= minStock` (max 10).

### GET /dashboard/top-products

Returns top 5 products by units sold in the last 30 days.

---

## Reports

All report endpoints accept optional `from` and `to` query parameters (ISO date strings).

### GET /reports/sales

**Response:**
```json
{
  "data": {
    "totalRevenue": 9921.74,
    "totalTax": 1241.10,
    "totalDiscount": 100,
    "orderCount": 2,
    "dailyRevenue": [ { "date": "2026-05-25", "revenue": 8036.1, "orders": 2 } ],
    "topProducts": [ { "productName": "Wireless Mouse", "unitsSold": 42, "revenue": 33558 } ]
  }
}
```

### GET /reports/stock

**Response:**
```json
{
  "data": {
    "totalStockValue": 250000,
    "stockByCategory": [ { "name": "Electronics", "stock": 110, "value": 150000 } ],
    "lowStockCount": 4,
    "outOfStockCount": 2,
    "products": [ ... ]
  }
}
```

### GET /reports/purchases

**Response:**
```json
{
  "data": {
    "totalSpent": 15000,
    "orderCount": 1,
    "bySupplier": [ { "supplierName": "TechSource India", "total": 15000, "count": 1 } ],
    "monthly": [ { "month": "2026-05", "total": 15000, "count": 1 } ]
  }
}
```

### GET /reports/profit

**Response:**
```json
{
  "data": {
    "totalRevenue": 9921.74,
    "totalCost": 5500,
    "grossProfit": 4421.74,
    "profitMargin": 44.56,
    "monthly": [ { "month": "2026-05", "revenue": 8036.1, "cost": 4500, "profit": 3536.1 } ]
  }
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Validation error (Zod) |
| `401` | Authentication required / invalid credentials |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `409` | Conflict (duplicate SKU, email, or deletion blocked by relations) |
| `500` | Internal server error |
