import { isMobileDevice, isLowEndDevice, detectDevice, needsLowPowerMode } from '../deviceDetection'

// Mock window and navigator
const mockWindow = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
}

const mockNavigator = (options: {
  hardwareConcurrency?: number
  deviceMemory?: number
  userAgent?: string
}) => {
  Object.defineProperty(global, 'navigator', {
    writable: true,
    configurable: true,
    value: {
      hardwareConcurrency: options.hardwareConcurrency ?? 8,
      deviceMemory: options.deviceMemory ?? 8,
      userAgent: options.userAgent ?? 'Mozilla/5.0'
    }
  })
}

describe('deviceDetection', () => {
  beforeEach(() => {
    // Reset mocks
    mockWindow(1024)
    mockNavigator({ hardwareConcurrency: 8, deviceMemory: 8 })
  })

  describe('isMobileDevice', () => {
    it('should return true when width < 768', () => {
      mockWindow(500)
      expect(isMobileDevice()).toBe(true)
    })

    it('should return false when width >= 768', () => {
      mockWindow(1024)
      expect(isMobileDevice()).toBe(false)
    })

    it('should return false on server-side rendering', () => {
      Object.defineProperty(window, 'innerWidth', {
        get: () => { throw new Error('Window not available') },
        configurable: true
      })
      expect(isMobileDevice()).toBe(false)
    })
  })

  describe('isLowEndDevice', () => {
    it('should return true when hardwareConcurrency <= 4', () => {
      mockNavigator({ hardwareConcurrency: 4 })
      expect(isLowEndDevice()).toBe(true)
    })

    it('should return false when hardwareConcurrency > 4', () => {
      mockNavigator({ hardwareConcurrency: 8 })
      expect(isLowEndDevice()).toBe(false)
    })

    it('should return true for old Android browsers', () => {
      mockWindow(400)
      mockNavigator({ 
        userAgent: 'Android Chrome/50',
        hardwareConcurrency: 8 
      })
      expect(isLowEndDevice()).toBe(true)
    })

    it('should return true for small Android devices', () => {
      mockWindow(400)
      mockNavigator({ 
        userAgent: 'Android Chrome/100',
        hardwareConcurrency: 8 
      })
      expect(isLowEndDevice()).toBe(true)
    })
  })

  describe('detectDevice', () => {
    it('should return comprehensive device info', () => {
      mockWindow(500)
      mockNavigator({ hardwareConcurrency: 4, deviceMemory: 4 })
      
      const result = detectDevice()
      expect(result.isMobile).toBe(true)
      expect(result.isLowEnd).toBe(true)
      expect(result.hardwareConcurrency).toBe(4)
      expect(result.deviceMemory).toBe(4)
    })
  })

  describe('needsLowPowerMode', () => {
    it('should return true for mobile devices', () => {
      mockWindow(500)
      mockNavigator({ hardwareConcurrency: 8 })
      expect(needsLowPowerMode()).toBe(true)
    })

    it('should return true for low-end devices', () => {
      mockWindow(1024)
      mockNavigator({ hardwareConcurrency: 4 })
      expect(needsLowPowerMode()).toBe(true)
    })

    it('should return false for powerful desktop devices', () => {
      mockWindow(1920)
      mockNavigator({ hardwareConcurrency: 8 })
      expect(needsLowPowerMode()).toBe(false)
    })
  })
})

