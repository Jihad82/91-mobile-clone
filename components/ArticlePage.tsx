
import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { NewsItem } from '../types';
import { useData } from '../context/DataContext';

interface ArticlePageProps {
  article: NewsItem;
  onNavigate: (view: string) => void;
  onArticleClick: (article: NewsItem) => void; 
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article: initialArticle, onNavigate, onArticleClick }) => {
  const { authors, articles } = useData();
  
  // Enrich article with author data
  const authorData = authors.find(a => a.id === initialArticle.authorId) || authors.find(a => a.name === initialArticle.author);
  
  const article: NewsItem = {
    ...initialArticle,
    author: authorData?.name || initialArticle.author || '91Mobiles Team',
  };
  
  const authorImage = authorData?.avatar || 'https://placehold.co/100x100/333/FFF?text=Author';
  const authorRole = authorData?.role || 'Editor';

  // Get Related Articles
  const relatedArticles = articles
    .filter(a => a.id !== article.id && (a.category === article.category || a.tags?.some(t => article.tags?.includes(t))))
    .slice(0, 3);

  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [readerMode, setReaderMode] = useState(false);

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
      
      {/* Top Nav (Hidden in Reader Mode) */}
      {!readerMode && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-3 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto max-w-[1200px] px-4 flex justify-between items-center">
             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
                <Icons.ChevronRight size={10} />
                <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('news')}>News</span>
                <Icons.ChevronRight size={10} />
                <span className="text-primary truncate max-w-[150px]">{article.category}</span>
             </div>
             
             <div className="flex items-center gap-4">
               {/* Reader Tools */}
               <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button onClick={() => setFontSize('sm')} className={`p-1.5 rounded-md ${fontSize === 'sm' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400'}`}><Icons.Type size={12} /></button>
                  <button onClick={() => setFontSize('md')} className={`p-1.5 rounded-md ${fontSize === 'md' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400'}`}><Icons.Type size={16} /></button>
                  <button onClick={() => setFontSize('lg')} className={`p-1.5 rounded-md ${fontSize === 'lg' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-400'}`}><Icons.Type size={20} /></button>
               </div>

               <button 
                 onClick={() => setReaderMode(!readerMode)} 
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${readerMode ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary'}`}
               >
                 <Icons.BookOpen size={14} /> {readerMode ? 'Exit' : 'Reader'}
               </button>
             </div>
          </div>
        </div>
      )}

      {readerMode && (
          <div className="fixed top-4 right-4 z-50">
               <button onClick={() => setReaderMode(false)} className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
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
                     {authorRole} • {article.timeAgo || article.publishedAt || 'Recently'}
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wide">
                 <span className="flex items-center gap-1"><Icons.Clock size={14} /> {article.readTime || '5 min read'}</span>
                 <button className="flex items-center gap-1 hover:text-primary transition-colors"><Icons.Share2 size={14} /> Share</button>
              </div>
            </div>

            {/* Hero Image */}
            <figure className="mb-10 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
               <img src={article.heroImage || article.image} alt={article.title} className="w-full h-auto object-cover" />
            </figure>

            {/* Article Body */}
            {article.content ? (
                <div 
                  className={`prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 ${fontSizeClass[fontSize]} ${lineHeightClass[fontSize]}`}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
            ) : (
                <div className={`prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 ${fontSizeClass[fontSize]} ${lineHeightClass[fontSize]}`}>
                   <p>No content available.</p>
                </div>
            )}
               
            {/* Review Specifics: Pros/Cons */}
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

            {/* Tags & Footer */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
               <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags?.map(tag => (
                     <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer">
                       #{tag}
                     </span>
                  ))}
               </div>
               
               <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Share:</span>
                  <div className="flex gap-3">
                     <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:text-primary"><Icons.Twitter size={18} /></button>
                     <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:text-primary"><Icons.Facebook size={18} /></button>
                     <button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:text-primary"><Icons.Linkedin size={18} /></button>
                  </div>
               </div>
            </div>

            {/* Author Bio Card */}
            {authorData && (
                <div className="mt-10 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
                    <img src={authorImage} alt={article.author} className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shrink-0" />
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{article.author}</h3>
                        <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">{authorRole}</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                            {authorData.bio || 'Tech enthusiast and editor at 91Mobiles.'}
                        </p>
                        <div className="flex justify-center sm:justify-start gap-3">
                            {authorData.socials?.twitter && <a href={authorData.socials.twitter} className="text-gray-400 hover:text-primary"><Icons.Twitter size={16} /></a>}
                            {authorData.socials?.linkedin && <a href={authorData.socials.linkedin} className="text-gray-400 hover:text-primary"><Icons.Linkedin size={16} /></a>}
                        </div>
                    </div>
                </div>
            )}

            {/* Related Articles */}
            <div className="mt-12">
               <h3 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                 <Icons.LayoutDashboard className="text-primary" size={20} /> Related News
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
                                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                                    {related.category}
                                </div>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {related.title}
                            </h4>
                            <span className="text-xs text-gray-400">{related.timeAgo}</span>
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
               {/* Newsletter Widget */}
               <div className="bg-primary/5 dark:bg-gray-800/50 rounded-xl p-6 border border-primary/20 text-center">
                   <h4 className="text-gray-900 dark:text-white font-black text-lg mb-2">Don't Miss Out</h4>
                   <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">Subscribe to get the latest tech leaks directly.</p>
                   <input type="email" placeholder="Email Address" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm mb-2" />
                   <button className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-lg hover:bg-primary-dark transition-colors">Subscribe</button>
               </div>
               
               {/* Ad Space */}
               <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                  Sidebar Ad
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
