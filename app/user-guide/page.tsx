import Link from 'next/link'
import Menu from '../../components/Menu'
import MobileMenu from '../../components/MobileMenu'
import Footer from '../../components/Footer'

export default function UserGuide() {
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
          <h1 className="text-4xl font-bold text-white mb-4">User Guide</h1>
          <p className="text-gray-400 text-sm">Everything you need to know about using Color Fluent</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Initial Setup</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Download the Color Fluent mobile app from your device's app store</li>
                <li>Create your account and complete the hair analysis survey</li>
                <li>Charge your Color Fluent device using the provided USB cable</li>
                <li>Pair your device with the app via Bluetooth</li>
                <li>Follow the on-screen calibration instructions</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Basic Operation</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Using Your Color Fluent</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Select your desired hair color in the app</li>
                <li>Mix your hair color formula according to app instructions</li>
                <li>Fill the Color Fluent brush with the mixed formula</li>
                <li>Turn on the device and follow the guided application process</li>
                <li>Use the smart brush to apply color evenly across your hair</li>
                <li>Follow the recommended processing time</li>
                <li>Rinse and condition as directed</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">App Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Color Matching</h3>
                <p className="text-gray-300 text-sm">
                  Upload a photo or use the camera to get personalized color recommendations based on your skin tone and hair type.
                </p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Step-by-Step Guide</h3>
                <p className="text-gray-300 text-sm">
                  Follow detailed, personalized instructions for your specific hair coloring process.
                </p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Color History</h3>
                <p className="text-gray-300 text-sm">
                  Keep track of your previous colors and formulas for easy re-application.
                </p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Smart Notifications</h3>
                <p className="text-gray-300 text-sm">
                  Get reminders for processing times and maintenance schedules.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Troubleshooting</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Device Won't Turn On</h4>
                  <p className="text-gray-300 text-sm">Ensure the device is fully charged and try holding the power button for 3 seconds.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Bluetooth Connection Issues</h4>
                  <p className="text-gray-300 text-sm">Restart both your device and phone, then try pairing again in the app.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Uneven Color Application</h4>
                  <p className="text-gray-300 text-sm">Ensure your hair is clean and dry, and follow the sectioning guide in the app.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Need More Help?</h2>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6">
              <p className="text-gray-300 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/technical-support" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  href="/faq" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg text-center hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
