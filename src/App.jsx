import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Starfield from './components/Starfield'
import About from './sections/About'
import Contact from './sections/Contact'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink">
      {/* Stars behind the entire site */}
      <Starfield />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Skills />
          <About />
          
          <Experience />
          <Education />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}