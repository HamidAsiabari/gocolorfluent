'use client'

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
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

// Memoized ThreeSceneManager to prevent unnecessary re-renders
const MemoizedThreeSceneManager = memo(ThreeSceneManager, (prev, next) => {
  // Return true if props are the same (no re-render needed)
  // Use deep comparison for objects to prevent unnecessary re-renders
  const isSame = (
    prev.current3DStage === next.current3DStage &&
    prev.isActive === next.isActive &&
    prev.mountRef === next.mountRef &&
    prev.onComponentControlsChange === next.onComponentControlsChange &&
    prev.onLoadingProgress === next.onLoadingProgress &&
    prev.onLoadingComplete === next.onLoadingComplete &&
    prev.componentControls === next.componentControls &&
    prev.categoryVisibility === next.categoryVisibility
  )
  
  // Only check object properties if basic props are the same
  if (!isSame) return false
  
  // Deep compare object properties
  const modelSame = (
    prev.modelControls?.position?.x === next.modelControls?.position?.x &&
    prev.modelControls?.position?.y === next.modelControls?.position?.y &&
    prev.modelControls?.position?.z === next.modelControls?.position?.z &&
    prev.modelControls?.rotation?.x === next.modelControls?.rotation?.x &&
    prev.modelControls?.rotation?.y === next.modelControls?.rotation?.y &&
    prev.modelControls?.rotation?.z === next.modelControls?.rotation?.z &&
    prev.modelControls?.scale?.x === next.modelControls?.scale?.x &&
    prev.modelControls?.scale?.y === next.modelControls?.scale?.y &&
    prev.modelControls?.scale?.z === next.modelControls?.scale?.z
  )
  
  const cameraSame = (
    prev.cameraControls?.position?.x === next.cameraControls?.position?.x &&
    prev.cameraControls?.position?.y === next.cameraControls?.position?.y &&
    prev.cameraControls?.position?.z === next.cameraControls?.position?.z &&
    prev.cameraControls?.fov === next.cameraControls?.fov
  )
  
  const lightingSame = (
    prev.lightingControls?.ambientIntensity === next.lightingControls?.ambientIntensity &&
    prev.lightingControls?.directionalIntensity === next.lightingControls?.directionalIntensity
  )
  
  return modelSame && cameraSame && lightingSame
})

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Check if this is a navigation from another page by looking at referrer
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    // Always treat as initial load to always play the stage 0->1 animation
    // This ensures the animation always plays regardless of where the user came from
    if (typeof window !== 'undefined') {
      const referrer = document.referrer
      const currentDomain = window.location.origin
      const currentPath = window.location.pathname
      
      // Parse referrer path
      let referrerPath = ''
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer)
          referrerPath = referrerUrl.pathname
        } catch (e) {
          // If parsing fails, treat as initial load
          return true
        }
      }
      
      // Check if this is an internal navigation (same domain)
      const isInternalNavigation = referrer && referrer.startsWith(currentDomain) && referrer !== window.location.href
      // Check if we're coming from a different path
      const isFromDifferentPath = referrerPath !== '' && referrerPath !== currentPath
      
      console.log('🔍 Initial load check:', { referrer, referrerPath, currentPath, isInternalNavigation, isFromDifferentPath })
      
      // Always treat as initial load so animation always plays
      return true
    }
    return true
  })
  
  // Optimized state subscriptions to prevent unnecessary re-renders
  const currentSection = useAppStore((state) => state.currentSection)
  const isClient = useAppStore((state) => state.isClient)
  const isLoading = useAppStore((state) => state.isLoading)
  const loadingProgress = useAppStore((state) => state.loadingProgress)
  const isScrolling = useAppStore((state) => state.isScrolling)
  const scrollDirection = useAppStore((state) => state.scrollDirection)
  const isTransitioning = useAppStore((state) => state.isTransitioning)
  const transitionProgress = useAppStore((state) => state.transitionProgress)
  const scrollPosition = useAppStore((state) => state.scrollPosition)
  const isNavigatingViaDots = useAppStore((state) => state.isNavigatingViaDots)
  
  // 3D state - only subscribe to what's needed
  const current3DStage = useAppStore((state) => state.current3DStage)
  const stage3DAnimationProgress = useAppStore((state) => state.stage3DAnimationProgress)
  const is3DAnimating = useAppStore((state) => state.is3DAnimating)
  const isAnimating = useAppStore((state) => state.isAnimating)
  const animationProgress = useAppStore((state) => state.animationProgress)
  const modelControls = useAppStore((state) => state.modelControls)
  const cameraControls = useAppStore((state) => state.cameraControls)
  const lightingControls = useAppStore((state) => state.lightingControls)
  
  // Actions - memoized to prevent re-renders
  const setCurrentSection = useAppStore((state) => state.setCurrentSection)
  const setIsClient = useAppStore((state) => state.setIsClient)
  const setLoading = useAppStore((state) => state.setLoading)
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
  const setIsScrolling = useAppStore((state) => state.setIsScrolling)
  const setScrollDirection = useAppStore((state) => state.setScrollDirection)
  const setIsTransitioning = useAppStore((state) => state.setIsTransitioning)
  const setTransitionProgress = useAppStore((state) => state.setTransitionProgress)
  const setScrollPosition = useAppStore((state) => state.setScrollPosition)
  const setIsNavigatingViaDots = useAppStore((state) => state.setIsNavigatingViaDots)
  const setCurrent3DStage = useAppStore((state) => state.setCurrent3DStage)
  const setStage3DAnimationProgress = useAppStore((state) => state.setStage3DAnimationProgress)
  const setIs3DAnimating = useAppStore((state) => state.setIs3DAnimating)
  const setIsAnimating = useAppStore((state) => state.setIsAnimating)
  const setAnimationProgress = useAppStore((state) => state.setAnimationProgress)
  const setModelControls = useAppStore((state) => state.setModelControls)
  const setCameraControls = useAppStore((state) => state.setCameraControls)
  const setLightingControls = useAppStore((state) => state.setLightingControls)
  const addDebugLog = useAppStore((state) => state.addDebugLog)
  const setDebugMode = useAppStore((state) => state.setDebugMode)
  
  // Local state for things not in store yet
  const [transitionName, setTransitionName] = useState<string | null>(null)
  
  // Dev controls state
  const [isDevMode, setIsDevMode] = useState(false) // Disable dev mode temporarily
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  
  // Memoize isActive calculation to prevent unnecessary re-renders
  const isActive = useMemo(() => {
    return currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)
  }, [currentSection, isScrolling, scrollDirection, scrollPosition])
  
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
        // Transition complete - ensure final scroll position first
        const finalScrollY = (targetSection - 1) * window.innerHeight
        window.scrollTo(0, finalScrollY)
        setScrollPosition(finalScrollY)
        
        // Use THREE requestAnimationFrames to ensure scroll is fully rendered before state update
        // First frame: let the browser start rendering the scroll position
        requestAnimationFrame(() => {
          // Second frame: ensure the scroll position is painted
          requestAnimationFrame(() => {
            // Third frame: Update all state atomically to prevent flash
            requestAnimationFrame(() => {
              // CRITICAL: Update all state together to ensure sections render correctly
              setTransitionProgress(0)
              setIsScrolling(false)
              setTransitionName(null)
              
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
              
              // Set isTransitioning to false and update currentSection together
              // This ensures isTransitioning=false when sections recalculate positions
              setIsTransitioning(false)
              setCurrentSection(targetSection)
              
              // Clear the navigation flag after a short delay to prevent conflicts
              setTimeout(() => {
                setIsNavigatingViaDots(false)
              }, 100)
            })
          })
        })
      }
    }
    
    requestAnimationFrame(animateTransition)
  }, [currentSection, isScrolling, isTransitioning, isClient, easeOutCubic, getStageConfigLocal])

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Set initial stage - always start with Stage 0 and animate to Stage 1
  useEffect(() => {
    if (!isClient || isLoading) return

    // Initial page load - start with Stage 0 and animate to Stage 1
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
    }

    // Start animation to stage 1 after a short delay
    const animationDelay = 300 // 0.3 second delay
    const animationTimeout = setTimeout(() => {
      console.log('🎬 Starting automatic transition from stage 0 to stage 1')
      
      // Get stage 1 configuration
      const stage1Config = getStageConfigLocal(1)
      if (stage1Config) {
        console.log('🎯 Stage 1 config:', stage1Config)
        
        // Start the animation
        setIs3DAnimating(true)
        setStage3DAnimationProgress(0)
        
        // Animate the transition with optimized performance
        const duration = 1000 // Reduced to 1 second animation for maximum smoothness
        const startTime = performance.now()
        let lastFrameTime = startTime
        
        // Get stage 0 config once
        const stage0Config = getStageConfigLocal(0)
        if (!stage0Config) {
          console.error('Stage 0 config not found for animation interpolation!')
          return
        }
        
        // Use direct Three.js animation to bypass React re-renders
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Apply easing
          const easedProgress = easeOutCubic(progress)
          
          // Update progress state only occasionally to reduce re-renders
          if (Math.floor(progress * 30) !== Math.floor((progress - 0.033) * 30)) {
            setStage3DAnimationProgress(easedProgress)
          }
          
          // Direct Three.js animation - bypass React state updates
          if ((window as any).directThreeAnimation) {
            (window as any).directThreeAnimation({
              progress: easedProgress,
              stage0Config,
              stage1Config
            })
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            // Animation complete - set to stage 1
            console.log('✅ Animation complete - transitioning to stage 1')
            setCurrent3DStage(1)
            setIs3DAnimating(false)
            setStage3DAnimationProgress(1)
            
            // Apply final stage 1 values
            // On mobile, the directThreeAnimation already positioned the camera at mobile-adjusted Stage 1
            // Setting desktop values to store will cause forceDevControlUpdates to re-apply mobile adjustments,
            // which should keep the camera at the same position (no jump)
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
      <div className="relative home-page w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        
        {/* Loading Screen */}
        <LoadingScreen isLoading={isLoading} progress={loadingProgress} />
      
      {/* Section Loading Screen */}
      <SectionLoadingScreen 
        isVisible={isSectionLoading} 
        fromSection={sectionLoadingFrom} 
        toSection={sectionLoadingTo} 
      />
      
      {/* 3D Container - Always mounted but conditionally visible */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-full h-screen touch-none"
        style={{ 
          zIndex: (currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)) ? 1 : -1,
          opacity: (currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)) ? 1 : 0,
          pointerEvents: (currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)) ? 'auto' : 'none',
          transition: 'opacity 0.05s ease-out',
          willChange: 'opacity',
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Optimize rendering
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      />
      
      {/* Three.js Scene Manager - Always mounted but conditionally active */}
      <MemoizedThreeSceneManager
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
        isActive={isActive}
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
        className={`relative bg-gradient-to-br from-gray-900 to-gray-800 transition-opacity duration-500 smooth-scroll ${isLoading ? 'opacity-0' : 'opacity-100'} w-full`}
        style={{ 
          height: '800vh',
          minHeight: '800vh',
          maxWidth: '100%',
          overflowX: 'hidden',
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
        <div className="section-content relative z-10 w-full" style={{ zIndex: 10, maxWidth: '100%' }}>
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

          {/* Section 3 - Render if current, previous, or next (show for sections 2-4) */}
          {(currentSection >= 2 && currentSection <= 4) && (
            <Section3
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 4 - Render if current, previous, or next (show for sections 3-5) */}
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

          {/* Section 8 - Render if current (show for sections 7-8) */}
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
