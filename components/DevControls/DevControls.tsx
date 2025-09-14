'use client'

import React from 'react'
import {
  Stage3DIndicator,
  ModelControls,
  CameraControls,
  SectionNavigation,
  ScrollPosition,
  LightingControls,
  Presets,
  Product3DObject
} from './sections'
import { ComponentControls, CategoryVisibility } from './sections/product3d/types'

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
  setCurrent3DStage: (stage: number) => void
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
  categoryVisibility: CategoryVisibility
  onCategoryVisibilityChange: (visibility: CategoryVisibility) => void
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
  stage3DAnimationProgress,
  setCurrent3DStage,
  componentControls,
  onComponentControlsChange,
  categoryVisibility,
  onCategoryVisibilityChange
}: DevControlsProps) {
  if (!isDevMode) return null

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
        <Stage3DIndicator
          current3DStage={current3DStage}
          stage3DAnimationProgress={stage3DAnimationProgress}
          setCurrent3DStage={setCurrent3DStage}
        />

        <ModelControls
          modelControls={modelControls}
          onModelControlsChange={onModelControlsChange}
        />

        <CameraControls
          cameraControls={cameraControls}
          onCameraControlsChange={onCameraControlsChange}
        />

        <SectionNavigation
          currentSection={currentSection}
          isScrolling={isScrolling}
          scrollDirection={scrollDirection}
          transitionName={transitionName}
        />

        <ScrollPosition
          scrollPosition={scrollPosition}
          isClient={isClient}
        />

        <LightingControls
          lightingControls={lightingControls}
          onLightingControlsChange={onLightingControlsChange}
        />

        <Product3DObject
          componentControls={componentControls}
          onComponentControlsChange={onComponentControlsChange}
          categoryVisibility={categoryVisibility}
          onCategoryVisibilityChange={onCategoryVisibilityChange}
        />

        <Presets
          modelControls={modelControls}
          onModelControlsChange={onModelControlsChange}
          cameraControls={cameraControls}
          onCameraControlsChange={onCameraControlsChange}
          lightingControls={lightingControls}
          onLightingControlsChange={onLightingControlsChange}
          scrollPosition={scrollPosition}
          isClient={isClient}
          stage1Config={stage1Config}
          stage2Config={stage2Config}
          stage3Config={stage3Config}
        />
      </div>
    </div>
  )
}
