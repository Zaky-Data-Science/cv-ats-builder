import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { LegalPage } from "@/components/LegalPage";
import { AUTHOR, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ketentuan Layanan",
  description:
    "Aturan pemakaian aplikasi: apa yang disediakan, apa yang menjadi tanggung jawab pengguna, dan batasan yang perlu diketahui.",
};

export default async function KetentuanPage() {
  const session = await auth();

  return (
    <LegalPage
      badge="Ketentuan Layanan"
      title="Aturan pemakaian aplikasi ini"
      intro="Ringkasnya: aplikasi ini gratis, disediakan apa adanya sebagai Tugas Akhir, isi CV sepenuhnya tanggung jawab Anda, dan skor ATS bukan jaminan diterima kerja."
      updatedAt="2 September 2026"
      signedIn={Boolean(session?.user?.id)}
    >
      <h2>1. Tentang layanan ini</h2>
      <p>
        {SITE.name} adalah aplikasi web untuk menyusun CV yang ramah sistem
        pembaca lamaran otomatis (ATS). Aplikasi ini dibangun oleh{" "}
        <strong>{AUTHOR.name}</strong> sebagai Tugas Akhir {AUTHOR.role} di{" "}
        {AUTHOR.institution}.
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
        Sebagai konsekuensinya, layanan disediakan{" "}
        <strong>apa adanya</strong>, tanpa jaminan bahwa aplikasi akan selalu
        dapat diakses. Aplikasi berjalan di atas layanan gratis pihak ketiga
        dan dapat mengalami gangguan, atau dihentikan sewaktu-waktu setelah
        keperluan akademiknya selesai.
      </p>
      <p>
        <strong>
          Karena itu, simpanlah cadangan CV Anda sendiri.
        </strong>{" "}
        Tombol <em>JSON</em> di editor mengunduh seluruh isi CV Anda dalam satu
        berkas, dan berkas PDF maupun Word yang sudah diunduh tetap menjadi
        milik Anda meski aplikasi ini suatu saat tidak lagi tersedia.
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

      <h2>4. Isi CV adalah tanggung jawab Anda</h2>
      <p>
        Anda bertanggung jawab penuh atas kebenaran seluruh data yang Anda
        tuliskan. Aplikasi ini tidak memverifikasi riwayat pendidikan,
        pengalaman kerja, sertifikasi, maupun keahlian yang Anda cantumkan.
      </p>
      <p>
        Mencantumkan keterangan yang tidak benar dalam CV dapat berakibat
        serius pada proses lamaran kerja Anda, dan itu berada di luar kendali
        maupun tanggung jawab aplikasi ini.
      </p>

      <h2>5. Yang tidak diperbolehkan</h2>
      <ul>
        <li>
          Mengunggah data pribadi milik orang lain tanpa izin dari yang
          bersangkutan.
        </li>
        <li>
          Memakai layanan ini untuk kegiatan yang melanggar hukum, menipu, atau
          memalsukan identitas.
        </li>
        <li>
          Mencoba mengakses akun atau data pengguna lain, atau menguji
          keamanan sistem tanpa izin.
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

      <h2>6. Skor ATS bukan jaminan</h2>
      <p>
        Penilaian di aplikasi ini memeriksa apakah CV Anda memenuhi kaidah yang
        umum berlaku pada sistem pembaca lamaran: satu kolom, tanpa tabel,
        judul bagian baku, format tanggal seragam, dan teks yang benar-benar
        berupa teks.
      </p>
      <p>
        Aplikasi ini <strong>tidak</strong> mensimulasikan produk ATS tertentu.
        Setiap perusahaan memakai perangkat lunak berbeda dengan cara pengurai
        yang tidak dipublikasikan. Skor tinggi berarti CV Anda memenuhi kaidah
        yang diperiksa - <strong>bukan</strong> jaminan lolos seleksi, dipanggil
        wawancara, atau diterima bekerja.
      </p>
      <p>
        Saran perbaikan yang ditampilkan bersifat umum dan tidak menggantikan
        nasihat karier dari orang yang memahami bidang Anda.
      </p>

      <h2>7. Berkas yang Anda unduh</h2>
      <p>
        Berkas PDF, Word, teks, dan JSON yang dihasilkan aplikasi ini
        sepenuhnya milik Anda. Tidak ada logo, watermark, nama aplikasi, maupun
        nama pembuat yang dibubuhkan pada berkas tersebut - CV adalah dokumen
        milik pelamar.
      </p>

      <h2>8. Kepemilikan aplikasi</h2>
      <p>
        Kode program, rancangan antarmuka, dan aturan penilaian di dalam
        aplikasi ini merupakan karya {AUTHOR.name}. Isi CV yang Anda tuliskan
        tetap sepenuhnya milik Anda.
      </p>

      <h2>9. Batasan tanggung jawab</h2>
      <p>
        Sejauh diizinkan hukum yang berlaku, pengelola tidak bertanggung jawab
        atas kerugian yang timbul dari pemakaian atau ketidaktersediaan
        layanan ini - termasuk namun tidak terbatas pada kehilangan data,
        kegagalan proses lamaran kerja, atau hilangnya kesempatan kerja.
      </p>

      <h2>10. Perubahan ketentuan</h2>
      <p>
        Ketentuan ini dapat diperbarui sewaktu-waktu. Tanggal &quot;terakhir
        diperbarui&quot; di bagian atas halaman menunjukkan versi yang berlaku.
      </p>

      <h2>11. Hukum yang berlaku</h2>
      <p>
        Ketentuan ini tunduk pada hukum Republik Indonesia.
      </p>

      <p>
        Lihat juga{" "}
        <Link href="/privasi">Kebijakan Privasi</Link> dan{" "}
        <Link href="/tentang">Tentang Aplikasi</Link>.
      </p>
    </LegalPage>
  );
}
