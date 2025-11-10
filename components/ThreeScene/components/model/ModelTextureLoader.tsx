'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

interface ModelTextureLoaderProps {
  modelRef: React.MutableRefObject<THREE.Group | null>
  textureLoader: THREE.TextureLoader
  componentRefs: React.MutableRefObject<Map<string, THREE.Object3D>>
  onTexturesLoaded?: () => void
}

/**
 * Creates a black texture programmatically
 */
function createBlackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    // Create a solid black texture
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 512, 512)
    
    // Add subtle texture variation for realism
    ctx.fillStyle = '#111111'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const size = Math.random() * 3 + 1
      ctx.fillRect(x, y, size, size)
    }
  }
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.flipY = false
  texture.generateMipmaps = false
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  
  return texture
}

/**
 * Applies black texture to a component
 */
function applyBlackTextureToComponent(component: THREE.Object3D, texture: THREE.CanvasTexture, componentName: string): number {
  let appliedCount = 0
  
  component.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const newMaterial = child.material.clone()
      
      if (Array.isArray(newMaterial)) {
        newMaterial.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.map = texture
            mat.color.setHex(0x000000)
            mat.metalness = 0.1
            mat.roughness = 0.8
            mat.needsUpdate = true
          }
        })
      } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
        newMaterial.map = texture
        newMaterial.color.setHex(0x000000)
        newMaterial.metalness = 0.1
        newMaterial.roughness = 0.8
        newMaterial.needsUpdate = true
      }
      
      child.material = newMaterial
      appliedCount++
    }
  })
  
  return appliedCount
}

/**
 * Loads and applies textures to the 3D model
 * Applies OLED screen, metal textures, normal maps, etc.
 */
export function ModelTextureLoader({ modelRef, textureLoader, componentRefs, onTexturesLoaded }: ModelTextureLoaderProps) {
  const texturesLoadedRef = useRef(false)

  useEffect(() => {
    if (!modelRef.current || texturesLoadedRef.current) return
    
    // Wait a bit for componentRefs to be populated
    const timeoutId = setTimeout(() => {
      texturesLoadedRef.current = true
      
      const oledBlackTexture = createBlackTexture()
      const allOLEDObjects: THREE.Object3D[] = []
      
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child.name && (
            child.name.toLowerCase().includes('oled') || 
            child.name.toLowerCase().includes('display') ||
            child.name.toLowerCase().includes('screen')
          )) {
            allOLEDObjects.push(child)
          }
        })
      }
      
      
      // Apply black texture to all found OLED objects
      let totalMeshes = 0
      allOLEDObjects.forEach(obj => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            totalMeshes++
            
            const newMaterial = child.material.clone()
            
            if (Array.isArray(newMaterial)) {
              newMaterial.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.map = oledBlackTexture
                  mat.color.setHex(0x000000)
                  mat.emissive = new THREE.Color(0x000000)
                  mat.emissiveIntensity = 0.0
                  mat.roughness = 0.8
                  mat.metalness = 0.1
                  mat.needsUpdate = true
                }
              })
            } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
              newMaterial.map = oledBlackTexture
              newMaterial.color.setHex(0x000000)
              newMaterial.emissive = new THREE.Color(0x000000)
              newMaterial.emissiveIntensity = 0.0
              newMaterial.roughness = 0.8
              newMaterial.metalness = 0.1
              newMaterial.needsUpdate = true
            }
            
            child.material = newMaterial
          }
        })
      })
      

      // Load metal textures
      textureLoader.load('/textures/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg', (baseTexture) => {
        
        baseTexture.colorSpace = THREE.SRGBColorSpace
        baseTexture.flipY = false
        baseTexture.wrapS = THREE.RepeatWrapping
        baseTexture.wrapT = THREE.RepeatWrapping

        // Load normal map
        textureLoader.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Normal.png', (normalTexture) => {
          
          normalTexture.colorSpace = THREE.NoColorSpace
          normalTexture.flipY = false
          normalTexture.wrapS = THREE.RepeatWrapping
          normalTexture.wrapT = THREE.RepeatWrapping

          // Load metallic map
          textureLoader.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Metallic.jpg', (metallicTexture) => {
            
            metallicTexture.colorSpace = THREE.NoColorSpace
            metallicTexture.flipY = false
            metallicTexture.wrapS = THREE.RepeatWrapping
            metallicTexture.wrapT = THREE.RepeatWrapping

            // Load roughness map
            textureLoader.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Roughness.jpg', (roughnessTexture) => {
              
              roughnessTexture.colorSpace = THREE.NoColorSpace
              roughnessTexture.flipY = false
              roughnessTexture.wrapS = THREE.RepeatWrapping
              roughnessTexture.wrapT = THREE.RepeatWrapping

              const upperCoverComponent = componentRefs.current.get('upperCover')
              
              if (upperCoverComponent) {
                
                let appliedCount = 0
                upperCoverComponent.traverse((child) => {
                  if (child instanceof THREE.Mesh && child.material) {
                    const newMaterial = child.material.clone()
                    
                    if (Array.isArray(newMaterial)) {
                      newMaterial.forEach((mat) => {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                          mat.map = baseTexture
                          mat.color = new THREE.Color(0xF9F9F9) // Steel gray base color
                          mat.normalMap = normalTexture
                          mat.normalScale = new THREE.Vector2(2, 2)
                          mat.metalnessMap = metallicTexture
                          mat.roughnessMap = roughnessTexture
                          mat.metalness = 0.99
                          mat.roughness = 0.99 // Increased roughness for brushed metal look
                          mat.envMapIntensity = 0.85 // Reduced environment reflection
                          mat.needsUpdate = true
                        }
                      })
                    } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                      newMaterial.map = baseTexture
                      newMaterial.color = new THREE.Color(0xF9F9F9) // Steel gray base color
                      newMaterial.normalMap = normalTexture
                      newMaterial.normalScale = new THREE.Vector2(2, 2)
                      newMaterial.metalnessMap = metallicTexture
                      newMaterial.roughnessMap = roughnessTexture
                      newMaterial.metalness = 0.99
                      newMaterial.roughness = 0.99 // Increased roughness for brushed metal look
                      newMaterial.envMapIntensity = 0.85 // Reduced environment reflection
                      newMaterial.needsUpdate = true
                    }
                    
                    child.material = newMaterial
                    appliedCount++
                  }
                })
                
              }
              const blackTexture = createBlackTexture()
              const componentsForBlackTexture = [
                'productComponents',
                'knobs',
                'loadingMaterialCover',
                'upperSideMainHolder'
              ]
              
              componentsForBlackTexture.forEach(componentKey => {
                const component = componentRefs.current.get(componentKey)
                if (component) {
                  applyBlackTextureToComponent(component, blackTexture, componentKey)
                }
              })
              
              
              const componentsWithSpecialTextures = new Set([
                'upperCover',
                'productComponents',
                'knobs',
                'loadingMaterialCover',
                'upperSideMainHolder',
                'oledDisplay'
              ])
              
              let totalTexturedMeshes = 0
              let skippedMeshes = 0
              
              if (modelRef.current) {
                // Build a set of all meshes that are part of special-textured components
                const specialTextureMeshes = new Set<THREE.Mesh>()
                
                componentRefs.current.forEach((component, componentKey) => {
                  if (componentsWithSpecialTextures.has(componentKey)) {
                    component.traverse((compChild: THREE.Object3D) => {
                      if (compChild instanceof THREE.Mesh) {
                        specialTextureMeshes.add(compChild)
                      }
                    })
                  }
                })
                
                modelRef.current.traverse((child) => {
                  if (child instanceof THREE.Mesh && child.material) {
                    // Only apply metal texture if this mesh is NOT part of special textured components
                    if (!specialTextureMeshes.has(child)) {
                      const newMaterial = child.material.clone()
                      
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat) => {
                          if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.map = baseTexture
                            mat.color = new THREE.Color(0xF8F8F8) // Steel gray base color
                            mat.normalMap = normalTexture
                            mat.normalScale = new THREE.Vector2(2, 2)
                            mat.metalnessMap = metallicTexture
                            mat.roughnessMap = roughnessTexture
                            mat.metalness = 0.99
                            mat.roughness = 0.99 // Increased roughness for brushed metal look
                            mat.envMapIntensity = 0.85 // Reduced environment reflection
                            mat.needsUpdate = true
                          }
                        })
                      } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                        newMaterial.map = baseTexture
                        newMaterial.color = new THREE.Color(0xF8F8F8) // Steel gray base color
                        newMaterial.normalMap = normalTexture
                        newMaterial.normalScale = new THREE.Vector2(2, 2)
                        newMaterial.metalnessMap = metallicTexture
                        newMaterial.roughnessMap = roughnessTexture
                        newMaterial.metalness = 0.99
                        newMaterial.roughness = 1.6 // Increased roughness for brushed metal look
                        newMaterial.envMapIntensity = 0.85 // Reduced environment reflection
                        newMaterial.needsUpdate = true
                      }
                      
                      child.material = newMaterial
                      totalTexturedMeshes++
                    } else {
                      skippedMeshes++
                    }
                  }
                })
                
                
                // Call onTexturesLoaded callback when all textures are applied
                onTexturesLoaded?.()
              }
            })
          })
        })
      }, (error) => {
        console.error('❌ Error loading metal textures:', error)
      })
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [modelRef, textureLoader, componentRefs, onTexturesLoaded])

  return null
}
