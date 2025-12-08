import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#111] text-gray-400 py-12 text-xs font-sans">
      <div className="container mx-auto max-w-[1200px] px-4">
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4 mb-10">
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-[11px] border-b border-gray-800 pb-2 inline-block">New Mobile Phones</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Samsung Galaxy Z TriFold</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">POCO F8 Pro</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Vivo Y19s 5G</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">OnePlus 13</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Realme GT 6</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-[11px] border-b border-gray-800 pb-2 inline-block">Mobile Brands</h4>
             <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Samsung Mobiles</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Xiaomi Mobiles</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Realme Mobiles</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">OnePlus Mobiles</a></li>
            </ul>
          </div>
           <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-[11px] border-b border-gray-800 pb-2 inline-block">Popular Mobiles</h4>
             <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">OnePlus Ace 6T</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Micromax J3 Plus</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">iPhone 16 Pro</a></li>
            </ul>
          </div>
           <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-[11px] border-b border-gray-800 pb-2 inline-block">Upcoming</h4>
             <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">POCO C85 5G</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Lava Action 4G</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Honor X6b Plus</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-[11px] border-b border-gray-800 pb-2 inline-block">Resources</h4>
             <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white hover:underline transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
             <span className="font-bold text-white uppercase text-[10px] tracking-wide">Follow us on</span>
             <div className="flex gap-3">
                {['fb', 'tw', 'yt', 'ig'].map(social => (
                  <div key={social} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary cursor-pointer transition-colors uppercase font-bold text-[10px]">
                    {social}
                  </div>
                ))}
             </div>
           </div>
           
           <div className="text-gray-500 text-[10px]">
             © 91digital web private limited. All Rights Reserved.
           </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start text-[10px] uppercase text-gray-600 font-medium">
           <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           <span className="text-gray-800">|</span>
           <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
           <span className="text-gray-800">|</span>
           <a href="#" className="hover:text-white transition-colors">Visitor Agreement</a>
           <span className="text-gray-800">|</span>
           <a href="#" className="hover:text-white transition-colors">Authors</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;