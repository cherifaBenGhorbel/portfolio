// components/Scene3D.jsx
// Concept: the avatar sits inside a faint particle heart, and your stack orbits around her.
// Nodes react to the cursor (no canvas events needed), the camera drifts for depth.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ---------- tuning ---------- */
const TILT = -0.28; // tilt of the orbit rings (radians)
const ANCHOR_X = 0.24; // desktop: how far right of center the avatar sits (fraction of viewport width)

const RINGS = [
  { rx: 1.0, ry: 0.78, speed: 0.1 }, // inner ring, in units of the avatar card width
  { rx: 1.38, ry: 1.0, speed: -0.06 }, // outer ring, opposite direction
];

const STACK = [
  { id: "react", label: "React", color: "#FF4FA0", ring: 0, phase: 0.2 },
  { id: "node", label: "Node.js", color: "#FF8FC0", ring: 0, phase: 2.3 },
  { id: "mongo", label: "MongoDB", color: "#E0527F", ring: 0, phase: 4.4 },
  { id: "docker", label: "Docker", color: "#FF8FC0", ring: 1, phase: 0.9 },
  { id: "k8s", label: "Kubernetes", color: "#FF4FA0", ring: 1, phase: 2.2 },
  { id: "aws", label: "AWS", color: "#E0527F", ring: 1, phase: 3.5 },
  { id: "jenkins", label: "Jenkins", color: "#FF8FC0", ring: 1, phase: 4.8 },
];

const LINKS = [
  ["react", "node"],
  ["node", "mongo"],
  ["node", "docker"],
  ["mongo", "aws"],
  ["docker", "k8s"],
  ["k8s", "aws"],
  ["aws", "jenkins"],
  ["jenkins", "docker"],
];

/* ---------- helpers ---------- */
function tilt(x, y) {
  const c = Math.cos(TILT);
  const s = Math.sin(TILT);
  return [x * c - y * s, x * s + y * c];
}

// pointer position (-1..1) relative to the canvas, tracked on window so overlays never block it
function usePointer(element) {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      const r = element.getBoundingClientRect();
      p.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      p.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [element]);
  return p;
}

/* ---------- particle heart (your signature, now framing the avatar) ---------- */
function Heart({ R, reduce }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const N = 340;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const k = 1 + (Math.random() - 0.5) * 0.07; // slight radial jitter
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      arr[i * 3] = (x / 16) * k;
      arr[i * 3 + 1] = (y / 16 + 0.15) * k;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const beat = reduce ? 0 : Math.pow(Math.max(0, Math.sin(t * 2.4)), 8); // quick "heartbeat" pulse
    ref.current.scale.setScalar(R * 0.85 * (1 + 0.035 * beat));
    ref.current.rotation.y = reduce ? 0 : Math.sin(t * 0.25) * 0.25;
  });

  return (
    <points ref={ref} position={[0, 0, -1]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#FF4FA0"
        size={0.035}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- orbit rings ---------- */
function Rings({ R }) {
  const rings = useMemo(
    () =>
      RINGS.map((r) => {
        const pts = [];
        for (let i = 0; i <= 96; i++) {
          const a = (i / 96) * Math.PI * 2;
          const [x, y] = tilt(Math.cos(a) * r.rx * R, Math.sin(a) * r.ry * R);
          pts.push([x, y, 0]);
        }
        return pts;
      }),
    [R]
  );

  return rings.map((pts, i) => (
    <Line
      key={i}
      points={pts}
      color="#FF4FA0"
      lineWidth={1}
      transparent
      opacity={i === 0 ? 0.16 : 0.1}
      dashed={i === 1}
      dashSize={0.06}
      gapSize={0.12}
    />
  ));
}

/* ---------- orbiting stack + connecting lines ---------- */
function Orbit({ R, anchor, pointer, reduce }) {
  const { viewport } = useThree();
  const nodes = useRef([]);
  const labels = useRef([]);
  const linkRef = useRef();
  const clock = useRef(0);

  const linkArr = useMemo(() => new Float32Array(LINKS.length * 6), []);
  const index = useMemo(() => Object.fromEntries(STACK.map((n, i) => [n.id, i])), []);
  const pos = useMemo(() => STACK.map(() => new THREE.Vector3()), []);

  useFrame((_, dt) => {
    if (!reduce) clock.current += Math.min(dt, 0.05);
    const t = clock.current;

    // cursor in this group's local space
    const px = pointer.current.x * (viewport.width / 2) - anchor[0];
    const py = pointer.current.y * (viewport.height / 2) - anchor[1];

    STACK.forEach((n, i) => {
      const ring = RINGS[n.ring];
      const a = n.phase + t * ring.speed;
      const [x, y] = tilt(Math.cos(a) * ring.rx * R, Math.sin(a) * ring.ry * R);
      const z = Math.sin(a) * 0.8; // gives depth: nodes swing toward/away from the camera
      pos[i].set(x, y, z);

      const near = THREE.MathUtils.clamp(1 - Math.hypot(x - px, y - py) / (R * 0.45), 0, 1);

      const g = nodes.current[i];
      if (g) {
        g.position.set(x, y, z);
        g.scale.setScalar(1 + near * 0.9);
      }
      const el = labels.current[i];
      if (el) el.style.opacity = String(0.3 + 0.35 * ((z + 0.8) / 1.6) + 0.35 * near);
    });

    LINKS.forEach(([from, to], k) => {
      const A = pos[index[from]];
      const B = pos[index[to]];
      linkArr[k * 6] = A.x;
      linkArr[k * 6 + 1] = A.y;
      linkArr[k * 6 + 2] = A.z;
      linkArr[k * 6 + 3] = B.x;
      linkArr[k * 6 + 4] = B.y;
      linkArr[k * 6 + 5] = B.z;
    });
    if (linkRef.current) linkRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <lineSegments ref={linkRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={LINKS.length * 2} array={linkArr} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF4FA0" transparent opacity={0.2} />
      </lineSegments>

      {STACK.map((n, i) => (
        <group key={n.id} ref={(el) => (nodes.current[i] = el)}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color={n.color} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={n.color} transparent opacity={0.14} depthWrite={false} />
          </mesh>
          <Html zIndexRange={[0, 0]} style={{ pointerEvents: "none" }}>
            <div
              ref={(el) => (labels.current[i] = el)}
              className="px-2 py-0.5 font-mono text-[11px] text-[#E4DEE8] -translate-x-1/2 translate-y-3
                         rounded-full border border-[#7A1330]/50 bg-black/55 backdrop-blur-sm
                         whitespace-nowrap select-none pointer-events-none"
            >
              {n.label}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

/* ---------- distant dust ---------- */
function Stars() {
  const ref = useRef();
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const N = 160;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * viewport.width * 1.4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.4;
      arr[i * 3 + 2] = -3 - Math.random() * 3;
    }
    return arr;
  }, [viewport.width, viewport.height]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#F0AFC6" size={0.025} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/* ---------- world ---------- */
function World({ reduce }) {
  const { viewport, size, gl } = useThree();
  const pointer = usePointer(gl.domElement);

  const wide = size.width >= 1024;
  const pxPerUnit = size.width / viewport.width;
  const cardPx = wide ? Math.min(448, size.width * 0.4) : Math.min(384, size.width - 48);
  const R = cardPx / pxPerUnit; // avatar card width in world units
  const anchor = useMemo(
    () => (wide ? [ANCHOR_X * viewport.width, 0] : [0, -viewport.height * 0.2]),
    [wide, viewport.width, viewport.height]
  );

  // gentle camera drift for parallax
  useFrame((state) => {
    if (reduce) return;
    const cam = state.camera;
    cam.position.x += (pointer.current.x * 0.3 - cam.position.x) * 0.04;
    cam.position.y += (pointer.current.y * 0.2 - cam.position.y) * 0.04;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <Stars />
      <group position={[anchor[0], anchor[1], 0]}>
        <Heart R={R} reduce={reduce} />
        <Rings R={R} />
        <Orbit R={R} anchor={anchor} pointer={pointer} reduce={reduce} />
      </group>
    </>
  );
}

/* ---------- canvas ---------- */
export default function Scene3D() {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(true);
  const [reduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // stop rendering when the hero is off-screen
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        frameloop={reduce ? "demand" : active ? "always" : "never"}
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <World reduce={reduce} />
        </Suspense>
      </Canvas>
    </div>
  );
}