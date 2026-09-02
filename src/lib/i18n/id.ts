/**
 * Kamus bahasa Indonesia - sekaligus sumber bentuk (tipe) seluruh kamus.
 *
 * Kamus bahasa Inggris di berkas `en.ts` diketik sebagai `Dictionary`,
 * sehingga TypeScript akan menolak build bila ada kunci yang terlewat
 * diterjemahkan atau salah ketik. Itu jauh lebih andal daripada mengandalkan
 * pemeriksaan manual pada ratusan kalimat.
 */

/*
 * Sengaja TIDAK memakai `as const`. Dengan `as const`, setiap nilai menjadi
 * tipe literal ("Simpan" dan bukan string), sehingga kamus bahasa Inggris
 * akan ditolak karena isinya berbeda. Tanpa itu, tipenya melebar menjadi
 * string dan yang diperiksa TypeScript adalah kelengkapan kuncinya - persis
 * yang dibutuhkan di sini.
 */
export const id = {
  /* ---------------------------------------------------------------- umum */
  common: {
    appName: "CV ATS Builder",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    close: "Tutup",
    back: "Kembali",
    next: "Lanjut",
    loading: "Memuat...",
    saving: "Menyimpan...",
    saved: "Tersimpan",
    error: "Terjadi kesalahan",
    tryAgain: "Coba lagi",
    optional: "opsional",
    recommended: "disarankan",
    yes: "Ya",
    no: "Tidak",
    of: "dari",
    page: "Halaman",
    pages: "halaman",
    example: "Contoh",
  },

  /*
   * ----------------------------------------------------------- form CV -----
   * Setiap field punya tiga teks: label, hint (menjawab "diisi apa"), dan ph
   * (contoh pengisian yang tampil abu-abu di dalam kotaknya).
   *
   * Contoh pengisian sengaja ditulis lengkap dan realistis, bukan sekadar
   * "masukkan nama". Pengguna yang baru pertama menyusun CV lebih banyak
   * belajar dari melihat satu contoh yang benar daripada dari membaca
   * penjelasan panjang - dan contoh yang tampil abu-abu tidak pernah ikut
   * terkirim sebagai isi CV.
   */
  form: {
    personalTitle: "Data Pribadi",
    personalHint:
      "Bagian paling atas CV. Nama, kontak, dan tautan profil - inilah yang pertama dicari pengurai ATS.",

    fullName: "Nama Lengkap",
    fullNameHint: "Tanpa gelar akademik di depan. Gelar boleh ditulis di belakang.",
    fullNamePh: "Budi Santoso",
    headline: "Jabatan / Posisi yang Dituju",
    headlineHint: "Samakan dengan judul lowongan yang Anda lamar.",
    headlinePh: "Frontend Developer",
    email: "Email",
    emailHint: "Gunakan email profesional yang aktif.",
    emailPh: "budi.santoso@email.com",
    phone: "Nomor Telepon",
    phoneHint: "Sertakan kode negara agar terbaca sebagai nomor internasional.",
    phonePh: "+62 812-3456-7890",
    city: "Kota",
    cityPh: "Bontang",
    province: "Provinsi",
    provincePh: "Kalimantan Timur",
    country: "Negara",
    countryPh: "Indonesia",
    linkedin: "LinkedIn",
    linkedinPh: "linkedin.com/in/budisantoso",
    portfolio: "Portofolio / Website",
    portfolioPh: "budisantoso.dev",
    github: "GitHub",
    githubPh: "github.com/budisantoso",
    showPhoto: "Tampilkan pas foto",
    showPhotoHint:
      "Sebaiknya dimatikan. Sebagian besar pengurai ATS tidak membaca gambar, dan tata letak di sekitar foto sering membuat teks terbaca berantakan. Aktifkan hanya bila lowongan memintanya.",
    photoUrl: "URL Foto",
    photoUrlHint: "Tempelkan tautan gambar. Ukuran ideal 3x4 dengan latar polos.",
    photoUrlPh: "https://drive.google.com/uc?id=1AbCdEfGh",

    summary: "Ringkasan Profil",
    summaryHint:
      "Rumus singkat: peran + lama pengalaman + keahlian utama + satu pencapaian berangka. Hindari kata ganti orang pertama.",
    summaryPh:
      "Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web berskala produksi menggunakan React dan TypeScript. Berhasil menurunkan waktu muat halaman utama sebesar 45% dan memimpin tim beranggotakan 4 orang dalam migrasi ke arsitektur komponen bersama.",
    summaryWords: "kata",
    summaryIdeal: "(ideal)",
    summaryIdealRange: "(ideal: 30-120 kata)",

    experienceLabel: "Pengalaman",
    experienceEmpty:
      "Belum ada pengalaman kerja. Jika Anda fresh graduate, isi section Proyek dan Organisasi sebagai gantinya - keduanya sama-sama dihitung sebagai bukti kemampuan.",
    experienceAdd: "Tambah Pengalaman Kerja",
    jobTitle: "Jabatan",
    jobTitleHint: "Sesuai surat pengangkatan.",
    jobTitlePh: "Frontend Developer",
    company: "Nama Perusahaan",
    companyPh: "PT Digital Nusantara",
    workCityPh: "Jakarta Selatan",
    employmentType: "Status Kerja",
    employmentUnset: "Tidak disebutkan",
    stillWorking: "Masih bekerja di sini",

    educationLabel: "Pendidikan",
    educationAdd: "Tambah Pendidikan",
    degree: "Jenjang / Gelar",
    degreeHint: "Contoh: S1, D3, SMA.",
    degreePh: "Sarjana Komputer (S.Kom)",
    fieldOfStudy: "Program Studi",
    fieldOfStudyPh: "Teknik Informatika",
    institution: "Institusi",
    institutionPh: "Universitas Mulawarman",
    eduCityPh: "Samarinda",
    stillStudying: "Masih menempuh pendidikan",
    gpa: "IPK",
    gpaHint: "Cantumkan bila 3.00 ke atas. Kosongkan bila di bawah itu.",
    gpaPh: "3.62",
    maxGpa: "Skala IPK",
    maxGpaPh: "4.00",
    graduated: "Lulus",

    skillAdd: "Tambah Keahlian",
    skillNamePh: "React",
    skillCategory: "Kategori keahlian",
    skillRemove: "Hapus keahlian",
    skillCalloutLead: "Tulis nama keahlian apa adanya -",
    skillCalloutGood: "JavaScript",
    skillCalloutMid: ", bukan",
    skillCalloutBad: "JavaScript (mahir)",
    skillCalloutTail:
      ". Sistem ATS mencocokkan kata kunci secara harfiah, sehingga tambahan dalam kurung justru menurunkan kecocokan.",

    projectLabel: "Proyek",
    projectAdd: "Tambah Proyek",
    projectName: "Nama Proyek",
    projectNamePh: "SIMAK PWA",
    projectRole: "Peran Anda",
    projectRolePh: "Pengembang Utama",
    projectUrl: "Tautan",
    projectUrlHint: "Repositori, demo, atau publikasi proyek.",
    projectUrlPh: "github.com/budisantoso/simak-pwa",

    certificationLabel: "Sertifikat",
    certificationAdd: "Tambah Sertifikat",
    certName: "Nama Sertifikat",
    certNamePh: "Meta Front-End Developer Professional Certificate",
    certIssuer: "Penerbit",
    certIssuerPh: "Meta / Coursera",
    certIssueDate: "Tanggal Terbit",
    certExpiry: "Berlaku Sampai",
    certExpiryHint: "Kosongkan bila berlaku selamanya.",
    certCredentialId: "ID Kredensial",
    certCredentialHint: "Memudahkan perekrut memverifikasi.",
    certCredentialPh: "ABCD1234EFGH",
    certVerifyUrl: "Tautan Verifikasi",
    certVerifyPh: "coursera.org/verify/ABCD1234EFGH",

    organizationLabel: "Organisasi",
    organizationAdd: "Tambah Organisasi",
    orgName: "Nama Organisasi",
    orgNamePh: "Himpunan Mahasiswa Teknik Informatika",
    orgRole: "Jabatan",
    orgRolePh: "Ketua Divisi Riset dan Teknologi",
    stillActive: "Masih aktif",

    awardLabel: "Penghargaan",
    awardAdd: "Tambah Penghargaan",
    awardTitle: "Nama Penghargaan",
    awardTitleHint: "Sebutkan peringkat dan tingkat kompetisinya.",
    awardTitlePh: "Juara 2 Hackathon Kaltim Digital",
    awardIssuer: "Pemberi Penghargaan",
    awardIssuerPh: "Dinas Kominfo Provinsi Kalimantan Timur",
    awardDate: "Tanggal",
    awardDescription: "Keterangan Singkat",
    awardDescriptionPh:
      "Membangun purwarupa aplikasi pelaporan infrastruktur dalam 48 jam bersama tim beranggotakan 3 orang.",

    languageAdd: "Tambah Bahasa",
    languageNamePh: "Bahasa Inggris",
    languageLevel: "Tingkat penguasaan",
    languageRemove: "Hapus bahasa",

    publicationLabel: "Publikasi",
    publicationAdd: "Tambah Publikasi",
    pubTitle: "Judul",
    pubTitlePh: "Penerapan Progressive Web App pada Sistem Informasi Akademik",
    pubPublisher: "Penerbit / Jurnal",
    pubPublisherPh: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
    pubDate: "Tanggal Terbit",
    pubDoiPh: "10.30872/jim.v16i2.1234",
    pubUrl: "Tautan",
    pubUrlPh: "jurnal.unmul.ac.id/index.php/JIM/article/view/1234",

    customLabel: "Section",
    customAddSection: "Tambah Section Baru",
    customAddEntry: "Tambah Entri",
    customRemoveEntry: "Hapus entri ini",
    customSectionTitle: "Judul Section",
    customSectionTitleHint:
      "Gunakan teks biasa tanpa emoji agar tetap terbaca pengurai.",
    customSectionTitlePh: "Pelatihan dan Workshop",
    customEntryTitle: "Judul",
    customEntryTitlePh: "Pelatihan Keamanan Siber Dasar",
    customEntrySubtitle: "Keterangan",
    customEntrySubtitlePh: "Badan Siber dan Sandi Negara - 24 jam pelajaran",

    startDate: "Mulai",
    endDate: "Selesai",
    bulletsLabel: "Poin Pencapaian",
    bulletsHint:
      "Awali dengan kata kerja aksi dan sertakan angka. Ini bagian yang paling menentukan skor kualitas konten.",
    bulletsAdd: "Tambah poin",
    bulletsRemove: "Hapus poin",
    bulletPh1:
      "Contoh: Mengembangkan ulang halaman checkout sehingga konversi naik dari 2,1% ke 3,4% dalam 6 bulan.",
    bulletPh2:
      "Contoh: Memimpin tim 4 orang dalam migrasi 60 komponen, memangkas waktu pengembangan fitur 30%.",
    bulletPh3:
      "Contoh: Mengotomasi proses deployment sehingga waktu rilis turun dari 40 menit menjadi 6 menit.",

    entryMoveUp: "Pindah ke atas",
    entryMoveDown: "Pindah ke bawah",
    entryRemove: "Hapus entri",
    entryRemoveConfirm: "Hapus entri ini?",
    entryRemoveYes: "Ya, hapus",
    sectionMoveUp: "Naikkan urutan section",
    sectionMoveDown: "Turunkan urutan section",
  },

  /* ------------------------------------------------------------ mode tamu */
  guest: {
    metaTitle: "Buat CV tanpa akun",
    metaDescription:
      "Susun CV ramah ATS lengkap tanpa mendaftar. Datanya tersimpan di peramban Anda sendiri, dan dapat diunduh sebagai PDF, Word, teks, atau JSON.",
    ctaTry: "Coba tanpa akun",
    ctaTryHint: "Tanpa daftar, tanpa email",
    loading: "Menyiapkan editor...",

    bannerTitle: "CV ini hanya tersimpan di peramban ini.",
    bannerBody:
      "Tidak ada yang dikirim ke server, jadi tidak perlu akun. Konsekuensinya: membuka dari perangkat lain, membersihkan data situs, atau memakai mode penyamaran berarti CV ini hilang. Unduh berkasnya, atau pindahkan ke akun bila ingin disimpan permanen.",
    savedLocal: "Tersimpan di peramban ini",
    saveFailed:
      "Peramban menolak menyimpan. CV masih ada di layar - segera unduh berkasnya.",
    moveToAccount: "Pindahkan ke akun",
    moveHint:
      "Anda akan diminta masuk atau mendaftar, lalu CV ini dapat diimpor ke akun tersebut.",

    importTitle: "Ada CV yang Anda buat tanpa akun",
    importBody:
      "CV itu masih tersimpan di peramban ini. Impor sekarang agar tersimpan permanen di akun Anda dan dapat dibuka dari perangkat mana saja.",
    importButton: "Impor ke akun saya",
    importDismiss: "Nanti saja",
    importDone: "CV berhasil diimpor ke akun Anda.",
    importFailed: "CV gagal diimpor. Coba lagi.",
  },

  /* ------------------------------------------------------------- editor CV */
  editor: {
    back: "Dashboard",
    backAria: "Kembali ke dashboard",
    titleAria: "Judul CV",
    actionsMenu: "Menu aksi",
    panelNav: "Panel editor",
    actionSampleLabel: "Isi Data Contoh",
    actionSampleHint: "Ganti seluruh isi dengan contoh lengkap",
    actionAppearanceLabel: "Tampilan CV",
    actionAppearanceHint: "Template, ukuran kertas, jenis huruf, bahasa",
    actionPdfLabel: "Unduh PDF",
    actionPdfHint: "Untuk dikirim ke perusahaan",
    actionWordLabel: "Unduh Word",
    actionWordHint: "Bila sistem lamaran meminta .docx",
    actionTxtLabel: "Unduh Teks",
    actionTxtHint: "Untuk ditempel ke formulir daring",
    actionJsonLabel: "Unduh JSON",
    actionJsonHint: "Cadangan data, bisa diimpor lagi",
    btnSample: "Isi Data Contoh",
    btnAppearance: "Tampilan",
    btnPdf: "PDF",
    btnWord: "Word",
    btnText: "Teks",
    btnJson: "JSON",
    btnTextTitle: "Teks polos untuk ditempel ke formulir lamaran",
    btnJsonTitle: "Cadangan data agar dapat diimpor kembali",
    saveNotYet: "Belum tersimpan",
    saveAuto: "Tersimpan otomatis",
    untitled: "CV Tanpa Judul",
    renameLabel: "Judul CV",
    appearance: "Tampilan",
    fillSample: "Isi contoh",
    fillSampleConfirm:
      "Seluruh isi CV ini akan diganti dengan data contoh lengkap. Berguna untuk melihat bentuk CV jadi dan tahu setiap field muncul di bagian mana - tetapi data yang sudah Anda ketik akan hilang.",
    fillSampleYes: "Ya, isi dengan contoh",
    matchJob: "Cocokkan dengan lowongan",
    moreActions: "Tindakan lain",
    print: "Cetak / PDF",
    downloadDocx: "Unduh Word (.docx)",
    downloadTxt: "Unduh teks (.txt)",
    downloadJson: "Cadangkan JSON",
    tabPreview: "Pratinjau CV",
    tabScore: "Skor ATS",
    paneForm: "Isi",
    panePreview: "Pratinjau",
    paneScore: "Skor",
    saveIdle: "Belum ada perubahan",
    saveDirty: "Ada perubahan belum tersimpan",
    saveSaving: "Menyimpan...",
    saveSaved: "Tersimpan",
    saveError: "Gagal menyimpan",
    saveFailedTitle: "Gagal menyimpan",
    saveFailedGeneric: "Perubahan gagal disimpan.",
    saveFailedOffline:
      "Tidak dapat terhubung ke server. Perubahan Anda masih ada di layar - jangan tutup halaman ini sampai koneksi pulih.",
    sectionOrderHint:
      "Bagian yang belum diisi tidak akan muncul di CV, jadi Anda boleh melewatinya. Gunakan tombol panah di sisi kanan judul untuk mengubah urutan tampilnya.",
  },

  /* ------------------------------------------- panel pengaturan tampilan CV */
  appearance: {
    template: "Template",
    templateWithPhoto: "Dengan foto",
    templateWithoutPhoto: "Tanpa foto",
    font: "Jenis Huruf",
    fontHint: "Semua pilihan aman untuk ATS.",
    fontSize: "Ukuran Huruf",
    lineHeight: "Jarak Baris",
    headingLanguage: "Bahasa Judul Bagian",
    headingLanguageHint:
      "Bahasa untuk judul bagian di dalam CV - terpisah dari bahasa antarmuka aplikasi.",
    accentColor: "Warna Aksen",
    margin: "Margin Halaman",
    marginY: "Margin Atas-Bawah",
    marginX: "Margin Kiri-Kanan",
    marginFollowTemplate: "ikut template",
    marginReset: "Kembalikan ke bawaan template",
    marginHint:
      "Margin atas dan bawah selalu sama besar, dan berlaku pada setiap halaman - bukan hanya halaman pertama. Di bawah 10 mm sebagian pencetak akan memotong tepinya.",
    paperSize: "Ukuran Kertas",
    photoUnsupported:
      "Template ini tidak menampilkan foto. Pilih template Berfoto bila lowongan Anda memintanya.",
  },

  /* ------------------------------------------------------- halaman alur */
  flow: {
    metaTitle: "Alur dan Arsitektur",
    metaDescription:
      "Diagram alur penggunaan, arsitektur, alur data, dan workflow pengembangan aplikasi CV ATS Builder - tersedia juga sebagai berkas gambar SVG dan PNG.",
    title: "Alur dan arsitektur",
    subtitle:
      "Empat diagram: bagaimana pengguna memakainya, bagaimana datanya mengalir, dan bagaimana perubahan kode sampai ke production. Diagram di halaman ini dan berkas gambarnya dibangkitkan dari satu sumber data yang sama, sehingga keduanya tidak mungkin bercerita berbeda.",
    downloadTitle: "Unduh sebagai gambar",
    downloadNote:
      "Untuk disisipkan ke laporan atau presentasi. SVG tetap tajam pada perbesaran berapa pun; PNG lebih andal ditangani pengolah kata.",
    downloadSvg: "Unduh SVG",
    downloadPng: "Unduh PNG",
    legendTitle: "Keterangan bentuk",
    legendNote:
      "Jenis setiap kotak ditulis di dalam kotaknya sendiri, bukan hanya dibedakan lewat warna - supaya diagram ini tetap terbaca saat dicetak hitam-putih maupun saat dibacakan pembaca layar.",
  },

  /* -------------------------------------------------------- halaman depan */
  home: {
    skipToContent: "Lompat ke konten utama",
    heroBadge: "Gratis - tanpa watermark - data tersimpan",
    heroTitleLine1: "Isi field-nya.",
    heroTitleLine2: "CV yang terbaca mesin",
    heroTitleLine3: "tersusun sendiri.",
    heroBody:
      "Banyak perusahaan menyaring lamaran lewat sistem yang membaca CV secara otomatis. Berkas dengan tata letak rumit - dua kolom, tabel, teks di dalam gambar - kerap terbaca berantakan, sehingga kualifikasi yang sebenarnya Anda miliki tidak terdeteksi. Aplikasi ini menyusun CV Anda ke dalam struktur yang aman dibaca mesin, lalu menilai dan menunjukkan persis apa yang perlu diperbaiki.",
    heroCtaNew: "Masuk atau Daftar Akun",
    heroCtaDashboard: "Lanjutkan ke Dashboard",
    heroCtaCompare: "Bandingkan CV yang sudah ada",
    statSections: "bagian CV",
    statDimensions: "dimensi penilaian",
    statTemplates: "template ATS",
    statFormats: "format unduhan",
    heroCaption: "Contoh hasil - template Klasik",
    heroBadgeScore: "Skor ATS",
    heroBadgeGrade: "Nilai A",
    heroBadgeSaved: "Tersimpan otomatis",

    pathsTitle: "Dua cara memakainya",
    pathsBody:
      "Mulai dari nol, atau mulai dari CV yang sudah Anda punya. Keduanya memakai mesin penilaian yang sama, jadi skornya dapat dibandingkan satu sama lain.",
    pathBuildTitle: "Susun CV baru",
    pathBuildBody:
      "Isi field terstruktur, lihat hasilnya seketika di pratinjau seukuran kertas sebenarnya, perbaiki lewat skor ATS, lalu unduh sebagai PDF, Word, teks, atau JSON.",
    pathBuildCta: "Masuk atau Daftar Akun",
    pathCompareTitle: "Bandingkan atau pindai CV",
    pathCompareBody:
      "Unggah satu berkas untuk memindainya, atau sampai lima berkas untuk membandingkannya. Setiap CV memperoleh skor, daftar kelebihan, dan daftar kekurangan beserta cara memperbaikinya - lalu disebutkan mana yang paling siap dikirim. Berkasnya diproses di peramban Anda, tidak diunggah ke mana pun.",
    pathCompareCta: "Bandingkan sekarang",

    stepsTitle: "Empat langkah, selesai",
    stepsBody:
      "Anda hanya perlu mengisi. Urusan tata letak, format tanggal, dan struktur yang terbaca mesin sudah diurus aplikasi.",
    step1Title: "Isi field satu per satu",
    step1Body:
      "Tidak ada halaman kosong yang bikin bingung. Setiap data punya kolomnya sendiri - jabatan, perusahaan, periode - lengkap dengan contoh pengisian di dalam kotaknya.",
    step2Title: "Lihat hasilnya seketika",
    step2Body:
      "CV di sebelah kanan berubah saat Anda mengetik, dan dapat dilihat terpotong per halaman seperti di pengolah kata. Field yang sedang diisi ikut disorot, jadi Anda tahu persis data itu muncul di bagian mana.",
    step3Title: "Perbaiki lewat skor ATS",
    step3Body:
      "Aplikasi menilai CV Anda dari lima sisi dan menyebutkan apa yang kurang beserta cara memperbaikinya - bukan sekadar memberi angka.",
    step4Title: "Unduh dan lamar",
    step4Body:
      "PDF dan Word untuk dikirim ke perusahaan. Datanya tetap tersimpan, jadi CV berikutnya tinggal menduplikasi dan menyesuaikan.",

    featuresTitle: "Yang membedakannya dari templat Word",
    featuresBody:
      "Templat hanya memberi tampilan. Aplikasi ini menjaga strukturnya tetap terbaca mesin, menilai hasilnya, dan menyimpan datanya.",
    feature1Title: "Field terstruktur, bukan halaman kosong",
    feature1Body:
      "11 bagian CV dengan field, petunjuk pengisian, dan contoh nyata di setiap kolom. Tata letaknya diurus aplikasi.",
    feature2Title: "Pratinjau seukuran kertas sebenarnya",
    feature2Body:
      "Pilih A4, Letter, Legal, atau F4 - lalu lihat CV Anda tersambung panjang atau terpotong per halaman, persis seperti hasil cetaknya nanti.",
    feature3Title: "Tersimpan otomatis",
    feature3Body:
      "Perubahan masuk ke basis data kurang dari satu detik setelah Anda berhenti mengetik. Tutup peramban, buka lagi bulan depan, lanjutkan dari titik terakhir.",
    feature4Title: "Skor ATS beserta alasannya",
    feature4Body:
      "Lima dimensi berbobot dengan saran perbaikan yang bisa diklik untuk melompat langsung ke field bermasalah.",
    feature5Title: "Pencocokan dengan lowongan",
    feature5Body:
      "Tempel iklan lowongan yang Anda incar, lalu lihat kata kunci penting mana yang belum muncul di CV Anda.",
    feature6Title: "Data Anda milik Anda",
    feature6Body:
      "Unduh seluruh isi CV sebagai berkas JSON kapan saja, impor kembali kapan saja, atau hapus akun beserta seluruh datanya.",

    templatesTitle: "Sepuluh template, satu struktur",
    templatesBody:
      "Seluruhnya satu kolom, tanpa tabel, dan memakai judul bagian baku - jadi tidak ada template yang lebih berisiko terbaca kacau dibanding yang lain. Yang berbeda hanya tipografi, jarak, garis, dan penempatan foto. Berganti template tidak mengubah data Anda sedikit pun.",
    templatesWithoutPhoto: "Tanpa foto",
    templatesWithPhoto: "Dengan foto",
    templatesPhotoNote:
      "Dua template berfoto disediakan karena sebagian lowongan di Indonesia masih memintanya. Bila lowongan Anda tidak memintanya, pilih yang tanpa foto - pengurai ATS tidak dapat membaca gambar.",

    faqTitle: "Pertanyaan yang sering muncul",
    faqBody: "Termasuk hal-hal yang biasanya tidak diceritakan aplikasi sejenis.",

    ctaTitle: "Buat satu kali, pakai berkali-kali",
    ctaBody:
      "Data Anda tersimpan di akun. Untuk lowongan berikutnya, duplikasi CV yang sudah ada lalu sesuaikan seperlunya - tidak perlu mulai dari halaman kosong lagi.",
    ctaButton: "Masuk atau Daftar Akun",
    ctaButtonSignedIn: "Buka Dashboard",
    ctaNote: "Tanpa biaya, tanpa watermark di CV Anda.",
  },

  /* Pertanyaan yang sering muncul. Disimpan sebagai larik supaya urutan dan
     jumlahnya identik di kedua bahasa - TypeScript hanya memeriksa kunci,
     bukan panjang larik, jadi kesamaan ini dijaga saat menyunting. */
  faq: [
    {
      q: "Apa itu ATS, dan kenapa saya perlu peduli?",
      a: "ATS (Applicant Tracking System) adalah perangkat lunak yang dipakai banyak perusahaan untuk menerima dan menyaring lamaran. Sebelum dibaca manusia, berkas CV diurai lebih dulu oleh mesin untuk diambil datanya: nama, kontak, pengalaman, keahlian. CV dengan tata letak rumit - dua kolom, tabel, teks di dalam gambar - sering terurai berantakan, sehingga kualifikasi yang sebenarnya Anda miliki tidak terbaca sistem.",
    },
    {
      q: "Apakah CV dari aplikasi ini dijamin lolos ATS?",
      a: "Tidak ada aplikasi mana pun yang bisa menjanjikan itu, dan aplikasi ini tidak menjanjikannya. Setiap perusahaan memakai produk ATS berbeda dengan pengurai yang tidak dipublikasikan. Yang dilakukan aplikasi ini adalah memastikan CV Anda memenuhi kaidah yang berlaku umum: satu kolom, tanpa tabel, judul bagian baku, format tanggal seragam, dan teks yang benar-benar berupa teks. Skor yang ditampilkan berarti memenuhi kaidah yang diperiksa, bukan jaminan diterima.",
    },
    {
      q: "Sebaiknya CV saya berapa halaman?",
      a: "Satu halaman. Itu panjang yang tepat untuk hampir semua pelamar, termasuk yang sudah berpengalaman - perekrut memindai satu CV dalam hitungan detik, dan apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah terbaca. Dua halaman baru sepadan bila Anda punya lebih dari lima tahun pengalaman yang seluruhnya relevan dengan lowongan yang dituju. Bila CV Anda terlanjur panjang, yang perlu dipangkas isinya, bukan ukuran hurufnya.",
    },
    {
      q: "Ukuran kertas apa yang sebaiknya dipakai?",
      a: "A4. Itu ukuran standar di Indonesia dan hampir seluruh dunia, dan itulah bawaan aplikasi ini. Letter hanya perlu dipakai bila Anda melamar ke perusahaan di Amerika Serikat atau Kanada; Legal dan F4 hanya bila instansi yang dituju memintanya secara khusus.",
    },
    {
      q: "Apakah gratis? Ada biaya tersembunyi?",
      a: "Gratis sepenuhnya. Tidak ada versi berbayar, tidak ada batas jumlah CV, tidak ada watermark pada CV yang Anda unduh, dan tidak ada permintaan data kartu.",
    },
    {
      q: "Apakah CV saya akan ada tulisan atau logo aplikasi ini?",
      a: "Tidak. CV yang Anda unduh murni berisi data Anda sendiri - tanpa logo, tanpa watermark, tanpa nama aplikasi maupun pembuatnya. CV adalah dokumen milik Anda.",
    },
    {
      q: "Berkas CV yang saya unggah untuk dibandingkan, disimpan di server?",
      a: "Tidak, dan memang tidak pernah dikirim ke server. Berkasnya dibaca dan dinilai di dalam peramban Anda sendiri; menutup halaman itu menghapus semuanya. Karena itu pula fitur pembanding dapat dipakai tanpa membuat akun.",
    },
    {
      q: "Kalau saya tutup peramban, data saya hilang?",
      a: "Tidak - untuk CV yang Anda susun di dalam aplikasi ini. Setiap perubahan tersimpan otomatis ke basis data kurang dari satu detik setelah Anda berhenti mengetik. Masuk kembali kapan saja dari perangkat mana saja, CV Anda tetap ada. Anda juga bisa mengunduh cadangan dalam bentuk berkas JSON.",
    },
    {
      q: "Kenapa sebaiknya foto tidak dipasang di CV?",
      a: "Sebagian besar pengurai ATS tidak dapat membaca gambar, dan tata letak di sekitar foto kerap membuat urutan teks terbaca kacau. Di banyak negara, foto juga dihindari untuk mengurangi bias dalam seleksi. Aplikasi ini tetap menyediakan dua template berfoto - karena sebagian lowongan di Indonesia masih memintanya - tetapi memberi peringatan saat diaktifkan.",
    },
    {
      q: "Bisakah saya punya lebih dari satu CV?",
      a: "Bisa, dan memang disarankan. CV sebaiknya disesuaikan untuk setiap lowongan. Gunakan tombol duplikat, lalu ubah ringkasan dan urutan keahliannya agar cocok dengan lowongan yang dituju.",
    },
  ],

  /* ------------------------------------------------------- pembanding CV */
  compare: {
    metaTitle: "Bandingkan & Pindai CV",
    metaDescription:
      "Unggah beberapa CV sekaligus, lihat kelebihan dan kekurangan masing-masing, lalu ketahui mana yang paling siap dikirim. Berkas diproses di peramban Anda dan tidak pernah diunggah ke server.",
    title: "Bandingkan CV, atau pindai satu saja",
    subtitle:
      "Unggah satu berkas untuk memindainya, atau dua sampai lima berkas untuk membandingkannya. Setiap CV memperoleh skor, daftar kelebihan, daftar kekurangan beserta cara memperbaikinya - dan pada akhirnya disebutkan mana yang paling siap dikirim.",
    privacyTitle: "Berkas Anda tidak diunggah ke mana pun.",
    privacyBody:
      "Seluruh pembacaan dan penilaian berjalan di dalam peramban Anda sendiri. Tidak ada berkas yang dikirim ke server aplikasi ini maupun ke layanan lain, dan tidak ada yang disimpan. Menutup halaman ini menghapus semuanya.",
    dropTitle: "Jatuhkan berkas CV di sini",
    dropSubtitle: "atau klik untuk memilih dari perangkat Anda",
    dropFormats: "PDF, DOCX, atau TXT - maksimal 5 berkas, masing-masing 8 MB",
    chooseFiles: "Pilih Berkas",
    fileRemove: "Keluarkan berkas ini",
    tooMany: "Maksimal 5 berkas sekaligus.",
    jobToggleShow: "Tambahkan iklan lowongan (opsional)",
    jobToggleHide: "Sembunyikan iklan lowongan",
    jobHint:
      "Bila diisi, setiap CV ikut dinilai kecocokan kata kuncinya terhadap lowongan ini - dan itulah dimensi yang paling menentukan CV mana yang sebaiknya Anda kirim untuk lowongan tersebut.",
    analyze: "Analisis Sekarang",
    analyzing: "Menganalisis...",
    reset: "Mulai Ulang",
    readingFile: "Membaca",
    resultSingleTitle: "Hasil pindaian",
    resultCompareTitle: "Hasil perbandingan",
    winnerLabel: "Paling siap dikirim",
    rankLabel: "Peringkat",
    reasonsTitle: "Mengapa unggul",
    perDimensionTitle: "Perbandingan per dimensi",
    dimensionColumn: "Dimensi",
    bestColumn: "Tertinggi",
    worstColumn: "Terendah",
    spreadColumn: "Selisih",
    strengthsTitle: "Kelebihan",
    weaknessesTitle: "Kekurangan dan cara memperbaikinya",
    noWeakness: "Tidak ada kekurangan yang terdeteksi pada aturan yang diperiksa.",
    noStrength: "Belum ada kelebihan yang dapat dicatat.",
    statPages: "Halaman",
    statWords: "Kata",
    statBullets: "Poin",
    statColumns: "Kolom",
    ctaTitle: "Ingin memperbaikinya sekarang?",
    ctaBody:
      "Susun ulang CV Anda di editor aplikasi ini: setiap field punya contoh pengisian, skornya berubah seketika saat Anda mengetik, dan hasilnya dapat diunduh sebagai PDF, Word, atau teks.",
    ctaButton: "Buat CV Gratis",
    errorTitle: "Berkas gagal dibaca",
    limitsNote:
      "Catatan jujur soal batasannya: penilaian ini membaca teks, bukan memahami maknanya. Ia dapat memastikan CV Anda terbaca mesin, tetapi tidak dapat menilai apakah pengalaman Anda cocok untuk sebuah jabatan. Keputusan itu tetap milik Anda.",
  },

  /* ------------------------------------------------------- panel skor ATS */
  ats: {
    severityError: "Harus diperbaiki",
    severityWarning: "Sebaiknya diperbaiki",
    severityInfo: "Saran penyempurnaan",
    noCritical: "Tidak ada masalah kritis",
    mustFixCount: "hal wajib diperbaiki",
    suggestionCount: "saran perbaikan",
    statPages: "Halaman",
    statWords: "Jumlah kata",
    statActionVerbs: "Poin berkata kerja",
    statQuantified: "Poin berangka",
    breakdownTitle: "Rincian penilaian",
    breakdownHint: "Skor akhir adalah rata-rata berbobot dari dimensi berikut.",
    weight: "bobot",
    notScored: "belum dinilai",
    keywordsTitle: "Kata kunci dari lowongan",
    keywordsMatchSuffix: "cocok",
    keywordsMissing: "Belum ada di CV Anda",
    keywordsMatched: "Sudah ada",
    keywordsWarning:
      "Masukkan hanya kata kunci yang benar-benar Anda kuasai. Menempelkan keahlian yang tidak dimiliki memang menaikkan skor di sini, tetapi akan terbongkar pada tahap wawancara.",
    noFindings:
      "Tidak ada temuan. CV Anda sudah memenuhi seluruh aturan yang diperiksa.",
    openField: "Buka field terkait",
    gradePrefix: "Nilai",
    jobTitle: "Cocokkan dengan lowongan",
    jobIntro:
      "Tempelkan teks iklan lowongan yang Anda incar. Kata kuncinya diambil otomatis lalu dibandingkan dengan isi CV Anda.",
    jobLabel: "Teks iklan lowongan",
    jobPlaceholder:
      "Tempelkan seluruh isi iklan lowongan di sini - termasuk bagian kualifikasi dan tanggung jawab. Semakin lengkap teksnya, semakin akurat kata kunci yang terdeteksi.",
    jobAnalyze: "Hitung kecocokan",
    jobAnalyzing: "Menghitung...",
    jobClear: "Kosongkan",
    jobEmpty: "Teks lowongan belum ditempelkan.",
    pageTitle: "Analisis ATS",
    pageSubtitle:
      "Tempelkan iklan lowongan untuk melihat kata kunci yang belum ada di CV Anda.",
    jobDescTitle: "Deskripsi Lowongan",
    jobDescHint:
      "Salin seluruh teks iklan lowongan - termasuk bagian kualifikasi dan tanggung jawab - lalu tempel di bawah ini. Kata kunci akan diekstraksi secara otomatis.",
    wordsAnalyzed: "kata dianalisis.",
    saveToHistory: "Simpan Hasil ke Riwayat",
    historyTitle: "Riwayat Penilaian",
    historyEmpty:
      "Belum ada riwayat. Tekan tombol Simpan Hasil ke Riwayat untuk mencatat skor saat ini, lalu perbaiki CV Anda dan simpan lagi untuk melihat perkembangannya.",
    historyBest: "Skor tertinggi:",
    historySaved: "Hasil penilaian tersimpan ke riwayat.",
    historySaveFailed: "Gagal menyimpan hasil penilaian.",
    historyOffline: "Tidak dapat terhubung ke server.",
    backToEditor: "Kembali ke editor",
  },

  /* ----------------------------------------------------------- halaman cetak */
  print: {
    backToEditor: "Kembali ke editor",
    printNow: "Cetak / Simpan PDF",
    openPrintPage: "Buka halaman cetak",
    openPrintPageHint: "Bila dialog cetak tidak muncul sendiri",
  },

  /* --------------------------------------------------------- pratinjau CV */
  preview: {
    label: "Pratinjau",
    viewLabel: "Tampilan pratinjau",
    viewPaged: "Per halaman",
    viewContinuous: "Sambung",
    viewPagedHint: "Terpotong per halaman seperti di Word - memperlihatkan persis di mana halaman berganti.",
    viewContinuousHint: "Satu gulungan panjang tanpa potongan - enak untuk membaca cepat sambil menyunting.",
    zoomIn: "Perbesar",
    zoomOut: "Perkecil",
    zoomFit: "Paskan dengan lebar layar",
    pageLabel: "Halaman",
    paperSize: "Ukuran kertas",
    paperRecommended: "disarankan",
    lengthIdeal: "Panjang ideal.",
    lengthAcceptable: "Masih wajar bila pengalaman kerja Anda lebih dari lima tahun.",
    lengthTooLong: "Terlalu panjang. Perekrut umumnya hanya memindai halaman pertama.",
    onePageAdvice:
      "Satu halaman sudah cukup untuk hampir semua pelamar. Pangkas pengalaman yang tidak relevan dengan lowongan yang dituju, bukan mengecilkan hurufnya.",
  },

  /* -------------------------------------------------- pemilih tema/bahasa */
  prefs: {
    theme: "Tampilan",
    themeLight: "Terang",
    themeDark: "Gelap",
    themeToDark: "Ganti ke mode gelap",
    themeToLight: "Ganti ke mode terang",
    language: "Bahasa",
    languageToggleLabel: "Ganti bahasa antarmuka",
  },

  /* ------------------------------------------------------- navigasi publik */
  nav: {
    home: "Beranda",
    guide: "Panduan",
    about: "Tentang",
    flowNav: "Alur",
    compare: "Bandingkan CV",
    dashboard: "Dashboard",
    login: "Masuk",
    register: "Daftar Gratis",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    mainNav: "Utama",
    mobileNav: "Utama (ponsel)",
    breadcrumb: "Jejak navigasi",
    backHome: "Kembali ke beranda",
    backDashboard: "Kembali ke dashboard",
    homeAria: "beranda",
  },

  /* ------------------------------------------------------ navigasi aplikasi */
  app: {
    settings: "Pengaturan",
    signOut: "Keluar",
    user: "Pengguna",
  },

  /* ------------------------------------------------------------- dashboard */
  dashboard: {
    title: "CV Saya",
    subtitleEmpty:
      "Belum ada CV. Mulai dari contoh agar Anda langsung melihat bentuk jadinya.",
    subtitleCount: "CV tersimpan. Semua perubahan tersimpan otomatis.",
    importJson: "Impor JSON",
    startFromSample: "Mulai dari Contoh",
    createNew: "Buat CV Baru",
    startBlank: "Mulai dari kosong",
    emptyTitle: "Belum ada CV di akun ini",
    emptyBodyLead: "Saran: pilih",
    emptyBodyTail:
      ". CV akan terisi data contoh lengkap sehingga Anda bisa melihat setiap field muncul di bagian mana, lalu tinggal menimpanya dengan data Anda sendiri.",
    nameEmpty: "Nama belum diisi",
    changedAt: "Diubah",
    edit: "Edit CV",
    renameTitle: "Ganti nama",
    duplicateTitle: "Duplikat",
    deleteTitle: "Hapus",
    deleteConfirmLead: "Hapus",
    deleteConfirmTail:
      "? Seluruh isinya ikut terhapus dan tidak bisa dikembalikan.",
    deleteYes: "Ya, hapus",
    tipsLabel: "Tips:",
    tips:
      "untuk melamar posisi berbeda, tekan tombol duplikat lalu sesuaikan ringkasan dan urutan keahliannya. CV yang disesuaikan per lowongan mendapat skor kecocokan kata kunci yang jauh lebih tinggi.",
    errorGeneric: "Terjadi kesalahan. Silakan coba lagi.",
    errorOffline: "Tidak dapat terhubung ke server.",
    justNow: "baru saja",
    minutesAgo: "menit lalu",
    hoursAgo: "jam lalu",
    daysAgo: "hari lalu",
  },

  /* ------------------------------------------------------------ pengaturan */
  settings: {
    title: "Pengaturan Akun",
    savedCount: "CV tersimpan di akun ini.",
    identityTitle: "Identitas",
    emailLabel: "Email",
    emailLocked: "Alamat email tidak dapat diubah.",
    nameLabel: "Nama Tampilan",
    saveName: "Simpan Nama",
    passwordChangeTitle: "Ubah Kata Sandi",
    passwordCreateTitle: "Buat Kata Sandi",
    passwordGoogleNote:
      "Akun ini dibuat lewat Google dan belum memiliki kata sandi. Dengan membuatnya, Anda dapat masuk lewat email dan kata sandi juga.",
    passwordCurrent: "Kata Sandi Saat Ini",
    passwordNew: "Kata Sandi Baru",
    passwordHint: "Minimal 8 karakter.",
    passwordSave: "Simpan Kata Sandi",
    dangerTitle: "Hapus Akun",
    dangerBody:
      "Seluruh CV beserta isinya akan terhapus permanen dan tidak dapat dikembalikan. Sebaiknya unduh cadangan JSON setiap CV terlebih dahulu.",
    dangerStart: "Saya ingin menghapus akun",
    dangerConfirmLabel: "Ketik \"HAPUS AKUN\" untuk mengonfirmasi",
    dangerConfirmHint:
      "Langkah ini sengaja dibuat merepotkan agar tidak terjadi karena salah tekan.",
    dangerConfirmWord: "HAPUS AKUN",
    dangerButton: "Hapus akun saya",
    saveFailed: "Gagal menyimpan.",
    deleteFailed: "Gagal menghapus akun.",
    saved: "Perubahan tersimpan.",
    offline: "Tidak dapat terhubung ke server.",
  },

  /* --------------------------------------------------------- masuk/daftar */
  auth: {
    loginTitle: "Masuk",
    loginSubtitle: "Lanjutkan mengerjakan CV yang sudah tersimpan.",
    registerTitle: "Daftar",
    registerSubtitle:
      "Gratis. Data CV Anda tersimpan dan bisa diedit kapan saja.",
    google: "Masuk dengan Google",
    divider: "ATAU",
    nameLabel: "Nama Lengkap",
    namePh: "Budi Santoso",
    emailLabel: "Email",
    emailPh: "nama@email.com",
    passwordLabel: "Kata Sandi",
    passwordHint: "Minimal 8 karakter.",
    submitLogin: "Masuk",
    submitRegister: "Buat Akun",
    registeredNotice:
      "Akun berhasil dibuat. Silakan masuk dengan email dan kata sandi Anda.",
    signInFailed: "Gagal masuk. Silakan coba lagi.",
    invalidCredentials: "Email atau kata sandi salah.",
    registerFailed: "Pendaftaran gagal. Silakan coba lagi.",
    toRegister: "Belum punya akun?",
    toRegisterLink: "Daftar gratis",
    toLogin: "Sudah punya akun?",
    toLoginLink: "Masuk di sini",
  },

  /* ------------------------------------------------- halaman galat & kosong */
  legal: {
    updatedAt: "Terakhir diperbarui:",
    seeAlso: "Lihat juga",
    and: "dan",
  },

  errors: {
    errorTitle: "Ada yang tidak beres",
    errorBody:
      "Halaman ini gagal ditampilkan. CV yang sudah Anda simpan tetap aman - seluruh perubahan disimpan ke database begitu Anda berhenti mengetik.",
    errorCode: "Kode galat:",
    notFoundTitle: "Halaman tidak ditemukan",
    notFoundBody:
      "Alamat yang Anda buka tidak ada, atau CV yang dituju bukan milik akun yang sedang masuk.",
    retry: "Coba lagi",
    openDashboard: "Buka Dashboard",
    backHome: "Kembali ke Beranda",
    loading: "Memuat halaman...",
  },

  /* ------------------------------------------------------------------ footer */
  footer: {
    pagesHeading: "Halaman",
    authorHeading: "Pembuat",
    privacy: "Kebijakan Privasi",
    terms: "Ketentuan Layanan",
    registerFree: "Daftar Gratis",
    madeBy: "dibuat oleh",
    rights: "Seluruh hak cipta dilindungi.",
  },
};

export type Dictionary = typeof id;
