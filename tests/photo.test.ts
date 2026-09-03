import { buildDocx } from "../src/lib/docx/build";
import {
  PHOTO_MAX_BYTES,
  embeddedPhotoBytes,
  isEmbeddedPhoto,
  parseEmbeddedPhoto,
} from "../src/lib/resume/photo";
import { sampleResume } from "../src/lib/resume/sample";
import { personalInfoSchema } from "../src/lib/resume/schema";
import { check, equal, section } from "./harness";

/**
 * Pas foto yang tertanam di dalam CV.
 *
 * Pengecilan dan kompresinya sendiri tidak dapat diuji di sini - keduanya
 * memerlukan `canvas` dan `createImageBitmap` yang hanya ada di peramban.
 * Yang diuji adalah bagian yang justru paling mudah salah tanpa ketahuan:
 * pembacaan data URI, kesesuaian batas ukuran dengan batas skema, dan apakah
 * fotonya benar-benar sampai ke berkas Word.
 *
 * Bagian terakhir itu penting karena inilah cacat yang ditemukan saat menulis
 * fitur ini: selama ini foto tidak pernah ikut ke berkas Word sama sekali,
 * dan tidak ada satu pun pemeriksaan yang menangkapnya.
 */

/** JPEG 1x1 piksel - cukup untuk membuktikan gambarnya tersemat. */
const TINY_JPEG =
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRof" +
  "Hh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAAB" +
  "AAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==";

const TINY_JPEG_URI = `data:image/jpeg;base64,${TINY_JPEG}`;

export async function runPhotoTests(): Promise<void> {
  section("Pas foto yang tertanam");

  check("data URI dikenali sebagai foto tertanam", isEmbeddedPhoto(TINY_JPEG_URI));
  check(
    "tautan gambar biasa tidak dianggap tertanam",
    !isEmbeddedPhoto("https://contoh.test/foto.jpg"),
  );
  check("nilai kosong tidak dianggap tertanam", !isEmbeddedPhoto(""));
  check(
    "data URI selain gambar ditolak",
    !isEmbeddedPhoto("data:text/plain;base64,aGFsbw=="),
  );

  const parsed = parseEmbeddedPhoto(TINY_JPEG_URI);
  equal("jenis berkas terbaca", parsed?.mime ?? "", "image/jpeg");
  equal("muatan base64 terbaca utuh", parsed?.base64 ?? "", TINY_JPEG);

  // 1x1 JPEG di atas berukuran 285 byte; yang diuji adalah rumusnya, bukan
  // angka ajaib - karena itu dibandingkan dengan hasil penerjemahan sungguhan.
  equal(
    "ukuran byte dihitung dari base64-nya",
    embeddedPhotoBytes(TINY_JPEG_URI),
    Buffer.from(TINY_JPEG, "base64").length,
  );

  section("Batas ukuran foto");

  // Skema harus mampu menampung foto sebesar batasnya. Bila keduanya lepas
  // satu sama lain, foto yang lolos kompresi justru ditolak saat disimpan -
  // kegagalan yang muncul belakangan dan sulit ditelusuri penggunanya.
  const worstCase =
    "data:image/jpeg;base64,".length + Math.ceil(PHOTO_MAX_BYTES / 3) * 4;
  const accepted = personalInfoSchema.safeParse({
    photoUrl: "x".repeat(worstCase),
  });
  check(
    "skema menampung foto sebesar batas maksimum",
    accepted.success,
    `${worstCase} karakter`,
  );

  section("Foto ikut ke berkas Word");

  const withPhoto = sampleResume("uji", "id");
  withPhoto.template = "PORTRAIT";
  withPhoto.personalInfo.showPhoto = true;
  withPhoto.personalInfo.photoUrl = TINY_JPEG_URI;

  const docx = await buildDocx(withPhoto);
  // Nama berkas di dalam arsip zip tersimpan tanpa dimampatkan, sehingga
  // keberadaannya dapat diperiksa langsung dari byte-nya.
  const archive = docx.toString("latin1");
  check("berkas Word memuat bagian media", archive.includes("word/media/"));

  const withoutPhoto = sampleResume("uji", "id");
  withoutPhoto.template = "PORTRAIT";
  withoutPhoto.personalInfo.showPhoto = false;
  withoutPhoto.personalInfo.photoUrl = TINY_JPEG_URI;
  const plain = (await buildDocx(withoutPhoto)).toString("latin1");
  check(
    "foto tidak ikut bila pengguna mematikannya",
    !plain.includes("word/media/"),
  );

  // Template tanpa tempat foto tidak boleh diam-diam menyisipkannya - berkas
  // Word-nya harus sama dengan apa yang dilihat pengguna di pratinjau.
  const classic = sampleResume("uji", "id");
  classic.template = "CLASSIC";
  classic.personalInfo.showPhoto = true;
  classic.personalInfo.photoUrl = TINY_JPEG_URI;
  const classicArchive = (await buildDocx(classic)).toString("latin1");
  check(
    "template tanpa tempat foto tidak menyisipkannya",
    !classicArchive.includes("word/media/"),
  );

  // CV lama yang fotonya berupa tautan dilewati tanpa galat: mengunduh gambar
  // dari alamat yang ditulis pengguna berarti server menembak alamat sembarang.
  const linked = sampleResume("uji", "id");
  linked.template = "PORTRAIT";
  linked.personalInfo.showPhoto = true;
  linked.personalInfo.photoUrl = "https://contoh.test/foto.jpg";
  const linkedArchive = (await buildDocx(linked)).toString("latin1");
  check(
    "foto berupa tautan dilewati tanpa menggagalkan ekspor",
    !linkedArchive.includes("word/media/") && linkedArchive.length > 1000,
  );
}
