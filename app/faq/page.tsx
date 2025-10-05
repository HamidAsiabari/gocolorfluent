'use client'

import { useState } from 'react'
import Link from 'next/link'
import Menu from '../../components/Menu'
import MobileMenu from '../../components/MobileMenu'
import Footer from '../../components/Footer'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon: string
  items: FAQItem[]
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [openItem, setOpenItem] = useState<string | null>(null)

  const faqCategories: FAQCategory[] = [
    {
      id: 'device',
      title: 'Device',
      icon: '🧠',
      items: [
        {
          question: 'Does Color Fluent work on all hair types?',
          answer: 'Absolutely! Color Fluent has been carefully designed and tested on all hair types, textures, and lengths. The flexible bristle system adapts to different hair densities and curl patterns, ensuring even coverage and a smooth glide from root to tip.'
        },
        {
          question: 'What do the indicator lights on my device mean?',
          answer: 'The front LED lights guide you through each step — warming up, ready to color, or cleaning mode. If your lights show something unusual, consult your quick-start guide or reach out to our support team.'
        },
        {
          question: 'Am I wasting color during the initial warm-up?',
          answer: 'Not at all. Each cartridge contains enough color for up to three root touch-ups or one full-head application. The warm-up allows the device to perfectly mix and calibrate the color and developer. Let the formula run for about 20 seconds before applying — once the light turns green, you\'re ready to start coloring.'
        },
        {
          question: 'How do I clean the device?',
          answer: 'Cleaning takes just a few minutes and keeps your device working flawlessly:\n\n1. After coloring, remove the cartridge.\n2. Fill the cleaning cartridge with warm water and insert it.\n3. Hold the device over a sink and press the power button to start cleaning.\n4. When the green check light appears, the cleaning cycle is complete.\n   Dry and store your device until your next color session.'
        },
        {
          question: 'How do I turn off the device?',
          answer: 'The device turns off automatically after two minutes of inactivity to save battery.'
        },
        {
          question: 'Why does the device start and stop during warm-up or cleaning?',
          answer: 'That\'s normal if the device isn\'t angled correctly.\n\n* For **warm-up**, tilt the device slightly upward over the sink.\n* For **cleaning**, tilt it downward.\n  This ensures smooth formula or water flow throughout the process.'
        },
        {
          question: 'How do I store a partially used cartridge?',
          answer: 'If there\'s leftover formula, place the cartridge back in its box and store it in a cool, dry place. Use it within 4 months after the first use. Always clean your device after each application.'
        },
        {
          question: 'How many cartridges do I need for long hair?',
          answer: 'For most users, one cartridge is enough for full coverage. If your hair is very long, thick, or extremely dense, keep a second cartridge handy just in case.'
        },
        {
          question: 'When should I use the lengths adapter?',
          answer: 'Attach the lengths adapter once your roots are finished to help distribute color evenly through the mid-lengths and ends, while avoiding product waste. You can guide the color through your hair using your gloved hands.'
        },
        {
          question: 'Should I do an all-over color or a root touch-up?',
          answer: '* **All-over color:** Best for first-time users, those going two or more shades lighter/darker, or if it\'s been over 3 months since your last color.\n* **Root touch-up:** Ideal for maintaining your shade or covering regrowth every 4–6 weeks.'
        },
        {
          question: 'How should I prepare before using Color Fluent?',
          answer: '1. **48 hours before coloring:** Perform an allergy test.\n2. **Before application:** Detangle dry, unwashed hair and prepare your space.\n3. **During coloring:** Follow all safety and timing instructions carefully.'
        },
        {
          question: 'How do I perform an allergy test?',
          answer: '1. Clean a small patch inside your elbow and pat dry.\n2. Dispense a pea-sized amount of color using the device.\n3. Apply to the test area with a cotton swab and let it dry.\n4. Do not cover or wash for 48 hours.\n   If any irritation, redness, or swelling occurs, do not color your hair and consult a doctor.\n   (See the included instruction guide for full safety information.)'
        }
      ]
    },
    {
      id: 'cartridges',
      title: 'Cartridges',
      icon: '💧',
      items: [
        {
          question: 'How should I store unused or partially used cartridges?',
          answer: 'Keep cartridges sealed in their original packaging and store in a cool, dry place away from sunlight. Once opened, use within 4 months for best results.'
        },
        {
          question: 'Can I mix different cartridge shades?',
          answer: 'No. Each cartridge is precisely formulated to maintain color balance. Mixing shades can alter results and damage the device.'
        },
        {
          question: 'How do I recycle my used cartridges?',
          answer: 'Color Fluent is committed to sustainability. Follow local recycling guidelines or visit our website for recycling instructions.'
        }
      ]
    },
    {
      id: 'hair-coloration',
      title: 'Hair Coloration',
      icon: '🎨',
      items: [
        {
          question: 'Will Color Fluent stain my sink or towels?',
          answer: 'As with any permanent color, staining is possible. Use the provided placement mat to protect your surfaces, and wipe spills immediately. Avoid using light towels during your first few washes.'
        },
        {
          question: 'What if I don\'t see the shade I want in the quiz results?',
          answer: 'Our quiz tailors recommendations to your unique hair history. Remember:\n\n* Permanent color cannot lighten existing permanent color.\n* Color Fluent does not include bleach products and can lighten up to two levels.\n  Need personal advice? Contact our Color Concierge at support@gocolorfluent.com or book a consultation call at +1 (437) 882-2429.'
        },
        {
          question: 'How long does Color Fluent color last?',
          answer: 'Our EverFresh™ formula provides 100% gray coverage and vibrant color that lasts until your roots regrow.'
        },
        {
          question: 'When should I start timing the processing period?',
          answer: 'Begin timing **after your full application is complete.** Processing takes 30 minutes for both full color and root touch-up.'
        },
        {
          question: 'What happens if I leave the color on too long?',
          answer: 'Leaving the color on past the recommended time may result in a deeper or darker shade than intended. Always follow timing instructions.'
        },
        {
          question: 'What if I rinse the color out too early?',
          answer: 'Rinsing too soon can cause lighter or uneven color results. For best coverage and richness, leave the color on for the full 30 minutes.'
        },
        {
          question: 'Can I use Color Fluent on chemically treated hair?',
          answer: 'Yes, but with caution. Wait at least 14 days after bleaching, relaxing, or perming before coloring. Do not use on hair previously treated with metallic dyes, henna, or progressive color.'
        },
        {
          question: 'Can I use Color Fluent if I have highlights or balayage?',
          answer: 'Yes — for root touch-ups, it\'s perfect. For all-over color, it depends on your highlight shade and base color. For guidance, contact our experts before applying.'
        },
        {
          question: 'Are Color Fluent products tested on animals?',
          answer: 'Never. Color Fluent and its ingredients are 100% cruelty-free. We use alternative testing methods to ensure safety and ethical standards.'
        }
      ]
    },
    {
      id: 'orders-support',
      title: 'Orders & Support',
      icon: '📦',
      items: [
        {
          question: 'How can I track my order?',
          answer: 'You\'ll receive a tracking link via email once your order ships. You can also check your order status anytime in your account dashboard.'
        },
        {
          question: 'How do I manage or edit my subscription?',
          answer: 'You can modify, pause, or cancel your color cartridge subscription through your account dashboard or contact support@gocolorfluent.com for help.'
        },
        {
          question: 'What is your return policy?',
          answer: '* **In-store purchases:** Please return to the original place of purchase.\n* **Online purchases:** Start your return request through your account dashboard or email support@gocolorfluent.com.\n  Returns are accepted within **30 days** for unopened products in original packaging.'
        },
        {
          question: 'Do you offer a money-back guarantee?',
          answer: 'Yes! We offer a **30-day satisfaction guarantee** (up to $155 before tax and shipping). If you\'re not happy with your experience, contact info@gocolorfluent.com within 30 days of purchase for help.'
        },
        {
          question: 'What is the product warranty?',
          answer: 'Your Color Fluent device is covered by a **1-year limited warranty.**\nIf you experience any issues, email support@gocolorfluent.com or call +1 (437) 882-2429.\nYou can download the full warranty policy from your account dashboard.'
        }
      ]
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
    setOpenItem(null)
  }

  const toggleItem = (itemId: string) => {
    setOpenItem(openItem === itemId ? null : itemId)
  }

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => {
      if (line.startsWith('* **')) {
        return (
          <div key={index} className="ml-4 mb-2">
            <strong>{line.replace('* **', '').replace(':**', ':')}</strong>
          </div>
        )
      } else if (line.startsWith('* ')) {
        return (
          <div key={index} className="ml-4 mb-2">
            {line.replace('* ', '')}
          </div>
        )
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold mb-2">
            {line.replace(/\*\*/g, '')}
          </div>
        )
      } else if (line.trim() === '') {
        return <br key={index} />
      } else {
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        )
      }
    })
  }

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
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Welcome to the Color Fluent FAQ hub! Here you'll find everything you need to know about your Color Fluent device, color cartridges, hair coloring, and your orders.
          </p>
          
          {/* Contact Info */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-4 sm:p-6 mb-8">
            <p className="text-gray-300 mb-4">If you still have questions, our support team is happy to help:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm sm:text-base">
              <a href="mailto:info@gocolorfluent.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                📧 info@gocolorfluent.com
              </a>
              <span className="hidden sm:block text-gray-500">|</span>
              <a href="mailto:support@gocolorfluent.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                support@gocolorfluent.com
              </a>
              <span className="hidden sm:block text-gray-500">|</span>
              <a href="tel:+14378822429" className="text-blue-400 hover:text-blue-300 transition-colors">
                📞 +1 (437) 882-2429
              </a>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-black/30 backdrop-blur-sm border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {category.title}
                  </h3>
                  <span className="text-sm text-gray-400">
                    ({category.items.length} questions)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openCategory === category.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openCategory === category.id && (
                <div className="border-t border-gray-600">
                  {category.items.map((item, index) => {
                    const itemId = `${category.id}-${index}`
                    return (
                      <div key={itemId} className="border-b border-gray-700 last:border-b-0">
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <h4 className="text-sm sm:text-base font-medium text-white pr-4">
                            {item.question}
                          </h4>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                              openItem === itemId ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {openItem === itemId && (
                          <div className="px-4 sm:px-6 pb-4">
                            <div className="text-sm sm:text-base text-gray-300 leading-relaxed">
                              {formatAnswer(item.answer)}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No results found for "{searchTerm}"</div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-blue-100 mb-6">
            Our expert color team is here to guide you every step of the way!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@gocolorfluent.com"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+14378822429"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
