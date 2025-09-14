'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface SupportGuideComponentsProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function SupportGuideComponents({
  componentControls,
  onComponentControlsChange
}: SupportGuideComponentsProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🛠️ Support & Guide Components" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Hair Guide Support"
          icon="👤"
          color="text-blue-400"
          transform={componentControls.hairGuideSupport}
          onTransformChange={(transform) => updateComponent('hairGuideSupport', transform)}
        />
        
        <ComponentControl
          title="SKQYAF Components"
          icon="🔧"
          color="text-green-400"
          transform={componentControls.skqyafComponents}
          onTransformChange={(transform) => updateComponent('skqyafComponents', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
