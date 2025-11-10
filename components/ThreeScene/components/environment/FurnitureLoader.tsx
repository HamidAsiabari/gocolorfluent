'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

interface FurnitureLoaderProps {
  scene: THREE.Scene
  onLoaded?: (furnitureGroup: THREE.Group) => void
}

/**
 * Loads furniture environment model
 * This creates the room setup with furniture in the background
 */
export function FurnitureLoader({ scene, onLoaded }: FurnitureLoaderProps) {
  const initializedRef = useRef(false)
  
  useEffect(() => {
    // Prevent duplicate loads in React StrictMode
    if (initializedRef.current) return
    initializedRef.current = true

    const loader = new GLTFLoader()
    // Use low-priority loading by deferring to idle time when available
    const startLoad = () => loader.load(
      '/product-3d/Furniture_No-23.glb',
      (gltf) => {
        const furniture = gltf.scene
        
        // Log all object names in the furniture model
        const objectNames: string[] = []
        furniture.traverse((child) => {
          if (child.name) {
            objectNames.push(child.name)
          }
        })
        
        // Position furniture at the back of the room
        furniture.position.set(0, 0, -8)
        furniture.scale.set(1, 1, 1)
        
        // Remove/hide specific objects
        furniture.traverse((child) => {
          // Hide make_up_box and drawer_
          if (child.name && (
            child.name.toLowerCase().includes('make_up_box') ||
            child.name.toLowerCase().includes('drawer_')
          )) {
            child.visible = false
          }
        })
        
        // Enable shadows for furniture to receive shadows from the product model
        furniture.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true
            child.castShadow = false // Furniture doesn't need to cast shadows
          }
        })
        
        // Ensure furniture sits on floor
        let minY = Infinity
        furniture.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const box = new THREE.Box3().setFromObject(child)
            const childMinY = box.min.y
            if (childMinY < minY) {
              minY = childMinY
            }
          }
        })
        
        if (minY !== Infinity) {
          furniture.position.y = -minY
        }
        
        scene.add(furniture)
        
        // Notify parent that furniture is loaded
        onLoaded?.(furniture)
      },
      undefined,
      (error) => {
        console.error('❌ Error loading furniture:', error)
      }
    )

    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(startLoad, { timeout: 1000 })
    } else {
      setTimeout(startLoad, 0)
    }
  }, [scene])

  return null
}

