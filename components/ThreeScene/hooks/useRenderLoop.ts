'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

interface UseRenderLoopProps {
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>
  sceneRef: React.RefObject<THREE.Scene | null>
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>
  isActive: boolean
}

/**
 * Hook for managing the Three.js render loop
 * Starts and stops the rendering loop based on active state
 */
export function useRenderLoop({
  rendererRef,
  sceneRef,
  cameraRef,
  isActive
}: UseRenderLoopProps) {
  const animationIdRef = useRef<number | null>(null)
  const renderCountRef = useRef(0)

  const requestRender = useCallback(() => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }, [rendererRef, sceneRef, cameraRef])

  const startRenderLoop = useCallback(() => {
    if (animationIdRef.current) {
      return // Already running
    }

    const render = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        renderCountRef.current++
      }
      animationIdRef.current = requestAnimationFrame(render)
    }

    animationIdRef.current = requestAnimationFrame(render)
  }, [rendererRef, sceneRef, cameraRef])

  const stopRenderLoop = useCallback(() => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
      // loop stopped
    }
  }, [])

  // Control render loop based on isActive, but start once on mount then toggle
  useEffect(() => {
    startRenderLoop()
    return () => stopRenderLoop()
  }, [startRenderLoop, stopRenderLoop])

  // Expose functions globally for external control (e.g., directThreeAnimation)
  useEffect(() => {
    ;(window as any).startRenderLoop = startRenderLoop
    ;(window as any).stopRenderLoop = stopRenderLoop
  }, [startRenderLoop, stopRenderLoop])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRenderLoop()
      delete (window as any).startRenderLoop
      delete (window as any).stopRenderLoop
    }
  }, [stopRenderLoop])

  return {
    requestRender,
    startRenderLoop,
    stopRenderLoop
  }
}

