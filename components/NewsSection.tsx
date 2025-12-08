import React from 'react';
import { NewsItem } from '../types';
import { Icons } from './Icon';

interface NewsSectionProps {
  title: string;
  news: NewsItem[];
  isHindi?: boolean;
  onArticleClick?: (article: NewsItem) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ title, news, isHindi = false, onArticleClick }) => {
  if (!news || news.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-950 py-10 mb-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="container mx-auto max-w-[1200px] px-4">
           <div className="text-center text-gray-400 py-10 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
             <p className="text-sm font-medium">No news available in this section currently.</p>
           </div>
        </div>
      </section>
    );
  }

  const mainStory = news[0];
  const sideStories = news.slice(1, 4);

  const handleArticleClick = (item: NewsItem) => {
    if (onArticleClick) {
        onArticleClick(item);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-950 py-10 mb-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <h2 className={`text-2xl font-black text-gray-800 dark:text-gray-100 ${isHindi ? 'font-sans' : 'tracking-tight'} relative pl-4`}>
                 <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full"></span>
                 {title}
               </h2>
               {!isHindi && <span className="text-[10px] bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse-slow">Trending</span>}
            </div>
            <a href="#" className="text-xs text-primary font-bold flex items-center hover:underline uppercase tracking-wide group">
              {isHindi ? 'और पढ़ें' : 'View All'} 
              <span className="bg-primary/10 rounded-full p-1 ml-2 group-hover:bg-primary group-hover:text-white transition-colors">
                 <Icons.ChevronRight size={12} />
              </span>
            </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Story */}
          <div 
            className="md:col-span-7 lg:col-span-8 group cursor-pointer h-full"
            onClick={() => handleArticleClick(mainStory)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full min-h-[350px]">
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              <img src={mainStory.image} alt={mainStory.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out relative z-10" />
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-20 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full z-30 transform group-hover:-translate-y-2 transition-transform duration-500">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary/90 text-white shadow-lg shadow-primary/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide backdrop-blur-sm">Featured</span>
                    <span className="text-gray-300 text-xs font-semibold flex items-center gap-1">
                        <Icons.Clock size={12} /> {mainStory.timeAgo}
                    </span>
                 </div>
                 <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-md ${isHindi ? 'font-serif' : ''}`}>
                    {mainStory.title}
                 </h3>
                 <div className="h-0 overflow-hidden group-hover:h-6 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <span className="text-primary text-sm font-bold flex items-center gap-2">Read Full Story <Icons.ArrowRight size={14}/></span>
                 </div>
              </div>
            </div>
          </div>

          {/* Side Stories */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6 justify-between">
            {sideStories.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-5 group cursor-pointer items-start p-3 -mx-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => handleArticleClick(item)}
              >
                <div className="overflow-hidden rounded-lg w-[110px] h-[80px] shrink-0 border border-gray-100 dark:border-gray-700 relative shadow-sm">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-bold text-gray-800 dark:text-gray-100 leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2 ${isHindi ? 'text-[15px]' : ''}`}>
                    {item.title}
                  </h4>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                    {item.timeAgo}
                  </div>
                </div>
              </div>
            ))}
             <div className="mt-auto pt-2">
                <button className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-3 rounded-lg hover:border-primary hover:text-primary hover:shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2">
                  Show More News <Icons.ChevronDown size={14} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;