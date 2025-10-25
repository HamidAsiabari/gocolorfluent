'use client'

import React, { useEffect, useRef, useState } from 'react'

interface PerformanceMonitorProps {
  componentName: string
  children?: React.ReactNode
}

export default function PerformanceMonitor({ componentName, children }: PerformanceMonitorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [memoryUsage, setMemoryUsage] = useState(0)
  const [fps, setFps] = useState(0)
  const renderCount = useRef(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useEffect(() => {
    setIsMounted(true)
    
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      const memoryInterval = setInterval(() => {
        setMemoryUsage((performance as any).memory.usedJSHeapSize / 1024 / 1024) // MB
      }, 1000)
      
      return () => {
        clearInterval(memoryInterval)
        window.removeEventListener('resize', checkMobile)
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // FPS monitoring
  useEffect(() => {
    if (!isMounted) return

    const measureFPS = () => {
      const now = performance.now()
      frameCount.current++
      
      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)))
        frameCount.current = 0
        lastTime.current = now
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    requestAnimationFrame(measureFPS)
  }, [isMounted])

  if (!isMounted) {
    return children ? <>{children}</> : null
  }

  renderCount.current++

  // Log performance metrics in development (reduced frequency)
  if (process.env.NODE_ENV === 'development' && renderCount.current % 300 === 0) {
    console.log(`[${componentName}] Performance:`, {
      renders: renderCount.current,
      fps,
      memory: memoryUsage > 0 ? `${memoryUsage.toFixed(1)}MB` : 'N/A',
      mobile: isMobile,
      devicePixelRatio: window.devicePixelRatio
    })
  }

  return children ? <>{children}</> : null
}

// Simplified hooks that don't cause infinite loops
export function useStateTracker(stateName: string, value: any) {
  // Disabled to prevent infinite loops
  return
}

export function useEffectTracker(effectName: string, dependencies: any[]) {
  // Disabled to prevent infinite loops
  return
}