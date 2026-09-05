import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { AUTHOR, SITE } from "@/lib/site";

/**
 * Isi kebijakan privasi, satu berkas per bahasa di dalam satu modul.
 *
 * Ditulis sebagai komponen, bukan sebagai deretan kunci kamus, karena
 * dokumen hukum berisi tabel, tautan, dan penekanan yang menyatu dengan
 * kalimatnya. Memecahnya menjadi potongan-potongan teks justru membuatnya
 * lebih sulit dibaca ulang saat isinya perlu diperbarui - dan dokumen yang
 * sulit dibaca ulang adalah dokumen yang lambat diperbaiki.
 */

export const PRIVACY_META: Record<
  Locale,
  { badge: string; title: string; intro: string; updatedAt: string }
> = {
  id: {
    badge: "Kebijakan Privasi",
    title: "Data Anda, dan apa yang kami lakukan dengannya",
    intro:
      "Ditulis sesingkat dan sejelas mungkin, tanpa bahasa hukum yang berbelit. Ringkasnya: data Anda dipakai untuk menjalankan aplikasi ini, tidak dijual, tidak dibagikan untuk iklan, dan dapat Anda unduh atau hapus kapan saja.",
    updatedAt: "2 September 2026",
  },
  en: {
    badge: "Privacy Policy",
    title: "Your data, and what we do with it",
    intro:
      "Written as short and as plainly as possible, without convoluted legal language. In short: your data is used to run this app, it is not sold, it is not shared for advertising, and you can download or delete it at any time.",
    updatedAt: "2 September 2026",
  },
};

const CONTACT_EMAIL = "riyadhzaky05@gmail.com";

function PrivacyId() {
  return (
    <>
      <h2>1. Siapa yang mengelola aplikasi ini</h2>
      <p>
        {SITE.name} dikelola oleh <strong>{AUTHOR.name}</strong>, {AUTHOR.role},{" "}
        {AUTHOR.department}, {AUTHOR.institution}. Aplikasi ini disediakan gratis dan bukan
        produk komersial.
      </p>
      <p>
        Pertanyaan mengenai data Anda dapat disampaikan melalui alamat surel
        yang tercantum pada bagian 10.
      </p>

      <h2>2. Data yang dikumpulkan</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Kapan dikumpulkan</th>
            <th>Untuk apa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Nama dan alamat surel</strong>
            </td>
            <td>Saat Anda mendaftar</td>
            <td>Mengenali akun Anda dan menampilkan nama di antarmuka</td>
          </tr>
          <tr>
            <td>
              <strong>Kata sandi</strong>
            </td>
            <td>Saat Anda mendaftar dengan surel</td>
            <td>
              Hanya disimpan sebagai hasil pengacakan satu arah (bcrypt). Kata
              sandi asli tidak pernah disimpan dan tidak dapat dibaca kembali
              oleh siapa pun, termasuk pengelola
            </td>
          </tr>
          <tr>
            <td>
              <strong>Nama, surel, dan foto profil Google</strong>
            </td>
            <td>Hanya bila Anda memilih masuk dengan Google</td>
            <td>
              Mengenali akun Anda. Aplikasi ini tidak meminta akses ke Gmail,
              Drive, Kontak, maupun layanan Google lainnya
            </td>
          </tr>
          <tr>
            <td>
              <strong>Seluruh isi CV yang Anda ketik</strong>
            </td>
            <td>Saat Anda mengisi editor</td>
            <td>
              Menyimpan CV agar dapat Anda buka dan edit kembali, serta
              menghasilkan berkas PDF, Word, teks, dan JSON
            </td>
          </tr>
          <tr>
            <td>
              <strong>Riwayat skor ATS</strong>
            </td>
            <td>Hanya saat Anda menekan &quot;Simpan Hasil ke Riwayat&quot;</td>
            <td>Menampilkan perkembangan skor CV Anda dari waktu ke waktu</td>
          </tr>
          <tr>
            <td>
              <strong>Pilihan bahasa dan mode tampilan</strong>
            </td>
            <td>Saat Anda mengubahnya</td>
            <td>
              Bahasa disimpan di cookie agar halaman dari server sudah datang
              dalam bahasa yang benar; mode terang/gelap disimpan di peramban
              Anda sendiri dan tidak pernah dikirim ke server
            </td>
          </tr>
          <tr>
            <td>
              <strong>Penghitung percobaan masuk</strong>
            </td>
            <td>Saat mendaftar atau masuk</td>
            <td>
              Membatasi percobaan berulang agar akun tidak mudah ditebak kata
              sandinya
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Yang tidak dikumpulkan</h3>
      <ul>
        <li>Tidak ada layanan analitik, pelacak, maupun piksel iklan.</li>
        <li>
          Tidak ada cookie pelacak. Cookie yang dipasang hanya dua: penanda
          sesi agar Anda tetap dalam keadaan masuk, dan pilihan bahasa
          antarmuka.
        </li>
        <li>Tidak ada data lokasi, kontak, kamera, maupun mikrofon.</li>
        <li>
          Tidak ada data pembayaran, karena aplikasi ini tidak memungut biaya.
        </li>
      </ul>

      <h2>3. Berkas CV yang Anda bandingkan</h2>
      <p>
        Berkas yang Anda unggah pada halaman{" "}
        <Link href="/bandingkan">Bandingkan CV</Link>{" "}
        <strong>tidak pernah dikirim ke server mana pun</strong>, termasuk
        server aplikasi ini. Berkasnya dibuka, dibaca, dan dinilai sepenuhnya
        di dalam peramban Anda sendiri.
      </p>
      <p>
        Karena itu tidak ada yang disimpan, tidak ada yang dapat kami lihat,
        dan tidak ada yang perlu dihapus - menutup halaman tersebut sudah
        menghapus semuanya dari memori peramban. Fitur ini juga sengaja dapat
        dipakai tanpa membuat akun.
      </p>

      <h2>4. Di mana data disimpan</h2>
      <p>
        Data akun dan isi CV yang Anda susun di dalam aplikasi ini disimpan
        pada basis data PostgreSQL yang dikelola{" "}
        <a href="https://neon.tech" rel="noopener noreferrer" target="_blank">
          Neon
        </a>{" "}
        dengan lokasi peladen di <strong>Singapura</strong>. Aplikasinya
        sendiri berjalan di{" "}
        <a href="https://vercel.com" rel="noopener noreferrer" target="_blank">
          Vercel
        </a>
        . Keduanya adalah penyedia infrastruktur - mereka menyimpan dan
        menjalankan data atas nama aplikasi ini, bukan memakainya untuk
        keperluan sendiri.
      </p>
      <p>
        Seluruh sambungan memakai HTTPS. CV Anda hanya dapat diakses melalui
        akun Anda sendiri: setiap permintaan data memeriksa kepemilikan
        langsung pada kueri basis data, sehingga CV milik pengguna lain
        dinyatakan tidak ditemukan.
      </p>

      <h2>5. Data tidak dijual dan tidak dibagikan</h2>
      <p>
        Isi CV Anda tidak dijual, tidak disewakan, tidak dibagikan ke pengiklan,
        dan tidak dipakai untuk melatih model kecerdasan buatan apa pun.
        Penilaian ATS di aplikasi ini berjalan sepenuhnya dengan aturan yang
        tertulis di dalam kodenya - isi CV Anda tidak pernah dikirim ke layanan
        kecerdasan buatan mana pun.
      </p>
      <p>
        Data hanya akan diserahkan kepada pihak lain apabila diwajibkan oleh
        hukum yang berlaku.
      </p>

      <h2>6. Berapa lama data disimpan</h2>
      <p>
        Selama akun Anda masih ada. Begitu Anda menghapus akun, seluruh CV
        beserta isinya terhapus permanen dari basis data pada saat itu juga -
        bukan sekadar disembunyikan.
      </p>

      <h2>7. Hak Anda atas data Anda</h2>
      <ul>
        <li>
          <strong>Mengunduh.</strong> Tombol <em>JSON</em> di editor mengunduh
          seluruh isi CV Anda dalam bentuk berkas yang dapat dibaca manusia dan
          diimpor kembali kapan saja.
        </li>
        <li>
          <strong>Mengubah.</strong> Seluruh isi CV dapat diubah kapan saja
          lewat editor.
        </li>
        <li>
          <strong>Menghapus.</strong> Menu <em>Pengaturan</em> menyediakan
          penghapusan akun beserta seluruh datanya secara permanen.
        </li>
      </ul>
      <p>
        Karena penghapusan bersifat permanen, sebaiknya unduh cadangan JSON
        terlebih dahulu.
      </p>

      <h2>8. Keamanan</h2>
      <ul>
        <li>Kata sandi disimpan sebagai hash bcrypt 12 putaran.</li>
        <li>
          Penautan akun Google hanya dilakukan bila Google telah memverifikasi
          kepemilikan alamat surel tersebut.
        </li>
        <li>
          Percobaan masuk dibatasi 8 kali per 15 menit untuk setiap alamat
          surel.
        </li>
        <li>
          Seluruh masukan diperiksa di sisi peladen sebelum menyentuh basis
          data.
        </li>
      </ul>
      <p>
        Meski demikian, tidak ada sistem yang sepenuhnya kebal. Gunakan kata
        sandi yang tidak Anda pakai di layanan lain.
      </p>

      <h2>9. Anak di bawah umur</h2>
      <p>
        Aplikasi ini ditujukan bagi pencari kerja dan pelajar yang menyusun CV.
        Layanan ini tidak ditujukan bagi anak di bawah 13 tahun, dan tidak
        mengumpulkan data mereka dengan sengaja.
      </p>

      <h2>10. Menghubungi pengelola</h2>
      <p>
        Pertanyaan, permintaan penghapusan data, atau laporan masalah keamanan
        dapat dikirim ke <strong>{CONTACT_EMAIL}</strong>.
      </p>

      <h2>11. Perubahan kebijakan</h2>
      <p>
        Bila kebijakan ini berubah, tanggal &quot;terakhir diperbarui&quot; di
        bagian atas halaman ikut diperbarui. Perubahan yang berdampak besar
        akan diberitahukan di dalam aplikasi.
      </p>

      <p>
        Lihat juga <Link href="/ketentuan">Ketentuan Layanan</Link> dan{" "}
        <Link href="/tentang">Tentang Aplikasi</Link>.
      </p>
    </>
  );
}

function PrivacyEn() {
  return (
    <>
      <h2>1. Who runs this app</h2>
      <p>
        {SITE.name} is run by <strong>{AUTHOR.name}</strong>, {AUTHOR.role},{" "}
        {AUTHOR.department}, {AUTHOR.institution}. It is provided free of charge and is not a
        commercial product.
      </p>
      <p>
        Questions about your data can be sent to the email address in section
        10.
      </p>

      <h2>2. Data that is collected</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>When it is collected</th>
            <th>What for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Name and email address</strong>
            </td>
            <td>When you sign up</td>
            <td>To identify your account and show your name in the interface</td>
          </tr>
          <tr>
            <td>
              <strong>Password</strong>
            </td>
            <td>When you sign up with an email address</td>
            <td>
              Stored only as a one-way hash (bcrypt). The password itself is
              never stored and cannot be read back by anyone, including the
              operator
            </td>
          </tr>
          <tr>
            <td>
              <strong>Google name, email, and profile picture</strong>
            </td>
            <td>Only if you choose to sign in with Google</td>
            <td>
              To identify your account. This app does not request access to
              Gmail, Drive, Contacts, or any other Google service
            </td>
          </tr>
          <tr>
            <td>
              <strong>Everything you type into a CV</strong>
            </td>
            <td>As you fill in the editor</td>
            <td>
              To store the CV so you can open and edit it again, and to produce
              the PDF, Word, text, and JSON files
            </td>
          </tr>
          <tr>
            <td>
              <strong>ATS score history</strong>
            </td>
            <td>Only when you press &quot;Save this result&quot;</td>
            <td>To show how your CV score changes over time</td>
          </tr>
          <tr>
            <td>
              <strong>Language and appearance preference</strong>
            </td>
            <td>When you change them</td>
            <td>
              The language is stored in a cookie so pages arrive from the server
              already in the right language; the light/dark mode is stored in
              your own browser and never sent to the server
            </td>
          </tr>
          <tr>
            <td>
              <strong>Sign-in attempt counter</strong>
            </td>
            <td>When signing up or signing in</td>
            <td>
              To limit repeated attempts so accounts are not easily guessed
            </td>
          </tr>
        </tbody>
      </table>

      <h3>What is not collected</h3>
      <ul>
        <li>No analytics service, tracker, or advertising pixel.</li>
        <li>
          No tracking cookies. Only two cookies are set: the session marker that
          keeps you signed in, and your interface language.
        </li>
        <li>No location, contacts, camera, or microphone data.</li>
        <li>No payment details, because the app charges nothing.</li>
      </ul>

      <h2>3. The CV files you compare</h2>
      <p>
        Files you upload on the{" "}
        <Link href="/bandingkan">Compare CVs</Link> page are{" "}
        <strong>never sent to any server</strong>, including this app&apos;s.
        They are opened, read, and scored entirely inside your own browser.
      </p>
      <p>
        Because of that, nothing is stored, nothing can be seen by us, and there
        is nothing to delete - closing the page already clears it all from the
        browser&apos;s memory. This is also why the feature deliberately works
        without an account.
      </p>

      <h2>4. Where data is stored</h2>
      <p>
        Account data and the CVs you build inside this app are stored in a
        PostgreSQL database managed by{" "}
        <a href="https://neon.tech" rel="noopener noreferrer" target="_blank">
          Neon
        </a>
        , with servers located in <strong>Singapore</strong>. The application
        itself runs on{" "}
        <a href="https://vercel.com" rel="noopener noreferrer" target="_blank">
          Vercel
        </a>
        . Both are infrastructure providers - they store and run the data on
        this app&apos;s behalf rather than using it for their own purposes.
      </p>
      <p>
        All connections use HTTPS. Your CV is reachable only through your own
        account: every data request checks ownership in the database query
        itself, so another user&apos;s CV is reported as not found.
      </p>

      <h2>5. Data is not sold or shared</h2>
      <p>
        Your CV content is not sold, rented, shared with advertisers, or used to
        train any artificial intelligence model. The ATS scoring in this app
        runs entirely on rules written into its own code - your CV content is
        never sent to any AI service.
      </p>
      <p>
        Data would only be handed to a third party where required by applicable
        law.
      </p>

      <h2>6. How long data is kept</h2>
      <p>
        For as long as your account exists. As soon as you delete your account,
        every CV and everything in it is permanently removed from the database
        at that moment - not merely hidden.
      </p>

      <h2>7. Your rights over your data</h2>
      <ul>
        <li>
          <strong>Download.</strong> The <em>JSON</em> button in the editor
          downloads your entire CV as a human-readable file that can be imported
          back at any time.
        </li>
        <li>
          <strong>Change.</strong> Everything in a CV can be edited at any time.
        </li>
        <li>
          <strong>Delete.</strong> The <em>Settings</em> page offers permanent
          deletion of your account and all of its data.
        </li>
      </ul>
      <p>
        Because deletion is permanent, download a JSON backup first.
      </p>

      <h2>8. Security</h2>
      <ul>
        <li>Passwords are stored as bcrypt hashes with 12 rounds.</li>
        <li>
          A Google account is linked only once Google has verified ownership of
          that email address.
        </li>
        <li>
          Sign-in attempts are limited to 8 per 15 minutes per email address.
        </li>
        <li>
          Every input is validated on the server before it touches the database.
        </li>
      </ul>
      <p>
        Even so, no system is completely immune. Use a password you do not reuse
        elsewhere.
      </p>

      <h2>9. Children</h2>
      <p>
        This app is intended for job seekers and students writing a CV. It is
        not directed at children under 13 and does not knowingly collect their
        data.
      </p>

      <h2>10. Contacting the operator</h2>
      <p>
        Questions, deletion requests, or security reports can be sent to{" "}
        <strong>{CONTACT_EMAIL}</strong>.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        If this policy changes, the &quot;last updated&quot; date at the top of
        the page changes with it. Significant changes will be announced inside
        the app.
      </p>

      <p>
        See also <Link href="/ketentuan">Terms of Service</Link> and{" "}
        <Link href="/tentang">About</Link>.
      </p>
    </>
  );
}

export const PRIVACY_BODY: Record<Locale, ReactNode> = {
  id: <PrivacyId />,
  en: <PrivacyEn />,
};
