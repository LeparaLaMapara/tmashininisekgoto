'use client'

// The anime look for the career journey: a painted sky with a glowing sun,
// big two tone cumulus clouds, a meadow of wind blown grass with wildflowers,
// drifting petals, and an ink outline pass over the whole frame.
//
// Everything here is instanced or a single full screen pass, so the extra
// detail costs a handful of draw calls, not thousands.

import { forwardRef, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Effect, EffectAttribute, BlendFunction } from 'postprocessing'

/** Where the painted sun sits. Low and ahead of the walker, golden hour. */
export const SUN_DIR = new THREE.Vector3(0.45, 0.32, 1).normalize()

/** Small deterministic random, so the world is the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ---------------------------------------------------------------- sky

export function AnimeSky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new THREE.Color('#2f7fe0') },
          uMid: { value: new THREE.Color('#8cc8ff') },
          uHorizon: { value: new THREE.Color('#fff0d4') },
          uSea: { value: new THREE.Color('#9fd6ee') },
          uSun: { value: new THREE.Color('#ffe2a8') },
          uSunDir: { value: SUN_DIR },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz - cameraPosition);
            vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = p.xyww;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop, uMid, uHorizon, uSea, uSun, uSunDir;
          varying vec3 vDir;
          void main() {
            vec3 d = normalize(vDir);
            float h = d.y;
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.02, 0.22, h));
            col = mix(col, uTop, smoothstep(0.22, 0.85, h));
            if (h < 0.0) col = mix(uHorizon, uSea, smoothstep(0.0, -0.25, h));
            float s = max(dot(d, uSunDir), 0.0);
            // a crisp disc, a warm halo, and a wide golden wash
            col += uSun * (smoothstep(0.9993, 0.9996, s) * 1.6 + pow(s, 48.0) * 0.45 + pow(s, 6.0) * 0.18);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  // The dome follows the camera, so the sky never runs out along the path.
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ camera }) => {
    ref.current?.position.copy(camera.position)
  })
  return (
    <mesh ref={ref} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[450, 32, 16]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

// ---------------------------------------------------------------- clouds

const cloudMaterial = () =>
  new THREE.ShaderMaterial({
    fog: false,
    uniforms: {
      uLight: { value: new THREE.Color('#ffffff') },
      uShade: { value: new THREE.Color('#aab4e6') },
      uWarm: { value: new THREE.Color('#ffe7c4') },
      uSunDir: { value: SUN_DIR },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        mat4 m = modelMatrix * instanceMatrix;
        vN = normalize(mat3(m) * normal);
        vec4 w = m * vec4(position, 1.0);
        vView = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLight, uShade, uWarm, uSunDir;
      varying vec3 vN;
      varying vec3 vView;
      void main() {
        vec3 n = normalize(vN);
        // two tone cel shading: lit tops, lavender undersides
        float lit = step(0.05, dot(n, normalize(uSunDir + vec3(0.0, 0.9, 0.0))));
        vec3 col = mix(uShade, uLight, lit);
        // a warm rim where the sun catches the edge
        float rim = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.0);
        col = mix(col, uWarm, rim * 0.55);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })

function buildCloudInstances(count: number, seed: number, near: boolean) {
  const r = rng(seed)
  const puffs: THREE.Matrix4[] = []
  const tmp = new THREE.Object3D()
  for (let c = 0; c < count; c++) {
    let cx: number, cy: number, cz: number, size: number
    if (near) {
      cx = (r() - 0.5) * 140
      cy = 22 + r() * 16
      cz = -40 + r() * 260
      size = 3 + r() * 3
    } else {
      // a ring of towering cumulus along the horizon, the Ghibli backdrop
      const a = r() * Math.PI * 2
      const dist = 230 + r() * 90
      cx = Math.cos(a) * dist
      cz = 60 + Math.sin(a) * dist
      cy = 10 + r() * 30
      size = 14 + r() * 18
    }
    const n = near ? 6 : 11
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      // wide flat base, taller billows toward the middle
      const bx = (t - 0.5) * size * 2.6 + (r() - 0.5) * size * 0.6
      const by = Math.sin(t * Math.PI) * size * (near ? 0.5 : 0.9) + r() * size * 0.3
      const bz = (r() - 0.5) * size * 0.8
      const s = size * (0.55 + Math.sin(t * Math.PI) * 0.55 + r() * 0.2)
      tmp.position.set(cx + bx, cy + by, cz + bz)
      tmp.scale.set(s, s * 0.85, s)
      tmp.updateMatrix()
      puffs.push(tmp.matrix.clone())
    }
  }
  return puffs
}

function CloudLayer({ count, seed, near, drift }: { count: number; seed: number; near: boolean; drift: boolean }) {
  const mat = useMemo(cloudMaterial, [])
  const matrices = useMemo(() => buildCloudInstances(count, seed, near), [count, seed, near])
  const group = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (drift && group.current) group.current.position.x = Math.sin(clock.elapsedTime * 0.02) * 25
  })
  return (
    <group ref={group}>
      <instancedMesh
        ref={(m) => {
          if (m) {
            matrices.forEach((mx, i) => m.setMatrixAt(i, mx))
            m.instanceMatrix.needsUpdate = true
          }
        }}
        args={[undefined, undefined, matrices.length]}
        frustumCulled={false}
      >
        <icosahedronGeometry args={[1, 2]} />
        <primitive object={mat} attach="material" />
      </instancedMesh>
    </group>
  )
}

export function AnimeClouds({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <CloudLayer count={16} seed={7} near={false} drift={false} />
      <CloudLayer count={10} seed={21} near drift={!reducedMotion} />
    </group>
  )
}

// ---------------------------------------------------------------- meadow

export function Meadow({
  count,
  length,
  reducedMotion,
}: {
  count: number
  /** z extent of the island */
  length: number
  reducedMotion: boolean
}) {
  const { geometry, material, matrices } = useMemo(() => {
    // one tapered blade, bent a little, pivot at its root
    const g = new THREE.PlaneGeometry(0.12, 0.75, 1, 4)
    g.translate(0, 0.375, 0)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      const t = y / 0.75
      pos.setX(i, pos.getX(i) * (1 - t * 0.85))
      pos.setZ(i, t * t * 0.12)
    }
    g.computeVertexNormals()

    const m = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      fog: true,
      uniforms: {
        ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
        uTime: { value: 0 },
        uBase: { value: new THREE.Color('#2f7a3a') },
        uTipA: { value: new THREE.Color('#9be06a') },
        uTipB: { value: new THREE.Color('#d8f28a') },
        uWind: { value: reducedMotion ? 0 : 1 },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uWind;
        varying float vH;
        varying vec3 vWorld;
        #include <fog_pars_vertex>
        void main() {
          vH = uv.y;
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          float gust = sin(uTime * 1.3 + world.x * 0.18 + world.z * 0.22);
          float flutter = sin(uTime * 3.1 + world.z * 0.9 + world.x * 0.7) * 0.35;
          float bend = (gust * 0.7 + flutter) * vH * vH * uWind;
          world.x += bend * 0.22;
          world.z += bend * 0.1;
          vWorld = world.xyz;
          vec4 mvPosition = viewMatrix * world;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uBase, uTipA, uTipB;
        varying float vH;
        varying vec3 vWorld;
        #include <fog_pars_fragment>
        void main() {
          // big soft patches of lighter and darker grass, like brush strokes
          float patchy = sin(vWorld.x * 0.21) * sin(vWorld.z * 0.13) * 0.5 + 0.5;
          vec3 tip = mix(uTipA, uTipB, patchy);
          vec3 col = mix(uBase, tip, smoothstep(0.05, 1.0, vH));
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }
      `,
    })

    const r = rng(42)
    const tmp = new THREE.Object3D()
    const mats: THREE.Matrix4[] = []
    let guard = 0
    while (mats.length < count && guard++ < count * 4) {
      const x = (r() - 0.5) * 23
      if (Math.abs(x) < 3.7) continue // keep the sandy path clear
      const z = -28 + r() * (length + 56)
      tmp.position.set(x, 0, z)
      tmp.rotation.set(0, r() * Math.PI * 2, 0)
      const s = 0.7 + r() * 0.8
      tmp.scale.set(s, s * (0.8 + r() * 0.6), s)
      tmp.updateMatrix()
      mats.push(tmp.matrix.clone())
    }
    return { geometry: g, material: m, matrices: mats }
  }, [count, length, reducedMotion])

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group>
      <instancedMesh
        ref={(m) => {
          if (!m) return
          matrices.forEach((mx, i) => m.setMatrixAt(i, mx))
          m.instanceMatrix.needsUpdate = true
          m.computeBoundingSphere()
        }}
        args={[geometry, material, matrices.length]}
      />
      <Wildflowers count={Math.round(count / 18)} length={length} />
    </group>
  )
}

function Wildflowers({ count, length }: { count: number; length: number }) {
  const { matrices, colors } = useMemo(() => {
    const r = rng(99)
    const palette = ['#ffffff', '#fff3a3', '#ffb3cf', '#c9b6ff', '#ffd08a'].map((c) => new THREE.Color(c))
    const tmp = new THREE.Object3D()
    const mats: THREE.Matrix4[] = []
    const cols: THREE.Color[] = []
    while (mats.length < count) {
      const x = (r() - 0.5) * 22.5
      if (Math.abs(x) < 3.9) continue
      // flowers grow in little clumps
      const z = -26 + r() * (length + 52)
      const clump = palette[Math.floor(r() * palette.length)]
      for (let k = 0; k < 4 && mats.length < count; k++) {
        tmp.position.set(x + (r() - 0.5) * 0.8, 0.45 + r() * 0.25, z + (r() - 0.5) * 0.8)
        const s = 0.06 + r() * 0.05
        tmp.scale.set(s, s * 0.7, s)
        tmp.updateMatrix()
        mats.push(tmp.matrix.clone())
        cols.push(clump)
      }
    }
    return { matrices: mats, colors: cols }
  }, [count, length])
  return (
    <instancedMesh
      ref={(m) => {
        if (!m) return
        matrices.forEach((mx, i) => {
          m.setMatrixAt(i, mx)
          m.setColorAt(i, colors[i])
        })
        m.instanceMatrix.needsUpdate = true
        if (m.instanceColor) m.instanceColor.needsUpdate = true
        m.computeBoundingSphere()
      }}
      args={[undefined, undefined, matrices.length]}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------- petals

export function Petals({ follow, count }: { follow: { x: number; z: number }; count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const seeds = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: count }, () => ({
      x: (r() - 0.5) * 34,
      y: r() * 12,
      z: (r() - 0.5) * 40,
      speed: 0.35 + r() * 0.4,
      spin: 0.8 + r() * 2,
      phase: r() * Math.PI * 2,
      pink: r() < 0.7,
    }))
  }, [count])
  const tmp = useMemo(() => new THREE.Object3D(), [])
  const colored = useRef(false)
  useFrame(({ clock }, dt) => {
    const m = mesh.current
    if (!m) return
    const t = clock.elapsedTime
    seeds.forEach((p, i) => {
      p.y -= p.speed * dt
      p.x += Math.sin(t * 0.7 + p.phase) * 0.6 * dt + 0.25 * dt
      if (p.y < 0) p.y += 12
      // keep petals in a box that travels with the walker
      const rx = p.x - follow.x
      const rz = p.z - (follow.z + 8)
      if (rx > 17) p.x -= 34
      if (rx < -17) p.x += 34
      if (rz > 20) p.z -= 40
      if (rz < -20) p.z += 40
      tmp.position.set(p.x, p.y + 0.3, p.z)
      tmp.rotation.set(t * p.spin + p.phase, t * p.spin * 0.7, p.phase)
      tmp.scale.setScalar(0.09)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
    })
    m.instanceMatrix.needsUpdate = true
    if (!colored.current) {
      const pink = new THREE.Color('#ffc4dc')
      const white = new THREE.Color('#fffaf2')
      seeds.forEach((p, i) => m.setColorAt(i, p.pink ? pink : white))
      if (m.instanceColor) m.instanceColor.needsUpdate = true
      colored.current = true
    }
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <circleGeometry args={[1, 5]} />
      {/* no depth write: petals stay out of the ink pass, so they read as petals, not specks */}
      <meshBasicMaterial side={THREE.DoubleSide} depthWrite={false} />
    </instancedMesh>
  )
}

// ---------------------------------------------------------------- shoreline

export function Shoreline({ length }: { length: number }) {
  const foam = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(({ clock }) => {
    const o = 0.55 + Math.sin(clock.elapsedTime * 1.4) * 0.25
    foam.current.forEach((m) => m && (m.opacity = o))
  })
  return (
    <group>
      {[-1, 1].map((side, k) => (
        <group key={side}>
          {/* a strip of beach, then shallow turquoise water, then a line of foam */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * 12.9, 0.005, length / 2]} receiveShadow>
            <planeGeometry args={[1.8, length + 60]} />
            <meshToonMaterial color="#f1dfaa" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * 17.5, -0.28, length / 2]}>
            <planeGeometry args={[7.5, length + 90]} />
            <meshBasicMaterial color="#6fd6e8" transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[side * 14.05, -0.02, length / 2]}>
            <planeGeometry args={[0.55, length + 60]} />
            <meshBasicMaterial
              ref={(m) => {
                if (m) foam.current[k] = m
              }}
              color="#ffffff"
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------- ink outline pass

const inkFragment = /* glsl */ `
  uniform vec3 uInk;
  uniform float uThickness;
  uniform float uStrength;
  uniform float uFadeNear;
  uniform float uFadeFar;

  float viewDepth(const in vec2 uv) {
    return -getViewZ(readDepth(uv));
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    vec2 o = texelSize * uThickness;
    float c = -getViewZ(depth);
    float l = viewDepth(uv - vec2(o.x, 0.0));
    float r = viewDepth(uv + vec2(o.x, 0.0));
    float u = viewDepth(uv + vec2(0.0, o.y));
    float d = viewDepth(uv - vec2(0.0, o.y));
    // second derivative of depth: zero on flat surfaces, large at silhouettes
    float lap = abs(l + r + u + d - 4.0 * c) / max(c, 1.0);
    float edge = smoothstep(0.07, 0.22, lap);
    // lines thin out with distance, like a painter's lighter hand in the background
    edge *= 1.0 - smoothstep(uFadeNear, uFadeFar, c);
    // ink backs off on bright things (gold coins, glowing gems), so small
    // shiny objects keep their colour instead of turning into dark marks
    float lum = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
    edge *= 1.0 - smoothstep(0.62, 0.9, lum) * 0.8;
    outputColor = vec4(mix(inputColor.rgb, uInk, edge * uStrength), inputColor.a);
  }
`

class InkOutlineEffect extends Effect {
  constructor({ color = '#1c1f33', thickness = 1.6, strength = 0.9 } = {}) {
    super('InkOutline', inkFragment, {
      attributes: EffectAttribute.DEPTH,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ['uInk', new THREE.Uniform(new THREE.Color(color))],
        ['uThickness', new THREE.Uniform(thickness)],
        ['uStrength', new THREE.Uniform(strength)],
        ['uFadeNear', new THREE.Uniform(35)],
        ['uFadeFar', new THREE.Uniform(110)],
      ]),
    })
  }
}

export const InkOutline = forwardRef<InkOutlineEffect, { color?: string; thickness?: number; strength?: number }>(
  function InkOutline({ color, thickness, strength }, ref) {
    const effect = useMemo(() => new InkOutlineEffect({ color, thickness, strength }), [color, thickness, strength])
    return <primitive ref={ref} object={effect} dispose={null} />
  },
)
