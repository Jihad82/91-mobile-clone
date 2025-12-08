
import React from 'react';
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
  const { articles, latestNews, tags } = useData();

  // Determine content dynamically
  const heroArticle = articles.find(a => a.isMain) || latestNews[0];
  const reviews = articles.filter(a => a.isReview || a.category === 'Reviews').slice(0, 3);
  const smartphoneNews = articles.filter(a => a.tags?.includes('Mobile') || a.category === 'News').slice(0, 2);
  const laptopNews = articles.filter(a => a.tags?.includes('Laptop') || a.tags?.includes('PC')).slice(0, 2);

  const trendingTopics = [
    { rank: 1, title: 'OnePlus 13 Review' },
    { rank: 2, title: 'Upcoming 5G Phones' },
    { rank: 3, title: 'iOS 18 Features' },
    { rank: 4, title: 'Nothing Phone 3' },
    { rank: 5, title: 'Best Laptops for Students' },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-12 transition-colors duration-300">
      
      {/* Breadcrumbs & Header Area */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container mx-auto max-w-[1200px] px-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                <span className="hover:text-primary cursor-pointer">Home</span>
                <Icons.ChevronRight size={10} />
                <span className="text-primary">News & Reviews</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Tech News & Reviews</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Hero Review Card */}
            {heroArticle && (
                <div 
                    className="relative rounded-2xl overflow-hidden group shadow-2xl cursor-pointer"
                    onClick={() => onArticleClick(heroArticle)}
                >
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md uppercase shadow-lg">{heroArticle.category}</span>
                        {heroArticle.rating && (
                            <span className="bg-white/90 dark:bg-black/80 text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1 shadow-lg backdrop-blur-sm">
                                <Icons.Star size={12} className="text-yellow-500 fill-yellow-500" /> {heroArticle.rating}/5
                            </span>
                        )}
                    </div>
                    <img src={heroArticle.heroImage || heroArticle.image} alt="Hero" className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
                        <div className="flex items-center gap-2 text-gray-300 text-xs font-bold mb-3 uppercase tracking-wide">
                            <span className="text-primary">{heroArticle.author}</span>
                            <span>•</span>
                            <span>{heroArticle.timeAgo}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-3 drop-shadow-md">
                            {heroArticle.title}
                        </h2>
                        {heroArticle.subtitle && (
                            <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-2xl mb-4 font-medium opacity-90">
                                {heroArticle.subtitle}
                            </p>
                        )}
                        <button className="flex items-center gap-2 text-white font-bold text-sm bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full transition-all border border-white/10">
                            Read Full Story <Icons.ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Ad Banner */}
            <AdBanner className="w-full h-24 rounded-lg" />

            {/* Latest News Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Icons.Rss className="text-primary" /> Latest News
                    </h3>
                    <a href="#" className="text-xs font-bold text-primary hover:underline uppercase flex items-center gap-1">View All <Icons.ChevronRight size={12}/></a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestNews.slice(0, 4).map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => onArticleClick(item)}
                            className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-card-hover transition-all group cursor-pointer flex flex-col h-full"
                        >
                            <div className="h-48 overflow-hidden relative shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                                    {item.timeAgo}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                    {item.title}
                                </h4>
                                <div className="mt-auto flex items-center gap-3">
                                    <button className="text-gray-400 hover:text-primary transition-colors"><Icons.Share2 size={16} /></button>
                                    <button className="text-gray-400 hover:text-primary transition-colors"><Icons.MessageCircle size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Two Column Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Smartphones */}
                <section>
                     <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 uppercase tracking-wide">
                        <Icons.Smartphone className="text-blue-500" size={18} /> Smartphones
                     </h3>
                     <div className="space-y-4">
                        {smartphoneNews.map(item => (
                            <div key={item.id} onClick={() => onArticleClick(item)} className="flex gap-4 group cursor-pointer">
                                <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100 shrink-0" alt="" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">{item.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold">{item.timeAgo}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </section>

                 {/* Laptops */}
                 <section>
                     <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 uppercase tracking-wide">
                        <Icons.Laptop className="text-purple-500" size={18} /> Laptops & PC
                     </h3>
                     <div className="space-y-4">
                        {laptopNews.map(item => (
                            <div key={item.id} onClick={() => onArticleClick(item)} className="flex gap-4 group cursor-pointer">
                                <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100 shrink-0" alt="" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2">{item.title}</h4>
                                    <span className="text-[10px] text-gray-400 font-bold">{item.timeAgo}</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </section>
            </div>

            {/* Latest Reviews Horizontal */}
            {reviews.length > 0 && (
                <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <Icons.Star className="text-yellow-500 fill-yellow-500" size={20} /> Latest Reviews
                        </h3>
                        <a href="#" className="text-xs font-bold text-gray-500 hover:text-primary">See All</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {reviews.map(review => (
                            <div 
                                key={review.id} 
                                onClick={() => onArticleClick(review)}
                                className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group border border-gray-100 dark:border-gray-700"
                            >
                                <div className="relative mb-3 rounded-lg overflow-hidden">
                                    <img src={review.image} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" alt="" />
                                    {review.rating && (
                                        <div className="absolute top-2 right-2 bg-spec-green text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                            {review.rating}/5
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-xs font-bold text-center text-gray-800 dark:text-gray-200 group-hover:text-primary line-clamp-2">{review.title}</h4>
                            </div>
                        ))}
                    </div>
                </section>
            )}
          
          </div>
          
          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 space-y-8">
             
             {/* Social Widget */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Stay Connected</h4>
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

             {/* Breaking / Don't Miss */}
             <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                    <Icons.Flame className="text-orange-500" size={16} />
                    <span className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase">Don't Miss</span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[1, 2, 3, 4].map((i) => (
                        <a href="#" key={i} className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                             <div className="text-[10px] text-primary font-bold mb-1 uppercase">Leak</div>
                             <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-snug group-hover:text-primary transition-colors">
                                Samsung Galaxy Z Flip 7 to feature a larger cover display
                             </h5>
                        </a>
                    ))}
                </div>
             </div>

             {/* Sidebar Ad */}
             <AdBanner className="w-full h-64 rounded-xl" label="Sidebar Ad" />

             {/* Trending List */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Icons.TrendingUp size={14} /> Trending Now
                </h4>
                <ul className="space-y-4">
                    {trendingTopics.map((topic) => (
                        <li key={topic.rank} className="flex items-center gap-4 group cursor-pointer">
                            <span className="text-4xl font-black text-gray-100 dark:text-gray-800 group-hover:text-primary/20 transition-colors leading-none">
                                {topic.rank}
                            </span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                                {topic.title}
                            </span>
                        </li>
                    ))}
                </ul>
             </div>

             {/* Newsletter */}
             <div className="bg-gradient-to-br from-primary/10 to-brand-blue/10 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-primary/20 text-center">
                 <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-primary mx-auto mb-3 shadow-md">
                     <Icons.Mail size={24} />
                 </div>
                 <h4 className="font-bold text-gray-900 dark:text-white mb-1">Tech Newsletter</h4>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Get the latest leaks & reviews in your inbox.</p>
                 <div className="space-y-2">
                     <input type="email" placeholder="Your Email Address" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:border-primary outline-none" />
                     <button className="w-full bg-primary text-white font-bold py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">Subscribe</button>
                 </div>
             </div>

             {/* Tags Cloud */}
             <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Icons.Tag size={14} /> Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag.id} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer">
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
