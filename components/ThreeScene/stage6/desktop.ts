import { StageConfig } from '../../../store/useAppStore'

// Stage 6 Desktop Configuration - Different angle and purple tint
export const stage6DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.4, y: -0.1, z: 2.0 },
    rotation: { x: 0.35, y: -0.4, z: 1.9 },
    scale: { x: 10, y: 10, z: 10 }
  },
  camera: {
    position: { x: 1.0, y: 0.5, z: 6.0 },
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75,
    near: 0.1,
    far: 1000,
    zoom: 1
  },
  lighting: {
    ambientIntensity: 2.5,
    ambientColor: '#f8f0ff',
    directionalIntensity: 4.0,
    directionalColor: '#f8f0ff',
    directionalPosition: { x: 15, y: 16.4, z: 3.5 },
    directionalTarget: { x: 1.5, y: 4.5, z: 0.5 },
    pointLightIntensity: 2.5,
    pointLightColor: '#f8f0ff',
    pointLightPosition: { x: 2.0, y: 1.5, z: 1.5 },
    pointLightDistance: 1,
    spotLightIntensity: 2.5,
    spotLightColor: '#f8f0ff',
    spotLightPosition: { x: -2.6, y: 1.0, z: 2.0 },
    spotLightTarget: { x: 0.5, y: 0.5, z: 0.5 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
