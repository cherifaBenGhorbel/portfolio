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

/* ---------- content ---------- */
const links = [
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];
const SECTION_IDS = ["home", ...links.map((l) => l.href.slice(1))];

// true (desktop only): scrolling down slides the bar away and a small pill appears on the left.
// Scrolling back up brings the full bar back. Set to false to keep the bar always in place.
const DOCK_ON_SCROLL = true;

const ease = [0.22, 1, 0.36, 1];
const spring = { type: "spring", stiffness: 200, damping: 30 };

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4FA0]";

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
  `inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7A1330] to-[#A8203F] px-5 py-2 text-sm font-semibold text-[#F4F1F6] ` +
  `transition-[filter,transform] hover:brightness-125 active:scale-95 ${focusRing}`;

const Logo = ({ short = false }) => (
  <a href="#home" className={`rounded-full text-xl font-bold tracking-tight font-display ${focusRing}`}>
    <span className="text-[#FF4FA0]">C.</span>
    {!short && <span className="text-[#F4F1F6]">Ben Ghorbel</span>}
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
              className={`relative block rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-[#F4F1F6]" : "text-[#B7AFC0] hover:text-[#F4F1F6]"
              } ${focusRing}`}
            >
              {hovered === id && (
                <motion.span
                  layoutId="nav-hover"
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[#7A1330]/35"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{l.label}</span>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  aria-hidden
                  className="absolute left-1/2 -bottom-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-[#FF4FA0] shadow-[0_0_8px_#FF4FA0]"
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
        className="fixed inset-x-0 top-0 z-50 px-3 pointer-events-none sm:px-4"
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
              className={`fixed inset-0 -z-10 bg-black/50 pointer-events-auto backdrop-blur-[2px] ${
                menuVisibleOnDesktop ? "" : "lg:hidden"
              }`}
            />
          )}
        </AnimatePresence>

        {/* the full bar: full width at the top, a floating pill when scrolled, slides away when docked */}
        <motion.nav
          aria-label="Main"
          aria-hidden={dockedNow || undefined}
          {...(dockedNow ? { inert: "" } : {})}
          animate={{
            maxWidth: scrolled ? 880 : 1152,
            y: dockedNow ? -110 : scrolled ? 12 : 0,
            opacity: dockedNow ? 0 : 1,
          }}
          transition={spring}
          className={`relative mx-auto flex h-14 items-center justify-between rounded-full border px-4 sm:h-16 sm:px-5
                      transition-[background-color,border-color,box-shadow] duration-300 ${
                        dockedNow ? "pointer-events-none" : "pointer-events-auto"
                      } ${
                        solid
                          ? "border-[#7A1330]/50 bg-[#0A0910]/75 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
                          : "border-transparent bg-transparent"
                      }`}
        >
          <Logo />
          <NavItems active={active} />

          <div className="items-center hidden lg:flex">
            <a href="#contact" className={CtaClass}>
              Contact me
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`rounded-full p-2 text-[#C9C0D1] transition-colors hover:text-[#FF4FA0] lg:hidden ${focusRing}`}
          >
            <ToggleIcon open={open} />
          </button>

          {/* reading progress: a thin line along the bottom edge of the pill */}
          <motion.span
            aria-hidden
            style={{ scaleX: bar }}
            className={`pointer-events-none absolute inset-x-6 -bottom-px h-[2px] origin-left rounded-full bg-gradient-to-r from-[#FF4FA0] to-[#FF8FC0]
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
              className="pointer-events-auto absolute left-4 top-3 flex h-12 items-center gap-1 rounded-full border border-[#7A1330]/50 bg-[#0A0910]/75 pl-4 pr-1.5 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            >
              <Logo short />
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={`rounded-full p-2 text-[#C9C0D1] transition-colors hover:text-[#FF4FA0] ${focusRing}`}
              >
                <ToggleIcon open={open} />
              </button>
              <motion.span
                aria-hidden
                style={{ scaleX: bar }}
                className="pointer-events-none absolute inset-x-5 -bottom-px h-[2px] origin-left rounded-full bg-gradient-to-r from-[#FF4FA0] to-[#FF8FC0]"
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
              className={`pointer-events-auto overflow-hidden rounded-3xl border border-[#7A1330]/50 bg-[#0A0910]/95 backdrop-blur-xl
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
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors hover:bg-[#7A1330]/25 ${
                          isActive ? "text-[#F4F1F6]" : "text-[#C9C0D1]"
                        } ${focusRing}`}
                      >
                        {l.label}
                        {isActive && <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#FF4FA0] shadow-[0_0_8px_#FF4FA0]" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="p-3 pt-0">
                <a href="#contact" onClick={() => setOpen(false)} className={`${CtaClass} w-full py-3`}>
                  Contact me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </MotionConfig>
  );
}