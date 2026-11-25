import { useEffect, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import LangSwitch from "./LangSwitch";
import { ease, focusRing } from "../lib/motion";
import { useI18n } from "../i18n";

/* ---------- content ---------- */
const links = [
  { href: "#about", label: { en: "About", fr: "À propos" } },
  { href: "#experience", label: { en: "Experience", fr: "Expérience" } },
  { href: "#projects", label: { en: "Projects", fr: "Projets" } },
  { href: "#education", label: { en: "Education", fr: "Formation" } },
  { href: "#contact", label: { en: "Contact", fr: "Contact" } },
];
const SECTION_IDS = ["home", ...links.map((l) => l.href.slice(1))];

// true (desktop only): scrolling down slides the bar away and a small pill appears on the left.
// Scrolling back up brings the full bar back. A recruiter who scrolls down loses the section links,
// so the bar now stays in place the whole way down the page.
const DOCK_ON_SCROLL = false;

const spring = { type: "spring", stiffness: 200, damping: 30 };

/* ---------- helpers ---------- */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/* which section is on screen (drives the highlighted link) */
function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    // a section counts as "current" while it crosses the middle of the screen
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const CtaClass =
  `inline-flex items-center justify-center rounded-full bg-gradient-to-r from-wine to-wine-light px-5 py-2 text-sm font-semibold text-onaccent ` +
  `transition-[filter,transform] hover:brightness-125 active:scale-95 ${focusRing}`;

const Logo = ({ short = false }) => (
  <a href="#home" className={`shrink-0 whitespace-nowrap rounded-full text-xl font-bold tracking-tight font-display ${focusRing}`}>
    <span className="text-pink">C.</span>
    {!short && <span className="text-fg">Ben Ghorbel</span>}
  </a>
);

function ToggleIcon({ open }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={open ? "x" : "menu"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="block"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </motion.span>
    </AnimatePresence>
  );
}

/* desktop links: a pill slides to the hovered link, a dot marks the current section */
function NavItems({ active }) {
  const [hovered, setHovered] = useState(null);
  const { pick } = useI18n();
  return (
    <ul onMouseLeave={() => setHovered(null)} className="items-center hidden gap-1 lg:flex">
      {links.map((l) => {
        const id = l.href.slice(1);
        const isActive = active === id;
        return (
          <li key={id}>
            <a
              href={l.href}
              onMouseEnter={() => setHovered(id)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              aria-current={isActive ? "location" : undefined}
              className={`relative block whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-fg" : "text-muted hover:text-fg"
              } ${focusRing}`}
            >
              {hovered === id && (
                <motion.span
                  layoutId="nav-hover"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-wine/35"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{pick(l.label)}</span>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  aria-hidden
                  className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-pink shadow-[0_0_8px_#FF4FA0]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function Navbar() {
  const reduce = useReducedMotion();
  const { t, pick } = useI18n();
  const isDesktop = useIsDesktop();
  const [scrolled, setScrolled] = useState(false);
  const [docked, setDocked] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const bar = reduce ? scrollYProgress : progress;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
    if (open) return; // never move the bar while the menu is open
    const delta = v - (scrollY.getPrevious() ?? 0);
    if (v <= 240 || delta < -2) setDocked(false); // near the top or scrolling up: full bar
    else if (DOCK_ON_SCROLL && delta > 2) setDocked(true); // scrolling down: dock to the left
  });
  useEffect(() => setScrolled(window.scrollY > 60), []);

  const dockedNow = docked && isDesktop;

  // the full bar returns when the dock goes away, so close a menu that was opened from the dock
  useEffect(() => {
    if (isDesktop && !dockedNow) setOpen(false);
  }, [dockedNow, isDesktop]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = scrolled || open;
  const menuVisibleOnDesktop = dockedNow; // otherwise the menu is for phones and tablets only

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50 px-3 pointer-events-none no-print sm:px-4"
      >
        {/* dim the page behind the open menu; tapping it closes the menu */}
        <AnimatePresence>
          {open && (
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className={`fixed inset-0 -z-10 bg-shade/50 pointer-events-auto backdrop-blur-[2px] ${
                menuVisibleOnDesktop ? "" : "lg:hidden"
              }`}
            />
          )}
        </AnimatePresence>

        {/* the full bar: full width at the top, a floating pill when scrolled, slides away when docked */}
        <motion.nav
          initial={{ maxWidth: 4000 }}
          aria-label="Main"
          aria-hidden={dockedNow || undefined}
          {...(dockedNow ? { inert: "" } : {})}
          animate={{
            // 4000 is the "no cap" value: maxWidth cannot animate from none
            maxWidth: scrolled ? 1024 : 4000,
            y: dockedNow ? -110 : scrolled ? 12 : 0,
            opacity: dockedNow ? 0 : 1,
          }}
          transition={spring}
          className={`relative mx-auto flex h-14 items-center justify-between rounded-full border px-4 sm:h-16 sm:px-5
                      transition-[background-color,border-color,box-shadow] duration-300 ${
                        dockedNow ? "pointer-events-none" : "pointer-events-auto"
                      } ${
                        solid
                          ? "border-wine/50 bg-ink/75 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
                          : "border-transparent bg-transparent"
                      }`}
        >
          <Logo />
          <NavItems active={active} />

          {/* one utility cluster: language switch always visible, CTA on desktop, burger below it */}
          <div className="flex items-center gap-2">
            <LangSwitch />
            <div className="hidden lg:block">
                                <a href="#contact" className={`${CtaClass} whitespace-nowrap`}>
                {t("Contact me", "Me contacter")}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={t(open ? "Close menu" : "Open menu", open ? "Fermer le menu" : "Ouvrir le menu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`rounded-full p-2 text-muted-2 transition-colors hover:text-pink lg:hidden ${focusRing}`}
            >
              <ToggleIcon open={open} />
            </button>
          </div>

          {/* reading progress: a thin line along the bottom edge of the pill */}
          <motion.span
            aria-hidden
            style={{ scaleX: bar }}
            className={`pointer-events-none absolute inset-x-6 -bottom-px h-[2px] origin-left rounded-full bg-gradient-to-r from-pink to-pink-soft
                        transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`}
          />
        </motion.nav>

        {/* the dock: a small pill on the left (desktop, while you scroll down) */}
        <AnimatePresence>
          {dockedNow && (
            <motion.div
              key="dock"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={spring}
              className="pointer-events-auto absolute left-4 top-3 flex h-12 items-center gap-1 rounded-full border border-wine/50 bg-ink/75 pl-4 pr-1.5 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            >
              <Logo short />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={`rounded-full p-2 text-muted-2 transition-colors hover:text-pink ${focusRing}`}
              >
                <ToggleIcon open={open} />
              </button>
              <motion.span
                aria-hidden
                style={{ scaleX: bar }}
                className="pointer-events-none absolute inset-x-5 -bottom-px h-[2px] origin-left rounded-full bg-gradient-to-r from-pink to-pink-soft"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* menu: drops down on phones, opens under the dock on desktop */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease }}
              style={{ transformOrigin: menuVisibleOnDesktop ? "top left" : "top center" }}
              className={`pointer-events-auto overflow-hidden rounded-3xl border border-wine/50 bg-ink/95 backdrop-blur-xl
                          shadow-[0_16px_60px_rgba(0,0,0,0.5)] ${
                            menuVisibleOnDesktop
                              ? "ml-1 mt-2 w-72"
                              : `mx-auto w-full max-w-[880px] lg:hidden ${scrolled ? "mt-5" : "mt-2"}`
                          }`}
            >
              <ul className="flex flex-col gap-1 p-3">
                {links.map((l, i) => {
                  const isActive = active === l.href.slice(1);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i + 0.05, duration: 0.3, ease }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "location" : undefined}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-wine/25 ${
                          isActive ? "text-fg" : "text-muted-2"
                        } ${focusRing}`}
                      >
                        {pick(l.label)}
                        {isActive && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-pink shadow-[0_0_8px_#FF4FA0]" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="p-3 pt-0">
                <a href="#contact" onClick={() => setOpen(false)} className={`${CtaClass} w-full py-3`}>
                  {t("Contact me", "Me contacter")}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </MotionConfig>
  );
}