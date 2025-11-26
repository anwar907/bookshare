# Admin API Specification

## 1. Get All Books
**Endpoint:** `GET /api/admin/books`

**Description:** Melihat list semua buku dan detailnya (tidak terbatas pada stock)

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): integer, default 1
- `limit` (optional): integer, default 10
- `search` (optional): string

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
        "isbn": "string",
        "publisher": "string",
        "published_year": "number",
        "created_at": "datetime",
        "updated_at": "datetime"
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

## 2. Get Transactions
**Endpoint:** `GET /api/admin/transactions`

**Description:** Mengecek list transaksi checkout beserta status pembayarannya

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page` (optional): integer, default 1
- `limit` (optional): integer, default 10
- `payment_status` (optional): success | failed | pending

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "order_id": "string",
        "customer_name": "string",
        "customer_email": "string",
        "total_amount": "number",
        "payment_status": "success | failed | pending",
        "payment_method": "string",
        "items": [
          {
            "book_title": "string",
            "quantity": "number",
            "price": "number"
          }
        ],
        "created_at": "datetime",
        "paid_at": "datetime"
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

## 3. Add New Book
**Endpoint:** `POST /api/admin/books`

**Description:** Menambah buku baru untuk dijual

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "string",
  "author": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "isbn": "string",
  "publisher": "string",
  "published_year": "number",
  "cover_image": "string"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": "string",
    "title": "string",
    "author": "string",
    "price": "number",
    "stock": "number"
  }
}
```

---

## 4. Update Book Stock
**Endpoint:** `PATCH /api/admin/books/:id/stock`

**Description:** Menambah/mengurangi stock buku

**Headers:**
- `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "stock_change": "number"
}
```
*Note: Gunakan nilai positif untuk menambah, negatif untuk mengurangi*

**Response 200:**
```json
{
  "status": "success",
  "message": "Stok berhasil diupdate",
  "data": {
    "id": "string",
    "title": "string",
    "previous_stock": "number",
    "current_stock": "number"
  }
}
```

**Response 400:**
```json
{
  "status": "error",
  "message": "Stok tidak boleh kurang dari 0"
}
```

---

## 5. Delete Book
**Endpoint:** `DELETE /api/admin/books/:id`

**Description:** Menghapus buku dari katalog

**Headers:**
- `Authorization: Bearer <admin_token>`

**Response 200:**
```json
{
  "status": "success",
  "message": "Buku berhasil dihapus dari katalog"
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

## 6. Get Sales Report
**Endpoint:** `GET /api/admin/reports/sales`

**Description:** Membuat laporan penjualan setiap buku

**Headers:**
- `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `start_date` (optional): datetime
- `end_date` (optional): datetime
- `book_id` (optional): string

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "report": [
      {
        "book_id": "string",
        "book_title": "string",
        "total_sold": "number",
        "remaining_stock": "number",
        "total_revenue": "number"
      }
    ],
    "summary": {
      "total_books_sold": "number",
      "total_revenue": "number"
    }
  }
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

**403 Forbidden:**
```json
{
  "status": "error",
  "message": "Akses ditolak. Hanya admin yang dapat mengakses"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server"
}
```
