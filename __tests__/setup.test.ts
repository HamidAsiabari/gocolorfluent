// Test to verify Jest setup is working correctly

describe('Jest Setup', () => {
  it('should have testing library available', () => {
    expect(typeof jest).toBe('object')
    expect(typeof expect).toBe('function')
  })

  it('should have DOM testing utilities available', () => {
    const { render, screen } = require('@testing-library/react')
    expect(typeof render).toBe('function')
    expect(typeof screen).toBe('object')
  })

  it('should have user event utilities available', () => {
    const { userEvent } = require('@testing-library/user-event')
    expect(typeof userEvent).toBe('object')
  })

  it('should have jest-dom matchers available', () => {
    // This test will pass if jest-dom is properly set up
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    expect(element).toBeInTheDocument()
  })

  it('should have canvas mocking available', () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    expect(context).toBeDefined()
  })

  it('should have WebGL context mocking available', () => {
    const canvas = document.createElement('canvas')
    const glContext = canvas.getContext('webgl')
    expect(glContext).toBeDefined()
  })

  it('should have Three.js mocking available', () => {
    const THREE = require('three')
    expect(THREE.Scene).toBeDefined()
    expect(THREE.PerspectiveCamera).toBeDefined()
    expect(THREE.WebGLRenderer).toBeDefined()
  })

  it('should have three-stdlib mocking available', () => {
    const { GLTFLoader } = require('three-stdlib')
    expect(GLTFLoader).toBeDefined()
  })
})
