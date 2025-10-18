'use client'

import React, { useState } from 'react'
import {
  Stage3DIndicator,
  ModelControls,
  CameraControls,
  ModelCameraControls,
  SectionNavigation,
  ScrollPosition,
  LightingControls,
  Presets,
  Product3DObject
} from '../DevControls/sections'
import { useDebugContext } from './DebugContext'

interface DebugSidebarProps {
  isVisible?: boolean
}

const DebugSidebar: React.FC<DebugSidebarProps> = ({ 
  isVisible = true
}) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'theme'>('3d')
  const {
    modelControls,
    setModelControls,
    cameraControls,
    setCameraControls,
    lightingControls,
    setLightingControls,
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
    setCurrent3DStage,
    stage3DAnimationProgress,
    componentControls,
    setComponentControls,
    categoryVisibility,
    setCategoryVisibility
  } = useDebugContext()

  if (!isVisible) return null

  return (
    <div className="debug-sidebar">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-600">
        <button
          onClick={() => setActiveTab('3d')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === '3d'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          3D Dev Controls
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'bg-gray-700 text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          Theme Colors
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === '3d' && (
          <div className="space-y-3">
            <Stage3DIndicator
              current3DStage={current3DStage}
              stage3DAnimationProgress={stage3DAnimationProgress}
              setCurrent3DStage={setCurrent3DStage}
            />

            <ModelCameraControls />

            <SectionNavigation
              transitionName={transitionName}
            />

            <ScrollPosition />

            <LightingControls />

            <Product3DObject
              componentControls={componentControls}
              onComponentControlsChange={setComponentControls}
              categoryVisibility={categoryVisibility}
              onCategoryVisibilityChange={setCategoryVisibility}
            />

            {stage1Config && stage2Config && stage3Config && (
              <Presets
                stage1Config={stage1Config}
                stage2Config={stage2Config}
                stage3Config={stage3Config}
              />
            )}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-3">
            <div className="text-gray-400 text-sm">
              Theme colors section - coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DebugSidebar
