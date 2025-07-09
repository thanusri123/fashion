import React, { useState } from 'react';

const SearchFilters = ({ filters, availableFilters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterUpdate('search', searchQuery);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      brand: '',
      search: '',
      min_price: 0,
      max_price: 1000,
      sizes: '',
      colors: '',
      tags: ''
    };
    setSearchQuery('');
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 0 && value !== 1000
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, or styles..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
        >
          <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="font-medium">
            {isExpanded ? 'Hide Filters' : 'Show Filters'}
          </span>
          {hasActiveFilters && (
            <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
              Active
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fadeIn">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterUpdate('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Categories</option>
              {availableFilters.categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterUpdate('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Brands</option>
              {availableFilters.brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterUpdate('min_price', parseFloat(e.target.value) || 0)}
                placeholder="Min"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <input
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterUpdate('max_price', parseFloat(e.target.value) || 1000)}
                placeholder="Max"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Sizes Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.sizes.slice(0, 6).map(size => (
                <button
                  key={size}
                  onClick={() => {
                    const selectedSizes = filters.sizes ? filters.sizes.split(',') : [];
                    const newSizes = selectedSizes.includes(size)
                      ? selectedSizes.filter(s => s !== size)
                      : [...selectedSizes, size];
                    handleFilterUpdate('sizes', newSizes.join(','));
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.sizes && filters.sizes.includes(size)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.colors.slice(0, 6).map(color => (
                <button
                  key={color}
                  onClick={() => {
                    const selectedColors = filters.colors ? filters.colors.split(',') : [];
                    const newColors = selectedColors.includes(color)
                      ? selectedColors.filter(c => c !== color)
                      : [...selectedColors, color];
                    handleFilterUpdate('colors', newColors.join(','));
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.colors && filters.colors.includes(color)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableFilters.tags.slice(0, 6).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    const selectedTags = filters.tags ? filters.tags.split(',') : [];
                    const newTags = selectedTags.includes(tag)
                      ? selectedTags.filter(t => t !== tag)
                      : [...selectedTags, tag];
                    handleFilterUpdate('tags', newTags.join(','));
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.tags && filters.tags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value !== '' && value !== 0 && value !== 1000) {
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium"
                    >
                      {key}: {value}
                      <button
                        onClick={() => handleFilterUpdate(key, key === 'min_price' ? 0 : key === 'max_price' ? 1000 : '')}
                        className="ml-2 text-purple-400 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;