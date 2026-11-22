import { MotionConfig, motion, useInView, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin } from "lucide-react";

/* ---------- content ---------- */
const education = [
  {
    current: true,
    degree: "Engineering Cycle in Software Engineering",
    focus: "DevOps & SRE specialization",
    school: "Horizon Business School",
    period: "2025 – Present",
    year: "2025",
    location: "Sousse",
    note: "2nd year, ongoing",
  },
  {
    degree: "Bachelor’s Degree in Information Systems Development",
    school: "Higher Institute of Technological Studies of Nabeul (ISET)",
    period: "2022 – 2025",
    year: "2022",
    location: "Nabeul",
  },
  {
    degree: "Baccalaureate in Computer Science",
    school: "Bechir Nabhani High School",
    period: "2022",
    year: "2022",
    location: "Hammam-Lif",
  },
];

const ease = [0.22, 1, 0.36, 1];

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
          background: "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.14), transparent 70%)",
        }}
      />
      <div className={`relative ${innerClassName}`}>{children}</div>
    </div>
  );
}

const Location = ({ children }) => (
  <span className="flex items-center gap-1.5">
    <MapPin size={13} aria-hidden className="text-[#FF4FA0]/70" />
    {children}
  </span>
);

/* ---------- current studies: a light runs around the border ---------- */
function Current({ edu }) {
  return (
    <div className="relative p-px overflow-hidden rounded-2xl bg-[#7A1330]/40">
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <div className="relative rounded-[15px] bg-[#110C13] bg-gradient-to-br from-[#7A1330]/25 to-transparent p-6 sm:p-7">
        <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs rounded-full border border-[#FF4FA0]/40 bg-black/30 text-[#F0AFC6]">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-60 bg-[#FF4FA0] animate-ping motion-reduce:hidden" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#FF4FA0]" />
          </span>
          Studying now · {edu.note}
        </span>

        <div className="flex items-start gap-4">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-[#7A1330]/30 text-[#FF4FA0]">
            <GraduationCap size={22} />
          </span>
          <div>
            <h3 className="text-xl font-bold leading-snug tracking-tight font-display text-[#F4F1F6]">{edu.degree}</h3>
            <p className="mt-1 text-[#FF8FC0]">{edu.focus}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-5 text-sm gap-x-5 gap-y-1.5 text-[#B7AFC0]">
          <span className="font-medium text-[#E4DEE8]">{edu.school}</span>
          <Location>{edu.location}</Location>
          <span className="font-mono text-xs text-[#948C9C]">{edu.period}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- earlier studies: big year, quiet card ---------- */
function Past({ edu }) {
  return (
    <Spot
      className="rounded-2xl border border-[#7A1330]/40 bg-[#110C13]/80 transition-[border-color,transform] duration-300 hover:border-[#FF4FA0]/40 hover:-translate-y-0.5"
      innerClassName="flex items-center gap-5 p-5 sm:gap-7 sm:p-6"
    >
      <div className="w-16 text-center shrink-0 sm:w-20">
        <p className="text-2xl font-bold leading-none font-display text-[#FF4FA0] sm:text-3xl">{edu.year}</p>
        {edu.period !== edu.year && (
          <p className="mt-1.5 font-mono text-[11px] leading-tight text-[#948C9C]">{edu.period}</p>
        )}
      </div>

      <div className="self-stretch w-px bg-[#7A1330]/40" />

      <div>
        <h3 className="text-base font-semibold leading-snug text-[#F4F1F6] sm:text-lg">{edu.degree}</h3>
        <p className="mt-1 mb-2 text-sm text-[#B7AFC0]">{edu.school}</p>
        <div className="text-xs text-[#948C9C]">
          <Location>{edu.location}</Location>
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
      className={`absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-[3px] border-[#0A0910] transition-all duration-500 ${
        on ? "bg-[#FF4FA0] shadow-[0_0_0_5px_rgba(255,79,160,0.2)] scale-110" : "bg-[#5A1226]"
      }`}
    />
  );
}

export default function Education() {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const beam = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <MotionConfig reducedMotion="user">
      <section id="education" aria-labelledby="education-title" className="relative py-24 lg:py-28">
        <div className="section-container">
          <motion.h2
            id="education-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="mb-12 text-3xl font-bold tracking-tight text-center font-display sm:text-4xl text-[#F4F1F6]"
          >
            Education
          </motion.h2>

          <ol ref={listRef} className="relative max-w-3xl mx-auto">
            <div aria-hidden className="absolute left-[7px] top-3 bottom-3 w-px bg-[#7A1330]/30" />
            <motion.div
              aria-hidden
              style={{ scaleY: reduce ? 1 : beam }}
              className="absolute left-[6px] top-3 bottom-3 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#FF4FA0] to-[#A8203F] shadow-[0_0_14px_rgba(255,79,160,0.55)]"
            />

            {education.map((edu) => (
              <motion.li
                key={edu.degree}
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