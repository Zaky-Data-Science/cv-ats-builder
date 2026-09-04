import { isStaleSessionError } from "../src/lib/stale-session";
import { check, section } from "./harness";

/**
 * Mengenali sesi yang menunjuk pengguna yang sudah tidak ada.
 *
 * Diuji karena dua alasan yang keduanya sulit terlihat tanpa berkas ini:
 *
 *  - **Pengenalannya bergantung pada kode galat pustaka luar.** Bila Prisma
 *    suatu saat mengubah kode atau kalimatnya, pengenalan ini diam-diam
 *    berhenti bekerja - dan gejalanya bukan galat, melainkan kembalinya pesan
 *    "Terjadi kesalahan pada server" yang tidak memberi tahu apa pun.
 *  - **Pengenalannya harus sempit.** Melebarkannya berarti menganggap
 *    pelanggaran kunci asing apa pun sebagai sesi kedaluwarsa, lalu
 *    mengeluarkan pengguna dari akunnya karena sebab yang sama sekali lain.
 *
 * Contoh galat di bawah disalin dari kejadian sungguhan pada log server.
 */

/** Bentuk galat Prisma seperti yang benar-benar diterima penangan API. */
function prismaError(
  code: string,
  message: string,
  meta?: Record<string, unknown>,
) {
  return Object.assign(new Error(message), {
    code,
    name: "PrismaClientKnownRequestError",
    ...(meta ? { meta } : {}),
  });
}

export function runStaleSessionTests(): void {
  section("Sesi yang menunjuk pengguna yang sudah tidak ada");

  check(
    "pelanggaran kunci asing pada userId dikenali",
    isStaleSessionError(
      prismaError(
        "P2003",
        "Foreign key constraint violated on the constraint: `resumes_userId_fkey`",
      ),
    ),
  );
  check(
    "baris pengguna yang tidak ditemukan dikenali",
    isStaleSessionError(prismaError("P2025", "No User record was found")),
  );

  /*
    Bentuk kedua P2025, dan yang membuat cacat ini luput sekian lama: pesan
    `findUniqueOrThrow` sama sekali tidak menyebut model apa pun. Nama modelnya
    hanya ada di `meta.modelName`.

    Contoh di bawah disalin apa adanya dari log server saat halaman Pengaturan
    dibuka dengan sesi yang menunjuk pengguna terhapus.
  */
  check(
    "findUniqueOrThrow yang tidak menyebut model di pesannya tetap dikenali",
    isStaleSessionError(
      prismaError(
        "P2025",
        "An operation failed because it depends on one or more records that were required but not found. No record was found for a query.",
        { modelName: "User", operation: "a query" },
      ),
    ),
  );
  check(
    "P2025 pada model lain tidak disalahartikan sebagai sesi kedaluwarsa",
    !isStaleSessionError(
      prismaError(
        "P2025",
        "An operation failed because it depends on one or more records that were required but not found. No record was found for a query.",
        { modelName: "Resume", operation: "a query" },
      ),
    ),
  );
  check(
    "P2025 tanpa meta maupun nama model tetap ditolak",
    !isStaleSessionError(
      prismaError("P2025", "No record was found for a query."),
    ),
  );

  section("Yang tidak boleh disalahartikan sebagai sesi kedaluwarsa");

  check(
    "pelanggaran kunci asing pada resumeId bukan urusan sesi",
    !isStaleSessionError(
      prismaError(
        "P2003",
        "Foreign key constraint violated on the constraint: `experiences_resumeId_fkey`",
      ),
    ),
    "entri yang menunjuk CV terhapus - bukan alasan mengeluarkan pengguna",
  );
  check(
    "baris CV yang tidak ditemukan bukan urusan sesi",
    !isStaleSessionError(prismaError("P2025", "No Resume record was found")),
  );
  check(
    "email ganda saat mendaftar bukan urusan sesi",
    !isStaleSessionError(prismaError("P2002", "Unique constraint failed on the fields: (`email`)")),
  );
  check(
    "galat koneksi bukan urusan sesi",
    !isStaleSessionError(
      Object.assign(new Error("Can't reach database server"), { code: "P1001" }),
    ),
  );

  section("Masukan yang tidak berbentuk galat Prisma");

  for (const [label, value] of [
    ["null", null],
    ["undefined", undefined],
    ["untaian biasa", "P2003 userId"],
    ["angka", 2003],
    ["galat biasa tanpa kode", new Error("userId gagal")],
    ["objek dengan kode bukan untaian", { code: 2003, message: "userId" }],
  ] as [string, unknown][]) {
    check(`${label} ditolak tanpa melempar galat`, !isStaleSessionError(value));
  }
}
