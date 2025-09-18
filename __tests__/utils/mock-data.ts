// Mock data for testing components

export const mockModelControls = {
  position: { x: 2, y: -0.3, z: 0 },
  rotation: { x: -0.03, y: 0.1, z: 0.27 },
  scale: { x: 10, y: 10, z: 10 }
}

export const mockCameraControls = {
  position: { x: 0, y: 0, z: 5 },
  fov: 75
}

export const mockLightingControls = {
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

export const mockStage1Config = {
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

export const mockStage2Config = {
  model: {
    position: { x: 2, y: -0.3, z: 0 },
    rotation: { x: -0.9, y: -0.15, z: -0.29 },
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

export const mockStage3Config = {
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

export const mockDevControlsProps = {
  isDevMode: true,
  onToggleDevMode: jest.fn(),
  modelControls: mockModelControls,
  onModelControlsChange: jest.fn(),
  cameraControls: mockCameraControls,
  onCameraControlsChange: jest.fn(),
  lightingControls: mockLightingControls,
  onLightingControlsChange: jest.fn(),
  currentSection: 1,
  isScrolling: false,
  scrollDirection: null as 'up' | 'down' | null,
  transitionName: null,
  scrollPosition: 0,
  isClient: true,
  stage1Config: mockStage1Config,
  stage2Config: mockStage2Config,
  stage3Config: mockStage3Config,
  current3DStage: 1,
  stage3DAnimationProgress: 0
}

export const mockThreeSceneManagerProps = {
  mountRef: { current: document.createElement('div') },
  modelControls: mockModelControls,
  cameraControls: mockCameraControls,
  lightingControls: mockLightingControls,
  isAnimating: false,
  animationProgress: 0,
  is3DAnimating: false,
  stage3DAnimationProgress: 0,
  current3DStage: 1,
  getAnimatedValues: jest.fn(() => ({
    model: mockModelControls,
    camera: mockCameraControls,
    lighting: mockLightingControls
  }))
}
