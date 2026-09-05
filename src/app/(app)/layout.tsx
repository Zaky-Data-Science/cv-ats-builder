import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, UserRoundCog } from "lucide-react";
import { auth, signOut } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { BrandMark } from "@/components/BrandMark";
import { HeaderBack } from "@/components/HeaderBack";
import { LanguageToggle } from "@/components/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import { SITE } from "@/lib/site";

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
    Peran dibaca ULANG di sini dari ADMIN_EMAIL, bukan diambil dari
    `session.user.admin`.

    Penanda di dalam token dicap saat masuk dan tidak berubah sampai token itu
    disegarkan. Akibatnya nyata dan pernah terjadi: ADMIN_EMAIL diisi SETELAH
    seseorang masuk, sehingga rutenya sudah terbuka - ia memang membaca ulang
    dari env - sementara tautan menunya tidak pernah muncul. Menu dan rute
    berbeda pendapat, dan yang mengalaminya harus menebak alamatnya sendiri.

    Membaca dari sumber yang sama membuat keduanya tidak mungkin berbeda lagi,
    dan pemberian maupun pencabutan peran berlaku tanpa perlu keluar-masuk.

    Ini tetap kemudahan tampilan, BUKAN pengamanan: /admin dan setiap aksinya
    memeriksa perannya sendiri di server. Jangan pernah menggantungkan izin apa
    pun pada nilai ini.
  */
  const pengelola = isAdminEmail(email);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-1.5">
            <HeaderBack href="/dashboard" />
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900 text-white">
                <BrandMark className="h-4 w-4" />
              </span>
              <span className="hidden text-sm font-semibold text-ink-900 sm:inline">
                {SITE.name}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/*
              Yang ditampilkan alamat surelnya, bukan hanya nama tampilan.

              Dua akun bisa punya nama yang sama persis - "Riyadh Zaky" tidak
              memberi tahu apa pun tentang akun mana yang sedang dipakai.
              Alamat surel selalu berbeda, dan itulah satu-satunya yang
              menjawab "saya sedang masuk sebagai siapa".

              Namanya tetap disebut di atas alamatnya pada layar lebar, karena
              di situ ada ruang dan nama lebih cepat dikenali. Di layar sempit
              yang bertahan alamatnya, bukan namanya: kalau hanya satu yang
              muat, yang berguna justru alamatnya.
            */}
            <span className="flex min-w-0 flex-col items-end leading-tight">
              <span className="hidden max-w-52 truncate text-xs text-ink-500 xl:inline">
                {displayName}
              </span>
              <span className="hidden max-w-52 truncate text-[11px] text-ink-400 sm:inline">
                {email}
              </span>
            </span>

            {/*
              Lencana pengelola.

              Sebelum ini tidak ada cara mengetahui sedang masuk sebagai
              pengelola selain menebak-nebak alamat /admin. Lencananya membaca
              sumber yang sama dengan tautan panelnya, jadi keduanya tidak
              mungkin bertentangan.
            */}
            {pengelola && (
              <span
                className="hidden shrink-0 rounded-md border border-ink-300 bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-ink-700 uppercase sm:inline"
                title={t.app.adminBadgeHint}
              >
                {t.app.adminBadge}
              </span>
            )}
            <LanguageToggle />
            <ThemeToggle />
            {/*
              Tautan panel hanya muncul bagi pengelola. Ini kemudahan, BUKAN
              pengamanan: rutenya sendiri memeriksa perannya di server dan
              membalas 404 bagi siapa pun yang lain, termasuk yang mengetik
              alamatnya langsung tanpa pernah melihat tautan ini.
            */}
            {pengelola && (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  {t.admin.title}
                </Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                {t.app.settings}
              </Button>
            </Link>
            {/*
              "Ganti akun" berbeda maksud dari "Keluar", jadi berbeda tombol.

              Keluar berarti selesai: kembali ke halaman masuk dan berhenti di
              sana. Ganti akun berarti ingin masuk lagi, sebagai orang lain -
              dan yang dituju langsung pemilih akun Google, tanpa singgah di
              halaman masuk lalu menekan tombol yang sama sekali lagi.

              Keduanya sama-sama mengeluarkan lebih dulu. Yang membedakan
              hanya ke mana orangnya dibawa sesudah itu, dan itulah yang
              dijelaskan namanya.
            */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login?ganti=1" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                title={t.app.switchAccountHint}
              >
                <UserRoundCog size={14} />
                <span className="hidden lg:inline">{t.app.switchAccount}</span>
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                <LogOut size={14} />
                <span className="hidden sm:inline">{t.app.signOut}</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
