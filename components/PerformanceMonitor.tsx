'use client'

import { useEffect, useState, useRef } from 'react'

interface PerformanceMonitorProps {
  enabled?: boolean
}

export default function PerformanceMonitor({ enabled = false }: PerformanceMonitorProps) {
  const [fps, setFps] = useState(0)
  const [frameTime, setFrameTime] = useState(0)
  const [isRendering, setIsRendering] = useState(false)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const frameTimeRef = useRef<number[]>([])

  useEffect(() => {
    if (!enabled) return

    let animationId: number

    const measurePerformance = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastTimeRef.current
      
      frameTimeRef.current.push(deltaTime)
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift()
      }
      
      frameCountRef.current++
      
      if (frameCountRef.current % 10 === 0) {
        const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length
        setFrameTime(Math.round(avgFrameTime * 100) / 100)
        setFps(Math.round(1000 / avgFrameTime))
      }
      
      lastTimeRef.current = currentTime
      animationId = requestAnimationFrame(measurePerformance)
    }

    animationId = requestAnimationFrame(measurePerformance)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [enabled])

  // Monitor rendering state by checking if requestAnimationFrame is being called
  useEffect(() => {
    if (!enabled) return

    let lastFrameTime = performance.now()
    let frameCount = 0

    const checkRendering = () => {
      const currentTime = performance.now()
      const deltaTime = currentTime - lastFrameTime
      
      if (deltaTime > 100) { // If no frame for 100ms, consider not rendering
        setIsRendering(false)
      } else {
        setIsRendering(true)
        frameCount++
      }
      
      lastFrameTime = currentTime
      setTimeout(checkRendering, 100)
    }

    checkRendering()
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>FPS: <span className={fps > 30 ? 'text-green-400' : fps > 15 ? 'text-yellow-400' : 'text-red-400'}>{fps}</span></div>
        <div>Frame Time: <span className={frameTime < 16 ? 'text-green-400' : frameTime < 33 ? 'text-yellow-400' : 'text-red-400'}>{frameTime}ms</span></div>
        <div>Rendering: <span className={isRendering ? 'text-green-400' : 'text-red-400'}>{isRendering ? 'YES' : 'NO'}</span></div>
      </div>
    </div>
  )
}
