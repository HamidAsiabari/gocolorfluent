'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface Stage3DIndicatorProps {
  current3DStage: number
  stage3DAnimationProgress: number
}

export default function Stage3DIndicator({
  current3DStage,
  stage3DAnimationProgress
}: Stage3DIndicatorProps) {
  return (
    <CollapsibleSection
      title="3D Stage"
      icon="🎯"
      color="text-orange-400"
    >
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
    </CollapsibleSection>
  )
}
