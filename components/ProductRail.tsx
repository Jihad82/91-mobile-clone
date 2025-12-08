import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Icons } from './Icon';

interface ProductRailProps {
  title: string;
  products: Product[];
}

const ProductRail: React.FC<ProductRailProps> = ({ title, products }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Helper to parse price string like "₹75,999" to number
  const parsePrice = (price: string) => {
    const num = parseInt(price.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === 'desc') {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    return sorted;
  }, [products, sortOrder]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  
  // Reset to page 1 if products change or sort changes
  useMemo(() => {
     // This side effect is handled by the setter in the onChange, 
     // but if products prop changes externally we might want to reset.
     // For now, keeping it simple.
  }, [products.length]);

  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-6 mb-4 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            
            <div className="flex items-center gap-4">
               {/* Sort Controls */}
               <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase hidden sm:inline">Sort Price:</span>
                <select 
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold py-1 px-2 rounded focus:outline-none focus:border-primary cursor-pointer"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as any);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">Default</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </div>

              <a href="#" className="text-xs text-primary font-bold flex items-center hover:underline uppercase tracking-wide border border-primary/20 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">
                View All <Icons.ChevronRight size={12} className="ml-1" />
              </a>
            </div>
        </div>
        
        {/* Paginated Grid */}
        <div className="flex flex-wrap gap-5 justify-center sm:justify-start min-h-[340px] content-start">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {currentProducts.length === 0 && (
             <div className="w-full text-center py-10 text-gray-400">No products found.</div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-4 select-none">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all"
            >
              <Icons.ChevronLeft size={20} />
            </button>
            
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all"
            >
              <Icons.ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductRail;