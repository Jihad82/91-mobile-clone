
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { Product, NewsItem, Author, Category, Tag, MobileProduct, LaptopProduct, TabletProduct, TVProduct, AnyProduct, Brand, CollectionItem } from '../types';

export interface SearchCriteria {
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  category?: string;
}

interface DataContextType {
  upcomingPhones: Product[];
  popularPhones: Product[];
  articles: NewsItem[];
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  
  // Dynamic Content
  brands: Brand[];
  collections: CollectionItem[];

  // Admin Data Stores
  mobiles: MobileProduct[];
  laptops: LaptopProduct[];
  tablets: TabletProduct[];
  tvs: TVProduct[];

  // CRUD Actions
  addMobile: (mobile: MobileProduct) => Promise<void>;
  updateMobile: (mobile: MobileProduct) => Promise<void>;
  deleteMobile: (id: string) => Promise<void>;

  addLaptop: (laptop: LaptopProduct) => Promise<void>;
  updateLaptop: (laptop: LaptopProduct) => Promise<void>;
  deleteLaptop: (id: string) => Promise<void>;

  addTablet: (tablet: TabletProduct) => Promise<void>;
  updateTablet: (tablet: TabletProduct) => Promise<void>;
  deleteTablet: (id: string) => Promise<void>;

  addTV: (tv: TVProduct) => Promise<void>;
  updateTV: (tv: TVProduct) => Promise<void>;
  deleteTV: (id: string) => Promise<void>;

  // Brand & Collection CRUD
  addBrand: (brand: Brand) => Promise<void>;
  updateBrand: (brand: Brand) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;

  addCollection: (col: CollectionItem) => Promise<void>;
  updateCollection: (col: CollectionItem) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  // Consolidated Getters
  latestNews: NewsItem[];
  hindiNews: NewsItem[];
  stories: NewsItem[];
  
  // Article CRUD
  addArticle: (article: NewsItem) => Promise<void>;
  updateArticle: (article: NewsItem) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  
  // Aux CRUD
  addAuthor: (author: Author) => Promise<void>;
  updateAuthor: (author: Author) => Promise<void>;
  deleteAuthor: (id: string) => Promise<void>;

  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  searchProducts: (criteria: SearchCriteria) => Product[];
  
  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;

  // Auth
  user: User | null;
  signIn: (email: string, password?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [mobiles, setMobiles] = useState<MobileProduct[]>([]);
  const [laptops, setLaptops] = useState<LaptopProduct[]>([]);
  const [tablets, setTablets] = useState<TabletProduct[]>([]);
  const [tvs, setTvs] = useState<TVProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth & Data
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetch Initial Data
    fetchAllData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const { data: mobilesData } = await supabase.from('mobiles').select('*');
      if (mobilesData) setMobiles(mobilesData.map(m => ({...m, category: 'mobile'})));

      const { data: laptopsData } = await supabase.from('laptops').select('*');
      if (laptopsData) setLaptops(laptopsData.map(l => ({...l, category: 'laptop'})));

      const { data: tabletsData } = await supabase.from('tablets').select('*');
      if (tabletsData) setTablets(tabletsData.map(t => ({...t, category: 'tablet'})));

      const { data: tvsData } = await supabase.from('tvs').select('*');
      if (tvsData) setTvs(tvsData.map(t => ({...t, category: 'tv'})));

      const { data: articlesData } = await supabase.from('articles').select('*');
      if (articlesData) setArticles(articlesData);

      const { data: brandsData } = await supabase.from('brands').select('*');
      if (brandsData) setBrands(brandsData);

      const { data: collectionsData } = await supabase.from('collections').select('*');
      if (collectionsData) setCollections(collectionsData);
      
      const { data: authorsData } = await supabase.from('authors').select('*');
      if (authorsData) setAuthors(authorsData);

      const { data: categoriesData } = await supabase.from('news_categories').select('*');
      if (categoriesData) setCategories(categoriesData);

      const { data: tagsData } = await supabase.from('news_tags').select('*');
      if (tagsData) setTags(tagsData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Methods
  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    }
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // --- MOBILES ---
  const addMobile = async (m: MobileProduct) => {
    const { category, id, ...rest } = m; 
    const { data, error } = await supabase.from('mobiles').insert([rest]).select().single();
    if (!error && data) {
      setMobiles(prev => [...prev, { ...data, category: 'mobile' }]);
    }
  };
  const updateMobile = async (m: MobileProduct) => {
    const { category, ...rest } = m;
    const { error } = await supabase.from('mobiles').update(rest).eq('id', m.id);
    if (!error) {
      setMobiles(prev => prev.map(item => item.id === m.id ? m : item));
    }
  };
  const deleteMobile = async (id: string) => {
    const { error } = await supabase.from('mobiles').delete().eq('id', id);
    if (!error) {
      setMobiles(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- LAPTOPS ---
  const addLaptop = async (l: LaptopProduct) => {
    const { category, id, ...rest } = l;
    const { data, error } = await supabase.from('laptops').insert([rest]).select().single();
    if (!error && data) {
      setLaptops(prev => [...prev, { ...data, category: 'laptop' }]);
    }
  };
  const updateLaptop = async (l: LaptopProduct) => {
    const { category, ...rest } = l;
    const { error } = await supabase.from('laptops').update(rest).eq('id', l.id);
    if (!error) {
      setLaptops(prev => prev.map(item => item.id === l.id ? l : item));
    }
  };
  const deleteLaptop = async (id: string) => {
    const { error } = await supabase.from('laptops').delete().eq('id', id);
    if (!error) {
      setLaptops(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- TABLETS ---
  const addTablet = async (t: TabletProduct) => {
    const { category, id, ...rest } = t;
    const { data, error } = await supabase.from('tablets').insert([rest]).select().single();
    if (!error && data) {
      setTablets(prev => [...prev, { ...data, category: 'tablet' }]);
    }
  };
  const updateTablet = async (t: TabletProduct) => {
    const { category, ...rest } = t;
    const { error } = await supabase.from('tablets').update(rest).eq('id', t.id);
    if (!error) {
      setTablets(prev => prev.map(item => item.id === t.id ? t : item));
    }
  };
  const deleteTablet = async (id: string) => {
    const { error } = await supabase.from('tablets').delete().eq('id', id);
    if (!error) {
      setTablets(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- TVS ---
  const addTV = async (t: TVProduct) => {
    const { category, id, ...rest } = t;
    const { data, error } = await supabase.from('tvs').insert([rest]).select().single();
    if (!error && data) {
      setTvs(prev => [...prev, { ...data, category: 'tv' }]);
    }
  };
  const updateTV = async (t: TVProduct) => {
    const { category, ...rest } = t;
    const { error } = await supabase.from('tvs').update(rest).eq('id', t.id);
    if (!error) {
      setTvs(prev => prev.map(item => item.id === t.id ? t : item));
    }
  };
  const deleteTV = async (id: string) => {
    const { error } = await supabase.from('tvs').delete().eq('id', id);
    if (!error) {
      setTvs(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- ARTICLES ---
  const addArticle = async (a: NewsItem) => {
    const { id, ...rest } = a;
    const { data, error } = await supabase.from('articles').insert([rest]).select().single();
    if (!error && data) {
      setArticles(prev => [data, ...prev]);
    }
  };
  const updateArticle = async (a: NewsItem) => {
    const { error } = await supabase.from('articles').update(a).eq('id', a.id);
    if (!error) {
      setArticles(prev => prev.map(item => item.id === a.id ? a : item));
    }
  };
  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) {
      setArticles(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- AUXILIARY CRUD (Authors, Cats, Tags) ---
  const addAuthor = async (a: Author) => {
      const { id, ...rest } = a;
      const { data, error } = await supabase.from('authors').insert([rest]).select().single();
      if(!error && data) setAuthors(prev => [...prev, data]);
  };
  const updateAuthor = async (a: Author) => {
      const { error } = await supabase.from('authors').update(a).eq('id', a.id);
      if(!error) setAuthors(prev => prev.map(i => i.id === a.id ? a : i));
  };
  const deleteAuthor = async (id: string) => {
      const { error } = await supabase.from('authors').delete().eq('id', id);
      if(!error) setAuthors(prev => prev.filter(i => i.id !== id));
  };

  const addCategory = async (c: Category) => {
      const { id, ...rest } = c;
      const { data, error } = await supabase.from('news_categories').insert([rest]).select().single();
      if(!error && data) setCategories(prev => [...prev, data]);
  };
  const updateCategory = async (c: Category) => {
      const { error } = await supabase.from('news_categories').update(c).eq('id', c.id);
      if(!error) setCategories(prev => prev.map(i => i.id === c.id ? c : i));
  };
  const deleteCategory = async (id: string) => {
      const { error } = await supabase.from('news_categories').delete().eq('id', id);
      if(!error) setCategories(prev => prev.filter(i => i.id !== id));
  };

  const addTag = async (t: Tag) => {
      const { id, ...rest } = t;
      const { data, error } = await supabase.from('news_tags').insert([rest]).select().single();
      if(!error && data) setTags(prev => [...prev, data]);
  };
  const deleteTag = async (id: string) => {
      const { error } = await supabase.from('news_tags').delete().eq('id', id);
      if(!error) setTags(prev => prev.filter(i => i.id !== id));
  };

  // --- BRANDS ---
  const addBrand = async (b: Brand) => {
      const { id, ...rest } = b;
      const { data, error } = await supabase.from('brands').insert([rest]).select().single();
      if (!error && data) setBrands(prev => [...prev, data]);
  };
  const updateBrand = async (b: Brand) => {
      const { error } = await supabase.from('brands').update(b).eq('id', b.id);
      if (!error) setBrands(prev => prev.map(i => i.id === b.id ? b : i));
  };
  const deleteBrand = async (id: string) => {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (!error) setBrands(prev => prev.filter(i => i.id !== id));
  };

  // --- COLLECTIONS ---
  const addCollection = async (c: CollectionItem) => {
      const { id, ...rest } = c;
      const { data, error } = await supabase.from('collections').insert([rest]).select().single();
      if (!error && data) setCollections(prev => [...prev, data]);
  };
  const updateCollection = async (c: CollectionItem) => {
      const { error } = await supabase.from('collections').update(c).eq('id', c.id);
      if (!error) setCollections(prev => prev.map(i => i.id === c.id ? c : i));
  };
  const deleteCollection = async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (!error) setCollections(prev => prev.filter(i => i.id !== id));
  };


  // Computed & Utils
  const upcomingPhones = mobiles.filter(m => m.status === 'Coming Soon').map(m => ({ id: m.id, name: `${m.brand} ${m.model}`, price: `BDT ${m.price_bd}`, image: m.images?.[0]?.url || 'https://placehold.co/200x250', category: 'mobile' as const }));
  const popularPhones = mobiles.filter(m => m.status === 'Available').slice(0, 10).map(m => ({ id: m.id, name: `${m.brand} ${m.model}`, price: `BDT ${m.price_bd}`, image: m.images?.[0]?.url || 'https://placehold.co/200x250', category: 'mobile' as const }));
  
  const latestNews = articles.filter(a => a.status === 'published').sort((a,b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()).slice(0, 10);
  const hindiNews = articles.filter(a => a.tags?.includes('Hindi')).slice(0, 5);
  const stories = articles.filter(a => a.category === 'Opinion').slice(0, 3);

  const searchProducts = ({ keyword, minPrice, maxPrice, category }: SearchCriteria) => {
    let results = [
        ...mobiles.map(m => ({ ...m, category: 'mobile' as const })),
        ...laptops.map(l => ({ ...l, category: 'laptop' as const })),
        ...tablets.map(t => ({ ...t, category: 'tablet' as const })),
        ...tvs.map(t => ({ ...t, category: 'tv' as const }))
    ];
    
    // Filter by Category
    if (category && category !== 'all') {
        results = results.filter(p => p.category === category);
    }

    // Filter by Price Range
    if (minPrice !== undefined) {
        results = results.filter(p => {
             const price = typeof p.price_bd === 'number' ? p.price_bd : parseInt(String(p.price_bd || '0').replace(/[^0-9]/g, ''), 10);
             return price >= minPrice;
        });
    }

    if (maxPrice !== undefined) {
         results = results.filter(p => {
             const price = typeof p.price_bd === 'number' ? p.price_bd : parseInt(String(p.price_bd || '0').replace(/[^0-9]/g, ''), 10);
             return price <= maxPrice;
        });
    }

    // Filter by Keyword
    if (keyword) {
        const lowerKey = keyword.toLowerCase();
        results = results.filter(p => 
            p.brand?.toLowerCase().includes(lowerKey) ||
            p.model?.toLowerCase().includes(lowerKey) ||
            (p.brand + ' ' + p.model).toLowerCase().includes(lowerKey)
        );
    } else if (!category && minPrice === undefined && maxPrice === undefined) {
        return [];
    }
    
    return results.map(p => ({
        id: p.id,
        name: `${p.brand} ${p.model}`,
        price: `BDT ${p.price_bd?.toLocaleString()}`,
        image: p.images?.[0]?.url || 'https://placehold.co/200x250',
        category: p.category,
        specScore: (p as any).spec_score 
    }));
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
      upcomingPhones, popularPhones, articles, authors, categories, tags,
      brands, collections,
      mobiles, laptops, tablets, tvs,
      addMobile, updateMobile, deleteMobile,
      addLaptop, updateLaptop, deleteLaptop,
      addTablet, updateTablet, deleteTablet,
      addTV, updateTV, deleteTV,
      addBrand, updateBrand, deleteBrand,
      addCollection, updateCollection, deleteCollection,
      latestNews, hindiNews, stories,
      addArticle, updateArticle, deleteArticle,
      addAuthor, updateAuthor, deleteAuthor,
      addCategory, updateCategory, deleteCategory,
      addTag, deleteTag,
      searchProducts, compareList, addToCompare, removeFromCompare, clearCompare,
      user, signIn, signOut, isLoading
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
