import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pembuat CV ATS-Friendly",
    template: "%s - Pembuat CV ATS-Friendly",
  },
  description:
    "Susun CV yang terbaca sistem ATS lewat field terstruktur, lihat hasilnya seketika, unduh sebagai PDF atau Word, dan simpan datanya untuk diedit kapan saja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-app-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
