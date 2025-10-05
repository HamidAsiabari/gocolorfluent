'use client'

import Link from 'next/link'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function Catalog() {
  const features = [
    'Advanced image and RGB color processing for precise shade matching',
    'Data-driven performance for consistent, salon-quality results',
    'TFT-LCD screen and intuitive control panel for easy operation',
    'Even-flow nozzle system with a built-in vibration feature for flawless color distribution',
    'Tank display and empty-warning alert for uninterrupted coloring',
    'Configurable sound cues to detect color transition zones',
    'Wi-Fi connectivity for full app access and updates',
    'Personalized color guidance and survey-based recommendations'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Color Fluent – The Smart Way to Color Your Hair
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the future of hair coloring with <strong className="text-blue-400">Color Fluent</strong>, the intelligent device that makes at-home coloring effortless, precise, and beautifully even.
          </p>
        </div>

        {/* Main Description */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-8">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
            Designed for total independence, Color Fluent helps you reach every strand — even the back of your head — with professional-level accuracy. Its smart root-detection system identifies and colors only the areas that need touch-ups, saving time and formula.
          </p>
          
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
            Paired with the <strong className="text-blue-400">Color Fluent App</strong>, you're guided through every step — from choosing your perfect shade to following real-time instructions. The app saves your custom settings and color history, so repeating your favorite look is as easy as one tap.
          </p>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            Behind its sleek, lightweight design lies powerful technology:
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">Advanced Technology Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-4 sm:p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    <strong className="text-blue-400">Advanced image and RGB color processing</strong> for precise shade matching
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6 sm:p-8 mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Technical Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">12V DC 2A</div>
              <div className="text-gray-300">Power Input</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">Lightweight</div>
              <div className="text-gray-300">Plastic Body</div>
            </div>
          </div>
        </div>

        {/* Final Description */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-8">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center">
            With a <strong className="text-blue-400">12V DC 2A</strong> power input, <strong className="text-blue-400">lightweight plastic body</strong>, and smart ergonomic design, Color Fluent turns home hair coloring into a professional, personalized experience — every single time.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Experience Smart Hair Coloring?</h3>
            <p className="text-blue-100 mb-6">
              Join thousands of users who have transformed their hair coloring routine with Color Fluent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Today
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

