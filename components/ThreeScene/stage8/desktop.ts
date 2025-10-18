import { StageConfig } from '../../../store/useAppStore'

// Stage 8 Desktop Configuration
export const stage8DesktopConfig: StageConfig = {
  model: {
    position: { x: -0.8, y: -0.1, z: 3.7 },
    rotation: { x: -0.04, y: -0.21, z: 0.2 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 0, y: 0, z: 8 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
    zoom: 1
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
    shadowsEnabled: false,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }
}
