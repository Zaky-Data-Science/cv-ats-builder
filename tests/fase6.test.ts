import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { strFromU8, unzipSync } from "fflate";
import { ResumeDocument } from "../src/components/preview/ResumeDocument";
import { buildDocx } from "../src/lib/docx/build";
import { AMBANG_PROFESI, ambangProfesi } from "../src/lib/portfolio/ambang-profesi";
import { periksaBahasa } from "../src/lib/portfolio/bahasa";
import { en } from "../src/lib/i18n/en";
import { id } from "../src/lib/i18n/id";
import { entriKamus } from "../src/lib/portfolio/kamus-bidang";
import { keteranganKredensial, masaBerlakuTeks } from "../src/lib/portfolio/kredensial";
import { bagianPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { POLA_SCHEMAS } from "../src/lib/portfolio/pola-schemas";
import { samarkanAngka, samarkanKonteks } from "../src/lib/portfolio/redaksi";
import { itemTercetak } from "../src/lib/portfolio/render";
import { emptyCertification } from "../src/lib/resume/factory";
import { resumeToPlainText } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import { certificationSchema } from "../src/lib/resume/schema";
import { toExportFile } from "../src/lib/resume/serialize";
import type { ProjectItem, ResumeData } from "../src/lib/resume/types";
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

  /*
    Penyamaran dikenakan pada baris "Detail" yang sudah menggabungkan nilai
    dengan satuannya, jadi angka yang kebetulan ikut tertulis di situ pernah
    ikut tertelan. Dua bentuk di bawah ini yang nyata ditemui; keduanya
    membuat keluarannya terbaca rusak, bukan membocorkan apa pun.
  */
  equal(
    "pangkat pada satuan yang diketik datar tidak ikut disamarkan",
    samarkanAngka("8.400 m2"),
    "8.000-9.000 m2",
  );
  equal(
    "satuan berpangkat tiga juga aman",
    samarkanAngka("luas 120 m3"),
    "luas 100-200 m3",
  );
  equal(
    "satuan superskrip tetap seperti sedia kala",
    samarkanAngka("8.400 m²"),
    "8.000-9.000 m²",
  );
  equal(
    "angka pengali dibiarkan, yang diukur saja yang disamarkan",
    samarkanAngka("Kapasitas 2x15 MW"),
    "Kapasitas 2x10-20 MW",
  );
  equal(
    "besaran tanpa spasi setelah huruf TETAP disamarkan",
    samarkanAngka("Rp42 M"),
    "Rp40-50 M",
  );
  equal(
    "persentase berkoma tetap disamarkan",
    samarkanAngka("turun 4,1% ke 1,8%"),
    "turun 4-5% ke 1-2%",
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

  /* ---------------------------------------------------------------- */

  section("Mode Redaksi: koma di belakang angka tidak ikut tertelan");

  /*
    Kelas karakter pada pola angka dulu tidak dituntut berakhir pada digit,
    sehingga koma yang menempel di belakang angka ikut tercocokkan. Yang
    tertelan bukan hanya komanya: "2021," tidak lagi lolos penjaga tahun, jadi
    tahunnya berubah jadi rentang sekaligus kehilangan tanda bacanya.

    Diuji lewat jalur cetak sungguhan, bukan dengan memanggil samarkanAngka
    langsung. Cacat ini justru ditemukan di ringkasan dan poin - dua tempat
    yang isinya kalimat bebas, dan yang penyamarannya memang tidak boleh
    dilonggarkan - jadi jalur itu pula yang harus menguncinya.
  */
  function teksRedaksi(ringkasan: string, poin: string[]): string {
    const dasar = cvRedaksi(true);
    return resumeToPlainText({
      ...dasar,
      projects: [{ ...dasar.projects[0], ringkasan, bullets: poin, inti: {} }],
    });
  }

  const koma = teksRedaksi("Selesai 2021, lalu diserahkan", [
    "Proyek 2023, rampung lebih cepat",
  ]);
  check(
    "ringkasan: tahun berkoma tetap utuh beserta komanya",
    koma.includes("Selesai 2021, lalu diserahkan"),
    koma.split("\n").find((b) => b.includes("Selesai")) ?? "(baris tidak ditemukan)",
  );
  check(
    "poin: tahun berkoma tetap utuh beserta komanya",
    koma.includes("Proyek 2023, rampung lebih cepat"),
    koma.split("\n").find((b) => b.includes("Proyek 2")) ?? "(baris tidak ditemukan)",
  );
  check(
    "tidak ada rentang yang terlanjur terbentuk dari tahun",
    !koma.includes("2000-3000"),
  );

  const tanpaKoma = teksRedaksi("Selesai 2021 lalu diserahkan", [
    "Proyek 2023 rampung lebih cepat",
  ]);
  check(
    "tahun tanpa koma memang sudah tidak disamarkan - dan tetap begitu",
    tanpaKoma.includes("Selesai 2021 lalu diserahkan") &&
      tanpaKoma.includes("Proyek 2023 rampung lebih cepat"),
  );

  /*
    Perbaikannya mempersempit apa yang tercocokkan, jadi yang perlu dijaga
    adalah besaran yang tetap harus disamarkan - termasuk yang komanya ada di
    tengah angka, bukan di belakangnya.
  */
  const besaran = teksRedaksi("Throughput 8.400 ton, naik 4,2% dari 1.200 ton", [
    "Menangani 42 unit, 6 shift",
  ]);
  check(
    "besaran di ringkasan tetap disamarkan meski berkoma di belakangnya",
    besaran.includes("Throughput 8.000-9.000 ton, naik 4-5% dari 1.000-2.000 ton") &&
      !besaran.includes("8.400"),
    besaran.split("\n").find((b) => b.includes("Throughput")) ?? "(baris tidak ditemukan)",
  );
  check(
    "besaran di poin tetap disamarkan, komanya tetap di tempatnya",
    besaran.includes("Menangani 40-50 unit, 6-7 shift"),
  );

  /* ---------------------------------------------------------------- */

  section("Mode Redaksi: penyamaran per field, bukan per baris");

  /*
    Penyamaran dulu dikenakan pada baris "Detail" yang sudah tergabung,
    sehingga tidak ada lagi yang tahu sebuah angka datang dari field mana.
    Akibatnya nomor standar, versi perangkat lunak, dan nomor terbitan ikut
    tertelan: "SNI 2847" jadi "SNI 2000-3000", "Civil 3D" jadi "Civil 3-4D".

    Yang diuji di bawah ini tabel klasifikasi field-nya, dua arah sekaligus.
    Arah "dibiarkan" saja tidak cukup: kalau hanya itu yang diperiksa, menandai
    seluruh field "apaadanya" akan membuat berkas ini hijau sementara angka
    rahasia lolos ke berkas lamaran.
  */
  function detailPola(
    pola: ResumeData["profilPortofolio"]["pola"],
    inti: ProjectItem["inti"],
  ): string {
    const dasar = cvRedaksi(true);
    const data: ResumeData = {
      ...dasar,
      profilPortofolio: { ...dasar.profilPortofolio, pola },
      projects: [{ ...dasar.projects[0], inti, detailTambahan: [] }],
    };
    return itemTercetak(data, data.projects[0], "ID").detail;
  }

  const visual = detailPola("karya-visual", {
    masalah: "Pengguna gagal checkout karena form 4 langkah",
    prosesKeputusan: ["Riset: 8 wawancara", "Satukan jadi 2 langkah"],
    bentukKarya: ["render 3D", "denah"],
    perkakas: ["Civil 3D", "Figma"],
    statusKarya: "dirilis ke publik",
    hasil: "Konversi naik 2,1%",
  });
  check(
    "karya-visual: masalah dibiarkan",
    visual.includes(
      "Masalah yang dipecahkan: Pengguna gagal checkout karena form 4 langkah",
    ),
    visual,
  );
  check(
    "karya-visual: proses & keputusan dibiarkan",
    visual.includes("Proses & keputusan: Riset: 8 wawancara, Satukan jadi 2 langkah"),
  );
  check(
    "karya-visual: bentuk karya dibiarkan",
    visual.includes("Bentuk karya: render 3D, denah"),
  );
  check(
    "karya-visual: perkakas dibiarkan",
    visual.includes("Perkakas: Civil 3D, Figma"),
  );
  check(
    "karya-visual: status dibiarkan",
    visual.includes("Status: dirilis ke publik"),
  );
  check(
    "karya-visual: hasil TETAP disamarkan",
    visual.includes("Hasil: Konversi naik 2-3%"),
  );

  const teknis = detailPola("proyek-teknis", {
    jenisProyek: "Gedung kuliah 4 lantai",
    skalaProyek: "8.400 m2",
    tahapKeterlibatan: ["DED", "commissioning"],
    standarKode: ["SNI 2847", "SNI 1726"],
    perkakas: ["Civil 3D", "ETABS"],
    hasilTerukur: ["Durasi", "41 hari", "24 hari", "6 bulan"],
  });
  check(
    "proyek-teknis: standar & kode dibiarkan",
    teknis.includes("Standar & kode: SNI 2847, SNI 1726"),
    teknis,
  );
  check(
    "proyek-teknis: perkakas dibiarkan",
    teknis.includes("Perkakas: Civil 3D, ETABS"),
  );
  check(
    "proyek-teknis: tahap keterlibatan dibiarkan",
    teknis.includes("Tahap keterlibatan: DED, commissioning"),
  );
  check(
    "proyek-teknis: skala TETAP disamarkan",
    teknis.includes("Skala: 8.000-9.000 m2") && !teknis.includes("8.400"),
  );
  check(
    "proyek-teknis: jenis proyek TETAP disamarkan",
    teknis.includes("Jenis proyek: Gedung kuliah 4-5 lantai"),
  );
  check(
    "proyek-teknis: hasil terukur TETAP disamarkan",
    teknis.includes("40-50 hari") && !teknis.includes("41 hari"),
  );

  const praktik = detailPola("praktik-jam", {
    jenisKegiatan: "Rotasi klinis 4 stase",
    institusi: "RSUD Taman Husada Bontang",
    volume: "120 pasien/bulan",
    periodeAktif: "Jan 2024 - kini, 3 hari/pekan",
    luaran: "Angka infeksi turun 4,1%",
    kredensialTerkait: ["STR", "SIP 5 tahun"],
    penyelia: "dr. Sari Handayani, Sp.PD",
  });
  check(
    "praktik-jam: jenis kegiatan dibiarkan",
    praktik.includes("Jenis kegiatan: Rotasi klinis 4 stase"),
    praktik,
  );
  check(
    "praktik-jam: periode & intensitas dibiarkan",
    praktik.includes("Periode & intensitas: Jan 2024 - kini, 3 hari/pekan"),
  );
  check(
    "praktik-jam: kredensial terkait dibiarkan",
    praktik.includes("Kredensial terkait: STR, SIP 5 tahun"),
  );
  check(
    "praktik-jam: penyelia dibiarkan",
    praktik.includes("Penyelia / atasan: dr. Sari Handayani, Sp.PD"),
  );
  check(
    "praktik-jam: volume TETAP disamarkan",
    praktik.includes("Volume: 100-200 pasien/bulan") &&
      !praktik.includes("120 pasien"),
  );
  check(
    "praktik-jam: luaran TETAP disamarkan",
    praktik.includes("Hasil / luaran: Angka infeksi turun 4-5%"),
  );
  check(
    "praktik-jam: institusi TETAP diganti deskriptor",
    praktik.includes("Institusi / fasilitas: Klien bidang migas") &&
      !praktik.includes("RSUD Taman Husada Bontang"),
  );

  const dampak = detailPola("dampak-program", {
    lingkupProgram: "Program 3 kabupaten",
    skalaDikelola: "Anggaran Rp42 M",
    metrikDampak: ["Kepatuhan", "62%", "88%", "1 tahun"],
    metodeStandar: ["ISO 28000", "PP 35/2021", "5S"],
    sistemPerkakas: ["SAP S/4HANA", "Power BI"],
    penerimaManfaat: "1.200 keluarga",
  });
  check(
    "dampak-program: metode & standar dibiarkan",
    dampak.includes("Metode & standar: ISO 28000, PP 35/2021, 5S"),
    dampak,
  );
  check(
    "dampak-program: lingkup dibiarkan",
    dampak.includes("Lingkup: Program 3 kabupaten"),
  );
  check(
    "dampak-program: sistem & perkakas dibiarkan",
    dampak.includes("Sistem & perkakas: SAP S/4HANA, Power BI"),
  );
  check(
    "dampak-program: skala yang dikelola TETAP disamarkan",
    dampak.includes("Anggaran Rp40-50 M"),
  );
  check(
    "dampak-program: metrik dampak TETAP disamarkan",
    dampak.includes("60-70%") && !dampak.includes("62%"),
  );
  check(
    "dampak-program: penerima manfaat TETAP disamarkan",
    dampak.includes("Penerima manfaat: 1.000-2.000 keluarga"),
  );

  const umum = detailPola("umum", {
    jenisKarya: "Purwarupa 2 varian",
    alatMetode: ["Civil 3D", "Arduino"],
    hasil: "Waktu rakit turun 42%",
  });
  check(
    "umum: jenis karya dibiarkan",
    umum.includes("Jenis karya: Purwarupa 2 varian"),
    umum,
  );
  check(
    "umum: alat & metode dibiarkan",
    umum.includes("Alat & metode: Civil 3D, Arduino"),
  );
  check(
    "umum: hasil TETAP disamarkan",
    umum.includes("Hasil: Waktu rakit turun 40-50%"),
  );

  /*
    Detail tambahan tetap disamarkan. Label maupun isinya diketik bebas, jadi
    tidak ada skema yang bisa menjamin angkanya bukan besaran - dan di situlah
    orang menaruh angka yang tidak muat di field inti.
  */
  const dasarTambahan = cvRedaksi(true);
  const denganTambahan: ResumeData = {
    ...dasarTambahan,
    projects: [
      {
        ...dasarTambahan.projects[0],
        inti: { jenisProyek: "Unit proses" },
        detailTambahan: [
          {
            label: "Nilai kontrak",
            nilai: "Rp42",
            satuan: "M",
            prioritas: 1,
          },
        ],
      },
    ],
  };
  check(
    "detail tambahan yang diketik bebas tetap disamarkan",
    itemTercetak(denganTambahan, denganTambahan.projects[0], "ID").detail.includes(
      "Nilai kontrak: Rp40-50 M",
    ),
  );

  /*
    Karya terbit memang publik. Sitasi, venue, dan DOI justru harus tepat
    supaya bisa dicek orang - menyamarkannya tidak melindungi siapa pun dan
    menghancurkan gunanya.

    Uji ini sekaligus mengunci sesuatu yang mudah rusak tanpa sengaja: bagian
    Publikasi punya jalur cetaknya sendiri yang tidak melewati itemTercetak,
    jadi hari ini ia memang tidak pernah tersentuh Mode Redaksi. Kalau suatu
    saat penyamaran ditambahkan ke jalur itu tanpa menghormati penanda
    "apaadanya", baris di bawah inilah yang memberi tahu.
  */
  const sitasiAsli = tersamar.publications[0].title;
  const doiAsli = tersamar.publications[0].doi;
  check(
    "karya-terkredit: sitasi tercetak identik dengan aslinya",
    sitasiAsli.trim().length > 0 && teksTersamar.includes(sitasiAsli),
  );
  check(
    "karya-terkredit: DOI tercetak identik dengan aslinya",
    doiAsli.trim().length > 0 && teksTersamar.includes(doiAsli),
  );
  check(
    "karya-terkredit: seluruh fieldnya bertanda apaadanya di skema",
    POLA_SCHEMAS["karya-terkredit"].fieldInti.every(
      (f) => f.redaksi === "apaadanya",
    ),
  );

  /* ---------------------------------------------------------------- */

  /* ---------------------------------------------------------------- */

  section("Mode Redaksi: poin portofolio ikut disamarkan di SETIAP keluaran");

  /*
    Pratinjau pernah mencetak poin mentah (`item.bullets`) sementara teks polos
    dan Word memakai `cetak.poin` yang sudah tersamar. Yang bocor justru jalur
    yang menjadi PDF - format yang paling banyak dikirim orang - dan uji lama
    tidak menangkapnya karena poin di dalamnya kebetulan tidak memuat angka
    yang juga muncul di tempat lain.

    Karena itu ketiga keluaran diperiksa berdampingan di sini, bukan hanya dua.
  */
  function tigaKeluaran(data: ResumeData) {
    return {
      kertas: renderToStaticMarkup(
        React.createElement(ResumeDocument, { data, printMode: true }),
      )
        // Atribut data-field memuat UUID yang bisa mengandung deretan angka,
        // jadi yang diperiksa teks yang benar-benar terlihat.
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " "),
      teks: resumeToPlainText(data),
    };
  }

  const dasarPoin = cvRedaksi(true);
  const cvPoin: ResumeData = {
    ...dasarPoin,
    projects: [
      {
        ...dasarPoin.projects[0],
        ringkasan: "Ringkasan tanpa angka khusus.",
        bullets: ["Saya menutup 137 temuan pada 2024, seluruhnya terverifikasi."],
        inti: { jenisProyek: "Unit proses" },
        detailTambahan: [],
      },
    ],
  };
  const keluaranPoin = tigaKeluaran(cvPoin);
  const wordPoin = teksDocx(await buildDocx(cvPoin));

  for (const [format, isi] of [
    ["kertas/PDF", keluaranPoin.kertas],
    ["teks polos", keluaranPoin.teks],
    ["Word", wordPoin],
  ] as const) {
    check(`${format}: angka pasti di poin tidak tercetak`, !isi.includes("137"), isi.includes("137") ? "137 masih ada" : "");
    check(`${format}: rentangnya yang tercetak`, isi.includes("100-200"));
    check(`${format}: tahun di poin yang sama tidak ikut disamarkan`, isi.includes("2024"));
  }

  /* ---------------------------------------------------------------- */

  section("Mode Redaksi: nama yang sudah diketahui disapu dari kalimat bebas");

  /*
    Mengganti kolom Klien/institusi saja tidak cukup. Nama yang sama biasanya
    ditulis lagi di dalam judul, ringkasan, dan poin - dan sebelum ini kalimat
    itu keluar utuh sementara angkanya sudah tersamar.

    Yang disapu hanya nama yang memang tersimpan di sebuah field. Nama
    perusahaan tidak pernah ditebak dari bentuk tulisannya ("PT ...");
    tebakan begitu melewatkan nama yang tidak berpola sekaligus merusak
    kalimat yang tidak perlu disentuh.
  */
  const dasarSapu = cvRedaksi(true);
  const cvSapu: ResumeData = {
    ...dasarSapu,
    projects: [
      {
        ...dasarSapu.projects[0],
        name: `Revitalisasi Unit ${NAMA_KLIEN}`,
        konteks: NAMA_KLIEN,
        ringkasan: `Menangani 137 titik inspeksi bersama ${NAMA_KLIEN}.`,
        // Huruf besar semua: pencocokannya harus mengabaikan besar-kecil huruf.
        bullets: [`Saya menutup 137 temuan di ${NAMA_KLIEN.toUpperCase()} pada 2024.`],
        inti: { jenisProyek: "Unit proses" },
        detailTambahan: [
          { label: "Mitra", nilai: NAMA_KLIEN, satuan: "", prioritas: 1 },
        ],
      },
    ],
  };
  const keluaranSapu = tigaKeluaran(cvSapu);
  const wordSapu = teksDocx(await buildDocx(cvSapu));

  for (const [format, isi] of [
    ["kertas/PDF", keluaranSapu.kertas],
    ["teks polos", keluaranSapu.teks],
    ["Word", wordSapu],
  ] as const) {
    check(
      `${format}: nama klien tidak tercetak di mana pun, apa pun besar-kecil hurufnya`,
      !isi.toLowerCase().includes(NAMA_KLIEN.toLowerCase()),
    );
    check(
      `${format}: judul, ringkasan, poin, dan detail tambahan memakai deskriptor`,
      (isi.match(/Klien bidang migas/g) ?? []).length >= 4,
      `${(isi.match(/Klien bidang migas/g) ?? []).length} kemunculan deskriptor`,
    );
  }

  // Word diperiksa sekali lagi pada XML mentahnya: teks yang terpecah ke
  // beberapa <w:t> lolos dari pencarian pada teks yang sudah disatukan.
  const zipSapu = unzipSync(new Uint8Array(await buildDocx(cvSapu)));
  const bocorDocx = Object.keys(zipSapu).filter((berkas) =>
    strFromU8(zipSapu[berkas]).toLowerCase().includes(NAMA_KLIEN.toLowerCase()),
  );
  check(
    "tidak satu pun entri di dalam .docx memuat nama klien aslinya",
    bocorDocx.length === 0,
    bocorDocx.length ? `bocor di: ${bocorDocx.join(", ")}` : `${Object.keys(zipSapu).length} entri diperiksa`,
  );

  /*
    Nama institusi di field inti bertanda `redaksi: "nama"` juga ikut disapu
    dari kalimat - bukan hanya diganti di baris Detail-nya sendiri.
  */
  const dasarKlinis2 = cvRedaksi(true);
  const cvKlinis2: ResumeData = {
    ...dasarKlinis2,
    profilPortofolio: {
      ...dasarKlinis2.profilPortofolio,
      pola: "praktik-jam",
      bidangKamus: "kedokteran-kesehatan",
    },
    projects: [
      {
        ...dasarKlinis2.projects[0],
        konteks: "Proyek Mandiri",
        ringkasan: "Rotasi di RSUD Taman Husada Bontang selama 6 bulan.",
        bullets: ["Saya menangani 40 pasien di RSUD Taman Husada Bontang."],
        inti: { jenisKegiatan: "Rotasi klinis", institusi: "RSUD Taman Husada Bontang" },
        detailTambahan: [],
      },
    ],
  };
  const klinis2 = tigaKeluaran(cvKlinis2);
  check(
    "nama institusi ikut disapu dari ringkasan dan poin, bukan hanya dari baris Detail",
    !klinis2.kertas.includes("RSUD Taman Husada Bontang") &&
      !klinis2.teks.includes("RSUD Taman Husada Bontang") &&
      !teksDocx(await buildDocx(cvKlinis2)).includes("RSUD Taman Husada Bontang"),
  );

  /*
    Arah sebaliknya, dan ini yang paling mudah dirusak: konteks yang memang
    BUKAN nama klien tidak boleh disapu. Menghapus "Freelance" dari sebuah
    kalimat menghilangkan keterangan yang justru jujur, lalu menggantinya
    dengan kesan ada klien yang dirahasiakan.
  */
  const dasarLepas = cvRedaksi(true);
  const cvLepas: ResumeData = {
    ...dasarLepas,
    projects: [
      {
        ...dasarLepas.projects[0],
        konteks: "Proyek Mandiri",
        ringkasan: "Proyek Mandiri yang saya kerjakan sendiri selama 6 bulan.",
        bullets: ["Saya merilis Proyek Mandiri ini sebagai sumber terbuka."],
        inti: { jenisProyek: "Unit proses" },
        detailTambahan: [],
      },
    ],
  };
  const lepas = tigaKeluaran(cvLepas);
  check(
    "konteks yang bukan nama klien tetap utuh di kolomnya maupun di kalimatnya",
    lepas.kertas.includes("Proyek Mandiri yang saya kerjakan sendiri") &&
      lepas.teks.includes("Proyek Mandiri ini sebagai sumber terbuka") &&
      !lepas.teks.includes("Klien bidang"),
  );

  /*
    Penyapuan nama berlaku di SELURUH field inti, bukan hanya field bertanda
    `redaksi: "nama"`.

    Yang dijaga di sini konsistensi yang dilihat penggunanya: tanpa ini, nama
    klien hilang dari ringkasan lalu muncul lagi satu baris di bawahnya, di
    baris Detail. Penanda `"apaadanya"` tidak bertabrakan dengan aturan ini -
    ia soal angka, bukan nama - jadi `standarKode` tetap keluar sebagai
    "SNI 2847" utuh sementara nama klien di dalamnya tetap tersapu.
  */
  const dasarInti = cvRedaksi(true);
  const cvInti: ResumeData = {
    ...dasarInti,
    projects: [
      {
        ...dasarInti.projects[0],
        konteks: NAMA_KLIEN,
        ringkasan: "Ringkasan tanpa nama.",
        bullets: [],
        inti: {
          // Field biasa: nama disapu DAN angkanya disamarkan.
          jenisProyek: `Inspeksi pipa di ${NAMA_KLIEN}`,
          skalaProyek: "8.400 m2",
          // Field "apaadanya": nama disapu, angkanya TIDAK.
          standarKode: ["SNI 2847", `Standar internal ${NAMA_KLIEN}`],
          perkakas: ["Civil 3D"],
        },
        detailTambahan: [],
      },
    ],
  };
  const intiKeluaran = tigaKeluaran(cvInti);
  const intiWord = teksDocx(await buildDocx(cvInti));

  for (const [format, isi] of [
    ["kertas/PDF", intiKeluaran.kertas],
    ["teks polos", intiKeluaran.teks],
    ["Word", intiWord],
  ] as const) {
    check(
      `${format}: nama klien di field inti biasa ikut tersapu`,
      isi.includes("Jenis proyek: Inspeksi pipa di Klien bidang migas"),
      isi.includes(NAMA_KLIEN) ? "nama aslinya masih tercetak" : "",
    );
    check(
      `${format}: nama klien di field "apaadanya" juga tersapu`,
      isi.includes("Standar internal Klien bidang migas"),
    );
    check(
      `${format}: tetapi nomor standar di field itu TIDAK ikut disamarkan`,
      isi.includes("SNI 2847") && !isi.includes("SNI 2000-3000"),
    );
    check(
      `${format}: field biasa tetap kena penyamaran angka seperti sebelumnya`,
      isi.includes("8.000-9.000 m2") && !isi.includes("8.400"),
    );
    check(
      `${format}: nama klien tidak tersisa di baris Detail mana pun`,
      !isi.includes(NAMA_KLIEN),
    );
  }

  /*
    Menyamarkan poin di pratinjau tidak boleh menggeser nomor urutnya.

    Pratinjau menulis suntingan balik ke `projects.N.bullets.M` memakai nomor
    yang ia terima. Larik poin yang sudah disaring menggeser nomor itu, dan
    satu poin kosong di atas sudah cukup untuk membuat ketikan mendarat di
    poin yang salah - kerusakan yang senyap, karena yang terlihat di layar
    tampak benar. Poin kosong juga harus tetap punya elemennya sendiri saat
    mode ketik menyala: poin yang baru ditambahkan selalu lahir kosong.
  */
  const dasarIndeks = cvRedaksi(true);
  const cvIndeks: ResumeData = {
    ...dasarIndeks,
    projects: [
      {
        ...dasarIndeks.projects[0],
        bullets: ["", "Saya menutup 137 temuan pada 2024."],
        inti: { jenisProyek: "Unit proses" },
        detailTambahan: [],
      },
    ],
  };
  const cetakIndeks = itemTercetak(cvIndeks, cvIndeks.projects[0], "ID");
  equal(
    "poin siap cetak membuang yang kosong",
    cetakIndeks.poin.length,
    1,
  );
  equal(
    "poin untuk pratinjau mempertahankan panjang dan posisinya",
    cetakIndeks.poinSemua.length,
    2,
  );
  check(
    "poin kosong tetap kosong, poin terisi tetap di nomor urut aslinya",
    cetakIndeks.poinSemua[0] === "" &&
      cetakIndeks.poinSemua[1].includes("100-200") &&
      !cetakIndeks.poinSemua[1].includes("137"),
    JSON.stringify(cetakIndeks.poinSemua),
  );

  const ketik = renderToStaticMarkup(
    React.createElement(ResumeDocument, {
      data: cvIndeks,
      printMode: false,
      editable: true,
    }),
  );
  check(
    "mode ketik: poin terisi tetap menunjuk bullets.1, bukan bullets.0",
    ketik.includes("projects.0.bullets.1") && ketik.includes("projects.0.bullets.0"),
  );
  check(
    "mode ketik: poin yang tersamar itu yang tampil, bukan angka aslinya",
    ketik.includes("100-200") && !ketik.includes("137 temuan"),
  );

  const cetakBersih = renderToStaticMarkup(
    React.createElement(ResumeDocument, { data: cvIndeks, printMode: true }),
  );
  check(
    "jalur cetak tetap tidak memunculkan poin kosong",
    (cetakBersih.match(/<li /g) ?? []).length ===
      (cetakBersih.match(/<li [^>]*>[^<]/g) ?? []).length,
  );

  /*
    Batas Mode Redaksi harus terbaca di layar, permanen, dan dalam kedua
    bahasa - bukan hanya setelah sakelarnya menyala.
  */
  check(
    "batas Mode Redaksi tertulis di kedua kamus bahasa",
    id.portofolio.redactionLimit.trim().length > 0 &&
      en.portofolio.redactionLimit.trim().length > 0 &&
      id.portofolio.redactionLimit !== en.portofolio.redactionLimit,
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
