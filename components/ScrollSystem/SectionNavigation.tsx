'use client'

import { useEffect } from 'react'

interface SectionNavigationProps {
  currentSection: number
  onSectionChange: (section: number) => void
  onScrollStart: () => void
  onScrollEnd: () => void
  onDirectionChange: (direction: 'up' | 'down' | null) => void
  onTransitionStart: (name: string) => void
  onTransitionEnd: () => void
  onTransitionProgress: (progress: number) => void
  onScrollPositionUpdate: (position: number) => void
}

export default function SectionNavigation({
  currentSection,
  onSectionChange,
  onScrollStart,
  onScrollEnd,
  onDirectionChange,
  onTransitionStart,
  onTransitionEnd,
  onTransitionProgress,
  onScrollPositionUpdate
}: SectionNavigationProps) {
  useEffect(() => {
    let isScrollingToSection = false
    let wheelTimeout: NodeJS.Timeout | undefined
    
    // Handle wheel events for section navigation
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault() // Prevent default scrolling
      
      if (isScrollingToSection) return
      
      // Clear any existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      
      // Determine scroll direction
      const isScrollingDown = e.deltaY > 0
      const isScrollingUp = e.deltaY < 0
      
      if (isScrollingDown || isScrollingUp) {
        navigateToSection(isScrollingDown ? 'down' : 'up')
      }
    }
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingToSection) return
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        navigateToSection('down')
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        navigateToSection('up')
      }
    }
    
    // Navigate to next or previous section
    const navigateToSection = (direction: 'up' | 'down') => {
      if (isScrollingToSection) return
      
      let targetSection = currentSection
      
      if (direction === 'down') {
        targetSection = Math.min(8, currentSection + 1)
      } else {
        targetSection = Math.max(1, currentSection - 1)
      }
      
      if (targetSection !== currentSection) {
        const transitionName = `section${currentSection}to${targetSection}`
        
        // Start transition animation
        onDirectionChange(direction)
        onTransitionStart(transitionName)
        onScrollStart()
        onTransitionProgress(0)
        isScrollingToSection = true
        
        // Animate transition progress
        const duration = 2000 // 2 seconds
        const startTime = performance.now()
        
        const animateTransition = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing function for smooth animation
          const easeInOutCubic = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          }
          
          const easedProgress = easeInOutCubic(progress)
          onTransitionProgress(easedProgress)
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition)
          } else {
            // Transition complete
            onSectionChange(targetSection)
            onScrollEnd()
            onTransitionEnd()
            isScrollingToSection = false
            
            // Update scroll position
            const targetScrollY = (targetSection - 1) * window.innerHeight
            onScrollPositionUpdate(targetScrollY)
            window.scrollTo(0, targetScrollY)
          }
        }
        
        requestAnimationFrame(animateTransition)
      }
    }
    
    // Update scroll position display
    const updateScrollPosition = () => {
      onScrollPositionUpdate(window.scrollY)
    }
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', updateScrollPosition)
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', updateScrollPosition)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [currentSection, onSectionChange, onScrollStart, onScrollEnd, onDirectionChange, onTransitionStart, onTransitionEnd, onTransitionProgress, onScrollPositionUpdate])

  return null // This component doesn't render anything directly
}
