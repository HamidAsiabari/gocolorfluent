import { StageConfig } from '../../../store/useAppStore'

// Stage 2 Desktop Configuration - Slightly different angle and lighting
export const stage2DesktopConfig: StageConfig = {
  model: {
    position: { x: 1.2, y: -0.1, z: 1.2 },
    rotation: { x: 0.15, y: -1.2, z: 2.3 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0.2, y: 0.1, z: 5.2 },
    fov: 75
  },
  lighting: {
    ambientIntensity: 2.1,
    ambientColor: '#ffffff',
    directionalIntensity: 3.2,
    directionalColor: '#ffffff',
    directionalPosition: { x: 11, y: 16, z: 1.5 },
    directionalTarget: { x: 1.1, y: 4.1, z: 0.1 },
    pointLightIntensity: 2.1,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: 1.2, y: 1.1, z: 1.1 },
    pointLightDistance: 1,
    spotLightIntensity: 2.1,
    spotLightColor: '#ffffff',
    spotLightPosition: { x: -3.4, y: 0.6, z: 1.6 },
    spotLightTarget: { x: 0.1, y: 0.1, z: 0.1 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
