import { Suspense, lazy } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PullCord from './components/PullCord'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './theme'
import About from './sections/About'
import Contact from './sections/Contact'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Projects from './sections/Projects'

// Three.js is heavy: keep it out of the first bundle so the text paints immediately.
const Starfield = lazy(() => import('./components/Starfield'))

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="relative flex flex-col min-h-screen">
          <Suspense fallback={null}>
            <Starfield />
          </Suspense>
          <PullCord />
          <Navbar />

          <main className="relative z-10 flex-1">
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Education />
            <Contact />
          </main>

          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}
