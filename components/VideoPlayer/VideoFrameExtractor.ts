'use client'

/**
 * Utility class for extracting video frames at specific timestamps
 */
export class VideoFrameExtractor {
  /**
   * Extracts a video frame at a specific time and returns it as a data URL
   * @param videoSrc - The video source URL
   * @param timeInSeconds - The time in seconds to extract the frame
   * @returns Promise<string> - Data URL of the extracted frame
   */
  static async extractFrameAtTime(
    videoSrc: string, 
    timeInSeconds: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      video.crossOrigin = 'anonymous'
      video.preload = 'metadata'
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Seek to the specified time
        video.currentTime = timeInSeconds
      }
      
      video.onseeked = () => {
        try {
          // Draw the current frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/jpeg', 0.8)
          
          // Clean up
          video.remove()
          canvas.remove()
          
          resolve(dataURL)
        } catch (error) {
          reject(error)
        }
      }
      
      video.onerror = () => {
        reject(new Error('Failed to load video'))
      }
      
      // Set video source and start loading
      video.src = videoSrc
    })
  }

  /**
   * Creates a thumbnail image element from a video frame
   * @param videoSrc - The video source URL
   * @param timeInSeconds - The time in seconds to extract the frame
   * @returns Promise<HTMLImageElement> - Image element with the extracted frame
   */
  static async createThumbnailImage(
    videoSrc: string, 
    timeInSeconds: number
  ): Promise<HTMLImageElement> {
    const dataURL = await this.extractFrameAtTime(videoSrc, timeInSeconds)
    
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to create thumbnail image'))
      img.src = dataURL
    })
  }

  /**
   * Checks if the browser supports video frame extraction
   * @returns boolean - True if supported, false otherwise
   */
  static isSupported(): boolean {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    
    // Check if video can play type and canvas can get 2D context
    return !!(video.canPlayType('video/mp4') && canvas.getContext('2d'))
  }
}
