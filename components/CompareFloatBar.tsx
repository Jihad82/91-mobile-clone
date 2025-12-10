
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { Product } from '../types';

// Helper to generate mock specs for the demo since the Product type is simple
const getMockSpecs = (id: string) => {
  // Deterministic "random" based on ID char codes sum
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

const CompareFloatBar = () => {
  const { compareList, removeFromCompare, clearCompare, formatPrice } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bar - Glassmorphism */}
      <div className="fixed bottom-0 left-0 w-full glass border-t border-gray-200 dark:border-gray-700 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-40 p-3 animate-fade-in-up">
        <div className="container mx-auto max-w-[1200px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <div className="text-sm font-black text-gray-700 dark:text-gray-200 tracking-tight">Compare Devices</div>
              <div className="text-[10px] text-gray-500 font-medium">{compareList.length} of 4 selected</div>
            </div>
            <div className="flex gap-4">
              {compareList.map((item) => (
                <div key={item.id} className="relative group w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-1.5 shadow-sm hover:scale-105 transition-transform">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Icons.X size={12} />
                  </button>
                </div>
              ))}
              {Array.from({ length: 4 - compareList.length }).map((_, idx) => (
                <div key={idx} className="w-14 h-14 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-600">
                  <Icons.Plus size={16} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={clearCompare}
              className="text-gray-500 hover:text-red-500 text-xs font-bold uppercase transition-colors px-2"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full shadow-lg shadow-primary/40 font-bold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5 flex items-center gap-2"
              disabled={compareList.length < 2}
            >
              Compare
              {compareList.length < 2 && <span className="text-[10px] normal-case opacity-80 font-normal ml-1 hidden sm:inline">(Add 2+)</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-950 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-fade-in-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 flex items-center gap-2 tracking-tight">
                <Icons.BarChart2 className="text-primary" /> 
                Detailed Comparison
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white transition-colors">
                <Icons.X size={18} />
              </button>
            </div>

            {/* Comparison Table Container */}
            <div className="overflow-auto flex-1 p-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left w-48 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 rounded-l-lg text-xs font-black uppercase text-gray-400 tracking-wider">Features</th>
                    {compareList.map(item => (
                      <th key={item.id} className="p-6 w-64 min-w-[240px] border-b border-gray-200 dark:border-gray-700 relative align-top bg-white dark:bg-gray-950">
                         <div className="flex flex-col items-center text-center">
                            <div className="relative mb-4 group">
                                <img src={item.image} alt={item.name} className="h-40 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                                <button onClick={() => removeFromCompare(item.id)} className="absolute -top-2 -right-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white rounded-full p-1.5 text-gray-600 dark:text-gray-300 transition-colors shadow">
                                    <Icons.X size={14} />
                                </button>
                            </div>
                            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1 leading-tight h-10 overflow-hidden">{item.name}</h3>
                            <div className="text-primary font-black text-lg">{formatPrice(item.price_bd)}</div>
                         </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 dark:text-gray-300">
                   {/* Spec Score Row */}
                   <tr>
                     <td className="p-5 font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800">Spec Score</td>
                     {compareList.map(item => (
                       <td key={item.id} className="p-5 text-center border-b border-gray-100 dark:border-gray-800">
                          {item.specScore ? (
                             <div className="flex justify-center">
                                 <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-white font-black text-sm shadow-lg ${item.specScore >= 90 ? 'bg-spec-green' : 'bg-spec-yellow'}`}>
                                    {item.specScore}
                                 </div>
                             </div>
                          ) : <span className="text-gray-400">-</span>}
                       </td>
                     ))}
                   </tr>

                   {/* Generated Mock Specs Rows */}
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
                        <td className="p-5 font-bold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                            <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                                {spec.icon}
                            </div>
                            {spec.label}
                        </td>
                        {compareList.map(item => (
                            <td key={item.id} className="p-5 text-center border-b border-gray-100 dark:border-gray-800 font-semibold">
                                {/* Casting to any because mock specs aren't on Product type */}
                                {(getMockSpecs(item.id) as any)[spec.key]}
                            </td>
                        ))}
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareFloatBar;
