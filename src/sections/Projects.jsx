import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronDown, ExternalLink, Github, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------- content ---------- */
// Optional per project: image: "/images/xyz.png" (shown when there is no video)
const projects = [
  {
    id: "pawfrindu",
    title: "PawFriend",
    subtitle: "Pet adoption & services platform",
    description:
      "Full MERN platform (60+ user stories): adoption, veterinarians, training, Lost & Found, multi-role JWT, payments and chatbot.",
    tags: ["MongoDB", "Express", "React", "Node.js", "GitHub"],
    video: "/videos/pawfrindu.mp4",
    status: "Final-year project",
    githubUrl: "https://github.com/chahd-fadhlaoui/pawfrindu",
    show: true,
  },
  {
    id: "travel-story",
    title: "Travel Story",
    subtitle: "Travel experiences sharing",
    description: "Share travel stories with photos and interactive maps.",
    tags: ["React", "Node.js", "MongoDB", "GitHub"],
    video: "/videos/travel-story.mp4",
    status: "Personal project",
    githubUrl: "https://github.com/chahd-fadhlaoui/TravelStory",
    show: true,
  },
  {
    id: "movie-streaming",
    title: "ScreenVerse",
    subtitle: "Movie streaming platform",
    description: "Catalog, advanced search, favorites, video player and recommendations.",
    tags: ["Angular", "TMDB"],
    demoUrl: "https://screenvers.netlify.app/",
    githubUrl: "https://github.com/cherifaBenGhorbel/ScreenVerse",
    status: "Personal project",
    show: true,
  },
  {
    id: "restaurant-php",
    title: "Restaurant Management",
    subtitle: "PHP web application",
    description: "Restaurant management system with 2FA authentication via Google Authenticator.",
    tags: ["PHP", "2FA"],
    status: "Internship 2024",
    show: false,
  },
];

const ease = [0.22, 1, 0.36, 1];
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4FA0]";

/* ---------- soft spotlight that follows the cursor (no re-renders) ---------- */
function Spot({ className = "", children }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onPointerMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100"
        style={{
          background: "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.12), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}

/* ---------- media: video preview on hover, or an image, or a styled placeholder ---------- */
function Media({ project, onPlay, tall = false }) {
  const hasVideo = Boolean(project.video);
  return (
    <div className={`relative overflow-hidden bg-[#0A0910] ${tall ? "aspect-video lg:aspect-auto lg:h-full lg:min-h-[320px]" : "aspect-video"}`}>
      {hasVideo ? (
        <video
          src={project.video}
          className="object-cover w-full h-full transition-[opacity,transform] duration-500 opacity-80 group-hover:opacity-100 group-hover:scale-[1.03]"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      ) : project.image ? (
        <img src={project.image} alt="" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(122,19,48,0.55),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(255,79,160,0.18),transparent_55%)]"
        >
          <span className="text-6xl font-bold select-none font-display text-[#FF4FA0]/40 transition-transform duration-500 group-hover:scale-110">
            {project.title.charAt(0)}
          </span>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0910]/70 via-transparent to-transparent" />

      <span className="absolute top-3 left-3 rounded-full border border-[#7A1330]/50 bg-black/70 px-2.5 py-0.5 text-[11px] font-medium text-[#C9C0D1] backdrop-blur">
        {project.status}
      </span>

      {hasVideo && (
        <button
          onClick={() => onPlay(project)}
          aria-label={`Watch the ${project.title} overview`}
          className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 ${focusRing}`}
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FF4FA0] text-[#0A0910] shadow-[0_0_0_8px_rgba(255,79,160,0.25)] transition-transform duration-300 group-hover:scale-110">
            <Play size={22} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}

      {/* touch screens have no hover, so keep a small visible cue */}
      {hasVideo && (
        <span aria-hidden className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-[#E4DEE8] backdrop-blur [@media(hover:hover)]:hidden">
          <Play size={11} fill="currentColor" /> Watch
        </span>
      )}
    </div>
  );
}

function Links({ project, onPlay }) {
  const base = `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-[filter,transform,background-color,border-color] active:scale-95 ${focusRing}`;
  const solid = `${base} bg-gradient-to-r from-[#7A1330] to-[#A8203F] text-[#F4F1F6] hover:brightness-125`;
  const ghost = `${base} border border-[#7A1330]/60 text-[#E4DEE8] hover:border-[#FF4FA0]/60 hover:text-[#FF8FC0]`;
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={solid}>
          <ExternalLink size={14} /> Live demo
        </a>
      )}
      {project.video && (
        <button onClick={() => onPlay(project)} className={solid}>
          <Play size={14} fill="currentColor" /> Watch overview
        </button>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={ghost}>
          <Github size={14} /> Code
        </a>
      )}
    </div>
  );
}

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <li key={t} className="rounded-full border border-[#7A1330]/50 bg-black/30 px-2.5 py-0.5 text-[11px] text-[#C9C0D1]">
          {t}
        </li>
      ))}
    </ul>
  );
}

/* ---------- the main project: wide card, light running around the border ---------- */
function Featured({ project, onPlay }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease }}
      className="relative p-px mb-6 overflow-hidden rounded-2xl bg-[#7A1330]/40"
    >
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <Spot className="relative grid rounded-[15px] bg-[#110C13] lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Media project={project} onPlay={onPlay} tall />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 lg:col-span-2 sm:p-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight font-display text-[#F4F1F6]">{project.title}</h3>
            <p className="mt-1 text-sm text-[#FF8FC0]">{project.subtitle}</p>
          </div>
          <p className="text-[15px] leading-relaxed text-[#B7AFC0]">{project.description}</p>
          <Tags tags={project.tags} />
          <Links project={project} onPlay={onPlay} />
        </div>
      </Spot>
    </motion.article>
  );
}

function Card({ project, onPlay, index }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.1, ease }}
      className="h-full"
    >
      <Spot className="flex flex-col h-full rounded-2xl border border-[#7A1330]/45 bg-[#110C13]/80 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[#FF4FA0]/40">
        <Media project={project} onPlay={onPlay} />
        <div className="flex flex-col flex-1 gap-3 p-5">
          <div>
            <h3 className="text-lg font-semibold text-[#F4F1F6]">{project.title}</h3>
            <p className="text-sm text-[#948C9C]">{project.subtitle}</p>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-[#B7AFC0]">{project.description}</p>
          <Tags tags={project.tags} />
          <div className="pt-3 mt-1 border-t border-[#7A1330]/40">
            <Links project={project} onPlay={onPlay} />
          </div>
        </div>
      </Spot>
    </motion.article>
  );
}

function VideoModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} overview video`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-full max-w-3xl overflow-hidden border shadow-[0_0_60px_rgba(255,79,160,0.2)] rounded-2xl border-[#7A1330]/50 bg-[#110C13]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#7A1330]/40">
          <h3 className="font-medium text-[#F4F1F6]">{project.title}</h3>
          <button
            onClick={onClose}
            aria-label="Close video"
            autoFocus
            className={`rounded-lg p-1.5 text-[#B7AFC0] transition-colors hover:bg-[#7A1330]/30 hover:text-[#FF4FA0] ${focusRing}`}
          >
            <X size={18} />
          </button>
        </div>
        <video src={project.video} controls autoPlay className="w-full bg-black aspect-video" />
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visible = projects.filter((p) => p.show);
  const [main, ...rest] = visible;
  const shown = showAll ? rest : rest.slice(0, 2);

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" aria-labelledby="projects-title" className="relative py-24 lg:py-28">
        <div className="section-container">
          <motion.h2
            id="projects-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease }}
            className="mb-12 text-3xl font-bold tracking-tight text-center font-display sm:text-4xl text-[#F4F1F6]"
          >
            Projects
          </motion.h2>

          <div className="max-w-5xl mx-auto">
            {main && <Featured project={main} onPlay={setActiveVideo} />}

            <motion.div layout className="grid gap-6 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {shown.map((p, i) => (
                  <Card key={p.id} project={p} index={i} onPlay={setActiveVideo} />
                ))}
              </AnimatePresence>
            </motion.div>

            {rest.length > 2 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                  className={`inline-flex items-center gap-2 rounded-full border border-[#7A1330]/50 px-5 py-2.5 text-sm font-medium text-[#C9C0D1] transition-colors hover:border-[#FF4FA0]/60 hover:text-[#FF4FA0] ${focusRing}`}
                >
                  {showAll ? "Show less" : `Show more (${rest.length - 2})`}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
                </button>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {activeVideo && <VideoModal project={activeVideo} onClose={() => setActiveVideo(null)} />}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}