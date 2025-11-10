'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LightingControls } from '../../../../store/useAppStore'

interface LightManagerProps {
  scene: THREE.Scene
  lightingControls: LightingControls
  isMobile: boolean
  isLowEndDevice: boolean
  onRefsReady?: (refs: {
    ambientLightRef: React.RefObject<THREE.AmbientLight>
    directionalLightRef: React.RefObject<THREE.DirectionalLight>
    pointLightRef: React.RefObject<THREE.PointLight>
    spotLightRef: React.RefObject<THREE.SpotLight>
  }) => void
}

/**
 * Manages Three.js lighting in the scene
 * Sets up ambient, directional, point, and spot lights
 */
export function LightManager({ scene, lightingControls, isMobile, isLowEndDevice, onRefsReady }: LightManagerProps) {
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null)
  const pointLightRef = useRef<THREE.PointLight | null>(null)
  const spotLightRef = useRef<THREE.SpotLight | null>(null)

  // Initialize lights on mount
  useEffect(() => {

    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      lightingControls.ambientColor,
      isMobile ? lightingControls.ambientIntensity * 0.8 : lightingControls.ambientIntensity
    )
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(
      lightingControls.directionalColor,
      isMobile ? lightingControls.directionalIntensity * 0.7 : lightingControls.directionalIntensity
    )
    
    // Point and spot lights only on desktop
    let pointLight: THREE.PointLight | null = null
    let spotLight: THREE.SpotLight | null = null
    
    if (!isMobile && !isLowEndDevice) {
      pointLight = new THREE.PointLight(
        lightingControls.pointLightColor,
        lightingControls.pointLightIntensity,
        lightingControls.pointLightDistance
      )
      
      spotLight = new THREE.SpotLight(
        lightingControls.spotLightColor,
        lightingControls.spotLightIntensity,
        lightingControls.spotLightDistance,
        lightingControls.spotLightAngle * Math.PI / 180,
        lightingControls.spotLightPenumbra
      )
    }
    
    // Configure directional light
    directionalLight.position.set(
      lightingControls.directionalPosition.x,
      lightingControls.directionalPosition.y,
      lightingControls.directionalPosition.z
    )
    directionalLight.target.position.set(
      lightingControls.directionalTarget.x,
      lightingControls.directionalTarget.y,
      lightingControls.directionalTarget.z
    )
    directionalLight.castShadow = lightingControls.shadowsEnabled
    directionalLight.shadow.mapSize.width = lightingControls.shadowMapSize
    directionalLight.shadow.mapSize.height = lightingControls.shadowMapSize
    directionalLight.shadow.bias = lightingControls.shadowBias
    
    // Configure shadow camera for better coverage
    directionalLight.shadow.camera.left = -20
    directionalLight.shadow.camera.right = 20
    directionalLight.shadow.camera.top = 20
    directionalLight.shadow.camera.bottom = -20
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.normalBias = 0.01
    
    // Configure point light
    if (pointLight) {
      pointLight.position.set(
        lightingControls.pointLightPosition.x,
        lightingControls.pointLightPosition.y,
        lightingControls.pointLightPosition.z
      )
      pointLight.castShadow = lightingControls.shadowsEnabled
    }
    
    // Configure spot light
    if (spotLight) {
      spotLight.position.set(
        lightingControls.spotLightPosition.x,
        lightingControls.spotLightPosition.y,
        lightingControls.spotLightPosition.z
      )
      spotLight.target.position.set(
        lightingControls.spotLightTarget.x,
        lightingControls.spotLightTarget.y,
        lightingControls.spotLightTarget.z
      )
      spotLight.castShadow = lightingControls.shadowsEnabled
    }
    
    // Store refs
    ambientLightRef.current = ambientLight
    directionalLightRef.current = directionalLight
    pointLightRef.current = pointLight
    spotLightRef.current = spotLight
    
    // Expose refs to parent when ready
    if (onRefsReady) {
      onRefsReady({ ambientLightRef, directionalLightRef, pointLightRef, spotLightRef })
    }
    
    // Add lights to scene
    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(directionalLight.target)
    
    if (pointLight) {
      scene.add(pointLight)
    }
    if (spotLight) {
      scene.add(spotLight)
      scene.add(spotLight.target)
    }


    // Cleanup on unmount
    return () => {
      scene.remove(ambientLight)
      scene.remove(directionalLight)
      scene.remove(directionalLight.target)
      if (pointLight) scene.remove(pointLight)
      if (spotLight) {
        scene.remove(spotLight)
        scene.remove(spotLight.target)
      }
    }
  }, [scene, isMobile, isLowEndDevice]) // Only initialize once

  // Update lights when controls change (BUT NOT DURING ANIMATION)
  useEffect(() => {
    if (!ambientLightRef.current || !directionalLightRef.current) return
    
    // Skip if there's an active animation (lighting is being animated by directThreeAnimation)
    const isAnimating = (window as any).isStageAnimating || false
    if (isAnimating) {
      return
    }

    // Update ambient light
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isMobile 
        ? lightingControls.ambientIntensity * 0.8 
        : lightingControls.ambientIntensity
      ambientLightRef.current.color.setHex(parseInt(lightingControls.ambientColor.replace('#', ''), 16))
    }
    
    // Update directional light
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = isMobile
        ? lightingControls.directionalIntensity * 0.7
        : lightingControls.directionalIntensity
      directionalLightRef.current.color.setHex(parseInt(lightingControls.directionalColor.replace('#', ''), 16))
      directionalLightRef.current.position.set(
        lightingControls.directionalPosition.x,
        lightingControls.directionalPosition.y,
        lightingControls.directionalPosition.z
      )
      directionalLightRef.current.target.position.set(
        lightingControls.directionalTarget.x,
        lightingControls.directionalTarget.y,
        lightingControls.directionalTarget.z
      )
    }
    
    // Update point light
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightingControls.pointLightIntensity
      pointLightRef.current.color.setHex(parseInt(lightingControls.pointLightColor.replace('#', ''), 16))
      pointLightRef.current.position.set(
        lightingControls.pointLightPosition.x,
        lightingControls.pointLightPosition.y,
        lightingControls.pointLightPosition.z
      )
    }
    
    // Update spot light
    if (spotLightRef.current) {
      spotLightRef.current.intensity = lightingControls.spotLightIntensity
      spotLightRef.current.color.setHex(parseInt(lightingControls.spotLightColor.replace('#', ''), 16))
      spotLightRef.current.position.set(
        lightingControls.spotLightPosition.x,
        lightingControls.spotLightPosition.y,
        lightingControls.spotLightPosition.z
      )
      spotLightRef.current.target.position.set(
        lightingControls.spotLightTarget.x,
        lightingControls.spotLightTarget.y,
        lightingControls.spotLightTarget.z
      )
    }
  }, [lightingControls, isMobile])

  return null // Declarative component
}


