import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Language = "es" | "en";

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";
    return window.localStorage.getItem("aurea3d-language") === "en" ? "en" : "es";
  });

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (nextLanguage) => {
      setLanguage(nextLanguage);
      window.localStorage.setItem("aurea3d-language", nextLanguage);
    },
    toggleLanguage: () => {
      const nextLanguage = language === "es" ? "en" : "es";
      setLanguage(nextLanguage);
      window.localStorage.setItem("aurea3d-language", nextLanguage);
    },
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
