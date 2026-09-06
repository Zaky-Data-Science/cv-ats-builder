import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { AppHeader } from "@/components/AppHeader";
import { getT } from "@/lib/i18n/server";

/**
 * Kerangka halaman yang membutuhkan login.
 *
 * Pemeriksaan sesi yang sesungguhnya dilakukan di sini, bukan di
 * `src/proxy.ts`. Yang di sana hanya melihat ada-tidaknya cookie supaya tetap
 * murah - ia berjalan di depan setiap permintaan ke halaman terlindungi;
 * yang di sini memverifikasi tanda tangannya lewat `auth()` dan boleh memakai
 * koneksi basis data yang sama dengan seluruh aplikasi. Setiap handler API
 * tetap memeriksa kepemilikan datanya sendiri, sehingga layout ini adalah
 * lapisan kenyamanan - bukan satu-satunya penjaga.
 *
 * Bilah atasnya sendiri pindah ke `components/AppHeader.tsx`. Ia komponen
 * klien karena laci, menu akun, dan sakelar temanya menuntut keadaan di
 * peramban - tetapi keputusan "siapa pengelola" tetap dibuat DI SINI, di
 * server, lalu dikirim sebagai prop. Lihat catatan di bawah.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const { t } = await getT();
  if (!session?.user?.id) redirect("/login");

  const email = session.user.email ?? "";
  const displayName = session.user.name || email || t.app.user;

  /*
    Peran dibaca ULANG di sini dari ADMIN_EMAIL, bukan diambil dari token.

    Penanda di dalam token dicap saat masuk dan tidak berubah sampai token itu
    disegarkan. Akibatnya nyata dan pernah terjadi: ADMIN_EMAIL diisi SETELAH
    seseorang masuk, sehingga rutenya sudah terbuka - ia memang membaca ulang
    dari env - sementara tautan menunya tidak pernah muncul. Menu dan rute
    berbeda pendapat, dan yang mengalaminya harus menebak alamatnya sendiri.

    Membaca dari sumber yang sama membuat keduanya tidak mungkin berbeda lagi,
    dan pemberian maupun pencabutan peran berlaku tanpa perlu keluar-masuk.

    Bilah atas menerimanya sebagai prop dan tidak pernah membacanya sendiri:
    komponen klien tidak punya akses ke env, dan menaruhnya kembali ke dalam
    token demi memudahkan komponen klien akan mengembalikan persis cacat yang
    baru saja dibuang.

    Ini tetap kemudahan tampilan, BUKAN pengamanan: /admin dan setiap aksinya
    memeriksa perannya sendiri di server. Jangan pernah menggantungkan izin apa
    pun pada nilai ini.
  */
  const pengelola = isAdminEmail(email);

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader nama={displayName} email={email} pengelola={pengelola} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
