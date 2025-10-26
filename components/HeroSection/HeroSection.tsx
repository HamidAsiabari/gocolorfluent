'use client'

import { useEffect, useState, memo } from 'react'
import ScrollDown from '../ScrollDown'

interface HeroSectionProps {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const HeroSection = memo(function HeroSection({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [windowHeight, setWindowHeight] = useState(() => {
    // Initialize with actual window height to prevent flash on first render
    if (typeof window !== 'undefined') {
      return window.innerHeight
    }
    return 0
  })

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Update window height when it changes
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  return (
    <section 
      className="flex flex-col items-center md:items-center items-start justify-start h-screen w-full absolute inset-0 pt-16 md:pt-20"
      style={{
        transform: `translateY(${isClient ? (1 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px)`,
        zIndex: 10,
        maxWidth: '100%'
      }}
    >

      {/* Main Content */}
      <div className="section-content relative z-10 text-center text-white space-y-6 sm:space-y-8 lg:space-y-12 max-w-5xl mx-auto mt-[120px] px-4 sm:px-6">
        {/* Hero Title with enhanced typography */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black leading-[0.9] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">Color </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Fluent</span>
          </h1>
        </div>
        
        {/* Subtitle with improved styling */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-800 max-w-4xl mx-auto leading-relaxed tracking-wide">
            Smart Precision. Rooted in Beauty
          </p>
        </div>
        
      </div>

      {/* Scroll Down Component - Hidden on mobile */}
      <div className="hidden md:block">
        <ScrollDown
          isClient={isClient}
          currentSection={currentSection}
          isTransitioning={isTransitioning}
          scrollDirection={scrollDirection}
          transitionProgress={transitionProgress}
        />
      </div>
    </section>
  )
})

export default HeroSection
