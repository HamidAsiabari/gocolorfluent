'use client'

import React from 'react'
import CollapsibleSection from '../CollapsibleSection'
import ComponentControl from './ComponentControl'
import { ComponentControls, ComponentTransform } from './types'

interface AdditionalPartsProps {
  componentControls: ComponentControls
  onComponentControlsChange: (controls: ComponentControls) => void
}

export default function AdditionalParts({
  componentControls,
  onComponentControlsChange
}: AdditionalPartsProps) {
  const updateComponent = (componentName: keyof ComponentControls, transform: ComponentTransform) => {
    onComponentControlsChange({
      ...componentControls,
      [componentName]: transform
    })
  }

  return (
    <CollapsibleSection title="🔧 Additional Parts" icon="🔧" color="text-blue-400" defaultExpanded={false}>
      <div className="space-y-1">
        <ComponentControl
          title="Product Components"
          icon="📦"
          color="text-blue-400"
          transform={componentControls.productComponents}
          onTransformChange={(transform) => updateComponent('productComponents', transform)}
        />
        
        <ComponentControl
          title="Generic Parts"
          icon="🔩"
          color="text-gray-400"
          transform={componentControls.genericParts}
          onTransformChange={(transform) => updateComponent('genericParts', transform)}
        />
        
        <ComponentControl
          title="Imported Components"
          icon="📥"
          color="text-purple-400"
          transform={componentControls.importedComponents}
          onTransformChange={(transform) => updateComponent('importedComponents', transform)}
        />
      </div>
    </CollapsibleSection>
  )
}
