'use client'

import { useEffect, useState, memo } from 'react'
import VideoPlayer from '../VideoPlayer'
import { SimpleTextAnimation, useSectionVisit } from '../Animation'

interface Section3Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section3 = memo(function Section3({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section3Props) {
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
    const shouldBeVisible = currentSection === 3 || 
      (isTransitioning && scrollDirection === 'down' && currentSection === 2) ||
      (isTransitioning && scrollDirection === 'up' && currentSection === 4)
    
    if (shouldBeVisible) {
      // Start animation immediately when section becomes active or transition starts
      setIsVisible(true)
      if (currentSection === 3) {
        markSectionVisited(3) // Mark section as visited only when it becomes the current section
      }
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, isTransitioning, scrollDirection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 3) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1000) // 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])


  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-full absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translate3d(0, ${isClient ? (3 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px, 0)`,
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900" />
        
        {/* Mechanical-inspired geometric shapes - animations disabled for performance */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-emerald-400/20 rounded-lg rotate-12" />
        <div className="absolute bottom-24 left-20 w-32 h-32 border-2 border-teal-400/20 rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-xl" />
        
        {/* Gear-like patterns */}
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-cyan-400/30 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 border-2 border-emerald-400/30 rounded-full" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-[73px] sm:pt-[5%] min-h-[calc(100vh-73px)] md:min-h-0 pb-4 md:pb-0 flex flex-col md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center md:items-center justify-between md:justify-center flex-grow md:flex-grow-0">
          
          {/* Left Side - Visual Elements - Show below text on mobile */}
          <div className={`block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} order-2 lg:order-1`}>
            <div className="relative w-fit">
              {/* Main visual container */}
              <div className={`relative w-full h-[200px] sm:h-96 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 rounded-2xl border border-emerald-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Video Player */}
                <VideoPlayer
                  src="/video/WhatsApp Video 2025-09-12 at 18.49.17.mp4"
                  videoId="section3-video"
                  className="w-full h-full"
                  currentSection={currentSection}
                  sectionNumber={3}
                />
              </div>

              {/* Decorative mechanical elements - animations disabled for performance */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-emerald-400/30 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-cyan-400/30 rounded-full" />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-3 sm:space-y-6 lg:space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} order-1 lg:order-2`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-[1.2rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Precision</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400"> Mechanics</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 leading-snug sm:leading-relaxed max-w-lg">
              Micro-gear motor technology with precision coupling and support systems for accurate brush movement and control.
            </p>

            {/* Technical Features */}
            <div className="space-y-4 sm:space-y-6">
              <div className="hidden sm:block space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-400">Core Technologies</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Micro-gear motor system" 
                        delay={0}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Precision coupling mechanisms" 
                        delay={300}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full animate-pulse delay-400" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Advanced support systems" 
                        delay={600}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Performance Benefits</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Ultra-precise movement control" 
                        delay={900}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Smooth brush operation" 
                        delay={1200}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-400 rounded-full animate-pulse delay-400" />
                    <span className="text-sm sm:text-base text-gray-300">
                      <SimpleTextAnimation 
                        text="Reliable mechanical performance" 
                        delay={1500}
                        sectionNumber={3}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
})

export default Section3
