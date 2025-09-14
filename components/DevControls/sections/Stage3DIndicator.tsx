'use client'

import React from 'react'

interface Stage3DIndicatorProps {
  current3DStage: number
  stage3DAnimationProgress: number
}

export default function Stage3DIndicator({
  current3DStage,
  stage3DAnimationProgress
}: Stage3DIndicatorProps) {
  return (
    <div className="bg-gray-800/50 p-2 rounded">
      <h4 className="text-xs font-medium text-orange-400 mb-1">🎯 3D Stage</h4>
      <div className="space-y-1">
        <div className="text-xs text-gray-300">
          Current: Stage {current3DStage}
        </div>
        {stage3DAnimationProgress > 0 && (
          <div className="text-xs text-yellow-400">
            Animating: {Math.round(stage3DAnimationProgress * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}
