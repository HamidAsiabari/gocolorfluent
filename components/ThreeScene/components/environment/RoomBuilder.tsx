'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { ROOM_DIMENSIONS } from '../../utils/constants'

interface RoomBuilderProps {
  scene: THREE.Scene
}

/**
 * Creates a room environment with walls, floor, and ceiling
 * Extracted from ThreeSceneManager room creation logic
 */
export function RoomBuilder({ scene }: RoomBuilderProps) {
  useEffect(() => {

    // Create materials
    const createWallMaterial = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const context = canvas.getContext('2d')
      
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#f0eae3')
        gradient.addColorStop(0.5, '#e6ddd4')
        gradient.addColorStop(1, '#dccfc1')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 10
          data[i] = Math.max(0, Math.min(255, data[i] + noise))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
        }
        
        context.putImageData(imageData, 0, 0)
        const wallTexture = new THREE.CanvasTexture(canvas)
        wallTexture.wrapS = THREE.RepeatWrapping
        wallTexture.wrapT = THREE.RepeatWrapping
        wallTexture.repeat.set(1, 1)
        wallTexture.generateMipmaps = false
        wallTexture.minFilter = THREE.LinearFilter
        wallTexture.magFilter = THREE.LinearFilter
        wallTexture.anisotropy = 16
        
        return new THREE.MeshPhysicalMaterial({
          map: wallTexture,
          roughness: 0.8,
          metalness: 0.0,
          transparent: false,
          opacity: 1,
          side: THREE.DoubleSide
        })
      }
      
      return new THREE.MeshPhysicalMaterial({
        color: 0xe6ddd4,
        roughness: 0.8,
        metalness: 0.0,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide
      })
    }

    const createFloorMaterial = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const context = canvas.getContext('2d')
      
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#f4f1ed')
        gradient.addColorStop(0.3, '#ede6dc')
        gradient.addColorStop(0.7, '#e0d5c7')
        gradient.addColorStop(1, '#d4c4b0')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        // Add wood grain
        context.strokeStyle = 'rgba(180, 160, 140, 0.3)'
        context.lineWidth = 1
        
        for (let x = 0; x < canvas.width; x += 20) {
          context.beginPath()
          context.moveTo(x + Math.random() * 5, 0)
          context.lineTo(x + Math.random() * 5, canvas.height)
          context.stroke()
        }
        
        for (let y = 0; y < canvas.height; y += 80) {
          context.strokeStyle = 'rgba(160, 140, 120, 0.4)'
          context.lineWidth = 2
          context.beginPath()
          context.moveTo(0, y)
          context.lineTo(canvas.width, y)
          context.stroke()
        }
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 8
          data[i] = Math.max(0, Math.min(255, data[i] + noise))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
          
          if (Math.random() < 0.005) {
            data[i] = Math.max(0, data[i] - 30)
            data[i + 1] = Math.max(0, data[i + 1] - 30)
            data[i + 2] = Math.max(0, data[i + 2] - 30)
          }
        }
        
        context.putImageData(imageData, 0, 0)
        const floorTexture = new THREE.CanvasTexture(canvas)
        floorTexture.wrapS = THREE.RepeatWrapping
        floorTexture.wrapT = THREE.RepeatWrapping
        floorTexture.repeat.set(3, 3)
        floorTexture.generateMipmaps = false
        floorTexture.minFilter = THREE.LinearFilter
        floorTexture.magFilter = THREE.LinearFilter
        floorTexture.anisotropy = 16
        
        return new THREE.MeshPhysicalMaterial({
          map: floorTexture,
          roughness: 0.6,
          metalness: 0.0,
          transparent: false,
          opacity: 1,
          side: THREE.DoubleSide
        })
      }
      
      return new THREE.MeshPhysicalMaterial({
        color: 0xe0d5c7,
        roughness: 0.6,
        metalness: 0.0,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide
      })
    }

    const createCeilingMaterial = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const context = canvas.getContext('2d')
      
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#faf9f7')
        gradient.addColorStop(0.5, '#f5f3f0')
        gradient.addColorStop(1, '#f0ede8')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 6
          data[i] = Math.max(0, Math.min(255, data[i] + noise))
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
        }
        
        context.putImageData(imageData, 0, 0)
        const ceilingTexture = new THREE.CanvasTexture(canvas)
        ceilingTexture.wrapS = THREE.RepeatWrapping
        ceilingTexture.wrapT = THREE.RepeatWrapping
        ceilingTexture.repeat.set(2, 2)
        ceilingTexture.generateMipmaps = false
        ceilingTexture.minFilter = THREE.LinearFilter
        ceilingTexture.magFilter = THREE.LinearFilter
        ceilingTexture.anisotropy = 16
        
        return new THREE.MeshPhysicalMaterial({
          map: ceilingTexture,
          roughness: 0.9,
          metalness: 0.0,
          transparent: false,
          opacity: 1,
          side: THREE.DoubleSide
        })
      }
      
      return new THREE.MeshPhysicalMaterial({
        color: 0xf5f3f0,
        roughness: 0.9,
        metalness: 0.0,
        transparent: false,
        opacity: 1,
        side: THREE.DoubleSide
      })
    }

    const wallMaterial = createWallMaterial()
    const floorMaterial = createFloorMaterial()
    const ceilingMaterial = createCeilingMaterial()

    // Room dimensions
    const { width: roomWidth, depth: roomDepth, height: roomHeight } = ROOM_DIMENSIONS

    // Back Wall
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2)
    scene.add(backWall)

    // Left Wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0)
    leftWall.rotation.y = Math.PI / 2
    scene.add(leftWall)

    // Right Wall
    const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0)
    rightWall.rotation.y = -Math.PI / 2
    scene.add(rightWall)

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.position.set(0, 0, 0)
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
    ceiling.position.set(0, roomHeight, 0)
    ceiling.rotation.x = Math.PI / 2
    scene.add(ceiling)


    // Cleanup function
    return () => {
      scene.remove(backWall)
      scene.remove(leftWall)
      scene.remove(rightWall)
      scene.remove(floor)
      scene.remove(ceiling)
    }
  }, [scene])

  return null // Declarative component
}

