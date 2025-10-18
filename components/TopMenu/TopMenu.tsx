'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  label: string
  href: string
  isActive: boolean
}

interface MenuConfig {
  logo: {
    src: string
    alt: string
    href: string
  }
  menuItems: MenuItem[]
}

const TopMenu = memo(function TopMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null)

  useEffect(() => {
    // Load menu configuration
    fetch('/config/top-menu.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((config: MenuConfig) => {
        setMenuConfig(config)
      })
      .catch(error => {
        // Only log error in development mode
        if (process.env.NODE_ENV === 'development') {
        }
        // Fallback config in case of error
        setMenuConfig({
          logo: {
            src: "/Color-fluent-Logo-2.png",
            alt: "Color Fluent Logo",
            href: "/"
          },
          menuItems: [
            { id: "home", label: "Home", href: "/", isActive: false },
            { id: "application", label: "Application", href: "/application", isActive: false },
            { id: "history", label: "History", href: "/history", isActive: false },
            { id: "shop", label: "Shop", href: "/shop", isActive: false },
            { id: "about", label: "About Us", href: "/about", isActive: false },
            { id: "contact", label: "Contact Us", href: "/contact", isActive: false },
          ]
        })
      })
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Update active state based on current path
  useEffect(() => {
    if (menuConfig) {
      setMenuConfig(prevConfig => {
        if (!prevConfig) return prevConfig
        const updatedItems = prevConfig.menuItems.map(item => ({
          ...item,
          isActive: pathname === item.href
        }))
        
        return {
          ...prevConfig,
          menuItems: updatedItems
        }
      })
    }
  }, [pathname]) // Removed menuConfig from dependency array to prevent infinite loop

  const handleNavigation = async (href: string, itemId: string) => {
    // Prevent multiple clicks
    if (loadingItemId) return
    
    // Set loading state for the clicked item
    setLoadingItemId(itemId)
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Navigate to the page
      router.push(href)
      
      // Close menu after navigation
      closeMenu()
    } finally {
      // Clear loading state
      setLoadingItemId(null)
    }
  }

  const getItemClasses = (item: MenuItem, baseClasses: string) => {
    const activeClasses = item.isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
    return `${baseClasses} ${activeClasses} transition-colors`
  }

  if (!menuConfig) {
    return (
      <header className="absolute top-0 left-0 right-0 z-[100]">
        <div className="w-full">
          <div className="flex justify-between items-center py-6 px-4 sm:px-6 lg:px-8">
            <div className="w-[120px] h-[120px] bg-gray-600 rounded animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-600 rounded animate-pulse mt-[15px]"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Top Menu Bar */}
      <header className="absolute top-0 left-0 right-0 z-[100]">
        <div className="w-full">
          <div className="flex justify-between items-center py-6 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href={menuConfig.logo.href} className="flex-shrink-0">
              <div className="relative w-[120px] h-[120px]">
                <Image
                  src={menuConfig.logo.src}
                  alt={menuConfig.logo.alt}
                  fill
                  className="object-contain relative z-10"
                  sizes="120px"
                  priority
                />
                {/* White glowing shadow */}
                <div className="absolute inset-0 bg-white/6 blur-lg rounded-lg -z-10 scale-110"></div>
                <div className="absolute inset-0 bg-white/3 blur-md rounded-lg -z-10 scale-105"></div>
              </div>
            </Link>

            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2 mt-[15px]"
              aria-label="Open menu"
            >
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm"
          onClick={closeMenu}
        >
          {/* Close Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={closeMenu}
              className="text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2"
              aria-label="Close menu"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div 
            className="flex flex-col items-center justify-center min-h-screen px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Logo in Menu */}
              <Link 
                href={menuConfig.logo.href} 
                onClick={closeMenu}
                className="block mb-6"
              >
                <div className="relative w-[676px] h-[216px] mx-auto">
                  <Image
                    src={menuConfig.logo.src}
                    alt={menuConfig.logo.alt}
                    fill
                    className="object-contain relative z-10"
                    sizes="676px"
                    priority
                  />
                  {/* White glowing shadow */}
                  <div className="absolute inset-0 bg-white/6 blur-lg rounded-lg -z-10 scale-110"></div>
                  <div className="absolute inset-0 bg-white/3 blur-md rounded-lg -z-10 scale-105"></div>
                </div>
              </Link>

              {/* Menu Items */}
              <nav className="space-y-2 sm:space-y-3">
                {menuConfig.menuItems.map((item, index) => {
                  const isLoading = loadingItemId === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.href, item.id)}
                      disabled={isLoading}
                      className={`block text-xl sm:text-2xl cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-${index + 1} py-2 px-6 rounded-lg hover:bg-white/10 w-full text-center font-medium select-none ${getItemClasses(item, '')} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        item.label
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default TopMenu
