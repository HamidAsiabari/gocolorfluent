'use client'

import { useEffect, useState } from 'react'

interface Section3Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section3({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section3Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 3) {
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsBlurred(false)
    }
  }, [currentSection])

  useEffect(() => {
    // Trigger blur animation after slide-in animation completes
    if (isVisible && currentSection === 3) {
      const blurTimer = setTimeout(() => setIsBlurred(true), 1200) // 200ms (slide-in delay) + 1000ms (slide-in duration)
      return () => clearTimeout(blurTimer)
    }
  }, [isVisible, currentSection])

  return (
    <section 
      className="flex items-center justify-center h-screen px-6 absolute inset-0"
      style={{
        transform: `translateY(${isClient ? (3 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/10 to-cyan-900/20" />
        
        {/* Mechanical-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-emerald-400/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-24 left-20 w-32 h-32 border-2 border-teal-400/20 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-full blur-xl" />
        
        {/* Gear-like patterns */}
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 border-2 border-emerald-400/30 rounded-full animate-spin" style={{ animationDuration: '12s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>


      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Visual Elements */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className={`relative w-full h-96 bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 rounded-2xl border border-emerald-500/20 overflow-hidden transition-all duration-1000 ${isBlurred ? 'backdrop-blur-sm' : 'backdrop-blur-none'}`}>
                
                {/* Mechanical components visualization */}
                <div className="absolute inset-6 space-y-8">
                  {/* Central gear system */}
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-16 h-16 border-4 border-emerald-400 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                      <div className="w-8 h-8 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                    </div>
                    <div className="w-12 h-12 border-3 border-teal-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  
                  {/* Precision lines */}
                  <div className="space-y-3">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full animate-pulse" />
                    <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full animate-pulse delay-200" />
                    <div className="h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Micro components */}
                  <div className="flex justify-center space-x-6">
                    <div className="w-6 h-6 bg-emerald-400/60 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-cyan-400/60 rounded-full animate-ping delay-300" />
                    <div className="w-5 h-5 bg-teal-400/60 rounded-full animate-ping delay-600" />
                  </div>
                </div>

                {/* Floating mechanical elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-emerald-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-2.5 h-2.5 bg-teal-400/60 rounded-full animate-bounce delay-1000" />
              </div>

              {/* Decorative mechanical elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 border-2 border-emerald-400/30 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute -bottom-6 -left-6 w-8 h-8 border-2 border-cyan-400/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 leading-tight">
                Precision
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 leading-tight">
                Mechanics
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Micro-gear motor technology with precision coupling and support systems for accurate brush movement and control.
            </p>

            {/* Technical Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-emerald-400">Core Technologies</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Micro-gear motor system</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Precision coupling mechanisms</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Advanced support systems</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">Performance Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Ultra-precise movement control</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Smooth brush operation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Reliable mechanical performance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25">
                <span className="relative z-10">View Specifications</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-emerald-400 hover:border-cyan-400 text-emerald-300 hover:text-cyan-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-emerald-500/5 hover:bg-cyan-500/10">
                <span className="relative z-10">Technical Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
