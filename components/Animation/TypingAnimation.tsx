'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useSectionVisit } from './SectionVisitContext'

interface TypingAnimationProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
  sectionNumber?: number
  onAnimationComplete?: () => void
  currentSection?: number
  isVisible?: boolean
}

export default function TypingAnimation({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '',
  onComplete,
  sectionNumber,
  onAnimationComplete,
  currentSection,
  isVisible
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const { hasTypingAnimated, markTypingAnimated } = useSectionVisit()
  
  // Use refs to store the latest callback functions to avoid dependency issues
  const onCompleteRef = useRef(onComplete)
  const onAnimationCompleteRef = useRef(onAnimationComplete)
  
  // Update refs when props change
  useEffect(() => {
    onCompleteRef.current = onComplete
    onAnimationCompleteRef.current = onAnimationComplete
  })

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
    const result = sectionNumber ? hasTypingAnimated(sectionNumber) : false
    return result
  }, [sectionNumber, hasTypingAnimated, text, isSectionVisible])

  useEffect(() => {
    if (!text) return

    // Reset state when text changes
    setDisplayedText('')
    setIsComplete(false)

    // If already animated, show the text immediately
    if (hasAnimated) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    // Only start animation if section is visible
    if (!isSectionVisible) {
      return
    }

    // Start animation after delay
    const timer = setTimeout(() => {
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(interval)
          setIsComplete(true)
          onCompleteRef.current?.()
          onAnimationCompleteRef.current?.()
          // Mark as animated in global state if sectionNumber is provided
          if (sectionNumber) {
            markTypingAnimated(sectionNumber)
          }
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, speed, delay, hasAnimated, sectionNumber, isSectionVisible])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}
