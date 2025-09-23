'use client'

import { useEffect, useState } from 'react'

interface Section2Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section2({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section2Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 2) {
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 2) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1200) // 200ms (slide-in delay) + 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])

  return (
    <section 
      className="flex items-center justify-center h-screen px-6 absolute inset-0"
      style={{
        transform: `translateY(${isClient ? (2 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/20" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-blue-400/20 rounded-lg rotate-45 animate-pulse" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-10 w-16 h-16 border-2 border-indigo-400/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>


      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 leading-tight">
                Advanced Detection
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-tight">
                Systems
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              State-of-the-art color sensor technology with precision detection capabilities for professional-grade color accuracy.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-gray-300">High-precision color sensors</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                <span className="text-gray-300">Real-time color analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400" />
                <span className="text-gray-300">Professional-grade accuracy</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
            </button>
          </div>

          {/* Right Side - Visual Elements */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className={`relative w-full h-96 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl border border-blue-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Animated elements inside */}
                <div className="absolute inset-4 space-y-6">
                  {/* Sensor representation */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 bg-white/80 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Detection waves */}
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full animate-ping"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                  
                  {/* Data visualization */}
                  <div className="space-y-2">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                    <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse delay-100" />
                    <div className="h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-pulse delay-200" />
                  </div>
                </div>

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
}
