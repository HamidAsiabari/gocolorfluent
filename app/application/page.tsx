'use client'

import { useEffect, useState } from 'react'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function Application() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const features = [
    {
      title: "Smart Color Selection",
      description: "AI-powered color matching that understands your preferences and suggests perfect color combinations for any project.",
      icon: "🎨",
      details: [
        "Advanced color palette generator",
        "Real-time color analysis",
        "Personalized recommendations",
        "Color harmony suggestions"
      ]
    },
    {
      title: "Mixing Instructions",
      description: "Step-by-step guidance for creating the exact colors you need with precise measurements and techniques.",
      icon: "⚗️",
      details: [
        "Precise mixing ratios",
        "Step-by-step tutorials",
        "Video demonstrations",
        "Color correction tips"
      ]
    },
    {
      title: "Device Settings",
      description: "Complete control over your Color Fluent device with intuitive settings and calibration options.",
      icon: "⚙️",
      details: [
        "Device calibration",
        "Custom presets",
        "Performance optimization",
        "Firmware updates"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black internal-page">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '120px' }}>
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.1),transparent_50%)]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">
                  Smart Mobile
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                  Application
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                Your intelligent companion for perfect color selection, precise mixing instructions, and seamless device control
              </p>

              {/* Mobile App Mockup */}
              <div className="relative mx-auto w-80 h-96 mb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[2.5rem] relative overflow-hidden">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">🎨</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Color Fluent</h3>
                        <p className="text-sm text-gray-300">Smart Color Assistant</p>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-12 right-12 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-16 left-12 w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-xl scale-110 -z-10"></div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10">Download for iOS</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>
                
                <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <span className="relative z-10">Download for Android</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Everything you need to master color selection and device control in one intelligent application
              </p>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Feature Navigation */}
              <div className="lg:w-1/3">
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                        activeFeature === index
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
                          : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl">{feature.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Content */}
              <div className="lg:w-2/3">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-4xl">{features[activeFeature].icon}</span>
                    <h3 className="text-2xl font-bold text-white">
                      {features[activeFeature].title}
                    </h3>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-8">
                    {features[activeFeature].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features[activeFeature].details.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-xl">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-200">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Screenshots Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the intuitive interface and powerful features that make color selection effortless
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Screenshot 1 */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-96 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Color Selection</h3>
                      <p className="text-sm text-center">Intuitive color picker with AI recommendations</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl scale-110 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Screenshot 2 */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-96 bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">⚗️</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Mixing Guide</h3>
                      <p className="text-sm text-center">Step-by-step mixing instructions</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl blur-xl scale-110 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Screenshot 3 */}
              <div className="group relative">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-2 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  <div className="w-full h-96 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Device Settings</h3>
                      <p className="text-sm text-center">Complete device control and calibration</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-xl scale-110 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Get Started Today
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Download the Color Fluent mobile app and transform your color selection experience
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center space-x-3">
                  <span>📱</span>
                  <span>Download for iOS</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
              
              <button className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center space-x-3">
                  <span>🤖</span>
                  <span>Download for Android</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white p-8 rounded-2xl inline-block shadow-2xl">
              <div className="w-48 h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-4xl">📱</span>
                  </div>
                  <p className="text-sm font-medium">Scan to Download</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
