import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AUTHOR, SITE, baseUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: `${SITE.name} - ${SITE.tagline}`,
    template: `%s - ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: AUTHOR.name }],
  creator: AUTHOR.name,
  publisher: AUTHOR.institution,
  keywords: [
    "CV ATS",
    "pembuat CV",
    "CV ATS friendly",
    "resume builder Indonesia",
    "contoh CV",
    "template CV ATS",
    "skor ATS",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  // Pengguna tetap boleh memperbesar halaman. Mengunci perbesaran akan
  // menyulitkan pembaca dengan penglihatan terbatas, dan tidak ada alasan
  // teknis untuk melakukannya di sini.
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
