/*
 * A soft pink light that follows the cursor inside a card.
 *
 * Every section used to carry its own copy of this with slightly different
 * numbers; one component now, so the hover everywhere feels the same.
 * Pointer position is written to CSS variables, so moving the mouse never
 * re-renders React.
 */
export default function Spot({
  className = "",
  innerClassName = "",
  radius = 240,
  overlayOnTop = false,
  children,
}) {
  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };

  return (
    <div onPointerMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 ${overlayOnTop ? "z-10" : ""} pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), rgba(255,79,160,0.13), transparent 70%)`,
        }}
      />
      <div className={`relative ${innerClassName}`}>{children}</div>
    </div>
  );
}
