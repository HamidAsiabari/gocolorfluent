import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import TopMenu from '../../../components/TopMenu'
import Footer from '../../../components/Footer'

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

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    // Read the posts.json file at build time
    const postsPath = path.join(process.cwd(), 'public', 'blog-content', 'posts.json')
    const postsData = JSON.parse(await fs.readFile(postsPath, 'utf8'))
    
    return postsData.posts.map((post: BlogPost) => ({
      id: post.id.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Get blog post data at build time
async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const postsPath = path.join(process.cwd(), 'public', 'blog-content', 'posts.json')
    const postsData = JSON.parse(await fs.readFile(postsPath, 'utf8'))
    const postId = parseInt(id)
    return postsData.posts.find((post: BlogPost) => post.id === postId) || null
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id)

  const renderContent = (contentItem: { type: string; value: string; url?: string }) => {
    switch (contentItem.type) {
      case 'h1':
        return <h1 className="text-4xl font-bold text-white mb-6 mt-8">{contentItem.value}</h1>
      case 'h2':
        return <h2 className="text-3xl font-bold text-white mb-5 mt-7">{contentItem.value}</h2>
      case 'h3':
        return <h3 className="text-2xl font-bold text-white mb-4 mt-6">{contentItem.value}</h3>
      case 'h4':
        return <h4 className="text-xl font-bold text-white mb-3 mt-5">{contentItem.value}</h4>
      case 'h5':
        return <h5 className="text-lg font-bold text-white mb-3 mt-4">{contentItem.value}</h5>
      case 'p':
        return <p className="text-gray-300 mb-4 leading-relaxed whitespace-pre-line">{contentItem.value}</p>
      case 'image':
        return (
          <div className="my-6">
            <img 
              src={contentItem.value} 
              alt="Blog post image" 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )
      case 'link':
        return (
          <div className="my-4">
            <Link 
              href={contentItem.url || '#'} 
              className="text-blue-400 hover:text-blue-300 underline font-semibold"
            >
              {contentItem.value}
            </Link>
          </div>
        )
      default:
        return <p className="text-gray-300 mb-4">{contentItem.value}</p>
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
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
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: '190px' }}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Post Not Found</h2>
            <p className="text-gray-300 mb-6">The requested blog post could not be found.</p>
            <Link 
              href="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: '190px' }}>
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-gray-400 mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{post['publish-date']}</span>
          </div>
          <p className="text-xl text-gray-300 mb-8">{post.brief}</p>
        </div>

        {/* Main Photo */}
        {post['main-photo'] && (
          <div className="mb-8">
            <img 
              src={post['main-photo']} 
              alt={post.title} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Post Content */}
        <article className="prose prose-invert max-w-none">
          {post.content.map((contentItem, index) => (
            <div key={index}>
              {renderContent(contentItem)}
            </div>
          ))}
        </article>

        {/* Post Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="text-white font-semibold">{post.author}</p>
                <p className="text-gray-400 text-sm">Published on {post['publish-date']}</p>
              </div>
            </div>
            <Link 
              href="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
