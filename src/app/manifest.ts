import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Manifes aplikasi web.
 *
 * Memungkinkan aplikasi dipasang ke layar utama ponsel dan dibuka layaknya
 * aplikasi biasa - berguna bagi pengguna yang menyusun CV dari ponsel dan
 * ingin melanjutkannya lain waktu tanpa mencari-cari alamatnya.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} - ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f4f4f5",
    theme_color: "#0a0a0b",
    lang: "id",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
