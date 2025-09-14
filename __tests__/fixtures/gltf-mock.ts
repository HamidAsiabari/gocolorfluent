// Mock GLTF data for testing

export const mockGLTFData = {
  scene: {
    name: 'Color_Brush_assembly_V1_1',
    children: [
      {
        name: 'Brush_Head',
        type: 'Mesh',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        userData: {},
        isMesh: true,
        isGroup: false,
        isBone: false,
        isObject3D: true
      },
      {
        name: 'Brush_Handle',
        type: 'Mesh',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        userData: {},
        isMesh: true,
        isGroup: false,
        isBone: false,
        isObject3D: true
      }
    ],
    traverse: jest.fn((callback) => {
      // Mock traverse function
      callback(mockGLTFData.scene)
      mockGLTFData.scene.children.forEach(child => callback(child))
    }),
    scale: { set: jest.fn() },
    position: { set: jest.fn() },
    rotation: { set: jest.fn() }
  },
  animations: [
    {
      name: 'Brush_Rotation',
      duration: 2.0,
      tracks: [
        {
          name: 'Brush_Head.rotation[x]',
          type: 'VectorKeyframeTrack',
          times: [0, 1, 2],
          values: [0, Math.PI, 0]
        }
      ]
    }
  ]
}

export const mockGLTFLoaderSuccess = jest.fn((url, onLoad, onProgress, onError) => {
  if (onLoad) {
    setTimeout(() => {
      onLoad(mockGLTFData)
    }, 100)
  }
})

export const mockGLTFLoaderError = jest.fn((url, onLoad, onProgress, onError) => {
  if (onError) {
    setTimeout(() => {
      onError(new Error('Failed to load GLTF model'))
    }, 100)
  }
})

export const mockGLTFLoaderProgress = jest.fn((url, onLoad, onProgress, onError) => {
  if (onProgress) {
    setTimeout(() => {
      onProgress({ loaded: 50, total: 100 })
    }, 50)
  }
  if (onLoad) {
    setTimeout(() => {
      onLoad(mockGLTFData)
    }, 100)
  }
})
