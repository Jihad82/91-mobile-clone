
import React, { useState } from 'react';
import { Icons } from './Icon';
import { LaptopProduct } from '../types';

interface LaptopProductFormProps {
  initialData?: Partial<LaptopProduct> | null;
  onSave: (product: LaptopProduct) => void;
  onCancel: () => void;
}

const defaultLaptop: Partial<LaptopProduct> = {
  brand: '', model: '', category: 'laptop', status: 'Available',
  processor_brand: 'Intel', graphics_type: 'Integrated',
  ram_gb: 8, storage_type: 'SSD', storage_capacity_gb: 512,
  screen_size_in: 15.6, warranty_years: 1, images: []
};

const LaptopProductForm: React.FC<LaptopProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<LaptopProduct>>({ ...defaultLaptop, ...initialData });
  
  const handleChange = (field: keyof LaptopProduct, value: any) => {
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
            <h2 className="text-xl font-bold">Laptop Editor</h2>
            <div className="flex gap-2">
                <button onClick={onCancel} className="px-4 py-2 bg-gray-700 rounded font-bold text-sm">Cancel</button>
                <button onClick={() => onSave(formData as LaptopProduct)} className="px-4 py-2 bg-primary text-black rounded font-bold text-sm">Save Laptop</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
            {/* General */}
            <div className="col-span-2"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">1. General Info</h3></div>
            <Input label="Brand" field="brand" />
            <Input label="Model" field="model" />
            <Input label="Price (BDT)" field="price_bd" type="number" />
            <Select label="Status" field="status" options={['Available', 'Coming Soon', 'Out of Stock']} />

            {/* Processor */}
            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">2. Performance</h3></div>
            <Select label="Processor Brand" field="processor_brand" options={['Intel', 'AMD', 'Apple', 'Qualcomm']} />
            <Input label="Processor Model" field="processor_name" />
            <Input label="Cores" field="cores" type="number" />
            <Input label="Graphics Model" field="graphics_model" />
            <Select label="Graphics Type" field="graphics_type" options={['Integrated', 'Dedicated']} />
            <Input label="VRAM (GB)" field="graphics_memory_gb" type="number" suffix="GB" />

            {/* Memory & Storage */}
            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">3. Memory & Storage</h3></div>
            <Input label="RAM (GB)" field="ram_gb" type="number" suffix="GB" />
            <Input label="RAM Type" field="ram_type" />
            <Input label="Storage (GB)" field="storage_capacity_gb" type="number" suffix="GB" />
            <Select label="Storage Type" field="storage_type" options={['SSD', 'HDD', 'eMMC']} />

            {/* Display */}
            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">4. Display</h3></div>
            <Input label="Screen Size (Inches)" field="screen_size_in" type="number" suffix='"' />
            <Input label="Resolution" field="resolution" />
            
            {/* Others */}
            <div className="col-span-2 mt-4"><h3 className="text-primary font-bold uppercase text-sm mb-4 border-b border-gray-800 pb-2">5. Other Specs</h3></div>
            <Input label="OS" field="os" />
            <Input label="Weight (Kg)" field="weight_kg" type="number" suffix="kg" />
            <Input label="Battery (Whr)" field="battery_whr" type="number" suffix="Whr" />
            <Input label="Warranty (Years)" field="warranty_years" type="number" suffix="Yrs" />
        </div>
    </div>
  );
};

export default LaptopProductForm;
