'use client'

import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'
import Timeline from '../../components/Timeline'

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 internal-page">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="py-8 sm:py-12" style={{ paddingTop: '190px' }}>
        {/* Hero Section with enhanced styling */}
        <div className="text-center mb-20 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-8 shadow-2xl">
              <span className="text-4xl">📈</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed">
              From a bold vision to a revolutionary color technology company. 
              Discover the key moments that shaped Color Fluent's story.
            </p>
            
            {/* Decorative line */}
            <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Timeline */}
        <Timeline />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
