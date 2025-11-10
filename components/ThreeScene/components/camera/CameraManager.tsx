'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { CameraControls } from '../../../../store/useAppStore'

interface CameraManagerProps {
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
  cameraControls: CameraControls
  isMobile: boolean
}

/**
 * Manages Three.js camera updates
 * Applies camera position, rotation, FOV, and other settings
 */
export function CameraManager({ cameraRef, cameraControls, isMobile }: CameraManagerProps) {
  useEffect(() => {
    if (!cameraRef.current) return

    const camera = cameraRef.current
    const { position, rotation, target, fov, near, far, zoom } = cameraControls
    
    // Apply mobile camera adjustments
    const finalPosition = isMobile ? {
      x: position.x,
      y: position.y + 0.5, // Move camera slightly higher on mobile
      z: position.z + 2     // Move camera further back on mobile
    } : position
    
    camera.position.set(finalPosition.x, finalPosition.y, finalPosition.z)
    camera.rotation.set(rotation.x, rotation.y, rotation.z)
    camera.lookAt(target.x, target.y, target.z)
    
    const mobileFOV = fov + 15 // Increase FOV on mobile for wider view
    const finalFOV = isMobile ? mobileFOV : fov
    
    camera.fov = finalFOV
    camera.near = near
    camera.far = far
    camera.zoom = zoom
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld(true)
    
  }, [cameraRef, cameraControls, isMobile])

  return null // Declarative component
}

