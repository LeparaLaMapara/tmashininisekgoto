'use client'

import { useEffect, useState } from 'react'
import { TYPEWRITER_ROLES } from '@/lib/data'

export function HeroTypewriter() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = TYPEWRITER_ROLES[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1))
        }, 60)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 30)
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % TYPEWRITER_ROLES.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex])

  return (
    <span className="font-mono text-lg sm:text-xl text-synapse">
      {displayText}
      <span className="animate-pulse text-synapse/60">|</span>
    </span>
  )
}
