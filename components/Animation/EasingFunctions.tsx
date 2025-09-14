// Easing functions for smooth animations

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export const easeInOutQuart = (t: number): number => {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

export const easeInOutSine = (t: number): number => {
  return -(Math.cos(Math.PI * t) - 1) / 2
}

// Use the smoothest easing function
export const easeInOut = easeInOutSine

// Interpolation function for smooth animation
export const lerp = (start: number, end: number, progress: number) => {
  return start + (end - start) * progress
}

// Color interpolation function
export const lerpColor = (startColor: string, endColor: string, progress: number): string => {
  // Remove # from hex colors
  const start = startColor.replace('#', '')
  const end = endColor.replace('#', '')
  
  // Convert to RGB
  const startR = parseInt(start.substr(0, 2), 16)
  const startG = parseInt(start.substr(2, 2), 16)
  const startB = parseInt(start.substr(4, 2), 16)
  
  const endR = parseInt(end.substr(0, 2), 16)
  const endG = parseInt(end.substr(2, 2), 16)
  const endB = parseInt(end.substr(4, 2), 16)
  
  // Interpolate each component
  const r = Math.round(lerp(startR, endR, progress))
  const g = Math.round(lerp(startG, endG, progress))
  const b = Math.round(lerp(startB, endB, progress))
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
