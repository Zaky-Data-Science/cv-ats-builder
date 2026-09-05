import { ImageResponse } from "next/og";

/**
 * Ikon situs, dibuat sebagai gambar oleh server.
 *
 * Dipilih dibanding menyimpan berkas .ico agar warna dan bentuknya tetap
 * mengikuti satu sumber yang sama dengan antarmuka, dan tidak ada berkas
 * biner yang harus ikut dikelola di dalam repositori.
 *
 * Bentuknya sama dengan `BrandMark` - selembar dokumen yang sedang dipindai -
 * tetapi digambar dengan kotak berposisi, bukan SVG. Penggambarnya (satori)
 * hanya mengenal sebagian kecil SVG, sementara kotak dan sudut membulat
 * didukung penuh.
 *
 * Garis pindainya diwujudkan sebagai **celah** yang memotong kertas menjadi dua
 * bidang, bukan sebagai garis terang di atas kertas yang juga terang. Di ukuran
 * ini kertas dan garis sama-sama putih; garis di atas bidang putih tidak akan
 * terlihat sama sekali. Celah gelap yang menembus keluar kedua tepi menyampaikan
 * hal yang sama dan justru bertambah jelas saat ikonnya mengecil.
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
        {/* Kertas bagian atas. */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 17,
            width: 30,
            height: 17,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 4,
            paddingLeft: 5,
            background: "#ffffff",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          <div style={{ width: 18, height: 3, background: "#0a0a0b", borderRadius: 2 }} />
          <div style={{ width: 12, height: 3, background: "#0a0a0b", borderRadius: 2 }} />
        </div>

        {/* Garis pindai: celah gelap yang menembus keluar kedua tepi kertas. */}
        <div
          style={{
            position: "absolute",
            top: 27,
            left: 6,
            width: 52,
            height: 6,
            background: "#0a0a0b",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 29,
            left: 6,
            width: 52,
            height: 2,
            background: "#ffffff",
            borderRadius: 1,
          }}
        />

        {/* Kertas bagian bawah. */}
        <div
          style={{
            position: "absolute",
            top: 33,
            left: 17,
            width: 30,
            height: 21,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 4,
            paddingLeft: 5,
            background: "#ffffff",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <div style={{ width: 18, height: 3, background: "#0a0a0b", borderRadius: 2 }} />
          <div style={{ width: 12, height: 3, background: "#0a0a0b", borderRadius: 2 }} />
        </div>
      </div>
    ),
    size,
  );
}
