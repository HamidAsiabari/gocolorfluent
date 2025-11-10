'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { useDeviceDetection } from './hooks/useDeviceDetection'
import { useRenderLoop } from './hooks/useRenderLoop'
import { useStageAnimation } from './hooks/useStageAnimation'
import { LightManager } from './components/lighting'
import { CameraManager } from './components/camera'
import { RoomBuilder, FurnitureLoader, BrushLoader, EnvironmentMap, FurnitureMaterialApplier } from './components/environment'
import { ModelLoader, ModelControlSync, ModelTextureLoader, ComponentControlSync } from './components/model'
import { ComponentControls, CategoryVisibility } from '../DevControls/sections/product3d/types'
import { CameraControls } from '../../store/useAppStore'
import { RENDERER_SETTINGS, CAMERA_SETTINGS } from './utils/constants'

interface ThreeSceneManagerV2Props {
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

/**
 * Refactored ThreeSceneManager using extracted components and hooks
 * This is a cleaner implementation that separates concerns
 */
function ThreeSceneManagerV2({
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
}: ThreeSceneManagerV2Props) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const isModelLoadedRef = useRef(false)
  const componentRefs = useRef<Map<string, THREE.Object3D>>(new Map())
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null)
  const pointLightRef = useRef<THREE.PointLight | null>(null)
  const spotLightRef = useRef<THREE.SpotLight | null>(null)
  const furnitureRef = useRef<THREE.Group | null>(null)
  const texturesLoadedRef = useRef(false)
  const furnitureLoadedRef = useRef(false)
  const hasSignaledCompleteRef = useRef(false)
  const furnitureTexturesLoadedRef = useRef(false)

  // Use extracted hooks
  const { isMobile, isLowEndDevice } = useDeviceDetection()

  // Setup stage animation
  useStageAnimation({
    modelRef,
    cameraRef,
    ambientLightRef,
    directionalLightRef,
    pointLightRef,
    spotLightRef,
    isMobile
  })

  // Initialize scene, camera, and renderer
  useEffect(() => {
    if (!mountRef.current) return


    // Create scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Create renderer with optimized settings
    const rendererSettings = isMobile || isLowEndDevice 
      ? RENDERER_SETTINGS.mobile 
      : RENDERER_SETTINGS.desktop

    const renderer = new THREE.WebGLRenderer({
      antialias: rendererSettings.antialias,
      powerPreference: rendererSettings.powerPreference,
      precision: rendererSettings.precision,
      alpha: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false,
      stencil: rendererSettings.stencil,
      depth: rendererSettings.depth
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setScissorTest(true)
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight)
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    
    // Configure tone mapping and color space for correct lighting
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    ;(renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace || (THREE as any).sRGBEncoding
    
    rendererRef.current = renderer

    // Initialize texture loader
    const textureLoader = new THREE.TextureLoader()
    textureLoaderRef.current = textureLoader

    // Create camera
    const cameraSettings = isMobile ? CAMERA_SETTINGS.mobile : CAMERA_SETTINGS.desktop
    const fov = cameraControls.fov + cameraSettings.fovOffset
    
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      cameraControls.near,
      cameraControls.far
    )
    
    camera.zoom = cameraControls.zoom
    cameraRef.current = camera

    // Initialize texture loader
    textureLoaderRef.current = new THREE.TextureLoader()

    // Mount renderer
    mountRef.current.className = 'three-scene-container'
    mountRef.current.appendChild(renderer.domElement)
    // Prevent the canvas from intercepting scroll events
    renderer.domElement.style.pointerEvents = 'none'


    // Handle resize
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return
      const w = window.innerWidth
      const h = window.innerHeight
      rendererRef.current.setSize(w, h)
      rendererRef.current.setViewport(0, 0, w, h)
      rendererRef.current.setScissor(0, 0, w, h)
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    // Expose renderer, scene, and camera globally for external access (e.g., for video export)
    ;(window as any).threeRenderer = renderer
    ;(window as any).threeScene = scene
    ;(window as any).threeCamera = camera
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      delete (window as any).threeRenderer
      delete (window as any).threeScene
      delete (window as any).threeCamera
    }
  }, [mountRef, isMobile, isLowEndDevice])

  // Use render loop hook (renders only when isActive true)
  useRenderLoop({
    rendererRef,
    sceneRef,
    cameraRef,
    isActive
  })

  // Helper: when assets are ready, ensure a drawn frame before signaling complete
  const maybeSignalComplete = () => {
    if (
      !hasSignaledCompleteRef.current &&
      furnitureLoadedRef.current &&
      texturesLoadedRef.current &&
      furnitureTexturesLoadedRef.current &&
      rendererRef.current &&
      sceneRef.current &&
      cameraRef.current
    ) {
      hasSignaledCompleteRef.current = true
      // Force a render, then wait a couple of RAFs to allow presentation
      rendererRef.current.render(sceneRef.current, cameraRef.current)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          onLoadingComplete?.()
        })
      })
    }
  }

  // Safety: if UI assets or furniture textures never resolve, don't hang forever
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasSignaledCompleteRef.current) {
        onLoadingComplete?.()
        hasSignaledCompleteRef.current = true
      }
    }, 10000) // 10s safety timeout
    return () => clearTimeout(timeout)
  }, [onLoadingComplete])

  return (
    <>
      {/* Scene exists - render declarative components */}
      {sceneRef.current && (
        <>
          <EnvironmentMap scene={sceneRef.current} renderer={rendererRef.current!} />
          <RoomBuilder scene={sceneRef.current} />
          {/* Load furniture once */}
          <FurnitureLoader 
            scene={sceneRef.current}
            onLoaded={(furniture) => {
              furnitureRef.current = furniture
              furnitureLoadedRef.current = true
              // Check readiness and signal after a rendered frame
              maybeSignalComplete()
            }}
          />
          {/* Load accessory props once */}
          <BrushLoader 
            scene={sceneRef.current}
            onLoaded={(brush) => {
            }}
          />
          {/* Only load heavy model when Section 1 is active to avoid jank */}
          <ModelLoader
            scene={sceneRef.current}
            modelControls={modelControls}
            componentControls={componentControls}
            onProgress={onLoadingProgress}
            onComplete={onLoadingComplete}
            modelRef={modelRef}
            isModelLoadedRef={isModelLoadedRef}
            componentRefs={componentRefs}
          />
          <LightManager
            scene={sceneRef.current}
            lightingControls={lightingControls}
            isMobile={isMobile}
            isLowEndDevice={isLowEndDevice}
            onRefsReady={(refs) => {
              ambientLightRef.current = refs.ambientLightRef.current
              directionalLightRef.current = refs.directionalLightRef.current
              pointLightRef.current = refs.pointLightRef.current
              spotLightRef.current = refs.spotLightRef.current
            }}
          />
        </>
      )}
      
      {/* Load textures for the model */}
      {modelRef.current && textureLoaderRef.current && (
          <ModelTextureLoader
            modelRef={modelRef}
            textureLoader={textureLoaderRef.current}
            componentRefs={componentRefs}
            onTexturesLoaded={() => {
              texturesLoadedRef.current = true
              // Check readiness and signal after a rendered frame
              maybeSignalComplete()
            }}
          />
      )}
      
      {/* Apply furniture materials */}
      {furnitureRef.current && sceneRef.current && (
        <FurnitureMaterialApplier
          furnitureGroup={furnitureRef.current}
          scene={sceneRef.current}
          onFurnitureTexturesLoaded={() => {
            furnitureTexturesLoadedRef.current = true
            maybeSignalComplete()
          }}
        />
      )}
      
      {/* Model control sync - updates model position/rotation/scale when controls change */}
      {modelRef.current && (
        <ModelControlSync
          modelRef={modelRef}
          modelControls={modelControls}
          requestRender={() => {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
          }}
        />
      )}
      
      {/* Component control sync - makes DevControls work with individual components */}
      {componentRefs.current.size > 0 && (
        <ComponentControlSync
          componentRefs={componentRefs}
          componentControls={componentControls}
          categoryVisibility={categoryVisibility}
          requestRender={() => {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
          }}
        />
      )}
      
      {/* Camera management */}
      {cameraRef.current && (
        <CameraManager
          cameraRef={cameraRef}
          cameraControls={cameraControls}
          isMobile={isMobile}
        />
      )}
    </>
  )
}

export default ThreeSceneManagerV2

