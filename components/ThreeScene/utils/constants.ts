/**
 * Constants for Three.js scene configuration
 */

/**
 * Room dimensions in units
 */
export const ROOM_DIMENSIONS = {
  width: 25,
  depth: 20,
  height: 20
} as const

/**
 * Mobile device threshold (viewport width in pixels)
 */
export const MOBILE_THRESHOLD = 768

/**
 * Low-end device thresholds
 */
export const LOW_END_CPU_CORES = 4
export const LOW_END_RAM_GB = 4

/**
 * Texture file paths
 */
export const TEXTURE_PATHS = {
  oled: '/oled-screen.png',
  furniture: '/product-3d/Furniture_No-23.glb',
  wall: '/textures/wall_texture.jpg',
  floor: '/textures/floor_texture.jpg',
  ceiling: '/textures/ceiling_texture.jpg'
} as const

/**
 * Renderer settings for mobile vs desktop
 */
export const RENDERER_SETTINGS = {
  mobile: {
    antialias: false,
    precision: 'lowp' as const,
    powerPreference: 'low-power' as const,
    stencil: false,
    depth: true
  },
  desktop: {
    antialias: true,
    precision: 'highp' as const,
    powerPreference: 'high-performance' as const,
    stencil: false,
    depth: true
  }
} as const

/**
 * Camera settings
 */
export const CAMERA_SETTINGS = {
  mobile: {
    fovOffset: 15, // Additional FOV for mobile
    positionYOffset: 0.5, // Move camera higher
    positionZOffset: 2 // Move camera further back
  },
  desktop: {
    fovOffset: 0,
    positionYOffset: 0,
    positionZOffset: 0
  }
} as const

