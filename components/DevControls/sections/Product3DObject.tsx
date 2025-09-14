'use client'

import React from 'react'
import CollapsibleSection from './CollapsibleSection'
import CoreMechanicalComponents from './product3d/CoreMechanicalComponents'
import BrushApplicationSystem from './product3d/BrushApplicationSystem'
import MainHousingStructure from './product3d/MainHousingStructure'
import ElectronicComponents from './product3d/ElectronicComponents'
import LEDLighting from './product3d/LEDLighting'
import UserInterface from './product3d/UserInterface'
import SupportGuideComponents from './product3d/SupportGuideComponents'
import AdditionalParts from './product3d/AdditionalParts'

export default function Product3DObject() {
  return (
    <CollapsibleSection title="🎨 3D Object of Product" defaultExpanded={false}>
      <div className="space-y-2">
        <CoreMechanicalComponents />
        <BrushApplicationSystem />
        <MainHousingStructure />
        <ElectronicComponents />
        <LEDLighting />
        <UserInterface />
        <SupportGuideComponents />
        <AdditionalParts />
      </div>
    </CollapsibleSection>
  )
}
