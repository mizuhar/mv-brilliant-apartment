import React from "react";
import { useLanguage } from "../App";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const languages = [
    { code: "bg", label: "BG", flag: "🇧🇬" },
    { code: "en", label: "EN", flag: "🇬🇧" },
    { code: "de", label: "DE", flag: "🇩🇪" },
  ];

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      style={{
        padding: "0.35rem 0.5rem",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        backgroundColor: "#ffffff",
        color: "#1e293b",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
        outline: "none"
      }}
    >
      {languages.map((item) => (
        <option key={item.code} value={item.code}>
          {item.flag} {item.label}
        </option>
      ))}
    </select>
  );
}