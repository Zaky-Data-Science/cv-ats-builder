import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.settings.title };
}

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      passwordHash: true,
      _count: { select: { resumes: true } },
    },
  });

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
