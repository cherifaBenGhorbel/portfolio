
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Starfield from './components/Starfield'
import Contact from './sections/Contact'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

export default function App() {
  return (
    <div className="relative flex flex-col min-h-screen bg-ink">
      <Starfield />
      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
