'use client'

import { useState } from 'react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  description: string
  image: string
  inStock: boolean
  rating: number
  reviews: number
  features: string[]
}

export default function Shop() {
  const [cart, setCart] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)

  const products = [
    {
      id: 1,
      name: 'Color Fluent Pro',
      price: 2499,
      originalPrice: 2999,
      discount: 17,
      description: 'Professional-grade color brush assembly with advanced sensing technology',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      inStock: true,
      rating: 4.9,
      reviews: 127,
      features: ['Color Sensor PCB', 'OLED Display', 'Micro-Gear Motor', 'LED Lighting', '2-Year Warranty']
    },
    {
      id: 2,
      name: 'Color Fluent Studio',
      price: 1899,
      originalPrice: 2299,
      discount: 17,
      description: 'Studio edition with precision mechanics and smart electronics',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      inStock: true,
      rating: 4.8,
      reviews: 89,
      features: ['Precision Mechanics', 'Smart Electronics', 'Professional Lighting', 'Intuitive Controls', '1-Year Warranty']
    },
    {
      id: 3,
      name: 'Color Fluent Basic',
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      description: 'Entry-level model with core functionality and reliable performance',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      inStock: true,
      rating: 4.7,
      reviews: 203,
      features: ['Core Mechanical Components', 'Basic Electronics', 'Standard Lighting', 'Essential Controls', '1-Year Warranty']
    },
    {
      id: 4,
      name: 'Professional Accessories Kit',
      price: 299,
      description: 'Essential accessories for professional color work',
      image: '/product-3d/Color_Brush_assembly_V1_1.glb',
      inStock: true,
      rating: 4.6,
      reviews: 45,
      features: ['Replacement Nozzles', 'Cleaning Kit', 'Calibration Tools', 'User Manual']
    }
  ]

  const addToCart = (product: Product) => {
    setCart([...cart, product])
    setCartCount(cartCount + 1)
  }

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId)
    setCart(updatedCart)
    setCartCount(updatedCart.length)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-white">Color Fluent</h1>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="/catalog" className="text-gray-300 hover:text-white transition-colors">Catalog</a>
                <a href="/shop" className="text-white font-semibold">Shop</a>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                <a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              </nav>
              <button className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Shop Color Fluent</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Purchase professional-grade color brush assemblies with confidence and support
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-black/30 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden hover:border-blue-500 transition-all duration-300">
              {/* Product Image */}
              <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    -{product.discount}%
                  </div>
                )}
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
                <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm ml-2">({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    product.inStock
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Sidebar */}
        {cart.length > 0 && (
          <div className="fixed right-0 top-0 h-full w-96 bg-black/90 backdrop-blur-sm border-l border-gray-600 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
              <button
                onClick={() => setCart([])}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <div>
                    <h4 className="text-white font-semibold">{item.name}</h4>
                    <p className="text-gray-400 text-sm">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total:</span>
                <span className="text-xl font-bold text-white">${getTotalPrice()}</span>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* Special Offers */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Special Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <h4 className="text-xl font-bold mb-4">Free Shipping</h4>
              <p className="text-blue-100 mb-4">Free shipping on all orders over $500</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white">
              <h4 className="text-xl font-bold mb-4">Extended Warranty</h4>
              <p className="text-green-100 mb-4">Add 2 years of additional warranty coverage</p>
              <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

