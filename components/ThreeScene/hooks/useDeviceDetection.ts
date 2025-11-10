'use client'

import { useState, useEffect } from 'react'
import { detectDevice } from '../utils/deviceDetection'

/**
 * Hook for detecting device capabilities
 * Detects if device is mobile or low-end for optimization purposes
 */
export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLowEndDevice, setIsLowEndDevice] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const capabilities = detectDevice()
      
      setIsMobile(capabilities.isMobile)
      setIsLowEndDevice(capabilities.isLowEnd)
      
      console.log('📱 Device detection:', capabilities)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return { isMobile, isLowEndDevice }
}

