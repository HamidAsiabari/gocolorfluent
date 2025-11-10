import * as THREE from 'three'

/**
 * Parse hex color string to RGB values
 * @param hex - Hex color string (#rrggbb)
 * @returns RGB values
 */
export function parseHexColor(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substr(0, 2), 16)
  const g = parseInt(cleaned.substr(2, 2), 16)
  const b = parseInt(cleaned.substr(4, 2), 16)
  
  return { r, g, b }
}

/**
 * Convert hex color to THREE.Color object
 * @param hex - Hex color string (#rrggbb)
 * @returns THREE.Color object
 */
export function hexToThreeColor(hex: string): THREE.Color {
  const { r, g, b } = parseHexColor(hex)
  return new THREE.Color(r / 255, g / 255, b / 255)
}

/**
 * Interpolate between two colors
 * @param start - Starting color in hex format
 * @param end - Ending color in hex format
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated hex color
 */
export function interpolateColors(start: string, end: string, t: number): string {
  const startColor = parseHexColor(start)
  const endColor = parseHexColor(end)
  
  const lerp = (s: number, e: number, t: number) => s + (e - s) * t
  
  const r = Math.round(lerp(startColor.r, endColor.r, t))
  const g = Math.round(lerp(startColor.g, endColor.g, t))
  const b = Math.round(lerp(startColor.b, endColor.b, t))
  
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

