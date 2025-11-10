# V2 Lighting Animation Fix

## Problem
Lighting doesn't animate during stage 0 → 1 transition. It jumps instantly when animation completes.

## Root Cause
The `LightManager` is updating lights via `useEffect` that depends on `lightingControls`. When `setLightingControls` is called at the end of animation, it triggers LightManager to update, overriding any animation.

## Solution
1. Added `isStageAnimating` flag to prevent LightManager from updating during animation
2. Added debug logs to track lighting animation

## Files Modified
- `components/ThreeScene/components/lighting/LightManager.tsx` - Skip updates during animation
- `app/page.tsx` - Set/unset animation flag
- `components/ThreeScene/hooks/useStageAnimation.ts` - Added debug logs

## Testing
Check browser console for:
- "Light refs ready" message
- "Animation lighting check" during animation
- "💡 Animating ambient/directional light" messages
- "⏸️ Skipping light updates during animation" messages

If you see warnings about "directionalLightRef.current is null", the refs aren't ready when animation starts.

