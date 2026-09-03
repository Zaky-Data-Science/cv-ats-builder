import {
  applyEdit,
  cleanEditedText,
  isEditablePath,
} from "../src/lib/resume/edit-path";
import { sampleResume } from "../src/lib/resume/sample";
import { check, equal, section } from "./harness";

/**
 * Menulis balik teks yang diketik langsung di atas kertas CV.
 *
 * Yang diuji di sini bukan tampilannya, melainkan hal yang paling merugikan
 * bila salah tanpa ketahuan: teks berpindah ke field yang keliru. Pengguna
 * mengetik di satu tempat, melihat hurufnya berubah di tempat itu juga, dan
 * tidak punya alasan memeriksa apakah yang tersimpan memang di sana.
 *
 * Karena itu setiap pemeriksaan "berhasil ditulis" berpasangan dengan
 * pemeriksaan bahwa yang lain **tidak** ikut berubah.
 */
export function runEditPathTests(): void {
  section("Jalur yang boleh disunting");

  for (const path of [
    "personalInfo.fullName",
    "personalInfo.headline",
    "personalInfo.summary",
    "experiences.0.jobTitle",
    "experiences.2.bullets.5",
    "educations.1.institution",
    "projects.0.name",
    "awards.0.description",
    "title",
  ]) {
    check(`"${path}" diizinkan`, isEditablePath(path));
  }

  section("Jalur yang harus ditolak");

  for (const path of [
    // Mengubah id akan memutus hubungan entri dengan barisnya di basis data.
    "experiences.0.id",
    // Tanggal disimpan sebagai "YYYY-MM" dan diisi lewat pemilih bulan.
    "experiences.0.startDate",
    "experiences.0.isCurrent",
    // Bukan teks, dan bukan milik pengguna untuk diketik.
    "id",
    "template",
    "personalInfo.photoUrl",
    "personalInfo.email",
    // Bentuk yang tidak masuk akal sama sekali.
    "experiences.abc.jobTitle",
    "experiences.0.bullets.x",
    "sesuatu.0.apa",
    "",
  ]) {
    check(`"${path}" ditolak`, !isEditablePath(path));
  }

  section("Membersihkan teks hasil ketikan");

  equal(
    "pemisah baris diratakan menjadi spasi",
    cleanEditedText("baris satu\nbaris dua"),
    "baris satu baris dua",
  );
  equal(
    "spasi tak-putus menjadi spasi biasa",
    cleanEditedText("Frontend Developer"),
    "Frontend Developer",
  );
  equal(
    "spasi berlebih dirapatkan dan ujungnya dipangkas",
    cleanEditedText("  React    dan   TypeScript  "),
    "React dan TypeScript",
  );

  section("Menulis balik ke data CV");

  const cv = sampleResume("uji", "id");

  const namaBaru = applyEdit(cv, "personalInfo.fullName", "Siti Rahayu");
  equal("nama tertulis", namaBaru.personalInfo.fullName, "Siti Rahayu");
  check(
    "CV aslinya tidak ikut berubah",
    cv.personalInfo.fullName === "Budi Santoso",
    cv.personalInfo.fullName,
  );
  check(
    "field lain tidak ikut tersentuh",
    namaBaru.personalInfo.headline === cv.personalInfo.headline &&
      namaBaru.personalInfo.email === cv.personalInfo.email,
  );

  const jabatanBaru = applyEdit(cv, "experiences.0.jobTitle", "Lead Engineer");
  equal(
    "jabatan entri pertama tertulis",
    jabatanBaru.experiences[0].jobTitle,
    "Lead Engineer",
  );
  check(
    "entri kedua tidak ikut berubah",
    jabatanBaru.experiences[1].jobTitle === cv.experiences[1].jobTitle,
  );
  check(
    "id entri tetap, sehingga hubungannya dengan basis data utuh",
    jabatanBaru.experiences[0].id === cv.experiences[0].id,
  );

  const poinBaru = applyEdit(
    cv,
    "experiences.0.bullets.1",
    "Memangkas waktu muat 60%.",
  );
  equal(
    "poin kedua tertulis",
    poinBaru.experiences[0].bullets[1],
    "Memangkas waktu muat 60%.",
  );
  check(
    "poin pertama tidak ikut berubah",
    poinBaru.experiences[0].bullets[0] === cv.experiences[0].bullets[0],
  );

  section("Suntingan yang harus diabaikan, bukan merusak");

  check(
    "jalur terlarang mengembalikan CV apa adanya",
    applyEdit(cv, "experiences.0.id", "dibajak") === cv,
  );
  check(
    "nomor entri di luar jangkauan tidak menambah entri baru",
    applyEdit(cv, "experiences.99.jobTitle", "x").experiences.length ===
      cv.experiences.length,
  );
  check(
    "nomor poin di luar jangkauan tidak menambah poin baru",
    applyEdit(cv, "experiences.0.bullets.99", "x").experiences[0].bullets
      .length === cv.experiences[0].bullets.length,
  );

  section("Kertas dan formulir menyunting benda yang sama");

  // Inti dari fitur ini: yang diketik di atas kertas harus terbaca oleh
  // seluruh bagian lain aplikasi - penilaian ATS, ekspor, dan formulir -
  // karena semuanya membaca objek CV yang sama, bukan salinan.
  const sesudah = applyEdit(
    applyEdit(cv, "personalInfo.summary", "Ringkasan yang baru diketik."),
    "experiences.0.jobTitle",
    "Staff Engineer",
  );
  check(
    "dua suntingan berturut-turut keduanya tersimpan",
    sesudah.personalInfo.summary === "Ringkasan yang baru diketik." &&
      sesudah.experiences[0].jobTitle === "Staff Engineer",
  );
  check(
    "jumlah entri di seluruh bagian tidak berubah",
    sesudah.experiences.length === cv.experiences.length &&
      sesudah.educations.length === cv.educations.length &&
      sesudah.skills.length === cv.skills.length,
  );
}
