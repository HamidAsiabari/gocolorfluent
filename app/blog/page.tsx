'use client'

import { useState } from 'react'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Professional Color Application Technology',
      excerpt: 'Exploring how advanced color sensing and precision mechanics are revolutionizing the creative industry.',
      content: 'In this comprehensive article, we dive deep into the technological innovations that make Color Fluent the leading choice for professional artists and designers...',
      author: 'Dr. Sarah Chen',
      date: '2024-01-15',
      category: 'technology',
      readTime: '8 min read',
      image: '/api/placeholder/600/400',
      tags: ['Technology', 'Innovation', 'Color Science']
    },
    {
      id: 2,
      title: 'Understanding Color Sensor Technology: A Deep Dive',
      excerpt: 'Learn about the advanced color sensor PCB technology that powers Color Fluent\'s precision detection capabilities.',
      content: 'Color sensors are the heart of any professional color application system. In this technical deep dive, we explore how our proprietary sensor technology works...',
      author: 'Michael Rodriguez',
      date: '2024-01-10',
      category: 'technical',
      readTime: '12 min read',
      image: '/api/placeholder/600/400',
      tags: ['Technical', 'Sensors', 'Electronics']
    },
    {
      id: 3,
      title: 'Professional Artist Spotlight: Maria Gonzalez',
      excerpt: 'Meet Maria Gonzalez, a renowned digital artist who uses Color Fluent Pro in her award-winning creative process.',
      content: 'Maria Gonzalez has been creating stunning digital artwork for over a decade. In this exclusive interview, she shares how Color Fluent has transformed her workflow...',
      author: 'Emily Watson',
      date: '2024-01-05',
      category: 'spotlight',
      readTime: '6 min read',
      image: '/api/placeholder/600/400',
      tags: ['Artist Spotlight', 'Case Study', 'Creative Process']
    },
    {
      id: 4,
      title: 'LED Lighting Systems for Color Accuracy',
      excerpt: 'How professional LED lighting enhances color detection and application precision in digital art workflows.',
      content: 'Lighting is crucial for accurate color detection and application. Our LED lighting system has been specifically designed to provide optimal illumination...',
      author: 'Dr. Emily Watson',
      date: '2024-01-01',
      category: 'technical',
      readTime: '10 min read',
      image: '/api/placeholder/600/400',
      tags: ['LED Technology', 'Color Accuracy', 'Lighting']
    },
    {
      id: 5,
      title: 'Studio Setup Guide: Optimizing Your Color Fluent Workflow',
      excerpt: 'A comprehensive guide to setting up your studio for maximum efficiency with Color Fluent products.',
      content: 'Setting up your studio properly can significantly impact your productivity and the quality of your work. This guide covers everything from workspace layout to calibration...',
      author: 'James Park',
      date: '2023-12-28',
      category: 'tutorial',
      readTime: '15 min read',
      image: '/api/placeholder/600/400',
      tags: ['Tutorial', 'Studio Setup', 'Workflow']
    },
    {
      id: 6,
      title: 'Color Fluent Pro vs Studio: Which Model is Right for You?',
      excerpt: 'A detailed comparison of our professional and studio models to help you choose the perfect Color Fluent device.',
      content: 'Choosing the right Color Fluent model depends on your specific needs, budget, and workflow requirements. This comparison breaks down the key differences...',
      author: 'Sarah Chen',
      date: '2023-12-20',
      category: 'comparison',
      readTime: '7 min read',
      image: '/api/placeholder/600/400',
      tags: ['Product Comparison', 'Buying Guide', 'Features']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'technology', name: 'Technology' },
    { id: 'technical', name: 'Technical' },
    { id: 'spotlight', name: 'Artist Spotlight' },
    { id: 'tutorial', name: 'Tutorial' },
    { id: 'comparison', name: 'Comparison' }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPost = blogPosts[0]

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
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="/blog" className="text-white font-semibold">Blog</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Color Fluent Blog</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and stories from the world of professional color technology
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">Featured Article</h3>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-6xl">📝</span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-400 text-sm">{featuredPost.readTime}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{featuredPost.title}</h4>
                <p className="text-gray-300 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{featuredPost.author}</p>
                      <p className="text-gray-400 text-sm">{featuredPost.date}</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2 border border-gray-600">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden hover:border-blue-500 transition-all duration-300">
              {/* Post Image */}
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{post.author}</p>
                      <p className="text-gray-400 text-xs">{post.date}</p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">
                    Read →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights, tutorials, and product updates from Color Fluent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Popular Topics</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Color Technology', 'Professional Tools', 'Digital Art', 'Precision Engineering', 'LED Lighting', 'Color Accuracy', 'Studio Setup', 'Product Reviews'].map((tag, index) => (
              <span key={index} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
