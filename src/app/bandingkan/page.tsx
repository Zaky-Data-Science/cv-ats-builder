import type { Metadata } from "next";
import { auth } from "@/auth";
import { CompareClient } from "@/components/compare/CompareClient";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t.compare.metaTitle,
    description: t.compare.metaDescription,
  };
}

/**
 * Halaman pembanding dan pemindai CV.
 *
 * Sengaja terbuka tanpa login. Fitur ini tidak menyentuh basis data sama
 * sekali - berkasnya dibaca dan dinilai di dalam peramban - sehingga tidak
 * ada alasan teknis untuk menuntut akun. Menuntutnya hanya akan menghalangi
 * orang yang sedang membandingkan CV justru pada saat ia paling membutuhkan
 * bantuannya.
 */
export default async function ComparePage() {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-col">
      <PublicHeader signedIn={Boolean(session?.user?.id)} />
      <main className="flex-1">
        <CompareClient />
      </main>
      <SiteFooter />
    </div>
  );
}
