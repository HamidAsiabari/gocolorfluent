'use client'

import React, { useState } from 'react'

interface CollapsibleSectionProps {
  title: string
  icon: string
  color: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export default function CollapsibleSection({
  title,
  icon,
  color,
  children,
  defaultExpanded = false
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="bg-gray-800/50 rounded">
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className={`text-xs font-medium ${color} flex items-center gap-1`}>
          <span>{icon}</span>
          <span>{title}</span>
        </h4>
        <button
          className="text-gray-400 hover:text-white text-xs p-1 hover:bg-gray-600 rounded transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      {isExpanded && (
        <div className="px-2 pb-2">
          {children}
        </div>
      )}
    </div>
  )
}
