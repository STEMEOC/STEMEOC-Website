import { cookies } from "next/headers";
import { LOCALE_COOKIE, type Locale } from "./shared";

export type { Locale };
export { LOCALES, LOCALE_COOKIE } from "./shared";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "km" ? "km" : "en";
}
