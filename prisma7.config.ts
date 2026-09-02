import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Konfigurasi Prisma CLI (migrasi dan seed).
 *
 * Perhatikan pemisahan berikut - keduanya sengaja memakai koneksi berbeda:
 *
 *  - Perintah migrasi memakai koneksi **langsung** ke basis data.
 *  - Aplikasi saat berjalan memakai koneksi **pooled** (lihat src/lib/db.ts).
 *
 * Alasannya, penyedia Postgres serverless seperti Neon menempatkan PgBouncer
 * di depan basis data dalam mode transaksi. Mode itu tidak mendukung
 * penguncian tingkat sesi maupun pernyataan yang menjangkau banyak
 * transaksi - keduanya dipakai Prisma saat menerapkan migrasi, sehingga
 * `prisma migrate deploy` dapat menggantung atau gagal bila dijalankan
 * melalui pooler.
 *
 * Integrasi Neon di Vercel menyediakan kedua bentuk alamat sekaligus, jadi
 * yang diperlukan hanya memilih yang tepat untuk masing-masing keperluan.
 * Di komputer sendiri kedua variabel itu tidak ada, sehingga otomatis
 * kembali memakai DATABASE_URL biasa.
 */
const migrationUrl =
  process.env["DATABASE_URL_UNPOOLED"] ??
  process.env["POSTGRES_URL_NON_POOLING"] ??
  process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
    shadowDatabaseUrl: process.env["SHADOW_DATABASE_URL"],
  },
});
