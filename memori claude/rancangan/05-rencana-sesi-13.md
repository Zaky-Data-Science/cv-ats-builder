# Besok — lanjutan CV ATS Builder

Ditulis 4 September 2026, 23:30. Buka **satu** jendela Claude Code di `D:\Website CV dan Portofolio`.

## Keadaan saat berhenti

- Cabang `main`, working tree **bersih**, commit terakhir `7097783`.
- **8 commit belum di-push.** Fitur portofolio berbasis pola selesai tujuh fase,
  dokumentasi sudah dirapikan, catatan `memori claude/` sudah diperbarui.
- 708 uji lulus, `typecheck` dan `lint` bersih.
- Titik pulang kalau ada apa-apa: `a2bc0be` (sebelum fitur ini dimulai).

## Urutan kerja besok

### 1. Uji manual 1–4 (±30 menit)

Ikuti `docs/uji-manual.md` di dalam folder proyek. Kerjakan di localhost, jangan
di produksi. Yang paling penting **Uji 3 (Mode Redaksi)** dan **Uji 4 (hapus
akun)** — kalau dua itu bocor, bocornya ke data orang.

### 2. Perbaiki bug penyamaran angka

Kirim prompt ini:

> Perbaiki bug di `samarkanAngka()` (`src/lib/portfolio/redaksi.ts:81`, dipanggil dari `render.ts:376`). Angka yang **bukan besaran** ikut disamarkan:
>
> ```
> "8.400 m2"           -> "8.000-9.000 m2-3"       salah, harusnya "8.000-9.000 m2"
> "luas 120 m3"        -> "luas 100-200 m3-4"      salah
> "Kapasitas 2x15 MW"  -> "Kapasitas 2-3x10-20 MW" salah, pengali ikut kena
> ```
>
> Penyebabnya penyamaran dikenakan pada baris "Detail" yang sudah menggabungkan nilai dengan satuannya, jadi angka apa pun di string itu kena. Perbaiki supaya hanya besarannya yang disamarkan — angka yang menempel pada huruf satuan (`m2`, `m3`, `km2`) dan angka pengali sebelum `x` harus dilewati.
>
> Tambahkan uji untuk keenam kasus di atas plus yang sudah benar (`8.400 m²`, `137 pasien/bulan`, `Rp 42 M`, `4,2%`, dan tahun `2024` yang memang tidak disamarkan). Jalankan `npm test`, `npm run typecheck`, `npm run lint`, lalu commit. Jangan push.

Ini cacat tampilan, bukan kebocoran — penyamaran hanya menambah kabur, tidak
pernah membuka data. Tapi "8.000-9.000 m2-3" terbaca seperti aplikasi rusak di
berkas yang dikirim ke perusahaan.

### 3. Push

```bash
git push
```

Aman: `vercel.json` menjalankan `prisma generate && prisma migrate deploy &&
next build`, jadi kedua migrasi masuk ke Neon sebelum kode baru hidup. Kalau
migrasinya gagal, build gagal dan **situs lama tetap melayani pengunjung**.

### 4. Uji 5 — periksa produksi

Bagian terakhir `docs/uji-manual.md`. Kalau ada yang salah: Vercel →
**Deployments** → pilih deploy sebelumnya → **Promote to Production**.

## Yang sengaja ditinggalkan

- Simpul "tebakan bentuk portofolio" belum ada di diagram alur pembanding.
  Menambahnya mengubah bentuk diagram — keputusan desain, bukan perapian.
- Backlog opsional yang belum disentuh: Mode "Salin ke Form Portal" (paling
  berharga — sebagian besar pelamar Indonesia mengisi profil terstruktur di
  Jobstreet/Glints, bukan mengunggah CV), impor ORCID, ekspor versi teaser.
- Tombol panah pengurut bagian sudah dapat `aria-label`; kontras dan navigasi
  papan ketik belum diuji dengan pembaca layar sungguhan.

## Catatan

`memori claude/` dilacak git, jadi ikut terkirim ke GitHub saat push. Kalau repo
`Zaky-Data-Science/cv-ats-builder` publik, catatan kerjamu ikut terbaca publik.
Putuskan sebelum push kalau itu mengganggu.
