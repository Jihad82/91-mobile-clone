import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, NewsItem } from '../types';

interface SearchCriteria {
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

interface DataContextType {
  upcomingPhones: Product[];
  popularPhones: Product[];
  latestNews: NewsItem[];
  hindiNews: NewsItem[];
  stories: NewsItem[];
  compareList: Product[];
  
  addUpcomingPhone: (item: Product) => void;
  deleteUpcomingPhone: (id: string) => void;
  
  addPopularPhone: (item: Product) => void;
  deletePopularPhone: (id: string) => void;
  
  addLatestNews: (item: NewsItem) => void;
  deleteLatestNews: (id: string) => void;

  addHindiNews: (item: NewsItem) => void;
  deleteHindiNews: (id: string) => void;

  searchProducts: (criteria: SearchCriteria) => Product[];
  
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Mock Data (Moved from App.tsx)
const initialUpcoming: Product[] = [
  { id: '1', name: 'Xiaomi Redmi K90 Pro Max', price: '₹75,999', image: 'https://placehold.co/200x250/png?text=Redmi+K90' },
  { id: '2', name: 'Xiaomi 17 Pro Max', price: '₹109,999', image: 'https://placehold.co/200x250/png?text=Xiaomi+17' },
  { id: '3', name: 'Vivo X300', price: '₹75,999', image: 'https://placehold.co/200x250/png?text=Vivo+X300', specScore: 98 },
  { id: '4', name: 'Vivo X300 Pro', price: '₹109,999', image: 'https://placehold.co/200x250/png?text=Vivo+Pro', specScore: 97 },
  { id: '5', name: 'Motorola Edge 70', price: '₹45,999', image: 'https://placehold.co/200x250/png?text=Moto+Edge', specScore: 88 },
  { id: '6', name: 'Realme GT 9', price: '₹42,999', image: 'https://placehold.co/200x250/png?text=Realme', specScore: 92 },
];

const initialPopular: Product[] = [
  { id: 'p1', name: 'OnePlus 15', price: '₹72,999', image: 'https://placehold.co/200x250/png?text=OnePlus', specScore: 98 },
  { id: 'p2', name: 'iQOO 15', price: '₹72,999', image: 'https://placehold.co/200x250/png?text=iQOO', specScore: 96 },
  { id: 'p3', name: 'Realme GT 8 Pro', price: '₹72,999', image: 'https://placehold.co/200x250/png?text=GT+8', specScore: 99 },
  { id: 'p4', name: 'Lava Agni 4', price: '₹24,998', image: 'https://placehold.co/200x250/png?text=Lava', specScore: 90 },
  { id: 'p5', name: 'Vivo V60e', price: '₹28,380', image: 'https://placehold.co/200x250/png?text=Vivo+V60', specScore: 87 },
  { id: 'p6', name: 'Samsung Galaxy S25', price: '₹124,999', image: 'https://placehold.co/200x250/png?text=S25', specScore: 95 },
  { id: 'p7', name: 'iPhone 16', price: '₹79,900', image: 'https://placehold.co/200x250/png?text=iPhone+16', specScore: 94 },
  { id: 'p8', name: 'POCO F7', price: '₹29,999', image: 'https://placehold.co/200x250/png?text=POCO+F7', specScore: 89 },
];

const initialNews: NewsItem[] = [
  { id: 'n1', title: "Motorola Edge 70 confirmed to launch in India as the brand's first ultra-slim phone", timeAgo: '29 Mins Ago', image: 'https://placehold.co/800x400/png?text=Moto+Launch+Event' },
  { id: 'n2', title: "OnePlus 15R confirmed to feature a 7,400mAh battery with 80W fast charging support", timeAgo: '3 Hours Ago', image: 'https://placehold.co/200x150/png?text=Battery' },
  { id: 'n3', title: "Nothing Phone (3a) Lite goes on sale in India today: price, features, specifications", timeAgo: '5 Hours Ago', image: 'https://placehold.co/200x150/png?text=Nothing' },
  { id: 'n4', title: "Samsung Galaxy Tab A11 launches in India with an 8.7-inch display", timeAgo: '1 Day Ago', image: 'https://placehold.co/200x150/png?text=Samsung+Tab' },
];

const initialHindi: NewsItem[] = [
  { id: 'h1', title: "OnePlus 15R इंडिया में 7400mAh बैटरी के साथ होगा लॉन्च, बनेगा भारत का पहला Snapdragon 8 Gen 5 वाला फोन", timeAgo: '1 Hour Ago', image: 'https://placehold.co/800x400/png?text=Hindi+News' },
  { id: 'h2', title: "Motorola Edge 70 इंडिया लॉन्च कन्फर्म: पतला से भी पतला मोबाइल आ रहा है भारत!", timeAgo: '2 Hours Ago', image: 'https://placehold.co/200x150/png?text=Moto' },
  { id: 'h3', title: "15 दिसंबर को पेश होंगे Vivo S50 और S50 Pro Mini, फ्रंट और बैक दोनों जगह मिलेंगे 50MP के कैमरे", timeAgo: '2 Hours Ago', image: 'https://placehold.co/200x150/png?text=Vivo' },
  { id: 'h4', title: "949 रुपये का फोन हुआ लॉन्च, बड़े काम हैं फीचर्स और इस्तेमाल करना भी आसान", timeAgo: '1 Day Ago', image: 'https://placehold.co/200x150/png?text=Feature+Phone' },
];

const initialStories: NewsItem[] = [
  { id: 's1', title: "iQOO 15's India price could be higher than iQOO 13, but buyers shouldn't be...", author: 'Saloni Tandon', timeAgo: '26 Days Ago', image: 'https://placehold.co/100x100/png?text=S1' },
  { id: 's2', title: "Apple pushing iPhone Air 2 launch to 2027 to add a second rear camera: report", author: 'Saloni Tandon', timeAgo: '27 Days Ago', image: 'https://placehold.co/100x100/png?text=S2' },
  { id: 's3', title: "iPhones satellite feature will reportedly allow maps and messages work without...", author: 'Ashish Kumar', timeAgo: '28 Days Ago', image: 'https://placehold.co/100x100/png?text=S3' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [upcomingPhones, setUpcomingPhones] = useState<Product[]>(initialUpcoming);
  const [popularPhones, setPopularPhones] = useState<Product[]>(initialPopular);
  const [latestNews, setLatestNews] = useState<NewsItem[]>(initialNews);
  const [hindiNews, setHindiNews] = useState<NewsItem[]>(initialHindi);
  const [stories] = useState<NewsItem[]>(initialStories);
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addUpcomingPhone = (item: Product) => setUpcomingPhones([...upcomingPhones, item]);
  const deleteUpcomingPhone = (id: string) => setUpcomingPhones(upcomingPhones.filter(p => p.id !== id));

  const addPopularPhone = (item: Product) => setPopularPhones([...popularPhones, item]);
  const deletePopularPhone = (id: string) => setPopularPhones(popularPhones.filter(p => p.id !== id));

  const addLatestNews = (item: NewsItem) => setLatestNews([item, ...latestNews]);
  const deleteLatestNews = (id: string) => setLatestNews(latestNews.filter(n => n.id !== id));

  const addHindiNews = (item: NewsItem) => setHindiNews([item, ...hindiNews]);
  const deleteHindiNews = (id: string) => setHindiNews(hindiNews.filter(n => n.id !== id));

  const parsePrice = (price: string) => {
    const num = parseInt(price.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num;
  };

  const searchProducts = ({ minPrice, maxPrice, keyword }: SearchCriteria) => {
    const allProducts = [...upcomingPhones, ...popularPhones];
    return allProducts.filter(product => {
      const price = parsePrice(product.price);
      const matchesPrice = (minPrice === undefined || price >= minPrice) && 
                           (maxPrice === undefined || price <= maxPrice);
      const matchesKeyword = !keyword || 
                             product.name.toLowerCase().includes(keyword.toLowerCase());
      return matchesPrice && matchesKeyword;
    });
  };

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      alert("You can compare up to 4 items at a time.");
      return;
    }
    if (!compareList.find(p => p.id === product.id)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  const clearCompare = () => setCompareList([]);

  return (
    <DataContext.Provider value={{
      upcomingPhones,
      popularPhones,
      latestNews,
      hindiNews,
      stories,
      compareList,
      addUpcomingPhone,
      deleteUpcomingPhone,
      addPopularPhone,
      deletePopularPhone,
      addLatestNews,
      deleteLatestNews,
      addHindiNews,
      deleteHindiNews,
      searchProducts,
      addToCompare,
      removeFromCompare,
      clearCompare
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};