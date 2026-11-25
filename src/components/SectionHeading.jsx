import { motion } from "framer-motion";
import { ease } from "../lib/motion";
import Trace from "./Trace";

/*
 * One heading for every section: a numbered label, a statement, then a plain
 * sentence. The number is what makes the page readable when scrolled quickly.
 */
export default function SectionHeading({ id, index, eyebrow, title, subtitle }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease }}
      className="mb-12 text-center"
    >
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.26em] text-pink-chip">
        <span aria-hidden className="mr-2 text-faint">
          {index}
        </span>
        {eyebrow}
      </p>
      <h2 id={id} className="text-3xl font-bold tracking-tight font-display sm:text-4xl text-fg">
        {title}
      </h2>
      {/* the hero trace again, small: it is what ties the sections together */}
      <div className="w-28 mx-auto mt-4 text-pink">
        <Trace height={26} />
      </div>
      {subtitle && (
        <p className="max-w-xl mx-auto mt-3 text-[15px] leading-relaxed text-muted">{subtitle}</p>
      )}
    </motion.header>
  );
}
