import { ImageResponse } from "next/og";
import { AUTHOR, SITE } from "@/lib/site";

/**
 * Gambar pratinjau saat tautan aplikasi dibagikan di WhatsApp, LinkedIn,
 * atau media sosial lain. Dibuat oleh server agar isinya selalu mengikuti
 * nama dan deskripsi yang sama dengan seluruh aplikasi.
 *
 * Catatan: mesin perender gambar ini (Satori) hanya mengenal sebagian kecil
 * CSS. Setiap elemen yang memiliki lebih dari satu anak wajib menyatakan
 * display secara eksplisit, dan elemen <br> tidak didukung - pemenggalan
 * baris dilakukan dengan menyusun kolom.
 */
export const alt = `${SITE.name} - ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Kepala */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#ffffff",
              color: "#0a0a0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              marginRight: 16,
            }}
          >
            CV
          </div>
          <div style={{ display: "flex", color: "#9a9aa2", fontSize: 26 }}>
            {SITE.name}
          </div>
        </div>

        {/* Judul */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Isi field-nya. CV yang
          </div>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: 8,
            }}
          >
            terbaca mesin tersusun sendiri.
          </div>
          <div
            style={{
              display: "flex",
              color: "#b9b9c0",
              fontSize: 27,
              marginTop: 24,
            }}
          >
            Pratinjau langsung, skor ATS beserta sarannya, unduh PDF dan Word.
          </div>
        </div>

        {/* Kaki */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #26262b",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", color: "#74747a", fontSize: 22 }}>
            {AUTHOR.name} - {AUTHOR.institution}
          </div>
          <div
            style={{
              display: "flex",
              color: "#7b9bff",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Gratis
          </div>
        </div>
      </div>
    ),
    size,
  );
}
