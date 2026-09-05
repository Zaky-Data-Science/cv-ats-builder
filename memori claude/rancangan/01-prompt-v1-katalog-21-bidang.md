# PROMPT — Fitur "Portofolio Adaptif per Bidang" untuk CV ATS Builder

> Salin SELURUH isi berkas ini sebagai satu prompt ke AI coding tool (Claude Code / Cursor / v0)
> yang sedang membuka repo `cv-ats-builder`. Jangan dipotong-potong: bagian katalog bidang
> (§6) adalah inti fiturnya.

---

## 0. Peran & instruksi eksekusi

Kamu adalah senior full-stack engineer yang melanjutkan aplikasi **CV ATS Builder**
(https://cv-ats-builder-henna.vercel.app). Bahasa antarmuka: **Bahasa Indonesia**.

Tugasmu: menambahkan **bagian CV baru bernama PORTOFOLIO yang bentuk field-nya berubah
mengikuti bidang/jurusan pengguna**, tanpa merusak satu pun fitur yang sudah ada.

Aturan kerja:
1. Baca dulu struktur repo, model data CV, komponen form, komponen pratinjau, mesin skor ATS,
   dan seluruh eksportir (PDF/Word/TXT/JSON). Laporkan temuanmu sebelum menulis kode.
2. Kerjakan bertahap sesuai §13 (Fase 1 → 6). Setelah tiap fase, sebutkan berkas apa saja yang berubah.
3. Jangan mengubah skema data lama secara destruktif — lihat §11 (migrasi).
4. Semua teks UI, label, placeholder, pesan validasi, dan saran perbaikan: **Bahasa Indonesia**,
   nada lugas, tanpa jargon HR yang mengawang.
5. Jika ada keputusan desain yang ambigu, ambil opsi paling aman untuk ATS lalu catat asumsinya.

---

## 1. Kondisi aplikasi saat ini (jangan dilanggar)

- Aplikasi web: isi field terstruktur → pratinjau CV seukuran kertas (A4/Letter/Legal/F4) → skor ATS → unduh.
- **11 bagian CV** yang sudah ada (identitas, ringkasan profil, pengalaman kerja, pendidikan, keahlian, dst).
- **10 template**, semuanya **satu kolom, tanpa tabel**, memakai judul bagian baku. Yang berbeda hanya
  tipografi, jarak, garis, dan penempatan foto.
- **Skor ATS 5 dimensi berbobot**, tiap saran bisa diklik untuk melompat ke field bermasalah.
- Fitur lain: simpan otomatis ke basis data (<1 detik setelah berhenti mengetik), pencocokan dengan
  iklan lowongan, unggah/bandingkan sampai 5 CV (diproses di peramban), ekspor/impor JSON, hapus akun.

Fitur baru ini harus mengikuti pola yang sama: field terstruktur → pratinjau langsung → skor → ekspor.

---

## 2. Masalah yang diselesaikan

CV ATS sekarang seragam untuk semua orang. Padahal **bukti karya tiap profesi bentuknya beda total**:

| Profesi | "Portofolio" berarti | Yang dicari perekrut |
|---|---|---|
| Software engineer | Repo + demo langsung | Stack, peran, metrik performa |
| Hardware/elektro | Skematik → PCB → prototipe | Jejak requirement → desain → bring-up → **hasil ukur** |
| Sipil | Proyek konstruksi | Nilai kontrak, skala fisik, ketepatan jadwal, kode/SNI |
| Arsitektur | Booklet gambar | Denah/potongan/tampak + detail + proses desain |
| Desain/UI-UX | Studi kasus | Masalah → proses → **hasil berangka** |
| Kedokteran & kesehatan | Log prosedur + publikasi | Volume kasus, kompetensi, STR/SIP, CPD |
| Keagamaan | Capaian hafalan, sanad, dakwah | Ijazah/sanad, jam mengajar, jangkauan jamaah |
| Akademik | Daftar publikasi | Sitasi, hibah, peran penulis |

Satu set field tidak akan pernah cukup. Karena itu bagian PORTOFOLIO harus **adaptif**:
pengguna memilih bidang, lalu field, contoh isian, kata kunci, validasi, dan aturan penilaian
ikut berganti.

---

## 3. Prinsip yang TIDAK BOLEH dilanggar (ATS-safety)

Ini pembeda utama aplikasi ini. Portofolio tetap harus lolos mesin pembaca lamaran:

1. **Tetap satu kolom.** Tidak ada tabel, kolom ganda, kotak teks, ikon, atau teks di dalam gambar.
2. **Judul bagian tetap baku dan huruf kapital.** Judul boleh menyesuaikan bidang (lihat §6),
   tetapi harus dari daftar tertutup (whitelist) yang lazim dikenali parser — bukan judul kreatif
   seperti "Jejak Karyaku".
3. **Semua tautan ditulis sebagai URL polos yang bisa dibaca**, mis. `github.com/nama/proyek`,
   bukan hanya kata "Portofolio" ber-hyperlink. Sebagian ATS lama membuang hyperlink dan hanya
   menyisakan teksnya. Aturan penulisan URL:
   - buang `https://` dan `www.` di tampilan, simpan versi penuh sebagai href;
   - dilarang memakai pemendek tautan (bit.ly dsb) — sering ditandai spam dan tidak informatif;
   - URL panjang berparameter (`?utm=...`) dipangkas otomatis;
   - satu item maksimal 2 tautan.
4. **ATS tidak membuka tautan.** Jadi setiap item portofolio wajib punya deskripsi teks yang
   berdiri sendiri — tautan itu untuk manusia, teksnya untuk mesin. Tegaskan ini di UI.
5. **Portofolio bukan pengganti isi CV.** Skor tidak boleh bisa dikatrol hanya dengan menempel banyak tautan.
6. **Tanpa lampiran gambar** di dalam CV. Untuk bidang visual (arsitektur, desain, seni, fotografi),
   tampilkan panduan: "PDF portofolio dikirim terpisah; di CV cukup tautan + ringkasan proyek."
7. **Ekspor Word/TXT harus tetap rata kiri, satu kolom, dan urutan bacanya benar.**

---

## 4. Ringkasan fitur yang dibangun

1. **Pemilih Bidang (Field Profile)** — satu dropdown bertingkat: Rumpun → Bidang → (opsional) Sub-bidang.
   Disimpan di level CV. Bisa di-override per item portofolio (mis. lulusan TI yang punya satu proyek desain).
2. **Bagian CV ke-12: PORTOFOLIO** — opsional, bisa dimatikan.
   Judul bagian, field, urutan, placeholder, dan batasnya ditentukan bidang yang dipilih.
3. **Skema field per bidang** (§6) — field umum + field khusus bidang.
4. **Dimensi skor ke-6: "Bukti Karya"** (§7) dengan aturan berbeda per bidang.
5. **Kamus kata kunci per bidang** yang dipakai pencocokan lowongan dan pemindai CV unggahan.
6. **Blok Kredensial/Lisensi** yang isinya menyesuaikan bidang (STR/SIP, SKK Konstruksi, STRA, dst).
7. **Mode Redaksi (NDA)** — sembunyikan nama klien/angka sensitif, ganti jadi deskriptor generik.

---

## 5. Model data

Tambahkan ke skema CV (tetap kompatibel mundur — lihat §11):

```ts
// Level CV
type FieldProfile = {
  rumpun: string          // mis. "teknik"
  bidang: string          // slug dari katalog §6, mis. "sipil-konstruksi"
  subBidang?: string      // mis. "struktur"
  jenjang: 'mahasiswa' | 'fresh_graduate' | 'awal' | 'menengah' | 'senior'
}

type PortfolioSection = {
  enabled: boolean
  headingOverride?: string      // hanya boleh dari whitelist judul bidang
  items: PortfolioItem[]
  maxItems: number              // default per bidang, lihat §6
  redactMode: boolean           // mode NDA
}

type PortfolioItem = {
  id: string
  bidangOverride?: string       // jika item ini beda bidang dari CV-nya
  // --- FIELD UMUM (dipakai SEMUA bidang) ---
  judul: string                 // nama karya/proyek
  peran: string                 // peran spesifik pengguna, bukan peran tim
  konteks: string               // klien / institusi / kampus / mandiri
  lokasi?: string
  mulai: string                 // YYYY-MM
  selesai: string | 'sekarang'
  ringkasan: string             // 1 kalimat, maks 160 karakter
  poin: string[]                // 2–4 bullet hasil, tiap bullet <= 200 karakter
  tautan: { label: string; url: string }[]   // maks 2
  kataKunci: string[]           // tools/teknologi/metode
  // --- FIELD KHUSUS BIDANG ---
  khusus: Record<string, string | number | string[]>   // kunci ditentukan skema bidang
}
```

Skema bidang disimpan sebagai **data, bukan komponen** — satu berkas registry
(`lib/portfolio/field-schemas.ts`) berisi array objek:

```ts
type BidangSchema = {
  slug: string
  nama: string                  // "Teknik Sipil & Konstruksi"
  rumpun: string
  jurusanTermasuk: string[]     // untuk pencarian di dropdown
  headingCV: string             // judul bagian di CV, huruf kapital
  headingAlternatif: string[]   // whitelist judul lain yang boleh dipilih
  labelItem: string             // "Proyek", "Karya", "Kasus", "Publikasi"
  maxItems: number
  fields: FieldDef[]            // field khusus
  wajib: string[]               // kunci field yang wajib diisi agar item dianggap kuat
  platformLazim: string[]       // saran tautan
  kredensial: KredensialDef[]   // lisensi/sertifikat khas bidang
  kataKunciATS: string[]
  peringatan: string[]          // catatan etika/kerahasiaan yang tampil di UI
  contoh: PortfolioItem         // contoh terisi penuh, dipakai sebagai placeholder + tombol "Isi contoh"
  aturanSkor: SkorRule[]        // §7
}

type FieldDef = {
  key: string
  label: string
  tipe: 'teks' | 'angka' | 'pilihan' | 'multi' | 'tanggal' | 'teks_panjang' | 'url'
  opsi?: string[]
  satuan?: string               // "m²", "juta rupiah", "kasus", "juz"
  placeholder: string
  bantuan: string               // kalimat "kenapa ini penting"
  wajib?: boolean
  prioritas?: number            // 1 = paling penting, dipakai saat merangkai baris "Detail bidang"
}
```

Menambah bidang baru = menambah satu objek di registry. **Tidak boleh** ada `if (bidang === 'x')`
yang tersebar di komponen.

---

## 6. KATALOG BIDANG (inti fitur — implementasikan seluruhnya)

Format tiap entri: jurusan yang tercakup → judul bagian di CV → field khusus → syarat item kuat →
platform → kredensial Indonesia → kata kunci → peringatan.

### 6.1 `software-ti` — Teknologi Informasi & Perangkat Lunak
- **Jurusan:** Teknik Informatika, Sistem Informasi, Ilmu Komputer, RPL, Teknologi Rekayasa Perangkat Lunak, PTIK, Teknik Komputer & Jaringan.
- **Sub-bidang:** frontend, backend, fullstack, mobile, data engineer, data scientist/AI, QA, DevOps/SRE, keamanan siber, IT support/jaringan.
- **Judul CV:** `PROYEK & PORTOFOLIO` (alt: `PROYEK TEKNIS`, `PORTOFOLIO PROYEK`)
- **Field khusus:** `stack` (multi: bahasa/framework/DB), `peranTeknis` (pilihan: solo / tim + jumlah anggota),
  `skalaPengguna` (angka + satuan pengguna/transaksi per bulan), `metrikDampak` (teks: "waktu muat turun 45%"),
  `repo` (url), `demo` (url), `statusProduksi` (pilihan: produksi / internal / tugas kuliah / latihan pribadi),
  `kontribusi` (teks: bagian mana yang ditulis sendiri).
- **Syarat item kuat:** ada `repo` **atau** `demo`, ada `stack`, minimal 1 angka pada `poin`, `statusProduksi` terisi.
- **Platform:** github.com, gitlab.com, vercel.app, npmjs.com, kaggle.com, huggingface.co, play.google.com.
- **Kredensial:** BNSP Junior Web Developer, AWS/GCP/Azure Associate, Cisco CCNA, CompTIA, Oracle Certified, Dicoding/Bangkit.
- **Kata kunci:** React, Next.js, Node, Laravel, Python, REST API, PostgreSQL, Docker, CI/CD, unit test, Agile/Scrum, Git.
- **Peringatan:** repo privat/kode kantor tidak boleh ditempel; tulis kontribusi pribadi, bukan klaim kerja tim.
- **Contoh render:**
  `Sistem Monitoring Server Multi-Host — Pengembang tunggal | PT Contoh Nusantara | Jul 2026 – Sep 2026`
  `Dasbor pemantauan CPU/RAM/disk 12 server dari satu titik, agen tanpa instalasi.`
  `• Menurunkan waktu deteksi server mati dari ±30 menit (manual) menjadi < 60 detik.`
  `• Python, PowerShell, Oracle XE, 5 worker latar; menyimpan 8.600 baris metrik/hari.`
  `github.com/nama/monitoring · demo.vercel.app`

### 6.2 `hardware-elektro` — Hardware, Elektro, Elektronika & Embedded
- **Jurusan:** Teknik Elektro, Elektronika, Telekomunikasi, Mekatronika, Instrumentasi, Teknik Komputer, Robotika.
- **Judul CV:** `PORTOFOLIO PROYEK TEKNIS` (alt: `PROYEK REKAYASA`)
- **Field khusus:** `jenisKarya` (pilihan: skematik/PCB/firmware/prototipe/instrumentasi/sistem kendali),
  `komponenInti` (multi: MCU/sensor/driver), `toolsEDA` (multi: Altium, KiCad, Eagle, Proteus, LTspice, MATLAB/Simulink),
  `lapisanPCB` (angka), `hasilUkur` (teks: "efisiensi 92% pada beban 3 A; ripple 40 mV"),
  `tahapan` (multi: requirement → desain → simulasi → fabrikasi → bring-up → pengujian),
  `standar` (multi: IEC, IEEE, SNI, PUIL), `bom` (angka: jumlah komponen / biaya per unit).
- **Syarat item kuat:** ada `hasilUkur` **berangka** (pembeda utama bidang ini: perekrut ingin bukti kamu
  mengukur, bukan sekadar merakit), ada `toolsEDA`, tahapan mencapai bring-up/pengujian.
- **Platform:** github.com (firmware + berkas KiCad), hackster.io, instructables.com, PDF 2–4 halaman per proyek.
- **Kredensial:** SKK Konstruksi jalur elektrikal, K3 Listrik Kemnaker, sertifikat teknisi BNSP, pelatihan PLC/DCS vendor.
- **Kata kunci:** PCB layout, schematic capture, embedded C, RTOS, I2C/SPI/UART, power supply design, signal integrity, osiloskop, PLC, SCADA, HMI, kalibrasi.
- **Peringatan:** skematik/BOM perusahaan sering terikat NDA — aktifkan Mode Redaksi, samarkan nomor part dan nama vendor.

### 6.3 `sipil-konstruksi` — Teknik Sipil & Konstruksi
- **Jurusan:** Teknik Sipil, Struktur, Transportasi, Geoteknik, Sumber Daya Air/Pengairan, Manajemen Konstruksi, MEP, Quantity Surveying.
- **Judul CV:** `PORTOFOLIO PROYEK` (alt: `PENGALAMAN PROYEK`)
- **Field khusus:** `jenisProyek` (pilihan: gedung bertingkat/jembatan/jalan/bendungan/pelabuhan/perumahan/pabrik/utilitas),
  `sistemStruktur` (teks: beton bertulang, baja komposit, pracetak), `skalaFisik` (angka + satuan m², km, lantai, bentang m),
  `nilaiKontrak` (angka + satuan miliar/juta rupiah, boleh rentang), `tahapKeterlibatan` (multi: studi kelayakan/DED/tender/pelaksanaan/pengawasan/serah terima),
  `perangkatLunak` (multi: AutoCAD, SAP2000, ETABS, Revit/BIM, Civil 3D, Tekla, Primavera, MS Project, HEC-RAS),
  `kodeStandar` (multi: SNI 2847, SNI 1726, SNI 1727, ACI, AISC, Bina Marga),
  `hasilJadwalBiaya` (teks: "selesai 3 minggu lebih cepat; efisiensi biaya 4,2%"),
  `k3` (teks: nihil kecelakaan / jam kerja aman).
- **Syarat item kuat:** minimal **dua** dari {`nilaiKontrak`, `skalaFisik`, `hasilJadwalBiaya`} terisi,
  ada `kodeStandar`, ada `tahapKeterlibatan`.
- **Platform:** lembar proyek PDF 1 halaman, LinkedIn. Jangan unggah gambar kerja milik pemberi kerja.
- **Kredensial:** **SKK Konstruksi** (9 jenjang: operator / teknisi-analis / ahli; berlaku 5 tahun; uji kompetensi
  oleh LSP berlisensi BNSP; berkas: KTP, NPWP, ijazah, CV, referensi kerja), SKA lama bila masih dirujuk,
  Ahli K3 Konstruksi Kemnaker, sertifikat BIM, keanggotaan HAKI/PII (IPP/IPM/IPU).
- **Kata kunci:** DED, RAB, BoQ, shop drawing, as-built drawing, pengawasan lapangan, MK, kurva S, uji slump, soil test, CPI/SPI, HSE.
- **Peringatan:** nilai kontrak sering rahasia — sediakan opsi rentang ("Rp 10–25 M") alih-alih angka pasti.

### 6.4 `arsitektur-perencanaan` — Arsitektur, Interior & Perencanaan
- **Jurusan:** Arsitektur, Desain Interior, Arsitektur Lanskap, Perencanaan Wilayah & Kota (PWK).
- **Judul CV:** `PORTOFOLIO KARYA` (alt: `PORTOFOLIO ARSITEKTUR`, `PROYEK DESAIN`)
- **Field khusus:** `tipologi` (pilihan: hunian/komersial/publik/pendidikan/kesehatan/ibadah/kawasan/interior),
  `luasBangunan` (angka m²), `jenisGambar` (multi: **denah, potongan, tampak, detail dinding, aksonometri,
  diagram konsep, site plan, render 3D, maket fisik, sketsa tangan**),
  `tahapProyek` (multi: konsep/skematik/DED/perizinan/pengawasan/terbangun),
  `statusTerbangun` (pilihan: terbangun / dalam konstruksi / konsep / sayembara / tugas studio),
  `perangkatLunak` (multi: AutoCAD, SketchUp, Revit, ArchiCAD, Rhino, Lumion, V-Ray, Enscape, Adobe Suite, QGIS),
  `peranDalamTim` (teks), `penghargaan` (teks: sayembara/juara), `tautanBooklet` (url Issuu/Behance/Drive).
- **Syarat item kuat:** `jenisGambar` memuat minimal satu **gambar teknis** (denah/potongan/detail) — bukan hanya render;
  firma menilai kemampuan menuntaskan desain sampai skala konstruksi. Wajib ada `tautanBooklet` dan `statusTerbangun`.
- **Catatan tetap di UI:** *"Booklet portofolio 10–12 halaman; untuk dilampirkan bersama CV cukup 2–5 halaman A3/A4
  (3 halaman paling lazim diminta). Letakkan pengalaman kantor sebelum tugas kuliah. Tampilkan proses:
  sketsa → diagram → hasil akhir, bukan render saja."*
- **Kredensial:** **STRA** (Surat Tanda Registrasi Arsitek, UU 6/2017), keanggotaan **IAI**,
  SKK Konstruksi klasifikasi arsitektural, sertifikat Green Building (GBCI/EDGE), HDII untuk interior.
- **Kata kunci:** schematic design, design development, gambar kerja, RAB, PBG/IMB, BIM, sustainable design, tata ruang, RTRW, RDTR.
- **Peringatan:** karya kantor wajib menyebut peran pribadi dan izin pemakaian gambar.

### 6.5 `desain-kreatif` — Desain Grafis, UI/UX & Industri Kreatif
- **Jurusan:** DKV, Desain Produk, Animasi, Multimedia, Fotografi, Film & TV, Fashion, Kriya.
- **Sub-bidang:** grafis/branding, UI/UX-produk, ilustrasi, motion/3D, fotografi, videografi, fashion, desain produk.
- **Judul CV:** `PORTOFOLIO KARYA` (alt: `STUDI KASUS DESAIN`)
- **Field khusus (UI/UX):** `tipeProyek` (pilihan: aplikasi mobile/web app/situs/design system/riset),
  `masalah` (teks_panjang: masalah + batasan), `prosesRiset` (multi: wawancara, survei, usability test, A/B test, card sorting),
  `artefak` (multi: user flow, wireframe, prototipe, design system, temuan riset, iterasi),
  `hasil` (teks: "konversi naik 2,1% → 3,4%"), `ukuranTim` (angka), `durasi` (teks), `tools` (multi: Figma, Adobe XD, Maze, Miro).
- **Field khusus (grafis/visual):** `jenisKarya` (pilihan: identitas visual/kemasan/kampanye/editorial/ilustrasi/motion),
  `klien`, `deliverable` (multi: logo, brand guideline, key visual, dieline kemasan, storyboard),
  `jangkauan` (teks: "kampanye menjangkau 240 ribu tayangan"),
  `tools` (multi: Illustrator, Photoshop, InDesign, After Effects, Blender, Premiere, Procreate, CorelDRAW).
- **Syarat item kuat:** ada `masalah` + proses + `hasil` — bukan galeri gambar. Wajib ada tautan studi kasus.
- **Catatan tetap di UI:** *"3–5 studi kasus kuat sudah cukup. Studi kasus pertama dibaca 5–10 menit,
  kedua 3–5 menit, ketiga 1–2 menit — taruh yang terbaik paling depan. Satu proyek = satu masalah inti.
  Perekrut sekarang menilai cara berpikir, bukan tumpukan visual."*
- **Platform:** behance.net, dribbble.com, situs pribadi, medium.com, notion.site, youtube/vimeo, instagram.
- **Kredensial:** BNSP Desainer Grafis Muda, Adobe Certified Professional, Google UX Certificate, NN/g.
- **Kata kunci:** user research, wireframe, prototyping, design system, brand identity, tipografi, color grading, storyboard, motion graphic, Figma.
- **Peringatan:** karya klien perlu izin tayang; karya spekulatif/latihan wajib diberi label agar tidak menyesatkan.

### 6.6 `kedokteran-kesehatan` — Kedokteran & Tenaga Kesehatan
- **Jurusan:** Kedokteran, Kedokteran Gigi, Keperawatan, Kebidanan, Farmasi, Gizi, Fisioterapi, Analis Kesehatan (ATLM),
  Kesehatan Masyarakat, Radiologi, Anestesi, Rekam Medis.
- **Judul CV:** `PENGALAMAN KLINIS & PROSEDUR` + blok terpisah `PUBLIKASI & PENELITIAN`
- **Field khusus:** `jenisKegiatan` (pilihan: rotasi klinis/praktik/jaga IGD/magang/penelitian/pengabdian),
  `departemen` (teks: Penyakit Dalam, Bedah, Obgyn, Anak, ICU), `fasilitas` (teks: RSUD/Puskesmas/Klinik + tipe),
  `volumeKasus` (angka + satuan pasien/tindakan per bulan), `prosedur` (multi: **log prosedur** — jenis tindakan + jumlah),
  `kompetensi` (multi: mengacu SKDI/standar profesi), `pelatihan` (multi: ACLS, ATLS, BTCLS, PPGD, APN, Hiperkes),
  `publikasi` (teks_panjang: sitasi lengkap), `cpdSkp` (angka: SKP profesi terkumpul),
  `luaran` (teks: "angka infeksi luka operasi turun dari 4,1% ke 1,8%").
- **Syarat item kuat:** ada `volumeKasus` **atau** `prosedur` berangka, ada `fasilitas`, dan blok kredensial praktik terisi.
- **Kredensial (blok wajib):** **STR** (Surat Tanda Registrasi) + **SIP** (Surat Izin Praktik) beserta nomor & masa berlaku,
  sertifikat kompetensi kolegium, keanggotaan IDI/PDGI/PPNI/IBI/IAI-Apoteker, pelatihan ber-SKP.
- **Kata kunci:** anamnesis, pemeriksaan fisik, diagnosis banding, tata laksana, rekam medis elektronik,
  patient safety, akreditasi KARS/SNARS, PPI, triase, edukasi pasien, BPJS.
- **Peringatan (tampilkan mencolok):** *"Dilarang menulis identitas pasien, nomor rekam medis, foto luka/pasien,
  atau data yang bisa mengidentifikasi orang. Tulis jumlah dan jenis kasus, bukan kasusnya."*
- **Catatan format:** CV bidang ini wajar lebih dari 2 halaman — daftar publikasi, pelatihan, dan rotasi tidak dipangkas.
  Longgarkan penalti panjang halaman (lihat §7).

### 6.7 `keagamaan` — Keagamaan, Dakwah & Kerohanian
- **Jurusan:** PAI, Ilmu Al-Qur'an & Tafsir, Ilmu Hadis, Hukum Keluarga Islam (Ahwal Syakhshiyyah),
  Perbandingan Mazhab, Ekonomi Syariah, Manajemen Dakwah, Bimbingan Penyuluhan Islam,
  Teologi/Kateketik/Pastoral, Ilmu Agama lain.
- **Judul CV:** `PORTOFOLIO KEILMUAN & PENGABDIAN` (alt: `PENGALAMAN DAKWAH & PENGAJARAN`, `KARYA & PENGABDIAN`)
- **Field khusus:** `jenisKegiatan` (pilihan: pengajaran/dakwah & khutbah/pembinaan tahfidz/penyuluhan/
  penelitian keislaman/penerjemahan/lembaga zakat-wakaf/pendampingan komunitas),
  `capaianHafalan` (teks: "30 juz, mutqin 15 juz" / "10 juz"),
  `sanadIjazah` (teks_panjang: sanad qiraah/kitab + nama guru + lembaga + tahun),
  `kitabDikuasai` (multi: Nahwu-Sharaf, Fiqh, Ushul Fiqh, Tafsir, Hadis, kitab spesifik),
  `bahasa` (multi: Arab aktif/pasif, Inggris, kemampuan baca kitab kuning),
  `jamMengajar` (angka + satuan jam/pekan), `jumlahBinaan` (angka: santri/jamaah/peserta),
  `institusi` (teks: pesantren/madrasah/masjid/majelis/KUA/yayasan/gereja),
  `karyaTulis` (teks_panjang: buku, jurnal, artikel, modul, terjemahan),
  `mediaDakwah` (url: kanal YouTube/podcast/akun kajian + jumlah pengikut/tayangan),
  `programSosial` (teks: penghimpunan zakat/bakti sosial + jumlah penerima manfaat).
- **Syarat item kuat:** ada angka jangkauan (`jumlahBinaan`/`jamMengajar`/tayangan) **atau** bukti otoritas
  keilmuan (`sanadIjazah`/`capaianHafalan`/`karyaTulis`).
- **Kredensial:** ijazah/sanad tahfidz & qiraah, Sertifikasi Da'i / Penyuluh Agama Kemenag,
  sertifikat pendidik (PPG PAI), pembimbing manasik haji/umrah, sertifikat BP4/pranikah,
  DSN-MUI (ekonomi syariah), Sertifikasi Amil Zakat (BAZNAS/LAZ), penyuluh agama non-PNS.
- **Kata kunci:** tahfidz, tahsin, qiraah, kitab kuning, fiqh ibadah, muamalah, dakwah bil-hal, kurikulum PAI,
  moderasi beragama, ekonomi syariah, akad syariah, manasik, bimbingan rohani, kateketik, pastoral.
- **Peringatan:** sebutkan lembaga dan periode agar bisa diverifikasi; hindari klaim otoritas keilmuan tanpa sanad/institusi.
- **Catatan:** pelamar guru agama di sekolah/kementerian sebaiknya menggabungkan dengan skema §6.8.

### 6.8 `pendidikan-keguruan` — Pendidikan & Keguruan
- **Jurusan:** semua program Pendidikan (PGSD, PAUD, PJKR, Bahasa, MIPA, BK, Teknologi Pendidikan), kependidikan kejuruan.
- **Judul CV:** `PORTOFOLIO MENGAJAR` (alt: `PENGALAMAN MENGAJAR & KARYA`)
- **Field khusus:** `jenjangAjar` (pilihan: PAUD/SD/SMP/SMA/SMK/perguruan tinggi/kursus),
  `mataPelajaran` (multi), `jumlahSiswa` (angka), `kurikulum` (pilihan: Merdeka, K13, Cambridge, IB, lainnya),
  `perangkatAjar` (multi: modul ajar, RPP, LKPD, instrumen asesmen, media pembelajaran, bahan ajar digital),
  `hasilBelajar` (teks: "rata-rata nilai ujian naik dari 68 ke 79"), `pembimbinganLomba` (teks: capaian siswa),
  `platform` (multi: Google Classroom, LMS, Canva, Quizizz), `pengembanganDiri` (multi: PPG, MGMP, Guru Penggerak, workshop).
- **Syarat item kuat:** ada `hasilBelajar`/capaian siswa berangka + perangkat ajar buatan sendiri.
- **Kredensial:** **Sertifikat Pendidik (PPG)**, NUPTK, Guru Penggerak, sertifikat asesor, TOEFL/IELTS untuk guru bahasa.
- **Kata kunci:** modul ajar, pembelajaran diferensiasi, asesmen formatif, P5, capaian pembelajaran, kelas inklusif, manajemen kelas.

### 6.9 `akademik-riset` — Akademik & Penelitian
- **Untuk:** pelamar dosen, peneliti, asisten riset, beasiswa S2/S3, LPDP (lintas jurusan).
- **Judul CV:** `PUBLIKASI & PENELITIAN` (alt: `KARYA ILMIAH`, `PENELITIAN & HIBAH`)
- **Field khusus:** `tipeLuaran` (pilihan: artikel jurnal/prosiding/bab buku/buku/paten/HKI/manuskrip dalam review),
  `sitasiLengkap` (teks_panjang: gaya APA/IEEE — **nama sendiri dicetak tebal**),
  `indeksasi` (pilihan: Scopus Q1–Q4, SINTA 1–6, WoS, Garuda, tidak terindeks), `doi` (url),
  `peranPenulis` (pilihan: penulis pertama/korespondensi/anggota),
  `hibah` (teks: pemberi dana, nomor, nilai, peran PI/anggota),
  `konferensi` (teks: nama, kota, tahun, jenis: undangan/oral/poster), `sitasi` (angka), `hIndex` (angka),
  `profilPeneliti` (url: ORCID, Google Scholar, SINTA, Scopus ID, ResearchGate).
- **Syarat item kuat:** sitasi lengkap + indeksasi + DOI/tautan.
- **Aturan format:** urut menurun berdasarkan tahun, dikelompokkan menurut tipe luaran.
  CV akademik memang panjang (5–15 halaman) — matikan penalti panjang untuk bidang ini.
- **Kredensial:** NIDN/NIDK, jabatan fungsional (Asisten Ahli → Guru Besar), Serdos, pengalaman reviewer jurnal.
- **Kata kunci:** metodologi penelitian, analisis statistik, SPSS/R/Python, systematic review, luaran wajib,
  roadmap penelitian, pengabdian masyarakat, Tri Dharma.

### 6.10 `hukum` — Hukum
- **Jurusan:** Ilmu Hukum, Hukum Bisnis, Hukum Internasional, Syariah (lihat juga §6.7).
- **Judul CV:** `PORTOFOLIO PENANGANAN PERKARA` (alt: `PENGALAMAN HUKUM`)
- **Field khusus:** `bidangHukum` (pilihan: pidana/perdata/korporasi/ketenagakerjaan/pertanahan/HKI/pajak/kepailitan/administrasi),
  `peranPerkara` (pilihan: kuasa hukum/legal officer/paralegal/asisten/magang),
  `forum` (teks: PN/PA/PTUN/arbitrase/BANI/nonlitigasi),
  `jenisPekerjaan` (multi: drafting kontrak, legal opinion, due diligence, somasi, gugatan, kepatuhan, perizinan),
  `jumlahDokumen` (angka), `hasil` (teks tanpa membuka identitas: "gugatan dikabulkan sebagian"),
  `contohTulisan` (url: memo hukum/artikel yang sudah dianonimkan).
- **Syarat item kuat:** jenis pekerjaan konkret + volume + minimal satu contoh tulisan (dianonimkan).
- **Kredensial:** **PKPA + Ujian Profesi Advokat + berita acara sumpah (PERADI/KAI)**, sertifikat kurator,
  mediator bersertifikat MA, konsultan HKI, brevet pajak A/B/C, sertifikasi kepatuhan.
- **Kata kunci:** legal drafting, due diligence, legal opinion, kontrak, litigasi, arbitrase, GCG, kepatuhan, perizinan berusaha, OSS.
- **Peringatan (wajib):** hormati kerahasiaan klien — nama pihak dan nomor perkara diganti deskriptor generik.

### 6.11 `bisnis-keuangan` — Bisnis, Keuangan & Akuntansi
- **Jurusan:** Akuntansi, Manajemen, Ekonomi, Perbankan, Keuangan, Perpajakan, Bisnis Digital.
- **Judul CV:** `PORTOFOLIO PROYEK & ANALISIS` (alt: `PROYEK BISNIS`)
- **Field khusus:** `jenisPekerjaan` (pilihan: penyusunan laporan keuangan/audit/perpajakan/analisis investasi/
  anggaran/analisis kredit/pengendalian internal/valuasi),
  `skalaAngka` (teks: "portofolio kredit Rp 42 M", "anggaran Rp 8,5 M"),
  `standar` (multi: PSAK, IFRS, SAK EMKM, SPAP, COSO),
  `perangkat` (multi: Excel lanjutan, Accurate, SAP, Oracle ERP, MYOB, Power BI, Tableau, e-Faktur, Coretax),
  `dampak` (teks: "efisiensi biaya operasional 12%", "temuan audit turun 30%"), `sektorKlien` (teks).
- **Syarat item kuat:** ada angka nominal atau persentase dampak + standar/perangkat.
- **Kredensial:** Brevet Pajak A/B/C, CA IAI / CPA, CPSAK, CFA/CFP/AAJI/WPPE, sertifikasi manajemen risiko (BSMR/LSPP), CIA/QIA.
- **Kata kunci:** rekonsiliasi, jurnal penyesuaian, laporan konsolidasi, arus kas, analisis rasio, budgeting,
  forecasting, SPT, PPh 21/23/badan, PPN, audit substantif.
- **Peringatan:** angka keuangan perusahaan sering rahasia — sediakan opsi rentang/persentase relatif.

### 6.12 `pemasaran-media` — Pemasaran, Komunikasi & Media
- **Jurusan:** Ilmu Komunikasi, Jurnalistik, Public Relations, Periklanan, Broadcasting, Bisnis Digital, Sastra.
- **Judul CV:** `PORTOFOLIO KAMPANYE & KARYA` (alt: `PORTOFOLIO TULISAN`)
- **Field khusus:** `jenisKarya` (pilihan: kampanye digital/artikel-liputan/siaran pers/konten media sosial/
  video/podcast/event/manajemen komunitas),
  `kanal` (multi: Instagram, TikTok, YouTube, Google Ads, Meta Ads, SEO, email, media cetak),
  `metrik` (teks berangka **wajib**: jangkauan, engagement rate, CTR, ROAS, jumlah pembaca, pertumbuhan pengikut),
  `anggaran` (teks: belanja iklan yang dikelola), `peranProduksi` (teks),
  `tautanKarya` (url: artikel tayang/kanal/portofolio tulisan),
  `alatUkur` (multi: Google Analytics, Meta Business Suite, Ahrefs/SEMrush, Looker Studio).
- **Syarat item kuat:** minimal satu metrik berangka + tautan karya yang benar-benar tayang.
- **Kredensial:** Google Ads/Analytics, Meta Blueprint, HubSpot, **Uji Kompetensi Wartawan (UKW) Dewan Pers**, sertifikasi humas BNSP.
- **Kata kunci:** brand awareness, funnel, konversi, copywriting, SEO on-page, media monitoring, komunikasi krisis, KOL management, content calendar.

### 6.13 `industri-manufaktur` — Teknik Industri, Mesin & Manufaktur
- **Jurusan:** Teknik Industri, Teknik Mesin, Otomotif, Manufaktur, Perkapalan, Penerbangan, Metalurgi.
- **Judul CV:** `PORTOFOLIO PROYEK TEKNIS` (alt: `PROYEK PERBAIKAN PROSES`)
- **Field khusus:** `jenisProyek` (pilihan: perbaikan proses/desain produk/pemeliharaan/kendali mutu/K3/
  rantai pasok internal/otomasi),
  `metode` (multi: Lean, Six Sigma DMAIC, Kaizen, 5S, TPM, FMEA, Root Cause Analysis, Value Stream Mapping),
  `perangkat` (multi: SolidWorks, AutoCAD, CATIA, Inventor, ANSYS, Minitab, MATLAB, SAP PM),
  `dampakTerukur` (teks **wajib**: "waktu siklus turun 18%", "downtime mesin turun 240 jam/tahun", "scrap 3,4% → 1,1%"),
  `skalaProduksi` (teks), `standar` (multi: ISO 9001, ISO 45001, ISO 14001, ASME, API, SNI).
- **Syarat item kuat:** `dampakTerukur` berangka + metode perbaikan yang disebut namanya.
- **Kredensial:** Six Sigma Green/Black Belt, Ahli K3 Umum Kemnaker, welding inspector (AWS/CSWIP), operator/teknisi BNSP, auditor ISO.
- **Kata kunci:** OEE, takt time, bottleneck, preventive maintenance, quality control, kalibrasi, inventory turnover, produktivitas.

### 6.14 `energi-tambang-hse` — Migas, Pertambangan, Energi & K3/HSE
- **Jurusan:** Teknik Kimia, Perminyakan, Pertambangan, Geologi, Geofisika, Teknik Lingkungan, K3, Teknik Energi.
- **Judul CV:** `PORTOFOLIO PROYEK & OPERASI` (alt: `PENGALAMAN OPERASIONAL`)
- **Field khusus:** `jenisOperasi` (pilihan: proses/produksi/pengeboran/eksplorasi/pengolahan/pemeliharaan/HSE/lingkungan),
  `fasilitas` (teks: kilang, LNG plant, tambang terbuka, pembangkit, WTP),
  `parameterProses` (teks: kapasitas, tekanan, suhu, throughput),
  `perangkat` (multi: HYSYS, Aspen Plus, Petrel, Surpac, Minescape, ArcGIS, PI System, DCS/SCADA),
  `capaian` (teks berangka: "efisiensi energi naik 6%", "recovery naik 2,3%", "nihil kecelakaan 1.200.000 jam kerja"),
  `k3lRegulasi` (multi: SMK3 PP 50/2012, ISO 45001, ISO 14001, AMDAL, PROPER, CSMS),
  `laporanTeknis` (teks: jenis dokumen yang disusun).
- **Syarat item kuat:** parameter/kapasitas fasilitas + capaian berangka + kepatuhan regulasi.
- **Kredensial:** **Ahli K3 Umum Kemnaker**, POP/POM/POU (pertambangan), sertifikat Migas (BNSP/PPSDM),
  HSE Passport, Basic Sea Survival/HUET, auditor SMK3.
- **Kata kunci:** HAZOP, JSA, permit to work, LOTO, MOC, integritas aset, keandalan, emisi, tailing, reklamasi, ESG, dekarbonisasi.
- **Peringatan:** data produksi/cadangan umumnya rahasia — pakai persentase relatif.

### 6.15 `agro-hayati` — Pertanian, Perikanan, Peternakan, Kehutanan & Veteriner
- **Jurusan:** Agroteknologi, Agribisnis, Budidaya Perairan, Peternakan, Kehutanan, Kedokteran Hewan, Teknologi Pangan, Biologi.
- **Judul CV:** `PORTOFOLIO PROYEK & PENELITIAN LAPANGAN`
- **Field khusus:** `komoditas` (teks), `skalaLahan` (angka + satuan ha/kolam/ekor),
  `metodeBudidaya` (multi: organik, hidroponik, bioflok, smart farming/IoT, integrated farming),
  `hasilProduksi` (teks berangka: "produktivitas 6,2 ton/ha", "SR 87%", "FCR 1,4"),
  `analisisLab` (multi: uji tanah, proksimat, mikrobiologi, PCR),
  `sertifikasi` (multi: GAP, GHP, HACCP, organik, halal, CBIB/CPIB),
  `pendampingan` (angka: jumlah petani/peternak/kelompok yang didampingi).
- **Syarat item kuat:** hasil produksi berangka atau jumlah penerima manfaat.
- **Kredensial:** sertifikat penyuluh pertanian, **STR/SIP dokter hewan (KIVI/PDHI)**, juru sembelih halal (JULEHA),
  auditor halal, PPNS karantina.
- **Kata kunci:** budidaya, pascapanen, rantai dingin, ketahanan pangan, penyuluhan, agribisnis, biosekuriti, kesehatan hewan.

### 6.16 `pariwisata-kuliner` — Pariwisata, Perhotelan & Kuliner
- **Jurusan:** Perhotelan, Tata Boga, Pariwisata, Usaha Perjalanan Wisata, Manajemen Event, Kuliner.
- **Judul CV:** `PORTOFOLIO KARYA & LAYANAN` (alt: `PORTOFOLIO KULINER`)
- **Field khusus:** `jenisKarya` (pilihan: menu/event/paket wisata/operasional outlet/kompetisi),
  `skalaLayanan` (angka: jumlah tamu/porsi/peserta per hari),
  `spesialisasi` (teks: pastry, hot kitchen, barista, banquet, front office),
  `standarHigiene` (multi: HACCP, ISO 22000, laik higiene sanitasi),
  `costControl` (teks: "food cost 34% → 29%"), `penghargaan` (teks: lomba/kompetisi),
  `dokumentasi` (url: Instagram/portofolio foto menu).
- **Syarat item kuat:** skala layanan berangka + spesialisasi jelas.
- **Kredensial:** sertifikat BNSP pariwisata/perhotelan, barista/pastry, HACCP, food handler, sertifikat bahasa asing.
- **Kata kunci:** SOP pelayanan, guest satisfaction, occupancy rate, food cost, plating, mise en place, upselling, PMS (Opera/Realta).

### 6.17 `sosial-humaniora` — Sosial, Psikologi, Pemerintahan & Kemanusiaan
- **Jurusan:** Psikologi, Sosiologi, Antropologi, Ilmu Politik, Hubungan Internasional, Administrasi Publik/Negara,
  Kesejahteraan Sosial, Sastra & Bahasa.
- **Judul CV:** `PORTOFOLIO PROGRAM & PENELITIAN` (alt: `PENGALAMAN PROGRAM`)
- **Field khusus:** `jenisProgram` (pilihan: penelitian sosial/asesmen psikologis/program pemberdayaan/
  advokasi kebijakan/pelayanan publik/penerjemahan),
  `metode` (multi: kuantitatif, kualitatif, FGD, observasi, studi kebijakan, asesmen psikologi),
  `jumlahPenerimaManfaat` (angka), `mitra` (teks: kementerian/LSM/lembaga donor),
  `luaran` (teks: laporan kebijakan, modul pelatihan, publikasi),
  `alat` (multi: SPSS, NVivo, ATLAS.ti, Kobo Toolbox, alat tes psikologi).
- **Syarat item kuat:** jumlah penerima manfaat/responden + luaran nyata.
- **Kredensial:** **Sebutan Psikolog + SIPP (HIMPSI)**, sertifikat pekerja sosial (Peksos),
  penerjemah tersumpah (HPI), pelatihan dasar CPNS/ASN.
- **Peringatan:** hasil asesmen psikologis dan data responden bersifat rahasia — dilarang mencantumkan identitas.

### 6.18 `logistik-procurement` — Logistik, Rantai Pasok & Pengadaan
- **Jurusan:** Manajemen Logistik, Teknik Industri, Manajemen Transportasi, Bisnis.
- **Judul CV:** `PORTOFOLIO PROYEK RANTAI PASOK`
- **Field khusus:** `lingkup` (pilihan: pengadaan/pergudangan/distribusi/ekspor-impor/perencanaan persediaan/vendor management),
  `nilaiTransaksi` (teks: nilai pengadaan yang dikelola), `jumlahVendor` (angka),
  `sistem` (multi: SAP MM, Oracle, Odoo, WMS, e-Procurement, SPSE/LKPP),
  `dampak` (teks berangka: "lead time turun 22%", "penghematan Rp 640 juta"),
  `kepatuhan` (multi: Perpres 16/2018 dan perubahannya, ISO 28000, Incoterms).
- **Syarat item kuat:** nilai/volume + dampak efisiensi berangka.
- **Kredensial:** Ahli Pengadaan Nasional LKPP level 1–3, CIPS, CSCP/CPIM (APICS), Ahli Kepabeanan/PPJK.
- **Kata kunci:** procure-to-pay, negosiasi vendor, HPS/OE, tender, kontrak payung, safety stock, lead time, Incoterms, bea cukai.

### 6.19 `sdm-administrasi` — SDM & Administrasi Perkantoran
- **Jurusan:** Manajemen SDM, Psikologi Industri, Administrasi Bisnis/Perkantoran, Sekretaris.
- **Judul CV:** `PORTOFOLIO PROGRAM SDM`
- **Field khusus:** `lingkup` (pilihan: rekrutmen/pelatihan/manajemen kinerja/hubungan industrial/kompensasi/administrasi personalia),
  `jumlahKaryawan` (angka: populasi yang dilayani),
  `capaian` (teks berangka: "time-to-hire 41 → 24 hari", "turnover turun 6%"),
  `sistem` (multi: Talenta, Gadjian, SAP SuccessFactors, Workday, ATS),
  `regulasi` (multi: UU Ketenagakerjaan, PP 35/2021, BPJS).
- **Kredensial:** Sertifikasi MSDM BNSP, CHRP, asesor kompetensi, Ahli K3 Umum.
- **Kata kunci:** rekrutmen, seleksi, KPI, penilaian kinerja, pelatihan & pengembangan, payroll, PKWT/PKWTT, hubungan industrial.

### 6.20 `seni-pertunjukan` — Seni Pertunjukan, Musik & Budaya
- **Jurusan:** Seni Musik, Seni Tari, Teater, Karawitan, Seni Rupa Murni, Etnomusikologi.
- **Judul CV:** `PORTOFOLIO PERTUNJUKAN & KARYA`
- **Field khusus:** `jenisKarya` (pilihan: pertunjukan/komposisi/pameran/rekaman/penyutradaraan/pengajaran seni),
  `peranSeni` (teks: pemain, komposer, koreografer, sutradara, kurator),
  `tempatTampil` (teks: nama panggung/festival + kota), `skalaPenonton` (angka), `repertoar` (multi),
  `rekaman` (url: YouTube/Spotify/SoundCloud), `penghargaan` (teks), `gradeUjian` (teks: ABRSM/Trinity untuk musik).
- **Syarat item kuat:** tempat/festival jelas + tautan rekaman.
- **Kredensial:** grade ABRSM/Trinity, sertifikat pelatih seni, keanggotaan asosiasi seni.

### 6.21 `umum` — Umum / Belum Menentukan (fallback wajib ada)
- Untuk pengguna lintas bidang, fresh graduate, pindah karier, atau bidang yang belum terdaftar.
- **Judul CV:** `PROYEK & PORTOFOLIO`
- **Field khusus:** field umum + `jenisKarya` (teks bebas) + `hasil` (teks berangka) + `alatMetode` (multi).
- Sediakan tombol **"Bidang saya tidak ada di daftar"** → pakai skema `umum` + formulir saran bidang
  (disimpan untuk pengembangan berikutnya).

---

## 7. Penilaian: dimensi ke-6 "Bukti Karya"

Tambah satu dimensi ke mesin skor yang sudah ada. **Jangan** membuat total melebihi 100 —
turunkan bobot dimensi lain secara proporsional dan tampilkan bobot barunya di UI.

Bobot dimensi baru menyesuaikan bidang:
- Bidang berbasis karya (software, hardware, desain, arsitektur, seni, media): **20%**
- Bidang berbasis proyek/regulasi (sipil, industri, energi, logistik): **15%**
- Bidang berbasis kredensial (kedokteran, hukum, pendidikan, keagamaan, psikologi): **12%**, tetapi
  blok **Kredensial/Lisensi wajib** — kosong = penalti terpisah.
- Bidang akademik: **18%** (publikasi memang portofolionya).

Sub-kriteria (masing-masing 0–100 lalu dibobot):
1. **Kelengkapan item** (25) — jumlah item dalam rentang ideal bidang (umumnya 3–5; akademik & kedokteran tanpa batas atas).
2. **Kekuatan bukti** (25) — persentase item yang memenuhi daftar `wajib` skema bidangnya.
3. **Hasil terukur** (25) — persentase bullet yang mengandung angka/persentase/satuan.
4. **Kejelasan peran** (15) — `peran` + `kontribusi` terisi dan spesifik (bukan "anggota tim").
5. **Higiene tautan** (10) — URL polos, bukan pemendek, maksimal 2 per item, format valid.

Saran perbaikan **harus spesifik bidang**, contoh:
- Software: *"Proyek 'Sistem Absensi' belum punya tautan repo atau demo. Perekrut teknis hampir selalu membukanya."*
- Hardware: *"Belum ada hasil pengukuran. Tambahkan angka hasil uji (efisiensi, ripple, konsumsi arus) — inilah yang membedakan perancang dari perakit."*
- Sipil: *"Proyek 'Jembatan X' belum menyebut skala atau nilai kontrak. Tambahkan bentang, luas, atau rentang nilai proyek."*
- Arsitektur: *"Portofolio hanya berisi render. Tambahkan denah/potongan/detail agar terlihat kemampuan menuntaskan desain."*
- Desain: *"Studi kasus 'Redesain Aplikasi Y' belum menyebut hasil. Tambahkan satu angka: konversi, waktu penyelesaian tugas, atau kepuasan pengguna."*
- Kedokteran: *"Log prosedur belum berisi jumlah. Tulis jenis tindakan dan volumenya, tanpa identitas pasien."*
- Keagamaan: *"Kegiatan pembinaan belum menyebut jumlah santri/jamaah atau jam per pekan. Angka membuat pengabdian jadi terukur."*
- Akademik: *"Publikasi belum mencantumkan indeksasi dan DOI. Tambahkan Scopus/SINTA dan tautan DOI."*

Longgarkan penalti panjang halaman untuk `kedokteran-kesehatan` dan `akademik-riset`;
bidang lain tetap diarahkan 1–2 halaman.

---

## 8. UI/UX

1. **Onboarding singkat:** saat pertama membuat CV, tanyakan bidang. Dropdown dua tingkat + kotak pencarian
   yang mencocokkan **nama jurusan** ("Teknik Informatika" → `software-ti`; "Ahwal Syakhshiyyah" → `keagamaan`;
   "PWK" → `arsitektur-perencanaan`), bukan hanya nama bidang. Boleh dilewati (→ `umum`).
2. **Ganti bidang tidak menghapus data.** Field umum dipertahankan; field khusus yang tidak ada di skema baru
   disimpan di `khusus._arsip` dan ditampilkan sebagai "data dari bidang sebelumnya" dengan tombol pulihkan.
   Tampilkan dialog konfirmasi yang menyebut field mana yang akan disembunyikan.
3. **Form per item:** field umum dulu, lalu blok "Detail khas bidang" yang bisa dilipat.
   Setiap field punya placeholder berisi **contoh nyata** (bukan "isi di sini") dan satu kalimat `bantuan`
   yang menjelaskan kenapa perekrut bidang itu mencarinya.
4. **Tombol "Isi dengan contoh"** per bidang → mengisi satu item contoh penuh yang bisa langsung diedit.
5. **Pratinjau tersorot** — konsisten dengan perilaku yang sudah ada (field yang sedang diisi disorot di CV).
6. **Mode Redaksi (NDA):** sakelar per item; mengganti nama klien menjadi deskriptor generik
   ("Perusahaan energi nasional"), nilai pasti menjadi rentang, dan menyembunyikan nomor part/nama vendor.
   Tampilkan `peringatan[]` bidang di dekat sakelar ini.
7. **Penghitung karakter** per bullet dan indikator langsung "sudah ada angka / belum ada angka".
8. **Urutan item bisa digeser** (drag), default urut tanggal terbaru.
9. **Batas item** ditampilkan sebagai saran, bukan larangan keras
   ("3–5 karya terkuat; sisanya taruh di portofolio terpisah").

---

## 9. Render di CV & ekspor

Format baku satu item (berlaku di semua template dan semua format):

```
JUDUL BAGIAN (huruf kapital, sesuai headingCV bidang)

Judul Karya — Peran | Konteks/Klien | Bulan Tahun – Bulan Tahun
Ringkasan satu kalimat.
• Bullet hasil berangka.
• Bullet hasil berangka.
Detail bidang: Kunci: nilai · Kunci: nilai
tautan-polos.com/a · tautan-polos.com/b
```

- Field khusus dirangkai menjadi **satu baris "Detail bidang"** dipisah titik-tengah — bukan tabel.
- Bila field khusus terlalu banyak, ambil maksimal 4 dengan `prioritas` tertinggi.
- **PDF:** teks asli yang bisa dipilih (bukan gambar). **Word:** paragraf biasa + bullet bawaan, tanpa text box.
  **TXT:** rata kiri, bullet `-`, URL penuh. **JSON:** seluruh objek `PortfolioSection` termasuk `khusus`.
- Uji di semua 10 template: item portofolio tidak boleh terpotong di tengah baris "Detail bidang"
  saat berganti halaman (`break-inside: avoid` pada tiap item).

---

## 10. Pencocokan lowongan & pemindai CV unggahan

- Setiap bidang menyumbang kamus `kataKunciATS` ke mesin pencocokan lowongan yang sudah ada;
  kata kunci dari bidang aktif diberi bobot lebih tinggi.
- Pemindai CV unggahan: tambahkan **deteksi bidang otomatis** dari isi CV (skor kecocokan kata kunci
  tiap bidang) → tawarkan *"Sepertinya CV ini bidang Teknik Sipil. Pakai penilaian bidang ini?"*
- Saat membandingkan sampai 5 CV, gunakan bidang yang sama agar skor sebanding;
  beri peringatan bila bidang antar-CV berbeda.

---

## 11. Migrasi & kompatibilitas

- Tambahkan `schemaVersion` pada dokumen CV. CV lama tanpa `fieldProfile` → `bidang: 'umum'`,
  `portfolio.enabled = false`.
- **Tidak boleh ada CV lama yang skornya berubah** sebelum pengguna mengaktifkan bagian portofolio.
  Bila bobot berubah, tampilkan skor lama sebagai pembanding beserta penjelasan singkat.
- Impor JSON lama tetap harus berjalan. Ekspor JSON baru menyertakan `fieldProfile` + `portfolio`.
- Registry bidang punya nomor versi sendiri; menambah bidang baru tidak memerlukan migrasi basis data.

---

## 12. Kriteria penerimaan (uji sebelum menyatakan selesai)

1. Semua **21 bidang** terdaftar lengkap dengan skema field, contoh terisi, kata kunci, kredensial, dan aturan skor.
2. Pencarian "Kedokteran Gigi", "Ahwal Syakhshiyyah", "PWK", "Tata Boga", "Mekatronika" menemukan bidang yang benar.
3. Mengganti bidang dari `software-ti` ke `arsitektur-perencanaan` tidak menghilangkan judul/peran/tanggal,
   dan field lama bisa dipulihkan.
4. CV dengan 3 item portofolio lengkap memperoleh skor dimensi "Bukti Karya" ≥ 85;
   CV dengan 3 item tanpa angka dan tanpa tautan memperoleh < 50 dengan saran yang menyebut field spesifik.
5. Ekspor PDF, Word, TXT, dan JSON menampilkan bagian portofolio dengan benar di **seluruh 10 template**,
   tetap satu kolom, teks bisa dipilih, URL terbaca sebagai teks polos.
6. Menempel iklan lowongan bidang sipil pada CV bidang sipil menaikkan kecocokan kata kunci dibanding sebelum fitur ini.
7. CV lama (tanpa portofolio) tetap bisa dibuka, disimpan, dan diekspor tanpa error.
8. Mode Redaksi benar-benar mengganti nama klien dan nilai pasti di semua format ekspor.
9. Peringatan kerahasiaan tampil untuk bidang kedokteran, hukum, psikologi, hardware, dan energi.
10. Lolos aksesibilitas dasar: label form terkait, navigasi keyboard, kontras memadai, mode gelap benar.

---

## 13. Urutan pengerjaan

- **Fase 1** — Tipe data + registry bidang (isi 5 bidang dulu: `software-ti`, `sipil-konstruksi`,
  `kedokteran-kesehatan`, `desain-kreatif`, `umum`) + migrasi + `schemaVersion`.
- **Fase 2** — Pemilih bidang + form portofolio dinamis + simpan otomatis.
- **Fase 3** — Render di pratinjau + 10 template + seluruh eksportir.
- **Fase 4** — Dimensi skor "Bukti Karya" + saran spesifik bidang + penyesuaian bobot.
- **Fase 5** — Lengkapi 16 bidang sisanya + blok kredensial + Mode Redaksi.
- **Fase 6** — Integrasi pencocokan lowongan, deteksi bidang otomatis pada CV unggahan, uji penerimaan §12.

Setelah tiap fase: jalankan aplikasi, buktikan hasilnya, dan laporkan berkas yang berubah.

---

## 14. Yang TIDAK boleh dilakukan

- Menambah kolom kedua, tabel, ikon, atau bagan ke dalam CV demi mempercantik portofolio.
- Mengunggah atau menyematkan gambar karya ke dalam berkas CV.
- Membuat judul bagian kreatif di luar whitelist.
- Menaikkan skor hanya karena banyak tautan.
- Mengirim isi CV ke layanan pihak ketiga (pemindaian tetap di peramban, sesuai janji di beranda).
- Menghapus atau mengubah arti 5 dimensi skor lama tanpa menjelaskan perubahan bobot kepada pengguna.
