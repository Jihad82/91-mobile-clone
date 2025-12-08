
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, NewsItem, Author, Category, Tag } from '../types';

interface SearchCriteria {
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

interface DataContextType {
  upcomingPhones: Product[];
  popularPhones: Product[];
  articles: NewsItem[]; // Consolidated Articles List
  authors: Author[];
  categories: Category[];
  tags: Tag[];

  // Getters for specific homepage sections (computed or filtered)
  latestNews: NewsItem[];
  hindiNews: NewsItem[];
  stories: NewsItem[];
  
  // CRUD
  addArticle: (article: NewsItem) => void;
  updateArticle: (article: NewsItem) => void;
  deleteArticle: (id: string) => void;
  
  // Product CRUD
  addUpcomingPhone: (item: Product) => void;
  deleteUpcomingPhone: (id: string) => void;
  addPopularPhone: (item: Product) => void;
  deletePopularPhone: (id: string) => void;
  updateProduct: (item: Product) => void; // Unified update

  searchProducts: (criteria: SearchCriteria) => Product[];
  
  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
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
  { id: '5', name: 'Buying Guide', slug: 'buying-guide', count: 30 },
];

const initialTags: Tag[] = [
  { id: '1', name: '5G', slug: '5g' },
  { id: '2', name: 'Samsung', slug: 'samsung' },
  { id: '3', name: 'Apple', slug: 'apple' },
  { id: '4', name: 'Launch', slug: 'launch' },
];

// Mock Articles with full content
const initialArticles: NewsItem[] = [
  { 
    id: 'hero1', 
    title: 'Samsung Galaxy S25 Ultra Review: The Android King Returns with AI Superpowers', 
    slug: 'samsung-galaxy-s25-ultra-review',
    subtitle: 'A stunning display, refined design, and Galaxy AI make this the phone to beat in 2025.',
    image: 'https://placehold.co/1200x600/101010/FFF?text=Galaxy+S25+Ultra+Review',
    heroImage: 'https://placehold.co/1200x600/101010/FFF?text=Galaxy+S25+Ultra+Review',
    authorId: '1',
    author: 'Kshitij Pujari',
    publishedAt: new Date().toISOString(),
    timeAgo: '4 Hours Ago',
    rating: 4.5,
    tags: ['Review', 'Flagship', 'Samsung'],
    category: 'Reviews',
    isMain: true,
    isReview: true,
    status: 'published',
    content: `<p>The Samsung Galaxy S25 Ultra has arrived, and it's making a bold statement. With a refined titanium frame, the new Snapdragon 8 Gen 4 processor, and a suite of AI features that actually feel useful, Samsung is looking to reclaim its throne.</p><h2>Design & Display</h2><p>The flatter edges make it easier to hold, and the new anti-reflective coating on the 6.8-inch AMOLED panel is a game changer for outdoor visibility.</p><blockquote>"This is the best display we've ever tested on a smartphone."</blockquote><h2>Performance</h2><p>Benchmarks shatter records, but real-world usage is where it shines. Multitasking is seamless.</p>`,
    pros: ['Stunning Display', 'S-Pen Integration', 'Top-tier Performance'],
    cons: ['Expensive', 'Slow Charging']
  },
  { 
    id: 'n1', 
    title: "Motorola Edge 70 confirmed to launch in India as the brand's first ultra-slim phone", 
    slug: 'motorola-edge-70-launch',
    timeAgo: '29 Mins Ago', 
    publishedAt: new Date().toISOString(),
    image: 'https://placehold.co/800x400/png?text=Moto+Launch+Event', 
    author: 'Saloni Tandon',
    authorId: '2',
    category: 'News',
    status: 'published',
    content: '<p>Motorola has officially teased the Edge 70. It promises to be the slimmest phone of 2025.</p>'
  },
  {
    id: 'h1',
    title: "OnePlus 15R इंडिया में 7400mAh बैटरी के साथ होगा लॉन्च, बनेगा भारत का पहला Snapdragon 8 Gen 5 वाला फोन",
    slug: 'oneplus-15r-hindi',
    timeAgo: '1 Hour Ago',
    publishedAt: new Date().toISOString(),
    image: 'https://placehold.co/800x400/png?text=Hindi+News',
    author: 'Ashish Kumar',
    authorId: '3',
    category: 'Hindi',
    status: 'published',
    content: '<p>OnePlus भारत में अपना नया धमाकेदार फोन ला रहा है।</p>'
  }
];

// Product Data
const initialUpcoming: Product[] = [
  { id: '1', name: 'Xiaomi Redmi K90 Pro Max', price: '₹75,999', image: 'https://placehold.co/200x250/png?text=Redmi+K90', brand: 'Xiaomi' },
  { id: '2', name: 'Xiaomi 17 Pro Max', price: '₹109,999', image: 'https://placehold.co/200x250/png?text=Xiaomi+17', brand: 'Xiaomi' },
];

const initialPopular: Product[] = [
  { 
    id: 'p1', 
    name: 'OnePlus 15', 
    price: '₹72,999', 
    image: 'https://placehold.co/200x250/png?text=OnePlus', 
    specScore: 98,
    brand: 'OnePlus',
    model: 'OnePlus 15 5G',
    releaseDate: '2025, February 10',
    status: 'Available',
    highlights: [
        { label: "Display", value: "6.8\" Fluid AMOLED" },
        { label: "Processor", value: "Snapdragon 8 Gen 4" },
        { label: "Camera", value: "50MP + 50MP + 64MP" },
        { label: "Battery", value: "5400 mAh, 100W" },
    ],
    expertRatings: [
        { label: 'Display', score: 95 },
        { label: 'Performance', score: 98 },
        { label: 'Camera', score: 92 },
        { label: 'Battery', score: 90 },
    ],
    pros: ["Insane charging speed", "Great performance", "Vivid display"],
    cons: ["No wireless charging", "Average ultra-wide camera"]
  },
  { 
    id: 'p2', 
    name: 'iQOO 15', 
    price: '₹72,999', 
    image: 'https://placehold.co/200x250/png?text=iQOO', 
    specScore: 96,
    brand: 'iQOO'
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [upcomingPhones, setUpcomingPhones] = useState<Product[]>(initialUpcoming);
  const [popularPhones, setPopularPhones] = useState<Product[]>(initialPopular);
  const [articles, setArticles] = useState<NewsItem[]>(initialArticles);
  const [authors] = useState<Author[]>(initialAuthors);
  const [categories] = useState<Category[]>(initialCategories);
  const [tags] = useState<Tag[]>(initialTags);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Computed Properties
  const latestNews = articles.filter(a => a.category !== 'Hindi' && a.status === 'published').slice(0, 10);
  const hindiNews = articles.filter(a => a.category === 'Hindi' && a.status === 'published').slice(0, 5);
  const stories = articles.filter(a => a.category === 'Stories' || a.category === 'Opinion').slice(0, 3);

  // Article CRUD
  const addArticle = (article: NewsItem) => {
    setArticles([article, ...articles]);
  };

  const updateArticle = (updatedArticle: NewsItem) => {
    setArticles(articles.map(a => a.id === updatedArticle.id ? updatedArticle : a));
  };

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  // Product CRUD
  const addUpcomingPhone = (item: Product) => setUpcomingPhones([...upcomingPhones, item]);
  const deleteUpcomingPhone = (id: string) => setUpcomingPhones(upcomingPhones.filter(p => p.id !== id));
  const addPopularPhone = (item: Product) => setPopularPhones([...popularPhones, item]);
  const deletePopularPhone = (id: string) => setPopularPhones(popularPhones.filter(p => p.id !== id));
  
  const updateProduct = (updatedProduct: Product) => {
    // Try to find and update in upcoming
    if (upcomingPhones.some(p => p.id === updatedProduct.id)) {
        setUpcomingPhones(upcomingPhones.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        return;
    }
    // Try to find and update in popular
    if (popularPhones.some(p => p.id === updatedProduct.id)) {
        setPopularPhones(popularPhones.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        return;
    }
    // If not found, add to popular by default (or handle error)
    setPopularPhones([...popularPhones, updatedProduct]);
  };

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
      articles,
      authors,
      categories,
      tags,
      latestNews,
      hindiNews,
      stories,
      compareList,
      addArticle,
      updateArticle,
      deleteArticle,
      addUpcomingPhone,
      deleteUpcomingPhone,
      addPopularPhone,
      deletePopularPhone,
      updateProduct,
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
