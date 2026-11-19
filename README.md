# OpsDash — Mini Operational Dashboard

Dashboard operasional untuk manajemen inventaris aset, pencatatan transaksi barang (peminjaman, restock, pengembalian), dan pemantauan aktivitas log secara real-time.

Proyek ini dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, dan **Recharts**.

---

## Fitur Utama

- **Manajemen Inventaris (CRUD)**: Kelola data barang mencakup nama, kategori, lokasi gudang, stok, dan status (`Available`, `Low Stock`, `Maintenance`).
- **Mutasi Stok Otomatis**:
  - `borrow`: Mengurangi stok secara otomatis dengan validasi pencegahan stok negatif (*insufficient stock*).
  - `restock` & `return`: Menambah jumlah stok secara otomatis.
  - **Auto-status**: Status barang otomatis diperbarui ke `Low Stock` jika jumlah stok $\le 3$.
  - **Maintenance Lock**: Barang dengan status `Maintenance` diproteksi dari transaksi baru.
- **Filter & Sorting**: Pencarian nama/kategori barang, filter berdasarkan status, lokasi gudang, atau kategori, serta pengurutan data tabel secara ascending/descending.
- **Visualisasi & Statistik**: Ringkasan metrik operasional (total aset, total stok, stok kritis, barang siap pakai) dan grafik tren transaksi 7 hari terakhir.
- **Activity Log**: Riwayat transaksi operasional terbaru secara real-time.
- **Dark & Light Mode**: Dukungan tema gelap dan terang yang tersimpan di browser.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons & Animation**: Lucide React & Framer Motion
- **Notifications**: React Hot Toast

---

## Cara Menjalankan Proyek

### Prasyarat
- Node.js (v18.17+ atau v20+)
- npm, yarn, atau pnpm

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser.

### 3. Build Production
```bash
npm run build
npm run start
```

### 4. Linting
```bash
npm run lint
```

---

## Dokumentasi API

### Items (`/api/items`)
- `GET /api/items`: Mengambil daftar inventaris barang.
  - Query parameters:
    - `search`: Pencarian nama atau kategori
    - `status`: Filter status (`Available`, `Low Stock`, `Maintenance`)
    - `location`: Filter lokasi gudang
    - `category`: Filter kategori
    - `sortBy`: Kolom sortir (`name`, `category`, `stock`, `status`, `location`, `updatedAt`)
    - `sortOrder`: `asc` atau `desc`
- `POST /api/items`: Menambahkan item baru ke inventaris.
  - Body:
    ```json
    {
      "name": "Sound System JBL",
      "category": "Electronics",
      "stock": 10,
      "status": "Available",
      "location": "Gudang B"
    }
    ```

### Single Item (`/api/items/[id]`)
- `GET /api/items/[id]`: Mengambil data item berdasarkan ID.
- `PATCH /api/items/[id]`: Memperbarui data item.
- `DELETE /api/items/[id]`: Menghapus item dari inventaris.

### Transactions (`/api/transactions`)
- `GET /api/transactions`: Mengambil riwayat log transaksi operasional.
- `POST /api/transactions`: Mencatat transaksi mutasi stok.
  - Body:
    ```json
    {
      "itemId": "<item-id>",
      "type": "borrow",
      "quantity": 2,
      "note": "Peminjaman operasional"
    }
    ```
  - *Tipe transaksi*: `borrow` (pinjam), `restock` (tambah stok), `return` (kembalikan).
  - *Validasi*: Mengembalikan status `400` bila stok tidak mencukupi atau barang berstatus `Maintenance`.

### Operational Stats (`/api/stats`)
- `GET /api/stats`: Mengembalikan ringkasan data operasional:
  - `totalItems`: Total jenis barang
  - `totalStock`: Total akumulasi unit barang
  - `lowStockCount`: Jumlah barang dengan stok rendah ($\le 3$)
  - `maintenanceCount`: Jumlah barang dalam perawatan
  - `availableCount`: Jumlah barang siap pakai
  - `recentTransactions`: 10 transaksi terakhir
  - `transactionTrend`: Data mutasi transaksi 7 hari terakhir untuk visualisasi grafik
