import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Daftar" };

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user?.id) redirect("/dashboard");

  return <RegisterForm googleEnabled={googleEnabled} />;
}
