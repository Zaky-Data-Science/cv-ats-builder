# ADDENDUM v2.1 — tambalan untuk `PROMPT_Fitur_Portofolio_Universal_v2.md`

> Tempel berkas ini **setelah** prompt v2, dalam pesan yang sama.
> Isinya menimpa bagian v2 yang disebut. Sisanya tetap berlaku apa adanya.
> Alasan tiap tambalan ditulis singkat — supaya AI yang mengerjakan tidak "memperbaiki" balik.

---

## A. §9.2 — Rumus P × Q × R harus deterministik (WAJIB, ini tambalan terpenting)

v2 menyuruh memakai model FAIP tapi **tidak mendefinisikan fungsinya**. FAIP dinilai manusia yang
membaca narasi; aplikasi ini harus menghasilkan angka yang sama untuk data yang sama, dan tiap
angka harus bisa diklik ke field penyebabnya. Tanpa rumus eksplisit, implementer akan mengarang
sendiri — dan hasilnya tidak akan lolos kriteria §14 poin 4.

**Pakai rubrik ini persis.** Tiap faktor bernilai **0–3**, dibaca dari field yang sudah ada.

**Q — peranan** (dari `peran`, `kontribusi`, `tahapKeterlibatan`):

| Nilai | Kondisi |
|---|---|
| 0 | `peran` kosong, atau hanya kata generik ("anggota tim", "peserta", "kontributor") |
| 1 | peran spesifik disebut, tapi tanpa kata kerja teknis apa pun |
| 2 | peran spesifik + minimal 1 kata kerja orang pertama pada `poin`/`inti` |
| 3 | nilai 2, **dan** `tahapKeterlibatan` (atau padanannya per pola) memuat ≥1 tahap eksekusi — pelaksanaan, pengujian, bring-up, commissioning, rilis |

**R — tingkat kesulitan** (dari `skalaProyek` / `volume` / `skalaDikelola`, `standarKode`, `hasilTerukur`):
nilai = **jumlah** dari yang terpenuhi, maksimal 3 —
(a) skala terisi dengan angka + satuan; (b) `standarKode`/`metodeStandar` memuat ≥1 entri;
(c) `hasilTerukur`/`hasil`/`luaran`/`metrikDampak` memuat angka.

**Skor item** = `(Q × R) / 9 × 100`, lalu:
- `+8` bila `verifikator` lengkap (pola yang `butuhVerifikator`)
- `+4` bila `refleksi` terisi ≥ 80 karakter — **maksimal +4, sekali per item, tidak akumulatif**
- `−15` bila tidak ada satu pun tautan valid **pada pola yang mensyaratkannya**
  (`karya-visual`, `karya-terkredit`). Untuk pola lain, tautan tidak memengaruhi skor.
- Hasil akhir dijepit ke rentang 0–100.

**P — banyaknya pengalaman** dipakai sebagai **pengali agregat**, bukan komponen item:

```
n      = jumlah item aktif
[a, b] = rentangItemIdeal pola          // b boleh null
P      = n < a          -> n / a                    // kurang dari ideal, dipotong proporsional
         n dalam [a, b] -> 1
         b === null     -> 1                        // 'karya-terkredit': tidak ada batas atas
         n > b          -> 1                        // TIDAK dihukum; hanya 4-6 item terkuat dirender
```

**Skor bagian** = `rata-rata(skor item terbaik sebanyak b, atau semua bila b null) × P`.

> ⚠️ **Jangan memakai ambang FAIP 600/3.000/6.000 sebagai skala.** Angka itu untuk akumulasi
> karier 3/8/16 tahun, bukan untuk satu bagian CV. Meminjam strukturnya (P×Q×R) benar;
> meminjam angkanya salah kategori. `jenjangKKNI` masuk lewat §B, bukan lewat ambang ini.

**Uji wajib:** dengan rubrik di atas, 3 item lengkap + verifikator harus menghasilkan ≥85
(Q=3, R=3 → 100, +8 → dijepit 100; P=1) dan 3 item tanpa angka tanpa tautan menghasilkan <50
(Q≤1, R≤1 → ≤11). Kriteria §14 poin 4 baru bisa lolos setelah rubrik ini dipakai.

---

## B. Jenjang pemula — `wajib` tidak boleh sama untuk mahasiswa dan senior

`jenjangKKNI` ada di tipe data v2 tapi **tidak dipakai di mana pun**. Akibatnya mahasiswa dan
fresh graduate — sebagian besar pengguna aplikasi ini — menghadapi form yang mensyaratkan
`verifikator`, `hasilTerukur` berangka, dan `standarKode` yang memang belum mereka punya,
lalu mendapat skor rendah tanpa jalan keluar. Itu membuat orang berhenti memakai aplikasi.

**Tambahkan `jenjang` ke onboarding** (pertanyaan ketiga, satu baris):
*mahasiswa · baru lulus · 1–3 tahun · 4–8 tahun · di atas 8 tahun.*

**Perilaku:**

| Jenjang | Penyesuaian |
|---|---|
| mahasiswa / baru lulus | `verifikator` **tidak wajib** (jadi saran: "dosen pembimbing atau ketua tim juga sah"). `hasilTerukur` boleh berupa hasil pengujian/tugas, bukan hasil bisnis. `statusKarya` "tugas kuliah" **tidak menurunkan skor** — hanya wajib diberi label jujur. `rentangItemIdeal` batas bawah turun jadi 2. |
| 1–3 tahun | default penuh, `verifikator` disarankan |
| 4 tahun ke atas | default penuh, `verifikator` wajib untuk `proyek-teknis` |

Saran perbaikan untuk jenjang pemula harus berbeda nadanya: *"Tugas kuliah tetap dihitung.
Yang membedakannya: sebut hasil pengukurannya dan apa yang Anda kerjakan sendiri."*

---

## C. §3.7 & §14 poin 9 — jangan hapus kata "ATS" dari seluruh produk

Alasan v2 benar: **angkanya** tidak boleh mengklaim memprediksi keputusan ATS. Tapi
kesimpulannya terlalu jauh. "CV ATS" adalah **kata yang diketik pengguna Indonesia di mesin
pencari** dan nama domain produk ini sendiri (`cv-ats-builder`). Menghapusnya dari copy beranda
membuang penemuan produk tanpa menambah kejujuran apa pun.

**Yang benar:**
- **Pertahankan** "ATS" sebagai kata kategori — nama produk, judul beranda, penjelasan masalah.
- **Ganti hanya nama angkanya**, dari "Skor ATS" jadi dua angka §3.7.
- Tambahkan tooltip permanen di sebelah angka: *"Angka ini menilai struktur dan kecocokan kata
  kunci CV Anda. Ia tidak memprediksi keputusan sistem perekrutan mana pun — tiap perusahaan
  menyetel filternya sendiri."*

**Ganti kriteria §14 poin 9** jadi: *"Tidak ada satu pun tempat di UI yang menyebut angka hasil
penilaian sebagai 'Skor ATS', dan tooltip penjelas muncul di sebelah kedua angka. Kata 'ATS'
sebagai istilah kategori tetap boleh dipakai."*

---

## D. Bobot: aturan renormalisasi harus eksplisit

v2 berkata "turunkan bobot dimensi lain secara proporsional" **dan** "skor CV lama tidak boleh
berubah sebelum portofolio diaktifkan". Dua kalimat itu hanya konsisten kalau aturannya ditulis:

```
portofolio.aktif === false  -> bobot Bukti Karya = 0; 5 dimensi lama memakai bobot asli, total 100
portofolio.aktif === true   -> bobot Bukti Karya = bobotBuktiKarya pola;
                               5 dimensi lama dikalikan (100 - bobotBuktiKarya) / 100
```

Saat pengguna mengaktifkan portofolio pertama kali, tampilkan satu baris:
*"Bobot penilaian berubah karena bagian portofolio aktif. Skor sebelumnya: 87."*

---

## E. `gabungKePengalaman` — harus menempel pada entri kerja tertentu, bukan sekadar dirender di bawahnya

Ini konsekuensi yang belum ditarik penuh di v2. RChilli mengharapkan proyek **bersarang di dalam
satu blok pengalaman** dengan tanggal yang **berada dalam rentang masa kerja induknya**. Merender
item lepas di bawah judul `PENGALAMAN KERJA` tidak memenuhi itu, dan menciptakan risiko baru:
pemberi kerja yang sama tercetak dua kali (sekali sebagai pekerjaan, sekali sebagai proyek).

**Tambahkan:**
- Field `parentPengalamanId?: string` pada `ItemPortofolio`.
- Saat sakelar diaktifkan, untuk tiap item tawarkan pilihan entri pengalaman kerja sebagai induk;
  cocokkan otomatis bila `konteks` sama persis dengan nama perusahaan pada entri itu.
- **Validasi:** `mulai`/`selesai` item harus berada di dalam rentang entri induk. Bila di luar,
  beri peringatan dan tawarkan lepaskan dari induk.
- **Dedup:** item yang punya induk **tidak boleh** juga muncul di bagian portofolio terpisah,
  dan kata kuncinya dihitung sekali saja untuk Kecocokan Lowongan.
- Item tanpa induk (freelance, tugas kuliah, open source) tetap di bagian portofolio sendiri
  meski sakelar aktif.
- **Ubah default:** jangan aktif otomatis. Tampilkan sebagai tawaran sekali —
  *"3 dari 4 karya Anda punya pemberi kerja. Gabungkan ke Pengalaman Kerja?"* — dengan pratinjau
  sebelum/sesudah. Mengubah struktur CV pengguna tanpa mereka sadari adalah kejutan yang buruk.

---

## F. `verifikator` — satu sumber kebenaran + kewajiban PDP

**Duplikasi definisi.** §5 menaruh `verifikator` sebagai field tingkat item; §6.2 menaruhnya lagi
sebagai salah satu "7 field inti" pola `proyek-teknis`. Pilih satu: **tingkat item saja**,
kemunculannya dikendalikan `butuhVerifikator` di skema pola. Hapus barisnya dari tabel §6.2.

**Yang terlewat sama sekali di v2 dan analisisnya:** nama, jabatan, dan hubungan atasan adalah
**data pribadi milik orang lain** yang tidak pernah menyetujui penyimpanannya. Aplikasi ini
menyimpan ke basis data — jadi UU 27/2022 (PDP) berlaku, bukan sekadar etika.

**Wajib:**
- Teks di bawah field: *"Data ini tidak dicetak di CV dan tidak dikirim ke mana pun. Simpan hanya
  bila Anda sudah izin ke orang tersebut."*
- Ikut terhapus saat pengguna menghapus akun (§ fitur hapus akun yang sudah ada).
- Ikut dalam ekspor JSON milik pengguna, tapi **dikecualikan** dari mode "Salin ke Form Portal"
  bila fitur itu jadi dikerjakan.

---

## G. Blok agregat SKP — ambang harus data, bukan konstanta, dan butuh sanggahan

Ide terbaik di v2, tapi begitu aplikasi menampilkan "SKP Anda 180 dari 250", pengguna akan
memakainya untuk memutuskan perpanjangan izin praktik. Kalau angkanya usang, kerugiannya nyata.

- Simpan ambang di `lib/portfolio/ambang-profesi.ts` sebagai **data yang bisa diedit**, dengan
  field `sumber` (nama peraturan) dan `diperbarui` (tanggal) yang **ditampilkan di UI**.
- Sanggahan tetap di bawah progress bar: *"Perhitungan mandiri, bukan pengganti catatan resmi
  di Plataran Sehat / SATUSEHAT SDMK. Ambang mengacu KMK 1561/2024 — periksa aturan terbaru."*
- Jangan pernah menulis kalimat yang menyatakan pengguna "sudah memenuhi syarat perpanjangan SIP".

---

## H. Tambalan kecil tapi akan menggigit saat implementasi

1. **`rentangItemIdeal: [1, null]`** — `null` sebagai batas atas akan meledak di aritmatika P.
   Penanganannya sudah ditulis di §A; pastikan ada uji unitnya.
2. **`refleksi`** — v2 bilang "menambah skor" tanpa batas. Sudah dibatasi +4 di §A. Jangan ada
   jalur lain yang menambah skor dari field ini.
3. **Bagian kosong.** Tambahkan kriteria penerimaan: *bagian portofolio yang `aktif: true` tapi
   nol item tidak boleh mencetak judul bagian kosong di PDF/Word/TXT mana pun.*
4. **`detailTambahan` yang tidak dicetak** — v2 sudah menyuruh menampilkan indikator
   "2 detail tidak dicetak". Tambahkan: yang tidak dicetak **tetap ikut** dihitung di
   Kecocokan Lowongan (kata kuncinya tetap milik pengguna), tapi **tidak** ikut faktor R.
5. **Higiene tautan** — §9.2 memindahkannya jadi validasi, tapi §14 poin 4 masih menguji
   "tanpa tautan → <50". Sudah didamaikan di §A (penalti −15 hanya untuk dua pola).
6. **Klaim enum parser.** Daftar 26 `SectionType` di §3.2/§3.8 tidak bisa saya verifikasi ulang
   dari dokumentasi publik. Kesimpulan desainnya tetap aman — karena `gabungKePengalaman` dibuat
   sebagai **pilihan**, bukan paksaan. Tapi **jangan cetak daftar enum itu di UI atau dokumentasi
   pengguna**; pakai hanya sebagai alasan internal. (Masukkan ke §17.2 "belum terverifikasi".)
7. **STR seumur hidup — terverifikasi benar**, dan dasarnya bisa disebut lebih lengkap:
   UU 17/2023 sebagai payung, **PP 28/2024** sebagai aturan pelaksananya. Boleh ditulis di UI.

---

## I. Cara menembakkan prompt ini (jangan sekali tembak)

v2 berisi 7 fase yang menyentuh model data, form, 10 template, 4 eksportir, mesin skor, **dan
penggantian nama di seluruh copy produk**. Dikirim sekaligus, kemungkinan besar yang Anda dapat
adalah aplikasi setengah bermigrasi yang tidak bisa dijalankan.

**Tambahkan ini ke §0 sebagai aturan kerja nomor 7:**

> **Berhenti di akhir tiap fase.** Jangan mulai fase berikutnya sebelum saya bilang lanjut.
> Di akhir tiap fase: jalankan aplikasi, tunjukkan buktinya, sebutkan berkas yang berubah,
> dan tunggu.

**Urutan sesi yang disarankan:**

| Sesi | Fase | Kenapa dipisah |
|---|---|---|
| 1 | Fase 1–2 (tipe data, 5 pola, kamus, migrasi) | fondasi; kalau salah, semua salah. Uji migrasi CV lama dulu sebelum lanjut. |
| 2 | Fase 3–4 (form, render, 10 template, eksportir) | paling banyak berkasnya; butuh konteks bersih |
| 3 | Fase 5 (skor + rename) | **jangan digabung** — mengubah angka sambil mengubah struktur membuat Anda tidak tahu mana yang menyebabkan skor bergeser |
| 4 | Fase 6–7 (kredensial, agregat, validator, integrasi) | tambahan di atas fondasi yang sudah terbukti |

Sebelum sesi 1: **commit dulu kode yang ada sekarang**, dan buat cabang baru.
