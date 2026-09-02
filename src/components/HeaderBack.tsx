"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { cn } from "@/lib/utils";

/**
 * Panah kembali di bilah atas, tepat sebelum nama aplikasi.
 *
 * Menuju halaman induk yang tetap - bukan memundurkan riwayat peramban.
 * Bedanya terasa justru pada keadaan yang paling sering membingungkan:
 * halaman yang dibuka langsung dari tautan yang dibagikan tidak punya riwayat
 * sama sekali, sehingga tombol kembali peramban tidak melakukan apa-apa.
 * Tujuan yang tetap selalu berhasil.
 *
 * Menyembunyikan dirinya sendiri saat pengguna memang sudah berada di halaman
 * tujuannya - panah kembali yang mengarah ke halaman yang sedang dibuka hanya
 * menambah kebingungan.
 */
export function HeaderBack({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (pathname === href) return null;

  return (
    <Link
      href={href}
      aria-label={href === "/" ? t.nav.backHome : t.nav.backDashboard}
      title={href === "/" ? t.nav.backHome : t.nav.backDashboard}
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900",
        className,
      )}
    >
      <ArrowLeft size={16} aria-hidden />
    </Link>
  );
}
