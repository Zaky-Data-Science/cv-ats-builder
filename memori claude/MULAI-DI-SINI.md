# Mulai Di Sini

Catatan pengingat untuk melanjutkan project ini di lain waktu - baik oleh Anda
sendiri maupun oleh asisten AI - tanpa perlu menjelaskan ulang dari awal.

Berkas ini **tidak memuat kata sandi, token, maupun kredensial apa pun.**
Semua rahasia ada di dashboard Vercel dan di berkas `.env` lokal yang tidak
ikut masuk ke Git.

Terakhir diperbarui: **3 September 2026** (sesi 6)

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
| Tim Vercel | ada di catatan pribadi |
| Nama project Vercel | `cv-ats-builder` |
| Basis data | Neon Postgres (`neon-cerulean-anchor`), region Singapore, lewat integrasi Storage di Vercel |
| Folder kode | `D:\Website CV` |
| Repositori GitHub | <https://github.com/Zaky-Data-Science/cv-ats-builder> - **publik** sejak 3 September 2026, branch `main`, berlisensi MIT |
| Deploy otomatis | aktif - setiap `git push` ke `main` memicu deploy sendiri |
| Login Google | **aktif dan sudah diuji** - status OAuth "In production", dapat dipakai akun Google siapa pun |
| Project Google Cloud | `CV ATS Builder` (id ada di catatan pribadi) |

**Hasil uji terakhir di production: 10 dari 10 poin lulus, 0 galat
JavaScript.** Rinciannya ada di `docs/dokumentasi-teknis.md` bagian 6.

---

## 3. Cara menjalankan lagi di komputer

```bash
cd "D:\Website CV"

npm install          # bila node_modules terhapus
npm run db:dev       # nyalakan PostgreSQL lokal (catat nomor port-nya)
npm run dev          # buka http://localhost:3000
npm test             # 197 pemeriksaan, tidak perlu server maupun basis data
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
| `src/lib/ats/engine.ts` | **Inti kebaruan project.** Mesin penilaian 5 dimensi untuk CV terstruktur |
| `src/lib/ats/messages.ts` | Seluruh kalimat keluaran mesin penilaian, dua bahasa. engine.ts tinggal berisi angka dan syarat |
| `src/lib/ats/document.ts` | Penilai **berkas CV yang diunggah** - menebak strukturnya dari teks. Sengaja terpisah dari engine.ts; alasannya ada di komentar berkasnya |
| `src/lib/ats/document-messages.ts` | Kalimat kelebihan/kekurangan untuk penilai berkas |
| `src/lib/intake/extract.ts` | Pembaca PDF (pdf.js) dan DOCX (zip + XML) di peramban, beserta deteksi jumlah kolom |
| `src/lib/ats/vocabulary.ts` | Kata henti, kata kerja aksi, frasa klise |
| `src/lib/ats/aliases.ts` | Kelompok padanan kata kunci - singkatan lawan kepanjangannya. Murni data; alasan apa yang sengaja tidak dimasukkan ada di kepala berkasnya |
| `src/lib/resume/photo.ts` | Kompresi pas foto di peramban dan pembacaan data URI-nya |
| `src/lib/resume/edit-path.ts` | Menulis balik teks yang diketik langsung di atas kertas. Hanya jalur terdaftar yang boleh ditulis |
| `src/components/home/TemplatePreview.tsx` | Pratinjau template di halaman depan. Komponen klien **demi berat halaman**, bukan demi interaktivitas - alasannya di kepala berkasnya |
| `src/lib/i18n/id.ts`, `en.ts` | Kamus antarmuka. `en.ts` diketik sebagai `Dictionary`, jadi kunci yang lupa diterjemahkan menggagalkan build |
| `src/lib/resume/templates.ts` | Katalog 10 template beserta ciri rupanya |
| `src/lib/resume/paper.ts` | Ukuran kertas A4/Letter/Legal/F4 |
| `resumeMargins()` di `templates.ts` | Margin yang berlaku: pilihan pengguna bila ada, kalau tidak bawaan template |
| `src/lib/diagrams.ts` | **Satu sumber** untuk halaman /alur sekaligus berkas gambar SVG/PNG |
| `src/lib/theme.ts` | Store mode terang/gelap di luar React (useSyncExternalStore) |
| `tests/` | 197 pemeriksaan; `npm test` |
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
| `src/middleware.ts` | Pengalihan awal halaman terlindungi (hanya kenyamanan, bukan lapisan keamanan) |
| `docs/` | Panduan pengguna, dokumentasi teknis, panduan deploy |

---

## 6. Keputusan penting dan alasannya

Bagian ini yang paling sering ditanyakan penguji. Alasannya disimpan di sini
supaya tidak perlu diingat-ingat lagi.

| Keputusan | Alasan |
|---|---|
| **PostgreSQL, bukan SQLite** | Rencana awal memakai SQLite, tetapi filesystem platform serverless bersifat sementara - berkas `.db` akan hilang setiap kali deploy ulang. |
| **Margin memakai `@page`, bukan `padding`** | `padding` pada elemen hanya berlaku sekali untuk dokumen yang mengalir, sehingga halaman kedua dan seterusnya tercetak tanpa margin atas. Hanya `@page { margin }` yang dihormati peramban di setiap halaman. |
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
| **Sakelar tema satu tombol, tanpa pilihan "ikut sistem"** | Menu tiga pilihan menuntut dua tindakan untuk sesuatu yang hanya punya dua keadaan. Setelan sistem tetap dihormati, tetapi perannya bergeser menjadi penentu keadaan **awal** - dituliskan skrip di `<head>` sebagai atribut `data-theme` sebelum halaman digambar. |
| **Tombol utama menuju `/login`, bukan `/dashboard` atau `/register`** | Halaman login sudah mengalihkan pengguna yang sudah masuk langsung ke dashboard, sehingga satu tautan melayani kedua keadaan - dan tidak ada tombol yang menjanjikan dashboard kepada orang yang belum punya akun. |
| **Cahaya kursor memakai kurva peluruhan bercacah, bukan tiga titik henti** | Gradasi CSS menarik garis lurus antar-titik henti; tiga titik menghasilkan dua ruas lurus, dan dua ruas lurus terbaca sebagai cakram berwarna - bukan cahaya. Delapan titik mendekati kurva (1-r)^3: separuh kepekatan hilang sebelum 15% jari-jari, lalu menipis hingga tepat nol pada 100%. |
| **Gerak kartu (`Interactive`) jauh lebih halus daripada `TiltCard`** | `TiltCard` dipakai sekali per halaman untuk benda utama; `Interactive` dipakai berpuluh kali. Puluhan kartu yang miring setegas kartu utama membuat halaman terasa goyah, bukan hidup. |
| **Margin halaman berasal dari `@page`, bukan dari padding elemen kertas** | Padding hanya berlaku sekali untuk seluruh dokumen yang mengalir: halaman pertama memperoleh margin atas, halaman terakhir memperoleh margin bawah, dan pergantian halaman di antaranya tidak memperoleh apa pun. `@page` berlaku pada setiap halaman. Pratinjau per halaman meniru hal yang sama lewat "tinggi terpakai" = tinggi kertas dikurangi kedua margin. |
| **Margin kustom disimpan NULL saat mengikuti template** | Menyalin angka template ke kolomnya akan mengunci CV pada margin template lama tanpa pengguna pernah memintanya. NULL membuat CV ikut menyesuaikan sendiri saat templatenya diganti. |
| **Diagram versi HTML satu kolom, versi gambar berjalur** | Di versi gambar, panah berbelok benar-benar digambar menuju kotak di sampingnya; di HTML penghubungnya hanya garis tegak di tengah, sehingga kotak yang tergeser membuat garisnya menggantung. Data jalurnya tetap satu, hanya cara menampilkannya yang berbeda. |
| **Jejak navigasi, bukan hanya tombol kembali peramban** | Halaman dalam kerap dibuka langsung dari hasil pencarian atau tautan yang dibagikan - pada keadaan itu tombol kembali peramban tidak punya riwayat untuk dimundurkan sama sekali. Butir terakhirnya sengaja bukan tautan: tautan menuju halaman yang sedang dibuka hanya menambah sasaran papan ketik yang tidak melakukan apa-apa. |
| **Kredit pembuat tidak ikut di CV** | CV adalah dokumen milik pelamar. Mencantumkan nama pihak lain akan membingungkan perekrut dan merugikan penggunanya. |
| **Tidak mencantumkan statistik "sekian persen CV ditolak ATS"** | Angka yang beredar luas itu tidak punya sumber primer yang dapat diverifikasi - berisiko dipertanyakan penguji. |
| **Kata kunci dibandingkan dalam bentuk kanonik, tetapi plus dan tagar dipertahankan** | Membuang tanda hubung menyamakan "front-end" dengan "frontend" - itu memang satu keahlian. Membuang plus dan tagar akan menyamakan "c++", "c#", dan "c" - itu tiga bahasa berbeda. |
| **Pas foto disimpan sebagai data URI, bukan di penyimpanan objek** | Mode tanpa akun menyimpan seluruh CV di localStorage dan tidak pernah menyentuh server; penyimpanan berkas akan memaksanya punya id sesi anonim beserta pembersihan berkas yatim. Satu jalur kode melayani kedua mode, dan tidak ada berkas yang bisa tertinggal setelah CV-nya dihapus. |
| **Foto pada DOCX diletakkan setelah blok identitas, bukan berdampingan** | Satu-satunya cara meletakkan gambar berdampingan teks di Word adalah tabel atau kotak teks - dua penyebab tersering kegagalan pengurai ATS yang sejak awal dihindari berkas itu. |
| **Menyunting di kertas disimpan saat lepas fokus, bukan tiap ketukan tombol** | Elemen contentEditable menyimpan teksnya sendiri di DOM; menulis ke state React tiap huruf membuat React menggambar ulang elemennya di tengah pengguna mengetik, dan kursor melompat ke awal paragraf. |
| **Hanya jalur terdaftar yang boleh ditulis dari kertas** | Nilai `data-edit` berasal dari DOM, dan DOM dapat disunting siapa pun lewat konsol. Penyetel jalur bebas akan mengizinkan penulisan ke `id`, yang memutus hubungan entri dengan barisnya di basis data. |
| **Pratinjau template di halaman depan jadi komponen klien** | Sebagai komponen server, seluruh pohon elemen dokumen ikut ditulis dua kali ke halaman - sekali sebagai HTML, sekali lagi sebagai muatan React. Untuk sebelas dokumen, salinan kedua itu saja lebih dari 200 KB. |

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
| Teks menempel ke tepi bawah kertas pada CV lebih dari satu halaman - ikut terbawa ke PDF | Margin berupa `padding` elemen kertas, yang hanya berlaku sekali untuk seluruh dokumen yang mengalir; `@page` bermargin nol | Margin dipindah ke `@page`, padding dikosongkan saat mencetak, pratinjau per halaman memakai "tinggi terpakai" |
| Berkas Word diam-diam berbeda dari PDF | Margin DOCX dipatok 15 mm dan ukuran kertasnya tidak pernah disetel (Word memakai bawaannya, kerap Letter) | Keduanya kini mengikuti pilihan pengguna |
| Pas foto tidak pernah ikut ke berkas Word | `docx/build.ts` sama sekali tidak punya logika gambar - 492 baris, nol | Foto disisipkan sebagai `ImageRun` setelah blok identitas |
| CV dua kolom dihukum di dua dimensi sekaligus | Pembaca PDF mengelompokkan teks hanya menurut koordinat vertikal, sehingga judul bagian menyatu dengan teks kolom sebelah dan tidak pernah terdeteksi | Teks dibaca per kolom lebih dulu; skor CV dua kolom 53 -> 70 |
| Bingkai cetak selalu A4 | `frame.style` dipatok 210x297 mm walau pengguna memilih Legal atau F4 | Mengikuti `paperSpec(pageSize)` |
| Ketidakcocokan hidrasi di halaman depan | `previewResume()` memakai `newId()`, dan id acak itu ditulis ke atribut `data-field` sehingga berbeda antara server dan peramban | Id berurutan yang tetap |
| Ketikan di kertas bisa menimpa poin yang salah | `Bullets` menyaring poin kosong lebih dulu, sehingga nomor di layar berbeda dari nomor di dalam data | Nomor aslinya dibawa serta |

---

## 8. Yang belum dikerjakan

Delapan butir pada daftar sesi 5 sudah ditimbang satu per satu di sesi 6.
Empat dikerjakan, empat ditolak dengan alasannya - lihat tabel keputusan di
`riwayat-pengerjaan.md` sesi 6. Yang masih terbuka:

1. **Pemulihan kata sandi lewat surel belum ada.** Hambatannya bukan koding
   melainkan domain: surel dari `vercel.app` tanpa SPF/DKIM terverifikasi
   berakhir di folder spam. Sementara ini halaman masuk menjelaskan jalan yang
   memang sudah ada - masuk dengan Google memakai alamat surel yang sama, lalu
   buat kata sandi baru di Pengaturan. Bangun yang sebenarnya kalau nanti punya
   domain sendiri.

2. **Pencocokan kata kunci masih tidak mengenali kata berimbuhan.**
   "mengembangkan" dan "pengembangan" dihitung berbeda. Perbedaan ejaan dan
   singkatan sudah tertangani sejak sesi 6. Yang tersisa menuntut pemenggalan
   morfologis, dan itu akan mengorbankan sifat deterministik yang menjadi
   alasan mesin ini dibuat berbasis kaidah - jadi ini batasan yang dipilih,
   bukan yang terlewat.

3. **CSP masih memuat `'unsafe-inline'`.** Pada `style-src` praktis tidak dapat
   dihilangkan: dokumen CV memakai puluhan gaya sebaris, dan nonce tidak
   berlaku untuk atribut `style`. Pada `script-src` bisa dengan nonce, tetapi
   itu menuntut middleware berjalan di semua path dan memaksa setiap halaman
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

7. **Menyunting di atas kertas belum mencakup semuanya.** Tanggal, baris
   gabungan (perusahaan + kota + negara), dan penambahan entri tetap lewat
   formulir. Ketiganya disengaja, alasannya di `docs/dokumentasi-teknis.md`
   bagian 8.1b.

8. **Penyimpanan akun memakai basis data aplikasi sendiri.** Masuk lewat Google
   hanya dipakai untuk membuktikan identitas; datanya tidak disimpan di dalam
   akun Google pengguna.

Sudah selesai sejak sesi 4: berkas uji otomatis (`npm test`, kini 197
pemeriksaan). Sejak sesi 5, jalur peramban diuji dengan menjalankan Chrome
sungguhan lewat DevTools Protocol - termasuk memeriksa isi berkas PDF yang
benar-benar dihasilkan, bukan sekadar keberadaannya.

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
