'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface ScrollPositionProps {
  scrollPosition: number
  isClient: boolean
}

export default function ScrollPosition({
  scrollPosition,
  isClient
}: ScrollPositionProps) {
  return (
    <CollapsibleSection
      title="Scroll Position"
      icon="📜"
      color="text-purple-400"
    >
      <div className="space-y-1">
        <div>
          <label className="text-xs text-gray-300">
            Current: {isClient ? `${scrollPosition}px` : '0px'}
          </label>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-100"
              style={{ 
                width: isClient ? `${Math.min((scrollPosition / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100, 100)}%` : '0%'
              }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-400">
          <div>Max: {isClient ? `${document.documentElement.scrollHeight - window.innerHeight}px` : '0px'}</div>
          <div>Progress: {isClient ? `${Math.round((scrollPosition / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100)}%` : '0%'}</div>
        </div>
        <div className="text-xs text-green-400 font-medium">
          {isClient ? '🟢 Live Tracking' : '🟡 Initializing...'}
        </div>
      </div>
    </CollapsibleSection>
  )
}
