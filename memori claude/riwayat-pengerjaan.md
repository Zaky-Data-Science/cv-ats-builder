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

## Sesi 4 - 2 September 2026: tema, dwibahasa, pembanding CV, dan diagram

Sesi terpanjang sejauh ini. Sepuluh permintaan dikerjakan sekaligus, dibagi
menjadi lima fase agar tiap fase dapat diverifikasi sebelum lanjut.

### Fase 1 - fondasi tampilan

1. **Palet monokrom.** Seluruh token warna diganti menjadi hitam, putih, dan
   tangga abu netral. Warna semantik (baik/waspada/buruk) dipertahankan karena
   skor ATS memerlukan isyarat yang dapat dibedakan sekilas, tetapi
   kejenuhannya ditahan.
2. **Mode terang dan gelap.** Diterapkan dengan *membalik nilai token*, bukan
   menulis varian `dark:` pada tiap elemen. Termasuk `--color-white`, yang di
   mode gelap menjadi permukaan kartu gelap - sehingga `bg-ink-900 text-white`
   tetap berarti "latar gelap, teks terang" di kedua mode. Kertas CV
   dikecualikan: nilainya literal `#ffffff`, karena itulah yang akan tercetak.
   Pilihan disimpan di localStorage dan diterapkan skrip sebaris sebelum
   halaman digambar, sehingga tidak ada kilatan putih saat berpindah halaman.
3. **Dwibahasa Indonesia-Inggris.** Kamus di `src/lib/i18n/`; kamus Inggris
   diketik sebagai `Dictionary`, jadi kunci yang lupa diterjemahkan
   menggagalkan `typecheck`. Bahasa disimpan di cookie, bukan localStorage,
   supaya HTML dari server sudah datang dalam bahasa yang benar.
4. **Cahaya mengikuti kursor**, dan percikan cahaya pada setiap sapuan jari di
   layar sentuh. Tanpa state React sama sekali - posisi ditulis langsung ke
   custom property di dalam requestAnimationFrame, satu tulisan per bingkai.
5. **Keterangan "Tugas Akhir" dihapus** dari seluruh teks yang dilihat
   pengguna. Identitas pembuat tetap dicantumkan.
6. **Ikon buka-tutup** pada daftar pertanyaan diubah dari `+` menjadi `>`
   yang berputar 90 derajat saat terbuka.

### Fase 2 - editor

7. **Ukuran kertas** A4, Letter, Legal, dan F4, dengan A4 sebagai bawaan dan
   yang disarankan. Ukurannya dikirim ke CSS lewat custom property, sehingga
   satu aturan `.paper` melayani keempatnya, dan halaman cetak menyisipkan
   aturan `@page` yang sesuai.
8. **Pratinjau per halaman.** Dokumen dapat dilihat tersambung panjang atau
   terpotong menjadi lembaran terpisah seperti di pengolah kata. Cara
   memotongnya perlu dicatat karena tidak biasa: dokumennya **tidak** dipecah.
   Setiap lembar berisi dokumen yang sama utuh, digeser ke atas sejauh satu
   halaman dikali nomor lembarnya, lalu dipangkas induknya yang setinggi satu
   halaman. Dengan begitu aliran teksnya dihitung peramban persis seperti saat
   dicetak.
9. **Contoh pengisian di setiap field.** Diaudit satu per satu; yang belum
   punya - judul dan keterangan pada section tambahan - dilengkapi.
10. **Saran panjang CV diubah dari "maksimal 2 halaman" menjadi "satu
    halaman"**, dengan penilaian bertingkat: 1 halaman nilai penuh, 2 halaman
    75%, 3 halaman ke atas 25%. CV dua halaman tetap memperoleh saran
    memadatkannya, tetapi tidak dihukum berat.

### Fase 3 - template

11. **Sepuluh template**, dari sebelumnya tiga: Klasik, Modern, Padat,
    Eksekutif, Minimalis, Kronologis, Akademik, Instansi, dan dua template
    berfoto (Formal 3x4 di kanan atas, dan Bulat di tengah atas). Seluruhnya
    tetap satu kolom; yang berbeda hanya tipografi, jarak, garis, dan
    penempatan foto.
12. Pada template berfoto, gambar ditulis **setelah** blok teks di dalam DOM
    lalu digeser ke kanan oleh flexbox - sehingga isi pertama yang ditemukan
    pengurai tetap nama pelamar, bukan gambar tanpa teks alternatif.

### Fase 4 - pembanding dan pemindai CV

13. **Halaman `/bandingkan`**, terbuka tanpa akun. Menerima 1-5 berkas PDF,
    DOCX, atau TXT. Satu berkas berarti "pindai"; dua atau lebih berarti
    "bandingkan".
14. **Seluruh pembacaan berjalan di peramban.** PDF lewat pdf.js, DOCX dibuka
    sebagai arsip zip lalu `word/document.xml` dibaca dan penandanya dibuang -
    jauh lebih ringan daripada memuat pustaka konversi dokumen.
15. **Deteksi tata letak dua kolom.** Seluruh potongan teks dipetakan ke posisi
    horizontalnya, lalu dicari celah lebar yang membelah halaman dan tidak
    pernah dilewati satu pun potongan teks. Ini penting karena kerusakan yang
    ditimbulkan tata letak dua kolom tidak terlihat sama sekali dari teks hasil
    ekstraksinya.
16. **Penilai berkas dibuat terpisah** dari mesin penilai CV terstruktur. Yang
    satu punya data terstruktur, yang lain harus menebak strukturnya dari teks;
    menyatukannya akan memaksa salah satu berpura-pura. Yang dibagi hanya yang
    memang sama: bobot kelima dimensi, daftar kata kerja aksi, daftar frasa
    klise, dan mesin pencocokan kata kunci - sehingga skor dari kedua jalur
    tetap dapat dibandingkan.
17. Setiap aturan penilai berkas menyerahkan **dua kalimat sekaligus**: satu
    untuk keadaan terpenuhi (kelebihan), satu untuk keadaan tidak (kekurangan
    beserta cara memperbaikinya). Daftar kelebihan dan kekurangan karena itu
    tumbuh dari sumber yang sama dan tidak mungkin bertentangan.

### Fase 5 - diagram, dokumentasi, dan berkas uji

18. **Halaman `/alur`** berisi empat diagram: alur menyusun CV, alur
    membandingkan CV, arsitektur dan alur data, serta workflow pengembangan.
19. **Diagram dibangkitkan dari data, bukan digambar.** `src/lib/diagrams.ts`
    melayani halaman /alur sekaligus berkas SVG dan PNG di `docs/diagram/` dan
    `public/diagram/` lewat `npm run diagram`. Diagram yang disimpan sebagai
    gambar hasil gambar tangan selalu berakhir usang; bentuk ini menutup
    kemungkinan itu.
20. **Berkas uji otomatis masuk repositori** - salah satu kekurangan yang
    tercatat sejak sesi 1. `npm test` menjalankan 99 pemeriksaan tanpa server
    maupun basis data.

### Penyesuaian setelah tinjauan pertama

Empat perbaikan setelah tampilannya dilihat langsung:

1. **Sakelar tema jadi satu tombol.** Pilihan "ikut sistem" dihapus sebagai
   pilihan tersendiri - menu tiga pilihan menuntut dua tindakan untuk sesuatu
   yang hanya punya dua keadaan. Setelan sistem tetap dihormati, tetapi
   perannya bergeser: menentukan keadaan **awal** bagi pengunjung yang belum
   pernah memilih. Skrip di `<head>` kini selalu menuliskan `data-theme`,
   sehingga blok `prefers-color-scheme` di CSS menyusut menjadi sekadar jaring
   pengaman bila JavaScript mati.
2. **Cahaya kursor diperbaiki.** Diameternya dipangkas dari 34rem menjadi
   15rem dan kepekatannya dinaikkan kira-kira tiga kali - sorot lebar yang
   samar terbaca sebagai noda pada layar, bukan sebagai cahaya. Titik hitam
   kecil di ujung kursor dihapus sepenuhnya: ia bersaing dengan kursor
   peramban itu sendiri.

   Pada putaran berikutnya ternyata yang paling menentukan bukan ukuran
   maupun kepekatannya, melainkan **bentuk kurva peluruhannya**. Versi
   sebelumnya baru kehilangan separuh kepekatan pada 42% jari-jari lalu
   berhenti di 72%, sehingga bagian tengahnya nyaris rata dan tepinya
   terpotong - terbaca sebagai cakram berwarna, bukan cahaya. Gantinya
   mendekati kurva (1-r)^3 dengan delapan titik henti: separuh kepekatan
   hilang sebelum 15% jari-jari, lalu menipis perlahan hingga tepat nol pada
   100%. Titik hentinya banyak karena gradasi CSS menarik garis lurus
   antar-titik henti; kurva melengkung hanya dapat didekati dengan
   mencacahnya.
3. **Komponen `<Interactive>`.** Kartu di seluruh halaman kini miring ke arah
   kursor, terangkat, dan membesar sepersekian persen. Geraknya sengaja jauh
   lebih halus daripada `TiltCard` yang dipakai kartu CV di halaman depan:
   satu benda utama boleh bergerak tegas, tetapi puluhan kartu yang bergerak
   setegas itu membuat halamannya terasa goyah, bukan hidup.
4. **Tombol utama diarahkan ke `/login`, bukan ke `/dashboard` atau
   `/register`.** Halaman login sendiri sudah mengalihkan pengguna yang sudah
   masuk langsung ke dashboard, sehingga satu tautan melayani kedua keadaan -
   dan tidak ada lagi tombol yang menjanjikan dashboard kepada orang yang
   belum punya akun.

### Perbaikan margin halaman dan margin kustom

Ditemukan saat meninjau mode pratinjau per halaman: teks di dasar halaman
menempel ke tepi kertas, dan halaman berikutnya dimulai dari tepi atas.

**Penyebabnya bukan pratinjaunya.** Margin halaman berupa properti `padding`
pada elemen kertas, sementara aturan cetaknya `@page { margin: 0 }`. Padding
hanya berlaku sekali untuk seluruh dokumen yang mengalir - jadi hanya halaman
pertama yang memperoleh margin atas dan hanya halaman terakhir yang memperoleh
margin bawah. Cacat yang sama ikut terbawa ke berkas PDF, bukan sekadar tampil
salah di layar.

Yang dikerjakan:

1. Margin dipindah ke `@page { margin: <atas-bawah> <kiri-kanan> }` yang memang
   berlaku pada setiap halaman, dan padding kertas dikosongkan saat mencetak.
2. Pratinjau per halaman meniru hal yang sama: dokumennya dirender tanpa margin
   atas-bawah, lalu tiap lembar menyediakannya sendiri. Jumlah halaman dan
   pergeseran isi tiap lembar kini dihitung dari **tinggi terpakai** = tinggi
   kertas dikurangi kedua margin - satuan yang sama dengan yang dipakai
   peramban saat mencetak.
3. Nilai padding template diubah dari untai CSS menjadi angka milimeter
   (`paddingYMm`, `paddingXMm`). Selama nilainya berupa untai teks, properti
   CSS dan aturan `@page` mustahil dijaga tetap sama - keduanya tidak dapat
   saling membaca.
4. **Margin kini dapat disetel sendiri** lewat dua penggeser di panel Tampilan,
   8-30 mm, disimpan pada kolom baru `resumes.marginYMm` dan `marginXMm`.
   Keduanya boleh NULL, dan NULL berarti "ikut template" - disimpan begitu,
   bukan disalin angkanya, supaya CV yang belum pernah disetel manual ikut
   menyesuaikan sendiri ketika templatenya diganti.
5. Berkas Word ikut memakai margin dan ukuran kertas yang sama. Sebelumnya
   marginnya dipatok 15 mm dan ukuran kertasnya tidak pernah disetel sama
   sekali, sehingga Word memakai bawaannya - kerap Letter. Berkas Word diam-diam
   berbeda dari PDF yang baru saja dilihat pengguna.
6. `estimatePages()` di mesin penilaian ikut memakai ukuran kertas dan margin
   sebenarnya, bukan angka A4 dan 15 mm yang dipatok.

Berkas uji bertambah delapan pemeriksaan yang mengunci perilaku ini -
termasuk bahwa mode per halaman benar-benar melepas margin atas-bawah dari
dokumennya, dan bahwa margin bawaan ikut berubah saat template diganti.
Totalnya kini **107 pemeriksaan, 107 lulus**.

### Navigasi kembali di dalam situs

Sebelumnya satu-satunya jalan pulang dari halaman dalam adalah tombol kembali
peramban. Itu bermasalah bukan hanya karena merepotkan: halaman seperti
/panduan atau /login kerap dibuka **langsung** dari hasil pencarian atau dari
tautan yang dibagikan, dan pada keadaan itu tidak ada riwayat untuk dimundurkan
sama sekali.

- Komponen `Breadcrumb` baru, dipasang di /panduan, /tentang, /alur,
  /bandingkan, /privasi, dan /ketentuan. Pada halaman yang sebelumnya memakai
  lencana judul, lencana itu diganti jejak navigasi - keduanya menyampaikan hal
  yang sama, dan jejak navigasi sekaligus menjadi jalan pulang.
- Halaman Pengaturan memperoleh tautan "Kembali ke dashboard". Kedalamannya
  hanya satu, jadi jejak bertingkat akan berlebihan di sana.
- Kerangka halaman masuk dan daftar memperoleh tautan "Kembali ke beranda" di
  bilah atas.
- Butir terakhir jejak navigasi sengaja bukan tautan dan diberi
  `aria-current="page"`.

### Diagram alur di halaman web diluruskan ke tengah

Versi HTML diagram sempat menggeser simpul jalur kiri dan kanan ke tepi,
mengikuti data jalur yang sama dengan versi gambarnya. Itu keliru: di versi
gambar, panah berbelok benar-benar digambar menuju kotak di sampingnya,
sedangkan di HTML penghubungnya hanya satu garis tegak di tengah - sehingga
kotak yang tergeser membuat garisnya menggantung tanpa menyambung ke apa pun.

Versi HTML kini satu kolom lurus di tengah dengan lebar kartu seragam.
Percabangannya tidak hilang: labelnya tetap tampil sebagai lencana di bawah
simpul keputusan. Data jalurnya tetap disimpan dan tetap dipakai versi
gambarnya, tempat jalur itu memang bermakna.

### Hasil pengujian

| Berkas uji | Pemeriksaan | Hasil |
|---|---:|---|
| Kamus dwibahasa | 3 | lulus |
| Mesin penilaian CV terstruktur | 14 | lulus |
| Template CV, ukuran kertas, margin | 63 | lulus |
| Penilai berkas CV | 18 | lulus |
| Pembacaan PDF dan penilaiannya | 9 | lulus |
| **Total** | **107** | **107 lulus, 0 gagal** |

Kalibrasi skor setelah perubahan:

| Keadaan | Skor |
|---|---:|
| CV kosong | 4 |
| CV contoh, satu halaman | 98 |
| CV contoh, dua halaman | 96 |
| CV contoh, empat halaman | 91 |
| CV contoh berfoto | 95 |
| Berkas PDF satu kolom yang tersusun baik | 98 |
| Berkas PDF dua kolom | 53 |
| Berkas CV lemah (tanpa email, tanpa poin berangka) | 45 |

Skor CV contoh identik di kedua bahasa - dibuktikan berkas uji, karena kerangka
data contohnya memang satu dan hanya prosanya yang diterjemahkan.

### Cacat yang ditemukan dan diperbaiki

1. Deteksi kolom tidak berjalan pada halaman berisi sedikit potongan teks -
   ambangnya 40 potongan, terlalu tinggi. Diturunkan ke 12.
2. `pdf.js` versi 6 memindahkan metode pembebasan worker dari objek dokumen ke
   objek tugas pemuatannya. Tanpa memanggilnya, setiap PDF yang dibuka
   meninggalkan satu worker yang terus hidup.
3. Karakter NUL literal tidak sengaja tertulis di dalam pola regex pembersih
   teks, membuat berkasnya terbaca sebagai berkas biner oleh grep. Diganti
   dengan rentang karakter kendali yang ditulis sebagai escape.
4. Daftar kata kerja aksi bahasa Inggris kehilangan bentuk lampau tak
   beraturan yang justru lazim mengawali poin pencapaian - "rebuilt", "wrote",
   "ran", "used". Akibatnya CV contoh berbahasa Inggris memperoleh skor satu
   poin lebih rendah daripada versi Indonesianya. Daftarnya diperluas 40 kata.
5. Label panah balik pada diagram tertutup kotak yang kebetulan berada di
   jalurnya, karena kotak digambar setelah panah. Label panah balik kini
   digambar paling akhir, dan jalurnya dihitung dari kotak paling kiri di
   seluruh diagram - bukan hanya dari kedua ujung panahnya.
6. `document.cookie` ditulis dari dalam badan komponen, ditolak aturan lint
   React Compiler. Dipindahkan ke fungsi biasa di luar komponen - tempatnya
   yang benar untuk efek samping semacam itu.
7. Basis data lokal kehilangan tabel `_prisma_migrations` (akibat kejadian di
   sesi sebelumnya), sehingga `migrate deploy` menolak berjalan. Diperbaiki
   dengan `prisma migrate resolve --applied` untuk kedua migrasi lama, lalu
   migrasi baru diterapkan normal.

---

## Rangkuman angka

Angka di bawah ini per akhir sesi 4.

| Ukuran | Nilai |
|---|---:|
| Berkas kode (TypeScript, TSX, Prisma), di luar hasil bangkitan | 98 |
| Baris kode termasuk berkas uji dan skrip | ~22.700 |
| Tabel basis data | 16 |
| Berkas migrasi | 4 |
| Route aplikasi | 31 |
| Dimensi penilaian ATS | 5 |
| Bagian CV yang dapat diisi | 11 |
| Template CV | 10 |
| Ukuran kertas | 4 |
| Format unduhan | 4 |
| Bahasa antarmuka | 2 |
| Diagram alur (dua bahasa, SVG dan PNG) | 4 |
| Pemeriksaan otomatis | 107 |
