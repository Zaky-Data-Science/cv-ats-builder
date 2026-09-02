# Mulai Di Sini

Catatan pengingat untuk melanjutkan project ini di lain waktu - baik oleh Anda
sendiri maupun oleh asisten AI - tanpa perlu menjelaskan ulang dari awal.

Berkas ini **tidak memuat kata sandi, token, maupun kredensial apa pun.**
Semua rahasia ada di dashboard Vercel dan di berkas `.env` lokal yang tidak
ikut masuk ke Git.

Terakhir diperbarui: **2 September 2026** (sesi 4)

---

## 1. Project ini apa

**CV ATS Builder** - aplikasi web untuk menyusun CV yang terbaca sistem ATS
(*Applicant Tracking System*). Pengguna mengisi field terstruktur, melihat
hasilnya seketika di pratinjau seukuran kertas sebenarnya, memperoleh skor ATS
beserta saran perbaikan, lalu mengunduh PDF/Word/teks/JSON. Datanya tersimpan
permanen sehingga dapat diedit kapan saja.

Sejak sesi 4, aplikasi ini juga **memindai dan membandingkan CV yang sudah
ada**: berkas PDF/DOCX/TXT dibaca dan dinilai di dalam peramban, tanpa pernah
dikirim ke server. Antarmukanya dwibahasa (Indonesia/Inggris), bertema
monokrom, dan punya mode terang/gelap.

Dibangun oleh **Muhammad Agus Riyadh Zaky**, Mahasiswa D3 Teknik Komputer,
Politeknik Negeri Samarinda.

> Catatan: keterangan "Tugas Akhir" sengaja **dihapus dari seluruh teks yang
> dilihat pengguna** pada sesi 4. Alasannya ada di komentar `src/lib/site.ts` -
> aplikasinya dipakai orang sungguhan untuk melamar kerja, dan keterangan bahwa
> ini pekerjaan kampus membuatnya terbaca sebagai purwarupa yang belum tentu
> bertahan. Identitas pembuatnya tetap dicantumkan.

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
| Login Google | **aktif dan sudah diuji** - status OAuth "In production", dapat dipakai akun Google siapa pun |
| Project Google Cloud | `CV ATS Builder` (id: `bold-upgrade-507408-a0`) |

**Hasil uji terakhir di production: 10 dari 10 poin lulus, 0 galat
JavaScript.** Rinciannya ada di `docs/dokumentasi-teknis.md` bagian 6.

---

## 3. Cara menjalankan lagi di komputer

```bash
cd "D:\Website CV"

npm install          # bila node_modules terhapus
npm run db:dev       # nyalakan PostgreSQL lokal (catat nomor port-nya)
npm run dev          # buka http://localhost:3000
npm test             # 99 pemeriksaan, tidak perlu server maupun basis data
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
| `src/lib/ats/engine.ts` | **Inti kebaruan project.** Mesin penilaian 5 dimensi untuk CV terstruktur |
| `src/lib/ats/messages.ts` | Seluruh kalimat keluaran mesin penilaian, dua bahasa. engine.ts tinggal berisi angka dan syarat |
| `src/lib/ats/document.ts` | Penilai **berkas CV yang diunggah** - menebak strukturnya dari teks. Sengaja terpisah dari engine.ts; alasannya ada di komentar berkasnya |
| `src/lib/ats/document-messages.ts` | Kalimat kelebihan/kekurangan untuk penilai berkas |
| `src/lib/intake/extract.ts` | Pembaca PDF (pdf.js) dan DOCX (zip + XML) di peramban, beserta deteksi jumlah kolom |
| `src/lib/ats/vocabulary.ts` | Kata henti, kata kerja aksi, frasa klise |
| `src/lib/i18n/id.ts`, `en.ts` | Kamus antarmuka. `en.ts` diketik sebagai `Dictionary`, jadi kunci yang lupa diterjemahkan menggagalkan build |
| `src/lib/resume/templates.ts` | Katalog 10 template beserta ciri rupanya |
| `src/lib/resume/paper.ts` | Ukuran kertas A4/Letter/Legal/F4 |
| `src/lib/diagrams.ts` | **Satu sumber** untuk halaman /alur sekaligus berkas gambar SVG/PNG |
| `src/lib/theme.ts` | Store mode terang/gelap di luar React (useSyncExternalStore) |
| `tests/` | 99 pemeriksaan; `npm test` |
| `src/lib/resume/types.ts` | Bentuk data CV yang dipakai seluruh aplikasi |
| `src/lib/resume/persist.ts` | Baca-tulis CV dalam satu transaksi |
| `src/lib/guard.ts` | Pemeriksaan sesi dan kepemilikan data |
| `src/components/preview/ResumeDocument.tsx` | Dokumen CV - dipakai pratinjau, halaman cetak, **dan** pratinjau template di halaman depan |
| `src/components/compare/CompareClient.tsx` | Halaman bandingkan/pindai CV |
| `src/components/CursorGlow.tsx` | Cahaya pengikut kursor dan percikan sentuh |
| `src/components/editor/ResumeEditor.tsx` | Editor, simpan otomatis, tata letak responsif |
| `src/app/privasi/` dan `src/app/ketentuan/` | Kebijakan privasi dan ketentuan layanan - disyaratkan Google untuk mempublikasikan aplikasi OAuth |
| `src/middleware.ts` | Pengalihan awal halaman terlindungi (hanya kenyamanan, bukan lapisan keamanan) |
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
| **Mode gelap dengan membalik nilai token, bukan menulis varian `dark:`** | Seluruh komponen yang sudah ada ikut bermode gelap tanpa satu pun className diubah, dan tidak ada elemen yang "lupa" dibuatkan varian gelapnya. Termasuk `--color-white`, yang di mode gelap menjadi permukaan kartu gelap - sehingga `bg-ink-900 text-white` tetap berarti "latar gelap, teks terang" di kedua mode. |
| **Bahasa antarmuka disimpan di cookie, bukan localStorage** | Sebagian besar halaman dirender di server; dengan localStorage, halaman akan selalu terkirim berbahasa Indonesia lebih dulu lalu berkedip berganti - dan mesin pencari tidak akan pernah melihat versi Inggrisnya. Konsekuensinya, halaman menjadi dinamis, bukan statis. |
| **Berkas CV yang dibandingkan diproses di peramban** | Isi CV adalah data pribadi lengkap, dan fitur ini justru mengundang orang mengunggah CV yang bukan miliknya. Menyimpannya di server menimbulkan kewajiban perlindungan data yang tidak sepadan, sementara analisisnya memang bisa dikerjakan peramban. Efek sampingnya menguntungkan: fitur ini tidak perlu akun. |
| **Penilai berkas terpisah dari penilai CV terstruktur** | Yang satu punya data terstruktur, yang lain harus menebak strukturnya dari teks. Menyatukannya memaksa salah satu berpura-pura. Yang dibagi hanya yang memang sama: bobot dimensi, daftar kata kerja, dan mesin kata kunci - sehingga skor keduanya tetap dapat dibandingkan. |
| **Saran diubah dari "maksimal 2 halaman" menjadi "satu halaman"** | Perekrut memindai CV dalam hitungan detik; apa pun di halaman kedua besar kemungkinan tidak terbaca. Penilaiannya bertingkat, bukan lolos-gagal: 1 halaman nilai penuh, 2 halaman 75%, 3 halaman ke atas 25%. |
| **Diagram dibangkitkan dari data, bukan digambar** | Diagram yang disimpan sebagai gambar hasil gambar tangan selalu berakhir usang. `src/lib/diagrams.ts` melayani halaman /alur sekaligus berkas SVG/PNG di `docs/diagram/`. |
| **Sakelar tema satu tombol, tanpa pilihan "ikut sistem"** | Menu tiga pilihan menuntut dua tindakan untuk sesuatu yang hanya punya dua keadaan. Setelan sistem tetap dihormati, tetapi perannya bergeser menjadi penentu keadaan **awal** - dituliskan skrip di `<head>` sebagai atribut `data-theme` sebelum halaman digambar. |
| **Tombol utama menuju `/login`, bukan `/dashboard` atau `/register`** | Halaman login sudah mengalihkan pengguna yang sudah masuk langsung ke dashboard, sehingga satu tautan melayani kedua keadaan - dan tidak ada tombol yang menjanjikan dashboard kepada orang yang belum punya akun. |
| **Cahaya kursor memakai kurva peluruhan bercacah, bukan tiga titik henti** | Gradasi CSS menarik garis lurus antar-titik henti; tiga titik menghasilkan dua ruas lurus, dan dua ruas lurus terbaca sebagai cakram berwarna - bukan cahaya. Delapan titik mendekati kurva (1-r)^3: separuh kepekatan hilang sebelum 15% jari-jari, lalu menipis hingga tepat nol pada 100%. |
| **Gerak kartu (`Interactive`) jauh lebih halus daripada `TiltCard`** | `TiltCard` dipakai sekali per halaman untuk benda utama; `Interactive` dipakai berpuluh kali. Puluhan kartu yang miring setegas kartu utama membuat halaman terasa goyah, bukan hidup. |
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
| Deteksi dua kolom tidak jalan pada halaman berisi sedikit teks | Ambangnya 40 potongan teks, terlalu tinggi | Diturunkan ke 12 |
| Worker pdf.js menumpuk setiap PDF dibuka | pdf.js 6 memindahkan metode pembebasan dari objek dokumen ke objek tugas pemuatannya | `task.destroy()`, bukan `document.destroy()` |
| Satu berkas terbaca sebagai berkas biner oleh grep | Karakter NUL literal tertulis di dalam pola regex pembersih teks | Diganti rentang karakter kendali yang ditulis sebagai escape |
| CV contoh berbahasa Inggris bernilai satu poin lebih rendah | Daftar kata kerja aksi Inggris kehilangan bentuk lampau tak beraturan ("rebuilt", "wrote", "ran", "used") | Daftar diperluas 40 kata |
| Label panah balik pada diagram tertutup kotak | Kotak digambar setelah panah | Label panah balik digambar paling akhir; jalurnya dihitung dari kotak paling kiri di seluruh diagram |
| Lint menolak `document.cookie` di badan komponen | Aturan React Compiler melarang efek samping di sana | Dipindah ke fungsi biasa `persistLocale()` di luar komponen |
| `migrate deploy` menolak jalan di basis data lokal | Tabel `_prisma_migrations` hilang akibat kejadian sesi sebelumnya | `prisma migrate resolve --applied` untuk kedua migrasi lama, lalu deploy normal |
| Cahaya kursor terbaca sebagai cakram, bukan cahaya | Gradasi hanya tiga titik henti dan berhenti di 72% jari-jari | Delapan titik henti mendekati kurva (1-r)^3, berakhir tepat nol di 100% |

---

## 8. Yang belum dikerjakan

Daftar ini sengaja jujur - berguna sebagai bab saran pengembangan lanjutan.

1. **Repositori masih privat.** Untuk menjadikannya publik (mis. agar
   tautannya dapat dicantumkan di jurnal): buka Settings repositori di GitHub,
   gulir ke bawah, pilih "Change repository visibility". Perlu diingat,
   menjadikan repo publik tidak dapat ditarik kembali sepenuhnya karena
   isinya dapat terlanjur disalin orang lain.
3. **Pemulihan kata sandi lewat surel belum ada** - memerlukan layanan
   pengirim surel.
4. **Pencocokan kata kunci masih leksikal.** "frontend" dan "front-end"
   dikenali berbeda; sinonim belum dikenali.
5. **Foto lewat tautan gambar, belum unggah berkas.**
6. **CSP masih memuat `'unsafe-inline'`** pada script-src, karena Next.js
   menyisipkan skrip bootstrap sebaris.
7. **Struktur CV yang diunggah ditebak dari teksnya.** CV dengan judul bagian
   tidak lazim dinilai lebih rendah daripada seharusnya - meski itu sendiri
   pertanda yang benar, karena pengurai ATS pun akan kesulitan yang sama.
8. **Halaman publik kini dirender dinamis**, bukan statis, karena membaca
   cookie bahasa. Bila suatu saat perlu statis lagi, jalannya adalah
   memindahkan bahasa ke segmen alamat (`/en/...`).

Sudah selesai sejak sesi 4: berkas uji otomatis (`npm test`, 99 pemeriksaan
di folder `tests/`).

---

## 9. Bila memakai bantuan AI lagi

Cukup sampaikan hal-hal ini:

> Project di `D:\Website CV`. Baca `memori claude/MULAI-DI-SINI.md` lebih dulu,
> lalu `docs/dokumentasi-teknis.md`. Sudah tayang di
> cv-ats-builder-henna.vercel.app. Jangan jalankan `prisma migrate dev` di
> basis data lokal. Sebelum menyatakan selesai, jalankan
> `npm run typecheck && npm run lint && npm test && npm run build`.

Dua hal yang paling mudah terlewat saat menambah fitur:

1. **Setiap teks baru harus masuk kedua kamus** (`src/lib/i18n/id.ts` dan
   `en.ts`). Kunci yang terlewat menggagalkan `typecheck`; kalimat yang
   disalin tanpa diterjemahkan ditangkap `npm test`.
2. **Skema basis data berubah = tulis migrasi manual.** Lihat jebakan di
   bagian 3.

Catatan gaya yang dipakai di seluruh kode ini:

- Seluruh komentar, nama halaman, dan teks antarmuka memakai **bahasa
  Indonesia**.
- Komentar menjelaskan **alasan**, bukan mengulang isi kode.
- Setiap perubahan diverifikasi dengan menjalankan aplikasinya, bukan sekadar
  diasumsikan berhasil.
