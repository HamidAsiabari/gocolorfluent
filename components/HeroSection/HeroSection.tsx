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
      className="flex flex-col items-center md:items-center items-start justify-start h-screen w-screen px-4 sm:px-6 absolute inset-0 pt-16 md:pt-20"
      style={{
        transform: `translateY(${isClient ? (1 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white space-y-6 sm:space-y-8 lg:space-y-12 max-w-5xl mx-auto mt-[120px]">
        {/* Hero Title with enhanced typography */}
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black leading-[0.9] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">Color </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Fluent</span>
          </h1>
        </div>
        
        {/* Subtitle with improved styling */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed tracking-wide">
            Professional Color Solutions
          </p>
        </div>
        
        {/* Description with better readability */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Experience precision, innovation, and cutting-edge technology in our advanced color brush system. 
            Discover the future of digital artistry with our state-of-the-art assembly.
          </p>
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
