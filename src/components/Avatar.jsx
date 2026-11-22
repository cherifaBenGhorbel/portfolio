import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";


/* ---- timeline of the video (seconds) ---- */
const IDLE_END = 1.0; // 0 → IDLE_END = typing loop, after that = look up, wave, hand down
const BUBBLE_AT = IDLE_END + 0.6; // when the "Hello" bubble pops in (tune to when she starts waving)

/* ---- interaction tuning ---- */
const TRIGGER_MARGIN = 180; // px around the avatar where the cursor counts as "close"
const LEAVE_DELAY = 600; // ms the cursor must stay away before she goes back to work
const TAP_HOLD = 4000; // ms the greeting lasts after a tap (touch devices)
const avatarVideo = "https://res.cloudinary.com/lcmrgcef/video/upload/v1795376165/avatar-interaction.mp4"

export default function Avatar() {
  const reduce = useReducedMotion();

  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const leaveTimer = useRef(null);

  const visible = useRef(false);
  const wantGreet = useRef(false);
  const mode = useRef("idle"); // "idle" | "greeting" | "hold"
  const uiGreeting = useRef(false);

  const [greeting, setGreeting] = useState(false);
  const [ready, setReady] = useState(false);
  // on touch screens there is no cursor, so the hint says "tap" instead
  const [touch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
  );

  /* ---- soft 3D tilt toward the cursor (-1..1) ---- */
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 90, damping: 16, mass: 0.6 });
  const sy = useSpring(ny, { stiffness: 90, damping: 16, mass: 0.6 });
  const rotateY = useTransform(sx, [-1, 1], [-5, 5]);
  const rotateX = useTransform(sy, [-1, 1], [4, -4]);

  const setUi = (value) => {
    if (uiGreeting.current === value) return;
    uiGreeting.current = value;
    setGreeting(value);
  };

  const releaseGreet = (delay) => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      wantGreet.current = false;
      leaveTimer.current = null;
    }, delay);
  };

  /* ---------- play only while visible ---------- */
  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!reduce && mode.current !== "hold") v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* ---------- state machine (every frame) ---------- */
  useEffect(() => {
    if (reduce) return;
    let raf;

    const backToWork = (v) => {
      mode.current = "idle";
      setUi(false);
      v.currentTime = 0;
      v.play().catch(() => {});
    };

    const tick = () => {
      const v = videoRef.current;
      if (v && visible.current) {
        const t = v.currentTime;

        if (mode.current === "idle") {
          if (wantGreet.current) {
            mode.current = "greeting"; // stop looping, let the clip run on
          } else if (t >= IDLE_END) {
            v.currentTime = 0;
          }
        } else if (mode.current === "greeting") {
          if (t >= BUBBLE_AT) setUi(true);
          if (v.ended || (v.duration && t >= v.duration - 0.04)) {
            v.pause();
            mode.current = "hold"; // freeze on last frame while the visitor stays close
          }
        }

        if (mode.current === "hold" && !wantGreet.current) backToWork(v);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  /* ---------- mouse proximity + tilt ---------- */
  useEffect(() => {
    if (reduce) return;

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      // tilt: gentle, based on cursor offset from the avatar center
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      nx.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2))));
      ny.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2))));

      // proximity: distance from the avatar's rectangle
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      const near = Math.hypot(dx, dy) < TRIGGER_MARGIN;

      if (near) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
        wantGreet.current = true;
      } else if (wantGreet.current && !leaveTimer.current) {
        releaseGreet(LEAVE_DELAY);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      clearTimeout(leaveTimer.current);
    };
  }, [reduce]);

  /* ---------- touch / keyboard: tap or Enter to greet ---------- */
  const greetNow = () => {
    if (reduce) return;
    wantGreet.current = true;
    releaseGreet(TAP_HOLD);
  };

  return (
    <motion.div
      ref={wrapRef}
      role="button"
      tabIndex={0}
      aria-label="Cherifa at her desk. Move closer, tap or press Enter to say hello."
      onClick={greetNow}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && greetNow()}
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-sm mx-auto outline-none cursor-pointer pointer-events-auto sm:max-w-lg lg:max-w-xl group"
    >
      {/* ambient glow: breathes slowly, brightens when she notices you */}
      <motion.div
        aria-hidden
        className="absolute -inset-6 rounded-[3rem] bg-[#FF4FA0] blur-3xl"
        animate={{ opacity: greeting ? 0.32 : 0.16, scale: greeting ? 1.04 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* idle float */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Hello bubble */}
        <AnimatePresence>
          {greeting && (
            <motion.div
              key="hello"
              role="status"
              initial={{ opacity: 0, y: 12, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              style={{ originX: 0, originY: 1 }}
              className="absolute z-20 -top-5 -left-2 sm:-left-6 px-4 py-2 rounded-2xl rounded-bl-sm
                         border border-[#FF4FA0]/50 bg-[#0A0910]/90 backdrop-blur
                         text-sm font-medium text-[#F4F1F6] shadow-[0_0_28px_rgba(255,79,160,0.35)]"
            >
              Hi, I’m Cherifa!{" "}
              <motion.span
                className="inline-block origin-[70%_80%]"
                animate={{ rotate: [0, 22, -10, 22, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              >
                👋
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* tilting card */}
        <motion.div
          style={{
            rotateX: reduce ? 0 : rotateX,
            rotateY: reduce ? 0 : rotateY,
            transformPerspective: 1000,
          }}
          className="relative overflow-hidden rounded-[2rem] bg-[#171018]
                     border border-[#7A1330]/60 shadow-[0_0_50px_rgba(255,79,160,0.18)]
                     transition-[border-color,box-shadow] duration-500
                     group-focus-visible:border-[#FF4FA0] data-[greeting=true]:border-[#FF4FA0]/70"
          data-greeting={greeting}
        >
          <video
            ref={videoRef}
            src={avatarVideo}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedData={() => setReady(true)}
            className={`block w-full h-auto select-none transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0910]/55 via-transparent to-transparent" />
        </motion.div>

        {/* status chip */}
        <div
          className="absolute z-20 flex items-center gap-2 px-3 py-1 font-mono text-[11px] -translate-x-1/2 border rounded-full -bottom-3 left-1/2
                     bg-black/70 border-[#7A1330]/50 text-[#C9C0D1] backdrop-blur whitespace-nowrap"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              greeting ? "bg-emerald-400" : "bg-[#FF4FA0] animate-pulse"
            }`}
          />
          {greeting ? "oh, hi there!" : touch ? "coding… tap to say hi ☕" : "coding… come say hi ☕"}
        </div>
      </motion.div>
    </motion.div>
  );
}