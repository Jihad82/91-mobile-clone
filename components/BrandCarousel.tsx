import React from 'react';
import { Icons } from './Icon';

const brands = [
  { name: 'Samsung', color: '#034EA2' },
  { name: 'Xiaomi', color: '#FF6900' },
  { name: 'Realme', color: '#FFC915' },
  { name: 'Vivo', color: '#415FFF' },
  { name: 'OnePlus', color: '#F5010C' },
  { name: 'Apple', color: '#333333' },
  { name: 'POCO', color: '#FFD700' },
  { name: 'OPPO', color: '#118D61' },
  { name: 'Moto', color: '#5C92FA' },
  { name: 'Infinix', color: '#000000' },
];

const BrandCarousel = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-6 mb-2 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
       <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 border-l-4 border-primary pl-3 leading-none">Featured Brands</h2>
             <a href="#" className="text-xs text-primary font-bold flex items-center hover:underline uppercase tracking-wide">View All <Icons.ChevronRight size={14} /></a>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {brands.map((brand, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[90px] group cursor-pointer">
                <div className="w-[90px] h-[50px] bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 group-hover:border-primary/50 group-hover:shadow-md transition-all flex items-center justify-center relative overflow-hidden">
                  <span className="font-black text-sm tracking-tight dark:text-gray-200" style={{ color: brand.name === 'Apple' || brand.name === 'Infinix' ? undefined : brand.color }}>{brand.name}</span>
                </div>
              </div>
            ))}
          </div>
       </div>
    </section>
  );
};

export default BrandCarousel;