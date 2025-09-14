'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface ModelControls {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

interface ModelControlsProps {
  modelControls: ModelControls
  onModelControlsChange: (controls: ModelControls) => void
}

export default function ModelControls({
  modelControls,
  onModelControlsChange
}: ModelControlsProps) {
  return (
    <CollapsibleSection
      title="Model"
      icon="📍"
      color="text-blue-400"
    >
      <div className="space-y-1">
        {/* Position */}
        <div>
          <label className="text-xs text-gray-300">Position</label>
          <div className="grid grid-cols-3 gap-1">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase">{axis}</label>
                <input
                  type="number"
                  step="0.1"
                  value={modelControls.position[axis as keyof typeof modelControls.position]}
                  onChange={(e) => onModelControlsChange({
                    ...modelControls,
                    position: { ...modelControls.position, [axis]: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Rotation */}
        <div>
          <label className="text-xs text-gray-300">Rotation</label>
          <div className="grid grid-cols-3 gap-1">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase">{axis}</label>
                <input
                  type="number"
                  step="0.01"
                  value={modelControls.rotation[axis as keyof typeof modelControls.rotation]}
                  onChange={(e) => onModelControlsChange({
                    ...modelControls,
                    rotation: { ...modelControls.rotation, [axis]: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Scale */}
        <div>
          <label className="text-xs text-gray-300">Scale</label>
          <div className="grid grid-cols-3 gap-1">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase">{axis}</label>
                <input
                  type="number"
                  step="0.1"
                  value={modelControls.scale[axis as keyof typeof modelControls.scale]}
                  onChange={(e) => onModelControlsChange({
                    ...modelControls,
                    scale: { ...modelControls.scale, [axis]: parseFloat(e.target.value) || 1 }
                  })}
                  className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
