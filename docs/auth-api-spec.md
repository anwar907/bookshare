# Authentication & Authorization API Specification

## 1. Register
**Endpoint:** `POST /api/auth/register`

**Description:** Registrasi user baru dengan role customer

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "user_id": "string",
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
  "password": "string",
  "device_id": "string"
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
      "id": "string",
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
- Password disimpan dengan hashing (bcrypt/argon2)
- Token berlaku 1 jam
- Login di device baru akan logout sesi sebelumnya

---

## 3. Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Logout dan invalidate access token

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

**Description:** Mendapatkan informasi user yang sedang login

**Headers:**
- `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "customer | admin"
  }
}
```

---

## 5. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Description:** Refresh access token sebelum expired

**Headers:**
- `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "access_token": "string",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

## Authentication & Authorization Rules

### Authentication
Semua endpoint (kecuali login, register, dan GET /api/books) harus menyertakan:
```
Authorization: Bearer <access_token>
```

### Authorization by Role

**Customer dapat akses:**
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/cart/items`
- `DELETE /api/cart/items/:id`
- `POST /api/orders/checkout`
- `GET /api/auth/me`
- `POST /api/auth/logout`

**Admin dapat akses:**
- `GET /api/admin/books`
- `GET /api/admin/transactions`
- `POST /api/admin/books`
- `PATCH /api/admin/books/:id/stock`
- `DELETE /api/admin/books/:id`
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

**409 Conflict:**
```json
{
  "status": "error",
  "message": "Sesi Anda telah berakhir karena login di device lain"
}
```

---

## Security Implementation Notes

1. **Password Storage:** Gunakan bcrypt atau argon2 untuk hashing password
2. **Token:** JWT dengan expiry 1 jam
3. **Single Device:** Simpan device_id di database, invalidate token lama saat login baru
4. **HTTPS:** Semua endpoint harus menggunakan HTTPS di production
5. **Rate Limiting:** Batasi login attempts (max 5 per 15 menit)
