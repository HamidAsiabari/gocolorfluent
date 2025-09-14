'use client'

import React from 'react'

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

interface LightingControlsProps {
  lightingControls: LightingControls
  onLightingControlsChange: (controls: LightingControls) => void
}

export default function LightingControls({
  lightingControls,
  onLightingControlsChange
}: LightingControlsProps) {
  return (
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
  )
}
