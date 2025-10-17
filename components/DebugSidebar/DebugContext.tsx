'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { defaultComponentControls, defaultCategoryVisibility } from '../DevControls/sections/product3d/types'

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
  [key: string]: any
}

interface CategoryVisibility {
  [key: string]: boolean
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
  const [modelControls, setModelControls] = useState<ModelControls>({
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  })

  const [cameraControls, setCameraControls] = useState<CameraControls>({
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  })

  const [lightingControls, setLightingControls] = useState<LightingControls>({
    ambientIntensity: 1.8,
    ambientColor: '#fafafa',
    directionalIntensity: 2.2,
    directionalColor: '#ffffff',
    directionalPosition: { x: 2, y: 5, z: 2 },
    directionalTarget: { x: 1.4, y: -0.5, z: 1 },
    pointLightIntensity: 1.2,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -2, y: 2, z: 2 },
    pointLightDistance: 15,
    spotLightIntensity: 3.5,
    spotLightColor: '#ffd294',
    spotLightPosition: { x: 5.2, y: -4, z: 1.4 },
    spotLightTarget: { x: 2.3, y: 0.2, z: -0.1 },
    spotLightDistance: 8,
    spotLightAngle: 73,
    spotLightPenumbra: 0.34,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isClient, setIsClient] = useState(true)
  const [stage1Config, setStage1Config] = useState<StageConfig | null>(null)
  const [stage2Config, setStage2Config] = useState<StageConfig | null>(null)
  const [stage3Config, setStage3Config] = useState<StageConfig | null>(null)
  const [current3DStage, setCurrent3DStage] = useState(2)
  const [stage3DAnimationProgress, setStage3DAnimationProgress] = useState(0)
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)

  const value: DebugContextType = {
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
  }

  return (
    <DebugContext.Provider value={value}>
      {children}
    </DebugContext.Provider>
  )
}


