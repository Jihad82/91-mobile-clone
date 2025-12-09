
import React, { useState, useMemo } from 'react';
import { Icons } from './Icon';
import { NewsItem } from '../types';
import { useData } from '../context/DataContext';

const AdBanner = ({ label = "Advertisement", className = "" }: { label?: string, className?: string }) => (
  <div className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest ${className}`}>
    {label}
  </div>
);

interface NewsPageProps {
    onArticleClick: (article: NewsItem) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onArticleClick }) => {
  const { articles, categories, tags, authors } = useData();

  // State for Filters & Sort
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeSort, setActiveSort] = useState<'latest' | 'trending' | 'views'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Derived Data
  const publishedArticles = useMemo(() => articles.filter(a => a.status === 'published'), [articles]);

  const filteredArticles = useMemo(() => {
    let result = publishedArticles;

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(a => a.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.subtitle?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort === 'latest') {
      result = result.sort((a,b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
    } else if (activeSort === 'trending') {
      result = result.sort((a,b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
    }
    // 'views' would require view count logic, keeping default for now
    
    return result;
  }, [publishedArticles, activeCategory, searchQuery, activeSort]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const currentItems = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const heroArticle = filteredArticles.find(a => a.isMain) || filteredArticles[0];
  // Exclude hero from main list if it matches
  const displayItems = currentItems.filter(a => a.id !== heroArticle?.id);

  // Trending Sidebar Logic
  const trendingArticles = useMemo(() => publishedArticles.filter(a => a.isTrending).slice(0, 5), [publishedArticles]);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-12 transition-colors duration-300">
      
      {/* Header Area */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto max-w-[1200px] px-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                <span className="hover:text-primary cursor-pointer">Home</span>
                <Icons.ChevronRight size={10} />
                <span className="text-primary">News & Reviews</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Tech News & Reviews</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Latest gadgets, updates, and deep dives from the tech world.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative group w-full md:w-64">
                    <Icons.Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search news..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary outline-none transition-all shadow-sm"
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-8">
            
            {/* Filters & View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button 
                        onClick={() => setActiveCategory('all')} 
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === 'all' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                    >
                        All News
                    </button>
                    {categories.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setActiveCategory(c.name)} 
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeCategory === c.name ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                   <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                       <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-400'}`}><Icons.Grid size={16} /></button>
                       <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-400'}`}><Icons.List size={16} /></button>
                   </div>
                   <select 
                        value={activeSort} 
                        onChange={(e) => setActiveSort(e.target.value as any)}
                        className="bg-transparent text-xs font-bold text-gray-600 dark:text-gray-400 outline-none cursor-pointer"
                   >
                       <option value="latest">Latest First</option>
                       <option value="trending">Trending</option>
                       <option value="views">Most Viewed</option>
                   </select>
                </div>
            </div>

            {/* Hero Article (Only on first page) */}
            {currentPage === 1 && heroArticle && !searchQuery && activeCategory === 'all' && (
                <div 
                    className="relative rounded-2xl overflow-hidden group shadow-xl cursor-pointer mb-10 h-[400px]"
                    onClick={() => onArticleClick(heroArticle)}
                >
                    <img src={heroArticle.heroImage || heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
                        <div className="flex items-center gap-3 mb-3">
                           {heroArticle.isTrending && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">TRENDING</span>}
                           <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide backdrop-blur-sm">{heroArticle.category}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 drop-shadow-md">
                            {heroArticle.title}
                        </h2>
                        <div className="flex items-center gap-4 text-gray-300 text-xs font-bold">
                             <span>{heroArticle.author || '91Mobiles'}</span>
                             <span>•</span>
                             <span>{heroArticle.timeAgo || 'Just now'}</span>
                             <span>•</span>
                             <span>{heroArticle.readTime || '3 min read'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Articles List */}
            {displayItems.length > 0 ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 gap-4'}`}>
                    {displayItems.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => onArticleClick(item)}
                            className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-card-hover hover:border-primary/30 transition-all group cursor-pointer flex ${viewMode === 'list' ? 'flex-row h-40' : 'flex-col h-full'}`}
                        >
                            <div className={`${viewMode === 'list' ? 'w-48 h-full' : 'h-48 w-full'} overflow-hidden relative shrink-0`}>
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1 relative">
                                {item.isReview && item.rating && (
                                     <div className="absolute top-4 right-4 bg-spec-green text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                                        {item.rating} ★
                                     </div>
                                )}
                                <h4 className={`${viewMode === 'list' ? 'text-base' : 'text-lg'} font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2`}>
                                    {item.title}
                                </h4>
                                {viewMode === 'list' && item.subtitle && (
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.subtitle}</p>
                                )}
                                <div className="mt-auto flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600 dark:text-gray-300 font-bold">{item.author || 'Admin'}</span>
                                        <span>•</span>
                                        <span>{item.timeAgo || 'Just now'}</span>
                                    </div>
                                    <span className="flex items-center gap-1"><Icons.Clock size={10} /> {item.readTime || '5m'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Icons.FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-500">No news found</h3>
                    <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                    >
                        <Icons.ChevronLeft size={18} />
                    </button>
                    {Array.from({length: totalPages}).map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrentPage(i+1)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${currentPage === i+1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                     <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                    >
                        <Icons.ChevronRight size={18} />
                    </button>
                </div>
            )}
          
          </div>
          
          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Trending Now */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Icons.TrendingUp size={14} className="text-primary"/> Trending Now
                </h4>
                <ul className="space-y-5">
                    {trendingArticles.length > 0 ? trendingArticles.map((article, i) => (
                         <li key={article.id} onClick={() => onArticleClick(article)} className="flex gap-4 group cursor-pointer">
                            <span className="text-2xl font-black text-gray-200 dark:text-gray-800 group-hover:text-primary/20 transition-colors leading-none mt-1">
                                0{i+1}
                            </span>
                            <div>
                                <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors leading-tight mb-1">
                                    {article.title}
                                </h5>
                                <span className="text-[10px] text-gray-400 font-semibold">{article.timeAgo || 'Recent'}</span>
                            </div>
                        </li>
                    )) : (
                        <li className="text-xs text-gray-400 italic">No trending articles yet.</li>
                    )}
                </ul>
             </div>

             {/* Categories Widget */}
             <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categories</h4>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {categories.map(cat => (
                        <div 
                            key={cat.id} 
                            onClick={() => setActiveCategory(cat.name)}
                            className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-colors"
                        >
                            <span className={`text-xs font-bold ${activeCategory === cat.name ? 'text-primary' : 'text-gray-600 dark:text-gray-400'} group-hover:text-primary`}>{cat.name}</span>
                            <span className="bg-gray-100 dark:bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">{cat.count || 0}</span>
                        </div>
                    ))}
                </div>
             </div>

             {/* Social Widget */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</h4>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { icon: <Icons.Globe size={18}/>, color: "bg-blue-600", label: "FB" },
                        { icon: <Icons.Hash size={18}/>, color: "bg-sky-500", label: "TW" },
                        { icon: <Icons.Camera size={18}/>, color: "bg-pink-600", label: "IG" },
                        { icon: <Icons.Tv size={18}/>, color: "bg-red-600", label: "YT" }
                    ].map((social, idx) => (
                        <button key={idx} className={`${social.color} text-white py-3 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity`}>
                            {social.icon}
                        </button>
                    ))}
                </div>
             </div>

             {/* Sidebar Ad */}
             <AdBanner className="w-full h-64 rounded-xl" label="Sidebar Ad Space" />

             {/* Tags Cloud */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Icons.Tag size={14} /> Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer border border-transparent hover:border-primary">
                            #{tag.name}
                        </span>
                    ))}
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
