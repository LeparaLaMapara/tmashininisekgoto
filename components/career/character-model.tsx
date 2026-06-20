'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import type { AnimationAction } from 'three'

// ---------------------------------------------------------------------------
// Drop-in slot for a real character model (e.g. a Mixamo / Meshy / Tripo export).
//
//   1. Get a RIGGED .glb (a skeleton + an idle + a walk clip). The 2D concept
//      renders are not enough — export the actual 3D file from the tool, after
//      rigging + adding "Idle" and "Walking" animations.
//   2. Put the file at:  public/models/character.glb
//   3. Set CHARACTER_GLB_URL = '/models/character.glb' below.
//   4. Tune MODEL_SCALE / MODEL_Y so the feet sit on the path, and MODEL_FACING
//      if the model faces the wrong way.
//
// Clip names are auto-detected (walk/run vs idle/stand), with sensible
// fallbacks, so generic names like "mixamo.com" still work.
//
// While CHARACTER_GLB_URL is null the scene uses the procedural walker, so
// nothing here runs and no asset is required.
// ---------------------------------------------------------------------------

export const CHARACTER_GLB_URL: string | null = null
const MODEL_SCALE = 1
const MODEL_Y = 0
const MODEL_FACING = 0 // radians; set to Math.PI if the model walks backwards

function pick(
  actions: Record<string, AnimationAction | null>,
  match: RegExp,
  avoid?: RegExp
): AnimationAction | null {
  const keys = Object.keys(actions)
  const hit = keys.find((k) => match.test(k) && (!avoid || !avoid.test(k)))
  return hit ? actions[hit] : null
}

export function CharacterModel({ moving }: { moving: () => boolean }) {
  const url = CHARACTER_GLB_URL as string
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)
  const current = useRef<AnimationAction | null>(null)

  // resolve idle / walk actions once, with heuristics + fallbacks
  const { idle, walk } = useMemo(() => {
    const all = Object.values(actions).filter(Boolean) as AnimationAction[]
    const walkA = pick(actions, /walk|run|move/i) ?? all[1] ?? all[0] ?? null
    const idleA = pick(actions, /idle|stand|tpose|t-pose|rest/i, /walk|run/i) ?? all[0] ?? walkA
    return { idle: idleA, walk: walkA }
  }, [actions])

  useEffect(() => {
    if (!idle) return
    idle.reset().fadeIn(0.2).play()
    current.current = idle
    return () => {
      Object.values(actions).forEach((a) => a?.stop())
    }
  }, [idle, actions])

  useFrame(() => {
    const want = moving() ? walk : idle
    if (!want || want === current.current) return
    current.current?.fadeOut(0.2)
    want.reset().fadeIn(0.2).play()
    current.current = want
  })

  return (
    <group ref={group} position={[0, MODEL_Y, 0]} rotation={[0, MODEL_FACING, 0]} scale={MODEL_SCALE}>
      <primitive object={scene} />
    </group>
  )
}

if (CHARACTER_GLB_URL) {
  useGLTF.preload(CHARACTER_GLB_URL)
}
