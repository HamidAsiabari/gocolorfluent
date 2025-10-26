'use client'

import { useEffect, useState, memo } from 'react'
import VideoPlayer from '../VideoPlayer'
import { SimpleTextAnimation, useSectionVisit } from '../Animation'

interface Section6Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section6 = memo(function Section6({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section6Props) {
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
    const shouldBeVisible = currentSection === 6 || 
      (isTransitioning && scrollDirection === 'down' && currentSection === 5) ||
      (isTransitioning && scrollDirection === 'up' && currentSection === 7)
    
    if (shouldBeVisible) {
      // Start animation immediately when section becomes active or transition starts
      setIsVisible(true)
      if (currentSection === 6) {
        markSectionVisited(6) // Mark section as visited only when it becomes the current section
      }
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, isTransitioning, scrollDirection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 6) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1000) // 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])


  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-full absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translateY(${isClient ? (6 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px)`,
        zIndex: 10,
        maxWidth: '100%'
      }}
    >
      {/* Background Elements */}
      <div className="section-background absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-900 to-red-900" />
        
        {/* Control-inspired geometric shapes - reduced animations for performance */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-rose-400/20 rounded-lg rotate-12" />
        <div className="absolute bottom-24 left-16 w-32 h-32 border-2 border-pink-400/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-full blur-xl" />
        
        {/* Control patterns - reduced to single animation */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-rose-400/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-[120px] sm:pt-[5%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-3 sm:space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} order-1 lg:order-1`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Intuitive</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400"> Controls</span>
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-300 leading-snug sm:leading-relaxed max-w-lg">
              Ergonomic knobs, drain button actuator, and handle design for comfortable and precise professional operation.
            </p>

            {/* Control Features */}
            <div className="space-y-6">
              <div className="hidden sm:block space-y-4">
                <h3 className="text-lg font-semibold text-rose-400">Control Elements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Ergonomic control knobs" 
                        delay={0}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Drain button actuator" 
                        delay={300}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Precision handle design" 
                        delay={600}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pink-400">User Experience</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Comfortable operation" 
                        delay={900}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Precise control" 
                        delay={1200}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <SimpleTextAnimation 
                        text="Professional ergonomics" 
                        delay={1500}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Visual Elements - Show below text on mobile */}
          <div className={`block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'} order-2 lg:order-2`}>
            <div className="relative w-fit">
              {/* Main visual container */}
              <div className={`relative w-full h-[310px] sm:h-96 bg-gradient-to-br from-rose-900/30 to-red-900/30 rounded-2xl border border-rose-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Video Player */}
                <VideoPlayer
                  src="/video/WhatsApp Video 2025-09-12 at 18.53.07.mp4"
                  videoId="section6-video"
                  className="w-full h-full"
                  currentSection={currentSection}
                  sectionNumber={6}
                />
              </div>

              {/* Decorative control elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-rose-400/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '16s' }} />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
})

export default Section6
