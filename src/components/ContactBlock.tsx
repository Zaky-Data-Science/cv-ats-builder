"use client";

import { Mail, MessageCircle } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { AUTHOR, WHATSAPP_URL } from "@/lib/site";

/**
 * ============================================================================
 *  BLOK KONTAK
 * ============================================================================
 *
 * Satu komponen yang dipakai kaki halaman dan halaman Tentang. Bukan demi
 * ringkas: dua salinan blok kontak adalah cara paling pasti membuat salah satu
 * halaman menyebut alamat yang sudah tidak dipakai lagi, dan yang menemukannya
 * adalah orang yang mengirim pesan ke alamat itu lalu tidak pernah dibalas.
 *
 * Tiga hal yang dikatakan blok ini, dan masing-masing ada alasannya:
 *
 *  1. **Untuk apa.** Tautan telanjang tanpa keterangan membuat orang menebak
 *     apakah boleh menghubungi, dan sebagian besar memilih tidak jadi.
 *  2. **Berapa lama.** Dikelola satu orang, jadi balasannya tidak selalu
 *     cepat. Mengatakannya lebih baik daripada membuat orang menunggu tanpa
 *     kabar lalu menyimpulkan pesannya diabaikan.
 *  3. **Kanalnya diberi label.** "Surel" dan "WhatsApp", bukan alamat yang
 *     berdiri sendiri.
 *
 * **Nomor WhatsApp sengaja tidak dicetak angkanya** - lihat komentar di
 * `site.ts`. Yang tampil tautan "Chat WhatsApp"; bagi manusia fungsinya sama,
 * bagi perayap yang memanen nomor, nomornya tidak ada di halaman.
 */
export function ContactBlock({ className = "" }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={className}>
      <h2 className="text-xs font-semibold text-ink-900">
        {t.contact.heading}
      </h2>

      <p className="mt-2 text-xs leading-relaxed text-ink-600">
        {t.contact.purpose}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">
        {t.contact.expectation}
      </p>

      <ul className="mt-3 space-y-2 text-xs">
        <li className="flex items-center gap-2">
          <Mail size={14} className="shrink-0 text-ink-400" aria-hidden />
          <span className="text-ink-500">{t.contact.emailLabel}</span>
          <a
            href={`mailto:${AUTHOR.email}`}
            aria-label={t.contact.emailAria}
            className="press tap-target text-ink-700 underline-offset-2 hover:text-ink-900 hover:underline"
          >
            {AUTHOR.email}
          </a>
        </li>

        <li className="flex items-center gap-2">
          <MessageCircle
            size={14}
            className="shrink-0 text-ink-400"
            aria-hidden
          />
          <span className="text-ink-500">{t.contact.waLabel}</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.contact.waAria}
            className="press tap-target text-ink-700 underline-offset-2 hover:text-ink-900 hover:underline"
          >
            {t.contact.waAction}
          </a>
        </li>
      </ul>
    </div>
  );
}
