import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { strFromU8, unzipSync } from "fflate";
import { ResumeDocument } from "../src/components/preview/ResumeDocument";
import { buildDocx } from "../src/lib/docx/build";
import { AMBANG_PROFESI, ambangProfesi } from "../src/lib/portfolio/ambang-profesi";
import { periksaBahasa } from "../src/lib/portfolio/bahasa";
import { entriKamus } from "../src/lib/portfolio/kamus-bidang";
import { keteranganKredensial, masaBerlakuTeks } from "../src/lib/portfolio/kredensial";
import { bagianPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { POLA_SCHEMAS } from "../src/lib/portfolio/pola-schemas";
import { samarkanAngka, samarkanKonteks } from "../src/lib/portfolio/redaksi";
import { emptyCertification } from "../src/lib/resume/factory";
import { resumeToPlainText } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import { certificationSchema } from "../src/lib/resume/schema";
import { toExportFile } from "../src/lib/resume/serialize";
import type { ResumeData } from "../src/lib/resume/types";
import { check, equal, section } from "./harness";

/**
 * Kredensial, blok agregat, Mode Redaksi, dan validator bahasa.
 *
 * Empat hal yang tidak berbagi kode, tetapi berbagi satu sifat: masing-masing
 * menyentuh hal yang kalau salah merugikan penggunanya di luar layar - izin
 * praktik yang telanjur kedaluwarsa, perjanjian kerahasiaan yang dilanggar,
 * atau penilai kompetensi yang tidak dapat menemukan kontribusi pribadinya.
 */

const NAMA_KLIEN = "PT Nusantara Energi Jaya";

function cvRedaksi(modeRedaksi: boolean): ResumeData {
  const dasar = sampleResume("uji", "id");
  return {
    ...dasar,
    profilPortofolio: {
      ...dasar.profilPortofolio,
      pola: "proyek-teknis",
      bidangKamus: "energi-tambang-hse",
      sudahDitanya: true,
    },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, modeRedaksi },
    projects: [
      {
        ...dasar.projects[0],
        name: "Revitalisasi Unit Proses",
        role: "Insinyur Proses",
        konteks: NAMA_KLIEN,
        ringkasan: "Menaikkan throughput unit dari 8.400 ton menjadi 9.100 ton.",
        bullets: ["Saya menghitung ulang neraca massa pada beban 42 ton per jam."],
        inti: {
          jenisProyek: "Unit proses kilang",
          skalaProyek: "8.400 ton/hari",
          standarKode: ["API"],
          hasilTerukur: ["Throughput", "8.400 ton", "9.100 ton", "6 bulan"],
          tahapKeterlibatan: ["commissioning"],
        },
        tautan: [{ label: "", url: "https://contoh.test/laporan" }],
      },
    ],
  };
}

function teksDocx(buffer: Buffer): string {
  const isi = unzipSync(new Uint8Array(buffer));
  return strFromU8(isi["word/document.xml"])
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

export async function runFase6Tests(): Promise<void> {
  /* ---------------------------------------------------------------- */

  section("Kredensial: masa berlaku menerima seumur hidup");

  /*
    Inilah kesalahan yang paling lazim ditemui di aplikasi CV Indonesia sejak
    UU 17/2023: kolom masa berlaku yang hanya menerima tanggal, sementara STR
    Definitif memang tidak punya tanggal kedaluwarsa.
  */
  const seumurHidup = {
    ...emptyCertification(),
    name: "STR (Surat Tanda Registrasi)",
    issuer: "Konsil Kesehatan Indonesia",
    kategori: "lisensi-praktik" as const,
    masaBerlaku: "seumur-hidup" as const,
    expiryDate: "",
  };
  const tervalidasi = certificationSchema.safeParse(seumurHidup);
  check(
    "kredensial seumur hidup lolos validasi tanpa tanggal kedaluwarsa",
    tervalidasi.success,
    tervalidasi.success ? "" : JSON.stringify(tervalidasi.error.issues[0]),
  );
  equal(
    "keterangannya berbunyi seumur hidup, bukan tanggal kosong",
    masaBerlakuTeks(seumurHidup),
    "Berlaku seumur hidup",
  );
  equal(
    "kredensial yang memang tidak punya masa berlaku tidak mencetak apa pun",
    masaBerlakuTeks({ ...seumurHidup, masaBerlaku: "tidak-berlaku" }),
    "",
  );
  equal(
    "yang berbatas tanggal tetap mencetak tanggalnya",
    masaBerlakuTeks({
      ...seumurHidup,
      masaBerlaku: "tanggal",
      expiryDate: "2029-08",
    }),
    "Berlaku sampai Agu 2029",
  );
  equal(
    "kredensial lama tidak berubah tampilannya sampai bentuknya dipilih",
    masaBerlakuTeks({ ...seumurHidup, masaBerlaku: "", expiryDate: "2029-08" }),
    "",
  );
  equal(
    "jenjang dan klasifikasi ikut tercetak untuk kredensial berjenjang",
    keteranganKredensial({
      ...emptyCertification(),
      kategori: "berjenjang",
      jenjang: "Jenjang 7 - Ahli Muda",
      klasifikasi: "Arsitektur",
    }),
    "Kredensial berjenjang · Jenjang 7 - Ahli Muda · Arsitektur",
  );

  const cvKredensial: ResumeData = {
    ...sampleResume("uji", "id"),
    certifications: [seumurHidup],
  };
  check(
    "seumur hidup tercetak di kertas",
    renderToStaticMarkup(
      React.createElement(ResumeDocument, {
        data: cvKredensial,
        printMode: true,
      }),
    ).includes("Berlaku seumur hidup"),
  );
  check(
    "seumur hidup tercetak di teks polos",
    resumeToPlainText(cvKredensial).includes("Berlaku seumur hidup"),
  );
  check(
    "seumur hidup tercetak di berkas Word",
    teksDocx(await buildDocx(cvKredensial)).includes("Berlaku seumur hidup"),
  );

  /* ---------------------------------------------------------------- */

  section("Blok agregat: ambang dibaca dari berkas data");

  const def = POLA_SCHEMAS["praktik-jam"].blokAgregat;
  check("pola Praktik & Pengajaran punya blok agregat", def !== undefined);
  check(
    "seluruh ambang yang ditawarkannya benar-benar ada di berkas data",
    (def?.ambangSlugs ?? []).every((slug) => ambangProfesi(slug) !== undefined),
  );

  const dokter = ambangProfesi("dokter");
  equal("ambang dokter 250 SKP", dokter?.total, 250);
  equal("dalam siklus 5 tahun", dokter?.siklusTahun, 5);
  check(
    "ranahnya lengkap dengan persentase minimumnya",
    dokter?.ranah.length === 3 &&
      dokter.ranah[0].minPersen === 45 &&
      dokter.ranah[1].minPersen === 35 &&
      dokter.ranah[2].minPersen === 5,
  );
  equal("dokter gigi 100 SKP", ambangProfesi("dokter-gigi")?.total, 100);
  equal("tenaga kesehatan lain 50 SKP", ambangProfesi("nakes-lain")?.total, 50);
  check(
    "tiap ambang membawa sumber dan tanggal pemeriksaannya",
    AMBANG_PROFESI.every((a) => a.sumber.trim() && a.diperbarui.trim()),
  );
  check(
    "sanggahannya menyebut catatan resmi, bukan sekadar peringatan umum",
    (def?.sanggahan ?? "").includes("Plataran Sehat") &&
      (def?.sanggahan ?? "").includes("KMK 1561/2024"),
  );
  // Sejak UU 17/2023, SKP dipakai untuk memperpanjang SIP - bukan STR.
  check(
    "keperluannya ditulis sebagai perpanjangan SIP, bukan STR",
    AMBANG_PROFESI.filter((a) => a.satuan === "SKP").every((a) =>
      a.keperluan.includes("SIP"),
    ),
  );

  /* ---------------------------------------------------------------- */

  section("Mode Redaksi di seluruh format ekspor");

  equal(
    "angka pasti diganti rentang yang memuatnya",
    samarkanAngka("Throughput 8.400 ton menjadi 9.100 ton"),
    "Throughput 8.000-9.000 ton menjadi 9.000-10.000 ton",
  );
  equal(
    "tahun tidak ikut disamarkan",
    samarkanAngka("Selesai pada 2024"),
    "Selesai pada 2024",
  );
  equal(
    "nama klien diganti deskriptor bidangnya",
    samarkanKonteks(NAMA_KLIEN, {
      ...sampleResume("uji", "id").profilPortofolio,
      bidangKamus: "energi-tambang-hse",
    }),
    "Klien bidang migas",
  );
  equal(
    "yang memang bukan nama klien dibiarkan apa adanya",
    samarkanKonteks("Proyek Mandiri", {
      ...sampleResume("uji", "id").profilPortofolio,
      bidangKamus: "energi-tambang-hse",
    }),
    "Proyek Mandiri",
  );

  const terbuka = cvRedaksi(false);
  const tersamar = cvRedaksi(true);

  const kertasTerbuka = renderToStaticMarkup(
    React.createElement(ResumeDocument, { data: terbuka, printMode: true }),
  );
  const kertasTersamar = renderToStaticMarkup(
    React.createElement(ResumeDocument, { data: tersamar, printMode: true }),
  );
  const teksTersamar = resumeToPlainText(tersamar);
  const wordTersamar = teksDocx(await buildDocx(tersamar));

  check(
    "tanpa Mode Redaksi, nama klien dan angka pastinya memang tercetak",
    kertasTerbuka.includes(NAMA_KLIEN) && kertasTerbuka.includes("8.400"),
  );

  for (const [format, isi] of [
    ["kertas", kertasTersamar],
    ["teks polos", teksTersamar],
    ["Word", wordTersamar],
  ] as const) {
    check(
      `${format}: nama klien tidak tercetak`,
      !isi.includes(NAMA_KLIEN),
    );
    check(
      `${format}: deskriptor bidangnya yang tercetak`,
      isi.includes("Klien bidang migas"),
    );
    check(
      `${format}: angka pastinya tidak tercetak`,
      !isi.includes("8.400") && !isi.includes("9.100"),
    );
    check(
      `${format}: rentangnya yang tercetak`,
      isi.includes("8.000-9.000"),
    );
  }

  /*
    Nama institusi yang tersimpan di field inti ikut disamarkan.

    Ini celah yang paling mudah terlewat: kolom konteks sudah diganti
    deskriptor, tetapi nama rumah sakit yang sama masih tercetak di baris
    Detail - dan penggunanya mengira sudah aman. Menyamarkan setengah lebih
    berbahaya daripada tidak menyamarkan sama sekali.
  */
  const cvKlinis: ResumeData = {
    ...tersamar,
    profilPortofolio: {
      ...tersamar.profilPortofolio,
      pola: "praktik-jam",
      bidangKamus: "kedokteran-kesehatan",
    },
    projects: [
      {
        ...tersamar.projects[0],
        konteks: "RSUD Taman Husada Bontang",
        inti: {
          jenisKegiatan: "Rotasi klinis",
          institusi: "RSUD Taman Husada Bontang",
          volume: "120 pasien/bulan",
          kredensialTerkait: ["STR"],
          luaran: "Angka infeksi turun 4,1% menjadi 1,8%",
        },
      },
    ],
  };
  const kertasKlinis = renderToStaticMarkup(
    React.createElement(ResumeDocument, { data: cvKlinis, printMode: true }),
  );
  check(
    "nama institusi di field inti ikut disamarkan, bukan hanya kolom konteks",
    !kertasKlinis.includes("RSUD Taman Husada Bontang") &&
      kertasKlinis.includes("Institusi / fasilitas: Klien bidang kedokteran"),
  );

  // Berkas cadangan JSON adalah milik penggunanya sendiri, bukan berkas yang
  // dikirim ke perusahaan - angkanya tetap utuh supaya dapat dipulihkan.
  const json = JSON.stringify(toExportFile(tersamar));
  check(
    "berkas cadangan JSON tetap menyimpan angka dan nama aslinya",
    json.includes(NAMA_KLIEN) && json.includes("8.400"),
  );

  /* ---------------------------------------------------------------- */

  section("Validator bahasa orang pertama");

  const temuanKami = periksaBahasa("Kami membangun sistem pemantauan.");
  equal("kata Kami ditandai", temuanKami.length, 1);
  check(
    "usulnya menyuruh menulis apa yang dikerjakan sendiri",
    temuanKami[0]?.usul.includes("saya merancang"),
  );
  equal(
    "kalimat orang pertama tidak ditandai",
    periksaBahasa("Saya menghitung disipasi daya dan memilih topologi buck.").length,
    0,
  );
  equal(
    "memimpin tanpa objek konkret ditandai",
    periksaBahasa("Memimpin tim pengembangan.").length,
    1,
  );
  equal(
    "memimpin dengan angka tidak ditandai",
    periksaBahasa("Memimpin tim 4 orang dalam migrasi 60 komponen.").length,
    0,
  );
  equal(
    "aturan bahasa hanya diwajibkan pada pola proyek teknis",
    Object.values(POLA_SCHEMAS).filter(
      (s) => s.aturanBahasa === "orang-pertama-wajib",
    ).length,
    1,
  );

  /* ---------------------------------------------------------------- */

  section("Peringatan kerahasiaan");

  const wajibMuncul: [string, string, RegExp][] = [
    ["kedokteran-kesehatan", "praktik-jam", /identitas pasien|rekam medis/i],
    ["sosial-humaniora", "dampak-program", /asesmen|responden/i],
    ["hardware-elektro", "proyek-teknis", /NDA|rahasia/i],
    ["energi-tambang-hse", "proyek-teknis", /NDA|rahasia/i],
    ["hukum", "dampak-program", /kerahasiaan klien|dianonimkan/i],
    ["bisnis-keuangan", "dampak-program", /rahasia|rentang/i],
  ];

  for (const [slugKamus, slugPola, pola] of wajibMuncul) {
    const entri = entriKamus(slugKamus);
    const skema = POLA_SCHEMAS[slugPola as keyof typeof POLA_SCHEMAS];
    const semua = [
      ...skema.peringatan,
      ...(entri?.peringatanTambahan ?? []),
    ].join(" ");
    check(
      `${slugKamus}: peringatan kerahasiaan tersedia`,
      pola.test(semua),
      semua.slice(0, 70),
    );
  }
}
