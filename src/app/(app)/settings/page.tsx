import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { redirectIfStaleSession } from "@/lib/guard";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.settings.title };
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  /*
    Baris penggunanya bisa saja sudah tidak ada - sesi disimpan sebagai JWT,
    jadi tokennya tetap sah setelah akun dihapus, dan pada pengembangan lokal
    keadaan yang sama muncul setiap kali basis data dibuat ulang. Yang benar
    bagi halaman adalah mengantar pengguna ke halaman masuk, bukan menampilkan
    "Ada yang tidak beres".
  */
  const user = await prisma.user
    .findUniqueOrThrow({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        passwordHash: true,
        _count: { select: { resumes: true } },
      },
    })
    .catch(redirectIfStaleSession);

  return (
    <>
    <SettingsClient
      email={user.email}
      initialName={user.name}
      hasPassword={Boolean(user.passwordHash)}
      resumeCount={user._count.resumes}
    />
    <SiteFooter compact />
    </>
  );
}
