import {
  applyDateEdit,
  applyEdit,
  cleanEditedText,
  isEditablePath,
  parseBulletPath,
} from "../src/lib/resume/edit-path";
import { emptyCustomSection } from "../src/lib/resume/factory";
import { applyStructure } from "../src/lib/resume/structure";
import { sampleResume } from "../src/lib/resume/sample";
import type { ResumeData } from "../src/lib/resume/types";
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
    // Bagian tambahan: satu-satunya bentuk yang bersarang dua tingkat.
    "customSections.0.items.0.title",
    "customSections.2.items.1.subtitle",
    "customSections.0.items.0.bullets.3",
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
    /*
      Bagian tambahan menambah satu bentuk jalur, bukan mengizinkan setiap
      jalur yang panjangnya lima segmen. Deretan di bawah ini yang
      membuktikannya - seluruhnya berbentuk mirip, dan seluruhnya harus tetap
      ditolak.
    */
    "customSections.0.items.0.id",
    "customSections.0.items.0.startDate",
    "customSections.0.title",
    "customSections.0.item.0.title",
    "experiences.0.items.0.title",
    "customSections.x.items.0.title",
    "customSections.0.items.x.title",
    "customSections.0.items.0.bullets.x",
    "customSections.0.items.0.bullets.0.extra",
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

  section("Bagian tambahan disunting dari kertas");

  /*
    Bagian tambahan diuji terpisah karena bentuk datanya sendiri berbeda:
    entrinya berada di dalam `items` milik sebuah bagian, bukan langsung di
    akar CV. Salah satu akibat yang paling mudah lolos tanpa pemeriksaan
    adalah menulis ke bagian tambahan yang **lain** - dua bagian sama sahnya,
    dan tidak ada satu pun tanda di layar bila yang berubah bagian keduanya.
  */
  const dua: ResumeData = {
    ...cv,
    customSections: [
      {
        ...emptyCustomSection(),
        title: "Pelatihan",
        items: [
          {
            id: "a1",
            title: "Keamanan Siber Dasar",
            subtitle: "BSSN",
            startDate: "2024-01",
            endDate: "2024-02",
            bullets: ["Poin pertama", "Poin kedua"],
          },
        ],
      },
      {
        ...emptyCustomSection(),
        title: "Kegiatan Sukarela",
        items: [
          {
            id: "b1",
            title: "Kelas Komputer Gratis",
            subtitle: "Karang Taruna",
            startDate: "",
            endDate: "",
            bullets: [""],
          },
        ],
      },
    ],
  };

  const judulBaru = applyEdit(
    dua,
    "customSections.0.items.0.title",
    "Keamanan Siber Lanjutan",
  );
  check(
    "judul entri bagian tambahan tersimpan",
    judulBaru.customSections[0].items[0].title === "Keamanan Siber Lanjutan",
  );
  check(
    "bagian tambahan yang lain tidak ikut berubah",
    judulBaru.customSections[1].items[0].title === "Kelas Komputer Gratis",
  );
  check(
    "field lain pada entri yang sama tetap utuh",
    judulBaru.customSections[0].items[0].subtitle === "BSSN" &&
      judulBaru.customSections[0].items[0].bullets.length === 2,
  );

  const poinCustom = applyEdit(
    dua,
    "customSections.0.items.0.bullets.1",
    "Poin kedua yang diperbaiki",
  );
  check(
    "poin bagian tambahan tersimpan pada nomor yang benar",
    poinCustom.customSections[0].items[0].bullets[0] === "Poin pertama" &&
      poinCustom.customSections[0].items[0].bullets[1] ===
        "Poin kedua yang diperbaiki",
  );

  check(
    "id entri bagian tambahan tidak dapat ditulis",
    applyEdit(dua, "customSections.0.items.0.id", "dibajak") === dua,
  );
  check(
    "nomor bagian di luar jangkauan tidak mengubah apa pun",
    applyEdit(dua, "customSections.9.items.0.title", "x") === dua,
  );
  check(
    "nomor entri di luar jangkauan tidak mengubah apa pun",
    applyEdit(dua, "customSections.0.items.9.title", "x") === dua,
  );

  section("Tanggal dan struktur bagian tambahan");

  const tanggalBaru = applyDateEdit(dua, "customSections.0.items.0", {
    startDate: "2023-05",
    endDate: "",
  });
  check(
    "periode entri bagian tambahan tersimpan",
    tanggalBaru.customSections[0].items[0].startDate === "2023-05" &&
      tanggalBaru.customSections[0].items[0].endDate === "",
  );
  check(
    "tanggal berbentuk lain tetap ditolak di bagian tambahan",
    applyDateEdit(dua, "customSections.0.items.0", {
      startDate: "Feb 2023",
    }) === dua,
  );

  const entriBaru = applyStructure(dua, {
    kind: "addEntry",
    section: "customSections.0.items",
  });
  check(
    "entri baru masuk ke bagian tambahan yang dituju",
    entriBaru.customSections[0].items.length === 2 &&
      entriBaru.customSections[1].items.length === 1,
  );
  check(
    "entri baru lahir dengan satu poin kosong untuk diklik",
    entriBaru.customSections[0].items[1].bullets.length === 1,
  );

  const poinTambah = applyStructure(dua, {
    kind: "addBullet",
    section: "customSections.0.items",
    index: 0,
    after: 0,
  });
  check(
    "poin baru disisipkan tepat setelah poin yang ditekan Enter",
    poinTambah.customSections[0].items[0].bullets.length === 3 &&
      poinTambah.customSections[0].items[0].bullets[1] === "",
  );

  check(
    "nama bagian tambahan palsu tidak menghasilkan apa pun",
    applyStructure(dua, {
      kind: "addEntry",
      section: "customSections.9.items",
    }) === dua &&
      applyStructure(dua, {
        kind: "addEntry",
        section: "customSections.0.item",
      }) === dua,
  );

  const dibersihkan = applyStructure(dua, { kind: "pruneBullets" });
  check(
    "poin kosong pada bagian tambahan ikut dibersihkan",
    dibersihkan.customSections[1].items[0].bullets.length === 0,
  );

  section("Pembaca jalur poin");

  // Panel pratinjau menyerahkan pembacaan bentuk jalur ke satu fungsi ini.
  // Bila ia salah membaca, Enter di sebuah poin diam-diam berhenti membuat
  // poin berikutnya - tanpa galat, tanpa tanda apa pun di layar.
  const biasa = parseBulletPath("experiences.2.bullets.5");
  check(
    "jalur poin biasa terbaca",
    biasa?.section === "experiences" &&
      biasa.index === 2 &&
      biasa.bulletIndex === 5,
  );
  const bersarang = parseBulletPath("customSections.1.items.3.bullets.2");
  check(
    "jalur poin bagian tambahan terbaca sebagai bagian bersarangnya",
    bersarang?.section === "customSections.1.items" &&
      bersarang.index === 3 &&
      bersarang.bulletIndex === 2,
  );
  check(
    "jalur yang bukan poin dikembalikan sebagai null",
    parseBulletPath("experiences.0.jobTitle") === null &&
      parseBulletPath("customSections.0.items.0.title") === null &&
      parseBulletPath("skills.0.bullets.0") === null,
  );
}
