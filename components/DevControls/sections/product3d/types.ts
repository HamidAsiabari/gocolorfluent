export interface ComponentTransform {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  visible: boolean
}

export interface ComponentControls {
  // Core Mechanical Components
  microGearmotor: ComponentTransform
  gearMotorPCB: ComponentTransform
  motorHolder: ComponentTransform
  holderSupport: ComponentTransform
  coupling: ComponentTransform
  m5Screw: ComponentTransform
  
  // Brush & Application System
  movingPlate: ComponentTransform
  siliconSupport: ComponentTransform
  nozzle: ComponentTransform
  nozzleBlinder: ComponentTransform
  
  // Main Housing & Structure
  upperSideMainHolder: ComponentTransform
  lowerSideMain: ComponentTransform
  upperCover: ComponentTransform
  loadingMaterialCover: ComponentTransform
  
  // Electronic Components
  colorSensorPCB: ComponentTransform
  sts8dn3llh5: ComponentTransform
  oledDisplay: ComponentTransform
  detectorSwitch: ComponentTransform
  slideSwitch: ComponentTransform
  
  // LED & Lighting
  everlightLEDs: ComponentTransform
  sensorGuideLight: ComponentTransform
  
  // User Interface
  knobs: ComponentTransform
  drainButtonActuator: ComponentTransform
  handleUpCover: ComponentTransform
  
  // Support & Guide Components
  hairGuideSupport: ComponentTransform
  skqyafComponents: ComponentTransform
  
  // Additional Parts
  productComponents: ComponentTransform
  genericParts: ComponentTransform
  importedComponents: ComponentTransform
}

export interface CategoryVisibility {
  coreMechanical: boolean
  brushApplication: boolean
  mainHousing: boolean
  electronic: boolean
  ledLighting: boolean
  userInterface: boolean
  supportGuide: boolean
  additionalParts: boolean
}

export const defaultCategoryVisibility: CategoryVisibility = {
  coreMechanical: true,
  brushApplication: true,
  mainHousing: true,
  electronic: true,
  ledLighting: true,
  userInterface: true,
  supportGuide: true,
  additionalParts: true
}

// Mapping of categories to their component keys
export const categoryComponentMap: { [K in keyof CategoryVisibility]: (keyof ComponentControls)[] } = {
  coreMechanical: ['microGearmotor', 'gearMotorPCB', 'motorHolder', 'holderSupport', 'coupling', 'm5Screw'],
  brushApplication: ['movingPlate', 'siliconSupport', 'nozzle', 'nozzleBlinder'],
  mainHousing: ['upperSideMainHolder', 'lowerSideMain', 'upperCover', 'loadingMaterialCover'],
  electronic: ['colorSensorPCB', 'sts8dn3llh5', 'oledDisplay', 'detectorSwitch', 'slideSwitch'],
  ledLighting: ['everlightLEDs', 'sensorGuideLight'],
  userInterface: ['knobs', 'drainButtonActuator', 'handleUpCover'],
  supportGuide: ['hairGuideSupport', 'skqyafComponents'],
  additionalParts: ['productComponents', 'genericParts', 'importedComponents']
}

export const defaultComponentTransform: ComponentTransform = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  visible: true
}

export const defaultComponentControls: ComponentControls = {
  // Core Mechanical Components - all neutral (no transformations applied)
  microGearmotor: { ...defaultComponentTransform },
  gearMotorPCB: { ...defaultComponentTransform },
  motorHolder: { ...defaultComponentTransform },
  holderSupport: { ...defaultComponentTransform },
  coupling: { ...defaultComponentTransform },
  m5Screw: { ...defaultComponentTransform },
  
  // Brush & Application System
  movingPlate: { ...defaultComponentTransform },
  siliconSupport: { ...defaultComponentTransform },
  nozzle: { ...defaultComponentTransform },
  nozzleBlinder: { ...defaultComponentTransform },
  
  // Main Housing & Structure
  upperSideMainHolder: { ...defaultComponentTransform },
  lowerSideMain: { ...defaultComponentTransform },
  upperCover: { ...defaultComponentTransform },
  loadingMaterialCover: { ...defaultComponentTransform },
  
  // Electronic Components
  colorSensorPCB: { ...defaultComponentTransform },
  sts8dn3llh5: { ...defaultComponentTransform },
  oledDisplay: { ...defaultComponentTransform },
  detectorSwitch: { ...defaultComponentTransform },
  slideSwitch: { ...defaultComponentTransform },
  
  // LED & Lighting
  everlightLEDs: { ...defaultComponentTransform },
  sensorGuideLight: { ...defaultComponentTransform },
  
  // User Interface
  knobs: { ...defaultComponentTransform },
  drainButtonActuator: { ...defaultComponentTransform },
  handleUpCover: { ...defaultComponentTransform },
  
  // Support & Guide Components
  hairGuideSupport: { ...defaultComponentTransform },
  skqyafComponents: { ...defaultComponentTransform },
  
  // Additional Parts
  productComponents: { ...defaultComponentTransform },
  genericParts: { ...defaultComponentTransform },
  importedComponents: { ...defaultComponentTransform }
}
