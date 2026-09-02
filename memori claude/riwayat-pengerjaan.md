# Riwayat Pengerjaan

Catatan urutan pengerjaan beserta hasil pengujiannya. Berguna untuk menyusun
bab metodologi dan bab pengujian pada laporan.

---

## Sesi 1 - 2 September 2026: pembangunan aplikasi

### Yang dikerjakan

1. **Penyiapan** - Next.js 16 + TypeScript + Tailwind v4, Prisma 7,
   PostgreSQL lokal lewat `npx prisma dev`.
2. **Basis data** - 16 tabel, seluruh tabel anak `ON DELETE CASCADE` dari
   `resumes`.
3. **Autentikasi** - Auth.js v5, email + kata sandi (bcrypt 12 putaran) dan
   Google OAuth.
4. **Editor** - layar terbagi dua, simpan otomatis 0,8 detik, sorotan sinkron
   antara field dan hasilnya di pratinjau.
5. **Mesin penilaian ATS** - lima dimensi berbobot, berbasis kaidah.
6. **Ekspor** - PDF (lewat halaman cetak khusus), DOCX, teks polos, JSON.
7. **Tiga template** - Classic, Modern, Compact.

### Hasil pengujian

| Yang diuji | Hasil |
|---|---|
| Kata sandi tersimpan sebagai hash | `$2b$12$...`, 60 karakter |
| `/dashboard` tanpa sesi | 307 ke `/login` |
| `/api/resumes` tanpa sesi | 401 |
| Persistensi lintas sesi baru | seluruh perubahan utuh |
| Isolasi antar-pengguna | 404 pada baca, ubah, dan hapus |
| Baris yatim di basis data | 0 |
| Siklus ekspor - hapus - impor JSON | identik di luar id dan judul |
| Ekstraksi teks PDF | 77 baris, urutan benar |
| Struktur DOCX | tanpa tabel, kotak teks, maupun header/footer |
| Build production | berhasil, 20 route |

### Cacat yang ditemukan dan diperbaiki

1. Jabatan menempel dengan periode di aliran teks
   (`Frontend DeveloperFeb 2023`) - diperbaiki dengan spasi tak-putus.
2. CV kosong memperoleh skor 46 karena dimensi keterbacaan dan struktur lolos
   secara hampa - kini kedua dimensi ditandai tidak berlaku, skornya menjadi 4.
3. Ekstraksi kata kunci meloloskan kata kerja penghubung bahasa Indonesia.
4. Jumlah halaman jatuh ke 1 saat panel pratinjau disembunyikan.

### Kalibrasi skor

| Keadaan CV | Skor |
|---|---:|
| CV kosong | 4 |
| CV contoh, tanpa iklan lowongan | 98 |
| CV contoh (Frontend) vs lowongan Frontend Developer | 94 |
| CV contoh (Frontend) vs lowongan Backend Engineer | 85 |

Selisih dua baris terakhir menunjukkan dimensi kecocokan kata kunci memang
membedakan relevansi CV terhadap lowongan tertentu, meski mutu penulisannya
sama.

---

## Sesi 2 - 2 September 2026: identitas, responsif, keamanan, deploy

### Yang dikerjakan

1. **Identitas pembuat** - footer di setiap halaman, halaman Tentang, gambar
   pratinjau tautan, metadata situs. Sengaja tidak ikut pada CV pengguna.
2. **Halaman Panduan** - diagram alur 9 langkah, penjelasan tiap bagian CV,
   cara membaca skor, contoh poin pencapaian sebelum/sesudah, penanganan
   masalah.
3. **Halaman Tentang** - latar belakang, tujuan, perbandingan dengan pembuat
   CV lain, rancangan teknis, dan batasan yang diakui terbuka.
4. **Tata letak responsif** - editor di layar sempit menjadi satu panel per
   layar dengan bilah navigasi bawah; perbesaran pratinjau menyesuaikan lebar
   layar.
5. **Efek kedalaman** - kartu CV miring mengikuti kursor, lencana melayang,
   kemunculan saat tergulir. Seluruhnya CSS, tanpa pustaka 3D, dan mati bila
   sistem meminta pengurangan gerak.
6. **Keamanan** - pembatasan laju berbasis basis data (tabel ke-17), header
   keamanan menyeluruh, Content-Security-Policy.
7. **Ketahanan** - lumbung koneksi diperkecil, mengatasi galat
   `ConnectionClosed`.
8. **Halaman pendukung** - galat, tidak ditemukan, pemuatan, ikon situs,
   gambar pratinjau tautan, `robots.txt`, `sitemap.xml`, manifes aplikasi.
9. **Middleware** - pengalihan awal agar halaman terlindungi membalas 307,
   bukan 200 dengan kerangka pemuatan.
10. **Deploy** - Vercel + Neon Postgres (Singapore).

### Hasil pengujian responsif

Tujuh halaman diuji pada empat ukuran layar: 390, 768, 1280, dan 1680 piksel.

- Tidak ada halaman yang meluber ke samping.
- Tidak ada galat JavaScript.
- Perpindahan panel editor di layar sempit berfungsi.
- Perbesaran pratinjau di layar 390 piksel: 45% (kertas A4 muat selebar layar).

### Hasil pengujian di production

Sepuluh poin diuji langsung pada <https://cv-ats-builder-henna.vercel.app>:

| # | Yang diuji | Hasil |
|---|---|---|
| 1 | Halaman depan tayang | lulus |
| 2 | Masuk akun demo | lulus |
| 3 | Dashboard memuat CV | lulus |
| 4 | Simpan otomatis | lulus - "Tersimpan 16.10" |
| 5 | Sorotan pratinjau | lulus |
| 6 | Data bertahan di sesi baru | lulus |
| 7 | PDF terbentuk | lulus - 118.810 bytes, 2 halaman |
| 8 | Skor ATS terhitung | lulus - skor 95 |
| 9 | Editor di ponsel | lulus - perbesaran 45% |
| 10 | Isolasi antar-pengguna | lulus - dashboard kosong, CV orang lain diblokir |

**10 dari 10 lulus, 0 galat JavaScript.**

Ekstraksi teks dari PDF production: 2 halaman, 76 baris teks, seluruh field
kunci ditemukan (email, judul bagian, nama perusahaan, keahlian, IPK, periode
kerja).

### Cacat yang ditemukan dan diperbaiki

1. Perbesaran pratinjau di ponsel mentok pada nilai terkecil karena diukur
   saat panel masih tersembunyi.
2. Area kertas tertutup bilah navigasi bawah.
3. Galat lint React: `setState` dipanggil langsung di dalam effect pada empat
   berkas - diperbaiki memakai `useSyncExternalStore` dan ref callback.
4. Gambar pratinjau tautan gagal dibangun karena mesin perendernya menuntut
   `display` eksplisit dan tidak mengenal elemen `<br>`.
5. `prisma migrate dev` menghapus isi basis data lokal - migrasi kini dibuat
   manual lewat `migrate diff`.
6. Migrasi lewat koneksi pooled berisiko menggantung - konfigurasi CLI kini
   memilih koneksi langsung.

---

## Sesi 3 - 2 September 2026: GitHub, login Google, dan dokumen hukum

### Yang dikerjakan

1. **Kode dinaikkan ke GitHub.** Repositori
   `Zaky-Data-Science/cv-ats-builder` (privat), branch `main`, disambungkan
   ke Vercel sehingga setiap `git push` memicu deploy otomatis. Terverifikasi
   dengan satu push nyata yang menghasilkan deployment berstatus READY.
2. **Halaman kebijakan privasi dan ketentuan layanan.** Diperlukan Google
   untuk mempublikasikan aplikasi OAuth, tetapi memang sudah seharusnya ada
   mengingat aplikasi ini menyimpan isi CV lengkap dengan riwayat pendidikan
   dan pekerjaan penggunanya.
3. **Login Google diaktifkan sepenuhnya.** Project Google Cloud dibuat,
   layar persetujuan dikonfigurasi, OAuth Client ID dibuat dengan dua alamat
   callback (production dan lokal), lalu aplikasi dipublikasikan ke status
   **In production** sehingga dapat dipakai akun Google siapa pun.
4. **Middleware pengalihan awal.** Halaman terlindungi kini membalas 307,
   bukan 200 dengan kerangka pemuatan.
5. **Nama aplikasi diseragamkan** menjadi "CV ATS Builder" di seluruh
   antarmuka.

### Hambatan yang ditemui

| Hambatan | Penyelesaian |
|---|---|
| Token Vercel pertama ternyata hanya berizin baca - tidak dapat membuat project | Diganti dengan Access Token berizin penuh |
| Pembuatan basis data lewat API Vercel sudah ditutup (`This feature is no longer available`) | Disiapkan lewat integrasi Storage di dashboard |
| Google Cloud memblokir akses karena akun belum memakai verifikasi 2 langkah | Pemilik akun mengaktifkan 2FA terlebih dahulu |
| Tombol publikasi OAuth terkunci karena tautan privasi dan ketentuan belum ada | Dibuatkan halamannya di dalam aplikasi |
| Migrasi lewat koneksi pooled berisiko menggantung | Konfigurasi CLI memilih koneksi langsung bila tersedia |

### Hasil pengujian

| Yang diuji | Hasil |
|---|---|
| Halaman publik di production | 200 seluruhnya |
| Halaman terlindungi tanpa sesi | 307 ke `/login` |
| Header keamanan | lengkap; `X-Powered-By` tidak ada |
| Pendaftaran email di production | 201, dan 409 saat email diulang |
| Alur OAuth Google dari awal sampai akhir | berhasil masuk ke dashboard |
| Scope yang diminta | hanya `openid profile email` |
| Baris basis data setelah login Google | `passwordHash` NULL, `emailVerified` terisi, satu baris tautan provider |
| Rahasia yang ikut ter-push ke GitHub | tidak ada (93 berkas diperiksa) |

### Catatan keamanan

Kunci `AUTH_SECRET` yang sempat ditampilkan pada percakapan pengembangan
telah dirotasi, dan salinan environment production dihapus dari penyimpanan
sementara.

---

## Rangkuman angka

| Ukuran | Nilai |
|---|---:|
| Berkas kode (TypeScript, TSX, Prisma) | 68 |
| Baris kode | ~12.000 |
| Tabel basis data | 17 |
| Route aplikasi | 29 |
| Dimensi penilaian ATS | 5 |
| Bagian CV yang dapat diisi | 11 |
| Format unduhan | 4 |
| Template | 3 |
| Commit | 10 |
