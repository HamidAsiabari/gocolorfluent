'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { StageConfig, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config } from './StageConfig'
import { ComponentControls, CategoryVisibility, categoryComponentMap } from '../DevControls/sections/product3d/types'

interface ThreeSceneManagerProps {
  mountRef: React.RefObject<HTMLDivElement>
  modelControls: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  }
  cameraControls: {
    position: { x: number; y: number; z: number }
    fov: number
  }
  lightingControls: {
    ambientIntensity: number
    ambientColor: string
    directionalIntensity: number
    directionalColor: string
    directionalPosition: { x: number; y: number; z: number }
    directionalTarget: { x: number; y: number; z: number }
    pointLightIntensity: number
    pointLightColor: string
    pointLightPosition: { x: number; y: number; z: number }
    pointLightDistance: number
    spotLightIntensity: number
    spotLightColor: string
    spotLightPosition: { x: number; y: number; z: number }
    spotLightTarget: { x: number; y: number; z: number }
    spotLightDistance: number
    spotLightAngle: number
    spotLightPenumbra: number
    shadowsEnabled: boolean
    shadowMapSize: number
    shadowBias: number
  }
  isAnimating: boolean
  animationProgress: number
  is3DAnimating: boolean
  stage3DAnimationProgress: number
  current3DStage: number
  getAnimatedValues: () => {
    model: { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; scale: { x: number; y: number; z: number } }
    camera: { position: { x: number; y: number; z: number }; fov: number }
    lighting: any
  }
  componentControls: ComponentControls
  categoryVisibility: CategoryVisibility
  onComponentControlsChange?: (controls: ComponentControls) => void
  onAnimationFunctionsReady?: (functions: { stage8OpenAnimation: () => void; stage8CloseAnimation: () => void }) => void
}

export default function ThreeSceneManager({
  mountRef,
  modelControls,
  cameraControls,
  lightingControls,
  isAnimating,
  animationProgress,
  is3DAnimating,
  stage3DAnimationProgress,
  current3DStage,
  getAnimatedValues,
  componentControls,
  categoryVisibility,
  onComponentControlsChange,
  onAnimationFunctionsReady
}: ThreeSceneManagerProps) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null)
  const pointLightRef = useRef<THREE.PointLight | null>(null)
  const componentRefs = useRef<Map<string, THREE.Object3D>>(new Map())
  const spotLightRef = useRef<THREE.SpotLight | null>(null)
  const textureLoader = useRef<THREE.TextureLoader | null>(null)
  const upperCoverRef = useRef<THREE.Object3D | null>(null)
  const upperCoverOriginalPosition = useRef<THREE.Vector3 | null>(null)
  const stage8OpenAnimationRef = useRef<number | null>(null)
  const stage8CloseAnimationRef = useRef<number | null>(null)
  const oledTextureRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(cameraControls.fov, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    // Store refs
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    
    // Initialize texture loader
    textureLoader.current = new THREE.TextureLoader()
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x1a1a1a)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    mountRef.current.appendChild(renderer.domElement)

    // Add lighting
    const ambientLight = new THREE.AmbientLight(lightingControls.ambientColor, lightingControls.ambientIntensity)
    const directionalLight = new THREE.DirectionalLight(lightingControls.directionalColor, lightingControls.directionalIntensity)
    const pointLight = new THREE.PointLight(lightingControls.pointLightColor, lightingControls.pointLightIntensity, lightingControls.pointLightDistance)
    const spotLight = new THREE.SpotLight(lightingControls.spotLightColor, lightingControls.spotLightIntensity, lightingControls.spotLightDistance, lightingControls.spotLightAngle * Math.PI / 180, lightingControls.spotLightPenumbra)
    
    // Configure directional light
    directionalLight.position.set(lightingControls.directionalPosition.x, lightingControls.directionalPosition.y, lightingControls.directionalPosition.z)
    directionalLight.target.position.set(lightingControls.directionalTarget.x, lightingControls.directionalTarget.y, lightingControls.directionalTarget.z)
    directionalLight.castShadow = lightingControls.shadowsEnabled
    directionalLight.shadow.mapSize.width = lightingControls.shadowMapSize
    directionalLight.shadow.mapSize.height = lightingControls.shadowMapSize
    directionalLight.shadow.bias = lightingControls.shadowBias
    
    // Configure point light
    pointLight.position.set(lightingControls.pointLightPosition.x, lightingControls.pointLightPosition.y, lightingControls.pointLightPosition.z)
    pointLight.castShadow = lightingControls.shadowsEnabled
    
    // Configure spot light
    spotLight.position.set(lightingControls.spotLightPosition.x, lightingControls.spotLightPosition.y, lightingControls.spotLightPosition.z)
    spotLight.target.position.set(lightingControls.spotLightTarget.x, lightingControls.spotLightTarget.y, lightingControls.spotLightTarget.z)
    spotLight.castShadow = lightingControls.shadowsEnabled
    
    // Store light refs
    ambientLightRef.current = ambientLight
    directionalLightRef.current = directionalLight
    pointLightRef.current = pointLight
    spotLightRef.current = spotLight
    
    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)
    scene.add(spotLight)
    scene.add(directionalLight.target)
    scene.add(spotLight.target)

    // Load the GLB model
    const loader = new GLTFLoader()
    let model: THREE.Group | null = null

    loader.load('/product-3d/Color_Brush_assembly_V1_1.glb', (gltf) => {
      model = gltf.scene
      modelRef.current = model
      
      // Analyze the 3D object structure
      // console.log('=== 3D Object Analysis ===')
      // console.log('Model name:', model.name)
      // console.log('Model children count:', model.children.length)
      // console.log('Model type:', model.type)
      
      // Log all children and their hierarchy (reduced verbosity)
      let childIndex = 0
      const totalChildren = model.children.length
      // console.log(`📊 Model has ${totalChildren} top-level children`)
      
      model.traverse((child) => {
        // if (childIndex < 5) { // Only log first 5 children to reduce console spam
        //   console.log(`Child ${childIndex}:`, {
        //     name: child.name,
        //     type: child.type,
        //     position: child.position,
        //     rotation: child.rotation,
        //     scale: child.scale,
        //     userData: child.userData,
        //     isMesh: child instanceof THREE.Mesh,
        //     isGroup: child instanceof THREE.Group,
        //     isBone: child instanceof THREE.Bone,
        //     isObject3D: child instanceof THREE.Object3D
        //   })
        // }
        childIndex++
      })
      
      // if (totalChildren > 5) {
      //   console.log(`... and ${totalChildren - 5} more children (use dev tools to inspect full hierarchy)`)
      // }

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
      // console.log('=== Component Mapping Debug ===')
      const foundComponents: string[] = []
      
      model.traverse((child) => {
        if (child.name) {
          foundComponents.push(child.name)
          // Only log important components to reduce console spam
          if (child.name.includes('Upper_cover') || child.name.includes('Lower_Side_Main') || child.name.includes('OLED_Display')) {
            // console.log(`Found important component: "${child.name}" (Type: ${child.type})`)
          }
          
          // Special debugging for Lower Side Main hierarchy (reduced verbosity)
          if (child.name.includes('Lower_Side_Main')) {
            // console.log(`🔍 Lower Side Main found: "${child.name}" with ${child.children.length} children`)
          }
          
          Object.entries(componentMapping).forEach(([controlKey, componentNames]) => {
            if (componentNames.includes(child.name)) {
              componentRefs.current.set(controlKey, child)
              
                // Mark this component as mapped for later identification
                child.userData.isMappedComponent = true
                
                // Store original position for animation
                child.userData.originalPosition = {
                  x: child.position.x,
                  y: child.position.y,
                  z: child.position.z
                }
                
                // console.log(`✅ Mapped component: ${controlKey} -> "${child.name}"`)
                
                // Store Upper Cover reference for stage 8 animations
                if (controlKey === 'upperCover') {
                  upperCoverRef.current = child
                  upperCoverOriginalPosition.current = new THREE.Vector3(
                    child.position.x,
                    child.position.y,
                    child.position.z
                  )
                  // console.log(`🎯 Upper Cover reference stored for stage 8 animations`)
                }
            }
          })
        }
      })
      
      // Find the correct parent containers for group movement
      console.log(`🔍 Searching for proper parent containers for group movement`)
      
      // Find Lower Side Main parent container
      let lowerSideMainParent: THREE.Object3D | null = null
      model.traverse((child) => {
        if (child.name && child.name.includes('Lower_Side_Main')) {
          console.log(`🔍 Found Lower_Side_Main: "${child.name}"`)
          console.log(`📦 Direct children:`, child.children.map(c => c.name))
          
          // Check if this object has many child components
          if (child.children.length > 5) {
            lowerSideMainParent = child
            console.log(`✅ Using Lower_Side_Main as parent: "${child.name}" with ${child.children.length} children`)
          } else {
            // Look for parent that contains this and other lower side components
            let parent = child.parent
            while (parent && parent !== model) {
              const lowerSideChildren = parent.children.filter(c => 
                c.name && (c.name.includes('Lower') || c.name.includes('Product6') || 
                          c.name.includes('Part1') || c.name.includes('Part2') || 
                          c.name.includes('MicroGearmotor1_1') || c.name.includes('Handle_up_cover'))
              )
              console.log(`🔍 Checking parent "${parent.name}": ${lowerSideChildren.length} lower side children`)
              
              if (lowerSideChildren.length > 10) {
                lowerSideMainParent = parent
                console.log(`✅ Found Lower Side Main Parent: "${parent.name}" with ${lowerSideChildren.length} children`)
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
          console.log(`🔍 Found Upper_side_main_holder: "${child.name}"`)
          console.log(`📦 Direct children:`, child.children.map(c => c.name))
          
          // Check if this object has many child components
          if (child.children.length > 5) {
            upperSideMainParent = child
            console.log(`✅ Using Upper_side_main_holder as parent: "${child.name}" with ${child.children.length} children`)
          } else {
            // Look for parent that contains this and other upper side components
            let parent = child.parent
            while (parent && parent !== model) {
              const upperSideChildren = parent.children.filter(c => 
                c.name && (c.name.includes('Upper') || c.name.includes('Product1') || 
                          c.name.includes('Product2') || c.name.includes('Color_Sensor') ||
                          c.name.includes('OLED_Display') || c.name.includes('Upper_cover'))
              )
              console.log(`🔍 Checking parent "${parent.name}": ${upperSideChildren.length} upper side children`)
              
              if (upperSideChildren.length > 10) {
                upperSideMainParent = parent
                console.log(`✅ Found Upper Side Main Parent: "${parent.name}" with ${upperSideChildren.length} children`)
                break
              }
              parent = parent.parent
            }
          }
        }
      })
      
      // Use the found parent containers
      if (lowerSideMainParent) {
        componentRefs.current.set('lowerSideMain', lowerSideMainParent) 
        console.log(`✅ Mapped lowerSideMain to parent: "${(lowerSideMainParent as THREE.Object3D).name || 'unnamed'}"`)
      }
      
      if (upperSideMainParent) {
        componentRefs.current.set('upperSideMainHolder', upperSideMainParent)
        console.log(`✅ Mapped upperSideMainHolder to parent: "${(upperSideMainParent as THREE.Object3D).name || 'unnamed'}"`)
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
          if (!componentRefs.current.has(controlKey)) {
            model!.traverse((child) => {
              if (child.name && keywords.some(keyword => child.name.toLowerCase().includes(keyword.toLowerCase()))) {
                componentRefs.current.set(controlKey, child)
                console.log(`🔄 Fallback mapped component: ${controlKey} -> "${child.name}"`)
              }
            })
          }
        })
      }
      
      // console.log('=== All Found Components ===')
      // console.log(foundComponents)
      // console.log('=== Mapped Components ===')
      // console.log(Array.from(componentRefs.current.keys()))
      
      // Debug: Show which components are mapped vs which are in componentControls
      const mappedComponents = Array.from(componentRefs.current.keys())
      const controlComponents = Object.keys(componentControls)
      const unmappedControls = controlComponents.filter(key => !mappedComponents.includes(key))
      const unmappedRefs = mappedComponents.filter(key => !controlComponents.includes(key))
      
      // console.log('🔍 Component Mapping Analysis:')
      // console.log('📋 Components in controls:', controlComponents.length)
      // console.log('🎯 Components mapped to 3D objects:', mappedComponents.length)
      // console.log('❌ Controls without 3D mapping:', unmappedControls)
      // console.log('❌ 3D objects without controls:', unmappedRefs)
      
      if (unmappedControls.length > 0) {
        console.warn('⚠️ These component controls have no 3D object mapping and will not work:', unmappedControls)
      }
      
      // Debug: Find unmapped components
      const mappedComponentNames = new Set()
      Object.values(componentMapping).forEach(names => {
        names.forEach(name => mappedComponentNames.add(name))
      })
      
      const unmappedComponents = foundComponents.filter(name => !mappedComponentNames.has(name))
      if (unmappedComponents.length > 0) {
        // console.log(`ℹ️ Found ${unmappedComponents.length} unmapped components (these will always be visible)`)
        // Only log the first 10 unmapped components to reduce console spam
        // if (unmappedComponents.length <= 10) {
        //   console.log('Unmapped components:', unmappedComponents)
        // } else {
        //   console.log('First 10 unmapped components:', unmappedComponents.slice(0, 10))
        //   console.log(`... and ${unmappedComponents.length - 10} more`)
        // }
      } else {
        console.log('✅ All components are properly mapped to categories')
      }
      
      // Store original component states (don't apply any transformations initially)
      // console.log('=== Storing Original Component States ===')
      const originalStates = new Map<string, { position: THREE.Vector3, rotation: THREE.Euler, scale: THREE.Vector3, visible: boolean }>()
      
      Object.entries(componentControls).forEach(([componentKey, transform]) => {
        const component = componentRefs.current.get(componentKey)
        if (component) {
          // Store original state without applying any transformations
          originalStates.set(componentKey, {
            position: component.position.clone(),
            rotation: component.rotation.clone(),
            scale: component.scale.clone(),
            visible: component.visible
          })
          
          // console.log(`✅ Stored original state for ${componentKey}:`, {
          //   position: component.position,
          //   rotation: component.rotation,
          //   scale: component.scale,
          //   visible: component.visible,
          //   componentName: component.name,
          //   componentType: component.type
          // })
        } else {
          console.warn(`❌ Component not found for storing original state: ${componentKey}`)
        }
      })
      
      // Store original states in a ref for potential reset functionality
      componentRefs.current.set('_originalStates', originalStates as any)
      
      // Store original visibility for all unmapped objects
      console.log('💾 Storing original visibility for unmapped objects...')
      model.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent) {
          child.userData.originalVisibility = child.visible
        }
      })
      
      // Check for animations
      if (gltf.animations && gltf.animations.length > 0) {
        console.log('Found animations:', gltf.animations.length)
        gltf.animations.forEach((anim, index) => {
          console.log(`Animation ${index}:`, {
            name: anim.name,
            duration: anim.duration,
            tracks: anim.tracks.length,
            tracksInfo: anim.tracks.map(track => ({
              name: track.name,
              type: track.constructor.name,
              times: track.times.length
            }))
          })
        })
      } else {
        console.log('No animations found in the model')
      }
      
      // Enable shadows for the model
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Apply initial controls
      model.scale.set(modelControls.scale.x, modelControls.scale.y, modelControls.scale.z)
      model.position.set(modelControls.position.x, modelControls.position.y, modelControls.position.z)
      model.rotation.set(modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z)
      
      scene.add(model)

      // Set initial camera position
      camera.position.set(cameraControls.position.x, cameraControls.position.y, cameraControls.position.z)
      
      // Function to apply texture to OLED Display
      const applyOLEDTexture = (texturePath: string) => {
        if (!textureLoader.current) return
        
        textureLoader.current.load(texturePath, (texture) => {
          console.log('📸 Texture loaded successfully:', texturePath, texture)
          
          // Store texture reference for cleanup
          oledTextureRef.current = texture
          
          // Configure texture for OLED display
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.flipY = false
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          
          console.log('🔧 Texture configured:', {
            wrapS: texture.wrapS,
            wrapT: texture.wrapT,
            flipY: texture.flipY,
            minFilter: texture.minFilter,
            magFilter: texture.magFilter
          })
          
          // Find OLED Display components and apply texture
          const oledComponents = componentMapping.oledDisplay
          console.log('🔍 Looking for OLED components:', oledComponents)
          
          // Also search for any object with "OLED" or "Display" in the name as fallback
          const allOLEDObjects: THREE.Object3D[] = []
          if (modelRef.current) {
            modelRef.current.traverse((child) => {
              if (child.name && (child.name.toLowerCase().includes('oled') || child.name.toLowerCase().includes('display'))) {
                allOLEDObjects.push(child)
                console.log(`🔍 Found OLED-related object: ${child.name}`)
              }
            })
          }
          
          oledComponents.forEach(componentName => {
            const component = componentRefs.current.get(componentName)
            console.log(`🔍 Component ${componentName} found:`, component ? 'YES' : 'NO')
            
            if (component) {
              let meshCount = 0
              component.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  meshCount++
                  console.log(`📺 Found mesh in OLED: ${child.name}`, {
                    position: child.position,
                    rotation: child.rotation,
                    scale: child.scale,
                    materialType: child.material.type,
                    geometryType: child.geometry.type
                  })
                  
                  // Create a new material with the texture
                  const newMaterial = child.material.clone()
                  
                  if (Array.isArray(newMaterial)) {
                    newMaterial.forEach((mat, index) => {
                      if (mat instanceof THREE.MeshStandardMaterial) {
                        // Apply texture to the material
                        mat.map = texture
                        mat.emissive = new THREE.Color(0x000000) // Make it slightly emissive for screen effect
                        mat.emissiveMap = texture
                        mat.emissiveIntensity = 0.3
                        mat.needsUpdate = true
                        console.log(`✅ Applied texture to material array index ${index} for ${child.name}`)
                      }
                    })
                  } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                    // Apply texture to the material
                    newMaterial.map = texture
                    newMaterial.emissive = new THREE.Color(0x000000) // Make it slightly emissive for screen effect
                    newMaterial.emissiveMap = texture
                    newMaterial.emissiveIntensity = 0.3
                    newMaterial.needsUpdate = true
                    console.log(`✅ Applied texture to material for ${child.name}`)
                  }
                  
                  child.material = newMaterial
                }
              })
              console.log(`📊 Total meshes found in ${componentName}: ${meshCount}`)
            }
          })
          
          // If no meshes found in mapped components, try the fallback search
          if (allOLEDObjects.length > 0) {
            console.log('🔄 Trying fallback OLED search...')
            allOLEDObjects.forEach(obj => {
              obj.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  console.log(`📺 Found mesh in fallback OLED: ${child.name}`)
                  
                  const newMaterial = child.material.clone()
                  if (newMaterial instanceof THREE.MeshStandardMaterial) {
                    newMaterial.map = texture
                    newMaterial.emissive = new THREE.Color(0x000000)
                    newMaterial.emissiveMap = texture
                    newMaterial.emissiveIntensity = 0.3
                    newMaterial.needsUpdate = true
                    child.material = newMaterial
                    console.log(`✅ Applied texture to fallback OLED mesh: ${child.name}`)
                  }
                }
              })
            })
          }
          
          console.log('✅ OLED Display texture applied:', texturePath)
        }, undefined, (error) => {
          console.error('Error loading OLED texture:', error)
        })
      }
      
      // Function to remove OLED texture
      const removeOLEDTexture = () => {
        if (oledTextureRef.current) {
          oledTextureRef.current.dispose()
          oledTextureRef.current = null
        }
        
        // Reset OLED Display materials to original
        const oledComponents = componentMapping.oledDisplay
        oledComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          if (component) {
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.map = null
                      mat.emissiveMap = null
                      mat.emissive = new THREE.Color(0x000000)
                      mat.emissiveIntensity = 0
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  newMaterial.map = null
                  newMaterial.emissiveMap = null
                  newMaterial.emissive = new THREE.Color(0x000000)
                  newMaterial.emissiveIntensity = 0
                  newMaterial.needsUpdate = true
                }
                child.material = newMaterial
              }
            })
          }
        })
        
        console.log('✅ OLED Display texture removed')
      }
      
      // Store functions for use in other effects
      ;(window as any).applyOLEDTexture = applyOLEDTexture
      ;(window as any).removeOLEDTexture = removeOLEDTexture
      
    }, undefined, (error) => {
      console.error('Error loading GLB model:', error)
    })

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Render the scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      // Cleanup texture
      if (oledTextureRef.current) {
        oledTextureRef.current.dispose()
        oledTextureRef.current = null
      }
    }
  }, [])

  // Force updates when model controls change or during animation
  useEffect(() => {
    if (modelRef.current) {
      const animated = getAnimatedValues()
      modelRef.current.scale.set(animated.model.scale.x, animated.model.scale.y, animated.model.scale.z)
      modelRef.current.position.set(animated.model.position.x, animated.model.position.y, animated.model.position.z)
      modelRef.current.rotation.set(animated.model.rotation.x, animated.model.rotation.y, animated.model.rotation.z)
    }
  }, [modelControls, isAnimating, animationProgress, is3DAnimating, stage3DAnimationProgress, getAnimatedValues])

  // Force updates when camera controls change or during animation
  useEffect(() => {
    if (cameraRef.current) {
      const animated = getAnimatedValues()
      cameraRef.current.position.set(animated.camera.position.x, animated.camera.position.y, animated.camera.position.z)
      cameraRef.current.fov = animated.camera.fov
      cameraRef.current.updateProjectionMatrix()
    }
  }, [cameraControls, isAnimating, animationProgress, is3DAnimating, stage3DAnimationProgress, getAnimatedValues])

  // Force updates when lighting controls change or during animation
  useEffect(() => {
    const animated = getAnimatedValues()
    
    // Ambient light
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = animated.lighting.ambientIntensity
      ambientLightRef.current.color.setHex(parseInt(animated.lighting.ambientColor.replace('#', ''), 16))
    }
    
    // Directional light
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = animated.lighting.directionalIntensity
      directionalLightRef.current.color.setHex(parseInt(animated.lighting.directionalColor.replace('#', ''), 16))
      directionalLightRef.current.position.set(animated.lighting.directionalPosition.x, animated.lighting.directionalPosition.y, animated.lighting.directionalPosition.z)
      directionalLightRef.current.target.position.set(animated.lighting.directionalTarget.x, animated.lighting.directionalTarget.y, animated.lighting.directionalTarget.z)
      directionalLightRef.current.castShadow = animated.lighting.shadowsEnabled
      directionalLightRef.current.shadow.mapSize.width = animated.lighting.shadowMapSize
      directionalLightRef.current.shadow.mapSize.height = animated.lighting.shadowMapSize
      directionalLightRef.current.shadow.bias = animated.lighting.shadowBias
    }
    
    // Point light
    if (pointLightRef.current) {
      pointLightRef.current.intensity = animated.lighting.pointLightIntensity
      pointLightRef.current.color.setHex(parseInt(animated.lighting.pointLightColor.replace('#', ''), 16))
      pointLightRef.current.position.set(animated.lighting.pointLightPosition.x, animated.lighting.pointLightPosition.y, animated.lighting.pointLightPosition.z)
      pointLightRef.current.distance = animated.lighting.pointLightDistance
      pointLightRef.current.castShadow = animated.lighting.shadowsEnabled
    }
    
    // Spot light
    if (spotLightRef.current) {
      spotLightRef.current.intensity = animated.lighting.spotLightIntensity
      spotLightRef.current.color.setHex(parseInt(animated.lighting.spotLightColor.replace('#', ''), 16))
      spotLightRef.current.position.set(animated.lighting.spotLightPosition.x, animated.lighting.spotLightPosition.y, animated.lighting.spotLightPosition.z)
      spotLightRef.current.target.position.set(animated.lighting.spotLightTarget.x, animated.lighting.spotLightTarget.y, animated.lighting.spotLightTarget.z)
      spotLightRef.current.distance = animated.lighting.spotLightDistance
      spotLightRef.current.angle = animated.lighting.spotLightAngle * Math.PI / 180
      spotLightRef.current.penumbra = animated.lighting.spotLightPenumbra
      spotLightRef.current.castShadow = animated.lighting.shadowsEnabled
    }
  }, [lightingControls, isAnimating, animationProgress, is3DAnimating, stage3DAnimationProgress, getAnimatedValues])

  // Apply component transformations (only when user changes controls)
  useEffect(() => {
    // Only apply if model is loaded and components are mapped
    if (!modelRef.current || componentRefs.current.size === 0) {
      // console.log('⏳ Skipping component transformations - model not loaded yet')
      return
    }

    
    // console.log('=== Applying Component Transformations (User Changes) ===')
    // console.log('Component controls changed:', componentControls)
    // console.log('Available component refs:', Array.from(componentRefs.current.keys()))
    
    Object.entries(componentControls).forEach(([componentKey, transform]) => {
      const component = componentRefs.current.get(componentKey)
      if (component) {
        // Check if this is different from default values (excluding visibility)
        const isDefaultTransform = 
          transform.position.x === 0 && transform.position.y === 0 && transform.position.z === 0 &&
          transform.rotation.x === 0 && transform.rotation.y === 0 && transform.rotation.z === 0 &&
          transform.scale.x === 1 && transform.scale.y === 1 && transform.scale.z === 1
        
        // Apply visibility FIRST - this should always be applied regardless of other transforms
        const categoryKey = Object.keys(categoryComponentMap).find(cat => 
          categoryComponentMap[cat as keyof CategoryVisibility].includes(componentKey as keyof ComponentControls)
        ) as keyof CategoryVisibility
        
        // Debug: Check if component is found in category mapping
        if (!categoryKey) {
          console.warn(`⚠️ Component "${componentKey}" not found in any category! This component will always be visible.`)
        }
        
        const isCategoryVisible = categoryKey ? categoryVisibility[categoryKey] : true
        const finalVisibility = transform.visible && isCategoryVisible
        
        // Debug: Log visibility decisions
        if (!finalVisibility) {
          // console.log(`👁️ Hiding component "${componentKey}":`, {
            // componentVisible: transform.visible,
            // categoryKey: categoryKey || 'UNMAPPED',
            // categoryVisible: isCategoryVisible,
            // finalVisibility
          // })
        }
        
        component.visible = finalVisibility
        
        // Apply visibility to ALL child objects (not just meshes)
        component.traverse((child) => {
          child.visible = finalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        })
        
        // Only apply position, rotation, and scale if they're not default values
        if (!isDefaultTransform) {
          // console.log(`🔄 Applying non-default transforms to ${componentKey}`)
          
          // Apply position
          component.position.set(transform.position.x, transform.position.y, transform.position.z)
          
          // Apply rotation
          component.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z)
          
          // Apply scale
          component.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
          
          // Force matrix update
          component.updateMatrix()
          component.updateMatrixWorld(true)
        } else {
          // console.log(`⏭️ Skipping position/rotation/scale for ${componentKey} - using default values`)
        }
        
        // console.log(`✅ Applied visibility update to ${componentKey}:`, {
        //   position: transform.position,
        //   rotation: transform.rotation,
        //   scale: transform.scale,
        //   visible: transform.visible,
        //   categoryVisible: isCategoryVisible,
        //   finalVisibility: finalVisibility,
        //   componentName: component.name,
        //   componentType: component.type,
        //   actualVisible: component.visible
        // })
      } else {
        console.warn(`❌ Component not found for update: ${componentKey}`)
      }
    })
    
    // Debug: Summary of visible components when all categories are hidden
    const allCategoriesHidden = Object.values(categoryVisibility).every(visible => !visible)
    
    // If not all categories are hidden, restore original visibility of unmapped objects
    if (!allCategoriesHidden && modelRef.current) {
      // console.log('🔧 Restoring original visibility of unmapped objects...')
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent && child.userData.originalVisibility !== undefined) {
          child.visible = child.userData.originalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    }
    
    if (allCategoriesHidden) {
      // console.log('🔍 DEBUG: All categories are hidden, checking which components are still visible...')
      
      // Check our mapped components
      const stillVisibleComponents = Object.entries(componentControls)
        .filter(([key, transform]) => {
          const component = componentRefs.current.get(key)
          return component && component.visible
        })
        .map(([key, transform]) => key)
      
      if (stillVisibleComponents.length > 0) {
        console.warn(`⚠️ These mapped components are still visible when all categories are hidden:`, stillVisibleComponents)
      } else {
        // console.log('✅ All mapped components are properly hidden when all categories are disabled')
      }
      
      // Check ALL objects in the 3D model for visibility
      if (modelRef.current) {
        // console.log('🔍 Checking ALL objects in the 3D model for visibility...')
        const allVisibleObjects: string[] = []
        
        modelRef.current.traverse((child) => {
          if (child.visible && child.name) {
            allVisibleObjects.push(child.name)
          }
        })
        
        if (allVisibleObjects.length > 0) {
          console.warn(`⚠️ These 3D model objects are still visible when all categories are hidden:`, allVisibleObjects)
          
          // Hide all unmapped objects when all categories are hidden
          // console.log('🔧 Hiding all unmapped objects...')
          modelRef.current.traverse((child) => {
            if (child.name && !child.userData.isMappedComponent) {
              // Store original visibility if not already stored
              if (child.userData.originalVisibility === undefined) {
                child.userData.originalVisibility = child.visible
              }
              child.visible = false
              child.updateMatrix()
              child.updateMatrixWorld(true)
            }
          })
        } else {
          // console.log('✅ No 3D model objects are visible when all categories are disabled')
        }
      }
    }
  }, [componentControls, categoryVisibility])



  // Apply visibility changes in Stage 4 (separate from position animation)
  useEffect(() => {
    if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) return

    // console.log('Applying visibility changes in Stage 4...')

    // Apply individual component visibility
    Object.entries(componentControls).forEach(([componentKey, transform]) => {
      const component = componentRefs.current.get(componentKey)
      if (component) {
        // Apply visibility FIRST - this should always be applied regardless of other transforms
        const categoryKey = Object.keys(categoryComponentMap).find(cat => 
          categoryComponentMap[cat as keyof CategoryVisibility].includes(componentKey as keyof ComponentControls)
        ) as keyof CategoryVisibility
        
        const isCategoryVisible = categoryKey ? categoryVisibility[categoryKey] : true
        const finalVisibility = transform.visible && isCategoryVisible
        
        // console.log(`👁️ Stage 4 visibility: ${componentKey} (transform.visible: ${transform.visible}, isCategoryVisible: ${isCategoryVisible}, finalVisibility: ${finalVisibility})`)
        
        // Apply visibility to ALL child objects (not just meshes)
        component.traverse((child) => {
          child.visible = finalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        })
      }
    })
    
    // Handle category visibility for unmapped objects
    const allCategoriesHidden = Object.values(categoryVisibility).every(visible => !visible)
    if (allCategoriesHidden && modelRef.current) {
      // console.log('🔧 All categories hidden - hiding unmapped objects...')
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent) {
          // Store original visibility if not already stored
          if (child.userData.originalVisibility === undefined) {
            child.userData.originalVisibility = child.visible
          }
          child.visible = false
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    } else if (!allCategoriesHidden && modelRef.current) {
      // console.log('🔧 Some categories visible - restoring unmapped objects...')
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent && child.userData.originalVisibility !== undefined) {
          child.visible = child.userData.originalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    }
  }, [current3DStage, componentControls, categoryVisibility])





  // Stage 8 Upper Cover Animation Functions
  const stage8OpenAnimation = useCallback(() => {
    if (!upperCoverRef.current || !upperCoverOriginalPosition.current) {
      console.warn('⚠️ Upper Cover not found for stage-8-open-animation')
      return
    }

    // console.log('🎬 Starting stage-8-open-animation: Moving Upper Cover Z to 70')
    
    const startTime = Date.now()
    const duration = 1500 // 1.5 seconds
    const startZ = upperCoverRef.current.position.z
    const targetZ = 70

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }
      
      const easedProgress = easeInOutCubic(progress)
      const currentZ = startZ + (targetZ - startZ) * easedProgress
      
      upperCoverRef.current!.position.z = currentZ
      upperCoverRef.current!.updateMatrix()
      upperCoverRef.current!.updateMatrixWorld(true)
      
      if (progress < 1) {
        stage8OpenAnimationRef.current = requestAnimationFrame(animate)
      } else {
        // console.log('✅ stage-8-open-animation complete: Upper Cover Z = 70')
        stage8OpenAnimationRef.current = null
      }
    }
    
    stage8OpenAnimationRef.current = requestAnimationFrame(animate)
  }, [])

  const stage8CloseAnimation = useCallback(() => {
    if (!upperCoverRef.current || !upperCoverOriginalPosition.current) {
      console.warn('⚠️ Upper Cover not found for stage-8-close-animation')
      return
    }

    // console.log('🎬 Starting stage-8-close-animation: Moving Upper Cover Z to 0')
    
    const startTime = Date.now()
    const duration = 500 // 0.5 seconds
    const startZ = upperCoverRef.current.position.z
    const targetZ = upperCoverOriginalPosition.current.z

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }
      
      const easedProgress = easeInOutCubic(progress)
      const currentZ = startZ + (targetZ - startZ) * easedProgress
      
      upperCoverRef.current!.position.z = currentZ
      upperCoverRef.current!.updateMatrix()
      upperCoverRef.current!.updateMatrixWorld(true)
      
      if (progress < 1) {
        stage8CloseAnimationRef.current = requestAnimationFrame(animate)
      } else {
        // console.log('✅ stage-8-close-animation complete: Upper Cover Z = 0')
        stage8CloseAnimationRef.current = null
      }
    }
    
    stage8CloseAnimationRef.current = requestAnimationFrame(animate)
  }, [])

  // Store animation functions in a ref for external access
  const animationFunctionsRef = useRef({
    stage8OpenAnimation,
    stage8CloseAnimation
  })

  // Update the ref when functions change and notify parent
  useEffect(() => {
    animationFunctionsRef.current = {
      stage8OpenAnimation,
      stage8CloseAnimation
    }
    
    // Notify parent component that animation functions are ready
    if (onAnimationFunctionsReady) {
      onAnimationFunctionsReady({
        stage8OpenAnimation,
        stage8CloseAnimation
      })
    }
  }, [onAnimationFunctionsReady, stage8OpenAnimation, stage8CloseAnimation])

  // Apply OLED Display texture in Stage 5
  useEffect(() => {
    if (current3DStage === 5) {
      // console.log('🎬 Stage 5: Applying OLED Display texture...')
      // Try PNG first, then fallback to GIF
      if ((window as any).applyOLEDTexture) {
        (window as any).applyOLEDTexture('/screen.png')
      }
    } else if (current3DStage !== 5 && oledTextureRef.current) {
      // console.log('🎬 Leaving Stage 5: Removing OLED Display texture...')
      // Remove the texture when leaving Stage 5
      if ((window as any).removeOLEDTexture) {
        (window as any).removeOLEDTexture()
      }
    }
  }, [current3DStage])

  // Stage 8 Upper Cover Animations
  useEffect(() => {
    if (current3DStage === 8) {
      // console.log('🎬 Stage 8: Starting stage-8-open-animation')
      // Cancel any existing close animation
      if (stage8CloseAnimationRef.current) {
        cancelAnimationFrame(stage8CloseAnimationRef.current)
        stage8CloseAnimationRef.current = null
      }
      // Start open animation
      stage8OpenAnimation()
    } else if (current3DStage !== 8 && upperCoverRef.current) {
      // console.log('🎬 Leaving Stage 8: Starting stage-8-close-animation')
      // Cancel any existing open animation
      if (stage8OpenAnimationRef.current) {
        cancelAnimationFrame(stage8OpenAnimationRef.current)
        stage8OpenAnimationRef.current = null
      }
      // Start close animation
      stage8CloseAnimation()
    }
  }, [current3DStage])

  return null // This component doesn't render anything directly
}
