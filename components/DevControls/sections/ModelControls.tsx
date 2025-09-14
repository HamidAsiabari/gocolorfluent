'use client'

import React, { useRef } from 'react'
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
  // Refs for input elements to get actual values
  const positionRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const rotationRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const scaleRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const copyModelConfig = () => {
    // Get actual values from input fields
    const position = {
      x: parseFloat(positionRefs.current.x?.value || '0'),
      y: parseFloat(positionRefs.current.y?.value || '0'),
      z: parseFloat(positionRefs.current.z?.value || '0')
    }
    
    const rotation = {
      x: parseFloat(rotationRefs.current.x?.value || '0'),
      y: parseFloat(rotationRefs.current.y?.value || '0'),
      z: parseFloat(rotationRefs.current.z?.value || '0')
    }
    
    const scale = {
      x: parseFloat(scaleRefs.current.x?.value || '1'),
      y: parseFloat(scaleRefs.current.y?.value || '1'),
      z: parseFloat(scaleRefs.current.z?.value || '1')
    }

    const config = {
      model: {
        position: {
          x: parseFloat(position.x.toFixed(3)),
          y: parseFloat(position.y.toFixed(3)),
          z: parseFloat(position.z.toFixed(3))
        },
        rotation: {
          x: parseFloat(rotation.x.toFixed(3)),
          y: parseFloat(rotation.y.toFixed(3)),
          z: parseFloat(rotation.z.toFixed(3))
        },
        scale: {
          x: parseFloat(scale.x.toFixed(3)),
          y: parseFloat(scale.y.toFixed(3)),
          z: parseFloat(scale.z.toFixed(3))
        }
      },
      timestamp: new Date().toISOString(),
      description: "Model configuration"
    }

    const configString = JSON.stringify(config, null, 2)
    
    navigator.clipboard.writeText(configString).then(() => {
      console.log('Model config copied to clipboard:', config)
      // You could add a toast notification here if you have one
    }).catch(err => {
      console.error('Failed to copy model config:', err)
    })
  }
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
                  ref={(el) => positionRefs.current[axis] = el}
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
                  ref={(el) => rotationRefs.current[axis] = el}
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
                  ref={(el) => scaleRefs.current[axis] = el}
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
        
        {/* Copy Button */}
        <div className="pt-2">
          <button
            onClick={copyModelConfig}
            className="w-full px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            📋 Copy Model Config
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
