import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { LegalPage } from "@/components/LegalPage";
import { AUTHOR, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Data apa saja yang dikumpulkan aplikasi ini, untuk apa dipakai, di mana disimpan, dan bagaimana cara Anda mengunduh atau menghapusnya.",
};

export default async function PrivasiPage() {
  const session = await auth();

  return (
    <LegalPage
      badge="Kebijakan Privasi"
      title="Data Anda, dan apa yang kami lakukan dengannya"
      intro="Ditulis sesingkat dan sejelas mungkin, tanpa bahasa hukum yang berbelit. Ringkasnya: data Anda dipakai untuk menjalankan aplikasi ini, tidak dijual, tidak dibagikan untuk iklan, dan dapat Anda unduh atau hapus kapan saja."
      updatedAt="2 September 2026"
      signedIn={Boolean(session?.user?.id)}
    >
      <h2>1. Siapa yang mengelola aplikasi ini</h2>
      <p>
        {SITE.name} dikelola oleh <strong>{AUTHOR.name}</strong>, {AUTHOR.role}{" "}
        di {AUTHOR.institution}. Aplikasi ini dibangun sebagai Tugas Akhir dan
        disediakan gratis, bukan sebagai produk komersial.
      </p>
      <p>
        Pertanyaan mengenai data Anda dapat disampaikan melalui alamat surel
        yang tercantum pada bagian 9.
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
              Hanya disimpan sebagai hasil pengacakan satu arah (bcrypt).
              Kata sandi asli tidak pernah disimpan dan tidak dapat dibaca
              kembali oleh siapa pun, termasuk pengelola
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
              <strong>Penghitung percobaan masuk</strong>
            </td>
            <td>Saat mendaftar atau masuk</td>
            <td>
              Membatasi percobaan berulang agar akun tidak mudah ditebak
              kata sandinya
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Yang tidak dikumpulkan</h3>
      <ul>
        <li>Tidak ada layanan analitik, pelacak, maupun piksel iklan.</li>
        <li>
          Tidak ada cookie pelacak. Satu-satunya cookie yang dipasang adalah
          penanda sesi, yang diperlukan agar Anda tetap dalam keadaan masuk.
        </li>
        <li>Tidak ada data lokasi, kontak, kamera, maupun mikrofon.</li>
        <li>
          Tidak ada data pembayaran, karena aplikasi ini tidak memungut biaya.
        </li>
      </ul>

      <h2>3. Di mana data disimpan</h2>
      <p>
        Data disimpan pada basis data PostgreSQL yang dikelola{" "}
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

      <h2>4. Data tidak dijual dan tidak dibagikan</h2>
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

      <h2>5. Berapa lama data disimpan</h2>
      <p>
        Selama akun Anda masih ada. Begitu Anda menghapus akun, seluruh CV
        beserta isinya terhapus permanen dari basis data pada saat itu juga -
        bukan sekadar disembunyikan.
      </p>

      <h2>6. Hak Anda atas data Anda</h2>
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

      <h2>7. Keamanan</h2>
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

      <h2>8. Anak di bawah umur</h2>
      <p>
        Aplikasi ini ditujukan bagi pencari kerja dan pelajar yang menyusun CV.
        Layanan ini tidak ditujukan bagi anak di bawah 13 tahun, dan tidak
        mengumpulkan data mereka dengan sengaja.
      </p>

      <h2>9. Menghubungi pengelola</h2>
      <p>
        Pertanyaan, permintaan penghapusan data, atau laporan masalah keamanan
        dapat dikirim ke <strong>riyadhzaky05@gmail.com</strong>.
      </p>

      <h2>10. Perubahan kebijakan</h2>
      <p>
        Bila kebijakan ini berubah, tanggal &quot;terakhir diperbarui&quot; di
        bagian atas halaman ikut diperbarui. Perubahan yang berdampak besar
        akan diberitahukan di dalam aplikasi.
      </p>

      <p>
        Lihat juga{" "}
        <Link href="/ketentuan">Ketentuan Layanan</Link> dan{" "}
        <Link href="/tentang">Tentang Aplikasi</Link>.
      </p>
    </LegalPage>
  );
}
