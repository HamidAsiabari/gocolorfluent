'use client'

import { useEffect, useState } from 'react'

interface Section6Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section6({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section6Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 6) {
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
        transform: `translateY(${isClient ? (6 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/20 via-pink-900/10 to-red-900/20" />
        
        {/* Control-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-rose-400/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-24 left-16 w-32 h-32 border-2 border-pink-400/20 rounded-full animate-spin" style={{ animationDuration: '22s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-full blur-xl" />
        
        {/* Control patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-rose-400/30 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-pink-400/30 rounded-full animate-spin" style={{ animationDuration: '18s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Section Indicator */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-rose-500/30 shadow-lg">
        <span className="text-rose-400 text-sm font-mono tracking-wider">Section 6</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 leading-tight">
                Intuitive
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400 leading-tight">
                Controls
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Ergonomic knobs, drain button actuator, and handle design for comfortable and precise professional operation.
            </p>

            {/* Control Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-rose-400">Control Elements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Ergonomic control knobs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Drain button actuator</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Precision handle design</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-pink-400">User Experience</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Comfortable operation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Precise control</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Professional ergonomics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/25">
                <span className="relative z-10">Try Controls</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-rose-400 hover:border-pink-400 text-rose-300 hover:text-pink-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-rose-500/5 hover:bg-pink-500/10">
                <span className="relative z-10">View Design</span>
              </button>
            </div>
          </div>

          {/* Right Side - Visual Elements */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className="relative w-full h-96 bg-gradient-to-br from-rose-900/30 to-red-900/30 rounded-2xl border border-rose-500/20 backdrop-blur-sm overflow-hidden">
                
                {/* Control interface visualization */}
                <div className="absolute inset-6 space-y-6">
                  {/* Control knobs representation */}
                  <div className="flex justify-center items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 bg-white/80 rounded-full" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center animate-pulse delay-200">
                      <div className="w-3 h-3 bg-white/80 rounded-full" />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center animate-pulse delay-400">
                      <div className="w-2 h-2 bg-white/80 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Control interface lines */}
                  <div className="space-y-3">
                    <div className="h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse" />
                    <div className="h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse delay-200" />
                    <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Button actuator representation */}
                  <div className="flex justify-center">
                    <div className="w-16 h-8 bg-gradient-to-r from-rose-600/40 to-pink-600/40 rounded-full border border-rose-400/30 flex items-center justify-center">
                      <div className="w-12 h-4 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Handle design indicators */}
                  <div className="flex justify-center space-x-4">
                    <div className="w-6 h-6 bg-rose-400/60 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-pink-400/60 rounded-full animate-ping delay-300" />
                    <div className="w-5 h-5 bg-red-400/60 rounded-full animate-ping delay-600" />
                  </div>
                </div>

                {/* Floating control elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-rose-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-2 h-2 bg-red-400/60 rounded-full animate-bounce delay-1000" />
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
}
