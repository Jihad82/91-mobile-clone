
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icon';
import { useData } from '../context/DataContext';

interface HeroProps {
  onSearch: (criteria: { minPrice?: number; maxPrice?: number; keyword?: string; category?: string }) => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const { currency, convertPriceFromBDT, convertPriceToBDT, formatPrice } = useData();

  // Internal State stores Base Currency (BDT)
  const [minPriceBDT, setMinPriceBDT] = useState(10000);
  const [maxPriceBDT, setMaxPriceBDT] = useState(60000);
  
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<string>('');
  
  // Slider Drag State
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const maxRangeBDT = 150000;
  const minGapBDT = 2000;

  // Handle Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin && !isDraggingMax) return;
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      let newValue = Math.round((percentage / 100) * maxRangeBDT);
      
      // Snap to nearest 500
      newValue = Math.round(newValue / 500) * 500;

      if (isDraggingMin) {
        if (newValue <= maxPriceBDT - minGapBDT) {
          setMinPriceBDT(newValue);
        }
      } else if (isDraggingMax) {
        if (newValue >= minPriceBDT + minGapBDT) {
          setMaxPriceBDT(newValue);
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
  }, [isDraggingMin, isDraggingMax, minPriceBDT, maxPriceBDT]);

  // Calculate positions for rendering
  const minPos = Math.min((minPriceBDT / maxRangeBDT) * 100, 100);
  const maxPos = Math.min((maxPriceBDT / maxRangeBDT) * 100, 100);

  const handleSearch = () => {
    let keyword = '';
    if (selectedBrand) keyword += `${selectedBrand} `;
    if (selectedFeature) keyword += `${selectedFeature}`;

    onSearch({ 
        minPrice: minPriceBDT, 
        maxPrice: maxPriceBDT,
        keyword: keyword.trim(),
        category: 'mobile'
    });
  };

  const handleFeatureClick = (feature: string) => {
    onSearch({ keyword: feature });
  };

  const popularBrands = [
    'Samsung', 'Apple', 'Xiaomi', 'OnePlus', 
    'OPPO', 'Vivo', 'Realme', 'Huawei', 
    'Google', 'Motorola', 'Nokia', 'Sony'
  ];
  
  const priorities = [
      { id: '5G', label: '5G', icon: <Icons.Wifi size={14} /> },
      { id: 'Camera', label: 'Camera', icon: <Icons.Camera size={14} /> },
      { id: 'Gaming', label: 'Gaming', icon: <Icons.Cpu size={14} /> },
      { id: 'Battery', label: 'Battery', icon: <Icons.Battery size={14} /> }
  ];

  return (
    <section className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-8 font-sans transition-colors duration-300 overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-[1200px] px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Enhanced Phone Finder Widget */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-gray-100 dark:border-gray-800 relative overflow-hidden group h-full flex flex-col">
               {/* Header */}
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Icons.Search size={20} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-none">
                        Phone Finder
                    </h2>
                    <span className="text-xs text-gray-500 font-medium">Find your perfect match</span>
                 </div>
               </div>
              
              <div className="space-y-6 flex-1">
                 {/* Price Slider */}
                 <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Budget</span>
                        <div className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded">
                            {formatPrice(minPriceBDT)} - {formatPrice(maxPriceBDT)}
                        </div>
                    </div>
                    
                    <div 
                        ref={sliderRef}
                        className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-6 cursor-pointer select-none touch-none"
                    >
                        <div 
                            className="absolute h-full bg-gradient-to-r from-primary to-blue-600 rounded-full opacity-100 shadow-glow-sm pointer-events-none"
                            style={{ left: `${minPos}%`, width: `${maxPos - minPos}%` }}
                        ></div>
                        <div 
                            className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform z-10"
                            style={{ left: `${minPos}%`, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => { e.stopPropagation(); setIsDraggingMin(true); }}
                        ></div>
                        <div 
                            className="absolute top-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform z-10"
                            style={{ left: `${maxPos}%`, transform: 'translate(-50%, -50%)' }}
                            onMouseDown={(e) => { e.stopPropagation(); setIsDraggingMax(true); }}
                        ></div>
                    </div>
                 </div>

                 {/* Brand Selection */}
                 <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Brand</span>
                    <div className="grid grid-cols-4 gap-2">
                        {popularBrands.map(brand => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
                                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all border truncate ${
                                    selectedBrand === brand 
                                    ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                                title={brand}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                 </div>

                 {/* Feature Priority */}
                 <div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Priority</span>
                    <div className="flex flex-wrap gap-2">
                        {priorities.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedFeature(selectedFeature === p.id ? '' : p.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                                    selectedFeature === p.id 
                                    ? 'bg-gray-800 dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                            >
                                {p.icon} {p.label}
                            </button>
                        ))}
                    </div>
                 </div>

                 <button 
                    onClick={handleSearch}
                    className="w-full mt-4 bg-gradient-to-r from-primary to-brand-blue hover:from-primary-dark hover:to-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 uppercase tracking-wide group/btn"
                 >
                    <Icons.Search size={18} className="group-hover/btn:scale-110 transition-transform" />
                    Find Mobiles
                 </button>
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
                    Explore Categories
                </h2>
             </div>

             {/* 1. Main Categories Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { name: "Mobiles", id: 'mobile', icon: <Icons.Smartphone />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", borderColor: "hover:border-blue-200 dark:hover:border-blue-800" },
                  { name: "Laptops", id: 'laptop', icon: <Icons.Laptop />, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20", borderColor: "hover:border-indigo-200 dark:hover:border-indigo-800" },
                  { name: "Tablets", id: 'tablet', icon: <Icons.Tablet />, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800" },
                  { name: "TVs", id: 'tv', icon: <Icons.Tv />, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20", borderColor: "hover:border-rose-200 dark:hover:border-rose-800" }
               ].map((cat, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => onSearch({ category: cat.id })}
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

             {/* Expanded Features Section (Replaces the split layout) */}
             <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Icons.TrendingUp size={16} className="text-primary"/> 
                    <span>Trending Features</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                    { icon: <Icons.Smartphone />, label: "5G Mobiles", keyword: "5G", color: "text-blue-500", desc: "Superfast connectivity" },
                    { icon: <Icons.Camera />, label: "Best Camera", keyword: "Camera", color: "text-purple-500", badge: "Hot", desc: "Pro photography" },
                    { icon: <Icons.Battery />, label: "Big Battery", keyword: "Battery", color: "text-green-500", desc: "Long lasting power" },
                    { icon: <Icons.Cpu />, label: "Gaming Pro", keyword: "Gaming", color: "text-red-500", desc: "High performance" }, 
                    { icon: <Icons.Clock />, label: "Upcoming", keyword: "Coming", color: "text-orange-500", badge: "New", desc: "Future releases" },
                    { icon: <Icons.Tablet />, label: "Top Tablets", keyword: "Tablet", color: "text-teal-500", desc: "Work & Play" },
                    { icon: <Icons.Zap />, label: "Fast Charging", keyword: "Charging", color: "text-yellow-500", desc: "0-100% in minutes" },
                    { icon: <Icons.DollarSign />, label: "Budget Friendly", keyword: "Budget", color: "text-cyan-500", desc: "Best value picks" }
                    ].map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleFeatureClick(item.keyword)}
                        className="group relative p-0.5 rounded-xl cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1 h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                        
                        <div className="relative flex flex-col justify-center gap-2 p-4 rounded-[11px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:border-transparent h-full shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${item.color} group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300`}>
                                    {React.cloneElement(item.icon as React.ReactElement, { size: 20, strokeWidth: 2.5 })}
                                </div>
                                {item.badge && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ${item.badge === 'Hot' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'} shadow-sm uppercase tracking-wider`}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                                    {item.label}
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                                    {item.desc}
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
