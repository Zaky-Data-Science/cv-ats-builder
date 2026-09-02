import { en } from "./en";
import { id, type Dictionary } from "./id";
import type { Locale } from "./config";

export type { Dictionary };
export * from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { id, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? id;
}
