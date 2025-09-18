'use client'

import { useEffect, useState } from 'react'

interface Section4Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section4({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section4Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 4) {
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
        transform: `translateY(${isClient ? (4 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-fuchsia-900/20" />
        
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

      {/* Section Indicator */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-violet-500/30 shadow-lg">
        <span className="text-violet-400 text-sm font-mono tracking-wider">Section 4</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 leading-tight">
                Smart
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 leading-tight">
                Electronics
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Advanced PCB technology with OLED display, detector switches, and intelligent control systems for seamless operation.
            </p>

            {/* Technology Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-violet-400">Core Components</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Advanced PCB technology</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">High-resolution OLED display</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Precision detector switches</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-400">Smart Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Intelligent control systems</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Real-time data processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Seamless user interface</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/25">
                <span className="relative z-10">Explore Technology</span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-violet-400 hover:border-purple-400 text-violet-300 hover:text-purple-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-violet-500/5 hover:bg-purple-500/10">
                <span className="relative z-10">View Specs</span>
              </button>
            </div>
          </div>

          {/* Right Side - Visual Elements */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className="relative w-full h-96 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 rounded-2xl border border-violet-500/20 backdrop-blur-sm overflow-hidden">
                
                {/* Electronic components visualization */}
                <div className="absolute inset-6 space-y-6">
                  {/* PCB representation */}
                  <div className="flex justify-center">
                    <div className="w-32 h-20 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-lg border border-violet-400/30 relative">
                      {/* Circuit lines */}
                      <div className="absolute inset-2 space-y-1">
                        <div className="h-0.5 bg-violet-400/60 rounded-full" />
                        <div className="h-0.5 bg-purple-400/60 rounded-full" />
                        <div className="h-0.5 bg-fuchsia-400/60 rounded-full" />
                      </div>
                      {/* Components */}
                      <div className="absolute top-1 left-2 w-2 h-2 bg-violet-400 rounded-full" />
                      <div className="absolute top-1 right-2 w-2 h-2 bg-purple-400 rounded-full" />
                      <div className="absolute bottom-1 left-1/2 w-2 h-2 bg-fuchsia-400 rounded-full transform -translate-x-1/2" />
                    </div>
                  </div>
                  
                  {/* OLED Display representation */}
                  <div className="flex justify-center">
                    <div className="w-24 h-16 bg-black border border-violet-400/40 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-1 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded animate-pulse" />
                      <div className="absolute top-1 left-1 right-1 h-0.5 bg-violet-400/60 rounded-full" />
                      <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-purple-400/60 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Data flow visualization */}
                  <div className="space-y-2">
                    <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse" />
                    <div className="h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full animate-pulse delay-200" />
                    <div className="h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Control indicators */}
                  <div className="flex justify-center space-x-4">
                    <div className="w-3 h-3 bg-violet-400/60 rounded-full animate-ping" />
                    <div className="w-3 h-3 bg-purple-400/60 rounded-full animate-ping delay-300" />
                    <div className="w-3 h-3 bg-fuchsia-400/60 rounded-full animate-ping delay-600" />
                  </div>
                </div>

                {/* Floating electronic elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-violet-400/60 rounded-full animate-bounce" />
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce delay-500" />
                <div className="absolute top-1/2 right-4 w-2 h-2 bg-fuchsia-400/60 rounded-full animate-bounce delay-1000" />
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
}
