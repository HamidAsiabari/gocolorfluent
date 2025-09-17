'use client'

export default function About() {
  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Technology Officer',
      image: '/api/placeholder/200/200',
      bio: 'Leading expert in color sensing technology with 15+ years in precision engineering.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Engineering',
      image: '/api/placeholder/200/200',
      bio: 'Specialist in micro-mechanical systems and advanced brush application technology.'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      image: '/api/placeholder/200/200',
      bio: 'Pioneer in LED lighting systems for professional color accuracy applications.'
    },
    {
      name: 'James Park',
      role: 'Product Design Lead',
      image: '/api/placeholder/200/200',
      bio: 'Expert in user interface design and ergonomic product development.'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Color Fluent was established with a vision to revolutionize color application technology.'
    },
    {
      year: '2021',
      title: 'First Prototype',
      description: 'Developed our first working prototype with basic color sensing capabilities.'
    },
    {
      year: '2022',
      title: 'Advanced Electronics',
      description: 'Integrated OLED display and smart control systems into our brush assembly.'
    },
    {
      year: '2023',
      title: 'Professional Launch',
      description: 'Launched Color Fluent Pro with full professional-grade features and capabilities.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to serve professional artists and studios worldwide.'
    }
  ]

  const values = [
    {
      icon: '🎯',
      title: 'Precision',
      description: 'We are committed to delivering pixel-perfect accuracy in every product we create.'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuously pushing the boundaries of what\'s possible in color technology.'
    },
    {
      icon: '🔧',
      title: 'Quality',
      description: 'Using only the finest components and rigorous testing standards.'
    },
    {
      icon: '🤝',
      title: 'Support',
      description: 'Dedicated customer service and technical support for all our products.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Color Fluent</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/catalog" className="text-gray-300 hover:text-white transition-colors">Catalog</a>
              <a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</a>
              <a href="/about" className="text-white font-semibold">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">About Color Fluent</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We are pioneers in professional color application technology, dedicated to creating 
            precision tools that empower artists, designers, and professionals to achieve 
            unparalleled accuracy and quality in their work.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To revolutionize the way professionals work with color by providing cutting-edge 
              technology that combines precision engineering with intuitive design. We believe 
              that every artist deserves tools that match their vision and ambition.
            </p>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              To become the global leader in professional color application technology, 
              setting new standards for accuracy, reliability, and user experience in 
              the creative industry.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{value.title}</h4>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Journey</h3>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-600"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6">
                      <div className="text-blue-400 font-bold text-lg mb-2">{milestone.year}</div>
                      <h4 className="text-xl font-semibold text-white mb-2">{milestone.title}</h4>
                      <p className="text-gray-300">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-gray-900 flex-shrink-0"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white">👤</span>
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{member.name}</h4>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-8 mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">By the Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-300">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-gray-300">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-300">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-300">Technical Support</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Experience Color Fluent?</h3>
            <p className="text-blue-100 mb-6">
              Join thousands of professionals who trust Color Fluent for their most demanding projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/catalog" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Products
              </a>
              <a href="/contact" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
