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

**Tubuh tulisan** tidak ikut. Kalimat yang membentang 1900px membuat mata
kehilangan barisnya saat kembali ke kiri; batas nyaman sekitar 65-75 karakter.
Paragraf yang berurutan karena itu tetap memakai `max-w-2xl`/`max-w-3xl`, atau
`.teks-baca` bila sebelumnya tidak punya batas sama sekali.

**Pengantar bagian adalah pengecualiannya, dan alasannya bukan selera.** Yang
melelahkan pada baris panjang bukan panjangnya melainkan *sapuan balik* - mata
harus menemukan awal baris berikutnya, berulang kali. Satu paragraf pendek di
bawah judul bagian tidak punya sapuan balik sama sekali begitu ia muat dalam
satu baris, sehingga batas 65-75 karakter tidak berlaku di sana.

Yang berlaku justru sebaliknya. Diukur pada 1920 sebelum diperbaiki: pengantar
tiap bagian berhenti di 672px di dalam wadah 1809px, pecah menjadi dua sampai
lima baris, dan terbaca menumpuk di bawah judul yang membentang hampir selebar
halaman - dengan lebih dari seribu piksel kosong di sebelahnya. Dilaporkan zaky
dengan tujuh tangkapan layar: *"teks dibawah bisa nyambung aja kesamping"*.

Pengantar bagian karena itu memakai **`.teks-intro`**, yang melepas batasnya
dan menyerahkannya pada `.wadah`. Hasilnya diukur di lima lebar:

| Lebar | Pengantar bagian, sebelum | Sesudah |
|---|---|---|
| 390 | 343px, tidak berubah | 343px, **tidak berubah** |
| 768 | 672px / 2 baris | 705px / 2 baris |
| 1024 | 672px / 2 baris | 945px / 1-2 baris |
| 1280 | 672px / 2 baris | 1201px / **1 baris** |
| 1920 | 672px / 2 baris | 1809px / **1 baris** |

Di ponsel tidak ada satu piksel pun yang bergeser - wadahnya memang sudah lebih
sempit daripada batas yang dilepas itu.

Garis pemisahnya begini: **paragraf yang berurutan `.teks-baca`, paragraf
tunggal di bawah judul `.teks-intro`.** Kalau ragu, hitung barisnya pada 1920 -
kalau lebih dari tiga, ia tubuh tulisan, bukan pengantar.

Halaman yang seluruh isinya tulisan tidak memakai `.wadah`, dan itu bukan
kelalaian. Ada dua bentuk lain:

**`.wadah-dokumen`** untuk Panduan, Tentang, dan Alur - kolom selebar 1024px,
**di tengah layar**.

Dua bentuk lain sudah dicoba di sini, dan keduanya ditolak. Riwayatnya ditulis
lengkap supaya tidak ada yang mencobanya untuk ketiga kalinya:

| Yang dicoba | Hasilnya |
|---|---|
| `.wadah` penuh 1920px | Lebih buruk. Diagram alur di Panduan berukuran tetap dan tercetak di tengah kartunya, jadi wadah yang lebih lebar hanya menambah ruang kosong - halamannya justru terbaca lebih kosong daripada sebelumnya. |
| Kolom 1024px **rata kiri** | Ditolak setelah dilihat langsung: isinya terbaca "numpuk di kiri". |

Alasan teknis yang mendasari rata kiri memang benar, dan dengan dikembalikan ke
tengah ia hilang lagi: pada 1920 judul halaman duduk sekitar 448px dari tepi
sementara logo di bilah atas duduk 48px, sehingga dua benda yang seharusnya
sebaris terlihat tidak berhubungan. **Itu konsekuensi yang diterima, bukan
cacat yang belum diperbaiki.**

**Tanpa wadah khusus** untuk Kebijakan Privasi, Ketentuan Layanan, dan
Pengaturan - ketiganya memang satu kolom sempit dari ujung ke ujung.

> Wadah lebar hanya berguna bagi isi yang memang ikut melar: kartu, tabel,
> grid, dan panel. Sebelum melebarkan sesuatu, tanyakan dulu apakah isinya
> akan mengisi lebar itu - dan buktikan dengan melihat gambarnya.
>
> Dan bila jawabannya tidak, **ruang kosong di kiri dan kanan kolom yang di
> tengah itu wajar - bukan cacat.** Halaman yang isinya tulisan tidak akan
> pernah mengisi 1920px, dan memaksanya mengisi dengan cara memindahkan
> seluruh kolom ke satu sisi menghasilkan tumpukan, bukan susunan. Yang
> mengurangi ruang kosong itu dengan benar cuma satu: membuat isi yang memang
> bisa melar - kartu, tabel, grid, diagram - ikut melar.

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

## 10. Ada layar yang habis ke bawah, bukan ke samping

Aturan 1-8 di atas seluruhnya bicara soal **lebar**. Itu cukup selama yang
dikhawatirkan luberan mendatar - tetapi ada satu golongan halaman yang justru
kehabisan ruang ke **bawah**, dan pada golongan itu titik pindah lebar tidak
menjawab apa pun.

Hero halaman depan contohnya. Ia dituntut muat dalam satu pandang: bilah atas,
judul, penjelasan, tombol, statistik, dan pratinjau CV sekaligus, tanpa
menggulir. Yang menentukan tuntutan itu terpenuhi atau tidak bukan lebar layar
melainkan tingginya - dan tinggi laptop nyata jauh lebih beragam daripada yang
biasa dibayangkan:

| Layar | Tinggi | Sisa sesudah bilah 65px |
|---|---:|---:|
| 1920x1080 | 1080 | 1015 |
| 1600x900 | 900 | 835 |
| 1440x900 | 900 | 835 |
| 1366x768 | 768 | 703 |
| 1280x720 | 720 | 655 |

Selisih antara yang terlapang dan yang tersempit **360 piksel** - lebih dari
separuh tinggi kertas CV di dalamnya. Satu ukuran tetap yang pas di 1080 pasti
meleset di 720.

Diukur sebelum diperbaiki, dengan jarak tepi tetap `pt-20 pb-24`:

```
1920x1080  hero 880  -> muat
1600x900   hero 880  -> LEBIH 45 piksel
1440x900   hero 790  -> muat
1366x768   hero 790  -> LEBIH 87 piksel
1280x720   hero 790  -> LEBIH 135 piksel
1024x768   hero 823  -> LEBIH 120 piksel
```

Perhatikan 1440 muat sementara 1366 dan 1600 tidak. Urutannya tidak menurut
lebar sama sekali - itu tanda paling jelas bahwa yang salah bukan titik pindah
lebarnya.

### Yang dipakai

**`svh`, bukan `vh`.** Di peramban ponsel `100vh` menghitung layar seolah bilah
alamatnya sudah tersembunyi, sehingga hero yang "pas satu layar" justru
terpotong selama bilah itu masih terlihat. `svh` memakai ukuran terkecil - yang
berarti selalu muat, bukan kadang-kadang.

**Tinggi bilah atas sebagai variabel.** `--tinggi-bilah` di `globals.css`,
berikut satu piksel garis bawahnya. Tanpa piksel itu hero meleset persis satu
piksel, dan satu piksel sudah cukup memunculkan batang gulir.

**Media query `min-height` untuk yang tidak dapat dihitung `clamp()`.** Skala
kertas CV di hero perlu berupa angka tanpa satuan, sementara CSS tidak dapat
membagi satu panjang dengan panjang lain - jadi ia tidak mungkin diturunkan
dari `svh`. Yang dipakai tangga bertingkat:

```css
@media (min-width: 64rem) { .kertas-hero { --doc-scale: 0.5; } }
@media (min-width: 64rem) and (min-height: 47.5rem) { --doc-scale: 0.53 }
@media (min-width: 64rem) and (min-height: 53.75rem) { --doc-scale: 0.58 }
@media (min-width: 64rem) and (min-height: 62.5rem) { --doc-scale: 0.62 }
```

Tangga seperti ini justru lebih dapat diuji daripada rumus: tiap anak tangga
punya angka yang bisa dibuktikan pada viewport tertentu.

**Batas bawah yang menyerah.** `min-height: max(600px, calc(100svh - bilah))`.
Pada jendela yang sangat pendek, memaksa hero mengikuti tinggi layar akan
meremas isinya sampai berhimpitan. Di bawah 600 piksel ia berhenti menyusut dan
halamannya boleh digulir - **menggulir sedikit lebih baik daripada isi yang
bertumpuk.**

### Batasnya

Satu layar dikejar mulai `lg` saja. Di ponsel dan tablet portrait, memaksa
seluruh hero masuk satu layar menuntut pengecilan yang merusak keterbacaan; di
sana yang dikejar **urutan prioritas** - apa yang terlihat lebih dulu - bukan
semuanya sekaligus.

### Yang dikorbankan saat ruangnya kurang - dan yang TIDAK

Tangga di atas sempat dimulai dari 0,42 dan berakhir di 0,56. Angkanya memang
membuat seluruh hero muat, tetapi zaky membandingkannya dengan versi sebelum
perubahan dan menolaknya: kertasnya terbaca sebagai gambar kecil, bukan sebagai
pusat perhatian. *"Jangan mengecilkan CV preview secara berlebihan hanya agar
semua elemen masuk viewport."*

Urutan pengorbanannya karena itu ditetapkan, dan berlaku bagi bagian mana pun
yang dituntut muat satu layar:

1. **ruang kosong** - jarak tepi, celah antar-blok, margin
2. **jarak tegak antar-elemen**
3. **tipografi, sedikit saja**
4. **titik fokusnya - hanya kalau ketiga di atas sudah habis**

Ikut dengannya satu kelonggaran yang membuat urutan itu mungkin dijalankan:
**tepi bawah titik fokus boleh melewati tepi layar.** Yang wajib terlihat utuh
elemen yang membawa keputusan - judul, penjelasan, tombol, statistik - bukan
setiap piksel gambarnya.

Sesudah urutan itu dijalankan, kertas CV di hero justru menjadi **lebih besar**
daripada sebelum seluruh pekerjaan satu layar dimulai: 0,53 lawan 0,5 pada
1366x768, dan 0,62 lawan 0,58 pada 1920x1080. Ruang kosongnya yang menyusut,
bukan gambarnya.

> Sebelum menambah `padding` atau `margin` tegak yang besar pada bagian yang
> dituntut muat satu layar, tanyakan dulu: pada 1280x720 masih tersisa berapa?
> Jarak tetap 176 piksel terdengar wajar sampai diingat bahwa seluruh ruang
> yang ada cuma 655.

## Daftar viewport yang diuji

Lebar saja tidak cukup sejak aturan 10 - tingginya ikut menentukan. Dua belas
pasang ini yang dipakai:

| Golongan | Ukuran |
|---|---|
| Desktop | 1920x1080, 1600x900 |
| Laptop | 1440x900, 1366x768, 1280x720 |
| Tablet | 1024x768, 768x1024, 820x1180 |
| Ponsel | 430x932, 414x896, 390x844, 375x812 |

`scripts/` tidak memuat alatnya - pengukurannya dilakukan lewat Chrome
sungguhan (DevTools Protocol) dan skripnya sekali pakai. Yang penting bukan
alatnya melainkan bahwa angkanya **diukur**, bukan ditaksir dari tangkapan
layar.

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
