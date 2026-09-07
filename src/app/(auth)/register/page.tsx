/*
  Halaman daftar akun.

  Sama seperti halaman masuk, yang sudah punya sesi dialihkan ke dasbor.

  `googleEnabled` dibaca di SERVER lalu dikirim sebagai prop - tombol Google
  tidak boleh muncul kalau kuncinya belum dipasang, dan komponen klien tidak
  dapat memeriksa itu sendiri tanpa membocorkan setelan server.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.auth.registerTitle };
}

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return <RegisterForm googleEnabled={googleEnabled} />;
}
