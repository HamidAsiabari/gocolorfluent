import { StageConfig } from '../../../store/useAppStore'

// Stage 4 Desktop Configuration - Different angle and cooler lighting
export const stage4DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.8, y: -0.1, z: 1.6 },
    rotation: { x: 0.25, y: -0.8, z: 2.1 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0.6, y: 0.3, z: 5.6 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
    zoom: 1
  },
  lighting: {
    ambientIntensity: 2.3,
    ambientColor: '#f0f8ff',
    directionalIntensity: 3.6,
    directionalColor: '#f0f8ff',
    directionalPosition: { x: 13, y: 16.2, z: 2.5 },
    directionalTarget: { x: 1.3, y: 4.3, z: 0.3 },
    pointLightIntensity: 2.3,
    pointLightColor: '#f0f8ff',
    pointLightPosition: { x: 1.6, y: 1.3, z: 1.3 },
    pointLightDistance: 1,
    spotLightIntensity: 2.3,
    spotLightColor: '#f0f8ff',
    spotLightPosition: { x: -3.0, y: 0.8, z: 1.8 },
    spotLightTarget: { x: 0.3, y: 0.3, z: 0.3 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
