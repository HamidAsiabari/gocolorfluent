'use client'

import { useEffect } from 'react'
import { stage1Config, stage2Config, stage3Config } from '../ThreeScene'

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
  setModelControls: (controls: any) => void
  setCameraControls: (controls: any) => void
  setLightingControls: (controls: any) => void
}

export default function AnimationSystem({
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
  setModelControls,
  setCameraControls,
  setLightingControls
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
  }, [isTransitioning, scrollDirection, currentSection, current3DStage, is3DAnimating, setIs3DAnimating, setStage3DAnimationProgress, setCurrent3DStage])

  // Sync Dev Controls with current stage when stage changes
  useEffect(() => {
    if (!is3DAnimating && !isAnimating) {
      const currentStageConfig = current3DStage === 1 ? stage1Config : 
                                current3DStage === 2 ? stage2Config : stage3Config
      setModelControls(currentStageConfig.model)
      setCameraControls(currentStageConfig.camera)
      setLightingControls(currentStageConfig.lighting)
    }
  }, [current3DStage, is3DAnimating, isAnimating, setModelControls, setCameraControls, setLightingControls])

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
  }, [isClient, setIsAnimating, setAnimationProgress, setModelControls, setCameraControls, setLightingControls, setCurrent3DStage])

  // This component doesn't render anything directly
  return null
}
