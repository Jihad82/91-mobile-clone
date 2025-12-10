
import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';
import { useData } from '../context/DataContext';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (criteria: { keyword: string; category?: string; minPrice?: number; maxPrice?: number }) => void;
  onNavigate: (view: string) => void;
}

// Mega Menu Content Component for Mobiles & Tablets
const MobilesMegaMenu = ({ onSearch }: { onSearch: (c: any) => void }) => {
  // Approximate BDT values for the requested INR ranges (1 INR ~ 1.4 BDT)
  // Rs 8k ~ 11.2k, Rs 12k ~ 16.8k, Rs 25k ~ 35k, Rs 10k ~ 14k, Rs 15k ~ 21k
  const handlePriceClick = (range: string, category: 'mobile' | 'tablet' = 'mobile') => {
      let min, max;
      if (range === '8k-12k') { min = 11200; max = 16800; }
      else if (range === '12k-25k') { min = 16800; max = 35000; }
      else if (range === 'above25k') { min = 35000; }
      else if (range === 'under10k') { max = 14000; }
      else if (range === 'under15k') { max = 21000; }
      
      onSearch({ category, minPrice: min, maxPrice: max });
  };

  return (
    <div className="flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t-2 border-primary rounded-b-xl p-6 gap-8 w-[800px] cursor-default text-left animate-slide-down ring-1 ring-black/5 dark:ring-white/5">
      {/* Column 1: Mobiles & Features */}
      <div className="flex-1 space-y-6">
        <div>
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Mobiles</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Phone Finder', action: () => onSearch({ category: 'mobile' }) },
              { label: 'Best Mobiles', action: () => onSearch({ category: 'mobile', keyword: 'Best' }) },
              { label: 'Latest Mobiles', action: () => onSearch({ category: 'mobile' }) },
              { label: 'Upcoming Mobiles', action: () => onSearch({ category: 'mobile', keyword: 'Coming Soon' }) },
              { label: 'Smartphone Benchmarks', action: () => onSearch({ category: 'mobile' }) }
            ].map(item => (
              <li key={item.label}>
                <a onClick={(e) => { e.preventDefault(); item.action(); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-gray-800 dark:text-gray-200 font-bold text-xs uppercase mb-3 tracking-wider">Feature</h4>
          <ul className="space-y-2.5">
            {[
              { label: '5G Mobiles', action: () => onSearch({ category: 'mobile', keyword: '5G' }) },
              { label: 'Best Camera Phones', action: () => onSearch({ category: 'mobile', keyword: 'Camera' }) },
              { label: 'Best Gaming Phones', action: () => onSearch({ category: 'mobile', keyword: 'Gaming' }) },
              { label: 'Keypad Mobiles', action: () => onSearch({ category: 'mobile', keyword: 'Feature Phone' }) }
            ].map(item => (
              <li key={item.label}>
                <a onClick={(e) => { e.preventDefault(); item.action(); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Column 2: Brands */}
      <div className="flex-1">
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Brands</h4>
          <ul className="space-y-2.5">
            {['Samsung', 'Moto', 'Vivo', 'Realme', 'OnePlus', 'Xiaomi', 'OPPO', 'IQOO', 'POCO', 'Apple', 'Nothing'].map(brand => (
              <li key={brand}>
                <a onClick={(e) => { e.preventDefault(); onSearch({ category: 'mobile', keyword: brand }); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{brand} Mobiles</a>
              </li>
            ))}
          </ul>
      </div>

      {/* Column 3: Price Range & Tablets */}
      <div className="flex-1 space-y-6">
        <div>
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Price Range</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Rs. 8,000 - Rs. 12,000', action: () => handlePriceClick('8k-12k') },
              { label: 'Rs. 12,000 - Rs. 25,000', action: () => handlePriceClick('12k-25k') },
              { label: 'Above Rs. 25,000', action: () => handlePriceClick('above25k') }
            ].map(item => (
              <li key={item.label}>
                <a onClick={(e) => { e.preventDefault(); item.action(); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Tablets</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Tablet Finder', action: () => onSearch({ category: 'tablet' }) },
              { label: 'Samsung Tablets', action: () => onSearch({ category: 'tablet', keyword: 'Samsung' }) },
              { label: 'Apple Tablets', action: () => onSearch({ category: 'tablet', keyword: 'Apple' }) },
              { label: 'Lenovo Tablets', action: () => onSearch({ category: 'tablet', keyword: 'Lenovo' }) },
              { label: 'Best Tablets Under 10,000', action: () => handlePriceClick('under10k', 'tablet') },
              { label: 'Best Tablets Under 15,000', action: () => handlePriceClick('under15k', 'tablet') }
            ].map(item => (
              <li key={item.label}>
                <a onClick={(e) => { e.preventDefault(); item.action(); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Top 10 Mega Menu Component
const Top10MegaMenu = ({ onSearch }: { onSearch: (c: any) => void }) => {
  const handlePriceClick = (max: number) => {
      // Assuming 'Under' X amount in INR
      // Convert INR to BDT approx (1 INR ~ 1.41 BDT)
      const maxBDT = max * 1.41;
      onSearch({ category: 'mobile', maxPrice: maxBDT });
  };

  return (
    <div className="flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t-2 border-primary rounded-b-xl p-6 gap-8 w-[500px] cursor-default text-left animate-slide-down ring-1 ring-black/5 dark:ring-white/5">
      {/* Column 1: Categories */}
      <div className="flex-1">
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Categories</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Best Mobiles', cat: 'mobile' },
              { label: 'Best Tablets', cat: 'tablet' },
              { label: 'Best Laptops', cat: 'laptop' },
              { label: 'Best TVs', cat: 'tv' }
            ].map(item => (
              <li key={item.label}>
                <a onClick={(e) => { e.preventDefault(); onSearch({ category: item.cat }); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item.label}</a>
              </li>
            ))}
          </ul>
      </div>

      {/* Column 2: Best Phones By Prices */}
      <div className="flex-1">
          <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Best Phones By Prices</h4>
          <ul className="space-y-2.5">
            {[10000, 12000, 15000, 20000, 25000, 30000].map(price => (
              <li key={price}>
                <a onClick={(e) => { e.preventDefault(); handlePriceClick(price); }} href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">Best Phones Under {price.toLocaleString()}</a>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

interface NavItemProps {
  label: string;
  hasDropdown?: boolean;
  isNew?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

const NavItem = ({ label, hasDropdown = true, isNew = false, children, onClick }: NavItemProps) => (
  <div className="group relative flex items-center h-full">
    <div 
      className="flex items-center gap-1.5 px-3 py-3 cursor-pointer text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
      onClick={onClick}
    >
      {label}
      {hasDropdown && <Icons.ChevronDown size={14} className="text-gray-400 group-hover:text-primary transition-colors group-hover:rotate-180 duration-300" />}
      {isNew && <span className="absolute top-0 right-0 text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse-slow">NEW</span>}
    </div>
    
    {/* Hover Indicator */}
    <div className="absolute bottom-0 left-3 right-3 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-t-full shadow-[0_-2px_6px_rgba(0,190,255,0.5)]"></div>

    {/* Dropdown Content */}
    {children && (
      <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-50">
           {children}
      </div>
    )}
  </div>
);

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onSearch, onNavigate }) => {
  const { currency, setCurrency } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('any');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPriceRange = (range: string) => {
    switch(range) {
        case '0-10000': return { min: 0, max: 10000 };
        case '10000-20000': return { min: 10000, max: 20000 };
        case '20000-30000': return { min: 20000, max: 30000 };
        case '30000-50000': return { min: 30000, max: 50000 };
        case '50000-500000': return { min: 50000, max: 500000 };
        default: return { min: undefined, max: undefined };
    }
  };

  const handleSearch = () => {
    const { min, max } = getPriceRange(priceRange);
    onSearch({ 
        keyword: searchTerm,
        category: category === 'all' ? undefined : category,
        minPrice: min,
        maxPrice: max
    });
    // For mobile menu behavior
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className={`sticky top-0 z-50 font-sans transition-all duration-300 border-b ${isScrolled ? 'glass border-gray-200/50 dark:border-gray-700/50 shadow-lg' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm'}`}>
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between h-16 py-2">
          {/* Logo */}
          <div 
            className="text-3xl font-black text-primary mr-6 tracking-tighter cursor-pointer flex items-center gap-1 hover:opacity-90 transition-opacity" 
            onClick={() => onNavigate('home')}
          >
            91mobiles
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative mr-auto ml-2 group">
              <div className="w-full h-11 flex items-center bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-gray-800 transition-all">
                  
                  {/* Category Select */}
                  <div className="relative h-full">
                      <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="h-full pl-4 pr-6 bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none border-r border-gray-300 dark:border-gray-700 cursor-pointer appearance-none hover:text-primary rounded-l-full"
                      >
                          <option value="all">All</option>
                          <option value="mobile">Mobiles</option>
                          <option value="laptop">Laptops</option>
                          <option value="tablet">Tablets</option>
                          <option value="tv">TVs</option>
                      </select>
                      <Icons.ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Price Select */}
                  <div className="relative h-full">
                      <select 
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="h-full pl-3 pr-6 bg-transparent text-xs font-bold text-gray-600 dark:text-gray-300 outline-none border-r border-gray-300 dark:border-gray-700 cursor-pointer appearance-none hover:text-primary w-[90px]"
                      >
                          <option value="any">Price</option>
                          <option value="0-10000"> &lt; 10K</option>
                          <option value="10000-20000">10-20K</option>
                          <option value="20000-30000">20-30K</option>
                          <option value="30000-50000">30-50K</option>
                          <option value="50000-500000"> &gt; 50K</option>
                      </select>
                      <Icons.ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Input */}
                  <input 
                      type="text" 
                      placeholder="Search..." 
                      className="flex-1 h-full px-4 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyDown}
                  />

                  {/* Search Button */}
                  <div 
                      className="h-9 w-9 mr-1 flex items-center justify-center bg-primary rounded-full cursor-pointer hover:bg-primary-dark transition-all shadow-md hover:scale-105"
                      onClick={handleSearch}
                  >
                      <Icons.Search className="text-white" size={18} strokeWidth={2.5} />
                  </div>
              </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 ml-6">
             {/* Currency Switcher */}
             <div className="hidden sm:block">
                 <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-2 px-3 rounded-lg cursor-pointer outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-r-8 border-transparent"
                 >
                    <option value="BDT">BDT ৳</option>
                    <option value="INR">INR ₹</option>
                    <option value="USD">USD $</option>
                 </select>
             </div>

             <button 
               onClick={toggleDarkMode} 
               className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all hover:scale-110 active:scale-95"
               aria-label="Toggle Dark Mode"
             >
               {darkMode ? <Icons.Sun size={20} className="text-yellow-400" /> : <Icons.Moon size={20} className="text-primary" />}
             </button>

             <div className="hidden lg:flex flex-col items-end cursor-pointer hover:text-primary group/login">
                <span className="text-xs font-bold text-primary group-hover/login:underline">Login</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Sign Up</span>
             </div>
             
             {/* Mobile Menu Toggle */}
             <button 
                className="lg:hidden text-gray-600 dark:text-gray-300 ml-4 p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
                {isMenuOpen ? <Icons.X size={24} /> : <Icons.Menu size={24} />}
             </button>
          </div>
        </div>

        {/* Navigation Bar - Desktop */}
        <nav className="hidden lg:flex items-center border-t border-gray-100/50 dark:border-gray-800/50 -mx-4 px-4 relative z-40">
          <NavItem label="Mobiles & Tablets">
            <MobilesMegaMenu onSearch={onSearch} />
          </NavItem>
          <NavItem label="Top 10">
            <Top10MegaMenu onSearch={onSearch} />
          </NavItem>
          <NavItem label="Compare" onClick={() => onNavigate('compare')} hasDropdown={false} />
          <NavItem 
            label="Upcoming Mobiles" 
            onClick={() => onSearch({ category: 'mobile', keyword: 'Coming Soon' })}
            hasDropdown={false} 
          />
          <NavItem label="News & Reviews" onClick={() => onNavigate('news')} hasDropdown={false} isNew={true} />
          <NavItem 
            label="Laptops" 
            onClick={() => onSearch({ category: 'laptop' })}
            hasDropdown={false}
          />
          <NavItem 
            label="TV" 
            onClick={() => onSearch({ category: 'tv' })}
            hasDropdown={false}
          />
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-2 animate-fade-in z-50">
                <div className="flex flex-col gap-2 mb-4">
                     <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full h-10 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm outline-none"
                      >
                          <option value="all">All Categories</option>
                          <option value="mobile">Mobiles</option>
                          <option value="laptop">Laptops</option>
                          <option value="tablet">Tablets</option>
                          <option value="tv">TVs</option>
                      </select>
                      <div className="flex relative">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-full h-10 pl-4 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:border-primary text-gray-700 dark:text-gray-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <div 
                            className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-primary rounded-r-md cursor-pointer"
                            onClick={handleSearch}
                        >
                            <Icons.Search className="text-white" size={18} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2 px-1">
                   <span className="text-sm font-bold text-gray-500">Currency</span>
                   <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold py-1 px-2 rounded outline-none"
                   >
                      <option value="BDT">BDT ৳</option>
                      <option value="INR">INR ₹</option>
                      <option value="USD">USD $</option>
                   </select>
                </div>
                <div className="flex flex-col gap-1">
                    <NavItem label="Mobiles & Tablets" onClick={() => { onSearch({ category: 'mobile' }); setIsMenuOpen(false); }}/>
                    <NavItem label="Top 10" onClick={() => { onSearch({ keyword: 'Best' }); setIsMenuOpen(false); }}/>
                    <NavItem label="Compare" onClick={() => { onNavigate('compare'); setIsMenuOpen(false); }} />
                    <NavItem label="Upcoming Mobiles" onClick={() => { onSearch({ category: 'mobile', keyword: 'Coming Soon' }); setIsMenuOpen(false); }} />
                    <NavItem label="News & Reviews" onClick={() => { onNavigate('news'); setIsMenuOpen(false); }} />
                    <NavItem label="Laptops" onClick={() => { onSearch({ category: 'laptop' }); setIsMenuOpen(false); }} />
                    <NavItem label="TVs" onClick={() => { onSearch({ category: 'tv' }); setIsMenuOpen(false); }} />
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">Login</span>
                        <span className="text-xs text-gray-500">Sign Up</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
