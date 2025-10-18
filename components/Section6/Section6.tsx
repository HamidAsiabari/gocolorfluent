'use client'

import { useEffect, useState, memo } from 'react'
import VideoPlayer from '../VideoPlayer'
import { TypingAnimation, useSectionVisit } from '../Animation'

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
  const [windowHeight, setWindowHeight] = useState(0)
  const { markSectionVisited } = useSectionVisit()

  useEffect(() => {
    // Set window height on client side
    if (typeof window !== 'undefined') {
      setWindowHeight(window.innerHeight)
    }
  }, [])

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 6) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        markSectionVisited(6) // Mark section as visited only when it becomes visible
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 6) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1200) // 200ms (slide-in delay) + 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])


  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-screen px-4 sm:px-6 absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translateY(${isClient ? (6 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px)`,
        zIndex: 10
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
      <div className="section-content relative z-10 max-w-7xl mx-auto" style={{ paddingTop: '5%' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 leading-tight">
                Intuitive
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 leading-tight">
                Controls
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg">
              Ergonomic knobs, drain button actuator, and handle design for comfortable and precise professional operation.
            </p>

            {/* Control Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rose-400">Control Elements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Ergonomic control knobs" 
                        speed={60} 
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
                      <TypingAnimation 
                        text="Drain button actuator" 
                        speed={60} 
                        delay={1000}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Precision handle design" 
                        speed={60} 
                        delay={2000}
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
                      <TypingAnimation 
                        text="Comfortable operation" 
                        speed={60} 
                        delay={3000}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Precise control" 
                        speed={60} 
                        delay={4000}
                        sectionNumber={6}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Professional ergonomics" 
                        speed={60} 
                        delay={5000}
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

          {/* Right Side - Visual Elements - Hidden on mobile */}
          <div className={`hidden lg:block transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative w-fit">
              {/* Main visual container */}
              <div className={`relative w-full h-96 bg-gradient-to-br from-rose-900/30 to-red-900/30 rounded-2xl border border-rose-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
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
