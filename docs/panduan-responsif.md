# Panduan Responsif

Aturan tetap untuk menyusun tampilan yang menyesuaikan diri di segala ukuran
layar. Ditulis setelah bilah atas halaman aplikasi terbukti pecah di ponsel
sementara bilah atas halaman publik baik-baik saja — keduanya di proyek yang
sama, karena yang satu melewati proses ini dan yang lain tidak.

Berlaku untuk setiap tampilan baru dan setiap perubahan tata letak.

---

## 1. Satu susunan yang melentur, bukan satu desain per layar

Jangan membuat versi ponsel, versi tablet, dan versi laptop. Buat **satu**
susunan yang mampu berubah bentuk, lalu beri tahu ia kapan harus berubah.

Sebagian besar pekerjaan diselesaikan sendiri oleh susunannya: kotak yang boleh
membungkus ke bawah saat sempit (`flex`, `grid`) sudah menyesuaikan tanpa
diperintah. Titik pindah hanya dipakai untuk sisanya — bukan sebagai alat utama.

Akibat praktisnya: kalau sebuah tampilan butuh banyak titik pindah, biasanya
susunannya yang salah, bukan titik pindahnya yang kurang.

## 2. Titik pindah dicari, bukan dihafal

Jangan memakai angka dari daftar ukuran perangkat. Angkanya ditentukan **isi
halamannya sendiri**.

Caranya: buka halamannya, tarik tepi jendela peramban pelan-pelan dari lebar ke
sempit, dan perhatikan. Di titik mana tampilannya mulai jelek? Di situlah titik
pindahnya.

Titik pindah yang dipakai proyek ini:

| Nama | Lebar | Dipakai |
|---|---|---|
| `xs` | 416px | **milik proyek ini, bukan bawaan Tailwind.** Hanya di bilah pratinjau CV |
| `sm` | 640px | paling sering |
| `md` | 768px | jarang |
| `lg` | 1024px | ambang laci navigasi, dan ambang dua panel di penyunting |
| `xl` | 1280px | sangat jarang |
| `2xl` | 1536px | hanya untuk memakai layar yang sangat lebar |

Dua di antaranya perlu keterangan, sebab keduanya bukan bawaan yang tinggal
dipakai.

**`xs` (416px)** ditambahkan sendiri lewat `--breakpoint-xs` di `globals.css`.
Bawaan Tailwind melompat dari 0 langsung ke 640, padahal ponsel yang lebih
lebar dari 416px sudah punya ruang untuk label tombol di bilah pratinjau CV
("Ketik langsung di kertas", "Terpotong per halaman", "Memanjang") sementara
390px belum. Tanpa `xs` pilihannya cuma dua dan keduanya salah: label
disembunyikan sampai 640 - merugikan ponsel 414-600px yang jumlahnya banyak -
atau ditampilkan sejak 390 dan bilahnya kembali pecah.

Angkanya sendiri dicari, bukan dihafal, persis seperti yang diminta aturan ini:
416px adalah titik ketika ketiga label itu berhenti muat.

**`2xl` (1536px)** dipakai hanya untuk hal yang sebaliknya - ketika layarnya
terlalu lebar, bukan terlalu sempit. Sejauh ini di dua tempat: kolom keempat
pada daftar CV di dasbor, dan pratinjau CV di halaman depan yang ikut membesar.

> Menambahkan titik pindah baru harus lewat tabel ini. Titik pindah yang hidup
> di dalam satu berkas tanpa pernah disebut di sini adalah yang paling mudah
> terlupakan, lalu ditemukan lagi oleh orang berikutnya sebagai kejanggalan
> yang tidak jelas asalnya.

## 3. "Tidak meluber" bukan berarti "muat"

Aturan terpenting di dokumen ini, dan yang paling mahal ditemukan.

`PublicHeader.tsx` semula memakai ambang 768px — angka yang terlihat masuk akal,
sebab di situlah luberan mendatar berhenti. Tetapi saat diuji tepat di 768px,
navigasinya tidak keluar layar melainkan **memampatkan diri**: nama aplikasi
terpangkas menjadi "C...", dan "Bandingkan CV" pecah menjadi dua baris di dalam
bilah setinggi 64 piksel.

Kedua gejala itu **tidak tertangkap oleh pengukuran lebar dokumen**. Hanya
terlihat oleh mata. Ambangnya karena itu digeser ke 1024px.

**Konsekuensinya:** memeriksa responsivitas dengan menghitung lebar, menghitung
elemen, atau membaca kode saja tidak cukup. Harus dilihat gambarnya. Kesimpulan
yang diambil dari ukuran yang mirip-dengan-yang-dimaksud hampir selalu keliru.

## 4. Tentukan lebih dulu siapa yang hilang duluan

Di layar sempit tidak semuanya bisa muat. Karena itu urutan kepentingan
ditentukan **sebelum** menulis kode, bukan diputuskan saat kehabisan ruang.

Susun daftarnya jadi tiga lapis:

| Lapis | Perlakuan |
|---|---|
| Wajib terlihat | tidak pernah disembunyikan di ukuran mana pun |
| Penting | terlihat selama masih ada ruang |
| Sisanya | masuk laci/menu sejak layar menyempit |

Contoh dari bilah atas halaman aplikasi:

- **Wajib:** logo, tombol menu
- **Penting:** lencana peran, tombol tema
- **Laci:** navigasi halaman, bahasa, nama, alamat surel, ganti akun, keluar

> Penanda peran termasuk "penting", bukan "sisanya". Penanda yang tersembunyi
> membuat penggunanya tidak tahu ia sedang masuk sebagai siapa — masalah yang
> sudah pernah terjadi di proyek ini dan memakan waktu untuk disadari.

## 5. Menyembunyikan bukan menyusun ulang

`hidden sm:inline` menghilangkan sesuatu, tidak memindahkannya. Kalau sebuah
elemen cukup penting untuk ada di layar lebar, ia harus **tetap dapat dijangkau**
di layar sempit — lewat laci, menu, atau halaman lain — bukan lenyap begitu saja.

Menyembunyikan hanya sah untuk hal yang memang mubazir di layar kecil, misalnya
label yang sudah terwakili ikonnya.

## 6. Satu pola, dipakai ulang

Proyek ini sudah punya pola laci navigasi yang teruji di
`src/components/PublicHeader.tsx`, lengkap dengan catatan pengujiannya.

Tampilan baru yang butuh laci **memakai pola itu**, tidak membuat pola kedua.
Dua header dengan dua cara berperilaku lebih membingungkan bagi penggunanya
daripada satu header yang penuh.

## 7. Sentuhan, bukan hanya kursor

- Sasaran sentuh minimal **44 piksel**. Kelas `tap-target` sudah menyediakannya.
- Tidak boleh ada fungsi yang **hanya** dapat dicapai lewat hover. Di layar
  sentuh hover tidak ada, dan bila dipaksakan ia justru menempel setelah
  disentuh.
- Efek hover di Tailwind v4 sudah otomatis terbungkus `@media (hover: hover)` —
  tidak perlu ditambahkan penjaga sendiri. Yang perlu ditambahkan justru umpan
  balik tekan (`:active`) supaya sentuhan terasa dijawab.
- `mouseenter` **tetap terkirim** oleh Chrome Android tepat sebelum `click`.
  Kalau sebuah tombol memakai hover untuk menyalakan dan klik untuk mematikan,
  ketukan pertama akan terasa tidak berfungsi. Bedakan dengan
  `pointerType === "mouse"`.

## 8. Cangkang boleh melebar, tulisan tidak

Layar laptop 1920px memerlukan dua keputusan yang berbeda, dan mencampurnya
merusak keduanya.

**Cangkang** - bilah atas, kaki halaman, dan wadah tiap halaman - memakai kelas
`.wadah` di `globals.css`. Satu kelas untuk semuanya, sehingga angkanya dapat
diubah di satu tempat. Batasnya 1920px dengan jarak tepi yang ikut mengecil di
layar sempit: 16px di bawah 640, lalu 24, 32, dan 48.

**Tulisan** tidak ikut. Kalimat yang membentang 1900px membuat mata kehilangan
barisnya saat kembali ke kiri; batas nyaman sekitar 65-75 karakter. Paragraf
karena itu tetap memakai `max-w-2xl`/`max-w-3xl`, atau `.teks-baca` bila
sebelumnya tidak punya batas sama sekali.

Halaman yang seluruh isinya tulisan tidak memakai `.wadah`, dan itu bukan
kelalaian. Ada dua bentuk lain:

**`.wadah-dokumen`** untuk Panduan, Tentang, dan Alur - kolom selebar 1024px
yang **rata kiri, bukan di tengah**. Ketiganya sempat dicoba memakai `.wadah`
penuh, dan hasilnya lebih buruk: diagram alur di Panduan berukuran tetap dan
tercetak di tengah kartunya, jadi wadah yang lebih lebar hanya menambah ruang
kosong. Tetapi bentuk lamanya - 896px di TENGAH layar - juga salah, dengan cara
yang berbeda: pada 1920 judulnya duduk 532px dari tepi sementara logo di bilah
atas duduk 48, sehingga dua benda yang seharusnya sebaris terlihat tidak
berhubungan. Rata kiri menyelesaikan keduanya sekaligus.

**Tanpa wadah khusus** untuk Kebijakan Privasi, Ketentuan Layanan, dan
Pengaturan - ketiganya memang satu kolom sempit dari ujung ke ujung.

> Wadah lebar hanya berguna bagi isi yang memang ikut melar: kartu, tabel,
> grid, dan panel. Sebelum melebarkan sesuatu, tanyakan dulu apakah isinya
> akan mengisi lebar itu - dan buktikan dengan melihat gambarnya.
>
> Dan bila jawabannya tidak, pertimbangkan **rata kiri** sebelum menyerah pada
> "di tengah": ruang kosong yang berkumpul di satu sisi terbaca sebagai
> susunan, sementara yang terbelah dua terbaca sebagai kelalaian.

## 9. Cara mengujinya

Wajib diuji di **tiga lebar**, bukan satu:

| Lebar | Mewakili | Yang diperiksa |
|---|---|---|
| ±390px | ponsel | tidak ada yang meluber, menumpuk, atau terpotong |
| ±768px | tablet | tidak ada yang memampat — lihat aturan 3 |
| ±1280px | laptop | tidak ada ruang kosong yang janggal |

Cara tercepat: tarik tepi jendela peramban pelan-pelan dari lebar ke sempit.
Cara yang lebih teliti: Chrome → `F12` → ikon ponsel di pojok kiri atas panel.

**Kasus khusus — "situs desktop" di ponsel.** Peramban melaporkan lebar besar
padahal layarnya kecil, sehingga tulisan mengecil sampai sulit dibaca. Ini
memang tidak dapat diselesaikan sepenuhnya lewat CSS; yang bisa dilakukan adalah
memastikan susunannya tidak bergantung pada lebar yang dilaporkan saja, dan
menerima bahwa hasilnya tetap rapat.

---

## Daftar periksa singkat

Sebelum sebuah tampilan dinyatakan selesai:

- [ ] Diuji di tiga lebar, dengan **dilihat**, bukan hanya diukur
- [ ] Tidak ada yang memampat atau terpangkas di 768px
- [ ] Urutan "siapa hilang duluan" sudah ditentukan, bukan kebetulan
- [ ] Yang disembunyikan di layar sempit tetap dapat dijangkau lewat jalan lain
- [ ] Sasaran sentuh minimal 44px
- [ ] Tidak ada fungsi yang hanya dapat dicapai lewat hover
- [ ] Memakai pola laci yang sudah ada, bukan pola baru
- [ ] Cangkangnya memakai `.wadah`; paragrafnya tetap punya batas bacanya
- [ ] Titik pindah baru sudah dicatat di tabel aturan 2
