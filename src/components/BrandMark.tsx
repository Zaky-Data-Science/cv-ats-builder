/**
 * ============================================================================
 *  LENCANA MEREK
 * ============================================================================
 *
 * Sebelumnya lencana ini bertuliskan huruf "CV" - dan itu berarti benda paling
 * kecil di halaman justru yang paling keras menyatakan produk ini soal CV saja,
 * membantah seluruh salinan di bawahnya yang menyebut dua pilar.
 *
 * Gantinya dua lembar bertumpuk:
 *
 *   - Lembar **belakang** adalah CV: garis-garis teks satu kolom, rata kiri,
 *     tanpa gambar - persis batasan yang dijaga penghasil CV-nya.
 *   - Lembar **depan** adalah portofolio: dua bidang gelap berdampingan
 *     (karya, gambar, denah) di atas satu baris teks.
 *
 * Keduanya bertumpuk, bukan berdampingan, karena memang begitu keadaannya:
 * satu data, dua wujud - dan hari ini portofolionya masih tinggal di dalam
 * CV yang sama.
 *
 * Digambar sebagai SVG inline, bukan berkas gambar, karena alasan yang sama
 * dengan `icon.tsx`: tidak ada berkas biner yang harus ikut dikelola, dan
 * warnanya mengikuti `currentColor` sehingga satu komponen ini melayani latar
 * gelap maupun terang tanpa varian kedua.
 *
 * Ukuran gambarnya 24x24 dengan garis 1,6px. Di bawah itu - favicon 16px -
 * yang tersisa tinggal siluetnya, dan siluet dua persegi bertumpuk dengan
 * sudut kanan-atas yang menyembul masih terbaca sebagai dua lembar. Itulah
 * sebabnya lembar belakangnya digeser ke kanan-atas, bukan diperkecil.
 */
export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Lembar belakang - CV. Hanya sudut kanan-atasnya yang terlihat. */}
      <path d="M8.5 4.5h9a1 1 0 0 1 1 1v9" />
      <path d="M12 7.6h4.2" />

      {/* Lembar depan - portofolio. */}
      <rect x="4.5" y="7.5" width="11.5" height="12" rx="1.4" />
      {/* Dua bidang berdampingan: karya yang punya wujud. */}
      <rect x="6.9" y="10" width="2.9" height="3.1" rx="0.5" fill="currentColor" stroke="none" />
      <rect x="10.9" y="10" width="2.9" height="3.1" rx="0.5" fill="currentColor" stroke="none" />
      {/* Satu baris teks di bawahnya - keterangan karyanya. */}
      <path d="M6.9 16.4h6.9" />
    </svg>
  );
}
