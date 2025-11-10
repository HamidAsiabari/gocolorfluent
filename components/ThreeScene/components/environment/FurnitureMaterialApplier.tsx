'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface FurnitureMaterialApplierProps {
  furnitureGroup: THREE.Group
  scene: THREE.Scene
  onFurnitureTexturesLoaded?: () => void
}

/**
 * Applies materials to furniture components
 * Handles mirror surfaces, desk textures, and other material customization
 */
export function FurnitureMaterialApplier({ furnitureGroup, scene, onFurnitureTexturesLoaded }: FurnitureMaterialApplierProps) {
  const initializedRef = useRef(false)
  const notifiedReadyRef = useRef(false)
  const notifyReadyOnce = () => {
    if (!notifiedReadyRef.current) {
      notifiedReadyRef.current = true
      onFurnitureTexturesLoaded?.()
    }
  }
  
  useEffect(() => {
    if (!furnitureGroup || initializedRef.current) return
    initializedRef.current = true

    let deskMeshes: THREE.Mesh[] = []
    let mainDeskGroup: any = null

    // First pass: identify desk group and collect desk meshes
    furnitureGroup.traverse((child) => {
      // Check for main_desk group
      if (child instanceof THREE.Group && child.name.toLowerCase().includes('main_desk')) {
        mainDeskGroup = child
      }

      // Apply mirror materials to glass/mirror surfaces
      if (child instanceof THREE.Mesh && child.material) {
        const isDeskMesh = child.name.toLowerCase().includes('cube') || 
                         child.name.toLowerCase().includes('desk') ||
                         child.name.toLowerCase().includes('table')
        
        if (isDeskMesh) {
          deskMeshes.push(child)
          return
        }

        // Identify mirror/glass surfaces
        const isMirrorSurface = child.name.toLowerCase().includes('mirror') || 
                              child.name.toLowerCase().includes('glass') ||
                              child.name.toLowerCase().includes('reflection') ||
                              child.name.toLowerCase().includes('cylinder002_1') ||
                              child.name.toLowerCase().includes('circle001')
        
        if (isMirrorSurface) {
          
          const mirrorMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 0.0,
            reflectivity: 1.0,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            envMap: scene.environment,
            envMapIntensity: 2.0,
            transmission: 0.0,
            transparent: false,
            opacity: 1.0,
            side: THREE.DoubleSide,
            ior: 1.5
          })
          
          child.material = mirrorMaterial
        }
      }
    })

    // Apply desk textures
    if (deskMeshes.length > 0 && mainDeskGroup) {
      let tableTopMesh: any = null
      let highestY = -Infinity

      // Find table top mesh
      deskMeshes.forEach((mesh) => {
        const boundingBox = new THREE.Box3().setFromObject(mesh)
        const centerY = boundingBox.getCenter(new THREE.Vector3()).y
        const size = boundingBox.getSize(new THREE.Vector3())
        
        if (centerY > highestY) {
          highestY = centerY
          tableTopMesh = mesh
        }
      })

      if (tableTopMesh) {

        // Get the furniture parent to update matrices
        let furnitureObject: any = furnitureGroup
        if (tableTopMesh.parent) {
          furnitureObject = tableTopMesh.parent.parent || furnitureGroup
        }
        
        if (furnitureObject) furnitureObject.updateMatrixWorld(true)
        if (mainDeskGroup) mainDeskGroup.updateMatrixWorld(true)
        tableTopMesh.updateMatrixWorld(true)

        const textureLoader = new THREE.TextureLoader()

        let baseColorTexture: THREE.Texture | null = null
        let normalTexture: THREE.Texture | null = null
        let roughnessTexture: THREE.Texture | null = null
        let metallicTexture: THREE.Texture | null = null
        let completedTextures = 0
        const totalTextures = 4
        const markComplete = () => {
          completedTextures++
          if (completedTextures >= totalTextures) {
            // If we could not build full PBR, still notify readiness to avoid blocking
            // applyPBRMaterial will also notify if it succeeds earlier
            notifyReadyOnce()
          }
        }

        const configureTexture = (texture: THREE.Texture) => {
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.repeat.set(1.5, 1.5) // Reduce repeat even more for smoother appearance
          texture.generateMipmaps = true
          texture.minFilter = THREE.LinearMipmapLinearFilter
          texture.magFilter = THREE.LinearFilter
          texture.anisotropy = 16 // Increase texture quality
          // Enable smooth texture filtering to reduce breakpoints
          texture.flipY = false
          texture.needsUpdate = true
        }

        const applyPBRMaterial = () => {
          if (completedTextures < totalTextures) return
          
          // Use MeshPhysicalMaterial for better realism with smooth clearcoat
          const pbrMaterial = new THREE.MeshPhysicalMaterial({
            map: baseColorTexture,
            normalMap: normalTexture,
            normalScale: new THREE.Vector2(1.2, 1.2), // Reduce normal intensity for smoother reflections
            roughnessMap: roughnessTexture,
            metalnessMap: metallicTexture,
            color: 0xffffff,
            side: THREE.DoubleSide,
            flatShading: false,
            roughness: 0.5, // Moderate roughness for smoother transitions
            metalness: 0.0, // Stone is not metallic
            envMapIntensity: 2.2, // Increase environment reflection
            // Add smooth clearcoat for glossy surface
            clearcoat: 0.8,
            clearcoatRoughness: 0.15, // Smoother clearcoat
            clearcoatNormalMap: normalTexture, // Use same normal for consistency
            clearcoatNormalScale: new THREE.Vector2(0.8, 0.8),
            // Add subsurface scattering for natural stone look
            thickness: 0.1,
            // Add anisotropy for smooth brushed effect
            anisotropy: 0.5
          })
          
          tableTopMesh.material = pbrMaterial
          
          if (Array.isArray(tableTopMesh.material)) {
            tableTopMesh.material.forEach((mat: THREE.Material) => mat.needsUpdate = true)
          } else {
            tableTopMesh.material.needsUpdate = true
          }

          notifyReadyOnce()
        }

        // Load PBR wood textures
        textureLoader.load(
          '/textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_BaseColor.jpg',
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.flipY = false
            configureTexture(texture)
            baseColorTexture = texture
            markComplete()
            applyPBRMaterial()
          },
          undefined,
          (error) => { console.error('❌ Error loading base color:', error); markComplete(); applyPBRMaterial() }
        )

        textureLoader.load(
          '/textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Normal.png',
          (texture) => {
            texture.colorSpace = THREE.NoColorSpace
            texture.flipY = false
            configureTexture(texture)
            normalTexture = texture
            markComplete()
            applyPBRMaterial()
          },
          undefined,
          (error) => { console.error('❌ Error loading normal:', error); markComplete(); applyPBRMaterial() }
        )

        textureLoader.load(
          '/textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Roughness.jpg',
          (texture) => {
            texture.colorSpace = THREE.NoColorSpace
            texture.flipY = false
            configureTexture(texture)
            roughnessTexture = texture
            markComplete()
            applyPBRMaterial()
          },
          undefined,
          (error) => { console.error('❌ Error loading roughness:', error); markComplete(); applyPBRMaterial() }
        )

        textureLoader.load(
          '/textures/Poliigon_WoodVeneerOak_7760/2K/Poliigon_WoodVeneerOak_7760_Metallic.jpg',
          (texture) => {
            texture.colorSpace = THREE.NoColorSpace
            texture.flipY = false
            configureTexture(texture)
            metallicTexture = texture
            markComplete()
            applyPBRMaterial()
          },
          undefined,
          (error) => { console.error('❌ Error loading metallic:', error); markComplete(); applyPBRMaterial() }
        )
      }
    } else {
      // No desk meshes identified; do not block completion
      notifyReadyOnce()
    }

  }, [furnitureGroup, scene])

  return null
}

