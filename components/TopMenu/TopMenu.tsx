'use client'

import { useState, useEffect } from 'react'
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

export default function TopMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
        console.error('Error loading menu config:', error)
        // Fallback config in case of error
        setMenuConfig({
          logo: {
            src: "/Color-fluent-Logo-2.png",
            alt: "Color Fluent Logo",
            href: "/"
          },
          menuItems: [
            { id: "home", label: "Home", href: "/", isActive: false },
            { id: "catalog", label: "Catalog", href: "/catalog", isActive: false },
            { id: "about", label: "About Us", href: "/about", isActive: false },
            { id: "contact", label: "Contact Us", href: "/contact", isActive: false },
            { id: "blog", label: "Blog", href: "/blog", isActive: false },
            { id: "faq", label: "FAQ", href: "/faq", isActive: false }
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
  }, [pathname, menuConfig])

  const handleNavigation = (href: string) => {
    closeMenu()
    router.push(href)
  }

  const getItemClasses = (item: MenuItem, baseClasses: string) => {
    const activeClasses = item.isActive ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
    return `${baseClasses} ${activeClasses} transition-colors`
  }

  if (!menuConfig) {
    return (
      <header className="absolute top-0 left-0 right-0 z-[100]">
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center py-6">
            <div className="w-[120px] h-[120px] bg-gray-600 rounded animate-pulse pl-[5%]"></div>
            <div className="w-10 h-10 bg-gray-600 rounded animate-pulse pr-[5%] mt-[15px]"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      {/* Top Menu Bar */}
      <header className="absolute top-0 left-0 right-0 z-[100]">
        <div className="w-full px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <Link href={menuConfig.logo.href} className="flex-shrink-0 pl-[5%]">
              <Image
                src={menuConfig.logo.src}
                alt={menuConfig.logo.alt}
                width={120}
                height={120}
                className="h-[120px] w-auto"
                priority
              />
            </Link>

            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg p-2 pr-[5%] mt-[15px]"
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
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm">
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
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center">
              {/* Logo in Menu */}
              <Link 
                href={menuConfig.logo.href} 
                onClick={closeMenu}
                className="block mb-12"
              >
                <Image
                  src={menuConfig.logo.src}
                  alt={menuConfig.logo.alt}
                  width={676}
                  height={203}
                  className="h-[216px] w-auto mx-auto"
                  priority
                />
              </Link>

              {/* Menu Items */}
              <nav className="space-y-4 sm:space-y-6">
                {menuConfig.menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.href)}
                    className={`block text-xl sm:text-2xl cursor-pointer transition-all duration-300 hover:scale-105 menu-item-animate menu-item-${index + 1} py-3 px-6 rounded-lg hover:bg-white/10 w-full text-center font-medium select-none ${getItemClasses(item, '')}`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
