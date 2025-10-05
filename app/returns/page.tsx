import Link from 'next/link'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function Returns() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Return Policy</h1>
          <p className="text-gray-400 text-sm">Information about returning your Color Fluent products</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Return Eligibility</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">30-Day Return Window</h3>
              <p className="text-gray-300 mb-4">
                You may return your Color Fluent device within 30 days of purchase for a full refund, provided the following conditions are met:
              </p>
              
              <h4 className="text-lg font-semibold text-white mb-3">Return Requirements:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Device must be in original condition with no signs of use</li>
                <li>All original packaging, accessories, and documentation must be included</li>
                <li>Device must not be damaged, scratched, or modified</li>
                <li>Return must be initiated within 30 days of purchase date</li>
                <li>Proof of purchase must be provided</li>
              </ul>

              <h4 className="text-lg font-semibold text-white mb-3">Items Not Eligible for Return:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Used or damaged devices</li>
                <li>Devices missing original packaging or accessories</li>
                <li>Custom or personalized items</li>
                <li>Items purchased from unauthorized retailers</li>
                <li>Hair color products or consumables</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">How to Return</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Return Process</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3">
                <li>
                  <strong>Contact Us:</strong> Email returns@gocolorfluent.com or call +1 (437) 882-2429 to initiate your return
                </li>
                <li>
                  <strong>Get Authorization:</strong> We'll provide you with a Return Merchandise Authorization (RMA) number
                </li>
                <li>
                  <strong>Package Item:</strong> Securely package the device in its original packaging with all accessories
                </li>
                <li>
                  <strong>Ship Return:</strong> Send the package to the address provided with your RMA number
                </li>
                <li>
                  <strong>Receive Refund:</strong> Once received and inspected, we'll process your refund within 5-10 business days
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Return Costs</h2>
            <div className="space-y-4">
              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Return Shipping</h3>
                <p className="text-gray-300 text-sm">
                  Return shipping costs are the responsibility of the customer unless the return is due to a manufacturing defect or our error.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Refund Processing</h3>
                <p className="text-gray-300 text-sm">
                  Refunds will be processed to the original payment method within 5-10 business days after we receive and inspect the returned item.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Restocking Fee</h3>
                <p className="text-gray-300 text-sm">
                  No restocking fees apply for returns within the 30-day window, provided all return conditions are met.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Exchange Policy</h2>
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Device Exchanges</h3>
              <p className="text-gray-300 mb-4">
                If you need to exchange your device for a different model or if you received a defective unit, we offer exchanges within 30 days of purchase.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li>Exchanges are subject to the same return conditions</li>
                <li>Price differences will be handled through additional payment or refund</li>
                <li>Exchange shipping costs are covered by Color Fluent</li>
                <li>Contact support to initiate an exchange</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Contact for Returns</h2>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
              <p className="text-gray-300 mb-4">
                To initiate a return or for questions about our return policy:
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
                    href="mailto:returns@gocolorfluent.com" 
                    className="text-blue-400 hover:text-blue-300 text-lg font-semibold"
                  >
                    returns@gocolorfluent.com
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
                href="/warranty" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center transition-colors"
              >
                Warranty Information
              </Link>
              <Link 
                href="/technical-support" 
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg text-center hover:bg-white hover:text-blue-600 transition-colors"
              >
                Technical Support
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
