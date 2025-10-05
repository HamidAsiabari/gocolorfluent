import Link from 'next/link'
import Menu from '../../components/Menu'
import MobileMenu from '../../components/MobileMenu'
import Footer from '../../components/Footer'

export default function Warranty() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Warranty Information</h1>
          <p className="text-gray-400 text-sm">Limited warranty coverage for your Color Fluent device</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Warranty Coverage</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">1-Year Limited Warranty</h3>
              <p className="text-gray-300 mb-4">
                Color Fluent provides a 1-year limited warranty from the date of purchase covering manufacturing defects in materials and workmanship under normal use.
              </p>
              
              <h4 className="text-lg font-semibold text-white mb-3">What's Covered:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Manufacturing defects in materials and workmanship</li>
                <li>Battery failure under normal use</li>
                <li>Electronic component failures</li>
                <li>Mechanical defects in the brush mechanism</li>
                <li>Charging port malfunctions</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-3">What's Not Covered:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Damage from misuse, abuse, or accidents</li>
                <li>Normal wear and tear</li>
                <li>Damage from unauthorized repairs or modifications</li>
                <li>Cosmetic damage that doesn't affect functionality</li>
                <li>Damage from exposure to extreme temperatures or moisture</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Warranty Process</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">How to Make a Warranty Claim</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3">
                <li>
                  <strong>Contact Support:</strong> Reach out to our technical support team with your issue
                </li>
                <li>
                  <strong>Provide Information:</strong> Include your device serial number, purchase date, and detailed description of the problem
                </li>
                <li>
                  <strong>Verification:</strong> Our team will verify the warranty status and determine if the issue is covered
                </li>
                <li>
                  <strong>Resolution:</strong> We'll either repair, replace, or provide a refund for covered defects
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Warranty Terms</h2>
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Duration</h3>
                <p className="text-gray-300 text-sm">
                  The warranty period begins on the date of purchase and continues for 12 months, regardless of ownership transfer.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Proof of Purchase</h3>
                <p className="text-gray-300 text-sm">
                  You must provide proof of purchase (receipt, invoice, or order confirmation) to make a warranty claim.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Warranty Service</h3>
                <p className="text-gray-300 text-sm">
                  Warranty service may include repair, replacement with a refurbished unit, or refund at our discretion. Replacement units may be new or refurbished.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact for Warranty Claims</h2>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6">
              <p className="text-gray-300 mb-4">
                To initiate a warranty claim or for questions about warranty coverage:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                  <a 
                    href="tel:+14378822429" 
                    className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                  >
                    +1 (437) 882-2429
                  </a>
                  <p className="text-gray-400 text-sm">Mon-Fri: 9AM-6PM EST</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                  <a 
                    href="mailto:warranty@gocolorfluent.com" 
                    className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                  >
                    warranty@gocolorfluent.com
                  </a>
                  <p className="text-gray-400 text-sm">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Related Information</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/technical-support" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
              >
                Technical Support
              </Link>
              <Link 
                href="/returns" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg text-center hover:bg-white hover:text-blue-600 transition-colors"
              >
                Return Policy
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
