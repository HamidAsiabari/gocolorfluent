'use client'

import { useEffect, useState } from 'react'

interface ScrollManagerProps {
  currentSection: number
  setCurrentSection: (section: number) => void
  setIsScrolling: (scrolling: boolean) => void
  setScrollDirection: (direction: 'up' | 'down' | null) => void
  setTransitionName: (name: string | null) => void
  setIsTransitioning: (transitioning: boolean) => void
  setTransitionProgress: (progress: number) => void
  setScrollPosition: (position: number) => void
  isClient: boolean
  setIsClient: (client: boolean) => void
}

export default function ScrollManager({
  currentSection,
  setCurrentSection,
  setIsScrolling,
  setScrollDirection,
  setTransitionName,
  setIsTransitioning,
  setTransitionProgress,
  setScrollPosition,
  isClient,
  setIsClient
}: ScrollManagerProps) {
  useEffect(() => {
    setIsClient(true)
    
    let isScrollingToSection = false
    let wheelTimeout: NodeJS.Timeout | undefined
    
    // Lock scroll position to current section
    const lockScrollPosition = () => {
      const windowHeight = window.innerHeight
      const targetScrollY = (currentSection - 1) * windowHeight
      window.scrollTo(0, targetScrollY)
      setScrollPosition(targetScrollY)
    }
    
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
        setScrollDirection(direction)
        setTransitionName(transitionName)
        setIsScrolling(true)
        setIsTransitioning(true)
        setTransitionProgress(0)
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
          setTransitionProgress(easedProgress)
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition)
          } else {
            // Transition complete
            setCurrentSection(targetSection)
            setIsScrolling(false)
            setIsTransitioning(false)
            setTransitionProgress(0)
            isScrollingToSection = false
            setTransitionName(null)
            
            // Update scroll position
            const targetScrollY = (targetSection - 1) * window.innerHeight
            setScrollPosition(targetScrollY)
            window.scrollTo(0, targetScrollY)
          }
        }
        
        requestAnimationFrame(animateTransition)
      }
    }
    
    // Update scroll position display
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY)
    }
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', updateScrollPosition)
    
    // Lock initial scroll position
    lockScrollPosition()
    
    // Lock scroll position on resize
    const handleResize = () => {
      lockScrollPosition()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', updateScrollPosition)
      window.removeEventListener('resize', handleResize)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [currentSection, setCurrentSection, setIsScrolling, setScrollDirection, setTransitionName, setIsTransitioning, setTransitionProgress, setScrollPosition, setIsClient])

  // Initialize scroll position on mount
  useEffect(() => {
    if (isClient) {
      const windowHeight = window.innerHeight
      const initialScrollY = (currentSection - 1) * windowHeight
      window.scrollTo(0, initialScrollY)
      setScrollPosition(initialScrollY)
    }
  }, [isClient, currentSection, setScrollPosition])

  // Smooth scroll function
  const smoothScrollTo = (targetY: number, duration: number) => {
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()
    
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      const currentY = startY + distance * easedProgress
      window.scrollTo(0, currentY)
      
      // Update scroll position state during animation
      setScrollPosition(currentY)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }

  return null // This component doesn't render anything directly
}
