import type { Metadata } from "next";
import { auth } from "@/auth";
import { LegalPage } from "@/components/LegalPage";
import { getT } from "@/lib/i18n/server";
import { PRIVACY_BODY, PRIVACY_META } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  const meta = PRIVACY_META[locale];
  return { title: meta.badge, description: meta.intro };
}

export default async function PrivasiPage() {
  const session = await auth();
  const { locale } = await getT();
  const meta = PRIVACY_META[locale];

  return (
    <LegalPage
      badge={meta.badge}
      title={meta.title}
      intro={meta.intro}
      updatedAt={meta.updatedAt}
      signedIn={Boolean(session?.user?.id)}
    >
      {PRIVACY_BODY[locale]}
    </LegalPage>
  );
}
