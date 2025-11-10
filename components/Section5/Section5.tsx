'use client'

import { useEffect, useState, memo } from 'react'
import VideoPlayer from '../VideoPlayer'
import { SimpleTextAnimation, useSectionVisit } from '../Animation'

interface Section5Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section5 = memo(function Section5({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section5Props) {
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
    const shouldBeVisible = currentSection === 5 || 
      (isTransitioning && scrollDirection === 'down' && currentSection === 4) ||
      (isTransitioning && scrollDirection === 'up' && currentSection === 6)
    
    if (shouldBeVisible) {
      // Start animation immediately when section becomes active or transition starts
      setIsVisible(true)
      if (currentSection === 5) {
        markSectionVisited(5) // Mark section as visited only when it becomes the current section
      }
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, isTransitioning, scrollDirection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 5) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1000) // 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])


  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-full absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translate3d(0, ${isClient ? (5 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px, 0)`,
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
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900" />
        
        {/* Light-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-amber-400/20 rounded-lg rotate-12 " />
        <div className="absolute bottom-24 left-20 w-32 h-32 border-2 border-orange-400/20 rounded-full " style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-xl" />
        
        {/* Light beam patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-amber-400/30 rounded-full " style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-orange-400/30 rounded-full " style={{ animationDuration: '16s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-[73px] sm:pt-[5%] min-h-[calc(100vh-73px)] md:min-h-0 pb-4 md:pb-0 flex flex-col md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center md:items-center justify-between md:justify-center flex-grow md:flex-grow-0">
          
          {/* Left Side - Visual Elements - Show below text on mobile */}
          <div className={`block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} order-2 lg:order-1`}>
            <div className="relative w-fit">
              {/* Main visual container */}
              <div className={`relative w-full h-[200px] sm:h-96 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-2xl border border-amber-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Video Player */}
                <VideoPlayer
                  src="/video/WhatsApp Video 2025-09-12 at 18.52.05.mp4"
                  videoId="section5-video"
                  className="w-full h-full"
                  currentSection={currentSection}
                  sectionNumber={5}
                />
              </div>

              {/* Decorative light elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-amber-400/30 rounded-full " style={{ animationDuration: '10s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-orange-400/30 rounded-full " style={{ animationDuration: '14s' }} />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-3 sm:space-y-6 lg:space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} order-1 lg:order-2`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-[1.2rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Professional</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400"> Lighting</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 leading-snug sm:leading-relaxed max-w-lg">
              High-quality LED lighting system with sensor guide lights for optimal color accuracy and professional results.
            </p>

            {/* Lighting Features */}
            <div className="space-y-6">
              <div className="hidden sm:block space-y-4">
                <h3 className="text-lg font-semibold text-amber-400">Lighting Technology</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full " />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="High-quality LED system" 
                        delay={0}
                        sectionNumber={5}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full  delay-200" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Sensor guide lights" 
                        delay={300}
                        sectionNumber={5}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full  delay-400" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Optimized color accuracy" 
                        delay={600}
                        sectionNumber={5}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-400">Professional Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full " />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Consistent illumination" 
                        delay={900}
                        sectionNumber={5}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full  delay-200" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="True color representation" 
                        delay={1200}
                        sectionNumber={5}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full  delay-400" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Professional-grade results" 
                        delay={1500}
                        sectionNumber={5}
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

export default Section5
