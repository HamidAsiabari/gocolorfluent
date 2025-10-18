'use client'

import React, { useState, useEffect } from 'react'

interface DebugPanelProps {
  isVisible: boolean
  onToggle: () => void
}

export default function DebugPanel({ isVisible, onToggle }: DebugPanelProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'state' | 'logs' | 'performance'>('state')
  const [autoScroll, setAutoScroll] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isVisible || !isMounted) return null

  return (
    <div className="fixed top-0 right-0 z-[10000] w-80 h-full bg-black/80 backdrop-blur-sm text-white p-4 overflow-y-auto text-xs font-mono">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-400">🐛 Debug Panel</h3>
        <button onClick={onToggle} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          <button
            onClick={() => setSelectedTab('state')}
            className={`px-2 py-1 rounded text-xs ${
              selectedTab === 'state' ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            State
          </button>
          <button
            onClick={() => setSelectedTab('logs')}
            className={`px-2 py-1 rounded text-xs ${
              selectedTab === 'logs' ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`px-2 py-1 rounded text-xs ${
              selectedTab === 'performance' ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {selectedTab === 'state' && (
        <div>
          <h4 className="font-semibold text-blue-300 mb-2">3D State</h4>
          <div className="bg-gray-900 p-2 rounded mb-4">
            <p className="text-gray-300">Loading...</p>
            <p className="text-gray-300">Debug panel simplified to prevent infinite loops</p>
          </div>
        </div>
      )}

      {selectedTab === 'logs' && (
        <div>
          <h4 className="font-semibold text-red-300 mb-2">Logs</h4>
          <div className="bg-gray-900 p-2 rounded h-48 overflow-y-auto">
            <p className="text-gray-300">Logs disabled to prevent infinite loops</p>
          </div>
        </div>
      )}

      {selectedTab === 'performance' && (
        <div>
          <h4 className="font-semibold text-yellow-300 mb-2">Performance</h4>
          <div className="bg-gray-900 p-2 rounded">
            <p className="text-gray-300">Performance monitoring disabled to prevent infinite loops</p>
          </div>
        </div>
      )}
    </div>
  )
}