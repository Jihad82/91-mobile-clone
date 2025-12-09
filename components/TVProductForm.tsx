
import React, { useState } from 'react';
import { TVProduct } from '../types';

interface TVProductFormProps {
  initialData?: Partial<TVProduct> | null;
  onSave: (product: TVProduct) => void;
  onCancel: () => void;
}

const defaultTV: Partial<TVProduct> = {
  brand: '', model: '', category: 'tv', status: 'Available',
  screen_size_in: 55, resolution_type: '4K', panel_type: 'LED',
  is_smart_tv: true, images: []
};

const TVProductForm: React.FC<TVProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TVProduct>>({ ...defaultTV, ...initialData });

  const handleChange = (field: keyof TVProduct, value: any) => {
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
            <h2 className="text-xl font-bold">TV Editor</h2>
            <div className="flex gap-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded font-bold text-sm">Cancel</button>
                <button onClick={() => onSave(formData as TVProduct)} className="px-4 py-2 bg-primary text-black rounded font-bold text-sm">Save TV</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
            <div className="col-span-2"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">General</h3></div>
            <Input label="Brand" field="brand" />
            <Input label="Model" field="model" />
            <Input label="Price (BDT)" field="price_bd" type="number" />
            <Select label="Status" field="status" options={['Available', 'Coming Soon']} />

            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">Display & Audio</h3></div>
            <Input label="Screen Size (Inches)" field="screen_size_in" type="number" suffix='"' />
            <Select label="Resolution" field="resolution_type" options={['HD Ready', 'Full HD', '4K', '8K']} />
            <Select label="Panel Type" field="panel_type" options={['LED', 'OLED', 'QLED', 'Mini-LED']} />
            <Input label="Refresh Rate (Hz)" field="refresh_rate_hz" type="number" suffix="Hz" />
            <Input label="Sound Output (W)" field="sound_output_w" type="number" suffix="W" />
            
            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">Smart Features & Connectivity</h3></div>
            <Input label="OS" field="os" />
            <Input label="HDMI Ports" field="hdmi_ports" type="number" />
            <Input label="USB Ports" field="usb_ports" type="number" />
            
            <div className="col-span-2 flex gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.is_smart_tv} onChange={e => handleChange('is_smart_tv', e.target.checked)} className="rounded bg-gray-900 border-gray-700"/>
                    <span className="text-sm font-bold">Smart TV</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.dolby_audio} onChange={e => handleChange('dolby_audio', e.target.checked)} className="rounded bg-gray-900 border-gray-700"/>
                    <span className="text-sm font-bold">Dolby Audio</span>
                </label>
            </div>
        </div>
    </div>
  );
};

export default TVProductForm;
