import {
  applyDateEdit,
  dateShape,
  isEditablePath,
} from "../src/lib/resume/edit-path";
import {
  applyStructure,
  pruneEmptyBullets,
} from "../src/lib/resume/structure";
import { sampleResume } from "../src/lib/resume/sample";
import { check, equal, section } from "./harness";

/**
 * Menyunting tanggal dan struktur dari atas kertas.
 *
 * Keduanya jalur yang sengaja terpisah dari `applyEdit`, dan pemisahannya
 * itulah yang paling perlu dijaga:
 *
 *  - Tanggal hanya boleh menerima "YYYY-MM". Jalur teks bebas akan menyimpan
 *    "Feb 2023" apa adanya, dan sejak itu lama pengalaman kerja tidak lagi
 *    dapat dihitung siapa pun - termasuk pengurai ATS yang menjadi alasan
 *    seluruh aplikasi ini dibuat.
 *  - Aksi struktural mengubah panjang larik. Salah bagian atau salah nomor
 *    berarti entri milik orang lain di dalam CV yang sama ikut terhapus,
 *    tanpa satu pun tanda di layar.
 *
 * Karena itu setiap "berhasil" di bawah berpasangan dengan "yang lain tidak
 * ikut berubah", sama seperti di edit-path.test.ts.
 */
export function runStructureTests(): void {
  section("Bentuk tanggal per bagian");

  const bentukPengalaman = dateShape("experiences");
  const bentukProyek = dateShape("projects");
  const bentukSertifikat = dateShape("certifications");
  const bentukPenghargaan = dateShape("awards");

  equal("pengalaman berupa rentang", bentukPengalaman?.kind, "range");
  check(
    "pengalaman punya penanda masih berlangsung",
    bentukPengalaman?.kind === "range" && bentukPengalaman.current,
  );
  check(
    "proyek tidak menawarkan penanda masih berlangsung",
    bentukProyek?.kind === "range" && !bentukProyek.current,
    "ProjectItem memang tidak punya kolom isCurrent",
  );
  equal(
    "sertifikasi menulis ke issueDate",
    bentukSertifikat?.kind === "single" ? bentukSertifikat.field : "",
    "issueDate",
  );
  equal(
    "penghargaan menulis ke date",
    bentukPenghargaan?.kind === "single" ? bentukPenghargaan.field : "",
    "date",
  );
  equal("keahlian tidak punya tanggal", dateShape("skills"), null);

  section("Tanggal hanya menerima bulan yang sah");

  const cv = sampleResume("uji", "id");

  const sah = applyDateEdit(cv, "experiences.0", { startDate: "2021-03" });
  equal("bulan sah tersimpan", sah.experiences[0].startDate, "2021-03");
  check(
    "entri lain tidak ikut berubah",
    sah.experiences[1].startDate === cv.experiences[1].startDate,
  );
  check("CV asli tidak termutasi", cv.experiences[0].startDate !== "2021-03");
  check("id entri tetap utuh", sah.experiences[0].id === cv.experiences[0].id);

  for (const buruk of ["Feb 2023", "2023-13", "2023-00", "202-01", "2023"]) {
    const hasil = applyDateEdit(cv, "experiences.0", { startDate: buruk });
    check(`"${buruk}" ditolak`, hasil === cv, "CV dikembalikan apa adanya");
  }

  const dikosongkan = applyDateEdit(cv, "experiences.0", { endDate: "" });
  equal("bulan boleh dikosongkan", dikosongkan.experiences[0].endDate, "");

  const berlangsung = applyDateEdit(cv, "experiences.1", {
    isCurrent: true,
  });
  check(
    "masih berlangsung ikut mengosongkan bulan selesai",
    berlangsung.experiences[1].isCurrent === true &&
      berlangsung.experiences[1].endDate === "",
  );

  const proyek = applyDateEdit(cv, "projects.0", { isCurrent: true });
  check(
    "proyek mengabaikan penanda yang tidak dimilikinya",
    !("isCurrent" in proyek.projects[0]),
  );

  const sertifikat = applyDateEdit(cv, "certifications.0", {
    date: "2024-08",
  });
  equal(
    "sertifikasi menulis ke kolomnya sendiri",
    sertifikat.certifications[0].issueDate,
    "2024-08",
  );

  for (const path of [
    "experiences.99",
    "experiences",
    "experiences.0.startDate",
    "skills.0",
    "",
  ]) {
    check(
      `jalur "${path}" tidak menulis apa pun`,
      applyDateEdit(cv, path, { startDate: "2020-01" }) === cv,
    );
  }

  check(
    "tanggal tetap ditolak jalur teks bebas",
    !isEditablePath("experiences.0.startDate") &&
      !isEditablePath("experiences.0.isCurrent"),
    "jaminan lama tidak boleh ikut longgar",
  );

  section("Menambah dan menghapus entri");

  const tambah = applyStructure(cv, { kind: "addEntry", section: "experiences" });
  equal(
    "satu entri bertambah",
    tambah.experiences.length,
    cv.experiences.length + 1,
  );
  check(
    "entri baru kosong dan berid sendiri",
    tambah.experiences.at(-1)!.jobTitle === "" &&
      tambah.experiences.at(-1)!.id.length > 0,
  );
  check(
    "bagian lain tidak ikut berubah",
    tambah.educations === cv.educations && tambah.projects === cv.projects,
  );
  equal("CV asli tidak termutasi", cv.experiences.length, cv.experiences.length);

  const hapus = applyStructure(cv, {
    kind: "removeEntry",
    section: "educations",
    index: 0,
  });
  equal(
    "satu entri terhapus",
    hapus.educations.length,
    cv.educations.length - 1,
  );
  check(
    "yang tersisa memang entri berikutnya",
    hapus.educations[0]?.id === cv.educations[1]?.id,
  );

  for (const aksi of [
    { kind: "addEntry", section: "personalInfo" },
    { kind: "addEntry", section: "sectionOrder" },
    { kind: "removeEntry", section: "experiences", index: 99 },
    { kind: "removeEntry", section: "experiences", index: -1 },
  ] as const) {
    check(
      `aksi ${aksi.kind} pada "${aksi.section}" tidak melakukan apa-apa`,
      applyStructure(cv, aksi) === cv,
    );
  }

  section("Menambah dan menghapus poin");

  const poinAwal = cv.experiences[0].bullets.length;
  const sisip = applyStructure(cv, {
    kind: "addBullet",
    section: "experiences",
    index: 0,
    after: 0,
  });
  equal(
    "satu poin bertambah",
    sisip.experiences[0].bullets.length,
    poinAwal + 1,
  );
  equal("poin baru kosong", sisip.experiences[0].bullets[1], "");
  equal(
    "poin lama bergeser, bukan tertimpa",
    sisip.experiences[0].bullets[2],
    cv.experiences[0].bullets[1],
  );
  check(
    "entri lain tidak ikut berubah",
    sisip.experiences[1] === cv.experiences[1],
  );

  const buang = applyStructure(cv, {
    kind: "removeBullet",
    section: "experiences",
    index: 0,
    at: 0,
  });
  equal(
    "satu poin terhapus",
    buang.experiences[0].bullets.length,
    poinAwal - 1,
  );
  check(
    "aksi poin pada bagian tanpa poin diabaikan",
    applyStructure(cv, {
      kind: "addBullet",
      section: "awards",
      index: 0,
      after: 0,
    }) === cv,
  );
  check(
    "menghapus poin di luar jangkauan diabaikan",
    applyStructure(cv, {
      kind: "removeBullet",
      section: "experiences",
      index: 0,
      at: 99,
    }) === cv,
  );

  section("Membersihkan poin yang ditinggalkan kosong");

  const berpoinKosong = {
    ...cv,
    experiences: cv.experiences.map((e, i) =>
      i === 0 ? { ...e, bullets: [e.bullets[0], "", "  ", e.bullets[1]] } : e,
    ),
  };
  const bersih = pruneEmptyBullets(berpoinKosong);
  equal("poin kosong dibuang", bersih.experiences[0].bullets.length, 2);
  equal(
    "urutan poin yang tersisa tidak berubah",
    bersih.experiences[0].bullets[1],
    cv.experiences[0].bullets[1],
  );
  check(
    "CV tanpa poin kosong dikembalikan apa adanya",
    pruneEmptyBullets(cv) === cv,
    "tidak ada salinan yang memicu simpan otomatis tanpa sebab",
  );
}
