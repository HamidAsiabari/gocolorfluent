import Link from 'next/link'
import Menu from '../../components/Menu'
import MobileMenu from '../../components/MobileMenu'
import Footer from '../../components/Footer'

export default function CookiePolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: January 6, 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners about how users interact with their sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Color Fluent uses cookies to enhance your browsing experience and provide personalized services. We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Improve website performance and functionality</li>
              <li>Provide personalized content and recommendations</li>
              <li>Enable social media features and sharing</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-white mb-2">Essential Cookies</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and remembering your login status. The website cannot function properly without these cookies.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2">Performance Cookies</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages. This helps us improve how our website works.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2">Functionality Cookies</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
            </p>

            <h3 className="text-xl font-semibold text-white mb-2">Targeting/Advertising Cookies</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              These cookies are used to deliver advertisements more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We may also use third-party cookies from trusted partners to enhance our services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Social Media Platforms:</strong> To enable social sharing and integration</li>
              <li><strong>Payment Processors:</strong> To process secure transactions</li>
              <li><strong>Customer Support Tools:</strong> To provide live chat and support services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookie Duration</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Cookies may be either "session" cookies or "persistent" cookies:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Managing Your Cookie Preferences</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You have several options for managing cookies:
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-2">Browser Settings</h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Block all cookies</li>
              <li>Allow only first-party cookies</li>
              <li>Delete existing cookies</li>
              <li>Set up notifications when cookies are sent</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-2">Cookie Consent</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              When you first visit our website, you'll see a cookie consent banner. You can choose which types of cookies to accept or reject. You can change your preferences at any time through our cookie settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Impact of Disabling Cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you choose to disable cookies, some features of our website may not function properly:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>You may need to re-enter information more frequently</li>
              <li>Personalized content and recommendations may not be available</li>
              <li>Some interactive features may not work</li>
              <li>Website performance may be affected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Mobile App Cookies</h2>
            <p className="text-gray-300 leading-relaxed">
              Our mobile application may use similar technologies to cookies, such as local storage and device identifiers. These technologies help us provide personalized experiences and improve app performance. You can manage these through your device settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Updates to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 mt-4">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> privacy@gocolorfluent.com</p>
              <p className="text-gray-300 mb-2"><strong>Phone:</strong> +1 (437) 882-2429</p>
              <p className="text-gray-300"><strong>Address:</strong> Toronto, Canada</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
