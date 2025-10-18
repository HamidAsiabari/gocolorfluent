'use client'

import React from 'react'
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
} from './sections'
import { ComponentControls, CategoryVisibility } from './sections/product3d/types'
import { useAppStore } from '../../store/useAppStore'

interface DevControlsProps {
  isDevMode: boolean
  onToggleDevMode: () => void
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
  categoryVisibility: CategoryVisibility
  onCategoryVisibilityChange: (visibility: CategoryVisibility) => void
  transitionName: string | null
  stage1Config: any
  stage2Config: any
  stage3Config: any
}

export default function DevControls({
  isDevMode,
  onToggleDevMode,
  componentControls,
  onComponentControlsChange,
  categoryVisibility,
  onCategoryVisibilityChange,
  transitionName,
  stage1Config,
  stage2Config,
  stage3Config
}: DevControlsProps) {
  // Get state from Zustand store
  const {
    current3DStage,
    stage3DAnimationProgress,
    is3DAnimating,
    isAnimating,
    animationProgress,
    modelControls,
    cameraControls,
    lightingControls,
    setModelControls,
    setCameraControls,
    setLightingControls,
    setCurrent3DStage,
    currentSection,
    isScrolling,
    scrollDirection,
    scrollPosition,
    isClient
  } = useAppStore()

  if (!isDevMode) return null

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-[9999] bg-black/50 backdrop-blur-sm border border-gray-600 rounded-lg p-2 text-white max-w-80 sm:max-w-80 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2 sticky top-0 bg-black/50">
        <h3 className="text-sm font-semibold text-green-400">🎮 Dev</h3>
        <button
          onClick={onToggleDevMode}
          className="text-gray-400 hover:text-white text-xs p-1 hover:bg-gray-700 rounded"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <Stage3DIndicator />

        <ModelCameraControls />

        <SectionNavigation
          transitionName={transitionName}
        />

        <ScrollPosition />

        <LightingControls />

        <Product3DObject
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
          categoryVisibility={categoryVisibility}
          onCategoryVisibilityChange={onCategoryVisibilityChange}
        />

        <Presets
          stage1Config={stage1Config}
          stage2Config={stage2Config}
          stage3Config={stage3Config}
        />
      </div>
    </div>
  )
}
