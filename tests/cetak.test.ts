import { readFileSync } from "node:fs";
import { check, section } from "./harness";

/**
 * Mengunci cara halaman cetak disiapkan.
 *
 * Berbeda dari berkas uji lain di folder ini, yang diperiksa bukan keluaran
 * sebuah fungsi melainkan **bentuk kodenya sendiri**. Itu disengaja, dan
 * alasannya ada pada riwayat cacatnya: ekspor PDF sudah rusak dua kali dengan
 * gejala berbeda, keduanya lolos dari seluruh pemeriksaan yang ada.
 *
 *  - Sesi 5: bingkai tersembunyi tak berukuran membuat Chrome mencetak halaman
 *    editor. "Diperbaiki" dengan memberi bingkainya ukuran sungguhan.
 *  - Sesi 6: perbaikan itu ternyata tidak bertahan. Yang keluar satu halaman
 *    kosong, dan kop halamannya justru menunjukkan alamat editor - bukti
 *    dokumen induknya yang tercetak. Bingkainya dibuang sama sekali.
 *
 * Keduanya lolos karena hasil cetak sungguhan hanya dapat diperiksa dengan
 * menjalankan peramban, dan pemeriksaan itu tidak berjalan pada `npm test`.
 * Yang dapat dikunci di sini adalah syarat-syarat yang membuat cetaknya benar.
 * Bila salah satu dilanggar, berkas ini gagal - dan orang yang melanggarnya
 * membaca alasannya di sini, bukan menemukannya lagi lewat PDF yang rusak.
 */

const baca = (p: string) => readFileSync(p, "utf8");

export function runCetakTests(): void {
  section("Penyiapan halaman cetak");

  const editor = baca("src/components/editor/ResumeEditor.tsx");

  check(
    "editor tidak lagi mencetak lewat bingkai tersembunyi",
    !/createElement\("iframe"\)/.test(editor),
    "iframe adalah akar dua cacat cetak sebelumnya",
  );
  check(
    "tombol PDF menuju halaman cetak dengan penanda cetak sendiri",
    /cetak\?cetak=1/.test(editor) && /print\?cetak=1/.test(editor),
    "satu untuk mode tamu, satu untuk mode berakun",
  );

  const halamanCetak = [
    "src/app/resume/[id]/print/page.tsx",
    "src/app/cetak/GuestPrint.tsx",
  ];

  for (const path of halamanCetak) {
    const isi = baca(path);
    const nama = path.split("/").pop();

    // Margin @page harus nol di KEEMPAT sisi. Diuji dengan Chrome sungguhan:
    // margin 2mm pun masih memunculkan kop dan kaki bawaan peramban - tanggal,
    // judul tab, alamat halaman, dan nomor "1/2". Kop itu tidak boleh ikut
    // tercetak pada CV yang dikirim ke perusahaan.
    check(
      `${nama}: aturan @page bermargin nol`,
      /@page \{ size: \$\{[^}]+\}; margin: 0; \}/.test(isi),
      "margin apa pun selain nol memunculkan kop/kaki Chrome",
    );

    // Karena @page tidak lagi menyediakan margin, kertasnya yang menyediakan.
    check(
      `${nama}: kertas merender dengan padding penuh`,
      /padding="full"/.test(isi),
      "padding inilah yang menggantikan margin @page",
    );
    check(
      `${nama}: tidak lagi memakai padding="none"`,
      !/padding="none"/.test(isi),
      "padding nol membuat teks menempel ke tepi kertas",
    );
  }

  const css = baca("src/app/globals.css");
  const blokCetak = css.slice(css.indexOf("@media print"));

  check(
    "aturan cetak menyalin padding ke setiap pecahan halaman",
    /box-decoration-break:\s*clone/.test(blokCetak),
    "tanpa ini, halaman kedua dan seterusnya tercetak tanpa margin atas",
  );
  check(
    "varian berawalan ikut ditulis untuk Chrome",
    /-webkit-box-decoration-break:\s*clone/.test(blokCetak),
  );

  section("Halaman cetak berdiri sendiri");

  const bilah = baca("src/components/preview/PrintToolbar.tsx");
  check(
    "halaman cetak memanggil dialog cetaknya sendiri saat diminta alamat",
    /params\.get\("cetak"\) !== "1"/.test(bilah) && /window\.print\(\)/.test(bilah),
    "inilah mekanisme yang menggantikan bingkai tersembunyi",
  );
  check(
    "tersedia tombol cetak manual sebagai jalan cadangan",
    /onClick=\{\(\) => window\.print\(\)\}/.test(bilah),
    "bila dialognya ditutup, pengguna tidak kehabisan jalan",
  );
  check(
    "bilahnya sendiri tidak ikut tercetak",
    /no-print/.test(bilah) && /\.no-print/.test(css),
  );
}

