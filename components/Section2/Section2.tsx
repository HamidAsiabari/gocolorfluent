'use client'

import { useEffect, useState, memo } from 'react'
import { SimpleTextAnimation, useSectionVisit } from '../Animation'

interface Section2Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section2 = memo(function Section2({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section2Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)
  const [windowHeight, setWindowHeight] = useState(() => {
    // Initialize with actual window height to prevent flash on first render
    if (typeof window !== 'undefined') {
      return window.innerHeight
    }
    return 0
  })
  const { markSectionVisited } = useSectionVisit()

  useEffect(() => {
    // Update window height when it changes
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  useEffect(() => {
    // Trigger entrance animation when section becomes active or when transitioning to this section
    const shouldBeVisible = currentSection === 2 || 
      (isTransitioning && scrollDirection === 'down' && currentSection === 1) ||
      (isTransitioning && scrollDirection === 'up' && currentSection === 3)
    
    if (shouldBeVisible) {
      // Start animation immediately when section becomes active or transition starts
      setIsVisible(true)
      if (currentSection === 2) {
        markSectionVisited(2) // Mark section as visited only when it becomes the current section
      }
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, isTransitioning, scrollDirection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 2) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1000) // 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])

  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-full absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translate3d(0, ${isClient ? (2 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px, 0)`,
        zIndex: 10,
        maxWidth: '100%',
        willChange: isTransitioning ? 'transform' : 'auto',
        contain: 'layout style paint',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      {/* Background Elements */}
      <div className="section-background absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
        
        {/* Floating geometric shapes - reduced animations for performance */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-blue-400/20 rounded-lg rotate-45" />
        <div className="absolute bottom-32 left-16 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-indigo-400/30 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-[73px] sm:pt-[calc(5%-2px)] min-h-[calc(100vh-73px)] md:min-h-0 pb-4 md:pb-0 flex flex-col md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center md:items-center justify-between md:justify-center flex-grow md:flex-grow-0">
          
          {/* Left Side - Content */}
          <div className={`space-y-3 sm:space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} order-1 lg:order-1`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-[1.2rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Advanced Detection</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Systems</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 leading-snug sm:leading-relaxed max-w-lg">
              State-of-the-art color sensor technology with precision detection capabilities for professional-grade color accuracy.
            </p>

            {/* Feature List */}
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-sm sm:text-base text-gray-300">
                  <SimpleTextAnimation 
                    text="High-precision color sensors" 
                    delay={0}
                    sectionNumber={2}
                    currentSection={currentSection}
                    isVisible={isVisible}
                  />
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                <span className="text-sm sm:text-base text-gray-300">
                  <SimpleTextAnimation 
                    text="Real-time color analysis" 
                    delay={300}
                    sectionNumber={2}
                    currentSection={currentSection}
                    isVisible={isVisible}
                  />
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-pulse delay-400" />
                <span className="text-sm sm:text-base text-gray-300">
                  <SimpleTextAnimation 
                    text="Professional-grade accuracy" 
                    delay={600}
                    sectionNumber={2}
                    currentSection={currentSection}
                    isVisible={isVisible}
                  />
                </span>
              </div>
            </div>

            {/* CTA Button - Desktop only */}
            <div className="hidden md:block">
              <a 
                href="/catalog" 
                className="group relative inline-block px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-sm sm:text-base"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </a>
            </div>

          </div>

          {/* Right Side - Visual Elements - Show below text on mobile */}
          <div className={`block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} order-2 lg:order-2`}>
            <div className="relative">
              {/* CTA Button - Positioned at bottom center of box on mobile */}
              <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 z-20 md:hidden">
                <a 
                  href="/catalog" 
                  className="group relative inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 text-sm"
                >
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                </a>
              </div>
              
              {/* Main visual container */}
              <div className={`relative w-full h-[200px] sm:h-96 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Home Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/img/home-img1.png" 
                    alt="Advanced Detection Systems" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>

                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />

                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce delay-1000" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-blue-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
})

export default Section2
