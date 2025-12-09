
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { NewsItem, MobileProduct, LaptopProduct, TabletProduct, TVProduct, Brand, CollectionItem, Author, Category, Tag } from '../types';
import RichTextEditor from './RichTextEditor';
import MobileProductForm from './MobileProductForm';
import LaptopProductForm from './LaptopProductForm';
import TabletProductForm from './TabletProductForm';
import TVProductForm from './TVProductForm';

interface AdminDashboardProps {
  onExit: () => void;
}

type ViewState = 'dashboard' | 'articles' | 'editor' | 'mobiles' | 'laptops' | 'tablets' | 'tvs' | 'brands' | 'collections' | 'authors' | 'categories' | 'tags' | 'mobileEditor' | 'laptopEditor' | 'tabletEditor' | 'tvEditor';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  
  // Sub-Managers State
  const [brandForm, setBrandForm] = useState<Partial<Brand>>({});
  const [collectionForm, setCollectionForm] = useState<Partial<CollectionItem>>({});
  const [authorForm, setAuthorForm] = useState<Partial<Author>>({});
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({});
  const [tagForm, setTagForm] = useState<Partial<Tag>>({});
  
  // Articles Advanced State
  const [articleSearch, setArticleSearch] = useState('');
  const [articleStatusFilter, setArticleStatusFilter] = useState('all');

  const { 
    user, signIn, signOut,
    articles, addArticle, updateArticle, deleteArticle, 
    mobiles, addMobile, updateMobile, deleteMobile,
    laptops, addLaptop, updateLaptop, deleteLaptop,
    tablets, addTablet, updateTablet, deleteTablet,
    tvs, addTV, updateTV, deleteTV,
    brands, addBrand, updateBrand, deleteBrand,
    collections, addCollection, updateCollection, deleteCollection,
    authors, addAuthor, updateAuthor, deleteAuthor,
    categories, addCategory, updateCategory, deleteCategory,
    tags, addTag, deleteTag
  } = useData();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage('Logging in...');
    const { error } = await signIn(email, password);
    if (error) setLoginMessage('Error: ' + error.message);
    else setLoginMessage('Success!');
  };

  if (!user) {
      return (
          <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center z-[100]">
              <div className="bg-[#1e293b] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
                  <div className="flex items-center gap-3 text-primary justify-center mb-8">
                      <Icons.LayoutDashboard size={32} />
                      <span className="font-black text-2xl tracking-tight">Admin Access</span>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@91mobiles.com" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-primary outline-none" required />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Password</label>
                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-primary outline-none" required />
                      </div>
                      <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3 rounded-xl transition-all">Login</button>
                      {loginMessage && <p className="text-center text-sm text-gray-400 mt-2">{loginMessage}</p>}
                  </form>
                  <button onClick={onExit} className="w-full text-gray-500 text-sm font-bold mt-6 hover:text-white">Back to Site</button>
              </div>
          </div>
      );
  }

  // --- Article Editor Logic ---
  const [articleForm, setArticleForm] = useState<Partial<NewsItem>>({});

  const handleEditArticle = (article: NewsItem) => {
    setEditingId(article.id);
    setArticleForm({ ...article });
    setView('editor');
  };

  const handleNewArticle = () => {
    setEditingId(null);
    setArticleForm({ status: 'draft', publishedAt: new Date().toISOString(), readTime: '5 min read' });
    setView('editor');
  };

  const saveArticle = async () => {
    // Generate Slug if missing
    let finalData = { ...articleForm };
    if (!finalData.slug && finalData.title) {
        finalData.slug = finalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    // Auto-calculate read time estimate
    if (finalData.content) {
        const words = finalData.content.replace(/<[^>]+>/g, '').split(' ').length;
        finalData.readTime = `${Math.ceil(words / 200)} min read`;
    }

    if (editingId) {
        await updateArticle(finalData as NewsItem);
    } else {
        await addArticle(finalData as NewsItem);
    }
    setView('articles');
  };

  const filteredArticles = articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(articleSearch.toLowerCase());
      const matchesStatus = articleStatusFilter === 'all' || a.status === articleStatusFilter;
      return matchesSearch && matchesStatus;
  });

  // --- Product List Helper ---
  const renderProductList = (title: string, data: any[], onEdit: (id: string) => void, onDelete: (id: string) => void, onAdd: () => void) => (
    <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-white">{title} Inventory</h3>
            <button onClick={onAdd} className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icons.Plus size={16} /> Add New</button>
        </div>
        <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900 uppercase font-bold text-xs"><tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-800">
                {data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-800/50">
                        <td className="p-4 font-bold text-white">{item.brand} {item.model}</td>
                        <td className="p-4">BDT {item.price_bd?.toLocaleString()}</td>
                        <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-800 text-gray-300">{item.status}</span></td>
                        <td className="p-4 text-right space-x-2">
                            <button onClick={() => onEdit(item.id)} className="text-primary hover:text-white"><Icons.Edit size={16} /></button>
                            <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-white"><Icons.Trash2 size={16} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  // --- Editor Forms Routing ---
  if (view === 'mobileEditor') return <div className="fixed inset-0 z-[100]"><MobileProductForm initialData={editingId ? mobiles.find(m => m.id === editingId) : null} onSave={async (d) => { editingId ? await updateMobile(d) : await addMobile(d); setView('mobiles'); }} onCancel={() => setView('mobiles')} /></div>;
  if (view === 'laptopEditor') return <div className="fixed inset-0 z-[100]"><LaptopProductForm initialData={editingId ? laptops.find(l => l.id === editingId) : null} onSave={async (d) => { editingId ? await updateLaptop(d) : await addLaptop(d); setView('laptops'); }} onCancel={() => setView('laptops')} /></div>;
  if (view === 'tabletEditor') return <div className="fixed inset-0 z-[100]"><TabletProductForm initialData={editingId ? tablets.find(t => t.id === editingId) : null} onSave={async (d) => { editingId ? await updateTablet(d) : await addTablet(d); setView('tablets'); }} onCancel={() => setView('tablets')} /></div>;
  if (view === 'tvEditor') return <div className="fixed inset-0 z-[100]"><TVProductForm initialData={editingId ? tvs.find(t => t.id === editingId) : null} onSave={async (d) => { editingId ? await updateTV(d) : await addTV(d); setView('tvs'); }} onCancel={() => setView('tvs')} /></div>;

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-gray-100 z-[100] flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] flex flex-col border-r border-gray-800">
        <div className="p-6 flex items-center gap-3 text-primary border-b border-gray-800"><Icons.LayoutDashboard size={24} /> <span className="font-black text-xl">CMS Admin</span></div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'dashboard' ? 'bg-primary text-gray-900' : 'text-gray-400 hover:text-white'}`}><Icons.BarChart2 size={18} /> Dashboard</button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase">Inventory</div>
          <button onClick={() => setView('mobiles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'mobiles' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Smartphone size={18} /> Mobiles</button>
          <button onClick={() => setView('laptops')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'laptops' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Laptop size={18} /> Laptops</button>
          <button onClick={() => setView('tablets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'tablets' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tablet size={18} /> Tablets</button>
          <button onClick={() => setView('tvs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'tvs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tv size={18} /> TVs</button>

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase">Content</div>
          <button onClick={() => setView('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view.includes('articles') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.FileText size={18} /> Articles</button>
          <button onClick={() => setView('authors')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'authors' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.User size={18} /> Authors</button>
          <button onClick={() => setView('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'categories' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.List size={18} /> Categories</button>
          <button onClick={() => setView('tags')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'tags' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tag size={18} /> Tags</button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase">System</div>
          <button onClick={() => setView('brands')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'brands' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tag size={18} /> Brands</button>
          <button onClick={() => setView('collections')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'collections' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Layers size={18} /> Deep Dive</button>
        </nav>
        <div className="p-4 border-t border-gray-800"><button onClick={() => { signOut(); onExit(); }} className="flex gap-2 text-gray-400 font-bold px-4 py-2 w-full justify-center hover:text-white hover:bg-gray-800 rounded">Sign Out</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] overflow-hidden">
        <header className="h-16 border-b border-gray-800 bg-[#1e293b]/50 flex items-center px-8 justify-between backdrop-blur-md sticky top-0 z-30">
            <h2 className="text-lg font-bold text-white capitalize flex items-center gap-2"><span className="text-gray-500">Admin</span> / <span className="text-primary">{view}</span></h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
            {view === 'dashboard' && (
                <div className="grid grid-cols-4 gap-6">
                    {[{l:'Mobiles', v:mobiles.length}, {l:'Articles', v:articles.length}, {l:'Authors', v:authors.length}, {l:'Categories', v:categories.length}].map((s,i) => (
                        <div key={i} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800 text-center">
                            <div className="text-4xl font-black text-white mb-2">{s.v}</div>
                            <div className="text-gray-400 text-xs font-bold uppercase">{s.l}</div>
                        </div>
                    ))}
                </div>
            )}
            
            {view === 'mobiles' && renderProductList('Mobile', mobiles, (id) => { setEditingId(id); setView('mobileEditor'); }, deleteMobile, () => { setEditingId(null); setView('mobileEditor'); })}
            {view === 'laptops' && renderProductList('Laptop', laptops, (id) => { setEditingId(id); setView('laptopEditor'); }, deleteLaptop, () => { setEditingId(null); setView('laptopEditor'); })}
            {view === 'tablets' && renderProductList('Tablet', tablets, (id) => { setEditingId(id); setView('tabletEditor'); }, deleteTablet, () => { setEditingId(null); setView('tabletEditor'); })}
            {view === 'tvs' && renderProductList('TV', tvs, (id) => { setEditingId(id); setView('tvEditor'); }, deleteTV, () => { setEditingId(null); setView('tvEditor'); })}

            {view === 'articles' && (
                <div className="flex flex-col gap-6 h-full">
                    <div className="flex justify-between items-center gap-4 bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                        <div className="flex gap-4 flex-1">
                            <input type="text" placeholder="Search..." value={articleSearch} onChange={(e) => setArticleSearch(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none" />
                            <select value={articleStatusFilter} onChange={(e) => setArticleStatusFilter(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white outline-none">
                                <option value="all">All Status</option><option value="published">Published</option><option value="draft">Draft</option>
                            </select>
                        </div>
                        <button onClick={handleNewArticle} className="bg-primary text-gray-900 font-bold px-6 py-2 rounded-lg text-sm flex items-center gap-2"><Icons.Plus size={16} /> New Article</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredArticles.map(a => (
                            <div key={a.id} className="bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden group">
                                <div className="h-40 relative">
                                    <img src={a.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{a.status}</div>
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-primary font-bold uppercase mb-1">{a.category}</div>
                                    <h4 className="text-white font-bold line-clamp-2 mb-4 h-12">{a.title}</h4>
                                    <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                                        <span className="text-xs text-gray-500">{a.author}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditArticle(a)} className="text-primary hover:text-white"><Icons.Edit size={16} /></button>
                                            <button onClick={() => deleteArticle(a.id)} className="text-red-500 hover:text-white"><Icons.Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comprehensive News Editor */}
            {view === 'editor' && (
                <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
                    <div className="col-span-9 flex flex-col gap-4 h-full overflow-y-auto pr-2 pb-20">
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800">
                             <input type="text" placeholder="Article Headline" className="w-full bg-transparent text-3xl font-black text-white placeholder-gray-600 outline-none mb-4" value={articleForm.title || ''} onChange={e => setArticleForm({...articleForm, title: e.target.value})} />
                             <input type="text" placeholder="Subtitle / Excerpt" className="w-full bg-transparent text-lg text-gray-400 placeholder-gray-600 outline-none" value={articleForm.subtitle || ''} onChange={e => setArticleForm({...articleForm, subtitle: e.target.value})} />
                        </div>
                        
                        <div className="flex-1 bg-[#1e293b] rounded-xl border border-gray-800 overflow-hidden min-h-[500px]">
                            <RichTextEditor content={articleForm.content || ''} onChange={c => setArticleForm({...articleForm, content: c})} />
                        </div>

                        {/* Additional Meta Fields */}
                        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-800 grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">SEO Title</label>
                                <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={articleForm.seoTitle || ''} onChange={e => setArticleForm({...articleForm, seoTitle: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">SEO Description</label>
                                <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={articleForm.seoDescription || ''} onChange={e => setArticleForm({...articleForm, seoDescription: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Image URL</label>
                                <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={articleForm.heroImage || articleForm.image || ''} onChange={e => setArticleForm({...articleForm, heroImage: e.target.value, image: e.target.value})} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Thumbnail URL</label>
                                <input className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm" value={articleForm.image || ''} onChange={e => setArticleForm({...articleForm, image: e.target.value})} />
                             </div>
                        </div>
                    </div>

                    <div className="col-span-3 space-y-4 h-full overflow-y-auto pb-20">
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                             <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-white text-sm uppercase">Publish</h4><span className={`text-xs font-bold px-2 py-1 rounded ${articleForm.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{articleForm.status || 'Draft'}</span></div>
                             <div className="space-y-3 mb-4">
                                 <div>
                                    <label className="text-xs text-gray-500 font-bold block mb-1">Status</label>
                                    <select className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-white text-sm" value={articleForm.status || 'draft'} onChange={e => setArticleForm({...articleForm, status: e.target.value as any})}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select>
                                 </div>
                                 <div>
                                    <label className="text-xs text-gray-500 font-bold block mb-1">Publish Date</label>
                                    <input type="datetime-local" className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-white text-sm" value={articleForm.publishedAt ? articleForm.publishedAt.slice(0,16) : ''} onChange={e => setArticleForm({...articleForm, publishedAt: e.target.value})} />
                                 </div>
                             </div>
                             <button onClick={saveArticle} className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-2 rounded-lg transition-all">Save & Update</button>
                        </div>

                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                             <h4 className="font-bold text-white text-sm uppercase mb-3">Organization</h4>
                             <div className="space-y-3">
                                 <div>
                                    <label className="text-xs text-gray-500 font-bold block mb-1">Author</label>
                                    <select className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-white text-sm" value={articleForm.authorId || ''} onChange={e => {
                                        const auth = authors.find(a => a.id === e.target.value);
                                        setArticleForm({...articleForm, authorId: e.target.value, author: auth?.name});
                                    }}>
                                        <option value="">Select Author...</option>
                                        {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                 </div>
                                 <div>
                                    <label className="text-xs text-gray-500 font-bold block mb-1">Category</label>
                                    <select className="w-full bg-gray-900 p-2 rounded border border-gray-700 text-white text-sm" value={articleForm.category || ''} onChange={e => setArticleForm({...articleForm, category: e.target.value})}>
                                        <option value="">Select Category...</option>
                                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                 </div>
                                 <div>
                                     <label className="text-xs text-gray-500 font-bold block mb-1">Tags</label>
                                     <div className="flex flex-wrap gap-2 mb-2">
                                         {tags.map(t => (
                                             <button key={t.id} onClick={() => {
                                                 const current = articleForm.tags || [];
                                                 setArticleForm({...articleForm, tags: current.includes(t.name) ? current.filter(x => x !== t.name) : [...current, t.name]});
                                             }} className={`px-2 py-1 rounded text-xs border ${articleForm.tags?.includes(t.name) ? 'bg-primary border-primary text-black' : 'border-gray-700 text-gray-400'}`}>{t.name}</button>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                        </div>
                        
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-800">
                             <h4 className="font-bold text-white text-sm uppercase mb-3">Attributes</h4>
                             <div className="space-y-2">
                                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={articleForm.isMain} onChange={e => setArticleForm({...articleForm, isMain: e.target.checked})} className="rounded bg-gray-900 border-gray-700" /><span className="text-sm text-gray-300">Main Feature</span></label>
                                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={articleForm.isTrending} onChange={e => setArticleForm({...articleForm, isTrending: e.target.checked})} className="rounded bg-gray-900 border-gray-700" /><span className="text-sm text-gray-300">Trending</span></label>
                                 <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={articleForm.isReview} onChange={e => setArticleForm({...articleForm, isReview: e.target.checked})} className="rounded bg-gray-900 border-gray-700" /><span className="text-sm text-gray-300">Is Review</span></label>
                                 {articleForm.isReview && (
                                     <div className="mt-2 pl-6">
                                         <label className="block text-xs text-gray-500 mb-1">Rating</label>
                                         <input type="number" max="5" min="0" step="0.1" className="w-20 bg-gray-900 border-gray-700 rounded p-1 text-white text-sm" value={articleForm.rating || ''} onChange={e => setArticleForm({...articleForm, rating: parseFloat(e.target.value)})} />
                                     </div>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub Managers */}
            {(view === 'authors' || view === 'categories' || view === 'tags') && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
                        <h3 className="font-bold text-white mb-4 capitalize">{view} List</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                            {view === 'authors' && authors.map(a => (
                                <div key={a.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex items-center gap-3 relative group">
                                    <img src={a.avatar} className="w-10 h-10 rounded-full" />
                                    <div><div className="text-white font-bold">{a.name}</div><div className="text-xs text-gray-500">{a.role}</div></div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
                                        <button onClick={() => setAuthorForm(a)} className="text-primary"><Icons.Edit size={14}/></button>
                                        <button onClick={() => deleteAuthor(a.id)} className="text-red-500"><Icons.X size={14}/></button>
                                    </div>
                                </div>
                            ))}
                            {view === 'categories' && categories.map(c => (
                                <div key={c.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center group relative">
                                    <div className="font-bold text-white">{c.name}</div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-2">
                                        <button onClick={() => setCategoryForm(c)} className="text-primary"><Icons.Edit size={14}/></button>
                                        <button onClick={() => deleteCategory(c.id)} className="text-red-500"><Icons.X size={14}/></button>
                                    </div>
                                </div>
                            ))}
                            {view === 'tags' && tags.map(t => (
                                <div key={t.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex justify-between items-center group relative">
                                    <div className="font-bold text-white">#{t.name}</div>
                                    <button onClick={() => deleteTag(t.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500"><Icons.X size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="col-span-4 bg-[#1e293b] rounded-2xl border border-gray-800 p-6 h-fit">
                         <h3 className="font-bold text-white mb-4">Manage {view}</h3>
                         {view === 'authors' && (
                             <div className="space-y-4">
                                 <input className="w-full bg-gray-900 border-gray-700 rounded p-2 text-white" placeholder="Name" value={authorForm.name||''} onChange={e=>setAuthorForm({...authorForm, name:e.target.value})} />
                                 <input className="w-full bg-gray-900 border-gray-700 rounded p-2 text-white" placeholder="Role" value={authorForm.role||''} onChange={e=>setAuthorForm({...authorForm, role:e.target.value})} />
                                 <input className="w-full bg-gray-900 border-gray-700 rounded p-2 text-white" placeholder="Avatar URL" value={authorForm.avatar||''} onChange={e=>setAuthorForm({...authorForm, avatar:e.target.value})} />
                                 <button onClick={async ()=>{ if(authorForm.id) await updateAuthor(authorForm as Author); else await addAuthor(authorForm as Author); setAuthorForm({}); }} className="w-full bg-primary font-bold py-2 rounded">Save Author</button>
                             </div>
                         )}
                         {view === 'categories' && (
                             <div className="space-y-4">
                                 <input className="w-full bg-gray-900 border-gray-700 rounded p-2 text-white" placeholder="Name" value={categoryForm.name||''} onChange={e=>setCategoryForm({...categoryForm, name:e.target.value, slug: e.target.value.toLowerCase()})} />
                                 <button onClick={async ()=>{ if(categoryForm.id) await updateCategory(categoryForm as Category); else await addCategory(categoryForm as Category); setCategoryForm({}); }} className="w-full bg-primary font-bold py-2 rounded">Save Category</button>
                             </div>
                         )}
                         {view === 'tags' && (
                             <div className="space-y-4">
                                 <input className="w-full bg-gray-900 border-gray-700 rounded p-2 text-white" placeholder="Name" value={tagForm.name||''} onChange={e=>setTagForm({...tagForm, name:e.target.value, slug: e.target.value.toLowerCase()})} />
                                 <button onClick={async ()=>{ await addTag(tagForm as Tag); setTagForm({}); }} className="w-full bg-primary font-bold py-2 rounded">Add Tag</button>
                             </div>
                         )}
                    </div>
                </div>
            )}

            {/* Brands/Collections (Existing logic) */}
            {view === 'brands' && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
                         <h3 className="font-bold text-white mb-4">Brands List</h3>
                         <div className="flex flex-wrap gap-4">
                             {brands.map(b => (
                                 <div key={b.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex flex-col items-center gap-2 group relative">
                                     <button onClick={() => deleteBrand(b.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.X size={14}/></button>
                                     <button onClick={() => setBrandForm(b)} className="absolute top-2 left-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Edit size={14}/></button>
                                     {b.logo ? <img src={b.logo} className="h-8 object-contain" alt={b.name} /> : <span style={{color: b.color}} className="font-bold">{b.name}</span>}
                                 </div>
                             ))}
                         </div>
                    </div>
                    <div className="col-span-4 bg-[#1e293b] rounded-2xl border border-gray-800 p-6 h-fit">
                        <h3 className="font-bold text-white mb-4">{brandForm.id ? 'Edit' : 'Add'} Brand</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" value={brandForm.name || ''} onChange={e=>setBrandForm({...brandForm, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <input type="text" placeholder="Logo URL" value={brandForm.logo || ''} onChange={e=>setBrandForm({...brandForm, logo: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <input type="text" placeholder="Color Hex" value={brandForm.color || ''} onChange={e=>setBrandForm({...brandForm, color: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <button onClick={async () => { if(brandForm.id) await updateBrand(brandForm as Brand); else await addBrand(brandForm as Brand); setBrandForm({}); }} className="w-full bg-primary text-black font-bold py-2 rounded">Save Brand</button>
                        </div>
                    </div>
                </div>
            )}

            {view === 'collections' && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-8 bg-[#1e293b] rounded-2xl border border-gray-800 p-6">
                         <h3 className="font-bold text-white mb-4">Deep Dive Collections</h3>
                         <div className="grid grid-cols-2 gap-4">
                             {collections.map(c => (
                                 <div key={c.id} className="bg-gray-900 border border-gray-700 p-4 rounded-xl flex items-center gap-4 group relative">
                                     <img src={c.image} className="w-16 h-16 rounded object-cover" alt="" />
                                     <div>
                                         <div className="font-bold text-white">{c.title}</div>
                                         <div className="text-xs text-gray-400">{c.subtitle}</div>
                                     </div>
                                     <button onClick={() => deleteCollection(c.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.X size={14}/></button>
                                     <button onClick={() => setCollectionForm(c)} className="absolute bottom-2 right-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Edit size={14}/></button>
                                 </div>
                             ))}
                         </div>
                    </div>
                    <div className="col-span-4 bg-[#1e293b] rounded-2xl border border-gray-800 p-6 h-fit">
                        <h3 className="font-bold text-white mb-4">{collectionForm.id ? 'Edit' : 'Add'} Collection</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Title" value={collectionForm.title || ''} onChange={e=>setCollectionForm({...collectionForm, title: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <input type="text" placeholder="Subtitle" value={collectionForm.subtitle || ''} onChange={e=>setCollectionForm({...collectionForm, subtitle: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <input type="text" placeholder="Image URL" value={collectionForm.image || ''} onChange={e=>setCollectionForm({...collectionForm, image: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <input type="text" placeholder="BG Color Class (e.g. bg-blue-900)" value={collectionForm.bg_color || ''} onChange={e=>setCollectionForm({...collectionForm, bg_color: e.target.value})} className="w-full bg-gray-900 border border-gray-700 p-2 rounded text-white" />
                            <button onClick={async () => { if(collectionForm.id) await updateCollection(collectionForm as CollectionItem); else await addCollection(collectionForm as CollectionItem); setCollectionForm({}); }} className="w-full bg-primary text-black font-bold py-2 rounded">Save Collection</button>
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
