import { analyzeDocument } from "../src/lib/ats/document";
import { analyzeResume } from "../src/lib/ats/engine";
import { extractKeywords } from "../src/lib/ats/keywords";
import { deteksiPola, tebakBahasa } from "../src/lib/portfolio/deteksi";
import { bagianPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { resumeToPlainText, teksPencocokan } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import type { ExtractedDocument } from "../src/lib/intake/extract";
import type { ResumeData } from "../src/lib/resume/types";
import { check, equal, section } from "./harness";

/**
 * Pencocokan lowongan dan pemindai CV unggahan.
 *
 * Yang diuji di sini bermuara pada satu hal: angka kecocokan harus mengukur
 * kecocokan yang sebenarnya - bukan kebetulan kata yang berulang, bukan kata
 * yang terhitung dua kali, dan bukan keahlian yang hilang hanya karena tidak
 * muat di atas kertas.
 */

const IKLAN_SIPIL = `Dibutuhkan Site Engineer untuk proyek gedung bertingkat.
Kualifikasi:
- Memahami penyusunan DED dan RAB
- Terbiasa membaca shop drawing dan as-built drawing
- Melakukan pengawasan lapangan harian dan menyusun kurva S
- Memahami uji slump dan soil test
- Bertanggung jawab atas laporan mingguan kepada manajemen proyek`;

const IKLAN_INGGRIS = `We are looking for a Site Engineer for a high-rise project.
Requirements:
- You will be responsible for daily supervision and weekly reporting
- Experience with shop drawing and as-built drawing is required
- The ability to work with our team and our consultants`;

function cvSipil(patch: Partial<ResumeData> = {}): ResumeData {
  const dasar = sampleResume("uji", "id");
  return {
    ...dasar,
    profilPortofolio: {
      ...dasar.profilPortofolio,
      pola: "proyek-teknis",
      bidangKamus: "sipil-konstruksi",
      jurusan: "Teknik Sipil",
      sudahDitanya: true,
    },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true },
    ...patch,
  };
}

function doc(text: string, fileName = "cv.pdf"): ExtractedDocument {
  return {
    fileName,
    text,
    pageCount: 1,
    columnHint: 1,
  } as ExtractedDocument;
}

export function runFase7Tests(): void {
  /* ---------------------------------------------------------------- */

  section("Kamus menyumbang bobot ke pencocokan lowongan");

  const tanpaKamus = extractKeywords(IKLAN_SIPIL, 25);
  const denganKamus = extractKeywords(IKLAN_SIPIL, 25, {
    utama: ["DED", "RAB", "shop drawing", "kurva S", "uji slump", "soil test"],
  });

  const bobot = (daftar: { keyword: string; weight: number }[], kata: string) =>
    daftar.find((k) => k.keyword.toLowerCase().includes(kata.toLowerCase()))
      ?.weight ?? 0;

  check(
    "kata kunci khas bidang memperoleh bobot lebih tinggi",
    bobot(denganKamus, "ded") > bobot(tanpaKamus, "ded"),
    `${bobot(tanpaKamus, "ded")} -> ${bobot(denganKamus, "ded")}`,
  );
  check(
    "kata yang bukan istilah bidang tidak ikut naik",
    bobot(denganKamus, "bertanggung") === bobot(tanpaKamus, "bertanggung"),
  );

  // Istilah bidang yang muncul sekali di iklannya paling mudah terpotong batas
  // jumlah - dan justru itu yang menentukan.
  const sempit = extractKeywords(IKLAN_SIPIL, 3, {
    utama: ["soil test"],
  });
  check(
    "istilah bidang tidak hilang meski batas jumlahnya sempit",
    sempit.some((k) => k.keyword.includes("soil")),
    sempit.map((k) => k.keyword).join(", "),
  );

  /* ---------------------------------------------------------------- */

  section("Detail tambahan yang tidak dicetak tetap dihitung");

  const dasar = cvSipil();
  const denganDetail = cvSipil({
    projects: [
      {
        ...dasar.projects[0],
        konteks: "PT Konstruksi Nusantara",
        detailTambahan: [
          { label: "Sistem struktur", nilai: "beton pracetak", satuan: "", prioritas: 1 },
          { label: "Luas", nilai: "8400", satuan: "m2", prioritas: 2 },
          { label: "Bentang", nilai: "45", satuan: "m", prioritas: 3 },
          { label: "Jumlah lantai", nilai: "12", satuan: "lantai", prioritas: 4 },
          { label: "Kurva S", nilai: "deviasi 1,2%", satuan: "", prioritas: 5 },
          { label: "Uji slump", nilai: "12 cm", satuan: "", prioritas: 6 },
        ],
      },
    ],
  });

  const tercetak = resumeToPlainText(denganDetail);
  const dicocokkan = teksPencocokan(denganDetail);
  check(
    "detail kelima dan keenam memang tidak tercetak di CV",
    !tercetak.includes("Uji slump") && !tercetak.includes("Kurva S"),
  );
  check(
    "tapi tetap masuk teks yang dipakai mencocokkan lowongan",
    dicocokkan.includes("Uji slump") && dicocokkan.includes("Kurva S"),
  );
  check(
    "kata kuncinya karena itu terhitung cocok",
    (analyzeResume(denganDetail, "Dibutuhkan yang memahami uji slump dan kurva S.", 1)
      .match ?? 0) > 0,
  );

  /* ---------------------------------------------------------------- */

  section("Item yang menempel tidak dihitung dua kali");

  const induk = dasar.experiences[0];
  const item = {
    ...dasar.projects[0],
    name: "Jembatan Mahakam IV",
    konteks: induk.company,
    bullets: ["Menyusun kurva S mingguan untuk pekerjaan struktur."],
  };

  const lepas = cvSipil({ projects: [{ ...item, parentPengalamanId: "" }] });
  const menempel = cvSipil({
    portofolio: {
      ...bagianPortofolioBawaan(),
      aktif: true,
      gabungKePengalaman: true,
    },
    projects: [{ ...item, parentPengalamanId: induk.id }],
  });

  const hitung = (teks: string, kata: string) =>
    teks.toLowerCase().split(kata.toLowerCase()).length - 1;

  equal(
    "judul itemnya tercetak sekali saat berdiri sendiri",
    hitung(resumeToPlainText(lepas), "Jembatan Mahakam IV"),
    1,
  );
  equal(
    "dan tetap sekali saat menempel pada pengalaman kerja",
    hitung(resumeToPlainText(menempel), "Jembatan Mahakam IV"),
    1,
  );
  equal(
    "angka kecocokan tidak berubah karena penggabungan",
    analyzeResume(menempel, IKLAN_SIPIL, 1).match,
    analyzeResume(lepas, IKLAN_SIPIL, 1).match,
  );

  /* ---------------------------------------------------------------- */

  section("Peringatan beda bahasa");

  equal("iklan berbahasa Indonesia terbaca ID", tebakBahasa(IKLAN_SIPIL), "ID");
  equal("iklan berbahasa Inggris terbaca EN", tebakBahasa(IKLAN_INGGRIS), "EN");
  equal("teks terlalu pendek tidak ditebak", tebakBahasa("React Next.js"), null);

  const cvIndonesia = cvSipil();
  const beda = analyzeResume(cvIndonesia, IKLAN_INGGRIS, 1);
  const sama = analyzeResume(cvIndonesia, IKLAN_SIPIL, 1);
  check(
    "CV Indonesia melawan iklan Inggris memperoleh peringatan",
    beda.suggestions.some((s) => /berbahasa/i.test(s.message)),
  );
  check(
    "alasannya mekanis, bukan selera",
    beda.suggestions.some((s) => /kata demi kata/i.test(s.fix)),
  );
  check(
    "istilah teknis disebut tetap Inggris di kedua kasus",
    beda.suggestions.some((s) => /perkakas|framework|sertifikasi/i.test(s.fix)),
  );
  check(
    "bahasa yang sama tidak memunculkan peringatan",
    !sama.suggestions.some((s) => /berbahasa/i.test(s.message)),
  );

  /* ---------------------------------------------------------------- */

  section("Deteksi pola pada CV unggahan");

  const TEKS_SIPIL = `Budi Santoso
Site Engineer

PENGALAMAN KERJA
PT Konstruksi Nusantara
- Menyusun DED dan RAB untuk gedung 12 lantai
- Membaca shop drawing dan as-built drawing setiap pekan
- Melakukan pengawasan lapangan dan menyusun kurva S
- Mengawasi uji slump dan soil test pada setiap pengecoran
- Menjaga penerapan HSE di area kerja`;

  const tebakan = deteksiPola(TEKS_SIPIL);
  equal(
    "CV konstruksi terbaca sebagai bidang sipil",
    tebakan?.entri.slug,
    "sipil-konstruksi",
  );
  equal("dan bentuknya Proyek Teknis", tebakan?.pola, "proyek-teknis");
  equal(
    "teks tanpa penanda apa pun tidak ditebak",
    deteksiPola("Halo nama saya Budi dan saya suka bekerja."),
    null,
  );

  const hasilDoc = analyzeDocument(doc(TEKS_SIPIL), "", "id");
  check(
    "penilai berkas unggahan ikut menawarkan bentuknya",
    hasilDoc.tebakanPola?.pola === "proyek-teknis",
  );
  check(
    "kalimatnya berbentuk tawaran, bukan pernyataan",
    /Pakai penilaian bentuk ini\?$/.test(hasilDoc.tebakanPola?.kalimat ?? ""),
    hasilDoc.tebakanPola?.kalimat ?? "",
  );
  check(
    "kata kunci yang membuatnya cocok ikut disebut, supaya dapat diperiksa",
    (hasilDoc.tebakanPola?.kataCocok.length ?? 0) >= 3,
  );

  /* ---------------------------------------------------------------- */

  section("Membandingkan CV berbentuk berbeda");

  const TEKS_DOKTER = `Sari Handayani
Dokter Umum

PENGALAMAN
RSUD Taman Husada
- Melakukan anamnesis dan pemeriksaan fisik pasien rawat inap
- Menegakkan diagnosis banding dan tata laksana awal
- Menjalankan triase di instalasi gawat darurat
- Mengisi rekam medis elektronik setiap kunjungan
- Memberi edukasi pasien tentang patient safety`;

  const sipilDoc = analyzeDocument(doc(TEKS_SIPIL, "sipil.pdf"), "", "id");
  const dokterDoc = analyzeDocument(doc(TEKS_DOKTER, "dokter.pdf"), "", "id");
  check(
    "dua CV bidang berbeda terbaca berbeda bentuknya",
    sipilDoc.tebakanPola?.pola !== dokterDoc.tebakanPola?.pola,
    `${sipilDoc.tebakanPola?.namaPola} vs ${dokterDoc.tebakanPola?.namaPola}`,
  );
  equal(
    "CV dokter terbaca sebagai Praktik & Pengajaran",
    dokterDoc.tebakanPola?.pola,
    "praktik-jam",
  );
}
