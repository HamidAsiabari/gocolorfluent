'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface EnvironmentMapProps {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
}

/**
 * Creates and applies environment map to scene for reflections
 * Essential for proper lighting and reflections on objects
 */
export function EnvironmentMap({ scene, renderer }: EnvironmentMapProps) {
  useEffect(() => {
    if (!scene || !renderer) return

    // Create a detailed procedural environment for better metallic reflections
    const envGroup = new THREE.Group()
    
    // Create a neutral gray sky sphere for steel reflections
    const skyGeometry = new THREE.SphereGeometry(100, 64, 32)
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x888888, // Neutral gray instead of blue
      side: THREE.BackSide
    })
    const skySphere = new THREE.Mesh(skyGeometry, skyMaterial)
    envGroup.add(skySphere)
    
    // Add bright, reflective objects - black and white only for steel appearance
    for (let i = 0; i < 8; i++) {
      // Add bright spheres in black, white, and gray tones only
      const sphereGeometry = new THREE.SphereGeometry(10 + Math.random() * 10, 32, 16)
      const colors = [0xffffff, 0xf5f5f5, 0xe8e8e8, 0xd8d8d8, 0x808080, 0x606060, 0x404040, 0x202020, 0x000000]
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(
        (Math.random() - 0.5) * 150,
        Math.random() * 60 - 20,
        (Math.random() - 0.5) * 150
      )
      envGroup.add(sphere)
    }
    
    // Add some clouds in white/gray tones only
    for (let i = 0; i < 10; i++) {
      const cloudGeometry = new THREE.SphereGeometry(20 + Math.random() * 15, 16, 8)
      const cloudMaterial = new THREE.MeshBasicMaterial({
        color: [0xffffff, 0xf0f0f0, 0xe0e0e0, 0xd0d0d0][Math.floor(Math.random() * 4)],
        transparent: true,
        opacity: 0.9
      })
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
      cloud.position.set(
        (Math.random() - 0.5) * 180,
        Math.random() * 40 + 30,
        (Math.random() - 0.5) * 180
      )
      cloud.scale.set(1, 0.6, 1)
      envGroup.add(cloud)
    }
    
    // Add gray ground for bottom reflections
    const groundGeometry = new THREE.PlaneGeometry(300, 300)
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0xc0c0c0, // Neutral gray
      side: THREE.DoubleSide
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -60
    envGroup.add(ground)
    
    // Add bright panels to the sides for structured reflections
    const sideGeometry = new THREE.PlaneGeometry(100, 100)
    const sideMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    })
    
    // Left side
    const leftSide = new THREE.Mesh(sideGeometry, sideMaterial)
    leftSide.position.set(-80, 0, 0)
    leftSide.rotation.y = Math.PI / 2
    envGroup.add(leftSide)
    
    // Right side
    const rightSide = new THREE.Mesh(sideGeometry, sideMaterial)
    rightSide.position.set(80, 0, 0)
    rightSide.rotation.y = -Math.PI / 2
    envGroup.add(rightSide)
    
    // Back side
    const backSide = new THREE.Mesh(sideGeometry, sideMaterial)
    backSide.position.set(0, 0, -80)
    envGroup.add(backSide)
    
    // Front side
    const frontSide = new THREE.Mesh(sideGeometry, sideMaterial)
    frontSide.position.set(0, 0, 80)
    frontSide.rotation.y = Math.PI
    envGroup.add(frontSide)
    
    scene.add(envGroup)
    
    // Generate environment map from the detailed scene
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    const generatedEnvMap = pmremGenerator.fromScene(scene).texture
    scene.environment = generatedEnvMap
    scene.background = generatedEnvMap
    
    // Remove the temporary environment group
    scene.remove(envGroup)
    
    // Clean up PMREM generator
    pmremGenerator.dispose()
    

    return () => {
      // Cleanup is handled in the main effect
    }
  }, [scene, renderer])

  return null
}

