import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { UserEvent } from '@testing-library/user-event'

// Mock Three.js for all tests
jest.mock('three', () => {
  const THREE = jest.requireActual('three')
  
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

// Mock three-stdlib
jest.mock('three-stdlib', () => ({
  GLTFLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn((url, onLoad, onProgress, onError) => {
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

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock user event
export const userEvent = {
  click: jest.fn(),
  type: jest.fn(),
  clear: jest.fn(),
  selectOptions: jest.fn(),
  deselectOptions: jest.fn(),
  upload: jest.fn(),
  clear: jest.fn(),
  tab: jest.fn(),
  hover: jest.fn(),
  unhover: jest.fn(),
  focus: jest.fn(),
  blur: jest.fn(),
  paste: jest.fn(),
  keyboard: jest.fn()
} as unknown as UserEvent
