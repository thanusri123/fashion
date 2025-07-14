import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from './components/ProductGrid';
import TrendingSection from './components/TrendingSection';
import SearchFilters from './components/SearchFilters';
import ProductDetails from './components/ProductDetails';
import StyleRecommendations from './components/StyleRecommendations';
import HeroSection from './components/HeroSection';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    search: '',
    min_price: 0,
    max_price: 1000,
    sizes: '',
    colors: '',
    tags: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    tags: []
  });

 

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  const handleSearch = (searchQuery) => {
    const newFilters = { ...filters, search: searchQuery };
    handleFilterChange(newFilters);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                products={products}
                loading={loading}
                filters={filters}
                availableFilters={availableFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onFetchProducts={fetchProducts}
              />
            } 
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/recommendations" element={<StyleRecommendations />} />
        </Routes>
      </div>
    </Router>
  );
}

const HomePage = ({ 
  products, 
  loading, 
  filters, 
  availableFilters, 
  onFilterChange, 
  onSearch, 
  onFetchProducts 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StyleCurator
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/recommendations" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Style Recommendations
              </Link>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onSearch={onSearch} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Section */}
        <TrendingSection />

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters 
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>

        {/* Style Inspiration Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Style Inspiration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Casual Chic", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop", description: "Effortless everyday style" },
              { title: "Business Professional", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop", description: "Power dressing for success" },
              { title: "Weekend Vibes", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop", description: "Relaxed and comfortable" }
            ].map((style, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={style.image} 
                    alt={style.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{style.title}</h3>
                    <p className="text-sm opacity-90">{style.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Stay in Style</h2>
          <p className="text-xl mb-6 opacity-90">Get the latest fashion trends and styling tips delivered to your inbox</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-r-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StyleCurator</h3>
              <p className="text-gray-400">Discover your perfect style with AI-powered recommendations</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StyleCurator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
