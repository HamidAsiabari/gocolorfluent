'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

interface BlogPost {
  id: number
  title: string
  author: string
  'publish-date': string
  'main-photo': string
  brief: string
  content: Array<{
    type: string
    value: string
    url?: string
  }>
}

interface BlogData {
  posts: BlogPost[]
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load blog posts from JSON file
    fetch('/blog-content/posts.json')
      .then(response => response.json())
      .then((data: BlogData) => {
        setBlogPosts(data.posts)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading blog posts:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Color Fluent Blog</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Insights, tutorials, and stories from the world of professional color technology
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading blog posts...</div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden hover:border-blue-500 transition-all duration-300">
                {/* Post Image */}
                <div className="h-48 relative overflow-hidden">
                  {post['main-photo'] ? (
                    <img 
                      src={post['main-photo']} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <span className="text-4xl">📄</span>
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.brief}</p>

                  {/* Author and Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{post.author}</p>
                        <p className="text-gray-400 text-xs">{post['publish-date']}</p>
                      </div>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link 
                    href={`/blog/${post.id}`} 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 w-full text-center"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

