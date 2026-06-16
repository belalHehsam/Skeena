import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, LANG_DIR, SUPPORTED_LOCALES } from "@/constants/i18nConfig";

export default function GlobalLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const rawLocale = i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LOCALE;
    const shortLocale = rawLocale.split("-")[0] as Locale;
    const currentLocale = SUPPORTED_LOCALES.includes(shortLocale)
      ? shortLocale
      : DEFAULT_LOCALE;

    document.documentElement.lang = currentLocale;
    document.documentElement.dir = LANG_DIR[currentLocale];
  }, [i18n.language, i18n.resolvedLanguage]);

  return null;
}
