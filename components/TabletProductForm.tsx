
import React, { useState } from 'react';
import { Icons } from './Icon';
import { TabletProduct } from '../types';

interface TabletProductFormProps {
  initialData?: Partial<TabletProduct> | null;
  onSave: (product: TabletProduct) => void;
  onCancel: () => void;
}

const defaultTablet: Partial<TabletProduct> = {
  brand: '', model: '', category: 'tablet', status: 'Available',
  screen_size_in: 10.1, network_support: 'Wi-Fi Only',
  ram_gb: 4, storage_gb: 64, images: [], tags: []
};

const TabletProductForm: React.FC<TabletProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TabletProduct>>({ ...defaultTablet, ...initialData });
  const [activeTab, setActiveTab] = useState<'specs' | 'media' | 'seo'>('specs');

  const handleChange = (field: keyof TabletProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Input = ({ label, field, type = 'text', suffix, placeholder }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{label}</label>
      <div className="relative">
        <input 
          type={type}
          value={(formData as any)[field] || ''}
          onChange={(e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-primary"
        />
        {suffix && <span className="absolute right-3 top-2 text-gray-500 text-xs">{suffix}</span>}
      </div>
    </div>
  );

  const Select = ({ label, field, options }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{label}</label>
      <select 
        value={(formData as any)[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-primary"
      >
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-800 bg-[#1e293b] flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-4">
                 <button onClick={onCancel} className="text-gray-400 hover:text-white"><Icons.ArrowRight className="rotate-180" size={20}/></button>
                 <h2 className="font-bold text-white">{formData.id ? 'Edit Tablet' : 'Add New Tablet'}</h2>
                 <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${formData.status === 'Available' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {formData.status}
                 </span>
             </div>
             
             <div className="flex items-center gap-3">
                 <button onClick={() => onSave(formData as TabletProduct)} className="px-4 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg text-xs font-bold">Publish</button>
             </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
            
            {/* Form Area */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-gray-800">
                
                {/* Tabs */}
                <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
                    {['specs', 'media', 'seo'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as any)}
                            className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                        >
                            {tab === 'specs' ? 'Specifications' : tab === 'media' ? 'Images & Video' : 'SEO & Meta'}
                        </button>
                    ))}
                </div>

                {/* Specs Tab */}
                {activeTab === 'specs' && (
                    <div className="max-w-3xl animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <Input label="Brand" field="brand" placeholder="Samsung" />
                            <Input label="Model" field="model" placeholder="Galaxy Tab S9" />
                            <Input label="Price (BDT)" field="price_bd" type="number" />
                            <Select label="Status" field="status" options={['Available', 'Coming Soon']} />
                            
                            <div className="col-span-2 border-t border-gray-800 my-2"></div>
                            
                            <Input label="Screen Size (Inches)" field="screen_size_in" type="number" suffix='"' />
                            <Input label="Display Type" field="display_type" placeholder="AMOLED" />
                            <Input label="Resolution" field="resolution" placeholder="2560 x 1600" />
                            
                            <Input label="Processor" field="processor" placeholder="Snapdragon 8 Gen 2" />
                            <Input label="RAM (GB)" field="ram_gb" type="number" suffix="GB" />
                            <Input label="Storage (GB)" field="storage_gb" type="number" suffix="GB" />
                            
                            <div className="col-span-2 border-t border-gray-800 my-2"></div>

                            <Select label="Network" field="network_support" options={['Wi-Fi Only', 'Wi-Fi + Cellular']} />
                            <Input label="Main Camera (MP)" field="main_camera_mp" type="number" suffix="MP" />
                            <Input label="Front Camera (MP)" field="front_camera_mp" type="number" suffix="MP" />
                            <Input label="Battery (mAh)" field="battery_mah" type="number" suffix="mAh" />
                            <Input label="OS" field="os" />
                            
                            <div className="col-span-2 flex gap-6 mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.stylus_support} onChange={e => handleChange('stylus_support', e.target.checked)} className="rounded bg-gray-900 border-gray-700"/>
                                    <span className="text-sm font-bold text-gray-300">Stylus Support</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.keyboard_support} onChange={e => handleChange('keyboard_support', e.target.checked)} className="rounded bg-gray-900 border-gray-700"/>
                                    <span className="text-sm font-bold text-gray-300">Keyboard Support</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="max-w-3xl animate-fade-in">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center mb-6">
                            <Icons.Image size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="font-bold text-white mb-2">Upload Tablet Images</h3>
                            <button className="bg-primary text-black font-bold px-4 py-2 rounded text-sm hover:bg-primary-dark">Select Files</button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1].map(i => (
                                <div key={i} className="aspect-square bg-gray-800 rounded-lg border border-gray-700 relative group">
                                    <div className="flex items-center justify-center h-full text-gray-600 text-xs">Image {i}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="max-w-3xl space-y-4 animate-fade-in">
                        <Input label="URL Slug" field="slug" placeholder="samsung-galaxy-tab-s9" />
                        <Input label="Meta Title" field="meta_title" />
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Meta Description</label>
                            <textarea 
                                value={formData.meta_description || ''}
                                onChange={(e) => handleChange('meta_description', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none h-24"
                            ></textarea>
                        </div>
                        <Input label="Tags" field="tags" placeholder="Comma separated..." />
                    </div>
                )}
            </div>

            {/* Preview Panel */}
            <div className="w-[375px] bg-white border-l border-gray-800 flex flex-col shrink-0">
                <div className="p-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Live Preview</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div className="flex-1 overflow-y-auto bg-white p-4">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-40 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300">
                             <Icons.Tablet size={48} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 text-center leading-tight">{formData.brand} {formData.model}</h2>
                        <div className="text-primary font-bold text-lg mt-1">BDT {formData.price_bd}</div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                        <h4 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2">Key Specs</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                             <div className="text-gray-500">Display</div>
                             <div className="font-bold text-gray-800 text-right">{formData.screen_size_in}" {formData.display_type}</div>
                             
                             <div className="text-gray-500">Processor</div>
                             <div className="font-bold text-gray-800 text-right">{formData.processor || '-'}</div>
                             
                             <div className="text-gray-500">Battery</div>
                             <div className="font-bold text-gray-800 text-right">{formData.battery_mah} mAh</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TabletProductForm;
