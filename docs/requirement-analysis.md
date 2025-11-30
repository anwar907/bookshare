# Analisa Requirement Fitur Customer

Berikut adalah analisa mendalam mengenai kebutuhan fitur untuk role **Customer** berdasarkan requirement yang diberikan.

## 1. Breakdown Fitur & Flow

### A. Katalog Buku
*   **Requirement**: Melihat list buku yang ready stock serta detail buku.
*   **Analisa**:
    *   Hanya menampilkan buku dengan `stock > 0`.
    *   Perlu fitur pagination, sorting, dan filtering (opsional tapi disarankan) agar user mudah mencari buku.
    *   Detail buku harus menampilkan informasi lengkap: Judul, Penulis, Harga, Stok Tersedia, Deskripsi, Cover Image.

### B. Keranjang Belanja (Cart)
*   **Requirement**: Menambahkan buku ke keranjang (hanya jika stock mencukupi) & Menghapus buku.
*   **Analisa**:
    *   **Validasi Stok**: Saat menambahkan ke keranjang, sistem harus mengecek apakah `requested_qty <= current_stock`.
    *   **Persistensi**: Keranjang sebaiknya disimpan di database (`Cart` & `CartItem`) agar tidak hilang saat user refresh/login ulang.
    *   **Update Quantity**: User mungkin ingin menambah jumlah buku yang sama di keranjang.
    *   **Stock Reservation (Opsional)**: Apakah stok langsung "di-booking" saat masuk keranjang atau baru saat checkout?
        *   *Rekomendasi*: Cek stok saat *checkout* saja untuk menghindari "phantom stock" (stok tertahan di keranjang user yang tidak jadi beli).

### C. Checkout & Pembayaran
*   **Requirement**: Melakukan checkout untuk pembayaran.
*   **Analisa**:
    *   User memilih item dari keranjang (atau semua item) untuk di-checkout.
    *   Sistem menghitung total harga.
    *   **Pengurangan Stok**: Stok harus dikurangi saat transaksi dibuat (status `pending`).
    *   **Locking**: Perlu mekanisme locking (optimistic/pessimistic) untuk mencegah race condition jika 2 user checkout buku terakhir bersamaan.

### D. Payment Callback
*   **Requirement**: API callback untuk menyimpan status pembayaran: sukses / gagal / pending.
*   **Analisa**:
    *   Ini adalah webhook yang dipanggil oleh Payment Gateway (misal: Midtrans, Xendit).
    *   **Security**: Perlu validasi signature/token untuk memastikan request benar-benar dari Payment Gateway.
    *   **Handling Status**:
        *   `sukses`: Transaksi selesai.
        *   `gagal`: Stok harus dikembalikan (restock) otomatis.
        *   `pending`: Menunggu pembayaran.

---

## 2. Analisa Data Model (Database)

Berdasarkan fitur di atas, berikut adalah entitas yang dibutuhkan (selain `Customer` yang sudah ada):

### Entity: Book
Menyimpan data buku.
*   `id`: PK
*   `stock`: Integer (Penting untuk validasi)
*   `price`: Decimal
*   ... (detail lainnya)

### Entity: Cart & CartItem
Menyimpan keranjang belanja sementara user.
*   **Cart**: Milik 1 Customer.
*   **CartItem**:
    *   `book_id`: FK ke Book
    *   `quantity`: Jumlah yang ingin dibeli

### Entity: Transaction & TransactionItem
Menyimpan riwayat pesanan.
*   **Transaction**:
    *   `customer_id`: FK ke Customer
    *   `status`: ENUM (PENDING, SUCCESS, FAILED)
    *   `total_amount`: Snapshot total harga saat checkout
    *   `payment_method`: Disimpan setelah pembayaran
*   **TransactionItem**:
    *   `book_id`: FK ke Book
    *   `quantity`: Jumlah beli
    *   `price`: Snapshot harga buku *saat transaksi dibuat* (penting jika harga buku berubah di masa depan).

---

## 3. Spesifikasi API (Draft)

Berikut adalah rancangan endpoint yang dibutuhkan:

| Method | Endpoint | Deskripsi | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | List buku ready stock | Query: `page`, `limit` |
| **GET** | `/api/books/:id` | Detail buku | - |
| **GET** | `/api/cart` | Lihat isi keranjang | - |
| **POST** | `/api/cart` | Tambah ke keranjang | `{ "book_id": 1, "quantity": 1 }` |
| **DELETE** | `/api/cart/:itemId` | Hapus item keranjang | - |
| **POST** | `/api/checkout` | Proses Checkout | - (Ambil semua dari cart) |
| **POST** | `/api/callback/payment` | Webhook Payment | `{ "order_id": "...", "status": "success" }` |

---

## 4. Edge Cases yang Perlu Diperhatikan
1.  **Race Condition Stok**: User A dan B checkout buku terakhir bersamaan. Hanya satu yang boleh berhasil.
2.  **Stok Habis saat di Keranjang**: User tambah ke keranjang (stok ada), tapi saat checkout besoknya stok habis. Sistem harus menolak checkout.
3.  **Idempotency Callback**: Payment gateway mungkin mengirim callback yang sama berkali-kali. Sistem harus bisa handle agar status tidak berubah kacau (misal: sudah sukses jadi pending lagi).

---

# Analisa Requirement Fitur Admin

Berikut adalah analisa mendalam mengenai kebutuhan fitur untuk role **Admin** berdasarkan requirement yang diberikan.

## 1. Breakdown Fitur & Flow

### A. Manajemen Buku (Katalog)
*   **Requirement**:
    *   Melihat list semua buku dan detailnya (tidak terbatas pada stok).
    *   Menambah buku baru.
    *   Menambah/mengurangi stok buku.
    *   Menghapus buku.
*   **Analisa**:
    *   **List Buku**: Admin perlu melihat semua buku, termasuk yang stoknya 0 atau disembunyikan (jika ada fitur soft delete/hide).
    *   **Stock Management**:
        *   Fitur update stok harus atomik.
        *   Perlu validasi agar stok tidak menjadi negatif saat dikurangi.
        *   Log perubahan stok (stock movement) disarankan untuk audit trail (opsional tapi good practice).
    *   **Delete**:
        *   *Soft Delete vs Hard Delete*: Jika buku sudah pernah terjual, hard delete akan merusak referensi data transaksi. Disarankan menggunakan **Soft Delete** (`deletedAt`) atau validasi "tidak bisa hapus jika sudah ada transaksi".

### B. Monitoring Transaksi
*   **Requirement**: Mengecek list transaksi checkout beserta status pembayaran.
*   **Analisa**:
    *   Admin butuh dashboard untuk melihat semua pesanan masuk.
    *   Filter berdasarkan status (`pending`, `success`, `failed`) sangat penting.
    *   Detail transaksi harus menampilkan siapa pembelinya, item apa saja, dan total harga.

### C. Laporan Penjualan (Sales Report)
*   **Requirement**: Membuat laporan penjualan setiap buku (Jumlah terjual, Stok sisa, Total penghasilan).
*   **Analisa**:
    *   **Agregasi Data**: Laporan ini membutuhkan query agregasi (SUM, COUNT) dari tabel `TransactionItem` yang join ke `Transaction` (untuk filter status `success`) dan `Book`.
    *   **Periode Waktu**: Laporan biasanya butuh filter tanggal (misal: penjualan bulan ini).
    *   **Metrik**:
        *   `Total Terjual`: Sum quantity dari transaksi sukses.
        *   `Sisa Stok`: Stok saat ini di tabel Book.
        *   `Total Revenue`: Sum (quantity * price) dari transaksi sukses.

---

## 2. Analisa Data Model (Database)

Entitas yang sudah ada (`Book`, `Transaction`, `TransactionItem`) sudah cukup mendukung, namun perlu diperhatikan:

*   **Book**:
    *   Perlu field `deletedAt` (DateTime, nullable) jika menerapkan soft delete.
*   **Transaction**:
    *   Pastikan status `success` konsisten digunakan untuk perhitungan laporan.

---

## 3. Spesifikasi API (Draft)

Berikut adalah rancangan endpoint untuk Admin:

| Method | Endpoint | Deskripsi | Request Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/books` | List semua buku (termasuk stok 0) | Query: `page`, `limit`, `search` |
| **POST** | `/api/admin/books` | Tambah buku baru | `{ "title": "...", "price": 10000, ... }` |
| **PATCH** | `/api/admin/books/:id/stock` | Update stok | `{ "stock_change": 10 }` (+/-) |
| **DELETE** | `/api/admin/books/:id` | Hapus buku | - |
| **GET** | `/api/admin/transactions` | List transaksi | Query: `status`, `page` |
| **GET** | `/api/admin/reports/sales` | Laporan penjualan | Query: `start_date`, `end_date` |

---

## 4. Edge Cases & Catatan Khusus
1.  **Perubahan Harga**: Jika harga buku berubah, laporan pendapatan masa lalu tidak boleh berubah. Oleh karena itu, `TransactionItem` **wajib** menyimpan `price` saat transaksi terjadi (snapshot), bukan referensi ke harga buku sekarang.
2.  **Penghapusan Buku**: Jika admin menghapus buku yang sedang ada di keranjang user lain, apa yang terjadi?
    *   User harus divalidasi ulang saat checkout.
3.  **Concurrency Stok**: Saat admin update stok manual berbarengan dengan user checkout. Database transaction isolation level harus diperhatikan.

---

# Analisa Requirement Authentication & Authorization

Berikut adalah analisa mendalam mengenai kebutuhan **Authentication & Authorization** berdasarkan requirement yang diberikan.

## 1. Breakdown Fitur & Flow

### A. User Roles
*   **Requirement**: User memiliki role: customer atau admin.
*   **Analisa**:
    *   Role disimpan di field `role` pada tabel `Admin` dan `Customer`.
    *   Role digunakan untuk authorization (akses endpoint tertentu).
    *   Tidak ada role switching - user terdaftar sebagai customer atau admin sejak awal.

### B. Login & Password Security
*   **Requirement**: Login menggunakan email & password. Password disimpan secara aman.
*   **Analisa**:
    *   **Hashing Algorithm**: Gunakan **bcrypt** (sudah ada di dependencies) dengan salt rounds minimal 10.
    *   **Login Flow**:
        1. User kirim email + password.
        2. Sistem cari user berdasarkan email.
        3. Verifikasi password dengan `bcrypt.compare()`.
        4. Jika valid, generate token.
    *   **Security Best Practices**:
        *   Jangan return pesan spesifik "email salah" atau "password salah" - gunakan generic "Email atau password salah".
        *   Implementasi rate limiting untuk mencegah brute force (max 5 attempts per 15 menit).

### C. Access Token Management
*   **Requirement**: Setelah login, user menerima access token dengan masa berlaku 1 jam.
*   **Analisa**:
    *   **Token Type**: Bisa menggunakan:
        *   **JWT (JSON Web Token)**: Stateless, self-contained, cocok untuk scalability.
        *   **Random Token + Database**: Stateful, lebih mudah revoke.
    *   **Rekomendasi**: Gunakan **JWT** dengan struktur:
        ```json
        {
          "user_id": 123,
          "role": "customer",
          "iat": 1234567890,
          "exp": 1234571490
        }
        ```
    *   **Expiry**: 1 jam (3600 detik).
    *   **Storage**: Token disimpan di field `token` pada tabel `Admin`/`Customer` untuk validasi single device.

### D. Authentication Middleware
*   **Requirement**: Setiap API harus dicek authentication dengan access token.
*   **Analisa**:
    *   Middleware harus:
        1. Extract token dari header `Authorization: Bearer <token>`.
        2. Verify token (JWT signature atau cek di database).
        3. Cek apakah token expired.
        4. Attach user info ke `req.user` untuk digunakan di controller.
    *   **Public Endpoints** (tidak perlu auth):
        *   `POST /api/auth/register`
        *   `POST /api/auth/login`
        *   `GET /api/books` (customer bisa lihat tanpa login)
        *   `GET /api/books/:id`

### E. Single Device Policy
*   **Requirement**: Hanya 1 device aktif per user. Jika login di device lain, sesi sebelumnya otomatis logout.
*   **Analisa**:
    *   **Implementasi**:
        1. Saat login, generate token baru dan **replace** token lama di database.
        2. Middleware auth harus cek apakah token yang dikirim == token di database.
        3. Jika tidak match, return `401 Unauthorized`.
    *   **Alternative**: Simpan `device_id` atau `session_id` untuk tracking lebih detail.

---

## 2. Analisa Data Model (Database)

Schema saat ini sudah memiliki field `token` di `Admin` dan `Customer`, namun perlu ditambahkan:

*   **Field Tambahan (Opsional tapi Disarankan)**:
    *   `tokenExpiry` (DateTime): Untuk cek expiry di database (jika tidak pakai JWT).
    *   `deviceId` (String): Untuk tracking device yang login.
    *   `lastLoginAt` (DateTime): Audit trail.

Jika menggunakan JWT, field `token` cukup untuk menyimpan token terakhir (untuk single device validation).

---

## 3. Spesifikasi API (Draft)

Berikut adalah rancangan endpoint untuk Authentication:

| Method | Endpoint | Deskripsi | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register customer baru | ❌ |
| **POST** | `/api/auth/login` | Login (customer/admin) | ❌ |
| **POST** | `/api/auth/logout` | Logout dan invalidate token | ✅ |
| **GET** | `/api/auth/me` | Get current user info | ✅ |

---

## 4. Edge Cases & Catatan Khusus

1.  **Token Expiry Handling**:
    *   Frontend harus handle `401` response dan redirect ke login.
    *   Opsional: Implementasi refresh token untuk UX lebih baik (auto-refresh sebelum expired).

2.  **Concurrent Login**:
    *   User login di device A, lalu login di device B. Token A langsung invalid.
    *   User di device A akan mendapat `401` saat hit API berikutnya.

3.  **Logout**:
    *   Set field `token` menjadi `null` di database.
    *   Jika pakai JWT stateless, token tetap valid sampai expired (kecuali ada blacklist mechanism).

4.  **Password Reset** (Tidak disebutkan di requirement):
    *   Jika diperlukan, perlu endpoint `POST /api/auth/forgot-password` dan `POST /api/auth/reset-password`.

5.  **Admin Registration**:
    *   Tidak ada endpoint register untuk admin di spec saat ini.
    *   Admin biasanya dibuat manual via seeding atau endpoint khusus yang di-protect.

