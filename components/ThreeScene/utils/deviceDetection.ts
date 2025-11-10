/**
 * Device detection utilities for Three.js optimization
 */

export interface DeviceCapabilities {
  isMobile: boolean
  isLowEnd: boolean
  hardwareConcurrency: number
  deviceMemory?: number
  userAgent: string
}

/**
 * Check if device is mobile based on viewport width
 * @returns True if mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Check if device is low-end based on hardware capabilities
 * @returns True if low-end device
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  
  const width = typeof window !== 'undefined' ? window.innerWidth : 0
  const mem = Math.min(((navigator as any).deviceMemory || 4), 8)
  const cores = navigator.hardwareConcurrency || 4
  const isLowEnd = 
    cores <= 4 || // Low CPU cores
    mem <= 4 || // Low RAM (if available), clamp to avoid extreme misreports
    /Android.*Chrome\/[0-5][0-9]|iPhone.*Safari\/[0-5][0-9]|iPad.*Safari\/[0-5][0-9]/.test(navigator.userAgent) || // Old browsers
    /Android.*Chrome\/[0-9][0-9]/.test(navigator.userAgent) && width < 480 // Small Android devices
  
  return isLowEnd
}

/**
 * Detect device capabilities and return full device info
 * @returns Device capabilities object
 */
export function detectDevice(): DeviceCapabilities {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0
  const isMobile = width < 768
  
  const capabilities: DeviceCapabilities = {
    isMobile,
    isLowEnd: isLowEndDevice(),
    hardwareConcurrency: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 8,
    deviceMemory: typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
  }
  
  return capabilities
}

/**
 * Check if device should use low-power settings
 * @returns True if device needs low-power optimization
 */
export function needsLowPowerMode(): boolean {
  return isMobileDevice() || isLowEndDevice()
}

