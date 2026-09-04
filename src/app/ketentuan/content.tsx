import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { AUTHOR, SITE } from "@/lib/site";

/** Isi ketentuan layanan. Lihat catatan bentuk di privasi/content.tsx. */

export const TERMS_META: Record<
  Locale,
  { badge: string; title: string; intro: string; updatedAt: string }
> = {
  id: {
    badge: "Ketentuan Layanan",
    title: "Aturan pemakaian aplikasi ini",
    intro:
      "Ringkasnya: aplikasi ini gratis dan disediakan apa adanya, isi CV sepenuhnya tanggung jawab Anda, dan nilai yang ditampilkan bukan jaminan diterima kerja.",
    updatedAt: "2 September 2026",
  },
  en: {
    badge: "Terms of Service",
    title: "The rules for using this app",
    intro:
      "In short: this app is free and provided as-is, the content of your CV is entirely your responsibility, and the numbers shown are not a guarantee of being hired.",
    updatedAt: "2 September 2026",
  },
};

function TermsId() {
  return (
    <>
      <h2>1. Tentang layanan ini</h2>
      <p>
        {SITE.name} adalah aplikasi web untuk menyusun CV yang ramah sistem
        pembaca lamaran otomatis (ATS), sekaligus memindai dan membandingkan CV
        yang sudah ada. Aplikasi ini dibangun oleh{" "}
        <strong>{AUTHOR.name}</strong>.
      </p>
      <p>
        Dengan memakai aplikasi ini, Anda dianggap menyetujui ketentuan di
        halaman ini.
      </p>

      <h2>2. Gratis, tanpa jaminan ketersediaan</h2>
      <p>
        Layanan ini gratis sepenuhnya - tidak ada versi berbayar, tidak ada
        batas jumlah CV, dan tidak ada watermark pada berkas yang Anda unduh.
      </p>
      <p>
        Sebagai konsekuensinya, layanan disediakan <strong>apa adanya</strong>,
        tanpa jaminan bahwa aplikasi akan selalu dapat diakses. Aplikasi
        berjalan di atas layanan gratis pihak ketiga dan dapat mengalami
        gangguan atau dihentikan sewaktu-waktu.
      </p>
      <p>
        <strong>Karena itu, simpanlah cadangan CV Anda sendiri.</strong> Tombol{" "}
        <em>JSON</em> di editor mengunduh seluruh isi CV Anda dalam satu berkas,
        dan berkas PDF maupun Word yang sudah diunduh tetap menjadi milik Anda
        meski aplikasi ini suatu saat tidak lagi tersedia.
      </p>

      <h2>3. Akun Anda</h2>
      <ul>
        <li>
          Gunakan alamat surel yang benar-benar Anda miliki dan dapat Anda
          akses.
        </li>
        <li>
          Jaga kerahasiaan kata sandi Anda. Segala aktivitas yang terjadi
          melalui akun Anda menjadi tanggung jawab Anda.
        </li>
        <li>
          Pemulihan kata sandi lewat surel belum tersedia. Bila alamat surel
          Anda sama dengan akun Google, Anda dapat masuk lewat Google lalu
          membuat kata sandi baru di menu Pengaturan.
        </li>
        <li>
          Anda dapat menghapus akun kapan saja. Penghapusan bersifat permanen
          dan tidak dapat dibatalkan.
        </li>
      </ul>
      <p>
        Fitur membandingkan CV dapat dipakai tanpa akun, karena berkasnya
        memang tidak pernah dikirim ke server.
      </p>

      <h2>4. Isi CV adalah tanggung jawab Anda</h2>
      <p>
        Anda bertanggung jawab penuh atas kebenaran seluruh data yang Anda
        tuliskan. Aplikasi ini tidak memverifikasi riwayat pendidikan,
        pengalaman kerja, sertifikasi, maupun keahlian yang Anda cantumkan.
      </p>
      <p>
        Mencantumkan keterangan yang tidak benar dalam CV dapat berakibat serius
        pada proses lamaran kerja Anda, dan itu berada di luar kendali maupun
        tanggung jawab aplikasi ini.
      </p>

      <h2>5. Berkas yang Anda bandingkan</h2>
      <p>
        Berkas CV yang Anda unggah pada halaman{" "}
        <Link href="/bandingkan">Bandingkan CV</Link> diproses sepenuhnya di
        dalam peramban Anda dan tidak dikirim ke server mana pun.
      </p>
      <p>
        Meski begitu, Anda tetap bertanggung jawab atas berkas yang Anda buka di
        sana. Bila berkas tersebut memuat data pribadi milik orang lain,
        pastikan Anda memang berhak memegangnya.
      </p>

      <h2>6. Yang tidak diperbolehkan</h2>
      <ul>
        <li>
          Mengunggah atau menyimpan data pribadi milik orang lain tanpa izin
          dari yang bersangkutan.
        </li>
        <li>
          Memakai layanan ini untuk kegiatan yang melanggar hukum, menipu, atau
          memalsukan identitas.
        </li>
        <li>
          Mencoba mengakses akun atau data pengguna lain, atau menguji keamanan
          sistem tanpa izin.
        </li>
        <li>
          Membebani layanan secara berlebihan, misalnya lewat permintaan
          otomatis dalam jumlah besar.
        </li>
      </ul>
      <p>
        Akun yang melanggar ketentuan di atas dapat dihentikan tanpa
        pemberitahuan terlebih dahulu.
      </p>

      <h2>7. Nilai yang ditampilkan bukan jaminan</h2>
      <p>
        Penilaian di aplikasi ini memeriksa apakah CV Anda memenuhi kaidah yang
        umum berlaku pada sistem pembaca lamaran: satu kolom, tanpa tabel, judul
        bagian baku, format tanggal seragam, dan teks yang benar-benar berupa
        teks.
      </p>
      <p>
        Aplikasi ini <strong>tidak</strong> mensimulasikan produk ATS tertentu.
        Setiap perusahaan memakai perangkat lunak berbeda dengan cara pengurai
        yang tidak dipublikasikan. Skor tinggi berarti CV Anda memenuhi kaidah
        yang diperiksa - <strong>bukan</strong> jaminan lolos seleksi, dipanggil
        wawancara, atau diterima bekerja.
      </p>
      <p>
        Hal yang sama berlaku pada hasil perbandingan: CV yang memperoleh skor
        tertinggi berarti paling memenuhi kaidah yang diperiksa, bukan
        dipastikan paling cocok untuk lowongan yang Anda tuju. Penilaian ini
        membaca teks, bukan memahami maknanya.
      </p>
      <p>
        Saran perbaikan yang ditampilkan bersifat umum dan tidak menggantikan
        nasihat karier dari orang yang memahami bidang Anda.
      </p>

      <h2>8. Berkas yang Anda unduh</h2>
      <p>
        Berkas PDF, Word, teks, dan JSON yang dihasilkan aplikasi ini sepenuhnya
        milik Anda. Tidak ada logo, watermark, nama aplikasi, maupun nama
        pembuat yang dibubuhkan pada berkas tersebut - CV adalah dokumen milik
        pelamar.
      </p>

      <h2>9. Kepemilikan aplikasi</h2>
      <p>
        Kode program, rancangan antarmuka, dan aturan penilaian di dalam
        aplikasi ini merupakan karya {AUTHOR.name}. Isi CV yang Anda tuliskan
        tetap sepenuhnya milik Anda.
      </p>

      <h2>10. Batasan tanggung jawab</h2>
      <p>
        Sejauh diizinkan hukum yang berlaku, pengelola tidak bertanggung jawab
        atas kerugian yang timbul dari pemakaian atau ketidaktersediaan layanan
        ini - termasuk namun tidak terbatas pada kehilangan data, kegagalan
        proses lamaran kerja, atau hilangnya kesempatan kerja.
      </p>

      <h2>11. Perubahan ketentuan</h2>
      <p>
        Ketentuan ini dapat diperbarui sewaktu-waktu. Tanggal &quot;terakhir
        diperbarui&quot; di bagian atas halaman menunjukkan versi yang berlaku.
      </p>

      <h2>12. Hukum yang berlaku</h2>
      <p>Ketentuan ini tunduk pada hukum Republik Indonesia.</p>

      <p>
        Lihat juga <Link href="/privasi">Kebijakan Privasi</Link> dan{" "}
        <Link href="/tentang">Tentang Aplikasi</Link>.
      </p>
    </>
  );
}

function TermsEn() {
  return (
    <>
      <h2>1. About this service</h2>
      <p>
        {SITE.name} is a web app for building CVs that automated applicant
        screening systems (ATS) can read, and for scanning and comparing CVs you
        already have. It was built by <strong>{AUTHOR.name}</strong>.
      </p>
      <p>By using this app, you are taken to accept the terms on this page.</p>

      <h2>2. Free, with no availability guarantee</h2>
      <p>
        The service is entirely free - no paid tier, no limit on how many CVs
        you keep, and no watermark on anything you download.
      </p>
      <p>
        As a consequence, the service is provided <strong>as-is</strong>, with
        no guarantee that it will always be reachable. It runs on free
        third-party services and may suffer outages or be discontinued at any
        time.
      </p>
      <p>
        <strong>So keep your own backup.</strong> The <em>JSON</em> button in
        the editor downloads your whole CV in a single file, and any PDF or Word
        file you have already downloaded remains yours even if this app one day
        disappears.
      </p>

      <h2>3. Your account</h2>
      <ul>
        <li>Use an email address you genuinely own and can access.</li>
        <li>
          Keep your password to yourself. Everything done through your account
          is your responsibility.
        </li>
        <li>
          Password recovery by email is not available yet. If your address
          matches a Google account, you can sign in with Google and then set a
          new password under Settings.
        </li>
        <li>
          You can delete your account at any time. Deletion is permanent and
          cannot be undone.
        </li>
      </ul>
      <p>
        The CV comparison feature works without an account, because those files
        are never sent to a server in the first place.
      </p>

      <h2>4. The content of your CV is your responsibility</h2>
      <p>
        You are fully responsible for the accuracy of everything you write. This
        app does not verify education, employment history, certifications, or
        skills.
      </p>
      <p>
        Putting untrue statements in a CV can have serious consequences for your
        application, and that lies outside this app&apos;s control and
        responsibility.
      </p>

      <h2>5. Files you compare</h2>
      <p>
        CV files you upload on the{" "}
        <Link href="/bandingkan">Compare CVs</Link> page are processed entirely
        inside your browser and are not sent to any server.
      </p>
      <p>
        You remain responsible for the files you open there. If one contains
        another person&apos;s personal data, make sure you are entitled to hold
        it.
      </p>

      <h2>6. What is not allowed</h2>
      <ul>
        <li>
          Uploading or storing another person&apos;s personal data without their
          permission.
        </li>
        <li>
          Using this service for anything unlawful, fraudulent, or involving
          impersonation.
        </li>
        <li>
          Attempting to reach another user&apos;s account or data, or testing
          the system&apos;s security without permission.
        </li>
        <li>
          Placing excessive load on the service, for example through large
          volumes of automated requests.
        </li>
      </ul>
      <p>
        Accounts that breach the above may be terminated without prior notice.
      </p>

      <h2>7. The numbers shown are not a guarantee</h2>
      <p>
        The scoring in this app checks whether your CV follows the conventions
        that hold generally across applicant screening systems: one column, no
        tables, standard section headings, consistent dates, and text that
        really is text.
      </p>
      <p>
        This app does <strong>not</strong> simulate any specific ATS product.
        Every employer uses different software with an unpublished parser. A
        high score means your CV satisfies the checked rules -{" "}
        <strong>not</strong> that you will pass screening, be invited to
        interview, or be hired.
      </p>
      <p>
        The same applies to comparison results: the highest-scoring CV is the
        one that best satisfies the checked rules, not certainly the best fit
        for the role you are targeting. This scoring reads text; it does not
        understand meaning.
      </p>
      <p>
        The suggestions shown are general and do not replace career advice from
        someone who knows your field.
      </p>

      <h2>8. Files you download</h2>
      <p>
        The PDF, Word, text, and JSON files this app produces are entirely
        yours. No logo, watermark, app name, or author name is added to them -
        a CV is the applicant&apos;s own document.
      </p>

      <h2>9. Ownership of the app</h2>
      <p>
        The source code, interface design, and scoring rules in this app are the
        work of {AUTHOR.name}. The CV content you write remains entirely yours.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the extent permitted by applicable law, the operator is not liable
        for loss arising from the use or unavailability of this service -
        including but not limited to data loss, a failed job application, or a
        missed employment opportunity.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        These terms may be updated from time to time. The &quot;last
        updated&quot; date at the top of the page shows the version in force.
      </p>

      <h2>12. Governing law</h2>
      <p>These terms are governed by the law of the Republic of Indonesia.</p>

      <p>
        See also <Link href="/privasi">Privacy Policy</Link> and{" "}
        <Link href="/tentang">About</Link>.
      </p>
    </>
  );
}

export const TERMS_BODY: Record<Locale, ReactNode> = {
  id: <TermsId />,
  en: <TermsEn />,
};
