
import React from 'react';
import { Product } from '../types';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { compareList, addToCompare, removeFromCompare } = useData();
  const isSelected = compareList.some(p => p.id === product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
        onClick(product);
    }
  };

  return (
    <div 
        className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-card-hover transition-all duration-300 cursor-pointer shrink-0 relative flex flex-col group hover:-translate-y-2"
        onClick={handleCardClick}
    >
      
      {/* Spec Score Badge - Authentic Style */}
      {product.specScore && (
        <div className="absolute top-3 left-3 z-10 group-hover:scale-110 transition-transform">
          <div className={`w-9 h-9 flex items-center justify-center text-white text-xs font-black rounded-lg shadow-md ${product.specScore >= 90 ? 'bg-spec-green' : 'bg-spec-yellow'} ring-2 ring-white dark:ring-gray-800`}>
            {product.specScore}
          </div>
          <div className="text-[9px] font-bold text-gray-500 dark:text-gray-400 mt-0.5 text-center uppercase tracking-tighter leading-none opacity-80">Spec<br/>Score</div>
        </div>
      )}
      
      {/* Compare Checkbox */}
      <div 
        className="absolute top-3 right-3 z-20"
        onClick={handleCompareClick}
        title="Add to Compare"
      >
        <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary border-primary shadow-glow-sm scale-110' : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 hover:border-primary'}`}>
          {isSelected && <Icons.Check size={14} className="text-white" strokeWidth={4} />}
        </div>
        <span className={`text-[9px] font-bold mt-0.5 block text-center transition-colors ${isSelected ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>Compare</span>
      </div>
      
      <div className="w-full h-44 flex items-center justify-center mb-5 relative bg-transparent rounded-lg p-2 overflow-hidden">
        {/* Subtle radial gradient background behind image */}
        <div className="absolute inset-0 bg-radial-gradient from-gray-100/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm" />
      </div>

      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-2 h-10 leading-snug group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      
      <div className="mt-auto pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
        <div className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{product.price}</div>
        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Avg. Market Price</div>
      </div>
      
      {/* View Details Button Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white dark:from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex justify-center pointer-events-none">
          <span className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-primary/30">View Details</span>
      </div>
    </div>
  );
};

export default ProductCard;