import { motion } from 'framer-motion'

const allSkills = [
  'JavaScript', 'React.js', 'Angular', 'Node.js', 'Express.js', 'MongoDB',
  'HTML/CSS', 'Java', 'PHP', 'SQL', 'Git', 'Docker', 'AWS', 'Linux',
  'Agile/Scrum', 'Selenium', 'JWT', 'REST API'
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 bg-slate-900/20">
      <div className="section-container">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="mb-3 text-3xl font-bold font-display sm:text-4xl">
            Compétences
          </h2>
          <div className="w-16 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        {/* Skill pills */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="flex flex-wrap justify-center gap-2.5"
        >
          {allSkills.map((skill) => (
            <motion.span
              key={skill}
              variants={item}
              whileHover={{
                y: -3,
                scale: 1.05,
                borderColor: 'rgba(251, 191, 36, 0.45)',
                color: '#fcd34d',
                transition: { type: 'spring', stiffness: 300, damping: 18 },
              }}
              className="px-3.5 py-1.5 text-sm rounded-full border border-slate-700/70 bg-slate-900/50 text-slate-300 cursor-default select-none"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}