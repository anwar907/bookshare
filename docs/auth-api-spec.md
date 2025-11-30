# Authentication & Authorization API Specification

## 1. Register

**Endpoint:** `POST /api/auth/register`

**Description:** Registrasi user baru dengan role customer.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Response 201:**

```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "customer"
  }
}
```

**Response 400:**

```json
{
  "status": "error",
  "message": "Email sudah terdaftar"
}
```

---

## 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Login menggunakan email dan password. Access token berlaku 1 jam. Hanya 1 device aktif per user.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**

```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "access_token": "string",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "customer | admin"
    }
  }
}
```

**Response 401:**

```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

**Notes:**

- Password di-hash menggunakan bcrypt (salt rounds >= 10).
- Token berlaku 1 jam (3600 detik).
- Login di device baru akan invalidate token sebelumnya.
- Token disimpan di database untuk validasi single device.

---

## 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout dan invalidate access token.

**Headers:**

- `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

## 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Mendapatkan informasi user yang sedang login.

**Headers:**

- `Authorization: Bearer <token>`

**Response 200:**

```json
{
  "status": "success",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "customer | admin"
  }
}
```

---

## Authentication & Authorization Rules

### Authentication

Semua endpoint (kecuali yang disebutkan di bawah) harus menyertakan:

```
Authorization: Bearer <access_token>
```

### Public Endpoints (Tidak Perlu Auth)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/books`
- `GET /api/books/:id`

### Authorization by Role

**Customer dapat akses:**

- `GET /api/books`
- `GET /api/books/:id`
- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart/:itemId`
- `POST /api/checkout`
- `GET /api/auth/me`
- `POST /api/auth/logout`

**Admin dapat akses:**

- `GET /api/admin/books`
- `GET /api/admin/books/:id`
- `POST /api/admin/books`
- `PATCH /api/admin/books/:id/stock`
- `DELETE /api/admin/books/:id`
- `GET /api/admin/transactions`
- `GET /api/admin/reports/sales`
- `GET /api/auth/me`
- `POST /api/auth/logout`

---

## Error Responses

**401 Unauthorized:**

```json
{
  "status": "error",
  "message": "Token tidak valid atau expired"
}
```

**403 Forbidden:**

```json
{
  "status": "error",
  "message": "Akses ditolak"
}
```

---

## Security Implementation Notes

1. **Password Storage:** Gunakan bcrypt dengan salt rounds minimal 10.
2. **Token:** Gunakan JWT atau random token dengan expiry 1 jam.
3. **Single Device:** Simpan token di database, replace saat login baru.
4. **HTTPS:** Semua endpoint harus menggunakan HTTPS di production.
5. **Rate Limiting:** Batasi login attempts (max 5 per 15 menit) untuk mencegah brute force.
6. **Token Validation:** Middleware harus cek token di database untuk memastikan masih valid (single device policy).
