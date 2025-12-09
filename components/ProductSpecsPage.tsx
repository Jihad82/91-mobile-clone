
import React, { useState, useEffect } from 'react';
import { Product, UserReview, MobileProduct, LaptopProduct, TabletProduct, TVProduct, AnyProduct } from '../types';
import { Icons } from './Icon';
import { useData } from '../context/DataContext';

interface ProductSpecsPageProps {
  product: Product;
  onNavigate: (view: string) => void;
}

interface SpecItem {
  label: string;
  value: string | number | boolean | undefined;
}

interface SpecSectionProps {
  category: string;
  items: SpecItem[];
  defaultOpen?: boolean;
}

// Collapsible Section Component
const SpecSection: React.FC<SpecSectionProps> = ({ category, items, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-900 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      >
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base uppercase tracking-wide group-hover:text-primary transition-colors">{category}</h3>
        <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'bg-transparent text-gray-400'}`}>
           <Icons.ChevronDown size={18} />
        </div>
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
         <div className="p-0">
             <table className="w-full text-sm">
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="py-3.5 px-5 w-[40%] md:w-[30%] font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-800/20">{item.label}</td>
                            <td className="py-3.5 px-5 font-bold text-gray-800 dark:text-gray-200">{item.value?.toString() || '-'}</td>
                        </tr>
                    ))}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
};

const ProductSpecsPage: React.FC<ProductSpecsPageProps> = ({ product, onNavigate }) => {
    const { mobiles, laptops, tablets, tvs, addToCompare } = useData();
    const [activeTab, setActiveTab] = useState('specs');
    
    // Find full product details from specific category stores
    const fullProduct = (
        mobiles.find(m => m.id === product.id) ||
        laptops.find(l => l.id === product.id) ||
        tablets.find(t => t.id === product.id) ||
        tvs.find(t => t.id === product.id) ||
        product // Fallback
    ) as AnyProduct;

    const [reviews, setReviews] = useState<UserReview[]>([
        { name: "Rahul S.", title: "Great product", rating: 5, text: "Excellent performance and build quality.", date: "2 days ago" },
    ]);

    // Dynamic Specs Generation based on Category
    const getSpecs = (): SpecSectionProps[] => {
        if (fullProduct.category === 'laptop') {
            const p = fullProduct as LaptopProduct;
            return [
                { category: 'General', defaultOpen: true, items: [{ label: 'Brand', value: p.brand }, { label: 'Model', value: p.model }, { label: 'OS', value: p.os }] },
                { category: 'Performance', defaultOpen: true, items: [{ label: 'Processor', value: `${p.processor_brand} ${p.processor_name}` }, { label: 'Cores', value: p.cores }, { label: 'RAM', value: `${p.ram_gb}GB ${p.ram_type || ''}` }] },
                { category: 'Display', items: [{ label: 'Size', value: `${p.screen_size_in}"` }, { label: 'Resolution', value: p.resolution }] },
                { category: 'Storage', items: [{ label: 'Capacity', value: `${p.storage_capacity_gb}GB` }, { label: 'Type', value: p.storage_type }] },
            ];
        } else if (fullProduct.category === 'tv') {
            const p = fullProduct as TVProduct;
            return [
                { category: 'General', defaultOpen: true, items: [{ label: 'Brand', value: p.brand }, { label: 'Model', value: p.model }] },
                { category: 'Display', defaultOpen: true, items: [{ label: 'Size', value: `${p.screen_size_in}"` }, { label: 'Type', value: p.panel_type }, { label: 'Res', value: p.resolution_type }] },
                { category: 'Audio', items: [{ label: 'Output', value: `${p.sound_output_w}W` }, { label: 'Dolby', value: p.dolby_audio ? 'Yes' : 'No' }] },
                { category: 'Smart Features', items: [{ label: 'OS', value: p.os }, { label: 'Apps', value: p.supported_apps?.join(', ') }] },
            ];
        } else if (fullProduct.category === 'tablet') {
            const p = fullProduct as TabletProduct;
            return [
                { category: 'General', defaultOpen: true, items: [{ label: 'Brand', value: p.brand }, { label: 'Model', value: p.model }] },
                { category: 'Display', defaultOpen: true, items: [{ label: 'Size', value: `${p.screen_size_in}"` }, { label: 'Res', value: p.resolution }] },
                { category: 'Hardware', items: [{ label: 'Processor', value: p.processor }, { label: 'RAM', value: `${p.ram_gb}GB` }] },
            ];
        }
        // Mobile (Default/Fallback)
        const p = fullProduct as MobileProduct;
        return [
            { category: 'General', defaultOpen: true, items: [{ label: 'Brand', value: p.brand }, { label: 'Model', value: p.model }] },
            { category: 'Display', items: [{ label: 'Type', value: p.display_type || '-' }, { label: 'Size', value: p.screen_size_in ? `${p.screen_size_in}"` : '-' }] },
            { category: 'Hardware', items: [{ label: 'Chipset', value: p.chipset || '-' }, { label: 'RAM', value: p.ram_gb ? `${p.ram_gb}GB` : '-' }] },
        ];
    };

    const specs = getSpecs();

    useEffect(() => { window.scrollTo(0,0); }, [product.id]);

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen pb-20 transition-colors duration-300 font-sans">
            <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                <div className="container mx-auto max-w-[1200px] px-4 flex items-center gap-2">
                    <span className="hover:text-primary cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
                    <Icons.ChevronRight size={10} />
                    <span>{fullProduct.category || 'Product'}</span>
                    <Icons.ChevronRight size={10} />
                    <span className="text-primary">{(fullProduct as any).model || product.name}</span>
                </div>
            </div>

            <div className="container mx-auto max-w-[1200px] px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex items-center justify-center relative group overflow-hidden shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full max-h-[400px] object-contain" />
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 mb-2">{(fullProduct as any).brand} {(fullProduct as any).model || product.name}</h1>
                            <div className="text-3xl font-black text-gray-900 dark:text-white mb-4">BDT {(fullProduct as any).price_bd?.toLocaleString() || product.price}</div>
                            <button onClick={() => addToCompare(product)} className="flex items-center gap-2 bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30">
                                <Icons.BarChart2 size={20} /> Compare
                            </button>
                        </div>

                        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-8">
                            <button onClick={() => setActiveTab('specs')} className={`px-6 py-3 text-sm font-bold uppercase border-b-2 ${activeTab === 'specs' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Specs</button>
                            <button onClick={() => setActiveTab('reviews')} className={`px-6 py-3 text-sm font-bold uppercase border-b-2 ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}>Reviews</button>
                        </div>

                        {activeTab === 'specs' && (
                            <div className="space-y-1">
                                {specs.map((section, idx) => (
                                    <SpecSection key={idx} category={section.category} items={section.items} defaultOpen={section.defaultOpen} />
                                ))}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                {reviews.map((rev, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-bold text-sm text-gray-900 dark:text-gray-100">{rev.name}</div>
                                            <div className="text-xs text-gray-400">{rev.date}</div>
                                        </div>
                                        <div className="text-yellow-500 text-xs mb-2 flex gap-1">{'★'.repeat(rev.rating)}</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{rev.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSpecsPage;
