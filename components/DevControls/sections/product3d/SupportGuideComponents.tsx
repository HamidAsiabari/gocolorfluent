'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'

export default function SupportGuideComponents() {
  return (
    <CollapsibleSection title="🛠️ Support & Guide Components" defaultExpanded={false}>
      <div className="space-y-1">
        <CollapsibleSection title="Hair Guide Support" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
        
        <CollapsibleSection title="SKQYAF Components" defaultExpanded={false}>
          <div className="text-xs text-gray-400 p-2">
            {/* Content will be added later */}
          </div>
        </CollapsibleSection>
      </div>
    </CollapsibleSection>
  )
}
