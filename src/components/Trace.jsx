/*
 * The site's signature mark: a monitoring trace.
 *
 * It is the one idea the page repeats everywhere — large under the hero name,
 * small under every section title. It reads as "build · deploy · run" for a
 * DevOps/SRE profile, and it is plain SVG: no WebGL, no extra bytes.
 */
const LINE = "M0 12H28l3-9 4 18 4-9h20l2-6 3 12 2-6H100";

export default function Trace({ height = 24, label, className = "", pulse = true }) {
  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <span className="block mb-2 font-mono text-[11px] tracking-[0.22em] uppercase text-faint">
          {label}
        </span>
      )}
      <svg
        aria-hidden
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        height={height}
        className="block w-full overflow-visible"
      >
        <path d={LINE} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="opacity-40" />
        {pulse && (
          <path
            d={LINE}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="trace-pulse"
          />
        )}
      </svg>
    </div>
  );
}
