# Three.js Canvas Code Structure Analysis

## Executive Summary

Your Three.js canvas implementation is a complex, feature-rich 3D scene system integrated into a Next.js application. The codebase spans multiple stages (0-9) with furniture environment, dynamic lighting, complex model loading, and comprehensive dev controls. While functional, the code organization presents opportunities for improvement.

---

## Current Architecture

### 1. **File Structure Overview**

```
components/ThreeScene/
├── ThreeSceneManager.tsx    (4,314 lines - MAIN MANAGER)
├── index.ts                 (Exports all stages)
│
├── stage0/                  (Initial/Loading stage)
│   ├── desktop.ts           (Stage configuration)
│   └── index.ts
├── stage1/                  (Product showcase)
│   ├── desktop.ts
│   └── index.ts
├── stage2-9/                (Additional stages)
│   ├── desktop.ts
│   └── index.ts
│
└── utils/                   (Empty directory - potential for extraction)
```

### 2. **Core Components**

#### **ThreeSceneManager.tsx** (The Behemoth - 4,314 lines)

**What it does:**
- Manages the entire Three.js lifecycle (setup, rendering, cleanup)
- Handles model loading (GLTF)
- Manages cameras, lights, textures, animations
- Coordinates with React state and DevControls
- Handles mobile optimization
- Creates procedural environments
- Loads furniture models

**Key Responsibilities:**
1. Scene initialization (lines 298-1200)
2. Model loading (lines 3489-3794)
3. Lighting setup (lines 1078-1148)
4. Room environment creation (lines 578-1068)
5. Texture management (multiple refs)
6. Rendering loop management (lines 348-396)
7. Dev control synchronization (multiple useEffect hooks)

**Hook Usage:**
- `useEffect`: 10 instances (different lifecycle phases)
- `useCallback`: 3 instances (rendering, force updates, sync)
- `useState`: 2 instances (isMobile, isLowEndDevice)
- `useRef`: 15+ instances (scene refs, texture refs, etc.)

#### **Stage Configuration Pattern**

Each stage follows this structure:
```typescript
// components/ThreeScene/stage1/desktop.ts
export const stage1DesktopConfig: StageConfig = {
  model: {
    position: { x, y, z },
    rotation: { x, y, z },
    scale: { x, y, z }
  },
  camera: {
    position: { x, y, z },
    target: { x, y, z },
    fov, near, far, zoom
  },
  lighting: {
    ambientIntensity, ambientColor,
    directionalIntensity, directionalColor,
    // ... many more lighting properties
  }
}
```

#### **Home Page Integration** (app/page.tsx)

**Integration Points:**
- Lines 844-856: MemoizedThreeSceneManager component
- Lines 134-175: Massive state subscriptions from Zustand store
- Lines 22-33: Stage configuration imports
- Lines 359-456: Stage initialization and animation logic

**State Management:**
- Uses Zustand store (store/useAppStore.ts)
- 20+ state subscriptions
- Complex memoization logic (lines 50-93)
- Multiple useEffect hooks for state synchronization

---

## Strengths of Current Implementation

### ✅ **Good Practices Found:**

1. **Separation of Stage Configs**: Each stage has its own directory and configuration
2. **Type Safety**: Strong TypeScript interfaces (ModelControls, CameraControls, LightingControls)
3. **Memoization**: Memoized components to prevent unnecessary re-renders
4. **Mobile Optimization**: Device detection and performance optimization
5. **DevTools Integration**: Zustand devtools for debugging
6. **Refs Pattern**: Proper use of useRef for DOM and Three.js objects
7. **Component Isolation**: DevControls and ThreeSceneManager are separate components

---

## Critical Issues & Problems

### 🔴 **Major Issues:**

#### 1. **God Component Anti-Pattern**
**Location**: `ThreeSceneManager.tsx` (4,314 lines)
**Problem**: Single file handling too many responsibilities
- Scene setup
- Model loading
- Animation management
- Texturing
- Lighting
- Rendering loop
- Dev control sync
- Mobile optimization
- Cleanup

**Impact**: 
- Extremely difficult to debug
- Hard to test
- Impossible to parallel development
- Prone to merge conflicts
- Long load time in IDE

#### 2. **Circular Dependency Risk**
**Location**: `ThreeSceneManager.tsx` (line 6)
```typescript
import { StageConfig, stage0Config, stage1Config, ... } from './index'
```
And in `index.ts`:
```typescript
export { default as ThreeSceneManager } from './ThreeSceneManager'
```

**Problem**: Manager imports stages, but stages might import manager
**Impact**: Can cause runtime errors and bundler issues

#### 3. **Props Drilling**
**Location**: `app/page.tsx` and ThreeSceneManager
**Problem**: Too many props passed down (12+ props)
```typescript
<MemoizedThreeSceneManager
  mountRef={mountRef}
  modelControls={modelControls}
  cameraControls={cameraControls}
  lightingControls={lightingControls}
  current3DStage={current3DStage}
  componentControls={componentControls}
  categoryVisibility={categoryVisibility}
  onComponentControlsChange={setComponentControls}
  onLoadingProgress={handleLoadingProgress}
  onLoadingComplete={handleLoadingComplete}
  isActive={isActive}
/>
```

#### 4. **Excessive React Hooks in ThreeSceneManager**
- 10+ useEffect hooks
- Multiple useCallback hooks
- State synchronization issues
- Potential infinite loops (see commented code lines 461-534 in page.tsx)

#### 5. **Mixed Concerns**
**Location**: Throughout ThreeSceneManager
- Three.js logic mixed with React logic
- Animation logic mixed with scene setup
- Texture loading mixed with rendering

#### 6. **Direct DOM Manipulation**
**Location**: ThreeSceneManager (lines 399-576)
```typescript
;(window as any).directThreeAnimation = (params) => {
  // Bypasses React entirely
}
```
**Problem**: Breaks React's unidirectional data flow

#### 7. **Configuration Scattered**
- Stage configs in separate folders
- Hardcoded values throughout ThreeSceneManager
- Difficult to maintain consistency

#### 8. **Performance Issues**
- Multiple re-renders during animations
- Excessive state updates
- No virtualization or LOD (Level of Detail)
- All textures loaded regardless of visibility

---

## Recommendations for Code Organization

### 🎯 **Recommended Architecture**

#### **Option 1: Feature-Based Organization** (Recommended)

```
components/ThreeScene/
├── core/
│   ├── SceneSetup.tsx              (Scene initialization only)
│   ├── Renderer.tsx                (Renderer + loop management)
│   └── Cleanup.tsx                  (Resource cleanup)
│
├── model/
│   ├── ModelLoader.tsx              (GLTF loading logic)
│   ├── TextureManager.tsx           (Texture loading & management)
│   └── ComponentMapper.tsx         (Component mapping logic)
│
├── animation/
│   ├── AnimationController.tsx      (Animation orchestration)
│   ├── StageTransition.tsx         (Stage switching logic)
│   └── DirectAnimation.tsx         (Window.threeAnimation)
│
├── lighting/
│   ├── LightSetup.tsx               (Light initialization)
│   └── LightManager.tsx             (Runtime light updates)
│
├── camera/
│   ├── CameraManager.tsx            (Camera lifecycle)
│   └── CameraControls.tsx           (Camera updates)
│
├── environment/
│   ├── RoomBuilder.tsx              (Room creation logic)
│   ├── FurnitureLoader.tsx          (Furniture loading)
│   └── MaterialApplier.tsx         (Material management)
│
├── stages/
│   ├── StageProvider.tsx            (Stage context)
│   ├── StageLoader.tsx              (Stage configuration loader)
│   └── stages/
│       ├── stage0.ts
│       ├── stage1.ts
│       └── ...
│
├── hooks/
│   ├── useThreeScene.ts             (Scene initialization hook)
│   ├── useModelLoader.ts            (Model loading hook)
│   ├── useStageTransition.ts        (Stage animation hook)
│   ├── useDevControlSync.ts         (Dev control sync)
│   ├── useDeviceDetection.ts        (Mobile detection)
│   └── useRenderLoop.ts             (Rendering hook)
│
├── utils/
│   ├── interpolation.ts             (Lerp functions)
│   ├── colorUtils.ts                (Color conversion)
│   ├── performance.ts               (Performance monitoring)
│   └── constants.ts                 (Shared constants)
│
├── ThreeSceneManager.tsx            (Orchestrator - 200 lines max)
└── index.ts
```

#### **Option 2: Layer-Based Organization**

```
components/ThreeScene/
├── layers/
│   ├── SceneLayer.tsx               (Scene graph)
│   ├── ModelLayer.tsx               (3D models)
│   ├── LightingLayer.tsx            (Lights)
│   ├── CameraLayer.tsx              (Camera)
│   └── EnvironmentLayer.tsx        (Room/furniture)
│
├── systems/
│   ├── RenderingSystem.tsx          (Render loop)
│   ├── AnimationSystem.tsx         (Animations)
│   ├── LoadingSystem.tsx            (Asset loading)
│   └── OptimizationSystem.tsx      (Performance)
│
├── controllers/
│   ├── StageController.tsx          (Stage management)
│   ├── DevControlController.tsx    (Dev sync)
│   └── DeviceController.tsx        (Device detection)
│
├── ThreeSceneManager.tsx
└── index.ts
```

---

## Detailed Refactoring Plan

### **Phase 1: Extract Utilities** (Low Risk)

**Create**: `components/ThreeScene/utils/`

1. **interpolation.ts**:
```typescript
export const lerp = (start: number, end: number, t: number): number
export const lerpColor = (start: string, end: string, t: number): string
export const lerpVector3 = (start: Vector3, end: Vector3, t: number): Vector3
```

2. **colorUtils.ts**:
```typescript
export const parseColor = (hex: string): [number, number, number]
export const interpolateColor = (start: string, end: string, t: number): string
```

3. **performance.ts**:
```typescript
export const shouldReduceQuality = (): boolean
export const getOptimalSettings = (): RenderSettings
```

4. **constants.ts**:
```typescript
export const ROOM_DIMENSIONS = { width: 25, depth: 20, height: 20 }
export const MOBILE_THRESHOLD = 768
export const TEXTURE_PATHS = { ... }
```

### **Phase 2: Extract Hooks** (Medium Risk)

**Create**: `components/ThreeScene/hooks/`

1. **useThreeScene.ts**:
```typescript
export function useThreeScene(mountRef: RefObject<HTMLElement>) {
  // Scene initialization
  // Basic setup
  // Returns scene, camera, renderer refs
}
```

2. **useModelLoader.ts**:
```typescript
export function useModelLoader(
  scene: Scene,
  onProgress: (progress: number) => void
) {
  // Model loading logic
  // GLTF loading
  // Returns model ref
}
```

3. **useStageTransition.ts**:
```typescript
export function useStageTransition(
  currentStage: number,
  targetStage: number,
  progress: number
) {
  // Stage transition animation
  // Returns animation controller
}
```

4. **useDeviceDetection.ts**:
```typescript
export function useDeviceDetection() {
  // Device detection logic
  // Returns isMobile, isLowEndDevice
}
```

### **Phase 3: Extract Scene Components** (High Risk)

**Create**: `components/ThreeScene/core/`, `model/`, `lighting/`, etc.

**Example: ModelLoader.tsx**
```typescript
interface ModelLoaderProps {
  scene: THREE.Scene
  onLoad: (model: THREE.Group) => void
  onProgress: (progress: number) => void
}

export function ModelLoader({ scene, onLoad, onProgress }: ModelLoaderProps) {
  useEffect(() => {
    // Model loading logic extracted from ThreeSceneManager
  }, [])
}
```

**Example: LightManager.tsx**
```typescript
interface LightManagerProps {
  scene: THREE.Scene
  lightingControls: LightingControls
}

export function LightManager({ scene, lightingControls }: LightManagerProps) {
  // Lighting setup extracted
}
```

### **Phase 4: Stage Configuration Consolidation** (Low Risk)

**Consolidate stages**:
```typescript
// components/ThreeScene/stages/index.ts
export const STAGE_CONFIGS = {
  0: stage0Config,
  1: stage1Config,
  // ...
} as const
```

### **Phase 5: ThreeSceneManager Simplification** (High Impact)

**Transform ThreeSceneManager from 4,314 lines to ~200 lines**:
```typescript
export function ThreeSceneManager({ mountRef, isActive }: Props) {
  // Use extracted hooks
  const { scene, camera, renderer } = useThreeScene(mountRef)
  const { model } = useModelLoader(scene, onProgress)
  const { isMobile } = useDeviceDetection()
  const lighting = useLightSetup(scene, lightingControls)
  const { animate } = useStageTransition(currentStage, targetStage, progress)
  
  // Minimal orchestration logic
  // Pass refs to sub-components
  
  return (
    <>
      <ModelLoader {...modelLoaderProps} />
      <LightManager {...lightManagerProps} />
      <AnimationController {...animationProps} />
    </>
  )
}
```

---

## Specific Code Smells to Address

### 1. **Window Global Hack** (Lines 399-576 in ThreeSceneManager)
**Current**:
```typescript
;(window as any).directThreeAnimation = (params) => { ... }
```

**Better**: Use React Context or Custom Event Emitter
```typescript
// Create AnimationEventEmitter
const animationEmitter = new EventEmitter()
export { animationEmitter }

// In ThreeSceneManager
animationEmitter.on('animate', handleAnimation)
```

### 2. **Multiple Texture Ref Hack**
**Current**: 8+ texture refs
```typescript
const oledTextureRef = useRef<THREE.Texture | null>(null)
const upperCoverTextureRef = useRef<...>(null)
// ... 6 more
```

**Better**: Texture Map
```typescript
const texturesRef = useRef<Map<string, THREE.Texture>>(new Map())
```

### 3. **Force Dev Control Updates** (Lines 127-217)
**Current**: Massive callback
**Better**: Split into:
- `updateModelTransform()`
- `updateCameraTransform()`
- `updateLightingTransform()`

### 4. **Excessive useEffects** (10+ instances)
**Better**: Split into focused hooks
```typescript
useModelUpdates(modelRef, modelControls)
useCameraUpdates(cameraRef, cameraControls)
useLightingUpdates(lights, lightingControls)
```

---

## Testing Strategy

### Unit Tests Needed:
1. **Interpolation Functions**: `utils/interpolation.ts`
2. **Color Conversion**: `utils/colorUtils.ts`
3. **Stage Configuration**: `stages/index.ts`
4. **Device Detection**: `hooks/useDeviceDetection.ts`

### Integration Tests Needed:
1. **ThreeSceneManager Integration**
2. **Stage Transition Animation**
3. **Model Loading**
4. **Dev Control Sync**

### Test File Structure:
```
components/ThreeScene/
├── __tests__/
│   ├── utils/
│   │   ├── interpolation.test.ts
│   │   └── colorUtils.test.ts
│   ├── hooks/
│   │   └── useDeviceDetection.test.ts
│   └── ThreeSceneManager.test.tsx
```

---

## Performance Optimization Recommendations

### 1. **Lazy Loading**
- Load furniture model only when needed
- Load textures on-demand
- Dynamic stage loading

### 2. **Texture Compression**
- Convert to compressed formats (WEBP)
- Use texture atlas
- Implement mipmaps

### 3. **Render Optimization**
```typescript
// Use render on demand instead of constant loop
const renderOnDemand = () => {
  if (needsRender) {
    renderer.render(scene, camera)
    needsRender = false
  }
}
```

### 4. **Geometry Instancing**
- Reuse geometry for furniture
- Instance repeated elements

### 5. **Level of Detail (LOD)**
- Different model qualities based on distance
- Reduce polygon count when far away

---

## Migration Strategy

### **Step-by-Step Refactoring**

1. **Week 1**: Extract utilities (low risk)
   - Create `utils/` directory
   - Move helper functions
   - Update imports

2. **Week 2**: Extract hooks (medium risk)
   - Create `hooks/` directory
   - Extract useDeviceDetection
   - Extract useAnimation helpers

3. **Week 3-4**: Extract scene components (high risk)
   - Create component files
   - Move code incrementally
   - Test after each extraction

4. **Week 5**: Simplify ThreeSceneManager
   - Wire up extracted components
   - Remove duplicate code
   - Final testing

---

## Additional Recommendations

### 1. **Documentation**
- Add JSDoc comments to exported functions
- Document each stage configuration
- Create architecture diagrams

### 2. **Error Boundaries**
- Wrap ThreeSceneManager in error boundary
- Handle model loading errors gracefully
- Handle WebGL context loss

### 3. **Performance Monitoring**
- Add performance profiler
- Track frame rate
- Monitor memory usage

### 4. **Accessibility**
- Add ARIA labels for 3D canvas
- Keyboard navigation support
- Screen reader descriptions

---

## Conclusion

Your Three.js implementation is functional and feature-rich, but it suffers from classic code organization issues. The primary problem is the **God Component Anti-Pattern** in `ThreeSceneManager.tsx` (4,314 lines).

**Immediate Actions:**
1. ✅ Extract utilities (1-2 days)
2. ✅ Extract hooks (2-3 days)
3. ⚠️ Plan component extraction (1 week planning)
4. 🎯 Execute refactoring (3-4 weeks)

**Expected Benefits:**
- 80% reduction in ThreeSceneManager complexity
- Improved testability
- Better developer experience
- Easier debugging
- Faster development cycles
- Easier onboarding for new developers

**Risk Mitigation:**
- Refactor incrementally
- Keep old code until new code is verified
- Test after each extraction
- Use feature flags for gradual rollout

Would you like me to start implementing any of these recommendations?
