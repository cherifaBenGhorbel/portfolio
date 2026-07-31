import { motion } from 'framer-motion'

const languages = [
  { name: 'Arabe', level: 'Maternelle', percent: 100 },
  { name: 'Anglais', level: 'Courant', percent: 90 },
  { name: 'Français', level: 'Intermédiaire', percent: 65 },
]

export default function Languages() {
  return (
    <section id="languages" className="relative py-24 bg-slate-900/20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="mb-3 text-2xl font-bold font-display sm:text-3xl">
            Langues
          </h2>
          <div className="w-12 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        <div className="grid max-w-2xl gap-10 mx-auto sm:grid-cols-3 sm:gap-12">
          {languages.map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <p className="mb-1.5 text-base font-medium text-white">
                {lang.name}
              </p>
              <p className="mb-4 text-sm text-slate-500">{lang.level}</p>

              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.percent}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    delay: 0.2 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full rounded-full bg-amber-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}