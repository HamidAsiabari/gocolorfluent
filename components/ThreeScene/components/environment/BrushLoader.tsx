'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

interface BrushLoaderProps {
  scene: THREE.Scene
  onLoaded?: (brushGroup: THREE.Group) => void
}

/**
 * Loads brush accessory models
 * Positioned on the table near the main product
 */
export function BrushLoader({ scene, onLoaded }: BrushLoaderProps) {
  const initializedRef = useRef(false)
  const brushesLoadedRef = useRef<number>(0)
  const totalItems = 3 // Now loading 3 items: 2 brushes + 1 tea cup
  
  useEffect(() => {
    // Prevent duplicate loads in React StrictMode
    if (initializedRef.current) return
    initializedRef.current = true

    const loader = new GLTFLoader()
    
    // Load the first brush (comb brush)
    loader.load(
      '/product-3d/comb__brush.glb',
      (gltf) => {
        const brush = gltf.scene.clone()
        
        // Position brush on the table near the product model
        // Product is at x: 0.2, y: 1.87, z: -9
        // Position brush to the right of the product on the table
        brush.position.set(0.6, 1.87, -8.96)
        
        // Scale down the brush to be proportional to the product
        brush.scale.set(0.002, 0.002, 0.002)
        
        // Slight rotation to make it look natural on the table
        brush.rotation.set(0, 0.8, 0)
        
        // Enable shadows for the brush
        brush.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        scene.add(brush)
        
        brushesLoadedRef.current++
        if (brushesLoadedRef.current === totalItems) {
          onLoaded?.(brush)
        }
      },
      undefined,
      (error) => {
        console.error('❌ Error loading comb brush:', error)
      }
    )
    
    // Load the second brush (round hair brush)
    loader.load(
      '/product-3d/salon_round_hair_brush.glb',
      (gltf) => {
        const brush = gltf.scene.clone()
        
        // Position second brush to the left of the product on the table
        brush.position.set(0.77, 1.87, -8.90)
        
        // Scale down the brush to be proportional to the product
        brush.scale.set(0.021, 0.021, 0.021)
        
        // Different rotation to make it look natural
        brush.rotation.set(0, -0.89, 0.22)
        
        // Enable shadows for the brush
        brush.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        scene.add(brush)
        
        brushesLoadedRef.current++
        if (brushesLoadedRef.current === totalItems) {
          onLoaded?.(brush)
        }
      },
      undefined,
      (error) => {
        console.error('❌ Error loading round hair brush:', error)
      }
    )
    
    // Load the tea cup
    loader.load(
      '/product-3d/japanese_tea_cup.glb',
      (gltf) => {
        const teaCup = gltf.scene.clone()
        
        // Position tea cup on the table between the brushes
        // Placing it at center-ish position on the table
        teaCup.position.set(0.8, 1.87, -8.91)
        
        // Scale the tea cup to be proportional
        teaCup.scale.set(1.2, 0.99, 1.2)
        
        // Slight rotation to make it look natural on the table
        teaCup.rotation.set(0, 0.3, 0)
        
        // Enable shadows for the tea cup
        teaCup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        scene.add(teaCup)
        
        brushesLoadedRef.current++
        if (brushesLoadedRef.current === totalItems) {
          onLoaded?.(teaCup)
        }
      },
      undefined,
      (error) => {
        console.error('❌ Error loading tea cup:', error)
      }
    )
  }, [scene, onLoaded])

  return null
}
