import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Pembuat PDF uji, tanpa pustaka apa pun.
 *
 * Berkas PDF uji sengaja dibangkitkan, bukan disimpan sebagai berkas biner di
 * dalam repositori. Dengan begitu isinya terbaca sebagai kode - jelas apa yang
 * sedang diuji dan mengapa - dan berkasnya dapat diubah tanpa perlu membuka
 * pengolah dokumen.
 *
 * Strukturnya paling sederhana yang masih sah: satu halaman, huruf Helvetica
 * bawaan, aliran isi tanpa kompresi, dan tabel xref yang offset-nya dihitung
 * sendiri.
 */

interface Line {
  x: number;
  y: number;
  text: string;
}

function buildPdf(lines: Line[]): Buffer {
  const content: string[] = ["BT", "/F1 11 Tf"];
  for (const line of lines) {
    const escaped = line.text
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
    content.push(`1 0 0 1 ${line.x} ${line.y} Tm (${escaped}) Tj`);
  }
  content.push("ET");
  const stream = Buffer.from(content.join("\n"), "latin1");

  const objects: Buffer[] = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    Buffer.from(
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] " +
        "/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    ),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    Buffer.concat([
      Buffer.from(`<< /Length ${stream.length} >>\nstream\n`),
      stream,
      Buffer.from("\nendstream"),
    ]),
  ];

  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n")];
  let offset = chunks[0].length;
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(offset);
    const chunk = Buffer.concat([
      Buffer.from(`${index + 1} 0 obj\n`),
      body,
      Buffer.from("\nendobj\n"),
    ]);
    chunks.push(chunk);
    offset += chunk.length;
  });

  const xrefAt = offset;
  const xref = [`xref\n0 ${objects.length + 1}\n`, "0000000000 65535 f \n"];
  for (const value of offsets) {
    xref.push(`${String(value).padStart(10, "0")} 00000 n \n`);
  }
  xref.push(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`,
  );
  chunks.push(Buffer.from(xref.join("")));

  return Buffer.concat(chunks);
}

function stack(x: number, top: number, texts: string[]): Line[] {
  const lines: Line[] = [];
  let y = top;
  for (const text of texts) {
    if (text) lines.push({ x, y, text });
    y -= 18;
  }
  return lines;
}

/** CV satu kolom yang ditulis mengikuti kaidah - seharusnya bernilai tinggi. */
export const ONE_COLUMN_CV: Line[] = stack(56, 790, [
  "Budi Santoso",
  "Frontend Developer",
  "budi.santoso@email.com - +62 812-3456-7890 - Bontang, Kalimantan Timur",
  "linkedin.com/in/budisantoso",
  "",
  "RINGKASAN PROFIL",
  "Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web produksi",
  "menggunakan React dan TypeScript. Menurunkan waktu muat halaman utama 45%.",
  "",
  "PENGALAMAN KERJA",
  "Frontend Developer - PT Digital Nusantara, Jakarta      Feb 2023 - Sekarang",
  "- Mengembangkan ulang halaman checkout sehingga konversi naik 2,1% ke 3,4%.",
  "- Memimpin tim 4 orang dalam migrasi 60 komponen, memangkas waktu 30%.",
  "- Mengotomasi deployment sehingga waktu rilis turun 40 menit menjadi 6 menit.",
  "",
  "PENDIDIKAN",
  "Sarjana Komputer - Teknik Informatika      Agu 2017 - Jul 2021",
  "Universitas Mulawarman, Samarinda. IPK 3.62 / 4.00",
  "",
  "KEAHLIAN",
  "JavaScript, TypeScript, React, Next.js, Tailwind CSS, Git, REST API",
]);

/**
 * CV dua kolom: kontak dan keahlian di kiri, riwayat di kanan.
 *
 * Bentuk inilah yang paling sering dipakai template CV berdesain, dan paling
 * sering terbaca berselang-seling oleh pengurai ATS - jadi berkas ini menguji
 * dua hal sekaligus: deteksi kolomnya, dan kerusakan teks yang ditimbulkannya.
 */
export const TWO_COLUMN_CV: Line[] = [
  ...stack(50, 790, [
    "Andi Pratama",
    "andi@email.com",
    "+62 811-2233-4455",
    "Jakarta",
    "",
    "KEAHLIAN",
    "Figma",
    "Adobe XD",
    "HTML",
    "CSS",
    "JavaScript",
    "Riset Pengguna",
  ]),
  ...stack(300, 790, [
    "PENGALAMAN KERJA",
    "UI Designer - PT Kreatif Media",
    "Jan 2021 - Sekarang",
    "- Merancang ulang alur pendaftaran sehingga penyelesaian naik 22%.",
    "- Menyusun sistem desain berisi 40 komponen bersama tim produk.",
    "",
    "PENDIDIKAN",
    "Sarjana Desain Komunikasi Visual",
    "Universitas Trisakti, 2016 - 2020",
  ]),
];

export function writePdf(path: string, lines: Line[]): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buildPdf(lines));
}

/** Menulis kedua berkas uji dan mengembalikan alamatnya. */
export function writeFixtures(dir: string): {
  oneColumn: string;
  twoColumn: string;
} {
  const oneColumn = join(dir, "cv-satu-kolom.pdf");
  const twoColumn = join(dir, "cv-dua-kolom.pdf");
  writePdf(oneColumn, ONE_COLUMN_CV);
  writePdf(twoColumn, TWO_COLUMN_CV);
  return { oneColumn, twoColumn };
}
