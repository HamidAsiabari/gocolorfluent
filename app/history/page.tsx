'use client'

import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'
import Timeline from '../../components/Timeline'

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 internal-page relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="py-8 sm:py-12" style={{ paddingTop: '190px' }}>
        {/* Enhanced Hero Section */}
        <div className="text-center mb-24 relative overflow-hidden">
          {/* Subtle background elements without animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-purple-500/3 to-green-500/3 blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            {/* Enhanced icon with subtle animation */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-full mb-8 shadow-2xl hover:scale-110 transition-all duration-500 ease-out group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:rotate-12 transition-transform duration-500">
                <span className="text-4xl">📈</span>
              </div>
            </div>
            
            {/* Enhanced title with better typography */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent hover:from-blue-300 hover:via-purple-300 hover:to-green-300 transition-all duration-500">
                Our Journey
              </span>
            </h1>
            
            {/* Enhanced subtitle */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
                Innovation Through Time
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
                From a bold vision to a revolutionary color technology company. 
                Discover the key moments that shaped Color Fluent's story and our commitment to transforming hair coloring experiences.
              </p>
            </div>
            
            {/* Enhanced decorative elements */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-500 to-purple-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 via-green-500 to-transparent rounded-full"></div>
            </div>
            
            {/* Enhanced Stats section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-400/30 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-blue-600/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">4+</div>
                  <div className="text-gray-300 font-medium">Years of Innovation</div>
                  <div className="text-sm text-gray-400 mt-2">Since 2021</div>
                </div>
              </div>
              <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-400/30 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-purple-600/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">15+</div>
                  <div className="text-gray-300 font-medium">Major Milestones</div>
                  <div className="text-sm text-gray-400 mt-2">Key Achievements</div>
                </div>
              </div>
              <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-green-400/30 hover:bg-gradient-to-br hover:from-green-500/10 hover:to-green-600/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">2</div>
                  <div className="text-gray-300 font-medium">Product Models</div>
                  <div className="text-sm text-gray-400 mt-2">Professional & Home</div>
                </div>
              </div>
            </div>
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
