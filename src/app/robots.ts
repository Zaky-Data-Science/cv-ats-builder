import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/site";

/**
 * Aturan bagi perayap mesin pencari.
 *
 * Halaman publik boleh diindeks; area yang memerlukan login tidak - selain
 * tidak berguna bagi hasil pencarian, alamat editor memuat id CV yang tidak
 * perlu tersebar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/resume/", "/settings", "/api/"],
    },
    sitemap: `${baseUrl()}/sitemap.xml`,
  };
}
