import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Scene3D from "../components/Scene3D";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <Scene3D />

      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 pointer-events-none bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-20 pt-20 pb-16 text-center section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 font-mono text-xs border rounded border-slate-700/60 bg-slate-900/60 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            status: open_to_internship
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight font-display sm:text-5xl md:text-6xl lg:text-7xl">
            Cherifa <span className="text-amber-400">Ben Ghorbel</span>
          </h1>

          <p className="max-w-2xl mx-auto mb-3 text-lg font-medium sm:text-xl md:text-2xl text-slate-300">
            Étudiante Ingénieure en Génie Logiciel
          </p>
          <p className="max-w-xl mx-auto mb-8 font-mono text-sm tracking-tight sm:text-base text-slate-500">
            full-stack (MERN) · devops / sre
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-amber-400/80" />
              Hammam-Lif, Tunisie
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span>Télétravail ou présentiel</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a href="#projects" className="btn-primary">
              Voir mes projets
            </a>
            <a href="#contact" className="btn-outline">
              Me contacter
            </a>
          </div>

          <div className="flex items-center justify-center gap-5">
            <a
              href="mailto:cherifabenghorbel@gmail.com"
              className="p-3 transition-all border rounded-full bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-amber-400 hover:border-amber-400/50"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://github.com/cherifabenghorbel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 transition-all border rounded-full bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-amber-400 hover:border-amber-400/50"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/cherifa-ben-ghorbel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 transition-all border rounded-full bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-amber-400 hover:border-amber-400/50"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </motion.div>

        <motion.a
          href="#about"
          initial={{ opacity: 4, y: 25 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute transition-colors -translate-x-1/2 bottom-8 left-1/2 text-slate-600 hover:text-amber-400"
        >
          <ArrowDown size={22} className="animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
