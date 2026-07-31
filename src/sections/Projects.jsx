import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  Play,
  X,
  Video,
  ChevronDown,
} from "lucide-react";

/*
  To hide a project → set show: false
  To show it        → set show: true
  Only projects with show: true are displayed.
*/

const projects = [
  {
    id: "pawfrindu",
    title: "PawFrindu",
    subtitle: "Adoption & services animaliers",
    description:
      "Plateforme MERN complète (60+ user stories) : adoption, vétérinaires, dressage, Lost & Found, JWT multi-rôles, paiement et chatbot.",
    tags: ["MongoDB", "Express", "React", "Node.js", "JWT"],
    // video: '/videos/pawfrindu-overview.mp4',
    status: "Projet de fin d’études",
    githubUrl: "https://github.com/chahd-fadhlaoui/pawfrindu",
    placeholder: false,
    show: true,
  },
  {
    id: "travel-story",
    title: "Travel Story",
    subtitle: "Récits de voyage",
    description:
      "Partage d’expériences de voyage avec photos et cartes interactives.",
    tags: ["React", "Node.js", "MongoDB"],
    video: "/videos/travel-story.mp4",
    status: "Projet personnel",
    githubUrl: "https://github.com/chahd-fadhlaoui/TravelStory",
    placeholder: false,
    show: true,
  },
  {
    id: "movie-streaming",
    title: "Movie Streaming",
    subtitle: "Plateforme de streaming",
    description:
      "Catalogue, recherche avancée, favoris, lecteur vidéo et recommandations.",
    tags: ["Angular", "TMDB"],
    demoUrl: "https://screenvers.netlify.app/", // live site
    githubUrl: "https://github.com/cherifaBenGhorbel/ScreenVerse",
    placeholder: false,
    // video: optional
    status: "Projet personnel",
    show: true,
  },
  {
    id: "restaurant-php",
    title: "Gestion Restaurant",
    subtitle: "Application web PHP",
    description:
      "Gestion de restaurant avec authentification 2FA via Google Authenticator.",
    tags: ["PHP", "2FA"],
    status: "Stage 2024",
    show: false, //  put false to hide it
  },
];

function ProjectCard({ project, onPlayVideo }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="flex flex-col h-full overflow-hidden border rounded-xl border-slate-800 bg-slate-900/40 group"
    >
      <div className="relative overflow-hidden aspect-video bg-slate-900">
        {project.placeholder ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
            <Video size={32} className="mb-2 opacity-50" />
            <span className="text-xs">Vidéo à venir</span>
          </div>
        ) : project.video ? (
          <>
            <video
              src={project.video}
              className="object-cover w-full h-full transition-opacity opacity-80 group-hover:opacity-100"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
            <button
              onClick={() => onPlayVideo(project)}
              className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-400 text-slate-950">
                <Play size={20} className="ml-0.5" fill="currentColor" />
              </span>
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold select-none font-display text-slate-800">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
              project.placeholder
                ? "bg-amber-400/10 text-amber-300/90 border-amber-400/20"
                : "bg-slate-900/80 text-slate-300 border-slate-700"
            }`}
          >
            {project.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="mb-0.5 text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
          {project.title}
        </h3>
        <p className="mb-2 text-sm text-slate-500">{project.subtitle}</p>
        <p className="flex-1 mb-4 text-sm leading-relaxed text-slate-400">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] rounded-md bg-slate-800/80 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.video ||
          project.demoUrl ||
          project.link ||
          project.githubUrl) && (
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
            {(project.demoUrl || project.link) && (
              <a
                href={project.demoUrl || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
              >
                <ExternalLink size={14} /> Demo
              </a>
            )}
            {project.video && (
              <button
                onClick={() => onPlayVideo(project)}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
              >
                <Play size={14} /> Overview
              </button>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
              >
                <Github size={14} /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function VideoModal({ project, onClose }) {
  if (!project?.video) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl overflow-hidden border shadow-2xl rounded-xl border-slate-700 bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <h3 className="font-medium text-white">{project.title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>
        <video
          src={project.video}
          controls
          autoPlay
          className="w-full bg-black aspect-video"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Only keep projects where show === true
  const visibleProjects = projects.filter((p) => p.show === true);

  // Then apply the "show 3 first" logic
  const displayedProjects = showAll
    ? visibleProjects
    : visibleProjects.slice(0, 3);

  return (
    <section id="projects" className="relative py-24 bg-slate-900/20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold font-display sm:text-4xl">
            Projets
          </h2>
          <div className="w-16 h-px mx-auto bg-amber-400/60" />
        </motion.div>

        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onPlayVideo={setActiveVideo}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Only show button if there are more than 3 visible projects */}
        {visibleProjects.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full border border-slate-700 text-slate-300 hover:border-amber-400/40 hover:text-amber-300 transition-colors"
            >
              {showAll
                ? "Voir moins"
                : `Voir plus (${visibleProjects.length - 3})`}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            project={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
