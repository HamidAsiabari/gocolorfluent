'use client'

import Link from 'next/link'
import Image from 'next/image'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function Team() {
  const teamMembers = [
    {
      name: 'Reza',
      role: 'Chief Technology Officer (CTO)',
      company: 'Color Fluent',
      image: '/team/reza.jpg',
      linkedin: 'https://www.linkedin.com/in/reza-goharian-pmp-391a99b6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      description: 'Leading our technical vision and innovation, ensuring Color Fluent delivers cutting-edge technology solutions.'
    },
    {
      name: 'Maryam',
      role: 'Chief Product Officer (CPO)',
      company: 'Color Fluent',
      image: '/team/maryam.jpg',
      linkedin: 'https://www.linkedin.com/in/maryam-naseri-14489281?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      description: 'Driving product strategy and user experience to create intuitive, beautiful solutions for our customers.'
    },
    {
      name: 'Fina',
      role: 'Chief Creative Officer (CCO)',
      company: 'Color Fluent',
      image: '/team/fina.jpg',
      linkedin: 'https://www.linkedin.com/in/fina-ghafourisayyad-54a03622a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      description: 'Shaping our creative vision and brand identity, bringing beauty and innovation together in every design.'
    },
    {
      name: 'Fatemeh',
      role: 'Chief Marketing Officer',
      company: 'Color Fluent',
      image: '/team/fatemeh.jpg',
      linkedin: 'https://www.linkedin.com/in/fatemeh-pirouzhamidi-269319170?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      description: 'Building our brand presence and connecting with customers through strategic marketing initiatives.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 internal-page">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ paddingTop: '190px' }}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Meet Our Team
          </h1>
          <h2 className="text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-logo-text mb-8 font-semibold">
            The Visionaries Behind Color Fluent
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our diverse team of innovators, creators, and leaders work together to revolutionize the hair coloring experience through technology, design, and passion.
          </p>
        </div>

        {/* Team Introduction */}
        <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-16">
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center">
            At <strong className="text-logo-bg">Color Fluent</strong>, we believe that great products come from great teams. Our leadership brings together decades of combined experience in technology, product development, creative design, and marketing to create something truly special.
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {teamMembers.map((member, index) => (
            <div 
              key={member.name}
              className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600 p-6 sm:p-8 hover:bg-black/30 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-logo-bg/30 group-hover:border-logo-bg transition-colors duration-300">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-2 rounded-full border-2 border-logo-bg/20 group-hover:border-logo-bg/40 transition-colors duration-300"></div>
                </div>

                {/* Name and Role */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {member.name}
                </h3>
                <h4 className="text-lg sm:text-xl text-logo-bg font-semibold mb-2">
                  {member.role}
                </h4>
                <p className="text-base text-gray-400 mb-4">
                  {member.company}
                </p>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* LinkedIn Button */}
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 group-hover:scale-105 transform"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Connect on LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Our Mission */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6 sm:p-8 mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Our Mission</h3>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed text-center">
            Together, we're building the future of hair coloring — where <strong className="text-logo-bg">technology meets beauty</strong>, 
            <strong className="text-logo-bg"> innovation meets accessibility</strong>, and <strong className="text-logo-bg">creativity meets precision</strong>. 
            Our diverse backgrounds and shared passion drive us to create products that empower everyone to express their true colors with confidence.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Join Our Journey</h3>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-6 sm:p-8 mb-8">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              Want to learn more about our team, our products, or how we're revolutionizing hair coloring? We'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/about" 
                className="bg-logo-bg hover:bg-logo-bg/80 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More About Us
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border-2 border-logo-bg text-logo-bg px-8 py-3 rounded-lg font-semibold hover:bg-logo-bg hover:text-white transition-colors"
              >
                Get in Touch
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
