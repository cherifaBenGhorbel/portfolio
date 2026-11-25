import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Spot from "../components/Spot";
import { useI18n } from "../i18n";
import { ease } from "../lib/motion";

/* ---------- content ---------- */
const education = [
  {
    current: true,
    degree: { en: "Engineering Cycle in Software Engineering", fr: "Cycle d’ingénieur en génie logiciel" },
    focus: { en: "DevOps & SRE — CI/CD, containers, reliability", fr: "DevOps & SRE — CI/CD, conteneurs, fiabilité" },
    school: "Horizon Business School",
    period: { en: "2025 – Present", fr: "2025 – aujourd’hui" },
    year: "2025",
    location: { en: "Sousse", fr: "Sousse" },
    note: { en: "2nd year", fr: "2e année" },
  },
  {
    degree: {
      en: "Bachelor’s Degree in Information Systems Development",
      fr: "Licence en développement des systèmes d’information",
    },
    school: "Higher Institute of Technological Studies of Nabeul (ISET)",
    period: { en: "2022 – 2025", fr: "2022 – 2025" },
    year: "2022",
    location: { en: "Nabeul", fr: "Nabeul" },
  },
  {
    degree: { en: "Baccalaureate in Computer Science", fr: "Baccalauréat en informatique" },
    school: "Bechir Nabhani High School",
    period: { en: "2022", fr: "2022" },
    year: "2022",
    location: { en: "Hammam-Lif", fr: "Hammam-Lif" },
  },
];

const Location = ({ children }) => (
  <span className="flex items-center gap-1.5">
    <MapPin size={13} aria-hidden className="text-pink/70" />
    {children}
  </span>
);

/* ---------- current studies: a light runs around the border ---------- */
function Current({ edu }) {
  const { t, pick } = useI18n();

  return (
    <div className="relative p-px overflow-hidden rounded-2xl bg-wine/40">
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <div className="relative rounded-[15px] bg-panel bg-gradient-to-br from-wine/25 to-transparent p-6 sm:p-7">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs rounded-full border border-pink/40 bg-tint text-pink-chip">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-60 bg-pink animate-ping motion-reduce:hidden" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-pink" />
          </span>
          {t("Studying now", "En cours")} · {pick(edu.note)}
        </span>

        <div className="flex items-start gap-4">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-wine/30 text-pink-chip">
            <GraduationCap size={22} />
          </span>
          <div>
            <h3 className="text-xl font-bold leading-snug tracking-tight font-display text-fg">{pick(edu.degree)}</h3>
            <p className="mt-1 text-pink-soft">{pick(edu.focus)}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-5 text-sm gap-x-5 gap-y-1.5 text-muted">
          <span className="font-medium text-body">{edu.school}</span>
          <Location>{pick(edu.location)}</Location>
          <span className="font-mono text-xs text-muted">{pick(edu.period)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- earlier studies: big year, quiet card ---------- */
function Past({ edu }) {
  const { pick } = useI18n();

  return (
    <Spot
      className="rounded-2xl border border-wine/40 bg-panel/80 transition-[border-color,transform] duration-300 hover:border-pink/40 hover:-translate-y-0.5"
      innerClassName="flex items-center gap-5 p-5 sm:gap-7 sm:p-6"
    >
      <div className="w-16 text-center shrink-0 sm:w-20">
        <p className="text-2xl font-bold leading-none font-display text-pink sm:text-3xl">{edu.year}</p>
        {pick(edu.period) !== edu.year && (
          <p className="mt-1.5 font-mono text-[11px] leading-tight text-muted">{pick(edu.period)}</p>
        )}
      </div>

      <div className="self-stretch w-px bg-wine/40" />

      <div>
        <h3 className="text-base font-semibold leading-snug text-fg sm:text-lg">{pick(edu.degree)}</h3>
        <p className="mt-1 mb-2 text-sm text-muted">{edu.school}</p>
        <div className="text-xs text-muted">
          <Location>{pick(edu.location)}</Location>
        </div>
      </div>
    </Spot>
  );
}

/* ---------- timeline dot: lights up when the beam reaches it ---------- */
function Dot() {
  const ref = useRef(null);
  const on = useInView(ref, { margin: "-45% 0px -45% 0px" });
  return (
    <span
      ref={ref}
      aria-hidden
      className={`absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-[3px] border-ink transition-all duration-500 ${
        on ? "bg-pink shadow-[0_0_0_5px_rgba(255,79,160,0.2)] scale-110" : "bg-wine-deep"
      }`}
    />
  );
}

export default function Education() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const beam = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section id="education" aria-labelledby="education-title" className="relative py-24 lg:py-28">
        <div className="section-container">
          <SectionHeading
            id="education-title"
            index="04"
            eyebrow={t("Background", "Cursus")}
            title={t("Education", "Formation")}
            subtitle={t(
              "School, in order, from the bac to the engineering cycle.",
              "L’école, dans l’ordre, du bac au cycle d’ingénieur."
            )}
          />

          <ol ref={listRef} className="relative max-w-3xl mx-auto">
            <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-wine/30" />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : beam }}
              className="absolute left-[6px] top-3 bottom-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-pink to-wine-light shadow-[0_0_14px_rgba(255,79,160,0.55)]"
            />

            {education.map((edu) => (
              <motion.li
                key={edu.school}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease }}
                className="relative pb-6 pl-10 last:pb-0"
              >
                <Dot />
                {edu.current ? <Current edu={edu} /> : <Past edu={edu} />}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}