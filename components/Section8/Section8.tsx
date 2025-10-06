'use client'

import { useEffect, useState, memo } from 'react'

interface Section8Props {
  isClient: boolean
  currentSection: number
  isTransitioning: boolean
  scrollDirection: 'up' | 'down'
  transitionProgress: number
}

const Section8 = memo(function Section8({
  isClient,
  currentSection,
  isTransitioning,
  scrollDirection,
  transitionProgress
}: Section8Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation when section becomes active
    if (currentSection === 8) {
      const timer = setTimeout(() => setIsVisible(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [currentSection])

  return (
    <section 
      className="flex items-start md:items-center justify-center md:justify-center justify-start h-screen w-screen px-4 sm:px-6 absolute inset-0 pt-4 md:pt-0"
      style={{
        transform: `translateY(${isClient ? (8 - currentSection - (isTransitioning ? (scrollDirection === 'down' ? transitionProgress : -transitionProgress) : 0)) * window.innerHeight : 0}px)`,
        zIndex: 10
      }}
    >
      {/* Background Elements */}
      <div className="section-background absolute inset-0 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-blue-900/10 to-purple-900/20" />
        
        {/* Contact-inspired geometric shapes */}
        <div className="absolute top-16 right-16 w-40 h-40 border-2 border-indigo-400/20 rounded-lg rotate-12 animate-pulse" />
        <div className="absolute bottom-24 left-16 w-32 h-32 border-2 border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '26s' }} />
        <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-xl" />
        
        {/* Contact patterns */}
        <div className="absolute top-1/2 right-1/4 w-20 h-20 border-2 border-indigo-400/30 rounded-full animate-spin" style={{ animationDuration: '21s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border-2 border-blue-400/30 rounded-full animate-spin" style={{ animationDuration: '22s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>


      {/* Main Content */}
      <div className="section-content relative z-10 max-w-5xl mx-auto text-center" style={{ paddingTop: '5%' }}>
        <div className="space-y-8">
          
          {/* Section Title */}
          <div className={`space-y-2 lg:space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 leading-tight">
              Contact Us
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 leading-tight">
              Today
            </h2>
          </div>

          {/* Description */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Ready to experience professional-grade color technology? Get in touch with our team to learn more about Color Fluent solutions.
            </p>
          </div>

          {/* Contact Methods */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {/* Email */}
              <div className="group bg-black/30 backdrop-blur-sm rounded-xl border border-indigo-500/20 p-4 sm:p-6 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-400 mb-3 text-sm">Get detailed information</p>
                <a href="mailto:info@gocolorfluent.com" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm">
                  info@gocolorfluent.com
                </a>
              </div>

              {/* Phone */}
              <div className="group bg-black/30 backdrop-blur-sm rounded-xl border border-blue-500/20 p-4 sm:p-6 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-400 mb-3 text-sm">Speak with our experts</p>
                <a href="tel:+14378822429" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-sm">
                  +1 (437) 882-2429
                </a>
              </div>

              {/* Schedule Demo */}
              <div className="group bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 sm:p-6 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Schedule Demo</h3>
                <p className="text-gray-400 mb-3 text-sm">See it in action</p>
                <a href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm">
                  Book a Demo
                </a>
              </div>
            </div>
          </div>


          {/* Social Links */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-center space-x-6">
              <a href="https://www.facebook.com/share/1DvScbYDzN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/colorfluent.smarthairbrush?igsh=Zmg4ZXRrYWtjOTFu" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500/20 hover:bg-blue-500/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/color-fluent/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-500/20 hover:bg-purple-500/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
})

export default Section8
