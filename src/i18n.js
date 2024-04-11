import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnUS from "./locales/en-US.json";
import translationKoKR from "./locales/ko-KR.json";

i18n.use(initReactI18next).init({
  fallbackLng: "en-US",
  resources: {
    "en-US": { translation: translationEnUS },
    "ko-KR": { translation: translationKoKR },
  },
});

export default i18n;
