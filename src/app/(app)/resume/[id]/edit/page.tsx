import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import { getResume } from "@/lib/resume/persist";

export const metadata: Metadata = { title: "Editor CV" };

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // getResume menyertakan userId pada klausa WHERE, sehingga CV milik
  // pengguna lain menghasilkan 404 - bukan sekadar tersembunyi di antarmuka.
  const resume = await getResume(id, session.user.id);
  if (!resume) notFound();

  return <ResumeEditor initial={resume} />;
}
