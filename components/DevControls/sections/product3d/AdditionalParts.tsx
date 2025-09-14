'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'

export default function AdditionalParts() {
  return (
    <CollapsibleSection title="🔧 Additional Parts" defaultExpanded={false}>
      <div className="space-y-1">
        <CollapsibleSection title="Product Components" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Generic Parts" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="Imported Components" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
      </div>
    </CollapsibleSection>
  )
}
