import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { strFromU8, unzipSync } from "fflate";
import { ResumeDocument } from "../src/components/preview/ResumeDocument";
import { analyzeResume } from "../src/lib/ats/engine";
import { nilaiBuktiKarya, nilaiQ, nilaiR, pengaliP } from "../src/lib/ats/bukti-karya";
import { AMBANG_PROFESI, ambangProfesi } from "../src/lib/portfolio/ambang-profesi";
import { gantiPolaItem, isiArsip } from "../src/lib/portfolio/arsip";
import { periksaBahasa } from "../src/lib/portfolio/bahasa";
import { buildDocx } from "../src/lib/docx/build";
import { KAMUS_BIDANG, entriKamus } from "../src/lib/portfolio/kamus-bidang";
import { masaBerlakuTeks } from "../src/lib/portfolio/kredensial";
import { bagianPortofolioBawaan, migrasiDokumenCV } from "../src/lib/portfolio/migrasi";
import { cariBidang } from "../src/lib/portfolio/pencarian";
import { POLA_SCHEMAS, URUTAN_POLA } from "../src/lib/portfolio/pola-schemas";
import { tanggalDiLuarInduk } from "../src/lib/portfolio/render";
import { emptyCertification } from "../src/lib/resume/factory";
import { resumeToPlainText } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import { resumeDataSchema } from "../src/lib/resume/schema";
import { toExportFile } from "../src/lib/resume/serialize";
import { TEMPLATE_ORDER } from "../src/lib/resume/templates";
import type { ProjectItem, ResumeData } from "../src/lib/resume/types";
import { check, equal, section } from "./harness";

/**
 * ============================================================================
 *  KRITERIA PENERIMAAN §14 - DUA PULUH EMPAT, SATU PER SATU
 * ============================================================================
 *
 * Berkas ini tidak menguji kode; ia menjawab daftar. Tiap pemeriksaan diberi
 * nomor kriterianya supaya hasilnya dapat dibaca berdampingan dengan
 * dokumennya, dan supaya yang tidak terpenuhi terlihat sebagai nomor - bukan
 * sebagai kalimat yang mudah dilewati.
 */

function item(patch: Partial<ProjectItem> = {}): ProjectItem {
  return {
    id: "i1",
    name: "Panel Kendali",
    role: "Perancang Elektronik",
    url: "",
    startDate: "2023-01",
    endDate: "2023-08",
    bullets: ["Menguji efisiensi konverter pada beban penuh."],
    konteks: "PT Contoh",
    lokasi: "Samarinda",
    ringkasan: "Merancang catu daya untuk instrumentasi lapangan.",
    tautan: [{ label: "", url: "https://contoh.test/karya" }],
    kataKunci: [],
    inti: {
      skalaProyek: "3 A / 24 V",
      standarKode: ["IEC"],
      hasilTerukur: ["Efisiensi", "84%", "92%", "6 minggu"],
      tahapKeterlibatan: ["pengujian"],
    },
    detailTambahan: [],
    verifikator: { nama: "", jabatan: "", hubungan: "" },
    refleksi: "",
    polaOverride: "",
    parentPengalamanId: "",
    arsip: {},
    ...patch,
  };
}

function cv(patch: Partial<ResumeData> = {}): ResumeData {
  const dasar = sampleResume("uji", "id");
  return {
    ...dasar,
    profilPortofolio: {
      ...dasar.profilPortofolio,
      pola: "proyek-teknis",
      jenjang: "4-8-tahun",
      bidangKamus: "hardware-elektro",
      sudahDitanya: true,
    },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true },
    ...patch,
  };
}

function kertas(data: ResumeData): string {
  return renderToStaticMarkup(
    React.createElement(ResumeDocument, { data, printMode: true }),
  );
}

async function arsipDocx(data: ResumeData) {
  const isi = unzipSync(new Uint8Array(await buildDocx(data)));
  const dokumen = strFromU8(isi["word/document.xml"]);
  return {
    berkas: Object.keys(isi),
    dokumen,
    rels: strFromU8(isi["word/_rels/document.xml.rels"]),
    tipe: strFromU8(isi["[Content_Types].xml"]),
    teks: dokumen.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
  };
}

/** Membaca berkas sumber untuk kriteria yang memang diperiksa atas kodenya. */
function sumber(path: string): string {
  return readFileSync(path, "utf8");
}

export async function runPenerimaanTests(): Promise<void> {
  section("§14 Kriteria penerimaan");

  /* --- 1 --------------------------------------------------------------- */
  check(
    "1. lima pola + fallback lengkap: field inti, contoh, aturan skor, catatan UI, peringatan",
    URUTAN_POLA.length === 6 &&
      URUTAN_POLA.every((slug) => {
        const s = POLA_SCHEMAS[slug];
        return (
          s.fieldInti.length >= 4 &&
          s.contoh.judul.trim().length > 0 &&
          s.aturanSkor.length > 0 &&
          s.catatanUI.length > 0 &&
          // Fallback `umum` memang tidak punya peringatan khusus - tidak ada
          // bidang yang dapat diperingatkan tanpa tahu bidangnya.
          (s.slug === "umum" || s.peringatan.length > 0)
        );
      }),
  );
  check(
    "1b. catatan UI memuat angka yang berasal dari riset, bukan kalimat kosong",
    POLA_SCHEMAS["karya-visual"].catatanUI.join(" ").includes("30-35") &&
      POLA_SCHEMAS["karya-visual"].catatanUI.join(" ").includes("5-10 MB"),
  );

  /* --- 2 --------------------------------------------------------------- */
  const kasusCari: [string, string][] = [
    ["Kedokteran Gigi", "praktik-jam"],
    ["Ahwal Syakhshiyyah", "praktik-jam"],
    ["PWK", "karya-visual"],
    ["Tata Boga", "praktik-jam"],
    ["Mekatronika", "proyek-teknis"],
  ];
  check(`2. kamus memuat ${KAMUS_BIDANG.length} entri (minimal 21)`, KAMUS_BIDANG.length >= 21);
  for (const [ketikan, pola] of kasusCari) {
    equal(
      `2b. "${ketikan}" menemukan pola yang benar`,
      cariBidang(ketikan)[0]?.entri.polaDisarankan,
      pola,
    );
  }

  /* --- 3 --------------------------------------------------------------- */
  const sebelumGanti = item({
    detailTambahan: [
      { label: "Lapisan PCB", nilai: "4", satuan: "layer", prioritas: 1 },
    ],
  });
  const sesudahGanti = gantiPolaItem(sebelumGanti, "karya-visual");
  check(
    "3. ganti pola: judul, peran, konteks, tanggal, dan detail tambahan tetap utuh",
    sesudahGanti.name === sebelumGanti.name &&
      sesudahGanti.role === sebelumGanti.role &&
      sesudahGanti.konteks === sebelumGanti.konteks &&
      sesudahGanti.startDate === sebelumGanti.startDate &&
      sesudahGanti.detailTambahan.length === 1,
  );
  check(
    "3b. field inti lama pindah ke arsip, bukan terhapus",
    isiArsip(sesudahGanti).length >= 3,
    isiArsip(sesudahGanti).map((a) => a.kunci).join(", "),
  );
  check(
    "3c. dan kembali sendiri saat pola lamanya dipilih lagi",
    JSON.stringify(gantiPolaItem(sesudahGanti, "proyek-teknis").inti) ===
      JSON.stringify(sebelumGanti.inti),
  );

  /* --- 4 --------------------------------------------------------------- */
  const tigaLengkap = cv({
    projects: [1, 2, 3].map((i) =>
      item({
        id: `a${i}`,
        verifikator: { nama: "Ir. Sari", jabatan: "Manajer", hubungan: "Atasan" },
      }),
    ),
  });
  const tigaKosong = cv({
    projects: [1, 2, 3].map((i) =>
      item({
        id: `b${i}`,
        role: "Anggota Tim",
        bullets: [],
        ringkasan: "",
        tautan: [],
        inti: {},
      }),
    ),
  });
  const skorLengkap = Math.round(nilaiBuktiKarya(tigaLengkap).skor);
  const skorKosong = Math.round(nilaiBuktiKarya(tigaKosong).skor);
  check("4. tiga item lengkap + verifikator >= 85", skorLengkap >= 85, String(skorLengkap));
  check("4b. tiga item tanpa angka dan tautan < 50", skorKosong < 50, String(skorKosong));
  const saranKosong = analyzeResume(tigaKosong, "", 1).suggestions.filter(
    (s) => s.dimension === "buktiKarya",
  );
  const kalimatPola = Object.values(POLA_SCHEMAS["proyek-teknis"].saranSkor).filter(
    (k): k is string => Boolean(k),
  );
  check(
    "4c. sarannya menyebut field spesifik dan berasal dari kalimat polanya sendiri",
    saranKosong.some((s) => kalimatPola.some((k) => s.message.includes(k))),
    saranKosong[0]?.message.slice(0, 90) ?? "tidak ada saran",
  );

  /* --- 5 --------------------------------------------------------------- */
  const cvTautan = cv({ projects: [item()] });
  let semuaTemplateBenar = true;
  for (const template of TEMPLATE_ORDER) {
    const html = kertas({ ...cvTautan, template });
    const teks = resumeToPlainText({ ...cvTautan, template });
    if (
      !html.toUpperCase().includes("PORTOFOLIO PROYEK") ||
      !html.includes('href="https://contoh.test/karya"') ||
      !html.includes(">contoh.test/karya<") ||
      !teks.includes("https://contoh.test/karya")
    ) {
      semuaTemplateBenar = false;
    }
  }
  check(
    "5. sepuluh template: bagian portofolio tampil, teks polos + hyperlink pada teks yang sama",
    semuaTemplateBenar,
  );
  const wordTautan = await arsipDocx(cvTautan);
  check(
    "5b. Word: teksnya polos di document.xml, alamat penuhnya di relationship",
    wordTautan.teks.includes("contoh.test/karya") &&
      wordTautan.rels.includes("https://contoh.test/karya"),
  );
  const jsonTautan = JSON.stringify(toExportFile(cvTautan));
  check("5c. JSON memuat bagian portofolio", jsonTautan.includes("Panel Kendali"));
  check(
    "5d. teks CV berupa teks sungguhan, bukan gambar",
    !kertas(cvTautan).includes("<img") &&
      kertas(cvTautan).includes("Panel Kendali"),
  );
  check(
    "5e. tidak ada tabel maupun kolom ganda di dokumen",
    !kertas(cvTautan).includes("<table") &&
      !wordTautan.dokumen.includes("<w:tbl>"),
  );

  /* --- 6 --------------------------------------------------------------- */
  const dasarGabung = cv();
  const induk = dasarGabung.experiences[0];
  const cvGabung: ResumeData = {
    ...dasarGabung,
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, gabungKePengalaman: true },
    projects: [item({ konteks: induk.company, parentPengalamanId: induk.id })],
  };
  const teksGabung = resumeToPlainText(cvGabung);
  const posJudulKerja = teksGabung.indexOf("PENGALAMAN KERJA");
  const posItem = teksGabung.indexOf("Panel Kendali");
  const posBagianLain = teksGabung.indexOf("PENDIDIKAN");
  check(
    "6. sakelar gabung: item muncul sebagai entri di bawah PENGALAMAN KERJA",
    posJudulKerja >= 0 && posItem > posJudulKerja && posItem < posBagianLain,
  );

  /* --- 7 --------------------------------------------------------------- */
  const word = await arsipDocx(cvGabung);
  check(
    "7. Word: nol bagian header/footer, nol rujukan header/footer",
    word.berkas.filter((n) => /^word\/(header|footer)\d*\.xml$/.test(n)).length === 0 &&
      !word.dokumen.includes("headerReference") &&
      !word.dokumen.includes("footerReference") &&
      !word.tipe.includes("header+xml") &&
      !word.tipe.includes("footer+xml"),
  );

  /* --- 8 --------------------------------------------------------------- */
  const strSeumurHidup = {
    ...emptyCertification(),
    name: "STR",
    masaBerlaku: "seumur-hidup" as const,
    expiryDate: "",
  };
  check(
    "8. masa berlaku menerima \"seumur hidup\" tanpa memaksa tanggal",
    masaBerlakuTeks(strSeumurHidup) === "Berlaku seumur hidup" &&
      resumeDataSchema.safeParse({
        ...sampleResume("uji", "id"),
        certifications: [strSeumurHidup],
      }).success,
  );

  /* --- 9 --------------------------------------------------------------- */
  const panel = sumber("src/components/ats/AtsPanel.tsx");
  const kamusId = sumber("src/lib/i18n/id.ts");
  const berkasUi = [
    "src/app/ketentuan/content.tsx",
    "src/app/privasi/content.tsx",
    "src/app/opengraph-image.tsx",
    "src/lib/diagrams.ts",
    "src/lib/i18n/id.ts",
    "src/lib/i18n/en.ts",
    "src/components/ats/AtsPanel.tsx",
  ];
  /*
    Komentar kode dibuang lebih dulu.

    Yang dilarang §14 adalah teks yang dibaca pengguna, bukan komentar yang
    justru menjelaskan mengapa istilah itu tidak dipakai - dan komentar
    semacam itu memang ada di AtsPanel.tsx dan di types.ts, sengaja.
  */
  const tanpaKomentar = (isi: string) =>
    isi.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const menyebutSkorAts = berkasUi.filter((f) =>
    /"[^"]*[Ss]kor ATS[^"]*"|"[^"]*ATS [Ss]core[^"]*"/.test(tanpaKomentar(sumber(f))),
  );
  check(
    "9. tidak ada teks antarmuka yang menyebut angkanya \"Skor ATS\"",
    menyebutSkorAts.length === 0,
    menyebutSkorAts.join(", "),
  );
  check(
    "9b. sanggahan permanen tampil di sebelah kedua angka",
    panel.includes("scoreDisclaimer") &&
      panel.includes("strengthTitle") &&
      panel.includes("matchTitle") &&
      kamusId.includes("tidak memprediksi keputusan sistem perekrutan mana pun"),
  );
  check(
    "9c. kata \"ATS\" sebagai nama produk dan istilah kategori tetap ada",
    sumber("src/lib/site.ts").includes("ATS"),
  );

  /* --- 10 -------------------------------------------------------------- */
  const cvBersih = sampleResume("uji", "id");
  const satuHalaman = analyzeResume(cvBersih, "", 1).score;
  const empatHalaman = analyzeResume(cvBersih, "", 4).score;
  check(
    "10. tidak ada penalti panjang halaman - nilai tidak bergerak",
    satuHalaman === empatHalaman,
    `${satuHalaman} = ${empatHalaman}`,
  );
  check(
    "10b. pola Publikasi & Kredit bahkan tanpa indikator panjang sama sekali",
    POLA_SCHEMAS["karya-terkredit"].tanpaIndikatorPanjang === true,
  );

  /* --- 11 -------------------------------------------------------------- */
  const cvLamaMentah = {
    title: "CV Lama",
    personalInfo: { fullName: "Budi Santoso" },
    projects: [
      { id: "p1", name: "SIMAK", role: "Pengembang", url: "github.com/x/y", startDate: "2020-09", endDate: "2021-05", bullets: ["Membangun modul presensi."] },
    ],
  };
  const cvLama = resumeDataSchema.parse(migrasiDokumenCV(cvLamaMentah));
  check(
    "11. CV lama terbuka, portofolio mati, isian utuh",
    cvLama.portofolio.aktif === false && cvLama.projects[0].name === "SIMAK",
  );
  equal(
    "11b. skor CV contoh tidak bergeser sebelum portofolio diaktifkan",
    analyzeResume(cvBersih, "", 1).score,
    98,
  );
  check(
    "11c. dan dapat diekspor ke ketiga format tanpa galat",
    (() => {
      try {
        resumeToPlainText(cvLama as unknown as ResumeData);
        JSON.stringify(toExportFile(cvLama as unknown as ResumeData));
        kertas(cvLama as unknown as ResumeData);
        return true;
      } catch {
        return false;
      }
    })(),
  );

  /* --- 12 -------------------------------------------------------------- */
  const cvRedaksi: ResumeData = {
    ...cv(),
    profilPortofolio: { ...cv().profilPortofolio, bidangKamus: "energi-tambang-hse" },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, modeRedaksi: true },
    projects: [item({ konteks: "PT Rahasia Energi", ringkasan: "Throughput 8.400 ton." })],
  };
  const wordRedaksi = await arsipDocx(cvRedaksi);
  check(
    "12. Mode Redaksi mengganti nama klien dan angka pasti di kertas, teks, dan Word",
    [kertas(cvRedaksi), resumeToPlainText(cvRedaksi), wordRedaksi.teks].every(
      (isi) => !isi.includes("PT Rahasia Energi") && !isi.includes("8.400"),
    ),
  );

  /* --- 13 -------------------------------------------------------------- */
  const peringatanUntuk = (pola: keyof typeof POLA_SCHEMAS, kamus: string) =>
    [
      ...POLA_SCHEMAS[pola].peringatan,
      ...(entriKamus(kamus)?.peringatanTambahan ?? []),
    ].join(" ");
  check(
    "13. peringatan kerahasiaan tampil untuk kesehatan dan psikologi",
    /identitas pasien/i.test(peringatanUntuk("praktik-jam", "kedokteran-kesehatan")) &&
      /asesmen|responden/i.test(peringatanUntuk("dampak-program", "sosial-humaniora")),
  );
  check(
    "13b. dan untuk hardware/energi serta hukum/keuangan",
    /NDA/i.test(peringatanUntuk("proyek-teknis", "energi-tambang-hse")) &&
      /kerahasiaan klien/i.test(peringatanUntuk("dampak-program", "hukum")),
  );

  /* --- 14 -------------------------------------------------------------- */
  const temuanBahasa = periksaBahasa("Kami membangun sistem pemantauan.");
  check(
    "14. validator menandai \"kami membangun sistem\" beserta usul perbaikannya",
    temuanBahasa.length === 1 && temuanBahasa[0].usul.includes("saya merancang"),
  );

  /* --- 15 -------------------------------------------------------------- */
  const ambangUtama = ["dokter", "dokter-gigi", "nakes-lain"].map(ambangProfesi);
  check(
    "15. blok agregat menampilkan ambang 250/100/50 SKP dengan ranah 45/35/5",
    ambangUtama[0]?.total === 250 &&
      ambangUtama[1]?.total === 100 &&
      ambangUtama[2]?.total === 50 &&
      ambangUtama.every(
        (a) =>
          a?.ranah[0].minPersen === 45 &&
          a?.ranah[1].minPersen === 35 &&
          a?.ranah[2].minPersen === 5,
      ),
  );

  /* --- 16 -------------------------------------------------------------- */
  const IKLAN_SIPIL = `Dibutuhkan Site Engineer.
Kualifikasi: memahami DED, RAB, shop drawing, kurva S, uji slump, dan soil test.
Terbiasa melakukan pengawasan lapangan harian.`;
  const cvSipilKosong: ResumeData = {
    ...cv(),
    profilPortofolio: { ...cv().profilPortofolio, pola: "proyek-teknis", bidangKamus: "sipil-konstruksi" },
    portofolio: { ...bagianPortofolioBawaan(), aktif: false },
    projects: [],
  };
  const cvSipilPortofolio: ResumeData = {
    ...cvSipilKosong,
    portofolio: { ...bagianPortofolioBawaan(), aktif: true },
    projects: [
      item({
        name: "Gedung Perkantoran 12 Lantai",
        inti: {
          jenisProyek: "Gedung perkantoran 12 lantai",
          skalaProyek: "8.400 m2",
          standarKode: ["SNI 2847"],
          hasilTerukur: ["Deviasi kurva S", "-3%", "0%", "6 bulan"],
          tahapKeterlibatan: ["pelaksanaan", "pengawasan"],
        },
        detailTambahan: [
          { label: "Uji slump", nilai: "12", satuan: "cm", prioritas: 5 },
          { label: "Soil test", nilai: "dilakukan", satuan: "", prioritas: 6 },
          { label: "Shop drawing", nilai: "240 lembar", satuan: "", prioritas: 1 },
          { label: "DED", nilai: "lengkap", satuan: "", prioritas: 2 },
          { label: "RAB", nilai: "disusun", satuan: "", prioritas: 3 },
          { label: "Pengawasan lapangan", nilai: "harian", satuan: "", prioritas: 4 },
        ],
      }),
    ],
  };
  const cocokSebelum = analyzeResume(cvSipilKosong, IKLAN_SIPIL, 1).match ?? 0;
  const cocokSesudah = analyzeResume(cvSipilPortofolio, IKLAN_SIPIL, 1).match ?? 0;
  check(
    "16. iklan sipil pada CV berpola Proyek Teknis menaikkan kecocokan kata kunci",
    cocokSesudah > cocokSebelum,
    `${cocokSebelum} -> ${cocokSesudah}`,
  );

  /* --- 17 -------------------------------------------------------------- */
  const komponenForm = [
    sumber("src/components/editor/PortofolioFields.tsx"),
    sumber("src/components/editor/PortofolioOnboarding.tsx"),
  ].join("\n");
  check(
    "17. label form terkait dan tombol dapat dicapai papan ketik",
    komponenForm.includes("aria-label") &&
      komponenForm.includes("aria-pressed") &&
      komponenForm.includes("aria-expanded") &&
      komponenForm.includes("htmlFor") &&
      !komponenForm.includes("onClick={() => {}}"),
  );
  check(
    "17b. warna memakai token tema, bukan warna mati - sehingga mode gelap ikut",
    !/#[0-9a-f]{6}/i.test(komponenForm),
  );

  /* --- 18 -------------------------------------------------------------- */
  const komponen = [
    "src/components/editor/sections.tsx",
    "src/components/editor/PortofolioFields.tsx",
    "src/components/editor/PortofolioOnboarding.tsx",
    "src/components/preview/ResumeDocument.tsx",
    "src/components/compare/CompareClient.tsx",
    "src/components/ats/AtsPanel.tsx",
  ];
  const percabanganPola = komponen.filter((f) =>
    /(pola|bidang)\s*===\s*["']/.test(sumber(f)),
  );
  check(
    "18. tidak ada percabangan pola atau bidang yang dipatok di dalam komponen",
    percabanganPola.length === 0,
    percabanganPola.join(", "),
  );

  /* --- 19 -------------------------------------------------------------- */
  check(
    "19. Q dan R menghasilkan 0-3 sesuai tabel",
    nilaiQ(item({ role: "" }), POLA_SCHEMAS["proyek-teknis"]) === 0 &&
      nilaiQ(item({ role: "Anggota Tim" }), POLA_SCHEMAS["proyek-teknis"]) === 0 &&
      nilaiQ(item({ bullets: [], ringkasan: "", inti: {} }), POLA_SCHEMAS["proyek-teknis"]) === 1 &&
      nilaiQ(item({ inti: { tahapKeterlibatan: ["tender"] } }), POLA_SCHEMAS["proyek-teknis"]) === 2 &&
      nilaiQ(item(), POLA_SCHEMAS["proyek-teknis"]) === 3 &&
      nilaiR(item({ inti: {} }), POLA_SCHEMAS["proyek-teknis"]) === 0 &&
      nilaiR(item(), POLA_SCHEMAS["proyek-teknis"]) === 3,
  );
  check(
    "19b. rentangItemIdeal berbatas atas null tidak membuat P meledak",
    Number.isFinite(pengaliP(50, [1, null])) &&
      pengaliP(50, [1, null]) === 1 &&
      Number.isFinite(pengaliP(0, [1, null])),
  );

  /* --- 20 -------------------------------------------------------------- */
  const mahasiswa = cv({
    profilPortofolio: { ...cv().profilPortofolio, jenjang: "mahasiswa" },
    projects: [
      item({ id: "m1", inti: { ...item().inti, statusKarya: "tugas kuliah" } }),
      item({ id: "m2", inti: { ...item().inti, statusKarya: "tugas kuliah" } }),
    ],
  });
  const skorMahasiswa = Math.round(nilaiBuktiKarya(mahasiswa).skor);
  check(
    "20. mahasiswa dengan dua tugas kuliah lengkap tanpa verifikator >= 70",
    skorMahasiswa >= 70,
    String(skorMahasiswa),
  );

  /* --- 21 -------------------------------------------------------------- */
  const nolItem = cv({ projects: [] });
  const wordNol = await arsipDocx(nolItem);
  check(
    "21. bagian aktif tanpa item tidak mencetak judul di kertas, teks, maupun Word",
    !kertas(nolItem).includes("PORTOFOLIO PROYEK") &&
      !resumeToPlainText(nolItem).includes("PORTOFOLIO PROYEK") &&
      !wordNol.teks.includes("PORTOFOLIO PROYEK"),
  );

  /* --- 22 -------------------------------------------------------------- */
  check(
    "22. tanggal item di luar rentang entri induknya menimbulkan peringatan",
    tanggalDiLuarInduk(
      { startDate: "2019-01", endDate: "2019-06" },
      { startDate: "2023-02", endDate: "", isCurrent: true },
    ) === true &&
      tanggalDiLuarInduk(
        { startDate: "2023-04", endDate: "2023-08" },
        { startDate: "2023-02", endDate: "", isCurrent: true },
      ) === false,
  );
  const lepas = cv({ projects: [item({ name: "Jembatan Mahakam" })] });
  const menempel: ResumeData = {
    ...lepas,
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, gabungKePengalaman: true },
    projects: [
      item({
        name: "Jembatan Mahakam",
        konteks: lepas.experiences[0].company,
        parentPengalamanId: lepas.experiences[0].id,
      }),
    ],
  };
  const hitungJudul = (teks: string) =>
    teks.split("Jembatan Mahakam").length - 1;
  check(
    "22b. kata kuncinya tidak dihitung dua kali saat menempel",
    hitungJudul(resumeToPlainText(menempel)) === 1 &&
      hitungJudul(resumeToPlainText(lepas)) === 1,
  );

  /* --- 23 -------------------------------------------------------------- */
  const skema = sumber("prisma/schema.prisma");
  check(
    "23. verifikator ikut terhapus bersama akun lewat rantai ON DELETE CASCADE",
    /model Project[\s\S]*?verifikator Json/.test(skema) &&
      /resume\s+Resume\s+@relation\(fields: \[resumeId\], references: \[id\], onDelete: Cascade\)/.test(skema) &&
      /user\s+User\s+@relation\(fields: \[userId\], references: \[id\], onDelete: Cascade\)/.test(skema),
  );
  const cvVerifikator = cv({
    projects: [
      item({
        verifikator: { nama: "Ir. Sari Handayani", jabatan: "Manajer", hubungan: "Atasan" },
      }),
    ],
  });
  const wordVerifikator = await arsipDocx(cvVerifikator);
  check(
    "23b. dan tidak muncul di berkas ekspor mana pun",
    ![
      kertas(cvVerifikator),
      resumeToPlainText(cvVerifikator),
      wordVerifikator.teks,
      JSON.stringify(toExportFile(cvVerifikator)),
    ].some((isi) => isi.includes("Sari Handayani")),
  );

  /* --- 24 -------------------------------------------------------------- */
  const kodeAmbang = sumber("src/lib/portfolio/ambang-profesi.ts");
  const kodeSkor = sumber("src/lib/ats/bukti-karya.ts");
  check(
    "24. ambang SKP dibaca dari berkas data, bukan ditulis di dalam kode",
    AMBANG_PROFESI.length >= 5 &&
      AMBANG_PROFESI.every((a) => a.sumber && a.diperbarui) &&
      !/\b250\b/.test(kodeSkor) &&
      kodeAmbang.includes("KMK HK.01.07/1561/2024"),
  );
  check(
    "24b. sanggahannya tampil di bawah progress bar",
    (POLA_SCHEMAS["praktik-jam"].blokAgregat?.sanggahan ?? "").includes(
      "bukan pengganti catatan resmi",
    ) &&
      sumber("src/components/editor/PortofolioFields.tsx").includes("def.sanggahan"),
  );
}
