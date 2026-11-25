import { MotionConfig, animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Calendar, GraduationCap, MapPin, PawPrint, Search, ShieldCheck, Stethoscope } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Spot from "../components/Spot";
import { useI18n } from "../i18n";
import { ease } from "../lib/motion";

/* ---------- content ---------- */
const experiences = [
  {
    featured: true,
    type: { en: "Final-year internship (PFE)", fr: "Stage de fin d’études (PFE)" },
    period: { en: "1 February – 30 May 2025", fr: "1er février – 30 mai 2025" },
    role: { en: "Full-Stack Developer", fr: "Développeuse full-stack" },
    company: "Evast’In",
    location: { en: "Tunis, Tunisia", fr: "Tunis, Tunisie" },
    project: "PawFriend",
    summary: {
      en: "A full web platform where pet owners adopt animals, book veterinarians and trainers, and find lost pets.",
      fr: "Une plateforme web complète où les propriétaires adoptent des animaux, prennent rendez-vous chez les vétérinaires et les éducateurs, et retrouvent les animaux perdus.",
    },
    modules: [
      {
        icon: PawPrint,
        title: { en: "Adoption", fr: "Adoption" },
        text: { en: "Matching between pets and adopters.", fr: "Mise en relation entre animaux et adoptants." },
      },
      {
        icon: Stethoscope,
        title: { en: "Veterinarians", fr: "Vétérinaires" },
        text: { en: "Browse vets and book appointments.", fr: "Trouver un vétérinaire et réserver un rendez-vous." },
      },
      {
        icon: GraduationCap,
        title: { en: "Training", fr: "Éducation" },
        text: { en: "Find trainers and book sessions.", fr: "Trouver un éducateur et réserver une séance." },
      },
      {
        icon: Search,
        title: { en: "Lost & Found", fr: "Perdus & Trouvés" },
        text: { en: "Report and match lost or found pets.", fr: "Signaler et rapprocher les animaux perdus ou trouvés." },
      },
      {
        icon: Bot,
        title: { en: "Chatbot", fr: "Assistant" },
        text: { en: "Answers common questions from pet owners.", fr: "Répond aux questions fréquentes des propriétaires." },
      },
    ],
    stats: [
      { value: "60+", label: { en: "user stories", fr: "user stories" } },
      { value: "6", label: { en: "sprints", fr: "sprints" } },
      { value: "5", label: { en: "user roles", fr: "rôles" } },
    ],
    security: {
      en: "One login for every role: each account sees only its own space, and professional accounts wait for an admin’s approval.",
      fr: "Une seule connexion pour tous les rôles : chaque compte ne voit que son espace, et les comptes professionnels attendent l’accord d’un admin.",
    },
    team: {
      en: "Two-person Agile/Scrum team with my binôme, built with an animal-welfare association.",
      fr: "Équipe Agile/Scrum de deux personnes avec ma binôme, en lien avec une association de protection animale.",
    },
    tech: ["React", "Node.js", "Express", "MongoDB", "Git", "JWT", "Scrum"],
  },
  {
    period: { en: "Jan – Feb 2024", fr: "janv. – févr. 2024" },
    role: { en: "Advanced Internship", fr: "Stage avancé" },
    company: "Tuniversal Technologie",
    location: { en: "Hammam-Lif, Tunisia", fr: "Hammam-Lif, Tunisie" },
    summary: {
      en: "Created a Restaurant Management Platform and added 2FA Google Authenticator.",
      fr: "Création d’une plateforme de gestion de restaurant et ajout de la 2FA Google Authenticator.",
    },
    tech: ["PHP", "2FA"],
  },
  {
    period: { en: "Jan – Feb 2023", fr: "janv. – févr. 2023" },
    role: { en: "Introductory Internship", fr: "Stage d’initiation" },
    company: "LIF AFRICA",
    location: { en: "Hammam-Lif, Tunisia", fr: "Hammam-Lif, Tunisie" },
    summary: {
      en: "Built a Todo app and reproduced the company website as a practice project — my first experience working inside a team.",
      fr: "Réalisation d’une application Todo et reproduction du site de l’entreprise — ma première expérience au sein d’une équipe.",
    },
    tech: ["JavaScript", "PHP"],
  },
];

const list = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const pop = { hidden: { opacity: 0, y: 12, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } } };
const inViewProps = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-40px" } };

/* ---------- number that counts up when it scrolls into view ---------- */
function CountUp({ value }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const target = parseInt(value, 10);
  const suffix = value.replace(/[0-9]/g, "");
  const [n, setN] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, target, { duration: 1.4, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, target]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

function ChipList({ items }) {
  const { pick } = useI18n();
  return (
    <motion.ul variants={list} {...inViewProps} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <motion.li
          key={pick(item)}
          variants={pop}
          className="rounded-full border border-wine/50 bg-tint px-3 py-1 text-xs text-body transition-colors hover:border-pink/60 hover:text-pink-soft"
        >
          {pick(item)}
        </motion.li>
      ))}
    </motion.ul>
  );
}

const Meta = ({ exp }) => {
  const { pick } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
      <span className="font-medium text-pink-soft">{exp.company}</span>
      <span className="flex items-center gap-1.5">
        <MapPin size={14} aria-hidden className="text-pink/70" />
        {pick(exp.location)}
      </span>
      <span className="flex items-center gap-1.5 text-muted">
        <Calendar size={14} aria-hidden />
        {pick(exp.period)}
      </span>
    </div>
  );
};

/* ---------- main internship: a light runs around its border ---------- */
function Featured({ exp }) {
  const { t, pick } = useI18n();

  return (
    <div className="relative p-px overflow-hidden rounded-2xl bg-wine/40">
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <div className="relative rounded-[15px] bg-panel bg-gradient-to-br from-wine/25 to-transparent p-6 sm:p-8">
        <span className="inline-block px-3 py-1 mb-4 text-xs rounded-full border border-pink/40 bg-tint text-pink-chip">
          {pick(exp.type)}
        </span>

        <h3 className="text-2xl font-bold tracking-tight font-display text-fg">{pick(exp.role)}</h3>
        <div className="mt-2 mb-6">
          <Meta exp={exp} />
        </div>

        <p className="mb-1 text-xl font-bold shimmer font-display">{exp.project}</p>
        <p className="max-w-xl mb-6 leading-relaxed text-muted">{pick(exp.summary)}</p>

        <motion.dl variants={list} {...inViewProps} className="grid grid-cols-3 gap-3 mb-8">
          {exp.stats.map((s) => (
            <motion.div
              key={pick(s.label)}
              variants={pop}
              className="rounded-xl border border-wine/30 px-4 py-3"
            >
              <dd className="text-2xl font-bold leading-none font-display text-pink sm:text-3xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-1.5 text-xs text-muted">{pick(s.label)}</dt>
            </motion.div>
          ))}
        </motion.dl>

        <h4 className="mb-3 text-sm font-semibold text-fg">{t("What it does", "Ce que ça fait")}</h4>
        <motion.ul variants={list} {...inViewProps} className="grid gap-x-8 gap-y-4 mb-7 sm:grid-cols-2">
          {exp.modules.map(({ icon: Icon, title, text }) => (
            <motion.li key={pick(title)} variants={pop} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-pink-chip">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-fg">{pick(title)}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{pick(text)}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <ul className="mb-6 space-y-2.5">
          <li className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
            <ShieldCheck size={18} aria-hidden className="mt-0.5 shrink-0 text-pink" />
            {pick(exp.security)}
          </li>
          <li className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
            <span aria-hidden className="mt-[10px] ml-[7px] mr-[5px] h-1 w-1 shrink-0 rounded-full bg-pink" />
            {pick(exp.team)}
          </li>
        </ul>

        <ChipList items={exp.tech} />
      </div>
    </div>
  );
}

/* ---------- earlier internships stay light ---------- */
function Compact({ exp }) {
  const { pick } = useI18n();

  return (
    <Spot
      className="rounded-2xl border border-wine/40 bg-panel/80 transition-[border-color,transform] duration-300 hover:border-pink/40 hover:-translate-y-0.5"
      innerClassName="p-5 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-fg">{pick(exp.role)}</h3>
      <div className="mt-1.5 mb-3">
        <Meta exp={exp} />
      </div>
      <p className="mb-4 text-[15px] leading-relaxed text-muted">{pick(exp.summary)}</p>
      <ChipList items={exp.tech} />
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

export default function Experience() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const beam = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" aria-labelledby="experience-title" className="relative py-24 lg:py-28">
        <style>{`
          .shimmer {
            background: linear-gradient(90deg, rgb(var(--c-fg)) 0%, rgb(var(--c-pink-soft)) 40%, rgb(var(--c-pink)) 55%, rgb(var(--c-fg)) 100%);
            background-size: 200% 100%;
            -webkit-background-clip: text; background-clip: text;
            color: transparent;
            animation: shimmer 5s ease-in-out infinite alternate;
          }
          @keyframes shimmer { from { background-position: 0% 0; } to { background-position: 100% 0; } }
          @media (prefers-reduced-motion: reduce) { .shimmer { animation: none; } }
        `}</style>

        <div className="section-container">
          <SectionHeading
            id="experience-title"
            index="02"
            eyebrow={t("Journey", "Parcours")}
            title={t("Experience", "Expérience")}
            subtitle={t(
              "Three internships, each one a little bigger than the last.",
              "Trois stages, chacun un peu plus gros que le précédent."
            )}
          />

          <ol ref={listRef} className="relative max-w-3xl mx-auto">
            {/* tracing beam: grows as you scroll */}
            <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-wine/30" />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : beam }}
              className="absolute left-[6px] top-3 bottom-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-pink to-wine-light shadow-[0_0_14px_rgba(255,79,160,0.55)]"
            />

            {experiences.map((exp) => (
              <motion.li
                key={exp.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease }}
                className="relative pb-8 pl-10 last:pb-0"
              >
                <Dot />
                {exp.featured ? <Featured exp={exp} /> : <Compact exp={exp} />}
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}