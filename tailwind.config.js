/** @type {import('tailwindcss').Config} */

// Every colour is a CSS variable holding an "R G B" triplet, so both themes live in
// index.css and Tailwind's opacity modifiers (bg-panel/80) keep working.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: token('--c-ink'), // page background
        panel: token('--c-panel'), // card background
        'panel-2': token('--c-panel-2'), // raised card
        fg: token('--c-fg'), // headings
        body: token('--c-body'), // body copy
        muted: token('--c-muted'),
        'muted-2': token('--c-muted-2'),
        faint: token('--c-faint'),
        'faint-2': token('--c-faint-2'),
        shade: token('--c-shade'), // where bg-black/xx used to be
        tint: token('--c-tint'), // inset surface on top of a card
        ok: token('--c-ok'),
        danger: token('--c-danger'),
        onaccent: token('--c-onaccent'), // text sitting on a wine fill
        wine: {
          DEFAULT: token('--c-wine'),
          light: token('--c-wine-light'),
          deep: token('--c-wine-deep'),
        },
        pink: {
          DEFAULT: token('--c-pink'),
          soft: token('--c-pink-soft'),
          chip: token('--c-pink-chip'),
          deep: token('--c-pink-deep'),
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}