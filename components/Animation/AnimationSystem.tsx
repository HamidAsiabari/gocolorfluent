'use client'

import { useEffect, useCallback, memo } from 'react'
import { StageConfig } from '../ThreeScene'
import { LuxuryLightingAnimation } from './LuxuryLightingAnimation'

interface AnimationSystemProps {
  isAnimating: boolean
  setIsAnimating: (animating: boolean) => void
  animationProgress: number
  setAnimationProgress: (progress: number) => void
  is3DAnimating: boolean
  setIs3DAnimating: (animating: boolean) => void
  stage3DAnimationProgress: number
  setStage3DAnimationProgress: (progress: number) => void
  current3DStage: number
  setCurrent3DStage: (stage: number) => void
  isTransitioning: boolean
  scrollDirection: 'up' | 'down' | null
  currentSection: number
  isClient: boolean
  isLoading: boolean
  setModelControls: (controls: any) => void
  setCameraControls: (controls: any) => void
  setLightingControls: (controls: any) => void
  stage8AnimationFunctions: {
    stage8OpenAnimation: (() => void) | null
    stage8CloseAnimation: (() => void) | null
  }
  getStageConfig: (stage: number) => StageConfig
}

const AnimationSystem = memo(function AnimationSystem({
  isAnimating,
  setIsAnimating,
  animationProgress,
  setAnimationProgress,
  is3DAnimating,
  setIs3DAnimating,
  stage3DAnimationProgress,
  setStage3DAnimationProgress,
  current3DStage,
  setCurrent3DStage,
  isTransitioning,
  scrollDirection,
  currentSection,
  isClient,
  isLoading,
  setModelControls,
  setCameraControls,
  setLightingControls,
  stage8AnimationFunctions,
  getStageConfig,
}: AnimationSystemProps) {
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
      
      // Determine from and to stages based on current stage and animation direction
      let fromStage, toStage
      if (current3DStage === 2) {
        // Going from Stage 2 to Stage 3
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      } else if (current3DStage === 3) {
        // Check if we're animating to Stage 4 (down) or Stage 2 (up)
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
        // Going from Stage 6 to Stage 5
        fromStage = getStageConfig(6)
        toStage = getStageConfig(5)
      } else {
        // Default fallback
        fromStage = getStageConfig(2)
        toStage = getStageConfig(3)
      }
      
      // Calculate animated values with proper easing
      const easedProgress = easeInOut(progress)
      
      // Debug: Log the interpolation values for Stage 4 animations
      if (current3DStage === 3 || current3DStage === 5) {
        // Animation progress tracking
      }
      
      const animatedModel = {
        position: {
          x: lerp(fromStage.model.position.x, toStage.model.position.x, easedProgress),
          y: lerp(fromStage.model.position.y, toStage.model.position.y, easedProgress),
          z: lerp(fromStage.model.position.z, toStage.model.position.z, easedProgress)
        },
        rotation: {
          x: lerp(fromStage.model.rotation.x, toStage.model.rotation.x, easedProgress),
          y: lerp(fromStage.model.rotation.y, toStage.model.rotation.y, easedProgress),
          z: lerp(fromStage.model.rotation.z, toStage.model.rotation.z, easedProgress)
        },
        scale: {
          x: lerp(fromStage.model.scale.x, toStage.model.scale.x, easedProgress),
          y: lerp(fromStage.model.scale.y, toStage.model.scale.y, easedProgress),
          z: lerp(fromStage.model.scale.z, toStage.model.scale.z, easedProgress)
        }
      }


      return {
        model: animatedModel,
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
      
      const stage1 = getStageConfig(1)
      const stage2 = getStageConfig(2)
      
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
          shadowsEnabled: stage1.lighting.shadowsEnabled,
          shadowMapSize: stage1.lighting.shadowMapSize,
          shadowBias: stage1.lighting.shadowBias
        }
      }
    }

    // Return current stage configuration if no animation
    const currentStageConfig = getStageConfig(current3DStage)
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
      // Starting Stage 2 to Stage 3 animation
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage3 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage3)
        } else {
          // Stage 2 to Stage 3 animation complete
          setIs3DAnimating(false)
          setCurrent3DStage(3)
        }
      }
      
      requestAnimationFrame(animateStage3)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 2 && current3DStage === 3 && !is3DAnimating) {
      // Start Stage 3 to Stage 4 animation when transitioning to Section 3
      // Starting Stage 3 to Stage 4 animation
      const stage3Config = getStageConfig(3)
      const stage4Config = getStageConfig(4)
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage4 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage4)
        } else {
          // Stage 3 to Stage 4 animation complete
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Explicitly set the final stage 4 configuration to prevent jumping
          const stage4Config = getStageConfig(4)
          setModelControls(stage4Config.model)
          setCameraControls(stage4Config.camera)
          setLightingControls(stage4Config.lighting)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(4)
        }
      }
      
      requestAnimationFrame(animateToStage4)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 3 && current3DStage === 4 && !is3DAnimating) {
      // Start Stage 4 to Stage 3 animation when transitioning to Section 2
      // Console log removed
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second for position animation
      
      const animateStage3 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage3)
        } else {
          // Console log removed
          
          // Explicitly set the final stage 3 configuration to prevent jumping
          const stage3Config = getStageConfig(3)
          setModelControls(stage3Config.model)
          setCameraControls(stage3Config.camera)
          setLightingControls(stage3Config.lighting)
          
          setIs3DAnimating(false)
          setCurrent3DStage(3)
        }
      }
      
      requestAnimationFrame(animateStage3)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 2 && current3DStage === 3 && !is3DAnimating) {
      // Start Stage 3 to Stage 2 animation when transitioning to Section 1
      // Console log removed
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage2 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage2)
        } else {
          // Console log removed
          setIs3DAnimating(false)
          setCurrent3DStage(2)
        }
      }
      
      requestAnimationFrame(animateStage2)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 3 && current3DStage === 4 && !is3DAnimating) {
      // Start Stage 4 to Stage 5 animation when transitioning to Section 4
      // Console log removed
      // Console log removed.model)
      // Console log removed.model)
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage5 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage5)
        } else {
          // Console log removed
          // Console log removed.model)
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(5)
        }
      }
      
      requestAnimationFrame(animateToStage5)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 4 && current3DStage === 5 && !is3DAnimating) {
      // Start Stage 5 to Stage 4 animation when transitioning to Section 3
      // Console log removed
      const stage5Config = getStageConfig(5)
      const stage4Config = getStageConfig(4)
      // Console log removed
      // Console log removed
      // Console log removed
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage4 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage4)
        } else {
          // Console log removed
          
          // Explicitly set the final stage 4 configuration to prevent jumping
          const stage4Config = getStageConfig(4)
          setModelControls(stage4Config.model)
          setCameraControls(stage4Config.camera)
          setLightingControls(stage4Config.lighting)
          
          setIs3DAnimating(false)
          setCurrent3DStage(4)
        }
      }
      
      requestAnimationFrame(animateToStage4)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 4 && current3DStage === 5 && !is3DAnimating) {
      // Start Stage 5 to Stage 6 animation when transitioning from Section 4 to Section 5
      // Console log removed
      // Console log removed.model)
      // Console log removed.model)
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage6 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage6)
        } else {
          // Console log removed
          // Console log removed.model)
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(6)
        }
      }
      
      requestAnimationFrame(animateToStage6)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 5 && current3DStage === 6 && !is3DAnimating) {
      // Start Stage 6 to Stage 5 animation when transitioning from Section 5 to Section 4
      // Console log removed
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage5 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage5)
        } else {
          // Console log removed
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(5)
        }
      }
      
      requestAnimationFrame(animateToStage5)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 5 && current3DStage === 6 && !is3DAnimating) {
      // Start Stage 6 to Stage 7 animation when transitioning from Section 5 to Section 6
      // Console log removed
      // Console log removed.model)
      // Console log removed.model)
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage7 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage7)
        } else {
          // Console log removed
          // Console log removed.model)
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(7)
        }
      }
      
      requestAnimationFrame(animateToStage7)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 6 && current3DStage === 7 && !is3DAnimating) {
      // Start Stage 7 to Stage 6 animation when transitioning from Section 6 to Section 5
      // Console log removed
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage6 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage6)
        } else {
          // Console log removed
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(6)
        }
      }
      
      requestAnimationFrame(animateToStage6)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 6 && current3DStage === 7 && !is3DAnimating) {
      // Start Stage 7 to Stage 8 animation when transitioning from Section 6 to Section 7
      // Console log removed
      // Console log removed.model)
      // Console log removed.model)
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage8 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage8)
        } else {
          // Console log removed
          // Console log removed.model)
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(8)
        }
      }
      
      requestAnimationFrame(animateToStage8)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 7 && current3DStage === 8 && !is3DAnimating) {
      // Start Stage 8 to Stage 7 animation when transitioning from Section 7 to Section 6
      // Console log removed
      
      // Trigger stage-8-close-animation before transitioning away from stage 8
      // Console log removed
      if (stage8AnimationFunctions.stage8CloseAnimation) {
        stage8AnimationFunctions.stage8CloseAnimation()
        
        // Wait for close animation to complete (0.5 seconds) before starting stage transition
        setTimeout(() => {
          // Console log removed
          setIs3DAnimating(true)
          setStage3DAnimationProgress(0)
          
          const startTime = Date.now()
          const duration = 1000 // 1 second
          
          const animateToStage7 = () => {
            const elapsed = Date.now() - startTime
            const rawProgress = elapsed / duration
            const progress = Math.min(rawProgress, 1)
            
            // Apply easing
            const easedProgress = easeInOut(progress)
            
            // Animation progress tracking
            setStage3DAnimationProgress(progress)
            
            if (progress < 1) {
              requestAnimationFrame(animateToStage7)
            } else {
              // Console log removed
              
              // Set final progress to exactly 1.0
              setStage3DAnimationProgress(1.0)
              
              // Complete the animation
              setIs3DAnimating(false)
              setCurrent3DStage(7)
            }
          }
        
        requestAnimationFrame(animateToStage7)
        }, 500) // Wait 0.5 seconds for close animation to complete
      } else {
        // If no close animation function, start stage transition immediately
        setIs3DAnimating(true)
        setStage3DAnimationProgress(0)
        
        const startTime = Date.now()
        const duration = 1000 // 1 second
        
        const animateToStage7 = () => {
          const elapsed = Date.now() - startTime
          const rawProgress = elapsed / duration
          const progress = Math.min(rawProgress, 1)
          
          // Apply easing
          const easedProgress = easeInOut(progress)
          
          // Animation progress tracking
          setStage3DAnimationProgress(progress)
          
          if (progress < 1) {
            requestAnimationFrame(animateToStage7)
          } else {
            // Console log removed
            
            // Set final progress to exactly 1.0
            setStage3DAnimationProgress(1.0)
            
            // Complete the animation
            setIs3DAnimating(false)
            setCurrent3DStage(7)
          }
        }
        
        requestAnimationFrame(animateToStage7)
      }
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 7 && current3DStage === 8 && !is3DAnimating) {
      // Start Stage 8 to Stage 9 animation when transitioning from Section 7 to Section 8
      // Console log removed
      // Console log removed.model)
      // Console log removed.model)
      
      // Trigger stage-8-close-animation before transitioning away from stage 8
      // Console log removed
      if (stage8AnimationFunctions.stage8CloseAnimation) {
        stage8AnimationFunctions.stage8CloseAnimation()
        
        // Wait for close animation to complete (0.5 seconds) before starting stage transition
        setTimeout(() => {
          // Console log removed
          setIs3DAnimating(true)
          setStage3DAnimationProgress(0)
          
          const startTime = Date.now()
          const duration = 1000 // 1 second
          
          const animateToStage9 = () => {
            const elapsed = Date.now() - startTime
            const rawProgress = elapsed / duration
            const progress = Math.min(rawProgress, 1)
            
            // Apply easing
            const easedProgress = easeInOut(progress)
            
            // Animation progress tracking
            setStage3DAnimationProgress(progress)
            
            if (progress < 1) {
              requestAnimationFrame(animateToStage9)
            } else {
              // Console log removed
              // Console log removed.model)
              
              // Set final progress to exactly 1.0
              setStage3DAnimationProgress(1.0)
              
              // Complete the animation
              setIs3DAnimating(false)
              setCurrent3DStage(9)
            }
          }
          
          requestAnimationFrame(animateToStage9)
        }, 500) // Wait 0.5 seconds for close animation to complete
      } else {
        // If no close animation function, start stage transition immediately
        setIs3DAnimating(true)
        setStage3DAnimationProgress(0)
        
        const startTime = Date.now()
        const duration = 1000 // 1 second
        
        const animateToStage9 = () => {
          const elapsed = Date.now() - startTime
          const rawProgress = elapsed / duration
          const progress = Math.min(rawProgress, 1)
          
          // Apply easing
          const easedProgress = easeInOut(progress)
          
          // Animation progress tracking
          setStage3DAnimationProgress(progress)
          
          if (progress < 1) {
            requestAnimationFrame(animateToStage9)
          } else {
            // Console log removed
            // Console log removed.model)
            
            // Set final progress to exactly 1.0
            setStage3DAnimationProgress(1.0)
            
            // Complete the animation
            setIs3DAnimating(false)
            setCurrent3DStage(9)
          }
        }
        
        requestAnimationFrame(animateToStage9)
      }
  } else if (isTransitioning && scrollDirection === 'up' && currentSection === 8 && current3DStage === 9 && !is3DAnimating) {
      // Start Stage 9 to Stage 8 animation when transitioning from Section 8 to Section 7
      // Console log removed
      
      // Trigger stage-8-close-animation before transitioning away from stage 8
      // Console log removed
      if (stage8AnimationFunctions.stage8CloseAnimation) {
        stage8AnimationFunctions.stage8CloseAnimation()
      }
      
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateToStage8 = () => {
        const elapsed = Date.now() - startTime
        const rawProgress = elapsed / duration
        const progress = Math.min(rawProgress, 1)
        
        // Apply easing
        const easedProgress = easeInOut(progress)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateToStage8)
        } else {
          // Console log removed
          
          // Set final progress to exactly 1.0
          setStage3DAnimationProgress(1.0)
          
          // Complete the animation
          setIs3DAnimating(false)
          setCurrent3DStage(8)
        }
      }
      
      requestAnimationFrame(animateToStage8)
    }
  }, [isTransitioning, scrollDirection, currentSection, current3DStage, is3DAnimating])

  // Sync Dev Controls with current stage when stage changes
  useEffect(() => {
    if (!is3DAnimating && !isAnimating) {
      const currentStageConfig = getStageConfig(current3DStage)
      setModelControls(currentStageConfig.model)
      setCameraControls(currentStageConfig.camera)
      setLightingControls(currentStageConfig.lighting)
    }
  }, [current3DStage, is3DAnimating, isAnimating])

  // Start Stage 0 to Stage 2 animation after loading is complete
  useEffect(() => {
    if (!isClient || isLoading) return

    // Start animation after loading is complete
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      // Create luxury lighting animation
      const stage1Config = getStageConfig(1)
      const stage2Config = getStageConfig(2)
      const luxuryLightingAnimation = new LuxuryLightingAnimation({
        stage1: stage1Config.lighting,
        stage2: stage2Config.lighting,
        duration: 3000 // 3 seconds for luxury product launch
      })
      
      // Animation duration: 3 seconds for luxury product launch
      const duration = 3000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        setAnimationProgress(progress)
        
        // Get luxury lighting at current progress
        const luxuryLighting = luxuryLightingAnimation.getLightingAtProgress(progress)
        
        // Update model and camera with simple interpolation
        const stage1Config = getStageConfig(1)
        const stage2Config = getStageConfig(2)
        
        setModelControls({
          position: {
            x: stage1Config.model.position.x + (stage2Config.model.position.x - stage1Config.model.position.x) * progress,
            y: stage1Config.model.position.y + (stage2Config.model.position.y - stage1Config.model.position.y) * progress,
            z: stage1Config.model.position.z + (stage2Config.model.position.z - stage1Config.model.position.z) * progress
          },
          rotation: {
            x: stage1Config.model.rotation.x + (stage2Config.model.rotation.x - stage1Config.model.rotation.x) * progress,
            y: stage1Config.model.rotation.y + (stage2Config.model.rotation.y - stage1Config.model.rotation.y) * progress,
            z: stage1Config.model.rotation.z + (stage2Config.model.rotation.z - stage1Config.model.rotation.z) * progress
          },
          scale: {
            x: stage1Config.model.scale.x + (stage2Config.model.scale.x - stage1Config.model.scale.x) * progress,
            y: stage1Config.model.scale.y + (stage2Config.model.scale.y - stage1Config.model.scale.y) * progress,
            z: stage1Config.model.scale.z + (stage2Config.model.scale.z - stage1Config.model.scale.z) * progress
          }
        })
        
        setCameraControls({
          position: {
            x: stage1Config.camera.position.x + (stage2Config.camera.position.x - stage1Config.camera.position.x) * progress,
            y: stage1Config.camera.position.y + (stage2Config.camera.position.y - stage1Config.camera.position.y) * progress,
            z: stage1Config.camera.position.z + (stage2Config.camera.position.z - stage1Config.camera.position.z) * progress
          },
          fov: stage1Config.camera.fov + (stage2Config.camera.fov - stage1Config.camera.fov) * progress
        })
        
        // Apply luxury lighting
        setLightingControls(luxuryLighting)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Animation complete - update state to Stage 2 values
          setModelControls(stage2Config.model)
          setCameraControls(stage2Config.camera)
          setLightingControls(stage2Config.lighting)
          setCurrent3DStage(2) // Update stage to Stage 2
          setIsAnimating(false)
        }
      }
      
      requestAnimationFrame(animate)
    }, 500) // Short delay after loading completes

    return () => clearTimeout(timer)
  }, [isClient, isLoading])

  // This component doesn't render anything directly
  return null
})

export default AnimationSystem
