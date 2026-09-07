<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Aturan tetap project ini

> Bagian di atas ditulis ulang otomatis oleh `next dev`. Bagian di bawah ini
> milik project dan tidak ikut ditimpa.

## Kode wajib rapi, terstruktur, dan berkomentar

Dikunci pemilik project pada 7 September 2026, dan berlaku untuk **perintah apa
pun** - bukan hanya perubahan yang sedang dikerjakan:

> "aku mau semua apapun nanti tambahan coding nanti harus rapi terstruktur dan
> wajib selalu ada comment biar gk membingungkan ... biar gk berantakan isi
> codingannya pas saya buka di vscode."

**Alasannya menentukan bentuk komentarnya.** Ia membuka kodenya sendiri di VS
Code dan menyunting dengan tangan. Yang dibutuhkan bukan komentar yang
menjelaskan bahasa pemrogramannya - itu sudah diketahui - melainkan komentar
yang menyebutkan **akibat**: angka ini mengatur bagian yang mana, dan apa yang
bergeser kalau diubah.

Contohnya dari dia sendiri: *"rapikan landing page kolomnya ini dan 10px itu
tinggi landing page dan lainnya."*

### Lima aturan yang harus dipenuhi

1. **Tiap berkas punya kepala.** Apa isinya, dan apa yang menentukan bentuknya.

2. **Tiap angka yang mengatur rupa diberi nama akibatnya**, di baris yang sama
   atau tepat di atasnya. Bukan:

   ```tsx
   max-w-[92rem]   /* 92rem */
   ```

   melainkan:

   ```tsx
   /* SETELAN: lebar isi hero. Naikkan kalau judul pecah tiga baris di layar
      lebar; turunkan kalau celah tengahnya menganga. */
   max-w-[92rem]
   ```

3. **Bagian yang punya banyak setelan diberi blok `PETA SETELAN`** di kepalanya:
   satu tabel berisi nama setelan, nilai sekarang, letaknya, dan apa yang
   berubah kalau diubah. Ini yang paling sering dipakai saat menyunting tangan.

4. **Alasan di balik keputusan tetap ditulis**, terutama bentuk yang pernah
   dicoba lalu ditolak - supaya tidak dicoba lagi oleh sesi berikutnya.

5. **Berlaku untuk kode baru maupun kode lama yang kebetulan disentuh.** Jangan
   menambah baris tanpa komentar hanya karena sekitarnya belum berkomentar.

### Bahasa

Komentar ditulis dalam **bahasa Indonesia**, sama seperti seluruh komentar yang
sudah ada. Nama variabel dan fungsi boleh Indonesia atau Inggris mengikuti
sekitarnya - yang wajib bahasa Indonesia komentarnya.

### Yang bukan komentar yang baik

- Mengulang kodenya: `// menyetel lebar menjadi 92rem` - tidak menambah apa pun.
- Menyebut "penting" tanpa menyebut apanya.
- Komentar yang tidak diperbarui saat angkanya berubah. Kalau mengubah nilai,
  perbarui komentarnya di komit yang sama.
