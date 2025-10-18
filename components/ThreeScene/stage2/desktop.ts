import { StageConfig } from '../../../store/useAppStore'

// Stage 2 Desktop Configuration - Different viewing angle within furniture environment
export const stage2DesktopConfig: StageConfig = {
  model: {
    position: { x: 0, y: 0.2, z: -8 }, // Positioned on furniture surface in front of back wall
    rotation: { x: 0, y: 0.6, z: 0 }, // Different rotation angle
    scale: { x: 4, y: 4, z: 4 } // Consistent scale for furniture
  },
  camera: {
    position: { x: -2, y: 1.8, z: 1.5 }, // Different camera angle for furniture against wall
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: -8 }, // Target the furniture position
    fov: 80,
    near: 0.1,
    far: 1000,
    zoom: 1
  },
  lighting: {
    ambientIntensity: 0.6, // Good ambient lighting for furniture
    ambientColor: '#ffffff',
    directionalIntensity: 1.3, // Balanced lighting
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 9, z: 4 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.9,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: 1.5, y: 2, z: 1.5 },
    pointLightDistance: 1,
    spotLightIntensity: 2.1, // Strong spotlight for furniture display
    spotLightColor: '#ffffff',
    spotLightPosition: { x: 2, y: 2.5, z: 2 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
