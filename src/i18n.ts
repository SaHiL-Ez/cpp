import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import hi from "../locales/hi.json";
import es from "../locales/es.json";
import pa from "../locales/pa.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  es: { translation: es },
  pa: { translation: pa },
};

function getInitialLanguage() {
  if (typeof window === "undefined") {
    // On server, default to 'en'
    return "en";
  }
  // On client, get locale from URL path
  const pathname = window.location.pathname;
  const locale = pathname.split("/")[1];
  if (["en", "pa", "hi", "es"].includes(locale)) {
    return locale;
  }
  return "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
