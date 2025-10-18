'use client'

import React, { useState } from 'react'
import CollapsibleSection from './CollapsibleSection'
import { useAppStore } from '../../../store/useAppStore'

export default function LightingControls() {
  const { lightingControls, setLightingControls } = useAppStore()
  const [copySuccess, setCopySuccess] = useState(false)

  const copyLightingValues = async () => {
    try {
      const lightingJson = JSON.stringify(lightingControls, null, 2)
      await navigator.clipboard.writeText(lightingJson)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
    }
  }

  return (
    <CollapsibleSection
      title="Lighting"
      icon="💡"
      color="text-yellow-300"
    >
      <div className="space-y-2">
        {/* Copy Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={copyLightingValues}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              copySuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
            title="Copy all lighting values as JSON"
          >
            {copySuccess ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                    onChange={(e) => setLightingControls({
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
                    onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                    onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                    onChange={(e) => setLightingControls({
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
                    onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
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
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  shadowBias: parseFloat(e.target.value)
                })}
                className="w-full h-1"
              />
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  )
}
