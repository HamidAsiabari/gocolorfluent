'use client'

import React from 'react'

interface TimelineEvent {
  date: string
  title: string
  description: string
  category: 'milestone' | 'product' | 'partnership' | 'achievement' | 'launch'
  icon: string
}

const timelineData: TimelineEvent[] = [
  {
    date: '2023-01-15',
    title: 'Company Founded',
    description: 'Color Fluent was founded with a vision to revolutionize color technology and bring advanced color management solutions to creative professionals.',
    category: 'milestone',
    icon: '🏢'
  },
  {
    date: '2023-03-20',
    title: 'First Prototype Development',
    description: 'Completed the initial prototype of our flagship color brush technology, incorporating advanced color detection and mixing capabilities.',
    category: 'product',
    icon: '🔬'
  },
  {
    date: '2023-06-10',
    title: 'Seed Funding Round',
    description: 'Successfully raised $500K in seed funding from angel investors to accelerate product development and team expansion.',
    category: 'achievement',
    icon: '💰'
  },
  {
    date: '2023-08-15',
    title: 'Patent Application Filed',
    description: 'Filed patent for our proprietary color mixing algorithm and brush technology, protecting our core intellectual property.',
    category: 'achievement',
    icon: '📋'
  },
  {
    date: '2023-10-30',
    title: 'Beta Testing Program Launch',
    description: 'Launched closed beta testing program with 50 selected artists and designers to gather feedback and refine our product.',
    category: 'launch',
    icon: '🚀'
  },
  {
    date: '2024-01-20',
    title: 'Strategic Partnership with Adobe',
    description: 'Announced partnership with Adobe to integrate Color Fluent technology into Creative Cloud applications.',
    category: 'partnership',
    icon: '🤝'
  },
  {
    date: '2024-03-15',
    title: 'Series A Funding',
    description: 'Raised $2.5M in Series A funding led by TechVentures to scale manufacturing and expand market reach.',
    category: 'achievement',
    icon: '💎'
  },
  {
    date: '2024-05-10',
    title: 'Product Launch - Color Brush V1',
    description: 'Officially launched our first commercial product, the Color Brush V1, featuring real-time color detection and mixing.',
    category: 'launch',
    icon: '🎨'
  },
  {
    date: '2024-07-25',
    title: 'International Expansion',
    description: 'Expanded operations to European and Asian markets, establishing partnerships with distributors in 15 countries.',
    category: 'milestone',
    icon: '🌍'
  },
  {
    date: '2024-09-12',
    title: 'Award Recognition',
    description: 'Received the "Innovation in Color Technology" award at the International Design Technology Conference.',
    category: 'achievement',
    icon: '🏆'
  },
  {
    date: '2024-11-08',
    title: 'Color Brush V2 Development',
    description: 'Began development of Color Brush V2 with enhanced AI-powered color matching and improved ergonomics.',
    category: 'product',
    icon: '⚡'
  },
  {
    date: '2024-12-15',
    title: '1000+ Customers Milestone',
    description: 'Reached 1000+ active customers worldwide, with 95% customer satisfaction rating and growing community.',
    category: 'milestone',
    icon: '👥'
  }
]

const categoryStyles = {
  milestone: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'border-blue-400/30',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-100'
  },
  product: {
    bg: 'bg-gradient-to-br from-green-500 to-green-600',
    border: 'border-green-400/30',
    glow: 'shadow-green-500/20',
    text: 'text-green-100'
  },
  partnership: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    border: 'border-purple-400/30',
    glow: 'shadow-purple-500/20',
    text: 'text-purple-100'
  },
  achievement: {
    bg: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    border: 'border-yellow-400/30',
    glow: 'shadow-yellow-500/20',
    text: 'text-yellow-100'
  },
  launch: {
    bg: 'bg-gradient-to-br from-red-500 to-pink-500',
    border: 'border-red-400/30',
    glow: 'shadow-red-500/20',
    text: 'text-red-100'
  }
}

const categoryLabels = {
  milestone: 'Milestone',
  product: 'Product',
  partnership: 'Partnership',
  achievement: 'Achievement',
  launch: 'Launch'
}

export default function Timeline() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative">
        {/* Enhanced Timeline line with glow effect */}
        <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full shadow-lg"></div>
        <div className="absolute left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-green-400/50 rounded-full blur-sm"></div>
        
        {/* Timeline events */}
        <div className="space-y-16">
          {timelineData.map((event, index) => {
            const styles = categoryStyles[event.category]
            return (
              <div key={index} className="relative flex items-start group">
                {/* Enhanced Timeline dot with animations */}
                <div className={`relative z-20 w-24 h-24 rounded-full ${styles.bg} flex items-center justify-center shadow-2xl ${styles.glow} group-hover:scale-110 transition-all duration-300 ease-out`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">{event.icon}</span>
                  </div>
                  {/* Pulsing ring effect */}
                  <div className={`absolute inset-0 rounded-full ${styles.bg} animate-ping opacity-20`}></div>
                </div>
                
                {/* Event content with modern card design */}
                <div className="ml-12 flex-1 group-hover:translate-x-2 transition-transform duration-300 ease-out">
                  <div className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border ${styles.border} hover:shadow-3xl transition-all duration-300 ease-out group-hover:scale-[1.02]`}>
                    {/* Date and category with modern styling */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-300 tracking-wide">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold text-white ${styles.bg} shadow-lg ${styles.glow} backdrop-blur-sm`}>
                        {categoryLabels[event.category]}
                      </span>
                    </div>
                    
                    {/* Title with enhanced typography */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                      {event.title}
                    </h3>
                    
                    {/* Description with improved readability */}
                    <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                      {event.description}
                    </p>
                    
                    {/* Decorative line */}
                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent group-hover:via-blue-500/50 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Enhanced Future vision section */}
      <div className="mt-20 text-center">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-12 border border-white/10 shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6 shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Looking Forward
            </h3>
            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              We continue to innovate and push the boundaries of color technology, 
              with exciting new products and partnerships on the horizon. Our journey 
              is just beginning, and the future holds endless possibilities.
            </p>
            
            {/* Call to action */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <span className="text-white font-semibold">Explore Our Products</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-lg">
                <span className="text-white font-semibold">Join Our Journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
