'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, AdaptiveDpr, Instances, Instance } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CAREER_TIMELINE } from '@/lib/data'
import { input } from './input'
import { CHARACTER_GLB_URL, CharacterModel } from './character-model'
import { journeyAudio } from './audio'
import { nav } from './nav'

// journey runs oldest -> newest so visitors walk forward through time
export const JOURNEY = [...CAREER_TIMELINE].reverse()

const ACCENT_HEX: Record<string, string> = {
  synapse: '#0ea5e9',
  signal: '#f59e0b',
  accent: '#06b6d4',
}

const SPACING = 12
const TRIGGER_RADIUS = 4.5
const PATH_END = JOURNEY.length * SPACING + 12

// shared active-milestone marker, written by Player every frame, read by Monuments.
const activeRef: { index: number | null } = { index: null }

export function positionFor(i: number): [number, number, number] {
  const side = i % 2 === 0 ? -1 : 1
  return [side * 4.2, 0, i * SPACING + 8]
}

// ---- Milestone monument ----

function Monument({ index, accent, label }: { index: number; accent: string; label: string }) {
  const hex = ACCENT_HEX[accent] ?? ACCENT_HEX.synapse
  const crystal = useRef<THREE.Mesh>(null)
  const obeliskMat = useRef<THREE.MeshStandardMaterial>(null)
  const crystalMat = useRef<THREE.MeshStandardMaterial>(null)
  const padMat = useRef<THREE.MeshStandardMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  const ring = useRef<THREE.Mesh>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const prevActive = useRef(false)
  const pulse = useRef(1) // 0 -> 1 over an arrival; 1 = idle
  const pos = positionFor(index)

  useFrame((state, dt) => {
    const active = activeRef.index === index
    const t = Math.min(dt, 0.05)
    if (crystal.current) {
      crystal.current.rotation.y += t * 0.7
      crystal.current.position.y = 4.7 + Math.sin(state.clock.elapsedTime * 1.4 + index) * 0.18
    }
    const lerp = (m: THREE.MeshStandardMaterial | null, target: number) => {
      if (m) m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, target, t * 6)
    }
    lerp(obeliskMat.current, active ? 1.6 : 0.5)
    lerp(crystalMat.current, active ? 2.8 : 1.3)
    lerp(padMat.current, active ? 0.9 : 0.2)
    if (light.current) light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, active ? 8 : 3, t * 6)

    // arrival ring pulse (edge-triggered when this monument becomes active)
    if (active && !prevActive.current) pulse.current = 0
    prevActive.current = active
    if (pulse.current < 1) {
      pulse.current = Math.min(1, pulse.current + t * 1.1)
      const s = 1 + pulse.current * 3.5
      if (ring.current) ring.current.scale.set(s, s, s)
      if (ringMat.current) ringMat.current.opacity = (1 - pulse.current) * 0.6
    } else if (ringMat.current && ringMat.current.opacity !== 0) {
      ringMat.current.opacity = 0
    }
  })

  return (
    <group position={pos}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.7, 4, 0.7]} />
        <meshStandardMaterial ref={obeliskMat} color={hex} emissive={hex} emissiveIntensity={0.5} metalness={0.4} roughness={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={crystal} position={[0, 4.7, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial ref={crystalMat} color={hex} emissive={hex} emissiveIntensity={1.3} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.4, 40]} />
        <meshStandardMaterial ref={padMat} color={hex} emissive={hex} emissiveIntensity={0.2} transparent opacity={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.5, 48]} />
        <meshBasicMaterial ref={ringMat} color={hex} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 3, 0]} color={hex} intensity={3} distance={12} />
      <Html position={[0, 5.9, 0]} center distanceFactor={16} zIndexRange={[10, 0]}>
        <div
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.02em',
            color: hex,
            textShadow: '0 0 12px rgba(0,0,0,0.95)',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

// ---- Procedural articulated character (fallback when no GLB is supplied) ----

function ProceduralWalker({
  legL,
  legR,
  armL,
  armR,
}: {
  legL: React.RefObject<THREE.Group | null>
  legR: React.RefObject<THREE.Group | null>
  armL: React.RefObject<THREE.Group | null>
  armR: React.RefObject<THREE.Group | null>
}) {
  return (
    <group>
      {/* torso */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.7, 6, 12]} />
        <meshStandardMaterial color="#faf4e8" roughness={0.6} />
      </mesh>
      {/* head */}
      <mesh position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.3, 18, 18]} />
        <meshStandardMaterial color="#faf4e8" roughness={0.6} />
      </mesh>
      {/* backpack (nod to the reference art) */}
      <mesh position={[0, 1.3, -0.32]}>
        <boxGeometry args={[0.5, 0.7, 0.26]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} roughness={0.5} toneMapped={false} />
      </mesh>
      {/* arms (pivot at shoulder) */}
      <group ref={armL} position={[0.42, 1.6, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.16, 0.8, 0.16]} />
          <meshStandardMaterial color="#e9e0d0" roughness={0.6} />
        </mesh>
      </group>
      <group ref={armR} position={[-0.42, 1.6, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.16, 0.8, 0.16]} />
          <meshStandardMaterial color="#e9e0d0" roughness={0.6} />
        </mesh>
      </group>
      {/* legs (pivot at hip) */}
      <group ref={legL} position={[0.17, 0.92, 0]}>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#3a4252" roughness={0.7} />
        </mesh>
      </group>
      <group ref={legR} position={[-0.17, 0.92, 0]}>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#3a4252" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

// ---- Player + follow camera ----

function Player({
  onActiveChange,
  reducedMotion,
}: {
  onActiveChange: (i: number | null) => void
  reducedMotion: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const heading = useRef(0)
  const phase = useRef(0)
  const swing = useRef(0)
  const focus = useRef(0)
  const prevSin = useRef(0)
  const lastActive = useRef<number | null>(null)
  const { camera } = useThree()
  const camTarget = useMemo(() => new THREE.Vector3(), [])
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, rawDt) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(rawDt, 0.05) // clamp for tab-switch spikes

    const manual = input.forward !== 0 || input.turn !== 0
    if (manual && nav.target !== null) nav.target = null // manual input cancels fast-travel

    let moving = false

    if (nav.target !== null) {
      // auto-walk to a stop chosen from the HUD timeline
      const p = positionFor(nav.target)
      const dx = p[0] - g.position.x
      const dz = p[2] - g.position.z
      const dist = Math.hypot(dx, dz)
      if (dist > 0.9) {
        const targetH = Math.atan2(dx, dz)
        let d = targetH - heading.current
        d = Math.atan2(Math.sin(d), Math.cos(d)) // shortest angular delta
        heading.current += d * Math.min(1, dt * 6)
        g.rotation.y = heading.current
        const step = Math.min(8 * dt, dist)
        g.position.x += (dx / dist) * step
        g.position.z += (dz / dist) * step
        phase.current += dt * 11
        moving = true
      } else {
        nav.target = null
      }
    } else {
      // manual control
      heading.current += input.turn * 2.5 * dt
      g.rotation.y = heading.current
      if (input.forward !== 0) {
        dir.set(Math.sin(heading.current), 0, Math.cos(heading.current))
        g.position.addScaledVector(dir, input.forward * 7 * dt)
        phase.current += dt * 11
        moving = true
      }
    }

    g.position.x = THREE.MathUtils.clamp(g.position.x, -8, 8)
    g.position.z = THREE.MathUtils.clamp(g.position.z, -4, PATH_END)

    // walk cycle, eased in/out
    swing.current = THREE.MathUtils.lerp(swing.current, moving ? 0.55 : 0, dt * 8)
    const sinp = Math.sin(phase.current)
    const s = sinp * swing.current
    if (legL.current) legL.current.rotation.x = s
    if (legR.current) legR.current.rotation.x = -s
    if (armL.current) armL.current.rotation.x = -s
    if (armR.current) armR.current.rotation.x = s
    if (body.current) body.current.position.y = Math.abs(Math.cos(phase.current)) * 0.07 * (swing.current / 0.55 || 0)

    // footstep on each zero-crossing of the gait
    if (swing.current > 0.2 && prevSin.current !== 0 && Math.sign(sinp) !== Math.sign(prevSin.current)) {
      journeyAudio.footstep()
    }
    prevSin.current = sinp

    // cinematic dolly-in when near a milestone
    const focusTarget = reducedMotion ? 0 : activeRef.index !== null ? 1 : 0
    focus.current = THREE.MathUtils.lerp(focus.current, focusTarget, dt * 3)
    const dolly = 8 - focus.current * 1.6
    const camH = 5 + focus.current * 0.7

    camTarget.set(
      g.position.x - Math.sin(heading.current) * dolly,
      g.position.y + camH,
      g.position.z - Math.cos(heading.current) * dolly
    )
    camera.position.lerp(camTarget, 1 - Math.pow(0.0015, dt))
    lookAt.set(g.position.x, g.position.y + 1.6, g.position.z)
    camera.lookAt(lookAt)

    // nearest milestone within trigger radius
    let nearest: number | null = null
    let best = TRIGGER_RADIUS
    for (let i = 0; i < JOURNEY.length; i++) {
      const p = positionFor(i)
      const d = Math.hypot(g.position.x - p[0], g.position.z - p[2])
      if (d < best) {
        best = d
        nearest = i
      }
    }
    if (nearest !== lastActive.current) {
      lastActive.current = nearest
      activeRef.index = nearest
      if (nearest !== null) journeyAudio.arrival()
      onActiveChange(nearest)
    }
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <group ref={body}>
        {CHARACTER_GLB_URL ? (
          <Suspense fallback={<ProceduralWalker legL={legL} legR={legR} armL={armL} armR={armR} />}>
            <CharacterModel moving={() => swing.current > 0.05} />
          </Suspense>
        ) : (
          <ProceduralWalker legL={legL} legR={legR} armL={armL} armR={armR} />
        )}
      </group>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// ---- Environment dressing ----

function CityScape() {
  const blocks = useMemo(() => {
    const arr: { pos: [number, number, number]; size: [number, number, number]; c: string }[] = []
    const palette = ['#0d1828', '#10233a', '#0b1420', '#0e1b2e']
    for (let i = 0; i < 28; i++) {
      const z = i * 5 - 6
      const h = 5 + ((i * 37) % 13)
      arr.push({ pos: [-13 - ((i * 13) % 6), h / 2, z], size: [3.2, h, 3.4], c: palette[i % palette.length] })
      const h2 = 5 + ((i * 53) % 15)
      arr.push({ pos: [13 + ((i * 7) % 6), h2 / 2, z + 2.5], size: [3.2, h2, 3.4], c: palette[(i + 1) % palette.length] })
    }
    return arr
  }, [])

  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.c} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  )
}

// emissive windows on the path-facing facades — bloom makes these glow
function Windows({ count }: { count: number }) {
  const cool = useMemo(() => new THREE.Color('#7fd1ff'), [])
  const warm = useMemo(() => new THREE.Color('#ffcf8a'), [])
  const data = useMemo(() => {
    const arr: { pos: [number, number, number]; color: THREE.Color }[] = []
    for (let i = 0; i < count; i++) {
      const left = i % 2 === 0
      const x = left ? -11.3 : 11.3
      const z = ((i * 9.7) % (PATH_END + 20)) - 6
      const y = 2 + ((i * 3) % 11)
      if ((i * 7) % 5 === 0) continue // some windows dark
      arr.push({ pos: [x, y, z], color: (i * 13) % 3 === 0 ? warm : cool })
    }
    return arr
  }, [count, cool, warm])

  return (
    <Instances limit={count} range={data.length}>
      <boxGeometry args={[0.12, 0.5, 0.7]} />
      <meshBasicMaterial toneMapped={false} />
      {data.map((w, i) => (
        <Instance key={i} position={w.pos} color={w.color} />
      ))}
    </Instances>
  )
}

// drifting light motes for atmosphere
function Motes({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 14 + 1
      pos[i * 3 + 2] = Math.random() * (PATH_END + 20) - 6
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  useFrame((state) => {
    if (ref.current && !reducedMotion) ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4
  })

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color="#9fd8ff" size={0.08} sizeAttenuation transparent opacity={0.6} depthWrite={false} toneMapped={false} />
    </points>
  )
}

function World({ lowPower, reducedMotion }: { lowPower: boolean; reducedMotion: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PATH_END / 2]}>
        <planeGeometry args={[400, PATH_END + 80]} />
        <meshStandardMaterial color="#070a10" roughness={1} />
      </mesh>
      {/* path: lower roughness + some metalness reads as a faint wet-street sheen under the lights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, PATH_END / 2]}>
        <planeGeometry args={[7, PATH_END + 30]} />
        <meshStandardMaterial color="#0c1320" emissive="#0ea5e9" emissiveIntensity={0.05} roughness={0.45} metalness={0.5} />
      </mesh>
      <gridHelper
        args={[PATH_END + 60, Math.round((PATH_END + 60) / 2), '#1c3e5e', '#0c1a2b']}
        position={[0, 0.02, PATH_END / 2]}
      />
      <CityScape />
      <Windows count={lowPower ? 90 : 200} />
      <Motes count={lowPower ? 70 : 160} reducedMotion={reducedMotion} />
    </group>
  )
}

// ---- Canvas root ----

export function CareerScene({
  onActiveChange,
  lowPower = false,
  reducedMotion = false,
}: {
  onActiveChange: (i: number | null) => void
  lowPower?: boolean
  reducedMotion?: boolean
}) {
  return (
    <Canvas
      dpr={[1, lowPower ? 1.4 : 1.8]}
      camera={{ position: [0, 5, -8], fov: 60, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#06060a']} />
      <fog attach="fog" args={['#06060a', 22, 72]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#1c2c48', '#05060a', 0.55]} />
      <directionalLight position={[12, 22, 6]} intensity={0.6} color="#cfe6ff" />

      <World lowPower={lowPower} reducedMotion={reducedMotion} />
      {JOURNEY.map((m, i) => (
        <Monument key={i} index={i} accent={m.accent} label={m.shortOrg} />
      ))}
      <Player onActiveChange={onActiveChange} reducedMotion={reducedMotion} />

      <EffectComposer multisampling={lowPower ? 0 : 4}>
        <Bloom
          intensity={lowPower ? 0.5 : 0.85}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
