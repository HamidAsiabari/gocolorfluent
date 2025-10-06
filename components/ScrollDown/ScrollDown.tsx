'use client'

import { useState, useEffect } from 'react'

interface ScrollDownProps {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function ScrollDown({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: ScrollDownProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Show scroll down component only when we're on section 1
    if (currentSection === 1) {
      const timer = setTimeout(() => setIsVisible(true), 1500) // Show after hero content animation
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [currentSection])

  const handleScrollDown = () => {
    if (isClient && currentSection === 1) {
      // Trigger a wheel event to work with the custom scroll system
      const wheelEvent = new WheelEvent('wheel', {
        deltaY: 1, // Positive deltaY for scrolling down
        deltaX: 0,
        deltaZ: 0,
        bubbles: true,
        cancelable: true
      })
      
      // Dispatch the wheel event to trigger the custom scroll system
      window.dispatchEvent(wheelEvent)
    }
  }

  return (
    <div 
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <button
        onClick={handleScrollDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group flex flex-col items-center space-y-2 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg px-4 py-2"
        aria-label="Scroll to next section"
      >
        {/* Scroll text */}
        <span className="text-sm font-medium tracking-wide uppercase">
          Scroll Down
        </span>
        
        {/* Animated arrow */}
        <div className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className={`transition-all duration-500 ${isHovered ? 'translate-y-1' : 'translate-y-0'}`}
          >
            <path 
              d="M7 10L12 15L17 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div 
            className={`w-1 h-1 bg-current rounded-full transition-all duration-300 ${
              isHovered ? 'animate-bounce' : ''
            }`}
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className={`w-1 h-1 bg-current rounded-full transition-all duration-300 ${
              isHovered ? 'animate-bounce' : ''
            }`}
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className={`w-1 h-1 bg-current rounded-full transition-all duration-300 ${
              isHovered ? 'animate-bounce' : ''
            }`}
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </button>
    </div>
  )
}
