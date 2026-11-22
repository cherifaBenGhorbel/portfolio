import { motion } from "framer-motion";

const SKILLS = [
  "JavaScript", "React.js", "Node.js", "Docker", "MongoDB", "Kubernetes",
  "Angular", "Express.js", "AWS","DevOps","CI/CD", 
  "Java", "GitHub Actions", "MySQL", "REST API", "Jenkins", "PHP",
  "Git", "JWT", "HTML/CSS", "Agile/Scrum", "Selenium",
];

function Copy({ hidden = false }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex gap-4 pr-4 shrink-0 skills-copy">
      {SKILLS.map((s) => (
        <li
          key={s}
          className="flex items-center gap-3 px-6 py-3 text-base rounded-full border border-[#7A1330]/50 bg-[#110C13]/70
                     text-[#E4DEE8] whitespace-nowrap select-none transition-colors duration-200
                     hover:border-[#FF4FA0]/70 hover:text-[#FF8FC0]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FA0]" aria-hidden />
          {s}
        </li>
      ))}
    </ul>
  );
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-20 overflow-hidden lg:py-28">
      <style>{`
        @keyframes skills-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .skills-track { animation: skills-scroll 70s linear infinite; will-change: transform; }
        .skills-band:hover .skills-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .skills-track { animation: none; width: auto; }
          .skills-copy { flex-wrap: wrap; justify-content: center; padding: 0 1rem; }
          .skills-copy[aria-hidden] { display: none; }
        }
      `}</style>

      <motion.h2
        id="skills-title"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-3xl font-bold tracking-tight text-center font-display sm:text-4xl text-[#F4F1F6]"
      >
        Skills
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="py-2 overflow-hidden skills-band"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div className="flex w-max skills-track">
          <Copy />
          <Copy hidden />
        </div>
      </motion.div>
    </section>
  );
}