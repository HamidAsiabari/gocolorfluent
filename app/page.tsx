'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x1a1a1a)
    mountRef.current.appendChild(renderer.domElement)

    // Add a simple cube
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="relative z-10 p-6">
        <h1 className="text-4xl font-bold text-white text-center">
          GoColorFluent
        </h1>
        <p className="text-gray-300 text-center mt-2">
          Built with Next.js, Tailwind CSS, and Three.js
        </p>
      </header>

      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to your new project!
          </h2>
          <p className="text-gray-300 max-w-md mx-auto">
            This is your starting point. The rotating cube above is rendered with Three.js, 
            and the styling is powered by Tailwind CSS.
          </p>
        </div>
      </div>
    </main>
  )
}
