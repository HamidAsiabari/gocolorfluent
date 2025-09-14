'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'

export default function LEDLighting() {
  return (
    <CollapsibleSection title="💡 LED & Lighting" defaultExpanded={false}>
      <div className="space-y-1">
        <CollapsibleSection title="Everlight LEDs" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Sensor Guide Light" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
      </div>
    </CollapsibleSection>
  )
}
