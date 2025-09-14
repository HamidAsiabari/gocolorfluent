'use client'

import React from 'react'

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

interface DevControlsProps {
  isDevMode: boolean
  onToggleDevMode: () => void
  modelControls: ModelControls
  onModelControlsChange: (controls: ModelControls) => void
  cameraControls: CameraControls
  onCameraControlsChange: (controls: CameraControls) => void
  lightingControls: LightingControls
  onLightingControlsChange: (controls: LightingControls) => void
  currentSection: number
  isScrolling: boolean
  scrollDirection: 'up' | 'down' | null
  transitionName: string | null
  scrollPosition: number
  isClient: boolean
  stage1Config: StageConfig
  stage2Config: StageConfig
  stage3Config: StageConfig
  current3DStage: number
  stage3DAnimationProgress: number
}

export default function DevControls({
  isDevMode,
  onToggleDevMode,
  modelControls,
  onModelControlsChange,
  cameraControls,
  onCameraControlsChange,
  lightingControls,
  onLightingControlsChange,
  currentSection,
  isScrolling,
  scrollDirection,
  transitionName,
  scrollPosition,
  isClient,
  stage1Config,
  stage2Config,
  stage3Config,
  current3DStage,
  stage3DAnimationProgress
}: DevControlsProps) {
  if (!isDevMode) return null

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
    <div className="fixed bottom-4 left-4 z-20 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-2 text-white max-w-80 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2 sticky top-0 bg-black/90">
        <h3 className="text-sm font-semibold text-green-400">🎮 Dev</h3>
        <button
          onClick={onToggleDevMode}
          className="text-gray-400 hover:text-white text-xs p-1 hover:bg-gray-700 rounded"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        {/* 3D Stage Indicator */}
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

        {/* Model Controls - Combined */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-blue-400 mb-1">📍 Model</h4>
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
        </div>

        {/* Camera Controls */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-cyan-400 mb-1">📷 Camera</h4>
          <div className="space-y-1">
            <div>
              <label className="text-xs text-gray-300">Field of View: {cameraControls.fov}°</label>
              <input
                type="range"
                min="10"
                max="120"
                value={cameraControls.fov}
                onChange={(e) => onCameraControlsChange({
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
                      onChange={(e) => onCameraControlsChange({
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
        </div>

        {/* Section Navigation */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-blue-400 mb-1">📍 Sections</h4>
          <div className="space-y-1">
            <div>
              <label className="text-xs text-gray-300">
                Current: {currentSection}/8
              </label>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentSection / 8) * 100}%` }}
                />
              </div>
            </div>
            {isScrolling && (
              <div className="text-xs text-yellow-400 animate-pulse">
                Transitioning {scrollDirection === 'down' ? '↓' : '↑'}
              </div>
            )}
            {transitionName && (
              <div className="text-xs text-blue-400">
                {transitionName}
              </div>
            )}
          </div>
        </div>

        {/* Scroll Position */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-purple-400 mb-1">📜 Scroll Position</h4>
          <div className="space-y-1">
            <div>
              <label className="text-xs text-gray-300">
                Current: {isClient ? `${scrollPosition}px` : '0px'}
              </label>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-100"
                  style={{ 
                    width: isClient ? `${Math.min((scrollPosition / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100, 100)}%` : '0%'
                  }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-400">
              <div>Max: {isClient ? `${document.documentElement.scrollHeight - window.innerHeight}px` : '0px'}</div>
              <div>Progress: {isClient ? `${Math.round((scrollPosition / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)) * 100)}%` : '0%'}</div>
            </div>
            <div className="text-xs text-green-400 font-medium">
              {isClient ? '🟢 Live Tracking' : '🟡 Initializing...'}
            </div>
          </div>
        </div>

        {/* Comprehensive Lighting Controls */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-yellow-300 mb-1">💡 Lighting</h4>
          <div className="space-y-2">
            {/* Ambient Light */}
            <div className="border-b border-gray-600 pb-1">
              <h5 className="text-xs text-gray-400 mb-1">Ambient</h5>
              <div className="space-y-1">
                <div>
                  <label className="text-xs text-gray-300">Intensity: {lightingControls.ambientIntensity}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={lightingControls.ambientIntensity}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      ambientIntensity: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Color</label>
                  <input
                    type="color"
                    value={lightingControls.ambientColor}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      ambientColor: e.target.value
                    })}
                    className="w-full h-6 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Directional Light */}
            <div className="border-b border-gray-600 pb-1">
              <h5 className="text-xs text-gray-400 mb-1">Directional</h5>
              <div className="space-y-1">
                <div>
                  <label className="text-xs text-gray-300">Intensity: {lightingControls.directionalIntensity}</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={lightingControls.directionalIntensity}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      directionalIntensity: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Color</label>
                  <input
                    type="color"
                    value={lightingControls.directionalColor}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      directionalColor: e.target.value
                    })}
                    className="w-full h-6 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Position</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['x', 'y', 'z'].map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        placeholder={axis}
                        value={lightingControls.directionalPosition[axis as keyof typeof lightingControls.directionalPosition]}
                        onChange={(e) => onLightingControlsChange({
                          ...lightingControls,
                          directionalPosition: { ...lightingControls.directionalPosition, [axis]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Target</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['x', 'y', 'z'].map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        placeholder={axis}
                        value={lightingControls.directionalTarget[axis as keyof typeof lightingControls.directionalTarget]}
                        onChange={(e) => onLightingControlsChange({
                          ...lightingControls,
                          directionalTarget: { ...lightingControls.directionalTarget, [axis]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Point Light */}
            <div className="border-b border-gray-600 pb-1">
              <h5 className="text-xs text-gray-400 mb-1">Point Light</h5>
              <div className="space-y-1">
                <div>
                  <label className="text-xs text-gray-300">Intensity: {lightingControls.pointLightIntensity}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={lightingControls.pointLightIntensity}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      pointLightIntensity: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Color</label>
                  <input
                    type="color"
                    value={lightingControls.pointLightColor}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      pointLightColor: e.target.value
                    })}
                    className="w-full h-6 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Position</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['x', 'y', 'z'].map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        placeholder={axis}
                        value={lightingControls.pointLightPosition[axis as keyof typeof lightingControls.pointLightPosition]}
                        onChange={(e) => onLightingControlsChange({
                          ...lightingControls,
                          pointLightPosition: { ...lightingControls.pointLightPosition, [axis]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Distance: {lightingControls.pointLightDistance}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={lightingControls.pointLightDistance}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      pointLightDistance: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
              </div>
            </div>

            {/* Spot Light */}
            <div className="border-b border-gray-600 pb-1">
              <h5 className="text-xs text-gray-400 mb-1">Spot Light</h5>
              <div className="space-y-1">
                <div>
                  <label className="text-xs text-gray-300">Intensity: {lightingControls.spotLightIntensity}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={lightingControls.spotLightIntensity}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      spotLightIntensity: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Color</label>
                  <input
                    type="color"
                    value={lightingControls.spotLightColor}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      spotLightColor: e.target.value
                    })}
                    className="w-full h-6 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Position</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['x', 'y', 'z'].map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        placeholder={axis}
                        value={lightingControls.spotLightPosition[axis as keyof typeof lightingControls.spotLightPosition]}
                        onChange={(e) => onLightingControlsChange({
                          ...lightingControls,
                          spotLightPosition: { ...lightingControls.spotLightPosition, [axis]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Target</label>
                  <div className="grid grid-cols-3 gap-1">
                    {['x', 'y', 'z'].map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        placeholder={axis}
                        value={lightingControls.spotLightTarget[axis as keyof typeof lightingControls.spotLightTarget]}
                        onChange={(e) => onLightingControlsChange({
                          ...lightingControls,
                          spotLightTarget: { ...lightingControls.spotLightTarget, [axis]: parseFloat(e.target.value) || 0 }
                        })}
                        className="w-full px-1 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Angle: {lightingControls.spotLightAngle}°</label>
                  <input
                    type="range"
                    min="5"
                    max="90"
                    step="1"
                    value={lightingControls.spotLightAngle}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      spotLightAngle: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Penumbra: {lightingControls.spotLightPenumbra}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lightingControls.spotLightPenumbra}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      spotLightPenumbra: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Distance: {lightingControls.spotLightDistance}</label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    step="1"
                    value={lightingControls.spotLightDistance}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      spotLightDistance: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
              </div>
            </div>

            {/* Shadow Controls */}
            <div>
              <h5 className="text-xs text-gray-400 mb-1">Shadows</h5>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lightingControls.shadowsEnabled}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      shadowsEnabled: e.target.checked
                    })}
                    className="w-3 h-3"
                  />
                  <label className="text-xs text-gray-300">Enable Shadows</label>
                </div>
                <div>
                  <label className="text-xs text-gray-300">Map Size: {lightingControls.shadowMapSize}</label>
                  <input
                    type="range"
                    min="512"
                    max="4096"
                    step="512"
                    value={lightingControls.shadowMapSize}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      shadowMapSize: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300">Bias: {lightingControls.shadowBias}</label>
                  <input
                    type="range"
                    min="-0.001"
                    max="0.001"
                    step="0.0001"
                    value={lightingControls.shadowBias}
                    onChange={(e) => onLightingControlsChange({
                      ...lightingControls,
                      shadowBias: parseFloat(e.target.value)
                    })}
                    className="w-full h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presets & Actions - Combined */}
        <div className="bg-gray-800/50 p-2 rounded">
          <h4 className="text-xs font-medium text-pink-400 mb-1">⚡ Presets</h4>
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
        </div>
      </div>
    </div>
  )
}
