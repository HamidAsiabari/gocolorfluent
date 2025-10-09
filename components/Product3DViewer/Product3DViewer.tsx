'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'

interface Product3DViewerProps {
  className?: string
  modelPath?: string
}

export default function Product3DViewer({ 
  className = '', 
  modelPath = '/product-3d/Color_Brush_assembly_V1_1.glb' 
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const controlsRef = useRef<any>(null)
  const animationIdRef = useRef<number | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100)
    pointLight.position.set(-5, 5, 5)
    scene.add(pointLight)

    // Load 3D model
    loadModel()
  }, [])

  // Load 3D model
  const loadModel = useCallback(() => {
    const loader = new GLTFLoader()
    
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene
        modelRef.current = model
        
        // Scale and position the model
        model.scale.set(2, 2, 2)
        model.position.set(0, -1, 0)
        
        // Enable shadows
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        sceneRef.current?.add(model)
        setIsLoading(false)
        setLoadingProgress(100)
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100
        setLoadingProgress(percentComplete)
      },
      (error) => {
        console.error('Error loading 3D model:', error)
        setError('Failed to load 3D model')
        setIsLoading(false)
      }
    )
  }, [modelPath])

  // Mouse controls for rotation
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }, [])

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !modelRef.current) return

    const deltaX = event.clientX - lastMousePosition.x
    const deltaY = event.clientY - lastMousePosition.y

    modelRef.current.rotation.y += deltaX * 0.01
    modelRef.current.rotation.x += deltaY * 0.01

    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }, [isDragging, lastMousePosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch controls for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      setIsDragging(true)
      setLastMousePosition({ x: event.touches[0].clientX, y: event.touches[0].clientY })
    }
  }, [])

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!isDragging || !modelRef.current || event.touches.length !== 1) return

    event.preventDefault()
    const deltaX = event.touches[0].clientX - lastMousePosition.x
    const deltaY = event.touches[0].clientY - lastMousePosition.y

    modelRef.current.rotation.y += deltaX * 0.01
    modelRef.current.rotation.x += deltaY * 0.01

    setLastMousePosition({ x: event.touches[0].clientX, y: event.touches[0].clientY })
  }, [isDragging, lastMousePosition])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Auto-rotation when not dragging
  const animate = useCallback(() => {
    if (!isDragging && modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
    
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    
    animationIdRef.current = requestAnimationFrame(animate)
  }, [isDragging])

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    cameraRef.current.aspect = width / height
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(width, height)
  }, [])

  // Initialize scene on mount
  useEffect(() => {
    initScene()
    
    // Start animation loop
    animate()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initScene, animate, handleResize])

  if (error) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600 p-8 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-300">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600 overflow-hidden group ${className}`}>
      {/* 3D Viewer Container */}
      <div
        ref={mountRef}
        className="w-full h-96 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-sm">Loading 3D Model...</div>
            <div className="text-xs text-gray-300 mt-2">{Math.round(loadingProgress)}%</div>
          </div>
        </div>
      )}
      
      {/* Instructions Overlay */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-300">
            Drag to rotate • Scroll to zoom
          </div>
        </div>
      )}
    </div>
  )
}
