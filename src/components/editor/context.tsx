"use client";

import * as React from "react";
import type { ResumeData } from "@/lib/resume/types";

/**
 * Konteks editor.
 *
 * Seluruh form section membaca dan menulis satu objek ResumeData yang sama.
 * Karena preview di sebelah kanan juga membaca objek itu, setiap penekanan
 * tombol langsung terlihat hasilnya - inilah yang membuat pengguna tahu
 * field yang sedang ia isi akan muncul di bagian mana pada CV.
 */
export interface EditorContextValue {
  data: ResumeData;
  /** Memperbarui sebagian isi CV. */
  update: (patch: Partial<ResumeData>) => void;
  /** Blok preview yang sedang disorot, mis. "experience:abc". */
  highlight: string | null;
  setHighlight: (key: string | null) => void;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

export function EditorProvider({
  value,
  children,
}: {
  value: EditorContextValue;
  children: React.ReactNode;
}) {
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor(): EditorContextValue {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor harus dipakai di dalam EditorProvider.");
  }
  return context;
}

/**
 * Membantu memperbarui satu entri di dalam sebuah array tanpa mengubah
 * array aslinya - syarat agar React mendeteksi perubahan dan me-render ulang.
 */
export function replaceAt<T>(items: T[], index: number, value: T): T[] {
  const next = items.slice();
  next[index] = value;
  return next;
}

export function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index);
}

export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
