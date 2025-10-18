'use client'

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { defaultComponentControls, defaultCategoryVisibility } from '../DevControls/sections/product3d/types'
import { useAppStore } from '../../store/useAppStore'

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

interface ComponentControls {
  // Core Mechanical Components
  microGearmotor: ComponentTransform
  gearMotorPCB: ComponentTransform
  motorHolder: ComponentTransform
  holderSupport: ComponentTransform
  coupling: ComponentTransform
  m5Screw: ComponentTransform
  
  // Brush & Application System
  movingPlate: ComponentTransform
  siliconSupport: ComponentTransform
  nozzle: ComponentTransform
  nozzleBlinder: ComponentTransform
  
  // Main Housing & Structure
  upperSideMainHolder: ComponentTransform
  lowerSideMain: ComponentTransform
  upperCover: ComponentTransform
  loadingMaterialCover: ComponentTransform
  
  // Electronic Components
  colorSensorPCB: ComponentTransform
  sts8dn3llh5: ComponentTransform
  oledDisplay: ComponentTransform
  detectorSwitch: ComponentTransform
  slideSwitch: ComponentTransform
  
  // LED & Lighting
  everlightLEDs: ComponentTransform
  sensorGuideLight: ComponentTransform
  
  // User Interface
  knobs: ComponentTransform
  drainButtonActuator: ComponentTransform
  handleUpCover: ComponentTransform
  
  // Support & Guide Components
  hairGuideSupport: ComponentTransform
  skqyafComponents: ComponentTransform
  
  // Additional Parts
  productComponents: ComponentTransform
  genericParts: ComponentTransform
  importedComponents: ComponentTransform
}

interface ComponentTransform {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  visible: boolean
}

interface CategoryVisibility {
  coreMechanical: boolean
  brushApplication: boolean
  mainHousing: boolean
  electronic: boolean
  ledLighting: boolean
  userInterface: boolean
  supportGuide: boolean
  additionalParts: boolean
}

interface DebugContextType {
  // 3D Dev Controls State
  modelControls: ModelControls
  setModelControls: (controls: ModelControls) => void
  cameraControls: CameraControls
  setCameraControls: (controls: CameraControls) => void
  lightingControls: LightingControls
  setLightingControls: (controls: LightingControls) => void
  currentSection: number
  setCurrentSection: (section: number) => void
  isScrolling: boolean
  setIsScrolling: (scrolling: boolean) => void
  scrollDirection: 'up' | 'down' | null
  setScrollDirection: (direction: 'up' | 'down' | null) => void
  transitionName: string | null
  setTransitionName: (name: string | null) => void
  scrollPosition: number
  setScrollPosition: (position: number) => void
  isClient: boolean
  setIsClient: (client: boolean) => void
  stage1Config: StageConfig | null
  setStage1Config: (config: StageConfig | null) => void
  stage2Config: StageConfig | null
  setStage2Config: (config: StageConfig | null) => void
  stage3Config: StageConfig | null
  setStage3Config: (config: StageConfig | null) => void
  current3DStage: number
  setCurrent3DStage: (stage: number) => void
  stage3DAnimationProgress: number
  setStage3DAnimationProgress: (progress: number) => void
  componentControls: ComponentControls
  setComponentControls: (controls: ComponentControls) => void
  categoryVisibility: CategoryVisibility
  setCategoryVisibility: (visibility: CategoryVisibility) => void
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export const useDebugContext = () => {
  const context = useContext(DebugContext)
  if (!context) {
    throw new Error('useDebugContext must be used within a DebugProvider')
  }
  return context
}

interface DebugProviderProps {
  children: ReactNode
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  // Use main store directly to avoid useSyncExternalStore issues
  const {
    // 3D State
    modelControls,
    cameraControls,
    lightingControls,
    current3DStage,
    stage3DAnimationProgress,
    is3DAnimating,
    isAnimating,
    animationProgress,
    
    // 3D Actions
    setStage3DAnimationProgress,
    setModelControls,
    setCameraControls,
    setLightingControls,
    setCurrent3DStage,
    setIs3DAnimating,
    setIsAnimating,
    setAnimationProgress,
    
    // Scroll State
    currentSection,
    isScrolling,
    scrollDirection,
    isTransitioning,
    transitionProgress,
    scrollPosition,
    isNavigatingViaDots,
    isClient,
    
    // Scroll Actions
    setCurrentSection,
    setIsScrolling,
    setScrollDirection,
    setIsTransitioning,
    setTransitionProgress,
    setScrollPosition,
    setIsNavigatingViaDots,
    setIsClient
  } = useAppStore()
  
  // Local state for things not in store
  const [stage1Config, setStage1Config] = useState<StageConfig | null>(null)
  const [stage2Config, setStage2Config] = useState<StageConfig | null>(null)
  const [stage3Config, setStage3Config] = useState<StageConfig | null>(null)
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)

  const value: DebugContextType = useMemo(() => ({
    modelControls,
    setModelControls,
    cameraControls,
    setCameraControls,
    lightingControls,
    setLightingControls,
    currentSection,
    setCurrentSection,
    isScrolling,
    setIsScrolling,
    scrollDirection,
    setScrollDirection,
    transitionName,
    setTransitionName,
    scrollPosition,
    setScrollPosition,
    isClient,
    setIsClient,
    stage1Config,
    setStage1Config,
    stage2Config,
    setStage2Config,
    stage3Config,
    setStage3Config,
    current3DStage,
    setCurrent3DStage,
    stage3DAnimationProgress,
    setStage3DAnimationProgress,
    componentControls,
    setComponentControls,
    categoryVisibility,
    setCategoryVisibility
  }), [
    modelControls,
    setModelControls,
    cameraControls,
    setCameraControls,
    lightingControls,
    setLightingControls,
    currentSection,
    setCurrentSection,
    isScrolling,
    setIsScrolling,
    scrollDirection,
    setScrollDirection,
    transitionName,
    setTransitionName,
    scrollPosition,
    setScrollPosition,
    isClient,
    setIsClient,
    stage1Config,
    setStage1Config,
    stage2Config,
    setStage2Config,
    stage3Config,
    setStage3Config,
    current3DStage,
    setCurrent3DStage,
    stage3DAnimationProgress,
    setStage3DAnimationProgress,
    componentControls,
    setComponentControls,
    categoryVisibility,
    setCategoryVisibility
  ])

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  )
}


