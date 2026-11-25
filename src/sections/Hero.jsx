import {
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, Download, Github, Globe, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Trace from "../components/Trace";
import { useI18n } from "../i18n";
import { ease, focusRing } from "../lib/motion";

const ROLES = {
  en: ["full-stack (MERN)", "mobile (android)", "devops & sre (in training)"],
  fr: ["full-stack (MERN)", "mobile (android)", "devops & sre (en formation)"],
};

// Both CVs live in /public as print-to-PDF files built from the ATS versions of the text.
// The visitor gets the one that matches the language they are reading.
const CV_PDFS = {
  en: "/cv-cherifa-ben-ghorbel.pdf",
  fr: "/cv-cherifa-ben-ghorbel-fr.pdf",
};

/* One orchestrated entrance: the text column staggers in, the avatar follows (see Avatar). */
const column = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const socialClass =
  "p-2.5 border rounded-full bg-panel/80 border-wine/40 text-muted-2 transition-colors backdrop-blur " +
  "hover:text-pink hover:border-pink/60 " + focusRing;

const SOCIALS = [
  {
    icon: Mail,
    label: { en: "Send me an email", fr: "M'envoyer un email" },
    href: "mailto:cherifabenghorbel@gmail.com",
    external: false,
  },
  {
    icon: Github,
    label: { en: "GitHub profile", fr: "Profil GitHub" },
    href: "https://github.com/cherifabenghorbel",
    external: true,
  },
  {
    icon: Linkedin,
    label: { en: "LinkedIn profile", fr: "Profil LinkedIn" },
    href: "https://linkedin.com/in/cherifa-ben-ghorbel",
    external: true,
  },
];

/* A single typed line that cycles through your focus areas. */
function RoleTyper({ roles, lang }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduce ? roles[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = roles[index];
    let timer;

    if (!deleting && text === full) {
      timer = setTimeout(() => setDeleting(true), 1700);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % roles.length);
    } else {
      timer = setTimeout(
        () => setText(full.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? 26 : 55
      );
    }
    return () => clearTimeout(timer);
  }, [text, deleting, index, reduce, roles]);

  return (
    <p className="h-6 font-mono text-sm sm:text-base text-muted">
      {/* screen readers get the full list once instead of every typed letter */}
      <span className="sr-only">{lang === "fr" ? "Domaines : " : "Focus areas: "}{roles.join(", ")}</span>
      <span aria-hidden>
        <span className="text-wine-light">~$ </span>
        {text}
        <span className="ml-0.5 inline-block h-4 w-[2px] bg-pink align-middle animate-pulse" />
      </span>
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

export default function Hero() {
  const { t, pick, lang } = useI18n();
  const roles = ROLES[lang];

  /* Motion values (not state): the glow follows the cursor without re-rendering the hero. */
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
    <MotionConfig reducedMotion="user">
      {/* No solid background here: the site-wide Starfield shows through, so the hero does not need its own stars. */}
      <section
        id="home"
        aria-label="Introduction"
        onPointerMove={onPointerMove}
        className="relative flex items-center justify-center min-h-[100svh] overflow-hidden"
      >
        {/* Cursor glow */}
        <motion.div aria-hidden className="absolute inset-0 z-[5] pointer-events-none" style={{ background: glow }} />

        {/* Legibility: darken the text side and soften the bottom edge */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-32 pointer-events-none bg-gradient-to-t from-ink/90 to-transparent" />

        <div className="relative z-20 w-full pt-28 pb-16 section-container sm:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            {/* ---------- Left: text ---------- */}
            <motion.div variants={column} initial="hidden" animate="show" className="text-center lg:text-left">
              <motion.div
                variants={item}
                className="inline-flex items-center gap-2 px-3 py-1 mb-5 font-mono text-xs border rounded-full bg-panel/80 border-wine/40 text-muted-2 backdrop-blur"
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-60 bg-pink animate-ping motion-reduce:hidden" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-pink" />
                </span>
                {t("Open for internships", "Ouverte aux stages")}
              </motion.div>

              <motion.h1
                variants={item}
                className="mb-4 text-4xl font-bold leading-[1.1] tracking-tight font-display sm:text-5xl md:text-6xl
                           bg-gradient-to-r from-fg via-fg to-pink-soft bg-clip-text text-transparent"
              >
                Cherifa Ben Ghorbel
              </motion.h1>

              {/* The signature mark. Everything else on the page repeats it, smaller. */}
              <motion.div variants={item} className="mb-5 max-w-sm mx-auto lg:mx-0 text-left text-pink">
                <Trace height={52} label={t("build · deploy · run", "build · deploy · run")} />
              </motion.div>

              <motion.p
                variants={item}
                className="max-w-md mx-auto mb-4 text-base leading-relaxed sm:text-lg text-body lg:mx-0"
              >
                {t(
                  "I build web apps end to end — React and Node, MongoDB or MySQL underneath — and Android when the product has to fit in a pocket. I'm studying DevOps and SRE now, so I can keep what I ship running.",
                  "Je construis des applications web de bout en bout — React et Node, MongoDB ou MySQL en dessous — et de l’Android quand le produit doit tenir dans une poche. J’étudie le DevOps et le SRE, pour garder en vie ce que je mets en ligne."
                )}
              </motion.p>

              <motion.div variants={item} className="flex justify-center mb-6 lg:justify-start">
                <RoleTyper roles={roles} lang={lang} />
              </motion.div>

              <motion.div
                variants={item}
                className="flex flex-wrap items-center justify-center mb-8 text-[13px] gap-x-5 gap-y-2 text-muted lg:justify-start"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={16} aria-hidden className="text-pink/70" />
                  {t("Hammam-Lif, Tunisia", "Hammam-Lif, Tunisie")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={16} aria-hidden className="text-pink/70" />
                  {t("Remote from anywhere, or on-site", "À distance ou sur site")}
                </span>
              </motion.div>

              <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3 mb-7 lg:justify-start">
                <Magnetic
                  href="#projects"
                  className={`relative px-6 py-3 text-sm font-semibold text-onaccent rounded-full overflow-hidden group ${focusRing}`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-wine to-wine-light" />
                  <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-pink to-pink-soft group-hover:opacity-100" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles size={16} aria-hidden />
                    {t("View my projects", "Voir mes projets")}
                  </span>
                </Magnetic>

                <Magnetic
                  href="#contact"
                  className={`px-6 py-3 text-sm font-semibold transition-colors border rounded-full border-wine-light text-pink-chip hover:bg-wine/30 hover:border-pink ${focusRing}`}
                >
                  {t("Contact me", "Me contacter")}
                </Magnetic>

                <Magnetic
                    href={CV_PDFS[lang] ?? CV_PDFS.en}
                    download
                    className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors rounded-full text-muted-2 hover:text-pink ${focusRing}`}
                  >
                    <Download size={16} aria-hidden />
                    {t("Download CV", "Télécharger le CV")}
                  </Magnetic>
              </motion.div>

              <motion.div variants={item} className="flex items-center justify-center gap-4 lg:justify-start">
                {SOCIALS.map(({ icon: Icon, label, href, external }) => (
                  <motion.a
                    key={pick(label)}
                    href={href}
                    aria-label={pick(label)}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={socialClass}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
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
            aria-label={t("Scroll to the About section", "Aller à la section À propos")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className={`absolute transition-colors -translate-x-1/2 bottom-6 left-1/2 text-faint-2 hover:text-pink ${focusRing}`}
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowDown size={22} />
            </motion.div>
          </motion.a>
        </div>
      </section>
    </MotionConfig>
  );
}