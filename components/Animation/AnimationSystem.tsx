'use client'

import React, { useEffect, useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { easeInOut } from './EasingFunctions'

const AnimationSystem = React.memo(() => {
  const {
    isClient,
    isLoading,
    isAnimating,
    is3DAnimating,
    currentSection,
    current3DStage,
    scrollDirection,
    isTransitioning,
    stage3DAnimationProgress,
    setStage3DAnimationProgress,
    setIs3DAnimating,
    setCurrent3DStage,
    setModelControls,
    setCameraControls,
    setLightingControls,
    getStageConfig
  } = useAppStore()

  // Get animated values for 3D stage transitions
  const getAnimatedValues = () => {
    // Handle section-based 3D stage animations
    if (is3DAnimating) {
      const progress = easeInOut(stage3DAnimationProgress)
      
      // Handle stage 0 to stage 1 animation (page load)
      let fromStage, toStage
      if (current3DStage === 0) {
        // Going from Stage 0 to Stage 1
        fromStage = getStageConfig(0)
        toStage = getStageConfig(1)
      } else if (current3DStage === 7) {
        // Going from Stage 7 to Stage 8
        fromStage = getStageConfig(7)
        toStage = getStageConfig(8)
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
      } else {
        // No animation for stages 1-6 (all same values)
        return null
      }
      
      // Check if both stages are valid
      if (!fromStage || !toStage) {
        return null
      }
      
      return {
        model: {
          position: {
            x: fromStage.model.position.x + (toStage.model.position.x - fromStage.model.position.x) * progress,
            y: fromStage.model.position.y + (toStage.model.position.y - fromStage.model.position.y) * progress,
            z: fromStage.model.position.z + (toStage.model.position.z - fromStage.model.position.z) * progress
          },
          rotation: {
            x: fromStage.model.rotation.x + (toStage.model.rotation.x - fromStage.model.rotation.x) * progress,
            y: fromStage.model.rotation.y + (toStage.model.rotation.y - fromStage.model.rotation.y) * progress,
            z: fromStage.model.rotation.z + (toStage.model.rotation.z - fromStage.model.rotation.z) * progress
          },
          scale: {
            x: fromStage.model.scale.x + (toStage.model.scale.x - fromStage.model.scale.x) * progress,
            y: fromStage.model.scale.y + (toStage.model.scale.y - fromStage.model.scale.y) * progress,
            z: fromStage.model.scale.z + (toStage.model.scale.z - fromStage.model.scale.z) * progress
          }
        },
        camera: {
          position: {
            x: fromStage.camera.position.x + (toStage.camera.position.x - fromStage.camera.position.x) * progress,
            y: fromStage.camera.position.y + (toStage.camera.position.y - fromStage.camera.position.y) * progress,
            z: fromStage.camera.position.z + (toStage.camera.position.z - fromStage.camera.position.z) * progress
          },
          fov: fromStage.camera.fov + (toStage.camera.fov - fromStage.camera.fov) * progress
        },
        lighting: {
          ambientIntensity: fromStage.lighting.ambientIntensity + (toStage.lighting.ambientIntensity - fromStage.lighting.ambientIntensity) * progress,
          ambientColor: fromStage.lighting.ambientColor,
          directionalIntensity: fromStage.lighting.directionalIntensity + (toStage.lighting.directionalIntensity - fromStage.lighting.directionalIntensity) * progress,
          directionalColor: fromStage.lighting.directionalColor,
          directionalPosition: {
            x: fromStage.lighting.directionalPosition.x + (toStage.lighting.directionalPosition.x - fromStage.lighting.directionalPosition.x) * progress,
            y: fromStage.lighting.directionalPosition.y + (toStage.lighting.directionalPosition.y - fromStage.lighting.directionalPosition.y) * progress,
            z: fromStage.lighting.directionalPosition.z + (toStage.lighting.directionalPosition.z - fromStage.lighting.directionalPosition.z) * progress
          },
          directionalTarget: {
            x: fromStage.lighting.directionalTarget.x + (toStage.lighting.directionalTarget.x - fromStage.lighting.directionalTarget.x) * progress,
            y: fromStage.lighting.directionalTarget.y + (toStage.lighting.directionalTarget.y - fromStage.lighting.directionalTarget.y) * progress,
            z: fromStage.lighting.directionalTarget.z + (toStage.lighting.directionalTarget.z - fromStage.lighting.directionalTarget.z) * progress
          },
          pointLightIntensity: fromStage.lighting.pointLightIntensity + (toStage.lighting.pointLightIntensity - fromStage.lighting.pointLightIntensity) * progress,
          pointLightColor: fromStage.lighting.pointLightColor,
          pointLightPosition: {
            x: fromStage.lighting.pointLightPosition.x + (toStage.lighting.pointLightPosition.x - fromStage.lighting.pointLightPosition.x) * progress,
            y: fromStage.lighting.pointLightPosition.y + (toStage.lighting.pointLightPosition.y - fromStage.lighting.pointLightPosition.y) * progress,
            z: fromStage.lighting.pointLightPosition.z + (toStage.lighting.pointLightPosition.z - fromStage.lighting.pointLightPosition.z) * progress
          },
          pointLightDistance: fromStage.lighting.pointLightDistance + (toStage.lighting.pointLightDistance - fromStage.lighting.pointLightDistance) * progress,
          spotLightIntensity: fromStage.lighting.spotLightIntensity + (toStage.lighting.spotLightIntensity - fromStage.lighting.spotLightIntensity) * progress,
          spotLightColor: fromStage.lighting.spotLightColor,
          spotLightPosition: {
            x: fromStage.lighting.spotLightPosition.x + (toStage.lighting.spotLightPosition.x - fromStage.lighting.spotLightPosition.x) * progress,
            y: fromStage.lighting.spotLightPosition.y + (toStage.lighting.spotLightPosition.y - fromStage.lighting.spotLightPosition.y) * progress,
            z: fromStage.lighting.spotLightPosition.z + (toStage.lighting.spotLightPosition.z - fromStage.lighting.spotLightPosition.z) * progress
          },
          spotLightTarget: {
            x: fromStage.lighting.spotLightTarget.x + (toStage.lighting.spotLightTarget.x - fromStage.lighting.spotLightTarget.x) * progress,
            y: fromStage.lighting.spotLightTarget.y + (toStage.lighting.spotLightTarget.y - fromStage.lighting.spotLightTarget.y) * progress,
            z: fromStage.lighting.spotLightTarget.z + (toStage.lighting.spotLightTarget.z - fromStage.lighting.spotLightTarget.z) * progress
          },
          spotLightDistance: fromStage.lighting.spotLightDistance + (toStage.lighting.spotLightDistance - fromStage.lighting.spotLightDistance) * progress,
          spotLightAngle: fromStage.lighting.spotLightAngle + (toStage.lighting.spotLightAngle - fromStage.lighting.spotLightAngle) * progress,
          spotLightPenumbra: fromStage.lighting.spotLightPenumbra + (toStage.lighting.spotLightPenumbra - fromStage.lighting.spotLightPenumbra) * progress,
          shadowsEnabled: toStage.lighting.shadowsEnabled,
          shadowMapSize: fromStage.lighting.shadowMapSize + (toStage.lighting.shadowMapSize - fromStage.lighting.shadowMapSize) * progress,
          shadowBias: fromStage.lighting.shadowBias + (toStage.lighting.shadowBias - fromStage.lighting.shadowBias) * progress
        }
      }
    }

    // Return current stage configuration if no animation
    const currentStageConfig = getStageConfig(current3DStage)
    if (!currentStageConfig) {
      return null
    }
    return { 
      model: currentStageConfig.model, 
      camera: currentStageConfig.camera, 
      lighting: currentStageConfig.lighting 
    }
  }

  // Handle Stage 0 to Stage 1 animation on page load
  useEffect(() => {
    if (current3DStage === 0 && is3DAnimating && stage3DAnimationProgress > 0) {
      // This is handled by the main page component
      return
    }
  }, [current3DStage, is3DAnimating, stage3DAnimationProgress])

  // Trigger 3D stage animation based on section transition start
  // Only animate between stages 7-9 (where positions actually differ)
  useEffect(() => {
    if (isTransitioning && scrollDirection === 'down' && currentSection === 6 && current3DStage === 7 && !is3DAnimating) {
      // Start Stage 7 to Stage 8 animation when transitioning to Section 7
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage8 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage8)
        } else {
          // Stage 7 to Stage 8 animation complete
          setIs3DAnimating(false)
          setCurrent3DStage(8)
        }
      }
      
      requestAnimationFrame(animateStage8)
    } else if (isTransitioning && scrollDirection === 'down' && currentSection === 7 && current3DStage === 8 && !is3DAnimating) {
      // Start Stage 8 to Stage 9 animation when transitioning to Section 8
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage9 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage9)
        } else {
          // Stage 8 to Stage 9 animation complete
          setIs3DAnimating(false)
          setCurrent3DStage(9)
        }
      }
      
      requestAnimationFrame(animateStage9)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 8 && current3DStage === 9 && !is3DAnimating) {
      // Start Stage 9 to Stage 8 animation when transitioning to Section 7
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage8 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage8)
        } else {
          // Stage 9 to Stage 8 animation complete
          setIs3DAnimating(false)
          setCurrent3DStage(8)
        }
      }
      
      requestAnimationFrame(animateStage8)
    } else if (isTransitioning && scrollDirection === 'up' && currentSection === 7 && current3DStage === 8 && !is3DAnimating) {
      // Start Stage 8 to Stage 7 animation when transitioning to Section 6
      setIs3DAnimating(true)
      setStage3DAnimationProgress(0)
      
      const startTime = Date.now()
      const duration = 1000 // 1 second
      
      const animateStage7 = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Animation progress tracking
        setStage3DAnimationProgress(progress)
        
        if (progress < 1) {
          requestAnimationFrame(animateStage7)
        } else {
          // Stage 8 to Stage 7 animation complete
          setIs3DAnimating(false)
          setCurrent3DStage(7)
        }
      }
      
      requestAnimationFrame(animateStage7)
    }
  }, [isTransitioning, scrollDirection, currentSection, current3DStage, is3DAnimating])

  // This component doesn't render anything directly
  return null
})

export default AnimationSystem