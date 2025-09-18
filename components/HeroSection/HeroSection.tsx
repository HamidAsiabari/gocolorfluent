'use client'

import { useEffect, useState } from 'react'

interface HeroSectionProps {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function HeroSection({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      className="flex flex-col items-center justify-center h-screen px-6 absolute inset-0"
      style={{
        transform: `translateY(${isClient ? (1 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white space-y-12 max-w-5xl mx-auto">
        {/* Hero Title with enhanced typography */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-[0.9] tracking-tight">
            Color
          </h1>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-[0.9] tracking-tight -mt-4">
            Fluent
          </h1>
        </div>
        
        {/* Subtitle with improved styling */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed tracking-wide">
            Professional Color Solutions
          </p>
        </div>
        
        {/* Description with better readability */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Experience precision, innovation, and cutting-edge technology in our advanced color brush system. 
            Discover the future of digital artistry with our state-of-the-art assembly.
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <span className="relative z-10">Explore Products</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
            </button>
            
            <button className="group px-8 py-4 border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-white/5 hover:bg-white/10">
              <span className="relative z-10">Learn More</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col items-center space-y-2 mt-16">
            <span className="text-sm text-gray-400 font-light tracking-wider uppercase">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-orange-400/60 rounded-full animate-pulse delay-1500" />
      </div>
    </section>
  )
}
