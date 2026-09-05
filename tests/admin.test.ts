import { isAdminEmail } from "../src/lib/admin";
import { check, equal, section } from "./harness";

/**
 * Penanda pengelola.
 *
 * Yang diuji di sini arah penolakannya, bukan arah penerimaannya. Panel yang
 * gagal membuka bagi pengelola adalah gangguan; panel yang terbuka bagi orang
 * lain adalah kebocoran data akun seluruh pengguna.
 *
 * Pemeriksaan rutenya sendiri hidup di server (`requireAdmin` dan
 * `isAdminRequest` di lib/guard.ts) dan menuntut sesi sungguhan, jadi yang
 * dikunci di berkas ini keputusan yang mendasarinya: siapa yang dihitung
 * pengelola, dan - jauh lebih penting - siapa yang tidak.
 */
export function runAdminTests(): void {
  section("Penanda pengelola");

  const asli = process.env.ADMIN_EMAIL;

  try {
    /*
      Tanpa ADMIN_EMAIL, tidak ada seorang pun yang menjadi pengelola.

      Ini bawaan yang menentukan: pemasangan yang lupa mengisinya, atau
      variabel yang gagal termuat, tidak boleh diam-diam membuka panel untuk
      sembarang orang. Bawaan yang salah di sini membocorkan alamat surel
      seluruh pengguna.
    */
    delete process.env.ADMIN_EMAIL;
    check("tanpa ADMIN_EMAIL, tidak ada yang jadi pengelola",
      !isAdminEmail("siapa@pun.com"));
    check("termasuk untuk nilai kosong", !isAdminEmail(""));

    process.env.ADMIN_EMAIL = "   ";
    check("ADMIN_EMAIL berisi spasi saja tetap berarti tidak ada pengelola",
      !isAdminEmail("siapa@pun.com"));

    process.env.ADMIN_EMAIL = "pengelola@contoh.test";
    check("alamat yang cocok dikenali", isAdminEmail("pengelola@contoh.test"));
    check("huruf besar-kecil diabaikan", isAdminEmail("Pengelola@Contoh.TEST"));
    check("spasi di tepi diabaikan", isAdminEmail("  pengelola@contoh.test  "));

    /* Arah penolakan - bagian yang paling penting. */
    check("alamat lain ditolak", !isAdminEmail("orang@lain.test"));
    check("alamat kosong ditolak", !isAdminEmail(""));
    check("null ditolak", !isAdminEmail(null));
    check("undefined ditolak", !isAdminEmail(undefined));
    check(
      "alamat yang hanya berimbuhan ditolak",
      !isAdminEmail("pengelola@contoh.test.penyerang.com"),
    );
    check(
      "alamat yang memuat alamat pengelola sebagai bagiannya ditolak",
      !isAdminEmail("bukan-pengelola@contoh.test"),
    );
  } finally {
    if (asli === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = asli;
  }

  equal(
    "nilai ADMIN_EMAIL dikembalikan seperti semula setelah uji",
    process.env.ADMIN_EMAIL,
    asli,
  );
}
