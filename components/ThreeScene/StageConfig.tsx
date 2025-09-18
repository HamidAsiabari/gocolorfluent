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

// Stage 1 configuration (initial state)
export const stage1Config: StageConfig = {
  model: {
    position: { x: 2, y: -0.3, z: 0 },
    rotation: { x: -0.03, y: 0.1, z: 0.27 },
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

// Stage 2 configuration
export const stage2Config: StageConfig = {
  model: {
    position: { x: 2.7, y: -1.2, z: -0.1 },
    rotation: { x: -0.84, y: 0.04, z: -0.06 },
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