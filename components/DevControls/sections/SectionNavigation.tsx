'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface SectionNavigationProps {
  currentSection: number
  isScrolling: boolean
  scrollDirection: 'up' | 'down' | null
  transitionName: string | null
}

export default function SectionNavigation({
  currentSection,
  isScrolling,
  scrollDirection,
  transitionName
}: SectionNavigationProps) {
  return (
    <CollapsibleSection
      title="Sections"
      icon="📍"
      color="text-blue-400"
    >
      <div className="space-y-1">
        <div>
          <label className="text-xs text-gray-300">
            Current: {currentSection}/8
          </label>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / 8) * 100}%` }}
            />
          </div>
        </div>
        {isScrolling && (
          <div className="text-xs text-yellow-400 animate-pulse">
            Transitioning {scrollDirection === 'down' ? '↓' : '↑'}
          </div>
        )}
        {transitionName && (
          <div className="text-xs text-blue-400">
            {transitionName}
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}
