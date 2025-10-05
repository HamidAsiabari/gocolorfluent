'use client'


import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopMenu from '../components/TopMenu'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import DevControls from '../components/DevControls'
import { ThreeSceneManager, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config, stage1MobileConfig, stage2MobileConfig, stage3MobileConfig, stage4MobileConfig, stage5MobileConfig, stage6MobileConfig, stage7MobileConfig, stage8MobileConfig, stage9MobileConfig, stage1TabletConfig, stage2TabletConfig, stage3TabletConfig, stage4TabletConfig, stage5TabletConfig, stage6TabletConfig, stage7TabletConfig, stage8TabletConfig, stage9TabletConfig } from '../components/ThreeScene'
import { ScrollManager } from '../components/ScrollSystem'
import { AnimationSystem, easeInOut } from '../components/Animation'
import HeroSection from '../components/HeroSection'
import Section2 from '../components/Section2'
import Section3 from '../components/Section3'
import Section4 from '../components/Section4'
import Section5 from '../components/Section5'
import Section6 from '../components/Section6'
import Section7 from '../components/Section7'
import Section8 from '../components/Section8'
import { ComponentControls, defaultComponentControls, CategoryVisibility, defaultCategoryVisibility } from '../components/DevControls/sections/product3d/types'
import { LoadingScreen } from '../components/Loading'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  const [modelControls, setModelControls] = useState({
    position: { x: 2, y: -0.3, z: 0 },
    rotation: { x: -0.03, y: 0.1, z: 0.27 },
    scale: { x: 10, y: 10, z: 10 }
  })
  const [cameraControls, setCameraControls] = useState({
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  })
  const [lightingControls, setLightingControls] = useState({
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
  const [isDevMode, setIsDevMode] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(1)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [current3DStage, setCurrent3DStage] = useState(1) // Start at Stage 1
  const [is3DAnimating, setIs3DAnimating] = useState(false)
  const [stage3DAnimationProgress, setStage3DAnimationProgress] = useState(0)
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  
  // Stage 8 animation functions
  const [stage8AnimationFunctions, setStage8AnimationFunctions] = useState<{
    stage8OpenAnimation: (() => void) | null
    stage8CloseAnimation: (() => void) | null
  }>({
    stage8OpenAnimation: null,
    stage8CloseAnimation: null
  })

  // Handle stage 8 animation functions ready
  const handleAnimationFunctionsReady = useCallback((functions: {
    stage8OpenAnimation: () => void
    stage8CloseAnimation: () => void
  }) => {
    setStage8AnimationFunctions(functions)
  }, [])

  // Device type detection - initialize synchronously to avoid timing issues
  const getInitialDeviceType = () => {
    if (typeof window === 'undefined') return 'desktop'
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 1024) return 'tablet'
    return 'desktop'
  }
  
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(getInitialDeviceType)
  
  // Check device type based on window width
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      if (width <= 768) {
        setDeviceType('mobile')
      } else if (width <= 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }
    
    // Only add resize listener, initial check is done synchronously
    window.addEventListener('resize', checkDeviceType)
    
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])
  
  // Function to get stage configuration based on device type
  const getStageConfig = useCallback((stage: number) => {
    switch (deviceType) {
      case 'mobile':
        switch (stage) {
          case 1: return stage1MobileConfig
          case 2: return stage2MobileConfig
          case 3: return stage3MobileConfig
          case 4: return stage4MobileConfig
          case 5: return stage5MobileConfig
          case 6: return stage6MobileConfig
          case 7: return stage7MobileConfig
          case 8: return stage8MobileConfig
          case 9: return stage9MobileConfig
          default: 
            console.warn(`Unknown stage ${stage} for mobile, falling back to stage 1`)
            return stage1MobileConfig
        }
      case 'tablet':
        switch (stage) {
          case 1: return stage1TabletConfig
          case 2: return stage2TabletConfig
          case 3: return stage3TabletConfig
          case 4: return stage4TabletConfig
          case 5: return stage5TabletConfig
          case 6: return stage6TabletConfig
          case 7: return stage7TabletConfig
          case 8: return stage8TabletConfig
          case 9: return stage9TabletConfig
          default: 
            console.warn(`Unknown stage ${stage} for tablet, falling back to stage 1`)
            return stage1TabletConfig
        }
      case 'desktop':
      default:
        switch (stage) {
          case 1: return stage1Config
          case 2: return stage2Config
          case 3: return stage3Config
          case 4: return stage4Config
          case 5: return stage5Config
          case 6: return stage6Config
          case 7: return stage7Config
          case 8: return stage8Config
          case 9: return stage9Config
          default: 
            console.warn(`Unknown stage ${stage} for desktop, falling back to stage 1`)
            return stage1Config
        }
    }
  }, [deviceType])

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Handle loading progress
  const handleLoadingProgress = useCallback((progress: number) => {
    setLoadingProgress(progress)
  }, [])

  // Handle loading complete with minimum 2 second display time
  const handleLoadingComplete = useCallback(() => {
    const minLoadingTime = 2000 // 2 seconds minimum
    
    const completeLoading = () => {
      if (loadingStartTime) {
        const elapsedTime = Date.now() - loadingStartTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
        
        setTimeout(() => {
          setIsLoading(false)
        }, remainingTime)
      } else {
        // Fallback: if loadingStartTime is not set, wait the full 2 seconds
        setTimeout(() => {
          setIsLoading(false)
        }, minLoadingTime)
      }
    }
    
    completeLoading()
  }, [loadingStartTime])

  // Animated values function that handles all animations
  const getAnimatedValues = useCallback(() => {
    // Import easing functions
  const lerp = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress
  }

  const lerpColor = (startColor: string, endColor: string, progress: number): string => {
    const start = startColor.replace('#', '')
    const end = endColor.replace('#', '')
    
    const startR = parseInt(start.substr(0, 2), 16)
    const startG = parseInt(start.substr(2, 2), 16)
    const startB = parseInt(start.substr(4, 2), 16)
    
    const endR = parseInt(end.substr(0, 2), 16)
    const endG = parseInt(end.substr(2, 2), 16)
    const endB = parseInt(end.substr(4, 2), 16)
    
    const r = Math.round(lerp(startR, endR, progress))
    const g = Math.round(lerp(startG, endG, progress))
    const b = Math.round(lerp(startB, endB, progress))
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

    // Handle section-based 3D stage animations
    if (is3DAnimating) {
      const progress = easeInOutSine(stage3DAnimationProgress)
      let fromStage, toStage
      
      if (current3DStage === 2) {
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      } else if (current3DStage === 3) {
        // Check scroll direction to determine correct target stage
        if (scrollDirection === 'down') {
          // Going from Stage 3 to Stage 4
          fromStage = getStageConfig(3)
          toStage = getStageConfig(4)
        } else {
          // Going from Stage 3 to Stage 2
          fromStage = getStageConfig(3)
          toStage = getStageConfig(2)
        }
      } else if (current3DStage === 4) {
        // Check if we're animating to Stage 5 (down) or Stage 3 (up)
        if (scrollDirection === 'down') {
          // Going from Stage 4 to Stage 5
          fromStage = getStageConfig(4)
          toStage = getStageConfig(5)
        } else {
          // Going from Stage 4 to Stage 3
          fromStage = getStageConfig(4)
          toStage = getStageConfig(3)
        }
      } else if (current3DStage === 5) {
        // Check if we're animating to Stage 6 (down) or Stage 4 (up)
        if (scrollDirection === 'down') {
          // Going from Stage 5 to Stage 6
          fromStage = getStageConfig(5)
          toStage = getStageConfig(6)
        } else {
          // Going from Stage 5 to Stage 4
          fromStage = getStageConfig(5)
          toStage = getStageConfig(4)
        }
      } else if (current3DStage === 6) {
        // Check if we're animating to Stage 7 (down) or Stage 5 (up)
        if (scrollDirection === 'down') {
          // Going from Stage 6 to Stage 7
          fromStage = getStageConfig(6)
          toStage = getStageConfig(7)
        } else {
          // Going from Stage 6 to Stage 5
          fromStage = getStageConfig(6)
          toStage = getStageConfig(5)
        }
      } else if (current3DStage === 7) {
        // Check if we're animating to Stage 8 (down) or Stage 6 (up)
        if (scrollDirection === 'down') {
          // Going from Stage 7 to Stage 8
          fromStage = getStageConfig(7)
          toStage = getStageConfig(8)
        } else {
          // Going from Stage 7 to Stage 6
          fromStage = getStageConfig(7)
          toStage = getStageConfig(6)
        }
      } else if (current3DStage === 8) {
        // Check if we're animating to Stage 9 (down) or Stage 7 (up)
        if (scrollDirection === 'down') {
          // Going from Stage 8 to Stage 9
          fromStage = getStageConfig(8)
          toStage = getStageConfig(9)
        } else {
          // Going from Stage 8 to Stage 7
          fromStage = getStageConfig(8)
          toStage = getStageConfig(7)
        }
      } else if (current3DStage === 9) {
        // Going from Stage 9 to Stage 8
        fromStage = getStageConfig(9)
        toStage = getStageConfig(8)
      } else if (current3DStage === 1) {
        // Stage 1 - no animation, just return current stage values
        fromStage = getStageConfig(1)
        toStage = getStageConfig(1)
      } else if (current3DStage === 2) {
        // Stage 2 - no animation, just return current stage values
        fromStage = getStageConfig(2)
        toStage = getStageConfig(2)
      } else {
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      }
      
      return {
        model: {
          position: {
            x: lerp(fromStage.model.position.x, toStage.model.position.x, progress),
            y: lerp(fromStage.model.position.y, toStage.model.position.y, progress),
            z: lerp(fromStage.model.position.z, toStage.model.position.z, progress)
          },
          rotation: {
            x: lerp(fromStage.model.rotation.x, toStage.model.rotation.x, progress),
            y: lerp(fromStage.model.rotation.y, toStage.model.rotation.y, progress),
            z: lerp(fromStage.model.rotation.z, toStage.model.rotation.z, progress)
          },
          scale: {
            x: lerp(fromStage.model.scale.x, toStage.model.scale.x, progress),
            y: lerp(fromStage.model.scale.y, toStage.model.scale.y, progress),
            z: lerp(fromStage.model.scale.z, toStage.model.scale.z, progress)
          }
        },
        camera: {
          position: {
            x: lerp(fromStage.camera.position.x, toStage.camera.position.x, progress),
            y: lerp(fromStage.camera.position.y, toStage.camera.position.y, progress),
            z: lerp(fromStage.camera.position.z, toStage.camera.position.z, progress)
          },
          fov: lerp(fromStage.camera.fov, toStage.camera.fov, progress)
        },
        lighting: {
          ambientIntensity: lerp(fromStage.lighting.ambientIntensity, toStage.lighting.ambientIntensity, progress),
          ambientColor: lerpColor(fromStage.lighting.ambientColor, toStage.lighting.ambientColor, progress),
          directionalIntensity: lerp(fromStage.lighting.directionalIntensity, toStage.lighting.directionalIntensity, progress),
          directionalColor: lerpColor(fromStage.lighting.directionalColor, toStage.lighting.directionalColor, progress),
          directionalPosition: {
            x: lerp(fromStage.lighting.directionalPosition.x, toStage.lighting.directionalPosition.x, progress),
            y: lerp(fromStage.lighting.directionalPosition.y, toStage.lighting.directionalPosition.y, progress),
            z: lerp(fromStage.lighting.directionalPosition.z, toStage.lighting.directionalPosition.z, progress)
          },
          directionalTarget: {
            x: lerp(fromStage.lighting.directionalTarget.x, toStage.lighting.directionalTarget.x, progress),
            y: lerp(fromStage.lighting.directionalTarget.y, toStage.lighting.directionalTarget.y, progress),
            z: lerp(fromStage.lighting.directionalTarget.z, toStage.lighting.directionalTarget.z, progress)
          },
          pointLightIntensity: lerp(fromStage.lighting.pointLightIntensity, toStage.lighting.pointLightIntensity, progress),
          pointLightColor: lerpColor(fromStage.lighting.pointLightColor, toStage.lighting.pointLightColor, progress),
          pointLightPosition: {
            x: lerp(fromStage.lighting.pointLightPosition.x, toStage.lighting.pointLightPosition.x, progress),
            y: lerp(fromStage.lighting.pointLightPosition.y, toStage.lighting.pointLightPosition.y, progress),
            z: lerp(fromStage.lighting.pointLightPosition.z, toStage.lighting.pointLightPosition.z, progress)
          },
          pointLightDistance: lerp(fromStage.lighting.pointLightDistance, toStage.lighting.pointLightDistance, progress),
          spotLightIntensity: lerp(fromStage.lighting.spotLightIntensity, toStage.lighting.spotLightIntensity, progress),
          spotLightColor: lerpColor(fromStage.lighting.spotLightColor, toStage.lighting.spotLightColor, progress),
          spotLightPosition: {
            x: lerp(fromStage.lighting.spotLightPosition.x, toStage.lighting.spotLightPosition.x, progress),
            y: lerp(fromStage.lighting.spotLightPosition.y, toStage.lighting.spotLightPosition.y, progress),
            z: lerp(fromStage.lighting.spotLightPosition.z, toStage.lighting.spotLightPosition.z, progress)
          },
          spotLightTarget: {
            x: lerp(fromStage.lighting.spotLightTarget.x, toStage.lighting.spotLightTarget.x, progress),
            y: lerp(fromStage.lighting.spotLightTarget.y, toStage.lighting.spotLightTarget.y, progress),
            z: lerp(fromStage.lighting.spotLightTarget.z, toStage.lighting.spotLightTarget.z, progress)
          },
          spotLightDistance: lerp(fromStage.lighting.spotLightDistance, toStage.lighting.spotLightDistance, progress),
          spotLightAngle: lerp(fromStage.lighting.spotLightAngle, toStage.lighting.spotLightAngle, progress),
          spotLightPenumbra: lerp(fromStage.lighting.spotLightPenumbra, toStage.lighting.spotLightPenumbra, progress),
          shadowsEnabled: fromStage.lighting.shadowsEnabled,
          shadowMapSize: fromStage.lighting.shadowMapSize,
          shadowBias: fromStage.lighting.shadowBias
        }
      }
    }

    // Handle initial Stage 0 to Stage 2 animation
    if (isAnimating) {
      const progress = easeInOutSine(animationProgress)
      
      return {
        model: {
          position: {
            x: lerp(stage1Config.model.position.x, stage2Config.model.position.x, progress),
            y: lerp(stage1Config.model.position.y, stage2Config.model.position.y, progress),
            z: lerp(stage1Config.model.position.z, stage2Config.model.position.z, progress)
          },
          rotation: {
            x: lerp(stage1Config.model.rotation.x, stage2Config.model.rotation.x, progress),
            y: lerp(stage1Config.model.rotation.y, stage2Config.model.rotation.y, progress),
            z: lerp(stage1Config.model.rotation.z, stage2Config.model.rotation.z, progress)
          },
          scale: {
            x: lerp(stage1Config.model.scale.x, stage2Config.model.scale.x, progress),
            y: lerp(stage1Config.model.scale.y, stage2Config.model.scale.y, progress),
            z: lerp(stage1Config.model.scale.z, stage2Config.model.scale.z, progress)
          }
        },
        camera: {
          position: {
            x: lerp(stage1Config.camera.position.x, stage2Config.camera.position.x, progress),
            y: lerp(stage1Config.camera.position.y, stage2Config.camera.position.y, progress),
            z: lerp(stage1Config.camera.position.z, stage2Config.camera.position.z, progress)
          },
          fov: lerp(stage1Config.camera.fov, stage2Config.camera.fov, progress)
        },
        lighting: {
          ambientIntensity: lerp(stage1Config.lighting.ambientIntensity, stage2Config.lighting.ambientIntensity, progress),
          ambientColor: lerpColor(stage1Config.lighting.ambientColor, stage2Config.lighting.ambientColor, progress),
          directionalIntensity: lerp(stage1Config.lighting.directionalIntensity, stage2Config.lighting.directionalIntensity, progress),
          directionalColor: lerpColor(stage1Config.lighting.directionalColor, stage2Config.lighting.directionalColor, progress),
          directionalPosition: {
            x: lerp(stage1Config.lighting.directionalPosition.x, stage2Config.lighting.directionalPosition.x, progress),
            y: lerp(stage1Config.lighting.directionalPosition.y, stage2Config.lighting.directionalPosition.y, progress),
            z: lerp(stage1Config.lighting.directionalPosition.z, stage2Config.lighting.directionalPosition.z, progress)
          },
          directionalTarget: {
            x: lerp(stage1Config.lighting.directionalTarget.x, stage2Config.lighting.directionalTarget.x, progress),
            y: lerp(stage1Config.lighting.directionalTarget.y, stage2Config.lighting.directionalTarget.y, progress),
            z: lerp(stage1Config.lighting.directionalTarget.z, stage2Config.lighting.directionalTarget.z, progress)
          },
          pointLightIntensity: lerp(stage1Config.lighting.pointLightIntensity, stage2Config.lighting.pointLightIntensity, progress),
          pointLightColor: lerpColor(stage1Config.lighting.pointLightColor, stage2Config.lighting.pointLightColor, progress),
          pointLightPosition: {
            x: lerp(stage1Config.lighting.pointLightPosition.x, stage2Config.lighting.pointLightPosition.x, progress),
            y: lerp(stage1Config.lighting.pointLightPosition.y, stage2Config.lighting.pointLightPosition.y, progress),
            z: lerp(stage1Config.lighting.pointLightPosition.z, stage2Config.lighting.pointLightPosition.z, progress)
          },
          pointLightDistance: lerp(stage1Config.lighting.pointLightDistance, stage2Config.lighting.pointLightDistance, progress),
          spotLightIntensity: lerp(stage1Config.lighting.spotLightIntensity, stage2Config.lighting.spotLightIntensity, progress),
          spotLightColor: lerpColor(stage1Config.lighting.spotLightColor, stage2Config.lighting.spotLightColor, progress),
          spotLightPosition: {
            x: lerp(stage1Config.lighting.spotLightPosition.x, stage2Config.lighting.spotLightPosition.x, progress),
            y: lerp(stage1Config.lighting.spotLightPosition.y, stage2Config.lighting.spotLightPosition.y, progress),
            z: lerp(stage1Config.lighting.spotLightPosition.z, stage2Config.lighting.spotLightPosition.z, progress)
          },
          spotLightTarget: {
            x: lerp(stage1Config.lighting.spotLightTarget.x, stage2Config.lighting.spotLightTarget.x, progress),
            y: lerp(stage1Config.lighting.spotLightTarget.y, stage2Config.lighting.spotLightTarget.y, progress),
            z: lerp(stage1Config.lighting.spotLightTarget.z, stage2Config.lighting.spotLightTarget.z, progress)
          },
          spotLightDistance: lerp(stage1Config.lighting.spotLightDistance, stage2Config.lighting.spotLightDistance, progress),
          spotLightAngle: lerp(stage1Config.lighting.spotLightAngle, stage2Config.lighting.spotLightAngle, progress),
          spotLightPenumbra: lerp(stage1Config.lighting.spotLightPenumbra, stage2Config.lighting.spotLightPenumbra, progress),
          shadowsEnabled: stage1Config.lighting.shadowsEnabled,
          shadowMapSize: stage1Config.lighting.shadowMapSize,
          shadowBias: stage1Config.lighting.shadowBias
        }
      }
    }

    // Return Stage 4 configuration when in Stage 4, but use model controls for dev controls
    if (current3DStage === 4) {
      return {
        model: modelControls, // Use model controls so dev controls work
        camera: stage4Config.camera,
        lighting: stage4Config.lighting
      }
    }

    // Return Stage 5 configuration when in Stage 5, but use model controls for dev controls
    if (current3DStage === 5) {
      return {
        model: modelControls, // Use model controls so dev controls work
        camera: stage5Config.camera,
        lighting: stage5Config.lighting
      }
    }

    // Return actual control values when not animating (so dev controls work)
    return { 
      model: modelControls, 
      camera: cameraControls, 
      lighting: lightingControls 
    }
  }, [is3DAnimating, stage3DAnimationProgress, isAnimating, animationProgress, current3DStage, scrollDirection, modelControls, cameraControls, lightingControls])







  // Update model controls to reflect current animated values
  useEffect(() => {
    if (is3DAnimating || isAnimating) {
      const animatedValues = getAnimatedValues()
      setModelControls(animatedValues.model)
      // console.log('Animation progress - updating model controls:', animatedValues.model)
    }
  }, [is3DAnimating, stage3DAnimationProgress, isAnimating, animationProgress, current3DStage])

  // Update model controls when stage changes (not animating)
  useEffect(() => {
    if (!is3DAnimating && !isAnimating) {
      // console.log('Stage changed - updating model controls for stage:', current3DStage)
      // Update model controls to match the current stage configuration
      const stageConfig = getStageConfig(current3DStage)
      
      // Safety check to prevent undefined errors
      if (stageConfig && stageConfig.model) {
        setModelControls(stageConfig.model)
        // Set model controls to current stage
      } else {
        console.error(`Invalid stage configuration for stage ${current3DStage} (${deviceType})`)
        // Fallback to stage 1 configuration
        const fallbackConfig = getStageConfig(1)
        if (fallbackConfig && fallbackConfig.model) {
          setModelControls(fallbackConfig.model)
          // Using fallback stage 1 configuration
        }
      }
    }
  }, [current3DStage, is3DAnimating, isAnimating, getStageConfig, deviceType])




  return (
    <div className="relative">
      {/* Loading Screen */}
      <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      
      {/* Fixed 3D Container - Always full screen */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-screen h-screen touch-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Three.js Scene Manager */}
      <ThreeSceneManager
        mountRef={mountRef}
        modelControls={modelControls}
        cameraControls={cameraControls}
        lightingControls={lightingControls}
        isAnimating={isAnimating}
        animationProgress={animationProgress}
        is3DAnimating={is3DAnimating}
        stage3DAnimationProgress={stage3DAnimationProgress}
        current3DStage={current3DStage}
        getAnimatedValues={getAnimatedValues}
        componentControls={componentControls}
        categoryVisibility={categoryVisibility}
        onComponentControlsChange={setComponentControls}
        onAnimationFunctionsReady={handleAnimationFunctionsReady}
        onLoadingProgress={handleLoadingProgress}
        onLoadingComplete={handleLoadingComplete}
      />

      {/* Scroll Manager */}
      <ScrollManager
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        setIsScrolling={setIsScrolling}
        setScrollDirection={setScrollDirection}
        setTransitionName={setTransitionName}
        setIsTransitioning={setIsTransitioning}
        setTransitionProgress={setTransitionProgress}
        setScrollPosition={setScrollPosition}
        isClient={isClient}
        setIsClient={setIsClient}
      />

      {/* Animation System */}
      <AnimationSystem
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        animationProgress={animationProgress}
        setAnimationProgress={setAnimationProgress}
        is3DAnimating={is3DAnimating}
        setIs3DAnimating={setIs3DAnimating}
        stage3DAnimationProgress={stage3DAnimationProgress}
        setStage3DAnimationProgress={setStage3DAnimationProgress}
        current3DStage={current3DStage}
        setCurrent3DStage={setCurrent3DStage}
        isTransitioning={isTransitioning}
        scrollDirection={scrollDirection}
        currentSection={currentSection}
        isClient={isClient}
        isLoading={isLoading}
        setModelControls={setModelControls}
        setCameraControls={setCameraControls}
        setLightingControls={setLightingControls}
        stage8AnimationFunctions={stage8AnimationFunctions}
        getStageConfig={getStageConfig}
      />

      {/* Scrollable Content - 8x screen height */}
      <main 
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 transition-opacity duration-500 smooth-scroll ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          height: isClient ? `${window.innerHeight * 8}px` : '800vh',
          minHeight: isClient ? `${window.innerHeight * 8}px` : '800vh',
          touchAction: 'pan-y' // Allow vertical scrolling on mobile
        }}
      >

        {/* Section Navigation Dots */}
        <div className="fixed right-4 md:left-8 top-1/2 transform -translate-y-1/2 z-50">
          <div className="flex flex-col space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
              <button
                key={section}
                onClick={() => {
                  if (isClient) {
                    const targetY = (section - 1) * window.innerHeight
                    window.scrollTo({
                      top: targetY,
                      behavior: 'smooth'
                    })
                  }
                }}
                className={`rounded-full border-2 transition-all duration-300 touch-manipulation ${
                  currentSection === section
                    ? 'bg-white border-white'
                    : 'bg-transparent border-gray-400 hover:border-white'
                }`}
                title={`Section ${section}`}
                style={{ 
                  touchAction: 'manipulation',
                  width: '20px',
                  height: '20px',
                  maxWidth: '20px',
                  maxHeight: '20px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <div className="text-sm font-medium">Swipe to navigate</div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Content Sections - Positioned based on scroll */}
        <div className="relative z-10">
          {/* Section 1 - Hero */}
          <HeroSection
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 2 */}
          <Section2
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 3 */}
          <Section3
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 4 */}
          <Section4
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 5 */}
          <Section5
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 6 */}
          <Section6
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 7 */}
          <Section7
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 8 */}
          <Section8
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />
        </div>
      </main>

      {/* Compact Development Helper Box */}
      {!isLoading && <DevControls
        isDevMode={isDevMode}
        onToggleDevMode={() => setIsDevMode(false)}
        modelControls={modelControls}
        onModelControlsChange={setModelControls}
        cameraControls={cameraControls}
        onCameraControlsChange={setCameraControls}
        lightingControls={lightingControls}
        onLightingControlsChange={setLightingControls}
        currentSection={currentSection}
        isScrolling={isScrolling}
        scrollDirection={scrollDirection}
        transitionName={transitionName}
        scrollPosition={scrollPosition}
        isClient={isClient}
        stage1Config={stage1Config}
        stage2Config={stage2Config}
        stage3Config={stage3Config}
        current3DStage={current3DStage}
        stage3DAnimationProgress={stage3DAnimationProgress}
        setCurrent3DStage={setCurrent3DStage}
        componentControls={componentControls}
        onComponentControlsChange={setComponentControls}
        categoryVisibility={categoryVisibility}
        onCategoryVisibilityChange={setCategoryVisibility}
      />}

      {/* Top Menu */}
      {!isLoading && <TopMenu />}

      {/* Show Dev Mode Button when hidden */}
      {!isLoading && !isDevMode && (
        <button
          onClick={() => setIsDevMode(true)}
          className="fixed bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-auto z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-white text-xs sm:text-sm text-center"
          style={{ minHeight: '44px' }}
        >
          Show Dev Controls
        </button>
      )}
    </div>
  )
}
