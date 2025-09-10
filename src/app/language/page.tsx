"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", labelKey: "english" },
  { code: "hi", labelKey: "hindi" },
  { code: "es", labelKey: "spanish" },
  { code: "pa", labelKey: "punjabi" },
];

export default function LanguagePage() {
  const [selectedLang, setSelectedLang] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelect = (code: string) => {
    setSelectedLang(code);
  };

  const handleContinue = () => {
    if (!selectedLang) return;
    // Save language preference to localStorage or context
    localStorage.setItem("preferredLanguage", selectedLang);
    // Redirect to login page with locale prefix
    router.push(`/${selectedLang}/login`);
  };

  if (!isMounted) {
    // Render nothing or a placeholder on server to avoid hydration mismatch
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-green-800">{t("select_language")}</h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={selectedLang === lang.code ? "default" : "outline"}
            onClick={() => handleSelect(lang.code)}
          >
            {t(lang.labelKey)}
          </Button>
        ))}
      </div>
      <Button
        className="mt-6 w-full max-w-xs"
        disabled={!selectedLang}
        onClick={handleContinue}
      >
        {t("continue")}
      </Button>
    </div>
  );
}
