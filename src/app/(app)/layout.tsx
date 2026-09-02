import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui";

/**
 * Kerangka halaman yang membutuhkan login.
 *
 * Pemeriksaan sesi dilakukan di layout server, bukan di middleware, agar
 * pengecekan berjalan pada runtime Node dan dapat memakai koneksi database
 * yang sama dengan seluruh aplikasi. Setiap handler API tetap memeriksa
 * kepemilikan datanya sendiri, sehingga layout ini adalah lapisan
 * kenyamanan - bukan satu-satunya penjaga.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const displayName = session.user.name || session.user.email || "Pengguna";

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
              CV
            </span>
            <span className="hidden text-sm font-semibold text-ink-900 sm:inline">
              Pembuat CV ATS-Friendly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-xs text-ink-500 sm:inline">
              {displayName}
            </span>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                Pengaturan
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
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
