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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Price Finder Widget - Modern Glass Card */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 dark:border-gray-800 relative overflow-hidden group h-full flex flex-col">
               {/* Header */}
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icons.Search size={20} strokeWidth={2.5} />
                 </div>
                 <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
                   Phone Finder
                 </h2>
               </div>
              
              <div className="space-y-6 flex-1">
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

          {/* Right: Combined Explore Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
             
             {/* Section Header */}
             <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icons.LayoutDashboard size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
                    Explore Features & Categories
                </h2>
             </div>

             {/* 1. Main Categories Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { name: "Mobiles", icon: <Icons.Smartphone />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", borderColor: "hover:border-blue-200 dark:hover:border-blue-800" },
                  { name: "Laptops", icon: <Icons.Laptop />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", borderColor: "hover:border-indigo-200 dark:hover:border-indigo-800" },
                  { name: "Tablets", icon: <Icons.Tablet />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800" },
                  { name: "TVs", icon: <Icons.Tv />, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", borderColor: "hover:border-rose-200 dark:hover:border-rose-800" }
               ].map((cat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => onSearch({ keyword: cat.name })}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-300 hover:shadow-card-hover bg-white dark:bg-gray-900 group hover:-translate-y-1 ${cat.borderColor}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color} ${cat.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        {React.cloneElement(cat.icon as React.ReactElement, { size: 26, strokeWidth: 2 })}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</span>
                        <Icons.ChevronRight size={12} className="text-gray-300 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  </div>
               ))}
             </div>

             {/* Split Section: Features & Budget */}
             <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                 
                 {/* 2. Popular Features (Span 7) */}
                 <div className="md:col-span-7 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Icons.TrendingUp size={16} className="text-primary"/> 
                        <span>Trending Features</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                        { icon: <Icons.Smartphone />, label: "5G Mobiles", keyword: "5G", color: "text-blue-500" },
                        { icon: <Icons.Camera />, label: "Best Camera", keyword: "Camera", color: "text-purple-500", badge: "Hot" },
                        { icon: <Icons.Battery />, label: "Big Battery", keyword: "Battery", color: "text-green-500" },
                        { icon: <Icons.Cpu />, label: "Gaming Pro", keyword: "Pro", color: "text-red-500" }, 
                        { icon: <Icons.Clock />, label: "Upcoming", keyword: "", color: "text-orange-500", badge: "New" },
                        { icon: <Icons.Tablet />, label: "Top Tablets", keyword: "Tab", color: "text-teal-500" },
                        ].map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleFeatureClick(item.keyword)}
                            className="group relative p-0.5 rounded-xl cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                        >
                            {/* Gradient Border effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            
                            <div className="relative flex items-center gap-3 p-3 rounded-[11px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:border-transparent h-full shadow-sm hover:shadow-md transition-all">
                                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${item.color} group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 16, strokeWidth: 2.5 })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors truncate">
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm ${item.badge === 'Hot' ? 'bg-red-500 text-white shadow-red-200/50' : 'bg-blue-500 text-white shadow-blue-200/50'} shadow-sm uppercase tracking-wider shrink-0`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                 </div>

                 {/* 3. Shop By Budget (Span 5) */}
                 <div className="md:col-span-5 flex flex-col gap-4">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Icons.BarChart2 size={16} className="text-primary"/> 
                        <span>Shop By Budget</span>
                    </h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 h-full">
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Under ₹10,000", "Under ₹15,000", "Under ₹20,000", "Under ₹25,000", "Under ₹30,000", "Premium (>30k)"
                            ].map((price, idx) => (
                                <span 
                                    key={idx} 
                                    onClick={() => handlePriceTagClick(price)}
                                    className="grow text-center bg-white dark:bg-gray-800 hover:bg-primary hover:text-white border border-gray-200 dark:border-gray-700 hover:border-primary px-3 py-2 text-xs font-bold rounded-lg text-gray-600 dark:text-gray-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
                                >
                                {price}
                                </span>
                            ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                             <div className="flex items-center justify-between group cursor-pointer">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">View Full Price List</span>
                                <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <Icons.ChevronRight size={12}/>
                                </div>
                             </div>
                        </div>
                    </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;