import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

const experiences = [
  {
    role: 'Développeuse Full-Stack',
    company: "EVAST'IN",
    period: '01/2025 – 06/2025',
    location: 'Ennasr 2',
    highlights: [
      <>Développement de <strong className="text-white">PawFrindu</strong> — plateforme MERN complète (60+ user stories)</>,
      <>Authentification <strong className="text-white">JWT</strong> multi-rôles + validation admin</>,
      <>Modules Adoption, Vétérinaires, Dressage & <strong className="text-white">Lost & Found</strong> avec matching multicritère</>,
      <><strong className="text-white">Agile/Scrum</strong> — 6 sprints en binôme avec association partenaire</>,
    ],
  },
  {
    role: 'Stage de Perfectionnement',
    company: 'Tuniversal Technologie',
    period: '01/2024 – 02/2024',
    location: 'Hammam-Lif',
    highlights: [
      <>Application de gestion de restaurant en <strong className="text-white">PHP</strong></>,
      <>Authentification <strong className="text-white">2FA</strong> avec Google Authenticator</>,
    ],
  },
  {
    role: "Stage d'Initiation",
    company: 'LIF AFRICA',
    period: '01/2023 – 02/2023',
    location: 'Hammam-Lif',
    highlights: [
      <>Deux apps <strong className="text-white">JavaScript / PHP</strong> développées en autonomie</>,
      <>Découverte des pratiques de travail en équipe</>,
    ],
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function Experience() {
  return (
    <section id="experience" className="relative py-24">
      <div className="section-container">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold font-display sm:text-4xl">
            Expériences
          </h2>
          <div className="w-16 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-slate-800" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-10"
              >
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-[3px] border-slate-950 bg-amber-400" />

                {/* Header */}
                <div className="mb-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <h3 className="text-lg font-semibold text-white">
                      {exp.company}
                    </h3>
                    <span className="text-sm text-amber-400/90">
                      {exp.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Highlights with stagger */}
                <motion.ul
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  {exp.highlights.map((h, j) => (
                    <motion.li
                      key={j}
                      variants={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-slate-400"
                    >
                      <span className="mt-[9px] w-1 h-1 rounded-full bg-amber-400/50 shrink-0" />
                      <span>{h}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}