import { StageConfig } from '../../../store/useAppStore'

// Stage 5 Desktop Configuration - Different angle and green tint
export const stage5DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.6, y: -0.1, z: 1.8 },
    rotation: { x: 0.3, y: -0.6, z: 2.0 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0.8, y: 0.4, z: 5.8 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
    zoom: 1
  },
  lighting: {
    ambientIntensity: 2.4,
    ambientColor: '#f0fff0',
    directionalIntensity: 3.8,
    directionalColor: '#f0fff0',
    directionalPosition: { x: 14, y: 16.3, z: 3 },
    directionalTarget: { x: 1.4, y: 4.4, z: 0.4 },
    pointLightIntensity: 2.4,
    pointLightColor: '#f0fff0',
    pointLightPosition: { x: 1.8, y: 1.4, z: 1.4 },
    pointLightDistance: 1,
    spotLightIntensity: 2.4,
    spotLightColor: '#f0fff0',
    spotLightPosition: { x: -2.8, y: 0.9, z: 1.9 },
    spotLightTarget: { x: 0.4, y: 0.4, z: 0.4 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
