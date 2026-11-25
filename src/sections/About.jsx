import { useEffect, useRef, useState } from "react";
import Trace from "../components/Trace";
import { useI18n } from "../i18n";

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

/*
 * The layout is the one my friend built: thick outlines, hard offset shadows,
 * numbered blocks, an orbiting icon panel and a pipeline panel.
 * The colours are this site's tokens, so the section follows the theme.
 */
const STYLES = `
.bw-root {
  --bw-paper: rgb(var(--c-panel));
  --bw-inset: rgb(var(--c-tint));
  --bw-ink: rgb(var(--c-fg));
  --bw-soft: rgb(var(--c-body));
  --bw-muted: rgb(var(--c-muted));
  --bw-pink: rgb(var(--c-pink));
  --bw-pink-soft: rgb(var(--c-pink-soft));
  --bw-wine: rgb(var(--c-wine-light));
  --bw-fixed-ink: #140c12;
  --bw-fixed-paper: #fdf0f6;
  --bw-line: 1px;
  --bw-edge: rgb(var(--c-wine) / 0.45);
  --bw-glow: 0 24px 60px -34px rgb(var(--c-pink) / 0.55);
  --bw-glow-sm: 0 10px 26px -16px rgb(var(--c-wine) / 0.5);
  --bw-pad: clamp(1rem, 3vw, 2.25rem);
  --bw-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --bw-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  width: 100%;
  box-sizing: border-box;
  color: var(--bw-ink);
  font-family: var(--bw-display);
}

.bw-root *,
.bw-root *::before,
.bw-root *::after {
  box-sizing: border-box;
}

/* Shell */
.bw-shell {
  position: relative;
  overflow: hidden;
  overflow: clip;
  padding: var(--bw-pad);
  border: var(--bw-line) solid var(--bw-edge);
  border-radius: 32px;
  background-color: var(--bw-paper);
  background-image: radial-gradient(rgb(var(--c-fg) / 0.05) 1.2px, transparent 1.2px);
  background-size: 22px 22px;
  box-shadow: var(--bw-glow);
  opacity: 0;
  transform: translateY(32px);
  animation: bw-entrance 0.9s ease-out forwards;
}

@keyframes bw-entrance {
  to {
    opacity: 1;
    transform: none;
  }
}

/* ---------------------------------------------------------------- */
/* Header                                                            */
/* ---------------------------------------------------------------- */

.bw-head {
  position: relative;
  display: grid;
  gap: 1.9rem;
  margin-bottom: 2.6rem;
  padding: clamp(1.35rem, 3.4vw, 2.8rem);
  border: var(--bw-line) solid var(--bw-edge);
  border-radius: 24px;
  background: rgb(var(--c-pink) / 0.12);
  box-shadow: var(--bw-glow);
}

@media (min-width: 900px) {
  .bw-head {
    grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
    align-items: center;
    gap: 2.6rem;
  }
}

.bw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--bw-mono);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.bw-eyebrow::before {
  content: "";
  width: 28px;
  height: 3px;
  background: var(--bw-ink);
  flex: 0 0 auto;
}

.bw-eyebrow-n {
  opacity: 0.6;
}

.bw-title {
  margin-top: 0.7rem;
  font-size: clamp(2.15rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

.bw-mark {
  display: inline-block;
  padding: 0.02em 0.16em 0.08em;
  border: 1px solid var(--bw-fixed-ink);
  border-radius: 10px;
  background: var(--bw-pink);
  color: var(--bw-fixed-ink);
  transform: rotate(-1.6deg);
}

.bw-lead {
  max-width: 56ch;
  margin-top: 1.15rem;
  font-size: clamp(1rem, 0.55vw + 0.9rem, 1.1rem);
  line-height: 1.72;
  color: var(--bw-soft);
}

.bw-lead strong {
  font-weight: 600;
  color: var(--bw-ink);
  background: linear-gradient(transparent 62%, rgb(var(--c-pink) / 0.32) 62%);
}

.bw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.bw-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.8rem;
  border: 1px solid var(--bw-edge);
  border-radius: 999px;
  background: var(--bw-paper);
  box-shadow: 0 2px 8px -2px rgb(var(--c-wine) / 0.35);
  font-family: var(--bw-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.bw-tag i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bw-pink);
}

.bw-tag:nth-child(2) i { background: var(--bw-pink-soft); }
.bw-tag:nth-child(3) i { background: var(--bw-wine); }
.bw-tag:nth-child(4) i { background: var(--bw-muted); }

/* ---------------------------------------------------------------- */
/* Orbit panel (animated icon ring)                                  */
/* ---------------------------------------------------------------- */

.bw-orbit {
  --bw-is: clamp(34px, 4.2vw, 46px);
  position: relative;
  height: clamp(240px, 27vw, 320px);
  overflow: hidden;
  border: var(--bw-line) solid rgb(var(--c-fg) / 0.14);
  border-radius: 22px;
  background:
    radial-gradient(circle at 22% 18%, rgb(var(--c-pink) / 0.85), transparent 42%),
    radial-gradient(circle at 82% 86%, rgb(var(--c-wine-light) / 0.9), transparent 46%),
    #140c12;
  box-shadow: var(--bw-glow);
  isolation: isolate;
}

.bw-orbit-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  aspect-ratio: 1 / 1;
  border: 1.5px dashed rgb(253 240 246 / 0.28);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.bw-orbit-ring--outer { height: 74%; }
.bw-orbit-ring--inner { height: 52%; }

.bw-orbit-layer {
  position: absolute;
  inset: 0;
}

.bw-orbit-layer--outer { animation: bw-orbit-cw 44s linear infinite; }
.bw-orbit-layer--inner { animation: bw-orbit-ccw 32s linear infinite; }

.bw-orbit-slot {
  position: absolute;
  inset: 0;
  transform: rotate(var(--bw-a)) translateY(calc(var(--bw-r) * -1));
}

.bw-orbit-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  display: grid;
  place-items: center;
  width: var(--bw-is);
  height: var(--bw-is);
  margin: calc(var(--bw-is) / -2) 0 0 calc(var(--bw-is) / -2);
  border: 1px solid var(--bw-fixed-ink);
  border-radius: 50%;
  background: var(--bw-fixed-paper);
  box-shadow: 0 2px 10px -2px rgb(20 12 18 / 0.75);
}

.bw-orbit-layer--outer .bw-orbit-icon { animation: bw-counter-cw 44s linear infinite; }
.bw-orbit-layer--inner .bw-orbit-icon { animation: bw-counter-ccw 32s linear infinite; }

.bw-orbit-icon img {
  width: 58%;
  height: 58%;
  object-fit: contain;
  animation: bw-bob 3.4s ease-in-out infinite;
  animation-delay: var(--bw-d, 0s);
}

.bw-orbit-core {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  display: grid;
  gap: 0.1rem;
  place-items: center;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--bw-fixed-ink);
  border-radius: 14px;
  background: var(--bw-pink);
  box-shadow: 0 8px 20px -10px rgb(20 12 18 / 0.85);
  color: var(--bw-fixed-ink);
  font-family: var(--bw-mono);
  font-size: 0.6rem;
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
  transform: translate(-50%, -50%);
}

.bw-orbit-core b {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
}

@keyframes bw-orbit-cw {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bw-orbit-ccw {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes bw-counter-cw {
  from { transform: rotate(calc(var(--bw-a) * -1)); }
  to { transform: rotate(calc(var(--bw-a) * -1 - 360deg)); }
}

@keyframes bw-counter-ccw {
  from { transform: rotate(calc(var(--bw-a) * -1)); }
  to { transform: rotate(calc(var(--bw-a) * -1 + 360deg)); }
}

@keyframes bw-bob {
  0%, 100% { transform: translateY(1.5px); }
  50% { transform: translateY(-1.5px); }
}

/* ---------------------------------------------------------------- */
/* Layout + navigation                                               */
/* ---------------------------------------------------------------- */

.bw-layout {
  display: grid;
  gap: 2rem;
}

@media (min-width: 1280px) {
  .bw-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 2.5rem;
    align-items: start;
  }
}

.bw-aside {
  display: grid;
  align-content: start;
}

.bw-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 1280px) {
  .bw-aside {
    position: sticky;
    top: 6rem;
  }

  .bw-nav {
    display: grid;
    gap: 0.7rem;
  }
}

.bw-nav a {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.9rem;
  border: var(--bw-line) solid var(--bw-edge);
  border-radius: 12px;
  background: rgb(var(--c-pink) / 0.16);
  color: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;
}

.bw-nav li:nth-child(2) a { background: rgb(var(--c-wine-light) / 0.28); }
.bw-nav li:nth-child(3) a { background: rgb(var(--c-pink-soft) / 0.18); }

.bw-nav a span {
  font-family: var(--bw-mono);
  font-size: 0.75rem;
  font-weight: 500;
}

.bw-nav a:hover {
  background: var(--bw-pink);
  color: var(--bw-fixed-ink);
  transform: translateX(4px);
}

.bw-nav a[aria-current="true"] {
  background: var(--bw-ink);
  color: var(--bw-paper);
}

/* ---------------------------------------------------------------- */
/* Blocks                                                            */
/* ---------------------------------------------------------------- */

.bw-main {
  display: grid;
  gap: 3rem;
  min-width: 0;
  container-type: inline-size;
  container-name: bw-main;
}

.bw-block {
  min-width: 0;
  scroll-margin-top: 6rem;
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.bw-block[data-shown="true"] {
  opacity: 1;
  transform: none;
}

.bw-block-head {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1.5rem;
}

.bw-num.bw-num--sub {
  font-size: clamp(1.05rem, 1.7vw, 1.35rem);
  letter-spacing: 0;
}

.bw-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  min-height: 56px;
  padding: 0.35rem;
  border: var(--bw-line) solid var(--bw-fixed-ink);
  border-radius: 16px;
  background: var(--bw-pink);
  color: var(--bw-fixed-ink);
  box-shadow: var(--bw-glow-sm);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
}

.bw-rule {
  flex: 1;
  height: 2px;
  border-radius: 2px;
  background: var(--bw-ink);
  opacity: 0.5;
}

.bw-label {
  padding: 0.48rem 0.85rem;
  border: var(--bw-line) solid var(--bw-fixed-ink);
  border-radius: 999px;
  background: var(--bw-pink);
  color: var(--bw-fixed-ink);
  box-shadow: 0 4px 12px -8px rgb(var(--c-wine) / 0.55);
  font-family: var(--bw-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
}

.bw-h3 {
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.bw-p {
  max-width: 62ch;
  margin-top: 0.85rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--bw-soft);
}

/* Shared animated icon stroke style */
.bw-svg {
  width: 34px;
  height: 34px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.bw-fill { fill: currentColor; stroke: none; }

/* ---------------------------------------------------------------- */
/* 01 — Path steps                                                   */
/* ---------------------------------------------------------------- */

.bw-steps {
  display: grid;
  gap: 1.15rem;
}

@container bw-main (min-width: 760px) {
  .bw-steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.bw-step {
  position: relative;
  display: grid;
  gap: 0.6rem;
  align-content: start;
  min-width: 0;
  padding: 1.2rem;
  border: var(--bw-line) solid var(--bw-edge);
  border-radius: 18px;
  background: var(--bw-paper);
  box-shadow: var(--bw-glow-sm);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.bw-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px -18px rgb(var(--c-pink) / 0.5);
}

.bw-step:nth-child(1) { background: rgb(var(--c-pink) / 0.16); }
.bw-step:nth-child(2) { background: rgb(var(--c-wine-light) / 0.26); }
.bw-step:nth-child(3) { background: rgb(var(--c-pink-soft) / 0.14); }

.bw-step-icon {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border: 1px solid var(--bw-edge);
  border-radius: 15px;
  background: var(--bw-paper);
  color: var(--bw-pink);
}

.bw-step-kicker {
  font-family: var(--bw-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
}

.bw-step h4 {
  font-size: clamp(1.15rem, 1.7vw, 1.4rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.bw-step p {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--bw-soft);
}

.bw-step-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.bw-step-tags span {
  padding: 0.26rem 0.6rem;
  border: 1px solid var(--bw-edge);
  border-radius: 999px;
  background: rgb(var(--c-panel) / 0.7);
  font-family: var(--bw-mono);
  font-size: 0.66rem;
  letter-spacing: 0.03em;
}

/* Icon animation keyframes */
.bw-gear {
  transform-origin: 24px 24px;
  animation: bw-spin 8s linear infinite;
}

.bw-draw {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: bw-draw 3.2s ease-in-out infinite;
}

.bw-draw--2 { animation-delay: 0.35s; }
.bw-draw--3 { animation-delay: 0.7s; }

.bw-ecg {
  stroke-dasharray: 72;
  stroke-dashoffset: 72;
  animation: bw-ecg 2.6s cubic-bezier(0.6, 0, 0.4, 1) infinite;
}

.bw-blink {
  animation: bw-blink 2.4s steps(2, end) infinite;
  transform-origin: center;
}

@keyframes bw-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bw-draw {
  0%, 100% { stroke-dashoffset: 30; }
  40%, 70% { stroke-dashoffset: 0; }
}

@keyframes bw-ecg {
  0% { stroke-dashoffset: 72; }
  55%, 100% { stroke-dashoffset: 0; }
}

@keyframes bw-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0.15; }
}

/* ---------------------------------------------------------------- */
/* 02 — Toolkit                                                      */
/* ---------------------------------------------------------------- */

.bw-groups {
  display: grid;
  gap: 1.15rem;
}

@container bw-main (min-width: 880px) {
  .bw-groups {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.bw-group {
  display: grid;
  gap: 0.8rem;
  align-content: start;
  min-width: 0;
  padding: 1.1rem;
  border: var(--bw-line) solid var(--bw-edge);
  border-radius: 18px;
  background: var(--bw-paper);
  box-shadow: var(--bw-glow-sm);
}

.bw-group-top {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-bottom: 0.7rem;
  border-bottom: 2px dashed rgb(var(--c-fg) / 0.3);
}

.bw-group-badge {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid var(--bw-edge);
  border-radius: 11px;
  background: rgb(var(--c-pink) / 0.24);
  color: var(--bw-pink);
}

.bw-group:nth-child(2) .bw-group-badge { background: rgb(var(--c-wine-light) / 0.3); }
.bw-group:nth-child(3) .bw-group-badge { background: rgb(var(--c-pink-soft) / 0.2); }

.bw-group-badge .bw-svg {
  width: 22px;
  height: 22px;
}

.bw-group h4 {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.bw-group small {
  display: block;
  margin-top: 0.1rem;
  font-family: var(--bw-mono);
  font-size: 0.66rem;
  letter-spacing: 0.04em;
  opacity: 0.7;
}

.bw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.bw-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.42rem 0.65rem;
  border: 1px solid var(--bw-edge);
  border-radius: 10px;
  background: var(--bw-inset);
  box-shadow: 0 2px 8px -2px rgb(var(--c-wine) / 0.35);
  font-family: var(--bw-mono);
  font-size: 0.7rem;
  font-weight: 500;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.bw-chip img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.3, 1.6);
}

.bw-chip:hover {
  background: rgb(var(--c-pink) / 0.22);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px -10px rgb(var(--c-pink) / 0.55);
}

.bw-chip:hover img {
  transform: scale(1.18) rotate(9deg);
}

.bw-block[data-shown="true"] .bw-chip {
  animation: bw-pop 0.55s cubic-bezier(0.2, 0.8, 0.3, 1.4) backwards;
  animation-delay: var(--bw-d, 0ms);
}

@keyframes bw-pop {
  from { opacity: 0; transform: scale(0.7) translateY(8px); }
  to { opacity: 1; transform: none; }
}

/* ---------------------------------------------------------------- */
/* 03 — Focus + pipeline                                             */
/* ---------------------------------------------------------------- */

.bw-focus {
  display: grid;
  gap: 1.6rem;
}

@container bw-main (min-width: 720px) {
  .bw-focus {
    grid-template-columns: minmax(0, 1.05fr) minmax(230px, 0.95fr);
    /* the pipeline panel ends where its content ends, instead of stretching
       into a large empty dark box beside the taller focus list */
    align-items: start;
    gap: 1.8rem;
  }
}

.bw-focus-list {
  display: grid;
  gap: 0.8rem;
  align-content: start;
  margin-top: 1.3rem;
}

.bw-focus-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.85rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--bw-edge);
  border-radius: 13px;
  background: var(--bw-paper);
  transition: transform 0.2s ease, background 0.2s ease;
}

.bw-focus-item:hover {
  background: rgb(var(--c-pink) / 0.14);
  transform: translateX(4px);
}

.bw-focus-item .bw-svg {
  width: 24px;
  height: 24px;
  color: var(--bw-pink);
}

.bw-focus-item strong {
  display: block;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.bw-focus-item span span {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--bw-soft);
}

.bw-flow-panel {
  display: grid;
  gap: 0.9rem;
  align-content: start;
  padding: 1.05rem;
  border: var(--bw-line) solid rgb(var(--c-fg) / 0.14);
  border-radius: 20px;
  background:
    radial-gradient(circle at 85% 8%, rgb(var(--c-pink) / 0.6), transparent 44%),
    radial-gradient(circle at 10% 92%, rgb(var(--c-wine-light) / 0.5), transparent 46%),
    #140c12;
  color: var(--bw-fixed-paper);
  box-shadow: var(--bw-glow);
}

.bw-flow-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.7rem;
  border-bottom: 1.5px dashed rgb(253 240 246 / 0.3);
  font-family: var(--bw-mono);
  font-size: 0.66rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.bw-flow-head .bw-flow-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--bw-pink);
  box-shadow: 0 0 0 0 rgb(var(--c-pink) / 0.6);
  animation: bw-ping 2s ease-out infinite;
}

.bw-flow-head em {
  margin-left: auto;
  padding: 0.15rem 0.45rem;
  border: 1px solid rgb(253 240 246 / 0.55);
  border-radius: 999px;
  font-size: 0.6rem;
  font-style: normal;
  letter-spacing: 0.1em;
}

.bw-flow {
  position: relative;
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0.15rem 0;
  list-style: none;
}

.bw-flow::before {
  content: "";
  position: absolute;
  left: 9px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    rgb(253 240 246 / 0.4) 0 5px,
    transparent 5px 10px
  );
}

.bw-flow::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--bw-pink);
  box-shadow: 0 0 12px 3px rgb(var(--c-pink) / 0.65);
  animation: bw-flow-run 3.6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

.bw-flow-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.3rem 0;
  font-family: var(--bw-mono);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.bw-flow-bulb {
  position: relative;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  border: 1px solid rgb(253 240 246 / 0.75);
  border-radius: 50%;
  background: #140c12;
  z-index: 1;
}

.bw-flow-bulb::after {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bw-pink);
  animation: bw-flow-bulb 3.6s ease-in-out infinite;
  animation-delay: calc(var(--bw-i) * 0.55s);
}

.bw-flow-label {
  font-family: var(--bw-display);
  font-size: 0.92rem;
  font-weight: 600;
  letter-spacing: 0;
}

.bw-flow-state {
  margin-left: auto;
  padding: 0.1rem 0.4rem;
  border-radius: 5px;
  background: rgb(253 240 246 / 0.12);
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.8;
}

.bw-flow-foot {
  padding-top: 0.7rem;
  border-top: 1px dashed rgb(253 240 246 / 0.3);
  font-family: var(--bw-mono);
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  opacity: 0.8;
}

@keyframes bw-flow-run {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(150px); opacity: 0; }
}

@keyframes bw-flow-bulb {
  0%, 100% { background: var(--bw-pink); box-shadow: 0 0 0 0 rgb(var(--c-pink) / 0.45); }
  50% { background: var(--bw-pink-soft); box-shadow: 0 0 0 5px rgb(var(--c-pink) / 0.16); }
}

@keyframes bw-ping {
  0% { box-shadow: 0 0 0 0 rgb(var(--c-pink) / 0.55); }
  100% { box-shadow: 0 0 0 9px rgb(var(--c-pink) / 0); }
}

/* ---------------------------------------------------------------- */
/* Ticker                                                            */
/* ---------------------------------------------------------------- */

.bw-marquee {
  display: flex;
  margin: 2.5rem calc(var(--bw-pad) * -1) calc(var(--bw-pad) * -1);
  overflow: hidden;
  border-top: var(--bw-line) solid var(--bw-edge);
  background: var(--bw-pink);
  color: var(--bw-fixed-ink);
}

.bw-track {
  display: flex;
  flex: 0 0 auto;
  min-width: 100%;
  animation: bw-scroll 32s linear infinite;
}

.bw-marquee:hover .bw-track {
  animation-play-state: paused;
}

.bw-item {
  display: inline-flex;
  align-items: center;
  gap: 1.4rem;
  padding: 0.85rem 0 0.85rem 1.4rem;
  font-family: var(--bw-mono);
  font-size: 0.86rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}

.bw-item::after {
  content: "\\2733";
  font-size: 1.15rem;
}

@keyframes bw-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* ---------------------------------------------------------------- */
/* Responsive                                                        */
/* ---------------------------------------------------------------- */

@media (max-width: 640px) {
  .bw-shell {
    border-radius: 22px;
    box-shadow: var(--bw-glow);
  }

  .bw-head {
    border-radius: 16px;
  }

  .bw-main { gap: 2.4rem; }

  .bw-block-head { gap: 0.55rem; }

  .bw-num {
    min-width: 44px;
    min-height: 44px;
    border-radius: 12px;
    font-size: 1.5rem;
  }

  .bw-label {
    padding: 0.4rem 0.6rem;
    font-size: 0.62rem;
    letter-spacing: 0.04em;
  }

}

/* Focus + reduced motion */
.bw-root :is(a, button):focus-visible {
  outline: 3px solid var(--bw-pink);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .bw-shell {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .bw-block,
  .bw-step,
  .bw-chip,
  .bw-focus-item {
    transition: none;
  }

  .bw-block { opacity: 1; transform: none; }

  .bw-track,
  .bw-orbit-layer,
  .bw-orbit-icon,
  .bw-orbit-icon img,
  .bw-gear,
  .bw-draw,
  .bw-ecg,
  .bw-blink,
  .bw-flow::after,
  .bw-flow-bulb::after,
  .bw-flow-head .bw-flow-dot {
    animation: none;
  }

  .bw-draw, .bw-ecg { stroke-dashoffset: 0; }

  .bw-block[data-shown="true"] .bw-chip { animation: none; }
}

/* printing a CV should not cost two pages of shadows and motion */
@media print {
  .bw-shell { box-shadow: none; animation: none; opacity: 1; transform: none; }
  .bw-marquee, .bw-aside, .bw-orbit { display: none; }
}
`;

/* ------------------------------------------------------------------ */
/* Content — everything she actually did, and the limits of it.        */
/* ------------------------------------------------------------------ */

const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

/* 1.1 / 1.2 / 1.3 rather than 01 / 02 / 03: the page already numbers its own
   sections 01–05, and two competing "01"s on screen is how a page stops reading
   as one document. */
const SECTIONS = [
  { id: "bw-path", n: "1.1", label: { en: "The path", fr: "Le parcours" } },
  { id: "bw-toolkit", n: "1.2", label: { en: "Toolkit", fr: "Outils" } },
  { id: "bw-focus", n: "1.3", label: { en: "Focus", fr: "Objectif" } },
];

const TECH_ICONS = {
  React: "react/react-original.svg",
  Angular: "angular/angular-original.svg",
  Android: "android/android-original.svg",
  PHP: "php/php-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
  Express: "express/express-original.svg",
  MongoDB: "mongodb/mongodb-original.svg",
  MySQL: "mysql/mysql-original.svg",
  Git: "git/git-original.svg",
  Docker: "docker/docker-original.svg",
  Kubernetes: "kubernetes/kubernetes-original.svg",
  Linux: "linux/linux-original.svg",
  Bash: "bash/bash-original.svg",
  "GitHub Actions": "github/github-original.svg",
};

const STEPS = [
  {
    kicker: { en: "Step 01", fr: "Étape 01" },
    title: { en: "Web development", fr: "Développement web" },
    text: {
      en: "React, Node.js and Express on the screen side, MongoDB and MySQL behind. PawFriend, my final-year project, was the biggest one: five user roles and more than sixty user stories.",
      fr: "React, Node.js et Express côté écran, MongoDB et MySQL derrière. PawFriend, mon projet de fin d’études, a été le plus gros : cinq rôles et plus de soixante user stories.",
    },
    tags: ["React", "Node.js", "Express", "MongoDB"],
  },
  {
    kicker: { en: "Step 02", fr: "Étape 02" },
    title: { en: "After the deploy", fr: "Après la mise en ligne" },
    text: {
      en: "My internships showed me the rest of the job: builds, servers, environments. On Gourmet-Go, six Docker images build and push on every commit. I wrote that pipeline, and it still feels a bit like a magic trick.",
      fr: "Mes stages m’ont montré le reste du métier : les builds, les serveurs, les environnements. Sur Gourmet-Go, six images Docker se construisent et se publient à chaque commit. J’ai écrit ce pipeline, et ça me fait encore un petit effet.",
    },
    tags: ["Docker", "CI/CD", "GitHub Actions"],
  },
  {
    kicker: { en: "Step 03", fr: "Étape 03" },
    title: { en: "Site reliability", fr: "La fiabilité" },
    text: {
      en: "Where my attention is now, and where I’ll stay honest: I read about SLOs, monitoring and incident response, and I practise them on my own projects. I have not run production systems for a company yet. That is the part I want to learn in a team.",
      fr: "Là où va mon attention, et où je reste honnête : je lis sur les SLO, le monitoring et la gestion d’incident, et je m’entraîne sur mes propres projets. Je n’ai pas encore exploité de système en production pour une entreprise. C’est la partie que je veux apprendre dans une équipe.",
    },
    tags: ["SLOs", "Monitoring", "Incidents"],
  },
];

const GROUPS = [
  {
    key: "code",
    title: { en: "Development", fr: "Développement" },
    hint: { en: "what I build with", fr: "ce que j’utilise pour construire" },
    items: ["React", "Angular", "Node.js", "Express", "MongoDB", "MySQL", "PHP", "Android"],
  },
  {
    key: "gear",
    title: { en: "DevOps & automation", fr: "DevOps et automatisation" },
    hint: { en: "where I am now", fr: "là où j’en suis" },
    items: ["Docker", "GitHub Actions", "CI/CD", "Bash", "Linux", "Git"],
  },
  {
    key: "shield",
    title: { en: "Still learning", fr: "En apprentissage" },
    hint: { en: "studying, not claiming", fr: "j’étudie, je ne prétends pas" },
    items: ["Kubernetes", "SLOs", "Monitoring", "Observability"],
  },
];

const FOCUS = [
  {
    key: "loop",
    title: { en: "CI/CD & automation", fr: "CI/CD et automatisation" },
    text: {
      en: "Turning release steps I used to do by hand into pipelines that build, test and deploy on every commit.",
      fr: "Transformer les étapes de mise en ligne que je faisais à la main en pipelines qui construisent, testent et déploient à chaque commit.",
    },
  },
  {
    key: "layers",
    title: { en: "Infrastructure as code", fr: "Infrastructure as code" },
    text: {
      en: "Environments written in files, so the second machine behaves like the first one.",
      fr: "Des environnements décrits dans des fichiers, pour que la deuxième machine se comporte comme la première.",
    },
  },
  {
    key: "pulse",
    title: { en: "Reliability & observability", fr: "Fiabilité et observabilité" },
    text: {
      en: "Metrics, logs and SLOs: seeing a problem before a user has to write to me about it.",
      fr: "Métriques, logs et SLO : voir un problème avant qu’un utilisateur ait besoin de m’écrire.",
    },
  },
];

const PIPELINE = [
  { en: "Commit", fr: "Commit" },
  { en: "Build", fr: "Build" },
  { en: "Test", fr: "Test" },
  { en: "Deploy", fr: "Deploy" },
  { en: "Observe", fr: "Observer" },
];

const TICKER = [
  "React",
  "Node.js",
  "Docker",
  "CI/CD",
  "GitHub Actions",
  "MongoDB",
  "Linux",
  "Kubernetes",
  { en: "Observability", fr: "Observabilité" },
  { en: "Site reliability", fr: "Fiabilité (SRE)" },
];

const ORBIT_OUTER = ["React", "Docker", "Node.js", "Kubernetes", "MongoDB"];
const ORBIT_INNER = ["Express", "Git", "MySQL"];

/* ------------------------------------------------------------------ */
/* Animated inline icons                                              */
/* ------------------------------------------------------------------ */

const IconWeb = () => (
  <svg className="bw-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <rect x="5" y="8" width="38" height="32" rx="5" />
    <path d="M5 16.5h38" />
    <circle className="bw-fill" cx="10.5" cy="12.3" r="1.5" />
    <circle className="bw-fill" cx="16" cy="12.3" r="1.5" />
    <circle className="bw-fill" cx="21.5" cy="12.3" r="1.5" />
    <path className="bw-draw" d="M17.5 24.5l-5 4.5 5 4.5" />
    <path className="bw-draw bw-draw--2" d="M26.5 24.5l5 4.5-5 4.5" />
    <path className="bw-draw bw-draw--3" d="M19.5 36l4-14" />
  </svg>
);

const IconDevOps = () => (
  <svg className="bw-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <g className="bw-gear">
      <circle cx="24" cy="24" r="6.5" />
      <path d="M24 7v5.5M24 35.5V41M7 24h5.5M35.5 24H41M12 12l3.9 3.9M32.1 32.1L36 36M36 12l-3.9 3.9M15.9 32.1L12 36" />
    </g>
    <circle className="bw-fill" cx="24" cy="24" r="2.2" />
  </svg>
);

const IconSRE = () => (
  <svg className="bw-svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path d="M24 5.5l15 5.6v11.1C39 32.4 32.4 39.5 24 43.5 15.6 39.5 9 32.4 9 22.2V11.1z" />
    <path className="bw-ecg" d="M12.5 23.5h6.3l3.2-6.6 4.7 13.2 3.2-6.6h5.6" />
  </svg>
);

const IconCode = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
  </svg>
);

const IconGear = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g className="bw-gear">
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.6 5.6l1.9 1.9M16.5 16.5l1.9 1.9M18.4 5.6l-1.9 1.9M7.5 16.5l-1.9 1.9" />
    </g>
  </svg>
);

const IconShield = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 2.6l8 3v6.1c0 5.4-3.5 8.9-8 10.3-4.5-1.4-8-4.9-8-10.3V5.6z" />
    <path className="bw-ecg" d="M6.6 12.2h3l1.6-3.2 2.3 6.4 1.6-3.2h2.9" />
  </svg>
);

const IconLoop = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M20 12a8 8 0 0 1-13.6 5.7L4 15.4" />
    <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8.6" />
    <path d="M4 20v-4.6h4.6M20 4v4.6h-4.6" />
  </svg>
);

const IconLayers = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 3l9 4.7-9 4.7-9-4.7z" />
    <path d="M3 12.4l9 4.7 9-4.7" />
    <path d="M3 16.9l9 4.7 9-4.7" />
  </svg>
);

const IconPulse = () => (
  <svg className="bw-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M2 12.5h4.5l2.4-5.4 3.4 10.4 2.4-5h7.3" />
    <circle className="bw-fill bw-blink" cx="21" cy="12.5" r="1.8" />
  </svg>
);

const STEP_ICONS = [IconWeb, IconDevOps, IconSRE];
const GROUP_ICONS = { code: IconCode, gear: IconGear, shield: IconShield };
const FOCUS_ICONS = { loop: IconLoop, layers: IconLayers, pulse: IconPulse };

/* ------------------------------------------------------------------ */
/* Shared pieces                                                      */
/* ------------------------------------------------------------------ */

const useReveal = () => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, shown];
};

const Block = ({ id, n, label, children }) => {
  const [ref, shown] = useReveal();

  return (
    <article id={id} ref={ref} data-shown={shown} aria-label={label} className="bw-block">
      <div className="bw-block-head">
        <span className={`bw-num${n.includes(".") ? " bw-num--sub" : ""}`}>{n}</span>
        <span className="bw-rule" aria-hidden="true" />
        <span className="bw-label">{label}</span>
      </div>

      {children}
    </article>
  );
};

const TechChip = ({ name, delay = 0 }) => {
  const path = TECH_ICONS[name];

  return (
    <span className="bw-chip" style={{ "--bw-d": `${delay}ms` }}>
      {path && (
        <img
          src={`${ICON_BASE}/${path}`}
          alt=""
          width="18"
          height="18"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}
      {name}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Orbit panel                                                        */
/* ------------------------------------------------------------------ */

const OrbitPanel = () => {
  const { t, pick } = useI18n();

  const rings = [
    { layer: "outer", items: ORBIT_OUTER, radius: "37%", step: 72 },
    { layer: "inner", items: ORBIT_INNER, radius: "26%", step: 120 },
  ];

  return (
    <div
      className="bw-orbit"
      role="img"
      aria-label={t(
        "Technology orbit: React, Docker, Node.js, Kubernetes, MongoDB, Express, Git and MySQL",
        "Orbite technologique : React, Docker, Node.js, Kubernetes, MongoDB, Express, Git et MySQL"
      )}
    >
      <span className="bw-orbit-ring bw-orbit-ring--outer" aria-hidden="true" />
      <span className="bw-orbit-ring bw-orbit-ring--inner" aria-hidden="true" />

      {rings.map(({ layer, items, radius, step }) => (
        <div key={layer} className={`bw-orbit-layer bw-orbit-layer--${layer}`} aria-hidden="true">
          {items.map((name, i) => (
            <span
              key={name}
              className="bw-orbit-slot"
              style={{ "--bw-a": `${i * step}deg`, "--bw-r": radius }}
            >
              <span className="bw-orbit-icon">
                <img
                  src={`${ICON_BASE}/${TECH_ICONS[name]}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ "--bw-d": `${i * 0.45}s` }}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </span>
            </span>
          ))}
        </div>
      ))}

      <span className="bw-orbit-core">
        <b>DevOps × SRE</b>
        <span>{pick({ en: "what I’m learning", fr: "ce que j’apprends" })}</span>
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export default function About() {
  const { t, pick } = useI18n();
  const [active, setActive] = useState(SECTIONS[0].id);

  /* scroll spy: the left nav follows whoever is reading */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  const goTo = (event, id) => {
    event.preventDefault();

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    document.getElementById(id)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 lg:py-28">
      <div className="section-container">
        <div className="bw-root">
          <style>{STYLES}</style>

          <div className="bw-shell">
            {/* ---------- header ---------- */}
            <header className="bw-head">
              <div>
                <span className="bw-eyebrow">
                  <span className="bw-eyebrow-n">01</span>
                  {t("About · Beyond web development", "À propos · Au-delà du web")}
                </span>

                <h2 id="about-title" className="bw-title">
                  {t("Beyond the", "Au-delà du")}{" "}
                  <span className="bw-mark">{t("browser", "navigateur")}</span>.
                </h2>

                {/* the signature trace, same mark as the hero and every other section */}
                <div className="w-40 mt-4" style={{ color: "var(--bw-pink)" }}>
                  <Trace height={26} />
                </div>

                <p className="bw-lead">
                  {t(
                    "I started with web development: React, Node.js and MongoDB, then a native Android app, then three internships where my code finally met real users. What stayed with me was everything after the deploy. ",
                    "J’ai commencé par le développement web : React, Node.js et MongoDB, puis une application Android native, puis trois stages où mon code a enfin rencontré de vrais utilisateurs. Ce qui m’a marquée, c’est tout ce qui vient après la mise en ligne. "
                  )}
                  <strong>
                    {t(
                      "Someone has to build it, watch it, and fix it at the wrong moment of the night. That is what I’m learning now: DevOps and Site Reliability Engineering.",
                      "Quelqu’un doit la construire, la surveiller et la réparer au mauvais moment de la nuit. C’est ce que j’apprends aujourd’hui : DevOps et Site Reliability Engineering."
                    )}
                  </strong>
                </p>

                <div className="bw-tags">
                  <span className="bw-tag">
                    <i aria-hidden="true" />
                    {t("Software engineering", "Génie logiciel")}
                  </span>
                  <span className="bw-tag">
                    <i aria-hidden="true" />
                    {t("Full-stack", "Full-stack")}
                  </span>
                  <span className="bw-tag">
                    <i aria-hidden="true" />
                    {t("DevOps · learning", "DevOps · en cours")}
                  </span>
                  <span className="bw-tag">
                    <i aria-hidden="true" />
                    {t("SRE · learning", "SRE · en cours")}
                  </span>
                </div>
              </div>

              <OrbitPanel />
            </header>

            <div className="bw-layout">
              {/* ---------- jump navigation ---------- */}
              <aside className="bw-aside">
                <ul className="bw-nav" aria-label={t("Jump to section", "Aller à une section")}>
                  {SECTIONS.map(({ id, n, label }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={(event) => goTo(event, id)}
                        aria-current={active === id ? "true" : undefined}
                      >
                        <span>{n}</span>
                        {pick(label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="bw-main">
                {/* ---------- 01 path ---------- */}
                <Block id="bw-path" n={SECTIONS[0].n} label={pick(SECTIONS[0].label)}>
                  <h3 className="bw-h3">
                    {t("From interfaces to infrastructure.", "Des interfaces à l’infrastructure.")}
                  </h3>
                  <p className="bw-p">
                    {t(
                      "One path, three steps. Each one grew out of the previous one.",
                      "Un seul chemin, trois étapes. Chacune est née de la précédente."
                    )}
                  </p>

                  <div className="bw-steps" style={{ marginTop: "1.5rem" }}>
                    {STEPS.map((step, index) => {
                      const Icon = STEP_ICONS[index];

                      return (
                        <article className="bw-step" key={step.title.en}>
                          <span className="bw-step-icon" aria-hidden="true">
                            <Icon />
                          </span>

                          <span className="bw-step-kicker">{pick(step.kicker)}</span>
                          <h4>{pick(step.title)}</h4>
                          <p>{pick(step.text)}</p>

                          <div className="bw-step-tags">
                            {step.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </Block>

                {/* ---------- 02 toolkit ---------- */}
                <Block id="bw-toolkit" n={SECTIONS[1].n} label={pick(SECTIONS[1].label)}>
                  <h3 className="bw-h3">{t("What I actually use.", "Ce que j’utilise vraiment.")}</h3>
                  <p className="bw-p">
                    {t(
                      "Three groups: the code, the delivery, and what I’m studying next. I would rather label the last one clearly than pretend it is experience.",
                      "Trois groupes : le code, la livraison, et ce que j’étudie ensuite. Je préfère nommer le dernier clairement plutôt que de le faire passer pour de l’expérience."
                    )}
                  </p>

                  <div className="bw-groups" style={{ marginTop: "1.5rem" }}>
                    {GROUPS.map((group) => {
                      const Icon = GROUP_ICONS[group.key];

                      return (
                        <section className="bw-group" key={group.title.en}>
                          <div className="bw-group-top">
                            <span className="bw-group-badge" aria-hidden="true">
                              <Icon />
                            </span>
                            <h4>
                              {pick(group.title)}
                              <small>{pick(group.hint)}</small>
                            </h4>
                          </div>

                          <div className="bw-chips">
                            {group.items.map((item, i) => (
                              <TechChip key={item} name={item} delay={i * 70} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </Block>

                {/* ---------- 03 focus ---------- */}
                <Block id="bw-focus" n={SECTIONS[2].n} label={pick(SECTIONS[2].label)}>
                  <div className="bw-focus">
                    <div>
                      <h3 className="bw-h3">{t("Where I’m heading.", "Où je vais.")}</h3>
                      <p className="bw-p">
                        {t(
                          "Reliability is a habit, not a final state. These are the three things I practise now, in the order a commit travels once it leaves my laptop.",
                          "La fiabilité est une habitude, pas un état final. Voici les trois choses que je pratique en ce moment, dans l’ordre où un commit voyage dès qu’il quitte mon ordinateur."
                        )}
                      </p>

                      <div className="bw-focus-list">
                        {FOCUS.map((item) => {
                          const Icon = FOCUS_ICONS[item.key];

                          return (
                            <div className="bw-focus-item" key={item.title.en}>
                              <span aria-hidden="true">
                                <Icon />
                              </span>
                              <span>
                                <strong>{pick(item.title)}</strong>
                                <span>{pick(item.text)}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bw-flow-panel">
                      <div className="bw-flow-head">
                        <span className="bw-flow-dot" aria-hidden="true" />
                        {t("delivery pipeline", "pipeline de livraison")}
                        <em>auto</em>
                      </div>

                      <ol className="bw-flow">
                        {PIPELINE.map((step, i) => (
                          <li className="bw-flow-item" key={step.en} style={{ "--bw-i": i }}>
                            <span className="bw-flow-bulb" aria-hidden="true" />
                            <span className="bw-flow-label">{pick(step)}</span>
                            <span className="bw-flow-state">
                              {i === PIPELINE.length - 1 ? t("watch", "veille") : t("run", "ok")}
                            </span>
                          </li>
                        ))}
                      </ol>

                      <p className="bw-flow-foot">
                        {t(
                          "the path I’m learning, one step at a time",
                          "le chemin que j’apprends, étape par étape"
                        )}
                      </p>
                    </div>
                  </div>
                </Block>
              </div>
            </div>

            {/* ---------- ticker ---------- */}
            <div className="bw-marquee" aria-hidden="true">
              {[0, 1].map((copy) => (
                <div className="bw-track" key={copy}>
                  {TICKER.map((word) => {
                    const label = pick(word);
                    return (
                      <span className="bw-item" key={`${copy}-${label}`}>
                        {label}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
