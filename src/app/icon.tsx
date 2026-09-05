import { ImageResponse } from "next/og";

/**
 * Ikon situs, dibuat sebagai gambar oleh server.
 *
 * Dipilih dibanding menyimpan berkas .ico agar warna dan bentuknya tetap
 * mengikuti satu sumber yang sama dengan antarmuka, dan tidak ada berkas
 * biner yang harus ikut dikelola di dalam repositori.
 *
 * Bentuknya dua lembar bertumpuk, sama seperti `BrandMark` - tetapi digambar
 * dengan kotak berposisi, bukan SVG. Penggambarnya (satori) hanya mengenal
 * sebagian kecil SVG, sementara kotak dan sudut membulat didukung penuh;
 * memaksakan path yang sama berisiko menghasilkan ikon kosong tanpa peringatan.
 *
 * Pada 16 piksel yang tersisa hanya siluetnya, jadi yang dijaga di sini
 * kontras antar-lembarnya - bukan kerapian detail yang toh tidak akan terlihat.
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
          position: "relative",
          background: "#0a0a0b",
          borderRadius: 14,
        }}
      >
        {/* Lembar belakang - CV. Hanya sudut kanan-atasnya yang menyembul. */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 24,
            width: 28,
            height: 28,
            borderTop: "4px solid #ffffff",
            borderRight: "4px solid #ffffff",
            borderTopRightRadius: 6,
          }}
        />

        {/* Lembar depan - portofolio. */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 12,
            width: 32,
            height: 33,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            background: "#ffffff",
            borderRadius: 6,
          }}
        >
          {/* Dua bidang berdampingan - karya yang punya wujud. */}
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ width: 9, height: 9, background: "#0a0a0b", borderRadius: 2 }} />
            <div style={{ width: 9, height: 9, background: "#0a0a0b", borderRadius: 2 }} />
          </div>
          {/* Satu baris keterangan di bawahnya. */}
          <div style={{ width: 22, height: 3, background: "#0a0a0b", borderRadius: 2 }} />
        </div>
      </div>
    ),
    size,
  );
}
