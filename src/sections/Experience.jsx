import { MotionConfig, animate, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bot, Calendar, GraduationCap, MapPin, PawPrint, Search, ShieldCheck, Stethoscope } from "lucide-react";

/* ---------- content ---------- */
const experiences = [
  {
    featured: true,
    type: "Final-year internship",
    period: "1 February – 30 May 2025",
    role: "Full-Stack Developer",
    company: "Evast’In",
    location: "Tunis, Tunisia",
    project: "PawFriend",
    summary: "A full web platform where pet owners adopt animals, book veterinarians and trainers, and find lost pets.",
    roles: ["Pet owners", "Veterinarians", "Trainers", "Admins"],
    modules: [
      { icon: PawPrint, title: "Adoption", text: "Matching between pets and adopters." },
      { icon: Stethoscope, title: "Veterinarians", text: "Browse vets and book appointments." },
      { icon: GraduationCap, title: "Training", text: "Find trainers and book sessions." },
      { icon: Search, title: "Lost & Found", text: "Report and match lost or found pets." },
      // TODO: edit this line so it says what your chatbot really does
      { icon: Bot, title: "Chatbot", text: "An assistant that helps pet owners." },
    ],
    stats: [
      { value: "60+", label: "user stories" },
      { value: "6", label: "sprints" },
      { value: "4", label: "user roles" },
    ],
    security: "Multi-role login, admin validation and role-based access control (RBAC).",
    team: "Two-person Agile/Scrum team, working with a partner association.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Git", "RBAC", "Scrum"],
  },
  {
    period: "Jan – Feb 2024",
    role: "Advanced Internship",
    company: "Tuniversal Technologie",
    location: "Hammam-Lif, Tunisia",
    summary: "Created a Restaurant Management Platform and added 2FA Google Authenticator.",
    tech: ["PHP", "2FA"],
  },
  {
    period: "Jan – Feb 2023",
    role: "Introductory Internship",
    company: "LIF AFRICA",
    location: "Hammam-Lif, Tunisia",
    summary: "Built a Todo app and made a likehood to the official website of the company, and my first experience of working in a team.",
    tech: ["JavaScript", "PHP"],
  },
];

const ease = [0.22, 1, 0.36, 1];
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

/* ---------- soft spotlight that follows the cursor (no re-renders) ---------- */
function Spot({ className = "", innerClassName = "", children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100"
        style={{
          background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.14), transparent 70%)",
        }}
      />
      <div className={`relative ${innerClassName}`}>{children}</div>
    </div>
  );
}

function ChipList({ items, tone = "plain", className = "" }) {
  const style =
    tone === "pink"
      ? "border-[#FF4FA0]/40 bg-[#7A1330]/20 text-[#F0AFC6]"
      : "border-[#7A1330]/50 bg-black/30 text-[#E4DEE8] hover:border-[#FF4FA0]/60 hover:text-[#FF8FC0]";
  return (
    <motion.ul variants={list} {...inViewProps} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t) => (
        <motion.li
          key={t}
          variants={pop}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${style}`}
        >
          {t}
        </motion.li>
      ))}
    </motion.ul>
  );
}

const Meta = ({ exp }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-[#B7AFC0]">
    <span className="font-medium text-[#FF8FC0]">{exp.company}</span>
    <span className="flex items-center gap-1.5">
      <MapPin size={14} aria-hidden className="text-[#FF4FA0]/70" />
      {exp.location}
    </span>
    <span className="flex items-center gap-1.5 text-[#948C9C]">
      <Calendar size={14} aria-hidden />
      {exp.period}
    </span>
  </div>
);

/* ---------- main internship: a light runs around its border ---------- */
function Featured({ exp }) {
  return (
    <div className="relative p-px overflow-hidden rounded-2xl bg-[#7A1330]/40">
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <div className="relative rounded-[15px] bg-[#110C13] bg-gradient-to-br from-[#7A1330]/25 to-transparent p-6 sm:p-8">
        <span className="inline-block px-3 py-1 mb-4 text-xs rounded-full border border-[#FF4FA0]/40 bg-black/30 text-[#F0AFC6]">
          {exp.type}
        </span>

        <h3 className="text-2xl font-bold tracking-tight font-display text-[#F4F1F6]">{exp.role}</h3>
        <div className="mt-2 mb-6">
          <Meta exp={exp} />
        </div>

        <p className="mb-1 text-xl font-bold shimmer font-display">{exp.project}</p>
        <p className="max-w-xl mb-6 leading-relaxed text-[#B7AFC0]">{exp.summary}</p>

        <motion.dl variants={list} {...inViewProps} className="grid grid-cols-3 gap-3 mb-8">
          {exp.stats.map((s) => (
            <motion.div
              key={s.label}
              variants={pop}
              className="rounded-xl border border-[#7A1330]/40 bg-black/30 px-4 py-3"
            >
              <dd className="text-2xl font-bold leading-none font-display text-[#FF4FA0] sm:text-3xl">
                <CountUp value={s.value} />
              </dd>
              <dt className="mt-1.5 text-xs text-[#B7AFC0]">{s.label}</dt>
            </motion.div>
          ))}
        </motion.dl>

        <h4 className="mb-3 text-sm font-semibold text-[#F4F1F6]">What it does</h4>
        <motion.ul variants={list} {...inViewProps} className="grid gap-3 mb-8 sm:grid-cols-2">
          {exp.modules.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              variants={pop}
              className={i === exp.modules.length - 1 && exp.modules.length % 2 ? "sm:col-span-2" : ""}
            >
              <Spot
                className="h-full rounded-xl border border-[#7A1330]/40 bg-black/30 transition-colors hover:border-[#FF4FA0]/50"
                innerClassName="flex items-start gap-3 p-4"
              >
                <span className="flex items-center justify-center rounded-lg h-9 w-9 shrink-0 bg-[#7A1330]/30 text-[#FF4FA0] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#F4F1F6]">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#B7AFC0]">{text}</p>
                </div>
              </Spot>
            </motion.li>
          ))}
        </motion.ul>

        <h4 className="mb-3 text-sm font-semibold text-[#F4F1F6]">Four kinds of users</h4>
        <ChipList items={exp.roles} tone="pink" className="mb-8" />

        <ul className="mb-6 space-y-2.5">
          <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[#B7AFC0]">
            <ShieldCheck size={18} aria-hidden className="mt-0.5 shrink-0 text-[#FF4FA0]" />
            {exp.security}
          </li>
          <li className="flex items-start gap-3 text-[15px] leading-relaxed text-[#B7AFC0]">
            <span aria-hidden className="mt-[10px] ml-[7px] mr-[5px] h-1 w-1 shrink-0 rounded-full bg-[#FF4FA0]" />
            {exp.team}
          </li>
        </ul>

        <ChipList items={exp.tech} />
      </div>
    </div>
  );
}

/* ---------- earlier internships stay light ---------- */
function Compact({ exp }) {
  return (
    <Spot
      className="rounded-2xl border border-[#7A1330]/40 bg-[#110C13]/80 transition-[border-color,transform] duration-300 hover:border-[#FF4FA0]/40 hover:-translate-y-0.5"
      innerClassName="p-5 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-[#F4F1F6]">{exp.role}</h3>
      <div className="mt-1.5 mb-3">
        <Meta exp={exp} />
      </div>
      <p className="mb-4 text-[15px] leading-relaxed text-[#B7AFC0]">{exp.summary}</p>
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
      className={`absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-[3px] border-[#0A0910] transition-all duration-500 ${
        on ? "bg-[#FF4FA0] shadow-[0_0_0_5px_rgba(255,79,160,0.2)] scale-110" : "bg-[#5A1226]"
      }`}
    />
  );
}

export default function Experience() {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const beam = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" aria-labelledby="experience-title" className="relative py-24 lg:py-32">
        <style>{`
          .shimmer {
            background: linear-gradient(90deg, #F4F1F6 0%, #FF8FC0 40%, #FF4FA0 55%, #F4F1F6 100%);
            background-size: 200% 100%;
            -webkit-background-clip: text; background-clip: text;
            color: transparent;
            animation: shimmer 5s ease-in-out infinite alternate;
          }
          @keyframes shimmer { from { background-position: 0% 0; } to { background-position: 100% 0; } }
          @media (prefers-reduced-motion: reduce) { .shimmer { animation: none; } }
        `}</style>

        <div className="section-container">
          <motion.h2
            id="experience-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="mb-12 text-3xl font-bold tracking-tight text-center font-display sm:text-4xl text-[#F4F1F6]"
          >
            Experience
          </motion.h2>

          <ol ref={listRef} className="relative max-w-3xl mx-auto">
            {/* tracing beam: grows as you scroll */}
            <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-[#7A1330]/30" />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : beam }}
              className="absolute left-[6px] top-3 bottom-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#FF4FA0] to-[#A8203F] shadow-[0_0_14px_rgba(255,79,160,0.55)]"
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