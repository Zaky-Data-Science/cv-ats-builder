import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AtsPageClient } from "@/components/ats/AtsPageClient";
import { SiteFooter } from "@/components/SiteFooter";
import { prisma } from "@/lib/db";
import { getResume } from "@/lib/resume/persist";

export const metadata: Metadata = { title: "Analisis ATS" };

export default async function AtsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resume = await getResume(id, session.user.id);
  if (!resume) notFound();

  const history = await prisma.atsAnalysis.findMany({
    where: { resumeId: id },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, score: true, createdAt: true },
  });

  return (
    <>
    <AtsPageClient
      resume={resume}
      initialHistory={history.map((h) => ({
        id: h.id,
        score: h.score,
        createdAt: h.createdAt.toISOString(),
      }))}
    />
    <SiteFooter compact />
    </>
  );
}
