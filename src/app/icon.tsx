import { ImageResponse } from "next/og";

/**
 * Ikon situs, dibuat sebagai gambar oleh server.
 *
 * Dipilih dibanding menyimpan berkas .ico agar warna dan bentuknya tetap
 * mengikuti satu sumber yang sama dengan antarmuka, dan tidak ada berkas
 * biner yang harus ikut dikelola di dalam repositori.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          borderRadius: 14,
        }}
      >
        CV
      </div>
    ),
    size,
  );
}
