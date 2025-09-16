'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface Stage3DIndicatorProps {
  current3DStage: number
  stage3DAnimationProgress: number
  setCurrent3DStage: (stage: number) => void
}

export default function Stage3DIndicator({
  current3DStage,
  stage3DAnimationProgress,
  setCurrent3DStage
}: Stage3DIndicatorProps) {
  return (
    <CollapsibleSection
      title="3D Stage"
      icon="🎯"
      color="text-orange-400"
    >
      <div className="space-y-2">
        <div className="text-xs text-gray-300">
          Current: Stage {current3DStage}
        </div>
        {stage3DAnimationProgress > 0 && (
          <div className="text-xs text-yellow-400">
            Animating: {Math.round(stage3DAnimationProgress * 100)}%
          </div>
        )}
        
        {/* Stage 4 Button */}
        <button
          onClick={() => setCurrent3DStage(4)}
          className={`w-full px-2 py-1 text-xs rounded ${
            current3DStage === 4 
              ? 'bg-orange-600 text-white' 
              : 'bg-orange-800 text-orange-200 hover:bg-orange-700'
          }`}
        >
          🚀 Go to Stage 4
        </button>
        
        {/* Reset to Stage 1 Button */}
        <button
          onClick={() => setCurrent3DStage(1)}
          className="w-full px-2 py-1 text-xs rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
        >
          🔄 Reset to Stage 1
        </button>
      </div>
    </CollapsibleSection>
  )
}
