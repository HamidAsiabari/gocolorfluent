'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface BrushApplicationSystemProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function BrushApplicationSystem({
  componentControls,
  onComponentControlsChange
}: BrushApplicationSystemProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🖌️ Brush & Application System" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Moving Plate"
          icon="📋"
          color="text-blue-400"
          transform={componentControls.movingPlate}
          onTransformChange={(transform) => updateComponent('movingPlate', transform)}
        />
        
        <ComponentControl
          title="Silicon Support"
          icon="🔲"
          color="text-green-400"
          transform={componentControls.siliconSupport}
          onTransformChange={(transform) => updateComponent('siliconSupport', transform)}
        />
        
        <ComponentControl
          title="Nozzle"
          icon="💧"
          color="text-cyan-400"
          transform={componentControls.nozzle}
          onTransformChange={(transform) => updateComponent('nozzle', transform)}
        />
        
        <ComponentControl
          title="Nozzle Blinder"
          icon="🛡️"
          color="text-red-400"
          transform={componentControls.nozzleBlinder}
          onTransformChange={(transform) => updateComponent('nozzleBlinder', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
