import { KAMUS_BIDANG, entriKamus } from "../src/lib/portfolio/kamus-bidang";
import {
  migrasiDokumenCV,
  tautanItem,
  VERSI_SKEMA_CV,
} from "../src/lib/portfolio/migrasi";
import { cariBidang, tebakBidang } from "../src/lib/portfolio/pencarian";
import {
  POLA_SCHEMAS,
  URUTAN_POLA,
  judulBagian,
  rentangItemBerlaku,
} from "../src/lib/portfolio/pola-schemas";
import { polaUntuk, rentangItem, terapkanBidang } from "../src/lib/portfolio/profil";
import { AMBANG_PROFESI } from "../src/lib/portfolio/ambang-profesi";
import { profilPortofolioBawaan } from "../src/lib/portfolio/migrasi";
import { resumeDataSchema } from "../src/lib/resume/schema";
import { sampleResume } from "../src/lib/resume/sample";
import { regenerateIds, toExportFile } from "../src/lib/resume/serialize";
import { analyzeResume } from "../src/lib/ats/engine";
import { check, equal, section } from "./harness";

/**
 * Portofolio berbasis pola - fondasinya.
 *
 * Yang diuji di sini bukan tampilannya, melainkan tiga janji yang kalau
 * dilanggar merusak CV orang lain tanpa terlihat:
 *
 *  1. CV lama tetap terbuka, dan **skornya tidak bergeser satu angka pun**
 *     sebelum penggunanya sendiri menyalakan bagian portofolio.
 *  2. Data dari versi sebelumnya tidak ada yang dibuang - yang tidak dikenali
 *     pindah ke slot fleksibel, bukan ke tempat sampah.
 *  3. Registry pola tetap utuh, termasuk batas atas `null` pada pola yang
 *     memang tidak punya batas atas.
 */
export function runPortofolioTests(): void {
  section("Registry pola");

  equal("enam pola terdaftar", URUTAN_POLA.length, 6);
  check(
    "fallback umum selalu ada",
    POLA_SCHEMAS.umum !== undefined && POLA_SCHEMAS.umum.slug === "umum",
  );

  for (const slug of URUTAN_POLA) {
    const skema = POLA_SCHEMAS[slug];
    check(
      `pola ${slug} punya field inti, penjelas, dan judul CV`,
      skema.fieldInti.length > 0 &&
        skema.kalimatPenjelas.length > 0 &&
        skema.headingCV === skema.headingCV.toUpperCase(),
      `${skema.fieldInti.length} field`,
    );
    check(
      `pola ${slug}: setiap field punya contoh nyata dan kalimat bantuan`,
      skema.fieldInti.every(
        (field) => field.placeholder.length > 0 && field.bantuan.length > 0,
      ),
    );
    check(
      `pola ${slug}: syarat item kuat menunjuk field yang benar-benar ada`,
      skema.wajib.every(
        (kunci) =>
          kunci === "verifikator" ||
          skema.fieldInti.some((field) => field.key === kunci),
      ),
    );
  }

  // Batas atas null bukan kelalaian. Pola Publikasi & Kredit memang satu-satunya
  // yang makin banyak makin baik, dan setiap perhitungan yang membacanya wajib
  // menangani null - bukan mengasumsikan ada angkanya.
  equal(
    "karya-terkredit tidak punya batas atas jumlah item",
    POLA_SCHEMAS["karya-terkredit"].rentangItemIdeal[1],
    null,
  );
  check(
    "batas atas null tetap null setelah jenjang diperhitungkan",
    rentangItemBerlaku(POLA_SCHEMAS["karya-terkredit"], "mahasiswa")[1] === null,
  );
  equal(
    "batas bawah turun jadi 2 untuk mahasiswa",
    rentangItemBerlaku(POLA_SCHEMAS["proyek-teknis"], "mahasiswa")[0],
    2,
  );
  equal(
    "batas bawah utuh untuk yang sudah berpengalaman",
    rentangItemBerlaku(POLA_SCHEMAS["proyek-teknis"], "4-8-tahun")[0],
    3,
  );

  check(
    "judul di luar daftar ditolak, judul alternatif diterima",
    judulBagian(POLA_SCHEMAS["karya-visual"], "JEJAK KARYA SAYA") ===
      "PORTOFOLIO KARYA" &&
      judulBagian(POLA_SCHEMAS["karya-visual"], "STUDI KASUS") === "STUDI KASUS",
  );

  check(
    "ambang profesi membawa sumber dan tanggal pembaruannya",
    AMBANG_PROFESI.length > 0 &&
      AMBANG_PROFESI.every(
        (entri) => entri.sumber.length > 0 && entri.diperbarui.length > 0,
      ),
    `${AMBANG_PROFESI.length} entri`,
  );

  /* ---------------------------------------------------------------- */

  section("Kamus bidang & pencarian jurusan");

  check(
    "kamus memuat sedikitnya 21 entri",
    KAMUS_BIDANG.length >= 21,
    `${KAMUS_BIDANG.length} entri`,
  );
  check(
    "slug entri kamus tidak ada yang kembar",
    new Set(KAMUS_BIDANG.map((e) => e.slug)).size === KAMUS_BIDANG.length,
  );
  check(
    "pola yang disarankan tiap entri benar-benar ada",
    KAMUS_BIDANG.every((e) => POLA_SCHEMAS[e.polaDisarankan] !== undefined),
  );

  // Yang diketik pengguna adalah nama jurusannya, bukan nama kategori. Inilah
  // pemeriksaan yang membuktikan kolom `jurusanTermasuk` memang dibaca.
  const kasus: [string, string][] = [
    ["Kedokteran Gigi", "kedokteran-kesehatan"],
    ["Ahwal Syakhshiyyah", "keagamaan"],
    ["PWK", "arsitektur-perencanaan"],
    ["Tata Boga", "pariwisata-kuliner"],
    ["Mekatronika", "hardware-elektro"],
    ["Teknik Informatika", "software-ti"],
    ["Ilmu Hukum", "hukum"],
  ];
  for (const [ketikan, slug] of kasus) {
    const teratas = cariBidang(ketikan)[0];
    equal(`"${ketikan}" menemukan ${slug}`, teratas?.entri.slug, slug);
  }

  equal(
    "ketikan tanpa padanan tidak ditebak-tebak",
    tebakBidang("zzz qqq"),
    null,
  );
  check(
    "fallback umum tidak pernah muncul di hasil pencarian",
    cariBidang("umum").every((h) => h.entri.slug !== "umum"),
  );

  /* ---------------------------------------------------------------- */

  section("Pemilihan pola");

  const sipil = entriKamus("sipil-konstruksi")!;
  const arsitek = entriKamus("arsitektur-perencanaan")!;

  equal(
    "melamar kerja memakai pola bawaan bidangnya",
    polaUntuk(arsitek, "melamar-kerja"),
    "karya-visual",
  );
  equal(
    "mengurus lisensi menggeser arsitek ke rekaman kompetensi",
    polaUntuk(arsitek, "sertifikasi-lisensi"),
    "proyek-teknis",
  );
  equal(
    "jalur beasiswa memakai daftar karya terbit",
    polaUntuk(sipil, "beasiswa-akademik"),
    "karya-terkredit",
  );
  equal(
    "tanpa bidang pun tujuan tetap dihormati",
    polaUntuk(null, "tender-proyek"),
    "proyek-teknis",
  );

  const profilArsitek = terapkanBidang(
    { ...profilPortofolioBawaan() },
    arsitek,
    "Arsitektur",
  );
  equal(
    "kamus boleh menaikkan jumlah item ideal bidangnya",
    rentangItem(profilArsitek)[1],
    7,
  );

  /* ---------------------------------------------------------------- */

  section("Migrasi CV lama");

  // Bentuk paling awal: belum mengenal portofolio sama sekali.
  const cvLama = {
    title: "CV Lama",
    personalInfo: { fullName: "Budi Santoso" },
    projects: [
      {
        id: "p1",
        name: "SIMAK",
        role: "Pengembang",
        url: "github.com/nama/simak",
        startDate: "2020-09",
        endDate: "2021-05",
        bullets: ["Membangun modul presensi."],
      },
    ],
  };
  const naik = resumeDataSchema.parse(migrasiDokumenCV(cvLama));
  equal("versi dokumen dinaikkan", naik.schemaVersion, VERSI_SKEMA_CV);
  equal("pola bawaan adalah umum", naik.profilPortofolio.pola, "umum");
  equal(
    "pengguna lama belum dianggap pernah ditanya",
    naik.profilPortofolio.sudahDitanya,
    false,
  );
  equal("bagian portofolio mati", naik.portofolio.aktif, false);
  equal(
    "gabung ke pengalaman tidak pernah menyala sendiri",
    naik.portofolio.gabungKePengalaman,
    false,
  );
  equal("isian lama tidak berubah", naik.projects[0].name, "SIMAK");
  equal("poin lama utuh", naik.projects[0].bullets.length, 1);
  equal(
    "tautan lama tetap terbaca lewat kolom url",
    tautanItem(naik.projects[0])[0]?.url,
    "github.com/nama/simak",
  );

  // Bentuk versi katalog bidang: fieldProfile.bidang + field khusus per bidang.
  const cvKatalog = {
    title: "CV Katalog",
    personalInfo: { fullName: "Budi Santoso" },
    fieldProfile: { bidang: "sipil-konstruksi", jurusan: "Teknik Sipil" },
    projects: [
      {
        id: "p1",
        name: "Jembatan X",
        role: "Site Engineer",
        url: "",
        startDate: "2022-01",
        endDate: "2022-12",
        bullets: [],
        khusus: {
          standarKode: ["SNI 2847"],
          hasilJadwalBiaya: "Selesai 3 minggu lebih cepat",
          nilaiKontrak: "Rp 18 M",
        },
      },
    ],
  };
  const naikKatalog = resumeDataSchema.parse(migrasiDokumenCV(cvKatalog));
  equal(
    "bidang lama dipetakan ke polanya",
    naikKatalog.profilPortofolio.pola,
    "proyek-teknis",
  );
  equal(
    "slug bidang ikut terbawa",
    naikKatalog.profilPortofolio.bidangKamus,
    "sipil-konstruksi",
  );
  const itemKatalog = naikKatalog.projects[0];
  check(
    "field khusus yang punya padanan masuk ke field inti",
    Array.isArray(itemKatalog.inti["standarKode"]),
  );
  const labelDetail = itemKatalog.detailTambahan.map((d) => d.label);
  check(
    "field khusus tanpa padanan tidak dibuang, tapi pindah ke slot fleksibel",
    labelDetail.includes("Hasil jadwal biaya") &&
      labelDetail.includes("Nilai kontrak"),
    labelDetail.join(", "),
  );

  /* ---------------------------------------------------------------- */

  section("CV lama tidak berubah nilainya");

  // Contoh CV dipakai berkas uji lain sebagai masukan tetap bagi mesin
  // penilaian. Kalau angkanya bergeser di sini, ia bergeser juga di CV setiap
  // pengguna yang belum pernah menyentuh fitur ini.
  const contoh = sampleResume("uji", "id");
  const skorSebelum = analyzeResume(contoh, "", 1, "id").score;
  const contohNaik = resumeDataSchema.parse(
    migrasiDokumenCV(JSON.parse(JSON.stringify(contoh))),
  );
  const skorSesudah = analyzeResume(
    contohNaik as unknown as typeof contoh,
    "",
    1,
    "id",
  ).score;
  check(
    "skor CV contoh benar-benar terhitung",
    typeof skorSebelum === "number" && skorSebelum > 0,
    String(skorSebelum),
  );
  equal("skor CV contoh tidak bergeser setelah migrasi", skorSesudah, skorSebelum);

  /* ---------------------------------------------------------------- */

  section("Ekspor & penyalinan");

  const denganVerifikator = {
    ...contoh,
    projects: contoh.projects.map((item) => ({
      ...item,
      verifikator: {
        nama: "Ir. Sari Handayani",
        jabatan: "Manajer Proyek",
        hubungan: "Atasan langsung",
      },
    })),
  };
  const berkas = toExportFile(denganVerifikator);
  equal("berkas ekspor membawa versi skema terbaru", berkas.schemaVersion, VERSI_SKEMA_CV);
  check(
    "nama verifikator tidak pernah ikut ke berkas ekspor",
    berkas.resume.projects.every((item) => item.verifikator.nama === ""),
  );
  check(
    "isi CV selebihnya tetap utuh di berkas ekspor",
    berkas.resume.projects.length === contoh.projects.length &&
      berkas.resume.projects[0].name === contoh.projects[0].name,
  );

  // Item portofolio boleh menempel pada satu entri pengalaman kerja. Kalau id
  // induknya diganti tanpa penunjuknya ikut diperbarui, item itu jadi yatim -
  // dan hilangnya baru ketahuan setelah CV-nya diduplikasi.
  const menempel = {
    ...contoh,
    projects: contoh.projects.map((item, index) =>
      index === 0
        ? { ...item, parentPengalamanId: contoh.experiences[0].id }
        : item,
    ),
  };
  const disalin = regenerateIds(menempel);
  equal(
    "penunjuk induk ikut diperbarui saat CV disalin",
    disalin.projects[0].parentPengalamanId,
    disalin.experiences[0].id,
  );
  check(
    "penunjuk induk tidak menyisakan id CV asal",
    disalin.projects[0].parentPengalamanId !== contoh.experiences[0].id,
  );
}
