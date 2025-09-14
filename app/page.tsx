'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import DevControls from '../components/DevControls'
import { ThreeSceneManager, stage1Config, stage2Config, stage3Config } from '../components/ThreeScene'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  
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


  // Interpolation function for smooth animation
  const lerp = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress
  }

  // Color interpolation function
  const lerpColor = (startColor: string, endColor: string, progress: number): string => {
    // Remove # from hex colors
    const start = startColor.replace('#', '')
    const end = endColor.replace('#', '')
    
    // Convert to RGB
    const startR = parseInt(start.substr(0, 2), 16)
    const startG = parseInt(start.substr(2, 2), 16)
    const startB = parseInt(start.substr(4, 2), 16)
    
    const endR = parseInt(end.substr(0, 2), 16)
    const endG = parseInt(end.substr(2, 2), 16)
    const endB = parseInt(end.substr(4, 2), 16)
    
    // Interpolate each component
    const r = Math.round(lerp(startR, endR, progress))
    const g = Math.round(lerp(startG, endG, progress))
    const b = Math.round(lerp(startB, endB, progress))
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // Easing functions for smooth animations
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const easeInOutQuart = (t: number): number => {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
  }

  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

  // Use the smoothest easing function
  const easeInOut = easeInOutSine

  // Get animated values based on current progress
  const getAnimatedValues = () => {
    // Handle section-based 3D stage animations
    if (is3DAnimating) {
      const progress = easeInOut(stage3DAnimationProgress)
      const fromStage = current3DStage === 2 ? stage2Config : stage3Config
      const toStage = current3DStage === 2 ? stage3Config : stage2Config
      
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

    // Handle initial Stage 1 to Stage 2 animation
    if (isAnimating) {
      const progress = easeInOut(animationProgress)
      
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

    // Return current stage configuration if no animation
    const currentStageConfig = current3DStage === 1 ? stage1Config : 
                              current3DStage === 2 ? stage2Config : stage3Config
    return { 
      model: currentStageConfig.model, 
      camera: currentStageConfig.camera, 
      lighting: currentStageConfig.lighting 
    }
  }



  // Trigger 3D stage animation based on section transition start
  useEffect(() => {
    if (isTransitioning && scrollDirection === 'down' && currentSection === 1 && current3DStage === 2 && !is3DAnimating) {
      // Start Stage 2 to Stage 3 animation when transitioning to Section 2
      console.log('Starting Stage 2 to Stage 3 animation')
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 3000 // 3 seconds
      
      const animateStage3 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        console.log('Animation progress:', progress)
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage3)
        } else {
          console.log('Stage 2 to Stage 3 animation complete')
          setIs3DAnimating(false)
          setCurrent3DStage(3)
        }
      }
      
      requestAnimationFrame(animateStage3)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 2 && current3DStage === 3 && !is3DAnimating) {
      // Start Stage 3 to Stage 2 animation when transitioning to Section 1
      console.log('Starting Stage 3 to Stage 2 animation')
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 3000 // 3 seconds
      
      const animateStage2 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        console.log('Animation progress:', progress)
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage2)
        } else {
          console.log('Stage 3 to Stage 2 animation complete')
          setIs3DAnimating(false)
          setCurrent3DStage(2)
        }
      }
      
      requestAnimationFrame(animateStage2)
    }
  }, [isTransitioning, scrollDirection, currentSection, current3DStage, is3DAnimating])

  // Sync Dev Controls with current stage when stage changes
  useEffect(() => {
    if (!is3DAnimating && !isAnimating) {
      const currentStageConfig = current3DStage === 1 ? stage1Config : 
                                current3DStage === 2 ? stage2Config : stage3Config
      setModelControls(currentStageConfig.model)
      setCameraControls(currentStageConfig.camera)
      setLightingControls(currentStageConfig.lighting)
    }
  }, [current3DStage, is3DAnimating, isAnimating])

  // Set client flag and track scroll position with locked scrolling
  useEffect(() => {
    setIsClient(true)
    
    let isScrollingToSection = false
    let wheelTimeout: NodeJS.Timeout | undefined
    
    // Lock scroll position to current section
    const lockScrollPosition = () => {
      const windowHeight = window.innerHeight
      const targetScrollY = (currentSection - 1) * windowHeight
      window.scrollTo(0, targetScrollY)
      setScrollPosition(targetScrollY)
    }
    
    // Handle wheel events for section navigation
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault() // Prevent default scrolling
      
      if (isScrollingToSection) return
      
      // Clear any existing timeout
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      
      // Determine scroll direction
      const isScrollingDown = e.deltaY > 0
      const isScrollingUp = e.deltaY < 0
      
      if (isScrollingDown || isScrollingUp) {
        navigateToSection(isScrollingDown ? 'down' : 'up')
      }
    }
    
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingToSection) return
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        navigateToSection('down')
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        navigateToSection('up')
      }
    }
    
    // Navigate to next or previous section
    const navigateToSection = (direction: 'up' | 'down') => {
      if (isScrollingToSection) return
      
      let targetSection = currentSection
      
      if (direction === 'down') {
        targetSection = Math.min(8, currentSection + 1)
      } else {
        targetSection = Math.max(1, currentSection - 1)
      }
      
      if (targetSection !== currentSection) {
        const transitionName = `section${currentSection}to${targetSection}`
        
        // Start transition animation
        setScrollDirection(direction)
        setTransitionName(transitionName)
        setIsScrolling(true)
        setIsTransitioning(true)
        setTransitionProgress(0)
        isScrollingToSection = true
        
        // Animate transition progress
        const duration = 2000 // 2 seconds
        const startTime = performance.now()
        
        const animateTransition = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Easing function for smooth animation
          const easeInOutCubic = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
          }
          
          const easedProgress = easeInOutCubic(progress)
          setTransitionProgress(easedProgress)
          
          if (progress < 1) {
            requestAnimationFrame(animateTransition)
          } else {
            // Transition complete
            setCurrentSection(targetSection)
            setIsScrolling(false)
            setIsTransitioning(false)
            setTransitionProgress(0)
            isScrollingToSection = false
            setTransitionName(null)
            
            // Update scroll position
            const targetScrollY = (targetSection - 1) * window.innerHeight
            setScrollPosition(targetScrollY)
            window.scrollTo(0, targetScrollY)
          }
        }
        
        requestAnimationFrame(animateTransition)
      }
    }
    
    // Update scroll position display
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY)
    }
    
    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', updateScrollPosition)
    
    // Lock initial scroll position
    lockScrollPosition()
    
    // Lock scroll position on resize
    const handleResize = () => {
      lockScrollPosition()
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', updateScrollPosition)
      window.removeEventListener('resize', handleResize)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [currentSection])

  // Initialize scroll position on mount
  useEffect(() => {
    if (isClient) {
      const windowHeight = window.innerHeight
      const initialScrollY = (currentSection - 1) * windowHeight
      window.scrollTo(0, initialScrollY)
      setScrollPosition(initialScrollY)
    }
  }, [isClient, currentSection])

  // Smooth scroll function
  const smoothScrollTo = (targetY: number, duration: number) => {
    const startY = window.scrollY
    const distance = targetY - startY
    const startTime = performance.now()
    
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      
      const currentY = startY + distance * easedProgress
      window.scrollTo(0, currentY)
      
      // Update scroll position state during animation
      setScrollPosition(currentY)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }
    
    requestAnimationFrame(animateScroll)
  }

  // Start Stage 1 to Stage 2 animation after component mounts
  useEffect(() => {
    if (!isClient) return

    // Start animation after a short delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      // Animation duration: 3 seconds
      const duration = 3000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        setAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Animation complete - update state to Stage 2 values
          setModelControls({
            position: stage2Config.model.position,
            rotation: stage2Config.model.rotation,
            scale: stage2Config.model.scale
          })
          setCameraControls({
            position: stage2Config.camera.position,
            fov: stage2Config.camera.fov
          })
          setLightingControls({
            ambientIntensity: stage2Config.lighting.ambientIntensity,
            ambientColor: stage2Config.lighting.ambientColor,
            directionalIntensity: stage2Config.lighting.directionalIntensity,
            directionalColor: stage2Config.lighting.directionalColor,
            directionalPosition: stage2Config.lighting.directionalPosition,
            directionalTarget: stage2Config.lighting.directionalTarget,
            pointLightIntensity: stage2Config.lighting.pointLightIntensity,
            pointLightColor: stage2Config.lighting.pointLightColor,
            pointLightPosition: stage2Config.lighting.pointLightPosition,
            pointLightDistance: stage2Config.lighting.pointLightDistance,
            spotLightIntensity: stage2Config.lighting.spotLightIntensity,
            spotLightColor: stage2Config.lighting.spotLightColor,
            spotLightPosition: stage2Config.lighting.spotLightPosition,
            spotLightTarget: stage2Config.lighting.spotLightTarget,
            spotLightDistance: stage2Config.lighting.spotLightDistance,
            spotLightAngle: stage2Config.lighting.spotLightAngle,
            spotLightPenumbra: stage2Config.lighting.spotLightPenumbra,
            shadowsEnabled: stage2Config.lighting.shadowsEnabled,
            shadowMapSize: stage2Config.lighting.shadowMapSize,
            shadowBias: stage2Config.lighting.shadowBias
          })
          setCurrent3DStage(2) // Update stage to Stage 2
          setIsAnimating(false)
        }
      }
      
      requestAnimationFrame(animate)
    }, 1000) // 1 second delay after page load

    return () => clearTimeout(timer)
  }, [isClient])

  return (
    <div className="relative">
      {/* Fixed 3D Container - Always full screen */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-screen h-screen"
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
      />

      {/* Scrollable Content - 8x screen height */}
      <main 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800"
        style={{ height: isClient ? `${window.innerHeight * 8}px` : '800vh' }}
      >

        {/* Content Sections - Positioned based on scroll */}
        <div className="relative z-10">
          {/* Section 1 */}
          <section 
            className="flex flex-col items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (1 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            {/* Section Number Badge */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 1</span>
            </div>

            {/* Main Content */}
            <div className="text-center text-white space-y-6">
              {/* Title */}
              <h1 className="text-4xl font-bold text-white">
                GoColorFluent
              </h1>
              <p className="text-gray-300 text-lg">
                Built with Next.js, Tailwind CSS, and Three.js
              </p>
              
              {/* Animation Status Indicator */}
              <div className="flex justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-sm">
                    {isAnimating ? (
                      <>
                        <span className="text-yellow-400">🎬</span>
                        <span className="text-white font-mono">
                          Stage 1 → Stage 2: {Math.round(animationProgress * 100)}%
                        </span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full">
                          <div 
                            className="h-2 bg-yellow-400 rounded-full transition-all duration-100"
                            style={{ width: `${easeInOut(animationProgress) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-green-400">✅</span>
                        <span className="text-white font-mono">Stage 2 Complete</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 3D Stage Indicator */}
              <div className="flex justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-500/30">
                  <div className="flex items-center gap-2 text-sm">
                    {is3DAnimating ? (
                      <>
                        <span className="text-cyan-400">🎬</span>
                        <span className="text-white font-mono">
                          Stage {current3DStage} → Stage {current3DStage === 2 ? 3 : 2}: {Math.round(stage3DAnimationProgress * 100)}%
                        </span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full">
                          <div 
                            className="h-2 bg-cyan-400 rounded-full transition-all duration-100"
                            style={{ width: `${easeInOut(stage3DAnimationProgress) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-cyan-400">🎯</span>
                        <span className="text-white font-mono">3D Stage: {current3DStage}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Navigation Indicator */}
              <div className="flex justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">📍</span>
                    <span className="text-white font-mono">
                      Section: {currentSection}/8
                    </span>
                    {isScrolling && (
                      <span className="text-yellow-400 animate-pulse">
                        {scrollDirection === 'down' ? '↓' : '↑'}
                      </span>
                    )}
                    {transitionName && (
                      <span className="text-blue-400 text-xs">
                        {transitionName}
                      </span>
                    )}
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Scroll Position Indicator */}
              <div className="flex justify-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-purple-400">📜</span>
                    <span className="text-white font-mono">
                      Scroll: {isClient ? `${scrollPosition}px` : '0px'}
                    </span>
                    {isClient && (
                      <span className="text-gray-400">
                        / {document.documentElement.scrollHeight - window.innerHeight}px
                      </span>
                    )}
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Welcome to your new project!
                </h2>
                <p className="text-gray-300 max-w-md mx-auto">
                  This is your starting point. The 3D model is fixed in the background while you scroll through this content.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (2 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 2</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Fixed 3D Background
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The 3D model stays in place as you scroll through different sections of content.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (3 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 3</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Scroll Experience
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Notice how the 3D object remains fixed while the content scrolls over it.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (4 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 4</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Interactive Controls
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Use the Dev Controls to adjust the 3D model in real-time while scrolling.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (5 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 5</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Stage Transitions
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The model automatically transitions from Stage 1 to Stage 2 with smooth easing.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (6 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 6</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Lighting Effects
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                All lighting parameters follow the same smooth transition with ease-in and ease-out.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (7 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 7</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Scroll Position Tracking
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The scroll position is tracked and displayed in real-time in the header and Dev Controls.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (8 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 8</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                End of Content
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                This is the final section. The 3D model remains fixed throughout the entire scroll experience.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Compact Development Helper Box */}
      <DevControls
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
      />

      {/* Show Dev Mode Button when hidden */}
      {!isDevMode && (
        <button
          onClick={() => setIsDevMode(true)}
          className="fixed bottom-4 left-4 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          Show Dev Controls
        </button>
      )}
    </div>
  )
}
