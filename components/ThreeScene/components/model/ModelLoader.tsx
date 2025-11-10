'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { ComponentControls } from '../../../DevControls/sections/product3d/types'

interface ModelLoaderProps {
  scene: THREE.Scene
  modelControls: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  }
  componentControls: ComponentControls
  onProgress?: (progress: number) => void
  onComplete?: () => void
  modelRef: React.MutableRefObject<THREE.Group | null>
  isModelLoadedRef: React.MutableRefObject<boolean>
  componentRefs?: React.MutableRefObject<Map<string, THREE.Object3D>>
}

/**
 * Handles loading the 3D model into the scene
 */
export function ModelLoader({
  scene,
  modelControls,
  componentControls,
      onProgress,
      onComplete,
      modelRef,
      isModelLoadedRef,
      componentRefs
}: ModelLoaderProps) {
  const componentRefsInternal = componentRefs || useRef<Map<string, THREE.Object3D>>(new Map())
  
  useEffect(() => {
    if (isModelLoadedRef.current || !scene) return


    const loader = new GLTFLoader()
    let loadingProgress = 0

    const updateProgress = (progress: number) => {
      loadingProgress = progress
      onProgress?.(progress)
    }

    loader.load(
      '/product-3d/Color_Brush_assembly_V1_1.glb',
      (gltf) => {
        // Model geometry loaded
        
        const model = gltf.scene
        modelRef.current = model
        isModelLoadedRef.current = true

        // Make model visible
        model.visible = true
        model.traverse((child) => {
          child.visible = true
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat) {
                  mat.visible = true
                  mat.transparent = false
                  mat.opacity = 1
                }
              })
            } else if (child.material) {
              child.material.visible = true
              child.material.transparent = false
              child.material.opacity = 1
            }
          }
        })

        // Apply shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        // Apply initial position, rotation, and scale
        model.scale.set(modelControls.scale.x, modelControls.scale.y, modelControls.scale.z)
        model.position.set(modelControls.position.x, modelControls.position.y, modelControls.position.z)
        model.rotation.set(modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z)

        // Clear component refs
        componentRefsInternal.current.clear()

        // Enhanced component mapping with correct names from the actual 3D model
        const componentMapping: { [key: string]: string[] } = {
          // Core Mechanical Components - using actual model names
          microGearmotor: ['MicroGearmotor1', 'MicroGearmotor_InstanceRep', 'MicroGearmotor1_1', 'MicroGearmotor1_InstanceRep'],
          gearMotorPCB: ['Gear_motor_PCB1', 'Gear_motor_PCB_InstanceRep'],
          motorHolder: ['Motor_holder_11', 'Motor_holder_1_InstanceRep'],
          holderSupport: ['Holder_support1', 'Holder_support_InstanceRep', 'Holder_support2', 'Holder_support_InstanceRep_1'],
          coupling: ['Coupling1', 'Coupling_InstanceRep'],
          m5Screw: ['M5_Screw1', 'M5_Screw_InstanceRep'],
          
          // Brush & Application System
          movingPlate: ['Movin_Plate1', 'Movin_Plate_InstanceRep'],
          siliconSupport: ['Mobin_silicon_support1', 'Mobin_silicon_support_InstanceRep'],
          nozzle: ['Copy_(1)_of_Nuzzle1', 'Copy_(1)_of_Nuzzle_InstanceRep'],
          nozzleBlinder: ['Nuzzel_blinder1', 'Nuzzel_blinder_InstanceRep'],
          
          // Main Housing & Structure
          upperSideMainHolder: ['Upper_side_main_holder1', 'Upper_side_main_holder_InstanceRep'],
          lowerSideMain: ['Lower_Side_Main1', 'Lower_Side_Main_InstanceRep'],
          upperCover: ['Upper_cover1', 'Upper_cover_InstanceRep'],
          loadingMaterialCover: ['Loading_Material_Cover1', 'Loading_Material_Cover_InstanceRep'],
          
          // Electronic Components
          colorSensorPCB: ['Color_Sensor_PCB1', 'Color_Sensor_PCB_InstanceRep'],
          sts8dn3llh5: ['STS8DN3LLH51', 'STS8DN3LLH5_InstanceRep'],
          oledDisplay: ['OLED_Display1', 'OLED_Display_InstanceRep'],
          detectorSwitch: ['Detector_Switch1', 'Detector_Switch_InstanceRep'],
          slideSwitch: ['Slide_Switch_11', 'Slide_Switch_1_InstanceRep'],
          
          // LED & Lighting
          everlightLEDs: ['User_Library-Everlight_67-21SRC-TR81', 'User_Library-Everlight_67-21SRC-TR82', 'User_Library-Everlight_67-21SRC-TR83', 'User_Library-Everlight_67-21SRC-TR84'],
          sensorGuideLight: ['Sensor_Guide_Light1', 'Sensor_Guide_Light_InstanceRep'],
          
          // User Interface
          knobs: ['Knobs1', 'Knobs_InstanceRep'],
          drainButtonActuator: ['Drain_Button_Actuator1', 'Drain_Button_Actuator_InstanceRep'],
          handleUpCover: ['Handle_up_cover1', 'Handle_up_cover_InstanceRep'],
          
          // Support & Guide Components
          hairGuideSupport: ['Hair_guide_Support1', 'Hair_guide_Support_InstanceRep'],
          skqyafComponents: ['SKQYAF1', 'SKQYAF_InstanceRep', 'SKQYAF2', 'SKQYAF_InstanceRep_1', 'SKQYAF3', 'SKQYAF_InstanceRep_2', 'SKQYAF4', 'SKQYAF_InstanceRep_3'],
          
          // Additional Parts
          productComponents: ['Product11', 'Product21', 'Product12', 'Product51', 'Product61', 'Product71'],
          genericParts: ['Part11', 'Part1_InstanceRep', 'Part11_1', 'Part11_InstanceRep', 'Part11_2', 'Part113_InstanceRep', 'Part21', 'Part22_InstanceRep', 'Part31', 'Part3_InstanceRep', 'Part41', 'Part4_InstanceRep', 'Part51', 'Part5_InstanceRep', 'Part71', 'Part7_InstanceRep', 'Copy_(1)_of_Part71', 'Copy_(1)_of_Part7_InstanceRep', 'Part21_1', 'Part2_InstanceRep', 'Part11_3', 'Part1135_InstanceRep', 'Part21_2', 'Part224_InstanceRep'],
          importedComponents: ['Imported_2_InstanceRep', 'Imported_4_InstanceRep', 'Imported_InstanceRep', 'Imported_3_InstanceRep', 'Imported_2_InstanceRep_1', 'Imported_4_InstanceRep_1', 'Imported_InstanceRep_1', 'Imported_3_InstanceRep_1', 'Imported_2_InstanceRep_2', 'Imported_4_InstanceRep_2', 'Imported_InstanceRep_2', 'Imported_3_InstanceRep_2', 'Imported_2_InstanceRep_3', 'Imported_4_InstanceRep_3', 'Imported_InstanceRep_3', 'Imported_3_InstanceRep_3']
        }

        // Enhanced component finding with better debugging
        const foundComponents: string[] = []
        
        model.traverse((child) => {
          if (child.name) {
            foundComponents.push(child.name)
            
            Object.entries(componentMapping).forEach(([controlKey, componentNames]) => {
              if (componentNames.includes(child.name)) {
                componentRefsInternal.current.set(controlKey, child)
                
                // Mark this component as mapped for later identification
                child.userData.isMappedComponent = true
                
                // Store original position
                child.userData.originalPosition = {
                  x: child.position.x,
                  y: child.position.y,
                  z: child.position.z
                }
                
              }
            })
          }
        })
        
        // Find the correct parent containers for group movement
        // Find Lower Side Main parent container
        let lowerSideMainParent: THREE.Object3D | null = null
        model.traverse((child) => {
          if (child.name && child.name.includes('Lower_Side_Main')) {
            // Check if this object has many child components
            if (child.children.length > 5) {
              lowerSideMainParent = child
            } else {
              // Look for parent that contains this and other lower side components
              let parent = child.parent
              while (parent && parent !== model) {
                const lowerSideChildren = parent.children.filter(c => 
                  c.name && (c.name.includes('Lower') || c.name.includes('Product6') || 
                            c.name.includes('Part1') || c.name.includes('Part2') || 
                            c.name.includes('MicroGearmotor1_1') || c.name.includes('Handle_up_cover'))
                )
                
                if (lowerSideChildren.length > 10) {
                  lowerSideMainParent = parent
                  break
                }
                parent = parent.parent
              }
            }
          }
        })
        
        // Find Upper Side Main Holder parent container
        let upperSideMainParent: THREE.Object3D | null = null
        model.traverse((child) => {
          if (child.name && child.name.includes('Upper_side_main_holder')) {
            // Check if this object has many child components
            if (child.children.length > 5) {
              upperSideMainParent = child
            } else {
              // Look for parent that contains this and other upper side components
              let parent = child.parent
              while (parent && parent !== model) {
                const upperSideChildren = parent.children.filter(c => 
                  c.name && (c.name.includes('Upper') || c.name.includes('Product1') || 
                            c.name.includes('Product2') || c.name.includes('Color_Sensor') ||
                            c.name.includes('OLED_Display') || c.name.includes('Upper_cover'))
                )
                
                if (upperSideChildren.length > 10) {
                  upperSideMainParent = parent
                  break
                }
                parent = parent.parent
              }
            }
          }
        })
        
        // Use the found parent containers
        if (lowerSideMainParent) {
          componentRefsInternal.current.set('lowerSideMain', lowerSideMainParent)
          const lowerName = (lowerSideMainParent as THREE.Object3D).name || 'unnamed'
        }
        
        if (upperSideMainParent) {
          componentRefsInternal.current.set('upperSideMainHolder', upperSideMainParent)
          const upperName = (upperSideMainParent as THREE.Object3D).name || 'unnamed'
        }

        // Fallback mapping for components that might not have exact matches
        const fallbackMapping: { [key: string]: string[] } = {
          microGearmotor: ['motor', 'gear', 'micro', 'MicroGearmotor'],
          gearMotorPCB: ['pcb', 'board', 'circuit', 'Gear_motor_PCB'],
          motorHolder: ['holder', 'mount', 'Motor_holder'],
          holderSupport: ['support', 'bracket', 'Holder_support'],
          coupling: ['coupling', 'connector', 'Coupling'],
          m5Screw: ['screw', 'bolt', 'm5', 'M5_Screw'],
          movingPlate: ['plate', 'moving', 'Movin_Plate'],
          siliconSupport: ['silicon', 'rubber', 'Mobin_silicon_support'],
          nozzle: ['nozzle', 'tip', 'spray', 'Nuzzle'],
          nozzleBlinder: ['blinder', 'cover', 'cap', 'Nuzzel_blinder'],
          upperSideMainHolder: ['upper', 'main', 'holder', 'Upper_side_main_holder'],
          lowerSideMain: ['lower', 'main', 'base', 'Lower_Side_Main'],
          upperCover: ['cover', 'top', 'upper', 'Upper_cover'],
          loadingMaterialCover: ['loading', 'material', 'cover', 'Loading_Material_Cover'],
          colorSensorPCB: ['color', 'sensor', 'pcb', 'Color_Sensor_PCB'],
          sts8dn3llh5: ['sts8', 'sensor', 'STS8DN3LLH5'],
          oledDisplay: ['oled', 'display', 'screen', 'OLED_Display'],
          detectorSwitch: ['detector', 'switch', 'button', 'Detector_Switch'],
          slideSwitch: ['slide', 'switch', 'Slide_Switch'],
          everlightLEDs: ['led', 'light', 'everlight', 'User_Library-Everlight'],
          sensorGuideLight: ['guide', 'light', 'sensor', 'Sensor_Guide_Light'],
          knobs: ['knob', 'dial', 'control', 'Knobs'],
          drainButtonActuator: ['drain', 'button', 'actuator', 'Drain_Button_Actuator'],
          handleUpCover: ['handle', 'cover', 'Handle_up_cover'],
          hairGuideSupport: ['hair', 'guide', 'support', 'Hair_guide_Support'],
          skqyafComponents: ['skqyaf', 'support', 'SKQYAF'],
          productComponents: ['product', 'Product'],
          genericParts: ['part', 'Part'],
          importedComponents: ['imported', 'Imported']
        }
        
        // Try fallback mapping for unmapped components
        if (model) {
          Object.entries(fallbackMapping).forEach(([controlKey, keywords]) => {
            if (!componentRefsInternal.current.has(controlKey)) {
              model.traverse((child) => {
                if (child.name && keywords.some(keyword => child.name.toLowerCase().includes(keyword.toLowerCase()))) {
                  componentRefsInternal.current.set(controlKey, child)
                }
              })
            }
          })
        }
        

        // Add model to scene
        scene.add(model)
        updateProgress(1)

        // Don't call onComplete here - wait for textures to load
        // onComplete will be called when both model AND textures are ready
      },
      (progress) => {
        if (progress.total) {
          const loadedPercent = progress.loaded / progress.total
          updateProgress(loadedPercent)
          console.log(`Loading progress: ${(loadedPercent * 100).toFixed(2)}%`)
        }
      },
      (error) => {
        console.error('❌ Error loading model:', error)
      }
    )
  }, [scene, modelControls, onProgress, onComplete, modelRef, isModelLoadedRef])

  return null
}
