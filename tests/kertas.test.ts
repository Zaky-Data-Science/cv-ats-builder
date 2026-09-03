import { readFileSync } from "node:fs";
import { isEditablePath } from "../src/lib/resume/edit-path";
import {
  renderDapatDiketik,
  renderSemuaTemplate,
} from "./fixtures/render-kertas";
import { check, section } from "./harness";

/**
 * Mengunci keluaran dokumen CV pada jalur cetak.
 *
 * Alasannya khas fitur "ketik di kertas": komponen yang sama melayani tiga
 * keadaan - pratinjau yang dapat diketik, halaman cetak, dan pratinjau
 * template di halaman depan. Menambah kemampuan mengetik menuntut membongkar
 * cara baris-baris entri dirender, dan pembongkaran itu dapat mengubah
 * cetakannya tanpa satu pun pemeriksaan lain berteriak: berkas PDF tetap
 * terbentuk, isinya tetap ada, hanya pemenggalan barisnya bergeser - dan
 * pergeseran itu mengubah jumlah halaman.
 *
 * Yang dibandingkan karena itu markup mentahnya, seluruh template, kedua
 * bahasa. Bila berkas ini gagal setelah sebuah perubahan yang memang
 * dimaksudkan mengubah tampilan, acuannya direkam ulang dengan sengaja -
 * bukan pemeriksaannya yang dilonggarkan.
 */

const ACUAN = "tests/fixtures/kertas-acuan.html";

/**
 * Membuang pengembalian kereta sebelum membandingkan.
 *
 * Berkas acuan ikut masuk ke Git, dan Git di Windows menuliskannya kembali
 * dengan CRLF saat checkout. Tanpa ini, berkas uji gagal di setiap mesin yang
 * bukan mesin tempat acuannya direkam - kegagalan yang tidak ada hubungannya
 * dengan dokumen CV.
 */
const CR = String.fromCharCode(13);
const samakan = (teks: string) => teks.split(CR).join("");

/** Baris pertama yang berbeda - jauh lebih berguna daripada "tidak sama". */
function bedaPertama(a: string, b: string): string {
  const barisA = a.split("\n");
  const barisB = b.split("\n");
  for (let i = 0; i < Math.max(barisA.length, barisB.length); i += 1) {
    if (barisA[i] !== barisB[i]) {
      const potong = (s = "") => (s.length > 120 ? `${s.slice(0, 120)}...` : s);
      return `baris ${i + 1}\n    acuan: ${potong(barisA[i])}\n    kini : ${potong(barisB[i])}`;
    }
  }
  return "";
}

export function runKertasTests(): void {
  section("Penanda mode ketik di atas kertas");

  const ketik = renderDapatDiketik();
  const jalur = [...ketik.matchAll(/data-edit="([^"]+)"/g)].map((m) => m[1]);

  check("ada jalur yang ditandai", jalur.length > 0, `${jalur.length} jalur`);

  /*
    Setiap jalur yang dipasang dokumen harus diterima allowlist-nya.

    Ini pemeriksaan yang paling berguna dari seluruh berkas ini. Jalur salah
    ketik tidak menimbulkan galat apa pun - `applyEdit` memang sengaja
    mengabaikan jalur tak dikenal tanpa melempar - sehingga fieldnya cuma
    "tidak tersimpan" dan pengguna baru menyadarinya setelah ketikannya
    hilang.
  */
  const ditolak = [...new Set(jalur)].filter((p) => !isEditablePath(p));
  check(
    "seluruh jalur yang ditandai diterima allowlist",
    ditolak.length === 0,
    ditolak.slice(0, 5).join(", "),
  );

  // Field yang baru dapat diklik sejak sesi 7. Tanpa daftar ini, salah satu
  // bagian bisa kehilangan penandanya lagi tanpa ada yang gagal.
  for (const wajib of [
    "experiences.0.city",
    "experiences.0.country",
    "educations.0.degree",
    "educations.0.institution",
    "organizations.0.city",
    "certifications.0.issuer",
    "awards.0.issuer",
    "publications.0.publisher",
    "skills.0.name",
    "languages.0.name",
  ]) {
    check(`"${wajib}" dapat diklik di kertas`, jalur.includes(wajib));
  }

  section("Keluaran dokumen CV pada jalur cetak");

  const acuan = samakan(readFileSync(ACUAN, "utf8"));
  const kini = samakan(renderSemuaTemplate());

  const beda = bedaPertama(acuan, kini);
  check(
    "markup seluruh template di kedua bahasa tidak berubah",
    beda === "",
    beda,
  );

  // Penanda mode ketik tidak boleh ikut ke jalur cetak. Ketiganya hanya
  // dipasang saat `editable` menyala; bila salah satu bocor ke sini, ia juga
  // bocor ke berkas PDF yang dikirim pengguna ke perusahaan.
  for (const penanda of ["data-edit", "data-date", "data-add", "edit-kosong"]) {
    check(
      `tidak ada "${penanda}" saat menyunting dimatikan`,
      !kini.toLowerCase().includes(penanda),
    );
  }
}
