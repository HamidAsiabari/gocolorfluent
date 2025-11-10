import { lerp, lerpVector3, lerpColor, easeInOutSine, easeOutCubic } from '../interpolation'

describe('interpolation', () => {
  describe('lerp', () => {
    it('should interpolate between two numbers at t=0', () => {
      expect(lerp(0, 10, 0)).toBe(0)
    })

    it('should interpolate between two numbers at t=1', () => {
      expect(lerp(0, 10, 1)).toBe(10)
    })

    it('should interpolate between two numbers at t=0.5', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
    })

    it('should handle negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0)
    })

    it('should handle large differences', () => {
      expect(lerp(0, 1000, 0.25)).toBe(250)
    })
  })

  describe('lerpVector3', () => {
    it('should interpolate Vector3 at t=0', () => {
      const result = lerpVector3({ x: 0, y: 0, z: 0 }, { x: 10, y: 20, z: 30 }, 0)
      expect(result).toEqual({ x: 0, y: 0, z: 0 })
    })

    it('should interpolate Vector3 at t=1', () => {
      const result = lerpVector3({ x: 0, y: 0, z: 0 }, { x: 10, y: 20, z: 30 }, 1)
      expect(result).toEqual({ x: 10, y: 20, z: 30 })
    })

    it('should interpolate Vector3 at t=0.5', () => {
      const result = lerpVector3({ x: 0, y: 0, z: 0 }, { x: 10, y: 20, z: 30 }, 0.5)
      expect(result).toEqual({ x: 5, y: 10, z: 15 })
    })
  })

  describe('lerpColor', () => {
    it('should interpolate colors at t=0', () => {
      const result = lerpColor('#000000', '#ffffff', 0)
      expect(result).toBe('#000000')
    })

    it('should interpolate colors at t=1', () => {
      const result = lerpColor('#000000', '#ffffff', 1)
      expect(result.toLowerCase()).toBe('#ffffff')
    })

    it('should interpolate colors at t=0.5', () => {
      const result = lerpColor('#000000', '#ffffff', 0.5)
      // Should be approximately #808080 (gray)
      expect(result).toBe('#808080')
    })

    it('should handle hex colors without #', () => {
      const result = lerpColor('000000', 'ffffff', 0.5)
      expect(result).toBe('#808080')
    })
  })

  describe('easeInOutSine', () => {
    it('should return 0 at t=0', () => {
      expect(easeInOutSine(0)).toBeCloseTo(0)
    })

    it('should return 1 at t=1', () => {
      expect(easeInOutSine(1)).toBeCloseTo(1)
    })

    it('should return 0.5 at t=0.5', () => {
      expect(easeInOutSine(0.5)).toBeCloseTo(0.5)
    })
  })

  describe('easeOutCubic', () => {
    it('should return 0 at t=0', () => {
      expect(easeOutCubic(0)).toBe(0)
    })

    it('should return 1 at t=1', () => {
      expect(easeOutCubic(1)).toBe(1)
    })

    it('should start slow and end fast', () => {
      const mid = easeOutCubic(0.5)
      expect(mid).toBeLessThan(0.5) // Ease out means slower at start
    })
  })
})

