import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductGrid = ({ products }) => {
  const handleLikeProduct = async (productId) => {
    try {
      await axios.post(`${API}/products/${productId}/like`);
      // Optionally update local state or refetch products
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const formatPrice = (price, originalPrice) => {
    if (originalPrice && originalPrice > price) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">${price}</span>
          <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
            {Math.round((1 - price / originalPrice) * 100)}% OFF
          </span>
        </div>
      );
    }
    return <span className="text-2xl font-bold text-gray-900">${price}</span>;
  };

  const getRandomGradient = () => {
    const gradients = [
      'from-pink-400 to-purple-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-yellow-400 to-orange-500',
      'from-purple-400 to-pink-500',
      'from-indigo-400 to-blue-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Discover Products ({products.length})
        </h2>
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Sort by Trending</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img 
                src={product.images[0] || 'https://via.placeholder.com/300x400?text=No+Image'}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleLikeProduct(product.id)}
                    className="bg-white/90 hover:bg-white text-red-500 p-3 rounded-full transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-white/90 hover:bg-white text-gray-700 px-4 py-3 rounded-full transition-all duration-200 transform hover:scale-110 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Trend score badge */}
              {product.trend_score > 70 && (
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getRandomGradient()}`}>
                    🔥 Trending
                  </span>
                </div>
              )}

              {/* Discount badge */}
              {product.original_price && product.original_price > product.price && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white bg-red-500">
                    SALE
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {product.brand}
                </span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">
                    {product.rating?.toFixed(1) || 'N/A'} ({product.reviews_count})
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-3">
                {formatPrice(product.price, product.original_price)}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    +{product.tags.length - 3} more
                  </span>
                )}
              </div>

              {/* Sizes */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {product.sizes.slice(0, 4).map((size, sizeIndex) => (
                    <span 
                      key={sizeIndex}
                      className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium border border-gray-300 rounded hover:border-purple-500 hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      {size}
                    </span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-medium border border-gray-300 rounded text-gray-500">
                      +{product.sizes.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-1">
                  {product.colors.slice(0, 3).map((color, colorIndex) => (
                    <div 
                      key={colorIndex}
                      className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-purple-500 transition-colors cursor-pointer"
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    ></div>
                  ))}
                  {product.colors.length > 3 && (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{product.colors.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;