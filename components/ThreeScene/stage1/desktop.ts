import { StageConfig } from '../../../store/useAppStore'

// Stage 1 Desktop Configuration - Product showcase within furniture environment
export const stage1DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.2, y: 1.87, z: -9 }, // Fine-tuned position with slight X offset
    rotation: { x: -0.11, y: 5, z: 3.07 }, // Precise rotation angles
    scale: { x: 2, y: 2, z: 2 } // Consistent scale
  },
  camera: {
    position: { x: -0.3, y: 2.5, z: -8.1 }, // Offset camera position
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0.2, y: 1.4, z: -10 }, // Target the model position
    fov: 50, // Narrower field of view
    near: 0.01, // Closer near plane
    far: 100, // Closer far plane
    zoom: 1,
    focusDistance: 9, // Focus on the model area
    aperture: 0.1, // Small aperture for strong depth of field
    maxBlur: 0.05, // Maximum blur amount (reduced from 0.1)
    bokehScale: 2, // Bokeh scale for better blur quality
    darkenPeriphery: 0.2 // Darken the periphery (reduced from 0.4)
  },
  lighting: {
    ambientIntensity: 0.8,
    ambientColor: '#ffeed6',
    directionalIntensity: 5,
    directionalColor: '#ffd6a3',
    directionalPosition: { x: 2.4, y: 5.3, z: -3.3 },
    directionalTarget: { x: 0, y: 0, z: 0 },
    pointLightIntensity: 0,
    pointLightColor: '#ffffff',
    pointLightPosition: { x: 1, y: 1, z: 1 },
    pointLightDistance: 1,
    spotLightIntensity: 0,
    spotLightColor: '#ffffff',
    spotLightPosition: { x: 0, y: 0, z: 0 },
    spotLightTarget: { x: 0, y: 0, z: 0 },
    spotLightDistance: 49,
    spotLightAngle: 90,
    spotLightPenumbra: 1,
    shadowsEnabled: true,
    shadowMapSize: 1024,
    shadowBias: 0.001
  }
}
