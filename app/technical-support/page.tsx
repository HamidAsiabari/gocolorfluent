import Link from 'next/link'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function TechnicalSupport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Menu */}
      <TopMenu />

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
          <h1 className="text-4xl font-bold text-white mb-4">Technical Support</h1>
          <p className="text-gray-400 text-sm">Get help with technical issues and device problems</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Our Support Team</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Phone Support</h3>
                  <p className="text-gray-300 mb-2">Speak directly with our technical experts</p>
                  <a 
                    href="tel:+14378822429" 
                    className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                  >
                    +1 (437) 882-2429
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Mon-Fri: 9AM-6PM EST</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Email Support</h3>
                  <p className="text-gray-300 mb-2">Send us detailed information about your issue</p>
                  <a 
                    href="mailto:support@gocolorfluent.com" 
                    className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                  >
                    support@gocolorfluent.com
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Response within 24 hours</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Common Technical Issues</h2>
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Device Not Charging</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Check that the USB cable is properly connected</li>
                  <li>Try a different USB power source or cable</li>
                  <li>Clean the charging port with a dry cloth</li>
                  <li>Allow 2-3 hours for full charge</li>
                </ul>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">App Connection Problems</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Ensure Bluetooth is enabled on your device</li>
                  <li>Restart the Color Fluent app</li>
                  <li>Turn the device off and on again</li>
                  <li>Check that your phone is within 10 feet of the device</li>
                </ul>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Brush Not Dispensing Color</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                  <li>Ensure the brush is properly filled with color formula</li>
                  <li>Check that the device is turned on and connected</li>
                  <li>Clean the brush nozzle with warm water</li>
                  <li>Verify the app shows the device is ready</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Before Contacting Support</h2>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6">
              <p className="text-gray-300 mb-4">
                Please have the following information ready to help us assist you faster:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li>Device model and serial number (found on the device label)</li>
                <li>App version (check in app settings)</li>
                <li>Phone/tablet model and operating system version</li>
                <li>Description of the problem and when it started</li>
                <li>Steps you've already tried to resolve the issue</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Warranty Information</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <p className="text-gray-300 mb-4">
                Your Color Fluent device comes with a 1-year limited warranty covering manufacturing defects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/warranty" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
                >
                  View Warranty Details
                </Link>
                <Link 
                  href="/returns" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg text-center hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Return Policy
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
