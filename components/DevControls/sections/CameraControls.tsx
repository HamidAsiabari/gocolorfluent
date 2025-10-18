'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'
import { useAppStore } from '../../../store/useAppStore'

export default function CameraControls() {
  const { cameraControls, setCameraControls } = useAppStore()
  return (
    <CollapsibleSection
      title="Camera"
      icon="📷"
      color="text-cyan-400"
    >
      <div className="space-y-1">
        <div>
          <label className="text-xs text-gray-300">Field of View: {cameraControls.fov}°</label>
          <input
            type="range"
            min="10"
            max="120"
            value={cameraControls.fov}
            onChange={(e) => setCameraControls({
              ...cameraControls,
              fov: parseFloat(e.target.value)
            })}
            className="w-full h-1"
          />
        </div>
        <div>
          <label className="text-xs text-gray-300">Position</label>
          <div className="grid grid-cols-3 gap-1">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="flex flex-col">
                <label className="text-xs text-gray-400 uppercase">{axis}</label>
                <input
                  type="number"
                  step="0.1"
                  value={cameraControls.position[axis as keyof typeof cameraControls.position]}
                  onChange={(e) => setCameraControls({
                    ...cameraControls,
                    position: { ...cameraControls.position, [axis]: parseFloat(e.target.value) || 0 }
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
