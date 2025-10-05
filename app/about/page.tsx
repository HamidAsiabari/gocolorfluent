'use client'

import Link from 'next/link'
import Menu from '../../components/Menu'
import MobileMenu from '../../components/MobileMenu'
import Footer from '../../components/Footer'

export default function About() {
  const appFeatures = [
    'Personalized shade recommendations',
    'Guided, step-by-step coloring instructions',
    'Custom profiles that save your preferences and history',
    'Wi-Fi connectivity for effortless updates and control'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Color Fluent</h1>
            <div className="flex items-center space-x-4">
              <Menu variant="header" />
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            About Color Fluent
          </h2>
          <h3 className="text-xl sm:text-2xl text-blue-400 mb-8 font-semibold">
            Smart Innovation for Beautiful Confidence
          </h3>
        </div>

        {/* Mission Statement */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-8">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
            At <strong className="text-blue-400">Color Fluent</strong>, we believe that coloring your hair should be as empowering as it is effortless. Our mission is to bring salon-quality results to your fingertips through technology, design, and personalization — helping you express your true colors with confidence, creativity, and ease.
          </p>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            We're redefining what at-home hair coloring can be: <strong className="text-blue-400">smarter, faster, cleaner, and beautifully precise</strong>.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Story</h3>
          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Color Fluent was born from a simple but powerful idea — to make professional-quality hair coloring accessible to everyone.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Our founders saw the frustrations people face with traditional at-home dyes: messy applications, uneven coverage, and hard-to-reach areas. So we combined <strong className="text-blue-400">cutting-edge technology</strong>, <strong className="text-blue-400">data-driven design</strong>, and <strong className="text-blue-400">intuitive usability</strong> to create a new experience — one that puts control back in your hands.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              After years of research, testing, and innovation, the <strong className="text-blue-400">Color Fluent Smart Hair Coloring Device</strong> was created — a first-of-its-kind system that intelligently identifies roots, evenly distributes color, and connects seamlessly to an app that personalizes every step of the process.
            </p>
          </div>
        </div>

        {/* Smart Beauty Meets Technology */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Smart Beauty Meets Technology</h3>
          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Color Fluent merges beauty with smart engineering. Using <strong className="text-blue-400">image processing</strong>, <strong className="text-blue-400">RGB color analysis</strong>, and <strong className="text-blue-400">data-based color matching</strong>, our device adapts to your unique hair type and needs — ensuring consistent, even, and vibrant results every time.
            </p>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8">
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                The <strong className="text-blue-400">Color Fluent App</strong> brings your color journey to life:
              </p>
              <ul className="space-y-3">
                {appFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-base sm:text-lg text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Our goal is to eliminate guesswork, reduce waste, and help you color your hair confidently — anytime, anywhere.
            </p>
          </div>
        </div>

        {/* Our Promise */}
        <div className="mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Our Promise</h3>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6 sm:p-8">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
              We stand for more than innovation — we stand for <strong className="text-blue-400">quality, safety, and self-expression</strong>.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
              Every Color Fluent product is developed with care, tested for performance, and designed to empower you to achieve professional results in your own home.
            </p>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              We are proudly <strong className="text-blue-400">cruelty-free</strong>, and committed to creating solutions that are both smart and sustainable.
            </p>
          </div>
        </div>

        {/* Get in Touch */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Get in Touch</h3>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-8">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              Whether you're new to at-home coloring or a seasoned pro, Color Fluent is here to make your experience simple, safe, and stunning.
            </p>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:info@gocolorfluent.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors text-base sm:text-lg font-medium"
                >
                  📧 info@gocolorfluent.com
                </a>
                <span className="hidden sm:block text-gray-500">|</span>
                <a 
                  href="mailto:support@gocolorfluent.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors text-base sm:text-lg font-medium"
                >
                  📧 support@gocolorfluent.com
                </a>
              </div>
              <div>
                <a 
                  href="tel:+14378822429" 
                  className="text-blue-400 hover:text-blue-300 transition-colors text-base sm:text-lg font-medium"
                >
                  📞 +1 (437) 882-2429
                </a>
              </div>
            </div>
            
            <p className="text-sm sm:text-base text-gray-400 mt-6">
              Follow us on social media for the latest updates, tutorials, and tips.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 sm:p-8">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">Ready to Transform Your Hair Coloring Experience?</h4>
            <p className="text-blue-100 mb-6">
              Discover the future of at-home hair coloring with Color Fluent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/catalog" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Our Device
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Us
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

