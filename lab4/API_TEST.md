# Lab Assignment 4 — REST API with JWT

All routes are prefixed with **`/api/v1`** and return **JSON** (no EJS).

## Setup

1. Make sure MongoDB is running locally.
2. The repo already has `.env` with `JWT_SECRET`, `JWT_EXPIRES_IN=1h`, `PORT=3000`, `MONGO_URI`.
3. Start the server:
   ```
   node server.js
   ```

---

## Endpoints

### 1. POST `/api/v1/auth/login`  *(public)*
Returns a JWT token encoding `{ user_id, role }` valid for **1 hour**.

```bash
curl -X POST http://localhost:3000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@khaadi.com\",\"password\":\"yourpassword\"}"
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJI...",
  "user": { "id": "...", "name": "...", "email": "...", "role": "admin" }
}
```

---

### 2. GET `/api/v1/products`  *(public)*
Supports `?page=`, `?limit=`, `?search=`, `?category=`, `?minPrice=`, `?maxPrice=`.

```bash
curl "http://localhost:3000/api/v1/products?page=1&limit=8&category=lawn"
```

---

### 3. GET `/api/v1/products/:id`  *(public)*

```bash
curl http://localhost:3000/api/v1/products/<PRODUCT_ID>
```

---

### 4. POST `/api/v1/orders`  *(protected — needs JWT)*
Send the token in the `Authorization: Bearer <token>` header.

```bash
curl -X POST http://localhost:3000/api/v1/orders ^
  -H "Authorization: Bearer <TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"items\":[{\"product\":\"<PRODUCT_ID>\",\"quantity\":2}]}"
```

---

### 5. GET `/api/v1/user/profile`  *(protected — needs JWT)*

```bash
curl http://localhost:3000/api/v1/user/profile ^
  -H "Authorization: Bearer <TOKEN>"
```

---

## Error Codes

| Status | When it happens                                            |
|--------|------------------------------------------------------------|
| 400    | Missing/invalid request body                               |
| 401    | Login failed, or `Authorization: Bearer` header missing    |
| 403    | Token is present but invalid / expired                     |
| 404    | Product / user not found                                   |
| 500    | Server / DB error                                          |
