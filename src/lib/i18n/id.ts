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
    appName: "CV ATS & Portofolio Builder",
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

  /* --------------------------------------------------- portofolio berpola */
  portofolio: {
    title: "Bentuk portofolio Anda",
    intro:
      "Tiga pertanyaan pendek. Jawabannya menentukan isian apa saja yang ditawarkan di bagian karya - dan isian mana yang wajib.",
    q1Label: "Apa jurusan atau profesi Anda?",
    q1Ph: "Teknik Sipil, Ahwal Syakhshiyyah, Tata Boga...",
    q1Hint:
      "Ketik nama jurusannya apa adanya. Singkatan yang lazim seperti PWK atau TKJ juga ditemukan.",
    searchEmpty:
      "Belum ada yang cocok. Coba nama jurusan lengkapnya, atau lanjut tanpa memilih.",
    notFound: "Bidang saya tidak ada di daftar",
    fieldLabel: "Bidang",
    q2Label: "CV ini untuk apa?",
    q2Hint:
      "Keperluan yang berbeda menuntut bukti yang berbeda, meskipun orangnya sama.",
    q3Label: "Sejauh mana pengalaman Anda?",
    q3Hint:
      "Menentukan isian mana yang diwajibkan. Tugas kuliah tetap dihitung - yang berubah hanya ukurannya.",
    chosenLabel: "Bentuk portofolio",
    changeShape: "Bukan ini? Ganti bentuknya",
    change: "Ubah",
    done: "Simpan jawaban",
    footnote:
      "Bisa diubah kapan saja. Mengganti bentuk tidak menghapus satu pun isian yang sudah Anda tulis.",

    /* --- Fase 3: formulir item portofolio --- */
    shapeToggle: "Pakai bentuk portofolio",
    shapeToggleHint:
      "Bentuk isian mengikuti bidang Anda. Dimatikan, bagian ini kembali menjadi daftar proyek sederhana dan isian tambahannya tetap tersimpan.",
    headingLabel: "Judul bagian di CV",
    headingHint:
      "Judul baku lebih mungkin dikenali pembaca otomatis. Judul lain tetap terbaca, hanya tidak selalu terpetakan ke kolom yang benar.",
    mergeLabel: "Gabung ke Pengalaman Kerja",
    mergeHint:
      "Sebagian pembaca otomatis hanya mengenali proyek jika menempel pada pengalaman kerja. Aktifkan ini kalau proyek Anda punya pemberi kerja.",
    mergeOffer:
      "{n} dari {total} karya Anda punya pemberi kerja yang cocok dengan entri pengalaman kerja. Gabungkan?",
    mergeBefore: "Sebelum",
    mergeAfter: "Sesudah",
    mergePreviewSeparate: "Bagian tersendiri di bawah judulnya sendiri",
    mergePreviewNested: "Menempel di dalam entri pengalaman kerjanya",
    mergeAccept: "Gabungkan",
    mergeLater: "Nanti saja",
    parentLabel: "Menempel pada",
    parentNone: "Berdiri sendiri",
    parentDateWarn:
      "Tanggal item ini di luar rentang entri induknya. Perbaiki tanggalnya, atau lepaskan dari induk.",
    parentDetach: "Lepaskan dari induk",
    coreBlock: "Detail khas bidang",
    extraBlock: "Detail tambahan",
    privateBlock: "Verifikator & refleksi",
    privateBlockHint: "Keduanya tidak pernah dicetak di CV maupun ikut berkas ekspor.",
    addDetail: "Tambah detail",
    detailLabelPh: "Nama detail",
    detailValuePh: "Isinya",
    detailUnitPh: "Satuan",
    detailNotPrinted: "{n} detail tersimpan tapi tidak dicetak di CV.",
    detailMax: "Maksimal 6 detail. Yang dicetak hanya 4 prioritas teratas.",
    linksLabel: "Tautan",
    linksHint:
      "Maksimal dua. Yang tercetak teks polosnya, dan pranalanya menempel pada teks itu - keduanya, bukan salah satunya.",
    linkAdd: "Tambah tautan",
    linkLabelPh: "Label (opsional)",
    linkShortener:
      "Pemendek tautan tidak membawa kata kunci apa pun dan tidak terbaca manusia. Pakai URL aslinya.",
    verifierName: "Nama",
    verifierRole: "Jabatan",
    verifierRelation: "Hubungan dengan Anda",
    verifierNotice:
      "Data ini tidak dicetak di CV dan tidak dikirim ke mana pun. Simpan hanya bila Anda sudah izin ke orang tersebut.",
    reflectionLabel: "Refleksi",
    reflectionHint:
      "Apa yang Anda pelajari, apa yang akan Anda lakukan berbeda. Tidak dicetak di CV.",
    summaryLabel: "Ringkasan",
    summaryHint: "Satu kalimat, maksimal 160 karakter.",
    contextLabel: "Klien / institusi",
    contextHint:
      "Wajib. Tanpa pemberi kerja, tulis \"Proyek Mandiri\", \"Freelance\", atau nama kampusnya.",
    locationLabel: "Lokasi",
    fillExample: "Isi dengan contoh",
    hasNumber: "sudah ada angka",
    noNumber: "belum ada angka",
    archiveTitle: "Data dari bentuk portofolio sebelumnya",
    archiveRestore: "Pulihkan ke detail tambahan",
    shapeChangeWarn:
      "Mengganti bentuk akan menyembunyikan isian ini: {daftar}. Isinya tidak dihapus - ia kembali sendiri bila Anda memilih bentuk lamanya lagi.",
    itemRange: "Jumlah yang lazim untuk bentuk ini: {min}-{max} item.",
    itemRangeOpen: "Untuk bentuk ini, makin banyak makin baik. Minimal {min} item.",
    addItem: "Tambah",
    publicationExtra: "Kredit & indeksasi",
    credCategory: "Kategori kredensial",
    credCategoryHint:
      "Empat kategori dengan perlakuan berbeda: lisensi praktik adalah gerbang, kredensial berjenjang menentukan kelayakan paket pekerjaan, sertifikasi sektoral menempel pada jabatan, sertifikasi kompetensi melengkapi.",
    credValidity: "Masa berlaku",
    credValidityHint:
      "Pilih bentuknya dulu. Sebagian kredensial memang berlaku seumur hidup - STR Definitif salah satunya - jadi tanggal kedaluwarsa tidak pernah dipaksakan di sini.",
    credLevel: "Jenjang",
    credLevelPh: "Jenjang 7 - Ahli Muda",
    credClass: "Klasifikasi bidang",
    credClassPh: "Arsitektur",
    credSubType: "Jenis penerbit",
    credSubTypePh: "Vendor global / BNSP / bootcamp",
    credSuggest: "Kredensial yang lazim di bidang Anda",
    aggTitle: "Perolehan terhadap ambang resmi",
    aggChoose: "Profesi",
    aggChooseNone: "Belum dipilih",
    aggTotal: "Total terkumpul",
    aggOf: "dari",
    aggSource: "Sumber",
    aggUpdated: "diperiksa",
    aggDomain: "Perolehan per ranah",
    aggNoTotal: "Aturannya tidak menyebut angka total.",
    redactionLabel: "Mode Redaksi",
    redactionHint:
      "Mengganti nama klien dengan deskriptor bidangnya, dan angka pasti dengan rentang yang memuatnya. Berlaku di PDF, Word, dan teks.",
    redactionNote:
      "Berkas cadangan JSON tetap menyimpan angka aslinya - ia cadangan milik Anda sendiri, bukan berkas yang dikirim ke perusahaan.",
    redactionLimit:
      "Batasnya: yang dapat disamarkan hanya yang sudah diketahui aplikasi ini - nama di kolom Klien/institusi, dan angka. Nama itu ikut disapu dari kalimat Anda, tetapi nama lain yang hanya Anda tulis di dalam kalimat - rekan, atasan, anak perusahaan, nama produk - tidak dapat dikenali. Baca ulang berkasnya sendiri sebelum mengirim.",
    langTitle: "Periksa bahasa",
    langRequired:
      "Bentuk ini menuntut bahasa orang pertama. Badan penilai kompetensi memakainya untuk memisahkan pekerjaan Anda dari pekerjaan tim Anda.",
    langSuggest:
      "Bukan keharusan untuk bentuk ini, tapi kalimat orang pertama tetap lebih jelas bagi pembacanya.",
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
    btnJsonNote:
      "Berkas cadangan memuat seluruh isian Anda, kecuali nama verifikator - itu data orang lain, jadi tidak ikut ke berkas mana pun.",
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
    tabScore: "Kekuatan CV",
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
      "Diagram alur penggunaan, arsitektur, alur data, dan workflow pengembangan aplikasi CV ATS & Portofolio Builder - tersedia juga sebagai berkas gambar SVG dan PNG.",
    title: "Alur dan arsitektur",
    subtitle:
      "Empat diagram: bagaimana pengguna memakainya, bagaimana datanya mengalir, dan bagaimana perubahan kode sampai ke production. Perhatikan bahwa CV dan portofolio berbagi satu jalur data yang sama sampai ke tahap cetak - itu sebabnya sekali mengisi menghasilkan keduanya. Diagram di halaman ini dan berkas gambarnya dibangkitkan dari satu sumber yang sama, sehingga keduanya tidak mungkin bercerita berbeda.",
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
    heroBadge: "Gratis - tanpa tulisan tempelan - datanya tersimpan",
    heroTitleLine1: "Isi datanya sekali.",
    heroTitleLine2: "Jadi CV yang lolos mesin,",
    heroTitleLine3: "dan portofolio yang meyakinkan.",
    heroBody:
      "Lamaran Anda dibaca dua kali, oleh dua pembaca yang berbeda. Mesin membacanya lebih dulu, dan mesin itu gampang tersandung: CV dua kolom, tabel, atau tulisan di dalam gambar sering terbaca acak-acakan. Setelah itu manusia yang membacanya, dan yang ia cari bukan lagi kata kunci melainkan bukti Anda benar-benar bisa. Di sini keduanya disusun dari data yang sama - CV-nya dijaga tetap aman dibaca mesin, dan bagian portofolionya mengikuti bentuk pembuktian yang memang dipakai bidang Anda.",
    heroCtaNew: "Mulai Buat CV Saya",
    heroCtaDashboard: "Lanjutkan ke CV Saya",
    heroCtaCompare: "Cek dulu CV yang sudah saya punya",
    statSections: "bagian CV",
    statPatterns: "pola portofolio",
    statFields: "bidang di kamus",
    statFormats: "pilihan unduhan",
    statsPrompt: "Ketuk angkanya untuk tahu maksudnya.",
    statSectionsWhy:
      "Data pribadi, ringkasan, pengalaman kerja, pendidikan, keahlian, proyek, sertifikat, organisasi, penghargaan, bahasa, dan publikasi. Bagian yang tidak Anda isi tidak akan muncul di CV, jadi tidak perlu diisi semua.",
    statPatternsWhy:
      "Bidang yang berbeda membuktikan pekerjaan dengan cara yang berbeda. Karya & Desain butuh studi kasus bergambar; Proyek Teknis butuh standar dan skala; Publikasi & Kredit butuh sitasi dan indeksasi; Praktik & Pengajaran butuh volume dan lisensi; Dampak & Program butuh metrik. Bentuk isian portofolio mengikuti salah satunya, bukan satu formulir untuk semua orang.",
    statFieldsWhy:
      "Ketik jurusan atau profesi Anda - dari Teknik Sipil sampai Tata Boga - dan aplikasi memilihkan pola pembuktiannya sekaligus menyiapkan saran isian yang khas bidang itu, seperti nomor SNI untuk konstruksi.",
    statFormatsWhy:
      "PDF untuk dikirim ke perusahaan, Word kalau lowongannya minta .docx, teks polos untuk disalin-tempel ke formulir online, dan berkas cadangan supaya CV ini bisa dibuka lagi nanti.",
    heroCaption: "Contoh hasil jadi - desain Klasik",
    heroBadgeScore: "Nilai CV",
    heroBadgeGrade: "Nilai A",
    heroBadgeSaved: "Tersimpan otomatis",

    pillarsTitle: "Dua pilar, satu data",
    pillarsBody:
      "CV dan portofolio menjawab dua pertanyaan yang berbeda, dan dibaca dua pembaca yang berbeda. Anda mengisi datanya sekali; yang berbeda cuma cara data itu ditampilkan. Di bawah ini bedanya, supaya Anda tahu sedang butuh yang mana.",
    pillarCvTitle: "CV - tiket masuknya",
    pillarCvBody:
      "Dibaca mesin lebih dulu, lalu dilirik perekrut sekitar enam detik. Karena itu bentuknya dijaga ketat: satu kolom, tanpa tabel, tanpa gambar - apa pun desain yang Anda pilih. Isi kotaknya, lihat hasilnya di kertas seukuran aslinya, perbaiki mengikuti nilainya, lalu unduh.",
    pillarCvCta: "Susun CV saya",
    pillarFolioTitle: "Portofolio - buktinya",
    pillarFolioBody:
      "Dibaca manusia yang paham bidang Anda, pelan dan teliti. Isinya tiga sampai lima karya terkuat: apa masalahnya, apa yang Anda putuskan, dan hasilnya apa. Bentuk isiannya mengikuti cara bidang Anda membuktikan pekerjaan - arsitek tidak dinilai dengan tolok ukur yang sama dengan dosen.",
    pillarFolioNote:
      "Sekarang portofolio menyatu di dalam CV Anda sebagai bagian tersendiri, bukan berkas terpisah. Berkas portofolio yang berdiri sendiri belum ada - itu pekerjaan berikutnya.",
    pillarFolioCta: "Susun portofolio saya",
    pillarFolioCtaSignedIn: "Buka portofolio di CV saya",
    folioPreviewTitle: "Wujudnya seperti ini",
    folioPreviewBody:
      "Ini bukan gambar promosi - ini keluaran pencetak yang sama dengan yang menghasilkan PDF dan Word Anda. Bagian portofolio tercetak menyatu di CV, dengan baris Detail yang isinya mengikuti pola bidang Anda: standar, skala, tahap keterlibatan, dan perkakas untuk contoh teknik sipil di bawah ini.",
    folioPreviewCaption: "Contoh bagian portofolio pada pola Proyek Teknis, seperti yang tercetak hari ini",
    cmpColCv: "CV",
    cmpColFolio: "Portofolio",
    cmpReadLabel: "Dibaca",
    cmpReadCv: "Mesin dulu, lalu perekrut sekitar 6 detik",
    cmpReadFolio: "Manusia yang ahli di bidangnya - pelan dan teliti",
    cmpAnswerLabel: "Menjawab",
    cmpAnswerCv: "Pantas diwawancara?",
    cmpAnswerFolio: "Benar-benar bisa?",
    cmpFormLabel: "Bentuk",
    cmpFormCv: "Satu kolom, tanpa tabel, tanpa gambar",
    cmpFormFolio: "Bebas - boleh gambar dan studi kasus",
    cmpLengthLabel: "Panjang",
    cmpLengthCv: "1-2 halaman",
    cmpLengthFolio: "3-5 karya terkuat, dibahas mendalam",
    cmpScoreLabel: "Dinilai dari",
    cmpScoreCv: "Kata kunci dan keterbacaan mesin",
    cmpScoreFolio: "Kedalaman penalaran dan hasilnya",
    haveCvTitle: "Sudah punya CV dari tempat lain?",
    pathCompareTitle: "Cek CV yang sudah ada",
    pathCompareBody:
      "Punya CV lama dan penasaran nilainya? Unggah satu berkas untuk diperiksa, atau sampai lima sekaligus untuk diadu. Masing-masing dapat nilai, daftar kelebihan, dan daftar kekurangan lengkap dengan cara memperbaikinya - lalu kami sebutkan mana yang paling siap dikirim. Berkasnya diperiksa di HP atau komputer Anda sendiri, tidak pernah dikirim ke mana pun.",
    pathCompareCta: "Cek CV saya sekarang",

    stepsTitle: "Empat langkah, CV Anda jadi",
    stepsBody:
      "Tugas Anda cuma mengisi. Soal rapi-rapinya, penulisan tanggal, dan susunan yang aman dibaca mesin - biar kami yang urus.",
    step1Title: "Isi kotaknya satu per satu",
    step1Body:
      "Tidak ada halaman kosong yang bikin bengong. Tiap data punya kotaknya sendiri - jabatan, perusahaan, tanggal - dan di dalam tiap kotak sudah ada contoh isiannya.",
    step2Title: "Hasilnya langsung kelihatan",
    step2Body:
      "Kertas di sebelah kanan ikut berubah sambil Anda mengetik, dan bisa dilihat terpotong per halaman seperti di Word. Kotak yang sedang Anda isi ikut disorot di sana, jadi Anda tahu persis tulisan itu mendarat di mana.",
    step3Title: "Perbaiki mengikuti nilainya",
    step3Body:
      "CV Anda dinilai dari lima sisi, dan setiap kekurangan disebutkan lengkap dengan cara membetulkannya - bukan cuma dikasih angka lalu ditinggal bingung.",
    step4Title: "Unduh, lalu lamar",
    step4Body:
      "PDF dan Word siap dikirim ke perusahaan. Data Anda tetap tersimpan, jadi untuk lowongan berikutnya tinggal digandakan lalu diubah seperlunya.",

    featuresTitle: "Bedanya dengan template Word biasa",
    featuresBody:
      "Template Word cuma memberi Anda tampilan, lalu selesai. Di sini susunannya dijaga tetap terbaca mesin, hasilnya dinilai, dan datanya disimpan untuk dipakai lagi.",
    feature1Title: "Kotak isian, bukan halaman kosong",
    feature1Body:
      "11 bagian CV, masing-masing dengan kotak isian, petunjuk singkat, dan contoh nyata di dalamnya. Rapi-rapinya biar kami yang urus.",
    feature2Title: "Kertasnya seukuran aslinya",
    feature2Body:
      "Pilih A4, Letter, Legal, atau F4 - lalu lihat CV Anda memanjang tanpa putus atau terpotong per halaman, persis seperti hasil cetaknya nanti. Tidak ada kejutan saat dicetak.",
    feature3Title: "Tersimpan otomatis",
    feature3Body:
      "Tidak ada tombol Simpan yang harus diingat. Kurang dari satu detik setelah Anda berhenti mengetik, perubahannya sudah tersimpan. Tutup browser, buka lagi bulan depan, lanjut dari tempat terakhir.",
    feature4Title: "Nilai CV, lengkap dengan alasannya",
    feature4Body:
      "Dinilai dari lima sisi. Tiap saran perbaikan bisa diklik, dan Anda langsung dilempar ke kotak isian yang bermasalah.",
    feature5Title: "Dicocokkan dengan iklan lowongan",
    feature5Body:
      "Salin-tempel iklan lowongan yang Anda incar, lalu lihat kata penting mana yang diminta lowongan itu tapi belum ada di CV Anda.",
    feature6Title: "Data Anda milik Anda",
    feature6Body:
      "Unduh seluruh isi CV sebagai berkas cadangan kapan saja, buka lagi kapan saja, atau hapus akun beserta semua isinya sekaligus.",

    templatesTitle: "Sepuluh desain, satu susunan yang aman",
    templatesBody:
      "Semuanya satu kolom, tanpa tabel, dengan judul bagian yang baku - jadi tidak ada desain yang lebih berisiko terbaca kacau daripada yang lain. Yang berbeda cuma bentuk huruf, kerapatan, garis, dan letak pas foto. Ganti desain tidak mengubah data Anda sedikit pun.",
    templatesWithoutPhoto: "Tanpa pas foto",
    templatesWithPhoto: "Pakai pas foto",
    templatesPhotoNote:
      "Dua desain berfoto disediakan karena sebagian lowongan di Indonesia masih memintanya. Kalau lowongan Anda tidak minta, pilih yang tanpa foto saja - mesin penyaring tidak bisa melihat gambar.",

    faqTitle: "Yang sering ditanyakan",
    faqBody: "Termasuk hal-hal yang biasanya tidak diceritakan aplikasi sejenis.",

    ctaTitle: "Buat satu kali, pakai berkali-kali",
    ctaBody:
      "Data Anda tersimpan di akun. Untuk lowongan berikutnya, gandakan CV yang sudah ada lalu ubah seperlunya - tidak usah mulai dari halaman kosong lagi.",
    ctaButton: "Mulai Buat CV Saya",
    ctaButtonSignedIn: "Buka CV Saya",
    ctaNote: "Tanpa biaya, dan tidak ada tulisan tempelan di CV Anda.",
  },

  /* Pertanyaan yang sering muncul. Disimpan sebagai larik supaya urutan dan
     jumlahnya identik di kedua bahasa - TypeScript hanya memeriksa kunci,
     bukan panjang larik, jadi kesamaan ini dijaga saat menyunting. */
  faq: [
    {
      q: "Apa itu ATS, dan kenapa saya harus peduli?",
      a: "ATS adalah aplikasi yang dipakai banyak perusahaan untuk menampung dan menyaring lamaran yang masuk. Kepanjangannya Applicant Tracking System, tapi cukup bayangkan begini: sebelum CV Anda dilihat manusia, ada mesin yang membacanya lebih dulu dan mencomot datanya - nama, kontak, pengalaman, keahlian. Mesin ini gampang tersandung. CV dua kolom, CV bertabel, atau CV yang tulisannya ada di dalam gambar sering terbaca acak-acakan, dan pengalaman yang sebenarnya Anda punya jadi tidak terbaca sama sekali. Bukan karena Anda kurang layak - cuma karena berkasnya tidak terbaca.",
    },
    {
      q: "CV dari sini dijamin lolos, dong?",
      a: "Tidak, dan sebaiknya curigai siapa pun yang menjanjikan itu. Tiap perusahaan pakai aplikasi penyaring yang berbeda, dan cara kerjanya tidak pernah dibuka ke publik. Yang bisa kami lakukan - dan kami lakukan - adalah memastikan CV Anda memenuhi aturan yang berlaku umum: satu kolom, tanpa tabel, judul bagian yang baku, penulisan tanggal yang seragam, dan tulisan yang benar-benar berupa tulisan, bukan gambar. Nilai yang muncul di sini artinya \"sudah memenuhi yang kami periksa\", bukan \"pasti diterima\".",
    },
    {
      q: "CV saya sebaiknya berapa halaman?",
      a: "Satu. Itu panjang yang pas untuk hampir semua pelamar, termasuk yang sudah lama bekerja. Perekrut melirik satu CV dalam hitungan detik, jadi apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah dibaca. Dua halaman baru sepadan kalau pengalaman Anda lebih dari lima tahun dan semuanya nyambung dengan lowongan yang dituju. Dan kalau CV Anda kepanjangan, yang dipangkas isinya - bukan ukuran hurufnya dikecil-kecilkan.",
    },
    {
      q: "Pakai ukuran kertas apa?",
      a: "A4, dan itu sudah jadi pilihan bawaan di sini - jadi Anda tidak perlu mengubah apa pun. A4 adalah ukuran standar di Indonesia dan hampir seluruh dunia. Letter cuma perlu kalau Anda melamar ke perusahaan di Amerika Serikat atau Kanada. Legal dan F4 cuma kalau instansi yang dituju secara khusus memintanya.",
    },
    {
      q: "Gratis? Beneran tidak ada biaya tersembunyi?",
      a: "Beneran gratis. Tidak ada versi berbayar, tidak ada batas berapa CV yang boleh dibuat, tidak ada tulisan tempelan di CV yang Anda unduh, dan Anda tidak akan pernah dimintai nomor kartu.",
    },
    {
      q: "Nanti ada logo atau nama aplikasi ini di CV saya?",
      a: "Tidak ada. CV yang Anda unduh isinya murni data Anda sendiri - tanpa logo, tanpa tulisan tempelan, tanpa nama aplikasi maupun pembuatnya. Itu dokumen Anda, bukan iklan kami.",
    },
    {
      q: "CV yang saya unggah buat dicek, disimpan di server kalian?",
      a: "Tidak - dan bukan cuma tidak disimpan, tapi memang tidak pernah dikirim ke mana pun. Berkasnya dibaca dan dinilai langsung di HP atau komputer Anda sendiri. Tutup halamannya, semuanya hilang. Itu juga sebabnya fitur ini bisa dipakai tanpa bikin akun.",
    },
    {
      q: "Kalau browser saya tutup, data saya hilang tidak?",
      a: "Tidak hilang - untuk CV yang Anda susun sambil masuk ke akun. Setiap perubahan tersimpan sendiri kurang dari satu detik setelah Anda berhenti mengetik, jadi tidak ada tombol Simpan yang bisa lupa ditekan. Masuk lagi kapan saja dari perangkat mana saja, CV Anda masih di sana. Mau lebih aman lagi? Unduh berkas cadangannya dan simpan sendiri.",
    },
    {
      q: "Kenapa CV sebaiknya tanpa pas foto?",
      a: "Karena mesin penyaring tidak bisa melihat gambar, dan susunan di sekitar foto sering membuat urutan tulisannya jadi kacau saat dibaca mesin. Di banyak negara, foto juga sengaja dihindari supaya penilaian tidak terpengaruh penampilan. Meski begitu, dua desain berfoto tetap kami sediakan - sebagian lowongan di Indonesia memang masih memintanya - dan Anda akan diingatkan saat menyalakannya.",
    },
    {
      q: "Boleh punya lebih dari satu CV?",
      a: "Boleh, malah sangat disarankan. CV yang paling berhasil adalah yang disesuaikan untuk tiap lowongan. Pakai tombol gandakan, lalu ubah ringkasan dan urutan keahliannya supaya nyambung dengan lowongan yang dituju. Jauh lebih cepat daripada mulai dari nol.",
    },
  ],

  /* ------------------------------------------------------- pembanding CV */
  compare: {
    shapeGuess: "Tebakan bentuk portofolio",
    shapeGuessHint:
      "Tebakan dari kata-kata di CV-nya, bukan dari isian terstruktur - jadi ini tawaran, bukan penilaian. Anda yang memutuskan.",
    shapeGuessAccept: "Pakai bentuk ini",
    shapeGuessUsing: "Dinilai sebagai",
    shapeGuessNone: "Bentuknya belum bisa ditebak dari isi CV ini.",
    shapeMismatch:
      "CV yang dibandingkan berbeda bentuk portofolionya ({daftar}). Nilainya tetap dihitung dengan aturan yang sama, tapi bukti yang dituntut tiap bentuk memang berbeda - bandingkan dengan itu dalam pikiran.",
    shapeMatched: "Seluruh CV yang dibandingkan berbentuk sama: {nama}.",
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

  /* -------------------------------------------------------- panel penilaian */
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
      "Nilai akhir dihitung dari hal-hal di bawah ini. Tidak semuanya berpengaruh sama besar - persentase di samping tiap baris menunjukkan seberapa besar pengaruhnya.",
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
    strengthTitle: "Kekuatan & Keterbacaan",
    strengthHint:
      "Kelengkapan struktur, keterbacaan mesin, mutu isi, dan kekuatan bukti karya.",
    matchTitle: "Kecocokan Lowongan",
    matchHint:
      "Berapa persen kata penting dari iklan lowongan yang benar-benar ada di CV Anda.",
    matchEmpty: "Belum ditempel",
    scoreDisclaimer:
      "Angka ini menilai struktur dan kecocokan kata kunci CV Anda. Ia tidak memprediksi keputusan sistem perekrutan mana pun - tiap perusahaan menyetel filternya sendiri.",
    weightChanged:
      "Bobot penilaian berubah karena bagian portofolio aktif. Nilai dengan bobot sebelumnya: {n}.",
    buktiTitle: "Rincian kekuatan bukti",
    buktiHint:
      "Tiap karya dinilai dari dua hal: peranan Anda (Q) dan tingkat kesulitannya (R), masing-masing 0-3.",
    buktiQ: "Peranan",
    buktiR: "Kesulitan",
    buktiItems: "karya dinilai",
    buktiFew: "di bawah jumlah yang lazim, nilainya dipotong sebanding",
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
    dashboard: "Dokumen Saya",
    login: "Masuk",
    register: "Daftar Gratis",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    mainNav: "Utama",
    mobileNav: "Utama (ponsel)",
    settingsGroup: "Tampilan",
    breadcrumb: "Anda sedang di sini",
    backHome: "Kembali ke beranda",
    backDashboard: "Kembali ke daftar dokumen saya",
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
    errorSteps: "Yang bisa Anda lakukan sekarang:",
    errorStep1: "Muat ulang halaman ini - tekan tombol di bawah, atau F5.",
    errorStep2:
      "Kalau masih sama setelah dimuat ulang, tunggu sebentar lalu coba lagi. Gangguan sambungan ke basis data biasanya pulih sendiri.",
    errorReload: "Muat ulang halaman",
    errorStepDev:
      "Mode pengembangan: pastikan basis data lokal hidup (npm run db:dev), lalu nyalakan ulang server web. Basis data yang mati lalu hidup lagi menjadi proses baru, dan server web masih memegang koneksi ke proses lama.",
    errorCodeHint:
      "Kode di bawah ini untuk ditunjukkan bila Anda melaporkannya - tidak perlu Anda pahami.",
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
