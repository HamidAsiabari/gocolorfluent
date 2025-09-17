'use client'

import { useState } from 'react'

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const products = [
    {
      id: 1,
      name: 'Color Fluent Pro',
      category: 'professional',
      description: 'Professional-grade color brush assembly with advanced sensing technology',
      price: '$2,499',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      features: ['Color Sensor PCB', 'OLED Display', 'Micro-Gear Motor', 'LED Lighting']
    },
    {
      id: 2,
      name: 'Color Fluent Studio',
      category: 'studio',
      description: 'Studio edition with precision mechanics and smart electronics',
      price: '$1,899',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      features: ['Precision Mechanics', 'Smart Electronics', 'Professional Lighting', 'Intuitive Controls']
    },
    {
      id: 3,
      name: 'Color Fluent Basic',
      category: 'basic',
      description: 'Entry-level model with core functionality and reliable performance',
      price: '$1,299',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      features: ['Core Mechanical Components', 'Basic Electronics', 'Standard Lighting', 'Essential Controls']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'professional', name: 'Professional' },
    { id: 'studio', name: 'Studio' },
    { id: 'basic', name: 'Basic' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Color Fluent</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/catalog" className="text-white font-semibold">Catalog</a>
              <a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</a>
              <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Product Catalog</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our range of professional color brush assemblies designed for precision and reliability
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2 border border-gray-600">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden hover:border-blue-500 transition-all duration-300">
              {/* Product Image Placeholder */}
              <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <p className="text-gray-400 text-sm">3D Model View</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h3>
            <p className="text-gray-300 mb-6">
              Our team of experts can help you select the perfect Color Fluent model for your needs.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200">
              Contact Our Experts
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
