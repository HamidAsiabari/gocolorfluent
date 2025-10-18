import { StageConfig } from '../../../store/useAppStore'

// Stage 3 Desktop Configuration - Different angle and warmer lighting
export const stage3DesktopConfig: StageConfig = {
  model: {
    position: { x: 1.0, y: -0.1, z: 1.4 },
    rotation: { x: 0.2, y: -1.0, z: 2.2 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0.4, y: 0.2, z: 5.4 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
    zoom: 1
  },
  lighting: {
    ambientIntensity: 2.2,
    ambientColor: '#fff8f0',
    directionalIntensity: 3.4,
    directionalColor: '#fff8f0',
    directionalPosition: { x: 12, y: 16.1, z: 2 },
    directionalTarget: { x: 1.2, y: 4.2, z: 0.2 },
    pointLightIntensity: 2.2,
    pointLightColor: '#fff8f0',
    pointLightPosition: { x: 1.4, y: 1.2, z: 1.2 },
    pointLightDistance: 1,
    spotLightIntensity: 2.2,
    spotLightColor: '#fff8f0',
    spotLightPosition: { x: -3.2, y: 0.7, z: 1.7 },
    spotLightTarget: { x: 0.2, y: 0.2, z: 0.2 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
