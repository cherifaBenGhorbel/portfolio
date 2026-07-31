import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './sections/About'
import Contact from './sections/Contact'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Hero from './sections/Hero'
import Languages from './sections/Languages'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Languages />
        <Experience />
        <Education />
        <Projects /> 
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
