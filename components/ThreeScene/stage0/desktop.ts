import { StageConfig } from '../../../store/useAppStore'

// Stage 0 Desktop Configuration - Loading/Initial position before stage 1
export const stage0DesktopConfig: StageConfig = {
  model: {
    position: { x: 0, y: -2, z: -2 }, // Start further back and lower
    rotation: { x: 0.3, y: 0, z: 0 }, // Slight tilt for dramatic effect
    scale: { x: 8, y: 8, z: 8 } // Slightly smaller scale
  },
  camera: {
    position: { x: 0, y: 1, z: 8 }, // Start further back
    fov: 75
  },
  lighting: {
    ambientIntensity: 0.5, // Dimmer ambient light
    ambientColor: '#ffffff',
    directionalIntensity: 1, // Dimmer directional light
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 10, z: 5 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0.5, // Dimmer point light
    pointLightColor: '#ffffff',
    pointLightPosition: { x: 0, y: 0, z: 0 },
    pointLightDistance: 1,
    spotLightIntensity: 2, // Keep spotlight for dramatic effect
    spotLightColor: '#ffffff',
    spotLightPosition: { x: 0, y: 2, z: 3 },
    spotLightTarget: { x: 0, y: -1, z: 0 },
    spotLightDistance: 10,
    spotLightAngle: 60, // Wider angle
    spotLightPenumbra: 0.5,
    shadowsEnabled: false,
    shadowMapSize: 4096,
    shadowBias: 0.001
  }
}
