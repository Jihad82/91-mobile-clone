import React from 'react';
import { NewsItem } from '../types';

interface StoriesSectionProps {
    stories: NewsItem[];
    onArticleClick?: (article: NewsItem) => void;
}

const StoriesSection: React.FC<StoriesSectionProps> = ({ stories, onArticleClick }) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-8 mb-4 border-y border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Stories That Matter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div 
                key={story.id} 
                className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
                onClick={() => onArticleClick && onArticleClick(story)}
            >
              <div className="flex items-center gap-4 mb-4">
                 <img src={story.image} alt={story.title} className="w-16 h-16 object-cover rounded-full border border-gray-200 dark:border-gray-600" />
                 <div className="flex-1">
                     <span className="text-[10px] uppercase font-bold text-primary tracking-wide">Opinion</span>
                     <div className="text-xs text-gray-400 mt-1">By {story.author || '91Mobiles'}</div>
                 </div>
              </div>
              
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-3 leading-relaxed mb-3">
                {story.title}
              </h3>
              
              <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                 {story.timeAgo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;