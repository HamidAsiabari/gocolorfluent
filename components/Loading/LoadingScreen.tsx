'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
  progress?: number
}

export default function LoadingScreen({ isLoading, progress = 0 }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [simulatedProgress, setSimulatedProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      // Animate progress bar smoothly using the higher of real or simulated progress
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          const targetProgress = Math.max(progress, simulatedProgress)
          const diff = targetProgress - prev
          if (Math.abs(diff) < 0.01) return targetProgress
          return prev + diff * 0.1
        })
      }, 16) // ~60fps

      return () => clearInterval(interval)
    } else {
      setDisplayProgress(100)
      // Add a longer delay before hiding to show completion and ensure minimum time
      setTimeout(() => {
        setIsVisible(false)
      }, 1200) // Increased delay for better visual feedback
    }
  }, [isLoading, progress, simulatedProgress])

  useEffect(() => {
    // Show content after a brief delay for smooth entrance
    const timer = setTimeout(() => setShowContent(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Simulate progress during minimum loading time
  useEffect(() => {
    if (isLoading) {
      const startTime = Date.now()
      const minLoadingTime = 2000 // 2 seconds
      
      const simulateProgress = () => {
        const elapsed = Date.now() - startTime
        const progressRatio = Math.min(elapsed / minLoadingTime, 1)
        
        // Simulate realistic loading progress
        let simulated = 0
        if (progressRatio < 0.3) {
          simulated = progressRatio * 20 // Slow start
        } else if (progressRatio < 0.7) {
          simulated = 20 + (progressRatio - 0.3) * 40 // Steady progress
        } else {
          simulated = 60 + (progressRatio - 0.7) * 30 // Final push
        }
        
        setSimulatedProgress(Math.min(simulated, 95)) // Cap at 95% until real progress completes
        
        if (progressRatio < 1) {
          requestAnimationFrame(simulateProgress)
        }
      }
      
      requestAnimationFrame(simulateProgress)
    }
  }, [isLoading])

  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center transition-opacity duration-500 ${!isLoading ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Elements - Matching Hero Section */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white space-y-12 max-w-5xl mx-auto px-6">
        {/* Hero Title - Matching Section 1 */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 leading-[0.9] tracking-tight loading-text-glow">
            Color
          </h1>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-[0.9] tracking-tight -mt-4 loading-float">
            Fluent
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className={`transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-2xl md:text-3xl lg:text-4xl font-light text-gray-200 max-w-4xl mx-auto leading-relaxed tracking-wide">
            Professional Color Solutions
          </p>
        </div>

        {/* Loading Progress Section */}
        <div className={`transition-all duration-1000 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-md mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm loading-glow">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out loading-progress-bar loading-shimmer"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
              <div className="text-lg text-gray-300 font-light">
                {Math.round(displayProgress)}% Complete
              </div>
            </div>

            {/* Loading Messages */}
            <div className="text-lg text-gray-300 space-y-2 font-light">
              {displayProgress < 20 && <p className="loading-pulse">Initializing 3D environment...</p>}
              {displayProgress >= 20 && displayProgress < 50 && <p className="loading-pulse">Loading 3D models...</p>}
              {displayProgress >= 50 && displayProgress < 80 && <p className="loading-pulse">Setting up lighting...</p>}
              {displayProgress >= 80 && displayProgress < 100 && <p className="loading-pulse">Finalizing experience...</p>}
              {displayProgress >= 100 && <p className="text-green-400">Ready to explore!</p>}
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center space-x-3 mt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
            
            {/* Minimum Loading Time Indicator */}
            <div className="text-sm text-gray-400 mt-4 opacity-70">
              Ensuring optimal experience...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
