'use client'

import { useEffect, useRef, useCallback, memo, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { StageConfig, stage0Config, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config } from './index'
import { ComponentControls, CategoryVisibility, categoryComponentMap } from '../DevControls/sections/product3d/types'
import { CameraControls } from '../../store/useAppStore'

interface ThreeSceneManagerProps {
  mountRef: React.RefObject<HTMLDivElement>
  modelControls: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale: { x: number; y: number; z: number }
  }
  cameraControls: CameraControls
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
  current3DStage: number
  componentControls: ComponentControls
  categoryVisibility: CategoryVisibility
  onComponentControlsChange?: (controls: ComponentControls) => void
  onLoadingProgress?: (progress: number) => void
  onLoadingComplete?: () => void
  isActive?: boolean
}

const ThreeSceneManager = memo(function ThreeSceneManager({
  mountRef,
  modelControls,
  cameraControls,
  lightingControls,
  current3DStage,
  componentControls,
  categoryVisibility,
  onComponentControlsChange,
  onLoadingProgress,
  onLoadingComplete,
  isActive = true
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
  const oledTextureRef = useRef<THREE.Texture | null>(null)
  const upperCoverTextureRef = useRef<THREE.Texture | null>(null)
  const lowerSideMainTextureRef = useRef<THREE.Texture | null>(null)
  const productComponentsTextureRef = useRef<THREE.Texture | null>(null)
  const knobsTextureRef = useRef<THREE.Texture | null>(null)
  const loadingMaterialCoverTextureRef = useRef<THREE.Texture | null>(null)
  const upperSideMainHolderTextureRef = useRef<THREE.Texture | null>(null)
  
  // Rendering state tracking
  const isRenderingRef = useRef<boolean>(false)
  const needsRenderRef = useRef<boolean>(false)
  
  // Mobile detection and device capability assessment
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)

  // Enhanced device detection effect
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const isMobileDevice = width < 768
      
      // Detect low-end devices based on hardware capabilities
      const isLowEnd = 
        navigator.hardwareConcurrency <= 4 || // Low CPU cores
        (navigator as any).deviceMemory <= 4 || // Low RAM (if available)
        /Android.*Chrome\/[0-5][0-9]|iPhone.*Safari\/[0-5][0-9]|iPad.*Safari\/[0-5][0-9]/.test(navigator.userAgent) || // Old browsers
        /Android.*Chrome\/[0-9][0-9]/.test(navigator.userAgent) && width < 480 // Small Android devices
      
      setIsMobile(isMobileDevice)
      setIsLowEndDevice(isLowEnd)
      
      console.log('📱 Device detection:', {
        isMobile: isMobileDevice,
        isLowEnd,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        userAgent: navigator.userAgent.substring(0, 50)
      })
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // Helper functions for rendering
  const requestRender = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }, [])

  // Force dev control updates (replicating useEffect logic)
  const forceDevControlUpdates = useCallback(() => {
    console.log('🔄 Force updating all dev controls after model load')
    console.log('📊 Current dev control values:', {
      modelControls,
      cameraControls,
      lightingControls
    })
    
    // Update model controls
    if (modelRef.current) {
      const model = modelRef.current
      const { scale, position, rotation } = modelControls
      
      // Keep original scale - no mobile scaling
      const adjustedScale = scale
      
      console.log(`Force updating model controls:`, { scale: adjustedScale, position, rotation, isMobile })
      console.log(`Model before update: scale(${model.scale.x}, ${model.scale.y}, ${model.scale.z}), position(${model.position.x}, ${model.position.y}, ${model.position.z}), rotation(${model.rotation.x}, ${model.rotation.y}, ${model.rotation.z})`)
      
      model.scale.set(adjustedScale.x, adjustedScale.y, adjustedScale.z)
      model.position.set(position.x, position.y, position.z)
      model.rotation.set(rotation.x, rotation.y, rotation.z)
      model.updateMatrix()
      model.updateMatrixWorld(true)
      
      console.log(`Model after update: scale(${model.scale.x}, ${model.scale.y}, ${model.scale.z}), position(${model.position.x}, ${model.position.y}, ${model.position.z}), rotation(${model.rotation.x}, ${model.rotation.y}, ${model.rotation.z})`)
    } else {
      console.log('❌ modelRef.current is null during force update')
    }
    
    // Update camera controls
    if (cameraRef.current) {
      const camera = cameraRef.current
      const { position, rotation, target, fov, near, far, zoom } = cameraControls
      
      console.log(`Force updating camera controls:`, { position, rotation, target, fov, near, far, zoom })
      console.log(`Camera before update: position(${camera.position.x}, ${camera.position.y}, ${camera.position.z}), rotation(${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}), fov(${camera.fov})`)
      
      // Apply mobile camera adjustments
      const finalPosition = isMobile ? {
        x: position.x,
        y: position.y + 0.5,
        z: position.z + 2
      } : position
      
      camera.position.set(finalPosition.x, finalPosition.y, finalPosition.z)
      camera.rotation.set(rotation.x, rotation.y, rotation.z)
      camera.lookAt(target.x, target.y, target.z)
      const mobileFOV = fov + 15 // Increase FOV on mobile for wider view
      const finalFOV = isMobile ? mobileFOV : fov
      camera.fov = finalFOV
      camera.near = near
      camera.far = far
      camera.zoom = zoom
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld(true)
      
      console.log(`Camera after update: position(${camera.position.x}, ${camera.position.y}, ${camera.position.z}), rotation(${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}), fov(${camera.fov})`)
    } else {
      console.log('❌ cameraRef.current is null during force update')
    }
    
    // Update lighting controls
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = lightingControls.ambientIntensity
      ambientLightRef.current.color.setHex(parseInt(lightingControls.ambientColor.replace('#', ''), 16))
    }
    
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = lightingControls.directionalIntensity
      directionalLightRef.current.color.setHex(parseInt(lightingControls.directionalColor.replace('#', ''), 16))
      directionalLightRef.current.position.set(lightingControls.directionalPosition.x, lightingControls.directionalPosition.y, lightingControls.directionalPosition.z)
      directionalLightRef.current.target.position.set(lightingControls.directionalTarget.x, lightingControls.directionalTarget.y, lightingControls.directionalTarget.z)
    }
    
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightingControls.pointLightIntensity
      pointLightRef.current.color.setHex(parseInt(lightingControls.pointLightColor.replace('#', ''), 16))
      pointLightRef.current.position.set(lightingControls.pointLightPosition.x, lightingControls.pointLightPosition.y, lightingControls.pointLightPosition.z)
    }
    
    if (spotLightRef.current) {
      spotLightRef.current.intensity = lightingControls.spotLightIntensity
      spotLightRef.current.color.setHex(parseInt(lightingControls.spotLightColor.replace('#', ''), 16))
      spotLightRef.current.position.set(lightingControls.spotLightPosition.x, lightingControls.spotLightPosition.y, lightingControls.spotLightPosition.z)
      spotLightRef.current.target.position.set(lightingControls.spotLightTarget.x, lightingControls.spotLightTarget.y, lightingControls.spotLightTarget.z)
    }
    
    requestRender()
  }, [modelControls, cameraControls, lightingControls, requestRender])

  // Sync dev controls with actual 3D scene values
  // Helper function to check if a number is a power of 2
  const isPowerOfTwo = (value: number): boolean => {
    return (value & (value - 1)) === 0 && value !== 0
  }

  const syncDevControlsWithScene = useCallback(() => {
    console.log('🔄 Syncing dev controls with actual 3D scene values')
    
    if (modelRef.current && cameraRef.current) {
      const model = modelRef.current
      const camera = cameraRef.current
      
      // Get actual scene values
      const actualModelPosition = {
        x: model.position.x,
        y: model.position.y,
        z: model.position.z
      }
      const actualModelRotation = {
        x: model.rotation.x,
        y: model.rotation.y,
        z: model.rotation.z
      }
      const actualModelScale = {
        x: model.scale.x,
        y: model.scale.y,
        z: model.scale.z
      }
      
      const actualCameraPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      }
      const actualCameraRotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z
      }
      
      console.log('📊 Actual scene values:', {
        modelPosition: actualModelPosition,
        modelRotation: actualModelRotation,
        modelScale: actualModelScale,
        cameraPosition: actualCameraPosition,
        cameraRotation: actualCameraRotation
      })
      
      console.log('📊 Current dev control values:', {
        modelControls,
        cameraControls
      })
      
      // Update dev controls to match actual scene values
      // Note: This would require access to the setter functions from the parent component
      // For now, we'll just log the differences
      const positionDiff = {
        x: Math.abs(actualModelPosition.x - modelControls.position.x),
        y: Math.abs(actualModelPosition.y - modelControls.position.y),
        z: Math.abs(actualModelPosition.z - modelControls.position.z)
      }
      
      const rotationDiff = {
        x: Math.abs(actualModelRotation.x - modelControls.rotation.x),
        y: Math.abs(actualModelRotation.y - modelControls.rotation.y),
        z: Math.abs(actualModelRotation.z - modelControls.rotation.z)
      }
      
      console.log('📊 Position differences:', positionDiff)
      console.log('📊 Rotation differences:', rotationDiff)
    }
  }, [modelControls, cameraControls])

  const stopRendering = useCallback(() => {
    // No animation frames to cancel in static scene
  }, [])


  useEffect(() => {
    if (!mountRef.current) return

    console.log('🎯 ThreeSceneManager: Initializing scene for stage', current3DStage)
    console.log('🎯 Model controls:', modelControls)
    console.log('🎯 Camera controls:', cameraControls)
    console.log('🎯 Lighting controls:', lightingControls)

    // Scene setup
    const scene = new THREE.Scene()
    
    // Adjust camera settings for mobile visibility
    const mobileFOV = cameraControls.fov + 5 // Increase FOV on mobile for wider view
    const mobilePosition = {
      x: cameraControls.position.x,
      y: cameraControls.position.y + 0.5, // Move camera slightly higher
      z: cameraControls.position.z + 2    // Move camera further back
    }
    
    const camera = new THREE.PerspectiveCamera(
      isMobile ? mobileFOV : cameraControls.fov, 
      window.innerWidth / window.innerHeight, 
      cameraControls.near, 
      cameraControls.far
    )
    // Optimized renderer settings for immediate responsiveness
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile && !isLowEndDevice,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
      precision: isMobile ? 'lowp' : 'highp',
      alpha: true,
      preserveDrawingBuffer: true, // Keep frame buffer for instant display
      failIfMajorPerformanceCaveat: false, // Don't fail on performance issues
      stencil: false, // Disable stencil buffer for better performance
      depth: true
    })
    
    // Store refs
    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    
    // Initialize texture loader
    textureLoader.current = new THREE.TextureLoader()
    
    // Start rendering loop immediately after scene setup
    console.log('🎬 Starting rendering loop immediately after scene setup')
    let animationId: number | null = null
    let renderCount = 0
    
    const startRenderLoop = () => {
      if (animationId) return // Already running
      
      const render = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          // Only render when active to save performance
          if (isActive) {
            rendererRef.current.render(sceneRef.current, cameraRef.current)
            renderCount++
            if (renderCount % 60 === 0) { // Log every 60 frames only when active
              console.log(`🎬 Render count: ${renderCount}, Scene children: ${sceneRef.current.children.length}, Model ref: ${!!modelRef.current}`)
            }
          }
        }
        
        // Only continue loop if still active
        if (isActive) {
          animationId = requestAnimationFrame(render)
        } else {
          animationId = null
          console.log('⏸️ Rendering loop paused - not in Section 1')
        }
      }
      
      animationId = requestAnimationFrame(render)
    }
    
    const stopRenderLoop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
        console.log('🛑 Stopped rendering loop')
      }
    }
    
    // Start the loop if initially active
    if (isActive) {
      startRenderLoop()
    }
    
    // Store animation ID for cleanup
    const cleanup = () => {
      stopRenderLoop()
    }
    
    // Store functions for external control
    ;(window as any).startRenderLoop = startRenderLoop
    ;(window as any).stopRenderLoop = stopRenderLoop
    
    // Function to create procedural environment
    const createProceduralEnvironment = () => {
      console.log('📦 Creating detailed procedural environment map for reflections')
      
      // Create a more detailed environment for better reflections
      const envGroup = new THREE.Group()
      
      // Create a gradient sky sphere
      const skyGeometry = new THREE.SphereGeometry(100, 64, 32)
      const skyMaterial = new THREE.MeshBasicMaterial({
        color: 0x87CEEB, // Sky blue
        side: THREE.BackSide
      })
      const skySphere = new THREE.Mesh(skyGeometry, skyMaterial)
      envGroup.add(skySphere)
      
      // Add some clouds for more interesting reflections
      for (let i = 0; i < 5; i++) {
        const cloudGeometry = new THREE.SphereGeometry(15 + Math.random() * 10, 16, 8)
        const cloudMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.8
        })
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
        cloud.position.set(
          (Math.random() - 0.5) * 200,
          Math.random() * 50 + 20,
          (Math.random() - 0.5) * 200
        )
        cloud.scale.set(1, 0.5, 1)
        envGroup.add(cloud)
      }
      
      // Add some ground elements for floor reflections
      const groundGeometry = new THREE.PlaneGeometry(200, 200)
      const groundMaterial = new THREE.MeshBasicMaterial({
        color: 0x90EE90, // Light green
        side: THREE.DoubleSide
      })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -50
      envGroup.add(ground)
      
      scene.add(envGroup)
      
      // Generate environment map from the detailed scene
      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      const generatedEnvMap = pmremGenerator.fromScene(scene).texture
      scene.environment = generatedEnvMap
      
      // Remove the temporary environment group
      scene.remove(envGroup)
      
      console.log('✅ Procedural environment map created for reflections')
    }

    // Create environment map for reflections
    const createEnvironmentMap = () => {
      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      
      // Create a simple environment map using a cube texture
      let envMap = null
      try {
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        
        // Load each face individually to ensure proper error handling
        const loadCubemapFace = (url: string) => {
          return new Promise<THREE.Texture>((resolve, reject) => {
            const loader = new THREE.TextureLoader()
            loader.load(
              url,
              (texture) => {
                // Ensure texture is properly configured
                texture.wrapS = THREE.ClampToEdgeWrapping
                texture.wrapT = THREE.ClampToEdgeWrapping
                texture.minFilter = THREE.LinearFilter
                texture.magFilter = THREE.LinearFilter
                texture.generateMipmaps = false
                texture.format = THREE.RGBAFormat
                texture.type = THREE.UnsignedByteType
                resolve(texture)
              },
              undefined,
              reject
            )
          })
        }
        
        // Load all faces
        const faceUrls = [
          '/img/skybox/px.jpg', // positive x
          '/img/skybox/nx.jpg', // negative x
          '/img/skybox/py.jpg', // positive y
          '/img/skybox/ny.jpg', // negative y
          '/img/skybox/pz.jpg', // positive z
          '/img/skybox/nz.jpg'  // negative z
        ]
        
        Promise.all(faceUrls.map(loadCubemapFace))
          .then((textures) => {
            // Create cubemap from loaded textures
            envMap = new THREE.CubeTexture(textures)
            
            // Configure the cubemap to prevent WebGL errors
            envMap.format = THREE.RGBAFormat
            envMap.type = THREE.UnsignedByteType
            envMap.generateMipmaps = false
            envMap.minFilter = THREE.LinearFilter
            envMap.magFilter = THREE.LinearFilter
            envMap.wrapS = THREE.ClampToEdgeWrapping
            envMap.wrapT = THREE.ClampToEdgeWrapping
            
            // Set the environment map
            scene.environment = envMap
            console.log('✅ Cubemap environment loaded successfully')
          })
          .catch((error) => {
            console.warn('Failed to load skybox textures, using procedural environment:', error)
            createProceduralEnvironment()
          })
      } catch (error) {
        console.warn('Failed to load skybox textures, using procedural environment:', error)
        createProceduralEnvironment()
      }
      
      console.log('✅ Environment map creation initiated')
    }
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x1a1a1a)
    
    // Mobile-optimized pixel ratio and shadow settings
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = !isMobile && !isLowEndDevice
    renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap
    
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    
    // Mobile-specific optimizations
    if (isMobile) {
      renderer.domElement.style.imageRendering = 'optimizeSpeed'
      renderer.domElement.style.willChange = 'transform'
      renderer.domElement.style.transform = 'translateZ(0)' // Force GPU layer
    }
    
    // Add sophisticated focus effect with depth of field and periphery darkening
    const applyFocusEffect = () => {
      if (cameraControls.focusDistance && cameraControls.aperture && cameraControls.maxBlur) {
        const focusDistance = cameraControls.focusDistance
        const aperture = cameraControls.aperture
        const maxBlur = cameraControls.maxBlur
        const bokehScale = cameraControls.bokehScale || 2
        const darkenPeriphery = cameraControls.darkenPeriphery || 0.3
        
        const canvas = renderer.domElement
        const parent = canvas.parentNode
        
        if (!parent) return
        
        // Remove any existing focus effects
        const existingWrapper = parent.querySelector('.focus-effect-wrapper')
        if (existingWrapper) {
          parent.removeChild(existingWrapper)
        }
        
        // Create wrapper for the focus effect
        const wrapper = document.createElement('div')
        wrapper.className = 'focus-effect-wrapper'
        wrapper.style.position = 'relative'
        wrapper.style.width = '100%'
        wrapper.style.height = '100%'
        wrapper.style.overflow = 'hidden'
        
        // Create the blurred background layer
        const blurredLayer = document.createElement('canvas')
        blurredLayer.width = canvas.width
        blurredLayer.height = canvas.height
        blurredLayer.style.position = 'absolute'
        blurredLayer.style.top = '0'
        blurredLayer.style.left = '0'
        blurredLayer.style.width = '100%'
        blurredLayer.style.height = '100%'
        blurredLayer.style.filter = `blur(${maxBlur * 30}px)`
        blurredLayer.style.transform = 'scale(1.1)' // Slight scale to avoid edge artifacts
        
        // Create the sharp foreground layer (center focus)
        const sharpLayer = document.createElement('canvas')
        sharpLayer.width = canvas.width
        sharpLayer.height = canvas.height
        sharpLayer.style.position = 'absolute'
        sharpLayer.style.top = '0'
        sharpLayer.style.left = '0'
        sharpLayer.style.width = '100%'
        sharpLayer.style.height = '100%'
        
        // Create radial mask for the sharp layer
        const mask = document.createElement('div')
        mask.style.position = 'absolute'
        mask.style.top = '0'
        mask.style.left = '0'
        mask.style.width = '100%'
        mask.style.height = '100%'
        mask.style.background = `radial-gradient(circle at center, 
          transparent 0%, 
          transparent 30%, 
          rgba(0,0,0,0.05) 50%, 
          rgba(0,0,0,${darkenPeriphery}) 70%, 
          rgba(0,0,0,${darkenPeriphery + 0.1}) 100%)`
        mask.style.pointerEvents = 'none'
        mask.style.zIndex = '3'
        
        // Create the sharp area mask (inverted)
        const sharpMask = document.createElement('div')
        sharpMask.style.position = 'absolute'
        sharpMask.style.top = '0'
        sharpMask.style.left = '0'
        sharpMask.style.width = '100%'
        sharpMask.style.height = '100%'
        sharpMask.style.background = `radial-gradient(circle at center, 
          rgba(255,255,255,1) 0%, 
          rgba(255,255,255,1) 30%, 
          rgba(255,255,255,0.8) 40%, 
          rgba(255,255,255,0) 50%, 
          rgba(255,255,255,0) 100%)`
        sharpMask.style.pointerEvents = 'none'
        sharpMask.style.zIndex = '2'
        sharpMask.style.mixBlendMode = 'multiply'
        
        // Function to copy canvas content
        const copyCanvasContent = () => {
          const ctx = blurredLayer.getContext('2d')
          const sharpCtx = sharpLayer.getContext('2d')
          if (ctx && sharpCtx) {
            ctx.drawImage(canvas, 0, 0)
            sharpCtx.drawImage(canvas, 0, 0)
          }
        }
        
        // Initial copy
        copyCanvasContent()
        
        // Set up the layers
        wrapper.appendChild(blurredLayer)
        wrapper.appendChild(sharpLayer)
        wrapper.appendChild(sharpMask)
        wrapper.appendChild(mask)
        
        // Replace the original canvas with our wrapper
        parent.insertBefore(wrapper, canvas)
        wrapper.appendChild(canvas)
        
        // Hide the original canvas and show our composite
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.zIndex = '1'
        
        // Update the blurred layer on each render
        const originalRender = rendererRef.current?.render
        if (originalRender && rendererRef.current) {
          rendererRef.current.render = function(scene: THREE.Scene, camera: THREE.Camera) {
            originalRender.call(this, scene, camera)
            copyCanvasContent()
          }
        }
      }
    }
    
    // Apply focus effect
    applyFocusEffect()

    // Create environment map for reflections
    createEnvironmentMap()

    // No fog effect - completely clear scene
    
       // Create a complete room environment
       const createRoomEnvironment = () => {
         console.log('🏠 Creating room environment')
         
        // Create realistic wall materials
        const createWallMaterial = () => {
          const canvas = document.createElement('canvas')
          canvas.width = 2048
          canvas.height = 2048
          const context = canvas.getContext('2d')
          
          if (context) {
            // Create a warm, realistic wall color gradient
            const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
            gradient.addColorStop(0, '#f5f1eb') // Warm cream at top
            gradient.addColorStop(0.2, '#ede7dc') // Light beige
            gradient.addColorStop(0.5, '#e6ddd4') // Medium beige
            gradient.addColorStop(0.8, '#ddd4c7') // Darker beige
            gradient.addColorStop(1, '#d4c9ba') // Warm brown at bottom
            
            context.fillStyle = gradient
            context.fillRect(0, 0, canvas.width, canvas.height)
            
            // Add realistic wall texture patterns
            context.fillStyle = 'rgba(200, 190, 180, 0.1)'
            
            // Add subtle vertical lines (wall seams)
            for (let x = 0; x < canvas.width; x += 200) {
              context.fillRect(x, 0, 2, canvas.height)
            }
            
            // Add horizontal lines (wall panels)
            for (let y = 0; y < canvas.height; y += 300) {
              context.fillRect(0, y, canvas.width, 1)
            }
            
            // Add subtle noise and texture
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            
            for (let i = 0; i < data.length; i += 4) {
              // Add fine noise for texture
              const noise = (Math.random() - 0.5) * 12
              data[i] = Math.max(0, Math.min(255, data[i] + noise))
              data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
              data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
              
              // Add occasional darker spots (imperfections)
              if (Math.random() < 0.01) {
                data[i] = Math.max(0, data[i] - 20)
                data[i + 1] = Math.max(0, data[i + 1] - 20)
                data[i + 2] = Math.max(0, data[i + 2] - 20)
              }
            }
            
            context.putImageData(imageData, 0, 0)
            
            const wallTexture = new THREE.CanvasTexture(canvas)
            wallTexture.wrapS = THREE.RepeatWrapping
            wallTexture.wrapT = THREE.RepeatWrapping
            wallTexture.repeat.set(2, 2) // Repeat for larger walls
            wallTexture.generateMipmaps = false
            wallTexture.minFilter = THREE.LinearFilter
            wallTexture.magFilter = THREE.LinearFilter
            wallTexture.anisotropy = 16
            
            // Create normal map for surface detail
            const normalCanvas = document.createElement('canvas')
            normalCanvas.width = 512
            normalCanvas.height = 512
            const normalContext = normalCanvas.getContext('2d')
            
            if (normalContext) {
              // Create a subtle normal map
              const normalGradient = normalContext.createLinearGradient(0, 0, 0, normalCanvas.height)
              normalGradient.addColorStop(0, '#8080ff')
              normalGradient.addColorStop(0.5, '#8080ff')
              normalGradient.addColorStop(1, '#8080ff')
              
              normalContext.fillStyle = normalGradient
              normalContext.fillRect(0, 0, normalCanvas.width, normalCanvas.height)
              
              // Add subtle normal variations
              const normalImageData = normalContext.getImageData(0, 0, normalCanvas.width, normalCanvas.height)
              const normalData = normalImageData.data
              
              for (let i = 0; i < normalData.length; i += 4) {
                const variation = (Math.random() - 0.5) * 20
                normalData[i] = Math.max(0, Math.min(255, 128 + variation))
                normalData[i + 1] = Math.max(0, Math.min(255, 128 + variation))
                normalData[i + 2] = Math.max(0, Math.min(255, 255 + variation))
              }
              
              normalContext.putImageData(normalImageData, 0, 0)
              
              const normalTexture = new THREE.CanvasTexture(normalCanvas)
              normalTexture.wrapS = THREE.RepeatWrapping
              normalTexture.wrapT = THREE.RepeatWrapping
              normalTexture.repeat.set(2, 2)
              normalTexture.generateMipmaps = false
              normalTexture.minFilter = THREE.LinearFilter
              normalTexture.magFilter = THREE.LinearFilter
              
              return new THREE.MeshPhysicalMaterial({
                map: wallTexture,
                normalMap: normalTexture,
                normalScale: new THREE.Vector2(0.3, 0.3),
                roughness: 0.8,
                metalness: 0.0,
                transparent: false,
                opacity: 1,
                side: THREE.DoubleSide
              })
            }
            
            return new THREE.MeshPhysicalMaterial({
              map: wallTexture,
              roughness: 0.8,
              metalness: 0.0,
              transparent: false,
              opacity: 1,
              side: THREE.DoubleSide
            })
          } else {
            return new THREE.MeshPhysicalMaterial({
              color: 0xe6ddd4,
              roughness: 0.8,
              metalness: 0.0,
              transparent: false,
              opacity: 1,
              side: THREE.DoubleSide
            })
          }
        }

         // Create realistic floor material
         const createFloorMaterial = () => {
           const canvas = document.createElement('canvas')
           canvas.width = 1024
           canvas.height = 1024
           const context = canvas.getContext('2d')
           
           if (context) {
             // Create a warm wood-like floor gradient
             const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
             gradient.addColorStop(0, '#f4f1ed') // Light wood
             gradient.addColorStop(0.3, '#ede6dc') // Medium wood
             gradient.addColorStop(0.7, '#e0d5c7') // Darker wood
             gradient.addColorStop(1, '#d4c4b0') // Dark wood
             
             context.fillStyle = gradient
             context.fillRect(0, 0, canvas.width, canvas.height)
             
             // Add wood grain pattern
             context.strokeStyle = 'rgba(180, 160, 140, 0.3)'
             context.lineWidth = 1
             
             // Vertical wood grain lines
             for (let x = 0; x < canvas.width; x += 20) {
               context.beginPath()
               context.moveTo(x + Math.random() * 5, 0)
               context.lineTo(x + Math.random() * 5, canvas.height)
               context.stroke()
             }
             
             // Horizontal wood planks
             for (let y = 0; y < canvas.height; y += 80) {
               context.strokeStyle = 'rgba(160, 140, 120, 0.4)'
               context.lineWidth = 2
               context.beginPath()
               context.moveTo(0, y)
               context.lineTo(canvas.width, y)
               context.stroke()
             }
             
             // Add subtle noise and texture
             const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
             const data = imageData.data
             
             for (let i = 0; i < data.length; i += 4) {
               // Add fine noise for wood texture
               const noise = (Math.random() - 0.5) * 8
               data[i] = Math.max(0, Math.min(255, data[i] + noise))
               data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
               data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
               
               // Add occasional wood knots
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
             floorTexture.repeat.set(3, 3) // Repeat for larger floor
             floorTexture.generateMipmaps = false
             floorTexture.minFilter = THREE.LinearFilter
             floorTexture.magFilter = THREE.LinearFilter
             floorTexture.anisotropy = 16
             
             return new THREE.MeshPhysicalMaterial({
               map: floorTexture,
               roughness: 0.6, // Slightly glossy wood
               metalness: 0.0,
               transparent: false,
               opacity: 1,
               side: THREE.DoubleSide
             })
          } else {
             return new THREE.MeshPhysicalMaterial({
               color: 0xe0d5c7,
               roughness: 0.6,
               metalness: 0.0,
               transparent: false,
               opacity: 1,
               side: THREE.DoubleSide
             })
           }
         }

         const wallMaterial = createWallMaterial()
         const floorMaterial = createFloorMaterial()
         
         // Create ceiling material (lighter than walls)
         const createCeilingMaterial = () => {
           const canvas = document.createElement('canvas')
           canvas.width = 1024
           canvas.height = 1024
           const context = canvas.getContext('2d')
           
           if (context) {
             // Create a light ceiling gradient
             const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
             gradient.addColorStop(0, '#faf9f7') // Very light cream
             gradient.addColorStop(0.5, '#f5f3f0') // Light cream
             gradient.addColorStop(1, '#f0ede8') // Slightly darker cream
             
             context.fillStyle = gradient
             context.fillRect(0, 0, canvas.width, canvas.height)
             
             // Add subtle ceiling texture
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
               roughness: 0.9, // Matte ceiling
               metalness: 0.0,
               transparent: false,
               opacity: 1,
               side: THREE.DoubleSide
             })
           } else {
             return new THREE.MeshPhysicalMaterial({
               color: 0xf5f3f0,
               roughness: 0.9,
               metalness: 0.0,
               transparent: false,
               opacity: 1,
               side: THREE.DoubleSide
             })
           }
         }
         
         const ceilingMaterial = createCeilingMaterial()
         
         // Room dimensions (larger to accommodate furniture)
         const roomWidth = 25
         const roomDepth = 20
         const roomHeight = 20 // Doubled from 10 to 20
         
         // 1. Back Wall (behind the furniture)
         const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight)
         const backWall = new THREE.Mesh(backWallGeometry, wallMaterial)
         backWall.position.set(0, roomHeight/2, -roomDepth/2)
         scene.add(backWall)
         console.log('✅ Back wall added to room')
         
         // 2. Left Wall
         const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
         const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial)
         leftWall.position.set(-roomWidth/2, roomHeight/2, 0)
         leftWall.rotation.y = Math.PI / 2
         scene.add(leftWall)
         console.log('✅ Left wall added to room')
         
         // 3. Right Wall
         const rightWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight)
         const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial)
         rightWall.position.set(roomWidth/2, roomHeight/2, 0)
         rightWall.rotation.y = -Math.PI / 2
         scene.add(rightWall)
         console.log('✅ Right wall added to room')
         
         // 4. Floor
         const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
         const floor = new THREE.Mesh(floorGeometry, floorMaterial)
         floor.position.set(0, 0, 0)
         floor.rotation.x = -Math.PI / 2
         scene.add(floor)
         console.log('✅ Floor added to room')
         
         // 5. Ceiling
         const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth)
         const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial)
         ceiling.position.set(0, roomHeight, 0)
         ceiling.rotation.x = Math.PI / 2
         scene.add(ceiling)
         console.log('✅ Ceiling added to room')
         
         console.log('✅ Complete room environment created with walls, floor, and ceiling')
       }
    
    // Create room environment
    createRoomEnvironment()
    
    // Apply z-index container class to the mount element
    mountRef.current.className = 'three-scene-container'
    mountRef.current.appendChild(renderer.domElement)

    // Add lighting with mobile optimizations
    const ambientLight = new THREE.AmbientLight(
      lightingControls.ambientColor, 
      isMobile ? lightingControls.ambientIntensity * 0.8 : lightingControls.ambientIntensity
    )
    
    const directionalLight = new THREE.DirectionalLight(
      lightingControls.directionalColor, 
      isMobile ? lightingControls.directionalIntensity * 0.7 : lightingControls.directionalIntensity
    )
    
    // Reduce light count on mobile for better performance
    let pointLight = null
    let spotLight = null
    
    if (!isMobile && !isLowEndDevice) {
      pointLight = new THREE.PointLight(
        lightingControls.pointLightColor, 
        lightingControls.pointLightIntensity, 
        lightingControls.pointLightDistance
      )
      spotLight = new THREE.SpotLight(
        lightingControls.spotLightColor, 
        lightingControls.spotLightIntensity, 
        lightingControls.spotLightDistance, 
        lightingControls.spotLightAngle * Math.PI / 180, 
        lightingControls.spotLightPenumbra
      )
    }
    
    // Configure directional light
    directionalLight.position.set(lightingControls.directionalPosition.x, lightingControls.directionalPosition.y, lightingControls.directionalPosition.z)
    directionalLight.target.position.set(lightingControls.directionalTarget.x, lightingControls.directionalTarget.y, lightingControls.directionalTarget.z)
    directionalLight.castShadow = lightingControls.shadowsEnabled
    directionalLight.shadow.mapSize.width = lightingControls.shadowMapSize
    directionalLight.shadow.mapSize.height = lightingControls.shadowMapSize
    directionalLight.shadow.bias = lightingControls.shadowBias
    
    // Configure point light
    if (pointLight) {
      pointLight.position.set(lightingControls.pointLightPosition.x, lightingControls.pointLightPosition.y, lightingControls.pointLightPosition.z)
      pointLight.castShadow = lightingControls.shadowsEnabled
    }
    
    // Configure spot light
    if (spotLight) {
      spotLight.position.set(lightingControls.spotLightPosition.x, lightingControls.spotLightPosition.y, lightingControls.spotLightPosition.z)
      spotLight.target.position.set(lightingControls.spotLightTarget.x, lightingControls.spotLightTarget.y, lightingControls.spotLightTarget.z)
      spotLight.castShadow = lightingControls.shadowsEnabled
    }
    
    // Store light refs
    ambientLightRef.current = ambientLight
    directionalLightRef.current = directionalLight
    pointLightRef.current = pointLight
    spotLightRef.current = spotLight
    
    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(directionalLight.target)
    
    // Only add additional lights on desktop
    if (pointLight) {
      scene.add(pointLight)
    }
    if (spotLight) {
      scene.add(spotLight)
      scene.add(spotLight.target)
    }
    
    // Force render after lighting is set up
    requestRender()

    // Load the furniture environment
    const furnitureLoader = new GLTFLoader()
    furnitureLoader.load(
      '/product-3d/Furniture_No-23.glb',
      (furnitureGltf) => {
        console.log('✅ Furniture environment loaded successfully:', furnitureGltf)
        const furniture = furnitureGltf.scene
        
        // Position and scale the furniture environment to sit on the floor in front of the back wall
        furniture.position.set(0, 0, -8) // Move towards the back wall (room depth is 20, so -8 is closer to back wall)
        furniture.scale.set(1, 1, 1)
        
        // Ensure furniture is properly positioned on the floor
        // Find the lowest point of the furniture and adjust accordingly
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
        
        // Adjust furniture position so the bottom touches the floor
        if (minY !== Infinity) {
          furniture.position.y = -minY
          console.log(`✅ Furniture adjusted to floor level. Min Y was: ${minY}, adjusted to: ${furniture.position.y}`)
        }
        
        // Add the furniture to the scene
        scene.add(furniture)
        console.log('✅ Furniture environment added to scene')
        
        // Apply reflection materials to mirror surfaces and force material updates for furniture
        furniture.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            // Check if this might be a mirror surface based on name or material properties
            const isMirrorSurface = child.name.toLowerCase().includes('mirror') || 
                                  child.name.toLowerCase().includes('glass') ||
                                  child.name.toLowerCase().includes('reflection') ||
                                  (child.material && child.material.name && 
                                   (child.material.name.toLowerCase().includes('mirror') || 
                                    child.material.name.toLowerCase().includes('glass')))
            
            // Also check for dark/black materials that might be mirrors
            const isDarkMaterial = child.material.color && 
                                 (child.material.color.getHex() === 0x000000 || 
                                  child.material.color.getHex() === 0x1a1a1a ||
                                  child.material.color.getHex() === 0x333333)
            
            // Check for flat surfaces that might be mirrors (based on geometry)
            const isFlatSurface = child.geometry && 
                                 child.geometry.boundingBox && 
                                 (Math.abs(child.geometry.boundingBox.max.y - child.geometry.boundingBox.min.y) < 0.1 ||
                                  Math.abs(child.geometry.boundingBox.max.x - child.geometry.boundingBox.min.x) < 0.1 ||
                                  Math.abs(child.geometry.boundingBox.max.z - child.geometry.boundingBox.min.z) < 0.1)
            
            // Check for materials with high specular properties that might be mirrors
            const isSpecularMaterial = child.material && 
                                     (child.material.specular || 
                                      (child.material.metalness && child.material.metalness > 0.8) ||
                                      (child.material.roughness && child.material.roughness < 0.1))
            
            if (isMirrorSurface || isDarkMaterial || isFlatSurface || isSpecularMaterial) {
              console.log('🪞 Found mirror surface:', child.name, 'applying realistic mirror material')
              console.log('🪞 Detection reasons:', {
                isMirrorSurface,
                isDarkMaterial,
                isFlatSurface,
                isSpecularMaterial,
                materialColor: child.material.color ? child.material.color.getHex() : 'no color',
                materialName: child.material.name || 'unnamed'
              })
              
              // Create a highly realistic mirror material
              const mirrorMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 0.0, // Pure mirror, not metallic
                roughness: 0.0, // Perfectly smooth surface
                reflectivity: 1.0, // Maximum reflectivity
                clearcoat: 1.0, // Perfect clear coating
                clearcoatRoughness: 0.0, // Perfectly smooth clear coat
                envMap: scene.environment,
                envMapIntensity: 2.0, // Enhanced environment reflection
                transmission: 0.0, // No transmission for pure mirror
                transparent: false,
                opacity: 1.0,
                side: THREE.DoubleSide, // Render both sides for better reflections
                // Additional properties for realism
                ior: 1.5, // Index of refraction for glass
                sheen: 0.0, // No sheen for pure mirror
                sheenRoughness: 0.0,
                sheenColor: 0xffffff
              })
              
              // Apply the mirror material
              child.material = mirrorMaterial
              console.log('✅ Applied realistic mirror material to:', child.name)
            }
            
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: THREE.Material) => {
                mat.needsUpdate = true
              })
            } else {
              child.material.needsUpdate = true
            }
            child.updateMatrix()
            child.updateMatrixWorld(true)
          }
        })
        
        // Force render after furniture is added
        requestRender()
      },
      (progress) => {
        if (progress.total > 0) {
          console.log('Furniture loading progress:', (progress.loaded / progress.total) * 100 + '%')
        }
      },
      (error) => {
        console.error('❌ Error loading furniture environment:', error)
      }
    )

    // Model loading is now handled in a separate useEffect
      const loader = new GLTFLoader()
      let model: THREE.Group | null = null

      // Track loading progress
      let loadingProgress = 0
      const updateProgress = (progress: number) => {
        loadingProgress = progress
        onLoadingProgress?.(progress)
      }

      console.log('🎯 Loading 3D model for Section 1')

      loader.load(
      '/product-3d/Color_Brush_assembly_V1_1.glb', 
      (gltf) => {
      console.log('✅ Model loaded successfully:', gltf)
      updateProgress(30) // Model loaded
      model = gltf.scene
      modelRef.current = model
      console.log('✅ Model added to ref:', model)
      
      // Make model visible immediately upon loading
      model.visible = true
      model.traverse((child) => {
        child.visible = true
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
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
                
                // Store original position
                child.userData.originalPosition = {
                  x: child.position.x,
                  y: child.position.y,
                  z: child.position.z
                }
                
                // // Console log removed
                
                // Store Upper Cover reference
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
      
      // Model loaded without animations (static scene)
      
      // Enable shadows for the model
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Apply initial controls - no mobile scaling
      const adjustedScale = modelControls.scale
      
      model.scale.set(adjustedScale.x, adjustedScale.y, adjustedScale.z)
      model.position.set(modelControls.position.x, modelControls.position.y, modelControls.position.z)
      model.rotation.set(modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z)
      
      // Ensure model is visible
      model.visible = true
      
      // Make sure all children are visible and have proper materials
      model.traverse((child) => {
        child.visible = true
        
        // Ensure meshes have materials
        if (child instanceof THREE.Mesh) {
          if (!child.material) {
            console.warn('⚠️ Mesh without material found:', child.name)
            child.material = new THREE.MeshBasicMaterial({ color: 0x888888 })
          }
          
          // Ensure material is visible
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
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
      
      console.log('✅ Model positioned:', {
        position: model.position,
        scale: model.scale,
        rotation: model.rotation,
        visible: model.visible
      })
      
      scene.add(model)
      console.log('✅ Model added to scene. Scene children count:', scene.children.length)
      console.log('✅ Model position after adding:', model.position)
      console.log('✅ Model scale after adding:', model.scale)
      console.log('✅ Model visible after adding:', model.visible)
      
      // Force immediate render to show the model
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        console.log('🎨 Immediate render after model added')
      }

      // Set initial camera position, rotation, and target with mobile adjustments
      const initialPosition = isMobile ? {
        x: cameraControls.position.x,
        y: cameraControls.position.y + 0.5,
        z: cameraControls.position.z + 2
      } : cameraControls.position
      
      camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
      camera.rotation.set(cameraControls.rotation.x, cameraControls.rotation.y, cameraControls.rotation.z)
      camera.lookAt(cameraControls.target.x, cameraControls.target.y, cameraControls.target.z)
      camera.zoom = cameraControls.zoom
      console.log('✅ Camera positioned:', camera.position)
      console.log('✅ Camera rotation:', camera.rotation)
      
      // Force immediate render after camera setup
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        console.log('🎨 Immediate render after camera setup')
      }
      
      console.log('✅ Camera target:', cameraControls.target)
      console.log('✅ Camera zoom:', camera.zoom)
      
      // Debug camera and model positioning
      if (model) {
        const distance = camera.position.distanceTo(model.position)
        console.log('📏 Camera to model distance:', distance)
        console.log('📐 Camera FOV:', camera.fov)
        console.log('📐 Camera aspect ratio:', camera.aspect)
        console.log('📐 Camera position:', camera.position)
        console.log('📐 Camera target:', cameraControls.target)
        console.log('📐 Model position:', model.position)
        
        // Calculate model bounding box
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        console.log('📐 Model bounding box size:', size)
        console.log('📐 Model bounding box center:', center)
        
        // Ensure camera is looking at the model center
        camera.lookAt(center)
        console.log('📐 Camera now looking at model center:', center)
        
        // Final render after camera adjustment
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
          console.log('🎨 Final render after camera adjustment')
        }
      }
      
      // Force material and matrix updates
      model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          // Update material properties
          if (Array.isArray(child.material)) {
            child.material.forEach((mat: THREE.Material) => {
              mat.needsUpdate = true
            })
          } else {
            child.material.needsUpdate = true
          }
          // Update matrices
          child.updateMatrix()
          child.updateMatrixWorld(true)
        }
      })
      
      // Force lighting updates
      if (ambientLightRef.current) {
        ambientLightRef.current.intensity = lightingControls.ambientIntensity
        ambientLightRef.current.color.setHex(parseInt(lightingControls.ambientColor.replace('#', '0x')))
      }
      if (directionalLightRef.current) {
        directionalLightRef.current.intensity = lightingControls.directionalIntensity
        directionalLightRef.current.color.setHex(parseInt(lightingControls.directionalColor.replace('#', '0x')))
        directionalLightRef.current.position.set(
          lightingControls.directionalPosition.x,
          lightingControls.directionalPosition.y,
          lightingControls.directionalPosition.z
        )
        directionalLightRef.current.target.position.set(
          lightingControls.directionalTarget.x,
          lightingControls.directionalTarget.y,
          lightingControls.directionalTarget.z
        )
      }
      if (pointLightRef.current) {
        pointLightRef.current.intensity = lightingControls.pointLightIntensity
        pointLightRef.current.color.setHex(parseInt(lightingControls.pointLightColor.replace('#', '0x')))
        pointLightRef.current.position.set(
          lightingControls.pointLightPosition.x,
          lightingControls.pointLightPosition.y,
          lightingControls.pointLightPosition.z
        )
      }
      if (spotLightRef.current) {
        spotLightRef.current.intensity = lightingControls.spotLightIntensity
        spotLightRef.current.color.setHex(parseInt(lightingControls.spotLightColor.replace('#', '0x')))
        spotLightRef.current.position.set(
          lightingControls.spotLightPosition.x,
          lightingControls.spotLightPosition.y,
          lightingControls.spotLightPosition.z
        )
        spotLightRef.current.target.position.set(
          lightingControls.spotLightTarget.x,
          lightingControls.spotLightTarget.y,
          lightingControls.spotLightTarget.z
        )
      }
      
      // Force complete scene update
      scene.updateMatrixWorld(true)
      camera.updateMatrixWorld(true)
      model.updateMatrixWorld(true)
      
      // Force render after model is added and positioned
      console.log('✅ Forcing render after model setup with material and lighting updates')
      requestRender()
      
      // Force update all dev controls after model is loaded
      console.log('✅ Forcing dev control updates after model load')
      forceDevControlUpdates()
      
      // Final render after all control updates
      console.log('✅ Final render after all control updates')
      requestRender()
      
      // Additional render after a short delay to ensure everything is applied
      setTimeout(() => {
        console.log('✅ Final render to ensure all settings are applied')
        requestRender()
      }, 200)
      
      // One more render after a longer delay to catch any remaining updates
      setTimeout(() => {
        console.log('✅ Ultimate final render to guarantee correct display')
        forceDevControlUpdates()
        requestRender()
      }, 500)
      
      // Sync dev controls with actual scene values to identify differences
      setTimeout(() => {
        console.log('🔍 Checking dev control vs scene value differences')
        syncDevControlsWithScene()
      }, 600)
      
      // Function to apply texture to OLED Display
      const applyOLEDTexture = (texturePath: string) => {
        if (!textureLoader.current) {
          return
        }
        
        textureLoader.current.load(
          texturePath, 
          (texture) => {
            // Store texture reference for cleanup
            oledTextureRef.current = texture
            
            // Configure texture for OLED display to prevent WebGL errors
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping
            texture.flipY = false
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.generateMipmaps = false
            texture.format = THREE.RGBAFormat
            texture.type = THREE.UnsignedByteType
            
            // Ensure texture is properly sized (power of 2)
            if (texture.image) {
              const width = texture.image.width
              const height = texture.image.height
              if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
                console.warn('OLED texture dimensions are not power of 2, this may cause WebGL issues')
              }
            }
          
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
          texture.generateMipmaps = false
          texture.format = THREE.RGBAFormat
          texture.type = THREE.UnsignedByteType
          
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
          texture.generateMipmaps = false
          texture.format = THREE.RGBAFormat
          texture.type = THREE.UnsignedByteType
          
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
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
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
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
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
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
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
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
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
      
      // Final render to ensure model is visible
      console.log('🎨 Final render after model loading complete')
      requestRender()
      
      }, undefined, (error) => {
        console.error('❌ Model loading failed:', error)
        updateProgress(100) // Still complete loading even if there's an error
        onLoadingComplete?.()
      })

    // Render the scene immediately to show the background and lighting
    console.log('🎨 Rendering initial scene')
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
      
      // Stop rendering loop
      cleanup()
      
      // Stop rendering
      stopRendering()
      
      if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
        try {
          // Check if the element is still in the DOM and is a child of mountRef
          if (mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement)
          }
        } catch (error) {
          // Silently handle the error - the element may have already been removed
          // This is common in React's StrictMode or when components unmount quickly
        }
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

  // Model loading effect - separate from main scene setup
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
      console.log('⏸️ Skipping model loading - scene not ready')
      return
    }

    // Only log when stage changes or when actually loading
    if (current3DStage >= 1) {
      console.log('🔍 Model loading check - current3DStage:', current3DStage, 'condition:', current3DStage >= 1)
    }
    
    // If model is already loaded and we're in stage 1+, don't reload it
    if (modelRef.current && current3DStage >= 1) {
      console.log('✅ Model already loaded, skipping reload to preserve textures')
      onLoadingComplete?.()
      return
    }
    
    // Duplicate model loading block removed to prevent double loading
    if (false) { // Disabled duplicate block
      const loader = new GLTFLoader()
      let model: THREE.Group | null = null

      // Track loading progress
      let loadingProgress = 0
      const updateProgress = (progress: number) => {
        loadingProgress = progress
        onLoadingProgress?.(progress)
      }

      console.log('🎯 Loading 3D model for Section 1')

      loader.load(
      '/product-3d/Color_Brush_assembly_V1_1.glb', 
      (gltf) => {
      console.log('✅ Model loaded successfully:', gltf)
      updateProgress(30) // Model loaded
      model = gltf.scene
      modelRef.current = model
      console.log('✅ Model added to ref:', model)
      
      // Make model visible immediately upon loading
      model.visible = true
      model.traverse((child) => {
        child.visible = true
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
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
      
      // Apply shadows to meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Apply initial controls
      const adjustedScale = modelControls.scale
      model.scale.set(adjustedScale.x, adjustedScale.y, adjustedScale.z)
      model.position.set(modelControls.position.x, modelControls.position.y, modelControls.position.z)
      model.rotation.set(modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z)
      
      // Ensure model is visible
      model.visible = true
      
      // Make sure all children are visible and have proper materials
      model.traverse((child) => {
        child.visible = true
        
        if (child instanceof THREE.Mesh) {
          if (!child.material) {
            console.warn('⚠️ Mesh without material found:', child.name)
            child.material = new THREE.MeshBasicMaterial({ color: 0x888888 })
          }
          
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
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
      
      console.log('✅ Model positioned:', {
        position: model.position,
        scale: model.scale,
        rotation: model.rotation,
        visible: model.visible
      })
      
      if (sceneRef.current) {
        sceneRef.current.add(model)
        console.log('✅ Model added to scene. Scene children count:', sceneRef.current.children.length)
      }
      
      // Force immediate render to show the model
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        console.log('🎨 Immediate render after model added')
      }

      // Update camera to look at model
      if (cameraRef.current) {
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        cameraRef.current.lookAt(center)
        console.log('📐 Camera now looking at model center:', center)
        
        // Final render after camera adjustment
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
          console.log('🎨 Final render after camera adjustment')
        }
      }

      // Map components for individual control
      componentRefs.current.clear()
      model.traverse((child) => {
        if (child.name && child.name !== 'Scene' && child.name !== 'Root') {
          componentRefs.current.set(child.name, child)
        }
      })
      console.log('✅ Component mapping complete. Found', componentRefs.current.size, 'components')

      // Apply textures to the model
      if (textureLoader.current) {
        console.log('🎨 Applying textures to model components')
        
        // Apply OLED texture to specific components
        const oledTexture = textureLoader.current.load('/oled-screen.png', (texture) => {
          console.log('✅ OLED texture loaded successfully')
          oledTextureRef.current = texture
          
          // Apply texture to OLED components
          const oledComponents = ['OLED_Display', 'OLED_Screen', 'Display', 'Screen']
          oledComponents.forEach(componentName => {
            const component = componentRefs.current.get(componentName)
            if (component && component instanceof THREE.Mesh) {
              if (Array.isArray(component.material)) {
                component.material.forEach((material: THREE.MeshStandardMaterial) => {
                  if (material.map) {
                    material.map = texture
                    material.needsUpdate = true
                  }
                })
              } else if (component.material instanceof THREE.MeshStandardMaterial) {
                if (component.material.map) {
                  component.material.map = texture
                  component.material.needsUpdate = true
                }
              }
            }
          })
        }, undefined, (error) => {
          console.error('❌ Error loading OLED texture:', error)
        })

        // Apply other textures
        const upperCoverTexture = textureLoader.current.load('/textures/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg', (texture) => {
          console.log('✅ Upper cover texture loaded successfully')
          upperCoverTextureRef.current = texture
          
          const upperCoverComponents = ['Upper_Cover', 'Top_Cover', 'Cover_Upper']
          upperCoverComponents.forEach(componentName => {
            const component = componentRefs.current.get(componentName)
            if (component && component instanceof THREE.Mesh) {
              if (Array.isArray(component.material)) {
                component.material.forEach((material: THREE.MeshStandardMaterial) => {
                  if (material.map) {
                    material.map = texture
                    material.needsUpdate = true
                  }
                })
              } else if (component.material instanceof THREE.MeshStandardMaterial) {
                if (component.material.map) {
                  component.material.map = texture
                  component.material.needsUpdate = true
                }
              }
            }
          })
        }, undefined, (error) => {
          console.error('❌ Error loading upper cover texture:', error)
        })

        // Apply metal texture to all components (this is the main texture)
        const metalTexture = textureLoader.current.load('/textures/Poliigon_MetalSteelBrushed_7174_BaseColor.jpg', (texture) => {
          console.log('✅ Metal texture loaded successfully')
          
          // Load additional texture maps for realistic material
          if (textureLoader.current) {
            const normalTexture = textureLoader.current.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Normal.png', (normalMap) => {
              console.log('✅ Normal texture loaded successfully')
              
              if (textureLoader.current) {
                const metallicTexture = textureLoader.current.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Metallic.jpg', (metallicMap) => {
                  console.log('✅ Metallic texture loaded successfully')
                  
                  if (textureLoader.current) {
                    const roughnessTexture = textureLoader.current.load('/Poliigon_MetalSteelBrushed_7174/2K/Poliigon_MetalSteelBrushed_7174_Roughness.jpg', (roughnessMap) => {
                console.log('✅ Roughness texture loaded successfully')
                
                // Apply all texture maps to all mesh components
                let textureAppliedCount = 0
                let totalMeshes = 0
                if (model) {
                  model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                      totalMeshes++
                      console.log(`🔍 Found mesh: ${child.name}, has material: ${!!child.material}`)
                      if (child.material) {
                      if (Array.isArray(child.material)) {
                        child.material.forEach((material: THREE.MeshStandardMaterial) => {
                          // Apply textures regardless of whether material.map exists
                          material.map = texture
                          material.normalMap = normalMap
                          material.metalnessMap = metallicMap
                          material.roughnessMap = roughnessMap
                          material.needsUpdate = true
                          textureAppliedCount++
                          console.log(`🎨 Applied complete metal material to ${child.name}`)
                        })
                      } else if (child.material instanceof THREE.MeshStandardMaterial) {
                        // Apply textures regardless of whether material.map exists
                        child.material.map = texture
                        child.material.normalMap = normalMap
                        child.material.metalnessMap = metallicMap
                        child.material.roughnessMap = roughnessMap
                        child.material.needsUpdate = true
                        textureAppliedCount++
                        console.log(`🎨 Applied complete metal material to ${child.name}`)
                      }
                    }
                  }
                  })
                }
                
                console.log(`🔍 Total meshes found: ${totalMeshes}`)
                console.log(`🎨 Complete metal material applied to ${textureAppliedCount} materials`)
                
                // Force a render after textures are applied
                if (rendererRef.current && sceneRef.current && cameraRef.current) {
                  rendererRef.current.render(sceneRef.current, cameraRef.current)
                  console.log('🎨 Rendered after complete metal material application')
                }
                    }, undefined, (error) => {
                      console.error('❌ Error loading roughness texture:', error)
                    })
                  }
                }, undefined, (error) => {
                  console.error('❌ Error loading metallic texture:', error)
                })
              }
            }, undefined, (error) => {
              console.error('❌ Error loading normal texture:', error)
            })
          }
        }, undefined, (error) => {
          console.error('❌ Error loading metal texture:', error)
        })
      }

      // Complete loading
      updateProgress(100)
      onLoadingComplete?.()
      
      // Final render to ensure model is visible
      console.log('🎨 Final render after model loading complete')
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
      
      }, undefined, (error) => {
        console.error('❌ Model loading failed:', error)
        updateProgress(100)
        onLoadingComplete?.()
      })
    } else {
      // Only log once per stage change to reduce spam
      onLoadingComplete?.()
    }
  }, [current3DStage, modelControls, cameraControls, onLoadingProgress, onLoadingComplete])

  // Monitor texture state to debug disappearing textures
  useEffect(() => {
    if (modelRef.current && current3DStage >= 1) {
      const checkTextures = () => {
        let texturedMaterials = 0
        let totalMaterials = 0
        modelRef.current?.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: THREE.MeshStandardMaterial) => {
                totalMaterials++
                if (material.map) {
                  texturedMaterials++
                }
              })
            } else if (child.material instanceof THREE.MeshStandardMaterial) {
              totalMaterials++
              if (child.material.map) {
                texturedMaterials++
              }
            }
          }
        })
        console.log(`🔍 Texture check: ${texturedMaterials}/${totalMaterials} materials have textures`)
      }
      
      // Check textures immediately
      checkTextures()
      
      // Check textures after a delay to see if they disappear
      const timeoutId = setTimeout(checkTextures, 2000)
      
      return () => clearTimeout(timeoutId)
    }
  }, [current3DStage])

  // Force updates when model controls change
  useEffect(() => {
    if (modelRef.current) {
      const model = modelRef.current
      const { scale, position, rotation } = modelControls
      
      // Keep original scale - no mobile scaling
      const adjustedScale = scale
      
      console.log(`ThreeSceneManager: Updating model controls:`, { scale: adjustedScale, position, rotation, isMobile })
      
      // Only update if values have actually changed
      if (model.scale.x !== adjustedScale.x || model.scale.y !== adjustedScale.y || model.scale.z !== adjustedScale.z) {
        console.log(`Updating scale from (${model.scale.x}, ${model.scale.y}, ${model.scale.z}) to (${adjustedScale.x}, ${adjustedScale.y}, ${adjustedScale.z})`)
        model.scale.set(adjustedScale.x, adjustedScale.y, adjustedScale.z)
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
      console.log(`ThreeSceneManager: modelRef.current is null, cannot update model controls - will retry when model loads`)
    }
  }, [modelControls.scale.x, modelControls.scale.y, modelControls.scale.z, modelControls.position.x, modelControls.position.y, modelControls.position.z, modelControls.rotation.x, modelControls.rotation.y, modelControls.rotation.z, isMobile, requestRender])


  // Force updates when camera controls change
  useEffect(() => {
    if (cameraRef.current) {
      const camera = cameraRef.current
      const { position, rotation, target, fov, near, far, zoom } = cameraControls
      
      // Only update if values have actually changed
      const finalPosition = isMobile ? {
        x: position.x,
        y: position.y + 0.2,
        z: position.z + 0.7
      } : position
      
      if (camera.position.x !== finalPosition.x || camera.position.y !== finalPosition.y || camera.position.z !== finalPosition.z) {
        camera.position.set(finalPosition.x, finalPosition.y, finalPosition.z)
      }
      
      if (camera.rotation.x !== rotation.x || camera.rotation.y !== rotation.y || camera.rotation.z !== rotation.z) {
        camera.rotation.set(rotation.x, rotation.y, rotation.z)
      }
      
      if (camera.lookAt) {
        camera.lookAt(target.x, target.y, target.z)
      }
      
      const mobileFOV = fov + 1 // Increase FOV on mobile for wider view
      const finalFOV = isMobile ? mobileFOV : fov
      
      if (camera.fov !== finalFOV || camera.near !== near || camera.far !== far) {
        camera.fov = finalFOV
        camera.near = near
        camera.far = far
        camera.updateProjectionMatrix()
      }
      
      if (camera.zoom !== zoom) {
        camera.zoom = zoom
        camera.updateProjectionMatrix()
      }
      
      // Reapply focus effect when focus parameters change
      if (cameraControls.focusDistance && cameraControls.aperture && cameraControls.maxBlur) {
        const applyFocusEffect = () => {
          const focusDistance = cameraControls.focusDistance
          const aperture = cameraControls.aperture
          const maxBlur = cameraControls.maxBlur
          const bokehScale = cameraControls.bokehScale || 2
          const darkenPeriphery = cameraControls.darkenPeriphery || 0.3
          
          const canvas = rendererRef.current?.domElement
          const parent = canvas?.parentNode
          
          if (!canvas || !parent) return
          
          // Remove any existing focus effects
          const existingWrapper = parent.querySelector('.focus-effect-wrapper')
          if (existingWrapper) {
            parent.removeChild(existingWrapper)
          }
          
          // Create wrapper for the focus effect
          const wrapper = document.createElement('div')
          wrapper.className = 'focus-effect-wrapper'
          wrapper.style.position = 'relative'
          wrapper.style.width = '100%'
          wrapper.style.height = '100%'
          wrapper.style.overflow = 'hidden'
          
          // Create the blurred background layer
          const blurredLayer = document.createElement('canvas')
          blurredLayer.width = canvas.width
          blurredLayer.height = canvas.height
          blurredLayer.style.position = 'absolute'
          blurredLayer.style.top = '0'
          blurredLayer.style.left = '0'
          blurredLayer.style.width = '100%'
          blurredLayer.style.height = '100%'
          blurredLayer.style.filter = `blur(${(maxBlur ?? 0.01) * 30}px)`
          blurredLayer.style.transform = 'scale(1.1)'
          
          // Create the sharp foreground layer (center focus)
          const sharpLayer = document.createElement('canvas')
          sharpLayer.width = canvas.width
          sharpLayer.height = canvas.height
          sharpLayer.style.position = 'absolute'
          sharpLayer.style.top = '0'
          sharpLayer.style.left = '0'
          sharpLayer.style.width = '100%'
          sharpLayer.style.height = '100%'
          
          // Create radial mask for the sharp layer
          const mask = document.createElement('div')
          mask.style.position = 'absolute'
          mask.style.top = '0'
          mask.style.left = '0'
          mask.style.width = '100%'
          mask.style.height = '100%'
          mask.style.background = `radial-gradient(circle at center, 
            transparent 0%, 
            transparent 30%, 
            rgba(0,0,0,0.05) 50%, 
            rgba(0,0,0,${darkenPeriphery}) 70%, 
            rgba(0,0,0,${darkenPeriphery + 0.1}) 100%)`
          mask.style.pointerEvents = 'none'
          mask.style.zIndex = '3'
          
          // Create the sharp area mask (inverted)
          const sharpMask = document.createElement('div')
          sharpMask.style.position = 'absolute'
          sharpMask.style.top = '0'
          sharpMask.style.left = '0'
          sharpMask.style.width = '100%'
          sharpMask.style.height = '100%'
          sharpMask.style.background = `radial-gradient(circle at center, 
            rgba(255,255,255,1) 0%, 
            rgba(255,255,255,1) 30%, 
            rgba(255,255,255,0.8) 40%, 
            rgba(255,255,255,0) 50%, 
            rgba(255,255,255,0) 100%)`
          sharpMask.style.pointerEvents = 'none'
          sharpMask.style.zIndex = '2'
          sharpMask.style.mixBlendMode = 'multiply'
          
          // Function to copy canvas content
          const copyCanvasContent = () => {
            const ctx = blurredLayer.getContext('2d')
            const sharpCtx = sharpLayer.getContext('2d')
            if (ctx && sharpCtx) {
              ctx.drawImage(canvas, 0, 0)
              sharpCtx.drawImage(canvas, 0, 0)
            }
          }
          
          // Initial copy
          copyCanvasContent()
          
          // Set up the layers
          wrapper.appendChild(blurredLayer)
          wrapper.appendChild(sharpLayer)
          wrapper.appendChild(sharpMask)
          wrapper.appendChild(mask)
          
          // Replace the original canvas with our wrapper
          parent.insertBefore(wrapper, canvas)
          wrapper.appendChild(canvas)
          
          // Hide the original canvas and show our composite
          canvas.style.position = 'absolute'
          canvas.style.top = '0'
          canvas.style.left = '0'
          canvas.style.width = '100%'
          canvas.style.height = '100%'
          canvas.style.zIndex = '1'
          
          // Update the blurred layer on each render
          const originalRender = rendererRef.current?.render
          if (originalRender && rendererRef.current) {
            rendererRef.current.render = function(scene: THREE.Scene, camera: THREE.Camera) {
              originalRender.call(this, scene, camera)
              copyCanvasContent()
            }
          }
        }
        
        applyFocusEffect()
      }
      
      requestRender()
    }
  }, [
    cameraControls.position.x, cameraControls.position.y, cameraControls.position.z,
    cameraControls.rotation.x, cameraControls.rotation.y, cameraControls.rotation.z,
    cameraControls.target.x, cameraControls.target.y, cameraControls.target.z,
    cameraControls.fov, cameraControls.near, cameraControls.far, cameraControls.zoom,
    cameraControls.focusDistance, cameraControls.aperture, cameraControls.maxBlur,
    cameraControls.bokehScale, cameraControls.darkenPeriphery,
    requestRender
  ])

  // Force updates when lighting controls change
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


  // Apply visibility changes in Stage 4
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
  }, [componentControls, categoryVisibility])

  // Cleanup model only when completely leaving Section 1 (not during transitions)
  useEffect(() => {
    // Only clean up if we're going to a stage that definitely doesn't need the model
    if (current3DStage < 0 && modelRef.current) {
      console.log('🧹 Cleaning up 3D model - completely leaving Section 1')
      
      // Remove model from scene
      if (sceneRef.current) {
        sceneRef.current.remove(modelRef.current)
      }
      
      // Dispose model resources
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: THREE.Material) => material.dispose())
            } else {
              child.material.dispose()
            }
          }
        }
      })
      
      modelRef.current = null
    }
  }, [current3DStage])


  // Cleanup Three.js resources when component unmounts
  useEffect(() => {
    return () => {
      console.log('🧹 ThreeSceneManager: Cleaning up Three.js resources')
      
      // Dispose renderer
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      
      // Dispose model and its resources
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material: THREE.Material) => material.dispose())
              } else {
                child.material.dispose()
              }
            }
          }
        })
        modelRef.current = null
      }
      
      // Dispose textures
      const textures = [
        oledTextureRef.current,
        upperCoverTextureRef.current,
        lowerSideMainTextureRef.current,
        productComponentsTextureRef.current,
        knobsTextureRef.current,
        loadingMaterialCoverTextureRef.current,
        upperSideMainHolderTextureRef.current
      ]
      
      textures.forEach(texture => {
        if (texture) {
          texture.dispose()
        }
      })
      
      // Clear refs
      sceneRef.current = null
      cameraRef.current = null
      ambientLightRef.current = null
      directionalLightRef.current = null
      pointLightRef.current = null
      spotLightRef.current = null
      textureLoader.current = null
    }
  }, [])

  // Handle isActive prop changes - control rendering loop
  useEffect(() => {
    if (isActive) {
      console.log('🎬 ThreeSceneManager is now active - starting rendering loop')
      // Start rendering loop when becoming active
      if ((window as any).startRenderLoop) {
        ;(window as any).startRenderLoop()
      }
      // Force immediate render when becoming active for instant display
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        console.log('⚡ Forced immediate render for instant display')
      }
    } else {
      console.log('⏸️ ThreeSceneManager is now inactive - stopping rendering loop')
      // Stop rendering loop when becoming inactive
      if ((window as any).stopRenderLoop) {
        ;(window as any).stopRenderLoop()
      }
    }
  }, [isActive])

  // Static scene - no animations

  return null // This component doesn't render anything directly
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if critical props actually change
  if (prevProps.current3DStage !== nextProps.current3DStage) return false
  if (prevProps.isActive !== nextProps.isActive) return false
  
  // For object props, do deep comparison of key values
  if (prevProps.modelControls?.position?.x !== nextProps.modelControls?.position?.x) return false
  if (prevProps.modelControls?.position?.y !== nextProps.modelControls?.position?.y) return false
  if (prevProps.modelControls?.position?.z !== nextProps.modelControls?.position?.z) return false
  if (prevProps.modelControls?.scale?.x !== nextProps.modelControls?.scale?.x) return false
  if (prevProps.modelControls?.scale?.y !== nextProps.modelControls?.scale?.y) return false
  if (prevProps.modelControls?.scale?.z !== nextProps.modelControls?.scale?.z) return false
  
  if (prevProps.cameraControls?.position?.x !== nextProps.cameraControls?.position?.x) return false
  if (prevProps.cameraControls?.position?.y !== nextProps.cameraControls?.position?.y) return false
  if (prevProps.cameraControls?.position?.z !== nextProps.cameraControls?.position?.z) return false
  if (prevProps.cameraControls?.fov !== nextProps.cameraControls?.fov) return false
  
  if (prevProps.lightingControls?.ambientIntensity !== nextProps.lightingControls?.ambientIntensity) return false
  if (prevProps.lightingControls?.directionalIntensity !== nextProps.lightingControls?.directionalIntensity) return false
  
  // If all critical props are the same, don't re-render
  return true
})

export default ThreeSceneManager
