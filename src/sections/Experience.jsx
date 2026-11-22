import { MotionConfig, motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";

const B = ({ children }) => <strong className="font-semibold text-[#F4F1F6]">{children}</strong>;

const experiences = [
  {
    type: "Final-year internship",
    period: "3 Mar 2025 – 17 Jun 2025",
    role: "Full-Stack Developer",
    company: "Evast’In",
    location: "Tunis, Tunisia",
    summary: (
      <>
        Designed and developed <B>PawFriend</B>, a web platform dedicated to pet adoption and appointment booking with
        veterinarians and trainers.
      </>
    ),
    highlights: [
      <>
        Developed a full-stack application using <B>React, Node.js, Express, and MongoDB</B>, a complete MERN platform
        covering <B>60+ user stories</B>.
      </>,
      <>
        Implemented multi-role <B>JWT</B> authentication with admin validation, and role-based access control (
        <B>RBAC</B>) for administrators, veterinarians, trainers, and pet owners.
      </>,
      <>
        Built the Adoption, Veterinarians, Training and <B>Lost &amp; Found</B> modules, including multi-criteria
        matching.
      </>,
      <>
        Collaborated in a two-person team using <B>Agile/Scrum</B>, organized into six sprints with incremental
        releases, in direct collaboration with a partner association.
      </>,
    ],
  },
  {
    period: "Jan 2024 – Feb 2024",
    role: "Advanced Internship",
    company: "Tuniversal Technologie",
    location: "Hammam-Lif, Tunisia",
    highlights: [
      <>
        Restaurant management application built in <B>PHP</B>.
      </>,
      <>
        <B>2FA</B> authentication with Google Authenticator.
      </>,
    ],
  },
  {
    period: "Jan 2023 – Feb 2023",
    role: "Introductory Internship",
    company: "LIF AFRICA",
    location: "Hammam-Lif, Tunisia",
    highlights: [
      <>
        Two <B>JavaScript / PHP</B> apps developed independently.
      </>,
      <>Discovered team working practices.</>,
    ],
  },
];

export default function Experience() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="experience" aria-labelledby="experience-title" className="relative py-24 lg:py-32">
        <div className="section-container">
          <motion.h2
            id="experience-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-3xl font-bold tracking-tight text-center font-display sm:text-4xl text-[#F4F1F6]"
          >
            Experience
          </motion.h2>

          <ol className="relative max-w-3xl mx-auto">
            {/* timeline line */}
            <div aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-[#7A1330]/40" />

            {experiences.map((exp, i) => (
              <motion.li
                key={exp.company}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 pb-14 last:pb-0"
              >
                {/* dot: the most recent one glows */}
                <span
                  aria-hidden
                  className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-[3px] border-[#0A0910] ${
                    i === 0
                      ? "bg-[#FF4FA0] shadow-[0_0_0_4px_rgba(255,79,160,0.18)]"
                      : "bg-[#A8203F]"
                  }`}
                />

                {/* date + type */}
                <div className="flex flex-wrap items-center mb-3 gap-x-4 gap-y-2">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[#948C9C]">
                    <Calendar size={13} aria-hidden />
                    {exp.period}
                  </span>
                  {exp.type && (
                    <span className="rounded-full border border-[#7A1330]/50 bg-black/30 px-2.5 py-0.5 font-mono text-[11px] text-[#F0AFC6]">
                      {exp.type}
                    </span>
                  )}
                </div>

                {/* role + company */}
                <h3 className="text-xl font-semibold text-[#F4F1F6]">{exp.role}</h3>
                <p className="flex flex-wrap items-center mt-1 mb-4 text-sm gap-x-4 gap-y-1 text-[#B7AFC0]">
                  <span className="font-medium text-[#FF8FC0]">{exp.company}</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} aria-hidden className="text-[#FF4FA0]/70" />
                    {exp.location}
                  </span>
                </p>

                {/* content */}
                {exp.summary && <p className="mb-4 leading-relaxed text-[#E4DEE8]">{exp.summary}</p>}
                <ul className="space-y-2">
                  {exp.highlights.map((h, i2) => (
                    <li key={i2} className="flex gap-3 text-[15px] leading-relaxed text-[#B7AFC0]">
                      <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#FF4FA0]/70" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}