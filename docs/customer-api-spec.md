# Customer API Specification

## 1. Get Books List
**Endpoint:** `GET /api/books`

**Description:** Melihat daftar buku yang ready stock

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
        "id": "string",
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

**Description:** Melihat detail buku

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
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

## 3. Add Book to Cart
**Endpoint:** `POST /api/cart/items`

**Description:** Menambahkan buku ke keranjang (hanya jika stok mencukupi)

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "book_id": "string",
  "quantity": "number"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan ke keranjang",
  "data": {
    "cart_item_id": "string",
    "book_id": "string",
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

## 4. Remove Book from Cart
**Endpoint:** `DELETE /api/cart/items/:id`

**Description:** Menghapus buku dari keranjang

**Headers:**
- `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "status": "success",
  "message": "Buku berhasil dihapus dari keranjang"
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

## 5. Checkout
**Endpoint:** `POST /api/orders/checkout`

**Description:** Melakukan checkout untuk pembayaran

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "payment_method": "string",
  "shipping_address": {
    "street": "string",
    "city": "string",
    "postal_code": "string",
    "phone": "string"
  }
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Checkout berhasil",
  "data": {
    "order_id": "string",
    "total_amount": "number",
    "payment_url": "string",
    "payment_status": "pending"
  }
}
```

**Response 400:**
```json
{
  "status": "error",
  "message": "Keranjang kosong atau stok tidak mencukupi"
}
```

---

## 6. Payment Callback
**Endpoint:** `POST /api/payments/callback`

**Description:** API callback untuk menyimpan status pembayaran dari payment gateway

**Request Body:**
```json
{
  "order_id": "string",
  "payment_status": "success | failed | pending",
  "transaction_id": "string",
  "paid_at": "datetime"
}
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Status pembayaran berhasil diupdate"
}
```

**Response 404:**
```json
{
  "status": "error",
  "message": "Order tidak ditemukan"
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
