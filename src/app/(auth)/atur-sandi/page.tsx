import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.auth.resetTitle, robots: { index: false, follow: false } };
}

export default function ResetPasswordPage() {
  return (
    // useSearchParams membaca token dari alamat, dan itu memerlukan batas
    // Suspense - pola yang sama dengan halaman masuk.
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
