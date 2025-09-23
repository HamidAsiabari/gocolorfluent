'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface MainHousingStructureProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function MainHousingStructure({
  componentControls,
  onComponentControlsChange
}: MainHousingStructureProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🏠 Main Housing & Structure" icon="🏠" color="text-orange-400" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Upper Side Main Holder"
          icon="🏗️"
          color="text-blue-400"
          transform={componentControls.upperSideMainHolder}
          onTransformChange={(transform) => updateComponent('upperSideMainHolder', transform)}
        />
        
        <ComponentControl
          title="Lower Side Main"
          icon="🏢"
          color="text-green-400"
          transform={componentControls.lowerSideMain}
          onTransformChange={(transform) => updateComponent('lowerSideMain', transform)}
        />
        
        <ComponentControl
          title="Upper Cover"
          icon="🔝"
          color="text-yellow-400"
          transform={componentControls.upperCover}
          onTransformChange={(transform) => updateComponent('upperCover', transform)}
        />
        
        <ComponentControl
          title="Loading Material Cover"
          icon="📦"
          color="text-orange-400"
          transform={componentControls.loadingMaterialCover}
          onTransformChange={(transform) => updateComponent('loadingMaterialCover', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
