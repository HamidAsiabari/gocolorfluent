'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'

export default function UserInterface() {
  return (
    <CollapsibleSection title="🎛️ User Interface" defaultExpanded={false}>
      <div className="space-y-1">
        <CollapsibleSection title="Knobs" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Drain Button Actuator" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Handle Up Cover" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
      </div>
    </CollapsibleSection>
  )
}
