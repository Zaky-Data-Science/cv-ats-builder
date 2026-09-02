import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Saat pengembangan, aplikasi kerap dibuka lewat 127.0.0.1 atau alamat LAN
  // (misalnya untuk mencobanya dari ponsel). Tanpa daftar ini Next memblokir
  // permintaan ke sumber daya dev-nya sendiri dari host tersebut, sehingga
  // JavaScript sisi klien gagal terhidrasi dan form tampak tidak berfungsi.
  // Daftar ini hanya berlaku pada mode pengembangan.
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.56.1"],
};

export default nextConfig;
