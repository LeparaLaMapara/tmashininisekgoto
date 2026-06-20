'use client'

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, AdaptiveDpr } from '@react-three/drei'
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

// shared refs written by Player each frame, read elsewhere (no React churn)
const activeRef: { index: number | null } = { index: null }
const playerState = { x: 0, z: 0 }

// stepped luminance ramp -> cel-shaded look on MeshToonMaterial
function makeToonGradient(steps: number) {
  const data = new Uint8Array(steps)
  for (let i = 0; i < steps; i++) data[i] = Math.round((i / (steps - 1)) * 255)
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat)
  tex.needsUpdate = true
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  return tex
}
const toonGradient = makeToonGradient(4)

export function positionFor(i: number): [number, number, number] {
  const side = i % 2 === 0 ? -1 : 1
  return [side * 4.2, 0, i * SPACING + 8]
}

// ---- Milestone monument: a wooden signpost with a floating "log pose" gem ----

function Monument({ index, accent, label }: { index: number; accent: string; label: string }) {
  const hex = ACCENT_HEX[accent] ?? ACCENT_HEX.synapse
  const crystal = useRef<THREE.Mesh>(null)
  const crystalMat = useRef<THREE.MeshStandardMaterial>(null)
  const padMat = useRef<THREE.MeshStandardMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  const ring = useRef<THREE.Mesh>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const prevActive = useRef(false)
  const pulse = useRef(1)
  const pos = positionFor(index)

  useFrame((state, dt) => {
    const active = activeRef.index === index
    const t = Math.min(dt, 0.05)
    if (crystal.current) {
      crystal.current.rotation.y += t * 0.8
      crystal.current.position.y = 3.2 + Math.sin(state.clock.elapsedTime * 1.4 + index) * 0.16
    }
    const lerp = (m: THREE.MeshStandardMaterial | null, target: number) => {
      if (m) m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, target, t * 6)
    }
    lerp(crystalMat.current, active ? 2.6 : 1.2)
    lerp(padMat.current, active ? 0.8 : 0.2)
    if (light.current) light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, active ? 5 : 1.2, t * 6)

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
      {/* signpost */}
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 2.2, 6]} />
        <meshToonMaterial color="#8a5a2b" gradientMap={toonGradient} />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0]}>
        <boxGeometry args={[1.5, 0.62, 0.14]} />
        <meshToonMaterial color="#b5793b" gradientMap={toonGradient} />
      </mesh>
      {/* floating gem */}
      <mesh ref={crystal} position={[0, 3.2, 0]} castShadow>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial ref={crystalMat} color={hex} emissive={hex} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* glow pad on the grass */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 36]} />
        <meshStandardMaterial ref={padMat} color={hex} emissive={hex} emissiveIntensity={0.2} transparent opacity={0.32} toneMapped={false} />
      </mesh>
      {/* arrival ring */}
      <mesh ref={ring} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.95, 48]} />
        <meshBasicMaterial ref={ringMat} color={hex} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight ref={light} position={[0, 3, 0]} color={hex} intensity={1.2} distance={10} />
      <Html position={[0, 4.2, 0]} center distanceFactor={15} zIndexRange={[10, 0]}>
        <div
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.02em',
            color: '#ffffff',
            textShadow: '0 1px 6px rgba(0,40,80,0.8)',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

// ---- Procedural cel-shaded character (fallback until a GLB is supplied) ----

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
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.7, 6, 12]} />
        <meshToonMaterial color="#2b5e9e" gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.3, 18, 18]} />
        <meshToonMaterial color="#c68642" gradientMap={toonGradient} />
      </mesh>
      <mesh position={[0, 1.3, -0.32]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.26]} />
        <meshToonMaterial color="#22b8cf" gradientMap={toonGradient} />
      </mesh>
      <group ref={armL} position={[0.42, 1.6, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.16, 0.8, 0.16]} />
          <meshToonMaterial color="#2b5e9e" gradientMap={toonGradient} />
        </mesh>
      </group>
      <group ref={armR} position={[-0.42, 1.6, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.16, 0.8, 0.16]} />
          <meshToonMaterial color="#2b5e9e" gradientMap={toonGradient} />
        </mesh>
      </group>
      <group ref={legL} position={[0.17, 0.92, 0]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshToonMaterial color="#3a4252" gradientMap={toonGradient} />
        </mesh>
      </group>
      <group ref={legR} position={[-0.17, 0.92, 0]}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
          <meshToonMaterial color="#3a4252" gradientMap={toonGradient} />
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
    const dt = Math.min(rawDt, 0.05)

    const manual = input.forward !== 0 || input.turn !== 0
    if (manual && nav.target !== null) nav.target = null

    let moving = false

    if (nav.target !== null) {
      const p = positionFor(nav.target)
      const dx = p[0] - g.position.x
      const dz = p[2] - g.position.z
      const dist = Math.hypot(dx, dz)
      if (dist > 0.9) {
        const targetH = Math.atan2(dx, dz)
        let d = targetH - heading.current
        d = Math.atan2(Math.sin(d), Math.cos(d))
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
    playerState.x = g.position.x
    playerState.z = g.position.z

    swing.current = THREE.MathUtils.lerp(swing.current, moving ? 0.55 : 0, dt * 8)
    const sinp = Math.sin(phase.current)
    const s = sinp * swing.current
    if (legL.current) legL.current.rotation.x = s
    if (legR.current) legR.current.rotation.x = -s
    if (armL.current) armL.current.rotation.x = -s
    if (armR.current) armR.current.rotation.x = s
    if (body.current) body.current.position.y = Math.abs(Math.cos(phase.current)) * 0.07 * (swing.current / 0.55 || 0)

    if (swing.current > 0.2 && prevSin.current !== 0 && Math.sign(sinp) !== Math.sign(prevSin.current)) {
      journeyAudio.footstep()
    }
    prevSin.current = sinp

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
    </group>
  )
}

// ---- Sun that follows the player so shadows stay crisp along the long path ----

function SunLight({ shadows }: { shadows: boolean }) {
  const ref = useRef<THREE.DirectionalLight>(null)
  useFrame(() => {
    const l = ref.current
    if (!l) return
    l.position.set(playerState.x + 16, 28, playerState.z + 12)
    l.target.position.set(playerState.x, 0, playerState.z)
    l.target.updateMatrixWorld()
  })
  return (
    <directionalLight
      ref={ref}
      castShadow={shadows}
      intensity={1.3}
      color="#fff3d6"
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-camera-near={1}
      shadow-camera-far={70}
      shadow-camera-left={-22}
      shadow-camera-right={22}
      shadow-camera-top={22}
      shadow-camera-bottom={-22}
      shadow-bias={-0.0004}
    />
  )
}

// ---- Sky dome (vertical gradient, ignores fog) ----

function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new THREE.Color('#1f74e8') },
          bottom: { value: new THREE.Color('#d6ecff') },
          expo: { value: 0.55 },
        },
        vertexShader: `
          varying vec3 vWorld;
          void main() {
            vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 top; uniform vec3 bottom; uniform float expo;
          varying vec3 vWorld;
          void main() {
            float h = pow(max(normalize(vWorld).y, 0.0), expo);
            gl_FragColor = vec4(mix(bottom, top, h), 1.0);
          }
        `,
      }),
    []
  )
  return (
    <mesh>
      <sphereGeometry args={[400, 32, 16]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

// ---- Drifting low-poly clouds ----

function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const puffs = useMemo(
    () =>
      [
        [0, 0, 0, 1],
        [0.9, -0.1, 0.2, 0.75],
        [-0.9, -0.05, -0.1, 0.8],
        [0.3, 0.35, -0.2, 0.7],
        [-0.4, 0.3, 0.25, 0.65],
      ] as [number, number, number, number][],
    []
  )
  return (
    <group position={position} scale={scale}>
      {puffs.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} scale={[p[3] * 1.3, p[3], p[3]]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshToonMaterial color="#ffffff" gradientMap={toonGradient} />
        </mesh>
      ))}
    </group>
  )
}

function Clouds() {
  const ref = useRef<THREE.Group>(null)
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 9; i++) {
      arr.push({
        pos: [(i * 17) % 70 - 35, 16 + ((i * 5) % 8), i * 13 - 8],
        scale: 2.5 + ((i * 7) % 4),
      })
    }
    return arr
  }, [])
  useFrame((state) => {
    if (ref.current) {
      const drift = (state.clock.elapsedTime * 0.4) % 90
      ref.current.position.x = drift
    }
  })
  return (
    <group ref={ref}>
      {clouds.map((c, i) => (
        <Cloud key={i} position={c.pos} scale={c.scale} />
      ))}
    </group>
  )
}

// ---- Palm trees + bushes ----

function PalmTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const fronds = useMemo(() => [0, 1, 2, 3, 4, 5], [])
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.5, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.16, 0.26, 3, 7]} />
        <meshToonMaterial color="#a9743f" gradientMap={toonGradient} />
      </mesh>
      {fronds.map((i) => {
        const a = (i / fronds.length) * Math.PI * 2
        return (
          <mesh
            key={i}
            castShadow
            position={[Math.cos(a) * 0.55, 3, Math.sin(a) * 0.55]}
            rotation={[0.6, -a, 0]}
          >
            <coneGeometry args={[0.45, 1.9, 4]} />
            <meshToonMaterial color="#2f9e44" gradientMap={toonGradient} />
          </mesh>
        )
      })}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshToonMaterial color="#2b8a3e" gradientMap={toonGradient} />
      </mesh>
    </group>
  )
}

function Foliage() {
  const palms = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 22; i++) {
      const left = i % 2 === 0
      const x = (left ? -1 : 1) * (7.5 + ((i * 7) % 4))
      const z = i * 6 - 6
      arr.push({ pos: [x, 0, z], scale: 0.8 + ((i * 13) % 5) * 0.12 })
    }
    return arr
  }, [])
  const bushes = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number; c: string }[] = []
    const greens = ['#37b24d', '#2f9e44', '#40c057']
    for (let i = 0; i < 30; i++) {
      const left = i % 2 === 0
      const x = (left ? -1 : 1) * (6 + ((i * 5) % 4))
      const z = i * 4.4 - 4
      arr.push({ pos: [x, 0.35, z], s: 0.5 + ((i * 11) % 4) * 0.18, c: greens[i % greens.length] })
    }
    return arr
  }, [])
  return (
    <group>
      {palms.map((p, i) => (
        <PalmTree key={i} position={p.pos} scale={p.scale} />
      ))}
      {bushes.map((b, i) => (
        <mesh key={i} castShadow position={b.pos} scale={[b.s * 1.3, b.s, b.s * 1.3]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshToonMaterial color={b.c} gradientMap={toonGradient} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Ocean ----

function Ocean() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) ref.current.position.y = -0.35 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05
  })
  return (
    <group ref={ref}>
      {[-1, 1].map((side) => (
        <mesh key={side} rotation={[-Math.PI / 2, 0, 0]} position={[side * 60, 0, PATH_END / 2]}>
          <planeGeometry args={[100, PATH_END + 120]} />
          <meshToonMaterial color="#1ca0e0" gradientMap={toonGradient} transparent opacity={0.92} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Rocks ----

function Rocks() {
  const rocks = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number; c: string }[] = []
    const greys = ['#7a8088', '#6b7177', '#868d95']
    for (let i = 0; i < 18; i++) {
      const left = i % 2 === 0
      // some on the grass edge, some just offshore in the water
      const shore = i % 3 === 0
      const x = (left ? -1 : 1) * (shore ? 11 + ((i * 3) % 4) : 8.5 + ((i * 5) % 3))
      const z = i * 7 - 4
      arr.push({ pos: [x, shore ? -0.2 : 0.1, z], s: 0.5 + ((i * 7) % 5) * 0.22, c: greys[i % greys.length] })
    }
    return arr
  }, [])
  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} castShadow position={r.pos} rotation={[i, i * 0.7, 0]} scale={[r.s * 1.2, r.s * 0.85, r.s]}>
          <icosahedronGeometry args={[1, 0]} />
          <meshToonMaterial color={r.c} gradientMap={toonGradient} />
        </mesh>
      ))}
    </group>
  )
}

// ---- Wooden dock reaching into the sea ----

function Dock({ z, side }: { z: number; side: 1 | -1 }) {
  const wood = '#9c6b35'
  const planks = useMemo(() => Array.from({ length: 7 }, (_, i) => i), [])
  return (
    <group position={[0, 0, z]}>
      {planks.map((i) => {
        const x = side * (8 + i * 1.1)
        return (
          <group key={i}>
            <mesh castShadow position={[x, 0.12, 0]}>
              <boxGeometry args={[1.05, 0.12, 2.4]} />
              <meshToonMaterial color={wood} gradientMap={toonGradient} />
            </mesh>
            {i % 2 === 0 && (
              <>
                <mesh castShadow position={[x, -0.5, 1]}>
                  <cylinderGeometry args={[0.1, 0.1, 1.4, 6]} />
                  <meshToonMaterial color="#6f4a22" gradientMap={toonGradient} />
                </mesh>
                <mesh castShadow position={[x, -0.5, -1]}>
                  <cylinderGeometry args={[0.1, 0.1, 1.4, 6]} />
                  <meshToonMaterial color="#6f4a22" gradientMap={toonGradient} />
                </mesh>
              </>
            )}
          </group>
        )
      })}
    </group>
  )
}

// ---- Small bobbing sailboat ----

function Boat({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.12
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
  })
  return (
    <group ref={ref} position={position} rotation={[0, -0.4, 0]} scale={1.4}>
      {/* hull */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.5, 2.6]} />
        <meshToonMaterial color="#8a5a2b" gradientMap={toonGradient} />
      </mesh>
      <mesh castShadow position={[0, 0.45, 1.45]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[1.2, 0.5, 0.6]} />
        <meshToonMaterial color="#8a5a2b" gradientMap={toonGradient} />
      </mesh>
      {/* mast */}
      <mesh castShadow position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2, 6]} />
        <meshToonMaterial color="#6f4a22" gradientMap={toonGradient} />
      </mesh>
      {/* sail */}
      <mesh position={[0.01, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.4, 1.6]} />
        <meshToonMaterial color="#fbf3e2" gradientMap={toonGradient} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// ---- Circling seagulls ----

function Seagulls({ count }: { count: number }) {
  const birds = useRef<THREE.Group[]>([])
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        radius: 14 + (i % 4) * 5,
        speed: 0.18 + (i % 3) * 0.05,
        height: 13 + (i % 5) * 1.5,
        offset: (i / count) * Math.PI * 2,
        center: i * 18 + 10,
      })),
    [count]
  )
  useFrame((state) => {
    const t = state.clock.elapsedTime
    birds.current.forEach((b, i) => {
      if (!b) return
      const d = data[i]
      const a = t * d.speed + d.offset
      b.position.set(Math.cos(a) * d.radius, d.height + Math.sin(t + i) * 0.5, d.center + Math.sin(a) * d.radius)
      b.rotation.y = -a
      const flap = Math.sin(t * 8 + i) * 0.5
      const wings = b.children as THREE.Mesh[]
      if (wings[0]) wings[0].rotation.z = 0.3 + flap
      if (wings[1]) wings[1].rotation.z = -0.3 - flap
    })
  })
  return (
    <group>
      {data.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) birds.current[i] = el
          }}
        >
          <mesh position={[0.35, 0, 0]}>
            <boxGeometry args={[0.7, 0.04, 0.18]} />
            <meshToonMaterial color="#f5f5f5" gradientMap={toonGradient} />
          </mesh>
          <mesh position={[-0.35, 0, 0]}>
            <boxGeometry args={[0.7, 0.04, 0.18]} />
            <meshToonMaterial color="#f5f5f5" gradientMap={toonGradient} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ---- World ----

function World({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <SkyDome />
      {!reducedMotion && <Clouds />}
      {reducedMotion && (
        <group>
          <Cloud position={[-20, 18, 20]} scale={3} />
          <Cloud position={[18, 20, 60]} scale={3.5} />
        </group>
      )}
      <Ocean />

      {/* grassy island trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, PATH_END / 2]} receiveShadow>
        <planeGeometry args={[24, PATH_END + 60]} />
        <meshToonMaterial color="#4fb04f" gradientMap={toonGradient} />
      </mesh>
      {/* sandy path down the middle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, PATH_END / 2]} receiveShadow>
        <planeGeometry args={[6.5, PATH_END + 40]} />
        <meshToonMaterial color="#e6cf94" gradientMap={toonGradient} />
      </mesh>

      <Foliage />
      <Rocks />
      <Dock z={SPACING * 3 + 8} side={1} />
      <Dock z={SPACING * 6 + 8} side={-1} />
      <Boat position={[22, 0, SPACING * 3 + 12]} />
      <Boat position={[-26, 0, SPACING * 7 + 6]} />
      {!reducedMotion && <Seagulls count={6} />}
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
  const shadows = !lowPower
  return (
    <Canvas
      shadows={shadows}
      dpr={[1, lowPower ? 1.4 : 1.8]}
      camera={{ position: [0, 5, -8], fov: 60, near: 0.1, far: 600 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <fog attach="fog" args={['#cfe7ff', 40, 170]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#bfe3ff', '#4a7a3a', 0.7]} />
      <SunLight shadows={shadows} />

      <World reducedMotion={reducedMotion} />
      {JOURNEY.map((m, i) => (
        <Monument key={i} index={i} accent={m.accent} label={m.shortOrg} />
      ))}
      <Player onActiveChange={onActiveChange} reducedMotion={reducedMotion} />

      <EffectComposer multisampling={lowPower ? 0 : 4}>
        <Bloom intensity={lowPower ? 0.3 : 0.45} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.4} />
      </EffectComposer>

      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
