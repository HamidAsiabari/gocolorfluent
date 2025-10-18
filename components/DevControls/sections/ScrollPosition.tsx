'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'
import { useAppStore } from '../../../store/useAppStore'

export default function ScrollPosition() {
  const { scrollPosition, isClient } = useAppStore()
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
                width: isClient ? `${Math.min((scrollPosition / Math.max((typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0) - (typeof window !== 'undefined' ? window.innerHeight : 0), 1)) * 100, 100)}%` : '0%'
              }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-400">
          <div>Max: {isClient ? `${(typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0) - (typeof window !== 'undefined' ? window.innerHeight : 0)}px` : '0px'}</div>
          <div>Progress: {isClient ? `${Math.round((scrollPosition / Math.max((typeof document !== 'undefined' ? document.documentElement.scrollHeight : 0) - (typeof window !== 'undefined' ? window.innerHeight : 0), 1)) * 100)}%` : '0%'}</div>
        </div>
        <div className="text-xs text-green-400 font-medium">
          {isClient ? '🟢 Live Tracking' : '🟡 Initializing...'}
        </div>
      </div>
    </CollapsibleSection>
  )
}
