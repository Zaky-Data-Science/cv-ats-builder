import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { prisma } from "@/lib/db";
import type { ResumeSummary } from "@/lib/resume/types";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Dibaca langsung dari database, bukan lewat fetch ke API sendiri, sehingga
  // halaman ini tidak menambah satu perjalanan HTTP saat render di server.
  const rows = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      template: true,
      updatedAt: true,
      personalInfo: { select: { fullName: true, headline: true } },
      atsAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { score: true },
      },
    },
  });

  const resumes: ResumeSummary[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    template: row.template,
    fullName: row.personalInfo?.fullName ?? "",
    headline: row.personalInfo?.headline ?? "",
    updatedAt: row.updatedAt.toISOString(),
    latestScore: row.atsAnalyses[0]?.score ?? null,
  }));

  return <DashboardClient initialResumes={resumes} />;
}
