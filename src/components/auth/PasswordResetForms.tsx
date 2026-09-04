"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n";
import { Button, Callout, Field, Input, Spinner } from "@/components/ui";

/**
 * Dua formulir pemulihan kata sandi: meminta tautan, dan memakainya.
 *
 * Keduanya di satu berkas karena memang satu alur - yang kedua tidak pernah
 * dibuka tanpa melewati yang pertama, dan pesan galat keduanya saling
 * merujuk.
 */

/* -------------------------------------------------------------------------- */
/* Meminta tautan                                                             */
/* -------------------------------------------------------------------------- */

export function ForgotPasswordForm({
  enabled,
  googleEnabled,
}: {
  /** Apakah pemasangan ini benar-benar dapat mengirim surel. */
  enabled: boolean;
  /** Dipakai hanya saat surel belum aktif - lihat di bawah. */
  googleEnabled: boolean;
}) {
  const { t, locale } = useI18n();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? t.auth.forgotFailed);
        setBusy(false);
        return;
      }

      setSent(true);
    } catch {
      setError(t.auth.forgotOffline);
    }
    setBusy(false);
  }

  /*
    Pemasangan tanpa layanan surel tidak menampilkan formulirnya sama sekali.
    Kotak isian yang tidak akan pernah mengirim apa pun lebih buruk daripada
    penjelasan jujur: pengguna akan menunggu surel yang tidak ada.
  */
  if (!enabled) {
    return (
      <div>
        <h1 className="text-xl font-bold text-ink-900">
          {t.auth.forgotTitle}
        </h1>
        <div className="mt-4">
          {/*
            Dua penjelasan, karena jalan keluarnya memang berbeda. Bila
            tombol Google ada, pemilik akun masih punya jalan masuk yang sah
            dan tinggal diberi tahu jalannya. Bila tidak ada, ia benar-benar
            tidak punya jalan - dan kalimat yang menyuruhnya memakai Google
            akan mengirimnya ke tombol yang tidak ada di layar.
          */}
          <Callout tone="info">
            {googleEnabled ? t.auth.forgotViaGoogle : t.auth.forgotNoGoogle}
          </Callout>
        </div>
        <p className="mt-5 text-center text-xs text-ink-600">
          <Link
            href="/login"
            className="font-semibold text-ink-900 underline"
          >
            {t.auth.backToLogin}
          </Link>
        </p>
      </div>
    );
  }

  if (sent) {
    return (
      <div>
        <h1 className="text-xl font-bold text-ink-900">{t.auth.sentTitle}</h1>
        {/*
          Yang ditulis di sini "kalau alamatnya terdaftar", bukan "sudah
          dikirim". Titik akhirnya sengaja menjawab sama bagi alamat yang ada
          maupun yang tidak, supaya tidak dapat dipakai memeriksa siapa saja
          yang punya akun - dan kalimat yang berpura-pura pasti akan membuat
          orang yang salah ketik alamatnya menunggu tanpa ujung.
        */}
        <p className="mt-3 text-sm leading-relaxed text-ink-600">
          {t.auth.sentBody}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-ink-500">
          {t.auth.sentSpam}
        </p>
        <p className="mt-5 text-center text-xs text-ink-600">
          <Link href="/login" className="font-semibold text-ink-900 underline">
            {t.auth.backToLogin}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900">{t.auth.forgotTitle}</h1>
      <p className="mt-1.5 text-sm text-ink-600">{t.auth.forgotSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label={t.auth.emailLabel} htmlFor="forgot-email" required>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPh}
          />
        </Field>

        {error && <Callout tone="bad">{error}</Callout>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Spinner />}
          {t.auth.forgotSubmit}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-600">
        <Link href="/login" className="font-semibold text-ink-900 underline">
          {t.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Memakai tautan                                                             */
/* -------------------------------------------------------------------------- */

export function ResetPasswordForm() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Diperiksa di sini lebih dulu supaya salah ketik tidak menghabiskan
    // tiketnya: begitu permintaan berhasil, tautannya langsung hangus.
    if (password !== confirm) {
      setError(t.auth.resetMismatch);
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? t.auth.resetFailed);
        setBusy(false);
        return;
      }

      // Kata sandi baru sudah berlaku, tetapi pengguna belum masuk - sesi
      // hanya lahir dari halaman masuk. Diarahkan ke sana beserta pesan
      // bahwa penggantiannya berhasil.
      router.push("/login?sandi=baru");
    } catch {
      setError(t.auth.forgotOffline);
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="text-xl font-bold text-ink-900">{t.auth.resetTitle}</h1>
        <div className="mt-4">
          <Callout tone="bad">{t.auth.resetNoToken}</Callout>
        </div>
        <p className="mt-5 text-center text-xs text-ink-600">
          <Link
            href="/lupa-sandi"
            className="font-semibold text-ink-900 underline"
          >
            {t.auth.forgotSubmit}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-ink-900">{t.auth.resetTitle}</h1>
      <p className="mt-1.5 text-sm text-ink-600">{t.auth.resetSubtitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field
          label={t.auth.resetNew}
          htmlFor="reset-password"
          hint={t.auth.passwordHint}
          required
        >
          <Input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <Field label={t.auth.resetConfirm} htmlFor="reset-confirm" required>
          <Input
            id="reset-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        {error && <Callout tone="bad">{error}</Callout>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Spinner />}
          {t.auth.resetSubmit}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-600">
        <Link href="/login" className="font-semibold text-ink-900 underline">
          {t.auth.backToLogin}
        </Link>
      </p>
    </div>
  );
}
