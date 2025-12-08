import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import BrandCarousel from './components/BrandCarousel';
import ProductRail from './components/ProductRail';
import NewsSection from './components/NewsSection';
import StoriesSection from './components/StoriesSection';
import DeepDiveSection from './components/DeepDiveSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import CompareFloatBar from './components/CompareFloatBar';
import { DataProvider, useData } from './context/DataContext';
import { Icons } from './components/Icon';
import { Product } from './types';

// Main Content Component that consumes Context
const MainContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { upcomingPhones, popularPhones, latestNews, hindiNews, stories, searchProducts } = useData();
  
  // Search State
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<{ minPrice?: number, maxPrice?: number, keyword?: string } | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (criteria: { minPrice?: number, maxPrice?: number, keyword?: string }) => {
    setSearchCriteria(criteria);
    const results = searchProducts(criteria);
    setSearchResults(results);
    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchCriteria(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-secondary bg-white dark:bg-gray-900 transition-colors duration-300 relative pb-20">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onSearch={handleSearch} />
      
      {/* Hero handles search input */}
      <Hero onSearch={handleSearch} />

      {/* Conditionally render content based on search */}
      {searchResults ? (
        <div className="container mx-auto max-w-[1200px] px-4 py-8 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Search Results</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Found {searchResults.length} items 
                        {searchCriteria?.minPrice !== undefined && ` • Price: ₹${searchCriteria.minPrice} - ₹${searchCriteria.maxPrice}`}
                        {searchCriteria?.keyword && ` • Keyword: "${searchCriteria.keyword}"`}
                    </p>
                 </div>
                 <button 
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                 >
                    <Icons.X size={16} /> Clear Search
                 </button>
             </div>
             
             <ProductRail title="" products={searchResults} />
        </div>
      ) : (
        <>
          <BrandCarousel />
          <ProductRail title="Upcoming Mobiles" products={upcomingPhones} />
          <ProductRail title="Latest and Popular Mobiles" products={popularPhones} />
          <NewsSection title="Latest News" news={latestNews} />
          <NewsSection title="समाचार" news={hindiNews} isHindi={true} />
          <StoriesSection stories={stories} />
          <DeepDiveSection />
        </>
      )}

      <Footer />
      <CompareFloatBar />
    </div>
  );
};

// Root App Component handling View State
function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <DataProvider>
      {isAdmin ? (
        <AdminDashboard onExit={() => setIsAdmin(false)} />
      ) : (
        <>
          <MainContent />
          {/* Admin Floating Action Button */}
          <button 
            onClick={() => setIsAdmin(true)}
            className="fixed bottom-24 right-6 w-14 h-14 bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary transition-all z-30 group border-2 border-white/20"
            title="Open Admin Panel"
          >
            <Icons.Settings className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </>
      )}
    </DataProvider>
  );
}

export default App;