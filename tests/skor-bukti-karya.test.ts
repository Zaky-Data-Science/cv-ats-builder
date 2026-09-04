import {
  nilaiBuktiKarya,
  nilaiItem,
  nilaiQ,
  nilaiR,
  pengaliP,
} from "../src/lib/ats/bukti-karya";
import { analyzeResume, DIMENSION_WEIGHTS, dimensionWeights } from "../src/lib/ats/engine";
import { POLA_SCHEMAS } from "../src/lib/portfolio/pola-schemas";
import { bagianPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { sampleResume } from "../src/lib/resume/sample";
import type { ProjectItem, ResumeData } from "../src/lib/resume/types";
import { check, equal, section } from "./harness";

/**
 * Kekuatan bukti - model P × Q × R.
 *
 * Rubriknya deterministik, dan itulah yang diuji: masukan yang sama harus
 * menghasilkan angka yang sama, tiap angka harus dapat ditelusuri ke isian
 * penyebabnya, dan tidak boleh ada satu pun jalur yang menghasilkan nilai di
 * luar 0-100.
 *
 * Satu hal yang perlu disebut sebelum membaca angka-angka di bawah: ambang
 * FAIP (600 / 3.000 / 6.000) **tidak** dipakai sebagai skala. Angka itu untuk
 * akumulasi karier bertahun-tahun, bukan untuk satu bagian CV. Yang dipinjam
 * hanya strukturnya.
 */

const TEKNIS = POLA_SCHEMAS["proyek-teknis"];
const VISUAL = POLA_SCHEMAS["karya-visual"];
const TERKREDIT = POLA_SCHEMAS["karya-terkredit"];

function item(patch: Partial<ProjectItem> = {}): ProjectItem {
  return {
    id: "i1",
    name: "Panel Kendali",
    role: "",
    url: "",
    startDate: "2023-01",
    endDate: "2023-08",
    bullets: [],
    konteks: "PT Contoh",
    lokasi: "",
    ringkasan: "",
    tautan: [],
    kataKunci: [],
    inti: {},
    detailTambahan: [],
    verifikator: { nama: "", jabatan: "", hubungan: "" },
    refleksi: "",
    polaOverride: "",
    parentPengalamanId: "",
    arsip: {},
    ...patch,
  };
}

/** Item proyek teknis yang memenuhi seluruh syarat Q dan R. */
function itemPenuh(patch: Partial<ProjectItem> = {}): ProjectItem {
  return item({
    role: "Perancang Elektronik",
    bullets: ["Menguji efisiensi konverter pada beban penuh."],
    inti: {
      skalaProyek: "3 A / 24 V",
      tahapKeterlibatan: ["DED/desain", "pengujian"],
      standarKode: ["IEC", "PUIL"],
      hasilTerukur: ["Efisiensi", "84%", "92%", "6 minggu"],
    },
    ...patch,
  });
}

function cv(patch: Partial<ResumeData> = {}): ResumeData {
  const dasar = sampleResume("uji", "id");
  return {
    ...dasar,
    profilPortofolio: {
      ...dasar.profilPortofolio,
      pola: "proyek-teknis",
      jenjang: "4-8-tahun",
      sudahDitanya: true,
    },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true },
    ...patch,
  };
}

export function runSkorBuktiKaryaTests(): void {
  /* ---------------------------------------------------------------- */

  section("Q - peranan (0-3)");

  equal("peran kosong bernilai 0", nilaiQ(item(), TEKNIS), 0);
  equal(
    "peran generik bernilai 0",
    nilaiQ(item({ role: "Anggota Tim", bullets: ["Merancang panel."] }), TEKNIS),
    0,
  );
  equal(
    "peran spesifik tanpa kata kerja bernilai 1",
    nilaiQ(item({ role: "Perancang Elektronik", ringkasan: "Panel 12 kanal." }), TEKNIS),
    1,
  );
  equal(
    "peran spesifik dengan kata kerja orang pertama bernilai 2",
    nilaiQ(
      item({
        role: "Perancang Elektronik",
        bullets: ["Merancang catu daya 3 A."],
      }),
      TEKNIS,
    ),
    2,
  );
  equal(
    "tahap eksekusi menaikkannya ke 3",
    nilaiQ(itemPenuh(), TEKNIS),
    3,
  );
  equal(
    "tahap yang belum sampai eksekusi berhenti di 2",
    nilaiQ(
      itemPenuh({ inti: { tahapKeterlibatan: ["studi kelayakan", "tender"] } }),
      TEKNIS,
    ),
    2,
  );
  // Kalimat yang subjeknya satu tim tidak memberi tahu bagian mana yang
  // dikerjakan orang ini - dan rubriknya memang menuntut orang pertama.
  equal(
    "poin yang dibuka dengan \"Kami\" tidak dihitung sebagai kata kerja orang pertama",
    nilaiQ(
      item({ role: "Perancang Elektronik", bullets: ["Kami membangun sistem."] }),
      TEKNIS,
    ),
    1,
  );

  /* ---------------------------------------------------------------- */

  section("R - tingkat kesulitan (0-3)");

  equal("tanpa satu pun syarat bernilai 0", nilaiR(item(), TEKNIS), 0);
  equal(
    "skala berangka dan bersatuan memenuhi satu syarat",
    nilaiR(item({ inti: { skalaProyek: "8.400 m2" } }), TEKNIS),
    1,
  );
  equal(
    "angka tanpa satuan belum memenuhi syarat skala",
    nilaiR(item({ inti: { skalaProyek: "8400" } }), TEKNIS),
    0,
  );
  equal(
    "standar terisi memenuhi syarat kedua",
    nilaiR(item({ inti: { skalaProyek: "8.400 m2", standarKode: ["SNI 2847"] } }), TEKNIS),
    2,
  );
  equal("ketiganya terpenuhi bernilai 3", nilaiR(itemPenuh(), TEKNIS), 3);
  equal(
    "hasil tanpa angka belum memenuhi syarat ketiga",
    nilaiR(
      itemPenuh({
        inti: {
          skalaProyek: "3 A / 24 V",
          standarKode: ["IEC"],
          hasilTerukur: ["Efisiensi", "naik", "lebih baik", ""],
        },
      }),
      TEKNIS,
    ),
    2,
  );
  // Slot fleksibel tetap milik penggunanya dan tetap dihitung di Kecocokan
  // Lowongan - tapi membiarkannya menaikkan R berarti siapa pun bisa
  // menaikkan tingkat kesulitan proyeknya hanya dengan menambah baris.
  equal(
    "detail tambahan tidak menaikkan R",
    nilaiR(
      item({
        detailTambahan: [
          { label: "Lapisan PCB", nilai: "4", satuan: "layer", prioritas: 1 },
        ],
      }),
      TEKNIS,
    ),
    0,
  );

  /* ---------------------------------------------------------------- */

  section("Skor item: (Q × R) / 9 × 100");

  equal("Q=3, R=3 menghasilkan 100", nilaiItem(itemPenuh(), TEKNIS).skor, 100);
  equal(
    "Q=2, R=2 menghasilkan 44 (dibulatkan dari 44,4)",
    Math.round(
      nilaiItem(
        item({
          role: "Perancang Elektronik",
          bullets: ["Merancang catu daya 3 A."],
          inti: { skalaProyek: "3 A", standarKode: ["IEC"] },
        }),
        TEKNIS,
      ).skor,
    ),
    44,
  );
  equal(
    "Q=0 membuat skornya nol berapa pun R-nya",
    nilaiItem(itemPenuh({ role: "" }), TEKNIS).skor,
    0,
  );

  /* ---------------------------------------------------------------- */

  section("Penyesuaian: +8 verifikator, +4 refleksi, -15 tanpa tautan");

  const refleksiPanjang =
    "Kalau mengulang, saya akan mengukur efisiensinya sejak pekan pertama, bukan setelah rakitannya jadi.";
  equal(
    "refleksi 80 karakter ke atas menambah 4",
    Math.round(
      nilaiItem(
        item({
          role: "Perancang Elektronik",
          bullets: ["Merancang catu daya."],
          inti: { skalaProyek: "3 A", standarKode: ["IEC"] },
          refleksi: refleksiPanjang,
        }),
        TEKNIS,
      ).skor,
    ),
    48,
  );
  equal(
    "refleksi pendek tidak menambah apa pun",
    Math.round(
      nilaiItem(
        item({
          role: "Perancang Elektronik",
          bullets: ["Merancang catu daya."],
          inti: { skalaProyek: "3 A", standarKode: ["IEC"] },
          refleksi: "Belajar banyak.",
        }),
        TEKNIS,
      ).skor,
    ),
    44,
  );
  check(
    "verifikator menambah 8 pada pola yang memakainya",
    nilaiItem(
      item({
        role: "Perancang Elektronik",
        bullets: ["Merancang catu daya."],
        inti: { skalaProyek: "3 A", standarKode: ["IEC"] },
        verifikator: { nama: "Ir. Sari", jabatan: "Manajer", hubungan: "Atasan" },
      }),
      TEKNIS,
    ).penyesuaian.some((p) => p.jenis === "verifikator-lengkap"),
  );
  check(
    "verifikator tidak menambah apa pun pada pola yang tidak memakainya",
    !nilaiItem(
      item({
        role: "Perancang UX",
        bullets: ["Merancang alur checkout."],
        verifikator: { nama: "Ir. Sari", jabatan: "Manajer", hubungan: "Atasan" },
        tautan: [{ label: "", url: "https://contoh.test/karya" }],
      }),
      VISUAL,
    ).penyesuaian.some((p) => p.jenis === "verifikator-lengkap"),
  );
  check(
    "tanpa tautan, pola Karya & Desain dikurangi 15",
    nilaiItem(
      item({ role: "Perancang UX", bullets: ["Merancang alur checkout."] }),
      VISUAL,
    ).penyesuaian.some((p) => p.jenis === "tanpa-tautan-valid"),
  );
  check(
    "pada pola lain, tautan tidak memengaruhi skor sama sekali",
    !nilaiItem(itemPenuh(), TEKNIS).penyesuaian.some(
      (p) => p.jenis === "tanpa-tautan-valid",
    ),
  );
  equal(
    "hasilnya dijepit di 100, tidak pernah lebih",
    nilaiItem(
      itemPenuh({
        refleksi: refleksiPanjang,
        verifikator: { nama: "Ir. Sari", jabatan: "Manajer", hubungan: "Atasan" },
      }),
      TEKNIS,
    ).skor,
    100,
  );
  equal(
    "hasilnya dijepit di 0, tidak pernah minus",
    nilaiItem(item({ role: "Perancang UX" }), VISUAL).skor,
    0,
  );

  /* ---------------------------------------------------------------- */

  section("P - pengali banyaknya pengalaman");

  equal("nol item bernilai 0", pengaliP(0, [3, 6]), 0);
  equal("di bawah ideal dipotong sebanding", pengaliP(1, [3, 6]), 1 / 3);
  equal("di dalam rentang bernilai penuh", pengaliP(4, [3, 6]), 1);
  equal("melebihi batas atas tidak dihukum", pengaliP(20, [3, 6]), 1);

  // Inilah yang diminta ditangani eksplisit: pola Publikasi & Kredit memang
  // tidak punya batas atas, dan perbandingan angka dengan null pada bahasa ini
  // memberi hasil yang benar secara kebetulan pada sebagian nilai lalu salah
  // pada sisanya.
  equal("batas atas null: satu item pun bernilai penuh", pengaliP(1, [1, null]), 1);
  equal("batas atas null: lima puluh item tetap 1", pengaliP(50, [1, null]), 1);
  check(
    "batas atas null tidak menghasilkan NaN maupun Infinity",
    Number.isFinite(pengaliP(50, [1, null])) &&
      Number.isFinite(pengaliP(0, [1, null])),
  );

  const banyakKarya = cv({
    profilPortofolio: {
      ...cv().profilPortofolio,
      pola: "karya-terkredit",
    },
    publications: Array.from({ length: 50 }, (_, i) => ({
      id: `p${i}`,
      title: `Artikel ke-${i}`,
      publisher: "Jurnal Contoh",
      date: "2024-01",
      url: "https://doi.org/10.1234/contoh",
      doi: "10.1234/contoh",
      tipeLuaran: "artikel jurnal",
      peranSaya: "penulis pertama",
      indeksasiTier: "Scopus Q2",
    })),
  });
  const nilaiBanyak = nilaiBuktiKarya(banyakKarya);
  check(
    "lima puluh karya terbit tidak membuat perhitungan meledak",
    Number.isFinite(nilaiBanyak.skor) &&
      nilaiBanyak.skor >= 0 &&
      nilaiBanyak.skor <= 100,
    `skor ${nilaiBanyak.skor}, P ${nilaiBanyak.p}, n ${nilaiBanyak.n}`,
  );
  equal(
    "batas atasnya memang null pada pola itu",
    TERKREDIT.rentangItemIdeal[1],
    null,
  );

  /* ---------------------------------------------------------------- */

  section("Uji penerimaan rubrik");

  // Ambang FAIP tidak dipakai sebagai skala: nilai tertinggi satu item adalah
  // 100, bukan 600 atau 6.000.
  const tigaLengkap = cv({
    projects: [
      itemPenuh({
        id: "a",
        verifikator: { nama: "Ir. Sari", jabatan: "Manajer", hubungan: "Atasan" },
      }),
      itemPenuh({
        id: "b",
        verifikator: { nama: "Ir. Budi", jabatan: "Manajer", hubungan: "Atasan" },
      }),
      itemPenuh({
        id: "c",
        verifikator: { nama: "Ir. Cita", jabatan: "Manajer", hubungan: "Atasan" },
      }),
    ],
  });
  const skorLengkap = nilaiBuktiKarya(tigaLengkap).skor;
  check(
    "tiga item lengkap dengan verifikator memperoleh 85 ke atas",
    skorLengkap >= 85,
    String(Math.round(skorLengkap)),
  );
  check(
    "skalanya 0-100, bukan ambang akumulasi karier",
    skorLengkap <= 100,
    String(Math.round(skorLengkap)),
  );

  const tigaKosong = cv({
    projects: [
      item({ id: "a", role: "Anggota Tim" }),
      item({ id: "b", role: "Anggota Tim" }),
      item({ id: "c", role: "Anggota Tim" }),
    ],
  });
  check(
    "tiga item tanpa angka dan tanpa tautan berada di bawah 50",
    nilaiBuktiKarya(tigaKosong).skor < 50,
    String(Math.round(nilaiBuktiKarya(tigaKosong).skor)),
  );

  /* ---------------------------------------------------------------- */

  section("Penyesuaian jenjang");

  /*
    Mahasiswa dengan dua tugas kuliah yang terisi lengkap, tanpa verifikator.
    Batas bawah jumlah itemnya turun jadi 2, sehingga P tetap penuh - dan
    itulah yang mencegah pemula dinilai dengan ambang senior lalu memperoleh
    angka rendah tanpa jalan keluar.
  */
  const mahasiswa = cv({
    profilPortofolio: { ...cv().profilPortofolio, jenjang: "mahasiswa" },
    projects: [
      itemPenuh({ id: "a", inti: { ...itemPenuh().inti, statusKarya: "tugas kuliah" } }),
      itemPenuh({ id: "b", inti: { ...itemPenuh().inti, statusKarya: "tugas kuliah" } }),
    ],
  });
  const skorMahasiswa = nilaiBuktiKarya(mahasiswa).skor;
  check(
    "mahasiswa dengan dua tugas kuliah lengkap tanpa verifikator mencapai 70 ke atas",
    skorMahasiswa >= 70,
    String(Math.round(skorMahasiswa)),
  );
  equal(
    "pada jenjang senior, dua item saja dipotong karena di bawah ideal",
    Math.round(
      nilaiBuktiKarya({
        ...mahasiswa,
        profilPortofolio: { ...mahasiswa.profilPortofolio, jenjang: "4-8-tahun" },
      }).skor,
    ),
    Math.round(100 * (2 / 3)),
  );
  equal(
    "status \"tugas kuliah\" tidak menurunkan skor",
    nilaiBuktiKarya(mahasiswa).skor,
    nilaiBuktiKarya({
      ...mahasiswa,
      projects: mahasiswa.projects.map((p) => ({
        ...p,
        inti: { ...p.inti, statusKarya: "dirilis ke publik" },
      })),
    }).skor,
  );

  /* ---------------------------------------------------------------- */

  section("Renormalisasi bobot");

  const cvMati = sampleResume("uji", "id");
  const bobotMati = dimensionWeights(cvMati);
  check(
    "portofolio mati: lima dimensi lama memakai bobot aslinya",
    bobotMati.completeness === DIMENSION_WEIGHTS.completeness &&
      bobotMati.parseability === DIMENSION_WEIGHTS.parseability &&
      bobotMati.contentQuality === DIMENSION_WEIGHTS.contentQuality &&
      bobotMati.keywordMatch === DIMENSION_WEIGHTS.keywordMatch &&
      bobotMati.structure === DIMENSION_WEIGHTS.structure,
  );
  equal("portofolio mati: bobot Bukti Karya nol", bobotMati.buktiKarya, 0);

  const cvNyala = cv();
  const bobotNyala = dimensionWeights(cvNyala);
  equal(
    "portofolio nyala: bobot Bukti Karya mengikuti polanya",
    bobotNyala.buktiKarya,
    TEKNIS.bobotBuktiKarya,
  );
  const totalNyala = Object.values(bobotNyala).reduce((a, b) => a + b, 0);
  check(
    "totalnya tetap 100",
    Math.abs(totalNyala - 100) < 0.0001,
    String(totalNyala),
  );
  check(
    "lima dimensi lama turun sebanding, bukan sembarangan",
    Math.abs(
      bobotNyala.completeness -
        DIMENSION_WEIGHTS.completeness * ((100 - TEKNIS.bobotBuktiKarya) / 100),
    ) < 0.0001,
  );

  // Inilah janji yang paling mudah dilanggar tanpa ketahuan: CV yang belum
  // menyalakan portofolio tidak boleh bergeser satu angka pun karena adanya
  // dimensi baru.
  const skorMati = analyzeResume(cvMati, "", 1).score;
  equal("skor CV lama tidak bergeser oleh dimensi baru", skorMati, 98);
  check(
    "dimensi Bukti Karya tidak ikut dihitung selama portofolio mati",
    analyzeResume(cvMati, "", 1).dimensions.find((d) => d.key === "buktiKarya")
      ?.applicable === false,
  );

  /* ---------------------------------------------------------------- */

  section("Dua angka, bukan satu");

  const hasil = analyzeResume(cv({ projects: [itemPenuh()] }), "", 1);
  check(
    "Kekuatan & Keterbacaan terisi, Kecocokan Lowongan kosong tanpa iklan",
    hasil.strength > 0 && hasil.match === null,
    `strength ${hasil.strength}, match ${hasil.match}`,
  );
  equal("skor lama tetap sama dengan Kekuatan & Keterbacaan", hasil.score, hasil.strength);
  check(
    "rincian per item ikut dikembalikan untuk ditelusuri",
    hasil.buktiKarya !== null &&
      hasil.buktiKarya.item.length === 1 &&
      hasil.buktiKarya.item[0].q === 3 &&
      hasil.buktiKarya.item[0].r === 3,
  );
}
