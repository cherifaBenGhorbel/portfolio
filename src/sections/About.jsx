import { motion } from 'framer-motion'
import { Code2, Rocket, Users, Sparkles } from 'lucide-react'

const highlights = [
  {
    icon: Code2,
    title: 'Full-Stack MERN',
    desc: 'Une plateforme web complète construite de A à Z (MongoDB, Express, React, Node.js).',
  },
  {
    icon: Rocket,
    title: 'DevOps & SRE',
    desc: 'Spécialisation en cours : Docker, AWS, Linux, microservices et bonnes pratiques SRE.',
  },
  {
    icon: Users,
    title: 'Agile / Scrum',
    desc: '6 sprints en binôme, collaboration directe avec une association partenaire.',
  },
  {
    icon: Sparkles,
    title: 'Curieuse & autonome',
    desc: 'J’aime apprendre en construisant et explorer de nouvelles technologies.',
  },
]

export default function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="section-container">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold font-display sm:text-4xl">
            À propos
          </h2>
          <div className="w-16 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5 leading-relaxed text-slate-300"
          >
            <p className="text-lg">
              Étudiante ingénieure en <span className="text-white">Génie Logiciel</span>, 
              spécialisée en <span className="text-amber-400">DevOps & SRE</span>.
            </p>

            <p>
              Passionnée par le développement web et JavaScript, j’ai conçu et développé 
              de bout en bout une plateforme MERN dans le cadre de mon projet de fin d’études.
            </p>

            <p>
              Curieuse et autonome, j’aime comprendre comment les choses fonctionnent 
              de l’interface jusqu’à l’infrastructure.
            </p>

            <p className="text-slate-400">
              Je recherche actuellement un <span className="text-amber-300">stage en développement web </span> 
              pour continuer à progresser en environnement professionnel.
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="p-5 transition-colors border rounded-xl border-slate-800 bg-slate-900/40 hover:border-amber-400/30 group"
              >
                <div className="flex items-center justify-center mb-3 transition-colors rounded-lg w-9 h-9 bg-amber-400/10 group-hover:bg-amber-400/15">
                  <h.icon size={18} className="text-amber-400" />
                </div>
                <h3 className="mb-1 font-medium text-white">{h.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}