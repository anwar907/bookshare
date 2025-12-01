# Book API Specification

## Customer Endpoints

### 1. Get Books (Ready Stock Only)
**Endpoint:** `GET /api/books`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): number
- `limit` (optional): number

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Book Title",
      "price": 50000,
      "stock": 10,
      "description": "Book description"
    }
  ],
  "total": 100
}
```

### 2. Get Book Detail
**Endpoint:** `GET /api/books/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Book Title",
  "price": 50000,
  "stock": 10,
  "description": "Book description"
}
```

### 3. Checkout
**Endpoint:** `POST /api/checkout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 201:**
```json
{
  "transactionId": "uuid",
  "cartId": "uuid",
  "price": 150000,
  "status": "PENDING"
}
```

### 4. Payment Callback
**Endpoint:** `POST /api/payment/callback`

**Request Body:**
```json
{
  "transactionId": "uuid",
  "status": "SUCCESS"
}
```

**Response 200:**
```json
{
  "message": "Payment status updated"
}
```

## Admin Endpoints

### 5. Get All Books (Admin)
**Endpoint:** `GET /api/admin/books`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): number
- `limit` (optional): number

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Book Title",
      "price": 50000,
      "stock": 0,
      "description": "Book description"
    }
  ],
  "total": 100
}
```

### 6. Get Book Detail (Admin)
**Endpoint:** `GET /api/admin/books/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Book Title",
  "price": 50000,
  "stock": 0,
  "description": "Book description"
}
```

### 7. Get Transactions
**Endpoint:** `GET /api/admin/transactions`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): SUCCESS | FAILED | PENDING
- `page` (optional): number
- `limit` (optional): number

**Response 200:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "cartId": "uuid",
      "price": 150000,
      "status": "SUCCESS"
    }
  ],
  "total": 50
}
```

### 8. Create Book
**Endpoint:** `POST /api/admin/books`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Book Title",
  "price": 50000,
  "stock": 10,
  "description": "Book description"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "Book Title",
  "price": 50000,
  "stock": 10,
  "description": "Book description"
}
```

### 9. Update Book Stock
**Endpoint:** `PATCH /api/admin/books/:id/stock`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "stock": 20
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Book Title",
  "price": 50000,
  "stock": 20,
  "description": "Book description"
}
```

### 10. Delete Book
**Endpoint:** `DELETE /api/admin/books/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "message": "Book deleted successfully"
}
```

### 11. Get Sales Report
**Endpoint:** `GET /api/admin/reports/sales`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `bookId` (optional): uuid

**Response 200:**
```json
{
  "data": [
    {
      "bookId": "uuid",
      "bookName": "Book Title",
      "totalSold": 50,
      "remainingStock": 10,
      "totalRevenue": 2500000
    }
  ]
}
```
