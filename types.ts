
export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  specScore?: number;
  category?: 'mobile' | 'laptop' | 'tablet' | 'tv';
}

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  email?: string;
  socials?: { twitter?: string; linkedin?: string };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  type?: 'news' | 'product';
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ComparisonData {
  headers: string[];
  rows: { label: string; values: string[] }[];
}

export interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  content?: string; // HTML Body
  image: string; // Hero Image
  heroImage?: string; // Larger version if available
  
  // Metadata
  authorId?: string;
  author?: string; // Legacy fallback
  category?: string; // ID or Name
  tags?: string[];
  
  // Status & Timing
  status?: 'published' | 'draft' | 'scheduled';
  publishedAt?: string; // ISO Date
  timeAgo?: string; // Derived display string
  readTime?: string;
  
  // Flags
  isMain?: boolean;
  isTrending?: boolean;
  isReview?: boolean;
  
  // Review Specifics
  rating?: number;
  pros?: string[];
  cons?: string[];
  comparisonData?: ComparisonData;
  gallery?: string[];
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  author: string;
  image: string;
  rating?: number;
  isVideo?: boolean;
}

export interface UserReview {
    name: string;
    email?: string;
    title: string;
    rating: number;
    text: string;
    date: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string; 
  color?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  bg_color?: string;
  text_color?: string;
  link?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  caption?: string;
  type: 'hero' | 'gallery' | 'detail' | 'box';
  sort_order: number;
}

// --- PRODUCT CATEGORY INTERFACES ---

export interface MobileProduct {
  id: string;
  category: 'mobile';
  brand: string;
  model: string;
  device_type: 'Smartphone' | 'Feature Phone' | 'Foldable' | 'Tablet' | 'Wearable';
  price_bd: number;
  price_note?: string;
  release_date?: string;
  status: string;
  images: ProductImage[];
  
  // Summaries
  camera_summary?: string;
  display_summary?: string;
  processor_summary?: string;
  battery_summary?: string;
  short_description?: string;

  // Specs
  display_type?: string;
  screen_size_in?: number;
  resolution?: string;
  refresh_rate_hz?: number;
  chipset?: string;
  ram_gb?: number;
  internal_storage_gb?: number;
  main_camera?: { 
    mp?: number; 
    setup?: string;
    image_resolution?: string;
    video_resolution?: string;
    zoom?: string;
    flash?: string;
    autofocus?: boolean;
  };
  selfie_camera?: { 
    mp?: number;
    setup?: string;
    video_resolution?: string;
  };
  battery_capacity_mah?: number;
  os_name?: string;
  
  // CMS Extended
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  colors?: string[];
  usb_modes?: string[];

  // Detailed Display
  aspect_ratio?: string;
  pixel_density_ppi?: number;
  screen_to_body_percent?: number;
  brightness_nits?: number;
  touch_type?: string;
  notch_type?: string;
  bezel_less?: boolean;
  screen_protection?: string;

  // Detailed Hardware
  os_version?: string;
  cpu_description?: string;
  cpu_cores?: number;
  fabrication_nm?: number;
  gpu?: string;
  storage_type?: string;
  expandable_storage?: string; 
  usb_otg?: boolean;

  // Design
  dimensions_mm?: string;
  height_mm?: number;
  width_mm?: number;
  thickness_mm?: number;
  weight_g?: number;
  build_material?: string;
  ip_rating?: string;
  waterproof?: boolean;

  // Battery
  battery_type?: string;
  quick_charging_w?: number;
  usb_type?: string;
  battery_removable?: boolean;

  // Connectivity
  wlan?: string;
  bluetooth_version?: string;
  gps?: string;
  nfc?: boolean;
  infrared?: boolean;
  wifi_hotspot?: boolean;

  // Multimedia
  video_playback?: string;
  audio_jack_mm?: number;
  loudspeaker?: boolean;
  fm_radio?: boolean;
  document_reader?: boolean;

  // Sensors
  fingerprint?: boolean;
  fingerprint_position?: string;
  face_unlock?: boolean;

  // Manufacturer
  made_in?: string;
  warranty_months?: number;

  // Misc
  network_notes?: string;
  
  // ... (Sims, Sensors, etc would be here)
  sims?: any[];
  sensors?: string[];
}

export interface TabletProduct {
  id: string;
  category: 'tablet';
  brand: string;
  model: string;
  price_bd: number;
  status: string;
  images: ProductImage[];
  
  // Display
  screen_size_in: number;
  display_type: string;
  resolution: string;
  
  // Hardware
  processor: string;
  ram_gb: number;
  storage_gb: number;
  expandable_storage: boolean;
  
  // Connectivity
  voice_calling: boolean;
  network_support: 'Wi-Fi Only' | 'Wi-Fi + Cellular';
  
  // Camera & Battery
  main_camera_mp: number;
  front_camera_mp: number;
  battery_mah: number;
  
  // Features
  stylus_support: boolean;
  keyboard_support: boolean;
  os: string;

  // SEO & Meta
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface LaptopProduct {
  id: string;
  category: 'laptop';
  brand: string;
  model: string;
  price_bd: number;
  status: string;
  images: ProductImage[];

  // Processor
  processor_brand: 'Intel' | 'AMD' | 'Apple' | 'Qualcomm';
  processor_name: string; // Core i7-13700H
  cores: number;
  
  // Graphics
  graphics_type: 'Integrated' | 'Dedicated';
  graphics_model: string;
  graphics_memory_gb?: number;

  // Memory & Storage
  ram_gb: number;
  ram_type: string; // LPDDR5
  storage_capacity_gb: number;
  storage_type: 'SSD' | 'HDD' | 'eMMC';

  // Display
  screen_size_in: number;
  resolution: string;
  touchscreen: boolean;
  
  // General
  os: string;
  weight_kg: number;
  battery_whr: number;
  warranty_years: number;

  // SEO & Meta
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface TVProduct {
  id: string;
  category: 'tv';
  brand: string;
  model: string;
  price_bd: number;
  status: string;
  images: ProductImage[];

  // Display
  screen_size_in: number;
  resolution_type: 'HD Ready' | 'Full HD' | '4K' | '8K';
  panel_type: 'LED' | 'OLED' | 'QLED' | 'Mini-LED';
  refresh_rate_hz: number;
  hdr_support: string[]; // HDR10, Dolby Vision

  // Audio
  sound_output_w: number;
  speaker_config: string; // 2.1 Channel
  dolby_audio: boolean;

  // Smart Features
  is_smart_tv: boolean;
  os: string; // Android TV, Tizen, WebOS
  supported_apps: string[];

  // Connectivity
  hdmi_ports: number;
  usb_ports: number;
  wifi: boolean;
  bluetooth: boolean;

  // SEO & Meta
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

export type AnyProduct = MobileProduct | TabletProduct | LaptopProduct | TVProduct;
