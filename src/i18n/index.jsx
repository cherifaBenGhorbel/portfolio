import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cbg-lang";
const I18nContext = createContext(null);

const isLang = (value) => value === "en" || value === "fr";

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isLang(saved) ? saved : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  // t("English", "Français") — the text lives next to the markup, so nothing can drift.
  const t = useCallback((en, fr) => (lang === "fr" ? fr : en), [lang]);

  // pick({ en, fr }) for the content arrays defined at module level.
  const pick = useCallback((value) => (value && typeof value === "object" ? value[lang] ?? value.en : value), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, t, pick]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
