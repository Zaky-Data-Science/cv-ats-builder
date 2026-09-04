# Uji Manual — hal-hal yang tidak bisa dibuktikan uji otomatis

Uji otomatis di `npm test` menutup 708 pemeriksaan. Lima hal di bawah ini tidak
dapat ditutup olehnya: papan ketik, mata manusia, penghapusan yang sungguhan, dan
keadaan setelah aplikasi hidup di internet.

Perkiraan waktu seluruhnya: **35 menit.**

---

## Persiapan

1. Pastikan server pengembangan berjalan:

   ```bash
   npm run dev
   ```

2. Buka `http://localhost:3000`.
3. **Untuk Uji 4 saja**, basis data lokal harus ikut hidup - Uji 1-3 memakai
   `/coba` yang tidak menyentuh basis data sama sekali:

   ```bash
   npm run db:dev     # PostgreSQL lokal
   npm run db:seed    # akun demo - jangan pakai akun pribadi
   ```

   Email dan kata sandinya tercetak di layar setelah `db:seed` selesai.

---

## Uji 1 — Navigasi papan ketik (10 menit)

**Kenapa diuji:** sebagian orang tidak memakai tetikus sama sekali. Kalau ada
tombol yang tidak bisa dicapai dengan Tab, bagi mereka tombol itu tidak ada.

**Langkahnya:**

1. Buka `http://localhost:3000/coba`.
2. Klik satu kali di area kosong paling atas halaman, lalu **jangan sentuh
   tetikus lagi sampai uji ini selesai.**
3. Tekan **Tab** berulang kali dari atas sampai bawah halaman.
4. Perhatikan tiga hal di setiap perhentian:

| Yang diperiksa | Lulus bila | Gagal bila |
|---|---|---|
| Terlihat | Ada garis/cincin fokus yang jelas di elemen yang sedang aktif | Fokus "hilang" — tidak tahu sedang di mana |
| Urutannya masuk akal | Berpindah kiri→kanan, atas→bawah, mengikuti tampilan | Melompat jauh ke bagian lain lalu balik lagi |
| Tidak terjebak | Tab selalu bisa maju terus | Fokus terkunci di satu bagian, tidak bisa keluar |

5. Uji khusus yang penting untuk fitur baru:
   - Sampai ke kotak **"Apa jurusan atau profesi Anda?"**, ketik `PWK`, lalu
     turunkan pilihan dengan **panah bawah** dan pilih dengan **Enter**.
     → Harus bisa memilih tanpa tetikus sama sekali.
   - Sampai ke tombol **panah naik/turun** di kanan judul bagian, tekan **Enter**.
     → Urutan bagian harus benar-benar berpindah.
   - Tekan **Shift+Tab** beberapa kali. → Harus mundur mengikuti jalur yang sama.

6. Terakhir, tekan **Escape** saat sebuah panel terbuka. → Panel menutup, dan
   fokus kembali ke tombol yang membukanya (bukan lompat ke awal halaman).

**Kalau ada yang gagal:** catat nama tombolnya, lalu minta perbaikan di jendela
Claude Code — sebutkan persis pada langkah mana fokusnya hilang atau terjebak.

---

## Uji 2 — Alur fitur baru dari awal sampai berkas jadi (15 menit)

**Kenapa diuji:** uji otomatis memeriksa potongan-potongan. Ini memeriksa
pengalaman utuhnya, seperti yang dialami orang sungguhan.

1. Buka `http://localhost:3000/coba`. Halaman ini menyimpan CV-nya di
   `localStorage`, dan **tidak ada tombol "mulai dari nol"** di sana. Kalau
   masih ada data lama, buang lewat konsol peramban (F12 → Console):

   ```js
   localStorage.removeItem("atscv-cv-tamu"); location.reload();
   ```

   Cara lain yang sama bersihnya: buka `/coba` di jendela penyamaran.

2. **Tiga pertanyaan pembuka.** Ketik `Teknik Sipil` → pilih hasilnya.
   Keperluan: **Melamar kerja**. Pengalaman: **Mahasiswa**.
   → Bentuk yang muncul harus **Proyek Teknis**. Tekan **Simpan jawaban**.

3. **Isi bagian Proyek.** Buka bagian **Proyek**, tambah satu item, isi:
   judul, peran, **Klien/institusi** (wajib), tanggal mulai–selesai, satu
   ringkasan, dan dua poin yang **memuat angka**.
   → Isian yang muncul harus persis milik pola Proyek Teknis: **Jenis proyek**,
   **Skala**, **Tahap keterlibatan**, **Standar & kode**, **Perkakas**, dan
   **Hasil terukur**. Yang khas teknik sipil bukan daftar isiannya - itu milik
   polanya - melainkan **saran isian** di dalamnya (SNI, dan seterusnya), yang
   datang dari kamus bidang.

4. **Isi hasil terukur dengan angka**, misal `Selesai 3 minggu lebih cepat,
   efisiensi biaya 4,2%`.
   → Buka tab **Kekuatan CV** di kanan. Angka **Kekuatan & Keterbacaan** harus
   naik, dan kotak **Rincian kekuatan bukti** menyebut Peranan dan Kesulitan
   per karya.

5. **Uji validator bahasa.** Ubah satu poin jadi diawali kata `Kami`, misalnya
   `Kami membangun sistem drainase`.
   → Harus muncul peringatan tepat di bawah poin itu, dengan usul penulisan ulang.
   Kembalikan lagi ke bentuk semula setelahnya.

6. **Uji ganti bentuk tidak menghapus data.** Tekan **"Bukan ini? Ganti bentuknya"**
   → pilih **Karya & Desain**.
   → Judul, peran, klien, dan tanggal **harus tetap ada**. Isian khas teknik sipil
   berpindah ke "data dari bentuk sebelumnya" dan bisa dipulihkan.
   Kembalikan ke **Proyek Teknis**, lalu pastikan isiannya benar-benar kembali.

7. **Unduh tiga berkas** lewat menu **Tindakan lain**: **Cetak atau simpan
   PDF**, **Unduh Word (.docx)**, dan **Unduh teks (.txt)**.
   → Buka ketiganya. Bagian portofolio harus muncul di ketiganya dengan isi yang
   sama, satu kolom, dan tautannya terbaca sebagai teks biasa
   (`github.com/...`), bukan cuma kata "Portofolio".

8. **Uji di Word secara khusus:** buka berkas `.docx`, lalu klik dua kali di area
   paling atas halaman (kepala halaman).
   → Harus **kosong**. Semua isi CV berada di badan dokumen.

---

## Uji 3 — Mode Redaksi pada berkas sungguhan (5 menit)

**Kenapa diuji:** menyamarkan setengah lebih berbahaya daripada tidak menyamarkan
sama sekali — penggunanya mengira sudah aman.

1. Pada item portofolio yang tadi, nyalakan **Mode Redaksi**.
2. Unduh ulang **PDF**, **Word**, dan **Teks**.
3. Buka ketiganya dan **cari nama klien yang asli** (pakai Ctrl+F).
   → Harus **tidak ditemukan** di ketiganya, termasuk di baris "Detail".
4. Periksa angkanya. → Angka pasti (`137`) harus berubah jadi rentang
   (`100-200`). Tahun tidak ikut disamarkan — itu memang disengaja.
5. Unduh **Simpan berkas cadangan** (JSON) dan buka dengan Notepad.
   → Di sini nama klien dan angka asli **harus masih ada**. Ini berkas cadangan
   milikmu sendiri, bukan berkas yang dikirim ke perusahaan.

---

## Uji 4 — Hapus akun dan rantai penghapusannya (5 menit)

> ⚠️ **Uji ini menghapus data sungguhan. Pakai akun demo, bukan akunmu.**

**Kenapa diuji:** kalau rantai penghapusannya putus, data seseorang tetap
tertinggal di basis data setelah ia minta dihapus. Uji otomatis hanya membaca
bentuk relasinya, tidak benar-benar menghapus.

1. Masuk dengan akun demo (`npm run db:seed` menampilkan email dan kata sandinya).
2. Buat satu CV, isi satu item portofolio, **isi juga kolom Verifikator**
   (nama dan jabatan siapa saja).
3. Simpan, lalu keluar dan masuk lagi. → Datanya harus masih ada.
4. Buka **Pengaturan** → bagian **Hapus Akun** → tombol **Hapus akun saya**.
   Ikuti konfirmasinya.
5. Buka `http://localhost:3000/login`, coba masuk lagi dengan akun demo.
   → Harus **ditolak**. Akunnya sudah tidak ada.
6. Pemeriksaan terakhir, jalankan di terminal:

   ```bash
   npm run db:studio
   ```

   Di jendela yang terbuka, lihat tabel `resumes`, `projects`, dan
   `certifications`.
   → Baris milik akun demo tadi harus **hilang seluruhnya**. Kalau masih ada
   baris yatim (tidak punya pemilik), rantai penghapusannya bocor — laporkan.

7. Kembalikan akun demonya kalau masih dibutuhkan:

   ```bash
   npm run db:seed
   ```

---

## Uji 5 — Setelah `git push` (5 menit)

Vercel menjalankan `prisma generate && prisma migrate deploy && next build`.
Migrasinya berjalan sendiri sebelum kode baru hidup. Kalau migrasinya gagal,
build gagal dan **versi lama tetap melayani pengunjung** — itu kegagalan yang
aman.

1. Buka dasbor Vercel → tab **Deployments**. Tunggu sampai status **Ready**.
2. Kalau statusnya **Error**, buka lognya dan cari baris `prisma migrate deploy`.
   Jangan panik: situs lama masih hidup. Salin pesan galatnya.
3. Setelah Ready, buka alamat produksinya, lalu:
   - Masuk dengan akun yang sudah ada. → CV lama harus terbuka **utuh**.
   - Periksa nilainya. → Bagian portofolio **mati** untuk CV lama, dan angkanya
     tidak berubah dari sebelum deploy.
   - Buat CV baru, jawab tiga pertanyaan pembuka. → Bentuk portofolio muncul.
   - Unduh PDF sekali. → Berhasil, isinya benar.
4. Kalau ada yang salah, kembalikan lewat Vercel: **Deployments** → pilih deploy
   sebelumnya → **Promote to Production**. Kolom basis data yang sudah bertambah
   tidak mengganggu kode lama, karena seluruhnya punya nilai bawaan.

---

## Ringkasan: apa artinya kalau gagal

| Uji | Kalau gagal | Seberapa mendesak |
|---|---|---|
| 1 Papan ketik | Sebagian orang tidak bisa memakai fitur itu sama sekali | Perbaiki sebelum push |
| 2 Alur utuh | Fitur intinya tidak bekerja seperti yang dijanjikan | Perbaiki sebelum push |
| 3 Mode Redaksi | Data yang dikira aman ternyata bocor ke berkas lamaran | **Perbaiki sekarang juga** |
| 4 Hapus akun | Data orang tertinggal setelah ia minta dihapus | **Perbaiki sekarang juga** |
| 5 Produksi | Kembalikan lewat Promote to Production, lalu telusuri | Tangani saat itu juga |
