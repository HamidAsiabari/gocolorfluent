'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import TopMenu from '../components/TopMenu'
import { useAppStore } from '../store/useAppStore'
import PerformanceMonitor from '../components/PerformanceMonitor/PerformanceMonitor'
import { ScrollManager } from '../components/ScrollSystem'
import { AnimationSystem } from '../components/Animation'
import HeroSection from '../components/HeroSection'
import Section2 from '../components/Section2'
import Section3 from '../components/Section3'
import Section4 from '../components/Section4'
import Section5 from '../components/Section5'
import Section6 from '../components/Section6'
import Section7 from '../components/Section7'
import Section8 from '../components/Section8'
import { LoadingScreen, SectionLoadingScreen } from '../components/Loading'

export default function Home() {
  const router = useRouter()
  
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
  
  // Local state
  const [transitionName, setTransitionName] = useState<string | null>(null)
  const [uiAssetsLoaded, setUiAssetsLoaded] = useState(false)
  const uiAssetsLoadedRef = useRef(false)
  const [isSectionLoading, setIsSectionLoading] = useState(false)
  const [sectionLoadingFrom, setSectionLoadingFrom] = useState(1)
  const [sectionLoadingTo, setSectionLoadingTo] = useState(1)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoStartedFromTransitionRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  // Set loading start time when component mounts
  useEffect(() => {
    setLoadingStartTime(Date.now())
  }, [])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                            (typeof window !== 'undefined' && window.innerWidth < 768)
      setIsMobile(isMobileDevice)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Preload essential UI assets (logo, video, etc.)
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
        ;(img as any).decode().then(done).catch(done)
      }
    })
    
    // Preload video - use mobile video on mobile devices
    const preloadVideo = () => {
      // Determine video source based on device type
      const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                         (typeof window !== 'undefined' && window.innerWidth < 768)
      const videoSrc = checkMobile ? '/stage0-to-stage1-mobile.webm' : '/bcvideo.webm'
      
      return new Promise<void>((resolve) => {
        const video = document.createElement('video')
        video.src = videoSrc
        video.preload = 'auto'
        video.muted = true // Required for autoplay
        
        const handleCanPlayThrough = () => {
          setVideoLoaded(true)
          resolve()
        }
        
        const handleError = () => {
          // Still resolve even if video fails to load
          console.warn('Video failed to load')
          setVideoLoaded(true)
          resolve()
        }
        
        video.addEventListener('canplaythrough', handleCanPlayThrough, { once: true })
        video.addEventListener('error', handleError, { once: true })
        
        // Start loading
        video.load()
      })
    }
    
    Promise.all([
      ...assetsToPreload.map(preloadImage),
      preloadVideo()
    ]).then(() => {
      if (cancelled) return
      setUiAssetsLoaded(true)
      uiAssetsLoadedRef.current = true
    })
    
    return () => { cancelled = true }
  }, [])
  
  // Complete loading once all assets (including video) are loaded
  useEffect(() => {
    if (!isLoading || !uiAssetsLoaded || !videoLoaded) return
    
    const minLoadingTime = 2000 // 2 seconds minimum
    const start = loadingStartTime ?? Date.now()
    const readyAt = start + minLoadingTime
    
    const tryFinish = () => {
      const timeReady = Date.now() >= readyAt
      if (timeReady) {
        setLoading(false)
        setVideoReady(true)
      } else {
        setTimeout(tryFinish, 50)
      }
    }
    
    tryFinish()
  }, [isLoading, uiAssetsLoaded, videoLoaded, loadingStartTime])
  
  // Control video playback based on current section and transitions
  useEffect(() => {
    if (!videoReady || !videoRef.current) return
    
    const video = videoRef.current
    
    // Check if we're transitioning up from section 2 to section 1
    const isScrollingUpToSection1 = 
      isTransitioning && 
      scrollDirection === 'up' && 
      currentSection === 2
    
    // Check if we're transitioning down from section 1 to section 2
    const isScrollingDownFromSection1 = 
      isTransitioning && 
      scrollDirection === 'down' && 
      currentSection === 1
    
    // Check if transition just completed (was transitioning, now on section 1)
    const justCompletedTransition = 
      !isTransitioning && 
      currentSection === 1 && 
      videoStartedFromTransitionRef.current
    
    // Check if we're on section 1 or transitioning to it (but not leaving it)
    const shouldPlayVideo = 
      (currentSection === 1 && !isLoading && !justCompletedTransition && !isScrollingDownFromSection1) || 
      isScrollingUpToSection1
    
    if (shouldPlayVideo) {
      // Play video from start when entering section 1 or transitioning to it
      const playVideo = async () => {
        try {
          const isVideoPlaying = !video.paused && video.currentTime > 0 && !video.ended
          
          // Only reset if:
          // 1. We're transitioning up from section 2 (starting new playback)
          // 2. Video has ended
          const needsReset = isScrollingUpToSection1 || video.ended
          
          if (needsReset && !isVideoPlaying) {
            video.currentTime = 0
            if (isScrollingUpToSection1) {
              videoStartedFromTransitionRef.current = true
            }
          }
          
          // Clear the transition flag when we're no longer on section 1
          if (currentSection !== 1 && currentSection !== 2) {
            videoStartedFromTransitionRef.current = false
          }
          
          if (video.paused && !isVideoPlaying) {
            await video.play()
          }
        } catch (error) {
          console.warn('Video autoplay failed:', error)
          // Try again after a short delay
          setTimeout(() => {
            if (videoRef.current && (currentSection === 1 || isScrollingUpToSection1)) {
              const isPlaying = videoRef.current.currentTime > 0 && !videoRef.current.paused && !videoRef.current.ended
              
              if (!isPlaying) {
                if (isScrollingUpToSection1 || videoRef.current.ended || videoRef.current.currentTime === 0) {
                  videoRef.current.currentTime = 0
                  if (isScrollingUpToSection1) {
                    videoStartedFromTransitionRef.current = true
                  }
                }
                videoRef.current.play().catch(() => {})
              }
            }
          }, 500)
        }
      }
      playVideo()
    } else if (isScrollingDownFromSection1) {
      // Scrolling down from section 1 - just pause, don't reset
      // This prevents the video from jumping back to the beginning during transition
      if (!video.paused) {
        video.pause()
      }
      // Don't reset currentTime - keep it where it is so user doesn't see jump
    } else if (currentSection !== 1 && !isScrollingUpToSection1) {
      // Not on section 1 and not transitioning to it - pause video (but keep it loaded in memory)
      if (!video.paused) {
        video.pause()
      }
      // Clear transition flag when leaving section 1/2
      if (currentSection > 2) {
        videoStartedFromTransitionRef.current = false
      }
    } else if (justCompletedTransition) {
      // Transition just completed - don't interfere with video playback
      // Just ensure it's playing (but don't reset)
      if (video.paused && !video.ended) {
        video.play().catch(() => {})
      }
      // Clear the flag after a short delay to allow normal operation
      setTimeout(() => {
        videoStartedFromTransitionRef.current = false
      }, 1000)
    }
  }, [currentSection, videoReady, isLoading, isTransitioning, scrollDirection])

  // Memoized easing function
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
    
    // Animate transition progress
    const duration = 900
    const startTime = performance.now()
    
    const animateTransition = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setTransitionProgress(easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition)
      } else {
        // Transition complete - set final scroll position
        const finalScrollY = (targetSection - 1) * window.innerHeight
        window.scrollTo(0, finalScrollY)
        setScrollPosition(finalScrollY)
        
        // Use requestAnimationFrames to ensure scroll is fully rendered before state update
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // Update all state together
              setTransitionProgress(0)
              setIsScrolling(false)
              setTransitionName(null)
              
              // Hide section loading screen if it was shown
              if (shouldShowLoading) {
                setIsSectionLoading(false)
              }
              
              // Update section
              setIsTransitioning(false)
              setCurrentSection(targetSection)
              
              // Clear the navigation flag after a short delay
              setTimeout(() => {
                setIsNavigatingViaDots(false)
              }, 100)
            })
          })
        })
      }
    }
    
    requestAnimationFrame(animateTransition)
  }, [currentSection, isScrolling, isTransitioning, isClient, easeOutCubic, setCurrentSection, setIsScrolling, setScrollDirection, setTransitionName, setIsTransitioning, setTransitionProgress, setScrollPosition, setIsNavigatingViaDots])

  // Memoized navigation dots component
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
            // Loading screen hidden
          }}
        />
      
        {/* Section Loading Screen */}
        <SectionLoadingScreen 
          isVisible={isSectionLoading} 
          fromSection={sectionLoadingFrom} 
          toSection={sectionLoadingTo} 
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
            touchAction: 'none'
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

          {/* Background Video for Section 1 - Always mounted to prevent reloading */}
          <div 
            className="fixed inset-0 w-full h-screen overflow-hidden"
            style={{
              zIndex: 1,
              pointerEvents: 'none',
              opacity: (currentSection === 1 || 
                        (isTransitioning && scrollDirection === 'up' && currentSection === 2) ||
                        (isTransitioning && scrollDirection === 'down' && currentSection === 1) ||
                        (isScrolling && scrollDirection === 'up' && scrollPosition < window.innerHeight * 0.5)) ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              visibility: (currentSection === 1 || currentSection === 2) ? 'visible' : 'hidden'
            }}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src={isMobile ? '/stage0-to-stage1-mobile.webm' : '/bcvideo.webm'}
              muted
              playsInline
              controls={false}
              preload="auto"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
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

            {/* Section 3 - Render if current, previous, or next */}
            {(currentSection >= 2 && currentSection <= 4) && (
              <Section3
                isClient={isClient}
                currentSection={currentSection}
                isTransitioning={isTransitioning}
                scrollDirection={scrollDirection || 'down'}
                transitionProgress={transitionProgress}
              />
            )}

            {/* Section 4 - Render if current, previous, or next */}
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

            {/* Section 8 - Render if current */}
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

      </div>
    </PerformanceMonitor>
  )
}
