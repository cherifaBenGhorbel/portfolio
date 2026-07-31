export default function Footer() {
  return (
    <footer className="py-8 border-t border-slate-800/60">
      <div className="flex flex-col items-center justify-between gap-4 text-sm section-container sm:flex-row text-slate-500">
        <p>
          © {new Date().getFullYear()} Cherifa Ben Ghorbel. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
