'use client'

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react'

interface VideoContextType {
  currentPlayingVideo: string | null
  setCurrentPlayingVideo: (videoId: string | null) => void
  pauseAllVideos: () => void
}

const VideoContext = createContext<VideoContextType | undefined>(undefined)

export function VideoProvider({ children }: { children: ReactNode }) {
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<string | null>(null)

  const pauseAllVideos = useCallback(() => {
    // This will be called when a new video starts playing
    // The individual video components will handle pausing themselves
    setCurrentPlayingVideo(null)
  }, [])

  const value = useMemo(() => ({
    currentPlayingVideo,
    setCurrentPlayingVideo,
    pauseAllVideos
  }), [currentPlayingVideo, setCurrentPlayingVideo, pauseAllVideos])

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  )
}

export function useVideoContext() {
  const context = useContext(VideoContext)
  if (context === undefined) {
    throw new Error('useVideoContext must be used within a VideoProvider')
  }
  return context
}
