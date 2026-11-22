import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'

function ShootingStar({ delay = 0, speed = 1 }) {
  const ref = useRef()
  const trailRef = useRef()
  const glowRef = useRef()

  const path = useMemo(() => {
    const startX = (Math.random() - 0.5) * 80
    const startY = 20 + Math.random() * 25
    const startZ = -30 - Math.random() * 40
    const dirX = -15 - Math.random() * 20
    const dirY = -12 - Math.random() * 15
    return { startX, startY, startZ, dirX, dirY }
  }, [])

  useFrame((state) => {
    if (!ref.current || !trailRef.current || !glowRef.current) return

    const cycle = 6 + delay * 0.3
    const t = ((state.clock.elapsedTime * speed + delay) % cycle) / cycle
    
    const active = t < 0.3
    const p = active ? t / 0.3 : 0

    const x = path.startX + path.dirX * p
    const y = path.startY + path.dirY * p
    const z = path.startZ

    ref.current.position.set(x, y, z)
    const opacity = active ? Math.sin(p * Math.PI) : 0
    ref.current.material.opacity = opacity

    trailRef.current.position.set(
      x - path.dirX * 0.03,
      y - path.dirY * 0.03,
      z
    )
    trailRef.current.material.opacity = opacity * 0.4

    glowRef.current.position.set(x, y, z)
    glowRef.current.material.opacity = opacity * 0.15
    glowRef.current.scale.setScalar(1 + Math.sin(p * Math.PI * 2) * 0.5)
  })

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FF8FC0" transparent opacity={0} />
      </mesh>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#FF4FA0" transparent opacity={0} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#FF4FA0" transparent opacity={0} />
      </mesh>
    </>
  )
}

function TwinklingStar({ position, size, speed }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (!ref.current) return
    const brightness = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * speed + position[0])
    ref.current.material.opacity = brightness * 0.8
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 4, 4]} />
      <meshBasicMaterial color="#FF8FC0" transparent opacity={0.5} />
    </mesh>
  )
}

function StarsScene() {
  const twinklingStars = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      position: [
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 60,
        -20 - Math.random() * 40
      ],
      size: 0.02 + Math.random() * 0.05,
      speed: 0.5 + Math.random() * 1.5
    }))
  }, [])

  return (
    <>
      <color attach="background" args={['#0A0910']} />

      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {twinklingStars.map((star, i) => (
        <TwinklingStar key={i} {...star} />
      ))}

      <ShootingStar delay={0} speed={1.2} />
      <ShootingStar delay={2} speed={0.8} />
      <ShootingStar delay={4} speed={1.5} />
      <ShootingStar delay={6.5} speed={0.9} />
      <ShootingStar delay={9} speed={1.1} />
    </>
  )
}

export default function Starfield() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: false }}
      >
        <Suspense fallback={null}>
          <StarsScene />
        </Suspense>
      </Canvas>
    </div>
  )
}