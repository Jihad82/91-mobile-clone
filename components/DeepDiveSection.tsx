import React from 'react';
import { Icons } from './Icon';

const cards = [
  { title: 'Galaxy Z Fold7', bg: 'bg-blue-900', text: 'white', img: 'https://placehold.co/300x300/1e3a8a/FFF?text=Z+Fold7' },
  { title: 'MediaTek Hub', bg: 'bg-black', text: 'white', img: 'https://placehold.co/300x300/000/FFF?text=MediaTek' },
  { title: 'Acer Hub', bg: 'bg-green-800', text: 'white', img: 'https://placehold.co/300x300/166534/FFF?text=Acer' },
  { title: 'Game Zone', bg: 'bg-indigo-900', text: 'white', img: 'https://placehold.co/300x300/312e81/FFF?text=Games' },
];

const DeepDiveSection = () => {
  return (
    <section className="bg-white dark:bg-gray-950 py-10 mb-4 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Deep Dive</h2>
                <span className="text-[10px] text-primary font-bold px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 uppercase tracking-wide">Collections</span>
            </div>
            {/* Dots decoration */}
            <div className="hidden sm:flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800"></div>)}
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div key={idx} className={`relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 transform hover:-translate-y-2 ${card.bg}`}>
               <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 mix-blend-overlay filter saturate-0 group-hover:saturate-100" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
               
               {/* Content */}
               <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                  <div className="w-10 h-1 bg-primary mb-3 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></div>
                  <h3 className={`text-2xl font-black ${card.text === 'white' ? 'text-white' : 'text-gray-900 dark:text-gray-100'} leading-none tracking-tight mb-1`}>{card.title}</h3>
                  
                  <div className="h-0 group-hover:h-8 overflow-hidden transition-all duration-300 delay-75">
                      <span className="text-xs text-primary font-bold mt-3 flex items-center gap-2 uppercase tracking-widest">
                        Explore <Icons.ArrowRight size={14} />
                      </span>
                  </div>
               </div>
               
               {/* Top Right Icon */}
               <div className="absolute top-4 right-4 text-white/20 group-hover:text-white/80 transition-colors duration-300">
                  <Icons.LayoutDashboard size={24} />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeepDiveSection;