'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface CoreMechanicalComponentsProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function CoreMechanicalComponents({
  componentControls,
  onComponentControlsChange
}: CoreMechanicalComponentsProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="⚙️ Core Mechanical Components" icon="⚙️" color="text-yellow-400" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="MicroGearmotor"
          icon="⚙️"
          color="text-blue-400"
          transform={componentControls.microGearmotor}
          onTransformChange={(transform) => updateComponent('microGearmotor', transform)}
        />
        
        <ComponentControl
          title="Gear Motor PCB"
          icon="🔌"
          color="text-green-400"
          transform={componentControls.gearMotorPCB}
          onTransformChange={(transform) => updateComponent('gearMotorPCB', transform)}
        />
        
        <ComponentControl
          title="Motor Holder"
          icon="🔧"
          color="text-yellow-400"
          transform={componentControls.motorHolder}
          onTransformChange={(transform) => updateComponent('motorHolder', transform)}
        />
        
        <ComponentControl
          title="Holder Support"
          icon="🛠️"
          color="text-orange-400"
          transform={componentControls.holderSupport}
          onTransformChange={(transform) => updateComponent('holderSupport', transform)}
        />
        
        <ComponentControl
          title="Coupling"
          icon="🔗"
          color="text-purple-400"
          transform={componentControls.coupling}
          onTransformChange={(transform) => updateComponent('coupling', transform)}
        />
        
        <ComponentControl
          title="M5 Screw"
          icon="🔩"
          color="text-gray-400"
          transform={componentControls.m5Screw}
          onTransformChange={(transform) => updateComponent('m5Screw', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
