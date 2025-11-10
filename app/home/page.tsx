'use client'

import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import TopMenu from '../../components/TopMenu'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { /* ThreeSceneManager, */ ThreeSceneManagerV2, stage0Config, stage1Config, stage2Config, stage3Config, stage4Config, stage5Config, stage6Config, stage7Config, stage8Config, stage9Config } from '../../components/ThreeScene'
import { useAppStore, StageConfig } from '../../store/useAppStore'
import PerformanceMonitor, { useStateTracker, useEffectTracker } from '../../components/PerformanceMonitor/PerformanceMonitor'


// Create direct references to avoid circular dependency issues
const stageConfigs: Record<number, any> = {
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
}
import { ScrollManager } from '../../components/ScrollSystem'
import { AnimationSystem, easeInOut } from '../../components/Animation'
import { LuxuryLightingAnimation } from '../../components/Animation/LuxuryLightingAnimation'
import HeroSection from '../../components/HeroSection'
import { lerp, lerpColor, easeInOutSine } from '../../components/ThreeScene/utils/interpolation'
import Section2 from '../../components/Section2'
import Section3 from '../../components/Section3'
import Section4 from '../../components/Section4'
import Section5 from '../../components/Section5'
import Section6 from '../../components/Section6'
import Section7 from '../../components/Section7'
import Section8 from '../../components/Section8'
import { LoadingScreen, SectionLoadingScreen } from '../../components/Loading'
import { ComponentControls, defaultComponentControls, CategoryVisibility, defaultCategoryVisibility } from '../../components/DevControls/sections/product3d/types'
import DevControls from '../../components/DevControls/DevControls'

// Memoized ThreeSceneManager to prevent unnecessary re-renders
// Memoized ThreeSceneManager - OLD VERSION NOT USED (using V2 now)
const MemoizedThreeSceneManager = memo(() => null, () => true) // Placeholder - old manager not used

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Check if this is a navigation from another page by looking at referrer
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    // Always treat as initial load to always play the stage 0->1 animation
    // This ensures the animation always plays regardless of where the user came from
    if (typeof window !== 'undefined') {
      const referrer = document.referrer
      const currentDomain = window.location.origin
      const currentPath = window.location.pathname
      
      // Parse referrer path
      let referrerPath = ''
      if (referrer) {
        try {
          const referrerUrl = new URL(referrer)
          referrerPath = referrerUrl.pathname
        } catch (e) {
          // If parsing fails, treat as initial load
          return true
        }
      }
      
      // Check if this is an internal navigation (same domain)
      const isInternalNavigation = referrer && referrer.startsWith(currentDomain) && referrer !== window.location.href
      // Check if we're coming from a different path
      const isFromDifferentPath = referrerPath !== '' && referrerPath !== currentPath
      
      
      // Always treat as initial load so animation always plays
      return true
    }
    return true
  })
  
  // Optimized state subscriptions to prevent unnecessary re-renders
  const currentSection = useAppStore((state) => state.currentSection)
  const isClient = useAppStore((state) => state.isClient)
  const isLoading = useAppStore((state) => state.isLoading)
  const loadingProgress = useAppStore((state) => state.loadingProgress)
  const isScrolling = useAppStore((state) => state.isScrolling)
  const scrollDirection = useAppStore((state) => state.scrollDirection)
  const isTransitioning = useAppStore((state) => state.isTransitioning)
  const transitionProgress = useAppStore((state) => state.transitionProgress)
  const scrollPosition = useAppStore((state) => state.scrollPosition)
  const isNavigatingViaDots = useAppStore((state) => state.isNavigatingViaDots)
  
  // 3D state - only subscribe to what's needed
  const current3DStage = useAppStore((state) => state.current3DStage)
  const stage3DAnimationProgress = useAppStore((state) => state.stage3DAnimationProgress)
  const is3DAnimating = useAppStore((state) => state.is3DAnimating)
  const isAnimating = useAppStore((state) => state.isAnimating)
  const animationProgress = useAppStore((state) => state.animationProgress)
  const modelControls = useAppStore((state) => state.modelControls)
  const cameraControls = useAppStore((state) => state.cameraControls)
  const lightingControls = useAppStore((state) => state.lightingControls)
  
  // Actions - memoized to prevent re-renders
  const setCurrentSection = useAppStore((state) => state.setCurrentSection)
  const setIsClient = useAppStore((state) => state.setIsClient)
  const setLoading = useAppStore((state) => state.setLoading)
  const setLoadingProgress = useAppStore((state) => state.setLoadingProgress)
  const setIsScrolling = useAppStore((state) => state.setIsScrolling)
  const setScrollDirection = useAppStore((state) => state.setScrollDirection)
  const setIsTransitioning = useAppStore((state) => state.setIsTransitioning)
  const setTransitionProgress = useAppStore((state) => state.setTransitionProgress)
  const setScrollPosition = useAppStore((state) => state.setScrollPosition)
  const setIsNavigatingViaDots = useAppStore((state) => state.setIsNavigatingViaDots)
  const setCurrent3DStage = useAppStore((state) => state.setCurrent3DStage)
  const setStage3DAnimationProgress = useAppStore((state) => state.setStage3DAnimationProgress)
  const setIs3DAnimating = useAppStore((state) => state.setIs3DAnimating)
  const setIsAnimating = useAppStore((state) => state.setIsAnimating)
  const setAnimationProgress = useAppStore((state) => state.setAnimationProgress)
  const setModelControls = useAppStore((state) => state.setModelControls)
  const setCameraControls = useAppStore((state) => state.setCameraControls)
  const setLightingControls = useAppStore((state) => state.setLightingControls)
  const addDebugLog = useAppStore((state) => state.addDebugLog)
  const setDebugMode = useAppStore((state) => state.setDebugMode)
  
  // Local state for things not in store yet
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [uiAssetsLoaded, setUiAssetsLoaded] = useState(false)
  const uiAssetsLoadedRef = useRef(false)
  
  // Dev controls state
  const [isDevMode, setIsDevMode] = useState(false) // Disabled temporarily
  const [componentControls, setComponentControls] = useState<ComponentControls>(defaultComponentControls)
  const [categoryVisibility, setCategoryVisibility] = useState<CategoryVisibility>(defaultCategoryVisibility)
  
  // Memoize isActive calculation to prevent unnecessary re-renders
  const isActive = useMemo(() => {
    return currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)
  }, [currentSection, isScrolling, scrollDirection, scrollPosition])
  
  // Toggle dev mode with keyboard shortcut (Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault()
        setIsDevMode(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Preload essential UI assets (logo, etc.) so the loader can wait for them
  useEffect(() => {
    let cancelled = false
    const assetsToPreload = [
      '/Color-fluent-Logo-2.png'
    ]
    const preloadImage = (src: string) => new Promise<void>((resolve) => {
      const img = new Image()
      img.src = src
      const done = () => resolve()
      img.onload = done
      img.onerror = done
      if ('decode' in img) {
        // Attempt to ensure decoding is finished for instant paint
        ;(img as any).decode().then(done).catch(done)
      }
    })
    Promise.all(assetsToPreload.map(preloadImage)).then(() => {
      if (cancelled) return
      setUiAssetsLoaded(true)
      uiAssetsLoadedRef.current = true
    })
    return () => { cancelled = true }
  }, [])
  const [isSectionLoading, setIsSectionLoading] = useState(false)
  const [sectionLoadingFrom, setSectionLoadingFrom] = useState(1)
  const [sectionLoadingTo, setSectionLoadingTo] = useState(1)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  
  // Stage 8 animation functions
  const [stage8AnimationFunctions, setStage8AnimationFunctions] = useState<{
    stage8OpenAnimation: (() => void) | null
    stage8CloseAnimation: (() => void) | null
  }>({
    stage8OpenAnimation: null,
    stage8CloseAnimation: null
  })

  // Handle stage 8 animation functions ready
  const handleAnimationFunctionsReady = useCallback((functions: {
    stage8OpenAnimation: () => void
    stage8CloseAnimation: () => void
  }) => {
    setStage8AnimationFunctions(functions)
  }, [])

  
  // Function to get stage configuration
  const getStageConfigLocal = useCallback((stage: number): StageConfig => {
    // Ensure stage is a valid number
    if (typeof stage !== 'number' || stage < 0 || stage > 9) {
      stage = 1
    }

    // Use direct reference to avoid circular dependency issues
    const config = stageConfigs[stage] || stageConfigs[1]
    
    return config
  }, [])

  // Memoized easing function to prevent recreation
  const easeOutCubic = useCallback((t: number) => {
    return 1 - Math.pow(1 - t, 3)
  }, [])

  

  // Navigation function for clicking on section dots
  const navigateToSection = useCallback((targetSection: number) => {
    if (isScrolling || isTransitioning || !isClient) return
    if (targetSection === currentSection) return
    
    const direction = targetSection > currentSection ? 'down' : 'up'
    const transitionName = `section${currentSection}to${targetSection}`
    const sectionDistance = Math.abs(targetSection - currentSection)
    
    // Check if we need to show loading screen for jumps of more than 1 section
    const shouldShowLoading = sectionDistance > 1
    
    // Set flag to indicate we're navigating via dots
    setIsNavigatingViaDots(true)
    
    // Show section loading screen if jumping more than 1 section
    if (shouldShowLoading) {
      setSectionLoadingFrom(currentSection)
      setSectionLoadingTo(targetSection)
      setIsSectionLoading(true)
    }
    
    // Start transition animation
    setScrollDirection(direction)
    setTransitionName(transitionName)
    setIsScrolling(true)
    setIsTransitioning(true)
    setTransitionProgress(0)
    
    // Animate transition progress with improved timing
    const duration = 900 // slightly shorter for snappier feel
    const startTime = performance.now()
    
    const animateTransition = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setTransitionProgress(easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        // Transition complete - set final scroll position exactly once
        const finalScrollY = (targetSection - 1) * window.innerHeight
        window.scrollTo(0, finalScrollY)
        setScrollPosition(finalScrollY)
        
        // Use THREE requestAnimationFrames to ensure scroll is fully rendered before state update
        // First frame: let the browser start rendering the scroll position
        requestAnimationFrame(() => {
          // Second frame: ensure the scroll position is painted
          requestAnimationFrame(() => {
            // Third frame: Update all state atomically to prevent flash
            requestAnimationFrame(() => {
              // CRITICAL: Update all state together to ensure sections render correctly
              setTransitionProgress(0)
              setIsScrolling(false)
              setTransitionName(null)
              
              // Hide section loading screen if it was shown
              if (shouldShowLoading) {
                setIsSectionLoading(false)
              }
              
              // Update 3D stage to match the target section (stage = section)
              const targetStage = targetSection
              
              // Direct stage transition without animation
              if (targetStage !== current3DStage) {
                setCurrent3DStage(targetStage)
                setStage3DAnimationProgress(1)
                
                // Apply stage configuration immediately
                const stageConfig = getStageConfigLocal(targetStage)
                if (stageConfig) {
                  setModelControls(stageConfig.model)
                  setCameraControls(stageConfig.camera)
                  setLightingControls(stageConfig.lighting)
                }
              }
              
              // Set isTransitioning to false and update currentSection together
              // This ensures isTransitioning=false when sections recalculate positions
              setIsTransitioning(false)
              setCurrentSection(targetSection)
              
              // Clear the navigation flag after a short delay to prevent conflicts
              setTimeout(() => {
                setIsNavigatingViaDots(false)
              }, 100)
            })
          })
        })
      }
    }
    
    requestAnimationFrame(animateTransition)
  }, [currentSection, isScrolling, isTransitioning, isClient, easeOutCubic, getStageConfigLocal])

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Set initial stage - always start with Stage 0 and animate to Stage 1
  useEffect(() => {
    if (!isClient || isLoading) return

    // Initial page load - start with Stage 0 and animate to Stage 1
    // Set to stage 0 initially
    setCurrent3DStage(0)
    setIs3DAnimating(false)
    setStage3DAnimationProgress(0)
    
    // Apply stage 0 configuration immediately
    const stage0Config = getStageConfigLocal(0)
    if (stage0Config) {
      setModelControls(stage0Config.model)
      setCameraControls(stage0Config.camera)
      setLightingControls(stage0Config.lighting)
    }

    // Start animation to stage 1 after a short delay
    const animationDelay = 300 // 0.3 second delay
    const animationTimeout = setTimeout(() => {
      // Get stage 1 configuration
      const stage1Config = getStageConfigLocal(1)
      if (stage1Config) {
        // Start the animation
        setIs3DAnimating(true)
        setStage3DAnimationProgress(0)
        ;(window as any).isStageAnimating = true // Flag to prevent LightManager from interfering
        
        // Animate the transition with optimized performance
        const duration = 1000 // Reduced to 1 second animation for maximum smoothness
        const startTime = performance.now()
        let lastFrameTime = startTime
        
        // Get stage 0 config once
        const stage0Config = getStageConfigLocal(0)
        if (!stage0Config) {
          return
        }
        
        // Use direct Three.js animation to bypass React re-renders
        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Apply easing
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          
          // Update progress state only occasionally to reduce re-renders
          if (Math.floor(progress * 30) !== Math.floor((progress - 0.033) * 30)) {
            setStage3DAnimationProgress(easedProgress)
          }
          
          // Direct Three.js animation - bypass React state updates
          if ((window as any).directThreeAnimation) {
            (window as any).directThreeAnimation({
              progress: easedProgress,
              stage0Config,
              stage1Config
            })
          }
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            // Animation complete - set to stage 1
            setCurrent3DStage(1)
            setIs3DAnimating(false)
            setStage3DAnimationProgress(1)
            ;(window as any).isStageAnimating = false // Allow LightManager to update again
            
            // Apply final stage 1 values
            // On mobile, the directThreeAnimation already positioned the camera at mobile-adjusted Stage 1
            // Setting desktop values to store will cause forceDevControlUpdates to re-apply mobile adjustments,
            // which should keep the camera at the same position (no jump)
            setModelControls(stage1Config.model)
            setCameraControls(stage1Config.camera)
            setLightingControls(stage1Config.lighting)
          }
        }
        
        requestAnimationFrame(animate)
      }
    }, animationDelay)

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(animationTimeout)
    }
  }, [isClient, isLoading, setCurrent3DStage, setIs3DAnimating, setStage3DAnimationProgress, getStageConfigLocal, setModelControls, setCameraControls, setLightingControls, easeOutCubic])
  

  // Handle loading progress
  const handleLoadingProgress = useCallback((progress: number) => {
    setLoadingProgress(progress)
  }, [])

  // Handle loading complete with minimum 2 second display time
  const handleLoadingComplete = useCallback(() => {
    const minLoadingTime = 2000 // 2 seconds minimum
    
    const completeLoading = () => {
      const start = loadingStartTime ?? Date.now()
      const readyAt = start + minLoadingTime
      let attempts = 0
      const maxAttempts = 200 // ~10s max (200 * 50ms)
      const tryFinish = () => {
        const timeReady = Date.now() >= readyAt
        const assetsReady = uiAssetsLoadedRef.current
        if (timeReady && assetsReady) {
          setLoading(false)
        } else if (attempts++ < maxAttempts) {
          setTimeout(tryFinish, 50)
        } else {
          // Safety fallback: do not block indefinitely if an asset fails
          setLoading(false)
        }
      }
      tryFinish()
    }
    
    completeLoading()
  }, [loadingStartTime, setLoading])


  // Memoized navigation dots component to prevent unnecessary re-renders
  const NavigationDots = useMemo(() => {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((section) => (
            <button
              key={section}
              onClick={() => navigateToSection(section)}
              className={`nav-dot rounded-full border-2 transition-all duration-300 touch-manipulation ${
                currentSection === section
                  ? 'bg-white border-white'
                  : 'bg-transparent border-gray-400 hover:border-white'
              }`}
              title={`Section ${section}`}
              style={{ 
                touchAction: 'manipulation'
              }}
            />
          ))}
        </div>
      </div>
    )
  }, [currentSection, navigateToSection])


  return (
    <PerformanceMonitor componentName="Home">
      <div className="relative home-page w-full" style={{ maxWidth: '100%', overflowX: 'hidden' }}>
        
        {/* Loading Screen */}
        <LoadingScreen 
          isLoading={isLoading} 
          progress={loadingProgress} 
          onHidden={() => {
            // Start stage 0 -> 1 animation the moment the loader is fully hidden
            // This is in addition to the existing effect that runs when !isLoading
            const stage1 = getStageConfigLocal(1)
            if (!stage1) return
            // Ensure initial stage is 0, then our existing effect will animate to 1
            setCurrent3DStage(0)
          }}
        />
      
      {/* Section Loading Screen */}
      <SectionLoadingScreen 
        isVisible={isSectionLoading} 
        fromSection={sectionLoadingFrom} 
        toSection={sectionLoadingTo} 
      />
      
      {/* 3D Container - Always mounted but always visible (but paused when not section 1) */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-full h-screen touch-none"
        style={{ 
          zIndex: 1,
          opacity: 1,
          pointerEvents: (currentSection === 1 || (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)) ? 'auto' : 'none',
          transform: 'translateZ(0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Optimize rendering
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      />
      
      {/* Three.js Scene Manager - Always mounted but conditionally active */}
      {/* Using V2 - with full PBR texture support */}
      <ThreeSceneManagerV2
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

      {/* Scroll Manager */}
      <ScrollManager
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        setIsScrolling={setIsScrolling}
        setScrollDirection={setScrollDirection}
        setTransitionName={setTransitionName}
        setIsTransitioning={setIsTransitioning}
        setTransitionProgress={setTransitionProgress}
        setScrollPosition={setScrollPosition}
        isClient={isClient}
        setIsClient={setIsClient}
      />

      {/* Animation System */}
      <AnimationSystem />

      {/* Scrollable Content - 8x screen height */}
      <main 
        className={`relative transition-opacity duration-500 smooth-scroll ${isLoading ? 'opacity-0' : 'opacity-100'} w-full`}
        style={{ 
          height: '800vh',
          minHeight: '800vh',
          maxWidth: '100%',
          overflowX: 'hidden',
          touchAction: 'none' // Prevent native scrolling for section-by-section navigation
        }}
      >

        {/* Section Navigation Dots */}
        {NavigationDots}

        {/* Mobile Scroll Indicator */}
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 md:hidden ${currentSection === 8 ? 'hidden' : 'block'}`}>
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <div className="text-sm font-medium">Swipe to navigate</div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>

        {/* Content Sections - Positioned based on scroll */}
        <div className="section-content relative z-10 w-full" style={{ zIndex: 10, maxWidth: '100%' }}>
          {/* Section 1 - Hero - Always render */}
          <HeroSection
            isClient={isClient}
            currentSection={currentSection}
            isTransitioning={isTransitioning}
            scrollDirection={scrollDirection || 'down'}
            transitionProgress={transitionProgress}
          />

          {/* Section 2 - Render if current or adjacent */}
          {(currentSection >= 1 && currentSection <= 3) && (
            <Section2
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 3 - Render if current, previous, or next (show for sections 2-4) */}
          {(currentSection >= 2 && currentSection <= 4) && (
            <Section3
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 4 - Render if current, previous, or next (show for sections 3-5) */}
          {(currentSection >= 3 && currentSection <= 5) && (
            <Section4
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 5 - Render if current or adjacent */}
          {(currentSection >= 4 && currentSection <= 6) && (
            <Section5
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 6 - Render if current or adjacent */}
          {(currentSection >= 5 && currentSection <= 7) && (
            <Section6
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 7 - Render if current or adjacent */}
          {(currentSection >= 6 && currentSection <= 8) && (
            <Section7
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}

          {/* Section 8 - Render if current (show for sections 7-8) */}
          {(currentSection >= 7 && currentSection <= 8) && (
            <Section8
              isClient={isClient}
              currentSection={currentSection}
              isTransitioning={isTransitioning}
              scrollDirection={scrollDirection || 'down'}
              transitionProgress={transitionProgress}
            />
          )}
        </div>
      </main>


      {/* Top Menu */}
      {!isLoading && <TopMenu />}

      {/* Dev Controls - Right Sidebar */}
      {/* Temporarily enabled for debugging */}
      {isDevMode && (
        <DevControls
          isDevMode={isDevMode}
          onToggleDevMode={() => setIsDevMode(!isDevMode)}
          componentControls={componentControls}
          onComponentControlsChange={setComponentControls}
          categoryVisibility={categoryVisibility}
          onCategoryVisibilityChange={setCategoryVisibility}
          transitionName={transitionName}
          stage1Config={stage1Config}
          stage2Config={stage2Config}
          stage3Config={stage3Config}
        />
      )}

      </div>
    </PerformanceMonitor>
  )
}

