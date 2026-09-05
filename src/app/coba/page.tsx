import Link from "next/link";
import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { auth } from "@/auth";
import { HeaderBack } from "@/components/HeaderBack";
import { LanguageToggle } from "@/components/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import { SITE } from "@/lib/site";
import { GuestEditor } from "./GuestEditor";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t.guest.metaTitle,
    description: t.guest.metaDescription,
    // Halaman ini tidak berisi apa pun yang berguna bagi mesin pencari -
    // isinya dibangun di peramban pengunjung - dan alamatnya tidak perlu
    // bersaing dengan halaman depan.
    robots: { index: false, follow: true },
  };
}

/**
 * Menyusun CV tanpa akun.
 *
 * Kerangkanya sengaja mirip dengan kerangka aplikasi berakun, hanya tanpa
 * menu yang menuntut sesi. Dengan begitu, pengguna yang kemudian mendaftar
 * tidak perlu mempelajari ulang tata letak yang sama sekali berbeda.
 */
export default async function CobaPage() {
  const session = await auth();
  const { t } = await getT();
  const signedIn = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <div className="flex min-w-0 items-center gap-1.5">
            <HeaderBack href="/" />
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
                CV
              </span>
              <span className="hidden text-sm font-semibold text-ink-900 sm:inline">
                {SITE.name}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {/*
              Dua tombol terpisah, bukan satu tombol "Masuk".

              Halaman ini justru dibuka orang yang belum tentu punya akun -
              itulah gunanya jalur tanpa akun. Menawarkan "Masuk" saja membuat
              orang yang belum pernah mendaftar merasa jalur itu bukan untuknya,
              padahal di sanalah CV-nya bisa tersimpan permanen.
            */}
            {signedIn ? (
              <Link
                href="/dashboard"
                className={buttonClass({
                  variant: "outline",
                  size: "sm",
                  className: "press",
                })}
              >
                <LogIn size={14} />
                <span className="hidden sm:inline">{t.nav.dashboard}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonClass({
                    variant: "ghost",
                    size: "sm",
                    className: "press",
                  })}
                >
                  <LogIn size={14} />
                  <span className="hidden sm:inline">{t.nav.login}</span>
                </Link>
                <Link
                  href="/register"
                  className={buttonClass({ size: "sm", className: "press" })}
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <GuestEditor />
      </main>
    </div>
  );
}
