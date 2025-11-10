import * as THREE from 'three'

/**
 * Linear interpolation between two numbers
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Linear interpolation between two Vector3 objects
 * @param start - Starting Vector3
 * @param end - Ending Vector3
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated Vector3
 */
export function lerpVector3(
  start: { x: number; y: number; z: number },
  end: { x: number; y: number; z: number },
  t: number
): { x: number; y: number; z: number } {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    z: lerp(start.z, end.z, t)
  }
}

/**
 * Interpolate between two hex colors
 * @param startColor - Starting color in hex format (#rrggbb)
 * @param endColor - Ending color in hex format (#rrggbb)
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated color in hex format
 */
export function lerpColor(startColor: string, endColor: string, t: number): string {
  const start = startColor.replace('#', '')
  const end = endColor.replace('#', '')
  
  const startR = parseInt(start.substr(0, 2), 16)
  const startG = parseInt(start.substr(2, 2), 16)
  const startB = parseInt(start.substr(4, 2), 16)
  
  const endR = parseInt(end.substr(0, 2), 16)
  const endG = parseInt(end.substr(2, 2), 16)
  const endB = parseInt(end.substr(4, 2), 16)
  
  const r = Math.round(lerp(startR, endR, t))
  const g = Math.round(lerp(startG, endG, t))
  const b = Math.round(lerp(startB, endB, t))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Ease in-out sine function for smooth animations
 * @param t - Input value (0-1)
 * @returns Eased value
 */
export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

/**
 * Ease out cubic function for animations
 * @param t - Input value (0-1)
 * @returns Eased value
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

