# CV & Portofolio ATS

Aplikasi web yang berdiri di **dua pilar**: CV yang terbaca sistem *Applicant Tracking
System* (ATS), dan portofolio yang membuktikan kemampuan di baliknya. Keduanya disusun
dari data yang sama, lewat field terstruktur, dengan pratinjau seukuran kertas
sebenarnya, penilaian beserta saran perbaikan, ekspor PDF/Word/teks/JSON, dan
penyimpanan permanen sehingga dapat diedit kembali kapan saja.

Keduanya sengaja tidak dilebur, karena pembacanya memang berbeda:

| | CV | Portofolio |
|---|---|---|
| Dibaca | mesin dulu, lalu perekrut sekitar 6 detik | manusia yang ahli di bidangnya - pelan dan teliti |
| Menjawab | "pantas diwawancara?" | "benar-benar bisa?" |
| Bentuk | satu kolom, tanpa tabel, tanpa gambar | bebas - boleh gambar dan studi kasus |
| Panjang | 1-2 halaman | 3-5 karya terkuat, dibahas mendalam |
| Dinilai dari | kata kunci dan keterbacaan mesin | kedalaman penalaran dan hasilnya |

> **Keadaan hari ini:** portofolio berupa **bagian di dalam CV** yang bentuk isiannya
> mengikuti pola pembuktian bidang penggunanya - bukan berkas terpisah. Berkas
> portofolio yang berdiri sendiri belum ada dan sedang direncanakan; lihat
> [Portofolio Berbasis Pola](#portofolio-berbasis-pola).

Aplikasi ini juga dapat **memindai dan membandingkan CV yang sudah ada** - berkas PDF
atau Word dari mana pun dibaca dan dinilai langsung di dalam peramban, tanpa pernah
dikirim ke server.

> Muhammad Agus Riyadh Zaky
> Mahasiswa D3 Teknik Komputer, Politeknik Negeri Samarinda

**Coba langsung:** <https://cv-ats-builder-henna.vercel.app>

Tidak perlu mendaftar - tombol **Coba tanpa akun** membuka editornya seketika, dan
CV-nya tersimpan di peramban Anda sendiri. Untuk melihat versi berakun lengkap
dengan CV contoh, masuk memakai `demo@atscv.local` / `demo12345`; akun itu memang
dipakai bersama, jadi jangan menaruh data pribadi di dalamnya.

**Dokumentasi lain:**
- [Panduan Pengguna](docs/panduan-pengguna.md) - cara memakai aplikasi, lengkap dengan diagram alur
- [Dokumentasi Teknis](docs/dokumentasi-teknis.md) - ERD, use case, arsitektur, aturan penilaian, hasil verifikasi
- [Panduan Deploy](docs/deploy.md) - menaikkan aplikasi ke internet lewat Vercel dan Neon
- [Diagram alur](docs/diagram/) - flowchart dan workflow dalam bentuk SVG dan PNG, dibangkitkan dari kode

---

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Menjalankan di Komputer Sendiri](#menjalankan-di-komputer-sendiri)
- [Akun Demo](#akun-demo)
- [Struktur Project](#struktur-project)
- [Cara Data Disimpan](#cara-data-disimpan)
- [Portofolio Berbasis Pola](#portofolio-berbasis-pola)
- [Mesin Penilaian](#mesin-penilaian)
- [Menyalakan Login Google](#menyalakan-login-google)
- [Deploy ke Internet (Gratis)](#deploy-ke-internet-gratis)
- [Pengujian](#pengujian)
- [Perintah yang Tersedia](#perintah-yang-tersedia)
- [Lisensi](#lisensi)

---

## Fitur

| Fitur | Keterangan |
|---|---|
| Field terstruktur | 11 section CV, masing-masing dengan field sendiri, teks petunjuk, dan contoh pengisian |
| Pratinjau langsung | CV ukuran A4 di sebelah kanan berubah seketika saat mengetik |
| Sorotan sinkron | Memfokuskan sebuah field akan menyorot bagian terkait di pratinjau |
| Ketik langsung di kertas | Nama, jabatan, ringkasan, judul entri, dan poin pencapaian dapat diketik langsung di atas kertas seperti di pengolah kata - dan field di panel kiri ikut berubah, karena keduanya satu data yang sama |
| Isi data contoh | Satu klik mengisi seluruh CV dengan contoh lengkap dan realistis |
| Simpan otomatis | Perubahan tersimpan ke basis data 0,8 detik setelah berhenti mengetik |
| Banyak CV per akun | Duplikasi CV untuk disesuaikan dengan tiap lowongan |
| Multi-pengguna | Login email+kata sandi dan/atau Google; data tiap akun terpisah penuh |
| Dua angka, bukan satu | **Kekuatan CV** (mutu dokumennya sendiri) dan **Kecocokan Lowongan** (seberapa cocok dengan satu iklan) dihitung terpisah, disertai saran perbaikan yang dapat diklik |
| 6 dimensi berbobot | Lima dimensi asli ditambah Kekuatan Bukti Karya; bobotnya bergeser sendiri saat bagian portofolio dinyalakan |
| Portofolio berbasis pola | Bagian Proyek berubah bentuk mengikuti **pola pembuktian** yang dipilih - lima pola, bukan satu formulir untuk semua profesi |
| Kamus 21 bidang | Mengetik jurusan menghasilkan tebakan pola beserta saran isian yang khas bidang itu |
| Kredensial berkategori | Empat kategori (lisensi praktik, kredensial berjenjang, sertifikasi sektoral, sertifikasi kompetensi & vendor) dengan masa berlaku yang mengenal "seumur hidup" |
| Penghitung SKP | Perolehan terhadap ambang resmi profesinya, lengkap dengan sumber peraturan dan tanggal periksanya. Tidak pernah ikut tercetak di CV |
| Mode Redaksi | Nama klien menjadi deskriptor bidang dan angka pasti menjadi rentang - untuk karya yang terikat perjanjian kerahasiaan |
| Penanda bahasa | Kalimat ber-"kami" dan kata kerja kabur ditandai tepat di bawah kotak isiannya |
| Pencocokan lowongan | Tempel iklan lowongan untuk melihat kata kunci yang belum ada di CV |
| 10 template | Delapan tanpa foto, dua berfoto - seluruhnya satu kolom dan aman untuk ATS |
| 4 ukuran kertas | A4 (bawaan dan disarankan), Letter, Legal, dan F4 |
| Margin dapat disetel | Bawaannya mengikuti template, tetapi dapat disetel sendiri 8-30 mm; margin atas dan bawah berlaku pada setiap halaman |
| Pratinjau per halaman | Dokumen dapat dilihat tersambung panjang atau terpotong per halaman seperti di Word |
| Bandingkan & pindai CV | Unggah 1-5 berkas PDF/DOCX/TXT, lihat kelebihan-kekurangan tiap CV dan mana yang paling siap dikirim - diproses di peramban, tanpa akun |
| Dwibahasa | Antarmuka Indonesia dan Inggris; bahasa judul bagian CV diatur terpisah |
| Mode terang dan gelap | Palet monokrom, mengikuti setelan sistem atau pilihan pengguna |
| Pas foto diunggah | Pilih berkas gambar; dikecilkan dan dikompresi di peramban ke ukuran cetak 3x4, lalu tersimpan menyatu dengan CV - ikut ke PDF maupun berkas Word |
| 4 format unduhan | PDF, Word (.docx), teks polos (.txt), dan JSON untuk cadangan data |

---

## Teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Frontend dan backend dalam satu project |
| Tampilan | Tailwind CSS v4 | Komponen ditulis sendiri, tanpa pustaka UI pihak ketiga |
| Basis data | PostgreSQL | Persisten dan tersedia gratis di Neon |
| ORM | Prisma 7 + driver adapter `pg` | Migrasi terversi, aman untuk lampiran laporan |
| Autentikasi | Auth.js v5 (NextAuth) | Credentials + Google dalam satu mekanisme sesi |
| Kata sandi | bcryptjs, 12 putaran | Kata sandi tidak pernah disimpan dalam bentuk asli |
| Word | pustaka `docx` | Menghasilkan .docx asli tanpa tabel maupun kotak teks |
| Validasi | Zod | Server tidak pernah mempercayai bentuk data dari peramban |
| Baca PDF | `pdfjs-dist` di peramban | Isi CV yang dibandingkan tidak perlu meninggalkan perangkat pengguna |
| Baca DOCX | `fflate` + pembacaan XML | Jauh lebih ringan daripada pustaka konversi dokumen, untuk hasil yang sama |
| Gambar diagram | `sharp` (skrip, bukan runtime) | SVG hasil bangkitan diubah menjadi PNG untuk lampiran laporan |

---

## Menjalankan di Komputer Sendiri

### 1. Prasyarat

- Node.js 20 ke atas (project ini diuji pada Node 24)
- npm 10 ke atas

### 2. Pasang dependensi

```bash
npm install
```

Jika npm menahan install script Prisma, jalankan sekali:

```bash
npm approve-scripts prisma @prisma/engines
npm install
```

### 3. Siapkan basis data

Cara termudah - Prisma menyediakan PostgreSQL lokal tanpa perlu memasang apa pun:

```bash
npm run db:dev
```

Perintah itu mencetak sebuah connection string, misalnya
`postgres://postgres:postgres@localhost:51214/template1?sslmode=disable`.
Catat **nomor port**-nya.

### 4. Buat berkas `.env`

Salin `.env.example` menjadi `.env`, lalu isi:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:51214/atscv?sslmode=disable"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51214/atscv_shadow?sslmode=disable"
AUTH_SECRET="isi dengan hasil: openssl rand -base64 32"
AUTH_TRUST_HOST="true"
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

Ganti `51214` dengan port dari langkah sebelumnya. Basis data `atscv` dan
`atscv_shadow` akan dibuat otomatis pada langkah berikutnya.

### 5. Buat tabel dan data awal

```bash
npm run db:migrate
npm run db:seed
```

> **Peringatan untuk basis data lokal `prisma dev`.**
> Menjalankan `prisma migrate dev` terhadap basis data ini ditemukan
> **menghapus seluruh isi tabel**. Bila nanti Anda mengubah `schema.prisma`,
> jangan pakai `npm run db:migrate` di lokal - buat berkas migrasinya secara
> eksplisit:
>
> ```bash
> npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script -o migration.sql
> ```
>
> lalu simpan hasilnya ke `prisma/migrations/<tanggal>_<nama>/migration.sql`
> dan jalankan SQL-nya ke basis data lokal. Di production (Neon) tidak ada
> kendala ini - `npm run db:deploy` berjalan normal.

### 6. Jalankan

```bash
npm run dev
```

Buka <http://localhost:3000>.

---

## Akun Demo

Setelah `npm run db:seed`:

- Email: `demo@atscv.local`
- Kata sandi: `demo12345`

Akun tersebut sudah berisi satu CV contoh lengkap.

Kredensialnya sengaja dicantumkan terbuka supaya siapa pun dapat mencoba aplikasinya
tanpa mendaftar lebih dulu. Konsekuensinya, akun ini dipakai bersama - isinya dapat
diubah atau dihapus pengunjung lain. Jalankan `npm run db:seed` untuk memulihkannya,
dan jangan pernah menaruh data pribadi di dalamnya.

---

## Struktur Project

```
prisma/
  schema.prisma          Skema basis data (17 tabel)
  migrations/            Riwayat perubahan skema
  seed.ts                Akun demo dan CV contoh

src/
  auth.ts                Konfigurasi Auth.js (Credentials + Google)

  app/
    page.tsx             Halaman depan
    panduan/             Panduan penggunaan (publik)
    tentang/             Latar belakang, rancangan, batasan (publik)
    icon.tsx             Ikon situs, dibuat server
    opengraph-image.tsx  Gambar pratinjau saat tautan dibagikan
    robots.ts sitemap.ts manifest.ts
    not-found.tsx error.tsx loading.tsx
    (auth)/              Masuk dan daftar
    (app)/               Halaman yang memerlukan login
      dashboard/         Daftar CV
      resume/[id]/edit/  Editor layar terbagi dua
      resume/[id]/ats/   Analisis dan pencocokan lowongan
      settings/          Pengaturan akun
    resume/[id]/print/   Halaman khusus cetak (sumber PDF)
    api/                 Seluruh endpoint

  components/
    ui.tsx               Komponen dasar (tombol, input, kartu)
    motion.tsx           Efek kedalaman dan kemunculan (CSS, tanpa pustaka 3D)
    PublicHeader.tsx SiteFooter.tsx FlowDiagram.tsx
    preview/             Dokumen CV - dipakai pratinjau sekaligus cetak
    editor/              Formulir per-section, panel pratinjau, autosave
    ats/                 Tampilan hasil penilaian
    dashboard/, auth/, settings/

  lib/
    db.ts                Klien Prisma beserta pengaturan lumbung koneksi
    guard.ts             Pemeriksaan sesi dan kepemilikan data
    rate-limit.ts        Pembatasan laju masuk dan pendaftaran
    site.ts              Identitas aplikasi dan pembuat
    utils.ts             Format tanggal, penggabung teks
    resume/              Tipe, validasi, contoh, penyimpanan, teks polos
    ats/                 Mesin penilaian, kata kunci, kosakata, kekuatan bukti
    portfolio/           Portofolio berbasis pola - lihat catatan di bawah
    docx/                Pembangun berkas Word
```

Dua berkas di `lib/portfolio/` adalah *registry*, dan pemisahannya wajib
dijaga:

- `pola-schemas.ts` menentukan **bentuk** formulir. Kode perlu tahu isinya.
- `kamus-bidang.ts` menentukan **isi** saran. Kode tidak perlu tahu isinya.

Konsekuensinya satu aturan keras: tidak boleh ada `if (pola === ...)` di dalam
komponen mana pun. Seluruh percabangan dibaca dari skema polanya, sehingga
menambah profesi baru berarti menambah satu entri kamus - bukan menulis skema
baru.

---

## Cara Data Disimpan

**Saat aplikasi berjalan:** seluruh isi CV tersimpan sebagai baris di PostgreSQL,
tersebar pada 11 tabel yang terhubung ke tabel `resumes` melalui relasi
`ON DELETE CASCADE`. Setiap kali Anda berhenti mengetik selama 0,8 detik,
editor mengirim seluruh isi CV ke `PATCH /api/resumes/[id]` dan server
menuliskannya dalam satu transaksi.

**Saat dipindahkan atau dicadangkan:** tombol *JSON* mengunduh seluruh isi CV
sebagai satu berkas `.json` bernomor versi:

```json
{
  "schemaVersion": 1,
  "app": "ATS-Friendly CV Builder",
  "exportedAt": "2026-09-02T06:00:00.000Z",
  "resume": { "title": "...", "personalInfo": {}, "experiences": [] }
}
```

Berkas itu dapat diimpor kembali lewat tombol *Impor JSON* di dashboard -
misalnya untuk memulihkan CV yang telanjur terhapus, atau memindahkannya ke
akun lain. Kolom `schemaVersion` menjaga agar berkas lama tetap terbaca oleh
versi aplikasi berikutnya.

Ringkasnya: **PostgreSQL saat dipakai, JSON saat disimpan sendiri.**

---

## Portofolio Berbasis Pola

Berkas: `src/lib/portfolio/`

Bukti karya tiap profesi bentuknya berbeda total, tetapi bentuk itu hanya jatuh
ke sedikit **pola struktural**. Arsitek dengan booklet PDF, desainer dengan
studi kasus, dan pengembang dengan README di GitHub memakai tiga medium berbeda
untuk satu struktur yang sama: konteks → peran saya → keputusan → hasil →
refleksi.

Karena itu yang menentukan bentuk formulir di sini adalah **polanya, bukan
jurusan penggunanya**. Jurusan hanya dipakai untuk menebak pola dan memberi
saran isian.

| Pola | Bagian CV | Judul bawaan | Bobot |
|---|---|---|---:|
| Karya & Desain | `project` | PORTOFOLIO KARYA | 20% |
| Proyek Teknis | `project` | PORTOFOLIO PROYEK | 15% |
| Praktik & Pengajaran | `project` | PENGALAMAN PRAKTIK & PENGAJARAN | 12% |
| Publikasi & Kredit | `publication` | PUBLIKASI & PENELITIAN | 20% |
| Program & Dampak | `project` | PORTOFOLIO PROGRAM & DAMPAK | 12% |
| Umum / Belum Menentukan | `project` | PROYEK & PORTOFOLIO | 12% |

Pola terakhir adalah cadangan yang wajib selalu ada: seseorang yang belum tahu
polanya tetap harus dapat mengisi CV-nya.

Bagian portofolio **memperluas bagian Proyek yang sudah ada**, bukan menambah
bagian kedua di sebelahnya. Daftar itemnya karena itu tetap tinggal di
`ResumeData.projects`, dan untuk pola Publikasi & Kredit yang berlaku adalah
bagian `publication` yang juga sudah ada.

Empat hal lain yang dibawa bagian ini:

- **Kamus 21 bidang** (`kamus-bidang.ts`). Mengetik jurusan - termasuk jurusan
  yang jarang - menghasilkan tebakan pola, saran isian, dan kata kunci khas
  bidang itu yang ikut menyumbang ke Kecocokan Lowongan.
- **Kredensial berkategori** (`kredensial.ts`). Empat kategori, dengan masa
  berlaku yang mengenal "seumur hidup" - sejak UU 17/2023 STR Definitif memang
  berlaku seumur hidup, dan aplikasi yang hanya menerima tanggal kedaluwarsa
  memaksa penggunanya mengarang tanggal yang tidak ada.
- **Blok agregat** (`ambang-profesi.ts`). Perolehan SKP terhadap ambang resmi
  profesinya. Tiap angka membawa `sumber` dan `diperbarui` yang **ditampilkan
  di antarmuka** - pengguna berhak tahu angka yang ia percayai dibaca dari mana
  dan kapan. Blok ini tidak pernah ikut tercetak di CV.
- **Mode Redaksi** (`redaksi.ts`). Nama klien menjadi deskriptor bidangnya dan
  angka pasti menjadi rentang yang memuatnya - dihitung dari angkanya sendiri,
  bukan dari daftar rentang yang dikarang. "Rp 42 juta" menjadi "Rp 40-50
  juta". Untuk orang yang karyanya terikat perjanjian kerahasiaan.

Ditambah **validator bahasa orang pertama** (`bahasa.ts`): kalimat ber-"kami"
dan kata kerja kabur tanpa objek konkret ditandai tepat di bawah kotak
isiannya. Dibuat sebagai validator, bukan tips di kotak bantuan - tips dibaca
sekali lalu dilupakan.

Satu catatan privasi yang mengikat: field **verifikator** menyimpan nama orang
yang tidak pernah menyetujui penyimpanannya oleh aplikasi ini, sehingga
UU 27/2022 berlaku. Konsekuensinya ada penjelasan di bawah fieldnya, datanya
ikut terhapus saat akun dihapus, dan ia **tidak pernah ikut ke berkas ekspor
mana pun**.

---

## Mesin Penilaian

Berkas: `src/lib/ats/`

### Dua angka, dihitung terpisah

Aplikasi ini **tidak** menampilkan satu "skor ATS". Ia menampilkan dua angka
yang mengukur dua hal berbeda:

| Angka | Yang diukur |
|---|---|
| **Kekuatan CV** 0-100 | Mutu dokumennya sendiri: kelengkapan, keterbacaan mesin, mutu kalimat, panjang dan urutan, serta kekuatan bukti karya |
| **Kecocokan Lowongan** 0-100 | Berapa persen kata penting dari satu iklan lowongan yang benar-benar ada di CV. Kosong selama iklannya belum ditempel |

Keduanya dipisah karena mencampurnya menyesatkan: CV yang bagus akan terlihat
buruk hanya karena iklan yang kebetulan ditempel meminta hal lain - dan yang
membaca angka itu justru orang yang sedang memperbaiki CV-nya.

Di bawah keduanya ada sanggahan permanen yang tidak dapat ditutup: angka ini
menilai struktur dan kecocokan kata kunci, dan **tidak** memprediksi keputusan
sistem perekrutan mana pun.

### Enam dimensi, dengan bobot yang bergeser

| Dimensi | Bobot dasar | Yang diperiksa |
|---|---:|---|
| Kelengkapan isi | 25% | Nama, email, telepon, ringkasan, pengalaman, pendidikan, keahlian |
| Bisa dibaca mesin | 25% | Keseragaman format tanggal, kelengkapan pasangan jabatan-perusahaan, jenis huruf, foto, karakter pengganggu |
| Mutu kalimatnya | 20% | Kata kerja aksi, angka terukur, panjang poin, frasa klise |
| Kecocokan dengan lowongan | 20% | Kata kunci iklan lowongan yang muncul di CV |
| Panjang dan urutan | 10% | Jumlah halaman, urutan section, kronologi terbalik, jeda kerja |
| Kekuatan bukti karya | 0% | Peranan dan tingkat kesulitan tiap karya di bagian portofolio |

Bobot "0%" pada dimensi terakhir bukan salah ketik. Selama bagian portofolio
belum dinyalakan penggunanya, dimensi itu tidak ikut dihitung dan kelima
dimensi lama memakai bobot aslinya - sehingga **skor CV lama tidak bergeser
satu angka pun** hanya karena fitur ini ada.

Begitu portofolio dinyalakan, bobot Kekuatan Bukti Karya menjadi angka yang
ditentukan polanya (12-20%, lihat `bobotBuktiKarya` di
`src/lib/portfolio/pola-schemas.ts`) dan kelima dimensi lama dikali
`(100 - bobot) / 100`. Perkalian proporsional itu menjaga totalnya tetap 100
tanpa satu pun dimensi berubah kedudukannya terhadap yang lain. Nilai dengan
bobot lama tetap ditampilkan sebagai pembanding, supaya perubahannya terlihat.

### Kekuatan bukti: model P × Q × R

Berkas: `src/lib/ats/bukti-karya.ts`

Rubriknya meminjam struktur penilaian kompetensi insinyur PII (FAIP), dipilih
karena ia bekerja pada level **item** - sehingga tiap angka dapat ditelusuri ke
isian yang menyebabkannya:

- **Q - peranan** (0-3): sebesar apa peran penulisnya dalam karya itu
- **R - tingkat kesulitan** (0-3): dibaca dari penanda `rubrik` pada tiap field
- skor item = `(Q × R) / 9 × 100`, lalu disesuaikan (verifikator lengkap,
  refleksi terisi, tautan tidak sah) dan dijepit 0-100
- **P - banyaknya pengalaman**: pengali agregat, dengan batas bawah jumlah item
  yang mengikuti jenjang pengalaman penggunanya

Dua hal sengaja **tidak** diambil dari FAIP: ambang 600/3.000/6.000 (itu untuk
akumulasi karier, salah kategori bila dipakai sebagai skala) dan penilaian
manusia (di sini seluruhnya deterministik).

Catatan perancangan:

- **Deterministik.** Seluruh aturan berbasis kaidah, tanpa model bahasa.
  Masukan yang sama selalu menghasilkan skor yang sama, sehingga hasil
  pengujian dapat direproduksi.
- **Dimensi yang tidak berlaku dikeluarkan dari pembagi.** Tanpa iklan lowongan,
  dimensi kecocokan kata kunci tidak dihitung dan skor tetap pada skala 0-100.
- **CV kosong tidak dinilai secara hampa.** Selama CV belum berisi, dimensi
  keterbacaan dan struktur ditandai belum dapat dinilai - sebab seluruh
  aturannya berbentuk "tidak boleh ada X", dan pada dokumen kosong memang
  tidak ada X apa pun. Tanpa penjagaan ini CV kosong memperoleh skor 46;
  dengan penjagaan ini skornya 4.
- **Riwayat disimpan.** Tabel `ats_analyses` mencatat setiap penilaian yang
  sengaja disimpan pengguna, sehingga perkembangan skor sebelum dan sesudah
  perbaikan dapat ditelusuri.

---

## Menyalakan Login Google

Aplikasi berjalan penuh tanpa langkah ini - tombol Google otomatis
disembunyikan selama kredensialnya kosong.

1. Buka [Google Cloud Console](https://console.cloud.google.com/) lalu buat
   sebuah project.
2. Masuk ke **APIs & Services -> Credentials -> Create Credentials -> OAuth client ID**.
3. Pilih jenis **Web application**.
4. Tambahkan **Authorized redirect URI**:
   - `http://localhost:3000/api/auth/callback/google` untuk pengembangan
   - `https://DOMAIN-ANDA/api/auth/callback/google` untuk production
5. Salin Client ID dan Client Secret ke `.env`:

```env
AUTH_GOOGLE_ID="....apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="...."
```

6. Jalankan ulang `npm run dev`.

Penautan otomatis ke akun beremail sama hanya dilakukan bila Google sudah
memverifikasi email tersebut - lihat callback `signIn` di `src/auth.ts`.

---

## Deploy ke Internet (Gratis)

### 1. Basis data - Neon

1. Daftar di [neon.tech](https://neon.tech) (gratis, bisa lewat GitHub).
2. Buat sebuah project, lalu salin **connection string** yang berakhiran
   `?sslmode=require`. Gunakan endpoint **pooled** agar aman untuk serverless.

### 2. Aplikasi - Vercel

1. Unggah project ini ke GitHub.
2. Daftar di [vercel.com](https://vercel.com), pilih **Import Project**.
3. Isi Environment Variables:

   | Nama | Nilai |
   |---|---|
   | `DATABASE_URL` | connection string dari Neon |
   | `AUTH_SECRET` | hasil `openssl rand -base64 32` |
   | `AUTH_TRUST_HOST` | `true` |
   | `AUTH_GOOGLE_ID` | opsional |
   | `AUTH_GOOGLE_SECRET` | opsional |

4. Deploy.
5. Terapkan skema ke basis data production, dari komputer Anda:

```bash
DATABASE_URL="connection-string-neon" npm run db:deploy
```

`SHADOW_DATABASE_URL` tidak diperlukan di production - hanya dipakai
`prisma migrate dev` saat pengembangan.

---

## Pengujian

```bash
npm test
```

Berkas uji berada di folder `tests/` dan berjalan tanpa server maupun basis data -
seluruh yang diuji berupa fungsi murni. Isinya:

| Berkas | Yang diuji |
|---|---|
| `tests/i18n.test.ts` | Kelengkapan kamus dwibahasa; menangkap kalimat yang belum diterjemahkan |
| `tests/ats-engine.test.ts` | Kalibrasi skor: CV kosong, CV contoh, saran satu halaman, pengaruh iklan lowongan |
| `tests/templates.test.ts` | Kesepuluh template dirender, menghasilkan teks yang identik; keempat ukuran kertas; margin per halaman |
| `tests/document.test.ts` | Penilai berkas unggahan: kelebihan, kekurangan, dan pemilihan CV terbaik |
| `tests/pdf.test.ts` | Pembacaan PDF sungguhan, termasuk deteksi tata letak dua kolom |

Berkas PDF ujinya dibangkitkan sendiri oleh `tests/fixtures/make-pdf.ts`, bukan
disimpan sebagai berkas biner - sehingga isi berkas ujinya terbaca sebagai kode.

---

## Perintah yang Tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun versi production |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | Memeriksa gaya penulisan kode |
| `npm run typecheck` | Memeriksa tipe TypeScript |
| `npm run db:dev` | Menjalankan PostgreSQL lokal |
| `npm run db:migrate` | Membuat dan menerapkan migrasi |
| `npm run db:deploy` | Menerapkan migrasi di production |
| `npm run db:seed` | Mengisi akun demo dan CV contoh |
| `npm run db:studio` | Membuka penjelajah basis data |
| `npm test` | Menjalankan berkas uji (107 pemeriksaan, tanpa server maupun basis data) |
| `npm run diagram` | Membangkitkan ulang gambar diagram SVG dan PNG dari `src/lib/diagrams.ts` |

> `npm run db:migrate` sengaja tidak dipakai pada basis data lokal `prisma dev` -
> perintah itu terbukti mengosongkan seluruh tabelnya. Migrasi ditulis manual;
> lihat bagian yang sama pada `memori claude/MULAI-DI-SINI.md`.

---

## Lisensi

[MIT](LICENSE) - bebas dipakai, diubah, dan disebarkan, termasuk untuk keperluan
komersial, selama pemberitahuan hak cipta dan teks lisensinya ikut disertakan.

Lisensi ini berlaku untuk kode aplikasinya. CV yang disusun pengguna adalah milik
pengguna sepenuhnya, dan aplikasi ini tidak mencantumkan kredit pembuat pada berkas
CV yang diunduh - lihat alasannya pada `src/lib/site.ts`.
