"use server";

import { signOut } from "@/auth";

/**
 * Dua cara meninggalkan akun.
 *
 * Keduanya berada di berkas tersendiri karena bilah atas aplikasi kini sebuah
 * komponen klien, dan komponen klien tidak boleh menulis aksi server di dalam
 * dirinya sendiri. Bentuknya tetap `<form action={...}>` - bukan pemanggilan
 * lewat `onClick` - supaya keluar tetap berhasil pada peramban yang JavaScript
 * -nya gagal termuat, dan supaya keduanya tetap berupa permintaan POST yang
 * tidak dapat dipicu oleh sekadar memuat sebuah gambar.
 */

/** Keluar dan berhenti di halaman masuk. */
export async function keluar(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}

/**
 * Keluar, lalu langsung ke pemilih akun.
 *
 * Berbeda maksud dari `keluar()`, jadi berbeda tujuan. Keluar berarti selesai;
 * ganti akun berarti ingin masuk lagi sebagai orang lain - dan yang dituju
 * langsung pemilih akunnya, tanpa singgah di halaman masuk lalu menekan tombol
 * yang sama sekali lagi.
 */
export async function gantiAkun(): Promise<void> {
  await signOut({ redirectTo: "/login?ganti=1" });
}
