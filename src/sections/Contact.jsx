import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Github, Linkedin, Send, CheckCircle, AlertCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'cherifabenghorbel@gmail.com',
    href: 'mailto:cherifabenghorbel@gmail.com',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+216 95 520 405',
    href: 'tel:+21695520405',
  },
  {
    icon: MapPin,
    label: 'Localisation',
    value: 'Hammam-Lif, Tunisie',
    href: null,
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: form.subject || `Message from ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative py-24 bg-slate-900/20">
      <div className="section-container">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="mb-3 text-3xl font-bold font-display sm:text-4xl">
            Contact
          </h2>
          <div className="w-16 h-px mx-auto mb-4 bg-amber-400/60" />
          <p className="max-w-md mx-auto text-slate-400">
            Ouverte aux opportunités de stage. Envoyez-moi un message !
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-5">
          {/* Left info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5 lg:col-span-2"
          >
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-4 border rounded-xl border-slate-800 bg-slate-900/40"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-amber-400/10">
                  <item.icon size={18} className="text-amber-400" />
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-slate-500">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm break-all transition-colors text-slate-200 hover:text-amber-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-200">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Socials */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://github.com/cherifabenghorbel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-400/30"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/cherifa-ben-ghorbel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 transition-colors border rounded-lg border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-400/30"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 border rounded-xl border-slate-800 bg-slate-900/40 lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block mb-1.5 text-xs text-slate-500">Nom</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block mb-1.5 text-xs text-slate-500">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                  placeholder="vous@email.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-1.5 text-xs text-slate-500">Sujet</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="Stage, collaboration..."
              />
            </div>

            <div className="mt-4">
              <label className="block mb-1.5 text-xs text-slate-500">Message</label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                placeholder="Votre message..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-5">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors disabled:opacity-60"
              >
                <Send size={16} />
                {status === 'loading' ? 'Envoi...' : 'Envoyer'}
              </button>

              {status === 'success' && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 text-sm text-emerald-400"
                >
                  <CheckCircle size={16} /> Message envoyé !
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 text-sm text-red-400"
                >
                  <AlertCircle size={16} /> Erreur, réessayez.
                </motion.span>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}