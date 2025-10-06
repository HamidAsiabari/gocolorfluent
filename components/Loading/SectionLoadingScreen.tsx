'use client'

import { useEffect, useState } from 'react'

interface SectionLoadingScreenProps {
  isVisible: boolean
  fromSection: number
  toSection: number
}

// Section titles mapping
const SECTION_TITLES: { [key: number]: string } = {
  1: 'Home',
  2: 'Advanced Detection Systems',
  3: 'Precision Mechanics',
  4: 'Smart Electronics',
  5: 'Professional Lighting',
  6: 'Intuitive Controls',
  7: 'Technical Specifications',
  8: 'Contact Us'
}

export default function SectionLoadingScreen({ 
  isVisible, 
  fromSection, 
  toSection 
}: SectionLoadingScreenProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Show content after a brief delay for smooth entrance
      const timer = setTimeout(() => setShowContent(true), 100)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  const sectionDistance = Math.abs(toSection - fromSection)
  const direction = toSection > fromSection ? 'down' : 'up'

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50" />
        
        {/* Minimal grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center text-white space-y-8 max-w-2xl mx-auto px-6">
        {/* Loading Animation */}
        <div className={`transition-all duration-500 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="flex justify-center space-x-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Section Navigation Info */}
        <div className={`transition-all duration-500 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h2 className="text-2xl md:text-3xl font-light text-gray-200 mb-2">
            Navigating to {SECTION_TITLES[toSection] || `Section ${toSection}`}
          </h2>
          <p className="text-lg text-gray-400 font-light">
            {sectionDistance === 1 
              ? `Moving ${direction === 'down' ? 'forward' : 'backward'} one section`
              : `Jumping ${sectionDistance} sections ${direction === 'down' ? 'forward' : 'backward'}`
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className={`transition-all duration-500 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-48 h-1 bg-gray-700/50 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading Message */}
        <div className={`transition-all duration-500 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-sm text-gray-500 font-light">
            Preparing section content...
          </p>
        </div>
      </div>
    </div>
  )
}
