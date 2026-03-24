'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// --- Neural Network 3D Scene ---

function NeuralNodes() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const count = 50
  const connectionDistance = 2.5

  // Generate random node positions
  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6
        )
      )
    }
    return pos
  }, [])

  // Base velocities for gentle drift
  const velocities = useMemo(() => {
    return positions.map(() =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      )
    )
  }, [positions])

  // Track mouse
  const { viewport } = useThree()
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: ((e.clientX / window.innerWidth) * 2 - 1) * viewport.width * 0.3,
        y: (-(e.clientY / window.innerHeight) * 2 + 1) * viewport.height * 0.3,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [viewport])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color('#0ea5e9'), [])

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return
    const time = state.clock.elapsedTime

    // Update node positions
    for (let i = 0; i < count; i++) {
      positions[i].add(velocities[i])

      // Soft boundary bounce
      ;['x', 'y', 'z'].forEach((axis) => {
        const limit = axis === 'z' ? 3 : axis === 'y' ? 4 : 5
        const a = axis as 'x' | 'y' | 'z'
        if (Math.abs(positions[i][a]) > limit) {
          velocities[i][a] *= -1
        }
      })

      // Mouse influence (gentle attraction)
      const dx = mouseRef.current.x - positions[i].x
      const dy = mouseRef.current.y - positions[i].y
      positions[i].x += dx * 0.0005
      positions[i].y += dy * 0.0005

      // Subtle breathing
      const scale = 0.03 + Math.sin(time * 0.5 + i) * 0.01
      dummy.position.copy(positions[i])
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true

    // Update connections
    const linePositions: number[] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = positions[i].distanceTo(positions[j])
        if (dist < connectionDistance) {
          linePositions.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          )
        }
      }
    }
    const lineGeom = linesRef.current.geometry
    lineGeom.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
    lineGeom.attributes.position.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </instancedMesh>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#0ea5e9" transparent opacity={0.08} />
      </lineSegments>
    </>
  )
}

// --- CSS Fallback for mobile ---
function MobileFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-synapse/20 animate-pulse"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}

// --- Main Component ---
export function NeuralHero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="absolute inset-0 -z-10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/0 via-void/50 to-void z-10 pointer-events-none" />

      {isMobile ? (
        <MobileFallback />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 7], fov: 60 }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <NeuralNodes />
        </Canvas>
      )}
    </div>
  )
}
