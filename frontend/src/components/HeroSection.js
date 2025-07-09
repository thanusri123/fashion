import React, { useState } from 'react';

const HeroSection = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 opacity-90"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeInUp">
          Discover Your
          <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent animate-pulse">
            Perfect Style
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
          Curated fashion finds powered by AI recommendations. Find your signature look from thousands of trending pieces.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fadeInUp animation-delay-400">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for styles, brands, or items..."
              className="w-full px-6 py-4 text-lg rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fadeInUp animation-delay-600">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Recommendations</h3>
            <p className="text-white/80">Personalized style suggestions based on your preferences</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-white mb-2">Trending Now</h3>
            <p className="text-white/80">Stay ahead with the latest fashion trends and styles</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Curated Collections</h3>
            <p className="text-white/80">Handpicked pieces from top brands and emerging designers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;