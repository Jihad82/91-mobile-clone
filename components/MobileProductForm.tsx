
import React, { useState, useEffect, useMemo } from 'react';
import { Icons } from './Icon';
import { MobileProduct, ProductImage } from '../types';

interface MobileProductFormProps {
  initialData?: Partial<MobileProduct> | null;
  onSave: (product: MobileProduct) => void;
  onCancel: () => void;
}

const defaultMobileData: Partial<MobileProduct> = {
  brand: '',
  model: '',
  device_type: 'Smartphone',
  price_bd: 0,
  status: 'Available',
  images: [],
  sims: [
    { slot: 'SIM 1', technology: ['4G'], sim_size: 'Nano', slot_type: 'Single SIM' },
    { slot: 'SIM 2', technology: ['4G'], sim_size: 'Nano', slot_type: 'Dual SIM (Hybrid)' }
  ],
  main_camera: {},
  selfie_camera: {},
  colors: [],
  sensors: [],
  usb_modes: [],
  tags: []
};

const SENSOR_OPTIONS = ['Light sensor', 'Proximity sensor', 'Accelerometer', 'Compass', 'Gyroscope', 'Barometer', 'Hall sensor', 'Thermometer', 'Fingerprint sensor'];
const USB_MODE_OPTIONS = ['Mass storage', 'USB charging', 'USB tethering', 'OTG'];
const NETWORK_TECH_OPTIONS = ['2G', '3G', '4G', '5G'];

const MobileProductForm: React.FC<MobileProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<MobileProduct>>({ ...defaultMobileData, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'specs' | 'media' | 'seo'>('specs');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
  // Section Visibility State
  const [sections, setSections] = useState({
    general: true,
    display: true,
    hardware: true,
    camera: false,
    design: false,
    battery: false,
    network: false,
    connectivity: false,
    multimedia: false,
    sensors: false,
    manufacturer: false
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (field: keyof MobileProduct, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent: keyof MobileProduct, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object || {}),
        [field]: value
      }
    }));
  };

  const handleSimChange = (index: number, field: string, value: any) => {
      const newSims = [...(formData.sims || [])];
      if (!newSims[index]) newSims[index] = { slot: `SIM ${index + 1}` };
      (newSims[index] as any)[field] = value;
      setFormData(prev => ({ ...prev, sims: newSims }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.device_type) newErrors.device_type = "Device Type is required";
    if (!formData.status) newErrors.status = "Status is required";
    
    if (formData.resolution && !/^\d{2,5}x\d{2,5}$/.test(formData.resolution)) {
        newErrors.resolution = "Invalid format. Use 1080x2400";
    }

    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
        newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status?: string) => {
    if (validate()) {
      const finalData = {
          ...formData,
          id: formData.id || Date.now().toString(),
          status: (status || formData.status) as any
      } as MobileProduct;
      onSave(finalData);
    } else {
        alert("Please fix validation errors.");
    }
  };

  // --- Render Helpers ---

  const Input = ({ label, field, type = 'text', placeholder, required = false, help, suffix, parent }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input 
          type={type}
          value={parent ? (formData[parent] as any)?.[field] || '' : (formData as any)[field] || ''}
          onChange={(e) => {
              const val = type === 'number' ? parseFloat(e.target.value) : e.target.value;
              parent ? handleNestedChange(parent, field, val) : handleChange(field, val);
          }}
          placeholder={placeholder}
          className={`w-full bg-gray-900 border ${errors[field] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white text-sm outline-none focus:border-primary transition-colors`}
        />
        {suffix && <span className="absolute right-3 top-2 text-gray-500 text-xs">{suffix}</span>}
      </div>
      {help && <p className="text-[10px] text-gray-500 mt-1">{help}</p>}
      {errors[field] && <p className="text-[10px] text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  const Select = ({ label, field, options, required = false, parent }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        value={parent ? (formData[parent] as any)?.[field] || '' : (formData as any)[field] || ''}
        onChange={(e) => parent ? handleNestedChange(parent, field, e.target.value) : handleChange(field, e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-primary"
      >
        <option value="">Select...</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const Checkbox = ({ label, field, parent }: any) => (
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input 
            type="checkbox"
            checked={parent ? !!(formData[parent] as any)?.[field] : !!(formData as any)[field]}
            onChange={(e) => parent ? handleNestedChange(parent, field, e.target.checked) : handleChange(field, e.target.checked)}
            className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-primary focus:ring-offset-gray-900"
          />
          <span className="text-sm font-bold text-gray-300">{label}</span>
      </label>
  );

  const MultiSelect = ({ label, field, options, parent }: any) => {
      const selected = (parent ? (formData[parent] as any)?.[field] : (formData as any)[field]) || [];
      const toggleOption = (opt: string) => {
          const newSelected = selected.includes(opt) 
            ? selected.filter((s: string) => s !== opt) 
            : [...selected, opt];
          parent ? handleNestedChange(parent, field, newSelected) : handleChange(field, newSelected);
      };

      return (
          <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{label}</label>
              <div className="flex flex-wrap gap-2">
                  {options.map((opt: string) => (
                      <button 
                        key={opt}
                        onClick={() => toggleOption(opt)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${selected.includes(opt) ? 'bg-primary border-primary text-black' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}
                      >
                          {opt}
                      </button>
                  ))}
              </div>
          </div>
      );
  };

  const SectionHeader = ({ title, sectionKey }: { title: string, sectionKey: keyof typeof sections }) => (
      <button 
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between bg-gray-800 p-3 rounded-lg mb-4 hover:bg-gray-700 transition-colors"
      >
          <span className="font-bold text-white uppercase text-sm flex items-center gap-2">
            {sections[sectionKey] ? <Icons.ChevronDown size={16}/> : <Icons.ChevronRight size={16}/>} {title}
          </span>
          <div className="h-px bg-gray-700 flex-1 ml-4"></div>
      </button>
  );

  // Auto-generate summaries if empty
  useEffect(() => {
     if (!formData.camera_summary && formData.main_camera?.mp) {
         handleChange('camera_summary', `${formData.main_camera.mp}MP Rear Camera`);
     }
  }, [formData.main_camera]);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-gray-100">
        
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-800 bg-[#1e293b] flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center gap-4">
                 <button onClick={onCancel} className="text-gray-400 hover:text-white"><Icons.ArrowRight className="rotate-180" size={20}/></button>
                 <h2 className="font-bold text-white">{formData.id ? 'Edit Mobile' : 'Add New Mobile'}</h2>
                 <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${formData.status === 'Available' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {formData.status}
                 </span>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="flex bg-gray-800 rounded-lg p-1 mr-4">
                     <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded ${previewMode === 'mobile' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}><Icons.Smartphone size={16}/></button>
                     <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded ${previewMode === 'desktop' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}><Icons.Laptop size={16}/></button>
                 </div>
                 <button onClick={() => handleSubmit('Draft')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-bold">Save Draft</button>
                 <button onClick={() => handleSubmit('Available')} className="px-4 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg text-xs font-bold">Publish</button>
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
                    <div className="max-w-3xl">
                        
                        {/* 1. General */}
                        <SectionHeader title="1. General" sectionKey="general" />
                        {sections.general && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <Input label="Brand" field="brand" placeholder="Samsung" required />
                                <Input label="Model" field="model" placeholder="Galaxy S25" required />
                                <Select label="Device Type" field="device_type" options={['Smartphone', 'Feature Phone', 'Tablet', 'Foldable', 'Wearable']} required />
                                <Select label="Status" field="status" options={['Available', 'Coming Soon', 'Discontinued', 'Out of Stock']} required />
                                <Input label="Price (BDT)" field="price_bd" type="number" placeholder="10499" />
                                <Input label="Price Note" field="price_note" placeholder="(Official)" />
                                <Input label="Release Date" field="release_date" type="date" />
                                <div className="col-span-2">
                                    <Input label="Short Description" field="short_description" placeholder="Brief summary for listings..." />
                                </div>
                            </div>
                        )}

                        {/* 2. Display */}
                        <SectionHeader title="2. Display" sectionKey="display" />
                        {sections.display && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <Select label="Display Type" field="display_type" options={['IPS LCD', 'AMOLED', 'Super AMOLED', 'OLED', 'TFT', 'LCD', 'POLED']} />
                                <Input label="Screen Size (in)" field="screen_size_in" type="number" suffix='"' />
                                <Input label="Resolution" field="resolution" placeholder="1080x2400" help="Format: WidthxHeight" />
                                <Input label="Aspect Ratio" field="aspect_ratio" placeholder="20:9" />
                                <Input label="Pixel Density" field="pixel_density_ppi" type="number" suffix="PPI" />
                                <Input label="Screen to Body %" field="screen_to_body_percent" type="number" suffix="%" />
                                <Input label="Refresh Rate" field="refresh_rate_hz" type="number" suffix="Hz" />
                                <Input label="Brightness" field="brightness_nits" type="number" suffix="nits" />
                                <Select label="Touch Type" field="touch_type" options={['Capacitive Touchscreen', 'Resistive']} />
                                <Select label="Notch Type" field="notch_type" options={['None', 'Punch-hole', 'Waterdrop', 'Notch', 'Under-display']} />
                                <div className="col-span-2 flex gap-6 mt-2">
                                    <Checkbox label="Bezel-less Display" field="bezel_less" />
                                </div>
                                <div className="col-span-2">
                                    <Input label="Protection Notes" field="screen_protection" placeholder="Corning Gorilla Glass..." />
                                </div>
                            </div>
                        )}

                        {/* 3. Hardware */}
                        <SectionHeader title="3. Hardware & Software" sectionKey="hardware" />
                        {sections.hardware && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <Input label="OS Name" field="os_name" placeholder="Android" />
                                <Input label="OS Version" field="os_version" placeholder="15" />
                                <Input label="Chipset" field="chipset" placeholder="Snapdragon 8 Gen 3" />
                                <Input label="CPU Details" field="cpu_description" placeholder="Octa-core..." />
                                <Input label="Cores" field="cpu_cores" type="number" />
                                <Input label="Process (nm)" field="fabrication_nm" type="number" suffix="nm" />
                                <Input label="GPU" field="gpu" placeholder="Adreno 750" />
                                <div className="col-span-2 border-t border-gray-800 my-4"></div>
                                <Input label="RAM (GB)" field="ram_gb" type="number" suffix="GB" />
                                <Input label="Storage (GB)" field="internal_storage_gb" type="number" suffix="GB" />
                                <Select label="Storage Type" field="storage_type" options={['eMMC', 'UFS 2.1', 'UFS 3.1', 'UFS 4.0', 'NVMe']} />
                                <Input label="Expandable" field="expandable_storage" placeholder="No or microSDXC" />
                                <div className="col-span-2">
                                     <Checkbox label="USB OTG Support" field="usb_otg" />
                                </div>
                            </div>
                        )}

                        {/* 4. Cameras */}
                        <SectionHeader title="4. Cameras" sectionKey="camera" />
                        {sections.camera && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                 <div className="col-span-2 mb-2 font-bold text-gray-400 text-xs uppercase border-b border-gray-800 pb-1">Main Camera</div>
                                 <Select parent="main_camera" label="Setup" field="setup" options={['Single', 'Dual', 'Triple', 'Quad']} />
                                 <Input parent="main_camera" label="Megapixels" field="mp" type="number" suffix="MP" />
                                 <Input parent="main_camera" label="Resolution" field="image_resolution" placeholder="4000x3000" />
                                 <Input parent="main_camera" label="Video" field="video_resolution" placeholder="4K@30fps" />
                                 <Input parent="main_camera" label="Zoom" field="zoom" placeholder="10x Digital" />
                                 <Input parent="main_camera" label="Flash" field="flash" placeholder="LED Flash" />
                                 <div className="col-span-2"><Checkbox parent="main_camera" label="Autofocus" field="autofocus" /></div>

                                 <div className="col-span-2 mb-2 mt-4 font-bold text-gray-400 text-xs uppercase border-b border-gray-800 pb-1">Selfie Camera</div>
                                 <Select parent="selfie_camera" label="Setup" field="setup" options={['Single', 'Dual']} />
                                 <Input parent="selfie_camera" label="Megapixels" field="mp" type="number" suffix="MP" />
                                 <Input parent="selfie_camera" label="Video" field="video_resolution" placeholder="1080p@30fps" />
                             </div>
                        )}

                        {/* 5. Design */}
                        <SectionHeader title="5. Design & Build" sectionKey="design" />
                        {sections.design && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <div className="col-span-3"><Input label="Dimensions" field="dimensions_mm" placeholder="165 x 75 x 8.8 mm" /></div>
                                <Input label="Height (mm)" field="height_mm" type="number" />
                                <Input label="Width (mm)" field="width_mm" type="number" />
                                <Input label="Thickness (mm)" field="thickness_mm" type="number" />
                                <Input label="Weight (g)" field="weight_g" type="number" />
                                <div className="col-span-2"><Input label="Build Material" field="build_material" placeholder="Glass front, plastic frame..." /></div>
                                <Input label="IP Rating" field="ip_rating" placeholder="IP68" />
                                <div className="col-span-3"><Checkbox label="Waterproof" field="waterproof" /></div>
                            </div>
                        )}

                         {/* 6. Battery */}
                         <SectionHeader title="6. Battery" sectionKey="battery" />
                        {sections.battery && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <Select label="Type" field="battery_type" options={['Li-Po', 'Li-Ion']} />
                                <Input label="Capacity (mAh)" field="battery_capacity_mah" type="number" suffix="mAh" />
                                <Input label="Charging (W)" field="quick_charging_w" type="number" suffix="W" />
                                <Select label="USB Type" field="usb_type" options={['Type-C 2.0', 'Type-C 3.0', 'MicroUSB', 'Lightning']} />
                                <div className="col-span-2"><Checkbox label="Removable" field="battery_removable" /></div>
                            </div>
                        )}

                        {/* 7. Network */}
                        <SectionHeader title="7. Network" sectionKey="network" />
                        {sections.network && (
                            <div className="mb-8 animate-fade-in">
                                {formData.sims?.map((sim, index) => (
                                    <div key={index} className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                                        <h4 className="text-xs font-bold text-primary uppercase mb-3">SIM {index + 1}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                                            <div className="mb-4">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Technology</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {NETWORK_TECH_OPTIONS.map(tech => (
                                                        <button 
                                                            key={tech} 
                                                            onClick={() => {
                                                                const currentTech = sim.technology || [];
                                                                const newTech = currentTech.includes(tech) 
                                                                    ? currentTech.filter(t => t !== tech) 
                                                                    : [...currentTech, tech];
                                                                handleSimChange(index, 'technology', newTech);
                                                            }}
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${sim.technology?.includes(tech) ? 'bg-primary border-primary text-black' : 'bg-gray-800 border-gray-700 text-gray-300'}`}
                                                        >
                                                            {tech}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">SIM Size</label>
                                                <select 
                                                    value={sim.sim_size || ''} 
                                                    onChange={(e) => handleSimChange(index, 'sim_size', e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none"
                                                >
                                                    <option value="">Select...</option>
                                                    {['Nano', 'Micro', 'Standard'].map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Slot Type</label>
                                                <select 
                                                    value={sim.slot_type || ''} 
                                                    onChange={(e) => handleSimChange(index, 'slot_type', e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none"
                                                >
                                                    <option value="">Select...</option>
                                                    {['Single SIM', 'Dual SIM', 'Hybrid', 'eSIM'].map(o => <option key={o} value={o}>{o}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">4G Bands</label>
                                                <input 
                                                    type="text" 
                                                    value={sim.bands_4g || ''}
                                                    onChange={(e) => handleSimChange(index, 'bands_4g', e.target.value)}
                                                    placeholder="1, 3, 5, 8, 40, 41"
                                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none"
                                                />
                                            </div>
                                            <div className="col-span-2 flex gap-4 mt-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={!!sim.volte} onChange={(e) => handleSimChange(index, 'volte', e.target.checked)} className="rounded bg-gray-900 border-gray-700 text-primary"/>
                                                    <span className="text-xs font-bold text-gray-300">VoLTE</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="checkbox" checked={!!sim.gprs} onChange={(e) => handleSimChange(index, 'gprs', e.target.checked)} className="rounded bg-gray-900 border-gray-700 text-primary"/>
                                                    <span className="text-xs font-bold text-gray-300">GPRS</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4"><Input label="Network Speed Notes" field="network_notes" placeholder="HSPA 42.2/5.76 Mbps, LTE-A..." /></div>
                            </div>
                        )}

                        {/* 8. Connectivity */}
                        <SectionHeader title="8. Connectivity" sectionKey="connectivity" />
                        {sections.connectivity && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <div className="col-span-2"><Input label="WLAN" field="wlan" placeholder="Wi-Fi 802.11 a/b/g/n/ac/6..." /></div>
                                <Input label="Bluetooth" field="bluetooth_version" placeholder="5.3, A2DP, LE" />
                                <Input label="GPS" field="gps" placeholder="Yes, with A-GPS, GLONASS..." />
                                <div className="col-span-2">
                                    <MultiSelect label="USB Modes" field="usb_modes" options={USB_MODE_OPTIONS} />
                                </div>
                                <div className="col-span-2 flex gap-6">
                                    <Checkbox label="NFC" field="nfc" />
                                    <Checkbox label="Infrared" field="infrared" />
                                    <Checkbox label="Wi-Fi Hotspot" field="wifi_hotspot" />
                                </div>
                            </div>
                        )}

                        {/* 9. Multimedia */}
                        <SectionHeader title="9. Multimedia" sectionKey="multimedia" />
                        {sections.multimedia && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <Input label="Video Playback" field="video_playback" placeholder="MP4, MKV, etc." />
                                <Input label="Audio Jack" field="audio_jack_mm" type="number" suffix="mm" placeholder="3.5" />
                                <div className="col-span-2 flex gap-6 mt-2">
                                    <Checkbox label="Loudspeaker" field="loudspeaker" />
                                    <Checkbox label="FM Radio" field="fm_radio" />
                                    <Checkbox label="Document Reader" field="document_reader" />
                                </div>
                            </div>
                        )}

                        {/* 10. Sensors & Security */}
                        <SectionHeader title="10. Sensors & Security" sectionKey="sensors" />
                        {sections.sensors && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                <div className="col-span-2">
                                    <MultiSelect label="Sensors" field="sensors" options={SENSOR_OPTIONS} />
                                </div>
                                <Select label="Fingerprint Position" field="fingerprint_position" options={['On-Screen', 'Side-mounted', 'Rear-mounted']} />
                                <div className="col-span-2 flex gap-6 mt-2">
                                    <Checkbox label="Fingerprint Sensor" field="fingerprint" />
                                    <Checkbox label="Face Unlock" field="face_unlock" />
                                </div>
                            </div>
                        )}

                        {/* 11. Manufacturer */}
                         <SectionHeader title="11. Manufacturer" sectionKey="manufacturer" />
                         {sections.manufacturer && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-8 animate-fade-in">
                                 <Input label="Made In" field="made_in" placeholder="Vietnam" />
                                 <Input label="Warranty (Months)" field="warranty_months" type="number" />
                             </div>
                         )}

                    </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                    <div className="max-w-3xl">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center mb-6">
                            <Icons.Image size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="font-bold text-white mb-2">Upload Product Images</h3>
                            <p className="text-sm text-gray-400 mb-4">Drag and drop or click to upload (Max 8 images)</p>
                            <button className="bg-primary text-black font-bold px-4 py-2 rounded text-sm hover:bg-primary-dark">Select Files</button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {/* Mock Images */}
                            {[1,2,3].map(i => (
                                <div key={i} className="aspect-square bg-gray-800 rounded-lg border border-gray-700 relative group">
                                    <div className="absolute top-2 right-2 p-1 bg-red-500 rounded text-white opacity-0 group-hover:opacity-100 cursor-pointer"><Icons.Trash2 size={14} /></div>
                                    <div className="flex items-center justify-center h-full text-gray-600 text-xs">Image {i}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                 {/* SEO Tab */}
                 {activeTab === 'seo' && (
                    <div className="max-w-3xl space-y-4">
                        <Input label="URL Slug" field="slug" placeholder="samsung-galaxy-s25" help="Auto-generated from Brand + Model" />
                        <Input label="Meta Title" field="meta_title" placeholder="Samsung Galaxy S25 Price in Bangladesh..." />
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
            <div className={`w-[375px] bg-white border-l border-gray-800 flex flex-col shrink-0 transition-all ${previewMode === 'mobile' ? 'w-[375px]' : 'w-[600px]'}`}>
                <div className="p-3 bg-gray-100 border-b border-gray-300 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">Live Preview</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
                <div className="flex-1 overflow-y-auto bg-white p-4">
                    {/* Simplified Preview Render */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-40 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300">
                             <Icons.Smartphone size={48} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 text-center leading-tight">{formData.brand} {formData.model}</h2>
                        <div className="text-primary font-bold text-lg mt-1">BDT {formData.price_bd}</div>
                        {formData.price_note && <div className="text-xs text-gray-500">{formData.price_note}</div>}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                        <h4 className="font-bold text-gray-800 text-sm mb-3 border-b pb-2">Key Specs</h4>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                             <div className="text-gray-500">Display</div>
                             <div className="font-bold text-gray-800 text-right">{formData.screen_size_in}" {formData.display_type}</div>
                             
                             <div className="text-gray-500">Camera</div>
                             <div className="font-bold text-gray-800 text-right">{formData.main_camera?.mp}MP Main</div>
                             
                             <div className="text-gray-500">Processor</div>
                             <div className="font-bold text-gray-800 text-right truncate">{formData.chipset || '-'}</div>
                             
                             <div className="text-gray-500">Battery</div>
                             <div className="font-bold text-gray-800 text-right">{formData.battery_capacity_mah} mAh</div>
                        </div>
                    </div>

                    <div className="text-xs text-gray-400 text-center mt-8">
                        Preview updates in real-time as you type.
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default MobileProductForm;
