'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { StageConfig, stage1Config, stage2Config, stage3Config } from './StageConfig'

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
  getAnimatedValues
}: ThreeSceneManagerProps) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null)
  const pointLightRef = useRef<THREE.PointLight | null>(null)
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

  return null // This component doesn't render anything directly
}
