import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
import React from 'react'

// Types
export interface ModelControls {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
}

export interface CameraControls {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  target: { x: number; y: number; z: number }
  fov: number
  near: number
  far: number
  zoom: number
  focusDistance?: number
  aperture?: number
  maxBlur?: number
  bokehScale?: number
  darkenPeriphery?: number
}

export interface LightingControls {
  ambientIntensity: number
  ambientColor: string
  directionalIntensity: number
  directionalColor: string
  directionalPosition: { x: number; y: number; z: number }
  directionalTarget: { x: number; y: number; z: number }
  pointLightIntensity: number
  pointLightColor: string
  pointLightPosition: { x: number; y: number; z: number }
  pointLightDistance: number
  spotLightIntensity: number
  spotLightColor: string
  spotLightPosition: { x: number; y: number; z: number }
  spotLightTarget: { x: number; y: number; z: number }
  spotLightDistance: number
  spotLightAngle: number
  spotLightPenumbra: number
  shadowsEnabled: boolean
  shadowMapSize: number
  shadowBias: number
}

export interface StageConfig {
  model: ModelControls
  camera: CameraControls
  lighting: LightingControls
}

export interface AppState {
  // Loading states
  isLoading: boolean
  loadingProgress: number
  isClient: boolean
  
  // 3D Scene states
  current3DStage: number
  stage3DAnimationProgress: number
  is3DAnimating: boolean
  isAnimating: boolean
  animationProgress: number
  
  // Scroll states
  currentSection: number
  isScrolling: boolean
  scrollDirection: 'up' | 'down' | null
  isTransitioning: boolean
  transitionProgress: number
  scrollPosition: number
  isNavigatingViaDots: boolean
  
  // 3D Controls
  modelControls: ModelControls
  cameraControls: CameraControls
  lightingControls: LightingControls
  
  // Stage configs
  stageConfigs: Record<number, StageConfig>
  
  // Debug states
  isDebugMode: boolean
  debugLogs: Array<{ timestamp: number; level: 'info' | 'warn' | 'error'; message: string; data?: any }>
  
  // Actions
  setLoading: (loading: boolean) => void
  setLoadingProgress: (progress: number) => void
  setIsClient: (client: boolean) => void
  
  setCurrent3DStage: (stage: number) => void
  setStage3DAnimationProgress: (progress: number) => void
  setIs3DAnimating: (animating: boolean) => void
  setIsAnimating: (animating: boolean) => void
  setAnimationProgress: (progress: number) => void
  
  setCurrentSection: (section: number) => void
  setIsScrolling: (scrolling: boolean) => void
  setScrollDirection: (direction: 'up' | 'down' | null) => void
  setIsTransitioning: (transitioning: boolean) => void
  setTransitionProgress: (progress: number) => void
  setScrollPosition: (position: number) => void
  setIsNavigatingViaDots: (navigating: boolean) => void
  
  setModelControls: (controls: ModelControls) => void
  setCameraControls: (controls: CameraControls) => void
  setLightingControls: (controls: LightingControls) => void
  
  setStageConfig: (stage: number, config: StageConfig) => void
  getStageConfig: (stage: number) => StageConfig
  
  setDebugMode: (debug: boolean) => void
  addDebugLog: (level: 'info' | 'warn' | 'error', message: string, data?: any) => void
  clearDebugLogs: () => void
  
  // Batch updates for performance
  updateMultipleStates: (updates: Partial<AppState>) => void
}

// Default values - using Stage 1 configuration as default
const defaultModelControls: ModelControls = {
  position: { x: 1.6, y: -1, z: 0 },
  rotation: { x: -0.36, y: -1.14, z: 2.1 },
  scale: { x: 13, y: 13, z: 13 }
}

const defaultCameraControls: CameraControls = {
  position: { x: 0, y: 0, z: 8 },
  rotation: { x: 0, y: 0, z: 0 },
  target: { x: 0, y: 0, z: 0 },
  fov: 75,
  near: 0.1,
  far: 1000,
  zoom: 1,
  focusDistance: 10,
  aperture: 0.1,
  maxBlur: 0.01
}

const defaultLightingControls: LightingControls = {
  ambientIntensity: 2,
  ambientColor: '#ffffff',
  directionalIntensity: 3,
  directionalColor: '#ffffff',
  directionalPosition: { x: 10, y: 15.9, z: 1 },
  directionalTarget: { x: 1, y: 4, z: 0 },
  pointLightIntensity: 2,
  pointLightColor: '#ffffff',
  pointLightPosition: { x: 1, y: 1, z: 1 },
  pointLightDistance: 1,
  spotLightIntensity: 2,
  spotLightColor: '#ffffff',
  spotLightPosition: { x: -3.6, y: 0.5, z: 1.5 },
  spotLightTarget: { x: 0, y: 0, z: 0 },
  spotLightDistance: 49,
  spotLightAngle: 90,
  spotLightPenumbra: 1,
  shadowsEnabled: false,
  shadowMapSize: 4096,
  shadowBias: 0.001
}

export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
      // Initial state
      isLoading: true,
      loadingProgress: 0,
      isClient: false,
      
      current3DStage: 0,
      stage3DAnimationProgress: 0,
      is3DAnimating: false,
      isAnimating: false,
      animationProgress: 0,
      
      currentSection: 1,
      isScrolling: false,
      scrollDirection: null,
      isTransitioning: false,
      transitionProgress: 0,
      scrollPosition: 0,
      isNavigatingViaDots: false,
      
      modelControls: defaultModelControls,
      cameraControls: defaultCameraControls,
      lightingControls: defaultLightingControls,
      
      stageConfigs: {},
      
      isDebugMode: false,
      debugLogs: [],
      
      // Actions
      setLoading: (loading) => {
        set({ isLoading: loading })
        if (get().isDebugMode) get().addDebugLog('info', `Loading state changed: ${loading}`)
      },
      
      setLoadingProgress: (progress) => {
        set({ loadingProgress: progress })
        if (get().isDebugMode) get().addDebugLog('info', `Loading progress: ${Math.round(progress * 100)}%`)
      },
      
      setIsClient: (client) => {
        set({ isClient: client })
        if (get().isDebugMode) get().addDebugLog('info', `Client state changed: ${client}`)
      },
      
      setCurrent3DStage: (stage) => {
        const prevStage = get().current3DStage
        set({ current3DStage: stage })
        if (get().isDebugMode) get().addDebugLog('info', `3D Stage changed: ${prevStage} → ${stage}`)
      },
      
      setStage3DAnimationProgress: (progress) => {
        set({ stage3DAnimationProgress: progress })
        if (get().isDebugMode && progress > 0 && progress < 1) {
          get().addDebugLog('info', `3D Animation progress: ${Math.round(progress * 100)}%`)
        }
      },
      
      setIs3DAnimating: (animating) => {
        set({ is3DAnimating: animating })
        if (get().isDebugMode) get().addDebugLog('info', `3D Animating state: ${animating}`)
      },
      
      setIsAnimating: (animating) => {
        set({ isAnimating: animating })
        if (get().isDebugMode) get().addDebugLog('info', `Animating state: ${animating}`)
      },
      
      setAnimationProgress: (progress) => {
        set({ animationProgress: progress })
        if (get().isDebugMode && progress > 0 && progress < 1) {
          get().addDebugLog('info', `Animation progress: ${Math.round(progress * 100)}%`)
        }
      },
      
      setCurrentSection: (section) => {
        const prevSection = get().currentSection
        set({ currentSection: section })
        if (get().isDebugMode) get().addDebugLog('info', `Section changed: ${prevSection} → ${section}`)
      },
      
      setIsScrolling: (scrolling) => {
        set({ isScrolling: scrolling })
        if (get().isDebugMode) get().addDebugLog('info', `Scrolling state: ${scrolling}`)
      },
      
      setScrollDirection: (direction) => {
        set({ scrollDirection: direction })
        if (get().isDebugMode) get().addDebugLog('info', `Scroll direction: ${direction}`)
      },
      
      setIsTransitioning: (transitioning) => {
        set({ isTransitioning: transitioning })
        if (get().isDebugMode) get().addDebugLog('info', `Transitioning state: ${transitioning}`)
      },
      
      setTransitionProgress: (progress) => {
        set({ transitionProgress: progress })
        if (get().isDebugMode && progress > 0 && progress < 1) {
          get().addDebugLog('info', `Transition progress: ${Math.round(progress * 100)}%`)
        }
      },
      
      setScrollPosition: (position) => {
        set({ scrollPosition: position })
      },
      
      setIsNavigatingViaDots: (navigating) => {
        set({ isNavigatingViaDots: navigating })
        if (get().isDebugMode) get().addDebugLog('info', `Navigating via dots: ${navigating}`)
      },
      
      setModelControls: (controls) => {
        set({ modelControls: controls })
        if (get().isDebugMode) get().addDebugLog('info', 'Model controls updated', controls)
      },
      
      setCameraControls: (controls) => {
        set({ cameraControls: controls })
        if (get().isDebugMode) get().addDebugLog('info', 'Camera controls updated', controls)
      },
      
      setLightingControls: (controls) => {
        set({ lightingControls: controls })
        if (get().isDebugMode) get().addDebugLog('info', 'Lighting controls updated', controls)
      },
      
      setStageConfig: (stage, config) => {
        set((state) => ({
          stageConfigs: { ...state.stageConfigs, [stage]: config }
        }))
        if (get().isDebugMode) get().addDebugLog('info', `Stage ${stage} config set`, config)
      },
      
      getStageConfig: (stage) => {
        const config = get().stageConfigs[stage]
        if (!config) {
          get().addDebugLog('warn', `Stage ${stage} config not found, returning default`)
          // Return a default stage config if not found
          return {
            model: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
            camera: { position: { x: 0, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 }, fov: 75, near: 0.1, far: 1000, zoom: 1 },
            lighting: { ambientIntensity: 1, ambientColor: '#ffffff', directionalIntensity: 1, directionalColor: '#ffffff', directionalPosition: { x: 0, y: 0, z: 0 }, directionalTarget: { x: 0, y: 0, z: 0 }, pointLightIntensity: 0, pointLightColor: '#ffffff', pointLightPosition: { x: 0, y: 0, z: 0 }, pointLightDistance: 10, spotLightIntensity: 0, spotLightColor: '#ffffff', spotLightPosition: { x: 0, y: 0, z: 0 }, spotLightTarget: { x: 0, y: 0, z: 0 }, spotLightDistance: 10, spotLightAngle: 30, spotLightPenumbra: 0, shadowsEnabled: false, shadowMapSize: 1024, shadowBias: 0 }
          }
        }
        return config
      },
      
      setDebugMode: (debug) => {
        set({ isDebugMode: debug })
        get().addDebugLog('info', `Debug mode: ${debug}`)
      },
      
      addDebugLog: (level, message, data) => {
        const timestamp = Date.now()
        set((state) => ({
          debugLogs: [
            ...state.debugLogs.slice(-99), // Keep only last 100 logs
            { timestamp, level, message, data }
          ]
        }))
        
        // Also log to console in debug mode
        if (get().isDebugMode) {
          const logMessage = `[${new Date(timestamp).toISOString()}] ${message}`
          if (data) {
            console[level](logMessage, data)
          } else {
            console[level](logMessage)
          }
        }
      },
      
      clearDebugLogs: () => {
        set({ debugLogs: [] })
      },
      
      updateMultipleStates: (updates) => {
        set(updates)
        if (get().isDebugMode) get().addDebugLog('info', 'Multiple states updated', updates)
      }
      })
    ),
    {
      name: 'app-store',
      partialize: (state: AppState) => ({
        // Only persist essential state, not logs
        current3DStage: state.current3DStage,
        currentSection: state.currentSection,
        isDebugMode: state.isDebugMode
      })
    }
  )
)

// SSR-safe server snapshot - cached to prevent infinite loops
const serverSnapshot: AppState = {
  // Loading states
  isLoading: true,
  loadingProgress: 0,
  isClient: false,
  
  // 3D Scene states
  current3DStage: 0,
  stage3DAnimationProgress: 0,
  is3DAnimating: false,
  isAnimating: false,
  animationProgress: 0,
  
  // Scroll states
  currentSection: 1,
  isScrolling: false,
  scrollDirection: null,
  isTransitioning: false,
  transitionProgress: 0,
  scrollPosition: 0,
  isNavigatingViaDots: false,
  
  // 3D Controls
  modelControls: defaultModelControls,
  cameraControls: defaultCameraControls,
  lightingControls: defaultLightingControls,
  
  // Stage configs
  stageConfigs: {},
  
  // Debug states
  isDebugMode: false,
  debugLogs: [],
  
  // Actions (no-op functions for SSR)
  setLoading: () => {},
  setLoadingProgress: () => {},
  setIsClient: () => {},
  setCurrent3DStage: () => {},
  setStage3DAnimationProgress: () => {},
  setIs3DAnimating: () => {},
  setIsAnimating: () => {},
  setAnimationProgress: () => {},
  setCurrentSection: () => {},
  setIsScrolling: () => {},
  setScrollDirection: () => {},
  setIsTransitioning: () => {},
  setTransitionProgress: () => {},
  setScrollPosition: () => {},
  setIsNavigatingViaDots: () => {},
  setModelControls: () => {},
  setCameraControls: () => {},
  setLightingControls: () => {},
  setStageConfig: () => {},
  getStageConfig: () => ({
    model: defaultModelControls,
    camera: defaultCameraControls,
    lighting: defaultLightingControls
  }),
  setDebugMode: () => {},
  addDebugLog: () => {},
  clearDebugLogs: () => {},
  updateMultipleStates: () => {}
}

// Cached getServerSnapshot function to prevent infinite loops
const getServerSnapshot = () => serverSnapshot

// Client-side safe hooks
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect

// Memoized selectors to prevent infinite re-renders
const select3DState = (state: AppState) => ({
  current3DStage: state.current3DStage,
  stage3DAnimationProgress: state.stage3DAnimationProgress,
  is3DAnimating: state.is3DAnimating,
  isAnimating: state.isAnimating,
  animationProgress: state.animationProgress,
  modelControls: state.modelControls,
  cameraControls: state.cameraControls,
  lightingControls: state.lightingControls
})

const select3DActions = (state: AppState) => ({
  setModelControls: state.setModelControls,
  setCameraControls: state.setCameraControls,
  setLightingControls: state.setLightingControls,
  setCurrent3DStage: state.setCurrent3DStage
})

const selectScrollState = (state: AppState) => ({
  currentSection: state.currentSection,
  isScrolling: state.isScrolling,
  scrollDirection: state.scrollDirection,
  isTransitioning: state.isTransitioning,
  transitionProgress: state.transitionProgress,
  scrollPosition: state.scrollPosition,
  isNavigatingViaDots: state.isNavigatingViaDots,
  isClient: state.isClient
})

const selectScrollActions = (state: AppState) => ({
  setCurrentSection: state.setCurrentSection,
  setIsScrolling: state.setIsScrolling,
  setScrollDirection: state.setScrollDirection,
  setScrollPosition: state.setScrollPosition,
  setIsClient: state.setIsClient
})

const select3DStateWithActions = (state: AppState) => ({
  current3DStage: state.current3DStage,
  stage3DAnimationProgress: state.stage3DAnimationProgress,
  is3DAnimating: state.is3DAnimating,
  isAnimating: state.isAnimating,
  animationProgress: state.animationProgress,
  modelControls: state.modelControls,
  cameraControls: state.cameraControls,
  lightingControls: state.lightingControls,
  setStage3DAnimationProgress: state.setStage3DAnimationProgress,
  setModelControls: state.setModelControls,
  setCameraControls: state.setCameraControls,
  setLightingControls: state.setLightingControls,
  setCurrent3DStage: state.setCurrent3DStage
})

const selectDebugState = (state: AppState) => ({
  isDebugMode: state.isDebugMode,
  debugLogs: state.debugLogs,
  addDebugLog: state.addDebugLog,
  clearDebugLogs: state.clearDebugLogs
})

// Cached server snapshots for each selector to prevent infinite loops
const get3DStateServerSnapshot = () => select3DState(serverSnapshot)
const get3DActionsServerSnapshot = () => select3DActions(serverSnapshot)
const getScrollStateServerSnapshot = () => selectScrollState(serverSnapshot)
const getScrollActionsServerSnapshot = () => selectScrollActions(serverSnapshot)
const get3DStateWithActionsServerSnapshot = () => select3DStateWithActions(serverSnapshot)
const getDebugStateServerSnapshot = () => selectDebugState(serverSnapshot)


// Simple hooks that use the store directly
export const use3DState = () => {
  const selector = React.useCallback(select3DState, [])
  
  const state = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    get3DStateServerSnapshot
  )
  
  return state
}

export const use3DActions = () => {
  const selector = React.useCallback(select3DActions, [])
  
  const actions = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    get3DActionsServerSnapshot
  )
  
  return actions
}

export const use3DStateWithActions = () => {
  const selector = React.useCallback(select3DStateWithActions, [])
  
  // Use useSyncExternalStore for SSR safety
  const state = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    get3DStateWithActionsServerSnapshot
  )
  
  return state
}

export const useScrollState = () => {
  const selector = React.useCallback(selectScrollState, [])
  
  const state = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    getScrollStateServerSnapshot
  )
  
  return state
}

export const useScrollActions = () => {
  const selector = React.useCallback(selectScrollActions, [])
  
  const actions = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    getScrollActionsServerSnapshot
  )
  
  return actions
}

export const useDebugState = () => {
  const selector = React.useCallback(selectDebugState, [])
  
  const state = React.useSyncExternalStore(
    useAppStore.subscribe,
    () => selector(useAppStore.getState()),
    getDebugStateServerSnapshot
  )
  
  return state
}

// Safe hook that only works on client side
export const useClientStore = () => {
  const [isClient, setIsClient] = React.useState(false)
  
  React.useEffect(() => {
    setIsClient(true)
  }, [])
  
  return isClient ? useAppStore() : null
}
