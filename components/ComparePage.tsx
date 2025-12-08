
import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { Product } from '../types';

// Helper to generate mock specs (mirrors logic in FloatBar for consistency)
const getMockSpecs = (id: string) => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pick = (arr: string[]) => arr[seed % arr.length];

  return {
    processor: pick(['Snapdragon 8 Gen 3', 'Dimensity 9300', 'Apple A18', 'Snapdragon 7s Gen 2', 'Exynos 2400']),
    ram: pick(['8GB', '12GB', '16GB', '24GB']),
    storage: pick(['128GB', '256GB', '512GB', '1TB']),
    display: pick(['6.7" AMOLED 120Hz', '6.8" LTPO 120Hz', '6.1" OLED 60Hz', '6.67" 144Hz IPS']),
    camera: pick(['50MP + 50MP + 64MP', '200MP + 8MP + 2MP', '50MP OIS', '108MP Main', '48MP + 12MP']),
    battery: pick(['5000mAh', '5500mAh', '4500mAh', '6000mAh', '4000mAh']),
    os: pick(['Android 14', 'iOS 18', 'Android 15', 'HyperOS'])
  };
};

const ComparePage = () => {
  const { compareList, addToCompare, removeFromCompare, searchProducts, clearCompare } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when a slot is clicked
  useEffect(() => {
    if (activeSlot !== null && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeSlot]);

  // Handle Search
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setSearchResults(searchProducts({ keyword: searchTerm }));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, searchProducts]);

  const handleAddProduct = (product: Product) => {
    if (compareList.find(p => p.id === product.id)) {
        alert("Product already added!");
        return;
    }
    addToCompare(product);
    setSearchTerm('');
    setSearchResults([]);
    setActiveSlot(null);
  };

  const handleCompareClick = () => {
      if (compareList.length >= 2) {
          setShowComparison(true);
      }
  };

  const slots = [0, 1, 2, 3];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans pb-20">
      
      {/* Header Area */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="container mx-auto max-w-[1200px] px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-2 tracking-tight">
                {showComparison ? 'Comparison Results' : 'Compare Smartphones'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
                {showComparison 
                    ? `Comparing ${compareList.length} devices side-by-side.` 
                    : 'Select up to 4 devices to see detailed specs, features, and price differences.'}
            </p>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 py-8">
        
        {!showComparison ? (
            <>
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12 relative z-20">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icons.Search className="text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Type brand or model name (e.g., Samsung, OnePlus)..."
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-gray-800 dark:text-gray-100 font-medium text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Search Results Dropdown */}
                        {searchTerm.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-fade-in max-h-[400px] overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map(product => (
                                        <div 
                                            key={product.id}
                                            onClick={() => handleAddProduct(product)}
                                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors"
                                        >
                                            <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
                                            <div>
                                                <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{product.name}</div>
                                                <div className="text-primary font-bold text-xs">{product.price}</div>
                                            </div>
                                            <div className="ml-auto">
                                                <Icons.Plus size={18} className="text-gray-400" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-sm">No devices found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selection Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {slots.map((index) => {
                        const product = compareList[index];
                        return (
                            <div 
                                key={index} 
                                className={`relative h-[320px] rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-6
                                    ${product 
                                        ? 'bg-white dark:bg-gray-900 shadow-card hover:shadow-card-hover border border-gray-200 dark:border-gray-800' 
                                        : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-white dark:hover:bg-gray-800 cursor-pointer group'
                                    }
                                `}
                                onClick={() => !product && searchInputRef.current?.focus()}
                            >
                                {product ? (
                                    <>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeFromCompare(product.id); }}
                                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <Icons.X size={16} />
                                        </button>
                                        
                                        <div className="flex-1 w-full flex items-center justify-center mb-4">
                                            <img src={product.image} alt={product.name} className="max-h-[160px] object-contain drop-shadow-sm" />
                                        </div>
                                        
                                        <div className="text-center w-full">
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 mb-2 h-10">{product.name}</h3>
                                            <div className="text-lg font-black text-primary">{product.price}</div>
                                            {product.specScore && (
                                                <div className="mt-2 inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                    Score: <span className="text-gray-900 dark:text-gray-200">{product.specScore}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-primary transition-colors">
                                        <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <Icons.Plus size={32} strokeWidth={1.5} />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wide">Add Device</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Compare Action */}
                <div className="flex justify-center">
                    <button 
                        onClick={handleCompareClick}
                        disabled={compareList.length < 2}
                        className={`
                            px-12 py-4 rounded-full font-black text-lg uppercase tracking-wide shadow-xl flex items-center gap-3 transition-all duration-300 transform
                            ${compareList.length >= 2 
                                ? 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 hover:shadow-primary/40' 
                                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        <Icons.BarChart2 size={24} />
                        Compare Now
                    </button>
                </div>
            </>
        ) : (
            <div className="animate-fade-in-up">
                 {/* Results View */}
                 <div className="mb-6 flex justify-between items-center">
                    <button 
                        onClick={() => setShowComparison(false)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-wide"
                    >
                        <Icons.ChevronLeft size={16} /> Edit Selection
                    </button>
                    <button 
                        onClick={() => { clearCompare(); setShowComparison(false); }}
                        className="text-red-500 text-sm font-bold hover:underline"
                    >
                        Clear All
                    </button>
                 </div>

                 <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden border border-gray-100 dark:border-gray-800">
                     <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[800px]">
                            <thead>
                            <tr>
                                <th className="p-6 text-left w-64 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs font-black uppercase text-gray-400 tracking-wider">
                                    Features
                                </th>
                                {compareList.map(item => (
                                <th key={item.id} className="p-6 w-64 min-w-[240px] border-b border-gray-200 dark:border-gray-700 relative align-top bg-white dark:bg-gray-900">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative mb-4 group h-40 flex items-end justify-center">
                                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain drop-shadow-md" />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 leading-tight">{item.name}</h3>
                                        <div className="text-primary font-black text-lg mb-2">{item.price}</div>
                                        <button 
                                            onClick={() => removeFromCompare(item.id)}
                                            className="text-xs text-red-500 hover:underline font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </th>
                                ))}
                                {/* Fill empty columns if less than 4 selected */}
                                {Array.from({length: 4 - compareList.length}).map((_, i) => (
                                    <th key={i} className="p-6 w-64 min-w-[240px] border-b border-gray-200 dark:border-gray-700 bg-gray-50/10 dark:bg-gray-900/50"></th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-gray-300">
                                {/* Spec Score Row */}
                                <tr>
                                    <td className="p-5 font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30">Spec Score</td>
                                    {compareList.map(item => (
                                    <td key={item.id} className="p-5 text-center border-b border-gray-100 dark:border-gray-800">
                                        {item.specScore ? (
                                            <div className="flex justify-center">
                                                <div className={`w-10 h-10 flex items-center justify-center rounded-lg text-white font-black text-xs shadow-md ${item.specScore >= 90 ? 'bg-spec-green' : 'bg-spec-yellow'}`}>
                                                    {item.specScore}
                                                </div>
                                            </div>
                                        ) : <span className="text-gray-400">-</span>}
                                    </td>
                                    ))}
                                    {Array.from({length: 4 - compareList.length}).map((_, i) => <td key={i} className="border-b border-gray-100 dark:border-gray-800"></td>)}
                                </tr>

                                {/* Specs Rows */}
                                {[
                                    { label: 'Processor', key: 'processor', icon: <Icons.Cpu size={18} /> },
                                    { label: 'RAM', key: 'ram', icon: <Icons.Cpu size={18} /> },
                                    { label: 'Storage', key: 'storage', icon: <Icons.LayoutDashboard size={18} /> },
                                    { label: 'Display', key: 'display', icon: <Icons.Smartphone size={18} /> },
                                    { label: 'Camera', key: 'camera', icon: <Icons.Camera size={18} /> },
                                    { label: 'Battery', key: 'battery', icon: <Icons.Battery size={18} /> },
                                    { label: 'OS', key: 'os', icon: <Icons.Settings size={18} /> },
                                ].map((spec) => (
                                    <tr key={spec.key} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors group">
                                        <td className="p-5 font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-gray-50/30 dark:bg-gray-800/30">
                                            <div className="p-1.5 rounded bg-white dark:bg-gray-800 text-gray-400 group-hover:text-primary transition-colors shadow-sm">
                                                {spec.icon}
                                            </div>
                                            {spec.label}
                                        </td>
                                        {compareList.map(item => (
                                            <td key={item.id} className="p-5 text-center border-b border-gray-100 dark:border-gray-800 font-semibold">
                                                {(getMockSpecs(item.id) as any)[spec.key]}
                                            </td>
                                        ))}
                                         {Array.from({length: 4 - compareList.length}).map((_, i) => <td key={i} className="border-b border-gray-100 dark:border-gray-800"></td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ComparePage;
