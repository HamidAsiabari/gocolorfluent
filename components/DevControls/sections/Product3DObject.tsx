'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'
import CoreMechanicalComponents from './product3d/CoreMechanicalComponents'
import BrushApplicationSystem from './product3d/BrushApplicationSystem'
import MainHousingStructure from './product3d/MainHousingStructure'
import ElectronicComponents from './product3d/ElectronicComponents'
import LEDLighting from './product3d/LEDLighting'
import UserInterface from './product3d/UserInterface'
import SupportGuideComponents from './product3d/SupportGuideComponents'
import AdditionalParts from './product3d/AdditionalParts'
import { ComponentControls, CategoryVisibility } from './product3d/types'

interface Product3DObjectProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
  categoryVisibility: CategoryVisibility
  onCategoryVisibilityChange: (visibility: CategoryVisibility) => void
}

export default function Product3DObject({
  componentControls,
  onComponentControlsChange,
  categoryVisibility,
  onCategoryVisibilityChange
}: Product3DObjectProps) {
  const testComponentTransform = () => {
    // Test transformation - make upperSideMainHolder very large and move it far away
    onComponentControlsChange({
      ...componentControls,
      upperSideMainHolder: {
        position: { x: 10, y: 10, z: 10 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        scale: { x: 10, y: 10, z: 10 },
        visible: true
      }
    })
  }

  const resetComponentTransform = () => {
    // Reset upperSideMainHolder to default values
    onComponentControlsChange({
      ...componentControls,
      upperSideMainHolder: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: true
      }
    })
  }

  const testAllComponents = () => {
    // Test transformation - make ALL components large and visible
    const newControls = { ...componentControls }
    Object.keys(newControls).forEach(key => {
      newControls[key] = {
        position: { x: 0, y: 5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 3, y: 3, z: 3 },
        visible: true
      }
    })
    onComponentControlsChange(newControls)
  }

  const resetAllComponents = () => {
    // Reset ALL components to default values (no transformations)
    const newControls = { ...componentControls }
    Object.keys(newControls).forEach(key => {
      newControls[key] = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        visible: true
      }
    })
    onComponentControlsChange(newControls)
  }

  const copyAllConfigs = () => {
    // Create a comprehensive config object with both component controls and category visibility
    const allConfigs = {
      componentControls,
      categoryVisibility,
      timestamp: new Date().toISOString(),
      description: "Complete 3D Object of Product configuration"
    }
    
    // Convert to formatted JSON string
    const configString = JSON.stringify(allConfigs, null, 2)
    
    // Copy to clipboard
    navigator.clipboard.writeText(configString).then(() => {
      console.log('✅ All configs copied to clipboard!')
      console.log('📋 Config data:', allConfigs)
      
      // Show a brief success message (you could add a toast notification here)
      alert('All configurations copied to clipboard!')
    }).catch(err => {
      console.error('❌ Failed to copy configs:', err)
      alert('Failed to copy configurations to clipboard')
    })
  }

  return (
    <CollapsibleSection title="🎨 3D Object of Product" defaultExpanded={false}>
      <div className="space-y-2">
        {/* Test Buttons */}
        <div className="p-2 bg-gray-800 rounded">
          <div className="flex gap-2 mb-2">
            <button
              onClick={testComponentTransform}
              className="flex-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              🧪 Test One
            </button>
            <button
              onClick={testAllComponents}
              className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
            >
              🚀 Test All
            </button>
            <button
              onClick={resetComponentTransform}
              className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded"
            >
              🔄 Reset
            </button>
            <button
              onClick={resetAllComponents}
              className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
            >
              🔄 Reset All
            </button>
          </div>
          <div className="flex gap-2 mb-2">
            <button
              onClick={copyAllConfigs}
              className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
            >
              📋 Copy All Configs
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Test One: Upper Side Main Holder | Test All: All components | Reset: Returns to default | Reset All: All components to default | Copy All: Copy all configurations to clipboard
          </p>
        </div>
        
        {/* Debug Info */}
        <div className="p-2 bg-gray-800 rounded">
          <h4 className="text-xs text-yellow-400 mb-1">🔍 Debug Info</h4>
          <p className="text-xs text-gray-400">
            Check browser console for component mapping details
          </p>
          <p className="text-xs text-gray-400">
            Upper Side Main Holder scale: {componentControls.upperSideMainHolder.scale.x}x
          </p>
        </div>
        
        {/* Category Visibility Controls */}
        <div className="p-2 bg-gray-800 rounded">
          <h4 className="text-xs text-yellow-400 mb-2">👁️ Category Visibility</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.coreMechanical}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  coreMechanical: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Core Mechanical</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.brushApplication}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  brushApplication: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Brush Application</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.mainHousing}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  mainHousing: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Main Housing</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.electronic}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  electronic: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Electronic</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.ledLighting}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  ledLighting: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>LED Lighting</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.userInterface}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  userInterface: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>User Interface</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.supportGuide}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  supportGuide: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Support Guide</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={categoryVisibility.additionalParts}
                onChange={(e) => onCategoryVisibilityChange({
                  ...categoryVisibility,
                  additionalParts: e.target.checked
                })}
                className="w-3 h-3"
              />
              <span>Additional Parts</span>
            </label>
          </div>
        </div>
        
        <CoreMechanicalComponents
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <BrushApplicationSystem
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <MainHousingStructure
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <ElectronicComponents
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <LEDLighting
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <UserInterface
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <SupportGuideComponents
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
        <AdditionalParts
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
        />
      </div>
    </CollapsibleSection>
  )
}
