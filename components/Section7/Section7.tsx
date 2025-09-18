'use client'

import { useEffect, useState } from 'react'

interface Section7Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

export default function Section7({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section7Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 7) {
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
        transform: `translateY(${isClient ? (7 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-gray-900/10 to-zinc-900/20" />
        
        {/* Technical-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-slate-400/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-24 left-16 w-32 h-32 border-2 border-gray-400/20 rounded-full animate-spin" style={{ animationDuration: '24s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-zinc-500/10 to-slate-500/10 rounded-full blur-xl" />
        
        {/* Technical patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-slate-400/30 rounded-full animate-spin" style={{ animationDuration: '18s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-gray-400/30 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Section Indicator */}
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-slate-500/30 shadow-lg">
        <span className="text-slate-400 text-sm font-mono tracking-wider">Section 7</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Visual Elements */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative">
              {/* Main visual container */}
              <div className="relative w-full h-96 bg-gradient-to-br from-slate-900/30 to-zinc-900/30 rounded-2xl border border-slate-500/20 backdrop-blur-sm overflow-hidden">
                
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
                    <div className="h-1 bg-gradient-to-r from-slate-500 to-gray-500 rounded-full animate-pulse" />
                    <div className="h-1 bg-gradient-to-r from-gray-500 to-zinc-500 rounded-full animate-pulse delay-200" />
                    <div className="h-1 bg-gradient-to-r from-zinc-500 to-slate-500 rounded-full animate-pulse delay-400" />
                  </div>
                  
                  {/* Component indicators */}
                  <div className="flex justify-center space-x-4">
                    <div className="w-6 h-6 bg-slate-400/60 rounded-full animate-ping" />
                    <div className="w-4 h-4 bg-gray-400/60 rounded-full animate-ping delay-300" />
                    <div className="w-5 h-5 bg-zinc-400/60 rounded-full animate-ping delay-600" />
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
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Section Title */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-gray-400 leading-tight">
                Technical
              </h2>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-zinc-400 leading-tight">
                Specifications
              </h2>
            </div>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Professional-grade components including micro-gear motors, precision sensors, and advanced electronic systems for reliable performance.
            </p>

            {/* Technical Details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-400">Core Components</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">Micro-gear motor technology</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">Precision sensor arrays</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Advanced electronic systems</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-400">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                    <span className="text-gray-300">98.5% operational efficiency</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                    <span className="text-gray-300">±0.01mm precision accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse delay-400" />
                    <span className="text-gray-300">Professional-grade reliability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-slate-500/25">
                <span className="relative z-10">View Full Specs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              </button>
              
              <button className="group px-8 py-4 border-2 border-slate-400 hover:border-gray-400 text-slate-300 hover:text-gray-300 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm bg-slate-500/5 hover:bg-gray-500/10">
                <span className="relative z-10">Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
