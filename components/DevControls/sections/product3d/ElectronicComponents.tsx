'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface ElectronicComponentsProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function ElectronicComponents({
  componentControls,
  onComponentControlsChange
}: ElectronicComponentsProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🔌 Electronic Components" icon="🔌" color="text-purple-400" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Color Sensor PCB"
          icon="🎨"
          color="text-blue-400"
          transform={componentControls.colorSensorPCB}
          onTransformChange={(transform) => updateComponent('colorSensorPCB', transform)}
        />
        
        <ComponentControl
          title="STS8DN3LLH5"
          icon="🔬"
          color="text-green-400"
          transform={componentControls.sts8dn3llh5}
          onTransformChange={(transform) => updateComponent('sts8dn3llh5', transform)}
        />
        
        <ComponentControl
          title="OLED Display"
          icon="📺"
          color="text-yellow-400"
          transform={componentControls.oledDisplay}
          onTransformChange={(transform) => updateComponent('oledDisplay', transform)}
        />
        
        <ComponentControl
          title="Detector Switch"
          icon="🔍"
          color="text-orange-400"
          transform={componentControls.detectorSwitch}
          onTransformChange={(transform) => updateComponent('detectorSwitch', transform)}
        />
        
        <ComponentControl
          title="Slide Switch"
          icon="🎚️"
          color="text-purple-400"
          transform={componentControls.slideSwitch}
          onTransformChange={(transform) => updateComponent('slideSwitch', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
