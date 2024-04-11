import translationEn from "@/locales/en.json";
import translationKo from "@/locales/ko.json";

export const Locale = {
  en: "en",
  ko: "ko",
} as const;

export const Locales = Object.keys(Locale);

export const LocaleResources = {
  [Locale["en"]]: { translation: translationEn },
  [Locale["ko"]]: { translation: translationKo },
};
