'use client'

import { useEffect, useState, memo, useCallback } from 'react'

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
      const targetScrollY = (currentSection - 1) * windowHeight
      window.scrollTo(0, targetScrollY)
      setScrollPosition(targetScrollY)
    }
    
    // Handle scroll events to maintain section locking
    const handleScroll = (e: Event) => {
      if (isScrollingToSection) return
      
      const windowHeight = window.innerHeight
      const currentScrollY = window.scrollY
      const expectedScrollY = (currentSection - 1) * windowHeight
      
      // Check if device is mobile
      const isMobile = window.innerWidth <= 768
      const tolerance = isMobile ? 0 : 10 // No tolerance on mobile, small tolerance on desktop
      
      // If scroll position deviates from expected, lock it back immediately
      if (Math.abs(currentScrollY - expectedScrollY) > tolerance) {
        lockScrollPosition()
      }
      
      setScrollPosition(currentScrollY)
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
    
    // Handle touch events for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollingToSection) return
      
      touchStartY = e.touches[0].clientY
      lastTouchY = touchStartY
      touchStartTime = Date.now()
      isTouchScrolling = true
      touchMoveCount = 0
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchScrolling || isScrollingToSection) return
      
      // Prevent default scrolling on mobile to avoid showing multiple sections
      e.preventDefault()
      
      touchMoveCount++
      const currentY = e.touches[0].clientY
      lastTouchY = currentY
      
      // Track movement for swipe detection
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouchScrolling || isScrollingToSection) return
      
      touchEndY = e.changedTouches[0].clientY
      touchEndTime = Date.now()
      
      const deltaY = touchStartY - touchEndY
      const deltaTime = touchEndTime - touchStartTime
      const velocity = deltaTime > 0 ? Math.abs(deltaY) / deltaTime : 0
      
      // Enhanced swipe detection with multiple criteria
      const minSwipeDistance = 60 // Minimum distance for swipe
      const minVelocity = 0.12 // Minimum velocity for swipe
      const minMoveCount = 3 // Minimum number of touch moves
      
      // Only trigger navigation for clear, intentional swipe gestures
      if (Math.abs(deltaY) > minSwipeDistance && 
          velocity > minVelocity && 
          touchMoveCount >= minMoveCount) {
        
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
        
        // Animate transition progress with improved timing
        const duration = 1200 // 1.2 seconds for smoother feel
        const startTime = performance.now()
        
        const animateTransition = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Improved easing function for more natural animation
          const easeOutCubic = (t: number) => {
            return 1 - Math.pow(1 - t, 3)
          }
          
          const easedProgress = easeOutCubic(progress)
          setTransitionProgress(easedProgress)
          
          // Smooth scroll to target position during animation
          const windowHeight = window.innerHeight
          const startScrollY = (currentSection - 1) * windowHeight
          const targetScrollY = (targetSection - 1) * windowHeight
          const currentScrollY = startScrollY + (targetScrollY - startScrollY) * easedProgress
          
          window.scrollTo(0, currentScrollY)
          setScrollPosition(currentScrollY)
          
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
            
            // Ensure final scroll position is exact
            const finalScrollY = (targetSection - 1) * window.innerHeight
            setScrollPosition(finalScrollY)
            window.scrollTo(0, finalScrollY)
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
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Add touch event listeners for mobile
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    
    // Lock initial scroll position
    lockScrollPosition()
    
    // Lock scroll position on resize
    const handleResize = () => {
      lockScrollPosition()
    }
    window.addEventListener('resize', handleResize)
    
    // Add continuous scroll locking for mobile devices
    const isMobile = window.innerWidth <= 768
    let scrollLockInterval: NodeJS.Timeout | null = null
    
    if (isMobile) {
      // Lock scroll position more frequently on mobile to prevent any scrolling
      scrollLockInterval = setInterval(() => {
        if (!isScrollingToSection) {
          lockScrollPosition()
        }
      }, 16) // ~60fps
    }
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('resize', handleResize)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      if (scrollLockInterval) {
        clearInterval(scrollLockInterval)
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
})

export default ScrollManager
