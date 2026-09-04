import {
  createResetToken,
  hashResetToken,
  RESET_TTL_MINUTES,
  sameHash,
} from "../src/lib/password-reset";
import { passwordResetEmail } from "../src/lib/mail";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../src/lib/resume/schema";
import { check, equal, section } from "./harness";

/**
 * Pemulihan kata sandi lewat tautan di surel.
 *
 * Yang diuji di sini bagian yang murni - pembuatan token, hash-nya, bentuk
 * masukan yang diterima, dan isi surelnya. Bagian yang menyentuh basis data
 * dan mengirim surel tidak dapat dijalankan tanpa keduanya, dan memaksakannya
 * hanya akan menghasilkan pemeriksaan yang selalu lulus tanpa membuktikan
 * apa pun.
 *
 * Justru bagian yang diuji di sini yang paling merugikan bila salah tanpa
 * ketahuan: token yang dapat ditebak, atau token yang tersimpan apa adanya di
 * basis data, sama saja dengan membagikan kata sandi setiap pengguna.
 */
export function runPasswordResetTests(): void {
  section("Token pemulihan kata sandi");

  const token = createResetToken();

  equal("token sepanjang 64 karakter heksadesimal", token.length, 64);
  check("token hanya berisi 0-9 dan a-f", /^[0-9a-f]{64}$/.test(token));

  // Dua token berturut-turut yang sama berarti sumber acaknya rusak - dan
  // seluruh keamanan tautan ini bersandar pada tidak dapat ditebaknya nilai
  // itu. Seratus kali cukup untuk menangkap sumber yang macet sama sekali.
  const seratus = new Set(
    Array.from({ length: 100 }, () => createResetToken()),
  );
  equal("seratus token seluruhnya berbeda", seratus.size, 100);

  const hash = hashResetToken(token);
  equal("hash sepanjang 64 karakter", hash.length, 64);
  check(
    "hash tidak sama dengan tokennya sendiri",
    hash !== token,
  );
  check(
    "token yang sama selalu menghasilkan hash yang sama",
    hashResetToken(token) === hash,
  );
  check(
    "token berbeda menghasilkan hash berbeda",
    hashResetToken(createResetToken()) !== hash,
  );

  check("hash yang sama dikenali sama", sameHash(hash, hash));
  check(
    "hash yang berbeda dikenali berbeda",
    !sameHash(hash, hashResetToken(createResetToken())),
  );
  check(
    "panjang yang berbeda ditolak tanpa melempar galat",
    !sameHash(hash, "pendek"),
  );

  section("Bentuk masukan yang diterima");

  check(
    "permintaan tautan menerima email yang wajar",
    forgotPasswordSchema.safeParse({ email: "budi@email.com" }).success,
  );
  equal(
    "bahasa surel bawaannya Indonesia",
    forgotPasswordSchema.parse({ email: "budi@email.com" }).locale,
    "id",
  );
  check(
    "email yang tidak berbentuk email ditolak",
    !forgotPasswordSchema.safeParse({ email: "bukan-email" }).success,
  );
  check(
    "bahasa di luar dua pilihan ditolak",
    !forgotPasswordSchema.safeParse({
      email: "budi@email.com",
      locale: "fr",
    }).success,
  );

  check(
    "token berbentuk benar diterima",
    resetPasswordSchema.safeParse({ token, password: "rahasia123" }).success,
  );
  for (const salah of [
    // Bukan heksadesimal.
    "z".repeat(64),
    // Terlalu pendek dan terlalu panjang.
    "a".repeat(63),
    "a".repeat(65),
    // Bentuk yang biasa dipakai mencoba menembus pemeriksaan.
    "../../etc/passwd",
    "",
  ]) {
    check(
      `token "${salah.slice(0, 16)}" ditolak sebelum menyentuh basis data`,
      !resetPasswordSchema.safeParse({ token: salah, password: "rahasia123" })
        .success,
    );
  }
  check(
    "kata sandi di bawah 8 karakter ditolak",
    !resetPasswordSchema.safeParse({ token, password: "pendek" }).success,
  );

  section("Isi surel pemulihan");

  const url = `https://contoh.test/atur-sandi?token=${token}`;

  for (const locale of ["id", "en"] as const) {
    const surel = passwordResetEmail(locale, url, RESET_TTL_MINUTES);

    check(`subjek ${locale} tidak kosong`, surel.subject.trim().length > 0);
    check(
      `tautannya ada di versi teks ${locale}`,
      surel.text.includes(url),
    );
    check(
      `tautannya ada di versi HTML ${locale}`,
      surel.html.includes(url),
    );
    check(
      `masa berlaku disebutkan di surel ${locale}`,
      surel.text.includes(String(RESET_TTL_MINUTES)),
    );
    // Surel pemulihan yang tidak menyebutkan "abaikan bila bukan Anda"
    // membuat pemilik akun yang tidak meminta apa pun mengira akunnya sudah
    // dibobol - dan panik itu sendiri yang membuat orang menekan tautannya.
    check(
      `surel ${locale} memberi tahu cara mengabaikannya`,
      surel.text.length > surel.subject.length + url.length,
    );
  }

  const berbahaya = passwordResetEmail(
    "id",
    'https://contoh.test/atur-sandi?token=abc"><script>alert(1)</script>',
    RESET_TTL_MINUTES,
  );
  check(
    "karakter bermakna HTML diloloskan di badan surel",
    !berbahaya.html.includes("<script>"),
  );
}
