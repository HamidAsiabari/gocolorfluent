'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import menuConfig from '../../app/config/menu.json'

interface MenuItem {
  id: string
  label: string
  path: string
  isActive: boolean
}

interface MenuProps {
  variant?: 'mobile' | 'desktop' | 'header'
  onItemClick?: () => void
}

export default function Menu({ variant = 'desktop', onItemClick }: MenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuConfig.menuItems)

  // Update active state based on current path
  useEffect(() => {
    setMenuItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        isActive: pathname === item.path
      }))
    )
  }, [pathname])

  const handleNavigation = (path: string) => {
    if (onItemClick) {
      onItemClick()
    }
    
    // If navigating to home page from another page, reload the page to show loading screen
    if (path === '/' && pathname !== '/') {
      window.location.href = '/'
      return
    }
    
    router.push(path)
  }

  const getItemClasses = (item: MenuItem, baseClasses: string) => {
    const activeClasses = item.isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
    return `${baseClasses} ${activeClasses} transition-colors`
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-4 sm:space-y-6">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`block text-xl sm:text-2xl cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-${index + 1} py-3 px-6 rounded-lg hover:bg-white/10 w-full text-center font-medium select-none ${getItemClasses(item, '')}`}
            style={{ pointerEvents: 'auto' }}
          >
            {item.label}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'header') {
    return (
      <nav className="hidden md:flex space-x-8 items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`${getItemClasses(item, '')} cursor-pointer hover:underline px-3 py-2 rounded-md hover:bg-white/5 transition-all duration-200 font-medium select-none`}
            style={{ pointerEvents: 'auto' }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    )
  }

  // Desktop variant (for full-screen menu)
  return (
    <div className="space-y-4 sm:space-y-6">
      {menuItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.path)}
          className={`block text-xl sm:text-2xl cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-${index + 1} py-3 px-6 rounded-lg hover:bg-white/10 w-full text-center font-medium select-none ${getItemClasses(item, '')}`}
          style={{ pointerEvents: 'auto' }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
