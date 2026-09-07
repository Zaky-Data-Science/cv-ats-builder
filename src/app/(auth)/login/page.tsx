/*
  Halaman masuk.

  Yang sudah masuk DIALIHKAN ke dasbor, bukan dibiarkan melihat formulir yang
  tidak ada gunanya lagi baginya. Pemeriksaannya di server, sehingga
  pengalihannya terjadi sebelum satu piksel pun digambar.

  `Suspense` di bawah bukan hiasan: `LoginForm` membaca parameter alamat
  (`?sesi=habis`, `?ganti=1`) lewat `useSearchParams`, dan Next menuntut
  pembacaan itu berada di dalam batas Suspense.
*/

import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import { LoginForm } from "@/components/auth/AuthForms";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.auth.loginTitle };
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return (
    // useSearchParams di dalam LoginForm memerlukan batas Suspense.
    <Suspense fallback={null}>
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
