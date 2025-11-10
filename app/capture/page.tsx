'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ThreeSceneManagerV2, stage0Config, stage1Config } from '../../components/ThreeScene'
import { ComponentControls, CategoryVisibility, defaultComponentControls, defaultCategoryVisibility } from '../../components/DevControls/sections/product3d/types'
import { StageConfig } from '../../store/useAppStore'

export default function CapturePage() {
  const mountRef = useRef<HTMLDivElement>(null)

  const [current3DStage, setCurrent3DStage] = useState<number>(0)
  const [modelControls, setModelControls] = useState(stage0Config.model)
  const [cameraControls, setCameraControls] = useState(stage0Config.camera)
  const [lightingControls, setLightingControls] = useState(stage0Config.lighting)
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  const [isReady, setIsReady] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingMobile, setIsExportingMobile] = useState(false)

  // Mobile-specific Stage 1 config with zoomed out camera for more details visibility
  const stage1MobileConfig: StageConfig = {
    ...stage1Config,
    camera: {
      ...stage1Config.camera,
      position: { 
        x: stage1Config.camera.position.x, 
        y: stage1Config.camera.position.y + 0.5, 
        z: stage1Config.camera.position.z + 0.99 // Zoom out slightly (moved back)
      },
      fov: stage1Config.camera.fov + 1, // Slightly wider field of view for more details
      target: {
        ...stage1Config.camera.target,
        // Keep target centered but slightly adjusted for better framing
      }
    }
  }

  // Reset scene to Stage 0
  const resetToStage0 = useCallback(async () => {
    setCurrent3DStage(0)
    setModelControls(stage0Config.model)
    setCameraControls(stage0Config.camera)
    setLightingControls(stage0Config.lighting)
    // Let a couple frames render
    await new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  }, [])

  // Preview Stage 0→1 animation without recording
  const previewAnimation = useCallback(async () => {
    if (!(window as any).directThreeAnimation) return
    await resetToStage0()
    ;(window as any).isStageAnimating = true
    const durationMs = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      ;(window as any).directThreeAnimation?.({
        progress: eased,
        stage0Config,
        stage1Config
      })
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCurrent3DStage(1)
        setModelControls(stage1Config.model)
        setCameraControls(stage1Config.camera)
        setLightingControls(stage1Config.lighting)
        ;(window as any).isStageAnimating = false
      }
    }
    requestAnimationFrame(animate)
  }, [resetToStage0])

  // Export Stage 0→1 animation as WebM
  const exportStage0To1Video = useCallback(async () => {
    if (!mountRef.current || !(window as any).directThreeAnimation || !isReady) {
      console.warn('Not ready for export - assets still loading')
      return
    }
    
    const canvas = mountRef.current.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) {
      console.warn('Canvas not found')
      return
    }
    
    setIsExporting(true)
    try {
      console.log('Export: Resetting to Stage 0 and waiting for full render...')
      // First, reset to Stage 0 and wait for it to fully render with all textures
      setCurrent3DStage(0)
      setModelControls(stage0Config.model)
      setCameraControls(stage0Config.camera)
      setLightingControls(stage0Config.lighting)
      
      // Wait multiple frames to ensure Stage 0 is fully rendered with all textures
      await new Promise<void>(r => {
        let framesRendered = 0
        const checkFrame = () => {
          framesRendered++
          if (framesRendered >= 15) {
            // Ensure at least 15 frames rendered at Stage 0 to guarantee textures are loaded
            r()
          } else {
            requestAnimationFrame(checkFrame)
          }
        }
        requestAnimationFrame(checkFrame)
      })
      
      // Wait additional time to ensure textures are fully loaded and displayed
      await new Promise(r => setTimeout(r, 800))
      
      console.log('Export: Boosting renderer quality for export...')
      // Temporarily boost renderer quality for export
      const renderer = (window as any).threeRenderer
      const scene = (window as any).threeScene
      
      if (renderer) {
        // Enable maximum quality settings
        renderer.antialias = true
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        
        // Boost shadow quality
        if (scene) {
          scene.traverse((obj: any) => {
            if (obj.isLight) {
              if (obj.shadow) {
                obj.shadow.mapSize.width = 4096
                obj.shadow.mapSize.height = 4096
                obj.shadow.camera.near = 0.1
                obj.shadow.camera.far = 1000
              }
            }
            // Ensure textures are at maximum quality
            if (obj.material) {
              const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
              materials.forEach((mat: any) => {
                const maxAniso = renderer.capabilities.getMaxAnisotropy()
                // Set maximum anisotropy for all texture types
                Object.keys(mat).forEach(key => {
                  if (mat[key] && mat[key].isTexture) {
                    mat[key].anisotropy = maxAniso
                    mat[key].minFilter = THREE.LinearMipmapLinearFilter
                    mat[key].magFilter = THREE.LinearFilter
                    mat[key].needsUpdate = true
                  }
                })
              })
            }
          })
        }
        
        console.log('Export: Renderer quality boosted - shadows, textures, and antialiasing maxed')
      }
      
      console.log('Export: Ensuring render loop is active...')
      ;(window as any).startRenderLoop?.()
      
      // Wait for everything to stabilize with high quality settings
      await new Promise(r => setTimeout(r, 400))

      console.log('Export: Creating MediaRecorder with maximum quality...')
      // Use 60fps for maximum quality and smoothness
      const stream = canvas.captureStream(60)
      const supportedTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ]
      const mimeType = supportedTypes.find(t => (window as any).MediaRecorder?.isTypeSupported?.(t)) || 'video/webm'
      // Maximum bitrate for best quality (30 Mbps) - your GPU can handle this
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 30_000_000 })
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data) }
      const stopped = new Promise<Blob>((resolve) => { 
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }))
        }
      })

      console.log('Export: Starting recording at 60fps with maximum quality...')
      recorder.start(50) // 50ms timeslice for 60fps capture
      
      // Record several frames of Stage 0 for stable start
      await new Promise<void>(r => {
        let frameCount = 0
        const countFrames = () => {
          frameCount++
          if (frameCount >= 8) r()
          else requestAnimationFrame(countFrames)
        }
        requestAnimationFrame(countFrames)
      })
      
      console.log('Export: Starting Stage 0→1 animation...')
      ;(window as any).isStageAnimating = true

      // Smooth 1.5 second animation
      const durationMs = 1500
      const start = performance.now()
      
      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        
        // Smooth ease-in-out that's consistent throughout
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        // Update every frame for smooth motion
        ;(window as any).directThreeAnimation?.({
          progress: eased,
          stage0Config,
          stage1Config
        })
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Final position
          ;(window as any).directThreeAnimation?.({
            progress: 1,
            stage0Config,
            stage1Config
          })
          
          // Simple final frame handling
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setCurrent3DStage(1)
              setModelControls(stage1Config.model)
              setCameraControls(stage1Config.camera)
              setLightingControls(stage1Config.lighting)
              ;(window as any).isStageAnimating = false
              
              // Brief hold then stop
              setTimeout(() => {
                console.log('Export: Stopping recording...')
                recorder.stop()
              }, 150)
            })
          })
        }
      }
      requestAnimationFrame(animate)

      console.log('Export: Waiting for blob...')
      const blob = await stopped
      console.log('Export: Creating download...')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stage0-to-stage1.webm'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      console.log('Export: Complete!')
    } catch (e) {
      console.error('Export failed:', e)
    } finally {
      setIsExporting(false)
    }
  }, [isReady])

  // Export Stage 0→1 animation as WebM for mobile (zoomed out for more details)
  const exportMobileVideo = useCallback(async () => {
    if (!mountRef.current || !(window as any).directThreeAnimation || !isReady) {
      console.warn('Not ready for export - assets still loading')
      return
    }
    
    const canvas = mountRef.current.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) {
      console.warn('Canvas not found')
      return
    }
    
    setIsExportingMobile(true)
    try {
      console.log('Export Mobile: Resetting to Stage 0 and waiting for full render...')
      // First, reset to Stage 0 and wait for it to fully render with all textures
      setCurrent3DStage(0)
      setModelControls(stage0Config.model)
      setCameraControls(stage0Config.camera)
      setLightingControls(stage0Config.lighting)
      
      // Wait multiple frames to ensure Stage 0 is fully rendered with all textures
      await new Promise<void>(r => {
        let framesRendered = 0
        const checkFrame = () => {
          framesRendered++
          if (framesRendered >= 15) {
            // Ensure at least 15 frames rendered at Stage 0 to guarantee textures are loaded
            r()
          } else {
            requestAnimationFrame(checkFrame)
          }
        }
        requestAnimationFrame(checkFrame)
      })
      
      // Wait additional time to ensure textures are fully loaded and displayed
      await new Promise(r => setTimeout(r, 800))
      
      console.log('Export Mobile: Boosting renderer quality for export...')
      // Temporarily boost renderer quality for export
      const renderer = (window as any).threeRenderer
      const scene = (window as any).threeScene
      
      if (renderer) {
        // Enable maximum quality settings
        renderer.antialias = true
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        
        // Boost shadow quality
        if (scene) {
          scene.traverse((obj: any) => {
            if (obj.isLight) {
              if (obj.shadow) {
                obj.shadow.mapSize.width = 4096
                obj.shadow.mapSize.height = 4096
                obj.shadow.camera.near = 0.1
                obj.shadow.camera.far = 1000
              }
            }
            // Ensure textures are at maximum quality
            if (obj.material) {
              const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
              materials.forEach((mat: any) => {
                const maxAniso = renderer.capabilities.getMaxAnisotropy()
                // Set maximum anisotropy for all texture types
                Object.keys(mat).forEach(key => {
                  if (mat[key] && mat[key].isTexture) {
                    mat[key].anisotropy = maxAniso
                    mat[key].minFilter = THREE.LinearMipmapLinearFilter
                    mat[key].magFilter = THREE.LinearFilter
                    mat[key].needsUpdate = true
                  }
                })
              })
            }
          })
        }
        
        console.log('Export Mobile: Renderer quality boosted - shadows, textures, and antialiasing maxed')
      }
      
      console.log('Export Mobile: Ensuring render loop is active...')
      ;(window as any).startRenderLoop?.()
      
      // Wait for everything to stabilize with high quality settings
      await new Promise(r => setTimeout(r, 400))

      console.log('Export Mobile: Creating MediaRecorder with maximum quality...')
      // Use 60fps for maximum quality and smoothness
      const stream = canvas.captureStream(60)
      const supportedTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
      ]
      const mimeType = supportedTypes.find(t => (window as any).MediaRecorder?.isTypeSupported?.(t)) || 'video/webm'
      // Maximum bitrate for best quality (30 Mbps) - maintain same quality as desktop export
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 30_000_000 })
      const chunks: BlobPart[] = []
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data) }
      const stopped = new Promise<Blob>((resolve) => { 
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }))
        }
      })

      console.log('Export Mobile: Starting recording at 60fps with maximum quality...')
      recorder.start(50) // 50ms timeslice for 60fps capture
      
      // Record several frames of Stage 0 for stable start
      await new Promise<void>(r => {
        let frameCount = 0
        const countFrames = () => {
          frameCount++
          if (frameCount >= 8) r()
          else requestAnimationFrame(countFrames)
        }
        requestAnimationFrame(countFrames)
      })
      
      console.log('Export Mobile: Starting Stage 0→1 animation with mobile config (zoomed out)...')
      ;(window as any).isStageAnimating = true

      // Smooth 1.5 second animation
      const durationMs = 1500
      const start = performance.now()
      
      const animate = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        
        // Smooth ease-in-out that's consistent throughout
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2
        
        // Update every frame for smooth motion - using mobile config
        ;(window as any).directThreeAnimation?.({
          progress: eased,
          stage0Config,
          stage1Config: stage1MobileConfig
        })
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // Final position
          ;(window as any).directThreeAnimation?.({
            progress: 1,
            stage0Config,
            stage1Config: stage1MobileConfig
          })
          
          // Simple final frame handling
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setCurrent3DStage(1)
              setModelControls(stage1MobileConfig.model)
              setCameraControls(stage1MobileConfig.camera)
              setLightingControls(stage1MobileConfig.lighting)
              ;(window as any).isStageAnimating = false
              
              // Brief hold then stop
              setTimeout(() => {
                console.log('Export Mobile: Stopping recording...')
                recorder.stop()
              }, 150)
            })
          })
        }
      }
      requestAnimationFrame(animate)

      console.log('Export Mobile: Waiting for blob...')
      const blob = await stopped
      console.log('Export Mobile: Creating download...')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'stage0-to-stage1-mobile.webm'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 5000)
      console.log('Export Mobile: Complete!')
    } catch (e) {
      console.error('Export Mobile failed:', e)
    } finally {
      setIsExportingMobile(false)
    }
  }, [isReady])

  // Initialize on mount
  useEffect(() => {
    setCurrent3DStage(0)
    setModelControls(stage0Config.model)
    setCameraControls(stage0Config.camera)
    setLightingControls(stage0Config.lighting)
  }, [])

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="fixed inset-0 z-0" ref={mountRef} />

      <div className="relative z-10 p-4 flex gap-3 flex-wrap">
        <button
          onClick={previewAnimation}
          disabled={!isReady || isExporting || isExportingMobile}
          className={`px-4 py-2 rounded ${(!isReady || isExporting || isExportingMobile) ? 'bg-gray-700 text-gray-400' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          Preview Stage 0→1
        </button>
        <button
          onClick={exportStage0To1Video}
          disabled={!isReady || isExporting || isExportingMobile}
          className={`px-4 py-2 rounded ${(!isReady || isExporting || isExportingMobile) ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-500'}`}
        >
          {isExporting ? 'Exporting…' : 'Export WebM'}
        </button>
        <button
          onClick={exportMobileVideo}
          disabled={!isReady || isExporting || isExportingMobile}
          className={`px-4 py-2 rounded ${(!isReady || isExporting || isExportingMobile) ? 'bg-gray-700 text-gray-400' : 'bg-purple-600 hover:bg-purple-500'}`}
        >
          {isExportingMobile ? 'Exporting…' : 'Export Mobile Video'}
        </button>
        {!isReady && (
          <span className="self-center text-sm text-gray-400">Loading assets…</span>
        )}
      </div>

      <ThreeSceneManagerV2
        mountRef={mountRef}
        modelControls={modelControls}
        cameraControls={cameraControls}
        lightingControls={lightingControls}
        current3DStage={current3DStage}
        componentControls={componentControls}
        categoryVisibility={categoryVisibility}
        onComponentControlsChange={setComponentControls}
        onLoadingProgress={() => {}}
        onLoadingComplete={() => setIsReady(true)}
        isActive={true}
      />
    </div>
  )
}


