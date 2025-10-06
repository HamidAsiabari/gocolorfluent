'use client'

import { useEffect, useState, memo } from 'react'
import { TypingAnimation, useSectionVisit } from '../Animation'

interface Section7Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section7 = memo(function Section7({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section7Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)
  const { markSectionVisited } = useSectionVisit()

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 7) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        markSectionVisited(7) // Mark section as visited only when it becomes visible
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection, markSectionVisited])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 7) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1200) // 200ms (slide-in delay) + 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])

  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-screen px-4 sm:px-6 absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translateY(${isClient ? (7 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`,
        zIndex: 10
      }}
    >
      {/* Background Elements */}
      <div className="section-background absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-gray-900/10 to-zinc-900/20" />
        
        {/* Technical-inspired geometric shapes - reduced animations for performance */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-slate-400/20 rounded-lg rotate-12" />
        <div className="absolute bottom-24 left-16 w-32 h-32 border-2 border-gray-400/20 rounded-full animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute top-1/3 left-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-zinc-500/10 to-slate-500/10 rounded-full blur-xl" />
        
        {/* Technical patterns - reduced to single animation */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-slate-400/30 rounded-full animate-spin" style={{ animationDuration: '25s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-7xl mx-auto" style={{ paddingTop: '5%' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          {/* Left Side - Visual Elements - Hidden on mobile */}
          <div className={`hidden lg:block transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className={`relative w-full h-96 bg-gradient-to-br from-slate-900/30 to-zinc-900/30 rounded-2xl border border-slate-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Technical specifications visualization */}
                <div className="absolute inset-6 space-y-6">
                  {/* Component specifications */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Motor Type</span>
                      <div className="w-16 h-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Sensor Precision</span>
                      <div className="w-20 h-2 bg-gradient-to-r from-gray-500 to-zinc-500 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">Power Rating</span>
                      <div className="w-12 h-2 bg-gradient-to-r from-zinc-500 to-slate-500 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Technical data visualization */}
                  <div className="space-y-3">
                    <div className="h-1 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full" />
                    <div className="h-1 bg-gradient-to-r from-gray-500 to-zinc-500 rounded-full" />
                    <div className="h-1 bg-gradient-to-r from-zinc-500 to-slate-500 rounded-full" />
                  </div>
                  
                  
                  {/* Performance metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-slate-300 text-xs">Efficiency</div>
                      <div className="text-slate-400 text-lg font-bold">98.5%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-300 text-xs">Precision</div>
                      <div className="text-slate-400 text-lg font-bold">±0.01mm</div>
                    </div>
                  </div>
                </div>

                {/* Floating technical elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-slate-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gray-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-2 h-2 bg-zinc-400/60 rounded-full animate-bounce delay-1000" />
              </div>

              {/* Decorative technical elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-slate-400/30 rounded-full animate-spin" style={{ animationDuration: '14s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-gray-400/30 rounded-full animate-spin" style={{ animationDuration: '18s' }} />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-6 lg:space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-2 lg:space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-gray-400 leading-tight">
                Technical
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-zinc-400 leading-tight">
                Specifications
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg">
              Professional-grade components including micro-gear motors, precision sensors, and advanced electronic systems for reliable performance.
            </p>

            {/* Technical Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-400">Core Components</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Micro-gear motor technology" 
                        speed={60} 
                        delay={0}
                        sectionNumber={7}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Precision sensor arrays" 
                        speed={60} 
                        delay={1000}
                        sectionNumber={7}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Advanced electronic systems" 
                        speed={60} 
                        delay={2000}
                        sectionNumber={7}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-400">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="98.5% operational efficiency" 
                        speed={60} 
                        delay={3000}
                        sectionNumber={7}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="±0.01mm precision accuracy" 
                        speed={60} 
                        delay={4000}
                        sectionNumber={7}
                        currentSection={currentSection}
                        isVisible={isVisible}
                      />
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">
                      <TypingAnimation 
                        text="Professional-grade reliability" 
                        speed={60} 
                        delay={5000}
                        sectionNumber={7}
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

export default Section7
