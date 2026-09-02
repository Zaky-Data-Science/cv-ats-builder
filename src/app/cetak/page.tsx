import type { Metadata } from "next";
import { GuestPrint } from "./GuestPrint";

export const metadata: Metadata = {
  title: "Cetak CV",
  robots: { index: false, follow: false },
};

/** Halaman cetak untuk CV yang disusun tanpa akun. */
export default function CetakTamuPage() {
  return <GuestPrint />;
}
