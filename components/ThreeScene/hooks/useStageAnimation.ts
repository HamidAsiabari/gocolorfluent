'use client'

import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

interface StageConfig {
  model: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  }
  camera: {
    position: { x: number; y: number; z: number }
    target: { x: number; y: number; z: number }
    fov: number
  }
  lighting: {
    ambientIntensity: number
    ambientColor: string
    directionalIntensity: number
    directionalColor: string
    directionalPosition: { x: number; y: number; z: number }
    directionalTarget: { x: number; y: number; z: number }
    pointLightIntensity?: number
    pointLightColor?: string
    pointLightPosition?: { x: number; y: number; z: number }
    pointLightDistance?: number
    spotLightIntensity?: number
    spotLightColor?: string
    spotLightPosition?: { x: number; y: number; z: number }
    spotLightTarget?: { x: number; y: number; z: number }
    spotLightDistance?: number
    spotLightAngle?: number
  }
}

interface UseStageAnimationProps {
  modelRef: React.RefObject<THREE.Group>
  cameraRef: React.RefObject<THREE.PerspectiveCamera>
  ambientLightRef: React.RefObject<THREE.AmbientLight>
  directionalLightRef: React.RefObject<THREE.DirectionalLight>
  pointLightRef?: React.RefObject<THREE.PointLight>
  spotLightRef?: React.RefObject<THREE.SpotLight>
  isMobile: boolean
}

/**
 * Creates animation function for smooth transitions between stages
 * Exposes directThreeAnimation function on window object for use by page.tsx
 */
export function useStageAnimation({
  modelRef,
  cameraRef,
  ambientLightRef,
  directionalLightRef,
  pointLightRef,
  spotLightRef,
  isMobile
}: UseStageAnimationProps) {
  
  useEffect(() => {
    // Expose animation function to window for use in app/page.tsx
    ;(window as any).directThreeAnimation = (params: {
      progress: number
      stage0Config: StageConfig
      stage1Config: StageConfig
    }) => {
      const { progress, stage0Config, stage1Config } = params
      const easedProgress = progress
      
      // Animate model
      if (modelRef.current) {
        const model = modelRef.current
        
        const newPosition = {
          x: stage0Config.model.position.x + (stage1Config.model.position.x - stage0Config.model.position.x) * easedProgress,
          y: stage0Config.model.position.y + (stage1Config.model.position.y - stage0Config.model.position.y) * easedProgress,
          z: stage0Config.model.position.z + (stage1Config.model.position.z - stage0Config.model.position.z) * easedProgress
        }
        
        const newRotation = {
          x: stage0Config.model.rotation.x + (stage1Config.model.rotation.x - stage0Config.model.rotation.x) * easedProgress,
          y: stage0Config.model.rotation.y + (stage1Config.model.rotation.y - stage0Config.model.rotation.y) * easedProgress,
          z: stage0Config.model.rotation.z + (stage1Config.model.rotation.z - stage0Config.model.rotation.z) * easedProgress
        }
        
        const newScale = {
          x: stage0Config.model.scale.x + (stage1Config.model.scale.x - stage0Config.model.scale.x) * easedProgress,
          y: stage0Config.model.scale.y + (stage1Config.model.scale.y - stage0Config.model.scale.y) * easedProgress,
          z: stage0Config.model.scale.z + (stage1Config.model.scale.z - stage0Config.model.scale.z) * easedProgress
        }
        
        model.position.set(newPosition.x, newPosition.y, newPosition.z)
        model.rotation.set(newRotation.x, newRotation.y, newRotation.z)
        model.scale.set(newScale.x, newScale.y, newScale.z)
        model.updateMatrix()
        model.updateMatrixWorld(true)
      }
      
      // Animate camera
      if (cameraRef.current) {
        const camera = cameraRef.current
        
        let stage0Pos = { ...stage0Config.camera.position }
        let stage1Pos = { ...stage1Config.camera.position }
        let stage0Fov = stage0Config.camera.fov
        let stage1Fov = stage1Config.camera.fov
        
        // Mobile adjustments
        if (isMobile) {
          stage0Pos = {
            x: stage0Pos.x,
            y: stage0Pos.y + 0.5,
            z: stage0Pos.z + 2
          }
          stage1Pos = {
            x: stage1Pos.x,
            y: stage1Pos.y + 0.1,
            z: stage1Pos.z + 0.2
          }
          stage0Fov = stage0Fov + 15
          stage1Fov = stage1Fov + 15
        }
        
        const newPosition = {
          x: stage0Pos.x + (stage1Pos.x - stage0Pos.x) * easedProgress,
          y: stage0Pos.y + (stage1Pos.y - stage0Pos.y) * easedProgress,
          z: stage0Pos.z + (stage1Pos.z - stage0Pos.z) * easedProgress
        }
        
        const newTarget = {
          x: stage0Config.camera.target.x + (stage1Config.camera.target.x - stage0Config.camera.target.x) * easedProgress,
          y: stage0Config.camera.target.y + (stage1Config.camera.target.y - stage0Config.camera.target.y) * easedProgress,
          z: stage0Config.camera.target.z + (stage1Config.camera.target.z - stage0Config.camera.target.z) * easedProgress
        }
        
        const newFov = stage0Fov + (stage1Fov - stage0Fov) * easedProgress
        
        camera.position.set(newPosition.x, newPosition.y, newPosition.z)
        camera.lookAt(newTarget.x, newTarget.y, newTarget.z)
        camera.fov = newFov
        camera.updateProjectionMatrix()
        camera.updateMatrixWorld(true)
      }
      
      // Animate lighting - CRITICAL for smooth transitions
      const hasAmbient = !!ambientLightRef.current
      const hasDirectional = !!directionalLightRef.current
      
      if (!hasAmbient || !hasDirectional) {
        if (easedProgress > 0.01 && easedProgress < 0.99) {
          // Only warn during animation, not at start/end
          console.warn(`⚠️ Can't animate lights yet - ambient=${hasAmbient}, directional=${hasDirectional}`)
        }
      }
      
      // Animate ambient light
      if (ambientLightRef.current) {
        const intensity = stage0Config.lighting.ambientIntensity + (stage1Config.lighting.ambientIntensity - stage0Config.lighting.ambientIntensity) * easedProgress
        ambientLightRef.current.intensity = intensity
        
        const startColor = new THREE.Color(stage0Config.lighting.ambientColor)
        const endColor = new THREE.Color(stage1Config.lighting.ambientColor)
        ambientLightRef.current.color.copy(startColor).lerp(endColor, easedProgress)
        
      }
      // Animate directional light
      if (directionalLightRef.current) {
        const intensity = stage0Config.lighting.directionalIntensity + (stage1Config.lighting.directionalIntensity - stage0Config.lighting.directionalIntensity) * easedProgress
        directionalLightRef.current.intensity = intensity
        
        const startColor = new THREE.Color(stage0Config.lighting.directionalColor)
        const endColor = new THREE.Color(stage1Config.lighting.directionalColor)
        directionalLightRef.current.color.copy(startColor).lerp(endColor, easedProgress)
        
        const newPosition = {
          x: stage0Config.lighting.directionalPosition.x + (stage1Config.lighting.directionalPosition.x - stage0Config.lighting.directionalPosition.x) * easedProgress,
          y: stage0Config.lighting.directionalPosition.y + (stage1Config.lighting.directionalPosition.y - stage0Config.lighting.directionalPosition.y) * easedProgress,
          z: stage0Config.lighting.directionalPosition.z + (stage1Config.lighting.directionalPosition.z - stage0Config.lighting.directionalPosition.z) * easedProgress
        }
        directionalLightRef.current.position.set(newPosition.x, newPosition.y, newPosition.z)
        
        const newTarget = {
          x: stage0Config.lighting.directionalTarget.x + (stage1Config.lighting.directionalTarget.x - stage0Config.lighting.directionalTarget.x) * easedProgress,
          y: stage0Config.lighting.directionalTarget.y + (stage1Config.lighting.directionalTarget.y - stage0Config.lighting.directionalTarget.y) * easedProgress,
          z: stage0Config.lighting.directionalTarget.z + (stage1Config.lighting.directionalTarget.z - stage0Config.lighting.directionalTarget.z) * easedProgress
        }
        directionalLightRef.current.target.position.set(newTarget.x, newTarget.y, newTarget.z)
      } else {
        console.warn('⚠️ directionalLightRef.current is null - cannot animate!')
      }
      
      // Animate point light if available
      if (pointLightRef?.current && stage0Config.lighting.pointLightIntensity !== undefined) {
        const intensity = stage0Config.lighting.pointLightIntensity + (stage1Config.lighting.pointLightIntensity! - stage0Config.lighting.pointLightIntensity) * easedProgress
        pointLightRef.current.intensity = intensity
        
        const startColor = new THREE.Color(stage0Config.lighting.pointLightColor!)
        const endColor = new THREE.Color(stage1Config.lighting.pointLightColor!)
        pointLightRef.current.color.copy(startColor).lerp(endColor, easedProgress)
        
        const newPosition = {
          x: stage0Config.lighting.pointLightPosition!.x + (stage1Config.lighting.pointLightPosition!.x - stage0Config.lighting.pointLightPosition!.x) * easedProgress,
          y: stage0Config.lighting.pointLightPosition!.y + (stage1Config.lighting.pointLightPosition!.y - stage0Config.lighting.pointLightPosition!.y) * easedProgress,
          z: stage0Config.lighting.pointLightPosition!.z + (stage1Config.lighting.pointLightPosition!.z - stage0Config.lighting.pointLightPosition!.z) * easedProgress
        }
        pointLightRef.current.position.set(newPosition.x, newPosition.y, newPosition.z)
        
        if (stage0Config.lighting.pointLightDistance !== undefined) {
          const distance = stage0Config.lighting.pointLightDistance + (stage1Config.lighting.pointLightDistance! - stage0Config.lighting.pointLightDistance) * easedProgress
          pointLightRef.current.distance = distance
        }
      }
      
      // Animate spot light if available
      if (spotLightRef?.current && stage0Config.lighting.spotLightIntensity !== undefined) {
        const intensity = stage0Config.lighting.spotLightIntensity + (stage1Config.lighting.spotLightIntensity! - stage0Config.lighting.spotLightIntensity) * easedProgress
        spotLightRef.current.intensity = intensity
        
        const startColor = new THREE.Color(stage0Config.lighting.spotLightColor!)
        const endColor = new THREE.Color(stage1Config.lighting.spotLightColor!)
        spotLightRef.current.color.copy(startColor).lerp(endColor, easedProgress)
        
        const newPosition = {
          x: stage0Config.lighting.spotLightPosition!.x + (stage1Config.lighting.spotLightPosition!.x - stage0Config.lighting.spotLightPosition!.x) * easedProgress,
          y: stage0Config.lighting.spotLightPosition!.y + (stage1Config.lighting.spotLightPosition!.y - stage0Config.lighting.spotLightPosition!.y) * easedProgress,
          z: stage0Config.lighting.spotLightPosition!.z + (stage1Config.lighting.spotLightPosition!.z - stage0Config.lighting.spotLightPosition!.z) * easedProgress
        }
        spotLightRef.current.position.set(newPosition.x, newPosition.y, newPosition.z)
        
        const newTarget = {
          x: stage0Config.lighting.spotLightTarget!.x + (stage1Config.lighting.spotLightTarget!.x - stage0Config.lighting.spotLightTarget!.x) * easedProgress,
          y: stage0Config.lighting.spotLightTarget!.y + (stage1Config.lighting.spotLightTarget!.y - stage0Config.lighting.spotLightTarget!.y) * easedProgress,
          z: stage0Config.lighting.spotLightTarget!.z + (stage1Config.lighting.spotLightTarget!.z - stage0Config.lighting.spotLightTarget!.z) * easedProgress
        }
        spotLightRef.current.target.position.set(newTarget.x, newTarget.y, newTarget.z)
        
        if (stage0Config.lighting.spotLightAngle !== undefined) {
          const angle = stage0Config.lighting.spotLightAngle + (stage1Config.lighting.spotLightAngle! - stage0Config.lighting.spotLightAngle) * easedProgress
          spotLightRef.current.angle = angle * Math.PI / 180
        }
        
        if (stage0Config.lighting.spotLightDistance !== undefined) {
          const distance = stage0Config.lighting.spotLightDistance + (stage1Config.lighting.spotLightDistance! - stage0Config.lighting.spotLightDistance) * easedProgress
          spotLightRef.current.distance = distance
        }
      }
    }
    
    return () => {
      // Cleanup
      delete (window as any).directThreeAnimation
    }
  }, [modelRef, cameraRef, ambientLightRef, directionalLightRef, pointLightRef, spotLightRef, isMobile])
}
