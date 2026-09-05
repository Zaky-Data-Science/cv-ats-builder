"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/guard";
import { getLocale } from "@/lib/i18n/server";
import { isMailConfigured, passwordResetEmail, sendMail } from "@/lib/mail";
import {
  createResetToken,
  hashResetToken,
  RESET_TTL_MINUTES,
} from "@/lib/password-reset";
import { revokeUserTokens } from "@/lib/password-reset-store";
import { baseUrl } from "@/lib/site";

/**
 * ============================================================================
 *  AKSI PANEL PENGELOLA
 * ============================================================================
 *
 * Setiap aksi memanggil `requireAdmin()` sebagai baris pertamanya, bukan
 * mengandalkan halaman yang memanggilnya. Server Action adalah titik akhir
 * HTTP tersendiri: alamatnya dapat dipanggil langsung tanpa pernah membuka
 * halaman panelnya, dan pemeriksaan yang hanya ada di halaman tidak ikut
 * terpanggil.
 *
 * ----------------------------------------------------------------------------
 * YANG SENGAJA TIDAK ADA DI SINI
 * ----------------------------------------------------------------------------
 *
 * Tiga hal berikut gampang dibuat dan sengaja tidak dibuat:
 *
 *  - **Membaca atau menyunting isi CV.** Masalah yang sampai ke pengelola
 *    bentuknya "tidak bisa masuk", "lupa kata sandi", "minta akun dihapus".
 *    Tidak satu pun menuntut membaca riwayat kerja, nomor telepon, atau alamat
 *    rumah orang lain.
 *  - **Mengganti kata sandi orang.** Yang tersedia hanya mengirim tautan
 *    pemulihan ke pemiliknya, sehingga yang menentukan kata sandinya tetap
 *    pemilik akun. Pengelola tidak pernah tahu kata sandi siapa pun.
 *  - **Masuk menyamar sebagai pengguna lain.** Sekali ada, seluruh janji di
 *    halaman Privasi tentang siapa yang dapat melihat isi CV menjadi tidak
 *    benar.
 */

/* -------------------------------------------------------------------------- */

const emailSchema = z.string().trim().toLowerCase().email();

export type HasilAksi = { ok: true; pesan: string } | { ok: false; pesan: string };

/**
 * Menghapus satu akun beserta seluruh isinya.
 *
 * Konfirmasinya berupa mengetik ulang alamat surel yang dituju, bukan sekali
 * klik. Penghapusan di sini tidak dapat dibatalkan, dan satu klik yang meleset
 * satu baris di dalam tabel adalah cara paling mudah menghapus akun yang salah.
 *
 * Barisnya dihapus satu perintah; seluruh turunannya ikut lewat rantai
 * `ON DELETE CASCADE` yang sudah ada di skema - CV, isinya, riwayat penilaian,
 * tiket pemulihan, dan tautan akun Google.
 */
export async function hapusAkun(formData: FormData): Promise<HasilAksi> {
  const pengelola = await requireAdmin();

  const target = emailSchema.safeParse(formData.get("email"));
  const konfirmasi = emailSchema.safeParse(formData.get("konfirmasi"));

  if (!target.success) return { ok: false, pesan: "Alamat surel tidak sah." };
  if (!konfirmasi.success || konfirmasi.data !== target.data) {
    return { ok: false, pesan: "Ketikan konfirmasi tidak sama dengan alamatnya." };
  }

  /*
    Pengelola tidak dapat menghapus akunnya sendiri dari sini.

    Bukan karena berbahaya bagi orang lain, melainkan karena akibatnya tidak
    dapat diperbaiki dari dalam aplikasi: akun pengelola yang terhapus berarti
    tidak ada lagi yang dapat membuka panel ini, dan satu-satunya jalan
    kembali adalah menyentuh basis data langsung - persis yang hendak
    dihindari dengan membuat panel ini.
  */
  if (isAdminEmail(target.data) || target.data === pengelola.email?.toLowerCase()) {
    return { ok: false, pesan: "Akun pengelola tidak dapat dihapus dari panel ini." };
  }

  const ada = await prisma.user.findUnique({
    where: { email: target.data },
    select: { id: true },
  });
  if (!ada) return { ok: false, pesan: "Akun dengan alamat itu tidak ditemukan." };

  await prisma.user.delete({ where: { id: ada.id } });
  revalidatePath("/admin");
  return { ok: true, pesan: `Akun ${target.data} beserta seluruh isinya dihapus.` };
}

/**
 * Mengirim ulang tautan pemulihan kata sandi ke pemilik akun.
 *
 * Yang dikirim tautan, bukan kata sandi baru, dan tujuannya selalu alamat
 * pemilik akun - tidak pernah alamat yang diketik pengelola. Dengan begitu
 * pengelola dapat menolong orang yang terkunci tanpa satu langkah pun yang
 * membuatnya tahu, atau menentukan, kata sandi orang itu.
 */
export async function kirimTautanReset(formData: FormData): Promise<HasilAksi> {
  await requireAdmin();

  const target = emailSchema.safeParse(formData.get("email"));
  if (!target.success) return { ok: false, pesan: "Alamat surel tidak sah." };

  const pengguna = await prisma.user.findUnique({
    where: { email: target.data },
    select: { id: true, email: true, passwordHash: true },
  });
  if (!pengguna) return { ok: false, pesan: "Akun dengan alamat itu tidak ditemukan." };
  if (!pengguna.passwordHash) {
    return {
      ok: false,
      pesan:
        "Akun ini masuk lewat Google dan belum punya kata sandi, jadi tidak ada yang bisa dipulihkan.",
    };
  }

  if (!isMailConfigured()) {
    return {
      ok: false,
      pesan:
        "Pengiriman surel belum aktif di pemasangan ini (BREVO_API_KEY dan MAIL_FROM masih kosong).",
    };
  }

  /*
    Langkahnya sama persis dengan jalur "lupa kata sandi" milik pengguna, dan
    memang harus sama: tiket lama dibatalkan lebih dulu supaya tidak ada dua
    tautan hidup ke kotak masuk yang sama, lalu tiket baru disimpan sebagai
    hash - bukan sebagai token yang dikirim.

    Alamat tujuannya diambil dari baris basis data, bukan dari yang diketik di
    formulir. Keduanya memang sama di sini, tetapi membacanya dari basis data
    menutup satu kelas kekeliruan sekaligus: tautan pemulihan tidak akan
    pernah mendarat di alamat selain milik pemilik akunnya.
  */
  await revokeUserTokens(pengguna.id);
  const token = createResetToken();
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashResetToken(token),
      userId: pengguna.id,
      expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000),
    },
  });

  const surel = passwordResetEmail(
    await getLocale(),
    `${baseUrl()}/atur-sandi?token=${token}`,
    RESET_TTL_MINUTES,
  );
  await sendMail({ to: pengguna.email, ...surel });

  return { ok: true, pesan: `Tautan pemulihan dikirim ke ${pengguna.email}.` };
}
