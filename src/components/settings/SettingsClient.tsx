"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useI18n } from "@/components/i18n";
import { Button, Callout, Card, Field, Input, Spinner } from "@/components/ui";

export function SettingsClient({
  email,
  initialName,
  hasPassword,
  resumeCount,
}: {
  email: string;
  initialName: string;
  hasPassword: boolean;
  resumeCount: number;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = React.useState(initialName);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<{
    tone: "good" | "bad";
    text: string;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

  async function submit(key: string, body: Record<string, unknown>) {
    setBusy(key);
    setNotice(null);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setNotice({ tone: "bad", text: payload.error ?? t.settings.saveFailed });
        return false;
      }
      setNotice({ tone: "good", text: t.settings.saved });
      router.refresh();
      return true;
    } catch {
      setNotice({ tone: "bad", text: t.settings.offline });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function deleteAccount() {
    setBusy("delete");
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) {
        setNotice({ tone: "bad", text: t.settings.deleteFailed });
        setBusy(null);
        return;
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      setNotice({ tone: "bad", text: t.settings.offline });
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-5 py-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          {resumeCount} {t.settings.savedCount}
        </p>
      </div>

      {notice && <Callout tone={notice.tone}>{notice.text}</Callout>}

      {/* Identitas ------------------------------------------------------- */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-900">
          {t.settings.identityTitle}
        </h2>

        <div className="mt-4 space-y-4">
          <Field label={t.settings.emailLabel} hint={t.settings.emailLocked}>
            <Input value={email} disabled />
          </Field>

          <Field label={t.settings.nameLabel}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Button
            onClick={() => submit("name", { name })}
            disabled={busy === "name" || !name.trim() || name === initialName}
          >
            {busy === "name" && <Spinner />}
            {t.settings.saveName}
          </Button>
        </div>
      </Card>

      {/* Kata sandi ------------------------------------------------------ */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-ink-900">
          {hasPassword
            ? t.settings.passwordChangeTitle
            : t.settings.passwordCreateTitle}
        </h2>
        {!hasPassword && (
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            {t.settings.passwordGoogleNote}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {hasPassword && (
            <Field label={t.settings.passwordCurrent}>
              <Input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Field>
          )}

          <Field
            label={t.settings.passwordNew}
            hint={t.settings.passwordHint}
          >
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>

          <Button
            onClick={async () => {
              const ok = await submit("password", {
                currentPassword,
                newPassword,
              });
              if (ok) {
                setCurrentPassword("");
                setNewPassword("");
              }
            }}
            disabled={busy === "password" || newPassword.length < 8}
          >
            {busy === "password" && <Spinner />}
            {t.settings.passwordSave}
          </Button>
        </div>
      </Card>

      {/* Hapus akun ------------------------------------------------------ */}
      <Card className="border-red-200 p-5">
        <h2 className="text-sm font-semibold text-bad">
          {t.settings.dangerTitle}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-ink-600">
          {t.settings.dangerBody}
        </p>

        {confirmDelete ? (
          <div className="mt-4 space-y-3">
            <Field
              label={t.settings.dangerConfirmLabel}
              hint={t.settings.dangerConfirmHint}
            >
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t.settings.dangerConfirmWord}
              />
            </Field>
            <div className="flex gap-2">
              <Button
                variant="danger"
                onClick={deleteAccount}
                disabled={
                  deleteConfirmText !== t.settings.dangerConfirmWord ||
                  busy === "delete"
                }
              >
                {busy === "delete" && <Spinner />}
                {t.settings.dangerButton}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                {t.common.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmDelete(true)}
          >
            {t.settings.dangerStart}
          </Button>
        )}
      </Card>
    </div>
  );
}
