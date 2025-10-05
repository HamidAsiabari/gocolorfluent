import Link from 'next/link'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: '190px' }}>
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
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: January 6, 2024</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Color Fluent's website, mobile application, or products, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Color Fluent provides intelligent hair coloring technology including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Smart hair coloring devices and accessories</li>
              <li>Mobile application for color guidance and customization</li>
              <li>Color analysis and recommendation services</li>
              <li>Educational content and tutorials</li>
              <li>Customer support and technical assistance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              To access certain features of our service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Product Use and Safety</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              When using Color Fluent products:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Follow all safety instructions and warnings provided</li>
              <li>Use only compatible hair coloring products</li>
              <li>Perform patch tests before full application</li>
              <li>Use products only as intended and described</li>
              <li>Seek professional advice for any skin sensitivities or allergies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              All content, features, and functionality of our service are owned by Color Fluent and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Copy, modify, or distribute our proprietary content</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks or logos without permission</li>
              <li>Create derivative works based on our technology</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Uses</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Payment Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Payment terms for our products and services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>All prices are in Canadian dollars unless otherwise specified</li>
              <li>Payment is due at the time of purchase</li>
              <li>We accept major credit cards and other approved payment methods</li>
              <li>Prices are subject to change without notice</li>
              <li>Taxes and shipping fees may apply</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Returns and Refunds</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our return and refund policy:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Returns must be initiated within 30 days of purchase</li>
              <li>Products must be in original condition with all packaging</li>
              <li>Refunds will be processed within 5-10 business days</li>
              <li>Shipping costs for returns are the customer's responsibility</li>
              <li>Custom or personalized items may not be eligible for return</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Warranty and Disclaimers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our products come with a limited warranty against manufacturing defects. However:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Warranty does not cover damage from misuse or normal wear</li>
              <li>Results may vary based on individual hair type and condition</li>
              <li>We are not responsible for allergic reactions or skin sensitivities</li>
              <li>Professional consultation is recommended for complex coloring needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall Color Fluent, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of Canada and the Province of Ontario, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 mt-4">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> legal@gocolorfluent.com</p>
              <p className="text-gray-300 mb-2"><strong>Phone:</strong> +1 (437) 882-2429</p>
              <p className="text-gray-300"><strong>Address:</strong> 70 Misty Moor Dr, Richmond Hill, Ontario, Canada, L4C 6R1</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
