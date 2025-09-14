'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface LEDLightingProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function LEDLighting({
  componentControls,
  onComponentControlsChange
}: LEDLightingProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="💡 LED & Lighting" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Everlight LEDs"
          icon="💡"
          color="text-yellow-400"
          transform={componentControls.everlightLEDs}
          onTransformChange={(transform) => updateComponent('everlightLEDs', transform)}
        />
        
        <ComponentControl
          title="Sensor Guide Light"
          icon="🔦"
          color="text-cyan-400"
          transform={componentControls.sensorGuideLight}
          onTransformChange={(transform) => updateComponent('sensorGuideLight', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
