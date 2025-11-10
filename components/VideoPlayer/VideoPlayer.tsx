'use client'

import { useRef, useState, useEffect } from 'react'
import { useVideoContext } from './VideoContext'
import { VideoFrameExtractor } from './VideoFrameExtractor'

interface VideoPlayerProps {
  src: string
  videoId: string
  className?: string
  onPlay?: () => void
  onPause?: () => void
  currentSection?: number
  sectionNumber?: number
  bannerTimeInSeconds?: number // Time in seconds to extract banner frame (default: 10)
  showBanner?: boolean // Whether to show banner before video plays (default: true)
}

export default function VideoPlayer({ 
  src, 
  videoId, 
  className = '', 
  onPlay, 
  onPause, 
  currentSection, 
  sectionNumber,
  bannerTimeInSeconds = 10,
  showBanner = true
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted to comply with browser autoplay policies
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bannerImage, setBannerImage] = useState<string | null>(null)
  const [isBannerLoading, setIsBannerLoading] = useState(false)
  const [bannerError, setBannerError] = useState(false)
  const { currentPlayingVideo, setCurrentPlayingVideo } = useVideoContext()

  // Set loading to false on mount as a fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
      }
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [videoId, isLoading])

  // Generate banner image when component mounts or video source changes
  useEffect(() => {
    if (!showBanner || !src) return

    const generateBanner = async () => {
      try {
        setIsBannerLoading(true)
        setBannerError(false)
        
        // Check if frame extraction is supported
        if (!VideoFrameExtractor.isSupported()) {
          console.warn('Video frame extraction not supported in this browser')
          setBannerError(true)
          return
        }

        const dataURL = await VideoFrameExtractor.extractFrameAtTime(src, bannerTimeInSeconds)
        setBannerImage(dataURL)
      } catch (error) {
        console.error('Failed to generate banner image:', error)
        setBannerError(true)
      } finally {
        setIsBannerLoading(false)
      }
    }

    generateBanner()
  }, [src, bannerTimeInSeconds, showBanner])

  // Test video source accessibility
  useEffect(() => {
    const testVideoSource = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' })
        if (!response.ok) {
          setHasError(true)
        }
      } catch (error) {
        setHasError(true)
      }
    }
    
    if (src) {
      testVideoSource()
    }
  }, [src, videoId])

  // Debug video element setup
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Video element setup
    }
  }, [videoId])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Check if video is already loaded
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA
      setDuration(video.duration)
      setIsLoading(false)
      setHasError(false)
    }

    // Set a timeout to ensure loading state doesn't get stuck
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // 2 second timeout

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
      setHasError(false)
      clearTimeout(loadingTimeout)
    }

    const handleLoadStart = () => {
      // Only set loading to true if we're not already in an error state
      if (!hasError) {
        setIsLoading(true)
      }
      setHasError(false)
    }

    const handleError = () => {
      setHasError(true)
      setIsLoading(false)
      clearTimeout(loadingTimeout)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setHasError(false)
      clearTimeout(loadingTimeout)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
      clearTimeout(loadingTimeout)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setCurrentPlayingVideo(videoId)
      onPlay?.()
    }

    const handlePause = () => {
      setIsPlaying(false)
      if (currentPlayingVideo === videoId) {
        setCurrentPlayingVideo(null)
      }
      onPause?.()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      if (currentPlayingVideo === videoId) {
        setCurrentPlayingVideo(null)
      }
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('error', handleError)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      clearTimeout(loadingTimeout)
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('error', handleError)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onPlay, onPause, videoId, currentPlayingVideo, setCurrentPlayingVideo])

  // Pause this video if another video starts playing
  useEffect(() => {
    if (currentPlayingVideo && currentPlayingVideo !== videoId && isPlaying) {
      const video = videoRef.current
      if (video) {
        video.pause()
      }
    }
  }, [currentPlayingVideo, videoId, isPlaying])

  // Pause video when user navigates to a different section
  useEffect(() => {
    if (currentSection !== undefined && sectionNumber !== undefined) {
      const isVideoInCurrentSection = currentSection === sectionNumber
      if (!isVideoInCurrentSection && isPlaying) {
        const video = videoRef.current
        if (video) {
          video.pause()
        }
      }
    }
  }, [currentSection, sectionNumber, videoId, isPlaying])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video || hasError) return

    try {
      if (isPlaying) {
        video.pause()
      } else {
        // Pause any currently playing video first
        if (currentPlayingVideo && currentPlayingVideo !== videoId) {
          setCurrentPlayingVideo(null)
        }
        
        // Ensure video is loaded
        if (video.readyState < 2) {
          video.load()
        }
        
        // Attempt to play the video
        const playPromise = video.play()
        
        if (playPromise !== undefined) {
          await playPromise
        }
      }
    } catch (error) {
      setHasError(true)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div 
      className={`relative group ${className}`}
      data-video-player="true"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className={`w-full h-full object-cover rounded-2xl cursor-pointer z-0 ${!isPlaying && showBanner && bannerImage ? 'opacity-0' : 'opacity-100'}`}
        muted={isMuted}
        playsInline
        preload="metadata"
        controls={false}
        loop={false}
        autoPlay={false}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          togglePlay()
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Banner Image Overlay - Shows video frame at specified time */}
      {!isPlaying && showBanner && bannerImage && !bannerError && (
        <div 
          className="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer z-5"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            togglePlay()
          }}
        >
          <img 
            src={bannerImage} 
            alt="Video preview" 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Banner Loading State */}
      {!isPlaying && showBanner && isBannerLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-5">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Banner Error State - Fallback to play button */}
      {!isPlaying && showBanner && bannerError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-5 cursor-pointer"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            togglePlay()
          }}
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Loading Overlay - Temporarily disabled to test */}
      {false && isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-red-500/90 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm">Video failed to load</p>
            <button 
              onClick={() => {
                setHasError(false)
                setIsLoading(true)
                const video = videoRef.current
                if (video) {
                  video.load()
                }
              }}
              className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Play Button Overlay - Always show when video is not playing */}
      {!isPlaying && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl cursor-pointer z-20"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            togglePlay()
          }}
        >
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
            <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      )}


      {/* Controls Overlay */}
      {!hasError && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-4 transition-opacity duration-300 z-10 ${showControls || isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="mb-3">
          <div 
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                togglePlay()
              }}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Mute Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleMute()
              }}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              {isMuted ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>

            {/* Time Display */}
            <span className="text-white text-sm font-mono">
              {formatTime((progress / 100) * duration)} / {formatTime(duration)}
            </span>
          </div>

          {/* Stop Button */}
          {isPlaying && (
            <button
              onClick={() => {
                const video = videoRef.current
                if (video) {
                  video.pause()
                  video.currentTime = 0
                  setProgress(0)
                }
              }}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z"/>
              </svg>
            </button>
          )}
        </div>
        </div>
      )}
    </div>
  )
}
