'use client'

import { useEffect, useState, memo, useCallback, useRef } from 'react'

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

const ScrollManager = memo(function ScrollManager({
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
  // Use ref to track current section value to avoid stale closures
  const currentSectionRef = useRef(currentSection)
  const lastLockedYRef = useRef<number | null>(null)
  
  // Update ref when prop changes
  useEffect(() => {
    currentSectionRef.current = currentSection
  }, [currentSection])
  
  useEffect(() => {
    setIsClient(true)
    
    let isScrollingToSection = false
    let wheelTimeout: NodeJS.Timeout | undefined
    let touchStartY = 0
    let touchEndY = 0
    let touchStartTime = 0
    let touchEndTime = 0
    let isTouchScrolling = false
    let touchMoveCount = 0
    let lastTouchY = 0
    
    // Lock scroll position to current section
    const lockScrollPosition = () => {
      const windowHeight = window.innerHeight
      const targetScrollY = (currentSectionRef.current - 1) * windowHeight
      window.scrollTo(0, targetScrollY)
      // Avoid redundant store updates that cause re-renders
      if (lastLockedYRef.current !== targetScrollY) {
        lastLockedYRef.current = targetScrollY
        setScrollPosition(targetScrollY)
      }
    }
    
    // Handle scroll events to maintain section locking
    const handleScroll = (e: Event) => {
      // Aggressively lock scroll position on mobile to prevent free scrolling
      if (!isScrollingToSection) {
        e.preventDefault()
        lockScrollPosition()
      }
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
    
    // Helper function to check if element is interactive
    const isInteractiveElement = (target: HTMLElement | null): boolean => {
      if (!target) return false
      return !!(
        target.closest('video') || 
        target.closest('[data-video-player]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('[onclick]')
      )
    }
    
    // Handle touch events for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      // Check if touch is on an interactive element FIRST, before preventing default
      const target = e.target as HTMLElement
      if (isInteractiveElement(target)) {
        // Don't interfere with interactive elements - let them handle the touch
        isTouchScrolling = false
        return // Don't prevent default or interfere
      }
      
      if (isScrollingToSection) {
        e.preventDefault()
        return
      }
      
      // Prevent any scrolling at the start (only for non-interactive elements)
      e.preventDefault()
      
      touchStartY = e.touches[0].clientY
      lastTouchY = touchStartY
      touchStartTime = Date.now()
      isTouchScrolling = true
      touchMoveCount = 0
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchScrolling || isScrollingToSection) return
      
      // Check if touch is on an interactive element - if so, don't interfere
      const target = e.target as HTMLElement
      if (isInteractiveElement(target)) {
        // Don't prevent default on interactive elements - reset state
        isTouchScrolling = false
        touchMoveCount = 0
        return
      }
      
      // Prevent default scrolling on mobile to avoid showing multiple sections
      e.preventDefault()
      
      touchMoveCount++
      const currentY = e.touches[0].clientY
      const currentDeltaY = touchStartY - currentY
      lastTouchY = currentY
      
      // Immediate section navigation on touch move (like wheel events)
      // This makes mobile behave like desktop - immediate section-by-section scrolling
      // Reduced threshold for more immediate response
      if (Math.abs(currentDeltaY) > 20 && touchMoveCount >= 1) {
        const isScrollingDown = currentDeltaY > 0  // Swipe up -> next section
        const isScrollingUp = currentDeltaY < 0    // Swipe down -> previous section
        
        if (isScrollingDown || isScrollingUp) {
          isTouchScrolling = false // Reset to prevent multiple triggers
          touchMoveCount = 0
          const direction = isScrollingDown ? 'down' : 'up'
          // Lock scroll immediately before navigation
          lockScrollPosition()
          navigateToSection(direction)
          return
        }
      }
      
      // Track movement for swipe detection
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouchScrolling || isScrollingToSection) return
      
      // Check if touch ended on an interactive element - if so, don't interfere
      const target = e.target as HTMLElement
      if (isInteractiveElement(target)) {
        // Don't interfere with interactive elements - let them handle the click
        isTouchScrolling = false
        touchMoveCount = 0
        return
      }
      
      touchEndY = e.changedTouches[0].clientY
      touchEndTime = Date.now()
      
      const deltaY = touchStartY - touchEndY
      const deltaTime = touchEndTime - touchStartTime
      const velocity = deltaTime > 0 ? Math.abs(deltaY) / deltaTime : 0
      
      // Only trigger navigation if there was significant movement
      // If movement was minimal, it was likely a tap/click, not a swipe
      const minSwipeDistance = 50 // Minimum distance for swipe
      const minVelocity = 0.1 // Minimum velocity for swipe
      const minMoveCount = 1 // Minimum move count
      
      // Trigger navigation for swipe gestures (fallback if move handler didn't trigger)
      if (Math.abs(deltaY) > minSwipeDistance && 
          (velocity > minVelocity || touchMoveCount >= minMoveCount)) {
        
        // Touch scroll direction logic (inverted for mobile)
        // deltaY = touchStartY - touchEndY
        // Mobile touch behavior: swipe up should go to next section, swipe down should go to previous section
        const isScrollingUp = deltaY < 0    // Swipe down -> previous section
        const isScrollingDown = deltaY > 0  // Swipe up -> next section
        
        if (isScrollingDown || isScrollingUp) {
          // Use requestAnimationFrame for smoother transition
          requestAnimationFrame(() => {
            if (!isScrollingToSection) {
              const direction = isScrollingDown ? 'down' : 'up'
              navigateToSection(direction)
            }
          })
        }
      }
      
      // Reset touch state
      isTouchScrolling = false
      touchMoveCount = 0
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
      
      // Capture current section value at the start of navigation
      const startSection = currentSectionRef.current
      let targetSection = startSection
      
      if (direction === 'down') {
        targetSection = Math.min(8, startSection + 1)
      } else {
        targetSection = Math.max(1, startSection - 1)
      }
      
      if (targetSection !== startSection) {
        const transitionName = `section${startSection}to${targetSection}`
        
        // Start transition animation
        setScrollDirection(direction)
        setTransitionName(transitionName)
        setIsScrolling(true)
        setIsTransitioning(true)
        setTransitionProgress(0)
        isScrollingToSection = true
        
        // Animate transition progress with improved timing
        const duration = 1200 // 1.2 seconds for smoother feel
        const animationStartTime = performance.now()
        
        const animateTransition = (currentTime: number) => {
          if (!isScrollingToSection) return
          
          const elapsed = currentTime - animationStartTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Improved easing function for more natural animation
          const easeOutCubic = (t: number) => {
            return 1 - Math.pow(1 - t, 3)
          }
          
          const easedProgress = easeOutCubic(progress)
          
        // Update transition progress every frame for smooth animation
        setTransitionProgress(easedProgress)
          
          // We no longer programmatically scroll every frame; sections animate via CSS transforms
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition)
          } else {
            // Transition complete - set final scroll position exactly once
            const finalScrollY = (targetSection - 1) * window.innerHeight
            window.scrollTo(0, finalScrollY)

            // Update ref and cancel the ongoing animation
            currentSectionRef.current = targetSection
            isScrollingToSection = false
            
            // Batch all state updates in one synchronous call - no RAF needed
            setScrollPosition(finalScrollY)
            setTransitionProgress(0)
            setIsScrolling(false)
            setIsTransitioning(false)
            setCurrentSection(targetSection)
            setTransitionName(null)
          }
        }
        
        requestAnimationFrame(animateTransition)
      }
    }
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    
    // Add scroll handler for aggressive locking on mobile
    const isMobile = window.innerWidth <= 768
    let scrollLockInterval: NodeJS.Timeout | null = null
    
    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: false, capture: true })
      // Also add to document and body for comprehensive prevention
      document.addEventListener('scroll', handleScroll, { passive: false, capture: true })
      document.body.addEventListener('scroll', handleScroll, { passive: false, capture: true })
      
      // Lock scroll position more frequently on mobile to prevent any scrolling
      scrollLockInterval = setInterval(() => {
        if (!isScrollingToSection) {
          lockScrollPosition()
        }
      }, 16) // ~60fps
    }
    
    // Add touch event listeners for mobile - all non-passive to prevent default
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: false, capture: true })
    // Also add to document for comprehensive prevention
    document.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: false, capture: true })
    
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
      if (isMobile) {
        window.removeEventListener('scroll', handleScroll, { capture: true } as any)
        document.removeEventListener('scroll', handleScroll, { capture: true } as any)
        document.body.removeEventListener('scroll', handleScroll, { capture: true } as any)
      }
      window.removeEventListener('touchstart', handleTouchStart, { capture: true } as any)
      window.removeEventListener('touchmove', handleTouchMove, { capture: true } as any)
      window.removeEventListener('touchend', handleTouchEnd, { capture: true } as any)
      document.removeEventListener('touchstart', handleTouchStart, { capture: true } as any)
      document.removeEventListener('touchmove', handleTouchMove, { capture: true } as any)
      document.removeEventListener('touchend', handleTouchEnd, { capture: true } as any)
      window.removeEventListener('resize', handleResize)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      if (scrollLockInterval) {
        clearInterval(scrollLockInterval)
      }
      // Cancel any ongoing animation by setting flag
      isScrollingToSection = false
    }
  }, [setCurrentSection, setIsScrolling, setScrollDirection, setTransitionName, setIsTransitioning, setTransitionProgress, setScrollPosition, setIsClient])

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
})

export default ScrollManager
