import { parseHexColor, hexToThreeColor, interpolateColors } from '../colorUtils'
import * as THREE from 'three'

describe('colorUtils', () => {
  describe('parseHexColor', () => {
    it('should parse black color', () => {
      const result = parseHexColor('#000000')
      expect(result).toEqual({ r: 0, g: 0, b: 0 })
    })

    it('should parse white color', () => {
      const result = parseHexColor('#ffffff')
      expect(result).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('should parse red color', () => {
      const result = parseHexColor('#ff0000')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle hex without #', () => {
      const result = parseHexColor('ff0000')
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe('hexToThreeColor', () => {
    it('should convert black to THREE.Color', () => {
      const result = hexToThreeColor('#000000')
      expect(result).toBeInstanceOf(THREE.Color)
      expect(result.r).toBe(0)
      expect(result.g).toBe(0)
      expect(result.b).toBe(0)
    })

    it('should convert white to THREE.Color', () => {
      const result = hexToThreeColor('#ffffff')
      expect(result.r).toBeCloseTo(1)
      expect(result.g).toBeCloseTo(1)
      expect(result.b).toBeCloseTo(1)
    })
  })

  describe('interpolateColors', () => {
    it('should interpolate from black to white at t=0.5', () => {
      const result = interpolateColors('#000000', '#ffffff', 0.5)
      expect(result).toBe('#808080')
    })

    it('should start with black at t=0', () => {
      const result = interpolateColors('#000000', '#ffffff', 0)
      expect(result).toBe('#000000')
    })

    it('should end with white at t=1', () => {
      const result = interpolateColors('#000000', '#ffffff', 1)
      expect(result.toLowerCase()).toBe('#ffffff')
    })

    it('should handle red to blue interpolation', () => {
      const result = interpolateColors('#ff0000', '#0000ff', 0.5)
      expect(result).toBe('#800080') // Purple
    })
  })
})

