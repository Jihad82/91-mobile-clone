
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { NewsItem, Product, Highlight, ExpertRating } from '../types';
import RichTextEditor from './RichTextEditor';

interface AdminDashboardProps {
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [view, setView] = useState<'dashboard' | 'articles' | 'editor' | 'products' | 'product-editor'>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { 
    articles, addArticle, updateArticle, deleteArticle, 
    authors, categories, 
    popularPhones, upcomingPhones, updateProduct, deletePopularPhone, deleteUpcomingPhone, addPopularPhone
  } = useData();

  // --- Article Editor State ---
  const [articleForm, setArticleForm] = useState<Partial<NewsItem>>({
    title: '',
    slug: '',
    subtitle: '',
    content: '',
    status: 'draft',
    category: 'News',
    authorId: '',
    image: '',
    heroImage: '',
    tags: [],
    isReview: false,
    rating: 0,
    pros: [],
    cons: [],
    publishedAt: new Date().toISOString().slice(0, 16)
  });
  const [activeArticleTab, setActiveArticleTab] = useState<'content' | 'review' | 'seo'>('content');

  // --- Product Editor State ---
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: '',
    image: '',
    specScore: 0,
    brand: '',
    status: 'Available',
    releaseDate: '',
    highlights: [],
    expertRatings: [],
    pros: [],
    cons: []
  });
  const [activeProductTab, setActiveProductTab] = useState<'general' | 'highlights' | 'ratings' | 'verdict'>('general');

  // -------------------------
  // Article Handlers
  // -------------------------
  const handleEditArticle = (article: NewsItem) => {
    setEditingId(article.id);
    setArticleForm({
      ...article,
      publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : ''
    });
    setView('editor');
  };

  const handleCreateArticle = () => {
    setEditingId(null);
    setArticleForm({
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      category: 'News',
      authorId: authors[0]?.id,
      publishedAt: new Date().toISOString().slice(0, 16),
      isReview: false,
      pros: [],
      cons: []
    });
    setView('editor');
  };

  const handleSaveArticle = () => {
    const articleData: NewsItem = {
      id: editingId || Date.now().toString(),
      title: articleForm.title || 'Untitled',
      timeAgo: 'Just Now',
      image: articleForm.image || 'https://placehold.co/600x400',
      ...articleForm as NewsItem,
      author: authors.find(a => a.id === articleForm.authorId)?.name || 'Unknown'
    };

    if (editingId) {
      updateArticle(articleData);
    } else {
      addArticle(articleData);
    }
    setView('articles');
  };

  const handleProsChange = (val: string, index: number) => {
    const newPros = [...(articleForm.pros || [])];
    newPros[index] = val;
    setArticleForm({ ...articleForm, pros: newPros });
  };

  const handleConsChange = (val: string, index: number) => {
    const newCons = [...(articleForm.cons || [])];
    newCons[index] = val;
    setArticleForm({ ...articleForm, cons: newCons });
  };

  // -------------------------
  // Product Handlers
  // -------------------------
  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setProductForm({ ...product });
    setView('product-editor');
  };

  const handleCreateProduct = () => {
      setEditingId(null);
      setProductForm({
          name: '',
          price: '',
          image: '',
          specScore: 80,
          brand: '',
          status: 'Available',
          highlights: [],
          expertRatings: [],
          pros: [],
          cons: []
      });
      setView('product-editor');
  };

  const handleSaveProduct = () => {
      const prodData: Product = {
          id: editingId || Date.now().toString(),
          name: productForm.name || 'New Product',
          price: productForm.price || '₹0',
          image: productForm.image || 'https://placehold.co/200x250',
          ...productForm as Product
      };
      
      if (editingId) {
          updateProduct(prodData);
      } else {
          addPopularPhone(prodData);
      }
      setView('products');
  };

  // Helper for Product Arrays
  const addHighlight = () => setProductForm({...productForm, highlights: [...(productForm.highlights || []), { label: '', value: '' }]});
  const updateHighlight = (idx: number, field: keyof Highlight, val: string) => {
      const newHighlights = [...(productForm.highlights || [])];
      newHighlights[idx] = { ...newHighlights[idx], [field]: val };
      setProductForm({ ...productForm, highlights: newHighlights });
  };
  const removeHighlight = (idx: number) => {
      setProductForm({...productForm, highlights: productForm.highlights?.filter((_, i) => i !== idx)});
  };

  const addRating = () => setProductForm({...productForm, expertRatings: [...(productForm.expertRatings || []), { label: '', score: 80 }]});
  const updateRating = (idx: number, field: keyof ExpertRating, val: any) => {
      const newRatings = [...(productForm.expertRatings || [])];
      newRatings[idx] = { ...newRatings[idx], [field]: val };
      setProductForm({ ...productForm, expertRatings: newRatings });
  };

  const addProdPro = () => setProductForm({...productForm, pros: [...(productForm.pros || []), '']});
  const updateProdPro = (idx: number, val: string) => {
      const newPros = [...(productForm.pros || [])];
      newPros[idx] = val;
      setProductForm({...productForm, pros: newPros});
  };

  const addProdCon = () => setProductForm({...productForm, cons: [...(productForm.cons || []), '']});
  const updateProdCon = (idx: number, val: string) => {
      const newCons = [...(productForm.cons || [])];
      newCons[idx] = val;
      setProductForm({...productForm, cons: newCons});
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-gray-100 z-[100] flex font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#1e293b] flex flex-col border-r border-gray-800">
        <div className="p-6 flex items-center gap-3 text-primary border-b border-gray-800">
          <div className="bg-primary/20 p-2 rounded-lg"><Icons.LayoutDashboard size={24} /></div>
          <span className="font-black text-xl tracking-tight">CMS Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setView('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'dashboard' ? 'bg-primary text-gray-900 shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Icons.BarChart2 size={18} /> Dashboard
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Content</div>
          <button 
            onClick={() => setView('articles')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'articles' || view === 'editor' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Icons.FileText size={18} /> News & Reviews
          </button>
          <button 
            onClick={() => setView('products')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'products' || view === 'product-editor' ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Icons.Smartphone size={18} /> Gadget Specs
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button onClick={onExit} className="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all font-bold w-full px-4 py-3 rounded-xl">
             <Icons.LogOut size={18} /> Exit CMS
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 bg-[#1e293b]/50 backdrop-blur flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-white capitalize">{view.replace('-', ' ')}</h2>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">AD</div>
            </div>
        </header>

        {/* Content Views */}
        <div className="flex-1 overflow-auto p-8">
            
            {/* Dashboard View */}
            {view === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
                        <div className="text-gray-400 text-sm font-bold mb-2">Total Articles</div>
                        <div className="text-4xl font-black text-white">{articles.length}</div>
                    </div>
                     <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
                        <div className="text-gray-400 text-sm font-bold mb-2">Total Products</div>
                        <div className="text-4xl font-black text-blue-500">{popularPhones.length + upcomingPhones.length}</div>
                    </div>
                </div>
            )}

            {/* Articles List View */}
            {view === 'articles' && (
                <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">All Articles</h3>
                        <button onClick={handleCreateArticle} className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <Icons.Plus size={16} /> Add New
                        </button>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 font-medium text-white max-w-md truncate">{article.title}</td>
                                    <td className="p-4">{article.author || 'Unknown'}</td>
                                    <td className="p-4"><span className="bg-gray-800 px-2 py-1 rounded text-xs">{article.category}</span></td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEditArticle(article)} className="text-primary hover:text-white transition-colors"><Icons.Settings size={16} /></button>
                                        <button onClick={() => deleteArticle(article.id)} className="text-red-500 hover:text-white transition-colors"><Icons.Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Article Editor View */}
            {view === 'editor' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    {/* Main Editor Column */}
                    <div className="lg:col-span-9 flex flex-col gap-6">
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
                            <input 
                                type="text" 
                                placeholder="Article Title" 
                                className="w-full bg-transparent text-3xl font-black text-white placeholder-gray-600 outline-none mb-4"
                                value={articleForm.title}
                                onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                            />
                        </div>
                        <div className="flex gap-2 border-b border-gray-800">
                             {['content', 'review', 'seo'].map(tab => (
                                 <button 
                                    key={tab}
                                    onClick={() => setActiveArticleTab(tab as any)}
                                    className={`px-6 py-3 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeArticleTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                                 >
                                    {tab}
                                 </button>
                             ))}
                        </div>
                        {activeArticleTab === 'content' && (
                             <div className="flex-1 flex flex-col">
                                 <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden min-h-[500px] flex flex-col">
                                     <RichTextEditor 
                                        content={articleForm.content || ''} 
                                        onChange={(html) => setArticleForm({...articleForm, content: html})} 
                                     />
                                 </div>
                             </div>
                        )}
                        {activeArticleTab === 'review' && (
                            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800 space-y-6">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={articleForm.isReview} 
                                            onChange={(e) => setArticleForm({...articleForm, isReview: e.target.checked})}
                                            className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-primary focus:ring-offset-gray-900" 
                                        />
                                        <span className="font-bold text-white">Enable Review Mode</span>
                                    </label>
                                </div>
                                {articleForm.isReview && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Review Score (0-5)</label>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                max="5"
                                                className="w-24 bg-gray-900 border border-gray-700 rounded p-2 text-white font-bold text-lg outline-none focus:border-primary"
                                                value={articleForm.rating}
                                                onChange={(e) => setArticleForm({...articleForm, rating: parseFloat(e.target.value)})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h5 className="font-bold text-green-400 mb-2">Pros</h5>
                                                {articleForm.pros?.map((pro, idx) => (
                                                    <input 
                                                        key={idx}
                                                        type="text"
                                                        value={pro}
                                                        onChange={(e) => handleProsChange(e.target.value, idx)}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-2 text-white text-sm"
                                                    />
                                                ))}
                                                <button onClick={() => setArticleForm({...articleForm, pros: [...(articleForm.pros || []), '']})} className="text-xs font-bold text-green-500 hover:text-green-400">+ Add Pro</button>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-red-400 mb-2">Cons</h5>
                                                {articleForm.cons?.map((con, idx) => (
                                                    <input 
                                                        key={idx}
                                                        type="text"
                                                        value={con}
                                                        onChange={(e) => handleConsChange(e.target.value, idx)}
                                                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-2 text-white text-sm"
                                                    />
                                                ))}
                                                <button onClick={() => setArticleForm({...articleForm, cons: [...(articleForm.cons || []), '']})} className="text-xs font-bold text-red-500 hover:text-red-400">+ Add Con</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Sidebar Settings Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800">
                             <div className="flex gap-2">
                                 <button onClick={handleSaveArticle} className="flex-1 bg-primary text-gray-900 font-bold py-2 rounded-lg hover:bg-primary-dark transition-colors">Save</button>
                                 <button onClick={() => setView('articles')} className="px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-bold">Cancel</button>
                             </div>
                        </div>
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800">
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Category</h4>
                            <select 
                                value={articleForm.category}
                                onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                         <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800">
                             <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Featured Image</h4>
                             <input 
                                type="text" 
                                placeholder="Image URL..." 
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-xs outline-none"
                                value={articleForm.image}
                                onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                             />
                        </div>
                    </div>
                </div>
            )}

            {/* Products List View */}
            {view === 'products' && (
                <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">All Gadgets</h3>
                        <button onClick={handleCreateProduct} className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <Icons.Plus size={16} /> Add Product
                        </button>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 uppercase font-bold text-xs">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Score</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {[...popularPhones, ...upcomingPhones].map(prod => (
                                <tr key={prod.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4"><img src={prod.image} className="w-8 h-8 object-contain bg-white rounded" alt="" /></td>
                                    <td className="p-4 font-medium text-white">{prod.name}</td>
                                    <td className="p-4 text-primary">{prod.price}</td>
                                    <td className="p-4">{prod.specScore || '-'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEditProduct(prod)} className="text-primary hover:text-white transition-colors"><Icons.Settings size={16} /></button>
                                        <button onClick={() => { deletePopularPhone(prod.id); deleteUpcomingPhone(prod.id); }} className="text-red-500 hover:text-white transition-colors"><Icons.Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Product Editor View */}
            {view === 'product-editor' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                     <div className="lg:col-span-9 flex flex-col gap-6">
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800 flex gap-4">
                             <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center shrink-0">
                                 <img src={productForm.image} alt="" className="max-w-full max-h-full p-2 object-contain" />
                             </div>
                             <div className="flex-1 space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Product Name" 
                                    className="w-full bg-transparent text-3xl font-black text-white placeholder-gray-600 outline-none"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                />
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Price (e.g. ₹20,000)" 
                                        className="bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Image URL" 
                                        className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white outline-none"
                                        value={productForm.image}
                                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                                    />
                                </div>
                             </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-800">
                             {['general', 'highlights', 'ratings', 'verdict'].map(tab => (
                                 <button 
                                    key={tab}
                                    onClick={() => setActiveProductTab(tab as any)}
                                    className={`px-6 py-3 font-bold text-sm uppercase tracking-wide border-b-2 transition-colors ${activeProductTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
                                 >
                                    {tab}
                                 </button>
                             ))}
                        </div>

                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800 min-h-[400px]">
                            {activeProductTab === 'general' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
                                        <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Spec Score</label>
                                        <input type="number" className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" value={productForm.specScore} onChange={e => setProductForm({...productForm, specScore: Number(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Release Date</label>
                                        <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" value={productForm.releaseDate} onChange={e => setProductForm({...productForm, releaseDate: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                                        <select className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white" value={productForm.status} onChange={e => setProductForm({...productForm, status: e.target.value})}>
                                            <option>Available</option>
                                            <option>Upcoming</option>
                                            <option>Rumored</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeProductTab === 'highlights' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-white">Key Features</h4>
                                        <button onClick={addHighlight} className="text-xs bg-primary text-gray-900 px-2 py-1 rounded font-bold">Add Feature</button>
                                    </div>
                                    {productForm.highlights?.map((hl, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input placeholder="Label (e.g. Display)" className="w-1/3 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={hl.label} onChange={e => updateHighlight(idx, 'label', e.target.value)} />
                                            <input placeholder="Value (e.g. 6.7 AMOLED)" className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={hl.value} onChange={e => updateHighlight(idx, 'value', e.target.value)} />
                                            <button onClick={() => removeHighlight(idx)} className="text-red-500 p-2"><Icons.Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    {(!productForm.highlights || productForm.highlights.length === 0) && <p className="text-gray-500 text-sm">No highlights added.</p>}
                                </div>
                            )}

                            {activeProductTab === 'ratings' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-white">Expert Ratings</h4>
                                        <button onClick={addRating} className="text-xs bg-primary text-gray-900 px-2 py-1 rounded font-bold">Add Category</button>
                                    </div>
                                    {productForm.expertRatings?.map((rt, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input placeholder="Category" className="flex-1 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={rt.label} onChange={e => updateRating(idx, 'label', e.target.value)} />
                                            <input type="number" placeholder="Score" className="w-20 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={rt.score} onChange={e => updateRating(idx, 'score', Number(e.target.value))} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeProductTab === 'verdict' && (
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex justify-between mb-2"><h4 className="font-bold text-green-400">Pros</h4><button onClick={addProdPro} className="text-xs font-bold text-green-500">+</button></div>
                                        {productForm.pros?.map((p, idx) => (
                                            <input key={idx} className="w-full mb-2 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={p} onChange={e => updateProdPro(idx, e.target.value)} />
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2"><h4 className="font-bold text-red-400">Cons</h4><button onClick={addProdCon} className="text-xs font-bold text-red-500">+</button></div>
                                        {productForm.cons?.map((c, idx) => (
                                            <input key={idx} className="w-full mb-2 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={c} onChange={e => updateProdCon(idx, e.target.value)} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                     </div>

                     <div className="lg:col-span-3">
                        <div className="bg-[#1e293b] p-5 rounded-2xl border border-gray-800 space-y-4">
                            <button onClick={handleSaveProduct} className="w-full bg-primary text-gray-900 font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                                Save Product
                            </button>
                            <button onClick={() => setView('products')} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors">
                                Cancel
                            </button>
                        </div>
                     </div>
                </div>
            )}

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
