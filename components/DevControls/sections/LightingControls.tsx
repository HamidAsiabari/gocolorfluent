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

  // Professional lighting presets
  const lightingPresets = {
    'Studio Bright': {
      ambientIntensity: 1.0,
      ambientColor: '#ffffff',
      directionalIntensity: 2.5,
      directionalColor: '#ffffff',
      directionalPosition: { x: 5, y: 8, z: 5 },
      pointLightIntensity: 0,
      spotLightIntensity: 0
    },
    'Soft Natural': {
      ambientIntensity: 1.5,
      ambientColor: '#fff5e6',
      directionalIntensity: 1.5,
      directionalColor: '#ffffcc',
      directionalPosition: { x: 3, y: 6, z: 4 },
      pointLightIntensity: 0.5,
      spotLightIntensity: 0
    },
    'Dramatic': {
      ambientIntensity: 0.3,
      ambientColor: '#000000',
      directionalIntensity: 3.0,
      directionalColor: '#ffffff',
      directionalPosition: { x: 7, y: 10, z: 2 },
      pointLightIntensity: 1.5,
      spotLightIntensity: 0
    },
    'Product Photography': {
      ambientIntensity: 0.8,
      ambientColor: '#ffffff',
      directionalIntensity: 2.0,
      directionalColor: '#ffffff',
      directionalPosition: { x: -5, y: 8, z: 5 },
      pointLightIntensity: 0.8,
      spotLightIntensity: 0.6,
      spotLightPosition: { x: -3, y: 7, z: 3 },
      spotLightTarget: { x: 0, y: 0, z: 0 }
    },
    'Evening Mood': {
      ambientIntensity: 0.5,
      ambientColor: '#ffeed6',
      directionalIntensity: 1.0,
      directionalColor: '#ffaa44',
      directionalPosition: { x: -3, y: 5, z: -3 },
      pointLightIntensity: 1.2,
      spotLightIntensity: 0
    }
  }

  const applyPreset = (presetName: string) => {
    const preset = lightingPresets[presetName as keyof typeof lightingPresets]
    if (preset) {
      setLightingControls({ ...lightingControls, ...preset })
    }
  }

  return (
    <CollapsibleSection
      title="Lighting"
      icon="💡"
      color="text-yellow-300"
    >
      <div className="space-y-3">
        {/* Copy Button */}
        <div className="flex justify-between items-center mb-2">
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
          
          {/* Presets Dropdown */}
          <select
            onChange={(e) => applyPreset(e.target.value)}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 border border-gray-600 rounded hover:bg-gray-600"
            defaultValue=""
          >
            <option value="" disabled>Apply Preset...</option>
            {Object.keys(lightingPresets).map((preset) => (
              <option key={preset} value={preset}>{preset}</option>
            ))}
          </select>
        </div>

        {/* Main Lighting */}
        <div className="border-b border-gray-600 pb-2">
          <h5 className="text-xs font-semibold text-gray-300 mb-2">Main Lighting</h5>
          
          {/* Ambient Light */}
          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Ambient</label>
              <span className="text-xs text-gray-300 font-mono">{lightingControls.ambientIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={lightingControls.ambientIntensity}
              onChange={(e) => setLightingControls({
                ...lightingControls,
                ambientIntensity: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Directional Light */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Directional (Sun)</label>
              <span className="text-xs text-gray-300 font-mono">{lightingControls.directionalIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={lightingControls.directionalIntensity}
              onChange={(e) => setLightingControls({
                ...lightingControls,
                directionalIntensity: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="grid grid-cols-3 gap-1 mt-1">
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis}>
                  <label className="text-xs text-gray-500 block mb-0.5 uppercase">{axis}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lightingControls.directionalPosition[axis as keyof typeof lightingControls.directionalPosition]}
                    onChange={(e) => setLightingControls({
                      ...lightingControls,
                      directionalPosition: { ...lightingControls.directionalPosition, [axis]: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Lights */}
        <div className="border-b border-gray-600 pb-2">
          <h5 className="text-xs font-semibold text-gray-300 mb-2">Fill Lights</h5>
          
          {/* Point Light */}
          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Point</label>
              <span className="text-xs text-gray-300 font-mono">{lightingControls.pointLightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={lightingControls.pointLightIntensity}
              onChange={(e) => setLightingControls({
                ...lightingControls,
                pointLightIntensity: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="grid grid-cols-3 gap-1 mt-1">
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis}>
                  <label className="text-xs text-gray-500 block mb-0.5 uppercase">{axis}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lightingControls.pointLightPosition[axis as keyof typeof lightingControls.pointLightPosition]}
                    onChange={(e) => setLightingControls({
                      ...lightingControls,
                      pointLightPosition: { ...lightingControls.pointLightPosition, [axis]: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Spot Light */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-gray-400">Spot</label>
              <span className="text-xs text-gray-300 font-mono">{lightingControls.spotLightIntensity.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={lightingControls.spotLightIntensity}
              onChange={(e) => setLightingControls({
                ...lightingControls,
                spotLightIntensity: parseFloat(e.target.value)
              })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="grid grid-cols-3 gap-1 mt-1">
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis}>
                  <label className="text-xs text-gray-500 block mb-0.5 uppercase">{axis}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lightingControls.spotLightPosition[axis as keyof typeof lightingControls.spotLightPosition]}
                    onChange={(e) => setLightingControls({
                      ...lightingControls,
                      spotLightPosition: { ...lightingControls.spotLightPosition, [axis]: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-xs text-gray-300 focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-gray-300">Colors</h5>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Ambient</label>
              <input
                type="color"
                value={lightingControls.ambientColor}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  ambientColor: e.target.value
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Directional</label>
              <input
                type="color"
                value={lightingControls.directionalColor}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  directionalColor: e.target.value
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Point</label>
              <input
                type="color"
                value={lightingControls.pointLightColor}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  pointLightColor: e.target.value
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Spot</label>
              <input
                type="color"
                value={lightingControls.spotLightColor}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  spotLightColor: e.target.value
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Shadows */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-semibold text-gray-300">Shadows</h5>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lightingControls.shadowsEnabled}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  shadowsEnabled: e.target.checked
                })}
                className="w-4 h-4 rounded border-gray-600"
              />
              <span className="text-xs text-gray-300">Enable</span>
            </label>
          </div>
          
          {lightingControls.shadowsEnabled && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-400">Quality</label>
                <span className="text-xs text-gray-300 font-mono">{lightingControls.shadowMapSize}px</span>
              </div>
              <input
                type="range"
                min="512"
                max="2048"
                step="512"
                value={lightingControls.shadowMapSize}
                onChange={(e) => setLightingControls({
                  ...lightingControls,
                  shadowMapSize: parseFloat(e.target.value)
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}
