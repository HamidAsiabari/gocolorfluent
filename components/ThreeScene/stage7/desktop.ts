import { StageConfig } from '../../../store/useAppStore'

// Stage 7 Desktop Configuration - Different angle and orange tint
export const stage7DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.2, y: -0.1, z: 2.2 },
    rotation: { x: 0.4, y: -0.2, z: 1.8 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 1.2, y: 0.6, z: 6.2 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2.6,
    ambientColor: '#fff8f0',
    directionalIntensity: 4.2,
    directionalColor: '#fff8f0',
    directionalPosition: { x: 16, y: 16.5, z: 4 },
    directionalTarget: { x: 1.6, y: 4.6, z: 0.6 },
    pointLightIntensity: 2.6,
    pointLightColor: '#fff8f0',
    pointLightPosition: { x: 2.2, y: 1.6, z: 1.6 },
    pointLightDistance: 1,
    spotLightIntensity: 2.6,
    spotLightColor: '#fff8f0',
    spotLightPosition: { x: -2.4, y: 1.1, z: 2.1 },
    spotLightTarget: { x: 0.6, y: 0.6, z: 0.6 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
