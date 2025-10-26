'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSectionVisit } from './SectionVisitContext'

interface SimpleTextAnimationProps {
  text: string
  delay?: number
  className?: string
  onComplete?: () => void
  sectionNumber?: number
  currentSection?: number
  isVisible?: boolean
  onAnimationComplete?: () => void
}

export default function SimpleTextAnimation({ 
  text, 
  delay = 0, 
  className = '',
  onComplete,
  sectionNumber,
  onAnimationComplete,
  currentSection,
  isVisible
}: SimpleTextAnimationProps) {
  
  const [isComplete, setIsComplete] = useState(false)
  const { hasTypingAnimated, markTypingAnimated } = useSectionVisit()
  
  // Check if this section is currently visible
  const isSectionVisible = useMemo(() => {
    if (isVisible !== undefined) return isVisible
    if (currentSection !== undefined && sectionNumber !== undefined) {
      return currentSection === sectionNumber
    }
    return true // Default to visible if no visibility props provided
  }, [isVisible, currentSection, sectionNumber])

  // Use global state if sectionNumber is provided, otherwise fall back to local behavior
  const hasAnimated = useMemo(() => {
    if (sectionNumber) {
      return hasTypingAnimated(sectionNumber)
    }
    return false
  }, [sectionNumber, hasTypingAnimated])

  useEffect(() => {
    if (!text) return

    // Reset state when text changes
    setIsComplete(false)

    // If already animated, show the text immediately
    if (hasAnimated) {
      setIsComplete(true)
      onComplete?.()
      onAnimationComplete?.()
      return
    }

    // Only start animation if section is visible
    if (!isSectionVisible) {
      return
    }

    // Start animation after delay
    const timer = setTimeout(() => {
      setIsComplete(true)
      onComplete?.()
      onAnimationComplete?.()
      // Mark as animated in global state if sectionNumber is provided
      if (sectionNumber) {
        markTypingAnimated(sectionNumber)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay, hasAnimated, sectionNumber, isSectionVisible, onComplete, onAnimationComplete, markTypingAnimated])

  return (
    <span 
      className={`${className} transition-opacity duration-500 ${
        isComplete ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {text}
    </span>
  )
}
