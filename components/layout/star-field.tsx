'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const STAR_COUNT = 80
const MIN_SIZE = 0.5
const MAX_SIZE = 2

interface Star {
  x: number
  y: number
  size: number
  baseOpacity: number
  phase: number
  speed: number
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pathname = usePathname()

  // Don't render on homepage (it has its own neural hero)
  if (pathname === '/') return null

  return <StarFieldCanvas canvasRef={canvasRef} />
}

function StarFieldCanvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}) {
  const starsRef = useRef<Star[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize stars
    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE),
      baseOpacity: 0.03 + Math.random() * 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,
    }))

    function animate(time: number) {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      const isDark = document.documentElement.classList.contains('dark')

      for (const star of starsRef.current) {
        // Gentle pulsing with sin wave
        const pulse = Math.sin(time * 0.001 * star.speed + star.phase)
        const opacity = star.baseOpacity + pulse * star.baseOpacity * 0.6

        if (isDark) {
          ctx!.fillStyle = `rgba(250, 244, 232, ${opacity})`
        } else {
          ctx!.fillStyle = `rgba(17, 17, 24, ${opacity * 0.5})`
        }

        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx!.fill()
      }

      // Draw faint connections between nearby stars
      for (let i = 0; i < starsRef.current.length; i++) {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const a = starsRef.current[i]
          const b = starsRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const lineOpacity = (1 - dist / 150) * (isDark ? 0.04 : 0.02)
            ctx!.strokeStyle = `rgba(14, 165, 233, ${lineOpacity})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.stroke()
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [canvasRef])

  // Re-scatter on resize
  useEffect(() => {
    function handleResize() {
      const canvas = canvasRef.current
      if (!canvas) return
      for (const star of starsRef.current) {
        star.x = Math.random() * canvas.width
        star.y = Math.random() * canvas.height
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
