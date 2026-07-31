import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const education = [
  {
    degree: 'Cycle Ingénieur — Génie Logiciel (DevOps & SRE)',
    school: 'Horizon Business School',
    period: '2025 – Present',
    year: '2025',
    location: 'Sousse',
    note: '1ère année (complète)',
  },
  {
    degree: 'Licence en Développement des Systèmes d’Information',
    school: 'Institut Supérieur des Études Technologiques de Nabeul (ISET)',
    period: '2022 – 2025',
    year: '2022',
    location: 'Nabeul',
  },
  {
    degree: 'Baccalauréat en Informatique',
    school: 'Lycée Bechir Nabhani',
    period: '2022',
    year: '2022',
    location: 'Hammam-Lif',
  },
]

export default function Education() {
  return (
    <section id="education" className="relative py-24">
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
            Formation
          </h2>
          <div className="w-16 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        {/* Cards with year emphasis */}
        <div className="max-w-2xl mx-auto space-y-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex gap-5 p-5 border rounded-xl border-slate-800 bg-slate-900/40 sm:gap-8"
            >
              {/* Year block */}
              <div className="flex flex-col items-center justify-center w-16 shrink-0 sm:w-20">
                <span className="text-2xl font-bold font-display text-amber-400 sm:text-3xl">
                  {edu.year}
                </span>
                <span className="mt-1 text-[11px] text-slate-500 text-center leading-tight">
                  {edu.period}
                </span>
              </div>

              {/* Divider */}
              <div className="self-stretch w-px bg-slate-800" />

              {/* Content */}
              <div className="py-0.5">
                <h3 className="mb-1 text-base font-semibold leading-snug text-white sm:text-lg">
                  {edu.degree}
                </h3>
                <p className="mb-2 text-sm text-slate-400">{edu.school}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {edu.location}
                  </span>
                  {edu.note && (
                    <span className="text-amber-400/80">{edu.note}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}