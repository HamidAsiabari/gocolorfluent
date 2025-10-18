'use client'

import React, { useRef } from 'react'
import CollapsibleSection from './CollapsibleSection'
import { useAppStore } from '../../../store/useAppStore'

export default function ModelCameraControls() {
  const { modelControls, setModelControls, cameraControls, setCameraControls } = useAppStore()
  
  // Refs for input elements to get actual values
  const positionRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const rotationRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const scaleRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const cameraPositionRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const fovRef = useRef<HTMLInputElement | null>(null)

  const copyModelCameraConfig = () => {
    // Get actual values from input fields
    const modelPosition = {
      x: parseFloat(positionRefs.current.x?.value || '0'),
      y: parseFloat(positionRefs.current.y?.value || '0'),
      z: parseFloat(positionRefs.current.z?.value || '0')
    }
    
    const modelRotation = {
      x: parseFloat(rotationRefs.current.x?.value || '0'),
      y: parseFloat(rotationRefs.current.y?.value || '0'),
      z: parseFloat(rotationRefs.current.z?.value || '0')
    }
    
    const modelScale = {
      x: parseFloat(scaleRefs.current.x?.value || '1'),
      y: parseFloat(scaleRefs.current.y?.value || '1'),
      z: parseFloat(scaleRefs.current.z?.value || '1')
    }

    const cameraPosition = {
      x: parseFloat(cameraPositionRefs.current.x?.value || '0'),
      y: parseFloat(cameraPositionRefs.current.y?.value || '0'),
      z: parseFloat(cameraPositionRefs.current.z?.value || '5')
    }

    const fov = parseFloat(fovRef.current?.value || '75')

    const config = {
      model: {
        position: {
          x: parseFloat(modelPosition.x.toFixed(3)),
          y: parseFloat(modelPosition.y.toFixed(3)),
          z: parseFloat(modelPosition.z.toFixed(3))
        },
        rotation: {
          x: parseFloat(modelRotation.x.toFixed(3)),
          y: parseFloat(modelRotation.y.toFixed(3)),
          z: parseFloat(modelRotation.z.toFixed(3))
        },
        scale: {
          x: parseFloat(modelScale.x.toFixed(3)),
          y: parseFloat(modelScale.y.toFixed(3)),
          z: parseFloat(modelScale.z.toFixed(3))
        }
      },
      camera: {
        position: {
          x: parseFloat(cameraPosition.x.toFixed(3)),
          y: parseFloat(cameraPosition.y.toFixed(3)),
          z: parseFloat(cameraPosition.z.toFixed(3))
        },
        fov: parseFloat(fov.toFixed(1))
      },
      timestamp: new Date().toISOString(),
      description: "Model and Camera configuration"
    }

    const configString = JSON.stringify(config, null, 2)
    
    navigator.clipboard.writeText(configString).then(() => {
      alert('Model and Camera configuration copied to clipboard!')
    }).catch(err => {
      alert('Failed to copy configuration to clipboard')
    })
  }

  return (
    <CollapsibleSection
      title="Model & Camera"
      icon="🎯"
      color="text-blue-400"
    >
      <div className="space-y-3">
        {/* Model Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-blue-300 border-b border-gray-600 pb-1">Model</h4>
          
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
                    onChange={(e) => setModelControls({
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
                    onChange={(e) => setModelControls({
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
                    onChange={(e) => setModelControls({
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

        {/* Camera Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-cyan-300 border-b border-gray-600 pb-1">Camera</h4>
          
          {/* Field of View */}
          <div>
            <label className="text-xs text-gray-300">Field of View: {cameraControls.fov}°</label>
            <input
              ref={fovRef}
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

          {/* Camera Position */}
          <div>
            <label className="text-xs text-gray-300">Position</label>
            <div className="grid grid-cols-3 gap-1">
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis} className="flex flex-col">
                  <label className="text-xs text-gray-400 uppercase">{axis}</label>
                  <input
                    ref={(el) => cameraPositionRefs.current[axis] = el}
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
        
        {/* Copy Button */}
        <div className="pt-2 border-t border-gray-600">
          <button
            onClick={copyModelCameraConfig}
            className="w-full px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            📋 Copy Model & Camera Config
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
