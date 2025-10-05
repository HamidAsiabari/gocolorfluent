'use client'

import { useState } from 'react'
import Menu from '../Menu'

interface MobileMenuProps {
  className?: string
}

export default function MobileMenu({ className = '' }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`text-white text-xl sm:text-2xl font-bold hover:text-gray-300 transition-all duration-200 p-2 sm:p-1 hover:scale-105 ${className}`}
        style={{ 
          background: 'rgba(0,0,0,0.3)', 
          border: 'none',
          outline: 'none',
          borderRadius: '8px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ☰
      </button>

      {/* Full Screen Menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center menu-fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="text-center space-y-6 sm:space-y-8 px-4 sm:px-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 menu-title-animate">
              Menu
            </h2>
            <Menu variant="mobile" onItemClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
