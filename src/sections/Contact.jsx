import { useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Copy,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

/* ---------- content ---------- */
const EMAIL = "cherifabenghorbel@gmail.com";

const contactInfo = [
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, copy: true },
  { icon: Phone, label: "Phone", value: "+216 95 520 405", href: "tel:+21695520405" },
  { icon: MapPin, label: "Based in", value: "Hammam-Lif, Tunisia", href: null },
];

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/cherifabenghorbel" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/cherifa-ben-ghorbel" },
];


const ease = [0.22, 1, 0.36, 1];
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF4FA0]";

const column = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const rise = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

const field =
  "w-full rounded-xl border border-[#7A1330]/50 bg-[#0A0910] px-3.5 py-2.5 text-sm text-[#F4F1F6] placeholder-[#5C5364] " +
  "transition-[border-color,box-shadow] focus:outline-none focus:border-[#FF4FA0]/60 focus:shadow-[0_0_0_3px_rgba(255,79,160,0.15)]";

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
        className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none group-hover:opacity-100"
        style={{
          background: "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.13), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- the main message: a light runs around the border ---------- */
function Availability() {
  return (
    <motion.div variants={rise} className="relative p-px overflow-hidden rounded-2xl bg-[#7A1330]/40">
      <div
        aria-hidden
        className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] motion-reduce:hidden
                   bg-[conic-gradient(from_0deg,transparent_0%,transparent_72%,#FF4FA0_88%,transparent_100%)]"
      />
      <div className="relative rounded-[15px] bg-[#110C13] bg-gradient-to-br from-[#7A1330]/25 to-transparent p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="relative flex items-center justify-center w-12 h-12 rounded-xl shrink-0 bg-[#7A1330]/30 text-[#FF4FA0]">
            <span aria-hidden className="absolute inset-0 rounded-xl bg-[#FF4FA0]/20 animate-ping motion-reduce:hidden" />
            <Globe size={22} className="relative" />
          </span>
          <div>
            <h3 className="text-lg font-semibold font-display text-[#F4F1F6]">Available for internships</h3>
            <p className="text-sm text-[#B7AFC0]">Remote from anywhere, or on-site.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#7A1330]/50 text-[#B7AFC0] transition-colors hover:border-[#FF4FA0]/60 hover:text-[#FF4FA0] ${focusRing}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "ok" : "copy"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-1.5 text-xs text-[#948C9C]">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          subject: form.subject || `Message from ${form.name}`,
          from_name: form.name,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" aria-labelledby="contact-title" className="relative py-24 lg:py-28">
        <div className="section-container">
          <motion.div
            variants={column}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={rise}
              id="contact-title"
              className="mb-3 text-3xl font-bold tracking-tight font-display sm:text-4xl text-[#F4F1F6]"
            >
              Let’s work together
            </motion.h2>
            <motion.p variants={rise} className="max-w-md mx-auto text-[#B7AFC0]">
              Send me a message and I’ll reply soon.
            </motion.p>
          </motion.div>

          <div className="grid max-w-5xl gap-8 mx-auto lg:grid-cols-5">
            {/* ---------- Left: availability, details, socials ---------- */}
            <motion.div
              variants={column}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="space-y-4 lg:col-span-2"
            >
              <Availability />

              {contactInfo.map(({ icon: Icon, label, value, href, copy }) => (
                <motion.div key={label} variants={rise}>
                  <Spot className="rounded-2xl border border-[#7A1330]/40 bg-[#110C13]/80 transition-colors hover:border-[#FF4FA0]/40">
                    <div className="flex items-center gap-4 p-4">
                      <span className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-[#7A1330]/30 text-[#FF4FA0] transition-transform duration-300 group-hover:scale-110">
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="mb-0.5 text-xs text-[#948C9C]">{label}</p>
                        {href ? (
                          <a href={href} className={`block break-all text-sm text-[#E4DEE8] transition-colors hover:text-[#FF4FA0] ${focusRing}`}>
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm text-[#E4DEE8]">{value}</p>
                        )}
                      </div>
                      {copy && <CopyEmail />}
                    </div>
                  </Spot>
                </motion.div>
              ))}

              <motion.div variants={rise} className="flex gap-3 pt-1">
                {socials.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-[#7A1330]/50 text-[#B7AFC0] transition-colors hover:border-[#FF4FA0]/60 hover:text-[#FF4FA0] ${focusRing}`}
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* ---------- Right: form, replaced by a thank-you when sent ---------- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="rounded-2xl border border-[#7A1330]/40 bg-[#110C13]/80 lg:col-span-3"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="done"
                    role="status"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex flex-col items-center justify-center p-10 text-center min-h-[420px]"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="flex items-center justify-center w-16 h-16 mb-5 rounded-full bg-emerald-400/10 text-emerald-400"
                    >
                      <CheckCircle size={32} />
                    </motion.span>
                    <h3 className="mb-2 text-xl font-semibold font-display text-[#F4F1F6]">Message sent</h3>
                    <p className="max-w-xs mb-6 text-sm text-[#B7AFC0]">Thank you! I’ll get back to you as soon as I can.</p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className={`rounded-full border border-[#7A1330]/50 px-5 py-2 text-sm text-[#C9C0D1] transition-colors hover:border-[#FF4FA0]/60 hover:text-[#FF4FA0] ${focusRing}`}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 sm:p-7"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="contact-name" label="Name">
                        <input id="contact-name" type="text" name="name" required autoComplete="name" value={form.name} onChange={handleChange} className={field} placeholder="Your name" />
                      </Field>
                      <Field id="contact-email" label="Email">
                        <input id="contact-email" type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} className={field} placeholder="you@email.com" />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field id="contact-subject" label="Subject">
                        <input id="contact-subject" type="text" name="subject" value={form.subject} onChange={handleChange} className={field} placeholder="Internship, collaboration..." />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field id="contact-message" label="Message">
                        <textarea id="contact-message" name="message" required rows={6} value={form.message} onChange={handleChange} className={`${field} resize-none`} placeholder="Tell me about the role or project..." />
                      </Field>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7A1330] to-[#A8203F] px-6 py-3 text-sm font-semibold text-[#F4F1F6]
                                    transition-[filter,transform] hover:brightness-125 active:scale-95 disabled:opacity-60 ${focusRing}`}
                      >
                        {status === "loading" ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        )}
                        {status === "loading" ? "Sending..." : "Send message"}
                      </button>

                      <AnimatePresence>
                        {status === "error" && (
                          <motion.span
                            role="alert"
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="inline-flex items-center gap-1.5 text-sm text-red-400"
                          >
                            <AlertCircle size={16} /> Something went wrong. Try again or email me directly.
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}