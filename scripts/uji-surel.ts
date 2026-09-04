import { config } from "dotenv";
import { isMailConfigured, passwordResetEmail, sendMail } from "../src/lib/mail";
import { RESET_TTL_MINUTES } from "../src/lib/password-reset";

/**
 * Mengirim satu surel percobaan, untuk memastikan pengiriman benar-benar
 * bekerja sebelum ada pengguna sungguhan yang mengandalkannya.
 *
 * Dibuat karena kegagalan pengiriman surel adalah jenis kegagalan yang paling
 * sunyi: aplikasinya tidak rusak, halamannya tidak berubah, dan satu-satunya
 * tanda bahwa ada yang salah adalah surel yang tidak pernah sampai - kepada
 * orang yang sedang tidak dapat masuk ke akunnya sendiri.
 *
 * Menjalankan:
 *     npm run mail:test -- alamat@tujuan.com
 *
 * Yang dibaca dari .env atau .env.local:
 *     BREVO_API_KEY   kunci API dari SMTP & API > API Keys
 *     MAIL_FROM       alamat pengirim yang sudah diverifikasi di Brevo
 */

// Berkas .env dibaca sendiri di sini. Skrip ini berjalan di luar Next.js,
// yang biasanya melakukannya untuk kita.
config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

async function main() {
  const tujuan = process.argv[2];

  if (!tujuan) {
    console.error("Alamat tujuan belum disebutkan.");
    console.error("  npm run mail:test -- alamat@tujuan.com");
    process.exitCode = 1;
    return;
  }

  if (!isMailConfigured()) {
    console.error("BREVO_API_KEY atau MAIL_FROM belum diisi.");
    console.error("Lihat petunjuk lengkapnya di .env.example.");
    process.exitCode = 1;
    return;
  }

  console.log(`Pengirim : ${process.env.MAIL_FROM}`);
  console.log(`Tujuan   : ${tujuan}`);
  console.log("Mengirim...");

  // Surel yang dikirim persis surel pemulihan yang sebenarnya, hanya dengan
  // tautan contoh. Mengirim surel percobaan berisi teks lain akan menguji
  // hal yang berbeda dari yang nanti dipakai - termasuk bagaimana penyaring
  // spam memperlakukan isinya.
  const surel = passwordResetEmail(
    "id",
    "https://contoh.test/atur-sandi?token=" + "0".repeat(64),
    RESET_TTL_MINUTES,
  );

  try {
    await sendMail({ to: tujuan, ...surel });
    console.log("");
    console.log("Terkirim. Periksa kotak masuk - dan folder spam.");
    console.log(
      "Kalau mendarat di spam, buka di Brevo: Senders > alamat pengirim,",
    );
    console.log("dan pastikan verifikasinya sudah selesai.");
  } catch (error) {
    console.error("");
    console.error("Gagal:", error instanceof Error ? error.message : error);
    console.error("");
    console.error("Yang paling sering jadi sebabnya:");
    console.error("  401  kunci API salah ketik, atau sudah dicabut");
    console.error("  400  MAIL_FROM belum diverifikasi sebagai Sender di Brevo");
    process.exitCode = 1;
  }
}

void main();
