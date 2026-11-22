import { motion, useReducedMotion } from "framer-motion";
import { Code2, Mail, Rocket, Sparkles, Users } from "lucide-react";

/* ---------- content ---------- */
const MERN = [
  { letter: "M", name: "MongoDB", role: "Data models" },
  { letter: "E", name: "Express", role: "API layer" },
  { letter: "R", name: "React", role: "User interface" },
  { letter: "N", name: "Node.js", role: "Server runtime" },
];

const ALSO = ["Angular", "NestJS", "Java", "PostgreSQL", "MySQL"];

const DEVOPS = ["Docker", "Kubernetes", "AWS", "Linux", "GitHub Actions", "Microservices", "SRE practices"];

const SPRINTS = 6;

/* ---------- motion: one orchestrated reveal for the whole grid ---------- */
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const tile = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ---------- tile with a soft spotlight that follows the cursor (no re-renders) ---------- */
function Tile({ icon: Icon, title, status, className = "", children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.article
      variants={tile}
      onPointerMove={onMove}
      className={`group relative overflow-hidden rounded-2xl border border-[#7A1330]/40 bg-[#110C13]/80 p-6
                  transition-colors duration-300 hover:border-[#FF4FA0]/40 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.10), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#7A1330]/30 text-[#FF4FA0]">
            <Icon size={20} />
          </span>
          <h3 className="text-base font-semibold text-[#F4F1F6]">{title}</h3>
          {status && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#7A1330]/50 bg-black/40 px-2.5 py-0.5 font-mono text-[11px] text-[#C9C0D1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FA0] animate-pulse" />
              {status}
            </span>
          )}
        </div>
        {children}
      </div>
    </motion.article>
  );
}

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 lg:py-32">
      <div className="section-container">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Left: story (stays in view while the tiles scroll) ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <h2 id="about-title" className="mb-6 text-3xl font-bold tracking-tight font-display sm:text-4xl text-[#F4F1F6]">
              About me
            </h2>

            <p className="mb-5 text-xl leading-snug text-[#E4DEE8]">
              Software engineering student who builds full-stack web apps and cares how they run in production.
            </p>

            <div className="max-w-prose space-y-4 leading-relaxed text-[#B7AFC0]">
              <p>
                I work across the stack in JavaScript, from React interfaces to Node.js APIs and MongoDB data models.
                My final-year project, a complete MERN platform built from scratch, taught me to own a feature end to
                end, from the database to the UI.
              </p>
              <p>
                My focus now is DevOps and SRE: containerizing with Docker, orchestrating with Kubernetes, automating
                pipelines with GitHub Actions and Jenkins, and deploying on AWS. I want the software I write to stay
                reliable once real people depend on it.
              </p>
            </div>

            {/* Call to action */}
            <div className="flex flex-col gap-4 p-5 mt-8 border rounded-2xl border-[#A8203F]/40 bg-gradient-to-br from-[#7A1330]/25 to-transparent sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-[#E4DEE8]">
                I’m looking for an <span className="font-semibold text-[#F4F1F6]">internship in full-stack development
                or DevOps/SRE</span>, remote or on-site, where I can contribute to a real product and learn from an
                experienced team.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full shrink-0
                           bg-gradient-to-r from-[#7A1330] to-[#A8203F] text-[#F4F1F6] transition-[filter,transform] hover:brightness-125 active:scale-95
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4FA0]"
              >
                <Mail size={16} />
                Contact me
              </a>
            </div>
          </motion.div>

          {/* ---------- Right: what I do, each tile shows its own content ---------- */}
          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-7"
          >
            {/* Full-stack: the four MERN layers */}
            <Tile icon={Code2} title="Full-stack MERN" className="sm:col-span-2">
              <p className="mb-5 text-sm leading-relaxed text-[#B7AFC0]">
                I built a complete platform from scratch: the data models, the API behind them, and the interface people use.
              </p>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {MERN.map((m) => (
                  <li
                    key={m.letter}
                    className="rounded-xl border border-[#7A1330]/40 bg-black/30 px-3 py-3 transition-colors hover:border-[#FF4FA0]/50"
                  >
                    <span className="block text-2xl font-bold leading-none font-display text-[#FF4FA0]">{m.letter}</span>
                    <span className="block mt-2 text-sm font-medium text-[#F4F1F6]">{m.name}</span>
                    <span className="block text-xs text-[#948C9C]">{m.role}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-[#948C9C]">
                Also comfortable with {ALSO.join(", ")}.
              </p>
            </Tile>

            {/* DevOps: the actual tools */}
            <Tile icon={Rocket} title="DevOps & SRE" status="in progress">
              <p className="mb-4 text-sm leading-relaxed text-[#B7AFC0]">
                Hands-on labs covering containers, orchestration, CI/CD and cloud, so I can ship software and keep it running.
              </p>
              <ul className="flex flex-wrap gap-2">
                {DEVOPS.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-[#7A1330]/50 bg-black/30 px-3 py-1 font-mono text-xs text-[#E4DEE8]
                               transition-colors hover:border-[#FF4FA0]/60 hover:text-[#FF8FC0]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Tile>

            {/* Agile: six dots for six sprints */}
            <Tile icon={Users} title="Agile / Scrum">
              <p className="mb-5 text-sm leading-relaxed text-[#B7AFC0]">
                Six sprints as a two-person team, delivering for a partner association and adapting to their needs along the way.
              </p>
              <div className="flex items-center gap-2" role="img" aria-label={`${SPRINTS} sprints completed`}>
                {Array.from({ length: SPRINTS }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="h-2.5 flex-1 rounded-full"
                    initial={{ backgroundColor: "rgba(122,19,48,0.35)" }}
                    whileInView={{ backgroundColor: "#FF4FA0" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : 0.5 + i * 0.12 }}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-[11px] text-[#948C9C]">6 sprints</p>
            </Tile>

            {/* Mindset */}
            <Tile icon={Sparkles} title="Self-driven learner" className="sm:col-span-2">
              <p className="text-sm leading-relaxed text-[#B7AFC0]">
                I learn by building. When something is unfamiliar, I read the docs, prototype it, and keep going until I understand how it works.
              </p>
            </Tile>
          </motion.div>
        </div>
      </div>
    </section>
  );
}