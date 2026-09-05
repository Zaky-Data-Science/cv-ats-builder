/**
 * ============================================================================
 *  RUJUKAN UNTUK ANGKA DAN KLAIM
 * ============================================================================
 *
 * Alamat sumbernya dikumpulkan di satu berkas supaya tidak ada halaman yang
 * menulis ulang alamatnya sendiri. Dua salinan sebuah URL adalah cara paling
 * pasti membuat salah satunya mati diam-diam, dan tautan mati lebih buruk
 * daripada tanpa sumber: ia terlihat seperti sumber yang dikarang.
 *
 * Ketiganya dipilih dengan satu syarat keras: **tidak menjual apa pun.** Angka
 * dari perusahaan penjual jasa CV atau ATS tidak dipakai sama sekali, seberapa
 * pun enak bunyinya, karena mereka punya kepentingan atas angkanya sendiri.
 *
 * Keterangan yang dibaca manusia ada di kamus i18n, bukan di sini - judulnya
 * perlu diterjemahkan, alamatnya tidak.
 */

export const RUJUKAN = {
  /**
   * Harvard Business School & Accenture, "Hidden Workers: Untapped Talent"
   * (September 2021). Survei 8.000+ pencari kerja dan 2.250+ eksekutif di AS,
   * Inggris, dan Jerman.
   *
   * Dipakai untuk angka >90% dan 88%. Perhatikan batasnya: dokumen ini bicara
   * soal kecocokan **kriteria** dengan iklan lowongan, BUKAN soal CV yang
   * gagal dibaca karena tata letaknya. Jangan dipakai untuk klaim format.
   */
  harvard: {
    pdf: "https://www.hbs.edu/ris/Publication%20Files/hiddenworkers09032021_Fuller_white_paper_33a2047f-41dd-47b1-9a8d-bd08cf3bfa94.pdf",
    halaman:
      "https://www.hbs.edu/managing-the-future-of-work/research/hidden-workers-untapped-talent",
  },

  /** Career Center, University of Southern California - "Resume Format Guidelines". */
  usc: "https://careers.usc.edu/resources/resume-format-guidelines/",

  /** Polar Careers, Ohio Northern University - panduan menyesuaikan CV untuk ATS. */
  onu: "https://my.onu.edu/sites/default/files/applicant_tracking_system_resume_guide.pdf",
} as const;
