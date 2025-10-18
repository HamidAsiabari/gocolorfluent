'use client'

import React, { useEffect, useRef, useState } from 'react'

interface PerformanceMonitorProps {
  componentName: string
  children?: React.ReactNode
}

export default function PerformanceMonitor({ componentName, children }: PerformanceMonitorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const renderCount = useRef(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return children ? <>{children}</> : null
  }

  renderCount.current++

  // Disabled to prevent console spam
  // if (process.env.NODE_ENV === 'development' && renderCount.current % 10 === 0) {
  //   console.log(`[${componentName}] Rendered ${renderCount.current} times`)
  // }

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