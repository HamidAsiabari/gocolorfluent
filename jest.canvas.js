// Canvas mock setup for Three.js testing
import 'jest-canvas-mock'

// Additional canvas mocking for Three.js
const mockCanvas = {
  getContext: jest.fn((contextType) => {
    if (contextType === 'webgl' || contextType === 'experimental-webgl') {
      return {
        getParameter: jest.fn(),
        getExtension: jest.fn(),
        createShader: jest.fn(() => ({})),
        createProgram: jest.fn(() => ({})),
        createBuffer: jest.fn(() => ({})),
        createTexture: jest.fn(() => ({})),
        createFramebuffer: jest.fn(() => ({})),
        createRenderbuffer: jest.fn(() => ({})),
        createVertexArray: jest.fn(() => ({})),
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
        bufferSubData: jest.fn()
      }
    }
    return null
  }),
  width: 800,
  height: 600,
  style: {}
}

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockCanvas.getContext
})

Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
  writable: true,
  value: 800
})

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
  writable: true,
  value: 600
})

// Mock canvas style
Object.defineProperty(HTMLCanvasElement.prototype, 'style', {
  writable: true,
  value: {}
})
