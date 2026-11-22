export default function Footer() {
  return (
    <footer className="py-8 border-t border-[#7A1330]/40">
      <div className="flex flex-col items-center justify-between gap-4 text-sm section-container sm:flex-row text-[#948C9C]">
        <p>
          © {new Date().getFullYear()} Cherifa Ben Ghorbel. All rights reserved.
        </p>
        <p>
          Designed and built with ❤️
        </p>
      </div>
    </footer>
  );
}