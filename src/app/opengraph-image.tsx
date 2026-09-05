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
          {/*
            Lencana dokumen yang sedang dipindai, mengikuti `BrandMark` dan
            `icon.tsx`. Digambar dengan kotak berposisi karena penggambarnya
            (satori) hanya mengenal sebagian kecil SVG.

            Warnanya terbalik dari favicon: di sini lencananya terang di atas
            latar gelap, jadi kertasnya gelap dan garis pindainya terang.
          */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#ffffff",
              display: "flex",
              position: "relative",
              marginRight: 16,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 9,
                left: 15,
                width: 26,
                height: 15,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 3,
                paddingLeft: 4,
                background: "#0a0a0b",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <div style={{ width: 16, height: 3, background: "#ffffff", borderRadius: 2 }} />
              <div style={{ width: 10, height: 3, background: "#ffffff", borderRadius: 2 }} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 24,
                left: 5,
                width: 46,
                height: 6,
                background: "#ffffff",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 26,
                left: 5,
                width: 46,
                height: 2,
                background: "#0a0a0b",
                borderRadius: 1,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 30,
                left: 15,
                width: 26,
                height: 17,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 3,
                paddingLeft: 4,
                background: "#0a0a0b",
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
              }}
            >
              <div style={{ width: 16, height: 3, background: "#ffffff", borderRadius: 2 }} />
              <div style={{ width: 10, height: 3, background: "#ffffff", borderRadius: 2 }} />
            </div>
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
            {AUTHOR.name}, {AUTHOR.institution}
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
