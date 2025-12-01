# Bookshare API

Book Sample API untuk sistem penjualan buku online dengan fitur keranjang belanja dan transaksi.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Logging**: Winston

## Features

### ✅ Implemented

- User Registration (Customer & Admin)
- User Login dengan JWT
- Device Management (Single Active Session)

### 🚧 In Progress

- Book Management (CRUD)
- Cart Management
- Transaction & Checkout
- Payment Callback
- Sales Report

## Database Schema

- **User**: User management dengan role (ADMIN/CUSTOMER)
- **UserDevice**: Device & token management
- **Books**: Katalog buku
- **Cart**: Keranjang belanja user
- **CartItem**: Item dalam keranjang
- **Transactions**: Transaksi pembayaran

## Installation

```bash
# Install dependencies
yarn install

# Setup database
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

## Environment Variables

```env
DATABASE_URL="mysql://user:password@localhost:3306/bookshare"
SCRET_KEY="your-secret-key"
```

## Running the Application

```bash
# Development
yarn start
```

## API Endpoints

### Authentication

#### Register

```
POST /api/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123",
  "role": "CUSTOMER"
}
```

#### Login

```
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "deviceId": "device-123"
}
```

## Project Structure

```
src/
├── applications/    # Database, logging, web config
├── controller/      # Request handlers
├── service/         # Business logic
├── model/          # Data models & types
├── validation/     # Input validation
├── middleware/     # Express middlewares
├── router/         # Route definitions
├── utils/          # Helper functions
└── error/          # Error handling
```

## API Documentation

Dokumentasi lengkap API tersedia di folder `docs/`:

- [User API Spec](docs/user-api-spec.md)
- [Book API Spec](docs/book-api-spec.md)
- [Cart API Spec](docs/cart-api-spec.md)

## Author

Anwar

## License

ISC
