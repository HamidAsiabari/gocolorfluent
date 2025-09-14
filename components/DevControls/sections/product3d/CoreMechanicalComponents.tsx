'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'

export default function CoreMechanicalComponents() {
  return (
    <CollapsibleSection title="⚙️ Core Mechanical Components" defaultExpanded={false}>
      <div className="space-y-1">
        <CollapsibleSection title="MicroGearmotor" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Gear Motor PCB" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Motor Holder" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Holder Support" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Coupling" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="M5 Screw" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
      </div>
    </CollapsibleSection>
  )
}
