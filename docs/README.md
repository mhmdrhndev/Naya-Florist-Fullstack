# Naya Florist - Everlasting Bloom Storefront

Naya Florist adalah website katalog produk buket bunga premium yang dirancang menggunakan arsitektur statis modern berkinerja tinggi. Website ini memamerkan berbagai kreasi bunga abadi (everlasting florals) seperti *Silk Series*, *Dried Series*, *Paper Couture*, dan *Preserved Collection* dengan sistem pemesanan langsung terintegrasi ke WhatsApp.

---

## 📂 Struktur Project

Struktur berkas pada direktori proyek dikelompokkan secara modular agar mudah dikembangkan dan dipelihara:

```
d:\Naya Florist\
├── index.html            # Halaman Utama (Hero Banner, Keunggulan, Galeri Pilihan)
├── collections.html      # Katalog Koleksi (Filter Kategori Material, Pagination)
├── product.html          # Detail Produk (Galeri Foto, Pemilih Warna, Rekomendasi Terkait)
├── about.html            # Cerita Kami / Tentang Naya Florist
├── css/
│   └── custom.css        # Sistem CSS kustom (Keyframes Animasi, Efek Cahaya, WhatsApp FAB)
├── js/
│   ├── products.js       # Database Produk Statis (Daftar Bouquet & Atribut Produk)
│   ├── whatsapp.js       # Generator Teks WhatsApp & Floating Action Button (FAB)
│   ├── main.js           # Kontroler Interaksi Utama (Sticky Nav, Mobile Drawer, Care Guide Modal, Kelopak Gugur)
│   └── tailwind-config.js# Konfigurasi Tema Kustom Tailwind CSS (Palet Warna Plum/Sage/Ivory)
└── docs/
    └── changelog/
        └── pending.md    # Log Pembaruan & Riwayat Perubahan File
```

---

## 🏛️ Arsitektur & Teknologi

Website ini dibangun menggunakan prinsip kering (*DRY*), portabilitas tinggi, dan kecepatan muat halaman yang optimal:

1. **Statis & Bebas Server (Serverless)**:
   Seluruh data produk dikelola secara lokal di dalam berkas [products.js](file:///d:/Naya%20Florist/js/products.js) sebagai array statis `PRODUCTS`. Hal ini menghilangkan latensi koneksi database (seperti Supabase) dan memastikan website dapat di-host secara gratis dengan performa instan di platform statis seperti Vercel, Netlify, atau GitHub Pages.

2. **Tailwind CSS & Konfigurasi Tema Terpusat**:
   Menggunakan Tailwind CSS untuk tata letak responsif yang cepat. Konfigurasi warna merek (merek Plum Magenta `#9b1e63`, Sage Green `#5a7a71`, dan latar Ivory `#fcf9f5`) dipusatkan di [tailwind-config.js](file:///d:/Naya%20Florist/js/tailwind-config.js) agar konsisten di semua halaman.

3. **Sistem Animasi Premium & Akselerasi GPU**:
   Animasi dirancang secara efisien menggunakan CSS murni di [custom.css](file:///d:/Naya%20Florist/css/custom.css) untuk mengurangi beban prosesor:
   * **Ken Burns Effect**: Gambar utama hero banner melakukan perbesaran dan pergeseran lambat secara otomatis.
   * **Falling Petals Confetti**: Kelopak bunga mawar berguguran secara acak di latar belakang hero banner menggunakan generator DOM berkinerja tinggi.
   * **Luxury Shine Sweep**: Efek kilatan cahaya diagonal saat kursor diarahkan (*hover*) pada foto produk dan gambar editorial.
   * **Sliding Underline**: Animasi garis bawah menu navigasi yang bergeser secara halus tanpa mengubah tinggi atau menggeser posisi teks (*layout shift*).

4. **Scroll Reveal Adaptif**:
   Pemuatan konten secara bertahap saat pengguna menggulir halaman (*fade-in slide-up*) menggunakan API performa tinggi `IntersectionObserver` di JavaScript untuk menghindari penurunan frame rate.

---

## 💬 Alur Pemesanan & Integrasi WhatsApp

Karena Naya Florist berfokus pada buket buatan tangan premium (*artisanal & made-to-order*), sistem keranjang belanja konvensional digantikan dengan konsultasi langsung:

1. **Konsultasi via WhatsApp (CTA)**:
   Setiap kartu produk di katalog maupun tombol utama di halaman detail produk langsung membuka obrolan WhatsApp dengan pesan kustom yang terisi otomatis.
2. **Penyusunan Pesan Dinamis**:
   Pesan WhatsApp disusun secara dinamis di [whatsapp.js](file:///d:/Naya%20Florist/js/whatsapp.js) sesuai produk dan opsi warna yang dipilih konsumen:
   > *Halo Admin Naya Florist! Saya tertarik dengan buket berikut: **[Nama Produk] (Warna: [Pilihan Warna])**. Material: [Jenis Material]. Bisa dibantu info mengenai detail harga, ketersediaan, dan pengirimannya? Terima kasih!*
3. **Floating Action Button (FAB)**:
   Tombol melayang WhatsApp berwarna hijau yang elegan disisipkan secara dinamis di sudut kanan bawah setiap halaman untuk memudahkan konsumen berkonsultasi secara umum kapan saja.

---

## 🛠️ Panduan Pemeliharaan (Maintenance)

### 1. Menambah atau Mengubah Produk
Semua data produk disimpan di dalam berkas [products.js](file:///d:/Naya%20Florist/js/products.js). Untuk menambah produk baru, tambahkan objek baru ke dalam array `DEFAULT_PRODUCTS`:

```javascript
{
    id: 13, // ID unik bertingkat
    name: "Golden Autumn",
    category: "Dried", // Pilihan: Silk, Dried, Paper, Preserved
    material: "Preserved Wheat & Dried Peonies",
    description: "Buket bernuansa hangat musim gugur dengan perpaduan gandum abadi dan bunga peony kering pilihan.",
    image: "https://url-gambar-anda.com/autumn.jpg",
    gallery: [
        "https://url-gambar-anda.com/autumn.jpg",
        "https://url-gambar-anda.com/autumn-detail.jpg"
    ],
    colors: [
        { name: "Warm Amber", hex: "#e5a93b" },
        { name: "Creamy Oats", hex: "#f5ebd6" }
    ],
    featured: true // Set true untuk menampilkan di halaman utama (Curated Gallery)
}
```

### 2. Mengubah Nomor WhatsApp Tujuan
Untuk memperbarui nomor WhatsApp tujuan admin, cukup ubah konstanta `NAYA_WHATSAPP_NUMBER` di bagian atas berkas [products.js](file:///d:/Naya%20Florist/js/products.js):
```javascript
const NAYA_WHATSAPP_NUMBER = "6285111226048"; // Gunakan format kode negara tanpa simbol '+' atau spasi
```

### 3. Panduan Perawatan Bunga (Care Guide Modal)
Fitur popup petunjuk perawatan bunga dimuat secara dinamis melalui JavaScript di [main.js](file:///d:/Naya%20Florist/js/main.js). Jika tautan dengan teks mengandung kata "Care Guide" atau "Panduan" diklik oleh pengguna, popup modal interaktif akan otomatis muncul tanpa memerlukan markup HTML tambahan di halaman tersebut.
