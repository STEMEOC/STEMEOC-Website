import { en, type Dictionary } from "./en";
import { km } from "./km";
import { getLocale, type Locale } from "./locale";

export type { Dictionary, Locale };
export { LOCALES, LOCALE_COOKIE, getLocale } from "./locale";

const dictionaries: Record<Locale, Dictionary> = { en, km };

export async function getDictionary(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}
