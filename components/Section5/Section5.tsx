'use client'

import { useEffect, useState } from 'react'

interface Section5Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section5({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section5Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 5) {
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [currentSection])

  return (
    <section 
      className="flex items-center justify-center h-screen px-6 absolute inset-0"
      style={{
        transform: `translateY(${isClient ? (5 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-yellow-900/20" />
        
        {/* Light-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-amber-400/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-24 left-20 w-32 h-32 border-2 border-orange-400/20 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-full blur-xl" />
        
        {/* Light beam patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-amber-400/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-orange-400/30 rounded-full animate-spin" style={{ animationDuration: '16s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Section Indicator */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-amber-500/30 shadow-lg">
        <span className="text-amber-400 text-sm font-mono tracking-wider">Section 5</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Visual Elements */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className="relative w-full h-96 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-2xl border border-amber-500/20 backdrop-blur-sm overflow-hidden">
                
                {/* LED lighting system visualization */}
                <div className="absolute inset-6 space-y-8">
                  {/* LED array representation */}
                  <div className="flex justify-center items-center space-x-3">
                    <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse" />
                    <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse delay-100" />
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse delay-200" />
                    <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse delay-300" />
                    <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Light beam effects */}
                  <div className="space-y-4">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" />
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse delay-200" />
                    <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Sensor guide lights */}
                  <div className="flex justify-center space-x-6">
                    <div className="w-6 h-6 bg-amber-400/60 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-orange-400/60 rounded-full animate-ping delay-300" />
                    <div className="w-5 h-5 bg-yellow-400/60 rounded-full animate-ping delay-600" />
                  </div>
                  
                  {/* Color accuracy indicators */}
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-400/60 rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-green-400/60 rounded-full animate-pulse delay-200" />
                    <div className="w-3 h-3 bg-blue-400/60 rounded-full animate-pulse delay-400" />
                  </div>
                </div>

                {/* Floating light elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-2 h-2 bg-yellow-400/60 rounded-full animate-bounce delay-1000" />
              </div>

              {/* Decorative light elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-amber-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-orange-400/30 rounded-full animate-spin" style={{ animationDuration: '14s' }} />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 leading-tight">
                Professional
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 leading-tight">
                Lighting
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              High-quality LED lighting system with sensor guide lights for optimal color accuracy and professional results.
            </p>

            {/* Lighting Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-amber-400">Lighting Technology</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">High-quality LED system</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Sensor guide lights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Optimized color accuracy</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-400">Professional Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Consistent illumination</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">True color representation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Professional-grade results</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25">
                <span className="relative z-10">View Lighting Specs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-amber-400 hover:border-orange-400 text-amber-300 hover:text-orange-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-amber-500/5 hover:bg-orange-500/10">
                <span className="relative z-10">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
