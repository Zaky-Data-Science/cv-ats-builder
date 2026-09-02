import type { Metadata } from "next";
import { auth } from "@/auth";
import { LegalPage } from "@/components/LegalPage";
import { getT } from "@/lib/i18n/server";
import { TERMS_BODY, TERMS_META } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  const meta = TERMS_META[locale];
  return { title: meta.badge, description: meta.intro };
}

export default async function KetentuanPage() {
  const session = await auth();
  const { locale } = await getT();
  const meta = TERMS_META[locale];

  return (
    <LegalPage
      badge={meta.badge}
      title={meta.title}
      intro={meta.intro}
      updatedAt={meta.updatedAt}
      signedIn={Boolean(session?.user?.id)}
    >
      {TERMS_BODY[locale]}
    </LegalPage>
  );
}
