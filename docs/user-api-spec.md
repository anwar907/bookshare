# User API Specification

## 1. User Register

**Endpoint:** `POST /api/user/register`

**Description:** Mendaftarkan user baru (admin atau customer).

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN | CUSTOMER"
}
```

**Response 201:**

```json
{
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "ADMIN | CUSTOMER",
    "createdAt": "datetime"
  }
}
```

**Response 400:**

```json
{
  "status": "error",
  "message": "Email already exists"
}
```

---

## 2. User Login

**Endpoint:** `POST /api/user/login`

**Description:** Login user dan mendapatkan JWT token. Sistem single device - login baru akan logout device lain.

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN | CUSTOMER",
  "deviceId": "string"
}
```

**Response 200:**

```json
{
  {
    "token": "string",
    "message": "string"
}
}
```

**Response 400:**

```json
{
  "status": "error",
  "message": "Email not found | Password wrong"
}
```

---

## Error Responses

**400 Bad Request:**

```json
{
  "status": "error",
  "message": "Validation error message"
}
```

**500 Internal Server Error:**

```json
{
  "errors": "Server error message"
}
```
