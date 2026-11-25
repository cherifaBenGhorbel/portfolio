import { useI18n } from "../i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-8 border-t border-wine/40">
      <div className="flex flex-col items-center justify-between gap-4 text-sm section-container sm:flex-row text-faint">
        <p>
          © {new Date().getFullYear()} Cherifa Ben Ghorbel.{" "}
          {t("All rights reserved.", "Tous droits réservés.")}
        </p>
        <p>{t("Designed and built with ❤️", "Conçu et développé avec ❤️")}</p>
      </div>
    </footer>
  );
}
