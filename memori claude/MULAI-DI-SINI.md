# Mulai Di Sini

Catatan pengingat untuk melanjutkan project ini di lain waktu - baik oleh Anda
sendiri maupun oleh asisten AI - tanpa perlu menjelaskan ulang dari awal.

Berkas ini **tidak memuat kata sandi, token, maupun kredensial apa pun.**
Semua rahasia ada di dashboard Vercel dan di berkas `.env` lokal yang tidak
ikut masuk ke Git.

Terakhir diperbarui: **4 September 2026** (sesi 12)

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

Sejak sesi 6, CV dapat disunting lewat **dua jalur yang menyentuh data yang
sama**: formulir di panel kiri, dan kertas di panel kanan yang dapat diketik
langsung seperti di pengolah kata. Pas foto juga diunggah sebagai berkas,
bukan lagi lewat tautan gambar.

Sesi 7 melengkapi jalur kertas itu: tanggal dipilih lewat pemilih bulan yang
muncul saat periodenya diklik, tiap sub-field pada baris gabungan punya
tempatnya sendiri, entri dan poin dapat ditambah dari kertas, dan field yang
masih kosong tampil sebagai penampung samar supaya ada yang dapat diklik.

Sesi 8 memperbaiki tampilan di ponsel - yang ternyata rusak oleh satu barisan
kendali di bilah atas yang tidak dapat menyusut - dan menambahkan tanda
pengenal rupa berupa **tinta hitam-putih**: intro pembuka sekali per perangkat,
latar berpartikel, dan bercak tinta di setiap sentuhan.

Sesi 9 memperkuat rupa itu: hero menjadi panel tersendiri berisi sapuan tinta
sumi-e dan jaring partikel berkait garis, dan di ponsel pratinjau CV pindah ke
atas - tepat setelah paragraf penjelasan, sebelum tombolnya.

Sesi 10 mengganti bahasanya. Seluruh teks yang dilihat pengguna ditulis ulang
dalam kata yang dipakai orang sehari-hari - "field" menjadi "kotak isian",
"template" menjadi "desain", "dimensi penilaian" menjadi "hal yang dinilai" -
dan angka di halaman depan kini menjelaskan dirinya sendiri saat disentuh.
Pengaturan tampilan CV pindah dari dalam bilah alat ke sebuah laci, supaya
kertasnya tetap terlihat sementara diatur. Pemulihan kata sandi lewat surel
akhirnya ada, bagian tambahan dapat disunting di kertas, dan kemiringan kartu
kini bekerja di layar sentuh.

Sesi 11 membereskan dua hal kecil yang sudah lama terlihat. Berkas
pengalihan awal berganti nama mengikuti Next 16 - `middleware.ts` menjadi
`proxy.ts` - sehingga peringatan usang berhenti muncul setiap server menyala.
Dan panel hero di halaman depan kini penuh dari tepi ke tepi: jarak di kiri,
kanan, dan atasnya membuatnya terbaca sebagai kartu yang mengambang, bukan
sebagai pembuka halaman.

Sesi 12 menambahkan bagian yang paling mengubah wujud aplikasi ini sejak awal:
**portofolio berbasis pola**. Bagian Proyek tidak lagi satu formulir yang sama
untuk semua orang - bentuknya mengikuti salah satu dari lima pola pembuktian,
ditebak dari jurusan yang diketik penggunanya lewat kamus 21 bidang. Ikut
dengannya: kredensial berkategori, penghitung SKP, Mode Redaksi bagi karya yang
terikat kerahasiaan, dan penanda bahasa orang pertama. Angkanya pun berubah
bentuk - satu "Skor ATS" digantikan **dua angka**, Kekuatan CV dan Kecocokan
Lowongan, sebab keduanya mengukur hal yang berbeda.

Dibangun oleh **Muhammad Agus Riyadh Zaky**, Mahasiswa D3 Teknik Komputer,
Politeknik Negeri Samarinda.

> Catatan: keterangan "Tugas Akhir" sengaja **dihapus dari seluruh teks yang
> dilihat pengguna** pada sesi 4. Alasannya ada di komentar `src/lib/site.ts` -
> aplikasinya dipakai orang sungguhan untuk melamar kerja, dan keterangan bahwa
> ini pekerjaan kampus membuatnya terbaca sebagai purwarupa yang belum tentu
> bertahan. Identitas pembuatnya tetap dicantumkan.

---

## 2. Status: tayang, tetapi ada yang belum di-push

> ### Pekerjaan pertama besok, sebelum apa pun yang lain
>
> Fitur portofolio sudah selesai dan **sudah tergabung ke `main`** (`f4be769`),
> tetapi **belum di-push ke GitHub** - jadi yang tayang di production masih
> versi sebelumnya. `main` unggul beberapa commit atas `origin/main`.
>
> Yang menahannya: **uji manual 1-4 di `docs/uji-manual.md` belum dikerjakan.**
> Keempatnya menguji hal yang tidak dapat dibuktikan `npm test` - navigasi
> papan ketik, alur utuh sampai berkasnya jadi, kebocoran Mode Redaksi, dan
> rantai penghapusan akun. Dua di antaranya bertanda "perbaiki sekarang juga"
> bila gagal, dan keduanya menyangkut data orang.
>
> Urutannya: kerjakan uji 1-4 (sekitar 35 menit) -> perbaiki bila ada yang
> gagal -> baru `git push` -> lalu uji 5, yang memang hanya dapat dikerjakan
> setelah deploy.

| Hal | Nilai |
|---|---|
| Alamat production | <https://cv-ats-builder-henna.vercel.app> |
| Akun demo | `demo@atscv.local` / `demo12345` |
| Tim Vercel | ada di catatan pribadi |
| Nama project Vercel | `cv-ats-builder` |
| Basis data | Neon Postgres (`neon-cerulean-anchor`), region Singapore, lewat integrasi Storage di Vercel |
| Folder kode | `D:\Website CV` |
| Repositori GitHub | <https://github.com/Zaky-Data-Science/cv-ats-builder> - **publik** sejak 3 September 2026, branch `main`, berlisensi MIT |
| Deploy otomatis | aktif - setiap `git push` ke `main` memicu deploy sendiri. **Belum dipicu untuk fitur portofolio** |
| Login Google | **aktif dan sudah diuji** - status OAuth "In production", dapat dipakai akun Google siapa pun |
| Project Google Cloud | `CV ATS Builder` (id ada di catatan pribadi) |

**Hasil uji terakhir di production: 10 dari 10 poin lulus, 0 galat
JavaScript.** Rinciannya ada di `docs/dokumentasi-teknis.md` bagian 6. Angka itu
berasal dari versi **sebelum** fitur portofolio.

Gerbang kualitas pada `main` saat ini: `npm test` 708 lulus 0 gagal, typecheck
bersih, lint bersih.

---

## 3. Cara menjalankan lagi di komputer

**Sejak sesi 10, biasanya tidak perlu.** Server lokal berjalan sendiri:
sebuah Scheduled Task bernama `CV ATS Builder - server lokal` menyalakannya
setiap masuk Windows, dan menyalakannya lagi bila mati.

```powershell
# Melihat statusnya
Get-ScheduledTask -TaskName "CV ATS Builder - server lokal" | Get-ScheduledTaskInfo

# Menyalakan sekarang tanpa masuk ulang
Start-ScheduledTask -TaskName "CV ATS Builder - server lokal"

# Membatalkan pemasangannya
powershell -ExecutionPolicy Bypass -File "scripts\pasang-tugas.ps1" -Hapus
```

Lognya di `logs/` - `dev-24jam.log` untuk pengawasnya, `web.log` dan
`database.log` untuk keluaran masing-masing. Alamat yang dapat dibuka dari
ponsel di Wi-Fi yang sama ikut dicatat di log pengawas setiap kali menyala.

Bila ingin menjalankannya dengan tangan:

```bash
cd "D:\Website CV"

npm install          # bila node_modules terhapus
npm run db:dev       # nyalakan PostgreSQL lokal (catat nomor port-nya)
npm run dev          # buka http://localhost:3000
npm test             # 708 pemeriksaan, tidak perlu server maupun basis data
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
> Sesi 10 menemukan gejala serupa yang **bukan** disebabkan perintah itu:
> tabel `_prisma_migrations` hilang dua kali sementara seluruh tabel lain
> beserta isinya tetap utuh, tampaknya saat server `prisma dev` dinyalakan
> ulang. Cirinya khas - `migrate deploy` menjawab P3005 "database schema is
> not empty" padahal skemanya jelas sudah benar.
>
> Pemulihannya tidak menyentuh data sama sekali:
>
> ```bash
> # tandai setiap migrasi yang skemanya memang sudah ada di basis data
> npx prisma migrate resolve --applied <nama_migrasi>
> npx prisma migrate deploy   # lalu yang benar-benar baru dijalankan
> ```
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
vercel deploy --prod --yes --scope <nama-tim>
```

Perintah build di `vercel.json` otomatis menjalankan
`prisma generate && prisma migrate deploy && next build`, sehingga skema basis
data production selalu mengikuti berkas migrasi tanpa langkah manual.

---

## 5. Peta kode

| Lokasi | Isi |
|---|---|
| `prisma/schema.prisma` | 17 tabel beserta relasinya |
| `src/lib/ats/engine.ts` | **Inti kebaruan project.** Mesin penilaian 6 dimensi untuk CV terstruktur; menghasilkan dua angka terpisah, dan bobotnya bergeser saat portofolio aktif |
| `src/lib/ats/bukti-karya.ts` | Rubrik P x Q x R untuk dimensi keenam. Pemetaan field ke syarat R dibaca dari penanda `rubrik` di pola-schemas.ts, bukan ditulis di sini |
| `src/lib/portfolio/pola-schemas.ts` | Registry **bentuk** formulir - lima pola pembuktian plus satu cadangan. Kode perlu tahu isinya |
| `src/lib/portfolio/kamus-bidang.ts` | Registry **isi** saran - 21 bidang. Kode tidak perlu tahu isinya. Menambah profesi = menambah satu entri di sini, bukan menulis skema baru |
| `src/lib/portfolio/render.ts` | Item portofolio menjadi bentuk siap cetak. `verifikator` dan `refleksi` sengaja tidak punya tempat di sana, sehingga tidak ada penghasil keluaran yang **dapat** mencetaknya |
| `src/lib/portfolio/redaksi.ts` | Mode Redaksi. Ada cacat sempit yang diketahui - lihat akhir sesi 12 di riwayat |
| `src/lib/ats/messages.ts` | Seluruh kalimat keluaran mesin penilaian, dua bahasa. engine.ts tinggal berisi angka dan syarat |
| `src/lib/ats/document.ts` | Penilai **berkas CV yang diunggah** - menebak strukturnya dari teks. Sengaja terpisah dari engine.ts; alasannya ada di komentar berkasnya |
| `src/lib/ats/document-messages.ts` | Kalimat kelebihan/kekurangan untuk penilai berkas |
| `src/lib/intake/extract.ts` | Pembaca PDF (pdf.js) dan DOCX (zip + XML) di peramban, beserta deteksi jumlah kolom |
| `src/lib/ats/vocabulary.ts` | Kata henti, kata kerja aksi, frasa klise |
| `src/lib/ats/aliases.ts` | Kelompok padanan kata kunci - singkatan lawan kepanjangannya. Murni data; alasan apa yang sengaja tidak dimasukkan ada di kepala berkasnya |
| `src/lib/resume/photo.ts` | Kompresi pas foto di peramban, batas ukurannya, dan `bakePhotoCrop()` yang memanggang potongan menjadi piksel untuk ekspor Word |
| `src/components/editor/PhotoFrame.tsx` | Penyunting potongan pas foto - bingkai 3:4 tetap, seret untuk menggeser, penggeser untuk memperbesar |
| `src/lib/resume/history.ts` | Riwayat kembali/maju. Perubahan berdekatan digabung; seluruh CV disimpan, bukan selisihnya - alasannya di kepala berkasnya |
| `resumePhotoSize()` di `templates.ts` | Ukuran pas foto yang berlaku: pilihan pengguna bila ada, kalau tidak bawaan template. **Hanya lebarnya** yang boleh dipilih |
| `photoTransform()` di `ResumeDocument.tsx` | Satu-satunya tempat susunan transform pas foto dihitung; dipakai bersama oleh dokumen CV dan penyuntingnya |
| `src/lib/resume/edit-path.ts` | Menulis balik teks yang diketik di atas kertas, **dan** tanggal yang dipilih lewat pemilih bulan (`applyDateEdit`). Hanya jalur terdaftar yang boleh ditulis |
| `src/lib/resume/structure.ts` | Menambah/menghapus entri dan poin dari kertas. Terpisah dari edit-path.ts karena mengubah panjang larik, bukan isi untaian |
| `src/components/editor/DatePopover.tsx` | Pemilih bulan yang muncul di atas periode. Digambar lewat portal ke `<body>` agar tidak ikut mengecil bersama kertas |
| `src/components/PublicHeader.tsx` | Bilah atas semua halaman publik **dan** laci navigasi ponsel. Satu-satunya penyebab luberan mendatar sebelum sesi 8 |
| `src/styles/ink.css` | Seluruh gerak efek tinta - intro, bercak, jejak, latar. Warnanya satu: `var(--ink)` di globals.css |
| `src/components/ink/SamuraiIntro.tsx` | Markup intro pembuka - komponen server tanpa satu pun hook, dikirim bersama HTML. Siluetnya SVG sebaris, bukan berkas gambar |
| `src/components/ink/InkBackground.tsx` | Jaring partikel di kanvas - titik beserta garis penghubung. `absolute`, milik panel hero, bukan menutupi halaman |
| `src/components/ink/InkWash.tsx` | Sapuan tinta sumi-e. Digambar sekali ke kanvas kecil lalu diperbesar; **bukan** penyaring SVG - lihat kepala berkasnya |
| `src/components/ink/InkTouch.tsx` | Bercak tinta untuk ketukan, sapuan, dan tekanan lama |
| `src/lib/intro.ts` | Skrip `<head>` yang memutuskan apakah intro diputar, menutupnya, dan menangani "lewati". **Tidak ada React di jalur ini sama sekali** - lihat kepala berkasnya |
| `src/components/home/TemplatePreview.tsx` | Pratinjau template di halaman depan. Komponen klien **demi berat halaman**, bukan demi interaktivitas - alasannya di kepala berkasnya |
| `src/components/home/HeroStats.tsx` | Barisan angka di halaman depan. Tiap angka menjelaskan dirinya saat disentuh; penjelasannya ditumpuk pada satu sel grid supaya tingginya tidak pernah berubah |
| `src/components/editor/AppearanceDrawer.tsx` | Laci "Atur tampilan CV". Kiri di layar lebar, lembar bawah di ponsel, dan **tanpa lapisan gelap** - kertasnya harus tetap terlihat |
| `src/lib/mail.ts` | Pengirim surel (Brevo, lewat HTTP) beserta isi surel pemulihan dua bahasa. Diam total bila kuncinya belum diisi |
| `src/lib/password-reset.ts` | Pembuatan dan hash token pemulihan. **Tidak mengimpor Prisma** - supaya dapat diuji tanpa basis data |
| `src/lib/password-reset-store.ts` | Kueri basis data untuk tiket pemulihan. Terpisah dari berkas di atas justru karena mengimpor Prisma |
| `scripts/dev-24jam.ps1` | Pengawas server lokal. Memeriksa **port**, bukan proses - alasannya di kepala berkasnya |
| `scripts/pasang-tugas.ps1` | Mendaftarkan pengawas itu sebagai Scheduled Task per-pengguna; `-Hapus` membatalkannya |
| `scripts/uji-surel.ts` | `npm run mail:test -- alamat@tujuan.com`. Mengirim surel pemulihan sungguhan sebagai percobaan |
| `src/lib/i18n/id.ts`, `en.ts` | Kamus antarmuka. `en.ts` diketik sebagai `Dictionary`, jadi kunci yang lupa diterjemahkan menggagalkan build |
| `src/lib/resume/templates.ts` | Katalog 10 template beserta ciri rupanya |
| `src/lib/resume/paper.ts` | Ukuran kertas A4/Letter/Legal/F4 |
| `resumeMargins()` di `templates.ts` | Margin yang berlaku: pilihan pengguna bila ada, kalau tidak bawaan template |
| `src/lib/diagrams.ts` | **Satu sumber** untuk halaman /alur sekaligus berkas gambar SVG/PNG |
| `src/lib/theme.ts` | Store mode terang/gelap di luar React (useSyncExternalStore), beserta peralihan tinta yang menyebar saat temanya berganti |
| `src/lib/reveal-init.ts` | Skrip `<head>` yang menyalakan animasi "muncul saat tergulir" - dan menjamin isinya tetap terlihat bila animasinya tidak pernah berjalan |
| `src/app/(app)/loading.tsx` | Kerangka pemuatan. **Sengaja tidak di root** - alasannya di kepala berkasnya |
| `tests/` | 708 pemeriksaan; `npm test` |
| `tests/kertas.test.ts` + `tests/fixtures/kertas-acuan.html` | Mengunci markup dokumen CV pada jalur cetak, 10 template x 2 bahasa. Rekam ulang acuannya **hanya** bila tampilannya memang sengaja diubah |
| `src/lib/resume/guest.ts` | CV tanpa akun: baca-tulis `localStorage`, plus titipan untuk dipindahkan ke akun |
| `src/app/coba/`, `src/app/cetak/` | Editor dan halaman cetak untuk pengguna tanpa akun |
| `src/components/HeaderBack.tsx` | Panah kembali di bilah atas; menuju halaman induk tetap, bukan riwayat peramban |
| `src/components/preview/PrintToolbar.tsx` | Bilah pada halaman cetak; mencetak sendiri bila alamatnya berakhiran `?cetak=1` |
| `src/lib/resume/types.ts` | Bentuk data CV yang dipakai seluruh aplikasi |
| `src/lib/resume/persist.ts` | Baca-tulis CV dalam satu transaksi |
| `src/lib/guard.ts` | Pemeriksaan sesi dan kepemilikan data |
| `src/components/preview/ResumeDocument.tsx` | Dokumen CV - dipakai pratinjau, halaman cetak, **dan** pratinjau template di halaman depan |
| `src/components/compare/CompareClient.tsx` | Halaman bandingkan/pindai CV |
| `src/components/CursorGlow.tsx` | Cahaya pengikut kursor dan percikan sentuh |
| `src/components/editor/ResumeEditor.tsx` | Editor, simpan otomatis, tata letak responsif |
| `src/app/privasi/` dan `src/app/ketentuan/` | Kebijakan privasi dan ketentuan layanan - disyaratkan Google untuk mempublikasikan aplikasi OAuth |
| `src/proxy.ts` | Pengalihan awal halaman terlindungi (hanya kenyamanan, bukan lapisan keamanan). Dulu bernama `src/middleware.ts`; Next 16 mengganti nama konvensinya |
| `docs/` | Panduan pengguna, dokumentasi teknis, panduan deploy |

---

## 6. Keputusan penting dan alasannya

Bagian ini yang paling sering ditanyakan penguji. Alasannya disimpan di sini
supaya tidak perlu diingat-ingat lagi.

| Keputusan | Alasan |
|---|---|
| **PostgreSQL, bukan SQLite** | Rencana awal memakai SQLite, tetapi filesystem platform serverless bersifat sementara - berkas `.db` akan hilang setiap kali deploy ulang. |
| **Margin cetak: `@page` bermargin NOL, margin sebenarnya dari padding kertas** | Aturan ini berubah dua kali, dan urutannya perlu diketahui supaya tidak diputar balik lagi. **Semula** margin berupa padding elemen kertas - salah, sebab padding hanya berlaku sekali untuk dokumen yang mengalir sehingga halaman kedua tercetak tanpa margin atas. **Sesi 5** memindahkannya ke `@page { margin }` - benar untuk soal itu, tetapi margin `@page` menyediakan ruang bagi Chrome menggambar kop dan kakinya (tanggal, alamat halaman, nomor "1/2"), dan itu tidak boleh ada pada CV yang dikirim ke perusahaan. **Sesi 6** menguji satu per satu: margin 20mm, 5mm, 2mm, bahkan `0 18mm` yang atas-bawahnya nol, semuanya masih memunculkan kop itu. Hanya `margin: 0` di keempat sisi yang menghapusnya. Marginnya karena itu kembali menjadi padding kertas, kali ini disertai `box-decoration-break: clone` yang membuat setiap pecahan halaman memperoleh paddingnya sendiri - menutup kelemahan yang dulu membuat cara ini ditinggalkan. |
| **CV tanpa akun disimpan di peramban, bukan di server** | Tidak ada pemilik yang dapat dipertanggungjawabkan untuk data tanpa akun. Menyimpannya di server berarti menaruh data pribadi orang yang tidak dapat dihubungi, dihapus permintaannya, maupun dibuktikan haknya. |
| **Memindahkan CV tamu ke akun berupa tawaran, bukan otomatis** | Komputer bersama - warnet, laboratorium kampus - membuat impor diam-diam menyalin CV orang lain ke akun siapa pun yang kebetulan masuk berikutnya. |
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
| **Cetak PDF lewat halaman mandiri, bukan bingkai tersembunyi** | Dokumen mana yang tercetak saat `print()` dipanggil pada sebuah bingkai adalah perilaku peramban, bukan sesuatu yang dapat dipastikan aplikasi. Sudah dua kali gagal dengan gejala berbeda. Halaman cetak yang mencetak dirinya sendiri hanya punya satu dokumen - tidak ada yang bisa tertukar. |
| **Peralihan tema memakai View Transitions, bukan `transition` pada warnanya** | Menganimasikan warnanya sendiri menuntut `transition` pada `background-color`, `color`, dan `border-color` di seluruh aplikasi - dan menghasilkan tiga masalah sekaligus: tiap elemen bertransisi menurut jadwalnya sendiri sehingga halaman berganti sepotong-sepotong, warna yang bertransisi memaksa pengecatan ulang terus-menerus, dan pemilih yang cukup luas untuk menjangkau semuanya juga menjangkau yang tidak boleh ikut - kertas CV, misalnya. View Transitions memotret halaman sebelum dan sesudah, sehingga yang dianimasikan hanya `clip-path` pada satu lapisan. |
| **Peralihannya tiga tahap: setetes tinta di ikon, lalu menyebar** | Semula dua tahap dengan satu kurva keluar untuk seluruh perjalanan - dan kurva itu menempuh delapan puluh persen jaraknya dalam sepertiga waktu pertama. Terukur: pada 40 ms lingkarannya sudah berjari-jari 395 piksel. Titik di ikonnya secara teknis ada, tetapi tidak pernah benar-benar terlihat. Kini ia bertahan sekitar 120 ms sebagai titik seukuran tombolnya (22 piksel) sebelum menyebar. Satu kurva tidak dapat melakukan keduanya: yang cukup tajam untuk terasa bertenaga akan menelan tahap pertama, yang cukup lembut untuk memperlihatkannya membuat sisanya lamban. |
| **Titik pusatnya ditulis dalam persen, bukan piksel** | Dilaporkan meleset: "lokasinya beda titik tengahnya". Koordinat pikselnya sendiri terbukti benar - lingkaran yang sama, digambar sebagai lapisan biasa, mendarat tepat di ikonnya. Yang keliru asumsinya: `clip-path` pada `::view-transition-new(root)` diukur dari kotak pseudo-element itu, dan kotak itu **tidak dijamin** seukuran `innerWidth`/`innerHeight` - bilah alamat ponsel yang menyusut saat digulir, batang gulir, perbesaran halaman, dan `visualViewport.scale` yang bukan satu semuanya memisahkan keduanya. Persen selalu diukur terhadap kotak yang sama dengan yang sedang dipotong, jadi titiknya mendarat di tombolnya berapa pun ukuran kotaknya. |
| **Lingkarannya menyebar dari tombol yang ditekan, bukan dari tengah layar** | Bentuknya sama dengan bercak tinta di setiap sentuhan, dan sumbernya tombol yang barusan ditekan - peralihan yang menyebar dari tempat jari berada terbaca sebagai akibat dari tindakan itu. Jari-jarinya dihitung ke sudut terjauh, bukan dari lebar layar: lingkaran selebar layar meninggalkan sepotong sudut yang tidak pernah tersapu. |
| **Kegagalan View Transition ditelan diam-diam** | `ready` ditolak setiap kali peramban melewati potretnya - tab berpindah ke latar, transisi lain menyusul, atau dokumennya sedang tidak terlihat. Temanya sudah berganti di dalam callback, jadi yang hilang hanya geraknya; tanpa `catch`, penolakannya muncul di konsol pengguna sebagai galat yang tampak serius padahal aplikasinya bekerja benar. |
| **Sakelar tema satu tombol, tanpa pilihan "ikut sistem"** | Menu tiga pilihan menuntut dua tindakan untuk sesuatu yang hanya punya dua keadaan. Setelan sistem tetap dihormati, tetapi perannya bergeser menjadi penentu keadaan **awal** - dituliskan skrip di `<head>` sebagai atribut `data-theme` sebelum halaman digambar. |
| **Tombol utama menuju `/login`, bukan `/dashboard` atau `/register`** | Halaman login sudah mengalihkan pengguna yang sudah masuk langsung ke dashboard, sehingga satu tautan melayani kedua keadaan - dan tidak ada tombol yang menjanjikan dashboard kepada orang yang belum punya akun. |
| **Cahaya kursor memakai kurva peluruhan bercacah, bukan tiga titik henti** | Gradasi CSS menarik garis lurus antar-titik henti; tiga titik menghasilkan dua ruas lurus, dan dua ruas lurus terbaca sebagai cakram berwarna - bukan cahaya. Delapan titik mendekati kurva (1-r)^3: separuh kepekatan hilang sebelum 15% jari-jari, lalu menipis hingga tepat nol pada 100%. |
| **Gerak kartu (`Interactive`) jauh lebih halus daripada `TiltCard`** | `TiltCard` dipakai sekali per halaman untuk benda utama; `Interactive` dipakai berpuluh kali. Puluhan kartu yang miring setegas kartu utama membuat halaman terasa goyah, bukan hidup. |
| **Pratinjau per halaman memakai "tinggi terpakai"** | Tinggi kertas dikurangi kedua margin - satuan yang sama dengan yang dipakai peramban saat mencetak, sehingga jumlah halaman di pratinjau dan di PDF selalu sama. |
| **Margin kustom disimpan NULL saat mengikuti template** | Menyalin angka template ke kolomnya akan mengunci CV pada margin template lama tanpa pengguna pernah memintanya. NULL membuat CV ikut menyesuaikan sendiri saat templatenya diganti. |
| **Diagram versi HTML satu kolom, versi gambar berjalur** | Di versi gambar, panah berbelok benar-benar digambar menuju kotak di sampingnya; di HTML penghubungnya hanya garis tegak di tengah, sehingga kotak yang tergeser membuat garisnya menggantung. Data jalurnya tetap satu, hanya cara menampilkannya yang berbeda. |
| **Jejak navigasi, bukan hanya tombol kembali peramban** | Halaman dalam kerap dibuka langsung dari hasil pencarian atau tautan yang dibagikan - pada keadaan itu tombol kembali peramban tidak punya riwayat untuk dimundurkan sama sekali. Butir terakhirnya sengaja bukan tautan: tautan menuju halaman yang sedang dibuka hanya menambah sasaran papan ketik yang tidak melakukan apa-apa. |
| **Kredit pembuat tidak ikut di CV** | CV adalah dokumen milik pelamar. Mencantumkan nama pihak lain akan membingungkan perekrut dan merugikan penggunanya. |
| **Tidak mencantumkan statistik "sekian persen CV ditolak ATS"** | Angka yang beredar luas itu tidak punya sumber primer yang dapat diverifikasi - berisiko dipertanyakan penguji. |
| **Kata kunci dibandingkan dalam bentuk kanonik, tetapi plus dan tagar dipertahankan** | Membuang tanda hubung menyamakan "front-end" dengan "frontend" - itu memang satu keahlian. Membuang plus dan tagar akan menyamakan "c++", "c#", dan "c" - itu tiga bahasa berbeda. |
| **Bingkai pas foto berukuran tetap, gambarnya yang bergerak di dalamnya** | Dulu satu `<img>` mengerjakan keduanya lewat `object-fit: cover`. Tata letaknya memang sudah aman - ukuran bingkai tidak pernah ikut berubah oleh bentuk foto - tetapi bagian mana dari foto yang tampil selalu bagian tengahnya, dan tidak ada satu pun cara mengubahnya. Pada pas foto yang wajahnya tidak persis di tengah, yang terpotong justru kepalanya. Kini ada pembungkus yang menahan ukuran dan memotong, dan gambar di dalamnya yang diperbesar serta digeser. |
| **Yang disimpan parameter potongan, bukan gambar hasil potongan** | Memotong lalu menyimpan hasilnya membuat setiap penyuntingan berikutnya bekerja di atas gambar yang sudah kehilangan piksel - seseorang yang memperbesar hari ini dan ingin memperkecil lagi besok tidak akan pernah memperoleh kembali bagian yang terpotong. Dengan parameter, gambar sumbernya utuh selamanya dan potongannya dihitung ulang setiap kali. Itu pula yang membuat janji "tidak pecah saat diperbesar" dapat ditepati. |
| **Gambar sumber dinaikkan ke 1200x1600, batas berkas ke 1 MB** | Pas foto 3x4 cm pada 300 DPI butuh sekitar 354x472 piksel, dan 400x533 sudah cukup selama gambarnya hanya ditampilkan apa adanya. Begitu boleh diperbesar tiga kali, yang mengisi bingkai tinggal sepertiga sisinya - dari 400 piksel tersisa 133, dan cetaknya pecah. Pada 1200x1600, perbesaran tiga kali masih menyisakan 400x533. |
| **Ekspor Word memanggang potongannya menjadi piksel** | Word tidak dapat memotong gambar sebaris - ia selalu tampil utuh, diregangkan ke ukuran yang diminta - dan pustaka `docx` tidak mengekspos `srcRect`, satu-satunya cara memotong yang dikenal OOXML. Karena itu jalur Word kini selalu berjalan di peramban, juga bagi pengguna berakun: memanggang potongan menuntut kanvas, dan membiarkan sebagian pengguna memakai jalur server berarti dua CV yang sama menghasilkan berkas Word yang berbeda. |
| **`bakePhotoCrop()` menguraikan base64 sendiri, tidak memakai `fetch(dataUri)`** | `connect-src 'self'` pada kebijakan keamanan isinya tidak memuat `data:`, sehingga `fetch` terhadap data URI diblokir peramban sebelum sempat berjalan. Gejalanya akan berupa ekspor Word yang gagal hanya pada CV yang fotonya diatur, dan hanya di production. Melonggarkan kebijakan demi satu pemanggilan jelas tidak sepadan dengan sepuluh baris penguraian. |
| **Tinggi editor dikunci ke `100dvh`, bukan `min-h-full`** | `min-h-full` berarti "sekurang-kurangnya setinggi layar", dan panel yang boleh tumbuh akan tumbuh setinggi isinya. Akibatnya bukan dua panel yang menggulir sendiri-sendiri melainkan satu halaman panjang: mengisi formulir di bagian bawah menggeser kertasnya ikut keluar layar, dan pratinjau yang seharusnya mengikuti field justru tidak terlihat. `dvh`, bukan `vh`: bilah alamat ponsel menyusut saat digulir, dan `vh` menyisakan sepotong editor yang tidak pernah terjangkau. |
| **Pratinjau menggulir ke kemunculan blok yang terlihat, bukan ke lembarnya** | Pada mode per halaman dokumen dirender ulang di dalam tiap lembar, jadi satu bagian CV punya satu elemen per lembar dan hanya satu yang terlihat. Versi lama menghitung lembar keberapa lalu menggulirkan lembar itu ke tengah - dan lembar A4 jauh lebih tinggi daripada daerah pratinjaunya, sehingga blok di bagian bawah lembar tetap di luar pandangan. |
| **Hanya lebar pas foto yang dapat dipilih; tingginya dihitung** | Perbandingannya milik template - 3:4 pada yang formal, 1:1 pada yang bulat - sehingga tidak ada kombinasi angka yang dapat membuat pas foto menjadi lonjong. Diukur pada 22, 30, dan 45 mm: rasionya tetap 0,75 di ketiganya. |
| **Riwayat menyimpan seluruh CV, bukan selisihnya** | Menyimpan selisih menuntut penerapan mundur yang benar untuk setiap bentuk perubahan - termasuk penambahan entri, penukaran urutan bagian, dan penyuntingan di atas kertas. Kesalahan sekecil apa pun menghasilkan CV yang rusak setelah beberapa kali "kembali", tepat pada pengguna yang sedang panik membatalkan sesuatu. Lima puluh langkah CV utuh hanya beberapa megabyte, dan data URI fotonya dibagi antar-salinan, bukan digandakan. |
| **Ctrl+Z tidak disaring terhadap elemen yang sedang difokus** | Peramban punya pembatalan bawaannya sendiri di dalam kotak teks, dan keduanya bertabrakan: pengguna menekan Ctrl+Z untuk membatalkan "hapus entri" dan yang terjadi malah satu huruf kembali di kotak yang kebetulan difokus. Yang diharapkan dari penyusun dokumen adalah satu riwayat untuk seluruh dokumen. |
| **Pas foto disimpan sebagai data URI, bukan di penyimpanan objek** | Mode tanpa akun menyimpan seluruh CV di localStorage dan tidak pernah menyentuh server; penyimpanan berkas akan memaksanya punya id sesi anonim beserta pembersihan berkas yatim. Satu jalur kode melayani kedua mode, dan tidak ada berkas yang bisa tertinggal setelah CV-nya dihapus. |
| **Foto pada DOCX diletakkan setelah blok identitas, bukan berdampingan** | Satu-satunya cara meletakkan gambar berdampingan teks di Word adalah tabel atau kotak teks - dua penyebab tersering kegagalan pengurai ATS yang sejak awal dihindari berkas itu. |
| **Menyunting di kertas disimpan saat lepas fokus, bukan tiap ketukan tombol** | Elemen contentEditable menyimpan teksnya sendiri di DOM; menulis ke state React tiap huruf membuat React menggambar ulang elemennya di tengah pengguna mengetik, dan kursor melompat ke awal paragraf. |
| **Hanya jalur terdaftar yang boleh ditulis dari kertas** | Nilai `data-edit` berasal dari DOM, dan DOM dapat disunting siapa pun lewat konsol. Penyetel jalur bebas akan mengizinkan penulisan ke `id`, yang memutus hubungan entri dengan barisnya di basis data. |
| **Sebelum mengukur apa pun yang bergantung bingkai atau hidrasi, periksa `document.visibilityState`** | Sepanjang sesi 7-9 berulang kali disimpulkan "hidrasi di mesin ini lambat luar biasa" dan "penyaring SVG memakan satu detik per bingkai". Keduanya palsu: jendela Chrome yang dipakai menguji sedang terhalang, dan tab tersembunyi membuat peramban menghentikan `requestAnimationFrame` sekaligus membuat React menunda hidrasi. Angka dari tab tersembunyi tidak berarti apa pun. |
| **Sapuan tinta digambar ke kanvas, bukan dengan penyaring SVG** | Penyaring SVG dihitung ulang setiap kali daerahnya digambar ulang - dan kanvas partikel yang beranimasi di atasnya menjamin itu terjadi terus. Kanvas digambar sekali lalu menjadi bitmap. (Catatan: alasan ini benar, tetapi angka yang dulu dipakai membuangnya berasal dari pengukuran tak sah di atas.) |
| **Kelembutan tinta dari pembesaran bitmap kecil, bukan dari `ctx.filter`** | `ctx.filter = "blur(...)"` berlaku per gambar, bukan sekali untuk seluruh kanvas: tujuh puluh cakram berarti tujuh puluh peredaman. Menggambar pada sepertiga ukuran lalu memperbesar memberi kelembutan yang sama dengan biaya satu `drawImage`. |
| **Urutan hero berbeda di ponsel dan desktop tanpa merender apa pun dua kali** | Grid berisi tiga blok, dan penempatan baris-kolomnya baru diberikan mulai `lg:`. Di bawah itu ketiganya mengalir menurut urutan penulisan - dan urutan penulisan itulah urutan yang benar untuk ponsel. Menggandakan pratinjau CV demi dua urutan akan mengembalikan beban yang dipangkas di sesi 6. |
| **Sapuan tinta dan jaring partikel dibatasi panel hero** | Dibiarkan mengalir ke seluruh halaman, keduanya akan berada di belakang setiap paragraf sampai ke footer - dan tinta di belakang teks yang harus dibaca berhenti menjadi rupa, berubah menjadi gangguan. |
| **Tampilan ponsel diperbaiki dengan mengukur lebih dulu, bukan dengan menulis ulang tata letak** | Gejalanya - halaman hanya memakai sebagian lebar layar - menyerupai kesalahan tata letak besar. Yang terukur ternyata satu elemen: barisan kendali di bilah atas berlebar tetap 224 piksel (300+ saat belum masuk) yang tidak pernah menyusut, membuat dokumen 398 piksel di layar 320. Sisa halaman depan sudah mobile-first sejak awal. Menulis ulang tata letaknya akan menghabiskan satu sesi untuk memperbaiki yang tidak rusak. |
| **`body { overflow-x: clip }`, bukan `hidden`** | Keduanya memangkas isi yang meluber, tetapi `hidden` menjadikan elemennya wadah gulir - dan wadah gulir baru membuat `position: sticky` pada bilah atas berhenti bekerja. |
| **Laci navigasi ponsel digambar lewat portal ke `<body>`** | Bilah atas memakai `backdrop-blur`, dan penyaring latar menjadikan elemennya blok penampung bagi keturunan `position: fixed`. Laci di dalamnya terpotong setinggi bilahnya sendiri; `inset-0` terlihat benar di kode, tetapi "nol" yang dimaksud peramban adalah nol terhadap bilah. |
| **Sasaran sentuh 44 piksel lewat elemen bangkitan, bukan dengan meninggikan tombol** | Yang kurang bukan ukuran yang terlihat melainkan ketepatan jari. Meninggikan tombol menjadi 44 piksel akan menggeser setiap baris yang memuatnya di seluruh aplikasi; elemen bangkitan memperbesar area sentuh tanpa mengubah satu piksel pun tata letaknya, dan hanya pada `pointer: coarse`. |
| **Siluet samurai berdiri di belakang kertas** | Tintanya berlawanan dengan kertas: di mode gelap siluetnya putih dan kertasnya juga putih, sehingga siluet yang digambar di atasnya lenyap di bagian yang bertumpang tindih - yang tersisa hanya sepasang kaki di bawah selembar kertas. Ditemukan dengan melihat hasilnya, bukan dengan membaca kodenya. |
| **Intro pembuka berupa lapisan di atas halaman, bukan gerbang yang menahannya** | Halaman depan sudah utuh di belakangnya sejak byte pertama. Bila JavaScript gagal, yang hilang hanya hiasannya - tidak ada keadaan "layar tersangkut di pembuka". |
| **Isi halaman terlihat secara bawaan; animasinya yang ditambahkan, bukan keterlihatannya yang diberikan** | Prinsip yang dilanggar sesi 8 tanpa disadari, dan baru ketahuan sesi 10 ketika halaman depan dilaporkan hitam kosong dari sebuah ponsel. Komentar `Reveal` sendiri sudah menjanjikan isinya "tetap terbaca pembaca layar dan mesin pencari meskipun JavaScript gagal" - yang terlewat: terbaca pembaca layar bukan berarti terlihat mata. Setiap efek yang menyembunyikan isi sekarang harus menyalakan dirinya sendiri lewat penanda dari skrip `<head>`, bukan menganggap JavaScript pasti berjalan. |
| **`loading.tsx` hanya untuk kelompok `(app)`, tidak pernah di root** | Sebuah `loading.tsx` membungkus halamannya dalam batas Suspense, dan halaman yang dibungkus dikirim dalam dua bagian yang hanya dapat disatukan JavaScript. Untuk dashboard dan editor itu tidak merugikan - keduanya memang mustahil tanpa JavaScript. Untuk halaman publik itu berarti halaman kosong bagi orang di jaringan lambat, yaitu justru pengguna yang dituju aplikasi ini. |
| **Intro diputar setiap kali halaman dimuat ulang, tetapi selalu dapat dilewati** | Diubah dari sekali-per-perangkat atas permintaan pemilik aplikasi. Keberatan lamanya - pembuka yang berulang berubah menjadi penghalang - tidak dibuang melainkan dijawab dari sisi lain: satu ketukan, klik, tombol, atau gulir melewatinya, dan seluruh layar adalah tombolnya. Yang membuat sebuah pembuka menjadi penghalang bukan kemunculannya, melainkan ketidakmampuan melewatinya. |
| **Intro tidak menunggu React sama sekali** | Semula lapisannya baru dirender setelah hidrasi. Pada koneksi cepat jedanya tidak terasa; pada sebuah ponsel, halaman depan sudah terbaca utuh beberapa detik sebelum adegan pembukanya sempat mulai - dan pembuka yang datang setelah halamannya terbaca bukan lagi pembuka. Markup-nya kini ikut terkirim dari server, animasinya seluruhnya CSS, dan yang menyalakannya skrip sinkron di `<head>`. Komponennya tidak punya `"use client"`, tidak punya satu pun hook, dan tidak mengimpor apa pun - jadi secara arsitektur ia tidak mungkin lagi menunggu hidrasi. |
| **Penandanya atribut `data-intro` yang dilepas sendiri, bukan nilai yang disimpan** | Muat ulang halaman menjalankan skrip `<head>` dari awal sehingga intronya kembali; berpindah halaman di dalam aplikasi tidak, dan atributnya sudah dilepas begitu adegannya usai - jadi kembali ke beranda tidak memutarnya lagi. Dua perilaku yang dibutuhkan, tanpa satu pun nilai yang perlu disimpan di mana pun. |
| **Ada jeda setengah detik sebelum adegannya boleh dilewati** | Tanpa jeda itu adegannya kerap tidak pernah terlihat di ponsel: menarik layar ke bawah untuk memuat ulang meninggalkan jari di atas kaca, dan sentuhan yang sama langsung terbaca sebagai "lewati" pada milidetik pertama halaman berikutnya. |
| **Susunan waktu seluruh adegan dikumpulkan di satu komentar** | Sebelumnya tiap penundaan tersebar di aturannya masing-masing, dan itu yang membuat adegannya terasa patah: menggeser satu fase mengubah tumpang tindihnya dengan fase tetangga tanpa ada yang menyadarinya. Yang menentukan halus atau tidaknya adalah hubungan antar-fase, dan hubungan itu hanya terbaca bila angkanya berdampingan. |
| **Tidak ada fase yang berhenti di puncak geraknya** | Sapuan tebasan dulu mencapai panjang penuh pada 60% lalu diam 40% sisanya sambil memudar. Diam sekejap di puncak gerak adalah persis yang terbaca sebagai patahan - sapuan kuas sungguhan terangkat sambil masih bergerak. |
| **Tirai memakai kurva keluar, bukan `ease-in`** | Kurva masuk mulai lambat lalu mempercepat di ujung - kebalikan dari yang dibutuhkan sesuatu yang sedang menghilang. Yang terasa: tirainya menggantung, lalu lenyap mendadak di detik terakhir. |
| **Panjang sapuan tebasan diikat ke ukuran kertas, bukan ukuran layar** | Sapuan selebar layar melintasi seluruh halaman dan menjadi kejadian yang berdiri sendiri; yang dituju adalah tebasan terhadap kertas itu. |
| **Warna tinta satu variabel `--ink` berisi tiga bilangan RGB** | Setiap efek menentukan kepekatannya sendiri lewat `rgb(var(--ink) / <alpha>)` tanpa menulis ulang warnanya. Cukup dua blok tanpa cabang `prefers-color-scheme`, sebab skrip di `<head>` selalu menuliskan `data-theme` lebih dulu. |
| **Percikan cahaya lama di CursorGlow dilepas saat tinta masuk** | Keduanya berjalan bersamaan akan meninggalkan dua bekas berbeda di titik sentuh yang sama - yang terlihat bukan dua efek, melainkan satu efek yang keliru. |
| **Tanggal disunting lewat pemilih bulan yang dipanggil dari kertas, bukan diketik** | Alasan lama menolak tanggal sebagai **teks bebas** - "Feb 2023" bukan tanggal bagi aplikasi ini - bukan menolak penyuntingannya dari kertas. Nilainya karena itu tetap datang dari `<input type="month">`; yang berubah hanya dari mana pemilih itu dipanggil. Jalur tulisnya pun terpisah (`applyDateEdit`), sebab `applyEdit` menyimpan apa pun yang masuk sebagai teks. |
| **Baris gabungan tidak lagi digabung sebelum dirender** | Alasan lama menolak **pembelahan** untaian kembali menjadi tiga field, bukan penyuntingan sub-fieldnya. Dengan tiap sub-field membawa elemennya sendiri sejak dirender, tidak ada yang perlu dibelah - tebakannya hilang, bukan diperbaiki. |
| **Struktur berubah lewat tombol, bukan lewat ketikan** | Kaidah "mengetik mengubah kata, bukan struktur" tetap utuh: yang menambah entri adalah tombol yang ditekan sengaja, dan Enter di poin adalah kebiasaan pengolah kata yang sudah dikenal. Jalur tulisnya di `structure.ts` dengan daftar terdaftarnya sendiri, sebab mengubah panjang larik jauh lebih berbahaya daripada mengubah untaian: salah bagian atau salah nomor berarti entri lain ikut terhapus tanpa satu pun tanda di layar. |
| **Label penampung digambar lewat `::before`, bukan ditulis sebagai isi elemen** | Yang disimpan saat kursor meninggalkan sebuah teks adalah `innerText`-nya, dan isi bangkitan `::before` tidak ikut terbaca di sana. Ditulis sebagai isi sungguhan, mengklik "Kota" lalu keluar tanpa mengetik akan menyimpan kata "Kota" sebagai nama kota. |
| **Popover tanggal digambar lewat portal ke `<body>`** | Kertas berada di dalam pembungkus ber-`transform: scale(zoom)`. Popover yang menjadi anaknya ikut mengecil, dan pada perbesaran 40% pemilih bulannya tidak lagi dapat dipakai. `getBoundingClientRect()` sudah memperhitungkan skala itu, jadi letaknya tetap tepat. |
| **Markup dokumen CV dikunci berkas uji, bukan dijaga dengan kehati-hatian** | Membongkar cara baris entri dirender dapat menggeser pemenggalan barisnya tanpa satu pun pemeriksaan lain berteriak - PDF tetap terbentuk, isinya tetap ada, hanya jumlah halamannya berubah. `tests/kertas.test.ts` membandingkan markup mentah seluruh template di kedua bahasa terhadap acuan yang direkam sebelum perubahan dimulai. |
| **Pratinjau template di halaman depan jadi komponen klien** | Sebagai komponen server, seluruh pohon elemen dokumen ikut ditulis dua kali ke halaman - sekali sebagai HTML, sekali lagi sebagai muatan React. Untuk sebelas dokumen, salinan kedua itu saja lebih dari 200 KB. |
| **Pengaturan tampilan jadi laci, bukan blok di dalam bilah alat** | Sebagai blok, ia mendorong kertas turun sekitar empat ratus piksel - sehingga perubahan yang baru saja diatur justru tidak terlihat - dan warnanya, abu sangat muda di atas putih, membuatnya terbaca sebagai bagian dari bilah. Jendela timbul menyelesaikan yang pertama tetapi memperburuk yang kedua: ia menutupi kertasnya. Laci di tepi kiri menyelesaikan keduanya sekaligus, sebab kertas ada di kolom kanan. |
| **Laci itu tidak disertai lapisan gelap** | Lapisan gelap adalah tanda "selesaikan ini dulu". Yang dituju justru sebaliknya: mengatur sambil melihat, dan menggulir kertasnya bila perlu. |
| **Membuka laci di ponsel ikut memindahkan panel ke pratinjau** | Lembar bawah menyisakan ruang di atasnya supaya kertas tetap terlihat - dan ruang itu tidak berarti apa-apa bila yang tampil di sana formulir. |
| **Angka di halaman depan menjelaskan dirinya saat disentuh** | "11" dan "5" tidak mengatakan apa pun sendirian, dan keterangan dua kata di bawahnya hanya menyebutkan namanya, bukan artinya. Penjelasannya ditaruh di satu tempat di bawah barisan, bukan di bawah masing-masing angka: empat kalimat sekaligus mengubah barisan angka menjadi blok teks, dan pada kolom selebar tujuh puluh piksel di ponsel setiap kalimat pecah menjadi belasan baris. |
| **Tinggi kotak penjelasan itu dari isi terpanjang, bukan dari angka `min-height`** | Prompt dan keempat penjelasan ditumpuk pada satu sel grid yang sama, sehingga wadahnya selalu setinggi yang terpanjang - berapa pun lebar layarnya. Angka `min-height` yang ditebak akan meleset di lebar lain, dan meleset lagi begitu kalimatnya suatu saat diubah. |
| **Kemiringan kartu di layar sentuh dipicu jari yang menekan** | Alasan lama mematikannya sama sekali ("tidak ada kursor untuk diikuti") keliru: yang tidak ada di layar sentuh bukan penunjuknya melainkan gerak tanpa menekan. Kekhawatiran yang benar - kartu ikut miring saat menggulir - dijawab peramban sendiri: begitu gulir dimulai, `pointercancel` terkirim dan kartunya kembali datar. |
| **Bahasa antarmuka ditulis ulang, bukan diberi glosarium** | Istilah yang harus dicari artinya lebih dulu menghalangi orang yang justru paling butuh aplikasi ini - orang yang baru pertama menyusun CV. Menambahkan penjelasan di samping istilahnya hanya menambah teks; menggantinya membuat teksnya lebih pendek sekaligus lebih terbaca. |
| **Judul bagian tambahan tetap tidak dapat diketik di kertas** | Judul bagian dicetak setelah diubah bentuknya - kapital seluruhnya, atau Kapital Di Awal Kata, tergantung templatenya. Menulis balik apa yang terlihat akan menyimpan "PELATIHAN DAN WORKSHOP" sebagai judulnya. Kasus yang sama persis dengan alamat proyek yang dirapikan `prettyUrl()`. |
| **Bagian tambahan menambah satu bentuk jalur, bukan izin bagi jalur lima segmen** | Sesi 7 menolak menambahkannya justru karena memperluas `isEditablePath` ke lima segmen akan mengizinkan setiap jalur berlima segmen. Yang ditambahkan sesi 10 adalah bentuk tunggal yang tertutup: segmen pertamanya harus persis `customSections`, segmen ketiganya harus persis `items`. Sembilan bentuk mirip yang tetap harus ditolak dikunci berkas uji. |
| **Token pemulihan disimpan sebagai SHA-256, bukan apa adanya** | Tiket reset yang bocor sama saja dengan kata sandi yang bocor. Diperlakukan seperti kata sandi, dan karena alasan yang sama: tabelnya menjadi tidak berguna bagi siapa pun yang berhasil membacanya. |
| **Kriptografi token dipisah dari kueri basis datanya** | Mengimpor klien Prisma membuat berkasnya menuntut koneksi basis data begitu dimuat - dan bagian yang paling pantas diuji tanpa server justru bagian kriptografinya. |
| **Permintaan tautan selalu dijawab sama, terdaftar maupun tidak** | Membedakan keduanya mengubah titik akhir itu menjadi alat pemeriksa keanggotaan: siapa pun dapat mencoba ribuan alamat dan tahu persis siapa yang punya akun di sini. Konsekuensinya - yang salah ketik alamatnya menunggu surel yang tidak datang - dijawab dengan menyebutkan kemungkinan itu secara eksplisit di layar. |
| **Alamat tautan dalam surel dari `NEXTAUTH_URL`, bukan dari header Host** | Header itu dikirim peramban dan dapat dipalsukan. Tautan pemulihan yang menunjuk ke alamat pilihan penyerang adalah tepat cara mencuri akun. |
| **Panel hero penuh dari tepi ke tepi, tanpa sudut membulat** | Jarak di kiri-kanan-atas dulu dimaksudkan memisahkan hero dari bilah atasnya. Yang sebenarnya terjadi: hero terbaca sebagai kartu yang mengambang di atas halaman putih, dan sapuan tintanya terpotong sebelum sampai ke tepi layar - persis bagian yang paling lebar sapuannya. Alasan panel itu ada sejak sesi 9 tetap utuh, sebab yang memberi tinta batasnya adalah `isolate` dan `overflow-hidden`, bukan sudut membulatnya. Batas bawahnya diserahkan ke bagian berikutnya yang sudah memakai `border-y`; menambahkan `border-b` di sini menghasilkan dua garis berdampingan. |
| **`middleware.ts` menjadi `proxy.ts`** | Next 16 mengganti nama konvensi berkasnya dan memperingatkan setiap kali server dinyalakan. Isinya sama persis - hanya nama berkas dan nama fungsinya yang berubah. Satu hal ikut berubah tanpa menyentuh kode: sejak v16 berkas ini berjalan di runtime Node, bukan lagi edge. Alasan aslinya tetap berlaku dan komentarnya disesuaikan supaya tidak menyesatkan pembaca berikutnya: yang berjalan di depan setiap permintaan tidak boleh menyentuh basis data, apa pun runtime-nya. |
| **Batas laju pemulihan dihitung per alamat surel, bukan per IP** | Yang dijaga di sini bukan penebakan kata sandi melainkan pengiriman surel: tanpa batas per alamat, kotak masuk orang lain dapat dibanjiri dari banyak IP sekaligus - dan yang menanggung akibatnya adalah reputasi alamat pengirim aplikasi ini. |

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
| Teks menempel ke tepi bawah kertas pada CV lebih dari satu halaman - ikut terbawa ke PDF | Margin berupa `padding` elemen kertas, yang hanya berlaku sekali untuk seluruh dokumen yang mengalir; `@page` bermargin nol | Margin dipindah ke `@page`, padding dikosongkan saat mencetak. **Catatan: aturan ini dibalik lagi di sesi 6** demi menghapus kop Chrome - lihat bagian 6. |
| Berkas Word diam-diam berbeda dari PDF | Margin DOCX dipatok 15 mm dan ukuran kertasnya tidak pernah disetel (Word memakai bawaannya, kerap Letter) | Keduanya kini mengikuti pilihan pengguna |
| Pas foto tidak pernah ikut ke berkas Word | `docx/build.ts` sama sekali tidak punya logika gambar - 492 baris, nol | Foto disisipkan sebagai `ImageRun` setelah blok identitas |
| CV dua kolom dihukum di dua dimensi sekaligus | Pembaca PDF mengelompokkan teks hanya menurut koordinat vertikal, sehingga judul bagian menyatu dengan teks kolom sebelah dan tidak pernah terdeteksi | Teks dibaca per kolom lebih dulu; skor CV dua kolom 53 -> 70 |
| Bingkai cetak selalu A4 | `frame.style` dipatok 210x297 mm walau pengguna memilih Legal atau F4 | Mengikuti `paperSpec(pageSize)` |
| Ketidakcocokan hidrasi di halaman depan | `previewResume()` memakai `newId()`, dan id acak itu ditulis ke atribut `data-field` sehingga berbeda antara server dan peramban | Id berurutan yang tetap |
| Ketikan di kertas bisa menimpa poin yang salah | `Bullets` menyaring poin kosong lebih dulu, sehingga nomor di layar berbeda dari nomor di dalam data | Nomor aslinya dibawa serta |
| PDF hasil unduhan berisi satu halaman kosong | Tombol PDF mencetak lewat bingkai tersembunyi, dan dokumen mana yang tercetak adalah perilaku peramban - yang keluar halaman editor. Cacat yang sama sudah "diperbaiki" di sesi 5 | Bingkainya dibuang; tombol menuju halaman cetak dengan `?cetak=1` yang mencetak dirinya sendiri |
| Kop dan kaki Chrome ikut tercetak di CV | `@page` bermargin lebih dari nol menyediakan ruang bagi peramban untuk menggambarnya. Diuji: 2mm pun masih muncul | `@page { margin: 0 }`, margin dipindah ke padding kertas + `box-decoration-break: clone` agar berlaku di setiap halaman |
| Halaman terasa "panjang ke bawah dan tidak jelas" | **Dua** kanvas jaring partikel sekaligus: yang lama di tingkat halaman lupa dilepas saat kanvasnya dipindahkan ke dalam panel hero. Yang di tingkat halaman seluas seluruh dokumen dan digambar ulang setiap bingkai. Tidak ada pemeriksaan otomatis yang dapat menangkapnya - dua kanvas sama sahnya dengan satu | Yang di tingkat halaman dilepas; tinggal satu di dalam hero |
| Sapuan tinta di mode gelap lenyap sama sekali | Bentuk SVG tanpa atribut `fill` **tidak** mewarisi warna teks - bawaannya hitam pekat, dan kertasnya juga hitam | `fill="currentColor"` ditulis eksplisit |
| Sembilan field diizinkan mesin tetapi tidak pernah dapat diklik | Allowlist `edit-path.ts` memuat `educations.degree`, `certifications.issuer`, `skills.name`, dan enam lainnya, tetapi dokumen tidak pernah memasang `data-edit` di sana | Ditandai seluruhnya; `tests/kertas.test.ts` kini memeriksa kedua arah - setiap jalur yang ditandai harus diterima allowlist, dan sembilan field itu harus tetap ada |
| Entri pendidikan baru tidak punya satu pun poin untuk diklik | `emptyEducation()` membuat `bullets: []`, sedangkan tiga pembuat entri lain membuat `[""]` | Disamakan menjadi `[""]` |
| Batas panjang `photoUrl` menolak foto yang baru saja berhasil dikompresi | Batasnya 300.000 karakter, benar untuk foto 200 KB. Begitu ukurannya dinaikkan, base64 menumbuhkan 1 MB menjadi sekitar 1,37 MB karakter - dan galatnya muncul di penyimpan otomatis, jauh dari tempat fotonya dipilih | Batasnya dinaikkan ke 1.500.000 bersama ukuran fotonya, dan hubungan keduanya ditulis di komentarnya |
| Halaman cetak terlihat sempit di layar | Kertas dirender `padding="none"` karena marginnya diserahkan ke `@page`, yang hanya berlaku saat mencetak | Ikut selesai oleh perbaikan di atas - paddingnya kini nyata |
| Sakelar tema tidak ditemukan di ponsel | Ia ikut pindah ke dalam laci navigasi pada sesi 8, bersama seluruh kendali lain. Bahasa dan tombol masuk memang dicari saat dibutuhkan; mode gelap diketuk begitu layarnya terasa terlalu terang, dan yang menuntut dua ketukan serta satu gulir akan disimpulkan tidak ada | Sakelarnya kembali ke bilah atas, juga di layar sempit. Diukur di 320, 360, dan 390: nol luberan mendatar - yang dulu melebarkan dokumen bukan tombol semacam ini melainkan barisan kendali berlebar tetap 224 piksel |
| Halaman lokal memuat ulang dirinya sendiri sesekali, sehingga intro tiba-tiba terputar tanpa ada yang menyentuh apa pun | `allowedDevOrigins` di `next.config.ts` ditulis tangan dan tidak memuat alamat Wi-Fi mesin ini, sehingga Next memblokir kanal HMR dari ponsel. Klien dev yang gagal menyambung akhirnya memuat ulang halamannya. Tercatat satu baris di log server: `Blocked cross-origin request to Next.js dev resource /_next/hmr` | Daftarnya dihitung dari kartu jaringan mesin lewat `os.networkInterfaces()`, jadi tidak pernah usang saat alamatnya berubah. Hanya berlaku di mode pengembangan |
| Halaman depan tampak hitam kosong di ponsel - **dan di production, bukan hanya lokal** | Dua sebab bertumpuk. (1) `loading.tsx` berada di `src/app/`, sehingga **setiap** halaman dibungkus batas Suspense dan dikirim dua bagian: kerangka pemuatan lebih dulu, isi sesungguhnya menyusul di dalam `<div hidden>` yang ditukar oleh sepotong skrip - tanpa JavaScript, penukaran itu tidak pernah terjadi. (2) `.reveal` bermula pada `opacity: 0` dan hanya IntersectionObserver yang memunculkannya, sehingga 41 elemen dikirim tak terlihat | `loading.tsx` dipindah ke `src/app/(app)/` - dashboard dan editor memang menuntut JavaScript, halaman publik tidak. `.reveal` dibalik: terlihat secara bawaan, disembunyikan hanya bila `<html data-anim>` yang dituliskan skrip sinkron di `<head>`, plus jaring pengaman 2,5 detik |
| Angka "11" di halaman depan terlempar ke tepi kiri, beda sendiri dari tiga angka lainnya | `first:pl-0` menghapus padding kiri butir pertama, dan seluruh butir rata kiri sehingga angka satu digit tampak melayang jauh dari tengah keterangannya | Seluruh butir rata tengah; `first:pl-0` dibuang. Pusat angka dan pusat keterangan kini berselisih nol piksel di keempatnya |
| Panel pengaturan tampilan mendorong kertas keluar layar | Ia disisipkan sebagai blok di dalam bilah alat, setinggi sekitar empat ratus piksel | Dipindahkan ke laci yang melayang - kertas tidak bergeser satu piksel pun saat dibuka maupun ditutup |
| Enter di poin bagian tambahan diam-diam berhenti membuat poin baru | Panel pratinjau mengurai jalur poin dengan regex `^([a-z]+)\.(\d+)\.bullets\.(\d+)$`, dan jalur bagian tambahan bersarang satu tingkat lebih dalam | Pembacaan bentuk jalur dipindah ke `parseBulletPath()` di edit-path.ts, satu tempat untuk kedua bentuk |
| Periode pada bagian tambahan tidak akan pernah dapat dibuka | `dateShape(path.split(".")[0])` membaca "customSections" sebagai nama bagian dan selalu memperoleh null | `dateShapeForPath()` yang mengenali kedua bentuk jalur |
| Halaman Pengaturan berakhir "Ada yang tidak beres" bila sesi menunjuk pengguna yang sudah terhapus | `isStaleSessionError` mengenali P2025 dari kata "user" di dalam pesan galat, tetapi pesan Prisma untuk `findUniqueOrThrow` tidak memuat kata itu - nama modelnya ada di `meta.modelName`, bukan di `message`. Contoh galat di berkas ujinya seluruhnya berasal dari `update` dan `delete`, sehingga cabang itu selalu lulus | `meta.modelName` ikut diperiksa, dan halaman kini mengalihkan ke `/login?sesi=habis` lewat `redirectIfStaleSession()` - `errorResponse()` hanya melayani titik akhir API |
| Berkas kedua tidak pernah masuk di halaman Cek CV; halamannya harus dimuat ulang lebih dulu | `Array.from(FileList)` dipanggil **di dalam** updater `setSlots`. FileList dari sebuah `<input type="file">` menunjuk ke input itu dan menjadi kosong begitu `input.value` dikosongkan - dan updater React berjalan setelah penangannya selesai, jadi setelah pengosongan itu. Berkas pertama tetap masuk karena React menghitung state seketika saat tidak ada pembaruan tertunda | Berkasnya disalin ke larik sebagai baris pertama penangan, sebelum apa pun yang lain |
| Seluruh halaman di grup `(auth)` - `/login`, `/register`, `/lupa-sandi`, `/atur-sandi` - membalas 404 di server lokal, sementara halaman lain normal dan production baik-baik saja | Cache dev Turbopack yang basi di `.next/dev` (817 MB), tertinggal dari sesi yang berakhir dengan Ctrl+C. Berkasnya utuh di disk dan `app-path-routes-manifest.json` memuat keempat rute itu - jadi bukan cacat kode. Pengawas `dev-24jam.ps1` tidak dapat menangkapnya: yang diperiksa portnya, dan portnya memang menjawab; yang salah isi yang dilayani | Hentikan `next dev` (perhatikan: `Stop-ScheduledTask` **tidak** ikut mematikannya - prosesnya cucu dari rantai `cmd` > `npm` > `node`), hapus `.next/dev` saja, lalu nyalakan lagi |

---

## 8. Yang belum dikerjakan

Delapan butir pada daftar sesi 5 sudah ditimbang satu per satu di sesi 6.
Empat dikerjakan, empat ditolak dengan alasannya - lihat tabel keputusan di
`riwayat-pengerjaan.md` sesi 6. Yang masih terbuka:

0. **Uji manual 1-4 di `docs/uji-manual.md` - menahan `git push`.** Lihat
   bagian 2. Ini yang paling mendesak dari seluruh daftar ini, dan satu-satunya
   yang menahan pekerjaan lain.

1. **Pemulihan kata sandi lewat surel sudah ada sejak sesi 10, tetapi belum
   menyala.** Seluruh alurnya terpasang - `/lupa-sandi`, `/atur-sandi`, dua
   titik akhir API, tabel tiket, batas laju, dan surel dua bahasa. Yang belum:
   `BREVO_API_KEY` dan `MAIL_FROM` di Vercel. Selama keduanya kosong, halaman
   `/lupa-sandi` menampilkan penjelasan jalan lama alih-alih formulir yang
   tidak akan mengirim apa pun.

   Hambatan lamanya - surel dari `vercel.app` tanpa SPF/DKIM berakhir di spam -
   dijawab tanpa menunggu domain sendiri: Brevo mengizinkan verifikasi **satu
   alamat pengirim** biasa, Gmail sekalipun. Langkahnya ada di `.env.example`.

   Yang masih pantas dikerjakan kalau nanti punya domain: pindahkan alamat
   pengirimnya ke domain itu, supaya surelnya tidak lagi datang dari alamat
   pribadi.

2. **Pencocokan kata kunci masih tidak mengenali kata berimbuhan.**
   "mengembangkan" dan "pengembangan" dihitung berbeda. Perbedaan ejaan dan
   singkatan sudah tertangani sejak sesi 6. Yang tersisa menuntut pemenggalan
   morfologis, dan itu akan mengorbankan sifat deterministik yang menjadi
   alasan mesin ini dibuat berbasis kaidah - jadi ini batasan yang dipilih,
   bukan yang terlewat.

3. **CSP masih memuat `'unsafe-inline'`.** Pada `style-src` praktis tidak dapat
   dihilangkan: dokumen CV memakai puluhan gaya sebaris, dan nonce tidak
   berlaku untuk atribut `style`. Pada `script-src` bisa dengan nonce, tetapi
   itu menuntut `proxy.ts` berjalan di semua path dan memaksa setiap halaman
   dinamis - bertukar langsung dengan butir 5 di bawah. Permukaan XSS aplikasi
   ini sendiri sempit: tidak ada konten dari pengguna lain, tidak ada komentar,
   tidak ada HTML dari luar.

4. **Struktur CV yang diunggah masih ditebak dari teksnya.** Judul bagian yang
   tidak lazim tetap dinilai lebih rendah - dan itu sendiri pertanda yang
   benar, karena pengurai ATS pun akan kesulitan yang sama. Kerusakan yang
   **bukan** milik CV-nya (teks dua kolom yang menyatu) sudah diperbaiki.

5. **Tidak ada satu halaman pun yang dapat di-cache di server tepi.** Seluruh
   halaman membalas `Cache-Control: private, no-store` dengan
   `X-Vercel-Cache: MISS` selalu, karena membaca cookie bahasa. Memperbaikinya
   menuntut memindahkan bahasa ke segmen alamat (`/en/...`) - 19 berkas pindah,
   15 `generateMetadata` ditulis ulang, sitemap dan robots ikut berubah.

   Perlu diketahui sebelum memutuskan: lambatnya situs production **bukan**
   terutama dari sini. Diukur pada aset statis yang sudah cache HIT, membuka
   koneksi TCP saja 1,7-3,2 detik dan jabat tangan TLS 3,4-6,2 detik. Yang
   memang milik aplikasi sudah diperbaiki di sesi 6 (halaman depan 574 -> 224
   KB, render 0,85 -> 0,24 detik).

6. **Mode tanpa akun hanya menyimpan satu CV.** Batasan yang disengaja:
   menumpuk banyak CV orang di peramban komputer bersama berlawanan dengan
   alasan mode ini dibuat tanpa server. Tombol Unduh/Muat JSON menjawab
   kebutuhan menyimpan beberapa versi tanpa menambah tumpukan itu.

7. **Menyunting di atas kertas kini hampir menyeluruh.** Ketiga batasan sesi 6
   - tanggal, baris gabungan, penambahan entri - ditutup di sesi 7 tanpa
   membatalkan alasan aslinya; lihat tabel keputusan di bagian 6. Yang masih
   lewat formulir dan sengaja dibiarkan:

   - **Alamat proyek dan sertifikat.** Yang tampil sudah dirapikan
     `prettyUrl()` tanpa skema; menulis balik apa yang terlihat akan membuang
     bagian yang sengaja disembunyikan.
   - **Kategori keahlian dan urutan bagian.** Keduanya mengatur susunan, bukan
     isi.
   - **Memulai bagian yang belum punya satu pun entri.** Bagian kosong tidak
     dicetak, jadi tidak ada tempat meletakkan tombolnya di kertas.
   - **Section tambahan (`customSections`).** Entrinya bersarang dua tingkat,
     sehingga jalurnya lima segmen sedangkan `isEditablePath` berhenti di
     empat. Menambah bentuk jalur kelima memperluas permukaan validasi demi
     bagian yang paling jarang dipakai.

   Satu efek samping yang perlu diketahui: selama mode ketik menyala, field
   kosong dan poin kosong ikut tampil, sehingga **jumlah halaman di pratinjau
   dapat terbaca lebih banyak** dari yang sebenarnya. Angkanya kembali tepat
   begitu mode itu dimatikan, dan pada saat yang sama poin kosong dibersihkan.

8. **Penyimpanan akun memakai basis data aplikasi sendiri.** Masuk lewat Google
   hanya dipakai untuk membuktikan identitas; datanya tidak disimpan di dalam
   akun Google pengguna.

9. **Pemulihan kata sandi menunggu kunci Brevo.** Lihat butir 1 - seluruh
   alurnya sudah terpasang dan teruji; yang belum hanya `BREVO_API_KEY` dan
   `MAIL_FROM`. Ada `npm run mail:test -- alamat@tujuan.com` untuk memastikan
   pengirimannya benar-benar sampai begitu kuncinya diisi.

10. **Laci pengaturan pada lembar bawah ponsel belum diperiksa di perangkat
    sungguhan.** Kemiringan kartu di layar sentuh sudah - diuji dengan
    mengirim `PointerEvent` bertipe `touch` sungguhan ke kartunya, dan
    terukur `+3,5deg` di pojok kanan atas, `-3,5deg` di kiri bawah, lalu
    kembali `0deg` begitu `pointercancel` datang. Yang tersisa hanyalah rupa
    lembar bawah itu sendiri, yang menuntut layar sempit sungguhan.

    Catatan untuk pengujian berikutnya: jendela Chrome yang dipakai sepanjang
    sesi ini berada dalam keadaan `visibilityState: "hidden"`, dan di sana
    `requestAnimationFrame` **tidak berjalan sama sekali**. Nilai apa pun yang
    ditulis dari dalam rAF - termasuk `--ix`/`--iy` pada kartu - akan terbaca
    kosong dan menyerupai fitur yang mati. Satu tangkapan layar di antara dua
    pengukuran cukup untuk memaksa satu bingkai berjalan; itulah cara angka di
    atas akhirnya diperoleh.

Sudah selesai sejak sesi 4: berkas uji otomatis (`npm test`, kini 708
pemeriksaan). Sejak sesi 5, jalur peramban diuji dengan menjalankan Chrome
sungguhan lewat DevTools Protocol - termasuk memeriksa isi berkas PDF yang
benar-benar dihasilkan, bukan sekadar keberadaannya.

---

## 9. Bila memakai bantuan AI lagi

Cukup sampaikan hal-hal ini:

> Project di `D:\Website CV`. Baca `memori claude/MULAI-DI-SINI.md` lebih dulu,
> lalu `docs/dokumentasi-teknis.md`. Sudah tayang di
> cv-ats-builder-henna.vercel.app. Jangan jalankan `prisma migrate dev` di
> basis data lokal. Ada pekerjaan yang menahan `git push` - lihat bagian 2.
> Sebelum menyatakan selesai, jalankan
> `npm run typecheck && npm run lint && npm test && npm run build`.

Sejak sesi 10 ada satu hal lagi yang mudah terlewat:

3. **Teks yang dilihat pengguna memakai kata sehari-hari, bukan istilah
   teknis.** Kolom isian bukan "field", desain CV bukan "template", jarak tepi
   bukan "margin", hal yang dinilai bukan "dimensi", berkas cadangan bukan
   "JSON", browser bukan "peramban". Yang membaca aplikasi ini adalah orang
   yang sedang melamar kerja, bukan orang yang membangunnya - dan istilah yang
   harus dicari artinya lebih dulu menghalangi justru yang paling
   membutuhkannya. Komentar di dalam kode tetap boleh - dan memang harus -
   memakai istilah yang tepat.

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
