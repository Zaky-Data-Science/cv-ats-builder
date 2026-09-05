# PROMPT — Fitur "Portofolio Universal Berbasis Pola" untuk CV ATS Builder

> **Versi 2.** Menggantikan `PROMPT_Fitur_Portofolio_CV_ATS.md` sepenuhnya.
> Salin SELURUH isi berkas ini sebagai satu prompt ke AI coding tool (Claude Code / Cursor / v0)
> yang sedang membuka repo `cv-ats-builder`. Jangan dipotong-potong: §6 (lima skema pola)
> dan §7 (kamus bidang) adalah inti fiturnya.
>
> Perubahan besar dari v1: katalog 21 bidang **dihapus sebagai skema form** dan diganti
> **5 pola pembuktian**. Isi 21 bidang lama tidak hilang — ia pindah ke kamus data (§7).
> Tujuh asumsi teknis v1 dikoreksi berdasarkan riset (§3).

---

## 0. Peran & instruksi eksekusi

Kamu adalah senior full-stack engineer yang melanjutkan aplikasi **CV ATS Builder**
(https://cv-ats-builder-henna.vercel.app). Bahasa antarmuka: **Bahasa Indonesia**.

Tugasmu: menambahkan **bagian CV baru bernama PORTOFOLIO yang bentuk field-nya ditentukan
oleh POLA PEMBUKTIAN pengguna** (bukan oleh jurusannya), tanpa merusak satu pun fitur yang sudah ada.

Aturan kerja:

1. Baca dulu struktur repo, model data CV, komponen form, komponen pratinjau, mesin skor,
   dan seluruh eksportir (PDF/Word/TXT/JSON). **Laporkan temuanmu sebelum menulis kode.**
2. Kerjakan bertahap sesuai §15 (Fase 1 → 7). Setelah tiap fase, sebutkan berkas apa saja yang berubah.
3. Jangan mengubah skema data lama secara destruktif — lihat §13 (migrasi).
4. Semua teks UI, label, placeholder, pesan validasi, dan saran perbaikan: **Bahasa Indonesia**,
   nada lugas, tanpa jargon HR yang mengawang.
5. Jika ada keputusan desain yang ambigu, ambil opsi paling konservatif untuk keterbacaan
   (mesin **dan** manusia), lalu catat asumsinya.
6. **Jangan menulis klaim teknis yang tidak didukung bukti.** §17 memuat daftar klaim terlarang
   dan daftar fakta yang belum terverifikasi. Patuhi keduanya.

---

## 1. Kondisi aplikasi saat ini (jangan dilanggar)

- Aplikasi web: isi field terstruktur → pratinjau CV seukuran kertas (A4/Letter/Legal/F4) → skor → unduh.
- **11 bagian CV** yang sudah ada (identitas, ringkasan profil, pengalaman kerja, pendidikan, keahlian, dst).
- **10 template**, semuanya **satu kolom, tanpa tabel**, memakai judul bagian baku. Yang berbeda hanya
  tipografi, jarak, garis, dan penempatan foto.
- **Skor 5 dimensi berbobot**, tiap saran bisa diklik untuk melompat ke field bermasalah.
- Fitur lain: simpan otomatis ke basis data (<1 detik setelah berhenti mengetik), pencocokan dengan
  iklan lowongan, unggah/bandingkan sampai 5 CV (diproses di peramban), ekspor/impor JSON, hapus akun.

Fitur baru ini mengikuti pola yang sama: field terstruktur → pratinjau langsung → skor → ekspor.

---

## 2. Masalah yang diselesaikan

CV sekarang seragam untuk semua orang. Padahal **bukti karya tiap profesi bentuknya beda total.**

Versi 1 prompt ini menyelesaikannya dengan membuat katalog 21 bidang. Itu keliru arah:
21 bidang tidak pernah cukup (di mana penerbangan? pelaut? atlet? auditor internal?), dan
katalognya sendiri penuh duplikasi — `hasilUkur` (elektro), `hasilJadwalBiaya` (sipil),
`dampakTerukur` (industri), dan `capaian` (energi) adalah **empat nama untuk satu konsep identik**.

Riset lintas profesi menunjukkan hal yang lebih berguna: **portofolio hanya jatuh ke sedikit pola
struktural.** Medium bukan struktur — booklet PDF arsitektur, studi kasus UX di Notion, dan README
GitHub adalah tiga *medium* untuk satu *struktur* yang sama: konteks → peran saya → keputusan →
hasil → refleksi.

Untuk aplikasi ini ada **5 pola + 1 fallback**:

| Pola | Bukti berupa | Yang dinilai | Contoh profesi |
|---|---|---|---|
| **Karya & Desain** | karya yang bisa dilihat/dibuka | kualitas penalaran | desainer, arsitek, UI/UX, software, fotografer |
| **Proyek Teknis** | proyek + spesifikasi + standar + angka | kedalaman tanggung jawab | sipil, elektro, kimia, industri, tambang, geologi |
| **Praktik & Pengajaran** | jam, volume orang dilayani, lisensi | volume & kebaruan | dokter, perawat, guru, penyuluh, dai |
| **Publikasi & Kredit** | daftar karya divalidasi pihak luar | prestise & jumlah | dosen, peneliti, aktor, musisi, jurnalis |
| **Program & Dampak** | angka dampak (artefaknya milik perusahaan) | besaran angka | keuangan, pemasaran, SDM, logistik, hukum |

Pengguna **tidak pernah melihat kata "pola"**. Mereka mengetik jurusan atau profesinya,
dan sistem memilih polanya dari kamus (§7).

**Satu profesi bisa memakai pola berbeda tergantung keperluan.** Arsitek yang melamar kerja
butuh booklet (Karya & Desain); arsitek yang mengurus STRA butuh rekaman kompetensi
(Proyek Teknis). Sama orangnya, sama datanya, beda rendernya. Ini ditangani sumbu **Tujuan** (§5).

---

## 3. Prinsip ATS-safety — SUDAH DIKOREKSI dari v1

Bagian ini berubah paling banyak. Tujuh asumsi v1 diuji ulang terhadap dokumentasi vendor parser,
riset akademik, dan uji ekstraksi langsung. Yang salah dikoreksi; yang benar dipertahankan
dengan alasan yang tepat.

### 3.1 Yang tetap berlaku

1. **Tetap satu kolom.** Tidak ada tabel, kolom ganda, kotak teks, ikon, atau teks di dalam gambar.
   *Terbukti dalam uji: PDF dua kolom membuat teks kiri-kanan terjalin baris demi baris — "Python"
   berakhir bersebelahan dengan "Data Engineer - Tokopedia". Tabel DOCX bahkan bisa hilang total
   di ekstraktor paragraf.* Parser layout-aware modern sudah bisa menanganinya, tapi pelamar tidak
   tahu parser mana yang dipakai — sikap konservatif tetap rasional.
2. **ATS tidak membuka tautan.** Setiap item portofolio wajib punya deskripsi teks yang berdiri
   sendiri. Tautan untuk manusia, teksnya untuk mesin. Tegaskan ini di UI.
3. **Portofolio bukan pengganti isi CV.** Skor tidak boleh dikatrol hanya dengan menempel banyak tautan.
4. **Tanpa lampiran gambar di dalam berkas CV.** Untuk pola Karya & Desain, tampilkan panduan
   pengiriman dua-lapis (§6.1).
5. **Ekspor Word/TXT harus tetap rata kiri, satu kolom, urutan bacanya benar.**

### 3.2 KOREKSI 1 — Judul bagian: turun dari "aturan mati" jadi "asuransi murah"

**v1 berkata:** judul harus dari whitelist agar dikenali parser, kalau tidak bagiannya hilang.

**Yang benar:** taksonomi heading memang nyata. Textkernel (mesin di balik Sovren) mempublikasikan
enum `SectionType` berisi 26 tipe:

```
ARTICLES, AVAILABILITY, BOOKS, CERTIFICATIONS, CONFERENCE_PAPERS, CONTACT_INFO,
EDUCATION, HOBBIES, IGNORE_DATA_AFTER, LANGUAGES, LICENSES, MILITARY, OBJECTIVE,
OTHER_PUBLICATIONS, PATENTS, PERSONAL_INTERESTS_AND_ACCOMPLISHMENTS,
PROFESSIONAL_AFFILIATIONS, QUALIFICATIONS_SUMMARY, REFERENCES, SECURITY_CLEARANCES,
SKILLS, SPEAKING, SUMMARY, TRAINING, WORK_HISTORY, WORK_STATUS
```

**Tapi tidak ada bukti heading non-standar membuat isinya lenyap.** Greenhouse — satu-satunya
vendor yang berbicara resmi soal kegagalan parsing — tidak menyebut heading sama sekali, dan
pencarian kandidatnya adalah **full-text search atas seluruh teks resume**. Risikonya kehilangan
struktur, bukan kehilangan visibilitas.

**Implementasi:** pertahankan whitelist judul, tapi ubah nada UI. Jangan menulis "bagian Anda akan
hilang". Tulis: *"Judul baku lebih mungkin dikenali pembaca otomatis. Judul lain tetap terbaca,
hanya tidak selalu terpetakan ke kolom yang benar."*

### 3.3 KOREKSI 2 — Tautan: sandingkan, jangan pilih salah satu

**v1 berkata:** buang `https://` dan `www.` di tampilan, simpan versi penuh sebagai href.

**Yang benar — dari uji ekstraksi langsung.** Anchor text `Portfolio` dengan target
`https://budi.example.com/portfolio`:

| Ekstraktor | Hasil |
|---|---|
| `pdftotext` (default, `-layout`, `-raw`) | `Portfolio` — URL hilang |
| `pdfplumber` | `Portfolio` — URL hilang |
| `python-docx` | `Portfolio` — URL hilang |
| LibreOffice → txt | `Portfolio` — URL hilang |
| `pdfplumber` + minta anotasi eksplisit | `https://budi.example.com/portfolio` ✅ |

Mekanismenya: di PDF, target tautan disimpan sebagai objek `/Annots` **terpisah dari content stream
teks**; di DOCX, sebagai relationship di `document.xml.rels`, terpisah dari `<w:t>` run.
Ekstraksi teks standar tidak menyentuh keduanya.

**Tapi rekruter membuka berkas asli**, di mana hyperlink tetap berfungsi. Jadi membuang hyperlink
merugikan tanpa alasan.

**Implementasi — aturan penulisan tautan yang benar:**
- Render **teks polos yang terbaca**, dan pasang hyperlink **pada teks polos itu sendiri**:
  `Portofolio — budi.example.com/portfolio` (seluruh string ber-href ke URL penuh).
- Buang `https://` dan `www.` **hanya dari tampilan**; href tetap URL penuh.
- URL berparameter (`?utm=...`) dipangkas otomatis.
- Maksimal 2 tautan per item.
- **Dilarang pemendek tautan (bit.ly dsb)** — lihat koreksi 3 untuk alasannya.

### 3.4 KOREKSI 3 — Pemendek tautan: larangan tetap, alasannya ganti

**v1 berkata:** dilarang karena "sering ditandai spam".

**Yang benar:** nol dokumentasi vendor ATS menyebut pemendek tautan. Untuk email pun buktinya
bertentangan — tim anti-spam Microsoft Exchange Online menerbitkan artikel berjudul harfiah
*"No, using bit.ly does not get you blocked."*

**Alasan yang benar, dan cukup kuat berdiri sendiri:**
1. `bit.ly/3xK9pQ` membawa **nol kata kunci**. `github.com/nama` membawa nama + platform —
   dan pencocokan kata kunci-lah yang menentukan visibilitas (koreksi 6).
2. Opak bagi manusia — rekruter tidak tahu tujuannya sebelum diklik.
3. Titik kegagalan tunggal — layanan mati atau akun kedaluwarsa, portofolio ikut hilang.

**Implementasi:** pesan validasi berbunyi *"Pemendek tautan tidak membawa kata kunci apa pun dan
tidak terbaca manusia. Pakai URL aslinya."* **Jangan** menulis "diblokir ATS".

### 3.5 KOREKSI 4 — Hapus penalti panjang halaman untuk SEMUA pola

**v1 berkata:** longgarkan penalti untuk kedokteran & akademik; bidang lain 1–2 halaman.

**Yang benar:** tidak ada dokumentasi vendor mana pun yang menyebut batas halaman — parser bekerja
atas teks hasil konversi, di mana "halaman" sudah tidak ada. Dan satu-satunya eksperimen terkontrol
yang ada (482 profesional rekrutmen, 7.712 CV, tiap CV 1 halaman dipasangkan dengan versi 2 halaman
berisi kredensial **identik**) menemukan CV 2 halaman **2,3× lebih disukai**, skor 8,6 vs 7,1,
waktu baca 4 menit vs 2,4 menit.

*Catatan kejujuran: studi itu dari penjual jasa penulisan CV, jadi ada konflik kepentingan.
Tapi desainnya terkontrol dan sampelnya besar — jauh di atas kualitas bukti lain di ruang ini.*

**Implementasi:** **hapus penalti panjang halaman sepenuhnya.** Ganti dengan indikator netral:
*"CV Anda ±2 halaman — lazim untuk tingkat menengah ke atas."* Untuk pola Publikasi & Kredit,
tidak ada indikator panjang sama sekali.

### 3.6 KOREKSI 5 — Header/footer: masalah DOCX, bukan PDF

**Yang benar — dari uji langsung:**

| Lokasi konten | python-docx | LibreOffice → txt | pdftotext |
|---|---|---|---|
| Header/footer Word asli (`sec.header`/`sec.footer`) | **HILANG TOTAL** | **HILANG TOTAL** | — |
| Teks di posisi atas/bawah halaman PDF | — | — | **terbaca normal** |

**Implementasi:** aturan eksplisit di eksportir Word — **jangan pernah menaruh kontak, tautan, atau
konten apa pun di header/footer dokumen Word.** Semua konten harus di body. Di PDF tidak ada
konsep header/footer yang tersisa; aman. Jangan menulis nasihat generik "jangan pakai header/footer"
karena mencampur dua hal berbeda.

### 3.7 KOREKSI 6 — Ganti nama "Skor ATS"

**v1 berkata:** Skor ATS 5 dimensi → jadi 6 dimensi.

**Yang benar:** tidak ada "skor ATS" universal yang bisa direplikasi. Filter dikonfigurasi
**tiap employer** (riset HBS *Hidden Workers*: 48% menyaring gap kerja >6 bulan, sisanya
gelar/kata kunci/lama pengalaman). Hanya Taleo yang memberi peringkat otomatis, dan rekruter
yang diwawancarai tidak mempercayainya. Bandingkan: Jobscan menamai produknya **"match rate"**,
bukan "ATS score".

**Implementasi — dua angka yang jujur dan bisa dipertahankan:**

| Nama baru | Yang diukur | Kenapa bisa dipertahankan |
|---|---|---|
| **Kecocokan Lowongan** | overlap kata kunci CV ↔ deskripsi lowongan yang ditempel | persis yang dilakukan boolean full-text search |
| **Kekuatan & Keterbacaan** | kelengkapan struktur, ekstraktabilitas teks, kekuatan bukti | bisa diuji langsung, tidak mengklaim memprediksi keputusan ATS |

Dimensi bukti karya masuk ke angka kedua. **Rename di seluruh UI, dokumentasi, dan copy beranda.**
Jangan pernah menulis atau menyiratkan bahwa angka ini memprediksi keputusan ATS.

### 3.8 KOREKSI 7 — TEMUAN PALING PENTING: bagian "PORTOFOLIO" tidak punya rumah di ATS

Perhatikan enum `SectionType` di §3.2 sekali lagi. **`PROJECTS` tidak ada. `PORTFOLIO` tidak ada.**

RChilli — parser lain dengan dokumentasi terbuka — **punya** field projects, tapi syaratnya
sangat informatif: projects harus *"mentioned under or within the Experience section"*, tidak akan
ditangkap kalau berdiri sendiri. Parser mencari label eksplisit `Project Name:`, `Role in Project:`,
`Team Size:`, dan tanggal proyek harus berada dalam rentang masa kerja terkait. Output-nya array
yang **bersarang di dalam blok experience**.

Dua vendor, dua desain, satu kesimpulan: **proyek diperlakukan sebagai anak dari pengalaman kerja,
bukan bagian setara.**

**Implementasi — tiga perubahan wajib:**

1. **Setiap item portofolio berbentuk seperti entri pengalaman kerja**: judul · peran · konteks ·
   rentang tanggal · deskripsi. Jadikan `konteks` dan rentang tanggal **wajib**, bukan opsional.
2. **Sakelar `gabungKePengalaman`** — bila aktif, item dirender sebagai sub-entri di bawah judul
   `PENGALAMAN KERJA` (bagian yang pasti dikenali) alih-alih bagian terpisah.
   Teks UI: *"Sebagian pembaca otomatis hanya mengenali proyek jika menempel pada pengalaman kerja.
   Aktifkan ini kalau proyek Anda punya pemberi kerja."*
3. **Proyek tanpa pemberi kerja** — isi `konteks` dengan "Proyek Mandiri" / "Freelance" / nama
   komunitas atau kampus. Ini bukan trik; ini bentuk yang memang diharapkan parser.

---

## 4. Ringkasan fitur yang dibangun

1. **Pemilih Pola** — pengguna mengetik jurusan/profesi, sistem memetakan ke 1 dari 5 pola lewat
   kamus (§7). Bisa diganti manual. Bisa di-override per item.
2. **Sumbu Tujuan** — "CV ini untuk apa?" (melamar kerja / sertifikasi-lisensi / beasiswa-akademik /
   tender-proyek). Mengubah pola default dan perilaku form.
3. **Bagian CV ke-12: PORTOFOLIO** — opsional, bisa dimatikan, bisa digabung ke Pengalaman Kerja.
4. **Lima skema pola** (§6) — field umum + 6–7 field inti per pola.
5. **Slot fleksibel `detailTambahan`** — pengganti 210 definisi field khusus v1.
6. **Kamus bidang** (§7) — ≥21 entri jurusan → pola + saran field + kata kunci + kredensial.
7. **Blok Kredensial/Lisensi 4 kategori** (§8) — dengan dukungan masa berlaku "seumur hidup".
8. **Blok agregat** untuk pola Praktik & Pengajaran — progress bar terhadap ambang resmi.
9. **Skor "Kekuatan Bukti"** dengan model P×Q×R (§9).
10. **Mode Redaksi (NDA)** — sembunyikan nama klien/angka sensitif.
11. **Validator bahasa orang-pertama** untuk pola Proyek Teknis.
12. **Field `verifikator`** — warga kelas satu, bukan catatan pinggir.

---

## 5. Model data

Tambahkan ke skema CV (tetap kompatibel mundur — lihat §13):

```ts
// ── Level CV ────────────────────────────────────────────────────────────
type PolaSlug =
  | 'karya-visual'      // Karya & Desain
  | 'proyek-teknis'     // Proyek Teknis
  | 'praktik-jam'       // Praktik & Pengajaran
  | 'karya-terkredit'   // Publikasi & Kredit
  | 'dampak-program'    // Program & Dampak
  | 'umum'              // fallback wajib

type TujuanCV =
  | 'melamar-kerja'
  | 'sertifikasi-lisensi'
  | 'beasiswa-akademik'
  | 'tender-proyek'

type ProfilPortofolio = {
  pola: PolaSlug
  tujuan: TujuanCV

  // ⚠️ METADATA — TIDAK menentukan bentuk form. Hanya untuk saran, pencarian,
  // dan bobot kata kunci. Empat sumbu terpisah; JANGAN dilebur jadi satu field.
  // (Riset: tidak ada satu pun taksonomi resmi Indonesia yang merupakan
  //  taksonomi "bidang pekerjaan". KKNI = senioritas, rumpun ilmu = disiplin,
  //  KBLI = industri, KBJI = level jabatan.)
  jurusan?: string          // teks bebas, dicocokkan ke kamus §7
  bidangKamus?: string      // slug entri kamus yang cocok, mis. 'sipil-konstruksi'
  rumpunIlmu?: string       // 6 rumpun UU 12/2012 — turunan dari jurusan
  industriKBLI?: string     // kategori KBLI — untuk bobot kata kunci
  jenjangKKNI?: 1|2|3|4|5|6|7|8|9   // ambang skor & verb bank
}

type BagianPortofolio = {
  aktif: boolean
  judulPilihan?: string          // hanya dari whitelist pola
  gabungKePengalaman: boolean    // ⭐ §3.8 — render sebagai sub-entri
                                 // di bawah PENGALAMAN KERJA
  item: ItemPortofolio[]
  maksItem: number
  modeRedaksi: boolean
}

// ── Item ────────────────────────────────────────────────────────────────
type ItemPortofolio = {
  id: string
  polaOverride?: PolaSlug        // item ini beda pola dari CV-nya

  // FIELD UMUM — dipakai SEMUA pola.
  // Bentuknya sengaja meniru entri pengalaman kerja (§3.8).
  judul: string
  peran: string                  // peran SPESIFIK saya, bukan peran tim
  konteks: string                // ⭐ WAJIB — klien / institusi / kampus /
                                 //    "Proyek Mandiri" / "Freelance"
  lokasi?: string
  mulai: string                  // YYYY-MM
  selesai: string | 'sekarang'
  ringkasan: string              // 1 kalimat, maks 160 karakter
  poin: string[]                 // 2–4 bullet, tiap bullet <= 200 karakter
  tautan: { label: string; url: string }[]   // maks 2
  kataKunci: string[]

  // FIELD INTI POLA — 6–7 field, ditentukan skema pola (§6)
  inti: Record<string, string | number | string[]>

  // ⭐ SLOT FLEKSIBEL — pengganti 21 set field khusus v1
  detailTambahan: DetailTambahan[]   // maks 6; hanya 4 prioritas tertinggi
                                     // dirender di baris "Detail"

  // ⭐ VERIFIKATOR — field paling menentukan di pola 2/3/4, tidak ada di v1
  verifikator?: { nama: string; jabatan: string; hubungan: string }

  refleksi?: string              // opsional, menambah skor (§9)

  arsip?: Record<string, unknown>   // data dari pola sebelumnya, bisa dipulihkan
}

type DetailTambahan = {
  label: string      // dari kamus (autocomplete) ATAU diketik bebas
  nilai: string
  satuan?: string    // "m²", "juta rupiah", "kasus", "juz", "jam/pekan", "SKP"
  prioritas: number  // 1 = paling penting
}
```

### Dua berkas registry — pemisahan yang wajib dipatuhi

**`lib/portfolio/pola-schemas.ts`** — menentukan **bentuk form**. Kode harus tahu isinya.
Statis, 5 objek, jarang berubah.

```ts
type PolaSchema = {
  slug: PolaSlug
  nama: string                       // "Karya & Desain"
  kalimatPenjelas: string            // ditampilkan di dropdown
  headingCV: string                  // huruf kapital
  headingAlternatif: string[]        // whitelist
  labelItem: string                  // "Karya" | "Proyek" | "Kegiatan" | "Program"
  rentangItemIdeal: [number, number | null]   // null = tanpa batas atas
  fieldInti: FieldDef[]              // 6–7 saja
  wajib: string[]                    // kunci field syarat item kuat
  butuhVerifikator: boolean
  butuhKredensial: boolean           // true untuk 'praktik-jam'
  blokAgregat?: AgregatDef           // hanya 'praktik-jam'
  aturanBahasa?: 'orang-pertama-wajib'
  bobotBuktiKarya: number            // §9.3
  aturanSkor: SkorRule[]
  catatanUI: string[]
  peringatan: string[]
}

type FieldDef = {
  key: string
  label: string
  tipe: 'teks' | 'angka' | 'pilihan' | 'multi' | 'tanggal'
      | 'teks_panjang' | 'url' | 'angka_satuan' | 'delta'
  opsi?: string[]
  satuan?: string
  placeholder: string                // contoh NYATA, bukan "isi di sini"
  bantuan: string                    // kalimat "kenapa perekrut mencarinya"
  wajib?: boolean
  prioritas?: number
}
```

**`lib/portfolio/kamus-bidang.ts`** — menentukan **isi saran**. Kode TIDAK perlu tahu isinya.
Data murni, tumbuh tanpa menyentuh komponen.

```ts
type EntriKamus = {
  slug: string                    // 'sipil-konstruksi'
  nama: string                    // 'Teknik Sipil & Konstruksi'
  polaDisarankan: PolaSlug
  polaAlternatif?: PolaSlug[]
  jurusanTermasuk: string[]       // untuk pencarian
  rumpunIlmu: string
  saranDetailTambahan: { label: string; satuan?: string; prioritas: number }[]
  saranIsiFieldInti?: Record<string, string[]>   // opsi tambahan untuk field multi
  kataKunciATS: string[]
  kredensial: KredensialDef[]
  contohItem: Partial<ItemPortofolio>
  peringatanTambahan?: string[]
}
```

**ATURAN KERAS:** menambah profesi baru = menambah **satu entri kamus**. Tidak boleh ada
komponen yang berubah. Tidak boleh ada `if (pola === 'x')` atau `if (bidang === 'y')`
yang tersebar di komponen — semua percabangan dibaca dari `pola-schemas.ts`.

---

## 6. LIMA SKEMA POLA (inti fitur — implementasikan seluruhnya)

### 6.1 `karya-visual` — KARYA & DESAIN

**Kalimat penjelas di dropdown:** *"Bukti saya adalah karyanya sendiri — bisa dilihat, dibuka, atau diunduh."*

- **Judul CV:** `PORTOFOLIO KARYA` — alt: `STUDI KASUS`, `PROYEK & PORTOFOLIO`
- **Label item:** "Karya" · **Rentang ideal:** `[3, 5]` (arsitektur `[5, 7]`)
- **Bobot Bukti Karya:** 20% · **Verifikator:** opsional · **Kredensial:** opsional

**Field inti (7):**

| key | label | tipe | placeholder (contoh nyata) | bantuan |
|---|---|---|---|---|
| `masalah` | Masalah yang dipecahkan | teks_panjang | "Pengguna gagal menyelesaikan checkout karena form 4 langkah tanpa indikator progres" | Ini pembeda studi kasus dari galeri. Perekrut menilai cara berpikir, bukan tumpukan visual. |
| `prosesKeputusan` | Proses & keputusan | multi (2–5 pasangan masalah→solusi) | "Riset: 8 wawancara → temuan drop di langkah 3 → satukan jadi 2 langkah" | Struktur baku studi kasus: 2–5 pasangan masalah–solusi. |
| `bentukKarya` | Bentuk karya | multi | denah · potongan · tampak · detail · aksonometri · site plan · render 3D · maket · sketsa tangan · wireframe · prototipe · design system · user flow · repo · demo · logo · brand guideline · key visual · dieline kemasan · storyboard · foto · video | Untuk arsitektur, minimal satu **gambar teknis** (denah/potongan/detail) — bukan hanya render. |
| `perkakas` | Perkakas | multi | AutoCAD, SketchUp, Revit, Rhino, Lumion, Figma, Adobe XD, Illustrator, After Effects, Blender, React, Next.js, Python | Menggantikan `tools`/`perangkatLunak`/`toolsEDA` di v1. |
| `hasil` | Hasil | teks berangka | "Konversi naik 2,1% → 3,4% dalam 6 minggu" | Satu angka mengubah galeri jadi studi kasus. |
| `statusKarya` | Status | pilihan | terbangun · dalam konstruksi · dirilis ke publik · internal · sayembara · tugas studio/kuliah · latihan pribadi | Perekrut membedakan karya nyata dari latihan. Beri label jujur. |
| `tautanKarya` | Tautan karya | url (maks 2) | `behance.net/nama/proyek` · `github.com/nama/repo` | Wajib minimal satu yang benar-benar bisa dibuka. |

**Syarat item kuat (`wajib`):** `masalah` + minimal 2 langkah `prosesKeputusan` + `hasil` +
minimal 1 tautan valid.

**Catatan tetap di UI (`catatanUI`) — pakai angka ini, jangan dikarang:**

> **Arsitektur.** Booklet lengkap 30–35 halaman berisi 7–10 proyek. Tapi yang dikirim bersama CV
> cukup **3–5 halaman** — booklet penuh menyusul atau dibawa saat wawancara. A4/US Letter paling
> praktis (A3 lebih profesional tapi berat). Jaga ukuran berkas **5–10 MB** untuk email (batas aman
> 15 MB); portal karier firma umumnya membatasi 15–25 MB. Tampilkan proses: sketsa → diagram →
> hasil akhir, bukan render saja — firma menilai kemampuan menuntaskan desain sampai skala konstruksi.
> Letakkan pengalaman kantor sebelum tugas kuliah.

> **Desain & UI/UX.** Junior 2–3 studi kasus, senior 4–5. Lebih dari itu tidak dibaca. Taruh yang
> terbaik paling depan. Satu proyek = satu masalah inti. Perekrut menilai cara berpikir, bukan
> tumpukan visual.

> **Software.** 3–5 repo terdokumentasi baik mengalahkan puluhan repo setengah jadi. README harus
> terbaca **non-engineer** — perekrutan teknis jarang dinilai engineer sendirian. Muat: masalah,
> pengguna sasaran, keputusan teknis kunci, screenshot/demo, keterbatasan yang diketahui, pelajaran.

> **Semua bidang visual.** Berkas portofolio dikirim terpisah; di CV cukup tautan + ringkasan.

**Peringatan (`peringatan`):**
- Karya kantor/klien perlu izin tayang dan wajib menyebut peran pribadi.
- Karya spekulatif/latihan wajib diberi label agar tidak menyesatkan.
- Repo privat atau kode milik perusahaan tidak boleh ditempel.

---

### 6.2 `proyek-teknis` — PROYEK TEKNIS

**Kalimat penjelas:** *"Bukti saya adalah proyek dengan spesifikasi, standar, dan hasil terukur."*

- **Judul CV:** `PORTOFOLIO PROYEK` — alt: `PENGALAMAN PROYEK`, `PROYEK REKAYASA`, `PORTOFOLIO PROYEK TEKNIS`
- **Label item:** "Proyek" · **Rentang ideal:** `[3, 6]` (maks keras 10)
- **Bobot Bukti Karya:** 15% · **Verifikator:** ⭐ **wajib** · **Aturan bahasa:** `orang-pertama-wajib`

**Field inti (7):**

| key | label | tipe | placeholder | bantuan |
|---|---|---|---|---|
| `jenisProyek` | Jenis proyek | teks + saran kamus | "Gedung perkantoran 12 lantai" · "Power supply 3 A untuk instrumentasi lapangan" | — |
| `skalaProyek` | Skala | angka_satuan (satuan bebas) | "8.400 m²" · "bentang 45 m" · "2×15 MW" · "Rp 10–25 M" | Skala adalah proksi kompleksitas. Boleh rentang jika angka pastinya rahasia. |
| `tahapKeterlibatan` | Tahap keterlibatan | multi | studi kelayakan · DED/desain · simulasi · tender · fabrikasi · pelaksanaan · bring-up · commissioning · pengujian · pengawasan · serah terima | Perekrut ingin tahu sejauh mana Anda ikut, bukan hanya proyek apa. |
| `standarKode` | Standar & kode | multi | SNI 2847 · SNI 1726 · SNI 1727 · ACI · AISC · Bina Marga · IEC · IEEE · PUIL · ISO 9001 · ISO 45001 · ISO 14001 · ASME · API · SMK3 PP 50/2012 · AMDAL · PROPER | Menyebut standar menunjukkan Anda bekerja dalam kerangka, bukan improvisasi. |
| `perkakas` | Perkakas | multi | AutoCAD · SAP2000 · ETABS · Revit/BIM · Civil 3D · Tekla · Primavera · MS Project · HEC-RAS · Altium · KiCad · Eagle · Proteus · LTspice · MATLAB/Simulink · SolidWorks · CATIA · Inventor · ANSYS · Minitab · HYSYS · Aspen Plus · Petrel · Surpac · Minescape · ArcGIS · PI System · DCS/SCADA | Menggantikan 6 nama field berbeda di v1. |
| `hasilTerukur` | Hasil terukur | delta **wajib** | "Efisiensi 92% pada beban 3 A; ripple 40 mV" · "Selesai 3 minggu lebih cepat, efisiensi biaya 4,2%" · "Downtime turun 240 jam/tahun" · "Scrap 3,4% → 1,1%" | **Field pembeda pola ini.** Menggantikan `hasilUkur`/`hasilJadwalBiaya`/`dampakTerukur`/`capaian` — empat nama, satu konsep. Perekrut ingin bukti Anda **mengukur**, bukan sekadar merakit. |
| `verifikator` | Bisa diverifikasi oleh | teks (nama · jabatan · hubungan) | "Ir. Andi Wijaya · Site Manager · atasan langsung" | Field yang paling sering diabaikan tapi paling menentukan. Tidak dicetak di CV — tapi menuliskannya membuat Anda menulis lebih hati-hati. |

**Syarat item kuat:** `hasilTerukur` berangka + `standarKode` + `tahapKeterlibatan` mencapai
pelaksanaan/pengujian + `verifikator` terisi.

**Aturan bahasa orang-pertama — implementasikan sebagai validator, bukan tips.**
Konvensi ini muncul independen di NCEES (AS) dan Engineers Australia — bukan opini:

- **Wajib:** "saya merancang", "saya menghitung", "saya menguji", "saya memilih".
- **Deteksi & peringatkan:** "kami", "tim kami", "memimpin", "mengelola" **tanpa objek konkret**.
- Pesan: *"Tulis apa yang Anda kerjakan sendiri. 'Kami membangun sistem' tidak memberi tahu perekrut
  bagian mana yang Anda kerjakan."*

**Catatan UI:**
> Untuk keperluan sertifikasi (STRI/SKK/IPP), badan penilai memakai tiga faktor: **banyaknya
> pengalaman**, **peranan Anda**, dan **tingkat kesulitan**. Isi ketiganya — bukan hanya nama proyek.

**Peringatan:**
- Nilai kontrak, skematik, BOM, nomor part, nama vendor, dan data produksi/cadangan sering terikat
  NDA. **Aktifkan Mode Redaksi** dan pakai rentang ("Rp 10–25 M") atau persentase relatif.
- Gambar kerja milik pemberi kerja tidak boleh diunggah.

---

### 6.3 `praktik-jam` — PRAKTIK & PENGAJARAN

**Kalimat penjelas:** *"Bukti saya adalah jam praktik, jumlah orang yang saya layani, dan lisensi."*

- **Judul CV:** `PENGALAMAN PRAKTIK & PENGAJARAN` — alt: `PENGALAMAN KLINIS & PROSEDUR`,
  `PORTOFOLIO MENGAJAR`, `PENGALAMAN DAKWAH & PENGAJARAN`, `PORTOFOLIO KEILMUAN & PENGABDIAN`
- **Label item:** "Kegiatan" · **Rentang ideal:** `[3, null]` — tanpa batas atas
- **Bobot Bukti Karya:** 12% · **Kredensial:** ⭐ **wajib** (kosong = penalti terpisah)

**Karakter pola ini:** kualitas tiap item hampir tidak dinilai. **Yang dinilai agregatnya.**

**Field inti (7):**

| key | label | tipe | placeholder | bantuan |
|---|---|---|---|---|
| `jenisKegiatan` | Jenis kegiatan | teks + saran kamus | rotasi klinis · jaga IGD · praktik mandiri · mengajar · pembinaan tahfidz · penyuluhan · asesmen · pendampingan komunitas · operasional outlet | — |
| `institusi` | Institusi / fasilitas | teks **wajib** | "RSUD Taman Husada Bontang (tipe B)" · "SMPN 3 Bontang" · "Pesantren Al-Hikmah" | Institusi membuat pengalaman bisa diverifikasi. |
| `volume` | Volume | angka_satuan **wajib** | "±120 pasien/bulan" · "34 siswa/kelas, 5 kelas" · "80 santri" · "6 jam/pekan" | Angka membuat pengabdian jadi terukur. Ini field pembeda pola ini. |
| `periodeAktif` | Periode & intensitas | teks | "Jan 2024 – kini, 3 hari/pekan" | Intensitas sama pentingnya dengan durasi. |
| `luaran` | Hasil / luaran | teks berangka | "Angka infeksi luka operasi turun 4,1% → 1,8%" · "Rata-rata nilai ujian naik 68 → 79" · "Modul ajar 12 pertemuan buatan sendiri" | — |
| `kredensialTerkait` | Kredensial terkait | ref ke blok Kredensial (§8) | STR · SIP · Sertifikat Pendidik | **Gerbang wajib untuk pola ini.** Perekrut mengecek lisensi sebelum mengecek pengalaman. |
| `penyelia` | Penyelia / atasan | teks | "dr. Sari Handayani, Sp.PD · DPJP" | Verifikator. |

**Syarat item kuat:** `volume` berangka + `institusi` + blok Kredensial terisi.

**⭐ Blok agregat (`blokAgregat`) — fitur yang tidak dimiliki CV builder mana pun.**

Tampilkan ringkasan di atas daftar item, meniru cara regulator menilai:
`total per kategori` · `ambang minimum` · `persentase per ranah` · `periode siklus`.

Ambang resmi yang sudah ada — pakai ini, jangan dikarang:

| Profesi | Ambang | Ranah | Dasar |
|---|---|---|---|
| Dokter & dokter spesialis | **250 SKP** / 5 tahun | Pembelajaran ≥45%, Pelayanan ≥35%, Pengabdian ≥5% | KMK HK.01.07/1561/2024 |
| Dokter gigi | **100 SKP** / 5 tahun | idem | idem |
| Perawat, bidan, fisioterapis, mayoritas nakes lain | **50 SKP** / 5 tahun | idem | idem |
| Guru (portofolio PPG) | 10 poin → skala 100 | penelitian & publikasi 4 · karya inovasi 4 · refleksi diri 3 · diklat/seminar 3 · prestasi 1,5 · pengabdian 1,5 | rubrik UKMPPG |
| Tenaga konstruksi | PKB untuk perpanjangan SKK (5 tahun) | — | LSP bidang konstruksi |

**Aturan anti-double-counting (dari rubrik UKMPPG):** satu bukti hanya boleh dipakai untuk satu
komponen. Terapkan validasi ini.

> ⚠️ **Catatan penting yang harus benar:** sejak UU 17/2023, portofolio SKP **bukan lagi untuk
> memperpanjang STR** (STR Definitif kini seumur hidup) — melainkan untuk **memperpanjang SIP**.
> Jangan menulis skema lama "5 ranah untuk perpanjangan STR"; itu sudah usang.

**Peringatan (tampilkan mencolok, tidak bisa ditutup):**
> **Dilarang menulis identitas pasien, nomor rekam medis, foto luka atau pasien, atau data apa pun
> yang bisa mengidentifikasi orang. Tulis jumlah dan jenis kasus, bukan kasusnya.**
> Hasil asesmen psikologis dan data responden juga bersifat rahasia.

**Catatan UI:**
> CV bidang ini wajar lebih dari 2 halaman — daftar pelatihan, rotasi, dan publikasi tidak dipangkas.
> Sebutkan lembaga dan periode agar bisa diverifikasi; hindari klaim otoritas keilmuan tanpa
> sanad atau institusi.

---

### 6.4 `karya-terkredit` — PUBLIKASI & KREDIT

**Kalimat penjelas:** *"Bukti saya adalah daftar karya yang divalidasi pihak lain — jurnal, penerbit, panggung."*

- **Judul CV:** `PUBLIKASI & PENELITIAN` — alt: `KARYA ILMIAH`, `PENELITIAN & HIBAH`,
  `PORTOFOLIO PERTUNJUKAN & KARYA`, `KARYA TERBIT`
- **Label item:** "Karya" · **Rentang ideal:** `[1, null]` — ⭐ **satu-satunya pola di mana
  makin banyak makin baik**
- **Bobot Bukti Karya:** 20% · **Verifikator:** tidak perlu (venue-nya yang memverifikasi)

**Field inti (6):**

| key | label | tipe | placeholder |
|---|---|---|---|
| `tipeLuaran` | Tipe luaran | pilihan | artikel jurnal · prosiding · bab buku · buku · paten/HKI · manuskrip dalam review · pertunjukan · rekaman · pameran · film/produksi |
| `sitasiLengkap` | Sitasi / kredit lengkap | teks_panjang | Gaya APA/IEEE dengan **nama sendiri dicetak tebal**. Untuk seni: "Produksi · Peran · Venue · Sutradara · Tahun" |
| `venue` | Venue / penerbit / panggung | teks | "Jurnal Teknik Industri, Vol 26(1)" · "Teater Salihara, Jakarta" |
| `peranSaya` | Peran | pilihan | penulis pertama · korespondensi · anggota · pemain · komposer · koreografer · sutradara · kurator |
| `indeksasiTier` | Indeksasi / tingkat | pilihan | Scopus Q1 · Q2 · Q3 · Q4 · SINTA 1–6 · WoS · Garuda · tidak terindeks · festival internasional · nasional · lokal |
| `pengenalPersisten` | DOI / ISBN / tautan rekaman | url | `doi.org/10.xxxx/yyyy` · `youtube.com/watch?v=...` |

**Syarat item kuat:** `sitasiLengkap` + `venue` + `pengenalPersisten`.

**Aturan format:** urut menurun berdasarkan tahun, **dikelompokkan menurut `tipeLuaran`**.
**Tidak ada indikator panjang halaman sama sekali** untuk pola ini.

**Catatan UI:**
> Cantumkan profil peneliti Anda sekali saja di bagian identitas: ORCID, Google Scholar, SINTA,
> Scopus ID. Perekrut akademik hampir selalu membukanya.

**Kredensial khas:** NIDN/NIDK, jabatan fungsional (Asisten Ahli → Lektor → Lektor Kepala →
Guru Besar), Serdos, pengalaman reviewer jurnal, grade ABRSM/Trinity, UKW Dewan Pers.

---

### 6.5 `dampak-program` — PROGRAM & DAMPAK

**Kalimat penjelas:** *"Karya saya milik perusahaan. Yang bisa saya bawa adalah angka hasilnya."*

- **Judul CV:** `PORTOFOLIO PROGRAM & DAMPAK` — alt: `PROYEK & ANALISIS`, `PENGALAMAN PROGRAM`,
  `PORTOFOLIO PENANGANAN PERKARA`, `PORTOFOLIO KAMPANYE`
- **Label item:** "Program" · **Rentang ideal:** `[3, 6]`
- **Bobot Bukti Karya:** 12% (hindari double-counting dengan bagian Pengalaman Kerja)

**Field inti (6):**

| key | label | tipe | placeholder | bantuan |
|---|---|---|---|---|
| `lingkupProgram` | Lingkup | teks + saran kamus | penyusunan laporan keuangan · audit · perpajakan · analisis kredit · valuasi · kampanye digital · siaran pers · rekrutmen · pelatihan · manajemen kinerja · pengadaan · pergudangan · ekspor-impor · drafting kontrak · legal opinion · due diligence · advokasi kebijakan · pemberdayaan | — |
| `skalaDikelola` | Skala yang dikelola | teks | "Portofolio kredit Rp 42 M" · "Tim 8 orang" · "Populasi 1.200 karyawan" · "34 vendor" · "Belanja iklan Rp 180 juta/bulan" | Skala adalah proksi tanggung jawab. |
| `metrikDampak` | Metrik dampak | **terstruktur wajib**: metrik + sebelum + sesudah + rentang waktu | metrik "Time-to-hire" · sebelum "41 hari" · sesudah "24 hari" · waktu "6 bulan" | Perekrut membaca "41 → 24 hari" berbeda dari "lebih cepat". Isi keempat komponennya. |
| `metodeStandar` | Metode & standar | multi | Lean · Six Sigma DMAIC · Kaizen · 5S · FMEA · PSAK · IFRS · SAK EMKM · SPAP · COSO · Perpres 16/2018 · Incoterms · ISO 28000 · UU Ketenagakerjaan · PP 35/2021 | — |
| `sistemPerkakas` | Sistem & perkakas | multi | Excel lanjutan · Accurate · SAP · Oracle ERP · MYOB · Power BI · Tableau · e-Faktur · Coretax · SPSE/LKPP · SAP MM · Odoo · WMS · Talenta · Gadjian · SuccessFactors · Google Analytics · Meta Business Suite · Ahrefs/SEMrush · Looker Studio · SPSS · NVivo · Kobo Toolbox | — |
| `penerimaManfaat` | Penerima manfaat | teks | "Tim penjualan 40 orang" · "1.200 rumah tangga penerima program" · "Divisi produksi" | Hasil tanpa penerima manfaat terdengar abstrak. |

**Syarat item kuat:** `metrikDampak` lengkap (keempat komponen) + `skalaDikelola` + `metodeStandar`.

**Catatan UI — struktur STAR:**
> `Situation` sudah diserap ke header (perusahaan, jabatan, periode) — **jangan ditulis ulang.**
> Isi `Task` (tanggung jawab inti), `Action` (kata kerja spesifik: bagaimana), `Result` (angka +
> penerima manfaat). **Jangan menulis STAR berurutan** — pola yang lebih baik: Task+Result, lalu
> Action+Action+Result.

**Peringatan:**
- **Hukum (wajib):** hormati kerahasiaan klien — nama pihak dan nomor perkara diganti deskriptor
  generik ("perusahaan energi nasional", "sengketa ketenagakerjaan di PN Jakarta Pusat").
  Contoh tulisan yang ditautkan wajib sudah dianonimkan.
- **Keuangan:** angka perusahaan sering rahasia — sediakan opsi rentang atau persentase relatif.
- **Sosial/psikologi:** data responden dan hasil asesmen bersifat rahasia.

---

### 6.6 `umum` — UMUM / BELUM MENENTUKAN (fallback wajib ada)

Untuk pengguna lintas bidang, fresh graduate, pindah karier, atau profesi yang belum ada di kamus.

- **Judul CV:** `PROYEK & PORTOFOLIO`
- **Label item:** "Karya" · **Rentang ideal:** `[2, 5]` · **Bobot:** 12%
- **Field inti (4):** `jenisKarya` (teks bebas) · `hasil` (teks berangka) ·
  `alatMetode` (multi) · `tautanKarya` (url, maks 2)
- Sediakan tombol **"Bidang saya tidak ada di daftar"** → pakai `umum` + formulir saran bidang
  (disimpan untuk pengembangan kamus berikutnya).

---

## 7. KAMUS BIDANG — konversi katalog 21 bidang v1

Ini yang menggantikan §6 di v1. Semua isinya **data**, bukan skema. Kolom "Detail tambahan"
mengisi `saranDetailTambahan` — inilah rumah bagi field khusus v1 yang tidak masuk field inti.

| slug | nama | Pola utama | Pola alt | Jurusan termasuk (untuk pencarian) | Detail tambahan (saran autocomplete) |
|---|---|---|---|---|---|
| `software-ti` | Teknologi Informasi & Perangkat Lunak | `karya-visual` | `proyek-teknis` (infra/jaringan/SRE) | Teknik Informatika, Sistem Informasi, Ilmu Komputer, RPL, Teknologi Rekayasa Perangkat Lunak, PTIK, Teknik Komputer & Jaringan | Skala pengguna (pengguna/bulan) · Transaksi/bulan · Ukuran tim · Kontribusi pribadi · Uptime (%) |
| `hardware-elektro` | Hardware, Elektro & Embedded | `proyek-teknis` | `karya-visual` (prototipe/maker) | Teknik Elektro, Elektronika, Telekomunikasi, Mekatronika, Instrumentasi, Teknik Komputer, Robotika | Komponen inti (MCU/sensor/driver) · Lapisan PCB · Jumlah komponen BOM · Biaya per unit · Konsumsi arus |
| `sipil-konstruksi` | Teknik Sipil & Konstruksi | `proyek-teknis` | — | Teknik Sipil, Struktur, Transportasi, Geoteknik, Sumber Daya Air/Pengairan, Manajemen Konstruksi, MEP, Quantity Surveying | Sistem struktur · Nilai kontrak (rentang, miliar) · Luas (m²) · Bentang (m) · Jumlah lantai · Jam kerja aman |
| `arsitektur-perencanaan` | Arsitektur, Interior & Perencanaan | `karya-visual` | `proyek-teknis` (mode lisensi STRA/SKK) | Arsitektur, Desain Interior, Arsitektur Lanskap, Perencanaan Wilayah & Kota, PWK | Tipologi · Luas bangunan (m²) · Tahap proyek · Penghargaan/sayembara · Tautan booklet |
| `desain-kreatif` | Desain Grafis, UI/UX & Industri Kreatif | `karya-visual` | `dampak-program` (kampanye) | DKV, Desain Produk, Animasi, Multimedia, Fotografi, Film & TV, Fashion, Kriya | Tipe proyek · Proses riset (wawancara/survei/usability test/A/B test/card sorting) · Artefak · Ukuran tim · Durasi · Jangkauan (tayangan) |
| `kedokteran-kesehatan` | Kedokteran & Tenaga Kesehatan | `praktik-jam` | `karya-terkredit` (blok publikasi terpisah) | Kedokteran, Kedokteran Gigi, Keperawatan, Kebidanan, Farmasi, Gizi, Fisioterapi, Analis Kesehatan, ATLM, Kesehatan Masyarakat, Radiologi, Anestesi, Rekam Medis | Departemen · Log prosedur (jenis + jumlah) · Kompetensi (SKDI) · Pelatihan (ACLS/ATLS/BTCLS/PPGD/APN/Hiperkes) · SKP terkumpul |
| `keagamaan` | Keagamaan, Dakwah & Kerohanian | `praktik-jam` | `karya-terkredit` (karya tulis) | PAI, Ilmu Al-Qur'an & Tafsir, Ilmu Hadis, Hukum Keluarga Islam, Ahwal Syakhshiyyah, Perbandingan Mazhab, Ekonomi Syariah, Manajemen Dakwah, Bimbingan Penyuluhan Islam, Teologi, Kateketik, Pastoral | Capaian hafalan (juz) · Sanad/ijazah · Kitab dikuasai · Bahasa Arab (aktif/pasif) · Media dakwah (pengikut/tayangan) · Program sosial (penerima manfaat) |
| `pendidikan-keguruan` | Pendidikan & Keguruan | `praktik-jam` | — | PGSD, PAUD, PJKR, Pendidikan Bahasa, Pendidikan MIPA, BK, Teknologi Pendidikan, kependidikan kejuruan | Jenjang ajar · Mata pelajaran · Kurikulum (Merdeka/K13/Cambridge/IB) · Perangkat ajar buatan sendiri · Pembimbingan lomba · Platform (Classroom/LMS/Quizizz) |
| `akademik-riset` | Akademik & Penelitian | `karya-terkredit` | — | lintas jurusan — pelamar dosen, peneliti, asisten riset, beasiswa S2/S3, LPDP | Hibah (pemberi dana/nilai/peran PI) · Konferensi (nama/kota/jenis) · Sitasi · h-index · Profil peneliti (ORCID/Scholar/SINTA) |
| `hukum` | Hukum | `dampak-program` | `karya-terkredit` (tulisan terbit) | Ilmu Hukum, Hukum Bisnis, Hukum Internasional, Syariah | Bidang hukum · Peran perkara · Forum (PN/PA/PTUN/BANI/nonlitigasi) · Jumlah dokumen · Contoh tulisan (dianonimkan) |
| `bisnis-keuangan` | Bisnis, Keuangan & Akuntansi | `dampak-program` | — | Akuntansi, Manajemen, Ekonomi, Perbankan, Keuangan, Perpajakan, Bisnis Digital | Sektor klien · Jenis laporan · Periode audit · Nilai portofolio dikelola |
| `pemasaran-media` | Pemasaran, Komunikasi & Media | `dampak-program` | `karya-visual` (konten), `karya-terkredit` (jurnalistik) | Ilmu Komunikasi, Jurnalistik, Public Relations, Periklanan, Broadcasting, Bisnis Digital, Sastra | Kanal (IG/TikTok/YouTube/Google Ads/Meta Ads/SEO/email/cetak) · Engagement rate · CTR · ROAS · Pertumbuhan pengikut · Anggaran iklan |
| `industri-manufaktur` | Teknik Industri, Mesin & Manufaktur | `proyek-teknis` | `dampak-program` (perbaikan proses murni) | Teknik Industri, Teknik Mesin, Otomotif, Manufaktur, Perkapalan, Penerbangan, Metalurgi | Metode (Lean/Six Sigma/Kaizen/5S/TPM/FMEA/RCA/VSM) · Skala produksi · OEE · Takt time · Downtime (jam/tahun) · Scrap (%) |
| `energi-tambang-hse` | Migas, Pertambangan, Energi & K3/HSE | `proyek-teknis` | — | Teknik Kimia, Perminyakan, Pertambangan, Geologi, Geofisika, Teknik Lingkungan, K3, Teknik Energi | Jenis operasi · Fasilitas (kilang/LNG plant/tambang/pembangkit/WTP) · Kapasitas · Tekanan · Suhu · Throughput · Jam kerja tanpa kecelakaan · Laporan teknis disusun |
| `agro-hayati` | Pertanian, Perikanan, Peternakan, Kehutanan & Veteriner | `proyek-teknis` | `praktik-jam` (penyuluhan/veteriner) | Agroteknologi, Agribisnis, Budidaya Perairan, Peternakan, Kehutanan, Kedokteran Hewan, Teknologi Pangan, Biologi | Komoditas · Skala lahan (ha/kolam/ekor) · Metode budidaya (organik/hidroponik/bioflok/smart farming) · Produktivitas (ton/ha) · SR (%) · FCR · Analisis lab · Jumlah petani didampingi |
| `pariwisata-kuliner` | Pariwisata, Perhotelan & Kuliner | `praktik-jam` | `karya-visual` (menu/plating/event) | Perhotelan, Tata Boga, Pariwisata, Usaha Perjalanan Wisata, Manajemen Event, Kuliner | Spesialisasi (pastry/hot kitchen/barista/banquet/front office) · Porsi per hari · Occupancy rate · Food cost (%) · Standar higiene (HACCP/ISO 22000/laik higiene) · Penghargaan |
| `sosial-humaniora` | Sosial, Psikologi, Pemerintahan & Kemanusiaan | `dampak-program` | `karya-terkredit` (penelitian) | Psikologi, Sosiologi, Antropologi, Ilmu Politik, Hubungan Internasional, Administrasi Publik, Administrasi Negara, Kesejahteraan Sosial, Sastra & Bahasa | Metode (kuantitatif/kualitatif/FGD/observasi/studi kebijakan/asesmen) · Jumlah responden · Mitra (kementerian/LSM/donor) · Luaran (laporan kebijakan/modul) |
| `logistik-procurement` | Logistik, Rantai Pasok & Pengadaan | `dampak-program` | `proyek-teknis` (proyek rantai pasok) | Manajemen Logistik, Teknik Industri, Manajemen Transportasi, Bisnis | Lingkup · Nilai pengadaan dikelola · Jumlah vendor · Lead time (hari) · Safety stock · Incoterms · Penghematan (Rp) |
| `sdm-administrasi` | SDM & Administrasi Perkantoran | `dampak-program` | — | Manajemen SDM, Psikologi Industri, Administrasi Bisnis, Administrasi Perkantoran, Sekretaris | Populasi karyawan dilayani · Time-to-hire (hari) · Turnover (%) · Sistem (Talenta/Gadjian/SuccessFactors/Workday/ATS) · Regulasi (UU Ketenagakerjaan/PP 35/2021/BPJS) |
| `seni-pertunjukan` | Seni Pertunjukan, Musik & Budaya | `karya-terkredit` | `karya-visual` (showreel) | Seni Musik, Seni Tari, Teater, Karawitan, Seni Rupa Murni, Etnomusikologi | Repertoar · Skala penonton · Grade ujian (ABRSM/Trinity) · Penghargaan · Durasi showreel |
| `umum` | Umum / Belum Menentukan | `umum` | — | fallback | — |

**Kata kunci ATS per entri (`kataKunciATS`)** — pindahkan apa adanya dari §6 v1. Contoh:
- `sipil-konstruksi`: DED, RAB, BoQ, shop drawing, as-built drawing, pengawasan lapangan, MK, kurva S, uji slump, soil test, CPI/SPI, HSE
- `software-ti`: React, Next.js, Node, Laravel, Python, REST API, PostgreSQL, Docker, CI/CD, unit test, Agile/Scrum, Git
- `kedokteran-kesehatan`: anamnesis, pemeriksaan fisik, diagnosis banding, tata laksana, rekam medis elektronik, patient safety, akreditasi KARS/SNARS, PPI, triase, edukasi pasien, BPJS
- (dan seterusnya untuk 21 entri — semuanya ada di §6 v1, tinggal dipindahkan)

**Aturan pencarian dropdown:** cocokkan terhadap `jurusanTermasuk` **dan** `nama`, bukan hanya
`nama`. Ketik "Ahwal Syakhshiyyah" → ketemu `keagamaan`. Ketik "PWK" → ketemu
`arsitektur-perencanaan`. Ketik "Mekatronika" → ketemu `hardware-elektro`.

**Bidang baru yang sekarang tertampung tanpa menulis skema apa pun** (cukup tambah entri kamus):
penerbangan (`praktik-jam`, jam terbang), pelaut (`praktik-jam`, sea time), atlet
(`karya-terkredit`), auditor internal (`dampak-program`), penerjemah (`karya-terkredit`),
wirausaha/UMKM (`dampak-program`), ASN (`dampak-program`).

---

## 8. Blok Kredensial / Lisensi — 4 kategori

Wajib untuk `praktik-jam`, opsional untuk pola lain. Empat kategori dengan perlakuan berbeda:

### A. Lisensi praktik — tanpa ini tidak boleh bekerja

**Field wajib:** nomor · penerbit · tanggal terbit · **masa berlaku (menerima nilai "seumur hidup")**

| Kredensial | Penerbit | Masa berlaku |
|---|---|---|
| **STR** (Surat Tanda Registrasi) tenaga medis & kesehatan | Konsil Kesehatan Indonesia | ⭐ **SEUMUR HIDUP** untuk STR Definitif (UU 17/2023). Yang tetap berbatas waktu: STR Internsip, Pendidikan, Adaptasi, Penambahan Kompetensi, Sementara, Bersyarat |
| **SIP** (Surat Izin Praktik) | Dinkes Kab/Kota atau DPMPTSP | **5 tahun** |
| Izin Akuntan Publik | Menteri Keuangan (ujian oleh IAPI) | diperpanjang berkala |
| Berita acara sumpah advokat | Pengadilan Tinggi (setelah PKPA + UPA + magang 2 tahun) | seumur hidup (KTA diperpanjang) |
| Izin Praktik Dokter Hewan | lewat OSS/NIB | — |
| Izin Praktik Psikologi | ⚠️ tiga dokumen berbeda — **jangan memvonis mana yang sah** | sediakan pilihan: SIPP (HIMPSI) / SIPPK (Kemenkes) / SILP (Kemdiktisaintek) |

> ⚠️ **Implementasi kritis:** field masa berlaku **tidak boleh memaksa pengisian tanggal
> kedaluwarsa.** Sediakan pilihan "seumur hidup" / "tanggal tertentu" / "tidak berlaku".
> Ini kesalahan paling umum di aplikasi CV Indonesia pasca-UU 17/2023.

### B. Kredensial berjenjang — jenjang menentukan kelayakan proyek/tender

**Field wajib:** jenis · **jenjang/level (terstruktur, bukan teks bebas)** · klasifikasi bidang · masa berlaku

| Kredensial | Struktur | Penerbit | Masa berlaku |
|---|---|---|---|
| **SKK Konstruksi** | **9 jenjang** (Operator 1–3, Teknisi/Analis 4–6, Ahli 7–9); **8 klasifikasi**: arsitektur, sipil, mekanikal, tata lingkungan, arsitektur lanskap, PWK, sains & rekayasa teknik, manajemen pelaksanaan | LSP bidang konstruksi terlisensi BNSP, dicatat Menteri PU via SIJKI | 5 tahun, perpanjangan lewat PKB |
| **STRA** (Surat Tanda Registrasi Arsitek) | — | **Dewan Arsitek Indonesia** | 5 tahun, registrasi ulang wajib ikut PKB |
| **Lisensi Arsitek** | — | pemerintah provinsi | — |
| **STRI** (Surat Tanda Registrasi Insinyur) | — | **PII** (UU 11/2014) | 5 tahun |
| **POP / POM / POU** | 3 jenjang pengawas tambang | LSP terlisensi BNSP | per skema |
| **Ahli K3 Umum** | SKP (Surat Keputusan Penunjukan) + Lisensi K3 | **Kemnaker** | **3 tahun** |

> ⚠️ **Koreksi terhadap v1:** arsitek Indonesia butuh **tiga** dokumen — STRA **+** SKK Konstruksi
> klasifikasi arsitektural **+** Lisensi Arsitek. v1 hanya menyebut STRA. Bentuk blok kredensial
> arsitektur harus mengakomodasi ketiganya.

> ⚠️ **Ahli K3 Umum punya dua jalur berbeda:** sertifikat **Kemnaker** (SKP, regulatori) vs
> sertifikat **BNSP** (kompetensi). Keduanya sah tapi berbeda fungsi. Pisahkan — banyak pelamar
> bingung, dan aplikasi Anda bisa jadi pembeda dengan memisahkannya.

### C. Sertifikasi sektoral — wajib untuk jabatan tertentu, bukan untuk profesinya

**Field:** jenis · penerbit · tahun

- **Sertifikat Pendidik (via PPG)** — LPTK penyelenggara; **tanpa masa berlaku**.
  Dua jalur saat ini: PPG bagi Calon Guru dan PPG bagi Guru Tertentu (Permendikbudristek 19/2024).
- **NUPTK** — ⚠️ ini **identifier administratif**, **bukan lisensi mengajar**. Tempatkan terpisah
  dari kredensial.
- **Sertifikat LKPP** — ⚠️ **koreksi v1:** LKPP **tidak memakai penomoran "level 1–3"**.
  Yang ada dalam Perlem LKPP 7/2021: **Sertifikasi Kompetensi Level-1** (prasyarat) +
  **Sertifikasi Kompetensi Pengelola PBJ** (jabatan fungsional, berjenjang) +
  **Sertifikasi Kompetensi Personel Lainnya** (PPK Tipe A/B, Pejabat Pengadaan, Pokja Pemilihan).
  Istilah "level 2/3" beredar di penyedia pelatihan komersial, bukan istilah regulasi.
- **CA (IAI)** dan **Register Negara Akuntan** — kredensial asosiasi + registrasi negara;
  berbeda dari izin Akuntan Publik (kategori A).
- **UKW Dewan Pers** (Muda/Madya/Utama) — ⚠️ diatur Peraturan Dewan Pers, **bukan undang-undang**.
  Sinyal profesi de-facto, bukan lisensi hukum.
- **Sertifikasi Da'i / Penyuluh Agama Kemenag**, pembimbing manasik, BP4/pranikah,
  DSN-MUI (ekonomi syariah), Sertifikasi Amil Zakat (BAZNAS/LAZ).

### D. Sertifikasi kompetensi & vendor — pelengkap, bukan gerbang

**Field:** jenis · penerbit · tahun · **sub-tipe** (vendor global / BNSP / bootcamp-program)

- **BNSP / LSP** — skema okupasi, klaster, atau KKNI. ⚠️ **masa berlaku ditetapkan per skema oleh
  masing-masing LSP**, umumnya 3 tahun — **jangan hardcode 3 tahun untuk semua sertifikat BNSP.**
  Skema digital yang tersedia antara lain: Junior Web Programmer, Junior Web Developer,
  Pengembang Web, Pemrogram Senior, Desainer Grafis Muda, Data Scientist, Digital Marketing,
  IT Auditor, Junior Cyber Security.
- **Vendor global** — AWS/GCP/Azure Associate, Cisco CCNA, CompTIA, Oracle Certified,
  Meta Blueprint, Google Ads/Analytics, HubSpot, Adobe Certified Professional, NN/g.
- **Bootcamp & program pemerintah** — Dicoding, Bangkit, MSIB/Kampus Merdeka,
  Digital Talent Scholarship (Komdigi). ⚠️ sertifikat Dicoding adalah **sertifikat pelatihan
  platform**, bukan sertifikat kompetensi BNSP — **jangan disetarakan** di UI.
- **Sektoral lain:** Six Sigma Green/Black Belt, welding inspector (AWS/CSWIP), auditor ISO,
  Brevet Pajak A/B/C, CFA/CFP/AAJI/WPPE, CIA/QIA, CIPS, CSCP/CPIM, Ahli Kepabeanan/PPJK,
  HSE Passport, Basic Sea Survival/HUET, sertifikat BIM, Green Building (GBCI/EDGE),
  penerjemah tersumpah (HPI), sertifikat penyuluh pertanian, JULEHA, PPNS karantina,
  BNSP pariwisata/perhotelan, HACCP, food handler.

**Keanggotaan asosiasi** (blok terpisah, bukan kredensial): IDI, PDGI, PPNI, IBI, IAI-Apoteker,
IAI (Arsitek), HAKI, PII (IPP/IPM/IPU), HDII, HIMPSI, PERADI/KAI, IAI (Akuntan), IAPI,
KIVI/PDHI, HPI.

---

## 9. Penilaian — ganti nama, ganti rumus

### 9.1 Ganti nama (§3.7)

Hapus istilah "Skor ATS" dari seluruh UI, dokumentasi, dan copy beranda. Ganti dengan dua angka:

- **Kecocokan Lowongan** — overlap kata kunci CV ↔ deskripsi lowongan yang ditempel pengguna.
- **Kekuatan & Keterbacaan** — kelengkapan struktur, ekstraktabilitas teks, kekuatan bukti.

Dimensi bukti karya masuk ke angka kedua. Tampilkan perubahan bobot dimensi lama kepada pengguna
beserta penjelasan singkat (§13).

### 9.2 Rumus "Kekuatan Bukti": model P × Q × R

**Buang** sub-kriteria v1 (kelengkapan 25 / kekuatan bukti 25 / hasil terukur 25 / kejelasan peran 15 /
higiene tautan 10) — itu dikarang tanpa dasar.

**Ganti dengan model yang dipakai PII untuk menilai kompetensi insinyur Indonesia (FAIP).**
Alasannya: model ini bekerja pada level **item**, bukan level dokumen, dan tiga faktornya sudah
terwakili di model data kita.

**Skor per item = f(P, Q, R)**

| Faktor | Arti | Dihitung dari |
|---|---|---|
| **P** — banyaknya pengalaman | frekuensi pekerjaan sejenis | jumlah item pola yang sama × durasi, dibandingkan `rentangItemIdeal` |
| **Q** — peranan | anggota / pemimpin / ahli; konseptual / perencana / pelaksana | `peran` + `kontribusi` + `tahapKeterlibatan`. **Ini yang membedakan "anggota tim" dari "saya merancang X".** |
| **R** — tingkat kesulitan | spesifikasi teknis, lingkungan, anggaran, tenaga kerja, kompleksitas masalah | `skalaProyek` / `volume` / `skalaDikelola` + `standarKode` + `hasilTerukur` |

**Skor bagian = Σ(skor item), dinormalisasi terhadap ambang yang disesuaikan `jenjangKKNI`.**
Mahasiswa dan senior tidak dinilai dengan ambang yang sama. Struktur ambang meniru FAIP
(IPP 600 / IPM 3.000 / IPU 6.000, dengan syarat pengalaman ≥3 / ≥8 / ≥16 tahun), diskalakan
ke 0–100 untuk tampilan.

**Aturan tambahan:**
- **Anti double-counting** (dari rubrik UKMPPG): satu bukti hanya boleh dipakai untuk satu
  komponen. Satu proyek yang sama tidak boleh dihitung di dua item.
- **Bonus refleksi** (dari GMC revalidation & rubrik UKMPPG): field `refleksi` opsional —
  apa yang dipelajari, apa yang akan dilakukan berbeda. Menambah skor, tidak wajib.
  Murah diminta, sulit dipalsukan.
- **Higiene tautan** tetap dicek, tapi sebagai **validasi** (URL valid, bukan pemendek,
  maks 2 per item), bukan sebagai komponen skor bernilai 10.

### 9.3 Bobot per pola

Total tetap 100 — turunkan bobot dimensi lain secara proporsional dan **tampilkan bobot barunya di UI**.

| Pola | Bobot Bukti Karya | Alasan |
|---|---|---|
| `karya-visual` | **20%** | portofolio memang produk utamanya |
| `karya-terkredit` | **20%** | publikasi/kredit memang portofolionya |
| `proyek-teknis` | **15%** | penting, tapi kredensial berjenjang juga menentukan |
| `praktik-jam` | **12%** + blok Kredensial **wajib** (kosong = penalti terpisah) | lisensi adalah gerbang; portofolio pelengkap |
| `dampak-program` | **12%** | butir dampak sudah tersebar di Pengalaman Kerja — hindari double-counting |
| `umum` | **12%** | netral |

**Hapus penalti panjang halaman untuk SEMUA pola** (§3.5).

### 9.4 Saran perbaikan — 5 set, bukan 21

- **karya-visual:** *"Karya 'Redesain Aplikasi Y' belum menyebut hasil. Tambahkan satu angka:
  konversi, waktu penyelesaian tugas, atau kepuasan pengguna."* ·
  *"Portofolio hanya berisi hasil akhir. Tambahkan 2–3 langkah keputusan — inilah yang dinilai
  perekrut, bukan visualnya."* ·
  *"Karya arsitektur hanya berisi render. Tambahkan denah/potongan/detail agar terlihat kemampuan
  menuntaskan desain sampai skala konstruksi."*
- **proyek-teknis:** *"Proyek 'Panel Kendali' belum ada hasil pengukuran. Tambahkan angka hasil uji
  (efisiensi, ripple, konsumsi arus) — inilah yang membedakan perancang dari perakit."* ·
  *"Proyek 'Jembatan X' belum menyebut skala. Tambahkan bentang, luas, atau rentang nilai proyek."* ·
  *"Deskripsi memakai 'kami'. Tulis apa yang Anda kerjakan sendiri: 'saya menghitung...',
  'saya menguji...'."* ·
  *"Verifikator belum diisi. Badan sertifikasi dan perekrut teknis sama-sama menanyakannya."*
- **praktik-jam:** *"Kegiatan pembinaan belum menyebut jumlah santri/jamaah atau jam per pekan.
  Angka membuat pengabdian jadi terukur."* ·
  *"Log prosedur belum berisi jumlah. Tulis jenis tindakan dan volumenya, tanpa identitas pasien."* ·
  *"Blok Kredensial kosong. Untuk bidang ini, lisensi adalah syarat pertama yang dicek perekrut."*
- **karya-terkredit:** *"Publikasi belum mencantumkan indeksasi dan DOI. Tambahkan Scopus/SINTA
  dan tautan DOI."* · *"Peran penulis belum diisi. Penulis pertama dan anggota dinilai berbeda."*
- **dampak-program:** *"Metrik 'efisiensi naik' belum punya nilai sebelum dan sesudah. Perekrut
  membaca '12% → 8%' berbeda dari 'lebih efisien'."* ·
  *"Program ini belum menyebut penerima manfaat. Hasil tanpa penerima manfaat terdengar abstrak."*

Tiap saran tetap bisa diklik untuk melompat ke field bermasalah (perilaku yang sudah ada).

---

## 10. UI/UX

1. **Onboarding singkat — dua pertanyaan, bukan satu.**
   - *"Apa jurusan atau profesi Anda?"* — kotak pencarian yang mencocokkan **nama jurusan**
     dari `jurusanTermasuk` ("Teknik Informatika" → `software-ti` → pola `karya-visual`;
     "Ahwal Syakhshiyyah" → `keagamaan` → pola `praktik-jam`; "PWK" → `arsitektur-perencanaan`).
     Boleh dilewati (→ `umum`).
   - *"CV ini untuk apa?"* — 4 pilihan `TujuanCV`. Mengubah pola default:

   | Tujuan | Perilaku |
   |---|---|
   | Melamar kerja | pola default dari kamus |
   | Sertifikasi / lisensi profesi | pola → `proyek-teknis` atau `praktik-jam`; `verifikator` **wajib**; aturan bahasa orang-pertama aktif; blok Kredensial ditaruh di atas |
   | Beasiswa / akademik | pola → `karya-terkredit`; tanpa indikator panjang; urut per tipe luaran |
   | Tender / prakualifikasi | pola → `proyek-teknis`; `skalaProyek` dan `standarKode` ditonjolkan; mode rentang aktif otomatis |

   Tampilkan pola yang terpilih dengan kalimat penjelasnya, dan tombol *"Bukan ini? Ganti pola"*.
   **Pengguna tidak pernah melihat kata "pola" sebagai jargon** — labelnya "Bentuk portofolio Anda".

2. **Ganti pola tidak menghapus data.** Field umum dipertahankan. Field inti yang tidak ada di
   skema baru disimpan di `arsip` dan ditampilkan sebagai *"data dari bentuk portofolio sebelumnya"*
   dengan tombol pulihkan. `detailTambahan` **selalu** dipertahankan utuh (itu gunanya slot
   fleksibel). Tampilkan dialog konfirmasi yang menyebut field mana yang akan disembunyikan.

3. **Form per item:** field umum dulu → blok "Detail khas bidang" (field inti pola, bisa dilipat) →
   "Detail tambahan" (slot fleksibel) → "Verifikator" (bisa dilipat).
   Setiap field punya placeholder berisi **contoh nyata** (bukan "isi di sini") dan satu kalimat
   `bantuan` yang menjelaskan kenapa perekrut bidang itu mencarinya.

4. **Slot fleksibel — cegah jadi tempat sampah:**
   - Maksimal 6 entri.
   - Autocomplete dari `saranDetailTambahan` kamus **lebih menonjol** daripada input bebas.
   - Hanya 4 `prioritas` tertinggi yang dirender di CV — sisanya tersimpan tapi tidak dicetak,
     dengan indikator jelas *"2 detail tidak dicetak di CV"*.

5. **Tombol "Isi dengan contoh"** per entri kamus → mengisi satu item contoh penuh yang bisa
   langsung diedit.

6. **Pratinjau tersorot** — konsisten dengan perilaku yang sudah ada.

7. **Mode Redaksi (NDA):** sakelar per item. Mengganti nama klien jadi deskriptor generik
   ("Perusahaan energi nasional"), nilai pasti jadi rentang, menyembunyikan nomor part dan nama
   vendor. Tampilkan `peringatan[]` pola + `peringatanTambahan[]` kamus di dekat sakelar ini.

8. **Sakelar "Gabung ke Pengalaman Kerja"** (§3.8) — di level bagian, dengan penjelasan jujur.
   Aktif secara default bila **semua** item punya `konteks` berupa pemberi kerja nyata.

9. **Penghitung karakter** per bullet dan indikator langsung "sudah ada angka / belum ada angka".

10. **Validator bahasa orang-pertama** — aktif untuk `proyek-teknis`, saran untuk pola lain.
    Sorot kata "kami/tim kami/memimpin/mengelola" dengan usulan penulisan ulang.

11. **Blok agregat** untuk `praktik-jam` — progress bar terhadap ambang §6.3, di atas daftar item.

12. **Urutan item bisa digeser** (drag), default urut tanggal terbaru.
    Untuk `karya-terkredit`: default urut tahun menurun, dikelompokkan per `tipeLuaran`.

13. **Batas item ditampilkan sebagai saran, bukan larangan keras.** Untuk `karya-terkredit`,
    **tidak ada saran batas atas sama sekali**.

---

## 11. Render di CV & ekspor

Format baku satu item (berlaku di semua template dan semua format):

```
JUDUL BAGIAN (huruf kapital, sesuai headingCV pola)

Judul Karya — Peran | Konteks/Klien | Bulan Tahun – Bulan Tahun
Ringkasan satu kalimat.
• Bullet hasil berangka.
• Bullet hasil berangka.
Detail: Kunci: nilai · Kunci: nilai
tautan-polos.com/a · tautan-polos.com/b
```

Bila `gabungKePengalaman` aktif, item dirender **di dalam** bagian `PENGALAMAN KERJA`
sebagai entri setara, dengan `konteks` sebagai nama pemberi kerja.

**Aturan render:**
- Field inti + 4 `detailTambahan` prioritas tertinggi dirangkai jadi **satu baris "Detail"**
  dipisah titik-tengah — **bukan tabel**.
- **Tautan:** teks polos yang terbaca (`github.com/nama/proyek`), dengan **hyperlink dipasang pada
  teks polos itu sendiri** (href = URL penuh). Bukan salah satu (§3.3).
- `verifikator` **tidak dicetak** di CV — ia metadata untuk kualitas penulisan dan referensi
  pengguna sendiri. Opsional: baris "Referensi tersedia atas permintaan."
- `refleksi` **tidak dicetak** di CV — hanya menambah skor.

**Per format:**
- **PDF:** teks asli yang bisa dipilih (bukan gambar).
- **Word:** paragraf biasa + bullet bawaan, tanpa text box, **tanpa satu pun konten di
  header/footer dokumen** (§3.6).
- **TXT:** rata kiri, bullet `-`, URL penuh.
- **JSON:** seluruh objek `BagianPortofolio` termasuk `inti`, `detailTambahan`, `verifikator`,
  `refleksi`, dan `arsip`.

**Uji di semua 10 template:** item portofolio tidak boleh terpotong di tengah baris "Detail"
saat berganti halaman (`break-inside: avoid` pada tiap item).

---

## 12. Pencocokan lowongan & pemindai CV unggahan

- Setiap entri kamus menyumbang `kataKunciATS` ke mesin pencocokan lowongan yang sudah ada;
  kata kunci dari entri kamus aktif diberi bobot lebih tinggi. `industriKBLI` menambah bobot sekunder.
- **Deteksi pola otomatis** pada CV unggahan (skor kecocokan kata kunci tiap entri kamus →
  pola-nya) → tawarkan *"Sepertinya CV ini berbentuk Proyek Teknis. Pakai penilaian bentuk ini?"*
- Saat membandingkan sampai 5 CV, gunakan pola yang sama agar skor sebanding;
  beri peringatan bila pola antar-CV berbeda.
- **Bahasa:** peringatkan bila bahasa CV berbeda dari bahasa iklan lowongan yang ditempel.
  Alasannya berbasis mekanisme, bukan opini: penemuan kandidat berjalan lewat pencocokan kata kunci,
  jadi CV berbahasa Inggris melawan lowongan berbahasa Indonesia gagal pada pencarian
  "pengalaman", "keuangan", "penjualan". Istilah teknis (nama tools, framework, sertifikasi)
  **selalu** Inggris di kedua kasus.
- Pemindaian tetap **di peramban**, sesuai janji di beranda. Jangan mengirim isi CV ke layanan
  pihak ketiga.

---

## 13. Migrasi & kompatibilitas

- Tambahkan `schemaVersion` pada dokumen CV.
- CV lama tanpa `profilPortofolio` → `pola: 'umum'`, `tujuan: 'melamar-kerja'`,
  `portofolio.aktif = false`, `gabungKePengalaman = false`.
- **CV yang sudah memakai skema v1** (punya `fieldProfile.bidang` dari katalog 21 bidang):
  petakan otomatis lewat kolom "Pola utama" di tabel §7. Field khusus v1 dipetakan ke field inti
  bila ada padanannya (lihat kolom pemetaan di dokumen analisis), sisanya masuk `detailTambahan`
  dengan `label` = label field lama. **Tidak ada data yang dibuang.**
- **Tidak boleh ada CV lama yang skornya berubah** sebelum pengguna mengaktifkan bagian portofolio.
  Bila bobot berubah, tampilkan skor lama sebagai pembanding beserta penjelasan singkat —
  **termasuk penjelasan mengapa namanya berubah dari "Skor ATS"**.
- Impor JSON lama (v1 maupun pra-v1) tetap harus berjalan.
  Ekspor JSON baru menyertakan `profilPortofolio` + `portofolio`.
- `pola-schemas.ts` dan `kamus-bidang.ts` punya nomor versi masing-masing; menambah entri kamus
  tidak memerlukan migrasi basis data.

---

## 14. Kriteria penerimaan (uji sebelum menyatakan selesai)

1. **Lima pola** terdaftar lengkap dengan field inti, contoh terisi, aturan skor, catatan UI
   berangka, dan peringatan.
2. **Kamus memuat ≥21 entri.** Pencarian "Kedokteran Gigi", "Ahwal Syakhshiyyah", "PWK",
   "Tata Boga", "Mekatronika" menemukan **pola** yang benar.
3. Mengganti pola dari `karya-visual` ke `proyek-teknis` **tidak menghilangkan** judul, peran,
   konteks, tanggal, maupun `detailTambahan`; field inti lama masuk `arsip` dan bisa dipulihkan.
4. CV dengan 3 item lengkap + verifikator memperoleh skor "Kekuatan Bukti" **≥85**;
   CV dengan 3 item tanpa angka dan tanpa tautan **<50**, dengan saran yang menyebut field
   spesifik **dan** pola-nya.
5. Ekspor PDF, Word, TXT, JSON menampilkan bagian portofolio dengan benar di **seluruh 10 template**,
   tetap satu kolom, teks bisa dipilih, **URL terbaca sebagai teks polos DAN tetap ber-hyperlink**.
6. ⭐ **Sakelar "Gabung ke Pengalaman Kerja" menghasilkan output di mana item portofolio muncul
   sebagai entri di bawah judul `PENGALAMAN KERJA`**, bukan bagian terpisah.
7. ⭐ **Ekspor Word tidak menaruh satu pun konten di header/footer dokumen.**
   Verifikasi dengan membaca `sec.header`/`sec.footer` hasil ekspor — harus kosong.
8. ⭐ **Field masa berlaku kredensial menerima nilai "seumur hidup"** tanpa memaksa tanggal.
9. **Tidak ada satu pun string "Skor ATS"** tersisa di UI, dokumentasi, atau copy beranda.
10. **Tidak ada indikator/penalti panjang halaman** di pola mana pun.
11. CV lama (v1 maupun pra-v1) tetap bisa dibuka, disimpan, diekspor tanpa error,
    dan **skornya tidak berubah** sebelum bagian portofolio diaktifkan.
12. Mode Redaksi benar-benar mengganti nama klien dan nilai pasti di **semua** format ekspor.
13. Peringatan kerahasiaan tampil untuk `praktik-jam` (kesehatan/psikologi),
    `proyek-teknis` (hardware/energi), dan `dampak-program` (hukum/keuangan).
14. Validator bahasa orang-pertama menandai "kami membangun sistem" dan memberi usulan perbaikan.
15. Blok agregat `praktik-jam` menampilkan progress terhadap ambang 250/100/50 SKP dengan
    ranah 45%/35%/5%.
16. Menempel iklan lowongan bidang sipil pada CV berpola `proyek-teknis` menaikkan kecocokan
    kata kunci dibanding sebelum fitur ini.
17. Lolos aksesibilitas dasar: label form terkait, navigasi keyboard, kontras memadai,
    mode gelap benar.
18. **Grep repo: tidak ada `if (pola === ...)` atau `if (bidang === ...)` di dalam komponen.**
    Semua percabangan dibaca dari `pola-schemas.ts`.

---

## 15. Urutan pengerjaan

- **Fase 1** — Tipe data (§5) + `pola-schemas.ts` **lengkap 5 pola sekaligus** (hanya 5, muat
  di satu fase) + `schemaVersion` + migrasi CV lama dan CV v1.
- **Fase 2** — `kamus-bidang.ts` ≥21 entri hasil konversi §7 + pencarian jurusan +
  onboarding dua pertanyaan (jurusan + tujuan).
- **Fase 3** — Form dinamis: field umum → field inti pola → slot fleksibel → verifikator.
  Simpan otomatis. Tombol "Isi dengan contoh". Ganti pola tanpa kehilangan data.
- **Fase 4** — Render di pratinjau + 10 template + seluruh eksportir, **termasuk sakelar
  "Gabung ke Pengalaman Kerja"**, aturan tautan bersanding, dan larangan header/footer Word.
- **Fase 5** — Skor: **rename** jadi "Kecocokan Lowongan" + "Kekuatan & Keterbacaan",
  implementasi P×Q×R, saran per pola, **hapus penalti panjang halaman**, tampilkan perubahan bobot.
- **Fase 6** — Blok Kredensial 4 kategori (§8) + blok agregat `praktik-jam` +
  Mode Redaksi + validator bahasa orang-pertama.
- **Fase 7** — Integrasi pencocokan lowongan, deteksi pola otomatis pada CV unggahan,
  uji penerimaan §14.

Setelah tiap fase: jalankan aplikasi, buktikan hasilnya, dan laporkan berkas yang berubah.

**Fase opsional untuk iterasi berikutnya (jangan dikerjakan sekarang, catat sebagai backlog):**
- **Mode "Salin ke Form Portal"** — memecah CV jadi blok siap salin sesuai field yang lazim diminta
  Jobstreet/Glints/Kalibrr/portal BUMN. Alasannya: sebagian besar pelamar Indonesia mengisi
  **profil terstruktur**, bukan mengunggah CV untuk diparsing. Ini mengubah posisi produk dari
  "CV builder yang mengklaim lolos ATS" jadi "satu sumber data untuk semua jalur lamaran".
- **Impor ORCID / SINTA** untuk pola `karya-terkredit` — satu-satunya pola yang bisa di-query dari
  database publik. Mulai dari ORCID (API terbuka, tidak butuh otentikasi untuk profil publik).
  **Jangan** scrape Google Scholar; tidak ada API resmi.
- **Ekspor "versi teaser"** untuk `karya-visual` — 3 item terkuat, untuk dikirim bersama CV
  sementara booklet penuh menyusul.

---

## 16. Yang TIDAK boleh dilakukan

- Menambah kolom kedua, tabel, ikon, atau bagan ke dalam CV demi mempercantik portofolio.
- Mengunggah atau menyematkan gambar karya ke dalam berkas CV.
- Membuat judul bagian kreatif di luar whitelist pola.
- Menaikkan skor hanya karena banyak tautan.
- Mengirim isi CV ke layanan pihak ketiga (pemindaian tetap di peramban).
- Menghapus atau mengubah arti dimensi skor lama tanpa menjelaskan perubahan bobot kepada pengguna.
- **Membuat objek skema baru untuk profesi baru.** Profesi baru = entri kamus, titik.
- **Menaruh konten apa pun di header/footer dokumen Word.**
- **Memaksa pengisian tanggal kedaluwarsa pada kredensial.**
- **Memakai istilah "Skor ATS" di mana pun.**
- **Menulis klaim yang ada di daftar terlarang §17.**

---

## 17. Klaim terlarang & fakta yang belum terverifikasi

### 17.1 Klaim yang DILARANG ditulis di produk (tidak ada buktinya)

| Klaim | Kenapa dilarang |
|---|---|
| *"75% CV ditolak otomatis oleh ATS"* | Tidak punya sumber yang bisa ditelusuri; investigasi asal-usulnya menyimpulkan salah kutip. |
| *"Foto membuat ATS kesulitan membaca CV"* | Tidak ada buktinya. Gambar tersemat diabaikan ekstraktor teks; Greenhouse menyatakan *"Images embedded directly in the resume file are unaffected"*. Alasan yang benar untuk tidak memakai foto adalah **bias**, bukan parsing. |
| *"Pemendek tautan diblokir ATS"* | Nol dokumentasi vendor. Pakai alasan §3.4. |
| *"Bagian dengan judul non-standar akan hilang"* | Tidak ada bukti; isinya tetap terindeks di full-text search. |
| *"PDF berbahaya untuk ATS"* atau *"DOCX selalu lebih aman"* | Tidak ada pemenang jelas. PDF gagal dengan "salah urut, semua teks ada"; DOCX gagal dengan "urutan benar, sebagian teks hilang". **Layout satu kolom lebih menentukan daripada format berkas.** |
| *"CV lebih dari 2 halaman kena penalti"* | Terbantah (§3.5). |
| Klaim bahwa SIPP HIMPSI *"tidak punya dasar hukum"* | Itu posisi salah satu pihak dalam sengketa kewenangan aktif, bukan fakta netral. Sediakan tiga opsi tanpa memvonis. |
| *"Skor ini memprediksi apakah CV Anda lolos ATS"* | Filter dikonfigurasi per-employer; tidak ada skor universal untuk direplikasi. |

### 17.2 Fakta yang BELUM terverifikasi — jangan di-hardcode

| Item | Status | Kalau perlu, verifikasi ke |
|---|---|---|
| Jumlah total SKKNI nasional | portal Kemnaker berbentuk SPA, tidak terbaca | `skkni.kemnaker.go.id/rekapitulasi-skkni/berlaku` lewat browser sungguhan — **atau jangan cantumkan angka sama sekali** |
| Nama 22 kategori KBLI 2025 | baru terbaca dari salinan pihak ketiga; angka struktural cocok dengan berita resmi BPS | PDF resmi BPS. Catatan praktis: **OSS masih menampilkan KBLI 2020** |
| Nomor pasal masa berlaku SKK Konstruksi | sumber bertentangan (PP 14/2021 vs PP 5/2020) | JDIH PUPR. **Jangan tulis nomor pasal spesifik.** |
| Status berlaku Kepmen ESDM 1827 K/30/MEM/2018 (POP/POM/POU) | mungkin sudah diubah | JDIH ESDM |
| Nomor pasal STRA di UU 6/2017 | halaman JDIH BPK hanya metadata | PDF UU |
| Permenaker 3/2016 (tata cara penetapan SKKNI) | sumber baru Wikipedia | JDIH Kemnaker |
| Tahun pengalaman per jenjang SKK 1–9 | semua sumber adalah konsultan sertifikasi komersial | dokumen LPJK / Permen PUPR primer |
| Masa berlaku sertifikat BNSP | ditetapkan **per skema oleh masing-masing LSP** | jangan hardcode 3 tahun; sediakan input |

**Aturan umum:** kalau kamu tidak yakin sebuah nomor peraturan atau angka masa berlaku,
**buat field-nya sebagai input pengguna** dan beri placeholder contoh — jangan menuliskannya
sebagai fakta di UI.

---

## Lampiran — ringkasan perubahan dari v1

| v1 | v2 | Alasan |
|---|---|---|
| 21 bidang sebagai skema form (§6) | 5 pola (§6) + kamus 21 entri (§7) | 21 bidang tidak pernah cukup; duplikasi masif; peleburan berdasarkan pola pembuktian |
| `FieldProfile` gabung 4 sumbu | `ProfilPortofolio` dengan sumbu terpisah + metadata | tidak ada taksonomi resmi Indonesia yang merupakan taksonomi bidang pekerjaan |
| `khusus: Record<string, ...>` per bidang | `inti` (6–7 field pola) + `detailTambahan` (slot) | field universal + slot fleksibel |
| — | `verifikator`, `refleksi`, `gabungKePengalaman`, `tujuan` | field baru dari temuan riset |
| §7 skor: 25/25/25/15/10 dikarang | model P×Q×R (FAIP) + anti double-counting (UKMPPG) | instrumen resmi Indonesia, bekerja di level item |
| "Skor ATS 6 dimensi" | "Kecocokan Lowongan" + "Kekuatan & Keterbacaan" | klaim skor ATS tidak bisa dipertahankan |
| Penalti halaman, longgar untuk 2 bidang | dihapus untuk semua | terbantah eksperimen terkontrol |
| Buang hyperlink, sisakan teks | sandingkan teks polos ber-hyperlink | uji ekstraksi + rekruter membuka berkas asli |
| bit.ly "ditandai spam" | bit.ly "nol kata kunci, opak, titik kegagalan tunggal" | alasan lama folklor |
| Judul whitelist = aturan mati | whitelist = asuransi murah | tidak ada bukti bagian hilang |
| — | sakelar Gabung ke Pengalaman Kerja | `PROJECTS`/`PORTFOLIO` tidak ada di enum parser mana pun |
| — | larangan header/footer Word | uji: isi header/footer DOCX hilang total |
| STR "beserta masa berlaku" | STR mendukung "seumur hidup" | UU 17/2023 |
| Fase 5: "lengkapi 16 bidang sisanya" | dihapus | tidak ada lagi 16 bidang untuk dilengkapi |
| §12 poin 1: "21 bidang terdaftar lengkap" | "5 pola lengkap + kamus ≥21 entri" | kriteria lama mengukur hal yang salah |
