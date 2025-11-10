import { StageConfig } from '../../../store/useAppStore'
import { stage0Config } from '../stage0'
import { stage1Config } from '../stage1'
import { stage2Config } from '../stage2'
import { stage3Config } from '../stage3'
import { stage4Config } from '../stage4'
import { stage5Config } from '../stage5'
import { stage6Config } from '../stage6'
import { stage7Config } from '../stage7'
import { stage8Config } from '../stage8'
import { stage9Config } from '../stage9'

/**
 * All stage configurations
 */
export const STAGE_CONFIGS = {
  0: stage0Config,
  1: stage1Config,
  2: stage2Config,
  3: stage3Config,
  4: stage4Config,
  5: stage5Config,
  6: stage6Config,
  7: stage7Config,
  8: stage8Config,
  9: stage9Config
} as const

/**
 * Get configuration for a specific stage
 * @param stage - Stage number (0-9)
 * @returns Stage configuration or defaults to stage 1 if invalid
 */
export function getStageConfig(stage: number): StageConfig {
  return STAGE_CONFIGS[stage as keyof typeof STAGE_CONFIGS] || STAGE_CONFIGS[1]
}

/**
 * Get all stage configurations
 * @returns All stage configurations
 */
export function getAllStageConfigs() {
  return STAGE_CONFIGS
}

