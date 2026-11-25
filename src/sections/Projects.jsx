import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";
import SectionHeading from "../components/SectionHeading";
import Spot from "../components/Spot";
import { ease, focusRing } from "../lib/motion";

/* ---------- content ---------- */
// Optional per project: image: "/images/xyz.png" (shown when there is no video)
const projects = [
  {
    id: "pawfrindu",
    title: "PawFrindu",
    subtitle: {
      en: "Final-year project (PFE) — pet adoption & care platform",
      fr: "Projet de fin d’études (PFE) — plateforme d’adoption",
    },
    description: {
      en: "An adoption and pet-care platform built for an animal-welfare association: owners publish pets, applicants apply, and vets and trainers manage their own appointments. Five account types, real card payments in TND, a map of lost and found pets, and an assistant that answers adoption, vet and training questions.",
      fr: "Une plateforme d’adoption et de soins pour une association de protection animale : les propriétaires publient des animaux, les candidats postulent, et vétérinaires comme éducateurs gèrent leur propre agenda. Cinq types de comptes, de vrais paiements par carte en TND, une carte des animaux perdus et trouvés, et un assistant qui répond aux questions d’adoption, de vétérinaire et d’éducation.",
    },
    points: [
      {
        en: "Five roles — pet owner, vet, trainer, admin, super-admin — with vet and trainer accounts staying inactive until an admin approves them.",
        fr: "Cinq rôles — propriétaire, vétérinaire, éducateur, admin, super-admin — les comptes vétérinaire et éducateur restant inactifs jusqu’à validation par un admin.",
      },
      {
        en: "Adoption workflow: applicants apply on a pet, the owner approves or rejects each candidate, and pets with a fee are paid by card through Konnect — the payment counts as done only when the confirmation comes back.",
        fr: "Parcours d’adoption : les candidats postulent, le propriétaire approuve ou refuse chacun, et les animaux payants se règlent par carte via Konnect — le paiement ne compte comme fait que lorsque la confirmation revient.",
      },
      {
        en: "Appointments follow the availability each professional sets day by day, and a slot that is already taken is refused.",
        fr: "Les rendez-vous suivent les disponibilités que chaque professionnel définit jour par jour, et un créneau déjà pris est refusé.",
      },
      {
        en: "Lost & Found: reports appear on a map, and the app suggests matches by photo, place and microchip number. Both people get an email, and the report moves from “matched” to “reunited”.",
        fr: "Perdus & Trouvés : les annonces apparaissent sur une carte, et l’application propose des correspondances par photo, lieu et numéro de puce. Les deux personnes reçoivent un email, et l’annonce passe de « rapprochée » à « retrouvée ».",
      },
    ],
    tags: ["MongoDB", "Express", "React", "Node.js", "JWT", "Socket.IO", "Konnect"],
    video: "/videos/pawfrindu.mp4",
    poster: "/videos/pawfrindu-poster.jpg",
    status: { en: "Final-year project", fr: "Projet de fin d’études" },
    githubUrl: "https://github.com/chahd-fadhlaoui/pawfrindu",
  },
  {
    id: "gourmet-go",
    title: "Gourmet-Go",
    subtitle: { en: "Food ordering, split into five services", fr: "Commande de repas, découpée en cinq services" },
    description: {
      en: "A food-ordering platform split into five small applications that each do one job: payment, stock, orders and so on. If one step fails, the steps already done are cancelled, so an order is never left half-paid. The interface shows each step as it happens.",
      fr: "Une plateforme de commande de repas découpée en cinq petites applications qui font chacune un seul travail : paiement, stock, commandes, etc. Si une étape échoue, celles déjà faites sont annulées : une commande n’est jamais laissée à moitié payée. L’interface montre chaque étape au fur et à mesure.",
    },
    points: [
      {
        en: "Each service keeps its own database and exposes a small contract that the others call.",
        fr: "Chaque service garde sa propre base de données et expose un petit contrat que les autres appellent.",
      },
      {
        en: "One service coordinates the steps and cancels them in reverse order when something fails.",
        fr: "Un service coordonne les étapes et les annule dans l’ordre inverse quand quelque chose échoue.",
      },
      {
        en: "On every push, GitHub Actions builds and publishes the six Docker images.",
        fr: "À chaque push, GitHub Actions construit et publie les six images Docker.",
      },
    ],
    tags: ["Java 19", "Spring Boot", "gRPC", "PostgreSQL", "Docker", "GitHub Actions"],
    status: { en: "Engineering project", fr: "Projet d’ingénierie" },
    githubUrl: "https://github.com/cherifaBenGhorbel/Gourmet-Go-Distributed-Order-System",
  },
  {
    id: "travel-story",
    title: "Travel Story",
    subtitle: { en: "Travel journal", fr: "Carnet de voyage" },
    description: {
      en: "A travel journal: create an account, publish stories with a photo, the date of the trip and the places you visited, then browse them back and mark the ones you like as favourites. Only the author can edit or delete their own stories.",
      fr: "Un carnet de voyage : créer un compte, publier des récits avec une photo, la date du voyage et les lieux visités, puis les parcourir et marquer ses préférés en favoris. Seul l’auteur peut modifier ou supprimer ses récits.",
    },
    points: [
      {
        en: "React and Tailwind in the browser, with a date picker for the trip and a photo to go with each story.",
        fr: "React et Tailwind côté navigateur, avec un sélecteur de date et une photo pour chaque récit.",
      },
      {
        en: "Express and MongoDB behind; the API checks that the story is yours before letting you change or delete it, and you can search by title or date.",
        fr: "Express et MongoDB derrière ; l’API vérifie que le récit vous appartient avant de le modifier ou de le supprimer, et la recherche se fait par titre ou par date.",
      },
    ],
    tags: ["React", "Node.js", "MongoDB"],
    video: "/videos/travel-story.mp4",
    poster: "/videos/travel-story-poster.jpg",
    status: { en: "Personal project", fr: "Projet personnel" },
    githubUrl: "https://github.com/chahd-fadhlaoui/TravelStory",
  },
  {
    id: "movie-streaming",
    title: "ScreenVerse",
    subtitle: { en: "Movie & TV discovery, Angular", fr: "Films & séries, Angular" },
    description: {
      en: "A movie and TV discovery app using TMDB data: browse films and series, search, open a detail page, save favourites and jump to a streaming platform. The API key stays on the server, so it is not exposed in the browser.",
      fr: "Une application de découverte de films et séries sur les données TMDB : parcourir, rechercher, ouvrir une fiche, enregistrer des favoris et basculer vers une plateforme de streaming. La clé d’API reste sur le serveur, elle n’est pas exposée dans le navigateur.",
    },
    points: [
      {
        en: "Built in Angular with Material components and typed models for the data.",
        fr: "Développée en Angular avec des composants Material et des modèles typés pour les données.",
      },
      {
        en: "Small serverless functions talk to TMDB for the browser, so the key never leaves the server.",
        fr: "De petites fonctions serverless interrogent TMDB à la place du navigateur : la clé ne quitte jamais le serveur.",
      },
      {
        en: "The demo is online — you can try it.",
        fr: "La démo est en ligne — vous pouvez l’essayer.",
      },
    ],
    tags: ["Angular", "TypeScript", "TMDB", "Netlify"],
    demoUrl: "https://screenvers.netlify.app/",
    githubUrl: "https://github.com/cherifaBenGhorbel/ScreenVerse",
    status: { en: "Personal project", fr: "Projet personnel" },
  },
  {
    id: "chicago-crimes",
    title: "Chicago Crimes",
    subtitle: { en: "Arrest prediction, 2001–2018", fr: "Prédiction d’arrestations, 2001–2018" },
    description: {
      en: "A machine-learning study over Chicago's 2001–2018 crime records: four notebooks from exploratory analysis to evaluation, asking whether an incident's own features are enough to predict an arrest. Logistic Regression is compared against a Random Forest.",
      fr: "Une étude de machine learning sur les crimes de Chicago de 2001 à 2018 : quatre notebooks de l’analyse exploratoire à l’évaluation, pour savoir si les caractéristiques d’un incident suffisent à prédire une arrestation. Une régression logistique est comparée à une forêt aléatoire.",
    },
    points: [
      {
        en: "Arrests are rare in this data, so the models are judged on precision, recall and AUC instead of plain accuracy.",
        fr: "Les arrestations sont rares dans ces données : les modèles sont jugés sur la précision, le rappel et l’AUC plutôt que sur l’exactitude seule.",
      },
      {
        en: "Four notebooks, from the first look at the data to the final comparison of the two models.",
        fr: "Quatre notebooks, du premier regard sur les données à la comparaison finale des deux modèles.",
      },
      {
        en: "The dataset comes from Kaggle, and the notebooks can be run again from the saved requirements.",
        fr: "Le jeu de données vient de Kaggle, et les notebooks peuvent être relancés grâce aux dépendances enregistrées.",
      },
    ],
    tags: ["Python", "pandas", "scikit-learn", "Jupyter"],
    status: { en: "Data science project", fr: "Projet data science" },
    githubUrl: "https://github.com/cherifaBenGhorbel/chicago_crimes-2001-2018-",
  },
  {
    id: "android-app",
    title: "Lost & Found Pet Tracker",
    subtitle: { en: "Native Android, Java", fr: "Android natif, Java" },
    description: {
      en: "A native Android app for lost and found pets: post a lost pet or a sighting with a photo and a GPS position, then see every open report on a map. Reports are shared through Firebase, so what one person posts appears immediately on everyone's feed.",
      fr: "Une application Android native pour les animaux perdus et trouvés : publier un animal perdu ou une observation avec photo et position GPS, puis voir toutes les annonces ouvertes sur une carte. Les annonces passent par Firebase, donc ce qu’une personne publie apparaît aussitôt chez tout le monde.",
    },
    points: [
      {
        en: "Reports, users and photos are stored in Firebase, and everyone sees a new report as soon as it is posted.",
        fr: "Les annonces, les utilisateurs et les photos sont stockés dans Firebase, et tout le monde voit une nouvelle annonce dès qu’elle est publiée.",
      },
      {
        en: "Every report appears on a map, at the place where it was posted.",
        fr: "Chaque annonce apparaît sur une carte, à l’endroit où elle a été publiée.",
      },
      {
        en: "Simple screens with a bottom navigation bar; photos are chosen from the gallery, after asking permission.",
        fr: "Des écrans simples avec une barre de navigation en bas ; les photos viennent de la galerie, après demande d’autorisation.",
      },
    ],
    tags: ["Java", "Android Studio", "Firebase", "Leaflet"],
    status: { en: "Academic project", fr: "Projet académique" },
    githubUrl: "https://github.com/cherifaBenGhorbel/LostAndFoundPetTracker",
  },
  {
    id: "restaurant-php",
    title: "Restaurant Management",
    subtitle: { en: "PHP web application, 2FA", fr: "Application web PHP, 2FA" },
    description: {
      en: "A restaurant reservation site written in plain PHP, no framework: clients search restaurants, filter by type and location, and book a table; restaurant owners publish their restaurant and manage the bookings they receive.",
      fr: "Un site de réservation de restaurants écrit en PHP pur, sans framework : les clients cherchent un restaurant, filtrent par type et par ville, et réservent une table ; les restaurateurs publient leur restaurant et gèrent les réservations reçues.",
    },
    points: [
      {
        en: "Two account types — clients and restaurant owners — on one database. Passwords are stored hashed, and the database queries are protected against injection.",
        fr: "Deux types de comptes — clients et restaurateurs — sur une seule base. Les mots de passe sont stockés hachés, et les requêtes sont protégées contre l’injection.",
      },
      {
        en: "Two-step login with Google Authenticator: scan a QR code once, then enter a code at each sign-in. Users can switch it off again.",
        fr: "Connexion en deux étapes avec Google Authenticator : on scanne un QR code une fois, puis on saisit un code à chaque connexion. L’utilisateur peut la désactiver.",
      },
      {
        en: "Pages generated on the server, sorted by feature, with each role seeing only its own data.",
        fr: "Des pages générées côté serveur, rangées par fonctionnalité, chaque rôle ne voyant que ses propres données.",
      },
    ],
    tags: ["PHP", "MySQL", "2FA"],
    status: { en: "Internship 2024", fr: "Stage 2024" },
    githubUrl: "https://github.com/cherifaBenGhorbel/Restaurant-Management-System-PHP-Project",
  },
];

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -60 : 60 }),
};

/* ---------- media: video preview on hover, or an image, or a styled placeholder ---------- */
function Media({ project, onPlay, onPrev, onNext }) {
  const { t, pick } = useI18n();
  const hasVideo = Boolean(project.video);

  return (
    /* Phones get 16:9, anything wider gets the recordings' own 2.2:1 so no UI is cropped away. */
    <div className="relative overflow-hidden bg-ink aspect-video sm:aspect-[2.2/1]">
      {hasVideo ? (
        <video
          src={project.video}
          poster={project.poster}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
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
          <span className="text-6xl font-bold select-none font-display text-pink/40 transition-transform duration-500 group-hover:scale-110">
            {project.title.charAt(0)}
          </span>
        </div>
      )}

      {/* keep the bottom readable without dimming the screenshot itself */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none bg-gradient-to-t from-ink/70 to-transparent" />

      <span className="absolute bottom-3 left-3 rounded-full border border-wine/50 bg-ink/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-2 backdrop-blur">
        {pick(project.status)}
      </span>

      {hasVideo && (
        <button
          onClick={() => onPlay(project)}
          aria-label={t(`Watch the ${project.title} overview`, `Voir l’aperçu de ${project.title}`)}
          className={`absolute inset-0 flex items-center justify-center bg-black/25 opacity-100 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:opacity-100 ${focusRing}`}
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-pink text-ink shadow-[0_0_0_8px_rgba(255,79,160,0.25)] transition-transform duration-300 group-hover:scale-110">
            <Play size={22} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}

      {/* arrows sit on the preview, where the eye already is */}
      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          aria-label={t("Previous project", "Projet précédent")}
          className={`absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur transition-colors hover:bg-black/85 ${focusRing}`}
        >
          <ArrowLeft size={16} />
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          aria-label={t("Next project", "Projet suivant")}
          className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur transition-colors hover:bg-black/85 ${focusRing}`}
        >
          <ArrowRight size={16} />
        </button>
      )}

      {/* touch screens have no hover, so keep a small visible cue */}
      {hasVideo && (
        <span aria-hidden className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] text-body backdrop-blur [@media(hover:hover)]:hidden">
          <Play size={11} fill="currentColor" /> {t("Watch", "Voir")}
        </span>
      )}
    </div>
  );
}

function Links({ project, onPlay }) {
  const { t } = useI18n();
  const base = `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-[filter,transform,background-color,border-color] active:scale-95 ${focusRing}`;
  const solid = `${base} bg-gradient-to-r from-wine to-wine-light text-onaccent hover:brightness-110`;
  const ghost = `${base} border border-wine/60 text-body hover:border-pink/60 hover:text-pink-soft`;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {project.demoUrl && (
        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={solid}>
          <ExternalLink size={14} /> {t("Live demo", "Démo en ligne")}
        </a>
      )}
      {project.video && (
        <button onClick={() => onPlay(project)} className={solid}>
          <Play size={14} fill="currentColor" /> {t("Watch overview", "Voir l’aperçu")}
        </button>
      )}
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={ghost}>
          <Github size={14} /> {t("Code", "Code")}
        </a>
      )}
    </div>
  );
}

function Tags({ tags }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-wine/50 bg-tint px-2.5 py-0.5 text-[11px] text-muted-2">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function Points({ points }) {
  const { pick } = useI18n();
  if (!points?.length) return null;
  return (
    <ul className="flex flex-col gap-1.5">
      {points.map((point) => (
        <li key={pick(point)} className="flex gap-2 text-[13px] leading-relaxed text-muted">
          <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-pink/70" />
          <span>{pick(point)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- the carousel slide: wide card, light running around the border ---------- */
function Slide({ project, onPlay, onPrev, onNext }) {
  const { pick } = useI18n();

  return (
    <motion.article
      custom={0}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease }}
      className="relative p-px mb-6 overflow-hidden rounded-2xl bg-wine/40"
    >
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_10s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <Spot radius={260} overlayOnTop className="relative rounded-[15px] bg-panel">
        <Media project={project} onPlay={onPlay} onPrev={onPrev} onNext={onNext} />

        <div className="grid gap-4 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight font-display text-fg">{project.title}</h3>
              <p className="mt-1 text-sm text-pink-soft">{pick(project.subtitle)}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-muted">{pick(project.description)}</p>
            <Tags tags={project.tags} />
          </div>

          <div className="flex flex-col gap-4">
            <Points points={project.points} />
            <Links project={project} onPlay={onPlay} />
          </div>
        </div>
      </Spot>
    </motion.article>
  );
}

/* ---------- the list under it: one scannable row per project ---------- */
function Row({ project, index, onSelect, active }) {
  const { t, pick } = useI18n();

  return (
    <li className="border-b border-wine/30 last:border-0">
      <div className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:gap-5">
        <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>

        <div className="min-w-0 sm:w-56 sm:shrink-0">
          {/* clicking a row opens that project above, so the list is a way in, not a dead end */}
          <button
            type="button"
            onClick={() => onSelect(index)}
            aria-label={t(`Open ${project.title} above`, `Ouvrir ${project.title} ci-dessus`)}
            aria-current={active ? "true" : undefined}
            className={`rounded text-left font-semibold transition-colors hover:text-pink ${
              active ? "text-pink-soft" : "text-fg"
            } ${focusRing}`}
          >
            {project.title}
          </button>
          <p className="truncate text-xs text-muted">{pick(project.status)}</p>
        </div>

        <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted">{pick(project.subtitle)}</p>

        <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-wine/40 px-2 py-0.5 text-[11px] text-muted">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              className={`text-faint transition-colors hover:text-pink ${focusRing}`}
            >
              <ExternalLink size={15} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Code"
              className={`text-faint transition-colors hover:text-pink ${focusRing}`}
            >
              <Github size={15} />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function VideoModal({ project, onClose }) {
  const { t } = useI18n();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t(`${project.title} overview video`, `Vidéo d’aperçu de ${project.title}`)}
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
        className="relative w-full max-w-3xl overflow-hidden border shadow-[0_0_60px_rgba(255,79,160,0.2)] rounded-2xl border-wine/50 bg-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-wine/40">
          <h3 className="font-medium text-fg">{project.title}</h3>
          <button
            onClick={onClose}
            aria-label={t("Close video", "Fermer la vidéo")}
            autoFocus
            className={`rounded-lg p-1.5 text-muted transition-colors hover:bg-wine/20 hover:text-pink ${focusRing}`}
          >
            <X size={18} />
          </button>
        </div>
        <video src={project.video} controls autoPlay className="w-full aspect-video" />
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeVideo, setActiveVideo] = useState(null);

  const total = projects.length;
  const current = projects[index];
  const carouselRef = useRef(null);

  const go = (step) => {
    setDirection(step);
    setIndex((i) => (i + step + total) % total);
  };

  // picking a row swaps the slide and brings the carousel back into view
  const select = (i) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
    carouselRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // arrow keys move the carousel while the section has focus
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="projects" aria-labelledby="projects-title" className="relative py-24 lg:py-28">
        <div className="section-container">
          <SectionHeading
            id="projects-title"
            index="03"
            eyebrow={t("Selected work", "Réalisations")}
            title={t("Projects", "Projets")}
            subtitle={t(
              "Projects I can walk you through — from a final-year platform to distributed services.",
              "Des projets que je peux vous raconter — du projet de fin d’études aux systèmes distribués."
            )}
          />

          <div className="max-w-5xl mx-auto">
            {/* ---------- carousel ---------- */}
            <div
              ref={carouselRef}
              role="group"
              aria-roledescription="carousel"
              aria-label={t("Selected projects", "Projets sélectionnés")}
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-pink/50"
            >
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div key={current.id} custom={direction} variants={slide} transition={{ duration: 0.35, ease }}>
                  <Slide project={current} onPlay={setActiveVideo} onPrev={() => go(-1)} onNext={() => go(1)} />
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-4 mb-14">
                <div className="flex items-center gap-1.5">
                  {projects.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      aria-label={t(`Go to ${p.title}`, `Aller à ${p.title}`)}
                      aria-current={i === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all ${focusRing} ${
                        i === index ? "w-6 bg-pink" : "w-1.5 bg-wine/50 hover:bg-pink/60"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-xs text-faint">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* ---------- the list ---------- */}
            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-faint">
                {t("All projects", "Tous les projets")}
              </h3>
              <span className="font-mono text-xs text-faint">{total}</span>
            </div>

            <ul className="border-t border-wine/30">
              {projects.map((project, i) => (
                <Row key={project.id} project={project} index={i} onSelect={select} active={i === index} />
              ))}
            </ul>
          </div>
        </div>

        <AnimatePresence>
          {activeVideo && <VideoModal project={activeVideo} onClose={() => setActiveVideo(null)} />}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
