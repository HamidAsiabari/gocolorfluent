import { StageConfig } from '../../../store/useAppStore'

// Stage 0 Desktop Configuration - Loading/Initial position within furniture environment
export const stage0DesktopConfig: StageConfig = {
  model: {
    position: { x: 0.2, y: 1.87, z: -9 }, // Fine-tuned position with X offset
    rotation: { x: -0.11, y: 5, z: 3.07 }, // Precise rotation angles
    scale: { x: 2, y: 2, z: 2 } // Maintained scale
  },
  camera: {
    position: { x: 0, y: 4, z: 0 }, // Elevated camera position
    rotation: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: -26 }, // Target far back in the scene
    fov: 50, // Narrower field of view
    near: 0.01, // Closer near plane
    far: 100, // Closer far plane
    zoom: 1,
    focusDistance: 26, // Focus on the center of the scene
    aperture: 0.1, // Small aperture for strong depth of field
    maxBlur: 0.05, // Maximum blur amount (reduced from 0.1)
    bokehScale: 2, // Bokeh scale for better blur quality
    darkenPeriphery: 0.15 // Darken the periphery (reduced from 0.3)
  },
  lighting: {
    ambientIntensity: 0, // No ambient lighting
    ambientColor: '#ffffff',
    directionalIntensity: 1, // Reduced directional lighting
    directionalColor: '#ffffff',
    directionalPosition: { x: 1, y: -2.1, z: 4.8 },
    directionalTarget: { x: -2.1, y: -2.2, z: 2.6 },
    pointLightIntensity: 2, // Maintained point light intensity
    pointLightColor: '#fff2e5', // Warm white color
    pointLightPosition: { x: 0, y: 2.2, z: -8.9 },
    pointLightDistance: 5, // Increased distance
    spotLightIntensity: 2, // Maintained spot light intensity
    spotLightColor: '#ffffff',
    spotLightPosition: { x: 0, y: 3, z: 10.8 },
    spotLightTarget: { x: 0, y: 0, z: 8.6 },
    spotLightDistance: 1,
    spotLightAngle: 5, // Narrower spot light angle
    spotLightPenumbra: 0, // No penumbra for sharp edges
    shadowsEnabled: false,
    shadowMapSize: 4096, // Higher resolution shadow map
    shadowBias: 0.001
  }
}
