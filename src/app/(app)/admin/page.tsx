import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/guard";
import { getT } from "@/lib/i18n/server";
import { AdminClient } from "@/components/admin/AdminClient";

/**
 * ============================================================================
 *  PANEL PENGELOLA
 * ============================================================================
 *
 * Panel ini melihat **data akun**, tidak pernah **isi CV**.
 *
 * Bedanya bukan soal rasa. Isi CV adalah kumpulan data pribadi paling lengkap
 * yang dimiliki seseorang: nama, nomor telepon, alamat, riwayat kerja, kadang
 * pas foto. Masalah nyata yang sampai ke pengelola bentuknya "tidak bisa
 * masuk", "lupa kata sandi", "minta akun dihapus", "akun ganda" - tidak satu
 * pun menuntut membaca isi CV seseorang.
 *
 * Karena itu kuerinya di bawah menyebut kolomnya satu per satu, dan tidak satu
 * pun berasal dari tabel isi CV. Menyertakan `resumes: { select: { title } }`
 * pun ditolak: judul CV kerap memuat nama orang dan nama perusahaan yang
 * dilamar. Yang diambil hanya **jumlahnya**.
 *
 * Halaman ini memanggil `notFound()` bagi yang bukan pengelola, bukan
 * menampilkan pesan penolakan. Pesan penolakan justru memberi tahu ada sesuatu
 * di alamat ini; halaman yang seolah tidak ada tidak mengungkapkan apa pun.
 */

export const metadata: Metadata = {
  title: "Panel pengelola",
  robots: { index: false, follow: false },
};

/** Dibaca ulang tiap permintaan: angkanya tidak berguna kalau basi. */
export const dynamic = "force-dynamic";

const PER_HALAMAN = 20;

/**
 * Batas waktu "sekian hari terakhir".
 *
 * Berdiri di luar komponen karena membaca jam adalah tindakan tak murni, dan
 * pemeriksa React menolaknya di dalam badan komponen. Halaman ini memang
 * `force-dynamic` sehingga dihitung ulang tiap permintaan, tetapi aturan itu
 * tidak dapat mengetahuinya - dan memindahkannya ke sini lebih murah daripada
 * mematikan aturannya.
 */
function sejakHariLalu(hari: number): Date {
  return new Date(Date.now() - hari * 24 * 60 * 60 * 1000);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; hal?: string }>;
}) {
  if (!(await isAdminRequest())) notFound();

  const { t } = await getT();
  const { q = "", hal = "1" } = await searchParams;
  const cari = q.trim().toLowerCase();
  const halaman = Math.max(1, Number.parseInt(hal, 10) || 1);

  const where = cari ? { email: { contains: cari } } : {};

  const hari7 = sejakHariLalu(7);
  const hari30 = sejakHariLalu(30);

  /*
    Status basis data ditentukan oleh apakah kuerinya berhasil, bukan oleh
    sebuah bendera yang disetel di tempat lain. Bendera dapat basi; kueri yang
    baru saja berjalan tidak bisa.
  */
  let tersambung = true;
  let ringkasan = { akun: 0, cv: 0, baru7: 0, baru30: 0 };
  let baris: {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    passwordHash: string | null;
    _count: { resumes: number; accounts: number };
  }[] = [];
  let total = 0;

  try {
    const [akun, cv, baru7, baru30, daftar, jumlah] = await Promise.all([
      prisma.user.count(),
      prisma.resume.count(),
      prisma.user.count({ where: { createdAt: { gte: hari7 } } }),
      prisma.user.count({ where: { createdAt: { gte: hari30 } } }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (halaman - 1) * PER_HALAMAN,
        take: PER_HALAMAN,
        /*
          Kolomnya disebut satu per satu, dan tidak satu pun menyentuh isi CV.
          `select` yang eksplisit juga berarti kolom baru yang ditambahkan ke
          tabel User kelak tidak ikut bocor ke panel ini tanpa ada yang
          memutuskannya.
        */
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: true,
          _count: { select: { resumes: true, accounts: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);
    ringkasan = { akun, cv, baru7, baru30 };
    baris = daftar;
    total = jumlah;
  } catch {
    tersambung = false;
  }

  return (
    <AdminClient
      teks={t.admin}
      tersambung={tersambung}
      ringkasan={ringkasan}
      cari={q}
      halaman={halaman}
      perHalaman={PER_HALAMAN}
      total={total}
      akun={baris.map((u) => ({
        email: u.email,
        daftar: u.createdAt.toISOString(),
        aktif: u.updatedAt.toISOString(),
        /*
          Cara masuknya disimpulkan dari apa yang ada, bukan disimpan sebagai
          kolom tersendiri: ada hash kata sandi berarti bisa masuk lewat kata
          sandi, ada baris Account berarti bisa lewat Google. Keduanya dapat
          benar sekaligus.
        */
        punyaSandi: Boolean(u.passwordHash),
        punyaGoogle: u._count.accounts > 0,
        jumlahCv: u._count.resumes,
      }))}
    />
  );
}
