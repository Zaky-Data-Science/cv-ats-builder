"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/components/i18n";
import { Button, Callout, Field, Input, Spinner } from "@/components/ui";

/**
 * Formulir masuk dan daftar.
 *
 * Keduanya berbagi tombol Google dan gaya penanganan galat yang sama,
 * sehingga ditempatkan pada satu berkas agar perubahan pada alur autentikasi
 * cukup dilakukan di satu tempat.
 */

function GoogleButton({ disabled }: { disabled?: boolean }) {
  const { t } = useI18n();

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={disabled}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#4285F4"
          d="M45 24c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.9-1.5 4.7-4.4 6.6l6.7 5.2C42.2 35.5 45 30.3 45 24z"
        />
        <path
          fill="#34A853"
          d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8.1 41 15.4 46 24 46z"
        />
        <path
          fill="#FBBC05"
          d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z"
        />
        <path
          fill="#EA4335"
          d="M24 10.4c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.2 29.9 2 24 2 15.4 2 8.1 7 4.4 14.1l7.1 5.5C13.3 14.2 18.2 10.4 24 10.4z"
        />
      </svg>
      {t.auth.google}
    </Button>
  );
}

function Divider() {
  const { t } = useI18n();

  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-ink-200" />
      <span className="text-[11px] font-medium text-ink-400">
        {t.auth.divider}
      </span>
      <span className="h-px flex-1 bg-ink-200" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Masuk                                                                      */
/* -------------------------------------------------------------------------- */

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(
    params.get("error") ? t.auth.signInFailed : null,
  );
  /*
    Pengguna yang tiba di sini karena sesinya sudah tidak berlaku perlu tahu
    mengapa - tanpa penjelasan, ia hanya melihat dirinya tiba-tiba terlempar
    keluar dan akan menyangka aplikasinya rusak.
  */
  const sesiHabis = params.get("sesi") === "habis";
  const [busy, setBusy] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);

  const justRegistered = params.get("registered") === "1";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      // Pesan sengaja tidak membedakan "email tidak ada" dan "sandi salah",
      // agar tidak dapat dipakai untuk menebak email mana yang terdaftar.
      setError(t.auth.invalidCredentials);
      setBusy(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-bold text-ink-900">{t.auth.loginTitle}</h1>
      <p className="mt-1 text-sm text-ink-600">{t.auth.loginSubtitle}</p>

      {justRegistered && (
        <div className="mt-4">
          <Callout tone="good">{t.auth.registeredNotice}</Callout>
        </div>
      )}

      {googleEnabled && (
        <>
          <div className="mt-5">
            <GoogleButton disabled={busy} />
          </div>
          <Divider />
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className={googleEnabled ? "space-y-4" : "mt-5 space-y-4"}
      >
        <Field label={t.auth.emailLabel} htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPh}
          />
        </Field>

        <Field label={t.auth.passwordLabel} htmlFor="password" required>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        {/*
          Jalan pulang bagi yang lupa kata sandinya sengaja dijelaskan di sini,
          bukan disembunyikan di halaman bantuan. Halaman masuk adalah
          satu-satunya tempat orang menyadari dirinya lupa - mengarahkannya ke
          tempat lain berarti menuntut ia mencari sendiri jawaban yang muat
          dalam satu paragraf.
        */}
        <div className="-mt-1">
          <button
            type="button"
            className="text-xs text-ink-600 underline hover:text-ink-900"
            aria-expanded={forgotOpen}
            onClick={() => setForgotOpen((open) => !open)}
          >
            {t.auth.forgotPassword}
          </button>
          {forgotOpen && (
            <div className="mt-2">
              <Callout tone="info">
                {googleEnabled ? t.auth.forgotViaGoogle : t.auth.forgotNoGoogle}
              </Callout>
            </div>
          )}
        </div>

        {sesiHabis && !error && (
          <Callout tone="warn">{t.auth.sessionStale}</Callout>
        )}
        {error && <Callout tone="bad">{error}</Callout>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Spinner />}
          {t.auth.submitLogin}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-600">
        {t.auth.toRegister}{" "}
        <Link href="/register" className="font-semibold text-ink-900 underline">
          {t.auth.toRegisterLink}
        </Link>
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Daftar                                                                     */
/* -------------------------------------------------------------------------- */

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? t.auth.registerFailed);
      setBusy(false);
      return;
    }

    // Langsung masuk setelah pendaftaran berhasil agar pengguna tidak perlu
    // mengetik ulang kredensial yang baru saja dibuatnya.
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login?registered=1");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-bold text-ink-900">
        {t.auth.registerTitle}
      </h1>
      <p className="mt-1 text-sm text-ink-600">{t.auth.registerSubtitle}</p>

      {googleEnabled && (
        <>
          <div className="mt-5">
            <GoogleButton disabled={busy} />
          </div>
          <Divider />
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className={googleEnabled ? "space-y-4" : "mt-5 space-y-4"}
      >
        <Field label={t.auth.nameLabel} htmlFor="name" required>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.auth.namePh}
          />
        </Field>

        <Field label={t.auth.emailLabel} htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPh}
          />
        </Field>

        <Field
          label={t.auth.passwordLabel}
          htmlFor="password"
          required
          hint={t.auth.passwordHint}
        >
          <Input
            id="password"
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

        {error && <Callout tone="bad">{error}</Callout>}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Spinner />}
          {t.auth.submitRegister}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-600">
        {t.auth.toLogin}{" "}
        <Link href="/login" className="font-semibold text-ink-900 underline">
          {t.auth.toLoginLink}
        </Link>
      </p>
    </div>
  );
}
