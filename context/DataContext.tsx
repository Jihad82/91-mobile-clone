
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, NewsItem, Author, Category, Tag, MobileProduct, LaptopProduct, TabletProduct, TVProduct, AnyProduct } from '../types';

interface SearchCriteria {
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

interface DataContextType {
  upcomingPhones: Product[];
  popularPhones: Product[];
  articles: NewsItem[];
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  
  // Admin Data Stores
  mobiles: MobileProduct[];
  laptops: LaptopProduct[];
  tablets: TabletProduct[];
  tvs: TVProduct[];

  // CRUD Actions
  addMobile: (mobile: MobileProduct) => void;
  updateMobile: (mobile: MobileProduct) => void;
  deleteMobile: (id: string) => void;

  addLaptop: (laptop: LaptopProduct) => void;
  updateLaptop: (laptop: LaptopProduct) => void;
  deleteLaptop: (id: string) => void;

  addTablet: (tablet: TabletProduct) => void;
  updateTablet: (tablet: TabletProduct) => void;
  deleteTablet: (id: string) => void;

  addTV: (tv: TVProduct) => void;
  updateTV: (tv: TVProduct) => void;
  deleteTV: (id: string) => void;

  // Consolidated Getters
  latestNews: NewsItem[];
  hindiNews: NewsItem[];
  stories: NewsItem[];
  
  // Article CRUD
  addArticle: (article: NewsItem) => void;
  updateArticle: (article: NewsItem) => void;
  deleteArticle: (id: string) => void;
  
  searchProducts: (criteria: SearchCriteria) => Product[];
  
  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ... (Existing Authors, Categories, Tags, Articles Mock Data - Keep same as before)
const initialAuthors: Author[] = [
  { id: '1', name: 'Kshitij Pujari', role: 'Senior Editor', avatar: 'https://placehold.co/100x100/333/FFF?text=KP', bio: 'Tech enthusiast with 10 years of experience.' },
  { id: '2', name: 'Saloni Tandon', role: 'Associate Editor', avatar: 'https://placehold.co/100x100/444/FFF?text=ST' },
  { id: '3', name: 'Ashish Kumar', role: 'Contributor', avatar: 'https://placehold.co/100x100/555/FFF?text=AK' },
];

const initialCategories: Category[] = [
  { id: '1', name: 'News', slug: 'news', count: 120 },
  { id: '2', name: 'Reviews', slug: 'reviews', count: 85 },
  { id: '3', name: 'Comparison', slug: 'comparison', count: 40 },
  { id: '4', name: 'Hindi', slug: 'hindi', count: 200 },
];

const initialTags: Tag[] = [
  { id: '1', name: '5G', slug: '5g' },
  { id: '2', name: 'Samsung', slug: 'samsung' },
  { id: '3', name: 'Apple', slug: 'apple' },
];

const initialArticles: NewsItem[] = [
  { 
    id: 'hero1', 
    title: 'Samsung Galaxy S25 Ultra Review', 
    slug: 'samsung-galaxy-s25-ultra-review',
    subtitle: 'A stunning display, refined design.',
    image: 'https://placehold.co/1200x600/101010/FFF?text=Galaxy+S25+Ultra+Review',
    authorId: '1',
    publishedAt: new Date().toISOString(),
    timeAgo: '4 Hours Ago',
    rating: 4.5,
    tags: ['Review', 'Flagship'],
    category: 'Reviews',
    isMain: true,
    isReview: true,
    status: 'published',
    content: '<p>Review content...</p>'
  }
];

// Initial Data for New Categories
const initialMobiles: MobileProduct[] = [
  { 
      id: 'm1', 
      category: 'mobile',
      brand: 'Samsung', 
      model: 'Galaxy S25', 
      device_type: 'Smartphone', 
      price_bd: 120000, 
      status: 'Available', 
      images: [],
      screen_size_in: 6.2,
      display_type: 'AMOLED',
      chipset: 'Snapdragon 8 Gen 4',
      main_camera: { mp: 50 },
      battery_capacity_mah: 4000
  }
];

const initialLaptops: LaptopProduct[] = [
    {
        id: 'l1',
        category: 'laptop',
        brand: 'Apple',
        model: 'MacBook Air M3',
        price_bd: 145000,
        status: 'Available',
        images: [],
        processor_brand: 'Apple',
        processor_name: 'M3',
        cores: 8,
        ram_gb: 16,
        ram_type: 'Unified',
        storage_capacity_gb: 512,
        storage_type: 'SSD',
        screen_size_in: 13.6,
        resolution: '2560 x 1664',
        touchscreen: false,
        graphics_type: 'Integrated',
        graphics_model: '10-core GPU',
        os: 'macOS',
        weight_kg: 1.24,
        battery_whr: 52.6,
        warranty_years: 1
    }
];

const initialTablets: TabletProduct[] = [
    {
        id: 't1',
        category: 'tablet',
        brand: 'Samsung',
        model: 'Galaxy Tab S9',
        price_bd: 85000,
        status: 'Available',
        images: [],
        screen_size_in: 11,
        display_type: 'Dynamic AMOLED 2X',
        resolution: '1600 x 2560',
        processor: 'Snapdragon 8 Gen 2',
        ram_gb: 8,
        storage_gb: 128,
        expandable_storage: true,
        voice_calling: false,
        network_support: 'Wi-Fi Only',
        main_camera_mp: 13,
        front_camera_mp: 12,
        battery_mah: 8400,
        stylus_support: true,
        keyboard_support: true,
        os: 'Android 13'
    }
];

const initialTVs: TVProduct[] = [
    {
        id: 'tv1',
        category: 'tv',
        brand: 'Sony',
        model: 'Bravia XR A80L',
        price_bd: 210000,
        status: 'Available',
        images: [],
        screen_size_in: 55,
        resolution_type: '4K',
        panel_type: 'OLED',
        refresh_rate_hz: 120,
        hdr_support: ['HDR10', 'Dolby Vision'],
        sound_output_w: 50,
        speaker_config: '3.2 Channel',
        dolby_audio: true,
        is_smart_tv: true,
        os: 'Google TV',
        supported_apps: ['Netflix', 'YouTube', 'Prime Video'],
        hdmi_ports: 4,
        usb_ports: 2,
        wifi: true,
        bluetooth: true
    }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsItem[]>(initialArticles);
  const [mobiles, setMobiles] = useState<MobileProduct[]>(initialMobiles);
  const [laptops, setLaptops] = useState<LaptopProduct[]>(initialLaptops);
  const [tablets, setTablets] = useState<TabletProduct[]>(initialTablets);
  const [tvs, setTvs] = useState<TVProduct[]>(initialTVs);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Use initial data for now
  const authors = initialAuthors;

  // Computed
  const upcomingPhones = mobiles.map(m => ({ id: m.id, name: `${m.brand} ${m.model}`, price: `BDT ${m.price_bd}`, image: 'https://placehold.co/200x250', category: 'mobile' }));
  const popularPhones = upcomingPhones; // mock same
  const latestNews = articles.filter(a => a.status === 'published').slice(0, 10);
  const hindiNews = [];
  const stories = [];

  // Generic CRUD Helpers
  const add = <T extends { id: string }>(item: T, list: T[], setList: any) => setList([...list, item]);
  const update = <T extends { id: string }>(item: T, list: T[], setList: any) => setList(list.map(i => i.id === item.id ? item : i));
  const remove = <T extends { id: string }>(id: string, list: T[], setList: any) => setList(list.filter(i => i.id !== id));

  // Exposed Actions
  const addMobile = (m: MobileProduct) => add(m, mobiles, setMobiles);
  const updateMobile = (m: MobileProduct) => update(m, mobiles, setMobiles);
  const deleteMobile = (id: string) => remove(id, mobiles, setMobiles);

  const addLaptop = (l: LaptopProduct) => add(l, laptops, setLaptops);
  const updateLaptop = (l: LaptopProduct) => update(l, laptops, setLaptops);
  const deleteLaptop = (id: string) => remove(id, laptops, setLaptops);

  const addTablet = (t: TabletProduct) => add(t, tablets, setTablets);
  const updateTablet = (t: TabletProduct) => update(t, tablets, setTablets);
  const deleteTablet = (id: string) => remove(id, tablets, setTablets);

  const addTV = (t: TVProduct) => add(t, tvs, setTvs);
  const updateTV = (t: TVProduct) => update(t, tvs, setTvs);
  const deleteTV = (id: string) => remove(id, tvs, setTvs);

  const addArticle = (a: NewsItem) => add(a, articles, setArticles);
  const updateArticle = (a: NewsItem) => update(a, articles, setArticles);
  const deleteArticle = (id: string) => remove(id, articles, setArticles);

  const searchProducts = ({ keyword }: SearchCriteria) => {
    // Simple mock search across all categories
    const all = [
        ...mobiles.map(m => ({ id: m.id, name: `${m.brand} ${m.model}`, price: `BDT ${m.price_bd}`, image: '', category: 'mobile' })),
        ...laptops.map(l => ({ id: l.id, name: `${l.brand} ${l.model}`, price: `BDT ${l.price_bd}`, image: '', category: 'laptop' })),
        ...tablets.map(t => ({ id: t.id, name: `${t.brand} ${t.model}`, price: `BDT ${t.price_bd}`, image: '', category: 'tablet' })),
        ...tvs.map(t => ({ id: t.id, name: `${t.brand} ${t.model}`, price: `BDT ${t.price_bd}`, image: '', category: 'tv' }))
    ];
    if (!keyword) return [];
    return all.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
  };

  const addToCompare = (product: Product) => {
      if (compareList.length < 4 && !compareList.find(p => p.id === product.id)) {
          setCompareList([...compareList, product]);
      }
  };
  const removeFromCompare = (id: string) => setCompareList(compareList.filter(p => p.id !== id));
  const clearCompare = () => setCompareList([]);

  return (
    <DataContext.Provider value={{
      upcomingPhones, popularPhones, articles, authors, categories: initialCategories, tags: initialTags,
      mobiles, laptops, tablets, tvs,
      addMobile, updateMobile, deleteMobile,
      addLaptop, updateLaptop, deleteLaptop,
      addTablet, updateTablet, deleteTablet,
      addTV, updateTV, deleteTV,
      latestNews, hindiNews, stories,
      addArticle, updateArticle, deleteArticle,
      addUpcomingPhone: () => {}, deleteUpcomingPhone: () => {}, addPopularPhone: () => {}, deletePopularPhone: () => {},
      searchProducts, compareList, addToCompare, removeFromCompare, clearCompare
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
