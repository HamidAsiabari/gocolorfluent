'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { ComponentControls, CategoryVisibility, categoryComponentMap } from '../../../DevControls/sections/product3d/types'

interface ComponentControlSyncProps {
  componentRefs: React.MutableRefObject<Map<string, THREE.Object3D>>
  componentControls: ComponentControls
  categoryVisibility: CategoryVisibility
  requestRender: () => void
}

/**
 * Syncs component controls and category visibility to the 3D model
 * This is the critical piece that makes DevControls work with the 3D scene
 */
export function ComponentControlSync({
  componentRefs,
  componentControls,
  categoryVisibility,
  requestRender
}: ComponentControlSyncProps) {
  
  useEffect(() => {
    if (!componentRefs.current || componentRefs.current.size === 0) {
      return
    }

    // Apply component transformations and visibility
    Object.entries(componentControls).forEach(([componentKey, transform]) => {
      const component = componentRefs.current.get(componentKey)
      
      if (component) {
        // Check if this is default transform
        const isDefaultTransform = 
          transform.position.x === 0 && transform.position.y === 0 && transform.position.z === 0 &&
          transform.rotation.x === 0 && transform.rotation.y === 0 && transform.rotation.z === 0 &&
          transform.scale.x === 1 && transform.scale.y === 1 && transform.scale.z === 1

        // Apply visibility - check category visibility too
        const categoryKey = Object.keys(categoryComponentMap).find(cat => 
          categoryComponentMap[cat as keyof CategoryVisibility].includes(componentKey as keyof ComponentControls)
        ) as keyof CategoryVisibility

        const isCategoryVisible = categoryKey ? categoryVisibility[categoryKey] : true
        const finalVisibility = transform.visible && isCategoryVisible

        // Apply visibility to component and all its children
        component.visible = finalVisibility
        component.traverse((child) => {
          child.visible = finalVisibility
        })

        // Apply transform only if not default
        if (!isDefaultTransform) {
          component.position.set(
            transform.position.x,
            transform.position.y,
            transform.position.z
          )
          component.rotation.set(
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z
          )
          component.scale.set(
            transform.scale.x,
            transform.scale.y,
            transform.scale.z
          )
        }
      }
    })

    requestRender()
  }, [componentControls, categoryVisibility, requestRender])

  return null
}

