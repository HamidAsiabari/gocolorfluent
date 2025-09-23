'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface UserInterfaceProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function UserInterface({
  componentControls,
  onComponentControlsChange
}: UserInterfaceProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🎛️ User Interface" icon="🎛️" color="text-indigo-400" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Knobs"
          icon="🎛️"
          color="text-blue-400"
          transform={componentControls.knobs}
          onTransformChange={(transform) => updateComponent('knobs', transform)}
        />
        
        <ComponentControl
          title="Drain Button Actuator"
          icon="🔘"
          color="text-red-400"
          transform={componentControls.drainButtonActuator}
          onTransformChange={(transform) => updateComponent('drainButtonActuator', transform)}
        />
        
        <ComponentControl
          title="Handle Up Cover"
          icon="🤏"
          color="text-green-400"
          transform={componentControls.handleUpCover}
          onTransformChange={(transform) => updateComponent('handleUpCover', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
