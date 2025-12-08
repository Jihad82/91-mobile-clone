import React, { useState, useEffect } from 'react';
import { Icons } from './Icon';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onSearch: (criteria: { keyword: string }) => void;
}

// Mega Menu Content Component for Mobiles & Tablets
const MobilesMegaMenu = () => (
  <div className="flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t-2 border-primary rounded-b-xl p-6 gap-8 w-[800px] cursor-default text-left animate-slide-down ring-1 ring-black/5 dark:ring-white/5">
    {/* Column 1: Mobiles & Features */}
    <div className="flex-1 space-y-6">
       <div>
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Mobiles</h4>
         <ul className="space-y-2.5">
           {['Phone Finder', 'Best Mobiles', 'Latest Mobiles', 'Upcoming Mobiles', 'Smartphone Benchmarks'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
       </div>
       <div>
         <h4 className="text-gray-800 dark:text-gray-200 font-bold text-xs uppercase mb-3 tracking-wider">Feature</h4>
         <ul className="space-y-2.5">
           {['5G Mobiles', 'Best Camera Phones', 'Best Gaming Phones', 'Keypad Mobiles'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
       </div>
    </div>
    
    {/* Column 2: Brands */}
    <div className="flex-1">
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Brands</h4>
         <ul className="space-y-2.5">
           {['Samsung Mobiles', 'Moto Mobiles', 'Vivo Mobiles', 'Realme Mobiles', 'OnePlus Mobiles', 'Xiaomi Mobiles', 'OPPO Mobiles', 'IQOO Mobiles', 'POCO Mobiles', 'Apple Mobiles', 'Nothing Mobiles'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
    </div>

    {/* Column 3: Price Range & Tablets */}
    <div className="flex-1 space-y-6">
       <div>
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Price Range</h4>
         <ul className="space-y-2.5">
           {['Rs. 8,000 - Rs. 12,000', 'Rs. 12,000 - Rs. 25,000', 'Above Rs. 25,000'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
       </div>
       <div>
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Tablets</h4>
         <ul className="space-y-2.5">
           {['Tablet Finder', 'Samsung Tablets', 'Apple Tablets', 'Lenovo Tablets', 'Best Tablets Under 10,000', 'Best Tablets Under 15,000'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
       </div>
    </div>
  </div>
);

// Top 10 Mega Menu Component
const Top10MegaMenu = () => (
  <div className="flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t-2 border-primary rounded-b-xl p-6 gap-8 w-[500px] cursor-default text-left animate-slide-down ring-1 ring-black/5 dark:ring-white/5">
    {/* Column 1: Categories */}
    <div className="flex-1">
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Categories</h4>
         <ul className="space-y-2.5">
           {['Best Mobiles', 'Best Tablets', 'Best Laptops', 'Best TVs'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
    </div>

    {/* Column 2: Best Phones By Prices */}
    <div className="flex-1">
         <h4 className="text-primary font-bold text-xs uppercase mb-3 border-b border-gray-100 dark:border-gray-700 pb-2 tracking-wider">Best Phones By Prices</h4>
         <ul className="space-y-2.5">
           {['Best Phones Under 10,000', 'Best Phones Under 12,000', 'Best Phones Under 15,000', 'Best Phones Under 20,000', 'Best Phones Under 25,000', 'Best Phones Under 30,000'].map(item => (
             <li key={item}><a href="#" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:translate-x-1 transition-all duration-200">{item}</a></li>
           ))}
         </ul>
    </div>
  </div>
);

const NavItem = ({ label, hasDropdown = true, isNew = false, children }: { label: string; hasDropdown?: boolean; isNew?: boolean; children?: React.ReactNode }) => (
  <div className="group relative flex items-center h-full">
    <div className="flex items-center gap-1.5 px-3 py-3 cursor-pointer text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
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

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch({ keyword: searchTerm });
      setIsMenuOpen(false);
    }
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
          <div className="text-3xl font-black text-primary mr-8 tracking-tighter cursor-pointer flex items-center gap-1 hover:opacity-90 transition-opacity" onClick={() => window.location.reload()}>
            91mobiles
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl relative mr-auto group">
             <input 
               type="text" 
               placeholder="Search for a mobile, tablet, laptop..." 
               className="w-full h-11 pl-5 pr-14 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-gray-800 transition-all placeholder-gray-500 dark:placeholder-gray-400 text-gray-700 dark:text-gray-200 shadow-inner"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onKeyDown={handleKeyDown}
             />
             <div 
                className="absolute right-1 top-1 h-9 w-9 flex items-center justify-center bg-primary rounded-full cursor-pointer hover:bg-primary-dark transition-all shadow-md group-hover:scale-105"
                onClick={handleSearch}
             >
                <Icons.Search className="text-white" size={18} strokeWidth={2.5} />
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 ml-6">
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
            <MobilesMegaMenu />
          </NavItem>
          <NavItem label="Top 10">
            <Top10MegaMenu />
          </NavItem>
          <NavItem label="Compare" />
          <NavItem label="Upcoming Mobiles" />
          <NavItem label="News & Reviews" />
          <NavItem label="Electronics" />
          <NavItem label="Laptops" />
          <NavItem label="TV" />
          <NavItem label="More" />
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-2 animate-fade-in z-50">
                <div className="flex relative mb-4">
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
                <div className="flex flex-col gap-1">
                    <NavItem label="Mobiles & Tablets" />
                    <NavItem label="Top 10" />
                    <NavItem label="Compare" />
                    <NavItem label="Upcoming Mobiles" />
                    <NavItem label="News & Reviews" />
                </div>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary">Login</span>
                        <span className="text-[10px] text-gray-500">Sign Up</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;