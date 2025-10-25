'use client'

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopMenu from '../components/TopMenu'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { ThreeSceneManager, stage0Config, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config } from '../components/ThreeScene'
import { useAppStore, StageConfig } from '../store/useAppStore'
import PerformanceMonitor, { useStateTracker, useEffectTracker } from '../components/PerformanceMonitor/PerformanceMonitor'

// Debug: Check if stage configs are properly imported
console.log('Imported stage configs:', {
  stage1Config: !!stage1Config,
  stage2Config: !!stage2Config,
  stage3Config: !!stage3Config,
  stage2ConfigValue: stage2Config
})

// Create direct references to avoid circular dependency issues
const stageConfigs: Record<number, any> = {
  0: stage0Config,
  1: stage1Config,
  2: stage2Config,
  3: stage3Config,
  4: stage4Config,
  5: stage5Config,
  6: stage6Config,
  7: stage7Config,
  8: stage8Config,
  9: stage9Config
}
import { ScrollManager } from '../components/ScrollSystem'
import { AnimationSystem, easeInOut } from '../components/Animation'
import { LuxuryLightingAnimation } from '../components/Animation/LuxuryLightingAnimation'
import HeroSection from '../components/HeroSection'
import Section2 from '../components/Section2'
import Section3 from '../components/Section3'
import Section4 from '../components/Section4'
import Section5 from '../components/Section5'
import Section6 from '../components/Section6'
import Section7 from '../components/Section7'
import Section8 from '../components/Section8'
import { LoadingScreen, SectionLoadingScreen } from '../components/Loading'
import { ComponentControls, defaultComponentControls, CategoryVisibility, defaultCategoryVisibility } from '../components/DevControls/sections/product3d/types'
import DevControls from '../components/DevControls/DevControls'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Get minimal state from Zustand store to prevent infinite loops
  const {
    // Only essential state
    currentSection,
    isScrolling,
    scrollDirection,
    isTransitioning,
    transitionProgress,
    scrollPosition,
    isNavigatingViaDots,
    isLoading,
    loadingProgress,
    isClient,
    
    // Only essential actions
    setCurrentSection,
    setIsScrolling,
    setScrollDirection,
    setIsTransitioning,
    setTransitionProgress,
    setScrollPosition,
    setIsClient,
    setLoading,
    setLoadingProgress,
    setIsNavigatingViaDots,
    addDebugLog,
    setDebugMode
  } = useAppStore()
  
  // Get all 3D state and actions from main store to avoid useSyncExternalStore issues
  const {
    // 3D State
    current3DStage,
    stage3DAnimationProgress,
    is3DAnimating,
    isAnimating,
    animationProgress,
    modelControls,
    cameraControls,
    lightingControls,
    
    // 3D Actions
    setCurrent3DStage,
    setModelControls,
    setCameraControls,
    setLightingControls,
    setStage3DAnimationProgress,
    setIs3DAnimating,
    setIsAnimating,
    setAnimationProgress
  } = useAppStore()
  
  // Local state for things not in store yet
  const [transitionName, setTransitionName] = useState<string | null>(null)
  
  // Dev controls state
  const [isDevMode, setIsDevMode] = useState(false) // Disable dev mode temporarily
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  
  // Toggle dev mode with keyboard shortcut (Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault()
        setIsDevMode(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const [isSectionLoading, setIsSectionLoading] = useState(false)
  const [sectionLoadingFrom, setSectionLoadingFrom] = useState(1)
  const [sectionLoadingTo, setSectionLoadingTo] = useState(1)
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


  
  // Function to get stage configuration
  const getStageConfigLocal = useCallback((stage: number): StageConfig => {
    // Ensure stage is a valid number
    if (typeof stage !== 'number' || stage < 0 || stage > 9) {
      stage = 1
    }

    // Use direct reference to avoid circular dependency issues
    const config = stageConfigs[stage] || stageConfigs[1]
    
    return config
  }, [])

  // Memoized easing function to prevent recreation
  const easeOutCubic = useCallback((t: number) => {
    return 1 - Math.pow(1 - t, 3)
  }, [])

  // Navigation function for clicking on section dots
  const navigateToSection = useCallback((targetSection: number) => {
    if (isScrolling || isTransitioning || !isClient) return
    if (targetSection === currentSection) return
    
    const direction = targetSection > currentSection ? 'down' : 'up'
    const transitionName = `section${currentSection}to${targetSection}`
    const sectionDistance = Math.abs(targetSection - currentSection)
    
    // Check if we need to show loading screen for jumps of more than 1 section
    const shouldShowLoading = sectionDistance > 1
    
    // Set flag to indicate we're navigating via dots
    setIsNavigatingViaDots(true)
    
    // Show section loading screen if jumping more than 1 section
    if (shouldShowLoading) {
      setSectionLoadingFrom(currentSection)
      setSectionLoadingTo(targetSection)
      setIsSectionLoading(true)
    }
    
    // Start transition animation
    setScrollDirection(direction)
    setTransitionName(transitionName)
    setIsScrolling(true)
    setIsTransitioning(true)
    setTransitionProgress(0)
    
    // Animate transition progress with improved timing
    const duration = 1200 // 1.2 seconds for smoother feel
    const startTime = performance.now()
    
    const animateTransition = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easedProgress = easeOutCubic(progress)
      setTransitionProgress(easedProgress)
      
      // Smooth scroll to target position during animation
      const windowHeight = window.innerHeight
      const startScrollY = (currentSection - 1) * windowHeight
      const targetScrollY = (targetSection - 1) * windowHeight
      const currentScrollY = startScrollY + (targetScrollY - startScrollY) * easedProgress
      
      window.scrollTo(0, currentScrollY)
      setScrollPosition(currentScrollY)
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        // Transition complete
        setCurrentSection(targetSection)
        setIsScrolling(false)
        setIsTransitioning(false)
        setTransitionName(null)
        setTransitionProgress(1)
        
        // Hide section loading screen if it was shown
        if (shouldShowLoading) {
          setIsSectionLoading(false)
        }
        
        // Update 3D stage to match the target section (stage = section)
        const targetStage = targetSection
        
        // Direct stage transition without animation
        if (targetStage !== current3DStage) {
          setCurrent3DStage(targetStage)
          setStage3DAnimationProgress(1)
          
          // Apply stage configuration immediately
          const stageConfig = getStageConfigLocal(targetStage)
          if (stageConfig) {
            setModelControls(stageConfig.model)
            setCameraControls(stageConfig.camera)
            setLightingControls(stageConfig.lighting)
          }
        }
        
        // Clear the navigation flag after a short delay to prevent conflicts
        setTimeout(() => {
          setIsNavigatingViaDots(false)
        }, 100)
      }
    }
    
    requestAnimationFrame(animateTransition)
  }, [currentSection, isScrolling, isTransitioning, isClient, easeOutCubic, getStageConfigLocal])

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Set initial stage to 0 and animate to stage 1 after loading
  useEffect(() => {
    if (!isClient || isLoading) return

    console.log('🎯 Initializing stage 0 - will animate to stage 1')
    
    // Set to stage 0 initially
    setCurrent3DStage(0)
    setIs3DAnimating(false)
    setStage3DAnimationProgress(0)
    
    // Apply stage 0 configuration immediately
    const stage0Config = getStageConfigLocal(0)
    if (stage0Config) {
      console.log('🎯 Applying stage 0 config:', stage0Config)
      setModelControls(stage0Config.model)
      setCameraControls(stage0Config.camera)
      setLightingControls(stage0Config.lighting)
    } else {
      console.warn('⚠️ Stage 0 config not found!')
    }

    // Start animation to stage 1 after a short delay
    const animationDelay = 2000 // 2 seconds delay
    const animationTimeout = setTimeout(() => {
      console.log('🎬 Starting automatic transition from stage 0 to stage 1')
      
      // Get stage 1 configuration
      const stage1Config = getStageConfigLocal(1)
      if (stage1Config) {
        console.log('🎯 Stage 1 config:', stage1Config)
        
        // Start the animation
        setIs3DAnimating(true)
        setStage3DAnimationProgress(0)
        
        // Animate the transition
        const duration = 3000 // 3 seconds animation
        const startTime = performance.now()
        
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Apply easing
          const easedProgress = easeOutCubic(progress)
          setStage3DAnimationProgress(easedProgress)
          
          // Interpolate between stage 0 and stage 1
          const interpolatedModel = {
            position: {
              x: stage0Config.model.position.x + (stage1Config.model.position.x - stage0Config.model.position.x) * easedProgress,
              y: stage0Config.model.position.y + (stage1Config.model.position.y - stage0Config.model.position.y) * easedProgress,
              z: stage0Config.model.position.z + (stage1Config.model.position.z - stage0Config.model.position.z) * easedProgress
            },
            rotation: {
              x: stage0Config.model.rotation.x + (stage1Config.model.rotation.x - stage0Config.model.rotation.x) * easedProgress,
              y: stage0Config.model.rotation.y + (stage1Config.model.rotation.y - stage0Config.model.rotation.y) * easedProgress,
              z: stage0Config.model.rotation.z + (stage1Config.model.rotation.z - stage0Config.model.rotation.z) * easedProgress
            },
            scale: {
              x: stage0Config.model.scale.x + (stage1Config.model.scale.x - stage0Config.model.scale.x) * easedProgress,
              y: stage0Config.model.scale.y + (stage1Config.model.scale.y - stage0Config.model.scale.y) * easedProgress,
              z: stage0Config.model.scale.z + (stage1Config.model.scale.z - stage0Config.model.scale.z) * easedProgress
            }
          }
          
          const interpolatedCamera = {
            position: {
              x: stage0Config.camera.position.x + (stage1Config.camera.position.x - stage0Config.camera.position.x) * easedProgress,
              y: stage0Config.camera.position.y + (stage1Config.camera.position.y - stage0Config.camera.position.y) * easedProgress,
              z: stage0Config.camera.position.z + (stage1Config.camera.position.z - stage0Config.camera.position.z) * easedProgress
            },
            rotation: {
              x: stage0Config.camera.rotation.x + (stage1Config.camera.rotation.x - stage0Config.camera.rotation.x) * easedProgress,
              y: stage0Config.camera.rotation.y + (stage1Config.camera.rotation.y - stage0Config.camera.rotation.y) * easedProgress,
              z: stage0Config.camera.rotation.z + (stage1Config.camera.rotation.z - stage0Config.camera.rotation.z) * easedProgress
            },
            target: {
              x: stage0Config.camera.target.x + (stage1Config.camera.target.x - stage0Config.camera.target.x) * easedProgress,
              y: stage0Config.camera.target.y + (stage1Config.camera.target.y - stage0Config.camera.target.y) * easedProgress,
              z: stage0Config.camera.target.z + (stage1Config.camera.target.z - stage0Config.camera.target.z) * easedProgress
            },
            fov: stage0Config.camera.fov + (stage1Config.camera.fov - stage0Config.camera.fov) * easedProgress,
            near: stage0Config.camera.near + (stage1Config.camera.near - stage0Config.camera.near) * easedProgress,
            far: stage0Config.camera.far + (stage1Config.camera.far - stage0Config.camera.far) * easedProgress,
            zoom: stage0Config.camera.zoom + (stage1Config.camera.zoom - stage0Config.camera.zoom) * easedProgress
          }
          
          // Interpolate lighting between stage 0 and stage 1
          const interpolatedLighting = {
            ambientIntensity: stage0Config.lighting.ambientIntensity + (stage1Config.lighting.ambientIntensity - stage0Config.lighting.ambientIntensity) * easedProgress,
            ambientColor: stage0Config.lighting.ambientColor, // Keep stage 0 color
            directionalIntensity: stage0Config.lighting.directionalIntensity + (stage1Config.lighting.directionalIntensity - stage0Config.lighting.directionalIntensity) * easedProgress,
            directionalColor: stage0Config.lighting.directionalColor, // Keep stage 0 color
            directionalPosition: {
              x: stage0Config.lighting.directionalPosition.x + (stage1Config.lighting.directionalPosition.x - stage0Config.lighting.directionalPosition.x) * easedProgress,
              y: stage0Config.lighting.directionalPosition.y + (stage1Config.lighting.directionalPosition.y - stage0Config.lighting.directionalPosition.y) * easedProgress,
              z: stage0Config.lighting.directionalPosition.z + (stage1Config.lighting.directionalPosition.z - stage0Config.lighting.directionalPosition.z) * easedProgress
            },
            directionalTarget: {
              x: stage0Config.lighting.directionalTarget.x + (stage1Config.lighting.directionalTarget.x - stage0Config.lighting.directionalTarget.x) * easedProgress,
              y: stage0Config.lighting.directionalTarget.y + (stage1Config.lighting.directionalTarget.y - stage0Config.lighting.directionalTarget.y) * easedProgress,
              z: stage0Config.lighting.directionalTarget.z + (stage1Config.lighting.directionalTarget.z - stage0Config.lighting.directionalTarget.z) * easedProgress
            },
            pointLightIntensity: stage0Config.lighting.pointLightIntensity + (stage1Config.lighting.pointLightIntensity - stage0Config.lighting.pointLightIntensity) * easedProgress,
            pointLightColor: stage0Config.lighting.pointLightColor, // Keep stage 0 color
            pointLightPosition: {
              x: stage0Config.lighting.pointLightPosition.x + (stage1Config.lighting.pointLightPosition.x - stage0Config.lighting.pointLightPosition.x) * easedProgress,
              y: stage0Config.lighting.pointLightPosition.y + (stage1Config.lighting.pointLightPosition.y - stage0Config.lighting.pointLightPosition.y) * easedProgress,
              z: stage0Config.lighting.pointLightPosition.z + (stage1Config.lighting.pointLightPosition.z - stage0Config.lighting.pointLightPosition.z) * easedProgress
            },
            pointLightDistance: stage0Config.lighting.pointLightDistance + (stage1Config.lighting.pointLightDistance - stage0Config.lighting.pointLightDistance) * easedProgress,
            spotLightIntensity: stage0Config.lighting.spotLightIntensity + (stage1Config.lighting.spotLightIntensity - stage0Config.lighting.spotLightIntensity) * easedProgress,
            spotLightColor: stage0Config.lighting.spotLightColor, // Keep stage 0 color
            spotLightPosition: {
              x: stage0Config.lighting.spotLightPosition.x + (stage1Config.lighting.spotLightPosition.x - stage0Config.lighting.spotLightPosition.x) * easedProgress,
              y: stage0Config.lighting.spotLightPosition.y + (stage1Config.lighting.spotLightPosition.y - stage0Config.lighting.spotLightPosition.y) * easedProgress,
              z: stage0Config.lighting.spotLightPosition.z + (stage1Config.lighting.spotLightPosition.z - stage0Config.lighting.spotLightPosition.z) * easedProgress
            },
            spotLightTarget: {
              x: stage0Config.lighting.spotLightTarget.x + (stage1Config.lighting.spotLightTarget.x - stage0Config.lighting.spotLightTarget.x) * easedProgress,
              y: stage0Config.lighting.spotLightTarget.y + (stage1Config.lighting.spotLightTarget.y - stage0Config.lighting.spotLightTarget.y) * easedProgress,
              z: stage0Config.lighting.spotLightTarget.z + (stage1Config.lighting.spotLightTarget.z - stage0Config.lighting.spotLightTarget.z) * easedProgress
            },
            spotLightDistance: stage0Config.lighting.spotLightDistance + (stage1Config.lighting.spotLightDistance - stage0Config.lighting.spotLightDistance) * easedProgress,
            spotLightAngle: stage0Config.lighting.spotLightAngle + (stage1Config.lighting.spotLightAngle - stage0Config.lighting.spotLightAngle) * easedProgress,
            spotLightPenumbra: stage0Config.lighting.spotLightPenumbra + (stage1Config.lighting.spotLightPenumbra - stage0Config.lighting.spotLightPenumbra) * easedProgress,
            shadowsEnabled: stage0Config.lighting.shadowsEnabled, // Keep stage 0 setting
            shadowMapSize: stage0Config.lighting.shadowMapSize, // Keep stage 0 setting
            shadowBias: stage0Config.lighting.shadowBias // Keep stage 0 setting
          }
          
          // Apply interpolated values
          setModelControls(interpolatedModel)
          setCameraControls(interpolatedCamera)
          setLightingControls(interpolatedLighting)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            // Animation complete - set to stage 1
            console.log('✅ Animation complete - transitioning to stage 1')
            setCurrent3DStage(1)
            setIs3DAnimating(false)
            setStage3DAnimationProgress(1)
            
            // Apply final stage 1 values
            setModelControls(stage1Config.model)
            setCameraControls(stage1Config.camera)
            setLightingControls(stage1Config.lighting)
          }
        }
        
        requestAnimationFrame(animate)
      } else {
        console.log('❌ Stage 1 config not found')
      }
    }, animationDelay)

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(animationTimeout)
    }
  }, [isClient, isLoading, setCurrent3DStage, setIs3DAnimating, setStage3DAnimationProgress, getStageConfigLocal, setModelControls, setCameraControls, setLightingControls, easeOutCubic])
  
  // Track key state changes
  // Note: useStateTracker calls removed to fix invalid hook call errors

  // Sync stage configurations with store - DISABLED TO PREVENT INFINITE LOOPS
  // useEffect(() => {
  //   setStageConfig(1, stage1Config)
  //   setStageConfig(2, stage2Config)
  //   setStageConfig(3, stage3Config)
  // }, [setStageConfig, stage1Config, stage2Config, stage3Config])

  // Initialize 3D stage configuration on mount - DISABLED TO PREVENT INFINITE LOOPS
  // useEffect(() => {
  //   if (isClient && !isLoading) {
  //     // Apply initial stage 1 configuration
  //     const initialStageConfig = getStageConfigLocal(1)
  //     if (initialStageConfig) {
  //       setModelControls(initialStageConfig.model)
  //       setCameraControls(initialStageConfig.camera)
  //       setLightingControls(initialStageConfig.lighting)
  //     }
  //   }
  // }, [isClient, isLoading, getStageConfigLocal])

  // Consolidated effect to handle 3D stage synchronization and configuration - DISABLED TO PREVENT INFINITE LOOPS
  // useEffect(() => {
  //   if (!isClient || isLoading) return
  //   
  //   // Only sync stage with section if not navigating via dots and not transitioning
  //   if (!isNavigatingViaDots && !isTransitioning && current3DStage > 0) {
  //     const targetStage = currentSection + 1
  //     if (targetStage !== current3DStage) {
  //       setCurrent3DStage(targetStage)
  //       return // Let the next effect handle the configuration
  //     }
  //   }
  //   
  //   // Apply stage configuration when not animating
  //   if (!isAnimating && !is3DAnimating) {
  //     const stageConfig = getStageConfigLocal(current3DStage)
  //     if (stageConfig) {
  //       setModelControls(stageConfig.model)
  //       setCameraControls(stageConfig.camera)
  //       setLightingControls(stageConfig.lighting)
  //     } else {
  //       // Fallback to a basic configuration
  //       const fallbackConfig = {
  //         model: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
  //         camera: { position: { x: 0, y: 0, z: 5 }, fov: 75 },
  //         lighting: { 
  //           ambientIntensity: 1, 
  //           ambientColor: '#ffffff', 
  //           directionalIntensity: 1, 
  //           directionalColor: '#ffffff', 
  //           directionalPosition: { x: 0, y: 0, z: 0 }, 
  //           directionalTarget: { x: 0, y: 0, z: 0 }, 
  //           pointLightIntensity: 0, 
  //           pointLightColor: '#ffffff', 
  //           pointLightPosition: { x: 0, y: 0, z: 0 }, 
  //           pointLightDistance: 10, 
  //           spotLightIntensity: 0, 
  //           spotLightColor: '#ffffff', 
  //           spotLightPosition: { x: 0, y: 0, z: 0 }, 
  //           spotLightTarget: { x: 0, y: 0, z: 0 }, 
  //           spotLightDistance: 10, 
  //           spotLightAngle: 30, 
  //           spotLightPenumbra: 0, 
  //           shadowsEnabled: false, 
  //           shadowMapSize: 1024, 
  //           shadowBias: 0 
  //         }
  //       }
  //       setModelControls(fallbackConfig.model)
  //       setCameraControls(fallbackConfig.camera)
  //       setLightingControls(fallbackConfig.lighting)
  //     }
  //   }
  // }, [currentSection, current3DStage, isClient, isNavigatingViaDots, isTransitioning, isLoading, isAnimating, is3DAnimating, getStageConfigLocal])

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
          setLoading(false)
        }, remainingTime)
      } else {
        // Fallback: if loadingStartTime is not set, wait the full 2 seconds
        setTimeout(() => {
          setLoading(false)
        }, minLoadingTime)
      }
    }
    
    completeLoading()
  }, [loadingStartTime])

  // Helper functions that don't change - memoized to prevent recreation
  const lerp = useCallback((start: number, end: number, progress: number) => {
    return start + (end - start) * progress
  }, [])

  const lerpColor = useCallback((startColor: string, endColor: string, progress: number): string => {
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
  }, [lerp])

  const easeInOutSine = useCallback((t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }, [])

  // Memoized navigation dots component to prevent unnecessary re-renders
  const NavigationDots = useMemo(() => {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
            <button
              key={section}
              onClick={() => navigateToSection(section)}
              className={`nav-dot rounded-full border-2 transition-all duration-300 touch-manipulation ${
                currentSection === section
                  ? 'bg-white border-white'
                  : 'bg-transparent border-gray-400 hover:border-white'
              }`}
              title={`Section ${section}`}
              style={{ 
                touchAction: 'manipulation'
              }}
            />
          ))}
        </div>
      </div>
    )
  }, [currentSection, navigateToSection])








  // Disabled animation values calculation - static scene only
  const animatedValues = useMemo(() => {
    return null // No animations in static scene
    
    if (is3DAnimating) {
      const progress = easeInOutSine(stage3DAnimationProgress)
      let fromStage, toStage
      
      // Handle all stage transitions - animate from current stage to target stage
      // The target stage is determined by the current section
      const targetStage = currentSection
      
      if (current3DStage === targetStage) {
        // No animation needed if already at target stage
        return null
      }
      
      // Get the current stage configuration and target stage configuration
      fromStage = getStageConfigLocal(current3DStage)
      toStage = getStageConfigLocal(targetStage)
      
      // Check if both stages are valid
      if (!fromStage || !toStage) {
        return null
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
    } else if (isAnimating) {
      const progress = easeInOutSine(animationProgress)
      
      // Get stage configurations with null checks
      const stage1 = getStageConfigLocal(1)
      const stage2 = getStageConfigLocal(2)
      
      if (!stage1 || !stage2) {
        return null
      }
      
      return {
        model: {
          position: {
            x: lerp(stage1.model.position.x, stage2.model.position.x, progress),
            y: lerp(stage1.model.position.y, stage2.model.position.y, progress),
            z: lerp(stage1.model.position.z, stage2.model.position.z, progress)
          },
          rotation: {
            x: lerp(stage1.model.rotation.x, stage2.model.rotation.x, progress),
            y: lerp(stage1.model.rotation.y, stage2.model.rotation.y, progress),
            z: lerp(stage1.model.rotation.z, stage2.model.rotation.z, progress)
          },
          scale: {
            x: lerp(stage1.model.scale.x, stage2.model.scale.x, progress),
            y: lerp(stage1.model.scale.y, stage2.model.scale.y, progress),
            z: lerp(stage1.model.scale.z, stage2.model.scale.z, progress)
          }
        },
        camera: {
          position: {
            x: lerp(stage1.camera.position.x, stage2.camera.position.x, progress),
            y: lerp(stage1.camera.position.y, stage2.camera.position.y, progress),
            z: lerp(stage1.camera.position.z, stage2.camera.position.z, progress)
          },
          fov: lerp(stage1.camera.fov, stage2.camera.fov, progress)
        },
        lighting: {
          ambientIntensity: lerp(stage1.lighting.ambientIntensity, stage2.lighting.ambientIntensity, progress),
          ambientColor: lerpColor(stage1.lighting.ambientColor, stage2.lighting.ambientColor, progress),
          directionalIntensity: lerp(stage1.lighting.directionalIntensity, stage2.lighting.directionalIntensity, progress),
          directionalColor: lerpColor(stage1.lighting.directionalColor, stage2.lighting.directionalColor, progress),
          directionalPosition: {
            x: lerp(stage1.lighting.directionalPosition.x, stage2.lighting.directionalPosition.x, progress),
            y: lerp(stage1.lighting.directionalPosition.y, stage2.lighting.directionalPosition.y, progress),
            z: lerp(stage1.lighting.directionalPosition.z, stage2.lighting.directionalPosition.z, progress)
          },
          directionalTarget: {
            x: lerp(stage1.lighting.directionalTarget.x, stage2.lighting.directionalTarget.x, progress),
            y: lerp(stage1.lighting.directionalTarget.y, stage2.lighting.directionalTarget.y, progress),
            z: lerp(stage1.lighting.directionalTarget.z, stage2.lighting.directionalTarget.z, progress)
          },
          pointLightIntensity: lerp(stage1.lighting.pointLightIntensity, stage2.lighting.pointLightIntensity, progress),
          pointLightColor: lerpColor(stage1.lighting.pointLightColor, stage2.lighting.pointLightColor, progress),
          pointLightPosition: {
            x: lerp(stage1.lighting.pointLightPosition.x, stage2.lighting.pointLightPosition.x, progress),
            y: lerp(stage1.lighting.pointLightPosition.y, stage2.lighting.pointLightPosition.y, progress),
            z: lerp(stage1.lighting.pointLightPosition.z, stage2.lighting.pointLightPosition.z, progress)
          },
          pointLightDistance: lerp(stage1.lighting.pointLightDistance, stage2.lighting.pointLightDistance, progress),
          spotLightIntensity: lerp(stage1.lighting.spotLightIntensity, stage2.lighting.spotLightIntensity, progress),
          spotLightColor: lerpColor(stage1.lighting.spotLightColor, stage2.lighting.spotLightColor, progress),
          spotLightPosition: {
            x: lerp(stage1.lighting.spotLightPosition.x, stage2.lighting.spotLightPosition.x, progress),
            y: lerp(stage1.lighting.spotLightPosition.y, stage2.lighting.spotLightPosition.y, progress),
            z: lerp(stage1.lighting.spotLightPosition.z, stage2.lighting.spotLightPosition.z, progress)
          },
          spotLightTarget: {
            x: lerp(stage1.lighting.spotLightTarget.x, stage2.lighting.spotLightTarget.x, progress),
            y: lerp(stage1.lighting.spotLightTarget.y, stage2.lighting.spotLightTarget.y, progress),
            z: lerp(stage1.lighting.spotLightTarget.z, stage2.lighting.spotLightTarget.z, progress)
          },
          spotLightDistance: lerp(stage1.lighting.spotLightDistance, stage2.lighting.spotLightDistance, progress),
          spotLightAngle: lerp(stage1.lighting.spotLightAngle, stage2.lighting.spotLightAngle, progress),
          spotLightPenumbra: lerp(stage1.lighting.spotLightPenumbra, stage2.lighting.spotLightPenumbra, progress),
          shadowsEnabled: stage2.lighting.shadowsEnabled, // Use Stage 2 shadows setting
          shadowMapSize: stage2.lighting.shadowMapSize,
          shadowBias: lerp(stage1.lighting.shadowBias, stage2.lighting.shadowBias, progress)
        }
      }
    }
    
    return null
  }, [])

  // Disabled - no animated values in static scene
  // useEffect(() => {
  //   // No animations in static scene
  // }, [])




  return (
    <PerformanceMonitor componentName="Home">
      <div className="relative home-page">
        
        {/* Loading Screen */}
        <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      
      {/* Section Loading Screen */}
      <SectionLoadingScreen 
        isVisible={isSectionLoading} 
        fromSection={sectionLoadingFrom} 
        toSection={sectionLoadingTo} 
      />
      
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
        current3DStage={current3DStage}
        componentControls={componentControls}
        categoryVisibility={categoryVisibility}
        onComponentControlsChange={setComponentControls}
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
      <AnimationSystem />

      {/* Scrollable Content - 8x screen height */}
      <main 
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 transition-opacity duration-500 smooth-scroll ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          height: '800vh',
          minHeight: '800vh',
          touchAction: 'pan-y' // Allow vertical scrolling on mobile
        }}
      >

        {/* Section Navigation Dots */}
        {NavigationDots}

        {/* Mobile Scroll Indicator */}
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 md:hidden ${currentSection === 8 ? 'hidden' : 'block'}`}>
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
        <div className="section-content relative z-10" style={{ zIndex: 10 }}>
          {/* Section 1 - Hero - Always render */}
          <HeroSection
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 2 - Render if current or adjacent */}
          {(currentSection >= 1 && currentSection <= 3) && (
            <Section2
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 3 - Render if current or adjacent */}
          {(currentSection >= 2 && currentSection <= 4) && (
            <Section3
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 4 - Render if current or adjacent */}
          {(currentSection >= 3 && currentSection <= 5) && (
            <Section4
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 5 - Render if current or adjacent */}
          {(currentSection >= 4 && currentSection <= 6) && (
            <Section5
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 6 - Render if current or adjacent */}
          {(currentSection >= 5 && currentSection <= 7) && (
            <Section6
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 7 - Render if current or adjacent */}
          {(currentSection >= 6 && currentSection <= 8) && (
            <Section7
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 8 - Render if current or adjacent */}
          {(currentSection >= 7 && currentSection <= 8) && (
            <Section8
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}
        </div>
      </main>


      {/* Top Menu */}
      {!isLoading && <TopMenu />}

      {/* Dev Controls - Right Sidebar */}
      {isDevMode && (
        <DevControls
          isDevMode={isDevMode}
          onToggleDevMode={() => setIsDevMode(!isDevMode)}
          componentControls={componentControls}
          onComponentControlsChange={setComponentControls}
          categoryVisibility={categoryVisibility}
          onCategoryVisibilityChange={setCategoryVisibility}
          transitionName={transitionName}
          stage1Config={stage1Config}
          stage2Config={stage2Config}
          stage3Config={stage3Config}
        />
      )}

      </div>
    </PerformanceMonitor>
  )
}
