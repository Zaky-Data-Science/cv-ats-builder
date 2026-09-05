import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
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

  const displayName = session.user.name || session.user.email || t.app.user;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-1.5">
            <HeaderBack href="/dashboard" />
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
                CV
              </span>
              <span className="hidden text-sm font-semibold text-ink-900 sm:inline">
                {SITE.name}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="hidden max-w-40 truncate text-xs text-ink-500 lg:inline">
              {displayName}
            </span>
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                {t.app.settings}
              </Button>
            </Link>
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
