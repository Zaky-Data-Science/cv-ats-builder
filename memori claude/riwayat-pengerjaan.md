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

## Sesi 5 - 2 September 2026: margin per halaman, cetak PDF, mode tanpa akun

### Yang dikerjakan

1. **Margin yang berlaku di setiap halaman.** Sebelumnya margin adalah
   `padding` pada elemen dokumen, sehingga hanya berlaku sekali untuk seluruh
   dokumen yang mengalir - halaman kedua dan seterusnya tercetak tanpa margin
   atas sama sekali. Diganti dengan aturan `@page { margin }`, satu-satunya
   mekanisme yang dihormati peramban di setiap halaman cetak.
2. **Margin dapat disetel sendiri.** Dua penggeser di panel Tampilan
   (8-30 mm), tersimpan di kolom `marginYMm` dan `marginXMm`. Nilai kosong
   berarti mengikuti bawaan template, sehingga CV lama tidak berubah tampilan.
3. **Pratinjau per halaman tidak lagi memotong hitam.** Lembar kertas memakai
   kelas `.paper-sheet` berlatar putih harfiah. Sebelumnya memakai `bg-white`
   Tailwind, yang di mode gelap ikut dibalik menjadi `#101013` - itulah pita
   hitam yang terlihat. Tinggi terpakai tiap lembar dihitung
   `tinggi halaman - 2 x margin atas`, sehingga jarak bawah sama dengan atas.
4. **Ekspor PDF diperbaiki.** Bingkai cetak tersembunyi dulu berukuran
   `0x0` dengan `visibility:hidden`; Chrome mengabaikannya dan mencetak
   dokumen induknya - editor dua panel - itulah "kolom 2 tidak jelas" yang
   terlihat pengguna. Kini bingkainya berukuran kertas sungguhan dan
   diletakkan di luar layar. Ditambahkan pula halaman cetak mandiri dengan
   bilah "Kembali ke editor" dan "Cetak / Simpan PDF" sebagai jalur cadangan.
5. **Menyusun CV tanpa akun** (`/coba` dan `/cetak`). Datanya hanya di
   `localStorage` peramban pengguna, tidak pernah menyentuh server. Tersedia
   tombol memindahkannya ke akun; pemindahannya berupa tawaran di dashboard,
   bukan impor otomatis, karena komputer bersama membuat impor diam-diam
   memindahkan CV orang lain ke akun siapa pun yang masuk berikutnya.
6. **Panah kembali di bilah atas** setiap halaman, menuju halaman induk yang
   tetap - bukan memundurkan riwayat peramban, yang tidak berfungsi pada
   halaman yang dibuka dari tautan.
7. **Ajakan tindakan diperjelas.** "Mulai Buat CV" menjadi "Masuk atau Daftar
   Akun", berdampingan dengan "Coba tanpa akun", sehingga kedua jalurnya
   terbaca sebagai pilihan yang setara. Tombol Masuk di bilah atas tidak lagi
   disembunyikan di layar sempit.
8. **Lencana "N" Next.js dimatikan** lewat `devIndicators: false`. Lencana itu
   milik kerangka kerja dan memang tidak pernah terbit ke produksi, tetapi
   keberadaannya membuat tampilan lokal berbeda dari Vercel.
9. **Simpul diagram dirapikan ke tengah** pada versi HTML.

### Pengujian

Selain `npm test` (107 pemeriksaan), tiga hal diuji dengan menjalankan Chrome
sungguhan lewat DevTools Protocol - satu-satunya cara jujur menguji hal yang
hidup di peramban.

| Yang diuji | Hasil |
|---|---|
| Mode tanpa akun (13 pemeriksaan) | 13 lulus |
| Jalur berakun + cetak PDF (14 pemeriksaan) | 14 lulus |
| Ajakan tindakan & lencana dev (9 pemeriksaan) | 9 lulus |

PDF yang dihasilkan diperiksa isinya, bukan hanya keberadaannya: 2 halaman,
`MediaBox` 595x842 pt (A4), 115 KB.

### Pemisahan data antar pengguna

Diuji langsung dengan membuat akun kedua, lalu mencoba membuka CV milik akun
pertama:

| Jalur | Hasil |
|---|---|
| `GET/PATCH/DELETE /api/resumes/[id]` | 404 |
| `POST .../duplicate`, `POST .../ats` | 404 |
| `GET .../export/docx`, `.../export/json` | 404 |
| `/resume/[id]/edit`, `/print`, `/ats` | halaman "tidak ditemukan" |

Sempat terlihat seolah data bocor karena nama "Budi Santoso" muncul satu kali
di HTML yang diterima akun kedua. Ternyata itu teks contoh pengisian di kamus
bahasa, yang memang dikirim ke setiap pengunjung. Diuji ulang dengan kalimat
yang hanya ada di isi CV dan tidak ada di kamus: nol kemunculan bagi akun
kedua, satu kemunculan bagi pemiliknya. Pelajarannya, memeriksa keberadaan
kata yang kebetulan juga dipakai sebagai contoh menghasilkan kesimpulan yang
salah.

### Cacat yang ditemukan dan diperbaiki

1. Margin hanya berlaku di halaman pertama (lihat butir 1).
2. Pita hitam di pratinjau per halaman (butir 3).
3. Ekspor PDF mencetak dokumen yang salah (butir 4).
4. Peringatan "1 issue" di mode pengembangan berasal dari ketidakcocokan
   hidrasi pada atribut `data-theme` - skrip tema memang sengaja menuliskannya
   sebelum halaman digambar, sehingga berbeda dari HTML server. Diselesaikan
   dengan `suppressHydrationWarning` pada `<html>`, disertai komentar
   alasannya agar tidak disalahartikan sebagai menyembunyikan masalah.
## Sesi 6 - 3 September 2026: delapan butir yang tersisa, performa, dan menyunting di atas kertas

Sesi ini dimulai dari daftar "yang belum dikerjakan" di sesi 5. Delapan butir
ditimbang satu per satu: empat dikerjakan, empat ditolak, dua penolakan diganti
pekerjaan murah yang menutup hampir seluruh kegunaannya. Di tengah jalan
bertambah empat permintaan baru.

### Keputusan atas kedelapan butir

| # | Butir | Keputusan | Alasan ringkas |
|---|---|---|---|
| 1 | Repositori publik | dikerjakan | riwayat Git diaudit, tidak ada rahasia nyata |
| 2 | Reset kata sandi via surel | ditolak, diganti | hambatannya domain terverifikasi, bukan koding |
| 3 | Kata kunci leksikal | dikerjakan | murah, deterministik, terkurung di satu berkas |
| 4 | Unggah foto | dikerjakan | sekaligus menutup dua cacat yang belum tercatat |
| 5 | CSP `unsafe-inline` | ditolak | separuh mustahil, separuh bertukar dengan butir 7 |
| 6 | Struktur CV unggahan | dikerjakan | yang rusak ternyata pembacaan kolomnya, bukan daftar judulnya |
| 7 | Bahasa ke segmen alamat | ditolak | 19 berkas pindah demi 6 halaman statis |
| 8 | Tamu satu CV | ditolak, diganti | multi-CV melawan alasan mode tamu dibuat tanpa server |

### Yang dikerjakan

1. **Repositori dibuka menjadi publik.** Terverifikasi dari luar tanpa
   kredensial: API GitHub membalas `visibility: public`, lisensi terdeteksi
   MIT, dan klon anonim berhasil - 188 berkas, tanpa satu pun berkas `.env`.

   Persiapan sebelum dibuka: seluruh riwayat commit diaudit, dan yang
   tersaring hanya placeholder `USER:PASSWORD@HOST` beserta kredensial dev
   lokal `postgres:postgres@localhost`. Ditambahkan `LICENSE` MIT - tanpa itu
   berlaku hak cipta penuh, sehingga kode boleh dibaca tetapi tidak boleh
   dipakai bahkan untuk belajar. Kredensial akun demo tetap terbuka karena
   itulah gunanya, tetapi konsekuensinya kini disebutkan di README. Nama tim
   Vercel dan id project Google Cloud dihapus dari catatan.

2. **Kata kunci dicocokkan dalam bentuk kanonik.** Tanda hubung, titik, garis
   miring, dan spasi dibuang saat membandingkan, sehingga `front-end`,
   `front end`, dan `frontend` menjadi satu istilah. Plus dan tagar sengaja
   dipertahankan supaya `c++`, `c#`, dan `c` tetap tiga bahasa berbeda.
   Ditambah `src/lib/ats/aliases.ts` berisi ~55 kelompok padanan yang ditulis
   manual. Perubahan cara pencocokan ini sekaligus menutup arah sebaliknya:
   kecocokan sebagian seperti "java" di dalam "javascript" kini mustahil,
   karena yang dibandingkan token utuh.

3. **CV dua kolom dibaca per kolom.** `detectColumns()` sudah menghitung pita
   kosong yang membelah halaman tetapi membuang letaknya.
   `detectColumnLayout()` kini mengembalikan keduanya dari perhitungan yang
   sama, dan `itemsToText()` mengelompokkan per kolom sebelum per baris.
   Skor CV contoh dua kolom naik 53 menjadi 70; peringatan tata letaknya tetap.

4. **Pas foto diunggah sebagai berkas**, dikecilkan dan dikompresi di peramban
   ke 400x533 piksel lalu disimpan sebagai data URI pada kolom `photoUrl` yang
   sudah ada. Tanpa migrasi - kolomnya sudah `TEXT` sejak migrasi pertama.

5. **Dua pengganti murah.** Tautan "Lupa kata sandi?" di halaman masuk yang
   menjelaskan jalur Google + Pengaturan, dan tombol "Muat dari JSON" di mode
   tamu yang melengkapi "Unduh JSON" yang sudah ada.

### Empat permintaan tambahan di tengah sesi

6. **Menyunting langsung di atas kertas.** Tombol "Ketik di kertas" membuat
   nama, jabatan, ringkasan, judul entri, dan seluruh poin pencapaian dapat
   diklik dan diketik di panel kanan. Yang diketik masuk ke data CV yang sama
   dengan yang diisi formulir, sehingga field di kiri ikut berubah seketika.
   Rancangan lengkapnya di `docs/dokumentasi-teknis.md` bagian 8.1b.

7. **Halaman depan diringankan.** HTML-nya 574 KB, dan 218 KB di antaranya
   muatan React - salinan kedua dari pohon elemen yang sama. Sebelas dokumen
   CV utuh ditulis dua kali. Dua perbaikan: contoh CV untuk pratinjau
   dipangkas ke isi yang memang muat satu halaman (sisanya mustahil terlihat
   karena kartunya memotong tepat di sana), dan pratinjau template dijadikan
   komponen klien yang membangun sendiri datanya sehingga hanya nama template
   yang ikut ke muatan React. **574 -> 224 KB, terkompresi 77 -> 41 KB, render
   di server 0,85 -> 0,24 detik.**

8. **Bingkai cetak mengikuti ukuran kertas.** Sebelumnya dipatok 210x297 mm
   walau pengguna memilih Legal atau F4.

9. **Lencana "N" Next.js tetap dimatikan** - lencana itu hanya muncul saat
   `npm run dev` dan tidak pernah terbit ke production; mematikannya membuat
   tampilan lokal sama persis dengan yang di Vercel.

### Cacat yang ditemukan dan diperbaiki

1. **Foto tidak pernah ikut ke berkas Word.** `src/lib/docx/build.ts` 492 baris
   tanpa satu pun logika gambar. Berkas Word yang diunduh pengguna diam-diam
   berbeda dari PDF yang baru saja dilihatnya, dan tidak ada pemeriksaan yang
   menangkapnya. Ditemukan saat mengerjakan unggah foto.
2. **CV dua kolom dihukum dua kali.** Judul bagian tidak pernah terdeteksi
   karena tergabung dengan teks kolom sebelah, sehingga CV kehilangan poin di
   dimensi kelengkapan maupun keterbacaan - hukuman yang berasal dari cara
   aplikasi ini membaca, bukan dari CV-nya.
3. **Ketidakcocokan hidrasi** setelah pratinjau template dijadikan komponen
   klien: `previewResume()` memakai `newId()`, dan id acak itu ditulis ke
   atribut `data-field` sehingga berbeda antara server dan peramban. Diperbaiki
   dengan id berurutan yang tetap.
4. **Poin pencapaian bisa tertimpa yang salah.** `Bullets` menyaring poin
   kosong lebih dulu, sehingga nomor di layar berbeda dari nomor di dalam data.
   Nomor aslinya kini dibawa serta.

### Ekspor PDF: cacat yang kambuh, dan watermark yang wajib hilang

Ditemukan pengguna setelah seluruh pekerjaan di atas selesai. Berkas PDF yang
diunduh berisi **satu halaman kosong** - yang tercetak hanya kop dan kaki
bawaan Chrome, dan alamat di kakinya menunjuk `/edit`, bukan `/print`. Bukti
bahwa yang dicetak adalah halaman editor, bukan dokumen CV di dalam bingkainya.

Ini cacat yang sama dengan sesi 5 dan sudah dinyatakan diperbaiki di sana.
Perbaikan waktu itu - memberi bingkai tersembunyi ukuran kertas sungguhan -
ternyata tidak bertahan. Yang membuatnya lolos dari pengujian: uji otomatis
memakai `Page.printToPDF` langsung ke halaman cetak, sehingga **melewati
bingkainya sepenuhnya**. Yang diuji halaman cetaknya, bukan tombolnya.

Akar masalahnya: dokumen mana yang dicetak saat `print()` dipanggil pada sebuah
bingkai adalah perilaku peramban, bukan sesuatu yang dapat dipastikan dari sisi
aplikasi. Bingkainya karena itu dibuang sama sekali. Tombol PDF kini menuju
halaman cetak dengan akhiran `?cetak=1`, dan halaman itu memanggil dialog
cetaknya sendiri - mekanisme yang sudah ada sejak sesi 5 sebagai jalur cadangan
dan memang berdiri sendiri. Tidak ada lagi dua dokumen yang bisa tertukar,
sebab hanya ada satu.

**Watermark Chrome.** Pengguna meminta kop dan kaki bawaan peramban (tanggal,
judul tab, alamat halaman, nomor "1/2") hilang sama sekali, sebab CV-nya akan
dikirim ke perusahaan. Diuji satu per satu dengan Chrome sungguhan:

| Aturan @page | Kop/kaki Chrome |
|---|---|
| `margin: 20mm 18mm` (cara lama) | muncul |
| `margin: 5mm 18mm` | muncul |
| `margin: 2mm 18mm` | muncul |
| `margin: 0 18mm` (atas-bawah nol) | masih muncul |
| **`margin: 0`** | **hilang** |

Hanya margin nol di keempat sisi yang menghapusnya. Mematikannya lewat centang
"Headers and footers" di dialog cetak tidak dapat diandalkan - centangnya
menyala secara bawaan dan pengguna tidak selalu tahu.

Konsekuensinya margin halaman harus datang dari tempat lain, dan di situ
muncul persoalan yang sudah dikenal sejak sesi 5: padding pada dokumen yang
mengalir hanya berlaku sekali, sehingga halaman kedua tercetak tanpa margin
atas. Jalan keluarnya **`box-decoration-break: clone`** - properti yang
memerintahkan peramban memperlakukan setiap pecahan halaman sebagai kotak utuh
tersendiri, lengkap dengan paddingnya. Diukur pada CV contoh dua halaman:
margin atas 26mm dan 24mm, margin kiri 18mm dan 18mm. Benar di kedua halaman.

Efek sampingnya menguntungkan: halaman cetak kini juga **tampak benar di
layar**. Sebelumnya kertasnya dirender tanpa padding sama sekali - marginnya
diserahkan ke `@page` yang hanya berlaku saat mencetak - sehingga teksnya
menempel ke tepi kertas dan terlihat sempit. Itu keluhan kedua pengguna, dan
satu perubahan ini menyelesaikan keduanya.

Ditambahkan `tests/cetak.test.ts` yang mengunci syarat-syaratnya. Berbeda dari
berkas uji lain, yang diperiksa adalah bentuk kodenya sendiri - itu disengaja,
sebab hasil cetak sungguhan hanya dapat diperiksa dengan menjalankan peramban,
dan cacat ini sudah lolos dua kali justru karena itu.

### Pengujian

`npm test` bertambah dari 107 menjadi **222 pemeriksaan, seluruhnya lulus** -
lima berkas uji baru: `keywords.test.ts` (38), `photo.test.ts` (12),
`edit-path.test.ts` (36), `stale-session.test.ts` (12), dan `cetak.test.ts` (13).

Selain itu tiga jalur peramban diuji dengan Chrome sungguhan lewat DevTools
Protocol:

| Yang diuji | Hasil |
|---|---|
| Unggah foto + muat JSON di mode tamu (15 pemeriksaan) | 15 lulus |
| Mengetik langsung di atas kertas (12 pemeriksaan) | 12 lulus |
| Cetak PDF A4 dan Legal (9 pemeriksaan) | 9 lulus |

Angka yang tercatat dari pengujian itu: berkas foto 7,3 MB terkompresi menjadi
82 KB pada 400x533 piksel; PDF A4 berukuran 595x842 pt dan Legal 612x1008 pt,
keduanya dua halaman dengan teks yang tetap dapat diseleksi; nol galat
JavaScript di seluruh jalur.

### Catatan tentang lambatnya situs production

Diukur, bukan ditebak. TTFB halaman production 8-15 detik. Tetapi pada aset
statis yang sudah **cache HIT**, membuka koneksi TCP saja memakan 1,7-3,2 detik
dan jabat tangan TLS 3,4-6,2 detik. Artinya sebagian besar lambatnya berasal
dari jalur jaringan ke Singapura, bukan dari kode - dan tidak ada perubahan
kode yang dapat memperbaikinya.

Yang memang milik aplikasi sudah diperbaiki (butir 7 di atas). Satu hal lagi
yang tercatat tetapi belum dikerjakan: seluruh halaman membalas
`Cache-Control: private, no-store` dengan `X-Vercel-Cache: MISS` selalu, karena
membaca cookie bahasa. Tidak ada satu halaman pun yang dapat di-cache di server
tepi. Memperbaikinya menuntut memindahkan bahasa ke segmen alamat - butir 7
pada daftar lama, yang untuk sekarang sengaja tidak dikerjakan.

### Kalibrasi skor setelah perubahan

| Keadaan | Skor |
|---|---:|
| CV kosong | 4 |
| CV contoh, satu halaman | 98 |
| CV contoh berfoto | 95 |
| Berkas PDF satu kolom yang tersusun baik | 98 |
| Berkas PDF dua kolom | 70 (sebelumnya 53) |
| Berkas CV lemah | 45 |


---

## Sesi 7 - 3 September 2026: melengkapi "Ketik di kertas"

Sesi 6 meninggalkan tiga hal yang sengaja tidak dapat disunting dari kertas:
tanggal, baris gabungan (perusahaan + kota + negara), dan penambahan entri.
Sesi ini menutup ketiganya - **tanpa membatalkan satu pun alasan aslinya.**

### Yang membuat ketiganya bisa dibuka

Alasan-alasan sesi 6 ternyata menolak *cara tertentu*, bukan *tujuannya*.
Membaca ulang alasannya satu per satu, bukan kesimpulannya, yang membuka
jalannya:

| Alasan sesi 6 | Yang sebenarnya ditolak | Jalan keluarnya |
|---|---|---|
| Tanggal disimpan "YYYY-MM"; teks bebas akan menerima "Feb 2023" | Tanggal sebagai **teks bebas** | Pemilih bulan yang dipanggil dari kertas. Nilainya tetap dari `<input type="month">` |
| Membelah satu untaian menjadi tiga field hanyalah tebakan | **Pembelahan**-nya | Tiap sub-field dirender sebagai elemennya sendiri sejak awal. Tidak ada yang perlu dibelah |
| Mengetik mengubah kata, bukan struktur | **Mengetik** sebagai pemicu perubahan struktur | Tombol yang ditekan sengaja, dan Enter di poin - kebiasaan pengolah kata yang sudah dikenal |

### Celah yang belum tercatat di mana pun

Ditemukan saat menelusuri kodenya: allowlist `EDITABLE` di `edit-path.ts`
**sudah** memuat sembilan field yang di DOM tidak pernah diberi atribut
`data-edit` - `educations.degree`, `educations.institution`, `projects.role`,
`organizations.name`, `certifications.issuer`, `awards.issuer`,
`publications.publisher`, `skills.name`, `languages.name`. Mesinnya
mengizinkan; penggunanya tidak pernah bisa mengklik. Setelah sesi ini, CV
contoh punya **79 tempat yang dapat diketik** di atas kertas - diukur dari
markup yang benar-benar dirender, bukan dari daftar allowlist-nya.

### Langkah nol: mengunci keluaran sebelum menyentuh apa pun

Pekerjaan ini menuntut membongkar cara baris entri dirender, dan pembongkaran
itu dapat menggeser pemenggalan baris tanpa satu pun pemeriksaan berteriak:
berkas PDF tetap terbentuk, isinya tetap ada, hanya jumlah halamannya berubah.

Karena itu langkah pertama bukan menulis fitur, melainkan merekam acuan:
`tests/fixtures/kertas-acuan.html`, berisi markup dokumen CV untuk **10
template x 2 bahasa** dengan `editable` mati. `tests/kertas.test.ts`
membandingkannya setiap kali `npm test` berjalan. Acuan itu direkam sebelum
satu baris pun diubah, dan tetap identik sampai akhir sesi.

Satu hal yang harus ditangani supaya perbandingannya bermakna: `sampleResume()`
membangkitkan id acak, dan id itu ikut tertulis ke atribut `data-field`. Tanpa
penomoran ulang, dua render dari data yang sama tidak akan pernah sama.

### Yang dikerjakan

1. **`EntryHeader` menerima bagian, bukan untaian jadi.** Penggabungannya
   pindah ke dalam komponen. Saat tidak ada satu pun bagian yang dapat diketik,
   seluruhnya kembali digabung menjadi satu simpul teks - bukan sekadar demi
   keluaran yang identik, melainkan karena teks yang dipecah menjadi beberapa
   simpul membuat React menyisipkan penanda pemisahnya sendiri saat merender di
   server, dan halaman cetak dirender di server.

   Jebakan yang sempat menggigit: `edit()` mengembalikan objek **kosong**, bukan
   `undefined`, ketika mode ketik mati - dan objek kosong tetap bernilai benar.
   Pemeriksaan "dapat diketik" karena itu harus melihat isinya, bukan
   keberadaannya.

2. **Tanggal lewat pemilih bulan.** Dokumen menandai periodenya dengan
   `data-date`; `PreviewPane` yang membuka `DatePopover`. Bentuk tanggal tiap
   bagian dikumpulkan di satu tempat (`dateShape()`), sebab tidak seragam:
   proyek tidak punya `isCurrent`, sertifikasi memakai kolom `issueDate`
   sedangkan penghargaan dan publikasi memakai `date`.

   Popovernya digambar lewat portal ke `<body>`. Kertas berada di dalam
   pembungkus ber-`transform: scale(zoom)`; popover yang menjadi anaknya ikut
   mengecil dan pada perbesaran rendah pemilih bulannya tidak lagi terpakai.

3. **Penampung untuk field kosong.** `joinNonEmpty` membuang bagian kosong,
   sehingga kota yang belum diisi tidak punya elemen untuk diklik - dan justru
   field kosong itulah yang paling perlu diisi. Labelnya digambar lewat
   `::before`: yang disimpan saat kursor pergi adalah `innerText`, dan isi
   bangkitan tidak ikut terbaca di sana. Ditulis sebagai isi sungguhan,
   mengklik "Kota" lalu keluar tanpa mengetik akan menyimpan kata "Kota"
   sebagai nama kota.

4. **Aksi struktural di berkasnya sendiri** (`structure.ts`): tambah/hapus
   entri, tambah/hapus poin, dan pembersihan poin kosong. Terpisah dari
   `applyEdit` karena mengubah panjang larik - salah bagian atau salah nomor
   berarti entri lain ikut terhapus tanpa tanda apa pun di layar.

   Poin kosong dibersihkan saat mode ketik **dimatikan**, bukan saat kursor
   meninggalkan sebuah poin. Membersihkan pada saat lepas fokus akan menghapus
   poin yang baru saja dibuat pengguna tepat ketika ia mengkliknya untuk
   mengetik.

5. **Enter di poin membuat poin berikutnya.** Di field lain perilakunya tidak
   berubah. Yang tetap sama pada keduanya: Enter tidak pernah menyisipkan baris
   di dalam elemennya. Fokus ke poin baru dititipkan lewat ref dan dijemput
   efek yang berjalan setelah penggambaran berikutnya - elemennya belum ada di
   DOM saat tombolnya ditangani.

6. **Keahlian dan bahasa ikut dapat diketik**, dengan pengelompokan per
   kategori tetap terlihat: `groupSkills()` membuang entri tanpa nama beserta
   nomornya, jadi mode ketik memakai pengelompokan tandingan yang membawa nomor
   aslinya.

### Cacat yang ditemukan dan diperbaiki

1. **Sembilan field diizinkan mesin tetapi tidak pernah dapat diklik** (lihat
   di atas). Kini dikunci dua arah oleh `tests/kertas.test.ts`: setiap jalur
   yang ditandai dokumen harus diterima allowlist, dan kesembilannya harus
   tetap ada. Jalur salah ketik tidak menimbulkan galat apa pun - `applyEdit`
   memang sengaja mengabaikan jalur tak dikenal - sehingga fieldnya cuma "tidak
   tersimpan" dan pengguna baru sadar setelah ketikannya hilang.
2. **`emptyEducation()` membuat `bullets: []`**, sedangkan tiga pembuat entri
   lain membuat `[""]`. Entri pendidikan baru karena itu tidak punya satu pun
   poin untuk diklik, dan Enter-untuk-poin-baru tidak punya titik awal.
3. **Popover keluar dari layar bagian bawah.** Periode berdiri di tepi kanan
   kertas dan kerap di dekat dasar layar. Letaknya kini dihitung setelah
   tingginya diketahui, dan yang tidak muat di bawah dibalikkan ke atas
   jangkarnya.
4. **Berkas acuan gagal setelah `git stash`.** Git di Windows menuliskannya
   kembali dengan CRLF, dan perbandingan per baris jadi gagal di baris pertama.
   Perbandingannya kini membuang pengembalian kereta lebih dulu - kalau tidak,
   berkas uji ini akan gagal di setiap mesin yang bukan mesin perekamnya.

### Pengujian

`npm test` naik dari 222 menjadi **284 pemeriksaan, seluruhnya lulus** - dua
berkas uji baru: `structure.test.ts` (tanggal dan aksi struktural) dan
`kertas.test.ts` (pengunci markup dan penanda mode ketik).

Pola yang diwarisi dari `edit-path.test.ts` dipegang: setiap "berhasil ditulis"
berpasangan dengan "yang lain tidak ikut berubah" dan "objek asli tidak
termutasi". Jaminan lama ikut dikunci sebagai uji negatif -
`isEditablePath("experiences.0.startDate")` harus **tetap** ditolak, sebab
kanal teks bebas tidak boleh ikut longgar hanya karena tanggal kini punya
kanalnya sendiri.

Jalur peramban diuji dengan Chrome sungguhan di `/coba`:

| Yang diuji | Hasil |
|---|---|
| Penanda terpasang saat mode ketik menyala | 79 `data-edit`, 14 `data-date`, 9 `data-add` |
| Menyunting kota dari kertas | tersimpan ke `city`, perusahaan dan negara tidak tersentuh |
| Pemilih bulan rentang | "Mei 2020 - Sekarang", tersimpan `"2020-05"`, `isCurrent` mengosongkan bulan selesai |
| Pemilih bulan tunggal (sertifikasi) | satu isian, tanpa centang, menulis ke `issueDate` - bukan `date` |
| Letak popover | dibalik ke atas jangkarnya saat tidak muat di bawah; tetap 232 px pada perbesaran kertas berapa pun |
| Escape | menutup popover tanpa mengganggu pembatalan suntingan teks |
| Enter di poin | poin baru dibuat, kursor berpindah ke sana |
| "+ Tambah entri" | entri kosong muncul lengkap dengan penampungnya |
| Mematikan mode ketik | poin kosong dibersihkan, seluruh penanda hilang |
| Halaman cetak | nol penampung, nol penanda |

### Catatan tentang pengujian di peramban

Dua kali tersesat mengejar cacat yang tidak ada, keduanya kesalahan alat ukur:

- `document.body.innerText.slice(0, 100)` mengembalikan "Memuat halaman..." -
  teks `sr-only` milik kerangka pemuatan yang kebetulan berada paling awal di
  dalam body. Halamannya sendiri sudah utuh.
- Koordinat klik dihitung dengan faktor skala tangkapan layar yang sudah basi
  setelah ukuran jendela berubah, sehingga kliknya mendarat di elemen lain.
  Gejalanya menyerupai "field ini tidak tersimpan".

Yang meluruskan keduanya: membandingkan dengan kode sebelum perubahan
(`git stash`). Baselinenya berperilaku persis sama - dan itu menutup dugaan
regresi dalam satu langkah.

---

## Sesi 8 - 3 September 2026: tampilan ponsel, dan tanda pengenal bertinta

Dua pekerjaan yang tidak berhubungan, dikerjakan berurutan: memperbaiki
tampilan di ponsel, lalu menambahkan intro pembuka bertema tinta beserta umpan
balik sentuhannya.

### Bagian satu: mengapa tampilan ponsel keliru

Keluhannya: di Android halaman hanya memakai sebagian lebar layar dan
menyisakan pita gelap di sisi kanan - "seperti tata letak desktop yang
diperkecil". Di laptop tampilannya baik-baik saja.

**Yang dikerjakan lebih dulu bukan menulis ulang tata letak, melainkan
mengukur.** Halaman depan dirender di dalam iframe berlebar tertentu - media
query tetap dievaluasi terhadap lebar iframe - lalu dicari elemen mana yang
tepinya melewati lebar viewport:

| Lebar viewport | Lebar dokumen | Kelebihan |
|---:|---:|---:|
| 320 | 398 | +80 |
| 360 | 398 | +40 |
| 375 | 398 | +24 |
| 390 | 398 | +9 |
| 768 ke atas | - | 0 |

Elemen yang meluber selalu sama, dan cuma satu: barisan kendali di
`PublicHeader` - bahasa, tema, tombol akun, dan tombol menu berdampingan dalam
satu baris **berlebar tetap 224 piksel**, dan itu pun saat pengguna sudah
masuk. Pada screenshot yang dikirim, penggunanya belum masuk, sehingga ada dua
tombol ("Masuk" dan "Daftar Gratis") dan barisannya jauh lebih lebar - itulah
sebabnya "Daftar Gratis" pecah menjadi dua baris.

Jadi dokumennya memang lebih lebar daripada layarnya, dan pita gelap itu ruang
di luar `body`. Sisa halaman depan sudah mobile-first sejak awal:
`grid gap-12 lg:grid-cols-[...]`, `md:grid-cols-2`, tombol `w-full sm:w-auto`.

Kalau langsung menulis ulang tata letaknya, satu sesi akan habis memperbaiki
yang tidak rusak - dan penyebab sebenarnya kemungkinan besar tetap tertinggal.

#### Yang diubah

1. **`PublicHeader` ditulis ulang.** Di bawah 768 piksel bilahnya hanya memuat
   identitas dan tombol menu; seluruh kendali lain pindah ke laci. Laci berisi
   lima tautan, grup "Tampilan" (bahasa dan tema), lalu tombol akun. Tutup
   lewat X, klik lapisan gelap, Escape, dan berpindah halaman. Gulir halaman
   dikunci lewat `overflow` pada `<html>` - bukan `position: fixed` pada
   `<body>`, yang membuang posisi gulir pengguna.
2. **Statistik menjadi 2x2 di ponsel.** Empat kolom pada 320 piksel menyisakan
   sekitar 70 piksel per kolom - cukup untuk angkanya, tidak cukup untuk
   keterangannya.
3. **Judul hero memakai `clamp(1.7rem, 7.4vw, 2.1rem)`.** Di atas 640 piksel
   diambil alih `sm:` seperti sebelumnya, jadi tampilan lebar tidak bergeser.
4. **Padding tablet `md:px-8`, kembali ke `lg:px-5`.** Turun lagi di desktop
   memang tidak lazim, tetapi itu yang menjamin tampilan lebar tidak bergeser
   sedikit pun - dan di atas 1152 piksel wadahnya sudah dibatasi `max-w-6xl`
   sehingga paddingnya tidak lagi terlihat.
5. **`body { overflow-x: clip }`** sebagai jaring pengaman.
6. **Sasaran sentuh 44 piksel** lewat elemen bangkitan pada `pointer: coarse`.

#### Jebakan yang menggigit di tengah jalan

Laci pertama kali muncul **tergencet setinggi bilahnya sendiri**. Sebabnya
`backdrop-blur` pada `<header>`: penyaring latar menjadikan elemennya blok
penampung bagi keturunan `position: fixed`, sehingga `inset-0` berarti "nol
terhadap bilah", bukan terhadap layar. Kodenya terlihat benar; yang salah
anggapan tentang apa yang dimaksud "nol". Lacinya kini digambar lewat portal
ke `<body>`.

#### Hasil

Nol luberan mendatar pada 320, 360, 375, 390, 412, 768, 820, 1024, 1280, 1440,
dan 1920 - di halaman depan maupun di `/bandingkan`, `/panduan`, `/tentang`,
`/alur`, `/login`, dan `/coba`.

### Bagian dua: tinta

Tanda pengenal rupa berupa tinta hitam-putih: intro pembuka sekali per
perangkat, latar berpartikel, dan bercak tinta di setiap sentuhan. Tanpa
pustaka baru, tanpa berkas gambar.

Seluruhnya bersandar pada satu variabel `--ink` berisi tiga bilangan RGB,
sehingga tiap efek menentukan kepekatannya sendiri. Cukup dua blok tanpa
cabang `prefers-color-scheme`, sebab `THEME_INIT_SCRIPT` di `<head>` selalu
menuliskan `data-theme` sebelum halaman digambar.

Intronya: kertas CV muncul, siluet samurai melintas di belakangnya, satu
tebasan membelah kertasnya, tinta menyebar, halaman depan tersingkap. 2,1
detik. Siluetnya SVG sebaris yang mewarisi `currentColor`.

#### Tiga hal yang baru terlihat setelah dijalankan

Ketiganya tidak mungkin ditemukan dengan membaca kode:

1. **Siluet putih di atas kertas putih lenyap.** Di mode gelap tintanya putih,
   dan kertasnya juga putih - yang tersisa di layar hanya sepasang kaki di
   bawah selembar kertas. Siluetnya dipindah ke belakang kertas, dan yang
   terlihat justru bagian yang menjulur keluar. Itu pula yang membuatnya
   terbaca sebagai sosok di balik kertas.
2. **Siluet pertama terbaca seperti bidak catur.** Topinya kubah, badannya
   trapesium, kakinya dua persegi. Digambar ulang dengan kasa berbentuk
   kerucut, badan menyempit di bahu lalu melebar seperti hakama, dan kaki
   dalam kuda-kuda.
3. **Tebasan pertama terbaca seperti berkas cahaya.** Pita lurus setebal sama
   selebar layar. Diperbaiki dua hal: bentuknya menjadi lensa bermata runcing
   lewat `clip-path`, dan panjangnya diikat ke ukuran kertas - bukan ke ukuran
   layar, supaya yang terjadi adalah tebasan terhadap kertas itu, bukan
   kejadian yang berdiri sendiri di seluruh halaman.

Ditemukan juga bahwa jahitan antara dua bagian kertas terlihat sebagai garis
diagonal samar **sebelum** ditebas - penghalusan tepi peramban menyisakan celah
selebar sebagian piksel. Kedua bagian kini ditumpangkan setengah persen.

#### Latar dan sentuhan

Latar memakai satu `<canvas>`, bukan puluhan elemen berposisi mutlak. Jumlah
partikel mengikuti luas layar (satu per 26.000 piksel persegi, ditahan antara
14 dan 46), kerapatan piksel dibatasi 2, aliran tinta hanya muncul mulai 768
piksel, dan penggambaran berhenti saat tab tidak terlihat.

Bercak sentuhan mengikuti pola `CursorGlow` yang sudah terbukti: tanpa state
React, ber-rAF, dibatasi jarak dan waktu. Ditambah satu pembatas yang tidak ada
di sana - **batas jumlah yang hidup bersamaan**. Dua pembatas lama menjaga laju
kelahiran, bukan jumlah yang menumpuk; pada perangkat lambat animasinya selesai
lebih lama daripada laju kelahirannya.

Percikan cahaya lama di `CursorGlow` dilepas. Dua efek di titik sentuh yang
sama tidak terbaca sebagai dua efek, melainkan sebagai satu efek yang keliru.

#### Pengurangan gerak

Dihormati bertingkat, bukan sebagai sakelar tunggal: intro tidak diputar sama
sekali, latar tidak dipasang, jejak sapuan dimatikan, tetapi bercak ketukan
tetap ada - hanya menjadi kilasan 220 milidetik. Yang diminta pengguna adalah
berkurangnya gerak, bukan hilangnya umpan balik.

### Catatan tentang cara mengujinya

Hidrasi di mesin ini lambat luar biasa - puluhan detik, bahkan pada build
produksi di localhost. Menangkap frame animasi 2,1 detik dengan tangkapan layar
biasa karena itu mustahil.

Yang dipakai: durasi intro dinaikkan sementara menjadi 60 detik, lalu seluruh
animasinya dibekukan lewat `document.getAnimations()` dan `currentTime`-nya
digeser ke momen yang ingin diperiksa. Ketiga cacat di atas ditemukan dengan
cara itu, dan tidak satu pun akan tertangkap tanpa melihat gambarnya.

Durasinya dikembalikan ke 2100 setelah selesai.


---

## Sesi 9 - 3 September 2026: rupa hero bertinta, dan sebuah pengukuran yang ternyata palsu

Lanjutan sesi 8. Permintaannya: tampilan halaman depan dibuat menyerupai mockup
referensi - tinta sumi-e yang benar-benar terlihat, jaring partikel berkait
garis, dan hero berupa panel tersendiri. "Rombak besar tidak apa-apa."

### Yang dikerjakan

1. **Hero menjadi panel membulat tersendiri** (`.hero-panel`), bukan bagian
   yang menyatu dengan halaman. Sapuan tinta dan jaring partikel harus punya
   batas: dibiarkan mengalir ke seluruh halaman, keduanya akan berada di
   belakang setiap paragraf sampai ke footer - dan tinta di belakang teks yang
   harus dibaca berhenti menjadi rupa, berubah menjadi gangguan.

2. **Sapuan tinta sumi-e** (`InkWash`) - aliran tinta bersulur di tepi kiri
   panel, dengan dua aksen di sisi kanan yang hanya muncul mulai 768 piksel.
   Dibangkitkan, bukan berupa berkas gambar: mengikuti tema lewat satu
   variabel `--ink`, tajam di kerapatan piksel apa pun, dan tidak menambah
   satu pun permintaan jaringan pada halaman yang baru dipangkas ke 224 KB.

3. **Jaring partikel** (`InkBackground` ditulis ulang) - titik yang hanyut
   beserta garis penghubung yang memudar seiring jarak. Jaring itulah yang
   membedakannya dari sekadar bintang bertaburan, dan itu yang paling khas
   dari rupa yang dituju. Kanvasnya kini `absolute` dan milik hero, bukan
   `fixed` menutupi halaman.

4. **Statistik bergaris pemisah**, dan **navigasi lengkap baru muncul di 1024
   piksel** - lihat sesi 8 untuk sebabnya.

5. **Urutan hero di ponsel diubah**: teks, lalu pratinjau CV, lalu tombol dan
   statistik. Pratinjaunya muncul begitu penjelasannya selesai dibaca, bukan
   setelah seluruh isi hero. Di layar lebar susunannya tetap dua kolom.

   Caranya: grid berisi **tiga** blok, dan penempatan baris-kolomnya baru
   diberikan mulai `lg:`. Di bawah itu ketiganya mengalir menurut urutan
   penulisannya - dan urutan penulisan itulah urutan yang benar untuk ponsel.
   Tidak ada satu pun elemen yang dirender dua kali; menggandakan pratinjau
   CV demi dua urutan akan mengembalikan beban yang dipangkas di sesi 6.

### Cacat yang ditemukan dan diperbaiki

**Dua kanvas jaring partikel sekaligus.** Saat kanvasnya dipindahkan ke dalam
panel hero, yang lama di tingkat halaman lupa dilepas. Yang di tingkat halaman
berukuran seluas **seluruh dokumen** dan digambar ulang setiap bingkai untuk
daerah yang bahkan tidak terlihat.

Gejalanya dilaporkan pengguna sebagai "temanya jadi panjang ke bawah, tidak
jelas" - garis-garis tinta samar yang terlihat sampai ke dasar halaman, bukan
hanya di hero. Tidak satu pun pemeriksaan otomatis dapat menangkap ini: dua
kanvas sama sahnya dengan satu.

### Pelajaran terpenting sesi ini: pengukuran yang tidak sah

Sapuan tinta mula-mula dibuat dengan penyaring SVG (`feTurbulence` +
`feDisplacementMap`). Ia diganti dua kali karena "terukur sangat mahal":
mula-mula 100 bingkai tidak selesai dalam 45 detik, lalu 15 bingkai juga
tidak.

**Kedua angka itu palsu.** Jendela Chrome yang dipakai menguji sedang
terhalang, sehingga `document.visibilityState` bernilai `hidden` - dan tab
tersembunyi membuat peramban menghentikan `requestAnimationFrame` sama sekali.
Gelung pengukurannya karena itu tidak pernah berjalan, dan yang tercatat
bukan biaya penyaring melainkan waktu tunggu yang tidak ada ujungnya.

Hal yang sama menjelaskan seluruh keluhan "hidrasi di mesin ini lambat luar
biasa" sepanjang sesi 7 sampai 9: tab tersembunyi juga membuat React menunda
hidrasi. Bukan mesinnya, bukan kodenya.

Yang perlu diingat untuk pengujian berikutnya:

> Sebelum mengukur apa pun yang bergantung pada bingkai atau hidrasi,
> **periksa `document.visibilityState` lebih dulu.** Bila `hidden`, tidak ada
> angka dari tab itu yang berarti.

Rancangan kanvas yang sekarang tetap dipertahankan, tetapi alasannya kini
berdiri sendiri dan tidak bersandar pada angka palsu itu: kanvas digambar
sekali lalu menjadi bitmap, sehingga kanvas partikel yang beranimasi di
atasnya tidak memaksa apa pun dihitung ulang. Penyaring SVG sebaliknya
dihitung ulang setiap kali daerahnya digambar ulang - dan apa pun yang
beranimasi di atasnya menjamin itu terjadi terus. Itu sifat penyaring SVG,
bukan hasil pengukuran.

### Yang dicoba, ditolak, dan dibuang

Satu putaran pekerjaan dibatalkan atas permintaan pengguna: mengganti cahaya
kursor dengan jejak tinta (`InkPointer`), membuka kemiringan kartu untuk layar
sentuh, menghapus intro pembuka, dan mempekatkan bercak sentuh. Sebabnya
tampilannya rusak - dan kerusakan itu, seperti diuraikan di atas, sebenarnya
berasal dari kanvas ganda, bukan dari perubahan itu sendiri.

Dua hal dari putaran itu tetap sah dan layak dicoba lagi kapan-kapan, dengan
catatan bahwa keduanya belum pernah terbukti bekerja di perangkat sungguhan:

- `motion.tsx` membatasi kemiringan kartu ke `(hover: hover) and (pointer:
  fine)`, sehingga **di ponsel tidak terjadi apa pun sama sekali**. Alasan
  yang tertulis di komentarnya ("tidak ada kursor untuk diikuti") keliru: yang
  tidak ada di layar sentuh bukan penunjuknya melainkan gerak tanpa menekan.
  Yang benar-benar perlu ditangani hanya pemulihan keadaan saat jari diangkat.
- Cahaya pengikut kursor dan bercak sentuh dulu berjalan bersamaan, masing-
  masing memasang `pointermove` sendiri pada `window` dengan pembatas laju
  yang tidak saling tahu.

### Pengujian

`npm test` tetap **284 pemeriksaan, seluruhnya lulus** - termasuk pengunci
markup dokumen CV, yang membuktikan seluruh pekerjaan rupa ini tidak menyentuh
satu karakter pun keluaran jalur cetak.

Nol luberan mendatar pada 320, 360, 375, 390, 412, 768, 820, 1024, 1280, 1440,
dan 1920 - di halaman depan maupun di `/bandingkan`, `/panduan`, `/tentang`,
`/alur`, `/login`, dan `/coba`.

Urutan hero di ponsel diperiksa dari urutan DOM, bukan dari tata letak: pada
satu kolom keduanya sama, dan urutan DOM dapat diperiksa tanpa bergantung pada
tab yang terlihat.


---

## Sesi 10 - 4 September 2026: bahasa manusia, laci tampilan, dan pemulihan kata sandi

Permintaannya lima hal sekaligus, sebagian datang lewat tangkapan layar dari
ponsel: selesaikan butir yang masih terbuka, betulkan barisan angka di halaman
depan yang "ke pinggir sendiri, beda sendiri", pindahkan panel pengaturan yang
"terlalu memenuhi space" supaya perubahannya tetap terlihat, dan - yang paling
besar - tulis ulang seluruh teks aplikasi memakai "bahasa manusia" sehingga
"orang awam bisa langsung faham". Di tengah pengerjaan ditambahkan satu lagi:
angka di halaman depan harus menjelaskan dirinya sendiri saat disentuh.

### Tiga keputusan yang ditanyakan lebih dulu

Dua butir pada daftar terbuka tidak dapat dikerjakan tanpa keputusan pengguna,
dan satu lagi menentukan bentuk seluruh pekerjaan berikutnya:

| Pertanyaan | Jawaban |
|---|---|
| Bentuk panel pengaturan | Laci samping kiri di layar lebar, lembar bawah di ponsel |
| Pemulihan kata sandi lewat surel | Dibangun; pengguna menyiapkan Brevo sendiri |
| Pindahkan bahasa ke alamat (`/en/...`) demi cache edge | Dilewati - lihat alasannya di bawah |

Butir cache edge dilewati dengan alasan yang sudah tercatat sejak sesi 6:
lambatnya situs production bukan berasal dari sana melainkan dari TCP (1,7-3,2
detik) dan TLS (3,4-6,2 detik), sementara ongkosnya 19 berkas pindah dan
seluruh alamat berubah.

### 1. Barisan angka di halaman depan

Gejalanya dilaporkan dari ponsel: pada susunan dua kolom, angka "11" terlempar
ke tepi kiri sementara tiga angka lainnya tidak.

Sebabnya dua sekaligus. `first:pl-0` menghapus padding kiri butir pertama saja,
dan seluruh butir rata kiri - sehingga angka satu digit seperti "5" tampak
melayang jauh dari tengah keterangannya yang panjang. Keduanya diselesaikan
dengan menjadikan setiap butir rata tengah. Pusat angka dan pusat keterangan
kini berselisih **nol piksel** di keempat butir; diukur, bukan dikira-kira.

### 2. Angka yang menjelaskan dirinya sendiri

Permintaan yang datang di tengah pengerjaan: "kalau kursor atau kita pencet
angka itu ada penjelasan maksudnya apa".

Penjelasannya ditaruh di **satu tempat di bawah barisan**, bukan di bawah
masing-masing angka. Empat penjelasan sekaligus akan mengubah barisan angka itu
menjadi blok teks, dan pada kolom selebar tujuh puluh piksel di layar ponsel
setiap kalimat akan pecah menjadi belasan baris.

Satu hal yang baru benar pada percobaan kedua: tingginya. Mula-mula dipakai
`min-h` yang ditebak - dan terukur menggeser tata letak 18 piksel begitu
penjelasan terpanjang muncul. Gantinya, prompt dan keempat penjelasan
ditumpuk pada satu sel grid yang sama, sehingga wadahnya selalu setinggi isi
terpanjang berapa pun lebar layarnya. Terukur 58,5 piksel pada kelima keadaan,
tanpa satu pun angka yang perlu ditebak.

### 3. Panel tampilan menjadi laci

Keluhannya: panelnya "terlalu memenuhi space", warnanya menyatu, dan
"kalau pop up juga gk bisa liat perubahannya karena ketutup".

Ketiganya satu masalah. Sebagai blok di dalam bilah alat, panel itu mendorong
kertas turun sekitar empat ratus piksel - sehingga perubahan yang baru saja
diatur justru tidak terlihat - dan warnanya, abu sangat muda di atas putih,
membuatnya terbaca sebagai bagian dari bilahnya. Jendela timbul menyelesaikan
yang pertama tetapi memperburuk yang kedua, dan pengguna sudah menolaknya
lebih dulu.

Laci di tepi kiri menyelesaikan keduanya sekaligus, sebab kertas ada di kolom
kanan. Tanpa lapisan gelap: lapisan gelap adalah tanda "selesaikan ini dulu",
sedangkan yang dituju justru mengatur sambil melihat.

Terukur di layar lebar: kertas **tidak bergeser satu piksel pun** saat laci
dibuka maupun ditutup (dx 0, dy 0), tepi kirinya di x=782 sementara laci
berakhir di x=352, dan menggeser besar huruf langsung mengubah `article.paper`
dari 10pt ke 12pt selagi lacinya terbuka.

Di ponsel bentuknya lembar bawah setinggi paling banyak 55% layar, dan
membukanya ikut memindahkan panel aktif ke pratinjau - ruang yang disisakan di
atas lembar itu tidak berarti apa-apa bila yang tampil di sana formulir.

### 4. Bahasa manusia

Pekerjaan terbesar sesi ini, dan yang paling banyak menyentuh berkas: dua
kamus antarmuka, pesan mesin penilaian, petunjuk tiap bagian CV, catatan
ukuran kertas, dan seluruh halaman panduan - keduanya dalam dua bahasa.

Contoh yang diberikan pengguna sendiri: "field sebagai salah satu contoh gk
semua orang faham istilah itu".

| Sebelum | Sesudah |
|---|---|
| field | kotak isian |
| section | bagian |
| template | desain CV |
| margin | jarak tepi |
| dimensi penilaian | hal yang dinilai |
| unduh JSON | simpan berkas cadangan |
| pengurai ATS | mesin penyaring lamaran |
| peramban | browser |
| Dashboard | CV Saya |
| ID Kredensial | Nomor Sertifikat |
| opsional | boleh dikosongkan |

Judul halaman depan ikut berubah, dari "Isi field-nya. CV yang terbaca mesin
tersusun sendiri." menjadi "Anda cukup isi datanya. Desain dan susunan CV-nya
beres sendiri."

Yang **tidak** ikut disederhanakan: komentar di dalam kode. Yang membaca
aplikasi ini adalah orang yang sedang melamar kerja; yang membaca kodenya
bukan.

### 5. Butir terbuka yang diselesaikan

**Kemiringan kartu di layar sentuh.** Sesi 9 mencatat bahwa alasan yang
tertulis di komentarnya keliru, tetapi belum memperbaikinya. Yang tidak ada di
layar sentuh bukan penunjuknya melainkan gerak tanpa menekan - jadi geraknya
kini dipicu jari yang sedang menekan. Kekhawatiran yang benar, kartu ikut
miring saat menggulir, dijawab peramban sendiri: begitu gulir dimulai,
`pointercancel` terkirim dan kartunya kembali datar.

**Bagian tambahan dapat disunting di kertas.** Sesi 7 menolaknya karena
jalurnya lima segmen sedangkan `isEditablePath` berhenti di empat, dan
memperluas bentuknya secara umum akan mengizinkan **setiap** jalur berlima
segmen. Yang ditambahkan karena itu bukan "jalur lima segmen" melainkan satu
bentuk tertutup: segmen pertamanya harus persis `customSections`, segmen
ketiganya harus persis `items`. Sembilan bentuk mirip yang tetap harus ditolak
dikunci berkas uji.

Judul bagiannya sendiri tetap lewat formulir, dan itu bukan kelalaian: judul
dicetak setelah diubah bentuknya oleh template, sehingga menulis balik apa yang
terlihat akan menyimpan "PELATIHAN DAN WORKSHOP" sebagai judul aslinya. Kasus
yang sama persis dengan alamat proyek yang dirapikan `prettyUrl()`.

**Pemulihan kata sandi lewat surel.** Hambatan lamanya - surel dari
`vercel.app` tanpa SPF/DKIM berakhir di spam - dijawab tanpa menunggu domain
sendiri: Brevo mengizinkan verifikasi satu alamat pengirim biasa. Yang
dibangun: tabel tiket, dua halaman, dua titik akhir API, batas laju, dan surel
dua bahasa.

Beberapa keputusan yang perlu diketahui sebelum menyentuhnya lagi:

- Yang disimpan di basis data **hash SHA-256 token**, bukan tokennya. Tiket
  reset yang bocor sama saja dengan kata sandi yang bocor.
- Permintaan tautan **selalu dijawab sama**, terdaftar maupun tidak.
  Membedakannya mengubah titik akhir itu menjadi alat pemeriksa keanggotaan.
- Alamat tautan di dalam surel diambil dari `NEXTAUTH_URL`, **bukan** dari
  header `Host` - header itu dapat dipalsukan, dan tautan pemulihan yang
  menunjuk alamat penyerang adalah tepat cara mencuri akun.
- Batas lajunya dihitung **per alamat surel**, bukan per IP: yang dijaga di
  sini pengiriman surel, bukan penebakan kata sandi.
- Kriptografinya dipisah dari kuerinya (`password-reset.ts` vs
  `password-reset-store.ts`) supaya bagian yang paling pantas diuji tetap
  dapat diuji tanpa basis data.

Diuji terhadap basis data lokal: tautan sah menggantikan kata sandi (200,
sandi lama tidak lagi berlaku), tautan yang sama dipakai lagi ditolak 400,
tautan asing ditolak 400, tautan kedaluwarsa ditolak dengan alasan "expired",
kunci Brevo yang salah menghasilkan 500 - bukan berpura-pura terkirim - dan
permintaan keempat untuk satu alamat ditolak 429.

### Pelajaran sesi ini: sebuah pengukuran palsu, lagi

Tab yang dipakai menguji kembali berada dalam keadaan `visibilityState:
"hidden"` sepanjang sesi. Akibatnya persis seperti yang dicatat sesi 9:
`getBoundingClientRect()` mengembalikan tinggi **nol** untuk seluruh halaman,
termasuk elemen yang jelas-jelas ada dan berisi lima anak. Sempat terbaca
sebagai "komponen barunya tidak dirender".

Yang menyelamatkan kali ini adalah catatan sesi 9 itu sendiri. Pengukuran
diulang setelah tab sempat terlihat, dan angkanya langsung masuk akal.

Satu lagi yang sejenis, dan lebih halus: skrip uji yang menyisipkan tiket
kedaluwarsa **lewat `pg` mentah** melaporkan tiket itu diterima. Sempat
terbaca sebagai bug keamanan. Ternyata kolomnya `TIMESTAMP(3)` tanpa zona
waktu: `pg` menulis waktu lokal (WITA, +8), Prisma membacanya sebagai UTC, dan
"satu menit lalu" berubah menjadi "tujuh jam lagi". Diuji ulang lewat jalur
aplikasi sendiri - Prisma di kedua sisi - tiketnya ditolak dengan benar.

> Yang perlu diingat: **jalur uji yang berbeda dari jalur aplikasi dapat
> berbohong ke dua arah.** Bukan hanya gagal pada yang benar, tetapi juga
> lulus pada yang salah.

### Cacat yang ditemukan tetapi sengaja tidak diperbaiki

Halaman Pengaturan berakhir "Ada yang tidak beres" bila sesi menunjuk pengguna
yang sudah terhapus - keadaan yang sudah punya penanganannya sendiri sejak
sesi 6. Sebabnya: `isStaleSessionError()` mengenali P2025 dari kata "user" di
dalam pesan galat, sedangkan pesan Prisma untuk `findUniqueOrThrow` berbunyi
"No record was found for a query" - nama modelnya ada di `meta.modelName`,
bukan di `message`.

Tidak ikut diperbaiki karena berada di luar yang sedang dikerjakan, dan
perbaikannya menyentuh lebih dari satu tempat: pengenalannya sendiri, dan
penanganan di halaman server component, yang tidak dilayani `errorResponse()`.
Tercatat sebagai butir 9 di bagian "yang belum dikerjakan".

### Putaran kedua: cacat, sentuhan, dan server yang hidup terus

Putaran ini dimulai dari empat hal yang disampaikan sekaligus, sebagian
setelah mencoba aplikasinya di ponsel.

Satu di antaranya mengubah cara kerja seterusnya: **cacat apa pun yang
ditemukan langsung diperbaiki, termasuk yang catatan lama menyatakan sudah
selesai** - sebab kalau catatannya bilang selesai sementara gejalanya masih
ada, yang salah verifikasinya.

#### Cacat 1: berkas kedua tidak pernah masuk di halaman Cek CV

Gejalanya dilaporkan begini: setelah membandingkan satu CV, mengunggah CV baru
tidak bisa - halamannya harus dimuat ulang lebih dulu.

Sebabnya bukan tombol dan bukan tampilan. `Array.from(FileList)` dipanggil di
dalam updater `setSlots`, dan `FileList` yang datang dari sebuah
`<input type="file">` **bukan salinan**: ia menunjuk ke input itu, dan menjadi
kosong begitu `input.value` dikosongkan. Penangannya memang mengosongkannya -
dan harus, kalau tidak memilih berkas yang sama dua kali tidak akan memicu
`change` yang kedua. Updater React berjalan belakangan, setelah penanganya
selesai, jadi setelah pengosongan itu. Yang tersalin larik kosong.

Yang membuatnya sulit ditemukan justru berkas pertama yang selalu berhasil:
saat tidak ada pembaruan state yang tertunda, React menghitung state
berikutnya seketika, sehingga updaternya sempat berjalan sebelum input
dikosongkan. Begitu ada satu hasil analisis di layar, syarat itu tidak lagi
terpenuhi - dan berkas berikutnya lenyap tanpa satu pun pesan galat.

Perbaikannya satu baris yang dipindahkan: berkasnya disalin ke larik sebagai
hal pertama yang dilakukan penangan.

Diuji dari ujung ke ujung di peramban: unggah CV pertama, periksa, lalu unggah
CV kedua **tanpa memuat ulang** - keduanya masuk, perbandingannya terbentuk,
dan menghapus salah satunya lalu menambah yang lain juga berjalan.

Ditambahkan pula ajakan "Tambah CV lagi" tepat di bawah judul hasil. Area
unggahnya memang selalu ada di atas, tetapi setelah hasil satu CV terbentang
ia berada jauh di luar layar - dan yang tidak terlihat sama saja dengan tidak
ada.

#### Cacat 2: halaman Pengaturan pada sesi yang menunjuk pengguna terhapus

Tercatat sebagai temuan di akhir putaran pertama, dan tidak diperbaiki karena
di luar cakupan. Instruksi baru membalik keputusan itu.

`isStaleSessionError()` mengenali P2025 lewat kata "user" di dalam pesan
galat. `update` dan `delete` memang menyebutkannya - tetapi
`findUniqueOrThrow` tidak: pesannya hanya "No record was found for a query",
dan nama modelnya ada di `meta.modelName`. Halaman Pengaturan adalah
satu-satunya yang memakai `findUniqueOrThrow`, dan karena itu satu-satunya
yang tetap jatuh ke "Ada yang tidak beres".

Berkas ujinya lulus sepanjang waktu, dan itu sendiri pelajarannya: **seluruh
contoh galat di dalamnya berasal dari `update` dan `delete`.** Pemeriksaan
yang hanya memuat satu bentuk masukan akan meloloskan bentuk kedua tanpa
pernah menyinggungnya.

Diperbaiki dua sisi: `meta.modelName` ikut diperiksa, dan halaman kini
mengalihkan ke `/login?sesi=habis` lewat `redirectIfStaleSession()` -
`errorResponse()` yang sudah ada hanya melayani titik akhir API, bukan
halaman. Tiga pemeriksaan baru mengunci ketiga bentuknya, termasuk P2025 pada
model lain yang **tidak** boleh disalahartikan sebagai sesi kedaluwarsa.

#### Animasi di layar sentuh

Keluhannya: menekan atau menggeser di halaman tidak menghasilkan gerak apa pun
di ponsel.

Yang memang mati hanya kemiringan kartu, dan itu sudah diperbaiki di putaran
pertama - tetapi belum pernah dibuktikan. Kali ini dibuktikan dengan mengirim
`PointerEvent` bertipe `touch` sungguhan ke kartunya:

| Jari di | `--ix` | `--iy` |
|---|---|---|
| pojok kanan atas | +3,5deg | +3,5deg |
| pojok kiri bawah | -3,5deg | -3,5deg |
| gulir dimulai (`pointercancel`) | 0deg | 0deg |

Cahaya pengikut (`CursorGlow`) dan bercak tinta (`InkTouch`) ternyata sudah
menangani sentuhan sejak sesi 8; keduanya tidak diubah.

#### Server lokal yang hidup terus

Permintaannya: aplikasinya harus dapat dibuka kapan saja, supaya hasil
pekerjaan dapat diperiksa tanpa menyalakan apa pun lebih dulu.

`scripts/dev-24jam.ps1` mengawasi basis data dan aplikasinya, dan
`scripts/pasang-tugas.ps1` mendaftarkannya sebagai Scheduled Task per-pengguna
yang menyala setiap masuk Windows. Tugasnya milik akun ini saja - tidak
menuntut hak administrator, dan dapat dibatalkan dengan `-Hapus`.

**Dua percobaan pertama gagal dengan sebab yang sama**, dan sebab itu pantas
diingat: di Windows, proses yang *menyalakan* sebuah layanan bukan layanan itu
sendiri.

- `prisma dev` menyalakan servernya lalu selesai - dan bila servernya sudah
  hidup, ia keluar dengan kode 0 sambil menulis "Skipped!". Pengawas yang
  memeriksa prosesnya menyalakannya lagi setiap dua puluh detik.
- `npm run dev` pun begitu: rantai `cmd.exe` > `npm.cmd` > `node` membuat
  pembungkusnya dapat selesai sementara Next.js di ujung rantai tetap
  melayani. Beberapa instans akhirnya berebut port 3000, sebagian gagal
  dengan kode 1 - sementara di log terlihat aplikasinya justru melayani
  dengan baik.

Keduanya kini diperiksa dengan cara yang sama: **tanya portnya.** Diuji
dengan mematikan paksa prosesnya - hidup lagi sendiri dalam dua puluh detik.

Alamat Wi-Fi ikut dicatat di log setiap kali menyala. Next.js sendiri hanya
menyebut satu adapter, dan pada komputer ini yang disebutnya justru adapter
VirtualBox (`192.168.56.1`), bukan Wi-Fi yang sesungguhnya - sehingga halaman
itu tampak tidak dapat dibuka dari ponsel padahal bisa.

#### Pelajaran yang ketiga kalinya muncul hari ini

`requestAnimationFrame` **tidak berjalan sama sekali** di tab yang
`visibilityState`-nya `hidden`. Nilai apa pun yang ditulis dari dalam rAF -
`--ix` dan `--iy` pada kartu, misalnya - terbaca kosong, dan menyerupai fitur
yang mati.

Yang membedakannya dari fitur yang benar-benar mati: nilai yang **tidak**
lewat rAF, seperti `--iy-lift` dan `--iscale`, tetap berubah. Perbedaan itu
yang menunjukkan bahwa yang bermasalah lingkungan ujinya, bukan kodenya.

Satu tangkapan layar di antara dua pengukuran memaksa satu bingkai berjalan -
dan itulah cara angka pada tabel di atas akhirnya diperoleh.

> Ditambah dua kejadian sebelumnya - tinggi elemen terbaca nol, dan tiket
> kedaluwarsa yang terbaca sah - hari ini tercatat **tiga** pengukuran yang
> hampir menjadi kesimpulan yang salah. Ketiganya berasal dari lingkungan
> pengujian, bukan dari aplikasinya.

### Putaran ketiga: intro pembuka

Dua permintaan yang saling menarik ke arah berlawanan: geraknya dibuat lebih
halus, dan adegannya diputar setiap kali halaman dimuat ulang - bukan lagi
sekali seumur perangkat.

Yang kedua membatalkan keputusan sesi 8. Keberatan lamanya tetap benar -
pembuka yang berulang berubah dari kesan pertama menjadi penghalang - tetapi
tidak perlu dijawab dengan menolak permintaannya. Ia dijawab dari sisi lain:
adegannya kini **dapat dilewati kapan saja** oleh ketukan, klik, tombol apa
pun, atau gulir. Bukan tombol "lewati" yang harus dicari di pojok layar;
seluruh layar adalah tombolnya. Yang membuat sebuah pembuka menjadi
penghalang bukan kemunculannya, melainkan ketidakmampuan melewatinya.

Penandanya berpindah dari localStorage ke variabel di dalam modul. Bedanya
persis dua perilaku yang dibutuhkan: muat ulang halaman memuat ulang
modulnya juga sehingga intronya kembali, sementara berpindah halaman di
dalam aplikasi tidak - jadi menekan tombol kembali ke beranda tidak
memutarnya lagi. Kunci lama di localStorage ikut dibersihkan sekali saat
modul dimuat; ia tidak lagi dibaca, tetapi akan duduk di perangkat setiap
pengunjung lama selamanya kalau dibiarkan.

#### Apa yang sebenarnya membuat gerak terasa kasar

Bukan kecepatannya. Tiga hal yang ditemukan saat membacanya ulang:

1. **Fase yang berhenti di puncak geraknya.** Sapuan tebasan mencapai panjang
   penuh pada 60%, lalu diam di tempat selama 40% sisanya sambil memudar.
   Sapuan kuas sungguhan tidak berhenti di ujung goresan - ia terangkat
   sambil masih bergerak.

2. **Kurva yang salah arah.** Tirai penutup memakai `ease-in`: mulai lambat,
   mempercepat di ujung. Itu kebalikan dari yang dibutuhkan sesuatu yang
   sedang menghilang, dan yang terasa adalah tirai yang menggantung lalu
   lenyap mendadak di detik terakhir.

3. **Satu kurva untuk beberapa gerak yang berbeda sifatnya.** Siluetnya masuk,
   menahan, menebas, lalu keluar - empat gerak dengan percepatan yang
   seharusnya berbeda, dijalankan dengan satu `cubic-bezier` untuk semuanya.
   Hasilnya terbaca seperti sosok yang meluncur di atas rel.

Ketiganya diperbaiki: gerak yang berlanjut sampai memudar, kurva keluar untuk
yang menghilang, dan `animation-timing-function` per langkah keyframe.
Ditambah `will-change` dan promosi lapisan sejak awal - tanpa itu peramban
baru mempromosikan elemennya saat animasinya mulai, dan promosi di tengah
gerak terlihat sebagai satu sentakan pada bingkai pertama.

Susunan waktunya juga dikumpulkan menjadi satu komentar di kepala berkas.
Sebelumnya tiap penundaan tersebar di aturannya masing-masing, dan itu yang
membuat fase-fasenya renggang: menggeser satu angka mengubah tumpang tindih
dengan fase tetangga tanpa ada yang menyadarinya.

Susunan barunya, 2200 ms, tanpa satu pun celah tanpa gerak setelah 80 ms:

```
   0 ─────────────────────────────────────────────────────── 2200ms
   kertas masuk   [ 80 ─── 780 ]
   siluet              [ 540 ──────── 1520 ]
   tebasan                   [1040 ─ 1480]
   kertas terbelah            [1120 ────────────── 2100 ]
   tinta                        [1160 ─────────────── 2160]
   tirai memudar                     [1430 ──────────── 2200]
```

#### Cara memverifikasinya tanpa requestAnimationFrame

Tab yang dipakai menguji tetap `hidden`, dan di sana animasi CSS tidak
berjalan sama sekali. Jalan keluarnya bukan memaksa tab terlihat, melainkan
**menggerakkan animasinya dengan tangan**: `element.getAnimations()`
mengembalikan objek animasinya, dan `currentTime` dapat disetel ke titik mana
pun lalu nilainya dibaca lewat `getComputedStyle`. Tidak satu bingkai pun
dibutuhkan.

Yang terukur dengan cara itu:

| Waktu | scaleX tebasan | opacity |
|---:|---:|---:|
| 1040 ms | 0 | 0 |
| 1150 ms | 0,795 | 1 |
| 1250 ms | 0,992 | 1 |
| 1350 ms | 1,014 | 0,77 |
| 1450 ms | 1,055 | 0,08 |

Tidak ada satu pun momen diam - yang dulu justru mengisi 40% terakhirnya.

Tirai memudar dengan sebagian besar perubahan di awal lalu menipis pelan
(1 → 0,968 → 0,399 → 0,098 → 0,009 → 0), kebalikan dari `ease-in` lama.
Kertas terbelah menahan sekejap di 12% - bergeser hanya 2,3 piksel dalam 120
ms pertama - sebelum meluncur keluar bingkai, sehingga belahannya terbaca
sebagai akibat dari tebasan, bukan kejadian yang berdiri sendiri.

Kemunculan ulang tiap muat ulang dibuktikan dengan `MutationObserver` yang
dipasang sebelum `location.reload()`: lapisan intronya tercatat muncul lagi
pada perangkat yang jelas-jelas sudah pernah melihatnya.

Sisi CSS dari "lewati" ikut diuji - memasang `data-lewat` memunculkan animasi
260 ms pada akarnya dan menjadikan **seluruh** animasi anaknya `paused`,
sehingga tidak ada gerak yang terus meluncur di balik lapisan yang memudar.
Perilaku waktu-nyatanya sendiri tidak dapat diukur dari tab tersembunyi:
Chrome membatasi `setTimeout` di sana, dan angka apa pun yang keluar tidak
berarti.

### Putaran keempat: halaman depan yang hitam kosong di ponsel

Dilaporkan pendek: alamat lokal itu "hitam doang gk ada isinya".

Gejala yang sama sebenarnya sudah terlihat sepanjang sesi ini pada tangkapan
layar - panel hero yang kosong hitam - dan **berulang kali disimpulkan sebagai
artefak tab tersembunyi.** Kesimpulan itu masuk akal setiap kalinya, sebab tab
tersembunyi memang menghasilkan gejala yang mirip. Yang membedakannya cuma
satu hal, dan hal itu baru datang dari luar: laporan dari perangkat sungguhan.

> Pelajaran yang lebih tajam daripada tiga pengukuran palsu sebelumnya:
> penjelasan yang benar untuk lingkungan pengujian **tidak otomatis menjadi
> penjelasan untuk gejala yang sama di tempat lain.**

#### Dua sebab yang bertumpuk

**Pertama, dan yang terbesar: `loading.tsx` berada di `src/app/`.**

Sebuah `loading.tsx` membuat Next.js membungkus halamannya dalam batas
Suspense, dan halaman yang dibungkus dikirim dalam dua bagian - kerangka
pemuatan lebih dulu, lalu isi sesungguhnya menyusul di dalam `<div hidden>`
yang ditukar oleh sepotong skrip. Tanpa JavaScript penukaran itu tidak pernah
terjadi, dan yang tersisa di layar selamanya adalah kerangkanya.

Karena berkasnya ada di akar, itu berlaku bagi **seluruh** halaman - termasuk
halaman depan, panduan, dan tentang.

Terjadi **di production juga**, bukan hanya di server lokal. Diperiksa dengan
mengambil HTML dari cv-ats-builder-henna.vercel.app: sebelas elemen kerangka
pemuatan, dan isi halamannya duduk di dalam `<div hidden>`.

Diperbaiki dengan memindahkannya ke `src/app/(app)/`. Dashboard dan editor
memang mustahil tanpa JavaScript; halaman publik tidak, dan justru merekalah
yang dibuka orang di jaringan seluler yang lambat.

**Kedua: `.reveal` bermula pada `opacity: 0`.**

Empat puluh satu elemen dikirim tak terlihat, dan satu-satunya yang dapat
memunculkannya adalah IntersectionObserver setelah React hidrasi.

Yang membuat cacat ini bertahan sekian lama: komentar di komponennya sendiri
sudah menjanjikan isinya "tetap ada di DOM sejak awal sehingga tetap terbaca
pembaca layar dan mesin pencari meskipun JavaScript gagal dimuat". Janjinya
benar - dan tidak cukup. Terbaca pembaca layar bukan berarti terlihat mata.

Arahnya dibalik: `.reveal` kini terlihat secara bawaan, dan baru disembunyikan
bila `<html>` membawa `data-anim` - atribut yang dituliskan skrip sinkron di
dalam `<head>`, pola yang sama persis dengan skrip tema. Tanpa JavaScript
atributnya tidak pernah ada, dan seluruh isi tampil apa adanya.

Ditambah jaring pengaman: bila setelah 2,5 detik tidak satu pun elemen sempat
ditandai muncul - misalnya karena bundel React gagal dimuat sesudah skrip
`<head>` terlanjur berjalan - atributnya dilepas dan isinya ditampilkan.
Ambangnya diperiksa lewat keadaan yang sebenarnya, ada-tidaknya satu
`[data-shown="true"]`, bukan lewat "apakah React sudah hidrasi": yang perlu
dijamin bukan React-nya hidup, melainkan isinya terlihat.

#### Cara memverifikasinya

Bukan dengan mematikan JavaScript di peramban, melainkan dengan memuat
halamannya di dalam `<iframe sandbox="allow-same-origin">` - tanpa
`allow-scripts`. Halamannya dimuat persis seperti pada peramban yang
JavaScript-nya mati, gagal, atau diblokir, dan DOM-nya tetap dapat dibaca dari
luar.

| | sebelum | sesudah |
|---|---|---|
| judul terlihat | tidak (0 x 0 px) | ya (342 x 138 px) |
| elemen kerangka pemuatan | 11 | 0 |
| `.reveal` dengan opacity 1 | 0 dari 41 | 41 dari 41 |
| tinggi dokumen | 757 px | 12.807 px |

Seluruh halaman publik ikut diperiksa lewat HTML mentahnya - beranda,
bandingkan, panduan, tentang, alur, login, dan coba - dan tidak satu pun masih
menyisakan kerangka pemuatan.

### Putaran kelima: intro yang tidak pernah sempat muncul

Setelah halaman depan tidak lagi kosong, laporan berikutnya: "animasinya pas
refresh gk muncul".

Sebabnya justru akibat samping dari perbaikan sebelumnya, dan pantas
diperhatikan sebagai pola. Lapisan intro baru dirender **setelah React
selesai hidrasi**. Selama halaman depan juga baru terlihat setelah hidrasi,
keduanya datang bersamaan dan urutannya benar. Begitu halamannya diperbaiki
agar tampil dari HTML, intronya tertinggal sendirian di belakang - dan yang
terlihat di ponsel adalah halaman yang sudah terbaca utuh beberapa detik
sebelum adegan pembukanya sempat mulai.

Diukur pada tab uji: lapisan intronya muncul **11,9 detik** setelah pemuatan.
Di ponsel jaraknya lebih pendek, tetapi tetap cukup untuk membuat sebuah
pembuka datang terlambat - dan pembuka yang datang setelah halamannya
terbaca bukan lagi pembuka.

Ditambah satu sebab kedua yang memperburuk: "lewati" yang ditambahkan pada
putaran ketiga menangkap sentuhan sejak milidetik pertama. Menarik layar ke
bawah untuk memuat ulang meninggalkan jari di atas kaca, dan sentuhan yang
sama langsung menghabiskan adegannya.

#### Perbaikannya: keluarkan intro dari jalur React sepenuhnya

- Markup-nya ikut terkirim dari server. `SamuraiIntro` kini komponen server
  tanpa `"use client"`, tanpa satu pun hook, tanpa satu pun impor.
- Yang menyalakannya skrip sinkron di `<head>` lewat atribut `data-intro` -
  pola yang sama dengan skrip tema dan skrip animasi gulir.
- CSS menyembunyikan lapisannya secara bawaan. Tanpa JavaScript atributnya
  tidak pernah ada, dan pengunjung tidak pernah melihat tirai yang tidak akan
  terangkat.
- Seluruh siklusnya - menutup adegan, melewatinya, membersihkan atribut -
  ditangani skrip yang sama.
- "Lewati" diberi jeda setengah detik di awal.

Penandanya pun tidak lagi berupa nilai yang disimpan. Atribut `data-intro`
dilepas sendiri begitu adegannya usai: muat ulang menjalankan skripnya dari
awal sehingga intronya kembali, sementara berpindah halaman di dalam aplikasi
tidak. Dua perilaku yang dibutuhkan, tanpa satu pun nilai yang perlu disimpan.

#### Batas verifikasi yang jujur

Bahwa intronya kini mulai sebelum hidrasi tidak berhasil diukur langsung:
pada tab tersembunyi, iframe uji memuat terlalu cepat dan sampelnya melompat
dari "dokumen kosong" ke "React sudah hidrasi" tanpa satu pun titik di
antaranya.

Yang dapat ditegakkan bukan pengukuran melainkan bentuk kodenya: tidak ada
satu pun bagian React di jalur intro - diperiksa dengan mencari `"use
client"`, hook, dan impor di komponennya, ketiganya nol. Sesuatu yang tidak
menyentuh React tidak dapat menunggu React.

> Pelajaran yang bukan tentang intro: **memperbaiki satu hal yang tertahan
> dapat membuat hal lain yang tertahan pada penyebab yang sama menjadi
> terlihat sendirian.** Halaman dan intro sama-sama menunggu hidrasi; selama
> keduanya menunggu, tidak ada yang janggal.

### Pengujian

`npm test` naik dari **284 menjadi 348 pemeriksaan**, seluruhnya lulus -
termasuk pengunci markup dokumen CV, yang membuktikan seluruh pekerjaan bahasa
dan penyuntingan bagian tambahan tidak menyentuh satu karakter pun keluaran
jalur cetak. (Memang begitu rancangannya: pada `editable=false`, seluruh
penanda sunting yang baru ditambahkan menghilang.)

Yang baru: 29 pemeriksaan jalur bagian tambahan, 32 pemeriksaan pemulihan kata
sandi - keacakan token, panjangnya, hash-nya, bentuk masukan yang diterima,
dan isi surel dua bahasa beserta pelolosan HTML-nya - serta 3 pemeriksaan
bentuk galat P2025 yang selama ini hanya diuji pada satu bentuknya saja.

`npm run typecheck`, `npm run lint`, dan `npm run build` seluruhnya bersih.


---

## Rangkuman angka

Angka di bawah ini per akhir sesi 10.

| Ukuran | Nilai |
|---|---:|
| Berkas kode (TypeScript, TSX, Prisma), di luar hasil bangkitan | 133 |
| Baris kode termasuk berkas uji dan skrip | ~26.100 |
| Tabel basis data | 17 |
| Berkas migrasi | 6 |
| Route aplikasi | 37 |
| Dimensi penilaian ATS | 5 |
| Bagian CV yang dapat diisi | 11 |
| Template CV | 10 |
| Ukuran kertas | 4 |
| Format unduhan | 4 |
| Bahasa antarmuka | 2 |
| Diagram alur (dua bahasa, SVG dan PNG) | 4 |
| Pemeriksaan otomatis | 348 |

---
