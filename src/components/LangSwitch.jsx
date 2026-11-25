import { useI18n } from "../i18n";

const langs = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
];

export default function LangSwitch({ className = "" }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("Language", "Langue")}
      className={`flex items-center gap-0.5 rounded-full border border-wine/50 bg-panel/60 p-0.5 ${className}`}
    >
      {langs.map(({ code, label, name }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            aria-label={name}
            className={`rounded-full px-2 py-1 font-mono text-[11px] leading-none transition-colors outline-none
                        focus-visible:ring-2 focus-visible:ring-pink/70 ${
                          active ? "bg-wine text-onaccent" : "text-muted hover:text-pink"
                        }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
