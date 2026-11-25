# Cherifa Ben Ghorbel — Portfolio

Personal portfolio for **Cherifa Ben Ghorbel**, software engineering student: full-stack MERN
developer with Android/Java experience, currently studying DevOps & SRE at Horizon Business School.

**Stack:** React 18 · Tailwind CSS · Three.js · React Three Fiber · Framer Motion · Vite

---

## Sections

| Section | File | What it holds |
| --- | --- | --- |
| Hero | `src/sections/Hero.jsx` | Name, roles, availability, socials |
| About | `src/sections/About.jsx` | The story, a "Right now" facts card, and what she builds with / is learning |
| Experience | `src/sections/Experience.jsx` | Featured PFE internship + earlier internships |
| Education | `src/sections/Education.jsx` | Horizon Business School, ISET, baccalaureate |
| Projects | `src/sections/Projects.jsx` | Featured project, cards, video modal |
| Contact | `src/sections/Contact.jsx` | Details, copy-email, Web3Forms message form |

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the built site
```

---

## Adding a project

Edit the `projects` array in `src/sections/Projects.jsx`:

```js
{
  id: 'my-project',
  title: 'My Project',
  subtitle: 'One-line description',
  description: 'What it does, what you built, what you learned.',
  tags: ['React', 'Node.js'],
  video: '/videos/my-project.mp4',   // optional
  demoUrl: 'https://...',            // optional
  githubUrl: 'https://github.com/...', // optional
  status: 'Personal project',
  show: true,                        // false keeps it out of the list
}
```

The first project with `show: true` renders as the large featured card.

---

## Videos

Project overviews live in `public/videos/`. **Keep them small** — they are served from the same
site as the page:

- `pawfrindu.mp4` — ~6.9 MB
- `travel-story.mp4` — ~1.7 MB
- `avatar-interaction.mp4` — ~1.2 MB (hero avatar)

Full-resolution masters are kept out of the repo in `.media-originals/` (git-ignored). To re-encode
a new recording:

```bash
ffmpeg -i input.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 28 \
  -preset medium -c:a aac -b:a 96k -movflags +faststart public/videos/name.mp4
```

Aim for under 10 MB per video.

---

## Contact form

`Contact.jsx` posts to Web3Forms. Put your access key in `.env` (git-ignored):

```
VITE_WEB3FORMS_KEY=your-key-here
```

Without the key, submissions land in the error state.

---

## Social preview

`public/og.jpg` is the 1200×630 image used by `og:image` / `twitter:image`. After deploying, replace
the relative paths in `index.html` with absolute URLs using your real domain.

---

## Project structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   ├── og.jpg            ← social share image
│   └── videos/           ← compressed MP4 overviews
├── src/
│   ├── components/
│   │   ├── Avatar.jsx    ← hero video avatar
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Trace.jsx      ← the monitoring-trace signature mark
│   │   └── Starfield.jsx ← site-wide stars (lazy-loaded)
│   ├── sections/         ← one file per section (see table above)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Customisation

- **Colours:** `tailwind.config.js` → `theme.extend.colors`, and the hex values used inline in components.
- **Content:** the `*_URL` / data arrays at the top of each file in `src/sections/`.
- **CV:** set `CV_URL` in `src/sections/Hero.jsx` once a PDF exists in `public/`. While it stays `null`,
  the Download CV button is hidden.
- **Signature mark:** `src/components/Trace.jsx` — the ECG/monitoring line under the hero name and under every section title. Its travelling dash is `.trace-pulse` in `src/index.css`.
