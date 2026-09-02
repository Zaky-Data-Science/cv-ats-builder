# Mulai Di Sini

Catatan pengingat untuk melanjutkan project ini di lain waktu - baik oleh Anda
sendiri maupun oleh asisten AI - tanpa perlu menjelaskan ulang dari awal.

Berkas ini **tidak memuat kata sandi, token, maupun kredensial apa pun.**
Semua rahasia ada di dashboard Vercel dan di berkas `.env` lokal yang tidak
ikut masuk ke Git.

Terakhir diperbarui: **2 September 2026**

---

## 1. Project ini apa

**CV ATS Builder** - aplikasi web untuk menyusun CV yang terbaca sistem ATS
(*Applicant Tracking System*). Pengguna mengisi field terstruktur, melihat
hasilnya seketika di pratinjau A4, memperoleh skor ATS beserta saran
perbaikan, lalu mengunduh PDF/Word/teks/JSON. Datanya tersimpan permanen
sehingga dapat diedit kapan saja.

Dibangun sebagai **Tugas Akhir** Program Studi D3 Teknik Komputer,
Politeknik Negeri Samarinda, oleh **Muhammad Agus Riyadh Zaky**.

---

## 2. Status: sudah tayang

| Hal | Nilai |
|---|---|
| Alamat production | <https://cv-ats-builder-henna.vercel.app> |
| Akun demo | `demo@atscv.local` / `demo12345` |
| Tim Vercel | `zaky17` |
| Nama project Vercel | `cv-ats-builder` |
| Basis data | Neon Postgres (`neon-cerulean-anchor`), region Singapore, lewat integrasi Storage di Vercel |
| Folder kode | `D:\Website CV` |
| Repositori GitHub | <https://github.com/Zaky-Data-Science/cv-ats-builder> (privat, branch `main`) |
| Deploy otomatis | aktif - setiap `git push` ke `main` memicu deploy sendiri |

**Hasil uji terakhir di production: 10 dari 10 poin lulus, 0 galat
JavaScript.** Rinciannya ada di `docs/dokumentasi-teknis.md` bagian 6.

---

## 3. Cara menjalankan lagi di komputer

```bash
cd "D:\Website CV"

npm install          # bila node_modules terhapus
npm run db:dev       # nyalakan PostgreSQL lokal (catat nomor port-nya)
npm run dev          # buka http://localhost:3000
```

Bila basis data lokal kosong (mis. setelah komputer di-restart):

```bash
npm run db:seed      # membuat akun demo@atscv.local / demo12345
```

Bila nomor port `prisma dev` berubah, sesuaikan `DATABASE_URL` dan
`SHADOW_DATABASE_URL` di berkas `.env`.

### JEBAKAN PALING PENTING

> **Jangan pernah menjalankan `prisma migrate dev` terhadap basis data
> lokal `prisma dev`.** Perintah itu terbukti **menghapus seluruh isi tabel
> beserta tabel `_prisma_migrations`**. Sudah terjadi dua kali selama
> pengembangan.
>
> Bila `schema.prisma` diubah, buat berkas migrasinya secara manual:
>
> ```bash
> npx prisma migrate diff --from-migrations prisma/migrations \
>   --to-schema prisma/schema.prisma --script -o migration.sql
> ```
>
> Simpan hasilnya ke `prisma/migrations/<YYYYMMDDHHMMSS>_<nama>/migration.sql`,
> lalu jalankan SQL-nya ke basis data lokal. Di production tidak ada masalah
> ini - `prisma migrate deploy` berjalan normal saat deploy.

---

## 4. Cara deploy perubahan

```bash
npm run typecheck && npm run lint && npm run build   # gerbang kualitas
git add -A && git commit -m "pesan" && git push      # deploy jalan otomatis
```

Repositori GitHub sudah tersambung ke Vercel, jadi `git push` ke branch `main`
langsung memicu build dan deploy. Tidak perlu perintah `vercel` sama sekali.

Bila suatu saat ingin deploy manual tanpa lewat Git:

```bash
vercel login                                # sekali saja
vercel deploy --prod --yes --scope zaky17
```

Perintah build di `vercel.json` otomatis menjalankan
`prisma generate && prisma migrate deploy && next build`, sehingga skema basis
data production selalu mengikuti berkas migrasi tanpa langkah manual.

---

## 5. Peta kode

| Lokasi | Isi |
|---|---|
| `prisma/schema.prisma` | 17 tabel beserta relasinya |
| `src/lib/ats/engine.ts` | **Inti kebaruan project.** Mesin penilaian 5 dimensi |
| `src/lib/ats/vocabulary.ts` | Kata henti, kata kerja aksi, frasa klise |
| `src/lib/resume/types.ts` | Bentuk data CV yang dipakai seluruh aplikasi |
| `src/lib/resume/persist.ts` | Baca-tulis CV dalam satu transaksi |
| `src/lib/guard.ts` | Pemeriksaan sesi dan kepemilikan data |
| `src/components/preview/ResumeDocument.tsx` | Dokumen CV - dipakai pratinjau **dan** cetak |
| `src/components/editor/ResumeEditor.tsx` | Editor, simpan otomatis, tata letak responsif |
| `docs/` | Panduan pengguna, dokumentasi teknis, panduan deploy |

---

## 6. Keputusan penting dan alasannya

Bagian ini yang paling sering ditanyakan penguji. Alasannya disimpan di sini
supaya tidak perlu diingat-ingat lagi.

| Keputusan | Alasan |
|---|---|
| **PostgreSQL, bukan SQLite** | Rencana awal memakai SQLite, tetapi filesystem platform serverless bersifat sementara - berkas `.db` akan hilang setiap kali deploy ulang. |
| **Mesin penilaian berbasis kaidah, bukan model bahasa** | Deterministik: masukan sama selalu menghasilkan skor sama, sehingga hasil pengujian dapat direproduksi. Setiap angka juga dapat ditelusuri ke aturannya, dan tidak ada biaya maupun ketergantungan layanan luar. |
| **Penilaian berjalan di peramban** | Fungsi murni tanpa akses jaringan, jadi modul yang sama bisa dijalankan di sisi klien. Skor berubah seketika saat mengetik tanpa satu pun permintaan jaringan. |
| **Satu komponen untuk pratinjau dan cetak** | Menutup kemungkinan hasil PDF berbeda dari yang dilihat pengguna. |
| **PDF lewat halaman cetak khusus** | Halaman `/resume/[id]/print` hanya berisi dokumen CV, sehingga tidak ada elemen antarmuka yang perlu disembunyikan lewat CSS. Karena yang dicetak HTML biasa, teks PDF tetap dapat diseleksi - syarat mutlak agar terbaca ATS. |
| **Tanggal disimpan sebagai `String` "YYYY-MM"** | CV hanya butuh presisi bulan, cocok dengan `<input type="month">`, dan bebas dari bug zona waktu. |
| **Baris anak ditulis ulang, bukan didiff** | Id entri dibuat di sisi klien dan ikut dikirim, jadi kunci primer tetap stabil sementara jumlah kueri tetap dua per tabel. |
| **CV milik orang lain menghasilkan 404, bukan 403** | Agar keberadaan sebuah id pun tidak bocor ke pengguna lain. |
| **Pembatasan laju disimpan di basis data** | Di platform serverless setiap permintaan bisa dilayani instans berbeda; penghitung di memori mudah dilewati dan memberi rasa aman yang keliru. |
| **Efek 3D memakai CSS, bukan Three.js** | Penggunanya sedang melamar kerja, kerap dari ponsel kelas menengah. Menambah ratusan kilobyte demi hiasan berlawanan dengan tujuan aplikasinya. |
| **Migrasi lewat koneksi langsung, aplikasi lewat pooled** | PgBouncer mode transaksi tidak mendukung penguncian tingkat sesi yang dipakai Prisma saat migrasi. |
| **Kredit pembuat tidak ikut di CV** | CV adalah dokumen milik pelamar. Mencantumkan nama pihak lain akan membingungkan perekrut dan merugikan penggunanya. |
| **Tidak mencantumkan statistik "sekian persen CV ditolak ATS"** | Angka yang beredar luas itu tidak punya sumber primer yang dapat diverifikasi - berisiko dipertanyakan penguji. |

---

## 7. Cacat yang pernah ditemukan dan sudah diperbaiki

Berguna bila gejala serupa muncul lagi.

| Gejala | Sebab | Perbaikan |
|---|---|---|
| `Frontend DeveloperFeb 2023` menempel di teks PDF | Jabatan dan periode adalah dua item flex terpisah | Spasi tak-putus (U+00A0) di depan periode |
| CV kosong memperoleh skor 46 | Dimensi keterbacaan dan struktur lolos hampa - aturannya berbentuk "tidak boleh ada X" | Kedua dimensi ditandai tidak berlaku selama CV belum berisi. Kini skornya 4 |
| Kata kunci lowongan meloloskan "menguasai", "memahami" | Kata kerja penghubung belum masuk daftar kata henti | Daftar kata henti diperluas |
| Jumlah halaman jatuh ke 1 | Panel tersembunyi bertinggi nol | Pengukuran bertinggi nol diabaikan |
| Perbesaran ponsel mentok 28% | Diukur saat panel masih tersembunyi | Pengukuran ditunda sampai panel terlihat |
| Galat `ConnectionClosed` | Koneksi menganggur ditutup server lebih dulu | Lumbung koneksi diperkecil, koneksi menganggur ditutup cepat |
| `/dashboard` membalas 200 tanpa login | Kerangka pemuatan sempat dialirkan sebelum pengalihan | Middleware mengalihkan lebih awal, kini 307 |

---

## 8. Yang belum dikerjakan

Daftar ini sengaja jujur - berguna sebagai bab saran pengembangan lanjutan.

1. **Login Google belum dinyalakan - terhalang 2FA.** Sejak 16 Mei 2026
   Google Cloud mewajibkan verifikasi 2 langkah, dan akun
   `riyadhzaky05@gmail.com` belum mengaktifkannya, sehingga Google Cloud
   Console menolak akses sama sekali ("Google Cloud access blocked").
   Urutannya: aktifkan 2FA di <https://myaccount.google.com/signinoptions/twosv>,
   tunggu beberapa menit, baru ikuti `docs/deploy.md` bagian 7.
   Kode aplikasinya sendiri sudah siap - tombol "Masuk dengan Google" muncul
   otomatis begitu `AUTH_GOOGLE_ID` dan `AUTH_GOOGLE_SECRET` diisi di Vercel,
   tanpa perlu mengubah kode apa pun.
2. **Repositori masih privat.** Untuk menjadikannya publik (mis. agar
   tautannya dapat dicantumkan di jurnal): buka Settings repositori di GitHub,
   gulir ke bawah, pilih "Change repository visibility". Perlu diingat,
   menjadikan repo publik tidak dapat ditarik kembali sepenuhnya karena
   isinya dapat terlanjur disalin orang lain.
3. **Belum ada berkas uji otomatis di dalam repositori.** Verifikasi selama
   ini dijalankan lewat skrip terpisah terhadap aplikasi yang berjalan.
4. **Pemulihan kata sandi lewat surel belum ada** - memerlukan layanan
   pengirim surel.
5. **Pencocokan kata kunci masih leksikal.** "frontend" dan "front-end"
   dikenali berbeda; sinonim belum dikenali.
6. **Foto lewat tautan gambar, belum unggah berkas.**
7. **CSP masih memuat `'unsafe-inline'`** pada script-src, karena Next.js
   menyisipkan skrip bootstrap sebaris.

---

## 9. Bila memakai bantuan AI lagi

Cukup sampaikan hal-hal ini:

> Project di `D:\Website CV`. Baca `memori claude/MULAI-DI-SINI.md` lebih dulu,
> lalu `docs/dokumentasi-teknis.md`. Sudah tayang di
> cv-ats-builder-henna.vercel.app. Jangan jalankan `prisma migrate dev` di
> basis data lokal. Sebelum menyatakan selesai, jalankan
> `npm run typecheck && npm run lint && npm run build`.

Catatan gaya yang dipakai di seluruh kode ini:

- Seluruh komentar, nama halaman, dan teks antarmuka memakai **bahasa
  Indonesia**.
- Komentar menjelaskan **alasan**, bukan mengulang isi kode.
- Setiap perubahan diverifikasi dengan menjalankan aplikasinya, bukan sekadar
  diasumsikan berhasil.
