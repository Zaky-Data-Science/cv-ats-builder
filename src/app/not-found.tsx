"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Button } from "@/components/ui";

/**
 * Halaman untuk alamat yang tidak dikenal.
 *
 * Juga muncul ketika seseorang membuka CV milik pengguna lain: kepemilikan
 * diperiksa langsung pada kueri basis data, dan CV yang bukan miliknya
 * dianggap tidak ada - sehingga keberadaan sebuah id pun tidak bocor.
 */
export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-full items-center justify-center bg-ink-100 px-5 py-16">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-500">
          <FileQuestion size={26} />
        </span>

        <h1 className="mt-5 text-lg font-bold text-ink-900">
          {t.errors.notFoundTitle}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {t.errors.notFoundBody}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button className="press w-full sm:w-auto">
              {t.errors.openDashboard}
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="press w-full sm:w-auto">
              {t.errors.backHome}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
