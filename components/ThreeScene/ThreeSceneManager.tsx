'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { StageConfig, stage1Config, stage2Config, stage3Config, stage4Config } from './StageConfig'
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
  isComponentAnimating?: boolean
  componentAnimationProgress?: number
  isComponentUnexploding?: boolean
  componentUnexplodeProgress?: number
  onComponentControlsChange?: (controls: ComponentControls) => void
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
  isComponentAnimating = false,
  componentAnimationProgress = 0,
  isComponentUnexploding = false,
  componentUnexplodeProgress = 0,
  onComponentControlsChange
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
      console.log('=== 3D Object Analysis ===')
      console.log('Model name:', model.name)
      console.log('Model children count:', model.children.length)
      console.log('Model type:', model.type)
      
      // Log all children and their hierarchy
      let childIndex = 0
      model.traverse((child) => {
        console.log(`Child ${childIndex}:`, {
          name: child.name,
          type: child.type,
          position: child.position,
          rotation: child.rotation,
          scale: child.scale,
          userData: child.userData,
          isMesh: child instanceof THREE.Mesh,
          isGroup: child instanceof THREE.Group,
          isBone: child instanceof THREE.Bone,
          isObject3D: child instanceof THREE.Object3D
        })
        childIndex++
      })

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
      console.log('=== Component Mapping Debug ===')
      const foundComponents: string[] = []
      
      model.traverse((child) => {
        if (child.name) {
          foundComponents.push(child.name)
          console.log(`Found component: "${child.name}" (Type: ${child.type})`)
          
          // Special debugging for Lower Side Main hierarchy
          if (child.name.includes('Lower') || child.name.includes('lower')) {
            console.log(`🔍 Lower Side Debug - "${child.name}":`, {
              type: child.type,
              children: child.children.length,
              parent: child.parent?.name || 'No parent',
              position: child.position,
              rotation: child.rotation,
              scale: child.scale
            })
            
            // Log all children of Lower Side Main objects
            if (child.name.includes('Lower_Side_Main')) {
              console.log(`📦 Children of ${child.name}:`, child.children.map(c => c.name))
            }
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
                
                console.log(`✅ Mapped component: ${controlKey} -> "${child.name}"`)
            }
          })
        }
      })
      
      // Find the correct parent containers for group movement
      console.log(`🔍 Searching for proper parent containers for group movement`)
      
      // Find Lower Side Main parent container
      let lowerSideMainParent = null
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
      let upperSideMainParent = null
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
        console.log(`✅ Mapped lowerSideMain to parent: "${lowerSideMainParent.name}"`)
      }
      
      if (upperSideMainParent) {
        componentRefs.current.set('upperSideMainHolder', upperSideMainParent)
        console.log(`✅ Mapped upperSideMainHolder to parent: "${upperSideMainParent.name}"`)
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
      Object.entries(fallbackMapping).forEach(([controlKey, keywords]) => {
        if (!componentRefs.current.has(controlKey)) {
          model.traverse((child) => {
            if (child.name && keywords.some(keyword => child.name.toLowerCase().includes(keyword.toLowerCase()))) {
              componentRefs.current.set(controlKey, child)
              console.log(`🔄 Fallback mapped component: ${controlKey} -> "${child.name}"`)
            }
          })
        }
      })
      
      console.log('=== All Found Components ===')
      console.log(foundComponents)
      console.log('=== Mapped Components ===')
      console.log(Array.from(componentRefs.current.keys()))
      
      // Debug: Show which components are mapped vs which are in componentControls
      const mappedComponents = Array.from(componentRefs.current.keys())
      const controlComponents = Object.keys(componentControls)
      const unmappedControls = controlComponents.filter(key => !mappedComponents.includes(key))
      const unmappedRefs = mappedComponents.filter(key => !controlComponents.includes(key))
      
      console.log('🔍 Component Mapping Analysis:')
      console.log('📋 Components in controls:', controlComponents.length)
      console.log('🎯 Components mapped to 3D objects:', mappedComponents.length)
      console.log('❌ Controls without 3D mapping:', unmappedControls)
      console.log('❌ 3D objects without controls:', unmappedRefs)
      
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
        console.warn('⚠️ UNMAPPED COMPONENTS (these will always be visible):', unmappedComponents)
      } else {
        console.log('✅ All components are properly mapped to categories')
      }
      
      // Store original component states (don't apply any transformations initially)
      console.log('=== Storing Original Component States ===')
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
          
          console.log(`✅ Stored original state for ${componentKey}:`, {
            position: component.position,
            rotation: component.rotation,
            scale: component.scale,
            visible: component.visible,
            componentName: component.name,
            componentType: component.type
          })
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
      console.log('⏳ Skipping component transformations - model not loaded yet')
      return
    }

    // In Stage 4, allow position changes for exploded components only
    if (current3DStage === 4) {
      console.log('⏳ Stage 4 active - applying changes to exploded components only')
      
      // Only apply changes to exploded components in Stage 4
      const explodedComponents = ['upperSideMainHolder', 'lowerSideMain', 'upperCover']
      
      Object.entries(componentControls).forEach(([componentKey, transform]) => {
        const component = componentRefs.current.get(componentKey)
        if (component) {
          // Apply position, rotation, scale changes for exploded components
          const isDefaultTransform = 
            transform.position.x === 0 && transform.position.y === 0 && transform.position.z === 0 &&
            transform.rotation.x === 0 && transform.rotation.y === 0 && transform.rotation.z === 0 &&
            transform.scale.x === 1 && transform.scale.y === 1 && transform.scale.z === 1
          
          if (!isDefaultTransform) {
            component.position.set(transform.position.x, transform.position.y, transform.position.z)
            component.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z)
            component.scale.set(transform.scale.x, transform.scale.y, transform.scale.z)
            
            component.updateMatrix()
            component.updateMatrixWorld(true)
            
            console.log(`✅ Applied ${componentKey} transform:`, transform)
          }
        }
      })
      
      return
    }
    
    console.log('=== Applying Component Transformations (User Changes) ===')
    console.log('Component controls changed:', componentControls)
    console.log('Available component refs:', Array.from(componentRefs.current.keys()))
    
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
          console.log(`👁️ Hiding component "${componentKey}":`, {
            componentVisible: transform.visible,
            categoryKey: categoryKey || 'UNMAPPED',
            categoryVisible: isCategoryVisible,
            finalVisibility
          })
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
          console.log(`🔄 Applying non-default transforms to ${componentKey}`)
          
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
          console.log(`⏭️ Skipping position/rotation/scale for ${componentKey} - using default values`)
        }
        
        console.log(`✅ Applied visibility update to ${componentKey}:`, {
          position: transform.position,
          rotation: transform.rotation,
          scale: transform.scale,
          visible: transform.visible,
          categoryVisible: isCategoryVisible,
          finalVisibility: finalVisibility,
          componentName: component.name,
          componentType: component.type,
          actualVisible: component.visible
        })
      } else {
        console.warn(`❌ Component not found for update: ${componentKey}`)
      }
    })
    
    // Debug: Summary of visible components when all categories are hidden
    const allCategoriesHidden = Object.values(categoryVisibility).every(visible => !visible)
    
    // If not all categories are hidden, restore original visibility of unmapped objects
    if (!allCategoriesHidden && modelRef.current) {
      console.log('🔧 Restoring original visibility of unmapped objects...')
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent && child.userData.originalVisibility !== undefined) {
          child.visible = child.userData.originalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    }
    
    if (allCategoriesHidden) {
      console.log('🔍 DEBUG: All categories are hidden, checking which components are still visible...')
      
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
        console.log('✅ All mapped components are properly hidden when all categories are disabled')
      }
      
      // Check ALL objects in the 3D model for visibility
      if (modelRef.current) {
        console.log('🔍 Checking ALL objects in the 3D model for visibility...')
        const allVisibleObjects: string[] = []
        
        modelRef.current.traverse((child) => {
          if (child.visible && child.name) {
            allVisibleObjects.push(child.name)
          }
        })
        
        if (allVisibleObjects.length > 0) {
          console.warn(`⚠️ These 3D model objects are still visible when all categories are hidden:`, allVisibleObjects)
          
          // Hide all unmapped objects when all categories are hidden
          console.log('🔧 Hiding all unmapped objects...')
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
          console.log('✅ No 3D model objects are visible when all categories are disabled')
        }
      }
    }
  }, [componentControls, categoryVisibility])

  // Component animation for Stage 4 explosion - one time only
  useEffect(() => {
    if (!isComponentAnimating || !modelRef.current || current3DStage !== 4) return

    console.log('Animating components to exploded positions, progress:', componentAnimationProgress)

    // Define the exploded positions for Stage 4
    const explodedPositions = {
      upperSideMainHolder: { x: 0, y: 0, z: 80 },
      lowerSideMain: { x: 0, y: 0, z: -80 },
      upperCover: { x: 0, y: 0, z: 80 }
    }

    // Animate each component to its exploded position
    Object.entries(explodedPositions).forEach(([componentKey, targetPosition]) => {
      const component = componentRefs.current.get(componentKey)
      if (component) {
        // Interpolate between original position and exploded position
        const originalPos = component.userData.originalPosition || { x: 0, y: 0, z: 0 }
        
        component.position.x = originalPos.x + (targetPosition.x - originalPos.x) * componentAnimationProgress
        component.position.y = originalPos.y + (targetPosition.y - originalPos.y) * componentAnimationProgress
        component.position.z = originalPos.z + (targetPosition.z - originalPos.z) * componentAnimationProgress
        
        component.updateMatrix()
        component.updateMatrixWorld(true)
        
        console.log(`Animated ${componentKey} to:`, component.position)
      }
    })

    // When animation is complete, set final positions and stop animation
    if (componentAnimationProgress >= 1) {
      console.log('Component animation complete - setting final positions')
      Object.entries(explodedPositions).forEach(([componentKey, targetPosition]) => {
        const component = componentRefs.current.get(componentKey)
        if (component) {
          component.position.x = targetPosition.x
          component.position.y = targetPosition.y
          component.position.z = targetPosition.z
          component.updateMatrix()
          component.updateMatrixWorld(true)
          
          // Mark as animated to prevent re-animation
          component.userData.hasBeenAnimated = true
        }
      })
      
      // Immediately update component controls with final positions
      if (onComponentControlsChange) {
        console.log('Updating component controls with final exploded positions...')
        const updatedControls = { ...componentControls }
        
        Object.entries(explodedPositions).forEach(([componentKey, targetPosition]) => {
          const component = componentRefs.current.get(componentKey)
          if (component) {
            updatedControls[componentKey as keyof ComponentControls] = {
              position: {
                x: parseFloat(targetPosition.x.toFixed(3)),
                y: parseFloat(targetPosition.y.toFixed(3)),
                z: parseFloat(targetPosition.z.toFixed(3))
              },
              rotation: {
                x: parseFloat(component.rotation.x.toFixed(3)),
                y: parseFloat(component.rotation.y.toFixed(3)),
                z: parseFloat(component.rotation.z.toFixed(3))
              },
              scale: {
                x: parseFloat(component.scale.x.toFixed(3)),
                y: parseFloat(component.scale.y.toFixed(3)),
                z: parseFloat(component.scale.z.toFixed(3))
              },
              visible: updatedControls[componentKey as keyof ComponentControls]?.visible ?? true
            }
            
            console.log(`Final position update ${componentKey}:`, updatedControls[componentKey as keyof ComponentControls])
          }
        })
        
        onComponentControlsChange(updatedControls)
      }
    }
  }, [isComponentAnimating, componentAnimationProgress, current3DStage])

  // Component un-explode animation for Stage 4 to Stage 3 transition
  useEffect(() => {
    if (!isComponentUnexploding || !modelRef.current || current3DStage !== 4) return

    console.log('Animating components back to original positions, progress:', componentUnexplodeProgress)

    // Define the exploded positions (starting points for un-explode)
    const explodedPositions = {
      upperSideMainHolder: { x: 0, y: 0, z: 80 },
      lowerSideMain: { x: 0, y: 0, z: -80 },
      upperCover: { x: 0, y: 0, z: 80 }
    }

    // Animate each component back to its original position
    Object.entries(explodedPositions).forEach(([componentKey, explodedPosition]) => {
      const component = componentRefs.current.get(componentKey)
      if (component) {
        // Interpolate between exploded position and original position (reverse of explosion)
        const originalPos = component.userData.originalPosition || { x: 0, y: 0, z: 0 }
        
        component.position.x = explodedPosition.x + (originalPos.x - explodedPosition.x) * componentUnexplodeProgress
        component.position.y = explodedPosition.y + (originalPos.y - explodedPosition.y) * componentUnexplodeProgress
        component.position.z = explodedPosition.z + (originalPos.z - explodedPosition.z) * componentUnexplodeProgress
        
        component.updateMatrix()
        component.updateMatrixWorld(true)
        
        console.log(`Un-exploding ${componentKey} to:`, component.position)
      }
    })

    // Update component controls to reflect the un-exploded positions when animation completes
    if (componentUnexplodeProgress >= 1 && onComponentControlsChange) {
      const updatedControls = { ...componentControls }
      
      Object.entries(explodedPositions).forEach(([componentKey, explodedPosition]) => {
        const component = componentRefs.current.get(componentKey)
        if (component) {
          const originalPos = component.userData.originalPosition || { x: 0, y: 0, z: 0 }
          updatedControls[componentKey as keyof ComponentControls] = {
            ...updatedControls[componentKey as keyof ComponentControls],
            position: {
              x: parseFloat(originalPos.x.toFixed(3)),
              y: parseFloat(originalPos.y.toFixed(3)),
              z: parseFloat(originalPos.z.toFixed(3))
            }
          }
        }
      })
      
      console.log('Updated component controls with un-exploded positions:', updatedControls)
      onComponentControlsChange(updatedControls)
    }
  }, [isComponentUnexploding, componentUnexplodeProgress, current3DStage, onComponentControlsChange, componentControls])

  // Apply visibility changes in Stage 4 (separate from position animation)
  useEffect(() => {
    if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) return

    console.log('Applying visibility changes in Stage 4...')

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
        
        console.log(`👁️ Stage 4 visibility: ${componentKey} (transform.visible: ${transform.visible}, isCategoryVisible: ${isCategoryVisible}, finalVisibility: ${finalVisibility})`)
        
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
      console.log('🔧 All categories hidden - hiding unmapped objects...')
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
      console.log('🔧 Some categories visible - restoring unmapped objects...')
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent && child.userData.originalVisibility !== undefined) {
          child.visible = child.userData.originalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    }
  }, [current3DStage, componentControls, categoryVisibility])

  // Update component controls to reflect actual positions in Stage 4
  useEffect(() => {
    if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) return

    // Only update if components have been animated (exploded)
    const hasAnimatedComponents = componentRefs.current.get('upperSideMainHolder')?.userData.hasBeenAnimated
    if (!hasAnimatedComponents) return

    console.log('Updating component controls to reflect actual Stage 4 positions...')

    // Get the current actual positions of exploded components
    const explodedComponents = ['upperSideMainHolder', 'lowerSideMain', 'upperCover']
    const updatedControls = { ...componentControls }

    explodedComponents.forEach(componentKey => {
      const component = componentRefs.current.get(componentKey)
      if (component) {
        const currentPos = component.position
        const currentRot = component.rotation
        const currentScale = component.scale

        // Update the component controls with actual values
        updatedControls[componentKey as keyof ComponentControls] = {
          position: {
            x: parseFloat(currentPos.x.toFixed(3)),
            y: parseFloat(currentPos.y.toFixed(3)),
            z: parseFloat(currentPos.z.toFixed(3))
          },
          rotation: {
            x: parseFloat(currentRot.x.toFixed(3)),
            y: parseFloat(currentRot.y.toFixed(3)),
            z: parseFloat(currentRot.z.toFixed(3))
          },
          scale: {
            x: parseFloat(currentScale.x.toFixed(3)),
            y: parseFloat(currentScale.y.toFixed(3)),
            z: parseFloat(currentScale.z.toFixed(3))
          },
          visible: updatedControls[componentKey as keyof ComponentControls]?.visible ?? true
        }

        console.log(`Updated ${componentKey} controls:`, updatedControls[componentKey as keyof ComponentControls])
      }
    })

    // Update the component controls state with actual values
    // This will trigger a re-render with the correct values
    if (JSON.stringify(updatedControls) !== JSON.stringify(componentControls) && onComponentControlsChange) {
      console.log('Updating component controls with actual Stage 4 positions')
      onComponentControlsChange(updatedControls)
    }
  }, [current3DStage, componentAnimationProgress])

  // Real-time update of component controls to reflect actual positions
  useEffect(() => {
    if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) return

    // Only update if components have been animated (exploded)
    const hasAnimatedComponents = componentRefs.current.get('upperSideMainHolder')?.userData.hasBeenAnimated
    if (!hasAnimatedComponents) return

    // Use a timer to update component controls periodically
    const updateInterval = setInterval(() => {
      if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) {
        clearInterval(updateInterval)
        return
      }

      // Update component controls with current actual positions
      const updatedControls = { ...componentControls }
      let hasChanges = false

      // Update all components, not just exploded ones
      Object.keys(componentControls).forEach(componentKey => {
        const component = componentRefs.current.get(componentKey)
        if (component) {
          const currentPos = component.position
          const currentRot = component.rotation
          const currentScale = component.scale

          const currentControls = updatedControls[componentKey as keyof ComponentControls]
          const actualPosition = {
            x: parseFloat(currentPos.x.toFixed(3)),
            y: parseFloat(currentPos.y.toFixed(3)),
            z: parseFloat(currentPos.z.toFixed(3))
          }
          const actualRotation = {
            x: parseFloat(currentRot.x.toFixed(3)),
            y: parseFloat(currentRot.y.toFixed(3)),
            z: parseFloat(currentRot.z.toFixed(3))
          }
          const actualScale = {
            x: parseFloat(currentScale.x.toFixed(3)),
            y: parseFloat(currentScale.y.toFixed(3)),
            z: parseFloat(currentScale.z.toFixed(3))
          }

          // Check if the actual values are different from the current controls
          const positionChanged = 
            Math.abs(currentControls.position.x - actualPosition.x) > 0.001 ||
            Math.abs(currentControls.position.y - actualPosition.y) > 0.001 ||
            Math.abs(currentControls.position.z - actualPosition.z) > 0.001

          const rotationChanged = 
            Math.abs(currentControls.rotation.x - actualRotation.x) > 0.001 ||
            Math.abs(currentControls.rotation.y - actualRotation.y) > 0.001 ||
            Math.abs(currentControls.rotation.z - actualRotation.z) > 0.001

          const scaleChanged = 
            Math.abs(currentControls.scale.x - actualScale.x) > 0.001 ||
            Math.abs(currentControls.scale.y - actualScale.y) > 0.001 ||
            Math.abs(currentControls.scale.z - actualScale.z) > 0.001

          if (positionChanged || rotationChanged || scaleChanged) {
            updatedControls[componentKey as keyof ComponentControls] = {
              position: actualPosition,
              rotation: actualRotation,
              scale: actualScale,
              visible: currentControls.visible
            }
            hasChanges = true
            console.log(`Real-time update ${componentKey}:`, actualPosition)
          }
        }
      })

      // Update the component controls state with actual values
      if (hasChanges && onComponentControlsChange) {
        onComponentControlsChange(updatedControls)
      }
    }, 100) // Update every 100ms

    return () => clearInterval(updateInterval)
  }, [current3DStage, onComponentControlsChange])

  // Update component controls when entering Stage 4 to show exploded positions
  useEffect(() => {
    if (current3DStage === 4 && onComponentControlsChange) {
      console.log('Stage 4 entered - updating component controls with exploded positions')
      const explodedPositions = {
        upperSideMainHolder: { x: 0, y: 0, z: 80 },
        lowerSideMain: { x: 0, y: 0, z: -80 },
        upperCover: { x: 0, y: 0, z: 80 }
      }

      const updatedControls = { ...componentControls }
      Object.entries(explodedPositions).forEach(([componentKey, targetPosition]) => {
        updatedControls[componentKey as keyof ComponentControls] = {
          position: {
            x: parseFloat(targetPosition.x.toFixed(3)),
            y: parseFloat(targetPosition.y.toFixed(3)),
            z: parseFloat(targetPosition.z.toFixed(3))
          },
          rotation: {
            x: parseFloat((0).toFixed(3)),
            y: parseFloat((0).toFixed(3)),
            z: parseFloat((0).toFixed(3))
          },
          scale: {
            x: parseFloat((1).toFixed(3)),
            y: parseFloat((1).toFixed(3)),
            z: parseFloat((1).toFixed(3))
          },
          visible: updatedControls[componentKey as keyof ComponentControls]?.visible ?? true
        }
      })

      onComponentControlsChange(updatedControls)
    }
  }, [current3DStage, onComponentControlsChange])

  // Reset component positions when leaving Stage 4
  useEffect(() => {
    if (current3DStage !== 4 && modelRef.current) {
      console.log('Leaving Stage 4 - resetting component positions')
      
      // Reset components to their original positions
      const componentsToReset = ['upperSideMainHolder', 'lowerSideMain', 'upperCover']
      
      componentsToReset.forEach(componentKey => {
        const component = componentRefs.current.get(componentKey)
        if (component && component.userData.originalPosition) {
          const originalPos = component.userData.originalPosition
          component.position.x = originalPos.x
          component.position.y = originalPos.y
          component.position.z = originalPos.z
          component.updateMatrix()
          component.updateMatrixWorld(true)
          
          // Reset animation flag
          component.userData.hasBeenAnimated = false
          
          console.log(`Reset ${componentKey} to original position:`, originalPos)
        }
      })
    }
  }, [current3DStage])

  return null // This component doesn't render anything directly
}
