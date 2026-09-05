import { SITE } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * Pengirim surel aplikasi.
 *
 * Dipakai satu-satunya untuk tautan pemulihan kata sandi - satu-satunya hal
 * yang benar-benar tidak dapat dikerjakan tanpa surel, sebab pemiliknya justru
 * sedang tidak dapat masuk.
 *
 * ## Kenapa lewat HTTP, bukan SMTP
 *
 * Aplikasi ini berjalan di lingkungan serverless, dan koneksi SMTP di sana
 * berumur pendek serta sering diblokir sama sekali oleh penyedia. Layanan
 * surel yang dipakai di sini karena itu dipanggil lewat API HTTP biasa -
 * satu `fetch`, tanpa satu pun dependensi baru yang harus ikut dibundel.
 *
 * ## Kenapa Brevo
 *
 * Hambatannya sejak awal bukan koding melainkan domain: surel dari alamat
 * `@vercel.app` tanpa SPF dan DKIM terverifikasi hampir pasti berakhir di
 * folder spam, dan tautan pemulihan yang tidak pernah terbaca sama tidak
 * bergunanya dengan tidak ada fitur. Brevo mengizinkan **verifikasi satu
 * alamat pengirim** (mis. sebuah alamat Gmail) tanpa menuntut domain sendiri,
 * sehingga surelnya terkirim dengan otentikasi yang sah sebelum aplikasi ini
 * punya domain.
 *
 * ## Kalau kuncinya belum diisi
 *
 * `isMailConfigured()` mengembalikan false, dan seluruh alur pemulihan
 * menampilkan penjelasan lama - masuk lewat Google, lalu buat kata sandi baru
 * di Pengaturan. Yang tidak boleh terjadi adalah pengguna diberi tahu
 * "tautan sudah dikirim" padahal tidak ada surel yang pernah berangkat.
 */

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** Apakah pengiriman surel benar-benar dapat dilakukan pemasangan ini. */
export function isMailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.MAIL_FROM);
}

interface MailInput {
  to: string;
  subject: string;
  /** Versi teks polos. Selalu dikirim, bukan hanya HTML - lihat di bawah. */
  text: string;
  html: string;
}

/**
 * Mengirim satu surel.
 *
 * Melempar galat bila gagal. Pemanggilnya yang memutuskan apa yang dilihat
 * pengguna - dan pada alur pemulihan, kegagalan pengiriman memang harus
 * terlihat: pengguna yang mengira tautannya sedang dalam perjalanan akan
 * menunggu sesuatu yang tidak akan pernah datang.
 */
export async function sendMail({
  to,
  subject,
  text,
  html,
}: MailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("Layanan surel belum dikonfigurasi.");
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: from, name: SITE.name },
      to: [{ email: to }],
      subject,
      // Kedua versi selalu dikirim. Sebagian klien surel - dan hampir semua
      // penyaring spam - membaca versi teksnya, dan surel yang hanya berisi
      // HTML dinilai lebih mencurigakan daripada yang berisi keduanya.
      textContent: text,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Layanan surel menolak permintaan (${response.status}): ${detail.slice(0, 200)}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Isi surel pemulihan                                                        */
/* -------------------------------------------------------------------------- */

const TEKS = {
  id: {
    subject: "Atur ulang kata sandi CV ATS & Portofolio Builder",
    heading: "Atur ulang kata sandi Anda",
    body: "Ada yang meminta kata sandi baru untuk akun ini. Kalau itu Anda, tekan tombol di bawah.",
    button: "Buat kata sandi baru",
    expiry: (menit: number) =>
      `Tautan ini hanya berlaku ${menit} menit, dan hanya bisa dipakai sekali.`,
    ignore:
      "Kalau bukan Anda yang meminta, abaikan saja surel ini - kata sandi Anda tidak berubah sedikit pun selama tautannya tidak ditekan.",
    fallback: "Kalau tombolnya tidak bisa ditekan, salin alamat ini ke browser:",
  },
  en: {
    subject: "Reset your CV ATS & Portofolio Builder password",
    heading: "Reset your password",
    body: "Someone asked for a new password on this account. If that was you, use the button below.",
    button: "Set a new password",
    expiry: (menit: number) =>
      `This link works for ${menit} minutes only, and only once.`,
    ignore:
      "If this was not you, simply ignore this email - your password does not change unless the link is used.",
    fallback: "If the button does not work, copy this address into your browser:",
  },
} as const;

/**
 * Menyusun surel pemulihan dalam bahasa yang dipilih pengguna.
 *
 * Isinya sengaja pendek dan tanpa gambar. Surel pemulihan kata sandi adalah
 * bentuk yang paling sering ditiru penipu, dan surel bergambar dari pengirim
 * yang belum dikenal justru mengajari pengguna mempercayai bentuk yang
 * seharusnya mereka curigai.
 */
export function passwordResetEmail(
  locale: Locale,
  url: string,
  expiryMinutes: number,
): { subject: string; text: string; html: string } {
  const t = TEKS[locale] ?? TEKS.id;

  const text = [
    t.heading,
    "",
    t.body,
    "",
    url,
    "",
    t.expiry(expiryMinutes),
    t.ignore,
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:520px">
  <h1 style="font-size:19px;margin:0 0 14px">${escapeHtml(t.heading)}</h1>
  <p style="margin:0 0 18px">${escapeHtml(t.body)}</p>
  <p style="margin:0 0 18px">
    <a href="${escapeHtml(url)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:bold">${escapeHtml(t.button)}</a>
  </p>
  <p style="margin:0 0 6px;color:#555;font-size:13px">${escapeHtml(t.expiry(expiryMinutes))}</p>
  <p style="margin:0 0 18px;color:#555;font-size:13px">${escapeHtml(t.ignore)}</p>
  <p style="margin:0;color:#777;font-size:12px">${escapeHtml(t.fallback)}<br>${escapeHtml(url)}</p>
</div>`;

  return { subject: t.subject, text, html };
}

/**
 * Meloloskan karakter yang bermakna di HTML.
 *
 * Alamat tautannya dibangun aplikasi sendiri, jadi tidak ada masukan pengguna
 * yang masuk ke sini hari ini. Ia tetap diloloskan: surel dikirim ke luar dan
 * tidak dapat ditarik kembali, dan itu tempat terakhir yang pantas
 * mengandalkan asumsi tentang apa yang akan disambung ke dalamnya nanti.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
