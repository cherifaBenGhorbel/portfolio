import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, Github, Laptop, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Scene3D from "../components/Scene3D";

const ROLES = ["full-stack (MERN)", "devops / sre", "cloud & distributed systems"];

/* One orchestrated entrance: the text column staggers in, the avatar follows (see Avatar). */
const column = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* A single typed line that cycles through your focus areas. */
function RoleTyper() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? ROLES[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = ROLES[index];
    let timer;

    if (!deleting && text === full) {
      timer = setTimeout(() => setDeleting(true), 1700);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
    } else {
      timer = setTimeout(
        () => setText(full.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 26 : 55
      );
    }
    return () => clearTimeout(timer);
  }, [text, deleting, index, reduce]);

  return (
    <p className="h-6 font-mono text-sm sm:text-base text-[#B7AFC0]" aria-label={ROLES.join(", ")}>
      <span className="text-[#A8203F]" aria-hidden>~$ </span>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="ml-0.5 inline-block h-4 w-[2px] bg-[#FF4FA0] align-middle animate-pulse" />
    </p>
  );
}

/* Link that gently follows the cursor when it is close. */
function Magnetic({ strength = 0.3, className = "", children, ...rest }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4FA0]";

const socialClass =
  "p-2.5 border rounded-full bg-black/60 border-[#7A1330]/40 text-[#C9C0D1] transition-colors " +
  "hover:text-[#FF4FA0] hover:border-[#FF4FA0]/60 " + focusRing;

export default function Hero() {
  /* Motion values (not state): the glow follows the cursor without re-rendering the hero or the 3D scene. */
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 });
  const gy = useSpring(my, { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,79,160,0.10) 0%, transparent 45%)`;

  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      id="home"
      onPointerMove={onPointerMove}
      className="relative flex items-center justify-center min-h-[100svh] overflow-hidden bg-[#0A0910]"
    >
      <Scene3D />

      {/* Cursor glow */}
      <motion.div aria-hidden className="absolute inset-0 z-[5] pointer-events-none" style={{ background: glow }} />

      {/* Legibility: darken the text side and the bottom edge, leave the scene visible on the avatar side */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0A0910]/85 via-[#0A0910]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 h-40 pointer-events-none bg-gradient-to-t from-[#0A0910] to-transparent" />

      <div className="relative z-20 w-full pt-24 pb-20 section-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          {/* ---------- Left: text ---------- */}
          <motion.div variants={column} initial="hidden" animate="show" className="text-center lg:text-left">
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs border rounded-full bg-black/60 border-[#7A1330]/50 text-[#C9C0D1]"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-60 bg-[#FF4FA0] animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-[#FF4FA0]" />
              </span>
              Open for internships
            </motion.div>

            <motion.h1
              variants={item}
              className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight font-display sm:text-4xl md:text-5xl
                         bg-gradient-to-r from-[#F4F1F6] via-[#F4F1F6] to-[#FF8FC0] bg-clip-text text-transparent"
            >
              Cherifa Ben Ghorbel
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-md mx-auto mb-4 text-base leading-relaxed sm:text-lg text-[#E4DEE8] lg:mx-0"
            >
              Software engineering student building full-stack apps and the cloud infrastructure that keeps them running.
            </motion.p>

            <motion.div variants={item} className="flex justify-center mb-6 lg:justify-start">
              <RoleTyper />
            </motion.div>

            <motion.div
              variants={item}
              className="flex flex-wrap items-center justify-center mb-8 text-sm gap-x-5 gap-y-2 text-[13px] text-[#B7AFC0] lg:justify-start"
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#FF4FA0]/70" />
                Hammam-Lif, Tunisia
              </span>
              <span className="flex items-center gap-1.5">
                <Laptop size={16} className="text-[#FF4FA0]/70" />
                Remote or on-site
              </span>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mb-7 lg:justify-start">
              <Magnetic
                href="#projects"
                className={`relative px-6 py-3 text-sm font-semibold text-[#F4F1F6] rounded-full overflow-hidden group ${focusRing}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#7A1330] to-[#A8203F]" />
                <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-[#FF4FA0] to-[#FF8FC0] group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  <Sparkles size={16} />
                  View my projects
                </span>
              </Magnetic>

              <Magnetic
                href="#contact"
                className={`px-6 py-3 text-sm font-semibold transition-colors border rounded-full border-[#A8203F] text-[#F0AFC6] hover:bg-[#7A1330]/30 hover:border-[#FF4FA0] ${focusRing}`}
              >
                Contact me
              </Magnetic>
            </motion.div>

            <motion.div variants={item} className="flex items-center justify-center gap-4 lg:justify-start">
              <motion.a
                href="mailto:cherifabenghorbel@gmail.com"
                aria-label="Send me an email"
                className={socialClass}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={18} />
              </motion.a>
              <motion.a
                href="https://github.com/cherifabenghorbel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className={socialClass}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={18} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/cherifa-ben-ghorbel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className={socialClass}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={18} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ---------- Right: avatar (the one memorable element) ---------- */}
          <div className="flex justify-center lg:justify-end">
            <Avatar />
          </div>
        </div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          aria-label="Scroll to the About section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute transition-colors -translate-x-1/2 bottom-6 left-1/2 text-[#5C5364] hover:text-[#FF4FA0]"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown size={22} />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
}