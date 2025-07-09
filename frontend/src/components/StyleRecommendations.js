import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StyleRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stylePreferences, setStylePreferences] = useState({
    style_type: 'casual',
    occasion: 'everyday',
    budget_max: 500,
    preferred_colors: [],
    preferred_categories: []
  });

  const styleTypes = [
    { id: 'casual', name: 'Casual', icon: '👕', description: 'Comfortable everyday wear' },
    { id: 'formal', name: 'Formal', icon: '👔', description: 'Professional and elegant' },
    { id: 'streetwear', name: 'Streetwear', icon: '🧢', description: 'Urban and trendy' },
    { id: 'bohemian', name: 'Bohemian', icon: '🌸', description: 'Free-spirited and artistic' },
    { id: 'minimalist', name: 'Minimalist', icon: '⚪', description: 'Clean and simple' },
    { id: 'vintage', name: 'Vintage', icon: '🕰️', description: 'Classic and timeless' }
  ];

  const occasions = [
    { id: 'everyday', name: 'Everyday', icon: '🌅' },
    { id: 'work', name: 'Work', icon: '💼' },
    { id: 'party', name: 'Party', icon: '🎉' },
    { id: 'date', name: 'Date', icon: '💕' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'workout', name: 'Workout', icon: '🏋️' }
  ];

  const colorOptions = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#ffffff' },
    { name: 'Gray', value: 'gray', hex: '#6b7280' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Red', value: 'red', hex: '#ef4444' },
    { name: 'Green', value: 'green', hex: '#10b981' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
    { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
    { name: 'Yellow', value: 'yellow', hex: '#f59e0b' },
    { name: 'Brown', value: 'brown', hex: '#a3a3a3' }
  ];

  const categoryOptions = [
    'Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Jackets', 'Hoodies'
  ];

  useEffect(() => {
    generateRecommendations();
  }, [stylePreferences]);

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Create style-based recommendations using existing products
      const response = await axios.get(`${API}/products?limit=12`);
      const allProducts = response.data;

      // Filter products based on preferences
      let filteredProducts = allProducts.filter(product => {
        // Filter by budget
        if (product.price > stylePreferences.budget_max) return false;
        
        // Filter by preferred colors
        if (stylePreferences.preferred_colors.length > 0) {
          const hasPreferredColor = product.colors.some(color => 
            stylePreferences.preferred_colors.includes(color.toLowerCase())
          );
          if (!hasPreferredColor) return false;
        }
        
        // Filter by preferred categories
        if (stylePreferences.preferred_categories.length > 0) {
          if (!stylePreferences.preferred_categories.includes(product.category)) return false;
        }
        
        return true;
      });

      // If no products match preferences, use all products
      if (filteredProducts.length === 0) {
        filteredProducts = allProducts;
      }

      // Generate outfit combinations
      const outfitRecommendations = generateOutfits(filteredProducts);
      setRecommendations(outfitRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOutfits = (products) => {
    const outfits = [];
    const selectedStyle = styleTypes.find(style => style.id === stylePreferences.style_type);
    
    // Group products by category
    const productsByCategory = products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});

    // Generate outfit combinations
    for (let i = 0; i < 6; i++) {
      const outfit = {
        id: `outfit-${i}`,
        name: `${selectedStyle.name} Look ${i + 1}`,
        occasion: stylePreferences.occasion,
        style_type: stylePreferences.style_type,
        products: [],
        total_price: 0,
        style_score: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
        description: getOutfitDescription(stylePreferences.style_type, stylePreferences.occasion)
      };

      // Add products from different categories
      const categories = Object.keys(productsByCategory);
      const selectedCategories = categories.slice(0, Math.min(3, categories.length));
      
      selectedCategories.forEach(category => {
        const categoryProducts = productsByCategory[category];
        if (categoryProducts.length > 0) {
          const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
          outfit.products.push(randomProduct);
          outfit.total_price += randomProduct.price;
        }
      });

      if (outfit.products.length > 0) {
        outfits.push(outfit);
      }
    }

    return outfits;
  };

  const getOutfitDescription = (styleType, occasion) => {
    const descriptions = {
      casual: {
        everyday: 'Perfect for running errands or meeting friends',
        work: 'Casual Friday vibes with a professional touch',
        party: 'Relaxed party look that\'s comfortable and stylish',
        date: 'Casual date outfit that\'s effortlessly chic',
        travel: 'Comfortable travel outfit for long journeys',
        workout: 'Stylish athleisure perfect for the gym'
      },
      formal: {
        everyday: 'Elevated everyday look with sophisticated details',
        work: 'Classic business attire for important meetings',
        party: 'Elegant party ensemble for special occasions',
        date: 'Sophisticated date night outfit',
        travel: 'Polished travel look for business trips',
        workout: 'Refined activewear for upscale fitness classes'
      },
      streetwear: {
        everyday: 'Urban-inspired look with trendy pieces',
        work: 'Street style meets workplace appropriate',
        party: 'Edgy party outfit with urban flair',
        date: 'Cool and casual date look with street style',
        travel: 'Comfortable streetwear for city exploration',
        workout: 'Hip activewear with street style influence'
      }
    };

    return descriptions[styleType]?.[occasion] || 'Curated outfit based on your style preferences';
  };

  const toggleColorPreference = (color) => {
    setStylePreferences(prev => ({
      ...prev,
      preferred_colors: prev.preferred_colors.includes(color)
        ? prev.preferred_colors.filter(c => c !== color)
        : [...prev.preferred_colors, color]
    }));
  };

  const toggleCategoryPreference = (category) => {
    setStylePreferences(prev => ({
      ...prev,
      preferred_categories: prev.preferred_categories.includes(category)
        ? prev.preferred_categories.filter(c => c !== category)
        : [...prev.preferred_categories, category]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StyleCurator
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Style Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover personalized outfit recommendations based on your style preferences and occasions
          </p>
        </div>

        {/* Style Preferences */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Style</h2>
          
          <div className="space-y-6">
            {/* Style Type */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Style Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {styleTypes.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setStylePreferences(prev => ({ ...prev, style_type: style.id }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      stylePreferences.style_type === style.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Occasion</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {occasions.map(occasion => (
                  <button
                    key={occasion.id}
                    onClick={() => setStylePreferences(prev => ({ ...prev, occasion: occasion.id }))}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                      stylePreferences.occasion === occasion.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{occasion.icon}</div>
                    <div className="font-medium text-sm">{occasion.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Budget (Max per item)</h3>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">$0</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={stylePreferences.budget_max}
                  onChange={(e) => setStylePreferences(prev => ({ ...prev, budget_max: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-600">$1000</span>
                <span className="font-semibold text-purple-600 min-w-[80px]">
                  ${stylePreferences.budget_max}
                </span>
              </div>
            </div>

            {/* Color Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Preferred Colors</h3>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => toggleColorPreference(color.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      stylePreferences.preferred_colors.includes(color.value)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Preferences */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Preferred Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategoryPreference(category)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 ${
                      stylePreferences.preferred_categories.includes(category)
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Style Recommendations</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(outfit => (
                <div key={outfit.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {/* Outfit Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{outfit.name}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">Style Score:</span>
                        <span className="font-bold">{outfit.style_score}</span>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">{outfit.description}</p>
                  </div>

                  {/* Products */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      {outfit.products.map((product, index) => (
                        <div key={product.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <img 
                            src={product.images[0] || 'https://via.placeholder.com/50x50'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.brand}</div>
                          </div>
                          <div className="text-sm font-semibold">${product.price}</div>
                        </div>
                      ))}
                    </div>

                    {/* Outfit Total */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-green-600">${outfit.total_price.toFixed(2)}</span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                      View Outfit Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleRecommendations;