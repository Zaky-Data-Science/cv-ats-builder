/*
  Halaman meminta tautan pemulihan kata sandi.

  Jawabannya SELALU sama - "kalau alamatnya terdaftar, tautannya sudah
  dikirim" - baik alamatnya ada maupun tidak. Membedakan keduanya berarti
  memberi tahu siapa pun bahwa sebuah alamat surel terdaftar di sini, dan itu
  bocoran yang tidak perlu.

  Alur lengkap beserta pembuatan tiketnya ada di `lib/password-reset.ts`.
*/

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";
import { getT } from "@/lib/i18n/server";
import { isMailConfigured } from "@/lib/mail";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  // Halaman pemulihan tidak pantas muncul di hasil pencarian: satu-satunya
  // jalan yang sah menuju ke sini adalah dari halaman masuk.
  return { title: t.auth.forgotTitle, robots: { index: false, follow: false } };
}

export default async function ForgotPasswordPage() {
  // Yang sudah masuk tidak perlu memulihkan apa pun - kata sandinya dapat
  // diganti langsung di halaman Pengaturan.
  const session = await auth();
  if (session?.user?.id) redirect("/settings");

  return (
    <ForgotPasswordForm
      enabled={isMailConfigured()}
      googleEnabled={googleEnabled}
    />
  );
}
