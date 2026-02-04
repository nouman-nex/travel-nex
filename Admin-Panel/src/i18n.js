import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationTH from "./app/_translations/thai.json"; //thai
import translationEN from "./app/_translations/en.json";  // english
import translationES from "./app/_translations/es.json";  // estonian
import translationFN from "./app/_translations/fn.json"; // finiland
import translationVT from "./app/_translations/vt.json"; // veitnam

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    th: {
      translation: translationTH,
    },
    es: {
      translation: translationES,
    },
    fn: {
      translation: translationFN,
    },
    vt: {
      translation: translationVT,
    },
  },
  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "th", "es", "fn", "vt"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
