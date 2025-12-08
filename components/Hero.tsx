import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icon';

interface HeroProps {
  onSearch: (criteria: { minPrice?: number; maxPrice?: number; keyword?: string }) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [minPrice, setMinPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(50000);
  
  // Slider Drag State
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const maxRange = 200000;
  const minGap = 1000;

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin && !isDraggingMax) return;
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      let newValue = Math.round((percentage / 100) * maxRange);
      
      // Snap to nearest 500
      newValue = Math.round(newValue / 500) * 500;

      if (isDraggingMin) {
        if (newValue <= maxPrice - minGap) {
          setMinPrice(newValue);
        }
      } else if (isDraggingMax) {
        if (newValue >= minPrice + minGap) {
          setMaxPrice(newValue);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingMin(false);
      setIsDraggingMax(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDraggingMin, isDraggingMax, minPrice, maxPrice]);

  // Calculate positions for rendering
  const minPos = Math.min((minPrice / maxRange) * 100, 100);
  const maxPos = Math.min((maxPrice / maxRange) * 100, 100);

  const handlePriceSearch = () => {
    onSearch({ minPrice, maxPrice });
  };

  const handleFeatureClick = (feature: string) => {
    onSearch({ keyword: feature });
  };

  const handlePriceTagClick = (priceText: string) => {
    const amount = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
    if (priceText.toLowerCase().includes('under')) {
        setMinPrice(0);
        setMaxPrice(amount);
        onSearch({ minPrice: 0, maxPrice: amount });
    }
  };

  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-8 font-sans transition-colors duration-300 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-[1200px] px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-10">
          
          {/* Left: Price Finder Widget - Modern Glass Card */}
          <div className="lg:col-span-4 pb-6 lg:pb-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
               {/* Header */}
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icons.Search size={20} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
                   Phone Finder
                 </h2>
               </div>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price Range</span>
                        <span className="text-xs font-bold text-primary">₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}</span>
                    </div>
                    
                    {/* Interactive Slider */}
                    <div 
                        ref={sliderRef}
                        className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-2 cursor-pointer select-none touch-none"
                    >
                        {/* Active Range Bar */}
                        <div 
                            className="absolute h-full bg-gradient-to-r from-primary to-blue-600 rounded-full opacity-100 shadow-glow-sm pointer-events-none"
                            style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
                        ></div>
                        
                        {/* Min Thumb */}
                        <div 
                            className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform z-10"
                            style={{ left: `${minPos}%`, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => { e.stopPropagation(); setIsDraggingMin(true); }}
                        ></div>
                        
                        {/* Max Thumb */}
                        <div 
                            className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform z-10"
                            style={{ left: `${maxPos}%`, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => { e.stopPropagation(); setIsDraggingMax(true); }}
                        ></div>
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
                        <span>₹0</span>
                        <span>₹2L+</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="flex-1 relative group/input">
                    <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">₹</span>
                    <input 
                        type="number" 
                        value={minPrice}
                        onChange={(e) => {
                            const val = Math.min(Number(e.target.value), maxPrice - minGap);
                            setMinPrice(val);
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 pl-6 text-sm font-bold text-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    />
                    </div>
                    <span className="text-gray-300 font-medium">-</span>
                    <div className="flex-1 relative group/input">
                    <span className="absolute left-3 top-3 text-gray-400 text-xs font-bold">₹</span>
                    <input 
                        type="number" 
                        value={maxPrice}
                        onChange={(e) => {
                             const val = Math.max(Number(e.target.value), minPrice + minGap);
                             setMaxPrice(val);
                        }}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 pl-6 text-sm font-bold text-gray-700 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    />
                    </div>
                 </div>

                 <button 
                    onClick={handlePriceSearch}
                    className="w-full bg-gradient-to-r from-primary to-brand-blue hover:from-primary-dark hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 uppercase tracking-wide"
                 >
                    <Icons.Search size={18} />
                    Search Mobiles
                 </button>
              </div>
              
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                   <span className="hover:text-primary cursor-pointer transition-colors hover:underline">Advanced Search</span>
                   <span className="text-gray-300 dark:text-gray-700">•</span>
                   <span className="hover:text-primary cursor-pointer transition-colors hover:underline">Brand Finder</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Popular Features */}
          <div className="lg:col-span-3 pb-6 lg:pb-0 mt-6 lg:mt-0 lg:border-r border-gray-100 dark:border-gray-800 pr-6">
             <h3 className="text-xs font-bold text-gray-400 uppercase mb-5 tracking-widest flex items-center gap-2">
                <Icons.TrendingUp size={14} className="text-primary"/> Popular Features
             </h3>
             <ul className="space-y-3">
                {[
                  { icon: <Icons.Smartphone size={18}/>, label: "5G Phones", keyword: "5G" },
                  { icon: <Icons.Camera size={18}/>, label: "Best Camera Phones", keyword: "Camera" },
                  { icon: <Icons.Battery size={18}/>, label: "5000mAh Battery", keyword: "Battery" },
                  { icon: <Icons.Smartphone size={18}/>, label: "Upcoming Mobiles", keyword: "" },
                  { icon: <Icons.Cpu size={18}/>, label: "Gaming Phones", keyword: "Pro" }, 
                  { icon: <Icons.Tablet size={18}/>, label: "Best Tablets", keyword: "Tab" },
                ].map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => handleFeatureClick(item.keyword)}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-md cursor-pointer transition-all group border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                    <div className="text-gray-400 group-hover:text-primary transition-colors bg-gray-50 dark:bg-gray-800 group-hover:bg-primary/10 p-2 rounded-md">{item.icon}</div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{item.label}</span>
                  </li>
                ))}
             </ul>
          </div>

          {/* Right: Categories & Price Tags */}
          <div className="lg:col-span-5 lg:pl-4 mt-6 lg:mt-0">
            <h2 className="text-lg font-bold mb-5 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                Explore Categories
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                  { name: "Mobiles", icon: <Icons.Smartphone size={22} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                  { name: "Laptops", icon: <Icons.Laptop size={22} />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
                  { name: "Tablets", icon: <Icons.Tablet size={22} />, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
                  { name: "TVs", icon: <Icons.Tv size={22} />, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" }
              ].map((cat, idx) => (
                  <div key={idx} onClick={() => onSearch({ keyword: cat.name })} className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 p-4 rounded-xl hover:shadow-glow-sm hover:border-primary/50 cursor-pointer transition-all bg-white dark:bg-gray-800 group hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color} ${cat.bg} group-hover:scale-110 transition-transform`}>{cat.icon}</div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium flex items-center mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">Explore <Icons.ChevronRight size={10} className="ml-1"/></div>
                    </div>
                  </div>
              ))}
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Mobiles by Price</h3>
            <div className="flex flex-wrap gap-2">
              {["Under ₹10,000", "Under ₹15,000", "Under ₹20,000", "Under ₹30,000"].map((price, idx) => (
                <span 
                    key={idx} 
                    onClick={() => handlePriceTagClick(price)}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white border border-gray-200 dark:border-gray-700 hover:border-primary px-4 py-2 text-xs font-bold rounded-full text-gray-600 dark:text-gray-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
                >
                  {price}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;