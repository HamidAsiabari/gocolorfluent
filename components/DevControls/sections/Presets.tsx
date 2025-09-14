'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'

interface ModelControls {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

interface CameraControls {
  position: { x: number; y: number; z: number }
  fov: number
}

interface LightingControls {
  ambientIntensity: number
  ambientColor: string
  directionalIntensity: number
  directionalColor: string
  directionalPosition: { x: number; y: number; z: number }
  directionalTarget: { x: number; y: number; z: number }
  pointLightIntensity: number
  pointLightColor: string
  pointLightPosition: { x: number; y: number; z: number }
  pointLightDistance: number
  spotLightIntensity: number
  spotLightColor: string
  spotLightPosition: { x: number; y: number; z: number }
  spotLightTarget: { x: number; y: number; z: number }
  spotLightDistance: number
  spotLightAngle: number
  spotLightPenumbra: number
  shadowsEnabled: boolean
  shadowMapSize: number
  shadowBias: number
}

interface StageConfig {
  model: ModelControls
  camera: CameraControls
  lighting: LightingControls
}

interface PresetsProps {
  modelControls: ModelControls
  onModelControlsChange: (controls: ModelControls) => void
  cameraControls: CameraControls
  onCameraControlsChange: (controls: CameraControls) => void
  lightingControls: LightingControls
  onLightingControlsChange: (controls: LightingControls) => void
  scrollPosition: number
  isClient: boolean
  stage1Config: StageConfig
  stage2Config: StageConfig
  stage3Config: StageConfig
}

export default function Presets({
  modelControls,
  onModelControlsChange,
  cameraControls,
  onCameraControlsChange,
  lightingControls,
  onLightingControlsChange,
  scrollPosition,
  isClient,
  stage1Config,
  stage2Config,
  stage3Config
}: PresetsProps) {
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
    onModelControlsChange({
      position: { x: 2, y: -0.3, z: 0 },
      rotation: { x: -0.03, y: 0.1, z: 0.27 },
      scale: { x: 10, y: 10, z: 10 }
    })
    onCameraControlsChange({
      position: { x: 0, y: 0, z: 5 },
      fov: 75
    })
    onLightingControlsChange({
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
    onModelControlsChange({
      position: stage1Config.model.position,
      rotation: stage1Config.model.rotation,
      scale: stage1Config.model.scale
    })
    onCameraControlsChange({
      position: stage1Config.camera.position,
      fov: stage1Config.camera.fov
    })
    onLightingControlsChange(stage1Config.lighting)
  }

  const handleStage2Preset = () => {
    onModelControlsChange(stage2Config.model)
    onCameraControlsChange(stage2Config.camera)
    onLightingControlsChange(stage2Config.lighting)
  }

  const handleStage3Preset = () => {
    onModelControlsChange(stage3Config.model)
    onCameraControlsChange(stage3Config.camera)
    onLightingControlsChange(stage3Config.lighting)
  }

  return (
    <CollapsibleSection
      title="Presets"
      icon="⚡"
      color="text-pink-400"
    >
      <div className="grid grid-cols-2 gap-1 mb-2">
        <button
          onClick={() => onModelControlsChange({
            position: { x: 2, y: -0.3, z: 0 },
            rotation: { x: -0.03, y: 0.1, z: 0.27 },
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
          onClick={() => onModelControlsChange({
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
          onClick={() => onModelControlsChange({
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
          onClick={() => onModelControlsChange({
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
