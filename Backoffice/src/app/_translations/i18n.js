import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationTH from "./_translations/thai.json";
import translationEN from "./_translations/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    th: {
      translation: translationTH,
    },
  },
  lng: "en", // 👈 Default language
  fallbackLng: "en", // fallback if current language translation is missing
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ["en", "th"],
});

export default i18n;
