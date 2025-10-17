'use client'


import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopMenu from '../components/TopMenu'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import DevControls from '../components/DevControls'
import { ThreeSceneManager, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config, stage1MobileConfig, stage2MobileConfig, stage3MobileConfig, stage4MobileConfig, stage5MobileConfig, stage6MobileConfig, stage7MobileConfig, stage8MobileConfig, stage9MobileConfig, stage1TabletConfig, stage2TabletConfig, stage3TabletConfig, stage4TabletConfig, stage5TabletConfig, stage6TabletConfig, stage7TabletConfig, stage8TabletConfig, stage9TabletConfig } from '../components/ThreeScene'
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
import { ComponentControls, defaultComponentControls, CategoryVisibility, defaultCategoryVisibility } from '../components/DevControls/sections/product3d/types'
import { LoadingScreen, SectionLoadingScreen } from '../components/Loading'
import { useDebugContext } from '../components/DebugSidebar/DebugContext'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Get debug context
  const {
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
  } = useDebugContext()
  
  const [isDevMode, setIsDevMode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [is3DAnimating, setIs3DAnimating] = useState(false)
  const [isNavigatingViaDots, setIsNavigatingViaDots] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
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
    // Ensure stage is a valid number
    if (typeof stage !== 'number' || stage < 1 || stage > 9) {
      console.warn(`Invalid stage number: ${stage}, falling back to stage 1`)
      stage = 1
    }

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
            return stage1Config
        }
    }
  }, [deviceType])

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
        
        // Update 3D stage to match the target section (stage = section + 1)
        const targetStage = targetSection + 1
        setCurrent3DStage(targetStage)
        
        // Apply the stage configuration immediately
        const stageConfig = getStageConfig(targetStage)
        if (stageConfig) {
          setModelControls(stageConfig.model)
          setCameraControls(stageConfig.camera)
          setLightingControls(stageConfig.lighting)
        }
        
        // Clear the navigation flag after a short delay to prevent conflicts
        setTimeout(() => {
          setIsNavigatingViaDots(false)
        }, 100)
      }
    }
    
    requestAnimationFrame(animateTransition)
  }, [currentSection, isScrolling, isTransitioning, isClient, easeOutCubic, setScrollDirection, setTransitionName, setIsScrolling, setIsTransitioning, setTransitionProgress, setScrollPosition, setCurrentSection, setCurrent3DStage, getStageConfig, setModelControls, setCameraControls, setLightingControls])

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Sync stage configurations with debug context
  useEffect(() => {
    setStage1Config(stage1Config)
    setStage2Config(stage2Config)
    setStage3Config(stage3Config)
  }, [setStage1Config, setStage2Config, setStage3Config])

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
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
            <button
              key={section}
              onClick={() => navigateToSection(section)}
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
    )
  }, [currentSection, navigateToSection])








  // Memoize animated values calculation to prevent unnecessary recalculations
  const animatedValues = useMemo(() => {
    if (!is3DAnimating && !isAnimating) return null
    
    if (is3DAnimating) {
      const progress = easeInOutSine(stage3DAnimationProgress)
      let fromStage, toStage
      
      if (current3DStage === 2) {
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      } else if (current3DStage === 3) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(3)
          toStage = getStageConfig(4)
        } else {
          fromStage = getStageConfig(3)
          toStage = getStageConfig(2)
        }
      } else if (current3DStage === 4) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(4)
          toStage = getStageConfig(5)
        } else {
          fromStage = getStageConfig(4)
          toStage = getStageConfig(3)
        }
      } else if (current3DStage === 5) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(5)
          toStage = getStageConfig(6)
        } else {
          fromStage = getStageConfig(5)
          toStage = getStageConfig(4)
        }
      } else if (current3DStage === 6) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(6)
          toStage = getStageConfig(7)
        } else {
          fromStage = getStageConfig(6)
          toStage = getStageConfig(5)
        }
      } else if (current3DStage === 7) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(7)
          toStage = getStageConfig(8)
        } else {
          fromStage = getStageConfig(7)
          toStage = getStageConfig(6)
        }
      } else if (current3DStage === 8) {
        if (scrollDirection === 'down') {
          fromStage = getStageConfig(8)
          toStage = getStageConfig(9)
        } else {
          fromStage = getStageConfig(8)
          toStage = getStageConfig(7)
        }
      } else if (current3DStage === 9) {
        fromStage = getStageConfig(9)
        toStage = getStageConfig(8)
      } else {
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      }
      
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
      const stage1 = getStageConfig(1)
      const stage2 = getStageConfig(2)
      
      if (!stage1 || !stage2) {
        return null
      }
      
      // Create luxury lighting animation for stage 1 to stage 2
      const luxuryLightingAnimation = new LuxuryLightingAnimation({
        stage1: stage1.lighting,
        stage2: stage2.lighting,
        duration: 3000 // 3 seconds for luxury product launch
      })
      
      const luxuryLighting = luxuryLightingAnimation.getLightingAtProgress(progress)
      
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
        lighting: luxuryLighting
      }
    }
    
    return null
  }, [is3DAnimating, stage3DAnimationProgress, isAnimating, animationProgress, current3DStage, scrollDirection, deviceType, getStageConfig, easeInOutSine, lerp, lerpColor])

  // Update model controls to reflect current animated values
  useEffect(() => {
    if (animatedValues) {
      setModelControls(animatedValues.model)
      if (animatedValues.camera) {
        setCameraControls(animatedValues.camera)
      }
      if (animatedValues.lighting) {
        setLightingControls(animatedValues.lighting)
      }
    }
  }, [animatedValues])

  // Update model controls when stage changes (not animating and not navigating via dots)
  useEffect(() => {
    if (!is3DAnimating && !isAnimating && !isNavigatingViaDots) {
      // Update model controls to match the current stage configuration
      const stageConfig = getStageConfig(current3DStage)
      
      // Safety check to prevent undefined errors
      if (stageConfig && stageConfig.model) {
        setModelControls(stageConfig.model)
      } else {
        // Fallback to stage 1 configuration
        const fallbackConfig = getStageConfig(1)
        if (fallbackConfig && fallbackConfig.model) {
          setModelControls(fallbackConfig.model)
        }
      }
    }
  }, [current3DStage, is3DAnimating, isAnimating, isNavigatingViaDots, deviceType])




  return (
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
        isAnimating={isAnimating}
        animationProgress={animationProgress}
        is3DAnimating={is3DAnimating}
        stage3DAnimationProgress={stage3DAnimationProgress}
        current3DStage={current3DStage}
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
          height: '800vh',
          minHeight: '800vh',
          touchAction: 'pan-y' // Allow vertical scrolling on mobile
        }}
      >

        {/* Section Navigation Dots */}
        {NavigationDots}

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

      {/* Show Dev Mode Button when hidden - TEMPORARILY HIDDEN */}
      {false && !isLoading && !isDevMode && (
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
