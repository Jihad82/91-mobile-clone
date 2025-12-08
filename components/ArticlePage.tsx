
import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { NewsItem } from '../types';
import { useData } from '../context/DataContext';

interface ArticlePageProps {
  article: NewsItem;
  onNavigate: (view: string) => void;
  onArticleClick: (article: NewsItem) => void; // To handle clicks on related articles
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article: initialArticle, onNavigate, onArticleClick }) => {
  const { authors, articles } = useData();
  
  // Enrich article with author data if available
  const authorData = authors.find(a => a.id === initialArticle.authorId);
  const article: NewsItem = {
    ...initialArticle,
    author: authorData?.name || initialArticle.author || '91Mobiles Team',
    authorId: initialArticle.authorId,
    // authorImage: authorData?.avatar // If NewsItem was extended to have this, for now we mock or assume
  };
  const authorImage = authorData?.avatar || 'https://placehold.co/100x100/333/FFF?text=Author';
  const authorRole = authorData?.role || 'Editor';

  // Get Related Articles (simple filter)
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  // State for Reading Preferences
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readerMode, setReaderMode] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  const fontSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const lineHeightClass = {
    sm: 'leading-relaxed',
    md: 'leading-7',
    lg: 'leading-8'
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${readerMode ? 'bg-[#f9f9f9] dark:bg-[#111]' : 'bg-white dark:bg-gray-950'}`}>
      
      {/* Article Navigation Bar */}
      {!readerMode && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-3 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto max-w-[1200px] px-4 flex justify-between items-center">
             <button 
               onClick={() => onNavigate('home')} 
               className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary uppercase tracking-wide transition-colors"
             >
               <Icons.ChevronLeft size={14} /> Back to Home
             </button>
             
             <div className="flex items-center gap-4">
               {/* Reader Tools */}
               <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button 
                    onClick={() => setFontSize('sm')} 
                    className={`p-1.5 rounded-md ${fontSize === 'sm' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Small Text"
                  >
                    <Icons.Type size={12} />
                  </button>
                  <button 
                    onClick={() => setFontSize('md')} 
                    className={`p-1.5 rounded-md ${fontSize === 'md' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Medium Text"
                  >
                    <Icons.Type size={16} />
                  </button>
                  <button 
                    onClick={() => setFontSize('lg')} 
                    className={`p-1.5 rounded-md ${fontSize === 'lg' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Large Text"
                  >
                    <Icons.Type size={20} />
                  </button>
               </div>

               <button 
                 onClick={() => setReaderMode(!readerMode)} 
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${readerMode ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'}`}
               >
                 <Icons.BookOpen size={14} /> {readerMode ? 'Exit Reader' : 'Reader Mode'}
               </button>
             </div>
          </div>
        </div>
      )}

      {readerMode && (
          <div className="fixed top-4 right-4 z-50">
               <button 
                 onClick={() => setReaderMode(false)} 
                 className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
               >
                 <Icons.X size={20} />
               </button>
          </div>
      )}

      <div className={`container mx-auto max-w-[1200px] px-4 ${readerMode ? 'py-12 max-w-[800px]' : 'py-8'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Article Content */}
          <div className={`lg:col-span-${readerMode ? '12' : '8'}`}>
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                  {article.category || 'News'}
                </span>
                {article.isReview && (
                   <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                     <Icons.Star size={12} fill="currentColor" /> {article.rating} Rating
                   </span>
                )}
              </div>
              
              <h1 className={`${readerMode ? 'text-4xl md:text-5xl' : 'text-3xl md:text-5xl'} font-black text-gray-900 dark:text-gray-100 leading-tight mb-4 tracking-tight`}>
                {article.title}
              </h1>
              
              {article.subtitle && (
                <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {article.subtitle}
                </p>
              )}
            </div>

            {/* Author & Meta */}
            <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-gray-800 mb-8">
              <div className="flex items-center gap-3">
                <img src={authorImage} alt="Author" className="w-10 h-10 rounded-full object-cover" />
                <div>
                   <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                     {article.author}
                   </div>
                   <div className="text-xs text-gray-500 dark:text-gray-400">
                     {authorRole} • {article.timeAgo}
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                 <span className="flex items-center gap-1"><Icons.Clock size={14} /> {article.readTime || '5 min read'}</span>
                 <span className="hidden sm:flex items-center gap-1"><Icons.MessageCircle size={14} /> 24 Comments</span>
              </div>
            </div>

            {/* Hero Image */}
            <figure className="mb-10 rounded-2xl overflow-hidden shadow-lg">
               <img src={article.heroImage || article.image} alt={article.title} className="w-full h-auto object-cover" />
               <figcaption className="text-center text-xs text-gray-500 mt-2 italic">
                 Image Credit: 91Mobiles / Manufacturer
               </figcaption>
            </figure>

            {/* Review Score Block (Only for Reviews) */}
            {article.isReview && article.rating && (
              <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl mb-10 flex flex-col md:flex-row items-center gap-6 border border-gray-800">
                 <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shrink-0 ring-4 ring-primary/30">
                    <span className="text-3xl font-black">{article.rating}</span>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold mb-1 text-white">TechPulse Score</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                       This score represents our extensive testing and evaluation of the device's performance, design, battery, and value.
                    </p>
                 </div>
              </div>
            )}

            {/* Article Body - Dynamic Content */}
            {article.content ? (
                <div 
                  className={`prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 ${fontSizeClass[fontSize]} ${lineHeightClass[fontSize]}`}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
            ) : (
                <div className={`prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 ${fontSizeClass[fontSize]} ${lineHeightClass[fontSize]}`}>
                   <p>No content available for this article.</p>
                </div>
            )}
               
               {/* Comparison Table (If Data Exists) */}
               {article.comparisonData && (
                 <div className="my-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-sm text-left">
                       <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase">
                          <tr>
                             {article.comparisonData.headers.map((h, i) => <th key={i} className="p-4">{h}</th>)}
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                          {article.comparisonData.rows.map((row, i) => (
                              <tr key={i}>
                                  <td className="p-4 font-semibold">{row.label}</td>
                                  {row.values.map((v, j) => <td key={j} className="p-4">{v}</td>)}
                              </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               )}
               
               {/* Pros & Cons Verdict */}
               {article.isReview && (article.pros?.length || article.cons?.length) && (
                 <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {article.pros && article.pros.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-xl p-6">
                        <h4 className="text-green-700 dark:text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                            <Icons.Check size={20} className="bg-green-100 rounded-full p-0.5" /> Pros
                        </h4>
                        <ul className="space-y-3">
                            {article.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Icons.Check size={16} className="text-green-500 mt-0.5 shrink-0" /> {pro}
                                </li>
                            ))}
                        </ul>
                        </div>
                    )}
                    {article.cons && article.cons.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-xl p-6">
                        <h4 className="text-red-700 dark:text-red-400 font-bold text-lg mb-4 flex items-center gap-2">
                            <Icons.X size={20} className="bg-red-100 rounded-full p-0.5" /> Cons
                        </h4>
                        <ul className="space-y-3">
                            {article.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <Icons.X size={16} className="text-red-500 mt-0.5 shrink-0" /> {con}
                                </li>
                            ))}
                        </ul>
                        </div>
                    )}
                 </div>
               )}

            {/* Tags & Share */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
               <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-sm font-bold text-gray-500 mr-2">Tags:</span>
                  {article.tags?.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer">
                       #{tag}
                     </span>
                  ))}
               </div>
               
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Share this article:</span>
                  <div className="flex gap-3">
                     <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                        <Icons.Twitter size={16} /> Twitter
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-[#4267B2] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                        <Icons.Facebook size={16} /> Facebook
                     </button>
                     <button className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                        <Icons.MessageCircle size={16} /> WhatsApp
                     </button>
                  </div>
               </div>
            </div>

            {/* Author Bio Card */}
            <div className="mt-10 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex items-center gap-6 shadow-sm">
                <img src={authorImage} alt={article.author} className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                <div>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{article.author}</h3>
                   <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">{authorRole}</div>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                     {authorData?.bio || 'Tech enthusiast and editor at 91Mobiles.'}
                   </p>
                </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12">
               <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                 <Icons.LayoutDashboard className="text-primary" size={20} /> Related Articles
               </h3>
               {relatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedArticles.map((related) => (
                            <div 
                            key={related.id} 
                            onClick={() => onArticleClick(related)}
                            className="group cursor-pointer"
                            >
                            <div className="relative h-40 rounded-lg overflow-hidden mb-3">
                                <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="text-[10px] text-primary font-bold uppercase mb-1">{related.category || 'News'}</div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {related.title}
                            </h4>
                            </div>
                        ))}
                    </div>
               ) : (
                   <p className="text-gray-500 text-sm italic">No related articles found.</p>
               )}
            </div>

          </div>

          {/* Sidebar (Right) - Hidden in Reader Mode */}
          {!readerMode && (
             <div className="lg:col-span-4 space-y-8">
               
               {/* Trending Now */}
               <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-24">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Icons.TrendingUp size={14} /> Trending Now
                  </h4>
                  <ul className="space-y-6">
                      {[
                        {rank: '01', title: 'iPhone 16 Pro Max Review: The Best iPhone Yet?', cat: 'Smartphones'},
                        {rank: '02', title: 'NVIDIA RTX 5090 Announced: 2x Performance', cat: 'Hardware'},
                        {rank: '03', title: 'Samsung Galaxy S25 Ultra: Everything We Know', cat: 'Smartphones'},
                        {rank: '04', title: 'Best Laptops of 2024: Ultimate Guide', cat: 'Laptops'},
                        {rank: '05', title: 'OpenAI Announces GPT-5: A New Era of AI', cat: 'AI'},
                      ].map((topic, i) => (
                          <li key={i} className="flex gap-4 group cursor-pointer">
                              <span className="text-2xl font-black text-gray-200 dark:text-gray-700 leading-none mt-1">{topic.rank}</span>
                              <div>
                                 <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors leading-tight mb-1">
                                   {topic.title}
                                 </h5>
                                 <span className="text-[10px] text-gray-400 uppercase font-semibold">{topic.cat}</span>
                              </div>
                          </li>
                      ))}
                  </ul>
               </div>

               {/* Ad Space */}
               <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400">
                  <span className="text-xs font-bold uppercase tracking-widest mb-2">Advertisement</span>
                  <span className="text-[10px]">Ad Space Sidebar</span>
               </div>

               {/* Categories List */}
               <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1">
                  {[
                    {name: 'Smartphones', count: 156},
                    {name: 'Laptops', count: 89},
                    {name: 'Hardware', count: 124},
                    {name: 'AI', count: 78},
                    {name: 'Gaming', count: 145},
                    {name: 'Audio', count: 67},
                    {name: 'VR/AR', count: 45},
                    {name: 'Tablets', count: 38},
                  ].map((cat, i) => (
                     <div key={i} className={`flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group ${i !== 7 ? 'border-b border-gray-50 dark:border-gray-800' : ''}`}>
                        <span className={`text-xs font-bold ${cat.name === 'Gaming' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'} group-hover:text-primary transition-colors`}>{cat.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{cat.count}</span>
                     </div>
                  ))}
               </div>

               {/* Newsletter */}
               <div className="bg-primary rounded-xl p-6 text-center shadow-lg shadow-primary/20">
                   <h4 className="text-white font-black text-lg mb-2">Get Daily Updates</h4>
                   <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                     Subscribe to our newsletter for the latest tech news and exclusive reviews.
                   </p>
                   <button className="w-full bg-gray-900 text-white text-xs font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                     Subscribe Now
                   </button>
               </div>

             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
