import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TrendingSection = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(`${API}/products/trending?limit=6`);
        setTrendingProducts(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <div className="mb-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent flex items-center">
          <span className="text-4xl mr-3">🔥</span>
          Trending Now
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Live Updates
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingProducts.map((product, index) => (
          <div 
            key={product.id}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-gray-100"
          >
            {/* Trending rank badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-sm font-bold">
                {index + 1}
              </div>
            </div>

            {/* Trend score */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                🔥 {product.trend_score}
              </div>
            </div>

            {/* Product Image */}
            <div className="relative overflow-hidden">
              <img 
                src={product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Product Info */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <div className="flex items-center text-yellow-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-gray-600">
                    {product.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">${product.original_price}</span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {product.reviews_count} reviews
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 2).map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium">
                  Quick View
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Trending animation */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          </div>
        ))}
      </div>

      {/* Trending stats */}
      <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {trendingProducts.reduce((sum, product) => sum + product.trend_score, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Trend Score</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {trendingProducts.reduce((sum, product) => sum + product.reviews_count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {trendingProducts.filter(product => product.rating > 4.5).length}
            </div>
            <div className="text-sm text-gray-600">Highly Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;