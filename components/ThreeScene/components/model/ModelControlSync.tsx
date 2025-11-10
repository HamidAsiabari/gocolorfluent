'use client'

import { useEffect } from 'react'
import * as THREE from 'three'

interface ModelControlSyncProps {
  modelRef: React.MutableRefObject<THREE.Group | null>
  modelControls: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  }
  requestRender?: () => void
}

/**
 * Syncs React state model controls with Three.js model object
 * Updates position, rotation, and scale when controls change
 */
export function ModelControlSync({ modelRef, modelControls, requestRender }: ModelControlSyncProps) {
  useEffect(() => {
    if (!modelRef.current) {
      return
    }

    const model = modelRef.current
    const { scale, position, rotation } = modelControls

    // Only update if values have actually changed
    if (model.scale.x !== scale.x || model.scale.y !== scale.y || model.scale.z !== scale.z) {
      model.scale.set(scale.x, scale.y, scale.z)
    }
    
    if (model.position.x !== position.x || model.position.y !== position.y || model.position.z !== position.z) {
      model.position.set(position.x, position.y, position.z)
    }
    
    if (model.rotation.x !== rotation.x || model.rotation.y !== rotation.y || model.rotation.z !== rotation.z) {
      model.rotation.set(rotation.x, rotation.y, rotation.z)
    }

    requestRender?.()
  }, [
    modelRef,
    modelControls.position.x,
    modelControls.position.y,
    modelControls.position.z,
    modelControls.rotation.x,
    modelControls.rotation.y,
    modelControls.rotation.z,
    modelControls.scale.x,
    modelControls.scale.y,
    modelControls.scale.z,
    requestRender
  ])

  return null
}

