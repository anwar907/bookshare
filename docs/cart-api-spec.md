# Cart API Specification

## 1. Get Cart

**Endpoint:** `GET /api/cart`

**Headers:**

```
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "id": "uuid",
  "userId": "uuid",
  "cartItems": [
    {
      "id": "uuid",
      "bookId": "uuid",
      "quantity": 1
    }
  ]
}
```

## 2. Add Item to Cart

**Endpoint:** `POST /api/cart/items`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "bookId": "uuid",
  "quantity": 1
}
```

**Response 201:**

```json
{
  "id": "uuid",
  "bookId": "uuid",
  "cartId": "uuid",
  "quantity": 1
}
```

## 3. Update Cart Item

**Endpoint:** `PUT /api/cart/items/:itemId`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "quantity": 2
}
```

**Response 200:**

```json
{
  "id": "uuid",
  "bookId": "uuid",
  "cartId": "uuid",
  "quantity": 2
}
```

## 4. Delete Cart Item

**Endpoint:** `DELETE /api/cart/items/:itemId`

**Headers:**

```
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Item removed from cart"
}
```

## 5. Clear Cart

**Endpoint:** `DELETE /api/cart`

**Headers:**

```
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Cart cleared"
}
```
