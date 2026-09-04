"use client";

/*
  Barisan angka di bawah tombol utama halaman depan.

  Angka telanjang seperti "11" dan "5" tidak menjelaskan apa pun sendirian -
  keterangan dua kata di bawahnya ("bagian CV", "hal yang dinilai") menyebutkan
  namanya, bukan artinya. Karena itu tiap angka dapat disentuh, dan penjelasan
  utuhnya muncul dalam satu kalimat biasa.

  Penjelasannya ditaruh di **satu tempat di bawah barisan**, bukan di bawah
  masing-masing angka. Empat penjelasan sekaligus akan mengubah barisan angka
  ini menjadi blok teks, dan pada kolom selebar tujuh puluh piksel di layar
  ponsel kalimatnya akan pecah menjadi belasan baris.

  Tempat itu sudah menyediakan ruangnya sejak awal (`min-h`), sehingga
  memunculkan penjelasan tidak menggeser apa pun yang ada di bawahnya.
*/

import * as React from "react";
import { CountUp } from "@/components/motion";
import { cn } from "@/lib/utils";

export type HeroStat = {
  to: number;
  label: string;
  /** Penjelasan utuh, muncul saat angkanya disentuh atau dihampiri kursor. */
  explain: string;
};

export function HeroStats({
  stats,
  prompt,
}: {
  stats: HeroStat[];
  /** Kalimat ajakan yang tampil selama belum ada angka yang dipilih. */
  prompt: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);

  return (
    <div className="mt-10 max-w-lg">
      <dl className="grid grid-cols-2 gap-y-6 border-t border-ink-200 pt-6 sm:grid-cols-4 sm:gap-y-0">
        {stats.map((stat, i) => (
          /*
            Garis pemisah dipasang per butir, bukan lewat `divide-x` pada
            wadahnya. Pada susunan 2x2, `divide-x` menaruh garis di kiri butir
            ketiga - yaitu di tepi luar kolom pertama, tempat yang tidak
            memisahkan apa pun. Nomor butirnya dibawa serta supaya garisnya
            hanya muncul di antara.
          */
          <div
            key={stat.label}
            className={cn(
              i % 2 === 1 && "border-l border-ink-200",
              "sm:border-l sm:first:border-l-0",
            )}
          >
            <button
              type="button"
              /*
                Kursor yang lewat sudah cukup di perangkat bertetikus. Di layar
                sentuh peristiwa ini tidak pernah terjadi, dan di sanalah
                ketukan mengambil alih - tombol yang sama melayani keduanya
                tanpa satu pun pemeriksaan perangkat.
              */
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive((now) => (now === i ? null : i))}
              aria-expanded={active === i}
              className={cn(
                /*
                  Angka dan keterangannya rata tengah terhadap satu sama lain.
                  Rata kiri membuat angka satu digit ("5") tampak melayang jauh
                  dari tengah keterangannya yang panjang - dan pada butir
                  pertama, yang dulu tidak berpadding kiri, seolah terlempar
                  keluar barisan.
                */
                "tap-target flex w-full cursor-pointer flex-col items-center px-2 text-center transition-opacity sm:px-4",
                active !== null && active !== i && "opacity-50",
              )}
            >
              <dt className="text-2xl font-bold tabular-nums text-ink-900 sm:text-3xl">
                <CountUp to={stat.to} />
              </dt>
              <dd
                className={cn(
                  "mt-1 text-[11px] leading-tight underline decoration-dotted underline-offset-4",
                  active === i ? "text-ink-800" : "text-ink-500",
                )}
              >
                {stat.label}
              </dd>
            </button>
          </div>
        ))}
      </dl>

      {/*
        Prompt dan keempat penjelasan ditumpuk pada satu sel grid yang sama.
        Tinggi wadahnya karena itu selalu setinggi isi terpanjang, berapa pun
        lebar layarnya - sehingga memunculkan penjelasan tidak menggeser apa
        pun di bawahnya, dan tidak ada satu pun angka tinggi yang perlu
        ditebak lalu meleset saat kalimatnya suatu saat diubah.

        Yang tidak sedang tampil disembunyikan dengan `invisible`, bukan
        `hidden`: ruangnya justru yang dibutuhkan di sini.
      */}
      <div aria-live="polite" className="mt-4 grid text-xs leading-relaxed">
        {[prompt, ...stats.map((s) => s.explain)].map((text, i) => {
          const shown = i === 0 ? active === null : active === i - 1;
          return (
            <p
              key={i}
              aria-hidden={!shown}
              className={cn(
                "col-start-1 row-start-1",
                i === 0 ? "text-ink-400 italic" : "text-ink-600",
                !shown && "invisible",
              )}
            >
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
