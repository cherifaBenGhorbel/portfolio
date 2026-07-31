# Cherifa Ben Ghorbel — Portfolio 3D

Portfolio personnel moderne et attractif avec éléments 3D, conçu pour présenter le CV et les projets de **Cherifa Ben Ghorbel**.

**Stack :** React 18 · Tailwind CSS · Three.js · React Three Fiber · Framer Motion · Vite

---

## Fonctionnalités

- 🎨 Design sombre moderne avec dégradés cyan / violet
- 🌐 Scène 3D interactive (orbes flottantes + anneau + étoiles) dans le Hero
- 📱 Entièrement responsive
- 🎬 Support vidéo MP4 pour les overviews de projets (modal + hover preview)
- ✨ Animations fluides (Framer Motion)
- 📂 Placeholders prêts pour les projets personnels : **Travel Story** & **Movie Streaming Platform**
- 🔗 Sections : Profil, Compétences, Expérience, Projets, Formation, Contact

---

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
```

Ouvrez http://localhost:5173

---

## Ajouter une vidéo d’overview à un projet

1. Placez votre fichier `.mp4` dans le dossier :
   ```
   public/videos/mon-projet.mp4
   ```

2. Ouvrez `src/sections/Projects.jsx` et ajoutez / décommentez la propriété `video` :

   ```js
   {
     id: 'travel-story',
     title: 'Travel Story',
     // ...
     video: '/videos/travel-story.mp4',  // ← ajoutez cette ligne
   }
   ```

3. La carte affichera automatiquement :
   - Un aperçu vidéo au survol
   - Un bouton « Voir l’overview » qui ouvre une modal avec le lecteur

---

## Ajouter un nouveau projet

Dans `src/sections/Projects.jsx`, ajoutez un objet dans le tableau `projects` :

```js
{
  id: 'mon-projet',
  title: 'Mon Super Projet',
  subtitle: 'Courte description',
  description: 'Description plus détaillée...',
  tags: ['React', 'Node.js', 'MongoDB'],
  video: '/videos/mon-projet.mp4',   // optionnel
  demoUrl: 'https://...',            // optionnel
  githubUrl: 'https://github.com/...', // optionnel
  featured: false,                   // true = plus large
  status: 'Projet personnel',
  // placeholder: true,              // affiche "Vidéo à venir"
}
```

---

## Structure du projet

```
portfolio/
├── public/
│   ├── favicon.svg
│   └── videos/          ← Mettez vos MP4 ici
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Scene3D.jsx  ← Scène Three.js
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Experience.jsx
│   │   ├── Projects.jsx ← Projets + support vidéo
│   │   ├── Education.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Personnalisation

- **Couleurs** : `tailwind.config.js` → `theme.extend.colors`
- **Contenu CV** : fichiers dans `src/sections/`
- **Scène 3D** : `src/components/Scene3D.jsx` (couleurs, positions des orbes, etc.)
- **Liens sociaux** : `Hero.jsx` et `Contact.jsx`

---

Fait avec ❤️ pour présenter le parcours de Cherifa Ben Ghorbel.
