import { LightingControls } from '../../store/useAppStore'

export interface LuxuryLightingAnimationConfig {
  stage1: LightingControls
  stage2: LightingControls
  duration: number
}

export interface LuxuryLightingStep {
  progress: number
  lighting: LightingControls
}

export class LuxuryLightingAnimation {
  private config: LuxuryLightingAnimationConfig
  private steps: LuxuryLightingStep[] = []

  constructor(config: LuxuryLightingAnimationConfig) {
    this.config = config
    this.generateSteps()
  }

  private generateSteps() {
    const { stage1, stage2, duration } = this.config
    const stepCount = 60 // 60 steps for smooth animation
    const stepDuration = duration / stepCount

    for (let i = 0; i <= stepCount; i++) {
      const progress = i / stepCount
      const lighting = this.calculateLuxuryLighting(stage1, stage2, progress)
      this.steps.push({ progress, lighting })
    }
  }

  private calculateLuxuryLighting(stage1: LightingControls, stage2: LightingControls, progress: number): LightingControls {
    // Create a luxury product launch animation with cinematic phases
    
    // Phase 1 (0-0.2): Dramatic entrance - very dark with focused spotlight
    // Phase 2 (0.2-0.4): Spotlight sweep and dramatic reveal
    // Phase 3 (0.4-0.6): Add rim lighting and expand illumination
    // Phase 4 (0.6-0.8): Add backlighting and increase ambient
    // Phase 5 (0.8-1.0): Full luxury lighting reveal

    let ambientIntensity: number
    let directionalIntensity: number
    let pointLightIntensity: number
    let spotLightIntensity: number
    let spotLightAngle: number
    let spotLightPosition: { x: number; y: number; z: number }
    let spotLightTarget: { x: number; y: number; z: number }
    let spotLightColor: string

    if (progress <= 0.2) {
      // Phase 1: Dramatic entrance - very dark with focused spotlight
      const phaseProgress = progress / 0.2
      const easeProgress = this.easeOutCubic(phaseProgress)
      
      ambientIntensity = stage1.ambientIntensity
      directionalIntensity = 0
      pointLightIntensity = 0
      spotLightIntensity = stage1.spotLightIntensity * (0.2 + easeProgress * 0.8) // Start very dim, dramatic build up
      spotLightAngle = stage1.spotLightAngle * (0.3 + easeProgress * 0.7) // Start very narrow, expand dramatically
      spotLightColor = this.lerpColor('#0a0a1a', stage1.spotLightColor, easeProgress) // Deep blue to warm white
      
      // Keep spotlight at starting position
      spotLightPosition = stage1.spotLightPosition
      spotLightTarget = stage1.spotLightTarget
    } else if (progress <= 0.4) {
      // Phase 2: Spotlight sweep and dramatic reveal
      const phaseProgress = (progress - 0.2) / 0.2
      const easeProgress = this.easeOutElastic(phaseProgress)
      
      ambientIntensity = stage1.ambientIntensity
      directionalIntensity = 0
      pointLightIntensity = 0
      spotLightIntensity = stage1.spotLightIntensity + (stage2.spotLightIntensity - stage1.spotLightIntensity) * easeProgress * 0.7
      spotLightAngle = stage1.spotLightAngle + (stage2.spotLightAngle - stage1.spotLightAngle) * easeProgress * 0.5
      spotLightColor = this.lerpColor(stage1.spotLightColor, '#ffffff', easeProgress) // Warm white to pure white
      
      // Sweep spotlight from left to center with dramatic arc movement
      spotLightPosition = {
        x: stage1.spotLightPosition.x + (stage2.spotLightPosition.x - stage1.spotLightPosition.x) * easeProgress,
        y: stage1.spotLightPosition.y + (stage2.spotLightPosition.y - stage1.spotLightPosition.y) * easeProgress + Math.sin(phaseProgress * Math.PI) * 3, // More dramatic arc
        z: stage1.spotLightPosition.z + (stage2.spotLightPosition.z - stage1.spotLightPosition.z) * easeProgress
      }
      spotLightTarget = {
        x: stage1.spotLightTarget.x + (stage2.spotLightTarget.x - stage1.spotLightTarget.x) * easeProgress,
        y: stage1.spotLightTarget.y + (stage2.spotLightTarget.y - stage1.spotLightTarget.y) * easeProgress,
        z: stage1.spotLightTarget.z + (stage2.spotLightTarget.z - stage1.spotLightTarget.z) * easeProgress
      }
    } else if (progress <= 0.6) {
      // Phase 3: Add rim lighting and expand illumination
      const phaseProgress = (progress - 0.4) / 0.2
      const easeProgress = this.easeInCubic(phaseProgress)
      
      ambientIntensity = stage1.ambientIntensity + (stage2.ambientIntensity - stage1.ambientIntensity) * easeProgress * 0.4
      directionalIntensity = stage2.directionalIntensity * easeProgress * 0.8 // Add directional light gradually
      pointLightIntensity = 0
      spotLightIntensity = stage1.spotLightIntensity + (stage2.spotLightIntensity - stage1.spotLightIntensity) * (0.7 + easeProgress * 0.3)
      spotLightAngle = stage1.spotLightAngle + (stage2.spotLightAngle - stage1.spotLightAngle) * (0.5 + easeProgress * 0.5)
      spotLightColor = '#ffffff' // Pure white for main spotlight
      
      spotLightPosition = {
        x: stage2.spotLightPosition.x,
        y: stage2.spotLightPosition.y,
        z: stage2.spotLightPosition.z
      }
      spotLightTarget = {
        x: stage2.spotLightTarget.x,
        y: stage2.spotLightTarget.y,
        z: stage2.spotLightTarget.z
      }
    } else if (progress <= 0.8) {
      // Phase 4: Add backlighting and increase ambient
      const phaseProgress = (progress - 0.6) / 0.2
      const easeProgress = this.easeOutCubic(phaseProgress)
      
      ambientIntensity = stage1.ambientIntensity + (stage2.ambientIntensity - stage1.ambientIntensity) * (0.4 + easeProgress * 0.6)
      directionalIntensity = stage2.directionalIntensity * (0.8 + easeProgress * 0.2)
      pointLightIntensity = stage2.pointLightIntensity * easeProgress // Add point light for backlighting
      spotLightIntensity = stage1.spotLightIntensity + (stage2.spotLightIntensity - stage1.spotLightIntensity) * (0.8 + easeProgress * 0.2)
      spotLightAngle = stage1.spotLightAngle + (stage2.spotLightAngle - stage1.spotLightAngle) * (0.7 + easeProgress * 0.3)
      spotLightColor = '#ffffff'
      
      spotLightPosition = stage2.spotLightPosition
      spotLightTarget = stage2.spotLightTarget
    } else {
      // Phase 5: Full luxury lighting reveal with elastic finish
      const phaseProgress = (progress - 0.8) / 0.2
      const easeProgress = this.easeOutElastic(phaseProgress)
      
      ambientIntensity = stage1.ambientIntensity + (stage2.ambientIntensity - stage1.ambientIntensity) * (0.6 + easeProgress * 0.4)
      directionalIntensity = stage2.directionalIntensity
      pointLightIntensity = stage2.pointLightIntensity
      spotLightIntensity = stage2.spotLightIntensity
      spotLightAngle = stage2.spotLightAngle
      spotLightColor = stage2.spotLightColor
      spotLightPosition = stage2.spotLightPosition
      spotLightTarget = stage2.spotLightTarget
    }

    return {
      ambientIntensity,
      ambientColor: this.lerpColor(stage1.ambientColor, stage2.ambientColor, progress),
      directionalIntensity,
      directionalColor: this.lerpColor(stage1.directionalColor, stage2.directionalColor, progress),
      directionalPosition: {
        x: stage1.directionalPosition.x + (stage2.directionalPosition.x - stage1.directionalPosition.x) * progress,
        y: stage1.directionalPosition.y + (stage2.directionalPosition.y - stage1.directionalPosition.y) * progress,
        z: stage1.directionalPosition.z + (stage2.directionalPosition.z - stage1.directionalPosition.z) * progress
      },
      directionalTarget: {
        x: stage1.directionalTarget.x + (stage2.directionalTarget.x - stage1.directionalTarget.x) * progress,
        y: stage1.directionalTarget.y + (stage2.directionalTarget.y - stage1.directionalTarget.y) * progress,
        z: stage1.directionalTarget.z + (stage2.directionalTarget.z - stage1.directionalTarget.z) * progress
      },
      pointLightIntensity,
      pointLightColor: this.lerpColor(stage1.pointLightColor, stage2.pointLightColor, progress),
      pointLightPosition: {
        x: stage1.pointLightPosition.x + (stage2.pointLightPosition.x - stage1.pointLightPosition.x) * progress,
        y: stage1.pointLightPosition.y + (stage2.pointLightPosition.y - stage1.pointLightPosition.y) * progress,
        z: stage1.pointLightPosition.z + (stage2.pointLightPosition.z - stage1.pointLightPosition.z) * progress
      },
      pointLightDistance: stage1.pointLightDistance + (stage2.pointLightDistance - stage1.pointLightDistance) * progress,
      spotLightIntensity,
      spotLightColor: spotLightColor,
      spotLightPosition,
      spotLightTarget,
      spotLightDistance: stage1.spotLightDistance + (stage2.spotLightDistance - stage1.spotLightDistance) * progress,
      spotLightAngle,
      spotLightPenumbra: stage1.spotLightPenumbra + (stage2.spotLightPenumbra - stage1.spotLightPenumbra) * progress,
      shadowsEnabled: stage1.shadowsEnabled,
      shadowMapSize: stage1.shadowMapSize,
      shadowBias: stage1.shadowBias
    }
  }

  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  private easeInCubic(t: number): number {
    return t * t * t
  }

  private easeOutElastic(t: number): number {
    const c4 = (2 * Math.PI) / 3
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
  }

  private lerpColor(color1: string, color2: string, t: number): string {
    // Simple color interpolation - in a real implementation you'd want more sophisticated color space handling
    const hex1 = color1.replace('#', '')
    const hex2 = color2.replace('#', '')
    
    const r1 = parseInt(hex1.substr(0, 2), 16)
    const g1 = parseInt(hex1.substr(2, 2), 16)
    const b1 = parseInt(hex1.substr(4, 2), 16)
    
    const r2 = parseInt(hex2.substr(0, 2), 16)
    const g2 = parseInt(hex2.substr(2, 2), 16)
    const b2 = parseInt(hex2.substr(4, 2), 16)
    
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  public getLightingAtProgress(progress: number): LightingControls {
    const clampedProgress = Math.max(0, Math.min(1, progress))
    
    // Find the two steps to interpolate between
    const stepIndex = clampedProgress * (this.steps.length - 1)
    const lowerIndex = Math.floor(stepIndex)
    const upperIndex = Math.min(lowerIndex + 1, this.steps.length - 1)
    
    if (lowerIndex === upperIndex) {
      return this.steps[lowerIndex].lighting
    }
    
    const localProgress = stepIndex - lowerIndex
    const lowerStep = this.steps[lowerIndex]
    const upperStep = this.steps[upperIndex]
    
    // Interpolate between the two steps
    return this.interpolateLighting(lowerStep.lighting, upperStep.lighting, localProgress)
  }

  private interpolateLighting(lighting1: LightingControls, lighting2: LightingControls, t: number): LightingControls {
    return {
      ambientIntensity: lighting1.ambientIntensity + (lighting2.ambientIntensity - lighting1.ambientIntensity) * t,
      ambientColor: this.lerpColor(lighting1.ambientColor, lighting2.ambientColor, t),
      directionalIntensity: lighting1.directionalIntensity + (lighting2.directionalIntensity - lighting1.directionalIntensity) * t,
      directionalColor: this.lerpColor(lighting1.directionalColor, lighting2.directionalColor, t),
      directionalPosition: {
        x: lighting1.directionalPosition.x + (lighting2.directionalPosition.x - lighting1.directionalPosition.x) * t,
        y: lighting1.directionalPosition.y + (lighting2.directionalPosition.y - lighting1.directionalPosition.y) * t,
        z: lighting1.directionalPosition.z + (lighting2.directionalPosition.z - lighting1.directionalPosition.z) * t
      },
      directionalTarget: {
        x: lighting1.directionalTarget.x + (lighting2.directionalTarget.x - lighting1.directionalTarget.x) * t,
        y: lighting1.directionalTarget.y + (lighting2.directionalTarget.y - lighting1.directionalTarget.y) * t,
        z: lighting1.directionalTarget.z + (lighting2.directionalTarget.z - lighting1.directionalTarget.z) * t
      },
      pointLightIntensity: lighting1.pointLightIntensity + (lighting2.pointLightIntensity - lighting1.pointLightIntensity) * t,
      pointLightColor: this.lerpColor(lighting1.pointLightColor, lighting2.pointLightColor, t),
      pointLightPosition: {
        x: lighting1.pointLightPosition.x + (lighting2.pointLightPosition.x - lighting1.pointLightPosition.x) * t,
        y: lighting1.pointLightPosition.y + (lighting2.pointLightPosition.y - lighting1.pointLightPosition.y) * t,
        z: lighting1.pointLightPosition.z + (lighting2.pointLightPosition.z - lighting1.pointLightPosition.z) * t
      },
      pointLightDistance: lighting1.pointLightDistance + (lighting2.pointLightDistance - lighting1.pointLightDistance) * t,
      spotLightIntensity: lighting1.spotLightIntensity + (lighting2.spotLightIntensity - lighting1.spotLightIntensity) * t,
      spotLightColor: this.lerpColor(lighting1.spotLightColor, lighting2.spotLightColor, t),
      spotLightPosition: {
        x: lighting1.spotLightPosition.x + (lighting2.spotLightPosition.x - lighting1.spotLightPosition.x) * t,
        y: lighting1.spotLightPosition.y + (lighting2.spotLightPosition.y - lighting1.spotLightPosition.y) * t,
        z: lighting1.spotLightPosition.z + (lighting2.spotLightPosition.z - lighting1.spotLightPosition.z) * t
      },
      spotLightTarget: {
        x: lighting1.spotLightTarget.x + (lighting2.spotLightTarget.x - lighting1.spotLightTarget.x) * t,
        y: lighting1.spotLightTarget.y + (lighting2.spotLightTarget.y - lighting1.spotLightTarget.y) * t,
        z: lighting1.spotLightTarget.z + (lighting2.spotLightTarget.z - lighting1.spotLightTarget.z) * t
      },
      spotLightDistance: lighting1.spotLightDistance + (lighting2.spotLightDistance - lighting1.spotLightDistance) * t,
      spotLightAngle: lighting1.spotLightAngle + (lighting2.spotLightAngle - lighting1.spotLightAngle) * t,
      spotLightPenumbra: lighting1.spotLightPenumbra + (lighting2.spotLightPenumbra - lighting1.spotLightPenumbra) * t,
      shadowsEnabled: lighting1.shadowsEnabled,
      shadowMapSize: lighting1.shadowMapSize,
      shadowBias: lighting1.shadowBias
    }
  }
}
