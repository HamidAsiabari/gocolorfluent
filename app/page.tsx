'use client'


import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import DevControls from '../components/DevControls'
import { ThreeSceneManager, stage1Config, stage2Config, stage3Config } from '../components/ThreeScene'
import { stage4Config } from '../components/ThreeScene/StageConfig'
import { ScrollManager } from '../components/ScrollSystem'
import { AnimationSystem, easeInOut } from '../components/Animation'
import { ComponentControls, defaultComponentControls, CategoryVisibility, defaultCategoryVisibility } from '../components/DevControls/sections/product3d/types'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  
  const [modelControls, setModelControls] = useState({
    position: { x: 2, y: -0.3, z: 0 },
    rotation: { x: -0.03, y: 0.1, z: 0.27 },
    scale: { x: 10, y: 10, z: 10 }
  })
  const [cameraControls, setCameraControls] = useState({
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  })
  const [lightingControls, setLightingControls] = useState({
    ambientIntensity: 0,
    ambientColor: '#404040',
    directionalIntensity: 0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  })
  const [isDevMode, setIsDevMode] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(1)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [current3DStage, setCurrent3DStage] = useState(1) // Start at Stage 1
  const [is3DAnimating, setIs3DAnimating] = useState(false)
  const [stage3DAnimationProgress, setStage3DAnimationProgress] = useState(0)
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Animated values function that handles all animations
  const getAnimatedValues = () => {
    // Import easing functions
  const lerp = (start: number, end: number, progress: number) => {
    return start + (end - start) * progress
  }

  const lerpColor = (startColor: string, endColor: string, progress: number): string => {
    const start = startColor.replace('#', '')
    const end = endColor.replace('#', '')
    
    const startR = parseInt(start.substr(0, 2), 16)
    const startG = parseInt(start.substr(2, 2), 16)
    const startB = parseInt(start.substr(4, 2), 16)
    
    const endR = parseInt(end.substr(0, 2), 16)
    const endG = parseInt(end.substr(2, 2), 16)
    const endB = parseInt(end.substr(4, 2), 16)
    
    const r = Math.round(lerp(startR, endR, progress))
    const g = Math.round(lerp(startG, endG, progress))
    const b = Math.round(lerp(startB, endB, progress))
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  const easeInOutSine = (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2
  }

    // Handle section-based 3D stage animations
    if (is3DAnimating) {
      const progress = easeInOutSine(stage3DAnimationProgress)
      let fromStage, toStage
      
      if (current3DStage === 2) {
        fromStage = stage2Config
        toStage = stage3Config
      } else if (current3DStage === 3) {
        // Check scroll direction to determine correct target stage
        if (scrollDirection === 'down') {
          // Going from Stage 3 to Stage 4
          fromStage = stage3Config
          toStage = stage4Config
        } else {
          // Going from Stage 3 to Stage 2
          fromStage = stage3Config
          toStage = stage2Config
        }
      } else if (current3DStage === 4) {
        fromStage = stage4Config
        toStage = stage3Config
      } else {
        fromStage = stage2Config
        toStage = stage3Config
      }
      
      return {
        model: {
          position: {
            x: lerp(fromStage.model.position.x, toStage.model.position.x, progress),
            y: lerp(fromStage.model.position.y, toStage.model.position.y, progress),
            z: lerp(fromStage.model.position.z, toStage.model.position.z, progress)
          },
          rotation: {
            x: lerp(fromStage.model.rotation.x, toStage.model.rotation.x, progress),
            y: lerp(fromStage.model.rotation.y, toStage.model.rotation.y, progress),
            z: lerp(fromStage.model.rotation.z, toStage.model.rotation.z, progress)
          },
          scale: {
            x: lerp(fromStage.model.scale.x, toStage.model.scale.x, progress),
            y: lerp(fromStage.model.scale.y, toStage.model.scale.y, progress),
            z: lerp(fromStage.model.scale.z, toStage.model.scale.z, progress)
          }
        },
        camera: {
          position: {
            x: lerp(fromStage.camera.position.x, toStage.camera.position.x, progress),
            y: lerp(fromStage.camera.position.y, toStage.camera.position.y, progress),
            z: lerp(fromStage.camera.position.z, toStage.camera.position.z, progress)
          },
          fov: lerp(fromStage.camera.fov, toStage.camera.fov, progress)
        },
        lighting: {
          ambientIntensity: lerp(fromStage.lighting.ambientIntensity, toStage.lighting.ambientIntensity, progress),
          ambientColor: lerpColor(fromStage.lighting.ambientColor, toStage.lighting.ambientColor, progress),
          directionalIntensity: lerp(fromStage.lighting.directionalIntensity, toStage.lighting.directionalIntensity, progress),
          directionalColor: lerpColor(fromStage.lighting.directionalColor, toStage.lighting.directionalColor, progress),
          directionalPosition: {
            x: lerp(fromStage.lighting.directionalPosition.x, toStage.lighting.directionalPosition.x, progress),
            y: lerp(fromStage.lighting.directionalPosition.y, toStage.lighting.directionalPosition.y, progress),
            z: lerp(fromStage.lighting.directionalPosition.z, toStage.lighting.directionalPosition.z, progress)
          },
          directionalTarget: {
            x: lerp(fromStage.lighting.directionalTarget.x, toStage.lighting.directionalTarget.x, progress),
            y: lerp(fromStage.lighting.directionalTarget.y, toStage.lighting.directionalTarget.y, progress),
            z: lerp(fromStage.lighting.directionalTarget.z, toStage.lighting.directionalTarget.z, progress)
          },
          pointLightIntensity: lerp(fromStage.lighting.pointLightIntensity, toStage.lighting.pointLightIntensity, progress),
          pointLightColor: lerpColor(fromStage.lighting.pointLightColor, toStage.lighting.pointLightColor, progress),
          pointLightPosition: {
            x: lerp(fromStage.lighting.pointLightPosition.x, toStage.lighting.pointLightPosition.x, progress),
            y: lerp(fromStage.lighting.pointLightPosition.y, toStage.lighting.pointLightPosition.y, progress),
            z: lerp(fromStage.lighting.pointLightPosition.z, toStage.lighting.pointLightPosition.z, progress)
          },
          pointLightDistance: lerp(fromStage.lighting.pointLightDistance, toStage.lighting.pointLightDistance, progress),
          spotLightIntensity: lerp(fromStage.lighting.spotLightIntensity, toStage.lighting.spotLightIntensity, progress),
          spotLightColor: lerpColor(fromStage.lighting.spotLightColor, toStage.lighting.spotLightColor, progress),
          spotLightPosition: {
            x: lerp(fromStage.lighting.spotLightPosition.x, toStage.lighting.spotLightPosition.x, progress),
            y: lerp(fromStage.lighting.spotLightPosition.y, toStage.lighting.spotLightPosition.y, progress),
            z: lerp(fromStage.lighting.spotLightPosition.z, toStage.lighting.spotLightPosition.z, progress)
          },
          spotLightTarget: {
            x: lerp(fromStage.lighting.spotLightTarget.x, toStage.lighting.spotLightTarget.x, progress),
            y: lerp(fromStage.lighting.spotLightTarget.y, toStage.lighting.spotLightTarget.y, progress),
            z: lerp(fromStage.lighting.spotLightTarget.z, toStage.lighting.spotLightTarget.z, progress)
          },
          spotLightDistance: lerp(fromStage.lighting.spotLightDistance, toStage.lighting.spotLightDistance, progress),
          spotLightAngle: lerp(fromStage.lighting.spotLightAngle, toStage.lighting.spotLightAngle, progress),
          spotLightPenumbra: lerp(fromStage.lighting.spotLightPenumbra, toStage.lighting.spotLightPenumbra, progress),
          shadowsEnabled: fromStage.lighting.shadowsEnabled,
          shadowMapSize: fromStage.lighting.shadowMapSize,
          shadowBias: fromStage.lighting.shadowBias
        }
      }
    }

    // Handle initial Stage 1 to Stage 2 animation
    if (isAnimating) {
      const progress = easeInOutSine(animationProgress)
      
      return {
        model: {
          position: {
            x: lerp(stage1Config.model.position.x, stage2Config.model.position.x, progress),
            y: lerp(stage1Config.model.position.y, stage2Config.model.position.y, progress),
            z: lerp(stage1Config.model.position.z, stage2Config.model.position.z, progress)
          },
          rotation: {
            x: lerp(stage1Config.model.rotation.x, stage2Config.model.rotation.x, progress),
            y: lerp(stage1Config.model.rotation.y, stage2Config.model.rotation.y, progress),
            z: lerp(stage1Config.model.rotation.z, stage2Config.model.rotation.z, progress)
          },
          scale: {
            x: lerp(stage1Config.model.scale.x, stage2Config.model.scale.x, progress),
            y: lerp(stage1Config.model.scale.y, stage2Config.model.scale.y, progress),
            z: lerp(stage1Config.model.scale.z, stage2Config.model.scale.z, progress)
          }
        },
        camera: {
          position: {
            x: lerp(stage1Config.camera.position.x, stage2Config.camera.position.x, progress),
            y: lerp(stage1Config.camera.position.y, stage2Config.camera.position.y, progress),
            z: lerp(stage1Config.camera.position.z, stage2Config.camera.position.z, progress)
          },
          fov: lerp(stage1Config.camera.fov, stage2Config.camera.fov, progress)
        },
        lighting: {
          ambientIntensity: lerp(stage1Config.lighting.ambientIntensity, stage2Config.lighting.ambientIntensity, progress),
          ambientColor: lerpColor(stage1Config.lighting.ambientColor, stage2Config.lighting.ambientColor, progress),
          directionalIntensity: lerp(stage1Config.lighting.directionalIntensity, stage2Config.lighting.directionalIntensity, progress),
          directionalColor: lerpColor(stage1Config.lighting.directionalColor, stage2Config.lighting.directionalColor, progress),
          directionalPosition: {
            x: lerp(stage1Config.lighting.directionalPosition.x, stage2Config.lighting.directionalPosition.x, progress),
            y: lerp(stage1Config.lighting.directionalPosition.y, stage2Config.lighting.directionalPosition.y, progress),
            z: lerp(stage1Config.lighting.directionalPosition.z, stage2Config.lighting.directionalPosition.z, progress)
          },
          directionalTarget: {
            x: lerp(stage1Config.lighting.directionalTarget.x, stage2Config.lighting.directionalTarget.x, progress),
            y: lerp(stage1Config.lighting.directionalTarget.y, stage2Config.lighting.directionalTarget.y, progress),
            z: lerp(stage1Config.lighting.directionalTarget.z, stage2Config.lighting.directionalTarget.z, progress)
          },
          pointLightIntensity: lerp(stage1Config.lighting.pointLightIntensity, stage2Config.lighting.pointLightIntensity, progress),
          pointLightColor: lerpColor(stage1Config.lighting.pointLightColor, stage2Config.lighting.pointLightColor, progress),
          pointLightPosition: {
            x: lerp(stage1Config.lighting.pointLightPosition.x, stage2Config.lighting.pointLightPosition.x, progress),
            y: lerp(stage1Config.lighting.pointLightPosition.y, stage2Config.lighting.pointLightPosition.y, progress),
            z: lerp(stage1Config.lighting.pointLightPosition.z, stage2Config.lighting.pointLightPosition.z, progress)
          },
          pointLightDistance: lerp(stage1Config.lighting.pointLightDistance, stage2Config.lighting.pointLightDistance, progress),
          spotLightIntensity: lerp(stage1Config.lighting.spotLightIntensity, stage2Config.lighting.spotLightIntensity, progress),
          spotLightColor: lerpColor(stage1Config.lighting.spotLightColor, stage2Config.lighting.spotLightColor, progress),
          spotLightPosition: {
            x: lerp(stage1Config.lighting.spotLightPosition.x, stage2Config.lighting.spotLightPosition.x, progress),
            y: lerp(stage1Config.lighting.spotLightPosition.y, stage2Config.lighting.spotLightPosition.y, progress),
            z: lerp(stage1Config.lighting.spotLightPosition.z, stage2Config.lighting.spotLightPosition.z, progress)
          },
          spotLightTarget: {
            x: lerp(stage1Config.lighting.spotLightTarget.x, stage2Config.lighting.spotLightTarget.x, progress),
            y: lerp(stage1Config.lighting.spotLightTarget.y, stage2Config.lighting.spotLightTarget.y, progress),
            z: lerp(stage1Config.lighting.spotLightTarget.z, stage2Config.lighting.spotLightTarget.z, progress)
          },
          spotLightDistance: lerp(stage1Config.lighting.spotLightDistance, stage2Config.lighting.spotLightDistance, progress),
          spotLightAngle: lerp(stage1Config.lighting.spotLightAngle, stage2Config.lighting.spotLightAngle, progress),
          spotLightPenumbra: lerp(stage1Config.lighting.spotLightPenumbra, stage2Config.lighting.spotLightPenumbra, progress),
          shadowsEnabled: stage1Config.lighting.shadowsEnabled,
          shadowMapSize: stage1Config.lighting.shadowMapSize,
          shadowBias: stage1Config.lighting.shadowBias
        }
      }
    }

    // Return Stage 4 configuration when in Stage 4, but use model controls for dev controls
    if (current3DStage === 4) {
      return {
        model: modelControls, // Use model controls so dev controls work
        camera: stage4Config.camera,
        lighting: stage4Config.lighting
      }
    }

    // Return actual control values when not animating (so dev controls work)
    return { 
      model: modelControls, 
      camera: cameraControls, 
      lighting: lightingControls 
    }
  }







  // Update model controls to reflect current animated values
  useEffect(() => {
    if (is3DAnimating || isAnimating) {
      const animatedValues = getAnimatedValues()
      setModelControls(animatedValues.model)
      console.log('Animation progress - updating model controls:', animatedValues.model)
    }
  }, [is3DAnimating, stage3DAnimationProgress, isAnimating, animationProgress, current3DStage])

  // Update model controls when stage changes (not animating)
  useEffect(() => {
    if (!is3DAnimating && !isAnimating) {
      console.log('Stage changed - updating model controls for stage:', current3DStage)
      // Update model controls to match the current stage configuration
      if (current3DStage === 1) {
        setModelControls(stage1Config.model)
      } else if (current3DStage === 2) {
        setModelControls(stage2Config.model)
      } else if (current3DStage === 3) {
        setModelControls(stage3Config.model)
      } else if (current3DStage === 4) {
        // For Stage 4, use the exact Stage 4 configuration
        setModelControls(stage4Config.model)
        console.log('Set model controls to Stage 4:', stage4Config.model)
      }
    }
  }, [current3DStage, is3DAnimating, isAnimating])




  return (
    <div className="relative">
      {/* Fixed 3D Container - Always full screen */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-screen h-screen"
        style={{ zIndex: 1 }}
      />
      
      {/* Three.js Scene Manager */}
      <ThreeSceneManager
        mountRef={mountRef}
        modelControls={modelControls}
        cameraControls={cameraControls}
        lightingControls={lightingControls}
        isAnimating={isAnimating}
        animationProgress={animationProgress}
        is3DAnimating={is3DAnimating}
        stage3DAnimationProgress={stage3DAnimationProgress}
        current3DStage={current3DStage}
        getAnimatedValues={getAnimatedValues}
        componentControls={componentControls}
        categoryVisibility={categoryVisibility}
        onComponentControlsChange={setComponentControls}
      />

      {/* Scroll Manager */}
      <ScrollManager
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        setIsScrolling={setIsScrolling}
        setScrollDirection={setScrollDirection}
        setTransitionName={setTransitionName}
        setIsTransitioning={setIsTransitioning}
        setTransitionProgress={setTransitionProgress}
        setScrollPosition={setScrollPosition}
        isClient={isClient}
        setIsClient={setIsClient}
      />

      {/* Animation System */}
      <AnimationSystem
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        animationProgress={animationProgress}
        setAnimationProgress={setAnimationProgress}
        is3DAnimating={is3DAnimating}
        setIs3DAnimating={setIs3DAnimating}
        stage3DAnimationProgress={stage3DAnimationProgress}
        setStage3DAnimationProgress={setStage3DAnimationProgress}
        current3DStage={current3DStage}
        setCurrent3DStage={setCurrent3DStage}
        isTransitioning={isTransitioning}
        scrollDirection={scrollDirection}
        currentSection={currentSection}
        isClient={isClient}
        setModelControls={setModelControls}
        setCameraControls={setCameraControls}
        setLightingControls={setLightingControls}
      />

      {/* Scrollable Content - 8x screen height */}
      <main 
        className="relative bg-gradient-to-br from-gray-900 to-gray-800"
        style={{ height: isClient ? `${window.innerHeight * 8}px` : '800vh' }}
      >

        {/* Content Sections - Positioned based on scroll */}
        <div className="relative z-10">
          {/* Section 1 - Hero */}
          <section 
            className="flex flex-col items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (1 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            {/* Main Content */}
            <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
              {/* Hero Title */}
              <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
                GoColorFluent
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
                Revolutionary Color Brush Assembly
              </p>
              
              {/* Description */}
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Experience precision, innovation, and cutting-edge technology in our advanced color brush system. 
                Discover the future of digital artistry with our state-of-the-art assembly.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (2 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 2</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Fixed 3D Background
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The 3D model stays in place as you scroll through different sections of content.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (3 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 3</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Scroll Experience
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Notice how the 3D object remains fixed while the content scrolls over it.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (4 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 4</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Interactive Controls
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                Use the Dev Controls to adjust the 3D model in real-time while scrolling.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (5 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 5</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Stage Transitions
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The model automatically transitions from Stage 1 to Stage 2 with smooth easing.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (6 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 6</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Lighting Effects
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                All lighting parameters follow the same smooth transition with ease-in and ease-out.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (7 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 7</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                Scroll Position Tracking
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                The scroll position is tracked and displayed in real-time in the header and Dev Controls.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section 
            className="flex items-center justify-center h-screen px-6 absolute inset-0"
            style={{
              transform: `translateY(${isClient ? (8 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`
            }}
          >
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-500/30">
              <span className="text-blue-400 text-sm font-mono">Section 8</span>
            </div>
            <div className="text-center text-white">
              <h2 className="text-2xl font-semibold mb-4">
                End of Content
              </h2>
              <p className="text-gray-300 max-w-md mx-auto">
                This is the final section. The 3D model remains fixed throughout the entire scroll experience.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Compact Development Helper Box */}
      <DevControls
        isDevMode={isDevMode}
        onToggleDevMode={() => setIsDevMode(false)}
        modelControls={modelControls}
        onModelControlsChange={setModelControls}
        cameraControls={cameraControls}
        onCameraControlsChange={setCameraControls}
        lightingControls={lightingControls}
        onLightingControlsChange={setLightingControls}
        currentSection={currentSection}
        isScrolling={isScrolling}
        scrollDirection={scrollDirection}
        transitionName={transitionName}
        scrollPosition={scrollPosition}
        isClient={isClient}
        stage1Config={stage1Config}
        stage2Config={stage2Config}
        stage3Config={stage3Config}
        current3DStage={current3DStage}
        stage3DAnimationProgress={stage3DAnimationProgress}
        setCurrent3DStage={setCurrent3DStage}
        componentControls={componentControls}
        onComponentControlsChange={setComponentControls}
        categoryVisibility={categoryVisibility}
        onCategoryVisibilityChange={setCategoryVisibility}
      />

      {/* Menu Button - Fixed top right */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-30 text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-200"
        style={{ 
          background: 'none', 
          border: 'none',
          outline: 'none'
        }}
      >
        ☰
      </button>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center menu-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="text-center space-y-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-4xl font-bold text-white mb-12 menu-title-animate">
              Menu
            </h2>
            <div className="space-y-6">
              <div className="text-2xl text-white hover:text-gray-300 cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-1">
                Home
              </div>
              <div className="text-2xl text-white hover:text-gray-300 cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-2">
                About
              </div>
              <div className="text-2xl text-white hover:text-gray-300 cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-3">
                Products
              </div>
              <div className="text-2xl text-white hover:text-gray-300 cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-4">
                Contact
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show Dev Mode Button when hidden */}
      {!isDevMode && (
        <button
          onClick={() => setIsDevMode(true)}
          className="fixed bottom-4 left-4 z-20 bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
        >
          Show Dev Controls
        </button>
      )}
    </div>
  )
}
