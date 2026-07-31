import { Canvas, useFrame } from '@react-three/fiber'
import { Line, Float } from '@react-three/drei'
import { useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'

// Nodes = pieces of your stack. Edges = how they talk to each other.
// This is the literal shape of the work, not a decorative backdrop.

const NODES = [
  { id: 'client', pos: [-3.4, 1.6, -1.5] },
  { id: 'api', pos: [-1, 2.4, -2.5] },
  { id: 'db', pos: [1.6, 1.2, -1.8] },
  { id: 'ci', pos: [3.2, -0.4, -2.2] },
  { id: 'infra', pos: [0.6, -2, -1.4] },
  { id: 'monitor', pos: [-2.6, -1.6, -2.6] },
]

const EDGES = [
  ['client', 'api'],
  ['api', 'db'],
  ['api', 'ci'],
  ['ci', 'infra'],
  ['infra', 'monitor'],
  ['monitor', 'client'],
  ['api', 'infra'],
]

function Node({ position }) {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh position={position}>
        <icosahedronGeometry args={[0.14, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>
    </Float>
  )
}

function Edge({ start, end, offset = 0 }) {
  const pulseRef = useRef()
  const a = useMemo(() => new THREE.Vector3(...start), [start])
  const b = useMemo(() => new THREE.Vector3(...end), [end])

  useFrame((state) => {
    if (!pulseRef.current) return
    const t = (state.clock.elapsedTime * 0.3 + offset) % 1
    pulseRef.current.position.lerpVectors(a, b, t)
    pulseRef.current.material.opacity = Math.sin(t * Math.PI)
  })

  return (
    <>
      <Line points={[start, end]} color="#334155" lineWidth={1} transparent opacity={0.5} />
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#22d3ee" transparent />
      </mesh>
    </>
  )
}

function SceneContent() {
  const nodeMap = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n.pos])), [])
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={0.6} color="#fbbf24" />
      <pointLight position={[-6, -4, -4]} intensity={0.3} color="#22d3ee" />

      {NODES.map((n) => (
        <Node key={n.id} position={n.pos} />
      ))}

      {EDGES.map(([from, to], i) => (
        <Edge key={i} start={nodeMap[from]} end={nodeMap[to]} offset={i * 0.15} />
      ))}
    </>
  )
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}