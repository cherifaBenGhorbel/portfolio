import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#about', label: 'Profil' },
  { href: '#skills', label: 'Compétences' },
  { href: '#experience', label: 'Expérience' },
  { href: '#projects', label: 'Projets' },
  { href: '#education', label: 'Formation' },
  { href: '#languages', label: 'Langues' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-16 section-container md:h-18">
        {/* Logo */}
        <a href="#" className="text-xl font-bold tracking-tight font-display">
          <span className="text-amber-400">C.</span>
          <span className="text-white">Ben Ghorbel</span>
        </a>

        {/* Desktop links */}
        <div className="items-center hidden gap-1 md:flex">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04, duration: 0.35 }}
              className="px-3 py-2 text-sm font-medium transition-colors text-slate-400 hover:text-amber-300"
            >
              {l.label}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            className="px-4 py-2 ml-3 text-sm font-medium transition-colors rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300"
          >
            Me contacter
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 transition-colors md:hidden text-slate-300 hover:text-amber-300"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b md:hidden bg-slate-950/95 backdrop-blur-xl border-slate-800"
          >
            <div className="flex flex-col gap-1 py-4 section-container">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-2 py-2.5 text-sm font-medium transition-colors text-slate-300 hover:text-amber-300"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.04, duration: 0.3 }}
                className="mt-2 px-4 py-2.5 text-sm font-medium text-center rounded-full bg-amber-400 text-slate-950"
              >
                Me contacter
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}