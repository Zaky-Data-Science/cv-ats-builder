import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Jejak navigasi.
 *
 * Dua kegunaan sekaligus, dan yang kedua yang paling sering diabaikan:
 *
 * 1. **Jalan kembali.** Tanpa ini, satu-satunya cara pulang dari halaman
 *    dalam adalah tombol kembali peramban - dan pengguna yang membuka
 *    halaman itu langsung dari hasil pencarian atau dari tautan yang
 *    dibagikan tidak punya riwayat untuk dimundurkan sama sekali.
 * 2. **Peta posisi.** Butir terakhir memberi tahu pengguna ia sedang berada
 *    di mana, sehingga judul halaman tidak perlu menanggung tugas itu
 *    sendirian.
 *
 * Butir terakhir sengaja bukan tautan dan diberi `aria-current="page"`:
 * tautan yang menuju halaman yang sedang dibuka hanya menambah sasaran
 * papan ketik yang tidak melakukan apa-apa.
 */
export interface Crumb {
  label: string;
  /** Kosongkan pada butir terakhir - halaman yang sedang dibuka. */
  href?: string;
}

export function Breadcrumb({
  items,
  label,
  className,
}: {
  items: Crumb[];
  /** Nama navigasinya bagi pembaca layar, mis. "Jejak navigasi". */
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  size={13}
                  aria-hidden
                  className="shrink-0 text-ink-400"
                />
              )}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded transition-colors hover:text-ink-900 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink-800">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
