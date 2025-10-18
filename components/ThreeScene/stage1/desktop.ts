import { StageConfig } from '../../../store/useAppStore'

// Stage 1 Desktop Configuration - Dramatic dark entrance for luxury launch
export const stage1DesktopConfig: StageConfig = {
  model: {
    position: { x: 1.4, y: -0.1, z: 1 },
    rotation: { x: 0.1, y: -1.37, z: 2.41 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 5 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2,
    ambientColor: '#ffffff',
    directionalIntensity: 3,
    directionalColor: '#ffffff',
    directionalPosition: { x: 10, y: 15.9, z: 1 },
    directionalTarget: { x: 1, y: 4, z: 0 },
    pointLightIntensity: 2,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: 1, y: 1, z: 1 },
    pointLightDistance: 1,
    spotLightIntensity: 2,
    spotLightColor: '#ffffff',
    spotLightPosition: { x: -3.6, y: 0.5, z: 1.5 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
