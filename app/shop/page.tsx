'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import TopMenu from '../../components/TopMenu'
import Footer from '../../components/Footer'

export default function Shop() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const product = {
    id: 'color-fluent-device',
    name: 'Color Fluent Smart Hair Coloring Device',
    price: 399,
    originalPrice: 499,
    discount: 20,
    description: 'The revolutionary smart hair coloring device that brings salon-quality results to your home. Features intelligent color matching, guided application, and seamless app integration.',
    features: [
      'Smart color detection and matching',
      'Guided step-by-step application',
      'Wi-Fi connectivity for updates',
      'Customizable color profiles',
      'Professional-grade precision',
      'Easy cleanup and maintenance'
    ],
    specifications: {
      'Battery Life': 'Up to 2 hours continuous use',
      'Charging Time': '3 hours for full charge',
      'Connectivity': 'Wi-Fi 802.11 b/g/n',
      'Weight': '1.2 lbs (0.54 kg)',
      'Dimensions': '8.5" x 3.2" x 2.1"',
      'Warranty': '2 years manufacturer warranty'
    },
    stock: 0, // Currently out of stock
    images: [
      '/shop/1.png',
      '/shop/2.png',
      '/shop/3.png'
    ]
  }

  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 internal-page">
      {/* Top Menu */}
      <TopMenu />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ paddingTop: '190px' }}>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Product Images Slider */}
          <div className="space-y-6">
            {/* Main Image Slider */}
            <div className="relative bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600 overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  {product.discount}% OFF
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % product.images.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative bg-black/20 backdrop-blur-sm rounded-lg border p-2 group hover:bg-black/30 transition-all duration-300 ${
                    currentImageIndex === index ? 'border-logo-bg bg-logo-bg/10' : 'border-gray-600'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-20 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                  />
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-logo-bg/20 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-logo-bg rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Product Title and Price */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {product.name}
              </h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-logo-bg">
                  ${product.price}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${product.originalPrice - product.price}
                </span>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className={`p-3 rounded-lg border ${isOutOfStock ? 'bg-red-900/20 border-red-500/30' : 'bg-green-900/20 border-green-500/30'}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-300' : 'text-green-300'}`}>
                  {isOutOfStock ? 'Currently Out of Stock' : 'In Stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                disabled={isOutOfStock}
                className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-logo-bg hover:bg-logo-bg/80 text-white hover:scale-105 transform'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart - $399'}
              </button>
              
              {!isOutOfStock && (
                <button className="w-full py-4 px-8 rounded-lg font-semibold text-lg border-2 border-logo-bg text-logo-bg hover:bg-logo-bg hover:text-white transition-all duration-300">
                  Buy Now
                </button>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-logo-bg rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-600 p-6 sm:p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-300 font-medium">{key}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Ready to Transform Your Hair Coloring Experience?</h3>
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30 p-6 sm:p-8 mb-8">
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
              Join thousands of satisfied customers who have revolutionized their hair coloring routine with Color Fluent.
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
                Contact Us
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
