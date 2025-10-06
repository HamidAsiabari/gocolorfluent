import React from 'react'
import { render, screen } from '@testing-library/react'
import SectionLoadingScreen from '../../../components/Loading/SectionLoadingScreen'

describe('SectionLoadingScreen', () => {
  it('renders when visible', () => {
    render(
      <SectionLoadingScreen 
        isVisible={true} 
        fromSection={1} 
        toSection={4} 
      />
    )
    
    expect(screen.getByText('Navigating to Smart Electronics')).toBeInTheDocument()
    expect(screen.getByText('Jumping 3 sections forward')).toBeInTheDocument()
  })

  it('does not render when not visible', () => {
    const { container } = render(
      <SectionLoadingScreen 
        isVisible={false} 
        fromSection={1} 
        toSection={4} 
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('shows correct direction for backward navigation', () => {
    render(
      <SectionLoadingScreen 
        isVisible={true} 
        fromSection={5} 
        toSection={2} 
      />
    )
    
    expect(screen.getByText('Navigating to Advanced Detection Systems')).toBeInTheDocument()
    expect(screen.getByText('Jumping 3 sections backward')).toBeInTheDocument()
  })

  it('shows single section movement correctly', () => {
    render(
      <SectionLoadingScreen 
        isVisible={true} 
        fromSection={3} 
        toSection={4} 
      />
    )
    
    expect(screen.getByText('Navigating to Smart Electronics')).toBeInTheDocument()
    expect(screen.getByText('Moving forward one section')).toBeInTheDocument()
  })

  it('shows backward single section movement correctly', () => {
    render(
      <SectionLoadingScreen 
        isVisible={true} 
        fromSection={4} 
        toSection={3} 
      />
    )
    
    expect(screen.getByText('Navigating to Precision Mechanics')).toBeInTheDocument()
    expect(screen.getByText('Moving backward one section')).toBeInTheDocument()
  })

  it('shows Technical Specifications for section 7', () => {
    render(
      <SectionLoadingScreen 
        isVisible={true} 
        fromSection={1} 
        toSection={7} 
      />
    )
    
    expect(screen.getByText('Navigating to Technical Specifications')).toBeInTheDocument()
    expect(screen.getByText('Jumping 6 sections forward')).toBeInTheDocument()
  })
})
