import type { Metadata } from "next";
import { auth } from "@/auth";
import { getT } from "@/lib/i18n/server";
import { GuestEditor } from "./GuestEditor";
import { GuestHeader } from "./GuestHeader";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t.guest.metaTitle,
    description: t.guest.metaDescription,
    // Halaman ini tidak berisi apa pun yang berguna bagi mesin pencari -
    // isinya dibangun di peramban pengunjung - dan alamatnya tidak perlu
    // bersaing dengan halaman depan.
    robots: { index: false, follow: true },
  };
}

/**
 * Menyusun CV tanpa akun.
 *
 * Kerangkanya sengaja mirip dengan kerangka aplikasi berakun, hanya tanpa
 * menu yang menuntut sesi. Dengan begitu, pengguna yang kemudian mendaftar
 * tidak perlu mempelajari ulang tata letak yang sama sekali berbeda.
 */
export default async function CobaPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-full flex-col">
      <GuestHeader signedIn={signedIn} />

      <main className="flex min-h-0 flex-1 flex-col">
        <GuestEditor />
      </main>
    </div>
  );
}
