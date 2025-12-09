
import React, { useState } from 'react';
import { TabletProduct } from '../types';

interface TabletProductFormProps {
  initialData?: Partial<TabletProduct> | null;
  onSave: (product: TabletProduct) => void;
  onCancel: () => void;
}

const defaultTablet: Partial<TabletProduct> = {
  brand: '', model: '', category: 'tablet', status: 'Available',
  screen_size_in: 10.1, network_support: 'Wi-Fi Only',
  ram_gb: 4, storage_gb: 64, images: []
};

const TabletProductForm: React.FC<TabletProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TabletProduct>>({ ...defaultTablet, ...initialData });

  const handleChange = (field: keyof TabletProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const Input = ({ label, field, type = 'text', suffix }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{label}</label>
      <div className="relative">
        <input 
          type={type}
          value={(formData as any)[field] || ''}
          onChange={(e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
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
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
            <h2 className="text-xl font-bold">Tablet Editor</h2>
            <div className="flex gap-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded font-bold text-sm">Cancel</button>
                <button onClick={() => onSave(formData as TabletProduct)} className="px-4 py-2 bg-primary text-black rounded font-bold text-sm">Save Tablet</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
            <Input label="Brand" field="brand" />
            <Input label="Model" field="model" />
            <Input label="Price (BDT)" field="price_bd" type="number" />
            <Select label="Status" field="status" options={['Available', 'Coming Soon']} />
            
            <div className="col-span-2 border-t border-gray-800 my-2"></div>
            
            <Input label="Screen Size (Inches)" field="screen_size_in" type="number" suffix='"' />
            <Input label="Display Type" field="display_type" />
            <Input label="Resolution" field="resolution" />
            
            <Input label="Processor" field="processor" />
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
                    <span className="text-sm font-bold">Stylus Support</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.keyboard_support} onChange={e => handleChange('keyboard_support', e.target.checked)} className="rounded bg-gray-900 border-gray-700"/>
                    <span className="text-sm font-bold">Keyboard Support</span>
                </label>
            </div>
        </div>
    </div>
  );
};

export default TabletProductForm;
