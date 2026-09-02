import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CursorGlow } from "@/components/CursorGlow";
import { I18nProvider } from "@/components/i18n";
import { getDictionary, LOCALE_HTML_LANG } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { AUTHOR, SITE, SITE_META, baseUrl } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const inter = Inter({
  variable: "--font-app-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Metadata mengikuti bahasa antarmuka yang dipilih pengunjung, sehingga
 * cuplikan yang muncul saat tautannya dibagikan tidak selalu berbahasa
 * Indonesia bagi pembaca yang memakai antarmuka Inggris.
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = SITE_META[locale];

  return {
    metadataBase: new URL(baseUrl()),
    title: {
      default: `${SITE.name} - ${meta.tagline}`,
      template: `%s - ${SITE.name}`,
    },
    description: meta.description,
    applicationName: SITE.name,
    authors: [{ name: AUTHOR.name }],
    creator: AUTHOR.name,
    keywords: meta.keywords,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "id_ID",
      siteName: SITE.name,
      title: `${SITE.name} - ${meta.tagline}`,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name} - ${meta.tagline}`,
      description: meta.description,
    },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  // Dua nilai, satu untuk tiap mode. Bilah alamat peramban ponsel memakai
  // nilai ini; satu nilai gelap saja akan tampak seperti cacat tampilan
  // ketika aplikasinya sedang bermode terang.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  // Pengguna tetap boleh memperbesar halaman. Mengunci perbesaran akan
  // menyulitkan pembaca dengan penglihatan terbatas, dan tidak ada alasan
  // teknis untuk melakukannya di sini.
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return (
    <html
      lang={LOCALE_HTML_LANG[locale]}
      className={`${inter.variable} h-full`}
      /*
        Skrip tema di bawah menulis atribut data-theme sebelum React hidrasi,
        sehingga DOM yang ditemukan React berbeda dari HTML yang dikirim
        server - dan React melaporkannya sebagai ketidakcocokan hidrasi.
        Perbedaan itu memang disengaja dan hanya pada satu atribut di elemen
        ini; tanpa penulisan lebih awal itu, pengguna mode gelap akan melihat
        kilatan putih pada setiap perpindahan halaman. Peringatannya dimatikan
        khusus untuk elemen ini saja, bukan untuk seluruh pohon.
      */
      suppressHydrationWarning
    >
      <head>
        {/*
          Menyetel mode tampilan sebelum halaman digambar. Tanpa ini pengguna
          mode gelap akan melihat kilatan putih di setiap perpindahan halaman,
          karena server tidak mengetahui pilihan yang tersimpan di peramban.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-app-sans), system-ui, sans-serif" }}
      >
        <I18nProvider locale={locale} dictionary={dictionary}>
          <CursorGlow />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
