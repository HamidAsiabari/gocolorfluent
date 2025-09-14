import '@testing-library/jest-dom'
import 'jest-canvas-mock'

// Mock WebGL context
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  createShader: jest.fn(),
  createProgram: jest.fn(),
  createBuffer: jest.fn(),
  createTexture: jest.fn(),
  createFramebuffer: jest.fn(),
  createRenderbuffer: jest.fn(),
  createVertexArray: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  useProgram: jest.fn(),
  bindBuffer: jest.fn(),
  bindVertexArray: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  drawArrays: jest.fn(),
  drawElements: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  clearDepth: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  viewport: jest.fn(),
  scissor: jest.fn(),
  blendFunc: jest.fn(),
  blendEquation: jest.fn(),
  cullFace: jest.fn(),
  frontFace: jest.fn(),
  depthFunc: jest.fn(),
  depthMask: jest.fn(),
  colorMask: jest.fn(),
  stencilFunc: jest.fn(),
  stencilOp: jest.fn(),
  stencilMask: jest.fn(),
  activeTexture: jest.fn(),
  bindTexture: jest.fn(),
  texImage2D: jest.fn(),
  texParameteri: jest.fn(),
  texParameterf: jest.fn(),
  generateMipmap: jest.fn(),
  uniform1f: jest.fn(),
  uniform2f: jest.fn(),
  uniform3f: jest.fn(),
  uniform4f: jest.fn(),
  uniform1i: jest.fn(),
  uniform2i: jest.fn(),
  uniform3i: jest.fn(),
  uniform4i: jest.fn(),
  uniformMatrix2fv: jest.fn(),
  uniformMatrix3fv: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  getUniformLocation: jest.fn(),
  getAttribLocation: jest.fn(),
  bufferData: jest.fn(),
  bufferSubData: jest.fn(),
  createShader: jest.fn(() => ({})),
  createProgram: jest.fn(() => ({})),
  createBuffer: jest.fn(() => ({})),
  createTexture: jest.fn(() => ({})),
  createFramebuffer: jest.fn(() => ({})),
  createRenderbuffer: jest.fn(() => ({})),
  createVertexArray: jest.fn(() => ({}))
}

// Mock WebGL2 context
const mockWebGL2Context = {
  ...mockWebGLContext,
  createVertexArray: jest.fn(() => ({})),
  bindVertexArray: jest.fn(),
  deleteVertexArray: jest.fn(),
  isVertexArray: jest.fn(() => false)
}

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === 'webgl' || contextType === 'experimental-webgl') {
    return mockWebGLContext
  }
  if (contextType === 'webgl2') {
    return mockWebGL2Context
  }
  return null
})

// Mock canvas dimensions
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  writable: true,
  value: 800
})

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  writable: true,
  value: 600
})

// Mock window properties
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1024
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  value: 768
})

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  return setTimeout(cb, 16)
})

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id)
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url')
global.URL.revokeObjectURL = jest.fn()

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve(''))
  }
})

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillMount'))
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Mock Three.js GLTFLoader
jest.mock('three-stdlib', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad, onProgress, onError) => {
      // Mock successful load
      if (onLoad) {
        setTimeout(() => {
          onLoad({
            scene: {
              name: 'MockModel',
              children: [],
              traverse: jest.fn(),
              scale: { set: jest.fn() },
              position: { set: jest.fn() },
              rotation: { set: jest.fn() }
            },
            animations: []
          })
        }, 100)
      }
    })
  }))
}))

// Mock Three.js
jest.mock('three', () => {
  const THREE = jest.requireActual('three')
  
  // Mock specific Three.js classes that might cause issues in tests
  const mockScene = {
    add: jest.fn(),
    remove: jest.fn(),
    children: [],
    traverse: jest.fn()
  }
  
  const mockCamera = {
    position: { set: jest.fn() },
    fov: 75,
    aspect: 1,
    updateProjectionMatrix: jest.fn()
  }
  
  const mockRenderer = {
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas'),
    dispose: jest.fn(),
    shadowMap: {
      enabled: false,
      type: THREE.PCFSoftShadowMap
    }
  }
  
  const mockLight = {
    intensity: 1,
    color: { setHex: jest.fn() },
    position: { set: jest.fn() },
    target: { position: { set: jest.fn() } },
    castShadow: false,
    shadow: {
      mapSize: { width: 2048, height: 2048 },
      bias: -0.0001
    }
  }
  
  const mockGroup = {
    scale: { set: jest.fn() },
    position: { set: jest.fn() },
    rotation: { set: jest.fn() },
    traverse: jest.fn(),
    children: []
  }
  
  return {
    ...THREE,
    Scene: jest.fn(() => mockScene),
    PerspectiveCamera: jest.fn(() => mockCamera),
    WebGLRenderer: jest.fn(() => mockRenderer),
    AmbientLight: jest.fn(() => mockLight),
    DirectionalLight: jest.fn(() => mockLight),
    PointLight: jest.fn(() => mockLight),
    SpotLight: jest.fn(() => mockLight),
    Group: jest.fn(() => mockGroup),
    Mesh: jest.fn(() => mockGroup),
    Object3D: jest.fn(() => mockGroup),
    Bone: jest.fn(() => mockGroup)
  }
})
