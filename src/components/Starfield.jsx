import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useEffect, useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useTheme } from '../theme'

/* ---------- light mode: cherry blossoms falling instead of a night sky ---------- */
// One petal shape is drawn once per colour and reused; building a path for every
// petal on every frame would cost far more than it is worth.
function petalSprite(rgb) {
  const size = 72
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const r = size / 2 - 2

  ctx.translate(size / 2, size / 2)
  ctx.beginPath()
  ctx.moveTo(0, -r)
  ctx.bezierCurveTo(r * 0.98, -r * 0.45, r * 0.72, r * 0.78, 0, r)
  ctx.bezierCurveTo(-r * 0.72, r * 0.78, -r * 0.98, -r * 0.45, 0, -r)
  ctx.closePath()

  const g = ctx.createLinearGradient(0, -r, 0, r)
  g.addColorStop(0, `rgba(${rgb},0.95)`)
  g.addColorStop(1, `rgba(${rgb},0.5)`)
  ctx.fillStyle = g
  ctx.fill()

  return c
}

// keeps a value inside [0, span) whatever its sign — the petals wrap on both axes
const wrap = (v, span) => ((v % span) + span) % span

function Petals() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = [petalSprite('246,177,203'), petalSprite('236,140,177'), petalSprite('214,102,148')]

    let w = 0
    let h = 0
    let raf = 0

    // positions are fractions of the viewport, so a resize never re-seeds the blossoms
    const petals = Array.from({ length: 40 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      size: 12 + Math.random() * 16,
      alpha: 0.55 + Math.random() * 0.35,
      fall: 0.014 + Math.random() * 0.026, // viewports per second
      sway: Math.random() * Math.PI * 2,
      swayAmp: 14 + Math.random() * 34,
      swaySpeed: 0.25 + Math.random() * 0.45,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 1.1, // radians per second
      wind: 4 + Math.random() * 10, // px per second, always toward the right
      sprite: sprites[i % sprites.length],
    }))

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        const y = wrap(p.y + t * p.fall, 1) * (h + 80) - 40 // falls off the bottom, returns at the top
        const drift = Math.sin(t * p.swaySpeed + p.sway) * p.swayAmp
        const x = wrap(p.x * w + drift + t * p.wind, w + 80) - 40
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.translate(x, y)
        ctx.rotate(p.spin + t * p.spinSpeed)
        ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore() // restores globalAlpha too
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // resizing clears the canvas, and without motion there is no loop to repaint it
      if (reduce) draw(0)
    }

    resize()

    if (!reduce) {
      const t0 = performance.now()
      const loop = (now) => {
        draw((now - t0) / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="w-full h-full" aria-hidden />
}

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
  const { isLight } = useTheme()

  // A night sky on a white page is just grey noise; light mode gets falling cherry
  // blossoms over the CSS bloom in index.css, on a 2D canvas instead of a WebGL scene.
  if (isLight) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none starfield">
        <Petals />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none starfield">
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