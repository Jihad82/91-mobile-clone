

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
import NewsPage from './components/NewsPage';
import ArticlePage from './components/ArticlePage';
import ComparePage from './components/ComparePage';
import ProductSpecsPage from './components/ProductSpecsPage';
import { DataProvider, useData, SearchCriteria } from './context/DataContext';
import { Icons } from './components/Icon';
import { Product, NewsItem } from './types';

// Home Content View
const HomeView = ({ 
    onArticleClick, 
    onProductClick,
    externalSearch
  }: { 
    onArticleClick: (article: NewsItem) => void,
    onProductClick: (product: Product) => void,
    externalSearch?: SearchCriteria | null
  }) => {
  const { upcomingPhones, popularPhones, latestNews, hindiNews, stories, searchProducts } = useData();
  
  // Search State
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);

  // Effect to handle search from Header
  useEffect(() => {
    if (externalSearch) {
        handleSearch(externalSearch);
    }
  }, [externalSearch]);

  const handleSearch = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    const results = searchProducts(criteria);
    setSearchResults(results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchCriteria(null);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />

      {searchResults ? (
        <div className="container mx-auto max-w-[1200px] px-4 py-8 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Search Results</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Found {searchResults.length} items 
                        {searchCriteria?.category && ` • Category: ${searchCriteria.category}`}
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
             
             <ProductRail title="" products={searchResults} onProductClick={onProductClick} />
        </div>
      ) : (
        <>
          <BrandCarousel />
          <ProductRail title="Upcoming Mobiles" products={upcomingPhones} onProductClick={onProductClick} />
          <ProductRail title="Latest and Popular Mobiles" products={popularPhones} onProductClick={onProductClick} />
          <NewsSection title="Latest News" news={latestNews} onArticleClick={onArticleClick} />
          <NewsSection title="समाचार" news={hindiNews} isHindi={true} onArticleClick={onArticleClick} />
          <StoriesSection stories={stories} onArticleClick={onArticleClick} />
          <DeepDiveSection />
        </>
      )}
    </>
  );
};

// Root App Component
function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'news' | 'article' | 'compare' | 'specs'>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [globalSearch, setGlobalSearch] = useState<SearchCriteria | null>(null);

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

  const handleNavigate = (view: string) => {
    if (view === 'home' || view === 'news' || view === 'compare') {
      setCurrentView(view as any);
      window.scrollTo(0, 0);
    }
  };

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
    setCurrentView('article');
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('specs');
    window.scrollTo(0, 0);
  };

  const handleGlobalSearch = (criteria: SearchCriteria) => {
    setGlobalSearch(criteria);
    setCurrentView('home');
  };

  return (
    <DataProvider>
      {isAdmin ? (
        <AdminDashboard onExit={() => setIsAdmin(false)} />
      ) : (
        <div className="min-h-screen flex flex-col font-sans text-secondary bg-white dark:bg-gray-900 transition-colors duration-300 relative pb-20">
          <Header 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            onSearch={handleGlobalSearch}
            onNavigate={handleNavigate}
          />
          
          {currentView === 'home' && (
            <HomeView 
                onArticleClick={handleArticleClick} 
                onProductClick={handleProductClick} 
                externalSearch={globalSearch}
            />
          )}
          {currentView === 'news' && <NewsPage onArticleClick={handleArticleClick} />}
          {currentView === 'compare' && <ComparePage />}
          {currentView === 'article' && selectedArticle && (
            <ArticlePage 
              article={selectedArticle} 
              onNavigate={handleNavigate} 
              onArticleClick={handleArticleClick}
            />
          )}
          {currentView === 'specs' && selectedProduct && (
            <ProductSpecsPage 
              product={selectedProduct} 
              onNavigate={handleNavigate} 
            />
          )}

          <Footer />
          
          {/* Hide Floating Bar on Compare Page to avoid redundancy */}
          {currentView !== 'compare' && <CompareFloatBar />}

          <button 
            onClick={() => setIsAdmin(true)}
            className="fixed bottom-24 right-6 w-14 h-14 bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary transition-all z-30 group border-2 border-white/20"
            title="Open Admin Panel"
          >
            <Icons.Settings className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      )}
    </DataProvider>
  );
}

export default App;
