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
    optional: "boleh dikosongkan",
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
      "Bagian paling atas CV. Nama, kontak, dan tautan profil - inilah yang pertama dicari mesin penyaring lamaran.",

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
      "Sebaiknya dimatikan. Mesin penyaring lamaran tidak bisa melihat gambar, dan susunan di sekitar foto sering membuat tulisan terbaca acak-acakan. Nyalakan hanya kalau lowongannya memang minta foto.",
    photo: "Pas Foto",
    photoHint:
      "JPG, PNG, atau WebP. Foto dari kamera ponsel dikecilkan otomatis, jadi berkas besar tidak masalah - yang tersimpan paling banyak 1 MB. Latar polos memberi hasil terbaik.",
    photoChoose: "Pilih berkas foto",
    photoReplace: "Ganti foto",
    photoRemove: "Hapus foto",
    photoWorking: "Memproses...",
    photoZoom: "Perbesaran foto",
    photoZoomIn: "Perbesar",
    photoZoomOut: "Perkecil",
    photoReset: "Kembalikan seperti semula",
    photoDragHint:
      "Geser fotonya untuk memilih bagian yang tampil. Bingkainya tetap 3x4, jadi tata letak CV tidak ikut berubah.",
    photoZoomHint:
      "Perbesar dulu kalau ingin menggeser posisinya. Bingkainya tetap 3x4, jadi tata letak CV tidak ikut berubah.",
    photoLinked:
      "Foto ini masih berupa tautan gambar dari CV yang dibuat sebelumnya. Tautannya tetap berfungsi; pilih berkas bila ingin fotonya ikut tersimpan di dalam CV.",
    photoErrorType: "Berkas itu bukan gambar. Pilih berkas JPG, PNG, atau WebP.",
    photoErrorRead:
      "Gambarnya tidak dapat dibaca. Berkasnya mungkin rusak - coba berkas lain.",
    photoErrorSourceTooBig:
      "Berkasnya lebih dari 12 MB, dan sebesar itu bisa membuat peramban berhenti merespons sebelum sempat memprosesnya. Pilih foto biasa dari galeri - pas foto tidak pernah sebesar itu.",
    photoErrorTooBig:
      "Sudah dikecilkan semaksimal mungkin, tetapi hasilnya masih di atas 1 MB sehingga tidak bisa disimpan. Biasanya ini terjadi pada foto berlatar sangat ramai; foto berlatar polos jauh lebih ringan.",

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
      "Belum ada pengalaman kerja. Baru lulus? Isi bagian Proyek dan Organisasi sebagai gantinya - keduanya sama-sama dihitung sebagai bukti kemampuan.",
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
      ". Mesin penyaring mencocokkan kata demi kata, persis apa adanya - tambahan di dalam kurung justru membuatnya tidak cocok.",

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
    certCredentialId: "Nomor Sertifikat",
    certCredentialHint: "Supaya perekrut bisa mengecek sendiri keaslian sertifikatnya.",
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

    customLabel: "Bagian Tambahan",
    customAddSection: "Tambah Bagian Baru",
    customAddEntry: "Tambah Isian",
    customRemoveEntry: "Hapus isian ini",
    customSectionTitle: "Judul Bagian",
    customSectionTitleHint:
      "Tulisan biasa saja, tanpa emoji - mesin penyaring tidak bisa membaca emoji.",
    customSectionTitlePh: "Pelatihan dan Workshop",
    customEntryTitle: "Judul",
    customEntryTitlePh: "Pelatihan Keamanan Siber Dasar",
    customEntrySubtitle: "Keterangan",
    customEntrySubtitlePh: "Badan Siber dan Sandi Negara - 24 jam pelajaran",

    startDate: "Mulai",
    endDate: "Selesai",
    bulletsLabel: "Poin Pencapaian",
    bulletsHint:
      "Mulai dengan kata kerja, dan sebutkan angkanya. Bukan \"bertanggung jawab atas laporan\", tapi \"menyusun 12 laporan bulanan tepat waktu\". Inilah bagian yang paling menaikkan nilai CV Anda.",
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
    entryRemove: "Hapus isian ini",
    entryRemoveConfirm: "Hapus isian ini?",
    entryRemoveYes: "Ya, hapus",
    sectionMoveUp: "Pindahkan bagian ini ke atas",
    sectionMoveDown: "Pindahkan bagian ini ke bawah",
  },

  /* ------------------------------------------------------------ mode tamu */
  guest: {
    metaTitle: "Buat CV tanpa akun",
    metaDescription:
      "Susun CV yang lolos mesin penyaring lamaran tanpa perlu mendaftar. Datanya tersimpan di browser Anda sendiri, dan bisa diunduh sebagai PDF, Word, teks, atau berkas cadangan.",
    ctaTry: "Coba tanpa akun",
    ctaTryHint: "Langsung pakai - tanpa daftar, tanpa email",
    loading: "Menyiapkan editor...",

    bannerTitle: "CV ini cuma tersimpan di browser ini.",
    bannerBody:
      "Tidak ada yang dikirim ke mana pun, jadi Anda tidak perlu akun. Tapi ada risikonya: buka dari HP lain, bersihkan data browser, atau pakai mode penyamaran - CV ini ikut hilang. Unduh berkasnya, atau pindahkan ke akun kalau mau disimpan selamanya.",
    savedLocal: "Tersimpan di browser ini",
    saveFailed:
      "Browser menolak menyimpan, biasanya karena penyimpanannya penuh. Pas foto adalah isi yang paling besar, jadi menghapusnya sering langsung menyelesaikan. CV Anda masih utuh di layar - kalau cara itu belum menolong, segera unduh berkasnya.",
    loadFromJson: "Buka berkas cadangan",
    loadHint:
      "Membuka lagi berkas cadangan yang pernah Anda unduh dari sini. Berguna untuk menyimpan beberapa versi CV sebagai berkas milik Anda sendiri.",
    loadConfirm:
      "CV yang sekarang di layar akan diganti seluruhnya oleh isi berkas itu, dan yang lama tidak bisa dikembalikan lagi.",
    loadYes: "Ganti dengan isi berkas",
    loadFailed:
      "Berkas itu tidak bisa dibaca sebagai CV. Pilih berkas cadangan yang pernah diunduh dari aplikasi ini.",
    loadTooNew:
      "Berkas itu dibuat oleh versi aplikasi yang lebih baru. Muat ulang halaman ini dulu, lalu coba lagi.",
    moveToAccount: "Pindahkan ke akun",
    moveHint:
      "Anda akan diminta masuk atau mendaftar dulu, lalu CV ini bisa dipindahkan ke akun itu.",

    importTitle: "Ada CV yang Anda buat tanpa akun",
    importBody:
      "CV itu masih ada di browser ini. Pindahkan sekarang supaya tersimpan permanen di akun Anda dan bisa dibuka dari perangkat mana saja.",
    importButton: "Pindahkan ke akun saya",
    importDismiss: "Nanti saja",
    importDone: "CV berhasil dipindahkan ke akun Anda.",
    importFailed: "CV gagal dipindahkan. Coba lagi.",
  },

  /* ------------------------------------------------------------- editor CV */
  editor: {
    back: "CV Saya",
    backAria: "Kembali ke daftar CV saya",
    titleAria: "Judul CV",
    actionsMenu: "Menu lainnya",
    undo: "Kembalikan perubahan terakhir",
    redo: "Ulangi lagi perubahannya",
    panelNav: "Pindah panel",
    actionSampleLabel: "Isi dengan contoh",
    actionSampleHint: "Lihat bentuk CV yang sudah jadi",
    actionAppearanceLabel: "Atur tampilan",
    actionAppearanceHint: "Desain, ukuran kertas, huruf, jarak tepi",
    actionPdfLabel: "Unduh PDF",
    actionPdfHint: "Yang ini yang dikirim ke perusahaan",
    actionWordLabel: "Unduh Word",
    actionWordHint: "Kalau lowongannya minta berkas .docx",
    actionTxtLabel: "Unduh Teks Polos",
    actionTxtHint: "Untuk disalin-tempel ke formulir lamaran online",
    actionJsonLabel: "Simpan Cadangan",
    actionJsonHint: "Berkas cadangan, bisa dibuka lagi kapan saja",
    btnSample: "Isi Contoh",
    btnAppearance: "Tampilan",
    btnPdf: "PDF",
    btnWord: "Word",
    btnText: "Teks",
    btnJson: "Cadangan",
    btnTextTitle: "Teks polos, untuk disalin-tempel ke formulir lamaran online",
    btnJsonTitle: "Berkas cadangan, agar CV ini bisa dibuka lagi nanti",
    saveNotYet: "Belum tersimpan",
    saveAuto: "Tersimpan otomatis",
    untitled: "CV Belum Diberi Nama",
    renameLabel: "Nama CV",
    appearance: "Tampilan",
    fillSample: "Isi contoh",
    fillSampleConfirm:
      "Seluruh isi CV ini akan diganti dengan contoh yang sudah lengkap. Bagus untuk melihat bentuk CV jadi dan tahu setiap isian muncul di sebelah mana - tapi yang sudah Anda ketik akan hilang.",
    fillSampleYes: "Ya, tampilkan contohnya",
    matchJob: "Cocokkan dengan iklan lowongan",
    moreActions: "Tindakan lain",
    print: "Cetak atau simpan PDF",
    downloadDocx: "Unduh Word (.docx)",
    downloadTxt: "Unduh teks (.txt)",
    downloadJson: "Simpan berkas cadangan",
    tabPreview: "Lihat Hasil",
    tabScore: "Nilai CV",
    paneForm: "Isi Data",
    panePreview: "Hasil",
    paneScore: "Nilai",
    saveIdle: "Belum ada perubahan",
    saveDirty: "Ada yang belum tersimpan",
    saveSaving: "Menyimpan...",
    saveSaved: "Tersimpan",
    saveError: "Gagal menyimpan",
    saveFailedTitle: "Gagal menyimpan",
    saveFailedGeneric: "Perubahan Anda gagal disimpan.",
    saveFailedOffline:
      "Koneksi ke server terputus. Yang Anda ketik masih utuh di layar - jangan tutup halaman ini sampai internetnya kembali.",
    sectionOrderHint:
      "Bagian yang Anda lewati tidak akan muncul di CV - jadi tidak perlu diisi semua. Untuk menukar urutannya, pakai tombol panah di kanan judul bagian.",
  },

  /* ------------------------------------------- panel pengaturan tampilan CV */
  appearance: {
    drawerTitle: "Atur tampilan CV",
    drawerHint: "Kertas di sebelah langsung ikut berubah",
    groupLook: "Desain",
    groupText: "Tulisan",
    groupPaper: "Kertas dan jarak tepi",
    groupLanguage: "Bahasa judul di dalam CV",
    template: "Desain CV",
    templateWithPhoto: "Pakai pas foto",
    templateWithoutPhoto: "Tanpa pas foto",
    font: "Jenis Huruf",
    fontHint: "Semuanya aman - mesin penyaring bisa membaca kelimanya.",
    fontSize: "Besar Huruf",
    lineHeight: "Jarak Antarbaris",
    headingLanguage: "Bahasa judul di dalam CV",
    headingLanguageHint:
      "Menentukan CV Anda tertulis \"PENGALAMAN KERJA\" atau \"WORK EXPERIENCE\". Tidak ada hubungannya dengan bahasa tampilan aplikasi ini.",
    accentColor: "Warna Garis dan Judul",
    photoWidth: "Ukuran Pas Foto",
    margin: "Jarak Tepi Kertas",
    marginY: "Jarak Tepi Atas-Bawah",
    marginX: "Jarak Tepi Kiri-Kanan",
    marginFollowTemplate: "ikut desain",
    marginReset: "Kembalikan seperti semula",
    marginHint:
      "Jarak atas dan bawah selalu sama besar, dan berlaku di setiap halaman - bukan cuma halaman pertama. Di bawah 10 mm, sebagian printer akan memotong tepinya.",
    paperSize: "Ukuran Kertas",
    photoUnsupported:
      "Desain ini tidak punya tempat untuk pas foto. Kalau lowongan Anda memintanya, pilih desain dari kelompok \"Pakai pas foto\".",
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
    heroBadge: "100% Gratis • Tanpa Watermark • Tersimpan Otomatis",
    heroTitleLine1: "Fokus ceritakan pengalamanmu.",
    heroTitleLine2: "Format ATS-nya",
    heroTitleLine3: "biar kami yang urus",
    heroBody:
      "Banyak perusahaan menyaring lamaran lewat sistem yang membaca CV secara otomatis, dan format yang rumit seperti dua kolom, tabel, atau tulisan di dalam gambar sering terbaca berantakan. Jangan biarkan pengalaman hebatmu gugur gara-gara itu. Isi form simpel kami, dapatkan CV berstandar ATS, dan lihat skormu seketika.",
    heroCtaNew: "Buat CV ATS-ku Sekarang",
    heroCtaDashboard: "Lanjut ke CV-ku",
    heroCtaCompare: "Cek dulu CV yang sudah kupunya",
    statSections: "bagian CV",
    statDimensions: "hal yang dinilai",
    statTemplates: "pilihan desain",
    statFormats: "pilihan unduhan",
    statsPrompt: "Ketuk angkanya buat tahu maksudnya.",
    statSectionsWhy:
      "Data pribadi, ringkasan, pengalaman kerja, pendidikan, keahlian, proyek, sertifikat, organisasi, penghargaan, bahasa, dan publikasi. Bagian yang nggak kamu isi nggak akan muncul di CV, jadi santai saja: nggak perlu diisi semua.",
    statTemplatesWhy:
      "Sepuluh tampilan berbeda untuk isi yang sama: ada yang bergaris tegas, ada yang polos, dua di antaranya punya tempat pas foto. Ganti kapan saja; datamu nggak berubah sedikit pun.",
    statDimensionsWhy:
      "CV-mu diperiksa dari lima sisi: bisa tidaknya dibaca mesin, kelengkapan isinya, mutu kalimatnya, kerapian susunannya, dan kecocokannya dengan lowongan yang kamu incar.",
    statFormatsWhy:
      "PDF buat dikirim ke perusahaan, Word kalau lowongannya minta .docx, teks polos buat disalin-tempel ke formulir online, dan berkas cadangan supaya CV ini bisa dibuka lagi nanti.",
    heroCaption: "Contoh hasil jadi, desain Klasik",
    heroBadgeScore: "Nilai CV",
    heroBadgeGrade: "Nilai A",
    heroBadgeSaved: "Tersimpan otomatis",

    pathsTitle: "2 Cara Jitu Memastikan CV-mu Lolos Seleksi",
    pathsBody:
      "Mau mulai dari nol atau membedah CV yang sudah kamu punya, dua-duanya dinilai dengan cara yang sama persis, supaya isi CV-mu benar-benar terbaca, bukan tersandung format.",
    pathBuildTitle: "Bangun CV Baru Bebas Ribet",
    pathBuildBody:
      "Tinggal ketik di kotak yang disediakan, pantau perubahannya secara langsung di kertas virtual, tingkatkan skornya, lalu unduh dalam format PDF, Word, atau Teks. Sesimpel itu!",
    pathBuildCta: "Buat CV ATS-ku Sekarang",
    pathCompareTitle: "Audit & Bandingkan CV Lamamu",
    pathCompareBody:
      "Sering di-ghosting HRD? Unggah CV lamamu dan biarkan sistem kami membedahnya. Bandingkan hingga 5 CV sekaligus untuk tahu persis letak kekurangannya dan mana yang paling siap dikirim. Berkasmu diproses langsung di perangkatmu dan tidak pernah dikirim ke server kami.",
    pathCompareCta: "Cek CV-ku sekarang",

    stepsTitle: "Cuma Butuh 4 Langkah Menuju Wawancara Kerja!",
    stepsBody:
      "Lupakan pusingnya mengatur margin dan layout. Tugasmu cuma menceritakan kehebatanmu, urusan teknis biar sistem kami yang atur.",
    step1Title: "Anti Blank Page Syndrome",
    step1Body:
      "Nggak perlu bingung mau nulis apa. Setiap bagian (pengalaman, pendidikan, keahlian) sudah dilengkapi panduan praktis dan contoh nyata di dalam kotaknya.",
    step2Title: "Live Preview yang Presisi",
    step2Body:
      "Ketik di kiri, lihat hasilnya di kanan! Tampilan kertas menyesuaikan ukuran asli. Kamu jadi tahu persis di mana tulisanmu mendarat saat dicetak nanti.",
    step3Title: "Tingkatkan Skor CV-mu",
    step3Body:
      "Dapatkan analisis dari 5 aspek krusial. Kami nggak cuma ngasih angka mati, tapi juga petunjuk langkah demi langkah untuk memperbaikinya.",
    step4Title: "Unduh, Kirim, dan Bersiap Interview",
    step4Body:
      "Ekspor ke PDF atau Word dalam sekejap. Semua data tersimpan aman di akunmu, siap diduplikasi atau diedit ulang untuk lowongan incaran berikutnya.",

    featuresTitle:
      "Tinggalkan Cara Lama. Ini Alasan Kami Jauh Lebih Baik dari Template Word Biasa.",
    featuresBody:
      "Template Word biasa cuma peduli soal \"cantik\", tapi lupa soal \"terbaca oleh sistem\". Di sini, kami memastikan CV-mu rapi di mata HRD dan bersih di mata mesin penyaring lamaran.",
    feature1Title: "Bukan Sekadar Kertas Kosong",
    feature1Body:
      "Tersedia 11 blok informasi yang siap diisi. Susunan kerangkanya baku dan rapi secara otomatis.",
    feature2Title: "Tanpa Kejutan Saat Dicetak",
    feature2Body:
      "Pilih A4, Letter, Legal, atau F4. Pratinjaunya memakai ukuran kertas yang sebenarnya. Apa yang kamu lihat di layar, itu juga yang tercetak nanti.",
    feature3Title: "Auto-Save, Anti-Panik!",
    feature3Body:
      "Nggak sengaja menutup tab? Santai. Kurang dari sedetik setelah kamu berhenti mengetik, perubahannya sudah tersimpan. Tutup browser, buka lagi bulan depan, lanjut dari tempat terakhir.",
    feature4Title: "Feedback Instan & Terarah",
    feature4Body:
      "Ketahui kelemahan CV-mu lewat sistem skoring 5 dimensi. Klik saran perbaikannya, dan kamu akan diarahkan langsung ke kotak yang perlu direvisi.",
    feature5Title: "Senjata Rahasia: Pencocokan Lowongan",
    feature5Body:
      "Copy-paste iklan lowongan yang kamu incar, dan sistem kami akan melacak keyword penting apa yang masih kurang di CV-mu.",
    feature6Title: "Kendali Penuh Atas Datamu",
    feature6Body:
      "Unduh, simpan cadangan, atau hapus seluruh data beserta akunmu kapan pun kamu mau, tanpa syarat.",

    templatesTitle: "10 Pilihan Desain Elegan. Semuanya Aman Dibaca Mesin.",
    templatesBody:
      "Singkirkan desain nyeleneh yang bikin sistem eror. Semua template kami dirancang bersih dengan tata letak satu kolom tanpa tabel tersembunyi. Ganti gaya huruf, kerapatan baris, hingga letak foto sesuka hati tanpa merusak secuil pun datamu.",
    templatesWithoutPhoto: "Tanpa pas foto",
    templatesWithPhoto: "Pakai pas foto",
    templatesPhotoNote:
      "Dua desain berfoto disediakan karena sebagian lowongan di Indonesia masih memintanya. Kalau lowonganmu nggak minta, pilih yang tanpa foto saja, karena mesin penyaring nggak bisa melihat gambar.",

    faqTitle: "Yang sering ditanyakan",
    faqBody: "Termasuk hal-hal yang biasanya nggak diceritakan aplikasi sejenis.",

    ctaTitle: "Buat satu kali, pakai berkali-kali",
    ctaBody:
      "Datamu tersimpan di akun. Untuk lowongan berikutnya, gandakan CV yang sudah ada lalu ubah seperlunya, tanpa perlu mulai dari halaman kosong lagi.",
    ctaButton: "Buat CV ATS-ku Sekarang",
    ctaButtonSignedIn: "Buka CV-ku",
    ctaNote: "Tanpa biaya, dan nggak ada tulisan tempelan di CV-mu.",
  },

  /* Pertanyaan yang sering muncul. Disimpan sebagai larik supaya urutan dan
     jumlahnya identik di kedua bahasa - TypeScript hanya memeriksa kunci,
     bukan panjang larik, jadi kesamaan ini dijaga saat menyunting. */
  faq: [
    {
      q: "Apa itu ATS, dan kenapa saya harus peduli?",
      a: "ATS adalah aplikasi yang dipakai banyak perusahaan untuk menampung dan menyaring lamaran yang masuk. Kepanjangannya Applicant Tracking System, tapi cukup bayangkan begini: sebelum CV-mu dilihat manusia, ada mesin yang membacanya lebih dulu dan mencomot datanya: nama, kontak, pengalaman, keahlian. Mesin ini gampang tersandung. CV dua kolom, CV bertabel, atau CV yang tulisannya ada di dalam gambar sering terbaca acak-acakan, dan pengalaman yang sebenarnya kamu punya jadi tidak terbaca sama sekali. Bukan karena kamu kurang layak, cuma karena berkasnya tidak terbaca.",
    },
    {
      q: "CV dari sini dijamin lolos, dong?",
      a: "Tidak, dan sebaiknya curigai siapa pun yang menjanjikan itu. Tiap perusahaan pakai aplikasi penyaring yang berbeda, dan cara kerjanya tidak pernah dibuka ke publik. Yang bisa kami lakukan, dan memang kami lakukan, adalah memastikan CV-mu memenuhi aturan yang berlaku umum: satu kolom, tanpa tabel, judul bagian yang baku, penulisan tanggal yang seragam, dan tulisan yang benar-benar berupa tulisan, bukan gambar. Nilai yang muncul di sini artinya \"sudah memenuhi yang kami periksa\", bukan \"pasti diterima\".",
    },
    {
      q: "CV saya sebaiknya berapa halaman?",
      a: "Satu. Itu panjang yang pas untuk hampir semua pelamar, termasuk yang sudah lama bekerja. Perekrut melirik satu CV dalam hitungan detik, jadi apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah dibaca. Dua halaman baru sepadan kalau pengalamanmu lebih dari lima tahun dan semuanya nyambung dengan lowongan yang dituju. Dan kalau CV-mu kepanjangan, yang dipangkas isinya, bukan ukuran hurufnya yang dikecil-kecilkan.",
    },
    {
      q: "Pakai ukuran kertas apa?",
      a: "A4, dan itu sudah jadi pilihan bawaan di sini, jadi kamu nggak perlu mengubah apa pun. A4 adalah ukuran standar di Indonesia dan hampir seluruh dunia. Letter cuma perlu kalau kamu melamar ke perusahaan di Amerika Serikat atau Kanada. Legal dan F4 cuma kalau instansi yang dituju secara khusus memintanya.",
    },
    {
      q: "Gratis? Beneran tidak ada biaya tersembunyi?",
      a: "Beneran gratis. Tidak ada versi berbayar, tidak ada batas berapa CV yang boleh dibuat, tidak ada tulisan tempelan di CV yang kamu unduh, dan kamu nggak akan pernah dimintai nomor kartu.",
    },
    {
      q: "Nanti ada logo atau nama aplikasi ini di CV saya?",
      a: "Tidak ada. CV yang kamu unduh isinya murni datamu sendiri: tanpa logo, tanpa tulisan tempelan, tanpa nama aplikasi maupun pembuatnya. Itu dokumenmu, bukan iklan kami.",
    },
    {
      q: "CV yang saya unggah buat dicek, disimpan di server kalian?",
      a: "Tidak. Bukan cuma tidak disimpan, tapi memang tidak pernah dikirim ke mana pun. Berkasnya dibaca dan dinilai langsung di HP atau komputermu sendiri. Tutup halamannya, semuanya hilang. Itu juga sebabnya fitur ini bisa dipakai tanpa bikin akun.",
    },
    {
      q: "Kalau browser saya tutup, data saya hilang tidak?",
      a: "Tidak hilang, untuk CV yang kamu susun sambil masuk ke akun. Setiap perubahan tersimpan sendiri kurang dari satu detik setelah kamu berhenti mengetik, jadi tidak ada tombol Simpan yang bisa lupa kamu tekan. Masuk lagi kapan saja dari perangkat mana saja, CV-mu masih di sana. Mau lebih aman lagi? Unduh berkas cadangannya dan simpan sendiri.",
    },
    {
      q: "Kenapa CV sebaiknya tanpa pas foto?",
      a: "Karena mesin penyaring tidak bisa melihat gambar, dan susunan di sekitar foto sering membuat urutan tulisannya jadi kacau saat dibaca mesin. Di banyak negara, foto juga sengaja dihindari supaya penilaian tidak terpengaruh penampilan. Meski begitu, dua desain berfoto tetap kami sediakan, karena sebagian lowongan di Indonesia memang masih memintanya, dan kamu akan diingatkan saat menyalakannya.",
    },
    {
      q: "Boleh punya lebih dari satu CV?",
      a: "Boleh, malah sangat disarankan. CV yang paling berhasil adalah yang disesuaikan untuk tiap lowongan. Pakai tombol gandakan, lalu ubah ringkasan dan urutan keahliannya supaya nyambung dengan lowongan yang dituju. Jauh lebih cepat daripada mulai dari nol.",
    },
  ],

  /* ------------------------------------------------------- pembanding CV */
  compare: {
    metaTitle: "Cek dan Bandingkan CV",
    metaDescription:
      "Unggah beberapa CV sekaligus, lihat kelebihan dan kekurangan masing-masing, lalu ketahui mana yang paling siap dikirim. Berkasnya diperiksa langsung di perangkat Anda dan tidak pernah dikirim ke mana pun.",
    title: "Cek CV Anda, atau adu beberapa sekaligus",
    subtitle:
      "Unggah satu berkas untuk diperiksa, atau dua sampai lima untuk diadu. Masing-masing dapat nilai, daftar kelebihan, dan daftar kekurangan lengkap dengan cara membetulkannya - lalu di akhir kami sebutkan mana yang paling siap dikirim.",
    privacyTitle: "Berkas Anda tidak dikirim ke mana pun.",
    privacyBody:
      "Semua pembacaan dan penilaian terjadi di dalam HP atau komputer Anda sendiri. Tidak ada satu berkas pun yang dikirim ke server kami maupun ke layanan lain, dan tidak ada yang disimpan. Tutup halaman ini, semuanya hilang.",
    dropTitle: "Seret berkas CV ke sini",
    dropSubtitle: "atau ketuk untuk memilih dari perangkat Anda",
    dropFormats: "Berkas PDF, Word, atau teks - paling banyak 5 berkas, masing-masing 8 MB",
    chooseFiles: "Pilih Berkas",
    fileRemove: "Batalkan berkas ini",
    tooMany: "Paling banyak 5 berkas sekaligus.",
    jobToggleShow: "Punya iklan lowongannya? Tempel di sini (boleh dilewati)",
    jobToggleHide: "Sembunyikan iklan lowongan",
    jobHint:
      "Kalau diisi, tiap CV ikut dinilai seberapa cocok isinya dengan lowongan ini - dan justru inilah yang paling menentukan CV mana yang sebaiknya Anda kirim.",
    analyze: "Periksa Sekarang",
    analyzing: "Sedang memeriksa...",
    reset: "Mulai Ulang",
    readingFile: "Sedang membaca",
    resultSingleTitle: "Hasil pemeriksaan",
    resultCompareTitle: "Hasil perbandingan",
    winnerLabel: "Paling siap dikirim",
    rankLabel: "Peringkat",
    reasonsTitle: "Kenapa yang ini unggul",
    perDimensionTitle: "Perbandingan per sisi penilaian",
    dimensionColumn: "Yang dinilai",
    bestColumn: "Tertinggi",
    worstColumn: "Terendah",
    spreadColumn: "Selisih",
    strengthsTitle: "Kelebihan",
    weaknessesTitle: "Kekurangan dan cara memperbaikinya",
    noWeakness: "Tidak ada kekurangan yang kami temukan dari aturan yang diperiksa.",
    noStrength: "Belum ada kelebihan yang bisa dicatat dari berkas ini.",
    statPages: "Halaman",
    statWords: "Kata",
    statBullets: "Poin",
    statColumns: "Kolom",
    ctaTitle: "Ingin memperbaikinya sekarang?",
    ctaBody:
      "Susun ulang CV Anda di sini: tiap kotak isian sudah ada contohnya, nilainya berubah sambil Anda mengetik, dan hasilnya bisa langsung diunduh sebagai PDF, Word, atau teks polos.",
    ctaButton: "Buat CV Gratis",
    addMoreSingle:
      "Punya CV versi lain? Tambahkan sekarang - keduanya langsung diadu dan kami sebutkan mana yang lebih siap dikirim.",
    addMoreMany:
      "Masih ada CV lain? Tambahkan saja, sampai lima berkas sekaligus.",
    addMoreButton: "Tambah CV lagi",
    errorTitle: "Berkas gagal dibaca",
    limitsNote:
      "Jujur soal batasannya: penilaian ini membaca tulisan, bukan memahami maksudnya. Ia bisa memastikan CV Anda terbaca mesin, tapi tidak bisa menilai apakah pengalaman Anda cocok untuk suatu jabatan. Yang itu tetap penilaian Anda sendiri.",
  },

  /* ------------------------------------------------------- panel skor ATS */
  ats: {
    severityError: "Harus dibetulkan",
    severityWarning: "Sebaiknya dibetulkan",
    severityInfo: "Kalau mau lebih bagus",
    noCritical: "Tidak ada masalah serius",
    mustFixCount: "hal yang harus dibetulkan",
    suggestionCount: "saran perbaikan",
    statPages: "Halaman",
    statWords: "Jumlah kata",
    statActionVerbs: "Poin diawali kata kerja",
    statQuantified: "Poin yang menyebut angka",
    breakdownTitle: "Rincian penilaian",
    breakdownHint:
      "Nilai akhir dihitung dari lima hal di bawah ini. Tidak semuanya berpengaruh sama besar - persentase di samping tiap baris menunjukkan seberapa besar pengaruhnya.",
    weight: "pengaruh",
    notScored: "belum bisa dinilai",
    keywordsTitle: "Kata penting dari iklan lowongan",
    keywordsMatchSuffix: "cocok",
    keywordsMissing: "Belum ada di CV Anda",
    keywordsMatched: "Sudah ada di CV Anda",
    keywordsWarning:
      "Masukkan hanya yang benar-benar Anda kuasai. Menempel keahlian yang tidak Anda punya memang menaikkan angka di sini - tapi akan ketahuan begitu masuk wawancara.",
    noFindings:
      "Bersih. CV Anda sudah memenuhi semua aturan yang kami periksa.",
    openField: "Buka bagian yang bermasalah",
    gradePrefix: "Nilai",
    jobTitle: "Cocokkan dengan iklan lowongan",
    jobIntro:
      "Salin-tempel isi iklan lowongan yang Anda incar. Kata-kata pentingnya kami ambil sendiri, lalu kami bandingkan dengan isi CV Anda.",
    jobLabel: "Isi iklan lowongan",
    jobPlaceholder:
      "Tempel seluruh isi iklan lowongannya di sini - termasuk bagian syarat dan tanggung jawab. Makin lengkap yang ditempel, makin tepat kata penting yang terbaca.",
    jobAnalyze: "Lihat seberapa cocok",
    jobAnalyzing: "Menghitung...",
    jobClear: "Kosongkan",
    jobEmpty: "Isi iklan lowongannya belum ditempel.",
    pageTitle: "Cocokkan dengan Lowongan",
    pageSubtitle:
      "Tempel iklan lowongannya, lalu lihat kata penting mana yang diminta lowongan itu tapi belum ada di CV Anda.",
    jobDescTitle: "Isi Iklan Lowongan",
    jobDescHint:
      "Salin seluruh isi iklan lowongannya - termasuk bagian syarat dan tanggung jawab - lalu tempel di bawah ini. Kata-kata pentingnya kami ambil sendiri.",
    wordsAnalyzed: "kata diperiksa.",
    saveToHistory: "Catat Nilai Ini",
    historyTitle: "Catatan Nilai Sebelumnya",
    historyEmpty:
      "Belum ada catatan. Tekan Catat Nilai Ini untuk menyimpan nilai sekarang - lalu perbaiki CV Anda, catat lagi, dan Anda bisa melihat sendiri kemajuannya.",
    historyBest: "Nilai tertinggi sejauh ini:",
    historySaved: "Nilainya sudah dicatat.",
    historySaveFailed: "Nilainya gagal dicatat.",
    historyOffline: "Koneksi ke server terputus.",
    backToEditor: "Kembali menyunting CV",
  },

  /* ----------------------------------------------------------- halaman cetak */
  print: {
    backToEditor: "Kembali menyunting CV",
    printNow: "Cetak atau Simpan PDF",
    openPrintPage: "Buka halaman cetaknya",
    openPrintPageHint: "Kalau jendela cetak tidak muncul sendiri",
  },

  /* --------------------------------------------------------- pratinjau CV */
  preview: {
    label: "Hasil",
    viewLabel: "Cara menampilkan",
    viewPaged: "Terpotong per halaman",
    viewContinuous: "Memanjang",
    typeHere: "Ketik langsung di kertas",
    typeHint:
      "Nyalakan ini, lalu ketik langsung di atas kertasnya seperti di Word. Yang Anda ketik otomatis masuk ke kotak isian di sebelah kiri - keduanya satu CV yang sama, bukan dua salinan. Untuk tanggal, klik saja periodenya: pemilih bulan akan muncul, supaya penulisannya tetap rapi.",
    typeDateTitle: "Ubah tanggalnya",
    typeDateStart: "Mulai",
    typeDateEnd: "Selesai",
    typeDateSingle: "Bulan",
    typeDateCurrent: "Masih berjalan sampai sekarang",
    typeDateSave: "Simpan",
    typeDateCancel: "Batal",
    typeAddEntry: "Tambah isian baru",
    typePageNote:
      "Jumlah halamannya dihitung ulang setelah mode ketik dimatikan. Kotak kosong yang sengaja ditampilkan selama mengetik tidak ikut tercetak.",
    typeForcesContinuous:
      "Tidak bisa dipakai selama mode ketik menyala. Tampilan per halaman memotong dokumennya di batas halaman, dan kursor tidak bisa menyeberangi potongan itu.",
    viewPagedHint: "Seperti di Word - Anda bisa lihat persis di mana halaman berganti.",
    viewContinuousHint: "Satu gulungan panjang tanpa potongan - enak untuk membaca cepat sambil mengubah isinya.",
    zoomIn: "Perbesar",
    zoomOut: "Perkecil",
    zoomFit: "Paskan ke lebar layar",
    pageLabel: "Halaman",
    paperSize: "Ukuran kertas",
    paperRecommended: "paling aman",
    lengthIdeal: "Panjangnya sudah pas.",
    lengthAcceptable: "Masih wajar kalau pengalaman kerja Anda lebih dari lima tahun.",
    lengthTooLong: "Kepanjangan. Perekrut biasanya cuma melirik halaman pertama.",
    onePageAdvice:
      "Satu halaman sudah cukup untuk hampir semua pelamar. Kalau kepanjangan, buang pengalaman yang tidak nyambung dengan lowongan yang dituju - jangan hurufnya yang dikecilkan.",
  },

  /* -------------------------------------------------- pemilih tema/bahasa */
  prefs: {
    theme: "Terang / Gelap",
    themeLight: "Terang",
    themeDark: "Gelap",
    themeToDark: "Ganti ke mode gelap",
    themeToLight: "Ganti ke mode terang",
    language: "Bahasa",
    languageToggleLabel: "Ganti bahasa tampilan",
  },

  /* ------------------------------------------------------- navigasi publik */
  nav: {
    home: "Beranda",
    guide: "Panduan",
    about: "Tentang",
    flowNav: "Alur",
    compare: "Cek CV Saya",
    dashboard: "CV Saya",
    login: "Masuk",
    register: "Daftar Gratis",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    mainNav: "Utama",
    mobileNav: "Utama (ponsel)",
    settingsGroup: "Tampilan",
    breadcrumb: "Anda sedang di sini",
    backHome: "Kembali ke beranda",
    backDashboard: "Kembali ke daftar CV saya",
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
      "Belum ada CV di sini. Mulai dari contoh saja, supaya Anda langsung lihat bentuk jadinya.",
    subtitleCount: "CV tersimpan. Semuanya tersimpan sendiri, tidak perlu ditekan Simpan.",
    importJson: "Buka Berkas Cadangan",
    startFromSample: "Mulai dari Contoh",
    createNew: "Buat CV Baru",
    startBlank: "Mulai dari halaman kosong",
    emptyTitle: "Belum ada CV di akun ini",
    emptyBodyLead: "Saran: pilih",
    emptyBodyTail:
      ". CV-nya langsung terisi contoh lengkap, jadi Anda bisa lihat tiap isian muncul di sebelah mana - tinggal ditimpa dengan data Anda sendiri.",
    nameEmpty: "Nama belum diisi",
    changedAt: "Diubah",
    edit: "Buka dan Sunting",
    renameTitle: "Ganti nama",
    duplicateTitle: "Gandakan",
    deleteTitle: "Hapus",
    deleteConfirmLead: "Hapus",
    deleteConfirmTail:
      "? Seluruh isinya ikut terhapus, dan tidak bisa dikembalikan lagi.",
    deleteYes: "Ya, hapus",
    tipsLabel: "Tips:",
    tips:
      "mau melamar posisi lain? Tekan tombol gandakan, lalu ubah ringkasan dan urutan keahliannya. CV yang disesuaikan per lowongan hampir selalu dapat nilai kecocokan yang jauh lebih tinggi.",
    errorGeneric: "Terjadi kesalahan. Silakan coba lagi.",
    errorOffline: "Koneksi ke server terputus.",
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
    emailLocked: "Alamat email tidak bisa diganti.",
    nameLabel: "Nama Tampilan",
    saveName: "Simpan Nama",
    passwordChangeTitle: "Ubah Kata Sandi",
    passwordCreateTitle: "Buat Kata Sandi",
    passwordGoogleNote:
      "Akun ini dibuat lewat Google, jadi belum punya kata sandi. Kalau Anda membuatnya sekarang, nanti bisa masuk lewat dua cara: tombol Google, atau email dan kata sandi.",
    passwordCurrent: "Kata Sandi Saat Ini",
    passwordNew: "Kata Sandi Baru",
    passwordHint: "Minimal 8 huruf atau angka.",
    passwordSave: "Simpan Kata Sandi",
    dangerTitle: "Hapus Akun",
    dangerBody:
      "Semua CV beserta isinya akan terhapus selamanya dan tidak bisa dikembalikan - oleh kami sekalipun. Sebaiknya unduh dulu berkas cadangan tiap CV sebelum melanjutkan.",
    dangerStart: "Saya ingin menghapus akun",
    dangerConfirmLabel: "Ketik \"HAPUS AKUN\" untuk mengonfirmasi",
    dangerConfirmHint:
      "Langkah ini sengaja dibuat merepotkan, supaya tidak pernah terjadi gara-gara salah pencet.",
    dangerConfirmWord: "HAPUS AKUN",
    dangerButton: "Hapus akun saya",
    saveFailed: "Gagal menyimpan.",
    deleteFailed: "Gagal menghapus akun.",
    saved: "Perubahan sudah tersimpan.",
    offline: "Koneksi ke server terputus.",
  },

  /* --------------------------------------------------------- masuk/daftar */
  auth: {
    loginTitle: "Masuk",
    loginSubtitle: "Lanjutkan CV yang sudah Anda simpan.",
    registerTitle: "Daftar",
    registerSubtitle:
      "Gratis. CV Anda tersimpan sendiri dan bisa diubah kapan saja, dari perangkat mana saja.",
    google: "Masuk dengan Google",
    divider: "ATAU",
    nameLabel: "Nama Lengkap",
    namePh: "Budi Santoso",
    emailLabel: "Email",
    emailPh: "nama@email.com",
    passwordLabel: "Kata Sandi",
    passwordHint: "Minimal 8 huruf atau angka.",
    submitLogin: "Masuk",
    submitRegister: "Buat Akun",
    registeredNotice:
      "Akun Anda sudah jadi. Sekarang masuk pakai email dan kata sandi yang barusan dibuat.",
    signInFailed: "Gagal masuk. Coba sekali lagi.",
    invalidCredentials: "Email atau kata sandi salah.",
    registerFailed: "Pendaftaran gagal. Coba sekali lagi.",
    sessionStale:
      "Anda sudah tidak dalam keadaan masuk - akun yang tercatat di sini tidak ditemukan lagi. Sebentar lagi Anda dibawa ke halaman masuk.",
    forgotPassword: "Lupa kata sandi?",
    forgotTitle: "Lupa kata sandi",
    forgotSubtitle:
      "Masukkan alamat email akun Anda. Kami kirimkan tautan untuk membuat kata sandi baru.",
    forgotSubmit: "Kirim tautannya",
    forgotFailed: "Tautannya gagal dikirim. Coba sekali lagi.",
    forgotOffline: "Koneksi ke server terputus. Coba lagi setelah internetnya kembali.",
    sentTitle: "Cek email Anda",
    sentBody:
      "Kalau alamat itu memang terdaftar, tautan untuk membuat kata sandi baru sudah dalam perjalanan. Tautannya berlaku 30 menit dan hanya bisa dipakai sekali.",
    sentSpam:
      "Belum sampai setelah beberapa menit? Cek folder spam, dan pastikan alamat yang Anda ketik tidak salah huruf.",
    resetTitle: "Buat kata sandi baru",
    resetSubtitle: "Ketik kata sandi barunya dua kali, supaya tidak ada salah ketik.",
    resetNew: "Kata Sandi Baru",
    resetConfirm: "Ketik Ulang Kata Sandi",
    resetSubmit: "Simpan kata sandi baru",
    resetMismatch: "Kedua kata sandi belum sama. Periksa lagi.",
    resetFailed: "Kata sandinya gagal diganti. Coba sekali lagi.",
    resetNoToken:
      "Alamat halaman ini tidak memuat tautan pemulihan. Buka lagi tautan dari email Anda - atau minta yang baru.",
    resetDone:
      "Kata sandi Anda sudah diganti. Silakan masuk memakai yang baru.",
    backToLogin: "Kembali ke halaman masuk",
    forgotViaGoogle:
      "Pengiriman email belum aktif di pemasangan ini. Yang bisa Anda lakukan sekarang: masuk dengan Google memakai alamat email yang sama, lalu buat kata sandi baru di halaman Pengaturan. Akun dengan alamat email yang sama akan tersambung, bukan tergandakan.",
    forgotNoGoogle:
      "Pengiriman email belum aktif di pemasangan ini, dan masuk lewat Google juga sedang mati. Untuk sekarang, akun yang kata sandinya terlupa belum bisa dipulihkan sendiri.",
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
      "Halaman ini gagal ditampilkan. Tenang - CV Anda tetap aman, karena setiap perubahan sudah tersimpan sendiri begitu Anda berhenti mengetik.",
    errorCode: "Kode kesalahan:",
    notFoundTitle: "Halamannya tidak ada",
    notFoundBody:
      "Alamat yang Anda buka tidak ada - atau CV yang dituju bukan milik akun yang sedang masuk sekarang.",
    retry: "Coba lagi",
    openDashboard: "Buka CV Saya",
    backHome: "Kembali ke Beranda",
    loading: "Memuat halaman...",
  },

  /* ------------------------------------------------------------------ footer */
  /* Blok kontak. Dipakai kaki halaman dan halaman Tentang lewat satu
     komponen yang sama, supaya keduanya tidak mungkin berbeda isi. */
  contact: {
    heading: "Punya Masukan atau Kendala?",
    purpose:
      "Website ini murni proyek solo alias saya kembangkan sendirian dari nol. Kalau ada bug, bingung cara pakainya, atau sekadar mau ngasih saran, drop pesan aja!",
    expectation:
      "Mungkin saya nggak bisa balas secepat mesin otomatis, tapi saya jamin setiap ketikan pesanmu pasti saya baca satu per satu.",
    emailLabel: "Surel",
    waLabel: "WhatsApp",
    waAction: "Chat WhatsApp",
    waAria: "Chat WhatsApp dengan pengelola aplikasi",
    emailAria: "Kirim surel ke pengelola aplikasi",
  },

  /* Angka dan klaim yang membawa sumbernya sendiri. Kutipan aslinya
     berbahasa Inggris; di sini maknanya diterjemahkan, lalu dokumen aslinya
     ditautkan - bukan ditempel mentah di tengah paragraf Indonesia. */
  rujukan: {
    matchNote:
      "Kenapa fitur ini ada: dalam survei terhadap lebih dari 8.000 pencari kerja dan 2.250 eksekutif perusahaan di Amerika Serikat, Inggris, dan Jerman, lebih dari 90% perusahaan memakai sistemnya untuk menyaring atau memeringkat pelamar sejak awal. 88% perusahaan yang disurvei juga mengakui kandidat berkualitas ikut tersaring keluar karena tidak cocok dengan kriteria yang tertulis di iklan lowongan.",
    matchLink: "Riset Harvard Business School & Accenture (PDF)",

    formatNote:
      "Aturan bentuknya bukan karangan kami. Pusat karier universitas menyarankan hal yang sama kepada mahasiswanya: satu kolom rata kiri, tanpa tabel maupun kotak teks, tanpa gambar atau foto, dan judul bagian dengan huruf kapital.",
    formatLinkUsc: "Panduan Format CV, Pusat Karier USC",
    formatLinkOnu: "Panduan CV untuk ATS, Polar Careers Ohio Northern University (PDF)",

    heading: "Rujukan",
    intro:
      "Angka dan aturan bentuk di situs ini berasal dari tiga sumber berikut. Ketiganya dapat dibuka siapa saja dan tidak menjual apa pun.",
    harvardTitle: "Hidden Workers: Untapped Talent",
    harvardMeta: "Harvard Business School & Accenture, September 2021",
    harvardWhat:
      "Sumber angka lebih dari 90% dan 88% pada penjelasan pencocokan lowongan. Perlu dicatat: risetnya soal kecocokan kriteria dengan iklan lowongan, bukan soal format CV.",
    uscTitle: "Resume Format Guidelines",
    uscMeta: "Career Center, University of Southern California",
    uscWhat:
      "Dasar aturan tanpa kolom ganda, tanpa gambar, tanpa foto, dan tanpa huruf hias.",
    onuTitle: "A Guide to Adapting Your Resume for the Applicant Tracking System",
    onuMeta: "Polar Careers, Ohio Northern University",
    onuWhat:
      "Dasar aturan satu kolom rata kiri, tanpa tabel, kontak di badan dokumen, dan judul bagian huruf kapital.",
    openIn: "membuka di tab baru",
  },

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
