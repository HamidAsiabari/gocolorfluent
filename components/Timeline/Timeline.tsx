'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

interface TimelineEvent {
  date: string
  title: string
  description: string
  category: 'milestone' | 'product' | 'partnership' | 'achievement' | 'launch'
  icon: string
}

const timelineData: TimelineEvent[] = [
  {
    date: '2021-10-01',
    title: 'MTA Mentorship Program Begins',
    description: 'Officially started our mentorship with MTA (Manufacturing Technology Association), attending insightful webinars and beginning transformative testing to perfect ColorFluent\'s hair dyeing prototype.',
    category: 'milestone',
    icon: '🎓'
  },
  {
    date: '2022-01-01',
    title: 'Social Media & R&D Expansion',
    description: 'Strengthened our social media channels and boosted R&D activities across multiple dimensions to accelerate product development.',
    category: 'milestone',
    icon: '📱'
  },
  {
    date: '2022-04-01',
    title: 'Business Registration & Patent Filing',
    description: 'Completed business registration in Canada, began MVP development activities, and applied for US Provisional Patent to protect our intellectual property.',
    category: 'achievement',
    icon: '📋'
  },
  {
    date: '2022-07-01',
    title: 'UI Design & Website Enhancement',
    description: 'Developed comprehensive UI design for the mobile app, enhanced website materials, and improved physical MVP features for better user experience.',
    category: 'product',
    icon: '🎨'
  },
  {
    date: '2022-10-01',
    title: 'Device Integration & SWOT Analysis',
    description: 'Completed device integration for final testing, conducted comprehensive SWOT analysis to identify strengths, weaknesses, threats, and opportunities.',
    category: 'milestone',
    icon: '🔍'
  },
  {
    date: '2023-01-01',
    title: 'Website Redesign & Marketing Content',
    description: 'Boosted research repository, improved website SEO, redesigned UX/UI for enhanced user experience, and created engaging motion graphics and marketing videos.',
    category: 'product',
    icon: '💻'
  },
  {
    date: '2023-04-01',
    title: 'Investor Pitch Deck & Market Research',
    description: 'Crafted persuasive investor pitch deck for ColorFluent\'s growth, expanded research on sustainability and market expansion, and created informative blog posts.',
    category: 'achievement',
    icon: '📊'
  },
  {
    date: '2023-07-01',
    title: 'Brand Identity & Customer Support',
    description: 'Conducted ongoing competitor analysis, set up customer support systems, established testing partnerships, and created new brand identity with updated ColorFluent logo.',
    category: 'milestone',
    icon: '🎯'
  },
  {
    date: '2023-10-01',
    title: 'Advanced Hardware Development',
    description: 'Developed innovative hardware features including Child Lock System, Replaceable Color Cartridges, Rechargeable Battery, Color Detector & Analyzer, and Hair Dryness & Softness Detection Sensors.',
    category: 'product',
    icon: '🔧'
  },
  {
    date: '2024-04-01',
    title: 'Commercial Manufacturing Begins',
    description: 'Started manufacturing two commercial models: Professional Salon Model & Home Consumer Model, with product box design, supplier coordination, and quality control implementation.',
    category: 'launch',
    icon: '🏭'
  },
  {
    date: '2024-07-01',
    title: 'Product Testing & Customer Feedback',
    description: 'Conducted product testing and trial sales in Iran under CPO, CMO, and CCO supervision, collected customer feedback from salon and home users, and enhanced performance based on results.',
    category: 'launch',
    icon: '🧪'
  },
  {
    date: '2024-10-01',
    title: 'Canadian Market Expansion Planning',
    description: 'Began investor research and early-stage meetings in Canada, conducted market feasibility analysis for local production, and researched manufacturing certifications (CSA, UL, Intertek, Health Canada).',
    category: 'milestone',
    icon: '🇨🇦'
  },
  {
    date: '2025-01-01',
    title: 'Certification & Funding Preparation',
    description: 'Continued product certification and compliance preparations, created technical documentation for certification bodies, attended startup investor sessions, and explored funding options and innovation grants.',
    category: 'achievement',
    icon: '📜'
  },
  {
    date: '2025-04-01',
    title: 'Pre-Launch Planning & Partnerships',
    description: 'Implemented investor feedback on device improvements, conducted enhanced UI/UX and mobile app connectivity testing, and began pre-launch planning for Canadian market entry.',
    category: 'launch',
    icon: '🚀'
  },
  {
    date: '2025-07-01',
    title: 'Safety Certification & Investor Partnership',
    description: 'Contacted UL and Intertek for safety certification, attended IRAP workshops, participated in Toronto startup events, and signed MOU with Delmarian Company as investor partner.',
    category: 'partnership',
    icon: '🤝'
  },
  {
    date: '2025-09-01',
    title: 'Team Expansion & Website Redevelopment',
    description: 'Completed Agile Project Management training, conducted internal meetings with CPO, CMO & CCO, published volunteer recruitment, and started website redevelopment project with new team member.',
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Memoized filtered events for performance
  const filteredEvents = useMemo(() => {
    return timelineData.filter(event => {
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  // Memoized categories for performance
  const categories = useMemo(() => [
    { key: 'all', label: 'All Events', count: timelineData.length },
    { key: 'milestone', label: 'Milestones', count: timelineData.filter(e => e.category === 'milestone').length },
    { key: 'product', label: 'Products', count: timelineData.filter(e => e.category === 'product').length },
    { key: 'achievement', label: 'Achievements', count: timelineData.filter(e => e.category === 'achievement').length },
    { key: 'launch', label: 'Launches', count: timelineData.filter(e => e.category === 'launch').length },
    { key: 'partnership', label: 'Partnerships', count: timelineData.filter(e => e.category === 'partnership').length }
  ], [])

  // Memoized callbacks for performance
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedCategory('all')
  }, [])

  // Faster loading simulation
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 150)
    return () => clearTimeout(timer)
  }, [selectedCategory, searchTerm])

  // Show timeline after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" ref={timelineRef}>
      {/* Enhanced Filter and Search Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Search timeline events..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryChange(category.key)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.key
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Enhanced Timeline line with glow effect */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full shadow-lg"></div>
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-green-400/50 rounded-full blur-sm"></div>
        
        {/* Timeline events */}
        <div className="space-y-20">
          {filteredEvents.map((event, index) => {
            const styles = categoryStyles[event.category]
            const isEven = index % 2 === 0
            
            return (
              <div 
                key={index} 
                className={`timeline-event relative flex items-start group transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Enhanced Timeline dot with animations */}
                <div className={`relative z-20 w-16 h-16 md:w-24 md:h-24 rounded-full ${styles.bg} flex items-center justify-center shadow-2xl ${styles.glow} group-hover:scale-110 transition-all duration-300 ease-out`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg md:text-2xl">{event.icon}</span>
                  </div>
                  {/* Pulsing ring effect */}
                  <div className={`absolute inset-0 rounded-full ${styles.bg} animate-ping opacity-20`}></div>
                </div>
                
                {/* Event content with modern card design */}
                <div className={`ml-8 md:ml-12 flex-1 group-hover:translate-x-2 transition-transform duration-300 ease-out ${
                  isEven ? 'md:ml-12' : 'md:ml-12'
                }`}>
                  <div className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border ${styles.border} hover:shadow-3xl transition-all duration-300 ease-out group-hover:scale-[1.02] relative overflow-hidden group-hover:border-opacity-50`}>
                    {/* Enhanced background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
                    
                    {/* Date and category with modern styling */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <span className="text-sm font-semibold text-gray-300 tracking-wide">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold text-white ${styles.bg} shadow-lg ${styles.glow} backdrop-blur-sm w-fit`}>
                        {categoryLabels[event.category]}
                      </span>
                    </div>
                    
                    {/* Title with enhanced typography */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                      {event.title}
                    </h3>
                    
                    {/* Description with improved readability */}
                    <p className="text-gray-300 leading-relaxed text-base md:text-lg group-hover:text-gray-200 transition-colors duration-300">
                      {event.description}
                    </p>
                    
                    {/* Decorative line */}
                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent group-hover:via-blue-500/50 transition-colors duration-300"></div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* No results state */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 shadow-2xl max-w-md mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Events Found</h3>
            <p className="text-gray-300 mb-6">
              Try adjusting your search terms or category filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Future vision section */}
      {filteredEvents.length > 0 && (
        <div className="mt-24 text-center">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl group hover:shadow-3xl transition-all duration-500">
            {/* Enhanced background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-8 shadow-lg hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                Looking Forward
              </h3>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-5xl mx-auto mb-10">
                As we approach the end of 2025, ColorFluent continues to innovate in hair color technology. 
                With our safety certifications in progress, investor partnerships secured, and team expansion underway, 
                we're preparing for our official Canadian market launch. Our journey from a mentorship program in 2021 
                to a fully-fledged technology company demonstrates our commitment to revolutionizing hair coloring experiences.
              </p>
              
              {/* Enhanced Call to action */}
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="group/btn px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105">
                  <span className="text-white font-semibold group-hover/btn:text-blue-300 transition-colors duration-300">Explore Our Products</span>
                </button>
                <button className="group/btn px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105">
                  <span className="text-white font-semibold">Join Our Journey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
