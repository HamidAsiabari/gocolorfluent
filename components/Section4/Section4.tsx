'use client'

import { useEffect, useState, memo } from 'react'
import VideoPlayer from '../VideoPlayer'
import { TypingAnimation, useSectionVisit } from '../Animation'

interface Section4Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section4 = memo(function Section4({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section4Props) {
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
    // Trigger entrance animation when section becomes active or when transitioning to this section
    const shouldBeVisible = currentSection === 4 || 
      (isTransitioning && scrollDirection === 'down' && currentSection === 3) ||
      (isTransitioning && scrollDirection === 'up' && currentSection === 5)
    
    if (shouldBeVisible) {
      // Start animation immediately when section becomes active or transition starts
      setIsVisible(true)
      if (currentSection === 4) {
        markSectionVisited(4) // Mark section as visited only when it becomes the current section
      }
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, isTransitioning, scrollDirection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 4) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1000) // 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])


  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-screen absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translateY(${isClient ? (4 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * windowHeight : 0}px)`,
        zIndex: 10
      }}
    >
      {/* Background Elements */}
      <div className="section-background absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900" />
        
        {/* Circuit-inspired geometric shapes */}
        <div className="absolute top-20 right-20 w-36 h-36 border-2 border-violet-400/20 rounded-lg rotate-45 animate-pulse" />
        <div className="absolute bottom-28 left-16 w-28 h-28 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '18s' }} />
        <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 rounded-full blur-xl" />
        
        {/* Circuit patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-violet-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '14s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6" style={{ paddingTop: '5%' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 leading-tight">
                Smart
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 leading-tight">
                Electronics
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg">
              Advanced PCB technology with OLED display, detector switches, and intelligent control systems for seamless operation.
            </p>

            {/* Technology Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-violet-400">Core Components</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Advanced PCB technology" 
                        speed={60} 
                        delay={0}
                        sectionNumber={4}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="High-resolution OLED display" 
                        speed={60} 
                        delay={300}
                        sectionNumber={4}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Precision detector switches" 
                        speed={60} 
                        delay={600}
                        sectionNumber={4}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-400">Smart Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Intelligent control systems" 
                        speed={60} 
                        delay={900}
                        sectionNumber={4}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Real-time data processing" 
                        speed={60} 
                        delay={1200}
                        sectionNumber={4}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Seamless user interface" 
                        speed={60} 
                        delay={1500}
                        sectionNumber={4}
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
              <div className={`relative w-full h-96 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 rounded-2xl border border-violet-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Video Player */}
                <VideoPlayer
                  src="/video/WhatsApp Video 2025-09-12 at 18.50.23.mp4"
                  videoId="section4-video"
                  className="w-full h-full"
                  currentSection={currentSection}
                  sectionNumber={4}
                />
              </div>

              {/* Decorative electronic elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-violet-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
})

export default Section4
