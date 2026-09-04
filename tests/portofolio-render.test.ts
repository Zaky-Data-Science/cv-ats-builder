import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { strFromU8, unzipSync } from "fflate";
import { ResumeDocument } from "../src/components/preview/ResumeDocument";
import { buildDocx } from "../src/lib/docx/build";
import { bagianPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { bersihkanUrl, tautanTercetak } from "../src/lib/portfolio/render";
import { resumeToPlainText } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import { toExportFile } from "../src/lib/resume/serialize";
import { TEMPLATE_ORDER } from "../src/lib/resume/templates";
import type { ProjectItem, ResumeData } from "../src/lib/resume/types";
import { check, equal, section } from "./harness";

/**
 * Bagaimana item portofolio tercetak - di kertas, di teks polos, dan di Word.
 *
 * Lima janji yang diuji di sini, dan kelimanya dipilih karena kalau dilanggar
 * tidak ada yang tahu sampai berkasnya sudah terlanjur dikirim ke perekrut:
 *
 *  1. Tautan tercetak sebagai teks polos yang terbaca **dan** tetap membawa
 *     pranala - bukan salah satunya.
 *  2. Berkas Word tidak menaruh satu pun isi di header/footer dokumen, tempat
 *     isinya hilang total dari ekstraksi teks.
 *  3. Bagian portofolio yang menyala tanpa item tidak mencetak judul kosong.
 *  4. `verifikator` dan `refleksi` tidak pernah tercetak di CV; `verifikator`
 *     juga tidak pernah masuk berkas ekspor mana pun, sementara `refleksi`
 *     tetap ada di berkas cadangan JSON milik penggunanya sendiri.
 *  5. Sakelar penggabungan tidak pernah menyala sendiri.
 */

const TAUTAN_REPO = "https://github.com/budisantoso/simak-pwa";
const NAMA_VERIFIKATOR = "Ir. Sari Handayani";
const ISI_REFLEKSI =
  "Kalau mengulang, saya akan mengukur waktu muat sejak pekan pertama, bukan setelah rilis.";

/** Satu item portofolio yang terisi selengkap mungkin. */
function itemLengkap(patch: Partial<ProjectItem> = {}): ProjectItem {
  return {
    id: "item-1",
    name: "Panel Kendali Instrumentasi",
    role: "Perancang Elektronik",
    url: "",
    startDate: "2023-02",
    endDate: "2023-11",
    bullets: ["Saya menguji efisiensi 92% pada beban 3 A."],
    konteks: "PT Nusantara Digital",
    lokasi: "Samarinda",
    ringkasan: "Merancang catu daya 3 A untuk instrumentasi lapangan.",
    tautan: [
      { label: "", url: `${TAUTAN_REPO}?utm_source=cv&utm_medium=email` },
      { label: "Demo", url: "https://demo.example.com/panel" },
    ],
    kataKunci: [],
    inti: {
      jenisProyek: "Panel kendali 12 kanal",
      skalaProyek: "3 A / 24 V",
      tahapKeterlibatan: ["DED/desain", "pengujian"],
      standarKode: ["IEC", "PUIL"],
      hasilTerukur: ["Efisiensi", "84%", "92%", "6 minggu"],
    },
    detailTambahan: [
      { label: "Lapisan PCB", nilai: "4", satuan: "layer", prioritas: 1 },
      { label: "Komponen BOM", nilai: "112", satuan: "komponen", prioritas: 2 },
      { label: "Biaya per unit", nilai: "480.000", satuan: "rupiah", prioritas: 3 },
      { label: "Konsumsi arus", nilai: "3", satuan: "A", prioritas: 4 },
      { label: "Detail kelima", nilai: "tidak dicetak", satuan: "", prioritas: 5 },
      { label: "Detail keenam", nilai: "juga tidak", satuan: "", prioritas: 6 },
    ],
    verifikator: {
      nama: NAMA_VERIFIKATOR,
      jabatan: "Manajer Proyek",
      hubungan: "Atasan langsung",
    },
    refleksi: ISI_REFLEKSI,
    polaOverride: "",
    parentPengalamanId: "",
    arsip: {},
    ...patch,
  };
}

function cvPortofolio(patch: Partial<ResumeData> = {}): ResumeData {
  const dasar = sampleResume("uji", "id");
  return {
    ...dasar,
    profilPortofolio: {
      ...dasar.profilPortofolio,
      pola: "proyek-teknis",
      bidangKamus: "hardware-elektro",
      jurusan: "Teknik Elektro",
      sudahDitanya: true,
    },
    portofolio: { ...bagianPortofolioBawaan(), aktif: true },
    projects: [itemLengkap()],
    ...patch,
  };
}

function html(data: ResumeData): string {
  return renderToStaticMarkup(
    React.createElement(ResumeDocument, { data, printMode: true }),
  );
}

/** Isi berkas Word, dibongkar sebagai arsip zip sungguhan. */
async function bongkarDocx(data: ResumeData) {
  const buffer = await buildDocx(data);
  const isi = unzipSync(new Uint8Array(buffer));
  const baca = (nama: string) => (isi[nama] ? strFromU8(isi[nama]) : "");
  const dokumen = baca("word/document.xml");
  return {
    berkas: Object.keys(isi),
    dokumen,
    rels: baca("word/_rels/document.xml.rels"),
    tipe: baca("[Content_Types].xml"),
    // Teks alir dokumen, sesudah seluruh tag dibuang - inilah yang dilihat
    // pengekstrak teks sederhana.
    teks: dokumen.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
  };
}

export async function runPortofolioRenderTests(): Promise<void> {
  /* ---------------------------------------------------------------- */

  section("Tautan: teks polos yang tetap ber-pranala");

  equal(
    "parameter pelacakan dibuang dari alamat",
    bersihkanUrl(`${TAUTAN_REPO}?utm_source=cv&utm_medium=email`),
    TAUTAN_REPO,
  );
  equal(
    "kueri yang memang bermakna tidak ikut dibuang",
    bersihkanUrl("https://youtube.com/watch?v=abc123"),
    "https://youtube.com/watch?v=abc123",
  );
  const tautan = tautanTercetak(itemLengkap());
  equal("maksimal dua tautan per item", tautan.length, 2);
  equal(
    "teksnya polos, tanpa skema",
    tautan[0].teks,
    "github.com/budisantoso/simak-pwa",
  );
  equal("alamatnya tetap penuh", tautan[0].href, TAUTAN_REPO);

  const cv = cvPortofolio();
  const markup = html(cv);
  check(
    "di kertas: teks polos dan pranala menempel pada teks yang sama",
    markup.includes(
      `<a href="${TAUTAN_REPO}" style="color:inherit;text-decoration:none">github.com/budisantoso/simak-pwa</a>`,
    ),
    markup.match(/<a href="https:\/\/github[^<]*<\/a>/)?.[0] ?? "tidak ditemukan",
  );

  const teksPolos = resumeToPlainText(cv);
  check(
    "di teks polos: alamat penuh, karena teks tidak dapat membawa pranala",
    teksPolos.includes(TAUTAN_REPO),
  );

  const word = await bongkarDocx(cv);
  check(
    "di Word: teks polosnya tercetak sebagai teks",
    word.teks.includes("github.com/budisantoso/simak-pwa"),
  );
  check(
    "di Word: alamat penuhnya tersimpan sebagai relationship pranala",
    word.rels.includes(TAUTAN_REPO),
  );

  /* ---------------------------------------------------------------- */

  section("Word: nol konten di header dan footer");

  const bagianHeaderFooter = word.berkas.filter((nama) =>
    /^word\/(header|footer)\d*\.xml$/.test(nama),
  );
  equal(
    "tidak ada satu pun bagian header/footer di dalam berkas",
    bagianHeaderFooter.length,
    0,
  );
  check(
    "dokumen tidak merujuk header mana pun",
    !word.dokumen.includes("headerReference"),
  );
  check(
    "dokumen tidak merujuk footer mana pun",
    !word.dokumen.includes("footerReference"),
  );
  check(
    "daftar tipe isi tidak memuat header maupun footer",
    !word.tipe.includes("header+xml") && !word.tipe.includes("footer+xml"),
  );
  // Kontak pelamar harus berada di body, bukan di header - di sanalah ia
  // hilang total dari ekstraksi teks.
  check(
    "kontak pelamar berada di dalam body dokumen",
    word.teks.includes(cv.personalInfo.email),
  );

  /* ---------------------------------------------------------------- */

  section("Verifikator dan refleksi tidak pernah ikut ekspor");

  check("tidak muncul di kertas", !markup.includes(NAMA_VERIFIKATOR));
  check("refleksi tidak muncul di kertas", !markup.includes("Kalau mengulang"));
  check("tidak muncul di teks polos", !teksPolos.includes(NAMA_VERIFIKATOR));
  check(
    "refleksi tidak muncul di teks polos",
    !teksPolos.includes("Kalau mengulang"),
  );
  check("tidak muncul di berkas Word", !word.teks.includes(NAMA_VERIFIKATOR));
  check(
    "refleksi tidak muncul di berkas Word",
    !word.teks.includes("Kalau mengulang"),
  );

  const json = JSON.stringify(toExportFile(cv));
  check("tidak muncul di berkas JSON", !json.includes(NAMA_VERIFIKATOR));
  // Refleksi justru harus ada di JSON: berkas itu cadangan milik penggunanya
  // sendiri, dan membuang catatannya diam-diam membuat janji "impor kembali
  // kapan saja" bocor tanpa ada yang tahu.
  check("refleksi tetap ada di berkas JSON, karena itu cadangan miliknya sendiri", json.includes("Kalau mengulang"));
  check(
    "isi CV selebihnya tetap ada di berkas JSON",
    json.includes("Panel Kendali Instrumentasi"),
  );

  /* ---------------------------------------------------------------- */

  section("Baris Detail");

  check(
    "field inti terangkai jadi satu baris, dipisah titik tengah",
    markup.includes("Detail: Jenis proyek: Panel kendali 12 kanal"),
    markup.match(/Detail: [^<]{0,120}/)?.[0] ?? "tidak ditemukan",
  );
  check(
    "hasil terukur tercetak sebagai perubahan, bukan sebagai daftar",
    markup.includes("Efisiensi: 84% → 92%, 6 minggu"),
  );
  check(
    "empat detail tambahan teratas ikut tercetak",
    markup.includes("Lapisan PCB: 4 layer") &&
      markup.includes("Konsumsi arus: 3 A"),
  );
  check(
    "detail kelima dan keenam tersimpan tapi tidak tercetak",
    !markup.includes("Detail kelima") && !markup.includes("Detail keenam"),
  );
  check(
    "baris Detail bukan tabel",
    !markup.includes("<table"),
  );

  /* ---------------------------------------------------------------- */

  section("Bagian kosong tidak mencetak judul");

  const tanpaItem = cvPortofolio({ projects: [] });
  check(
    "kertas: judul bagian tidak muncul",
    !html(tanpaItem).includes("PORTOFOLIO PROYEK"),
  );
  check(
    "teks polos: judul bagian tidak muncul",
    !resumeToPlainText(tanpaItem).includes("PORTOFOLIO PROYEK"),
  );
  const wordKosong = await bongkarDocx(tanpaItem);
  check(
    "Word: judul bagian tidak muncul",
    !wordKosong.teks.includes("PORTOFOLIO PROYEK"),
  );

  /* ---------------------------------------------------------------- */

  section("Gabung ke Pengalaman Kerja");

  equal(
    "sakelar tidak pernah menyala sendiri",
    bagianPortofolioBawaan().gabungKePengalaman,
    false,
  );
  equal(
    "menyalakan bagian portofolio tidak ikut menyalakan penggabungan",
    cvPortofolio().portofolio.gabungKePengalaman,
    false,
  );

  /*
    Entri induknya diambil dari CV yang sama, bukan dari sampleResume() yang
    dipanggil ulang: tiap pemanggilan menghasilkan id baru, dan penunjuk induk
    yang menunjuk id dari CV lain adalah persis keadaan "yatim" yang justru
    harus dicegah.
  */
  const cvDasar = cvPortofolio();
  const induk = cvDasar.experiences[0];
  const cvGabung: ResumeData = {
    ...cvDasar,
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, gabungKePengalaman: true },
    projects: [
      itemLengkap({
        id: "menempel",
        konteks: induk.company,
        parentPengalamanId: induk.id,
      }),
      itemLengkap({
        id: "mandiri",
        name: "Aplikasi Pencatat Pribadi",
        konteks: "Proyek Mandiri",
        parentPengalamanId: "",
      }),
    ],
  };

  const markupGabung = html(cvGabung);
  const posisiMenempel = markupGabung.indexOf("Panel Kendali Instrumentasi");
  const posisiJudul = markupGabung.indexOf("PORTOFOLIO PROYEK");
  const posisiMandiri = markupGabung.indexOf("Aplikasi Pencatat Pribadi");
  check(
    "item berinduk tercetak di dalam PENGALAMAN KERJA, sebelum judul portofolio",
    posisiMenempel > 0 && posisiJudul > posisiMenempel,
    `item ${posisiMenempel}, judul ${posisiJudul}`,
  );
  check(
    "item tanpa induk tetap tinggal di bagian portofolio",
    posisiMandiri > posisiJudul,
  );
  check(
    "item berinduk diberi label jenisnya, seperti yang diharapkan pengurai",
    markupGabung.includes("Proyek: Panel Kendali Instrumentasi"),
  );

  // Pemberi kerja yang sama tidak boleh tercetak dua kali dalam satu blok.
  const teksGabung = resumeToPlainText(cvGabung);
  const barisMenempel = teksGabung
    .split("\n")
    .find((baris) => baris.includes("Proyek: Panel Kendali Instrumentasi"));
  check(
    "konteks tidak dicetak ulang di dalam entri induknya",
    Boolean(barisMenempel) && !barisMenempel!.includes(induk.company),
    barisMenempel ?? "baris tidak ditemukan",
  );

  const semuaMenempel: ResumeData = {
    ...cvDasar,
    portofolio: { ...bagianPortofolioBawaan(), aktif: true, gabungKePengalaman: true },
    projects: [
      itemLengkap({ konteks: induk.company, parentPengalamanId: induk.id }),
    ],
  };
  check(
    "seluruh item menempel: judul bagian portofolio tidak dicetak sama sekali",
    !html(semuaMenempel).includes("PORTOFOLIO PROYEK") &&
      !resumeToPlainText(semuaMenempel).includes("PORTOFOLIO PROYEK"),
  );

  /* ---------------------------------------------------------------- */

  section("Sepuluh template");

  const teksAcuan = resumeToPlainText(cv);
  for (const template of TEMPLATE_ORDER) {
    const data = { ...cv, template };
    let galat = "";
    let keluaran = "";
    try {
      keluaran = html(data);
    } catch (thrown) {
      galat = thrown instanceof Error ? thrown.message : String(thrown);
    }
    check(`${template} merender item portofolio`, galat === "", galat);
    if (galat) continue;

    check(
      `${template} mencetak judul, baris Detail, dan tautannya`,
      keluaran.includes("Panel Kendali Instrumentasi") &&
        keluaran.includes("Detail: Jenis proyek") &&
        keluaran.includes(`href="${TAUTAN_REPO}"`),
    );
    check(
      `${template} menjaga tiap item tidak terpotong antar-halaman`,
      keluaran.includes('class="avoid-break"'),
    );
    equal(
      `${template} menghasilkan teks yang identik`,
      resumeToPlainText(data) === teksAcuan,
      true,
    );
  }

  /* ---------------------------------------------------------------- */

  section("CV lama tidak ikut berubah bentuk");

  const cvLama = sampleResume("uji", "id");
  const markupLama = html(cvLama);
  check(
    "judul bagian tetap PROYEK selama bentuk portofolio belum dinyalakan",
    markupLama.includes(">PROYEK<") || markupLama.includes("PROYEK"),
  );
  check(
    "tidak ada baris Detail pada CV yang belum memakai portofolio",
    !markupLama.includes("Detail: "),
  );
}
