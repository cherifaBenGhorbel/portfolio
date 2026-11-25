import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../theme";
import { useI18n } from "../i18n";

/*
 * The light switch is a lamp pull cord: a chain hangs from the top edge of the page
 * and you pull the knob to turn the lights on or off.
 *
 * Two things keep it from looking like a button:
 *  - it hangs in the wind, swaying in uneven gusts;
 *  - when you take the knob, the cord comes with your hand. The chain lengthens as
 *    you drag down, leans with you sideways, and springs back on release — toggling
 *    the lights if you pulled far enough, or if it was just a tap.
 *
 * A cord is only obvious once you have pulled one, so the first visit gets a label
 * under the knob. It fades, returns on hover or keyboard focus, and never comes back
 * once the cord has been used.
 */
const SEEN_KEY = "cbg-cord-used";

/* how far the chain can be drawn out, and how far counts as a real pull */
const MAX_PULL = 72;
const PULL_THRESHOLD = 24;

export default function PullCord() {
  const { isLight, toggle } = useTheme();
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const [hint, setHint] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* the cord's own coordinates; everything visual is derived from these two */
  const stretch = useMotionValue(0);
  const lean = useMotionValue(0);
  const chainHeight = useTransform(stretch, (v) => 58 + Math.min(v, MAX_PULL));
  const pullRotate = useTransform(lean, (v) => v * 0.45);

  const grab = useRef(null);

  /* first visit: show the label, then let it fade so it never nags */
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    const show = setTimeout(() => setHint(true), 1200);
    const hide = setTimeout(() => setHint(false), 15000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const remember = () => {
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: the hint simply shows again next time */
    }
  };

  const settle = () => {
    const spring = reduce
      ? { duration: 0 }
      : { type: "spring", stiffness: 460, damping: 21, mass: 0.6 };
    animate(stretch, 0, spring);
    animate(lean, 0, spring);
  };

  const flash = () => {
    if (reduce) return;
    animate(stretch, 52, {
      duration: 0.16,
      ease: "easeOut",
      onComplete: () => animate(stretch, 0, { type: "spring", stiffness: 520, damping: 17 }),
    });
  };

  /* keyboard or assistive activation arrives as a click with no pointer detail */
  const onClick = (event) => {
    if (event.detail !== 0) return;
    flash();
    toggle();
    remember();
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    grab.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* some browsers refuse capture for a pointer that has already ended */
    }
    setDragging(true);
    setHint(false);
  };

  const onPointerMove = (event) => {
    const g = grab.current;
    if (!g || g.id !== event.pointerId) return;

    const down = event.clientY - g.y;
    const across = event.clientX - g.x;
    if (Math.abs(down) > 3 || Math.abs(across) > 3) g.moved = true;

    stretch.set(Math.max(0, Math.min(down, MAX_PULL)));
    lean.set(Math.max(-22, Math.min(22, across * 0.35)));
  };

  const onPointerUp = (event) => {
    const g = grab.current;
    if (!g || g.id !== event.pointerId) return;
    grab.current = null;
    setDragging(false);

    /* a tap, or a pull past the threshold, flips the light; a small tug does not */
    if (!g.moved || stretch.get() >= PULL_THRESHOLD) {
      toggle();
      remember();
    }
    settle();
  };

  const onPointerCancel = () => {
    grab.current = null;
    setDragging(false);
    settle();
  };

  const hintVisible = hint || hovering;

  /*
   * The label has to name the effect, not the object. "Pull the cord for light"
   * described the chain hanging there, so people read it as decoration. It now
   * says which way the theme will go, which also tells you the current mode.
   */
  const label = isLight
    ? t("Pull to switch to dark mode", "Tirez pour passer en sombre")
    : t("Pull to switch to light mode", "Tirez pour passer en clair");

  /*
   * Wind, not a metronome: the cord leans one way, hesitates, falls back past
   * centre and is nudged again. Uneven holds and uneven amplitude are what make
   * it read as air moving rather than as a looping animation.
   */
  const wind = reduce
    ? undefined
    : {
        rotate: [0, 2.6, 2.2, -1.3, -1.8, 3.1, 0.7, 0],
        x: [0, 1.2, 1, -0.8, -1.1, 1.6, 0.3, 0],
      };

  const windTransition = {
    duration: 11,
    times: [0, 0.12, 0.22, 0.4, 0.52, 0.68, 0.86, 1],
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
  };

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="fixed left-1/2 top-0 z-[70] flex -translate-x-1/2 flex-col items-center select-none no-print sm:left-auto sm:right-3 sm:translate-x-0"
    >
      {/* ceiling bracket */}
      <div aria-hidden className="w-5 h-1.5 rounded-b-full bg-wine/70 shadow-[0_1px_0_rgba(0,0,0,0.25)]" />

      {/* the cord hangs from the ceiling, so it turns around the bracket */}
      <motion.div
        animate={dragging ? { rotate: 0, x: 0 } : wind}
        transition={dragging ? { type: "spring", stiffness: 300, damping: 30 } : windTransition}
        style={{ transformOrigin: "top center" }}
        className="flex flex-col items-center"
      >
        {/* your hand wins while you hold it: the pull layer follows the pointer */}
        <motion.div
          style={{ transformOrigin: "top center", rotate: pullRotate }}
          className="flex flex-col items-center"
        >
          {/* the chain, lengthening as it is drawn out */}
          <motion.div
            aria-hidden
            className="w-[3px] rounded-full"
            style={{
              height: chainHeight,
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgb(var(--c-wine-light)) 0 5px, rgba(0,0,0,0) 5px 9px)",
            }}
          />

          <button
            type="button"
            role="switch"
            aria-checked={isLight}
            onClick={onClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            title={label}
            aria-label={t(
              isLight ? "Switch to dark theme" : "Switch to light theme",
              isLight ? "Passer au thème sombre" : "Passer au thème clair"
            )}
            className="group relative -mt-1 flex h-11 w-6 touch-none items-start justify-center rounded-full outline-none cursor-grab
                       active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-pink/70"
          >
            {/*
              * A ring of light leaves the knob once, on the very first visit, so the
              * eye lands on it. It is deliberately not tied to hover: on hover it read
              * as a second glowing cord next to the real one.
              */}
            {hint && !reduce && (
              <motion.span
                aria-hidden
                initial={{ scale: 0.6, opacity: 0.55 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
                className="absolute top-1 w-4 h-4 rounded-full border border-pink/70"
              />
            )}

            {/* glow of the bulb behind the knob when the lights are on */}
            <span
              aria-hidden
              className={`pointer-events-none absolute -inset-3 rounded-full blur-md transition-opacity duration-500 ${
                isLight ? "opacity-100 bg-pink/40" : "opacity-0"
              }`}
            />

            {/* the knob travels with the cord */}
            <motion.span
              style={{ y: stretch }}
              className={`relative block h-6 w-3.5 rounded-full border transition-colors duration-300 ${
                isLight
                  ? "bg-pink border-pink-soft shadow-[0_0_12px_rgba(255,79,160,0.7)]"
                  : "bg-wine border-wine-light"
              }`}
            >
              <span aria-hidden className="absolute inset-x-0 top-1 mx-auto h-1.5 w-1 rounded-full bg-white/40" />
            </motion.span>
          </button>
        </motion.div>
      </motion.div>

      {/* the label: it sits under the knob and points back at it */}
      <AnimatePresence>
        {hintVisible && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 top-full mt-2 flex items-center gap-1.5 whitespace-nowrap rounded-full
                       border border-wine/60 bg-ink/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em]
                       text-pink-chip shadow-[0_6px_20px_rgba(0,0,0,0.45)] backdrop-blur sm:right-0"
          >
            {/* a sun or a moon next to the words: the icon says "theme" before the sentence is read */}
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="text-pink"
            >
              {isLight ? <Moon size={10} /> : <Sun size={10} />}
            </motion.span>
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
