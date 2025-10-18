'use client'

import { useEffect, useRef, useCallback, memo } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { StageConfig, stage0Config, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config } from './index'
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
  componentControls: ComponentControls
  categoryVisibility: CategoryVisibility
  onComponentControlsChange?: (controls: ComponentControls) => void
  onAnimationFunctionsReady?: (functions: { stage8OpenAnimation: () => void; stage8CloseAnimation: () => void }) => void
  onLoadingProgress?: (progress: number) => void
  onLoadingComplete?: () => void
}

const ThreeSceneManager = memo(function ThreeSceneManager({
  mountRef,
  modelControls,
  cameraControls,
  lightingControls,
  isAnimating,
  animationProgress,
  is3DAnimating,
  stage3DAnimationProgress,
  current3DStage,
  componentControls,
  categoryVisibility,
  onComponentControlsChange,
  onAnimationFunctionsReady,
  onLoadingProgress,
  onLoadingComplete
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
  const upperCoverTextureRef = useRef<THREE.Texture | null>(null)
  const lowerSideMainTextureRef = useRef<THREE.Texture | null>(null)
  const productComponentsTextureRef = useRef<THREE.Texture | null>(null)
  const knobsTextureRef = useRef<THREE.Texture | null>(null)
  const loadingMaterialCoverTextureRef = useRef<THREE.Texture | null>(null)
  const upperSideMainHolderTextureRef = useRef<THREE.Texture | null>(null)
  
  // Animation state tracking for conditional rendering
  const animationFrameRef = useRef<number | null>(null)
  const isRenderingRef = useRef<boolean>(false)
  const needsRenderRef = useRef<boolean>(false)
  const backgroundAnimationsRef = useRef<{
    grid: THREE.Object3D | null
    particles: THREE.Object3D | null
    gridAnimationId: number | null
    particlesAnimationId: number | null
  }>({
    grid: null,
    particles: null,
    gridAnimationId: null,
    particlesAnimationId: null
  })

  // Helper functions for conditional rendering with debouncing
  const requestRender = useCallback(() => {
    needsRenderRef.current = true
    if (!isRenderingRef.current) {
      isRenderingRef.current = true
      animationFrameRef.current = requestAnimationFrame(() => {
        if (rendererRef.current && sceneRef.current && cameraRef.current && needsRenderRef.current) {
          console.log('🎨 Rendering scene with', sceneRef.current.children.length, 'children')
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
        isRenderingRef.current = false
        needsRenderRef.current = false
      })
    }
  }, [])

  const stopRendering = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    isRenderingRef.current = false
    needsRenderRef.current = false
  }, [])

  const startBackgroundAnimations = useCallback(() => {
    const { grid, particles } = backgroundAnimationsRef.current
    
    // Start grid animation with reduced frequency
    if (grid && !backgroundAnimationsRef.current.gridAnimationId) {
      let lastTime = 0
      const animateGrid = (currentTime: number) => {
        // Throttle to 30fps instead of 60fps for better performance
        if (currentTime - lastTime >= 33) {
          const time = currentTime * 0.0003 // Reduced animation speed
          grid.rotation.z = Math.sin(time) * 0.05 // Reduced rotation amplitude
          lastTime = currentTime
        }
        backgroundAnimationsRef.current.gridAnimationId = requestAnimationFrame(animateGrid)
      }
      animateGrid(0)
    }
    
    // Start particles animation with reduced frequency and complexity
    if (particles && !backgroundAnimationsRef.current.particlesAnimationId) {
      let lastTime = 0
      const animateParticles = (currentTime: number) => {
        // Throttle to 30fps instead of 60fps for better performance
        if (currentTime - lastTime >= 33) {
          const time = currentTime * 0.0005 // Reduced animation speed
          if (particles instanceof THREE.Points) {
            const positions = particles.geometry.attributes.position.array as Float32Array
            const particleCount = positions.length / 3
            
            // Process particles in batches to reduce frame time
            const batchSize = 10
            const startIndex = Math.floor((time * 1000) % particleCount)
            
            for (let i = 0; i < batchSize && startIndex + i < particleCount; i++) {
              const particleIndex = (startIndex + i) % particleCount
              const i3 = particleIndex * 3
              positions[i3 + 1] += Math.sin(time + particleIndex * 0.1) * 0.005 // Reduced movement
              positions[i3] += Math.cos(time + particleIndex * 0.05) * 0.002 // Reduced movement
            }
            
            particles.geometry.attributes.position.needsUpdate = true
            lastTime = currentTime
          }
        }
        backgroundAnimationsRef.current.particlesAnimationId = requestAnimationFrame(animateParticles)
      }
      animateParticles(0)
    }
  }, [])

  const stopBackgroundAnimations = useCallback(() => {
    if (backgroundAnimationsRef.current.gridAnimationId) {
      cancelAnimationFrame(backgroundAnimationsRef.current.gridAnimationId)
      backgroundAnimationsRef.current.gridAnimationId = null
    }
    if (backgroundAnimationsRef.current.particlesAnimationId) {
      cancelAnimationFrame(backgroundAnimationsRef.current.particlesAnimationId)
      backgroundAnimationsRef.current.particlesAnimationId = null
    }
  }, [])

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

    // Add background elements similar to loading component
    const addBackgroundElements = () => {

      // Create grid pattern with better visual appeal
      const createGridPattern = () => {
        const gridSize = 120
        const gridDivisions = 60
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions)
        
        // Create grid material with subtle glow
        const gridMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.02,
          wireframe: true,
          side: THREE.DoubleSide
        })
        
        const grid = new THREE.Mesh(gridGeometry, gridMaterial)
        grid.rotation.x = -Math.PI / 2
        grid.position.set(0, -25, -60)
        
        // Store grid reference for conditional animation
        backgroundAnimationsRef.current.grid = grid
        
        return grid
      }

      const grid = createGridPattern()
      scene.add(grid)

      // Add floating particles for more conceptual feel
      const createParticleField = () => {
        const particleCount = 50 // Reduced from 150 to 50 for better performance
        const particles = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3
          
          // Random positions in a large sphere, positioned in the background but visible
          positions[i3] = (Math.random() - 0.5) * 200
          positions[i3 + 1] = (Math.random() - 0.5) * 200
          positions[i3 + 2] = (Math.random() - 0.5) * 150 - 60
          
          // Random colors with blue/purple theme
          const colorChoice = Math.random()
          if (colorChoice < 0.3) {
            colors[i3] = 0.2     // R
            colors[i3 + 1] = 0.4 // G
            colors[i3 + 2] = 0.8 // B
          } else if (colorChoice < 0.6) {
            colors[i3] = 0.5     // R
            colors[i3 + 1] = 0.2 // G
            colors[i3 + 2] = 0.8 // B
          } else {
            colors[i3] = 0.8     // R
            colors[i3 + 1] = 0.3 // G
            colors[i3 + 2] = 0.6 // B
          }
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        
        const particleMaterial = new THREE.PointsMaterial({
          size: 0.5,
          transparent: true,
          opacity: 0.6,
          vertexColors: true,
          blending: THREE.AdditiveBlending
        })
        
        const particleSystem = new THREE.Points(particles, particleMaterial)
        
        // Store particles reference for conditional animation
        backgroundAnimationsRef.current.particles = particleSystem
        
        return particleSystem
      }

      const particles = createParticleField()
      scene.add(particles)


      // Add enhanced fog for depth and atmosphere
      scene.fog = new THREE.Fog(0x1a1a1a, 15, 80)
    }

    // Add background elements
    addBackgroundElements()
    
    // Apply z-index container class to the mount element
    mountRef.current.className = 'three-scene-container'
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

    // Track loading progress
    let loadingProgress = 0
    const updateProgress = (progress: number) => {
      loadingProgress = progress
      onLoadingProgress?.(progress)
    }

    loader.load(
      '/product-3d/Color_Brush_assembly_V1_1.glb', 
      (gltf) => {
        console.log('✅ Model loaded successfully:', gltf)
        updateProgress(30) // Model loaded
      model = gltf.scene
      modelRef.current = model
      console.log('✅ Model added to ref:', model)
      
      // Analyze the 3D object structure
      // // Console log removed
      // // Console log removed
      // // Console log removed
      // // Console log removed
      
      // Log all children and their hierarchy (reduced verbosity)
      let childIndex = 0
      const totalChildren = model.children.length
      // // Console log removed
      
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
      //   // Console log removed`)
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
      // // Console log removed
      const foundComponents: string[] = []
      
      model.traverse((child) => {
        if (child.name) {
          foundComponents.push(child.name)
          // Only log important components to reduce console spam
          if (child.name.includes('Upper_cover') || child.name.includes('Lower_Side_Main') || child.name.includes('OLED_Display')) {
            // // Console log removed`)
          }
          
          // Special debugging for Lower Side Main hierarchy (reduced verbosity)
          if (child.name.includes('Lower_Side_Main')) {
            // // Console log removed
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
                
                // // Console log removed
                
                // Store Upper Cover reference for stage 8 animations
                if (controlKey === 'upperCover') {
                  upperCoverRef.current = child
                  upperCoverOriginalPosition.current = new THREE.Vector3(
                    child.position.x,
                    child.position.y,
                    child.position.z
                  )
                  // // Console log removed
                }
            }
          })
        }
      })
      
      // Find the correct parent containers for group movement
      // Console log removed
      
      // Find Lower Side Main parent container
      let lowerSideMainParent: THREE.Object3D | null = null
      model.traverse((child) => {
        if (child.name && child.name.includes('Lower_Side_Main')) {
          // Console log removed
          // Console log removed)
          
          // Check if this object has many child components
          if (child.children.length > 5) {
            lowerSideMainParent = child
            // Console log removed
          } else {
            // Look for parent that contains this and other lower side components
            let parent = child.parent
            while (parent && parent !== model) {
              const lowerSideChildren = parent.children.filter(c => 
                c.name && (c.name.includes('Lower') || c.name.includes('Product6') || 
                          c.name.includes('Part1') || c.name.includes('Part2') || 
                          c.name.includes('MicroGearmotor1_1') || c.name.includes('Handle_up_cover'))
              )
              // Console log removed
              
              if (lowerSideChildren.length > 10) {
                lowerSideMainParent = parent
                // Console log removed
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
          // Console log removed
          // Console log removed)
          
          // Check if this object has many child components
          if (child.children.length > 5) {
            upperSideMainParent = child
            // Console log removed
          } else {
            // Look for parent that contains this and other upper side components
            let parent = child.parent
            while (parent && parent !== model) {
              const upperSideChildren = parent.children.filter(c => 
                c.name && (c.name.includes('Upper') || c.name.includes('Product1') || 
                          c.name.includes('Product2') || c.name.includes('Color_Sensor') ||
                          c.name.includes('OLED_Display') || c.name.includes('Upper_cover'))
              )
              // Console log removed
              
              if (upperSideChildren.length > 10) {
                upperSideMainParent = parent
                // Console log removed
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
        // Console log removed.name || 'unnamed'}"`)
      }
      
      if (upperSideMainParent) {
        componentRefs.current.set('upperSideMainHolder', upperSideMainParent)
        // Console log removed.name || 'unnamed'}"`)
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
                // Console log removed
              }
            })
          }
        })
      }
      
      // // Console log removed
      // // Console log removed
      // // Console log removed
      // // Console log removed))
      
      // Debug: Show which components are mapped vs which are in componentControls
      const mappedComponents = Array.from(componentRefs.current.keys())
      const controlComponents = Object.keys(componentControls)
      const unmappedControls = controlComponents.filter(key => !mappedComponents.includes(key))
      const unmappedRefs = mappedComponents.filter(key => !controlComponents.includes(key))
      
      // // Console log removed
      // // Console log removed
      // // Console log removed
      // // Console log removed
      // // Console log removed
      
      if (unmappedControls.length > 0) {
      }
      
      // Debug: Find unmapped components
      const mappedComponentNames = new Set()
      Object.values(componentMapping).forEach(names => {
        names.forEach(name => mappedComponentNames.add(name))
      })
      
      const unmappedComponents = foundComponents.filter(name => !mappedComponentNames.has(name))
      if (unmappedComponents.length > 0) {
        // // Console log removed`)
        // Only log the first 10 unmapped components to reduce console spam
        // if (unmappedComponents.length <= 10) {
        //   // Console log removed
        // } else {
        //   // Console log removed)
        //   // Console log removed
        // }
      } else {
        // Console log removed
      }
      
      // Store original component states (don't apply any transformations initially)
      // // Console log removed
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
          // console.warn(`❌ Component not found for storing original state: ${componentKey}`)
        }
      })
      
      // Store original states in a ref for potential reset functionality
      componentRefs.current.set('_originalStates', originalStates as any)
      
      // Store original visibility for all unmapped objects
      // Console log removed
      model.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent) {
          child.userData.originalVisibility = child.visible
        }
      })
      
      // Check for animations
      if (gltf.animations && gltf.animations.length > 0) {
        // Animations found in the model
        gltf.animations.forEach((anim, index) => {
          // Process each animation
        })
      } else {
        // No animations found in the model
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
      
      console.log('✅ Model positioned:', {
        position: model.position,
        scale: model.scale,
        rotation: model.rotation
      })
      
      scene.add(model)
      console.log('✅ Model added to scene. Scene children count:', scene.children.length)

      // Set initial camera position
      camera.position.set(cameraControls.position.x, cameraControls.position.y, cameraControls.position.z)
      console.log('✅ Camera positioned:', camera.position)
      
      // Function to apply texture to OLED Display
      const applyOLEDTexture = (texturePath: string) => {
        if (!textureLoader.current) {
          return
        }
        
        textureLoader.current.load(texturePath, (texture) => {
          
          // Store texture reference for cleanup
          oledTextureRef.current = texture
          
          // Configure texture for OLED display
          texture.wrapS = THREE.ClampToEdgeWrapping
          texture.wrapT = THREE.ClampToEdgeWrapping
          texture.flipY = false
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          
          
          // Find ALL objects in the model that might be OLED displays
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
            
            // Also try to find by exact component names from mapping
            const oledComponents = componentMapping.oledDisplay
            oledComponents.forEach(componentName => {
              if (modelRef.current) {
                modelRef.current.traverse((child) => {
                  if (child.name === componentName) {
                    allOLEDObjects.push(child)
                  }
                })
              }
            })
          }
          
          // Apply texture to all found OLED objects
          let totalMeshes = 0
          allOLEDObjects.forEach(obj => {
            let meshCount = 0
            
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                totalMeshes++
                
                // Create a new material with the texture
                const newMaterial = child.material.clone()
                
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply texture to the material with stronger visibility
                      mat.map = texture
                      mat.emissive = new THREE.Color(0x000000) // Make it slightly emissive for screen effect
                      mat.emissiveMap = texture
                      mat.emissiveIntensity = 0.8 // Increased intensity for better visibility
                      mat.roughness = 0.1 // Make it more reflective
                      mat.metalness = 0.0 // Non-metallic
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply texture to the material with stronger visibility
                  newMaterial.map = texture
                  newMaterial.emissive = new THREE.Color(0x000000) // Make it slightly emissive for screen effect
                  newMaterial.emissiveMap = texture
                  newMaterial.emissiveIntensity = 0.8 // Increased intensity for better visibility
                  newMaterial.roughness = 0.1 // Make it more reflective
                  newMaterial.metalness = 0.0 // Non-metallic
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          })
          
          
          if (totalMeshes === 0) {
            
            // Last resort: try to find any small rectangular surface that might be the OLED display
            if (modelRef.current) {
              modelRef.current.traverse((child) => {
                if (child instanceof THREE.Mesh && child.geometry) {
                  const geometry = child.geometry
                  if (geometry.boundingBox) {
                    const size = geometry.boundingBox.getSize(new THREE.Vector3())
                    // Look for small rectangular surfaces (typical OLED size)
                    if (size.x > 0.01 && size.x < 0.1 && size.y > 0.005 && size.y < 0.05 && size.z < 0.01) {
                      
                      const newMaterial = child.material.clone()
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
                          if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.map = texture
                            mat.emissive = new THREE.Color(0x000000)
                            mat.emissiveMap = texture
                            mat.emissiveIntensity = 0.8
                            mat.roughness = 0.1
                            mat.metalness = 0.0
                            mat.needsUpdate = true
                          }
                        })
                      } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                        newMaterial.map = texture
                        newMaterial.emissive = new THREE.Color(0x000000)
                        newMaterial.emissiveMap = texture
                        newMaterial.emissiveIntensity = 0.8
                        newMaterial.roughness = 0.1
                        newMaterial.metalness = 0.0
                        newMaterial.needsUpdate = true
                      }
                      
                      child.material = newMaterial
                    }
                  }
                }
              })
            }
          }
          
          // Console log removed
          updateProgress(70) // Textures loaded
        }, undefined, (error) => {
          updateProgress(70) // Still count as progress even if texture fails
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
        
        // Console log removed
      }
      
      // Function to apply texture to Upper Cover
      const applyUpperCoverTexture = (texturePath: string) => {
        if (!textureLoader.current) return
        
        
        textureLoader.current.load(texturePath, (texture) => {
          // Store texture reference for cleanup
          upperCoverTextureRef.current = texture
          
          // Configure texture for metal surface
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.flipY = false
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          
          // Find Upper Cover component and apply texture
          const upperCoverComponent = componentRefs.current.get('upperCover')
          
          if (upperCoverComponent) {
            let meshCount = 0
            upperCoverComponent.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply texture to the material
                      mat.map = texture
                      // Set metallic properties for brushed steel appearance
                      mat.metalness = 0.8
                      mat.roughness = 0.3
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply texture to the material
                  newMaterial.map = texture
                  // Set metallic properties for brushed steel appearance
                  newMaterial.metalness = 0.8
                  newMaterial.roughness = 0.3
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
          }
        }, undefined, (error) => {
        })
      }
      
      // Function to remove Upper Cover texture
      const removeUpperCoverTexture = () => {
        if (upperCoverTextureRef.current) {
          upperCoverTextureRef.current.dispose()
          upperCoverTextureRef.current = null
        }
        
        // Reset Upper Cover materials to original
        const upperCoverComponent = componentRefs.current.get('upperCover')
        if (upperCoverComponent) {
          upperCoverComponent.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const newMaterial = child.material.clone()
              if (Array.isArray(newMaterial)) {
                newMaterial.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.map = null
                    mat.metalness = 0
                    mat.roughness = 0.5
                    mat.needsUpdate = true
                  }
                })
              } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                newMaterial.map = null
                newMaterial.metalness = 0
                newMaterial.roughness = 0.5
                newMaterial.needsUpdate = true
              }
              
              child.material = newMaterial
            }
          })
        }
      }
      
      // Function to apply texture to Lower Side Main
      const applyLowerSideMainTexture = (texturePath: string) => {
        if (!textureLoader.current) return
        
        
        textureLoader.current.load(texturePath, (texture) => {
          // Store texture reference for cleanup
          lowerSideMainTextureRef.current = texture
          
          // Configure texture for metal surface
          texture.wrapS = THREE.RepeatWrapping
          texture.wrapT = THREE.RepeatWrapping
          texture.flipY = false
          texture.minFilter = THREE.LinearFilter
          texture.magFilter = THREE.LinearFilter
          
          // Find Lower Side Main component and apply texture
          const lowerSideMainComponent = componentRefs.current.get('lowerSideMain')
          
          if (lowerSideMainComponent) {
            let meshCount = 0
            lowerSideMainComponent.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply texture to the material
                      mat.map = texture
                      // Set metallic properties for brushed steel appearance
                      mat.metalness = 0.8
                      mat.roughness = 0.3
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply texture to the material
                  newMaterial.map = texture
                  // Set metallic properties for brushed steel appearance
                  newMaterial.metalness = 0.8
                  newMaterial.roughness = 0.3
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
          }
        }, undefined, (error) => {
        })
      }
      
      // Function to remove Lower Side Main texture
      const removeLowerSideMainTexture = () => {
        if (lowerSideMainTextureRef.current) {
          lowerSideMainTextureRef.current.dispose()
          lowerSideMainTextureRef.current = null
        }
        
        // Reset Lower Side Main materials to original
        const lowerSideMainComponent = componentRefs.current.get('lowerSideMain')
        if (lowerSideMainComponent) {
          lowerSideMainComponent.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const newMaterial = child.material.clone()
              if (Array.isArray(newMaterial)) {
                newMaterial.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.map = null
                    mat.metalness = 0
                    mat.roughness = 0.5
                    mat.needsUpdate = true
                  }
                })
              } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                newMaterial.map = null
                newMaterial.metalness = 0
                newMaterial.roughness = 0.5
                newMaterial.needsUpdate = true
              }
              
              child.material = newMaterial
            }
          })
        }
      }
      
      // Function to apply black texture to Product Components
      const applyProductComponentsTexture = () => {
        
        // Create a simple black texture programmatically
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
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        
        // Store texture reference for cleanup
        productComponentsTextureRef.current = texture
        
        // Find Product Components and apply texture
        const productComponents = componentMapping.productComponents
        
        let totalMeshes = 0
        productComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          
          if (component) {
            let meshCount = 0
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                totalMeshes++
                const newMaterial = child.material.clone()
                
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply black texture to the material
                      mat.map = texture
                      mat.color.setHex(0x000000) // Ensure black color
                      mat.metalness = 0.1
                      mat.roughness = 0.8
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply black texture to the material
                  newMaterial.map = texture
                  newMaterial.color.setHex(0x000000) // Ensure black color
                  newMaterial.metalness = 0.1
                  newMaterial.roughness = 0.8
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
            // Try to find it by searching the model
            if (modelRef.current) {
              let found = false
              modelRef.current.traverse((child) => {
                if (child.name === componentName) {
                  found = true
                  let meshCount = 0
                  child.traverse((meshChild) => {
                    if (meshChild instanceof THREE.Mesh && meshChild.material) {
                      meshCount++
                      totalMeshes++
                      const newMaterial = meshChild.material.clone()
                      
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
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
                      
                      meshChild.material = newMaterial
                    }
                  })
                }
              })
              if (!found) {
              }
            }
          }
        })
        
      }
      
      // Function to remove Product Components texture
      const removeProductComponentsTexture = () => {
        if (productComponentsTextureRef.current) {
          productComponentsTextureRef.current.dispose()
          productComponentsTextureRef.current = null
        }
        
        // Reset Product Components materials to original
        const productComponents = componentMapping.productComponents
        productComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          if (component) {
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.map = null
                      mat.color.setHex(0xffffff) // Reset to white
                      mat.metalness = 0
                      mat.roughness = 0.5
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  newMaterial.map = null
                  newMaterial.color.setHex(0xffffff) // Reset to white
                  newMaterial.metalness = 0
                  newMaterial.roughness = 0.5
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          }
        })
      }
      
      // Function to apply black texture to Knobs
      const applyKnobsTexture = () => {
        
        // Create a simple black texture programmatically
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
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        
        // Store texture reference for cleanup
        knobsTextureRef.current = texture
        
        // Find Knobs and apply texture
        const knobsComponents = componentMapping.knobs
        
        let totalMeshes = 0
        knobsComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          
          if (component) {
            let meshCount = 0
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                totalMeshes++
                const newMaterial = child.material.clone()
                
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply black texture to the material
                      mat.map = texture
                      mat.color.setHex(0x000000) // Ensure black color
                      mat.metalness = 0.1
                      mat.roughness = 0.8
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply black texture to the material
                  newMaterial.map = texture
                  newMaterial.color.setHex(0x000000) // Ensure black color
                  newMaterial.metalness = 0.1
                  newMaterial.roughness = 0.8
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
            // Try to find it by searching the model
            if (modelRef.current) {
              let found = false
              modelRef.current.traverse((child) => {
                if (child.name === componentName) {
                  found = true
                  let meshCount = 0
                  child.traverse((meshChild) => {
                    if (meshChild instanceof THREE.Mesh && meshChild.material) {
                      meshCount++
                      totalMeshes++
                      const newMaterial = meshChild.material.clone()
                      
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
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
                      
                      meshChild.material = newMaterial
                    }
                  })
                }
              })
              if (!found) {
              }
            }
          }
        })
        
      }
      
      // Function to remove Knobs texture
      const removeKnobsTexture = () => {
        if (knobsTextureRef.current) {
          knobsTextureRef.current.dispose()
          knobsTextureRef.current = null
        }
        
        // Reset Knobs materials to original
        const knobsComponents = componentMapping.knobs
        knobsComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          if (component) {
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.map = null
                      mat.color.setHex(0xffffff) // Reset to white
                      mat.metalness = 0
                      mat.roughness = 0.5
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  newMaterial.map = null
                  newMaterial.color.setHex(0xffffff) // Reset to white
                  newMaterial.metalness = 0
                  newMaterial.roughness = 0.5
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          }
        })
      }
      
      // Function to apply black texture to Loading Material Cover
      const applyLoadingMaterialCoverTexture = () => {
        
        // Create a simple black texture programmatically
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
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        
        // Store texture reference for cleanup
        loadingMaterialCoverTextureRef.current = texture
        
        // Find Loading Material Cover and apply texture
        const loadingMaterialCoverComponents = componentMapping.loadingMaterialCover
        
        let totalMeshes = 0
        loadingMaterialCoverComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          
          if (component) {
            let meshCount = 0
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                totalMeshes++
                const newMaterial = child.material.clone()
                
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply black texture to the material
                      mat.map = texture
                      mat.color.setHex(0x000000) // Ensure black color
                      mat.metalness = 0.1
                      mat.roughness = 0.8
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply black texture to the material
                  newMaterial.map = texture
                  newMaterial.color.setHex(0x000000) // Ensure black color
                  newMaterial.metalness = 0.1
                  newMaterial.roughness = 0.8
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
            // Try to find it by searching the model
            if (modelRef.current) {
              let found = false
              modelRef.current.traverse((child) => {
                if (child.name === componentName) {
                  found = true
                  let meshCount = 0
                  child.traverse((meshChild) => {
                    if (meshChild instanceof THREE.Mesh && meshChild.material) {
                      meshCount++
                      totalMeshes++
                      const newMaterial = meshChild.material.clone()
                      
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
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
                      
                      meshChild.material = newMaterial
                    }
                  })
                }
              })
              if (!found) {
              }
            }
          }
        })
        
      }
      
      // Function to remove Loading Material Cover texture
      const removeLoadingMaterialCoverTexture = () => {
        if (loadingMaterialCoverTextureRef.current) {
          loadingMaterialCoverTextureRef.current.dispose()
          loadingMaterialCoverTextureRef.current = null
        }
        
        // Reset Loading Material Cover materials to original
        const loadingMaterialCoverComponents = componentMapping.loadingMaterialCover
        loadingMaterialCoverComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          if (component) {
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.map = null
                      mat.color.setHex(0xffffff) // Reset to white
                      mat.metalness = 0
                      mat.roughness = 0.5
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  newMaterial.map = null
                  newMaterial.color.setHex(0xffffff) // Reset to white
                  newMaterial.metalness = 0
                  newMaterial.roughness = 0.5
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          }
        })
      }
      
      // Function to apply black texture to Upper Side Main Holder
      const applyUpperSideMainHolderTexture = () => {
        
        // Create a simple black texture programmatically
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
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        
        // Store texture reference for cleanup
        upperSideMainHolderTextureRef.current = texture
        
        // Find Upper Side Main Holder and apply texture
        const upperSideMainHolderComponents = componentMapping.upperSideMainHolder
        
        let totalMeshes = 0
        upperSideMainHolderComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          
          if (component) {
            let meshCount = 0
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                meshCount++
                totalMeshes++
                const newMaterial = child.material.clone()
                
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach((mat, index) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      // Apply black texture to the material
                      mat.map = texture
                      mat.color.setHex(0x000000) // Ensure black color
                      mat.metalness = 0.1
                      mat.roughness = 0.8
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  // Apply black texture to the material
                  newMaterial.map = texture
                  newMaterial.color.setHex(0x000000) // Ensure black color
                  newMaterial.metalness = 0.1
                  newMaterial.roughness = 0.8
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          } else {
            // Try to find it by searching the model
            if (modelRef.current) {
              let found = false
              modelRef.current.traverse((child) => {
                if (child.name === componentName) {
                  found = true
                  let meshCount = 0
                  child.traverse((meshChild) => {
                    if (meshChild instanceof THREE.Mesh && meshChild.material) {
                      meshCount++
                      totalMeshes++
                      const newMaterial = meshChild.material.clone()
                      
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
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
                      
                      meshChild.material = newMaterial
                    }
                  })
                }
              })
              if (!found) {
              }
            }
          }
        })
        
      }
      
      // Function to remove Upper Side Main Holder texture
      const removeUpperSideMainHolderTexture = () => {
        if (upperSideMainHolderTextureRef.current) {
          upperSideMainHolderTextureRef.current.dispose()
          upperSideMainHolderTextureRef.current = null
        }
        
        // Reset Upper Side Main Holder materials to original
        const upperSideMainHolderComponents = componentMapping.upperSideMainHolder
        upperSideMainHolderComponents.forEach(componentName => {
          const component = componentRefs.current.get(componentName)
          if (component) {
            component.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const newMaterial = child.material.clone()
                if (Array.isArray(newMaterial)) {
                  newMaterial.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.map = null
                      mat.color.setHex(0xffffff) // Reset to white
                      mat.metalness = 0
                      mat.roughness = 0.5
                      mat.needsUpdate = true
                    }
                  })
                } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                  newMaterial.map = null
                  newMaterial.color.setHex(0xffffff) // Reset to white
                  newMaterial.metalness = 0
                  newMaterial.roughness = 0.5
                  newMaterial.needsUpdate = true
                }
                
                child.material = newMaterial
              }
            })
          }
        })
      }
      
      // Store functions for use in other effects
      ;(window as any).applyOLEDTexture = applyOLEDTexture
      ;(window as any).removeOLEDTexture = removeOLEDTexture
      ;(window as any).applyUpperCoverTexture = applyUpperCoverTexture
      ;(window as any).removeUpperCoverTexture = removeUpperCoverTexture
      ;(window as any).applyLowerSideMainTexture = applyLowerSideMainTexture
      ;(window as any).removeLowerSideMainTexture = removeLowerSideMainTexture
      ;(window as any).applyProductComponentsTexture = applyProductComponentsTexture
      ;(window as any).removeProductComponentsTexture = removeProductComponentsTexture
      ;(window as any).applyKnobsTexture = applyKnobsTexture
      ;(window as any).removeKnobsTexture = removeKnobsTexture
      ;(window as any).applyLoadingMaterialCoverTexture = applyLoadingMaterialCoverTexture
      ;(window as any).removeLoadingMaterialCoverTexture = removeLoadingMaterialCoverTexture
      ;(window as any).applyUpperSideMainHolderTexture = applyUpperSideMainHolderTexture
      ;(window as any).removeUpperSideMainHolderTexture = removeUpperSideMainHolderTexture
      
      // Add manual trigger for testing OLED texture
      ;(window as any).testOLEDTexture = () => {
        applyOLEDTexture('/oled-screen.png')
      }
      
      // Add function to force apply OLED texture to any small surface
      ;(window as any).forceApplyOLEDTexture = () => {
        if (modelRef.current) {
          let appliedCount = 0
          modelRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry && child.material) {
              const geometry = child.geometry
              if (geometry.boundingBox) {
                const size = geometry.boundingBox.getSize(new THREE.Vector3())
                // Look for small rectangular surfaces (typical OLED size)
                if (size.x > 0.005 && size.x < 0.05 && size.y > 0.002 && size.y < 0.03 && size.z < 0.005) {
                  
                  // Load texture and apply it
                  if (textureLoader.current) {
                    textureLoader.current.load('/oled-screen.png', (texture) => {
                      texture.wrapS = THREE.ClampToEdgeWrapping
                      texture.wrapT = THREE.ClampToEdgeWrapping
                      texture.flipY = false
                      texture.minFilter = THREE.LinearFilter
                      texture.magFilter = THREE.LinearFilter
                      
                      const newMaterial = child.material.clone()
                      if (Array.isArray(newMaterial)) {
                        newMaterial.forEach((mat, index) => {
                          if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.map = texture
                            mat.emissive = new THREE.Color(0x000000)
                            mat.emissiveMap = texture
                            mat.emissiveIntensity = 0.8
                            mat.roughness = 0.1
                            mat.metalness = 0.0
                            mat.needsUpdate = true
                          }
                        })
                      } else if (newMaterial instanceof THREE.MeshStandardMaterial) {
                        newMaterial.map = texture
                        newMaterial.emissive = new THREE.Color(0x000000)
                        newMaterial.emissiveMap = texture
                        newMaterial.emissiveIntensity = 0.8
                        newMaterial.roughness = 0.1
                        newMaterial.metalness = 0.0
                        newMaterial.needsUpdate = true
                      }
                      
                      child.material = newMaterial
                      appliedCount++
                    })
                  }
                }
              }
            }
          })
        }
      }
      
      // Add manual triggers for testing black textures
      ;(window as any).testBlackTextures = () => {
        applyProductComponentsTexture()
        applyKnobsTexture()
        applyLoadingMaterialCoverTexture()
        applyUpperSideMainHolderTexture()
      }
      
      ;(window as any).testProductComponentsTexture = () => {
        applyProductComponentsTexture()
      }
      
      ;(window as any).testKnobsTexture = () => {
        applyKnobsTexture()
      }
      
      ;(window as any).testLoadingMaterialCoverTexture = () => {
        applyLoadingMaterialCoverTexture()
      }
      
      ;(window as any).testUpperSideMainHolderTexture = () => {
        applyUpperSideMainHolderTexture()
      }
      
      // Add function to list all objects in the model
      ;(window as any).listAllObjects = () => {
        if (modelRef.current) {
          modelRef.current.traverse((child) => {
            if (child.name) {
              if (child instanceof THREE.Mesh) {
                if (child.geometry && child.geometry.boundingBox) {
                  const size = child.geometry.boundingBox.getSize(new THREE.Vector3())
                }
              }
            }
          })
        }
      }
      
      // Apply Upper Cover texture after component mapping is complete
      const applyUpperCoverTextureWhenReady = () => {
        const upperCoverComponent = componentRefs.current.get('upperCover')
        
        if (upperCoverComponent && (window as any).applyUpperCoverTexture) {
          ;(window as any).applyUpperCoverTexture('/textures/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg')
        } else {
          // Retry after a short delay if component not found yet
          setTimeout(applyUpperCoverTextureWhenReady, 50)
        }
      }
      
      // Apply Lower Side Main texture after component mapping is complete
      const applyLowerSideMainTextureWhenReady = () => {
        const lowerSideMainComponent = componentRefs.current.get('lowerSideMain')
        
        if (lowerSideMainComponent && (window as any).applyLowerSideMainTexture) {
          ;(window as any).applyLowerSideMainTexture('/textures/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg')
        } else {
          // Retry after a short delay if component not found yet
          setTimeout(applyLowerSideMainTextureWhenReady, 50)
        }
      }
      
      // Apply Product Components black texture after component mapping is complete
      const applyProductComponentsTextureWhenReady = () => {
        const productComponents = componentMapping.productComponents
        const hasProductComponents = productComponents.some(name => componentRefs.current.has(name))
        
        if (hasProductComponents && (window as any).applyProductComponentsTexture) {
          ;(window as any).applyProductComponentsTexture()
        } else {
          // Also try to apply texture directly to any objects with "Product" in the name
          if (modelRef.current) {
            let foundAny = false
            modelRef.current.traverse((child) => {
              if (child.name && child.name.toLowerCase().includes('product')) {
                foundAny = true
                // Apply black texture directly
                if ((window as any).applyProductComponentsTexture) {
                  ;(window as any).applyProductComponentsTexture()
                }
              }
            })
            if (foundAny) {
            }
          }
          // Retry after a short delay if components not found yet
          setTimeout(applyProductComponentsTextureWhenReady, 50)
        }
      }
      
      // Apply Knobs black texture after component mapping is complete
      const applyKnobsTextureWhenReady = () => {
        const knobsComponents = componentMapping.knobs
        const hasKnobsComponents = knobsComponents.some(name => componentRefs.current.has(name))
        
        if (hasKnobsComponents && (window as any).applyKnobsTexture) {
          ;(window as any).applyKnobsTexture()
        } else {
          // Also try to apply texture directly to any objects with "knob" in the name
          if (modelRef.current) {
            let foundAny = false
            modelRef.current.traverse((child) => {
              if (child.name && child.name.toLowerCase().includes('knob')) {
                foundAny = true
                // Apply black texture directly
                if ((window as any).applyKnobsTexture) {
                  ;(window as any).applyKnobsTexture()
                }
              }
            })
          }
          // Retry after a short delay if components not found yet
          setTimeout(applyKnobsTextureWhenReady, 50)
        }
      }
      
      // Apply Loading Material Cover black texture after component mapping is complete
      const applyLoadingMaterialCoverTextureWhenReady = () => {
        const loadingMaterialCoverComponents = componentMapping.loadingMaterialCover
        const hasLoadingMaterialCoverComponents = loadingMaterialCoverComponents.some(name => componentRefs.current.has(name))
        
        if (hasLoadingMaterialCoverComponents && (window as any).applyLoadingMaterialCoverTexture) {
          ;(window as any).applyLoadingMaterialCoverTexture()
        } else {
          // Also try to apply texture directly to any objects with "loading" in the name
          if (modelRef.current) {
            let foundAny = false
            modelRef.current.traverse((child) => {
              if (child.name && child.name.toLowerCase().includes('loading')) {
                foundAny = true
                // Apply black texture directly
                if ((window as any).applyLoadingMaterialCoverTexture) {
                  ;(window as any).applyLoadingMaterialCoverTexture()
                }
              }
            })
          }
          // Retry after a short delay if components not found yet
          setTimeout(applyLoadingMaterialCoverTextureWhenReady, 50)
        }
      }
      
      // Apply Upper Side Main Holder black texture after component mapping is complete
      const applyUpperSideMainHolderTextureWhenReady = () => {
        const upperSideMainHolderComponents = componentMapping.upperSideMainHolder
        const hasUpperSideMainHolderComponents = upperSideMainHolderComponents.some(name => componentRefs.current.has(name))
        
        if (hasUpperSideMainHolderComponents && (window as any).applyUpperSideMainHolderTexture) {
          ;(window as any).applyUpperSideMainHolderTexture()
        } else {
          // Also try to apply texture directly to any objects with "upper" in the name
          if (modelRef.current) {
            let foundAny = false
            modelRef.current.traverse((child) => {
              if (child.name && child.name.toLowerCase().includes('upper') && child.name.toLowerCase().includes('holder')) {
                foundAny = true
                // Apply black texture directly
                if ((window as any).applyUpperSideMainHolderTexture) {
                  ;(window as any).applyUpperSideMainHolderTexture()
                }
              }
            })
          }
          // Retry after a short delay if components not found yet
          setTimeout(applyUpperSideMainHolderTextureWhenReady, 50)
        }
      }
      
      // Apply OLED Display texture after component mapping is complete
      const applyOLEDTextureWhenReady = () => {
        
        // Try to apply texture immediately
        if ((window as any).applyOLEDTexture) {
          ;(window as any).applyOLEDTexture('/oled-screen.png')
        } else {
          setTimeout(applyOLEDTextureWhenReady, 100)
        }
      }
      
      // Start trying to apply textures after a short delay
      setTimeout(applyUpperCoverTextureWhenReady, 100)
      setTimeout(applyLowerSideMainTextureWhenReady, 150)
      setTimeout(applyProductComponentsTextureWhenReady, 200)
      setTimeout(applyKnobsTextureWhenReady, 250)
      setTimeout(applyLoadingMaterialCoverTextureWhenReady, 300)
      setTimeout(applyUpperSideMainHolderTextureWhenReady, 350)
      setTimeout(applyOLEDTextureWhenReady, 400)
      
      // Also try to apply OLED texture with a more aggressive approach
      setTimeout(() => {
        if ((window as any).forceApplyOLEDTexture) {
          ;(window as any).forceApplyOLEDTexture()
        }
      }, 500)
      
      // Complete loading
      updateProgress(100)
      onLoadingComplete?.()
      
    }, undefined, (error) => {
      console.error('❌ Model loading failed:', error)
      updateProgress(100) // Still complete loading even if there's an error
      onLoadingComplete?.()
    })

    // Initial render
    console.log('✅ Requesting initial render')
    requestRender()

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
      
      // Stop all animations
      stopRendering()
      stopBackgroundAnimations()
      
      // Cancel any pending animation frames
      if (stage8OpenAnimationRef.current) {
        cancelAnimationFrame(stage8OpenAnimationRef.current)
      }
      if (stage8CloseAnimationRef.current) {
        cancelAnimationFrame(stage8CloseAnimationRef.current)
      }
      
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
      if (upperCoverTextureRef.current) {
        upperCoverTextureRef.current.dispose()
        upperCoverTextureRef.current = null
      }
      if (lowerSideMainTextureRef.current) {
        lowerSideMainTextureRef.current.dispose()
        lowerSideMainTextureRef.current = null
      }
      if (productComponentsTextureRef.current) {
        productComponentsTextureRef.current.dispose()
        productComponentsTextureRef.current = null
      }
      if (knobsTextureRef.current) {
        knobsTextureRef.current.dispose()
        knobsTextureRef.current = null
      }
      if (loadingMaterialCoverTextureRef.current) {
        loadingMaterialCoverTextureRef.current.dispose()
        loadingMaterialCoverTextureRef.current = null
      }
      if (upperSideMainHolderTextureRef.current) {
        upperSideMainHolderTextureRef.current.dispose()
        upperSideMainHolderTextureRef.current = null
      }
    }
  }, [])

  // Force updates when model controls change or during animation
  useEffect(() => {
    if (modelRef.current) {
      const model = modelRef.current
      const { scale, position, rotation } = modelControls
      
      console.log(`ThreeSceneManager: Updating model controls:`, { scale, position, rotation })
      
      // Only update if values have actually changed
      if (model.scale.x !== scale.x || model.scale.y !== scale.y || model.scale.z !== scale.z) {
        console.log(`Updating scale from (${model.scale.x}, ${model.scale.y}, ${model.scale.z}) to (${scale.x}, ${scale.y}, ${scale.z})`)
        model.scale.set(scale.x, scale.y, scale.z)
      }
      if (model.position.x !== position.x || model.position.y !== position.y || model.position.z !== position.z) {
        console.log(`Updating position from (${model.position.x}, ${model.position.y}, ${model.position.z}) to (${position.x}, ${position.y}, ${position.z})`)
        model.position.set(position.x, position.y, position.z)
      }
      if (model.rotation.x !== rotation.x || model.rotation.y !== rotation.y || model.rotation.z !== rotation.z) {
        console.log(`Updating rotation from (${model.rotation.x}, ${model.rotation.y}, ${model.rotation.z}) to (${rotation.x}, ${rotation.y}, ${rotation.z})`)
        model.rotation.set(rotation.x, rotation.y, rotation.z)
      }
      requestRender()
    } else {
      console.log(`ThreeSceneManager: modelRef.current is null, cannot update model controls`)
    }
  }, [modelControls.scale.x, modelControls.scale.y, modelControls.scale.z, modelControls.position.x, modelControls.position.y, modelControls.position.z, modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z, requestRender])

  // Conditional background animations - only run when 3D scene is active
  useEffect(() => {
    if (current3DStage >= 1 && current3DStage <= 8) {
      startBackgroundAnimations()
    } else {
      stopBackgroundAnimations()
    }
  }, [current3DStage, startBackgroundAnimations, stopBackgroundAnimations])

  // Force updates when camera controls change or during animation
  useEffect(() => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const { position, fov } = cameraControls
      
      // Only update if values have actually changed
      if (camera.position.x !== position.x || camera.position.y !== position.y || camera.position.z !== position.z) {
        camera.position.set(position.x, position.y, position.z)
      }
      if (camera.fov !== fov) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
      requestRender()
    }
  }, [cameraControls.position.x, cameraControls.position.y, cameraControls.position.z, cameraControls.fov, requestRender])

  // Force updates when lighting controls change or during animation
  useEffect(() => {
    // Ambient light
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = lightingControls.ambientIntensity
      ambientLightRef.current.color.setHex(parseInt(lightingControls.ambientColor.replace('#', ''), 16))
    }
    
    // Directional light
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = lightingControls.directionalIntensity
      directionalLightRef.current.color.setHex(parseInt(lightingControls.directionalColor.replace('#', ''), 16))
      directionalLightRef.current.position.set(lightingControls.directionalPosition.x, lightingControls.directionalPosition.y, lightingControls.directionalPosition.z)
      directionalLightRef.current.target.position.set(lightingControls.directionalTarget.x, lightingControls.directionalTarget.y, lightingControls.directionalTarget.z)
      directionalLightRef.current.castShadow = lightingControls.shadowsEnabled
      directionalLightRef.current.shadow.mapSize.width = lightingControls.shadowMapSize
      directionalLightRef.current.shadow.mapSize.height = lightingControls.shadowMapSize
      directionalLightRef.current.shadow.bias = lightingControls.shadowBias
    }
    
    // Point light
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightingControls.pointLightIntensity
      pointLightRef.current.color.setHex(parseInt(lightingControls.pointLightColor.replace('#', ''), 16))
      pointLightRef.current.position.set(lightingControls.pointLightPosition.x, lightingControls.pointLightPosition.y, lightingControls.pointLightPosition.z)
      pointLightRef.current.distance = lightingControls.pointLightDistance
      pointLightRef.current.castShadow = lightingControls.shadowsEnabled
    }
    
    // Spot light
    if (spotLightRef.current) {
      spotLightRef.current.intensity = lightingControls.spotLightIntensity
      spotLightRef.current.color.setHex(parseInt(lightingControls.spotLightColor.replace('#', ''), 16))
      spotLightRef.current.position.set(lightingControls.spotLightPosition.x, lightingControls.spotLightPosition.y, lightingControls.spotLightPosition.z)
      spotLightRef.current.target.position.set(lightingControls.spotLightTarget.x, lightingControls.spotLightTarget.y, lightingControls.spotLightTarget.z)
      spotLightRef.current.distance = lightingControls.spotLightDistance
      spotLightRef.current.angle = lightingControls.spotLightAngle * Math.PI / 180
      spotLightRef.current.penumbra = lightingControls.spotLightPenumbra
      spotLightRef.current.castShadow = lightingControls.shadowsEnabled
    }
    requestRender()
  }, [lightingControls.ambientIntensity, lightingControls.ambientColor, lightingControls.directionalIntensity, lightingControls.directionalColor, lightingControls.directionalPosition.x, lightingControls.directionalPosition.y, lightingControls.directionalPosition.z, lightingControls.directionalTarget.x, lightingControls.directionalTarget.y, lightingControls.directionalTarget.z, lightingControls.pointLightIntensity, lightingControls.pointLightColor, lightingControls.pointLightPosition.x, lightingControls.pointLightPosition.y, lightingControls.pointLightPosition.z, lightingControls.pointLightDistance, lightingControls.spotLightIntensity, lightingControls.spotLightColor, lightingControls.spotLightPosition.x, lightingControls.spotLightPosition.y, lightingControls.spotLightPosition.z, lightingControls.spotLightTarget.x, lightingControls.spotLightTarget.y, lightingControls.spotLightTarget.z, lightingControls.spotLightDistance, lightingControls.spotLightAngle, lightingControls.spotLightPenumbra, lightingControls.shadowsEnabled, lightingControls.shadowMapSize, lightingControls.shadowBias, requestRender])

  // Apply component transformations (only when user changes controls)
  useEffect(() => {
    // Only apply if model is loaded and components are mapped
    if (!modelRef.current || componentRefs.current.size === 0) {
      // // Console log removed
      return
    }

    
    // // Console log removed ===')
    // // Console log removed
    // // Console log removed))
    
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
          // console.warn(`⚠️ Component "${componentKey}" not found in any category! This component will always be visible.`)
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
          // // Console log removed
          
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
          // // Console log removed
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
        // console.warn(`❌ Component not found for update: ${componentKey}`)
      }
    })
    
    // Request render after component updates
    requestRender()
    
    // Debug: Summary of visible components when all categories are hidden
    const allCategoriesHidden = Object.values(categoryVisibility).every(visible => !visible)
    
    // If not all categories are hidden, restore original visibility of unmapped objects
    if (!allCategoriesHidden && modelRef.current) {
      // // Console log removed
      modelRef.current.traverse((child) => {
        if (child.name && !child.userData.isMappedComponent && child.userData.originalVisibility !== undefined) {
          child.visible = child.userData.originalVisibility
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
    }
    
    if (allCategoriesHidden) {
      // // Console log removed
      
      // Check our mapped components
      const stillVisibleComponents = Object.entries(componentControls)
        .filter(([key, transform]) => {
          const component = componentRefs.current.get(key)
          return component && component.visible
        })
        .map(([key, transform]) => key)
      
      if (stillVisibleComponents.length > 0) {
        // console.warn(`⚠️ These mapped components are still visible when all categories are hidden:`, stillVisibleComponents)
      } else {
        // // Console log removed
      }
      
      // Check ALL objects in the 3D model for visibility
      if (modelRef.current) {
        // // Console log removed
        const allVisibleObjects: string[] = []
        
        modelRef.current.traverse((child) => {
          if (child.visible && child.name) {
            allVisibleObjects.push(child.name)
          }
        })
        
        if (allVisibleObjects.length > 0) {
          // console.warn(`⚠️ These 3D model objects are still visible when all categories are hidden:`, allVisibleObjects)
          
          // Hide all unmapped objects when all categories are hidden
          // // Console log removed
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
          // // Console log removed
        }
      }
    }
  }, [componentControls, categoryVisibility, requestRender])

  // Control background animations based on animation state
  useEffect(() => {
    if (isAnimating || is3DAnimating) {
      startBackgroundAnimations()
    } else {
      stopBackgroundAnimations()
    }
  }, [isAnimating, is3DAnimating, startBackgroundAnimations, stopBackgroundAnimations])

  // Apply visibility changes in Stage 4 (separate from position animation)
  useEffect(() => {
    if (current3DStage !== 4 || !modelRef.current || !componentRefs.current.size) return

    // // Console log removed

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
        
        // // Console log removed`)
        
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
      // // Console log removed
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
      // // Console log removed
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
      // console.warn('⚠️ Upper Cover not found for stage-8-open-animation')
      return
    }

    // // Console log removed
    
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
      requestRender()
      
      if (progress < 1) {
        stage8OpenAnimationRef.current = requestAnimationFrame(animate)
      } else {
        // // Console log removed
        stage8OpenAnimationRef.current = null
      }
    }
    
    stage8OpenAnimationRef.current = requestAnimationFrame(animate)
  }, [requestRender])

  const stage8CloseAnimation = useCallback(() => {
    if (!upperCoverRef.current || !upperCoverOriginalPosition.current) {
      // console.warn('⚠️ Upper Cover not found for stage-8-close-animation')
      return
    }

    // // Console log removed
    
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
      requestRender()
      
      if (progress < 1) {
        stage8CloseAnimationRef.current = requestAnimationFrame(animate)
      } else {
        // // Console log removed
        stage8CloseAnimationRef.current = null
      }
    }
    
    stage8CloseAnimationRef.current = requestAnimationFrame(animate)
  }, [requestRender])

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
  }, [onAnimationFunctionsReady])


  // OLED Display texture is now applied immediately when model loads
  // No need for stage-based application

  // Stage 8 Upper Cover Animations
  useEffect(() => {
    if (current3DStage === 8) {
      // // Console log removed
      // Cancel any existing close animation
      if (stage8CloseAnimationRef.current) {
        cancelAnimationFrame(stage8CloseAnimationRef.current)
        stage8CloseAnimationRef.current = null
      }
      // Start open animation
      stage8OpenAnimation()
    } else if (current3DStage !== 8 && upperCoverRef.current) {
      // // Console log removed
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
})

export default ThreeSceneManager
