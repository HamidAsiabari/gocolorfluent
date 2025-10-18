'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'

interface SectionVisitState {
  [sectionNumber: number]: {
    hasVisited: boolean
    hasTypingAnimated: boolean
  }
}

interface SectionVisitContextType {
  sectionStates: SectionVisitState
  markSectionVisited: (sectionNumber: number) => void
  markTypingAnimated: (sectionNumber: number) => void
  hasSectionBeenVisited: (sectionNumber: number) => boolean
  hasTypingAnimated: (sectionNumber: number) => boolean
}

const SectionVisitContext = createContext<SectionVisitContextType | undefined>(undefined)

export function SectionVisitProvider({ children }: { children: ReactNode }) {
  // Always start with empty state - no persistence
  const [sectionStates, setSectionStates] = useState<SectionVisitState>({})

  const markSectionVisited = useCallback((sectionNumber: number) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionNumber]: {
        ...prev[sectionNumber],
        hasVisited: true
      }
    }))
  }, [])

  const markTypingAnimated = useCallback((sectionNumber: number) => {
    setSectionStates(prev => ({
      ...prev,
      [sectionNumber]: {
        ...prev[sectionNumber],
        hasTypingAnimated: true
      }
    }))
  }, [])

  const hasSectionBeenVisited = useCallback((sectionNumber: number) => {
    return sectionStates[sectionNumber]?.hasVisited || false
  }, [sectionStates])

  const hasTypingAnimated = useCallback((sectionNumber: number) => {
    const result = sectionStates[sectionNumber]?.hasTypingAnimated || false
    return result
  }, [sectionStates])

  const value = useMemo(() => ({
    sectionStates,
    markSectionVisited,
    markTypingAnimated,
    hasSectionBeenVisited,
    hasTypingAnimated
  }), [sectionStates, markSectionVisited, markTypingAnimated, hasSectionBeenVisited, hasTypingAnimated])

  return (
    <SectionVisitContext.Provider value={value}>
      {children}
    </SectionVisitContext.Provider>
  )
}

export function useSectionVisit() {
  const context = useContext(SectionVisitContext)
  if (context === undefined) {
    throw new Error('useSectionVisit must be used within a SectionVisitProvider')
  }
  return context
}
