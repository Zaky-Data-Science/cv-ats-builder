/**
 * ============================================================================
 *  LENCANA MEREK
 * ============================================================================
 *
 * Sebelumnya lencana ini bertuliskan huruf "CV" di dalam kotak membulat -
 * bentuk yang dipakai ribuan aplikasi lain, dan tidak mengatakan apa pun
 * tentang yang dikerjakan aplikasi ini.
 *
 * Gantinya selembar dokumen yang **sedang dipindai**: garis-garis teks di dalam
 * kertas, lalu satu garis mendatar yang menembus keluar kedua tepinya. Garis
 * itu inti ceritanya - sebelum CV sampai ke tangan manusia, ada mesin yang
 * membacanya lebih dulu, dan seluruh alasan aplikasi ini ada adalah memastikan
 * pembacaan itu berhasil.
 *
 * Ikon dokumen bercentang sempat dipertimbangkan dan ditolak: ia mengatakan
 * "berhasil", bukan "dibaca mesin", dan bentuk itu sudah dipakai di mana-mana.
 *
 * Garis teksnya sengaja dipisah dua kelompok, di atas dan di bawah garis
 * pindai. Kalau semuanya ditaruh di satu sisi, yang terbaca cuma dokumen
 * dengan garis nyasar.
 *
 * Digambar sebagai SVG inline, bukan berkas gambar: tidak ada berkas biner
 * yang harus ikut dikelola, dan warnanya mengikuti `currentColor` sehingga satu
 * komponen ini melayani latar gelap maupun terang tanpa varian kedua.
 *
 * Pada favicon 16 piksel yang tersisa tinggal siluetnya - sebuah persegi
 * dengan satu garis melintang yang keluar di kedua sisi. Itu masih cukup untuk
 * membedakannya dari ikon dokumen biasa, dan itulah sebabnya garis pindainya
 * dibuat menembus keluar, bukan berhenti di tepi kertas.
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
      {/* Kertasnya. */}
      <rect x="6" y="3.4" width="12" height="17.2" rx="1.6" />

      {/* Garis teks di atas garis pindai. */}
      <path d="M8.8 7h6.4" />
      <path d="M8.8 9.4h4.2" />

      {/* Garis teks di bawahnya. */}
      <path d="M8.8 15.2h6.4" />
      <path d="M8.8 17.6h4.2" />

      {/* Garis pindai - menembus keluar kedua tepi kertas. */}
      <path d="M2.6 12.3h18.8" />
    </svg>
  );
}
