# Analisis & Rekomendasi — Portofolio Universal Berbasis Pola

**Untuk:** revisi `PROMPT_Fitur_Portofolio_CV_ATS.md` (repo `cv-ats-builder`)
**Tanggal riset:** 4 September 2026
**Status:** dokumen analisis. Prompt implementasi menyusul setelah arah ini disetujui.

**Legenda verifikasi yang dipakai sepanjang dokumen:**
🟢 sumber primer/resmi · 🟡 semi-resmi (asosiasi, dokumen skema, media kredibel) · 🔴 sekunder/belum terverifikasi · 🧪 hasil uji langsung dalam riset ini · 💭 penalaran, bukan temuan bersumber

---

## 0. Ringkasan eksekutif

Instruksi Anda — *"jadikan universal: pengajaran → pendidikan, pembangunan/3D/geo/kimia → engineering, project/design/PDF → designer"* — ternyata **bukan penyederhanaan, melainkan koreksi arsitektur**. Anda tidak sedang mengurangi bidang; Anda sedang mengganti sumbu klasifikasinya dari **disiplin ilmu** ke **cara bukti disusun**. Riset lintas profesi mengonfirmasi bahwa sumbu kedua itu jauh lebih sedikit variasinya, dan jauh lebih stabil.

Lima temuan yang paling mengubah rencana:

1. **Portofolio lintas profesi hanya jatuh ke 6 pola struktural, bukan 21 bidang.** Tiga di antaranya persis yang Anda sebut. Untuk CV builder, 6 pola itu bisa dipadatkan jadi **5 kategori + 1 fallback**. Katalog 21 bidang jadi *kamus istilah*, bukan *skema form*.

2. **"PORTOFOLIO" sebagai bagian CV berdiri sendiri tidak dikenali parser ATS mana pun yang dokumentasinya terbuka.** Enum `SectionType` Textkernel (26 tipe) tidak memuat `PROJECTS` maupun `PORTFOLIO`; RChilli hanya memparsing proyek jika bersarang **di bawah Experience**. Ini membatalkan premis §3.2 prompt lama (whitelist judul menyelamatkan bagian) dan menuntut perubahan struktural, bukan sekadar perubahan label.

3. **Tujuh asumsi teknis di prompt lama salah atau kedaluwarsa** — termasuk penalti CV >2 halaman (terbantah oleh satu-satunya eksperimen terkontrol yang ada), larangan bit.ly (alasannya keliru), dan nama "Skor ATS" itu sendiri (tidak bisa dipertahankan).

4. **Tidak ada satu pun taksonomi resmi Indonesia yang merupakan taksonomi "bidang pekerjaan".** KKNI = sumbu senioritas, rumpun ilmu = sumbu pendidikan, KBLI = sumbu industri, KBJI = sumbu level jabatan. Prompt lama menggabungkan keempatnya jadi satu `FieldProfile`. Pisahkan — masing-masing punya kegunaan berbeda.

5. **Indonesia justru punya standar portofolio yang lebih presisi daripada yang biasa diasumsikan — di dua pola saja.** FAIP PII (skor P×Q×R, ambang 600/3.000/6.000), KMK 1561/2024 (250/100/50 SKP, ranah 45%/35%/5%), dan rubrik UKMPPG (bobot 4/3/3/4/1,5/1,5). Semuanya bisa dipinjam langsung sebagai rubrik penilaian — jauh lebih kokoh daripada sub-kriteria yang dikarang sendiri di §7 prompt lama.

**Dampak kode:** registry dari **21 objek × ~10 field khusus (≈210 definisi field)** turun jadi **5 skema pola × ~7 field inti (≈35 definisi field) + 1 slot fleksibel + 1 kamus istilah**. Menambah profesi baru tidak lagi berarti menulis skema — cukup menambah entri kamus.

---

## 1. Analisis prompt yang ada

### 1.1 Yang sudah benar dan harus dipertahankan

| Prinsip | Kenapa bertahan |
|---|---|
| Skema sebagai **data, bukan komponen**; larangan `if (bidang === 'x')` | Justru makin penting setelah peleburan. Ini fondasi yang membuat migrasi ke pola bisa dilakukan tanpa membongkar UI. |
| **Ganti bidang tidak menghapus data** (`khusus._arsip` + tombol pulihkan) | Dengan hanya 5 kategori, perpindahan kategori jadi lebih sering, bukan lebih jarang. Fitur ini naik prioritas. |
| **Mode Redaksi (NDA)** | Terkonfirmasi relevan: riset menemukan bahwa profesi bisnis/keuangan tidak punya artefak justru **karena outputnya milik dan rahasia perusahaan**. Mode Redaksi bukan fitur pinggiran — ia adalah alasan struktural sebagian orang tidak bisa berportofolio. |
| **Tautan ditulis sebagai teks yang bisa dibaca** | 🧪 Terbukti dalam uji langsung. Lihat §2.1 — tapi rekomendasinya perlu diperbaiki dari "buang hyperlink" jadi "sandingkan keduanya". |
| Satu kolom, tanpa tabel | 🧪 Terbukti masih benar untuk parser naif, meski mulai usang. Sikap konservatif tetap rasional. |
| Larangan "skor dikatrol dengan banyak tautan" | Terkonfirmasi: keyword matching yang menentukan visibilitas mesin, bukan jumlah tautan. |

### 1.2 Tujuh koreksi faktual yang wajib masuk revisi

| # | Klaim di prompt lama | Verdict | Perbaikan |
|---|---|---|---|
| 1 | §3.2 "Judul bagian harus dari whitelist agar dikenali parser" | **Separuh benar.** Taksonomi heading memang nyata (enum `SectionType` Textkernel, 26 tipe 🟢). Tapi tidak ada bukti heading non-standar membuat isinya **hilang** — isinya tetap terindeks di full-text search Greenhouse. | Turunkan dari "aturan yang tidak boleh dilanggar" jadi "asuransi murah". Jangan menakut-nakuti pengguna dengan klaim yang tidak didukung dokumentasi vendor. |
| 2 | §3.3 "Buang `https://` dan `www.`, simpan versi penuh sebagai href" | **Setengah jalan.** 🧪 Uji langsung: anchor text `Portfolio` → semua ekstraktor (pdftotext, pdfplumber, python-docx, LibreOffice) hanya menghasilkan kata "Portfolio"; URL tersimpan di `/Annots` PDF dan `document.xml.rels` DOCX, tidak tersentuh ekstraksi teks. Tapi rekruter membuka **berkas asli**, di mana hyperlink tetap berfungsi. | **Sandingkan keduanya**: `Portofolio — budi.example.com/portfolio` dengan hyperlink aktif pada teks polos itu. Ini satu-satunya bentuk yang selamat di jalur mesin *dan* jalur manusia. |
| 3 | §3.3 "Dilarang pakai pemendek tautan — sering ditandai spam" | **Terbantah untuk ATS.** Nol dokumentasi vendor menyebut pemendek tautan. Untuk email pun buktinya bertentangan: Terry Zink (tim anti-spam Microsoft Exchange Online) menulis artikel berjudul harfiah *"No, using bit.ly does not get you blocked"* 🟢. | **Pertahankan larangannya, ganti alasannya**: `bit.ly/3xK9pQ` membawa nol kata kunci, opak bagi manusia, dan jadi titik kegagalan tunggal. `github.com/nama` membawa nama + platform. |
| 4 | §7 "Longgarkan penalti panjang halaman untuk kedokteran & akademik; bidang lain tetap 1–2 halaman" | **Terbantah untuk semua.** Tidak ada dokumentasi vendor mana pun yang menyebut batas halaman — parser bekerja atas teks hasil konversi, di mana "halaman" sudah tidak ada. Eksperimen terkontrol ResumeGo (482 rekruter, 7.712 CV, versi 1 dan 2 halaman berisi kredensial identik): CV 2 halaman **2,3× lebih disukai**, skor 8,6 vs 7,1. | **Hapus penalti panjang halaman sepenuhnya.** Ganti dengan indikator netral ("CV Anda ±2 halaman — lazim untuk tingkat senior"). ⚠️ ResumeGo penjual jasa CV — ada konflik kepentingan, tapi desainnya terkontrol dan sampelnya besar, jauh di atas kualitas bukti lain di ruang ini. |
| 5 | §3.7 & §14 "Ekspor Word harus tetap rata kiri, tanpa text box" | **Benar, tapi kurang satu hal penting.** 🧪 Uji langsung: isi **header/footer Word asli** (`sec.header`/`sec.footer`) **hilang total** di python-docx dan LibreOffice. Sebaliknya, "header/footer" di PDF hanyalah teks di posisi atas/bawah halaman dan **terbaca normal**. | Tambahkan aturan eksplisit: **jangan pernah menaruh kontak atau tautan di header/footer Word**. Di PDF tidak masalah. Nasihat generik "jangan pakai header/footer" mencampur dua hal berbeda. |
| 6 | Judul fitur: **"Skor ATS 5 dimensi"** → jadi 6 dimensi | **Tidak bisa dipertahankan.** Filter dikonfigurasi tiap employer (riset HBS *Hidden Workers*: 48% menyaring gap kerja >6 bulan, sisanya gelar/kata kunci/lama pengalaman) 🟢. Tidak ada nilai default yang bisa direplikasi pihak ketiga. Hanya Taleo yang memberi peringkat otomatis, dan rekruter yang diwawancarai tidak mempercayainya. Bandingkan: Jobscan menamai produknya **"match rate"**, bukan "ATS score". | **Ganti nama, bukan mekanismenya.** Dua angka yang jujur dan bisa dipertahankan: **(a) Kecocokan kata kunci lowongan** dan **(b) Kelengkapan & keterbacaan struktur**. Ini juga melindungi produk dari serangan — riset skeptis terhadap klaim "skor ATS" sedang bertambah banyak. |
| 7 | §6.6 "STR + SIP beserta nomor & **masa berlaku**" | **Kedaluwarsa.** Sejak **UU 17/2023** (diundangkan 8 Agustus 2023), **STR Definitif berlaku SEUMUR HIDUP** — dinyatakan langsung di portal Konsil Kesehatan Indonesia 🟢. **SIP tetap 5 tahun.** UU 17/2023 juga mencabut 11 UU, termasuk UU 38/2014 (Keperawatan) dan UU 4/2019 (Kebidanan) — jangan lagi dirujuk. | Field masa berlaku kredensial harus mendukung nilai **"seumur hidup"** dan **tidak boleh memaksa tanggal kedaluwarsa**. Pengecualian yang tetap berbatas waktu: STR Internsip, Pendidikan, Adaptasi, Penambahan Kompetensi, Sementara, Bersyarat. |

### 1.3 Temuan struktural terpenting: bagian "PORTOFOLIO" tidak punya rumah di ATS

Ini konsekuensinya paling besar dan tidak bisa diselesaikan dengan mengganti judul.

**Bukti 🟢:** Enum `SectionType` Textkernel — parser yang mendasari Sovren dan dipakai sangat luas — memuat 26 tipe bagian:

```
ARTICLES, AVAILABILITY, BOOKS, CERTIFICATIONS, CONFERENCE_PAPERS,
CONTACT_INFO, EDUCATION, HOBBIES, IGNORE_DATA_AFTER, LANGUAGES,
LICENSES, MILITARY, OBJECTIVE, OTHER_PUBLICATIONS, PATENTS,
PERSONAL_INTERESTS_AND_ACCOMPLISHMENTS, PROFESSIONAL_AFFILIATIONS,
QUALIFICATIONS_SUMMARY, REFERENCES, SECURITY_CLEARANCES, SKILLS,
SPEAKING, SUMMARY, TRAINING, WORK_HISTORY, WORK_STATUS
```

`PROJECTS` tidak ada. `PORTFOLIO` tidak ada.

**Bukti 🟢:** RChilli — parser lain dengan dokumentasi terbuka — **punya** field projects, tapi syaratnya sangat informatif: projects harus *"mentioned under or within the Experience section"*, tidak akan ditangkap kalau berdiri sendiri. Parser mencari label eksplisit `Project Name:`, `Role in Project:`, `Team Size:`. Tanggal proyek harus berada dalam rentang masa kerja terkait. Output-nya adalah array yang **bersarang di dalam blok experience**.

Dua vendor, dua desain berbeda, satu kesimpulan sama: **proyek diperlakukan sebagai anak dari pengalaman kerja, bukan sebagai bagian setara.**

**Konsekuensi desain — tiga perubahan:**

1. **Setiap item portofolio harus berbentuk seperti entri pengalaman kerja**: nama · peran · konteks/pemberi kerja · rentang tanggal · deskripsi. Prompt lama sudah 80% ke sana (`judul`, `peran`, `konteks`, `mulai`, `selesai`) — pertahankan, dan jadikan `konteks` + rentang tanggal **wajib**, bukan opsional.
2. **Sediakan sakelar "Gabung ke Pengalaman Kerja"** — untuk proyek yang punya pemberi kerja, render item portofolio sebagai sub-entri di bawah `PENGALAMAN KERJA` (bagian yang pasti dikenali) alih-alih bagian terpisah. Ini opsi paling aman secara parsing, dan pengguna bisa memilih.
3. **Untuk proyek tanpa pemberi kerja** (freelance, open source, tugas kuliah, proyek mandiri), isi `konteks` dengan "Proyek Mandiri" / "Freelance" / nama komunitas. Ini bukan trik — ini bentuk yang memang diharapkan parser.

### 1.4 Masalah arsitektur prompt lama

Di luar koreksi faktual, ada tiga masalah struktural:

**a. 21 bidang = 21 tempat bug, dan tidak pernah cukup.** Katalog §6 sudah 21 entri dan masih bocor: di mana penerbangan? pelaut? atlet? koki riset? auditor internal? Setiap profesi baru menuntut objek registry baru dengan ~10 field khusus, contoh terisi penuh, kamus kata kunci, dan aturan skor. Ini biaya marjinal yang tidak pernah turun.

**b. `FieldProfile` menggabungkan empat sumbu yang berbeda.**

```ts
type FieldProfile = {
  rumpun: string      // sumbu disiplin ilmu
  bidang: string      // sumbu... apa? campuran fungsi + disiplin
  subBidang?: string
  jenjang: '...'      // sumbu senioritas
}
```

Riset taksonomi resmi menunjukkan keempatnya memang sumbu terpisah dan tidak boleh dilebur (§3.1).

**c. Duplikasi masif di dalam katalog itu sendiri.** Bandingkan tiga entri berbeda:

- §6.3 sipil: `hasilJadwalBiaya` "selesai 3 minggu lebih cepat; efisiensi biaya 4,2%"
- §6.13 industri: `dampakTerukur` "waktu siklus turun 18%"
- §6.14 energi: `capaian` "efisiensi energi naik 6%"

Tiga nama field, satu konsep identik: **hasil terukur berupa delta angka**. Hal yang sama terjadi pada `perangkatLunak`/`perangkat`/`toolsEDA`/`tools`/`alat`/`sistem` (enam nama untuk "perkakas yang dipakai") dan `kodeStandar`/`standar`/`k3lRegulasi`/`kepatuhan` (empat nama untuk "standar yang diterapkan"). Peleburan yang Anda minta menghilangkan duplikasi ini secara otomatis.

---

## 2. Temuan riset

### 2.1 Tidak ada taksonomi "bidang pekerjaan" resmi di Indonesia — yang ada empat sumbu terpisah

| Sumbu | Taksonomi resmi | Struktur | Cocok dipakai untuk |
|---|---|---|---|
| **Senioritas** | KKNI, Perpres 8/2012 🟢 | 9 jenjang → 3 kelompok: Operator (1–3), Teknisi/Analis (4–6), Ahli (7–9) | Field "jenjang karier"; **verb bank** untuk saran bullet |
| **Disiplin ilmu** | Rumpun Ilmu, UU 12/2012 Pasal 10 🟢 | 6 rumpun: agama, humaniora, sosial, alam, formal, terapan → pohon → cabang → ranting | Field "jurusan/pendidikan"; **pemetaan pencarian** di dropdown |
| **Level jabatan** | KBJI 2014 (BPS + Kemnaker, basis ISCO-08) 🟢 | 10 golongan pokok → 43 → 130 → 446 → 2.137 jabatan | Normalisasi **job title** (level 3–4 yang fungsional) |
| **Industri perusahaan** | KBLI 2025 (Peraturan BPS 7/2025) 🟢 | 22 kategori A–V (naik dari 21 di KBLI 2020) | Field "industri" per entri pengalaman; **bobot kamus kata kunci** |
| **Fungsi pekerjaan** | *tidak ada padanan resmi Indonesia* | — | Inilah yang dibutuhkan CV builder |

Sumbu kelima hanya ada di job board: LinkedIn memakai 26 job functions, JobStreet Indonesia memakai skema induknya SEEK (hierarki dua tingkat: classification → subclassification) 🟡.

**Kenapa masing-masing gagal jadi kategori "bidang":**
- **Rumpun Ilmu:** "Ilmu Terapan" menampung bisnis + hukum + kesehatan + arsitektur sekaligus. "Ilmu Formal" berisi Komputer — software engineer akan digolongkan bersama ahli logika.
- **KBJI:** golongan pokok 1 (Manajer) dan 2 (Profesional) **memotong semua bidang**. Marketing manager dan engineering manager sama-sama golongan 1.
- **KBLI:** ini industri perusahaan, bukan fungsi orang. Akuntan di rumah sakit vs akuntan di bank berbeda KBLI, sama profesi.

**Rekomendasi:** kategori yang dipilih pengguna adalah **pola pembuktian** (§3). Empat sumbu resmi di atas jadi **metadata di belakang layar** — dipakai untuk pencarian, saran, dan bobot skor, bukan sebagai pilihan yang dilihat pengguna.

**⚠️ Jangan hardcode tanpa verifikasi ulang:** jumlah total SKKNI nasional (portal Kemnaker berbentuk SPA JavaScript, tidak bisa dibaca), jumlah prodi di Kepdirjen 163/E/KPT/2022, dan nama 22 kategori KBLI 2025 (baru terbaca dari salinan pihak ketiga 🔴, angka strukturalnya cocok dengan berita resmi BPS).

### 2.2 Enam pola pembuktian portofolio

Ini temuan inti. Riset lintas 9 kelompok profesi (arsitektur, desain/UX, software, rekayasa, kesehatan, pendidikan, akademik, bisnis, seni pertunjukan) menemukan bahwa **medium ≠ struktur**. Booklet PDF arsitektur A3, studi kasus UX di Notion, dan README GitHub adalah tiga *medium* untuk satu *struktur* yang sama: konteks → peran saya → keputusan → hasil → refleksi.

| Pola | Unit | Siapa yang memvalidasi | Terstandardisasi resmi? | Yang dinilai |
|---|---|---|---|---|
| **1. Studi Kasus Artefak** | proyek | perekrut, subjektif | ❌ konvensi industri | kualitas penalaran |
| **2. Lembar Data Proyek** | proyek (unit: **firma**) | panitia pengadaan | ✅ SF 330 (AS) | relevansi & skala |
| **3. Klaim Kompetensi Terverifikasi** | klaim kompetensi | asesor + referee berlisensi | ✅✅ paling ketat | kedalaman tanggung jawab |
| **4. Logbook Volume Terlisensi** | tindakan/kegiatan | regulator + penyelia | ✅✅ ambang numerik | volume & kebaruan |
| **5. Daftar Karya Terkredit** | satu karya | venue + indeks pihak ketiga | ✅ format sitasi | prestise & jumlah |
| **6. Butir Dampak Berangka** | pencapaian | perekrut, tanpa verifikasi | ❌ konvensi STAR | besaran angka |

**Angka lazim yang ditemukan:**

| Pola | Jumlah item lazim | Sumber |
|---|---|---|
| Studi Kasus Artefak — desain/UX | junior 2–3, senior 4–5 | uxfol.io 🟡 |
| Studi Kasus Artefak — software | 3–5 repo terdokumentasi baik | SOLTECH 🟡 |
| Studi Kasus Artefak — arsitektur | **7–10 proyek**, booklet 30–35 hal untuk lamaran kerja; **teaser 3–5 hal** dikirim bersama CV | archisoup 🟡 |
| Lembar Data Proyek | maks 10 (default SF 330) | OpenAsset 🟡 |
| Klaim Kompetensi | 3 career episode (Engineers Australia), maks 700 kata/klaim | EA guide 🟢 |
| Logbook Volume | ACGME ~1.000 kasus (bedah umum); Indonesia 250/100/50 SKP per 5 tahun | ACGME 🟡, KMK 1561/2024 🟢 |
| Daftar Karya Terkredit | **tanpa batas atas** — makin banyak makin baik | UPenn Career Services 🟡 |
| Butir Dampak | 3–6 butir per posisi | UMass CICS 🟡 |

**Empat pengamatan lintas-pola:**

1. **Standardisasi berkorelasi dengan risiko publik, bukan dengan kematangan profesi.** Pola 3 dan 4 — satu-satunya yang punya template resmi, ambang numerik, dan verifikator wajib — persis menutupi profesi di mana kesalahan membunuh orang: rekayasa, kesehatan, penerbangan, konstruksi. Pola 1 dan 6, yang tanpa standar sama sekali, menutupi profesi di mana kegagalan hanya mahal. 💭

2. **Hampir setiap profesi memakai lebih dari satu pola — tergantung KEPERLUAN.** Insinyur Indonesia menjalankan Pola 3 (FAIP) untuk sertifikasi PII *dan* Pola 6 (CV berangka) untuk melamar kerja. Dosen menjalankan Pola 5 (publikasi) *dan* Pola 4 (BKD/SKP) *dan* Pola 1 (portofolio pengajaran). Arsitek menjalankan Pola 1 (booklet) untuk melamar *dan* Pola 3 (STRA/SKK) untuk lisensi. **Jadi pertanyaannya bukan "profesi X pakai pola apa" melainkan "untuk keperluan apa"** — rekrutmen, lisensi, promosi internal, atau tender. Ini jadi dasar saran fitur di §6.1.

3. **`verifikator` adalah field yang paling sering diabaikan tapi paling menentukan.** Pola 3, 4, dan 5 semuanya tidak berfungsi tanpa identitas pihak ketiga terlampir: nomor lisensi P.Eng, tanda tangan penyelia, DOI, nama sutradara. Pola 1 dan 6 tidak punya ini sama sekali — dan itulah sebabnya keduanya rentan klaim berlebihan, dan mengapa *ownership* muncul sebagai sinyal nomor dua yang dicari perekrut UX.

4. **Aturan bahasa orang-pertama muncul independen di dua badan berbeda.** NCEES: wajib *"I designed", "I reviewed"* — **dilarang** "we", "led", "managed". Engineers Australia: *"I did this, and this is how I did it."* Ini konvergensi yang kuat dan langsung bisa dijadikan validator di UI.

### 2.3 Standar Indonesia yang bisa dipinjam langsung sebagai rubrik

Ini bahan paling berharga dari riset. Prompt lama mengarang sub-kriteria skor sendiri (§7: 25/25/25/15/10). Indonesia sudah punya tiga instrumen resmi yang presisinya setara padanan internasional.

**a. FAIP — Formulir Aplikasi Insinyur Profesional (PII)** 🟡

Skor = fungsi tiga faktor:
- **P** = banyaknya pengalaman (frekuensi pekerjaan sejenis)
- **Q** = peranan (participate/contribute/collaborate; anggota/pemimpin/ahli; konseptual/rencana/pelaksana)
- **R** = tingkat kesulitan (spesifikasi teknis, lingkungan, anggaran, tenaga kerja, pendekatan pemecahan masalah)

| Unit kompetensi | Bobot | IPP | IPM | IPU |
|---|---|---|---|---|
| W1 Kode Etik | 10% | 60 | 300 | 600 |
| W2 Kemampuan Kerja Keinsinyuran | 30% | 180 | 900 | 1.800 |
| W3 Perencanaan & Perancangan | 20% | 120 | 600 | 1.200 |
| W4 Manajemen Kerja & Komunikasi | 10% | 60 | 300 | 600 |
| P5–P11 (pilihan) | 30% | 180 | 900 | 1.800 |
| **Total** | | **600** | **3.000** | **6.000** |

Ambang pengalaman: IPP ≥3 tahun pasca-S1, IPM ≥8 tahun, IPU ≥16 tahun.

> **Ini model skor yang jauh lebih baik daripada §7 prompt lama.** Alih-alih "persentase bullet yang mengandung angka", pakai **frekuensi × peran × tingkat kesulitan** — dan `peran` sudah ada di model data Anda. Lihat §5.

**b. KMK HK.01.07/1561/2024 — Pedoman Kecukupan SKP Tenaga Kesehatan** 🟢

Target 5 tahun: **dokter & spesialis 250 SKP**, **dokter gigi 100 SKP**, **perawat/bidan/fisioterapis & mayoritas nakes lain 50 SKP**.
Tiga ranah (bukan lima seperti aturan lama): **Pembelajaran min 45%**, **Pelayanan min 35%**, **Pengabdian min 5%**.
Bukti diunggah lewat Plataran Sehat dan Platform SKP SATUSEHAT SDMK.

> ⚠️ Banyak sumber sekunder Indonesia masih menyebut skema lama "5 ranah untuk perpanjangan STR". Sudah usang: STR seumur hidup, SKP kini untuk **perpanjangan SIP**.

**c. Rubrik Portofolio UKMPPG (PPG)** 🟡

| Komponen | Poin maks |
|---|---|
| Penelitian & publikasi | 4 |
| Karya inovasi (buku, modul, media pembelajaran) | 4 |
| Refleksi diri | 3 |
| Pencarian informasi (diklat/seminar/workshop) | 3 |
| Prestasi (kejuaraan) | 1,5 |
| Pengabdian masyarakat | 1,5 |

Total 10 poin → skala 0–100. Nilai akhir = (6 × Uji Kinerja Mengajar + Portofolio) ÷ 7. **Satu bukti hanya boleh dipakai untuk satu komponen** — aturan anti-double-counting yang layak ditiru.

**d. Yang tidak ada standarnya di Indonesia:** portofolio arsitektur dan desain. Panduan lokal (UNMAHA, Cake, Glints) isinya normatif tanpa angka halaman/format baku; tidak ditemukan pedoman resmi dari IAI. Yang beredar adalah adaptasi norma Barat. 💭 Ini justru peluang produk: jadilah yang pertama memberi angka konkret.

### 2.4 Realita pasar Indonesia — premis "optimasi ATS" lebih lemah dari yang diasumsikan

Temuan yang paling mengganggu premis produk, dan paling penting untuk diketahui sekarang daripada nanti:

**Sebagian besar pelamar Indonesia tidak melalui parser CV sama sekali.** 🟢
- **Jobstreet (SEEK)** — rekruter mencari lewat **profil terstruktur** yang diisi kandidat ("Cari Profil"). CV yang diunggah adalah lampiran, bukan sumber utama data.
- **Glints, Kalibrr, Dealls** — pola serupa, profil form-based.
- **Rekrutmen Bersama BUMN (FHCI)** — form portal dengan unggahan dokumen, bukan parsing CV bebas.
- **Workday** terkonfirmasi dipakai di Indonesia (BINUS, UOB), tapi terutama di enterprise/multinasional.
- **Kemnaker SIAPkerja** punya generator CV dengan pilihan template "CV ATS" — istilahnya sudah masuk wacana kebijakan, terlepas dari akurasi teknisnya.

**Foto:** masih **wajib** di jalur formal — Rekrutmen Bersama BUMN mensyaratkan pas foto 3x4/4x6, min 300 dpi, wajah 70–80% frame, latar merah/biru. **Tapi diunggah terpisah ke form portal, bukan ditempel di CV.** Jadi tidak ada konflik nyata. Klaim populer "foto membuat ATS kesulitan membaca" **tidak ada buktinya** — gambar tersemat diabaikan ekstraktor teks; Greenhouse bahkan menyatakan *"Images embedded directly in the resume file are unaffected"*. Risiko nyata foto adalah **bias diskriminatif**, bukan kegagalan parsing. Jangan ulangi klaim teknis yang salah ini.

**Data pribadi (TTL, agama, status pernikahan):** masih sangat lazim dalam praktik (tradisi "Daftar Riwayat Hidup"), meski nasihat profesional sudah menentangnya. Indonesia punya larangan diskriminasi (Pasal 5 UU 13/2003, UU 39/1999, ratifikasi Konvensi ILO 111) tapi penegakannya lemah — iklan lowongan yang mensyaratkan usia, status "single", dan tinggi badan masih terdokumentasi. **Rekomendasi: jadikan field-field ini opsional dan mati secara default, jangan dihapus.**

**Bahasa CV:** tidak ada bukti kuat ke arah mana pun; semua sumber opini tanpa data. Tapi ada argumen berbasis mekanisme yang lebih kuat: karena penemuan kandidat berjalan lewat **pencocokan kata kunci**, **bahasa CV harus sama dengan bahasa deskripsi lowongan**. CV Inggris melawan lowongan Indonesia gagal pada boolean search untuk "pengalaman", "keuangan", "penjualan". Istilah teknis (nama tools, framework, sertifikasi) **selalu** Inggris di kedua kasus.

**💭 Implikasi produk yang serius:** untuk pasar Indonesia, argumen terkuat aplikasi Anda bukan "lolos ATS" melainkan **"struktur yang sama-sama terbaca mesin dan manusia, dan bisa disalin ke form portal"**. Lihat saran fitur §6.4.

---

## 3. Rekomendasi taksonomi: 5 kategori pola + 1 fallback

Ini realisasi instruksi Anda. Nama kategori memakai istilah yang dikenali pengguna Indonesia, bukan jargon riset.

### 3.1 Peta lima kategori

| # | Slug | Nama di UI | Kalimat penjelas di dropdown | Instruksi Anda |
|---|---|---|---|---|
| 1 | `karya-visual` | **Karya & Desain** | "Bukti saya adalah karyanya sendiri — bisa dilihat, dibuka, atau diunduh." | ✅ "designer" |
| 2 | `proyek-teknis` | **Proyek Teknis** | "Bukti saya adalah proyek dengan spesifikasi, standar, dan hasil terukur." | ✅ "engineering" |
| 3 | `praktik-jam` | **Praktik & Pengajaran** | "Bukti saya adalah jam praktik, jumlah orang yang saya layani, dan lisensi." | ✅ "pendidikan" + kesehatan |
| 4 | `karya-terkredit` | **Publikasi & Kredit** | "Bukti saya adalah daftar karya yang divalidasi pihak lain — jurnal, penerbit, panggung." | — |
| 5 | `dampak-program` | **Program & Dampak** | "Karya saya milik perusahaan. Yang bisa saya bawa adalah angka hasilnya." | — |
| 6 | `umum` | **Umum / Belum Menentukan** | fallback wajib | ✅ dipertahankan |

### 3.2 Detail tiap kategori

---

#### 1. `karya-visual` — KARYA & DESAIN

**Pola:** Studi Kasus Artefak. Bukti = karya yang bisa ditunjuk, dibungkus narasi keputusan.

**Judul CV:** `PORTOFOLIO KARYA` · alt: `STUDI KASUS`, `PROYEK & PORTOFOLIO`
**Label item:** "Karya" · **Jumlah disarankan:** 3–5 (arsitektur 5–7)

**Field inti (7):**

| Key | Label | Tipe | Kenapa penting |
|---|---|---|---|
| `masalah` | Masalah yang dipecahkan | teks_panjang | Pembeda utama studi kasus dari galeri. Perekrut menilai cara berpikir. |
| `prosesKeputusan` | Proses & keputusan | multi (2–5 pasangan) | Struktur baku uxfol.io: 2–5 pasangan problem–solution. |
| `bentukKarya` | Bentuk karya | multi | denah/potongan/tampak/detail · wireframe/prototipe/design system · repo/demo · foto/video/ilustrasi/kemasan |
| `perkakas` | Perkakas | multi | menggantikan `tools`/`perangkatLunak`/`toolsEDA` |
| `hasil` | Hasil | teks berangka | konversi, waktu muat, jangkauan, penghargaan |
| `statusKarya` | Status | pilihan | terbangun · dirilis · internal · sayembara · tugas kuliah · latihan pribadi |
| `tautanKarya` | Tautan karya | url (maks 2) | wajib ada minimal satu |

**Syarat item kuat:** `masalah` + minimal 2 langkah `prosesKeputusan` + `hasil` + minimal 1 tautan yang benar-benar bisa dibuka.

**Menyerap dari katalog lama:** §6.1 software-ti, §6.4 arsitektur-perencanaan, §6.5 desain-kreatif, sebagian §6.12 pemasaran-media (konten/produksi).

**Catatan tetap di UI (dari riset, dengan angka):**
> *Arsitektur: booklet lengkap 30–35 halaman berisi 7–10 proyek, tapi yang dikirim bersama CV cukup **3–5 halaman**; booklet penuh menyusul atau dibawa saat wawancara. A4/US Letter paling praktis (A3 lebih profesional tapi berat). Jaga ukuran berkas **5–10 MB** untuk email; portal karier firma umumnya membatasi 15–25 MB. Tampilkan proses: sketsa → diagram → hasil akhir, bukan render saja — firma menilai kemampuan menuntaskan desain sampai skala konstruksi.*
>
> *Desain/UX: junior 2–3 studi kasus, senior 4–5. Taruh yang terbaik paling depan. Satu proyek = satu masalah inti.*
>
> *Software: 3–5 repo terdokumentasi baik mengalahkan puluhan repo setengah jadi. README harus terbaca **non-engineer** — perekrutan teknis jarang dinilai engineer sendirian. Muat: masalah, pengguna sasaran, keputusan teknis kunci, screenshot/demo, keterbatasan yang diketahui, pelajaran.*

**Peringatan:** karya kantor/klien perlu izin tayang dan wajib menyebut peran pribadi. Karya spekulatif/latihan wajib diberi label. Repo privat atau kode kantor tidak boleh ditempel.

---

#### 2. `proyek-teknis` — PROYEK TEKNIS

**Pola:** gabungan Lembar Data Proyek + Klaim Kompetensi Terverifikasi. Bukti = proyek dengan spesifikasi, standar yang diterapkan, dan hasil terukur.

**Judul CV:** `PORTOFOLIO PROYEK` · alt: `PENGALAMAN PROYEK`, `PROYEK REKAYASA`
**Label item:** "Proyek" · **Jumlah disarankan:** 3–6 (maks 10, mengikuti default SF 330)

**Field inti (7):**

| Key | Label | Tipe | Kenapa penting |
|---|---|---|---|
| `jenisProyek` | Jenis proyek | teks + saran | gedung · jembatan · jalan · PCB · firmware · pabrik · kilang · tambang · WTP · jaringan · perbaikan proses |
| `skalaProyek` | Skala | angka + satuan bebas | m² · km · lantai · bentang m · MW · ton/hari · barrel · titik · Rp (rentang) |
| `tahapKeterlibatan` | Tahap keterlibatan | multi | studi kelayakan · desain · simulasi · fabrikasi · pelaksanaan · commissioning · pengawasan · serah terima |
| `standarKode` | Standar & kode | multi | SNI 2847/1726/1727 · ACI · AISC · IEC · IEEE · PUIL · ISO 9001/45001/14001 · ASME · API · SMK3 PP 50/2012 |
| `perkakas` | Perkakas | multi | AutoCAD · SAP2000 · ETABS · Revit · Tekla · Primavera · Altium · KiCad · SolidWorks · ANSYS · HYSYS · Petrel · Surpac · ArcGIS · Minitab · PI System |
| `hasilTerukur` | Hasil terukur | teks berangka **wajib** | menggantikan `hasilUkur`/`hasilJadwalBiaya`/`dampakTerukur`/`capaian` — empat nama, satu konsep |
| `verifikator` | Bisa diverifikasi oleh | teks | atasan/penyelia + jabatan, atau pemilik proyek. **Field paling sering diabaikan tapi paling menentukan.** |

**Syarat item kuat:** `hasilTerukur` berangka + `standarKode` + `tahapKeterlibatan` mencapai tahap pelaksanaan/pengujian + `verifikator`.

**Aturan bahasa (dari NCEES + Engineers Australia, konvergen):** wajib orang pertama — *"saya merancang", "saya menghitung", "saya menguji"*. **Hindari** "kami", "memimpin tim", "mengelola" tanpa menyebut apa yang Anda kerjakan sendiri. Jadikan ini **validator langsung di UI**, bukan sekadar tips.

**Menyerap dari katalog lama:** §6.2 hardware-elektro, §6.3 sipil-konstruksi, §6.13 industri-manufaktur, §6.14 energi-tambang-hse, sebagian §6.15 agro-hayati (teknis), sebagian §6.18 logistik (proyek rantai pasok).

**Peringatan:** nilai kontrak, skematik, BOM, data produksi/cadangan umumnya rahasia atau terikat NDA. Sediakan opsi **rentang** ("Rp 10–25 M") dan persentase relatif alih-alih angka pasti — dan hubungkan langsung ke Mode Redaksi.

---

#### 3. `praktik-jam` — PRAKTIK & PENGAJARAN

**Pola:** Logbook Volume Terlisensi. Bukti = akumulasi kegiatan bertanggal + jumlah orang yang dilayani + lisensi. Kualitas tiap item hampir tidak dinilai; **yang dinilai agregatnya.**

**Judul CV:** `PENGALAMAN PRAKTIK & PENGAJARAN` · alt: `PENGALAMAN KLINIS & PROSEDUR`, `PORTOFOLIO MENGAJAR`, `PENGALAMAN DAKWAH & PENGAJARAN`
**Label item:** "Kegiatan" · **Jumlah:** tanpa batas atas

**Field inti (7):**

| Key | Label | Tipe | Kenapa penting |
|---|---|---|---|
| `jenisKegiatan` | Jenis kegiatan | teks + saran | rotasi klinis · jaga IGD · mengajar · pembinaan tahfidz · penyuluhan · asesmen · pendampingan · pelayanan outlet |
| `institusi` | Institusi / fasilitas | teks **wajib** | RSUD/Puskesmas + tipe · sekolah + jenjang · pesantren/masjid · kampus · hotel/outlet |
| `volume` | Volume | angka + satuan **wajib** | pasien/bulan · tindakan · siswa · santri/jamaah · jam/pekan · peserta · porsi/hari |
| `periodeAktif` | Periode & intensitas | teks | "Jan 2024 – kini, 3 hari/pekan" |
| `luaran` | Hasil / luaran | teks berangka | "angka infeksi luka operasi turun 4,1% → 1,8%" · "rata-rata nilai naik 68 → 79" · perangkat ajar buatan sendiri |
| `kredensialTerkait` | Kredensial terkait | ref ke blok Kredensial | **gerbang wajib untuk kategori ini** |
| `penyelia` | Penyelia / atasan | teks | verifikator |

**Syarat item kuat:** `volume` berangka + `institusi` + blok Kredensial terisi.

**Blok agregat (baru, dan ini pembeda produk):**
Kategori ini butuh ringkasan agregat di atas daftar item, mengikuti cara regulator menilai:
`total per kategori` · `ambang minimum` · `persentase per ranah` · `periode siklus`.

Untuk nakes Indonesia, ambang resminya sudah ada 🟢 (KMK 1561/2024): **250 SKP** (dokter & spesialis) / **100** (dokter gigi) / **50** (nakes lain) per 5 tahun, dengan ranah **Pembelajaran ≥45%, Pelayanan ≥35%, Pengabdian ≥5%**. Aplikasi bisa menampilkan progress bar terhadap ambang ini — fitur yang **tidak ada** di CV builder mana pun.

**Menyerap dari katalog lama:** §6.6 kedokteran-kesehatan, §6.7 keagamaan, §6.8 pendidikan-keguruan, sebagian §6.16 pariwisata-kuliner (operasional), sebagian §6.17 sosial-humaniora (asesmen/pendampingan).

**Peringatan (tampilkan mencolok):**
> *Dilarang menulis identitas pasien, nomor rekam medis, foto luka/pasien, atau data yang bisa mengidentifikasi orang. Tulis jumlah dan jenis kasus, bukan kasusnya. Hasil asesmen psikologis dan data responden juga bersifat rahasia.*

**Kredensial khas** (lihat §4 untuk detail dan koreksi terbaru): STR + SIP · Sertifikat Pendidik (PPG) + NUPTK · ijazah/sanad tahfidz · Sertifikasi Da'i/Penyuluh Kemenag · SIPP/SIPPK/SILP · sertifikat BNSP pariwisata.

---

#### 4. `karya-terkredit` — PUBLIKASI & KREDIT

**Pola:** Daftar Karya Terkredit. Bukti = daftar kronologis output yang **validitasnya ditentukan pihak luar**. Pemilik portofolio tidak perlu mendeskripsikan kualitasnya — nama venue yang berbicara.

**Judul CV:** `PUBLIKASI & PENELITIAN` · alt: `KARYA ILMIAH`, `PORTOFOLIO PERTUNJUKAN & KARYA`, `KARYA TERBIT`
**Label item:** "Karya" · **Jumlah:** tanpa batas atas — **satu-satunya kategori di mana makin banyak makin baik**

**Field inti (6):**

| Key | Label | Tipe |
|---|---|---|
| `tipeLuaran` | Tipe luaran | pilihan: artikel jurnal · prosiding · bab buku · buku · paten/HKI · manuskrip dalam review · pertunjukan · rekaman · pameran · film/produksi |
| `sitasiLengkap` | Sitasi / kredit lengkap | teks_panjang — APA/IEEE dengan **nama sendiri dicetak tebal**; untuk seni: produksi · peran · venue · sutradara · tahun |
| `venue` | Venue / penerbit / panggung | teks |
| `peranSaya` | Peran | pilihan: penulis pertama · korespondensi · anggota · pemain · komposer · koreografer · sutradara · kurator |
| `indeksasiTier` | Indeksasi / tingkat | pilihan: Scopus Q1–Q4 · SINTA 1–6 · WoS · Garuda · tidak terindeks · festival internasional/nasional/lokal |
| `pengenalPersisten` | DOI / ISBN / tautan rekaman | url |

**Syarat item kuat:** sitasi lengkap + venue + pengenal persisten (DOI/ISBN/tautan).

**Ciri pembeda yang bisa jadi fitur:** ini **satu-satunya pola yang bisa di-query dari database publik** alih-alih diketik manual — ORCID, Scopus, SINTA, Google Scholar, IMDb. Lihat saran fitur §6.3.

**Aturan format:** urut menurun berdasarkan tahun, dikelompokkan menurut tipe luaran. **Tidak ada batas halaman** (CV akademik lazim 2–10 halaman menurut Georgetown Career Center 🟡).

**Menyerap dari katalog lama:** §6.9 akademik-riset, §6.20 seni-pertunjukan, sebagian §6.12 (jurnalistik: artikel tayang).

**Kredensial khas:** NIDN/NIDK, jabatan fungsional (Asisten Ahli → Guru Besar), Serdos, pengalaman reviewer jurnal, grade ABRSM/Trinity, UKW Dewan Pers.

---

#### 5. `dampak-program` — PROGRAM & DAMPAK

**Pola:** Butir Dampak Berangka. Bukti = pernyataan tentang hasil, karena artefaknya milik perusahaan dan tidak bisa dibawa keluar.

> 💭 Alasan struktural mengapa profesi ini tidak punya artefak: model keuangan, dek strategi, dan data pelanggan adalah milik dan rahasia perusahaan. Satu-satunya bukti yang legal dibawa keluar adalah *pernyataan tentang* hasil, bukan hasilnya. Ini menjelaskan mengapa angka jadi begitu sentral — **angka adalah residu yang tersisa setelah artefaknya dilucuti.**

**Judul CV:** `PORTOFOLIO PROGRAM & DAMPAK` · alt: `PROYEK & ANALISIS`, `PENGALAMAN PROGRAM`
**Label item:** "Program" · **Jumlah disarankan:** 3–6

**Field inti (6):**

| Key | Label | Tipe |
|---|---|---|
| `lingkupProgram` | Lingkup | teks + saran: laporan keuangan · audit · perpajakan · analisis kredit · kampanye digital · rekrutmen · pelatihan · pengadaan · pergudangan · advokasi kebijakan · pemberdayaan |
| `skalaDikelola` | Skala yang dikelola | teks | anggaran · ukuran tim · jumlah akun/vendor/karyawan/penerima manfaat |
| `metrikDampak` | Metrik dampak | **terstruktur wajib**: metrik + nilai sebelum + nilai sesudah + rentang waktu |
| `metodeStandar` | Metode & standar | multi: Lean · Six Sigma DMAIC · PSAK/IFRS/SAK EMKM · COSO · Perpres 16/2018 · Incoterms · UU Ketenagakerjaan · PP 35/2021 |
| `sistemPerkakas` | Sistem & perkakas | multi: SAP · Oracle ERP · Accurate · Power BI · Tableau · Coretax · e-Faktur · SPSE/LKPP · Talenta · Google Analytics · Meta Ads · SPSS · NVivo |
| `penerimaManfaat` | Penerima manfaat | teks: siapa yang diuntungkan — pelanggan, tim lain, manajemen, masyarakat |

**Syarat item kuat:** `metrikDampak` lengkap (metrik + sebelum + sesudah + waktu) + `skalaDikelola` + `metodeStandar`.

**Struktur STAR yang dipakai (UMass CICS 🟡):** `Situation` diserap ke header (perusahaan, jabatan, periode) — **jangan ditulis ulang**. `Task` = tanggung jawab inti. `Action` = kata kerja spesifik. `Result` = dampak terkuantifikasi dengan penerima manfaat jelas. Catatan metodologis dari sumber: **jangan tulis STAR berurutan** — pola yang dianjurkan misalnya Task+Result, lalu Action+Action+Result.

**Menyerap dari katalog lama:** §6.10 hukum (nonlitigasi), §6.11 bisnis-keuangan, §6.12 pemasaran-media (kampanye), §6.17 sosial-humaniora (program), §6.18 logistik-procurement, §6.19 sdm-administrasi.

**Peringatan (wajib untuk hukum):** hormati kerahasiaan klien — nama pihak dan nomor perkara diganti deskriptor generik. Angka keuangan perusahaan sering rahasia — sediakan opsi rentang/persentase relatif.

---

### 3.3 Matriks pemetaan: 21 bidang lama → 5 kategori pola

| Bidang lama | Kategori utama | Kategori alternatif | Catatan migrasi |
|---|---|---|---|
| 6.1 software-ti | `karya-visual` | `proyek-teknis` (untuk infra/jaringan/SRE) | `repo`+`demo` → `tautanKarya`; `stack` → `perkakas`; `statusProduksi` → `statusKarya`; `metrikDampak` → `hasil` |
| 6.2 hardware-elektro | `proyek-teknis` | — | `hasilUkur` → `hasilTerukur`; `toolsEDA` → `perkakas`; `lapisanPCB`, `komponenInti`, `bom` → **slot fleksibel** |
| 6.3 sipil-konstruksi | `proyek-teknis` | — | `nilaiKontrak`, `skalaFisik` → `skalaProyek`; `kodeStandar` → `standarKode`; `hasilJadwalBiaya` → `hasilTerukur`; `sistemStruktur`, `k3` → **slot** |
| 6.4 arsitektur-perencanaan | `karya-visual` | `proyek-teknis` (mode lisensi STRA/SKK) | `jenisGambar` → `bentukKarya`; `tautanBooklet` → `tautanKarya`; `statusTerbangun` → `statusKarya`; `luasBangunan`, `tipologi` → **slot** |
| 6.5 desain-kreatif | `karya-visual` | — | UI/UX dan grafis tidak lagi dua skema terpisah — perbedaannya cukup di `bentukKarya` dan kamus istilah |
| 6.6 kedokteran-kesehatan | `praktik-jam` | `karya-terkredit` (blok publikasi terpisah) | `volumeKasus` → `volume`; `fasilitas` → `institusi`; `prosedur`, `kompetensi`, `cpdSkp` → **slot** + blok agregat SKP |
| 6.7 keagamaan | `praktik-jam` | `karya-terkredit` (karya tulis, sanad) | `jumlahBinaan`/`jamMengajar` → `volume`; `capaianHafalan`, `sanadIjazah`, `kitabDikuasai` → **slot** |
| 6.8 pendidikan-keguruan | `praktik-jam` | — | `jumlahSiswa` → `volume`; `hasilBelajar` → `luaran`; `jenjangAjar`, `kurikulum`, `perangkatAjar` → **slot** |
| 6.9 akademik-riset | `karya-terkredit` | — | pemetaan hampir 1:1 |
| 6.10 hukum | `dampak-program` | `karya-terkredit` (contoh tulisan terbit) | `jenisPekerjaan` → `lingkupProgram`; `jumlahDokumen` → `skalaDikelola`; `forum`, `bidangHukum` → **slot** |
| 6.11 bisnis-keuangan | `dampak-program` | — | `skalaAngka` → `skalaDikelola`; `dampak` → `metrikDampak`; `standar` → `metodeStandar` |
| 6.12 pemasaran-media | `dampak-program` | `karya-visual` (konten), `karya-terkredit` (jurnalistik) | **bidang paling terbelah** — tiga pola berbeda tergantung peran. Deteksi otomatis dari sub-bidang. |
| 6.13 industri-manufaktur | `proyek-teknis` | — | `dampakTerukur` → `hasilTerukur`; `metode` → `standarKode`+`perkakas` |
| 6.14 energi-tambang-hse | `proyek-teknis` | — | `capaian` → `hasilTerukur`; `k3lRegulasi` → `standarKode`; `parameterProses`, `fasilitas` → **slot** |
| 6.15 agro-hayati | `proyek-teknis` | `praktik-jam` (penyuluhan/veteriner) | `hasilProduksi` → `hasilTerukur`; `skalaLahan` → `skalaProyek`; `komoditas`, `metodeBudidaya` → **slot** |
| 6.16 pariwisata-kuliner | `praktik-jam` | `karya-visual` (menu/plating/event) | `skalaLayanan` → `volume`; `costControl` → `luaran`; `spesialisasi` → **slot** |
| 6.17 sosial-humaniora | `dampak-program` | `karya-terkredit` (penelitian) | `jumlahPenerimaManfaat` → `penerimaManfaat`+`skalaDikelola`; `metode`, `alat` → `metodeStandar`+`sistemPerkakas` |
| 6.18 logistik-procurement | `dampak-program` | `proyek-teknis` (proyek rantai pasok) | `nilaiTransaksi`/`jumlahVendor` → `skalaDikelola`; `dampak` → `metrikDampak` |
| 6.19 sdm-administrasi | `dampak-program` | — | `jumlahKaryawan` → `skalaDikelola`; `capaian` → `metrikDampak` |
| 6.20 seni-pertunjukan | `karya-terkredit` | `karya-visual` (showreel sebagai medium) | `tempatTampil` → `venue`; `peranSeni` → `peranSaya`; `rekaman` → `pengenalPersisten` |
| 6.21 umum | `umum` | — | dipertahankan apa adanya |

**Yang menjadi jelas dari matriks ini:** setiap field khusus dari 21 bidang lama punya rumah — entah di 6–7 field inti, atau di slot fleksibel. **Tidak ada informasi yang hilang.** Yang hilang hanya duplikasi nama.

**Bidang baru yang sekarang tertampung tanpa menulis skema:** penerbangan (`praktik-jam`, jam terbang), pelaut (`praktik-jam`, sea time), atlet (`karya-terkredit`, prestasi), auditor internal (`dampak-program`), penerjemah (`karya-terkredit`), UMKM/wirausaha (`dampak-program`), ASN (`dampak-program`).

---

## 4. Model data yang direkomendasikan

Sesuai pilihan Anda: **field universal + slot fleksibel.**

```ts
// ── Level CV ──────────────────────────────────────────────
type ProfilPortofolio = {
  pola: PolaSlug              // 'karya-visual' | 'proyek-teknis' | 'praktik-jam'
                              // | 'karya-terkredit' | 'dampak-program' | 'umum'
  // Metadata — TIDAK menentukan bentuk form, hanya saran & bobot kata kunci.
  // Empat sumbu terpisah, jangan dilebur (lihat §2.1).
  jurusan?: string            // teks bebas; dicocokkan ke kamus → menyarankan pola
  rumpunIlmu?: string         // 6 rumpun, UU 12/2012 — turunan dari jurusan
  industri?: string           // kategori KBLI — untuk bobot kata kunci
  jenjangKKNI?: 1|2|3|4|5|6|7|8|9   // untuk ambang skor & verb bank
  tujuan: 'melamar-kerja' | 'sertifikasi-lisensi' | 'beasiswa-akademik' | 'tender-proyek'
}

type BagianPortofolio = {
  aktif: boolean
  judulPilihan?: string       // dari whitelist pola
  gabungKePengalaman: boolean // ⭐ BARU — render sebagai sub-entri di bawah
                              // PENGALAMAN KERJA (bentuk paling aman untuk parser)
  item: ItemPortofolio[]
  maksItem: number
  modeRedaksi: boolean
}

// ── Item ──────────────────────────────────────────────────
type ItemPortofolio = {
  id: string
  polaOverride?: PolaSlug     // item ini beda pola dari CV-nya

  // FIELD UMUM — dipakai SEMUA pola. Bentuknya sengaja meniru entri
  // pengalaman kerja, karena itulah yang dikenali parser (§1.3).
  judul: string
  peran: string               // peran SPESIFIK saya, bukan peran tim
  konteks: string             // ⭐ jadi WAJIB — klien/institusi/"Proyek Mandiri"
  lokasi?: string
  mulai: string               // YYYY-MM
  selesai: string | 'sekarang'
  ringkasan: string           // 1 kalimat, maks 160 karakter
  poin: string[]              // 2–4 bullet, tiap bullet <= 200 karakter
  tautan: { label: string; url: string }[]   // maks 2, anchor + URL polos bersanding
  kataKunci: string[]

  // FIELD INTI POLA — 6–7 field, ditentukan skema pola (§3.2)
  inti: Record<string, string | number | string[]>

  // ⭐ SLOT FLEKSIBEL — pengganti 21 set field khusus
  detailTambahan: DetailTambahan[]   // maks 6; hanya 4 prioritas tertinggi
                                     // yang dirender di baris "Detail"

  // ⭐ VERIFIKATOR — field yang paling menentukan di pola 2/3/4 (§2.2)
  verifikator?: { nama: string; jabatan: string; hubungan: string }

  arsip?: Record<string, unknown>    // data dari pola sebelumnya, bisa dipulihkan
}

type DetailTambahan = {
  label: string     // dari kamus (autocomplete) ATAU diketik bebas
  nilai: string
  satuan?: string   // "m²", "juta rupiah", "kasus", "juz", "jam/pekan"
  prioritas: number // 1 = paling penting
}
```

### Registry: dari 21 objek skema jadi 5 skema + 1 kamus

**Berkas 1 — `lib/portfolio/pola-schemas.ts`** (5 objek, statis, jarang berubah):

```ts
type PolaSchema = {
  slug: PolaSlug
  nama: string
  kalimatPenjelas: string
  headingCV: string
  headingAlternatif: string[]
  labelItem: string
  rentangItemIdeal: [number, number | null]   // null = tanpa batas atas
  fieldInti: FieldDef[]                        // 6–7 saja
  wajib: string[]
  butuhVerifikator: boolean
  butuhKredensial: boolean                     // true untuk 'praktik-jam'
  blokAgregat?: AgregatDef                     // hanya 'praktik-jam'
  aturanBahasa?: 'orang-pertama-wajib'         // 'proyek-teknis'
  aturanSkor: SkorRule[]
  catatanUI: string[]
  peringatan: string[]
}
```

**Berkas 2 — `lib/portfolio/kamus-bidang.ts`** (data murni, tumbuh tanpa menyentuh kode):

```ts
type EntriKamus = {
  slug: string                 // 'sipil-konstruksi'
  nama: string                 // 'Teknik Sipil & Konstruksi'
  polaDisarankan: PolaSlug
  polaAlternatif?: PolaSlug[]
  jurusanTermasuk: string[]    // untuk pencarian: "Teknik Sipil", "Struktur", "MEP"
  rumpunIlmu: string
  kbliTerkait?: string[]
  saranDetailTambahan: { label: string; satuan?: string; prioritas: number }[]
  kataKunciATS: string[]
  kredensial: KredensialDef[]
  contohItem: Partial<ItemPortofolio>
  peringatanTambahan?: string[]
}
```

**Ini pemisahan yang penting:** `pola-schemas.ts` menentukan **bentuk form** (kode harus tahu). `kamus-bidang.ts` menentukan **isi saran** (kode tidak perlu tahu). Menambah profesi baru = menambah satu entri kamus. **Tidak ada komponen yang berubah.**

### Blok Kredensial — koreksi berdasarkan riset

Blok ini naik jadi **wajib untuk `praktik-jam`**, opsional untuk lainnya. Empat kategori kredensial dengan perlakuan berbeda:

| Kategori | Contoh | Field wajib |
|---|---|---|
| **A. Lisensi praktik** — tanpa ini tidak boleh bekerja | STR + SIP · SIPPK/SILP · izin Akuntan Publik (Menkeu) · sumpah advokat · SIP dokter hewan | nomor · penerbit · tanggal terbit · **masa berlaku yang menerima nilai "seumur hidup"** |
| **B. Kredensial berjenjang** — jenjang menentukan kelayakan proyek/tender | **SKK Konstruksi jenjang 1–9** · **STRA + Lisensi Arsitek** (arsitek butuh **tiga** dokumen: STRA + SKK + Lisensi 🟢) · **STRI** (PII, 5 tahun 🟢) · POP/POM/POU · Ahli K3 Umum (SKP Kemnaker, **3 tahun** 🟢) | jenis · **jenjang/level terstruktur** · klasifikasi bidang · masa berlaku |
| **C. Sertifikasi sektoral** — wajib untuk jabatan tertentu, bukan untuk profesinya | Sertifikat Pendidik (PPG, tanpa masa berlaku) · sertifikat LKPP · CA IAI / Register Negara Akuntan · UKW Dewan Pers | jenis · penerbit · tahun |
| **D. Sertifikasi kompetensi & vendor** — pelengkap, bukan gerbang | BNSP/LSP (skema okupasi; masa berlaku **ditetapkan per skema**, umumnya 3 tahun — **jangan hardcode**) · AWS/GCP/Azure · Meta Blueprint · Google Ads · Dicoding/Bangkit | jenis · penerbit · tahun · sub-tipe (vendor / BNSP / bootcamp) |

**Koreksi terhadap prompt lama:**
- §6.6: STR **seumur hidup** sejak UU 17/2023; SIP tetap 5 tahun. Jangan rujuk UU 38/2014 atau UU 4/2019 (**dicabut**).
- §6.4: arsitek butuh **STRA + SKK Konstruksi + Lisensi Arsitek**, bukan STRA saja. STRA diterbitkan **Dewan Arsitek Indonesia**, Lisensi oleh pemerintah provinsi.
- §6.18: **LKPP tidak memakai penomoran "level 1–3"** dalam Perlem 7/2021 🟢. Yang ada: Sertifikasi Level-1 + Sertifikasi Pengelola PBJ (jabatan fungsional berjenjang) + Sertifikasi Personel Lainnya (PPK/Pokja). Istilah "level 2/3" beredar di penyedia pelatihan komersial, bukan istilah regulasi.
- §6.3: SKK Konstruksi punya **9 jenjang** (bukan sekadar "9 jenjang: operator/teknisi-analis/ahli" — konversi dari SKA/SKT lama ditetapkan SK Dirjen Bina Konstruksi 12.1/KPTS/Dk/2022 🟢, klasifikasi bidang **8**: arsitektur, sipil, mekanikal, tata lingkungan, arsitektur lanskap, PWK, sains & rekayasa teknik, manajemen pelaksanaan).
- §6.17: **jangan** memvonis mana izin psikologi yang sah. Ada tiga dokumen dengan sengketa kewenangan aktif (SIPP/HIMPSI, SIPPK/Kemenkes, SILP/Kemdiktisaintek). Sediakan field generik "Izin Praktik Psikologi" dengan tiga opsi.

---

## 5. Rekomendasi skor: pinjam model FAIP, buang sub-kriteria karangan

### 5.1 Ganti nama dulu

Berdasarkan §1.2 koreksi #6, "Skor ATS 6 dimensi" tidak bisa dipertahankan. Ganti jadi dua angka yang jujur:

| Nama baru | Apa yang diukur | Bisa dipertahankan karena |
|---|---|---|
| **Kecocokan Lowongan** | overlap kata kunci CV ↔ deskripsi lowongan yang ditempel | Ini persis yang dilakukan boolean full-text search Greenhouse 🟢, dan ini yang Jobscan sebut "match rate" |
| **Kekuatan & Keterbacaan** | kelengkapan struktur, ekstraktabilitas teks, kekuatan bukti | Bisa diuji langsung — apakah teks CV terekstrak benar; tidak mengklaim memprediksi keputusan ATS |

Dimensi "Bukti Karya" masuk ke angka kedua.

### 5.2 Rumus Bukti Karya: adopsi P × Q × R dari FAIP

Prompt lama (§7) memakai lima sub-kriteria yang dikarang: kelengkapan 25 / kekuatan bukti 25 / hasil terukur 25 / kejelasan peran 15 / higiene tautan 10. Tidak ada dasarnya.

**Ganti dengan model FAIP** — instrumen resmi PII yang sudah dipakai menilai kompetensi insinyur Indonesia sejak lama, dan yang secara struktural tepat karena bekerja pada level *item*, bukan level *dokumen*:

**Skor per item = f(P, Q, R)**

| Faktor | Arti di FAIP | Cara dihitung dari data Anda |
|---|---|---|
| **P** — banyaknya pengalaman | frekuensi pekerjaan sejenis | jumlah item dalam pola yang sama × durasi · dibandingkan `rentangItemIdeal` pola |
| **Q** — peranan | participate / contribute / collaborate; anggota / pemimpin / ahli; konseptual / rencana / pelaksana | dari field `peran` + `kontribusi` + `tahapKeterlibatan`. **Ini yang membedakan "anggota tim" dari "saya merancang X".** |
| **R** — tingkat kesulitan | spesifikasi teknis, lingkungan, anggaran, tenaga kerja, pendekatan pemecahan masalah | dari `skalaProyek`/`volume`/`skalaDikelola` + `standarKode` + `hasilTerukur` |

**Skor bagian = Σ(skor item) dinormalisasi ke ambang pola**, dengan ambang meniru struktur FAIP (IPP 600 / IPM 3.000 / IPU 6.000) tapi disesuaikan ke `jenjangKKNI` pengguna. Mahasiswa dan senior tidak dinilai dengan ambang yang sama — inilah sumbu senioritas yang §2.1 sebut, dan inilah gunanya KKNI.

**Tambahan dari rubrik UKMPPG:** **satu bukti hanya boleh dipakai untuk satu komponen.** Cegah double-counting — satu proyek yang sama tidak boleh dihitung di dua item.

**Tambahan dari GMC & UKMPPG:** komponen **refleksi** (apa yang Anda pelajari, apa yang akan Anda lakukan berbeda) muncul di GMC revalidation dan rubrik UKMPPG (3 poin). Ini pembeda kualitas yang murah diminta dan sulit dipalsukan. Pertimbangkan sebagai field opsional yang menambah skor, bukan wajib.

### 5.3 Bobot per pola

Gantikan bobot per-bidang di §7 lama:

| Pola | Bobot "Bukti Karya" | Alasan |
|---|---|---|
| `karya-visual` | **20%** | portofolio memang produk utamanya |
| `karya-terkredit` | **20%** | publikasi/kredit memang portofolionya |
| `proyek-teknis` | **15%** | penting, tapi kredensial berjenjang juga menentukan |
| `praktik-jam` | **12%** + blok Kredensial **wajib** (kosong = penalti terpisah) | lisensi adalah gerbang; portofolio pelengkap |
| `dampak-program` | **12%** | butir dampak sudah tersebar di bagian Pengalaman Kerja — hindari double-counting |
| `umum` | **12%** | netral |

**Hapus penalti panjang halaman untuk semua pola** (§1.2 koreksi #4).

### 5.4 Saran perbaikan spesifik per pola

Prompt lama sudah benar bahwa saran harus spesifik. Sekarang saran ditulis **per pola**, bukan per 21 bidang — 5 set saran, bukan 21:

- **karya-visual:** *"Karya 'Redesain Aplikasi Y' belum menyebut hasil. Tambahkan satu angka: konversi, waktu penyelesaian tugas, atau kepuasan pengguna."* · *"Portofolio hanya berisi hasil akhir. Tambahkan 2–3 langkah keputusan — inilah yang dinilai perekrut, bukan visualnya."*
- **proyek-teknis:** *"Proyek 'Panel Kendali' belum ada hasil pengukuran. Tambahkan angka hasil uji — inilah yang membedakan perancang dari perakit."* · *"Deskripsi memakai 'kami'. Tulis apa yang Anda kerjakan sendiri: 'saya menghitung...', 'saya menguji...'."*
- **praktik-jam:** *"Kegiatan pembinaan belum menyebut jumlah santri atau jam per pekan. Angka membuat pengabdian jadi terukur."* · *"Blok Kredensial kosong. Untuk bidang ini, lisensi adalah syarat pertama yang dicek perekrut."*
- **karya-terkredit:** *"Publikasi belum mencantumkan indeksasi dan DOI. Tambahkan Scopus/SINTA dan tautan DOI."*
- **dampak-program:** *"Metrik 'efisiensi naik' belum punya nilai sebelum dan sesudah. Perekrut membaca '12% → 8%' berbeda dari 'lebih efisien'."*

---

## 6. Saran penambahan untuk proyek ini

Diurut dari yang berdampak paling besar. Nomor 1–4 muncul langsung dari temuan riset; 5–8 adalah peluang produk.

### 6.1 ⭐ Sumbu "Tujuan" — satu profesi, beberapa pola

Temuan §2.2 poin 2: hampir setiap profesi memakai lebih dari satu pola tergantung **keperluannya**. Ini bukan komplikasi — ini fitur yang tidak dimiliki CV builder mana pun.

Tambahkan satu pertanyaan di onboarding: **"CV ini untuk apa?"**

| Tujuan | Pola default | Perilaku |
|---|---|---|
| Melamar kerja | sesuai kamus jurusan | default |
| Sertifikasi / lisensi profesi | `proyek-teknis` atau `praktik-jam` | aktifkan `verifikator` **wajib**, aturan bahasa orang-pertama, blok kredensial di atas |
| Beasiswa / akademik | `karya-terkredit` | hapus batas panjang, urutkan per tipe luaran |
| Tender / prakualifikasi | `proyek-teknis` | tampilkan `nilaiKontrak` & `standarKode` menonjol, aktifkan mode rentang |

Arsitek yang melamar kerja butuh booklet (`karya-visual`); arsitek yang mengurus STRA butuh rekaman kompetensi (`proyek-teknis`). **Sama orangnya, sama datanya, beda rendernya.** Satu database, empat keluaran.

### 6.2 ⭐ Sakelar "Gabung ke Pengalaman Kerja"

Konsekuensi langsung §1.3. Untuk item yang punya `konteks` berupa pemberi kerja nyata, render sebagai sub-entri di bawah `PENGALAMAN KERJA` alih-alih bagian terpisah. Ini bentuk yang RChilli memang harapkan 🟢, dan bagian `WORK_HISTORY` pasti ada di enum Textkernel.

UI-nya cukup satu sakelar dengan penjelasan jujur: *"Sebagian pembaca otomatis hanya mengenali proyek jika menempel pada pengalaman kerja. Aktifkan ini kalau proyek Anda punya pemberi kerja."*

### 6.3 ⭐ Impor otomatis untuk `karya-terkredit`

Ini satu-satunya pola yang **bisa di-query dari database publik** (§3.2 kategori 4). Impor dari **ORCID** (API terbuka, gratis) dan **SINTA** akan menghemat pengguna akademik puluhan menit pengetikan sitasi, dan tidak ada pesaing lokal yang punya ini.

Mulai dari ORCID — API-nya paling bersih dan tidak butuh otentikasi untuk profil publik. Google Scholar tidak punya API resmi; jangan scrape.

### 6.4 ⭐ Mode "Salin ke Form Portal"

Temuan §2.4: sebagian besar pelamar Indonesia mengisi **profil terstruktur** di Jobstreet/Glints/Kalibrr/portal BUMN, bukan mengunggah CV untuk diparsing. Aplikasi Anda sudah punya data terstruktur — persis yang dibutuhkan.

Tambahkan tampilan yang memecah CV jadi blok-blok siap salin sesuai field yang lazim diminta portal: ringkasan · pengalaman per entri · pendidikan · keahlian · sertifikasi. Tiap blok punya tombol salin.

Ini mengubah posisi produk dari *"CV builder yang mengklaim lolos ATS"* (klaim yang sulit dipertahankan) jadi *"satu sumber data untuk semua jalur lamaran"* (klaim yang benar dan bisa dibuktikan). 💭

### 6.5 Blok agregat untuk `praktik-jam`

§3.2 kategori 3. Progress bar terhadap ambang resmi: 250/100/50 SKP per 5 tahun dengan ranah 45%/35%/5% (KMK 1561/2024 🟢). Untuk guru: rubrik UKMPPG. Untuk konstruksi: PKB untuk perpanjangan SKK.

Nilai bagi pengguna melampaui CV — mereka bisa melihat apakah SKP-nya cukup untuk perpanjangan SIP. Itu alasan untuk kembali ke aplikasi setiap bulan, bukan setiap kali melamar kerja.

### 6.6 Validator bahasa orang-pertama

§2.2 poin 4. Deteksi "kami", "tim kami", "memimpin", "mengelola" tanpa objek konkret di field `poin` dan `inti`, lalu sarankan penulisan ulang. Aturannya konvergen di NCEES dan Engineers Australia 🟢 — bukan opini.

Wajib untuk `proyek-teknis`, saran untuk pola lain.

### 6.7 Field `verifikator` sebagai warga kelas satu

§2.2 poin 3: pola 2, 3, dan 5 tidak berfungsi tanpa identitas pihak ketiga. Ini field yang tidak ada sama sekali di prompt lama, padahal justru yang membedakan klaim yang bisa dicek dari klaim yang tidak.

Tidak perlu ditampilkan di CV (bisa jadi metadata untuk pengguna sendiri, atau baris "Referensi tersedia atas permintaan"). Tapi **meminta pengguna mengisinya menaikkan kualitas tulisan mereka** — orang menulis lebih hati-hati saat tahu ada nama yang bisa dihubungi.

### 6.8 Kalibrasi ukuran berkas & panduan pengiriman dua-lapis

Untuk `karya-visual`, riset memberi angka konkret yang tidak ada di panduan Indonesia mana pun: booklet penuh 30–35 halaman, **teaser 3–5 halaman** dikirim bersama CV, ukuran berkas 5–10 MB untuk email (maks 15 MB), portal karier firma 15–25 MB.

Aplikasi bisa: (a) menampilkan panduan ini kontekstual, (b) menghitung perkiraan ukuran berkas ekspor, (c) menawarkan ekspor "versi teaser" berisi 3 item terkuat.

---

## 7. Yang harus dibuang dari prompt lama

| Bagian | Tindakan | Alasan |
|---|---|---|
| §6.1–§6.20 sebagai **skema form** | **Hapus** — konversi jadi entri `kamus-bidang.ts` | 21 skema → 5 skema + kamus. Isinya tidak hilang, tempatnya pindah. |
| §7 sub-kriteria 25/25/25/15/10 | **Ganti** dengan model P×Q×R FAIP | Yang lama dikarang; yang baru instrumen resmi PII |
| §7 penalti panjang halaman | **Hapus untuk semua pola** | Terbantah (§1.2 #4) |
| §3.3 "dilarang pemendek tautan karena spam" | **Pertahankan larangan, ganti alasan** | Alasan lama folklor (§1.2 #3) |
| §3.3 "buang https:// dan www., simpan sebagai href" | **Ganti** jadi "sandingkan anchor + URL terbaca" | Setengah jalan (§1.2 #2) |
| §3.2 "judul harus dari whitelist" sebagai aturan tak boleh dilanggar | **Turunkan** jadi saran | Klaim "bagian hilang" tidak ada buktinya (§1.2 #1) |
| Nama "Skor ATS" | **Ganti** jadi "Kecocokan Lowongan" + "Kekuatan & Keterbacaan" | Tidak bisa dipertahankan (§1.2 #6) |
| §6.6 "STR beserta masa berlaku" | **Perbaiki** — dukung nilai "seumur hidup" | UU 17/2023 (§1.2 #7) |
| §12 kriteria "Semua **21 bidang** terdaftar lengkap" | **Ganti** jadi "5 pola lengkap + kamus ≥21 entri jurusan, pencarian jurusan menemukan pola yang benar" | Kriteria lama mengukur hal yang salah |
| §13 Fase 5 "Lengkapi 16 bidang sisanya" | **Hapus fase ini** | Tidak ada lagi 16 bidang untuk dilengkapi — menambah profesi = menambah entri kamus, bukan fase pengembangan |

---

## 8. Risiko & yang perlu diverifikasi sebelum implementasi

**Risiko desain:**

1. **Peleburan bisa terasa seperti kemunduran bagi pengguna yang sudah kenal katalog lama.** Mitigasi: dropdown tetap dicari lewat **nama jurusan** ("Teknik Sipil", "Ahwal Syakhshiyyah", "PWK", "Tata Boga", "Mekatronika"), bukan nama pola. Pengguna tidak pernah melihat kata "pola" — mereka mengetik jurusannya dan sistem memilih polanya. Kriteria penerimaan §12 poin 2 tetap berlaku apa adanya.

2. **Pemasaran-media terbelah tiga pola** (§3.3). Perlu deteksi sub-bidang yang baik, atau pertanyaan lanjutan: *"Karya Anda lebih banyak berupa: (a) konten yang bisa dilihat, (b) artikel yang tayang di media, (c) kampanye dengan angka hasil?"*

3. **Slot fleksibel bisa jadi tempat sampah.** Mitigasi: maks 6 entri, hanya 4 prioritas tertinggi yang dirender di CV, autocomplete dari kamus lebih menonjol daripada input bebas.

**Yang wajib diverifikasi ke sumber primer sebelum ditulis di kode:**

| Item | Status | Cara verifikasi |
|---|---|---|
| Jumlah total SKKNI nasional | 🔴 tidak terverifikasi — portal Kemnaker berbentuk SPA | headless browser ke `skkni.kemnaker.go.id/rekapitulasi-skkni/berlaku`, atau **jangan cantumkan angka** |
| Nama 22 kategori KBLI 2025 | 🔴 dari salinan pihak ketiga; angka struktural cocok dengan berita BPS 🟢 | unduh PDF resmi BPS |
| Nomor pasal masa berlaku SKK Konstruksi | 🔴 sumber bertentangan (PP 14/2021 vs PP 5/2020) | JDIH PUPR. **Jangan tulis nomor pasal spesifik tanpa cek.** |
| Status berlaku Kepmen ESDM 1827 K/30/MEM/2018 (POP/POM/POU) | 🔴 mungkin sudah diubah | JDIH ESDM |
| Nomor pasal STRA di UU 6/2017 | 🔴 halaman JDIH BPK hanya metadata | unduh PDF UU |
| Permenaker 3/2016 (tata cara penetapan SKKNI) | 🔴 sumber baru Wikipedia | JDIH Kemnaker |
| Tahun pengalaman per jenjang SKK 1–9 | 🔴 semua sumber adalah konsultan sertifikasi | dokumen LPJK/Permen PUPR primer |
| Daftar lengkap klasifikasi JobStreet Indonesia | 🔴 domain SEEK memblokir akses otomatis (403) | akses manual lewat browser |

**Klaim yang sebaiknya tidak dipakai sama sekali:**
- *"75% CV ditolak otomatis oleh ATS"* — tidak punya sumber yang bisa ditelusuri; investigasi asal-usulnya menyimpulkan salah kutip.
- *"Foto membuat ATS kesulitan membaca CV"* — tidak ada buktinya; Greenhouse menyatakan sebaliknya. Alasan yang benar untuk tidak memakai foto adalah **bias**, bukan parsing.
- *"Angka 30 detik review portofolio desain"* — konvensi industri, bukan studi terkontrol; penulis sumber aslinya sendiri menyebutnya perkiraan.
- Klaim bahwa SIPP HIMPSI "tidak punya dasar hukum" — itu posisi salah satu pihak dalam sengketa kewenangan aktif, bukan fakta netral.

---

## 9. Rencana fase yang disarankan

Menggantikan §13 prompt lama. Fase 5 lama (melengkapi 16 bidang) hilang; fase baru yang muncul adalah §6.1 dan §6.4.

| Fase | Isi | Berkas utama |
|---|---|---|
| **1** | Tipe data baru + `pola-schemas.ts` (5 pola lengkap sekaligus — hanya 5, bisa selesai di satu fase) + `schemaVersion` + migrasi CV lama → `pola: 'umum'`, `aktif: false` | `lib/portfolio/types.ts`, `pola-schemas.ts` |
| **2** | `kamus-bidang.ts` dengan ≥21 entri hasil konversi katalog lama + pencarian jurusan + pemilih pola dengan sumbu **Tujuan** (§6.1) | `kamus-bidang.ts`, komponen onboarding |
| **3** | Form dinamis: field umum → field inti pola → slot fleksibel → verifikator. Simpan otomatis. Tombol "Isi dengan contoh". | komponen form |
| **4** | Render di pratinjau + 10 template + seluruh eksportir, **termasuk sakelar "Gabung ke Pengalaman Kerja"** (§6.2) dan aturan anchor+URL bersanding | komponen pratinjau, eksportir |
| **5** | Skor: ganti nama jadi "Kecocokan Lowongan" + "Kekuatan & Keterbacaan", implementasi P×Q×R, saran per pola, **hapus penalti halaman** | mesin skor |
| **6** | Blok Kredensial 4 kategori (§4) + blok agregat `praktik-jam` (§6.5) + Mode Redaksi + validator bahasa orang-pertama (§6.6) | — |
| **7** | Integrasi pencocokan lowongan, deteksi pola otomatis pada CV unggahan, **Mode Salin ke Form Portal** (§6.4), impor ORCID (§6.3) | — |

**Kriteria penerimaan yang diperbarui (menggantikan §12):**

1. Lima pola terdaftar lengkap dengan field inti, contoh terisi, aturan skor, dan catatan UI berangka.
2. Kamus memuat ≥21 entri jurusan; pencarian "Kedokteran Gigi", "Ahwal Syakhshiyyah", "PWK", "Tata Boga", "Mekatronika" menemukan **pola** yang benar.
3. Mengganti pola dari `karya-visual` ke `proyek-teknis` tidak menghilangkan judul/peran/konteks/tanggal; field inti lama masuk `arsip` dan bisa dipulihkan.
4. CV dengan 3 item lengkap + verifikator memperoleh skor "Kekuatan Bukti" ≥85; 3 item tanpa angka dan tanpa tautan <50, dengan saran yang menyebut field spesifik **dan pola-nya**.
5. Ekspor PDF/Word/TXT/JSON benar di 10 template, satu kolom, teks bisa dipilih, URL terbaca sebagai teks polos **dan** tetap ber-hyperlink.
6. **Sakelar "Gabung ke Pengalaman Kerja" menghasilkan output di mana item portofolio muncul sebagai sub-entri di bawah judul PENGALAMAN KERJA.**
7. **Ekspor Word tidak menaruh satu pun konten di header/footer dokumen.**
8. CV lama tetap bisa dibuka, disimpan, diekspor tanpa error, dan **skornya tidak berubah** sebelum bagian portofolio diaktifkan.
9. Mode Redaksi mengganti nama klien dan nilai pasti di semua format ekspor.
10. Peringatan kerahasiaan tampil untuk `praktik-jam` (kesehatan/psikologi), `proyek-teknis` (hardware/energi), dan `dampak-program` (hukum/keuangan).
11. Field masa berlaku kredensial menerima nilai "seumur hidup" tanpa memaksa tanggal.
12. Lolos aksesibilitas dasar: label form terkait, navigasi keyboard, kontras memadai, mode gelap benar.

---

## Sumber

**Taksonomi resmi Indonesia**
[Perpres 8/2012 KKNI (JDIH Kemnaker)](https://jdih.kemnaker.go.id/asset/data_puu/PERPRES8_TAHUN_2012GABUNG.pdf) · [Perpres 8/2012 (JDIH BPK)](https://peraturan.bpk.go.id/Details/41251/perpres-no-8-tahun-2012) · [Dokumen KKNI 001](https://img.akademik.ugm.ac.id/dokumen/kkni/kkni_001_dokumen_kkni.pdf) · [UU 12/2012 Pendidikan Tinggi](https://peraturan.bpk.go.id/Details/39063/uu-no-12-tahun-2012) · [Daftar Rumpun, Pohon, Cabang Ilmu 2024 (SISTER)](https://sister.kemdiktisaintek.go.id/pusat_informasi/detail/31825289990937) · [Kepdirjen 163/E/KPT/2022 Nama Prodi](https://lldikti3.kemdikbud.go.id/wp-content/uploads/2024/07/Kepdirjen-Diktiristek-No.-163-Tahun-2022-Tentang-Nama-Program-Studi-pada-Jenis-Pendidikan-Akademik-dan-Pendidikan-Profesi.pdf) · [KBJI 2014 (PPID BPS)](https://ppid.bps.go.id/upload/doc/Klasifikasi_Baku_Jabatan_Indonesia_2014_1659512277.pdf) · [BPS Rilis KBLI 2025](https://www.bps.go.id/en/news/2025/12/19/828/bps-rilis-klasifikasi-baku-lapangan-usaha-indonesia--kbli--2025.html) · [SEEK Developer — Job categories](https://developer.seek.com/use-cases/job-posting/job-categories) · [LinkedIn Standardized Data — Functions](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/standardized-data/functions)

**Sertifikasi & lisensi profesi**
[PP 10/2018 BNSP](https://jdih.bssn.go.id/arsip-hukum/pp-nomor-10-tahun-2018-tentang-badan-nasional-sertifikasi-profesi) · [BNSP — LSP Informatika](https://bnsp.go.id/lsp/informatika) · [Konsil Kesehatan Indonesia — registrasi](https://kki.go.id/registrasi) · [SE Menkes HK.02.01/MENKES/6/2024](https://skp.kemkes.go.id/SE%20No.%20HK.02.01-MENKES-6-2024%20ttg%20Perizinan%20Bagi%20Tenaga%20Medis%20dan%20Tenaga%20Kesehatan%20Pasca%20Terbitnya%20UU%20No.%2017%20Th%202023%20ttg%20Kesehatan.pdf) · [KMK HK.01.07/1561/2024 — Kecukupan SKP](https://www.ipkindonesia.or.id/media/2025/03/KMK-HK-0107-1561-2024-Pedoman-Pengelolaan-Pemenuhan-Kecukupan-SKP-Tenaga-Medis-dan-Tenaga-Kesehatan.pdf) · [Ditjen Bina Konstruksi — jenjang & konversi SKK](https://binakonstruksi.pu.go.id/informasi-terkini/sekretariat-direktorat-jenderal/dirjen-bina-konstruksi-menetapkan-jabatan-kerja-dan-konversi-jabatan-kerja-eksisting-serta-jenjang-kualifikasi-bidang-jasa-konstruksi/) · [Ditjen Bina Konstruksi — STRA + SKK + Lisensi Arsitek](https://binakonstruksi.pu.go.id/informasi-terkini/sekretariat-direktorat-jenderal/kementerian-pu-dan-ikatan-arsitek-indonesia-melakukan-sinergi-positif-guna-mendorong-penerbitan-skk-dan-lisensi-arsitek/) · [Dewan Arsitek Indonesia](https://appv2.dewanarsitek.id/home) · [PP 15/2021 (UU Arsitek)](https://peraturan.bpk.go.id/Details/161845/pp-no-15-tahun-2021) · [UU 11/2014 Keinsinyuran](https://peraturan.bpk.go.id/Details/38602) · [Permendikbudristek 19/2024 PPG](https://ppg.kemendikdasmen.go.id/news/permendikbudristek-nomor-19-tahun-2024-tentang-pendidikan-profesi-guru) · [Perlem LKPP 7/2021](https://jdih.lkpp.go.id/regulation/download/peraturan-lkpp-nomor-7-tahun-2021/1) · [Permenaker PER-02/MEN/1992 (Ahli K3)](https://jdih.kemnaker.go.id/peraturan/detail/242/peraturan-menteri-tenaga-kerja-nomor-2-tahun-1992) · [UU 23/2022 Psikologi](https://peraturan.bpk.go.id/Details/218816/uu-no-23-tahun-2022) · [PERADI — UPA](https://peradi.id/ujian-profesi-advokat/) · [IAPI — sertifikasi](https://iapi.or.id/informasi-sertifikasi/) · [SKKNI 301/2016 Desain Grafis & DKV](https://lsp.unuja.ac.id/unduh/13/SKKNI%202016-301-Desain-Grafis-dan-Desain-Komunikasi-Visual.pdf) · [Hukumonline — 11 UU dicabut UU 17/2023](https://www.hukumonline.com/berita/a/uu-kesehatan-resmi-terbit--11-uu-ini-dinyatakan-tak-berlaku-lt64d31b2e3e3eb/)

**Pola portofolio lintas profesi**
[Engineers Australia — Writing ECCs](https://www.engineersaustralia.org.au/sites/default/files/content-files/2017-02/Writing%20ECCs%20for%20web.pdf) · [UK-SPEC 4th ed](https://www.engc.org.uk/media/a1yfae02/uk-spec-fourth-edition-v42.pdf) · [IChemE Chartered Membership guidance](https://www.icheme.org/media/28360/icheme-chartered-membership-guidance.pdf) · [PEO Work Experience Overview](https://www.peo.on.ca/sites/default/files/2019-09/WorkExperienceOverview.pdf) · [NCEES work experience FAQ](https://help.ncees.org/article/70-work-experience-faqs) · [Kiat Pengisian FAIP — PPI IPB](https://ppi.ipb.ac.id/wp-content/uploads/2020/08/Kiat-Kiat-Pengisisan-FAIP.pdf) · [Standard Form 330 guide](https://openasset.com/resources/standard-form-330/) · [archisoup — portfolio size](https://www.archisoup.com/portfolio-size) · [uxfol.io — case study structure](https://blog.uxfol.io/ux-case-study-structure/) · [SOLTECH — GitHub portfolio](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/) · [ACGME case log requirements](https://rvuedge.com/resources/acgme-case-log-requirements/) · [GMC — supporting information for revalidation](https://www.gmc-uk.org/registration-and-licensing/managing-your-registration/revalidation/guidance-on-supporting-information-for-revalidation/guidance-on-supporting-information-for-revalidation) · [Panduan Teknis Penilaian Portofolio UKMPPG](https://ppg.uinsgd.ac.id/wp-content/uploads/2023/12/Panduan-Teknis-III-Penilaian-Uji-Kinerja-Portofolio-UKMPPG-2021.pdf) · [Boston College — teaching portfolios](https://cteresources.bc.edu/documentation/teaching-portfolios/main-components/) · [UPenn Career Services — academic CV](https://careerservices.upenn.edu/application-materials-for-the-faculty-job-search/cvs-for-faculty-job-applications/) · [SINTA FAQ](https://sinta.kemdiktisaintek.go.id/home/faq) · [UMass CICS — STAR method](https://cics.umass.edu/star-method)

**ATS & konvensi CV**
[Textkernel — Parser output & SectionType](https://developer.textkernel.com/tx-platform/v9/resume-parser/overview/parser-output/) · [Textkernel — Getting started](https://developer.textkernel.com/tx-platform/v9/resume-parser/overview/getting-started/) · [Textkernel v10 FAQ](https://developer.textkernel.com/tx-platform/v10/faq/) · [RChilli — parsing project details](https://help.rchilli.com/hc/en-us/articles/900005421063-How-does-RChilli-parse-the-project-details-in-a-resume) · [Greenhouse — search resumes for keywords](https://support.greenhouse.io/hc/en-us/articles/115004600186-Search-resumes-for-keywords) · [Greenhouse — supported formats](https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads) · [ResumeGo — one or two page resumes](https://www.resumego.net/research/one-or-two-page-resumes/) · [CNBC — two-page resumes preferred](https://www.cnbc.com/2018/12/19/resumego-hiring-managers-prefer-candidates-with-two-page-resumes.html) · [HBS/Accenture — Hidden Workers](https://www.hbs.edu/ris/Publication%20Files/hiddenworkers09032021_Fuller_white_paper_33a2047f-41dd-47b1-9a8d-bd08cf3bfa94.pdf) · [The Tech Resume — ATS myths busted](https://thetechresume.com/samples/ats-myths-busted.html) · [Kristen Fife — how ATS reads your resume](https://kristenfife.medium.com/understanding-how-the-ats-reads-and-interacts-with-your-resume-401bd00b66db) · [Microsoft/Terry Zink — bit.ly does not get you blocked](https://learn.microsoft.com/en-us/archive/blogs/tzink/no-using-bit-ly-does-not-get-you-blocked) · [arXiv — layout-aware resume information extraction](https://arxiv.org/html/2510.09722v1) · [Jobstreet ID — Cari Profil](https://id.jobstreet.com/id/profiles/search) · [Cake — data diri di CV](https://www.cake.me/resources/data-diri-cv?locale=id) · [Georgetown — CV guide](https://careercenter.georgetown.edu/major-career-guides/resumes-cover-letters/curriculum-vitae-cv/)
