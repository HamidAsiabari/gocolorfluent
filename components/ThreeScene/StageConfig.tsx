export interface ModelConfig {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

export interface CameraConfig {
  position: { x: number; y: number; z: number }
  fov: number
}

export interface LightingConfig {
  ambientIntensity: number
  ambientColor: string
  directionalIntensity: number
  directionalColor: string
  directionalPosition: { x: number; y: number; z: number }
  directionalTarget: { x: number; y: number; z: number }
  pointLightIntensity: number
  pointLightColor: string
  pointLightPosition: { x: number; y: number; z: number }
  pointLightDistance: number
  spotLightIntensity: number
  spotLightColor: string
  spotLightPosition: { x: number; y: number; z: number }
  spotLightTarget: { x: number; y: number; z: number }
  spotLightDistance: number
  spotLightAngle: number
  spotLightPenumbra: number
  shadowsEnabled: boolean
  shadowMapSize: number
  shadowBias: number
}

export interface StageConfig {
  model: ModelConfig
  camera: CameraConfig
  lighting: LightingConfig
}

// Device type definitions
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025
} as const

// Helper function to determine device type based on window width
export const getDeviceType = (width: number): DeviceType => {
  if (width <= BREAKPOINTS.mobile) return 'mobile'
  if (width <= BREAKPOINTS.tablet) return 'tablet'
  return 'desktop'
}

// Stage 1 configuration (initial state) - Dramatic dark entrance for luxury launch
export const stage1Config: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 0.05,
    ambientColor: '#0a0a0a',
    directionalIntensity: 0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 4,
    spotLightColor: '#1a1a2e',
    spotLightPosition: { x: -10, y: 2, z: 1 },
    spotLightTarget: { x: 0, y: -0.5, z: 1 },
    spotLightDistance: 20,
    spotLightAngle: 12,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 2 configuration - Full luxury lighting reveal with cinematic setup
export const stage2Config: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.8,
    ambientColor: '#fafafa',
    directionalIntensity: 2.2,
    directionalColor: '#ffffff',
    directionalPosition: { x: 2, y: 5, z: 2 },
    directionalTarget: { x: 1.4, y: -0.5, z: 1 },
    pointLightIntensity: 1.2,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -2, y: 2, z: 2 },
    pointLightDistance: 15,
    spotLightIntensity: 3.5,
    spotLightColor: '#ffd294',
    spotLightPosition: { x: 5.2, y: -4, z: 1.4 },
    spotLightTarget: { x: 2.3, y: 0.2, z: -0.1 },
    spotLightDistance: 8,
    spotLightAngle: 73,
    spotLightPenumbra: 0.34,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 3 configuration
export const stage3Config: StageConfig = {
  model: {
    position: { x: 0.1, y: -1.1, z: 1.6 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 4 configuration
export const stage4Config: StageConfig = {
  model: {
    position: { x: -0.4, y: 0.9, z: 1.8 },
    rotation: { x: 0.37, y: -0.34, z: 0 },
    scale: { x: 18, y: 18, z: 18 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 5 configuration
export const stage5Config: StageConfig = {
  model: {
    position: { x: 1.2, y: -1.3, z: 5.6 },
    rotation: { x: -1.52, y: 0.03, z: -1.04 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 6 configuration
export const stage6Config: StageConfig = {
  model: {
    position: { x: -1.7, y: -1.2, z: 5.2 },
    rotation: { x: -1.52, y: 0.03, z: -1.04 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 7 configuration
export const stage7Config: StageConfig = {
  model: {
    position: { x: 2, y: -1.4, z: 4.9 },
    rotation: { x: -1.52, y: 0.52, z: 1.96 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 8 configuration
export const stage8Config: StageConfig = {
  model: {
    position: { x: -0.8, y: -0.1, z: 3.7 },
    rotation: { x: -0.04, y: -0.21, z: 0.2 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 9 configuration
export const stage9Config: StageConfig = {
  model: {
    position: { x: 2.6, y: -1.2, z: 5 },
    rotation: { x: -1.75, y: 0.18, z: 0.29 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Mobile-specific stage configurations
// Stage 1 mobile configuration
export const stage1MobileConfig: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 0,
    ambientColor: '#404040',
    directionalIntensity: 0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 2 mobile configuration
export const stage2MobileConfig: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 3 mobile configuration
export const stage3MobileConfig: StageConfig = {
  model: {
    position: { x: -0.61, y: -1.7, z: 0 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 4 mobile configuration
export const stage4MobileConfig: StageConfig = {
  model: {
    position: { x: -0.5, y: -1.5, z: 1.4 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 5 mobile configuration
export const stage5MobileConfig: StageConfig = {
  model: {
    position: { x: 1.2, y: -1.3, z: 5.6 },
    rotation: { x: -1.52, y: 0.03, z: -1.04 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 6 mobile configuration
export const stage6MobileConfig: StageConfig = {
  model: {
    position: { x: 0.1, y: -1.1, z: 1.6 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 7 mobile configuration
export const stage7MobileConfig: StageConfig = {
  model: {
    position: { x: 0.1, y: -1.1, z: 1.6 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 8 mobile configuration
export const stage8MobileConfig: StageConfig = {
  model: {
    position: { x: 0.1, y: -1.1, z: 1.6 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 9 mobile configuration
export const stage9MobileConfig: StageConfig = {
  model: {
    position: { x: 2.6, y: -1.2, z: 5 },
    rotation: { x: -1.75, y: 0.18, z: 0.29 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Tablet-specific stage configurations
// Stage 1 tablet configuration
export const stage1TabletConfig: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 0,
    ambientColor: '#404040',
    directionalIntensity: 0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 2 tablet configuration
export const stage2TabletConfig: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.5, z: 1 },
    rotation: { x: -0.14, y: -1.14, z: 2.66 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 3 tablet configuration
export const stage3TabletConfig: StageConfig = {
  model: {
    position: { x: 0.1, y: -1.1, z: 1.6 },
    rotation: { x: -0.6, y: 0.51, z: -0.24 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#d9d9d9',
    directionalIntensity: 1.3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 10,
    spotLightIntensity: 2,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 3.4, y: 0, z: 0 },
    spotLightDistance: 23,
    spotLightAngle: 23,
    spotLightPenumbra: 0,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 4 tablet configuration
export const stage4TabletConfig: StageConfig = {
  model: {
    position: { x: -0.2, y: 0.7, z: 1.9 },
    rotation: { x: 0.37, y: -0.34, z: 0 },
    scale: { x: 16, y: 16, z: 16 }
  },
  camera: {
    position: { x: 0, y: 0, z: 7 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 5 tablet configuration
export const stage5TabletConfig: StageConfig = {
  model: {
    position: { x: 1.2, y: -1.3, z: 5.6 },
    rotation: { x: -1.52, y: 0.03, z: -1.04 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 6 tablet configuration
export const stage6TabletConfig: StageConfig = {
  model: {
    position: { x: -1.4, y: -1.0, z: 5.4 },
    rotation: { x: -1.52, y: 0.03, z: -1.04 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 7 tablet configuration
export const stage7TabletConfig: StageConfig = {
  model: {
    position: { x: 1.8, y: -1.2, z: 5.1 },
    rotation: { x: -1.52, y: 0.52, z: 1.96 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 8 tablet configuration
export const stage8TabletConfig: StageConfig = {
  model: {
    position: { x: -0.6, y: 0.1, z: 3.9 },
    rotation: { x: -0.04, y: -0.21, z: 0.2 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}

// Stage 9 tablet configuration
export const stage9TabletConfig: StageConfig = {
  model: {
    position: { x: 2.4, y: -1.0, z: 5.2 },
    rotation: { x: -1.75, y: 0.18, z: 0.29 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 1.5,
    ambientColor: '#f0f0f0',
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 5, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.8,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: -5, y: 5, z: 5 },
    pointLightDistance: 15,
    spotLightIntensity: 1.5,
    spotLightColor: '#e89191',
    spotLightPosition: { x: 0, y: 10, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 25,
    spotLightAngle: 30,
    spotLightPenumbra: 0.1,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}