'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'
import { useAppStore } from '../../../store/useAppStore'

interface StageConfig {
  model: any
  camera: any
  lighting: any
}

interface PresetsProps {
  stage1Config: StageConfig
  stage2Config: StageConfig
  stage3Config: StageConfig
}

export default function Presets({
  stage1Config,
  stage2Config,
  stage3Config
}: PresetsProps) {
  const { 
    modelControls, 
    cameraControls, 
    lightingControls,
    setModelControls, 
    setCameraControls, 
    setLightingControls,
    scrollPosition, 
    isClient
  } = useAppStore()
  const handleCopyAll = () => {
    const allValues = {
      model: modelControls,
      camera: cameraControls,
      lighting: lightingControls,
      scroll: {
        position: scrollPosition,
        maxScroll: isClient ? document.documentElement.scrollHeight - window.innerHeight : 0,
        progress: isClient ? Math.round((scrollPosition / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100) : 0
      }
    }
    navigator.clipboard.writeText(JSON.stringify(allValues, null, 2))
  }

  const handleResetAll = () => {
    setModelControls({
      position: { x: 0.9, y: -0.2, z: 0.3 },
      rotation: { x: -0.09, y: -0.78, z: 0.9 },
      scale: { x: 10, y: 10, z: 10 }
    })
    setCameraControls({
      position: { x: 0, y: 0, z: 5 },
      rotation: { x: 0, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 },
      fov: 75,
      near: 0.1,
      far: 1000,
      zoom: 1
    })
    setLightingControls({
      ambientIntensity: 0,
      ambientColor: '#404040',
      directionalIntensity: 0,
      directionalColor: '#ffffff',
      directionalPosition: { x: 5, y: 5, z: 5 },
      directionalTarget: { x: 0, y: 0, z: 0 },
      pointLightIntensity: 0.5,
      pointLightColor: '#ffffff',
      pointLightPosition: { x: -5, y: 5, z: 5 },
      pointLightDistance: 10,
      spotLightIntensity: 2,
      spotLightColor: '#e89191',
      spotLightPosition: { x: 0, y: 10, z: 0 },
      spotLightTarget: { x: 3.4, y: 0, z: 0 },
      spotLightDistance: 23,
      spotLightAngle: 23,
      spotLightPenumbra: 0,
      shadowsEnabled: true,
      shadowMapSize: 2048,
      shadowBias: -0.0001
    })
    // Reset scroll position to top
    if (isClient) {
      window.scrollTo(0, 0)
    }
  }

  const handleStage1Preset = () => {
    setModelControls({
      position: stage1Config.model.position,
      rotation: stage1Config.model.rotation,
      scale: stage1Config.model.scale
    })
    setCameraControls({
      position: stage1Config.camera.position || { x: 0, y: 0, z: 5 },
      rotation: stage1Config.camera.rotation || { x: 0, y: 0, z: 0 },
      target: stage1Config.camera.target || { x: 0, y: 0, z: 0 },
      fov: stage1Config.camera.fov || 75,
      near: stage1Config.camera.near || 0.1,
      far: stage1Config.camera.far || 1000,
      zoom: stage1Config.camera.zoom || 1
    })
    setLightingControls(stage1Config.lighting)
  }

  const handleStage2Preset = () => {
    setModelControls(stage2Config.model)
    setCameraControls(stage2Config.camera)
    setLightingControls(stage2Config.lighting)
  }

  const handleStage3Preset = () => {
    setModelControls(stage3Config.model)
    setCameraControls(stage3Config.camera)
    setLightingControls(stage3Config.lighting)
  }

  return (
    <CollapsibleSection
      title="Presets"
      icon="⚡"
      color="text-pink-400"
    >
      <div className="grid grid-cols-2 gap-1 mb-2">
        <button
          onClick={() => setModelControls({
            position: { x: 0.9, y: -0.2, z: 0.3 },
            rotation: { x: -0.09, y: -0.78, z: 0.9 },
            scale: { x: 10, y: 10, z: 10 }
          })}
          className="px-1 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          title="Stage 1 position"
        >
          🏠 Stage 1
        </button>
        <button
          onClick={handleStage1Preset}
          className="px-1 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
          title="Stage 1 position"
        >
          🎯 Stage 1
        </button>
        <button
          onClick={handleStage2Preset}
          className="px-1 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
          title="Stage 2 position"
        >
          🎯 Stage 2
        </button>
        <button
          onClick={handleStage3Preset}
          className="px-1 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          title="Stage 3 position"
        >
          🎯 Stage 3
        </button>
        <button
          onClick={() => setModelControls({
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: Math.PI / 4, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          })}
          className="px-1 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
          title="45° rotated"
        >
          🔄 Rotate
        </button>
        <button
          onClick={() => setModelControls({
            position: { x: 0, y: -1, z: 2 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 3, y: 3, z: 3 }
          })}
          className="px-1 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs"
          title="Close up view"
        >
          🔍 Close
        </button>
        <button
          onClick={() => setModelControls({
            position: { x: 0, y: -3, z: -2 },
            rotation: { x: 0, y: Math.PI, z: 0 },
            scale: { x: 1.5, y: 1.5, z: 1.5 }
          })}
          className="px-1 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
          title="Far view"
        >
          📐 Far
        </button>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleCopyAll}
          className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs flex-1"
          title="Copy all settings including scroll position"
        >
          📋 Copy All
        </button>
        <button
          onClick={handleResetAll}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs flex-1"
          title="Reset all settings"
        >
          🔄 Reset All
        </button>
      </div>
    </CollapsibleSection>
  )
}
