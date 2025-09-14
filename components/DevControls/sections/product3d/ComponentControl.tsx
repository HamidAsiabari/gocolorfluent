'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import { ComponentTransform } from './types'

interface ComponentControlProps {
  title: string
  icon?: string
  color?: string
  transform: ComponentTransform
  onTransformChange: (transform: ComponentTransform) => void
}

export default function ComponentControl({
  title,
  icon = "🔧",
  color = "text-gray-400",
  transform,
  onTransformChange
}: ComponentControlProps) {
  const updateTransform = (field: keyof ComponentTransform, value: any) => {
    onTransformChange({
      ...transform,
      [field]: value
    })
  }

  const updatePosition = (axis: 'x' | 'y' | 'z', value: number) => {
    updateTransform('position', {
      ...transform.position,
      [axis]: value
    })
  }

  const updateRotation = (axis: 'x' | 'y' | 'z', value: number) => {
    updateTransform('rotation', {
      ...transform.rotation,
      [axis]: value
    })
  }

  const updateScale = (axis: 'x' | 'y' | 'z', value: number) => {
    updateTransform('scale', {
      ...transform.scale,
      [axis]: value
    })
  }

  return (
    <CollapsibleSection
      title={title}
      icon={icon}
      color={color}
      defaultExpanded={false}
    >
      <div className="space-y-1">
        {/* Visibility Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-300">Visible</label>
          <input
            type="checkbox"
            checked={transform.visible}
            onChange={(e) => updateTransform('visible', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>

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
                  value={transform.position[axis as keyof typeof transform.position]}
                  onChange={(e) => updatePosition(axis as 'x' | 'y' | 'z', parseFloat(e.target.value) || 0)}
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
                  value={transform.rotation[axis as keyof typeof transform.rotation]}
                  onChange={(e) => updateRotation(axis as 'x' | 'y' | 'z', parseFloat(e.target.value) || 0)}
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
                  value={transform.scale[axis as keyof typeof transform.scale]}
                  onChange={(e) => updateScale(axis as 'x' | 'y' | 'z', parseFloat(e.target.value) || 1)}
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
