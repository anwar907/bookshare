# Customer API Specification

## 1. Get Books List
**Endpoint:** `GET /api/books`

**Description:** Melihat daftar buku yang ready stock (stock > 0).

**Query Parameters:**
- `page` (optional): integer, default 1
- `limit` (optional): integer, default 10
- `search` (optional): string, untuk mencari buku berdasarkan judul/penulis

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "number",
        "title": "string",
        "author": "string",
        "price": "number",
        "stock": "number",
        "cover_image": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number"
    }
  }
}
```

---

## 2. Get Book Detail
**Endpoint:** `GET /api/books/:id`

**Description:** Melihat detail buku.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": "number",
    "title": "string",
    "author": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "cover_image": "string",
    "isbn": "string",
    "publisher": "string",
    "published_year": "number"
  }
}
```

**Response 404:**
```json
{
  "status": "error",
  "message": "Buku tidak ditemukan"
}
```

---

## 3. Get Cart
**Endpoint:** `GET /api/cart`

**Description:** Melihat isi keranjang belanja user saat ini.

**Headers:**
- `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": "number",
    "items": [
      {
        "id": "number",
        "book_id": "number",
        "book_title": "string",
        "quantity": "number",
        "price": "number",
        "total_price": "number"
      }
    ],
    "total_items": "number",
    "total_amount": "number"
  }
}
```

---

## 4. Add Book to Cart
**Endpoint:** `POST /api/cart`

**Description:** Menambahkan buku ke keranjang. Jika buku sudah ada, quantity akan ditambahkan.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "book_id": "number",
  "quantity": "number"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan ke keranjang",
  "data": {
    "id": "number",
    "book_id": "number",
    "quantity": "number"
  }
}
```

**Response 400:**
```json
{
  "status": "error",
  "message": "Stok tidak mencukupi"
}
```

---

## 5. Remove Book from Cart
**Endpoint:** `DELETE /api/cart/:itemId`

**Description:** Menghapus item dari keranjang.

**Headers:**
- `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "status": "success",
  "message": "Item berhasil dihapus dari keranjang"
}
```

**Response 404:**
```json
{
  "status": "error",
  "message": "Item tidak ditemukan di keranjang"
}
```

---

## 6. Checkout
**Endpoint:** `POST /api/checkout`

**Description:** Melakukan checkout semua item di keranjang. Mengurangi stok buku dan membuat transaksi pending.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "payment_method": "string"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Checkout berhasil",
  "data": {
    "transaction_id": "number",
    "total_amount": "number",
    "status": "pending",
    "created_at": "datetime"
  }
}
```

**Response 400:**
```json
{
  "status": "error",
  "message": "Keranjang kosong atau stok salah satu buku tidak mencukupi"
}
```

---

## 7. Payment Callback
**Endpoint:** `POST /api/callback/payment`

**Description:** Webhook untuk menerima status pembayaran dari Payment Gateway.

**Request Body:**
```json
{
  "order_id": "string",
  "status": "success | failed | pending",
  "signature": "string"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Status pembayaran berhasil diupdate"
}
```

---

## Error Responses

**401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Token tidak valid atau expired"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server"
}
```
