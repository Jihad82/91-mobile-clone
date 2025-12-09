
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { NewsItem, MobileProduct, LaptopProduct, TabletProduct, TVProduct } from '../types';
import RichTextEditor from './RichTextEditor';
import MobileProductForm from './MobileProductForm';
import LaptopProductForm from './LaptopProductForm';
import TabletProductForm from './TabletProductForm';
import TVProductForm from './TVProductForm';

interface AdminDashboardProps {
  onExit: () => void;
}

type ViewState = 'dashboard' | 'articles' | 'editor' | 'mobiles' | 'laptops' | 'tablets' | 'tvs' | 'mobileEditor' | 'laptopEditor' | 'tabletEditor' | 'tvEditor';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { 
    articles, addArticle, updateArticle, deleteArticle, 
    authors, categories,
    mobiles, addMobile, updateMobile, deleteMobile,
    laptops, addLaptop, updateLaptop, deleteLaptop,
    tablets, addTablet, updateTablet, deleteTablet,
    tvs, addTV, updateTV, deleteTV
  } = useData();

  // --- Article Logic ---
  const [articleForm, setArticleForm] = useState<Partial<NewsItem>>({ status: 'draft', publishedAt: new Date().toISOString().slice(0, 16) });
  const [activeTab, setActiveTab] = useState<'content' | 'review' | 'seo'>('content');

  const handleEditArticle = (article: NewsItem) => {
    setEditingId(article.id);
    setArticleForm(article);
    setView('editor');
  };

  const handleNewArticle = () => {
    setEditingId(null);
    setArticleForm({ status: 'draft', publishedAt: new Date().toISOString().slice(0, 16) });
    setView('editor');
  };

  const saveArticle = () => {
    const finalData = { ...articleForm, id: editingId || Date.now().toString() } as NewsItem;
    editingId ? updateArticle(finalData) : addArticle(finalData);
    setView('articles');
  };

  // --- Product List Renderer ---
  const renderProductList = (
      title: string, 
      data: any[], 
      onEdit: (id: string) => void, 
      onDelete: (id: string) => void, 
      onAdd: () => void
  ) => (
    <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="font-bold text-white">{title} Inventory</h3>
            <button onClick={onAdd} className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <Icons.Plus size={16} /> Add New
            </button>
        </div>
        <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900 uppercase font-bold text-xs">
                <tr>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
                {data.map(item => (
                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 font-bold text-white">{item.brand} {item.model}</td>
                        <td className="p-4 text-white">BDT {item.price_bd?.toLocaleString()}</td>
                        <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-900/30 text-green-400">{item.status}</span></td>
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

  // --- Routing ---
  if (view === 'mobileEditor') {
      const item = editingId ? mobiles.find(m => m.id === editingId) : null;
      return <div className="fixed inset-0 z-[100]"><MobileProductForm initialData={item} onSave={(d) => { editingId ? updateMobile(d) : addMobile(d); setView('mobiles'); }} onCancel={() => setView('mobiles')} /></div>;
  }
  if (view === 'laptopEditor') {
      const item = editingId ? laptops.find(l => l.id === editingId) : null;
      return <div className="fixed inset-0 z-[100]"><LaptopProductForm initialData={item} onSave={(d) => { editingId ? updateLaptop(d) : addLaptop(d); setView('laptops'); }} onCancel={() => setView('laptops')} /></div>;
  }
  if (view === 'tabletEditor') {
      const item = editingId ? tablets.find(t => t.id === editingId) : null;
      return <div className="fixed inset-0 z-[100]"><TabletProductForm initialData={item} onSave={(d) => { editingId ? updateTablet(d) : addTablet(d); setView('tablets'); }} onCancel={() => setView('tablets')} /></div>;
  }
  if (view === 'tvEditor') {
      const item = editingId ? tvs.find(t => t.id === editingId) : null;
      return <div className="fixed inset-0 z-[100]"><TVProductForm initialData={item} onSave={(d) => { editingId ? updateTV(d) : addTV(d); setView('tvs'); }} onCancel={() => setView('tvs')} /></div>;
  }

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-gray-100 z-[100] flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] flex flex-col border-r border-gray-800">
        <div className="p-6 flex items-center gap-3 text-primary border-b border-gray-800">
          <Icons.LayoutDashboard size={24} /> <span className="font-black text-xl">CMS Admin</span>
        </div>
        
        {/* Status Indicator */}
        <div className="px-6 py-4">
          <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <div>
              <div className="text-[10px] text-green-400 font-bold uppercase tracking-wide">System Status</div>
              <div className="text-xs text-white font-bold">Data Persisted</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'dashboard' ? 'bg-primary text-gray-900' : 'text-gray-400 hover:text-white'}`}><Icons.BarChart2 size={18} /> Dashboard</button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase">Inventory</div>
          <button onClick={() => setView('mobiles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'mobiles' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Smartphone size={18} /> Mobiles</button>
          <button onClick={() => setView('laptops')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'laptops' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Laptop size={18} /> Laptops</button>
          <button onClick={() => setView('tablets')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'tablets' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tablet size={18} /> Tablets</button>
          <button onClick={() => setView('tvs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view === 'tvs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.Tv size={18} /> TVs</button>

          <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase">Content</div>
          <button onClick={() => setView('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm ${view.includes('articles') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}><Icons.FileText size={18} /> Articles</button>
        </nav>
        <div className="p-4 border-t border-gray-800"><button onClick={onExit} className="flex gap-2 text-red-400 font-bold px-4 py-2 w-full justify-center hover:bg-gray-800 rounded">Exit</button></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] overflow-hidden">
        <header className="h-16 border-b border-gray-800 bg-[#1e293b]/50 flex items-center px-8 justify-between">
            <h2 className="text-lg font-bold text-white capitalize">{view}</h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
            {view === 'dashboard' && (
                <div className="grid grid-cols-4 gap-6">
                    {[{l:'Mobiles', v:mobiles.length}, {l:'Laptops', v:laptops.length}, {l:'Tablets', v:tablets.length}, {l:'TVs', v:tvs.length}].map((s,i) => (
                        <div key={i} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
                            <div className="text-gray-400 text-sm font-bold">{s.l}</div>
                            <div className="text-4xl font-black text-white">{s.v}</div>
                        </div>
                    ))}
                </div>
            )}
            
            {view === 'mobiles' && renderProductList('Mobile', mobiles, (id) => { setEditingId(id); setView('mobileEditor'); }, deleteMobile, () => { setEditingId(null); setView('mobileEditor'); })}
            {view === 'laptops' && renderProductList('Laptop', laptops, (id) => { setEditingId(id); setView('laptopEditor'); }, deleteLaptop, () => { setEditingId(null); setView('laptopEditor'); })}
            {view === 'tablets' && renderProductList('Tablet', tablets, (id) => { setEditingId(id); setView('tabletEditor'); }, deleteTablet, () => { setEditingId(null); setView('tabletEditor'); })}
            {view === 'tvs' && renderProductList('TV', tvs, (id) => { setEditingId(id); setView('tvEditor'); }, deleteTV, () => { setEditingId(null); setView('tvEditor'); })}

            {view === 'articles' && (
                 <div className="bg-[#1e293b] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">Articles</h3>
                        <button onClick={handleNewArticle} className="bg-primary hover:bg-primary-dark text-gray-900 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Icons.Plus size={16} /> New Article</button>
                    </div>
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 uppercase font-bold text-xs"><tr><th className="p-4">Title</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-800">
                            {articles.map(a => (
                                <tr key={a.id} className="hover:bg-gray-800/50"><td className="p-4 text-white">{a.title}</td><td className="p-4">{a.status}</td><td className="p-4 text-right"><button onClick={() => handleEditArticle(a)} className="text-primary"><Icons.Settings size={16}/></button></td></tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            )}

            {/* Article Editor */}
            {view === 'editor' && (
                <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-9 flex flex-col gap-4">
                        <input type="text" placeholder="Title" className="w-full bg-[#1e293b] text-2xl font-bold p-4 rounded border border-gray-800" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} />
                        <div className="flex-1 bg-[#1e293b] rounded border border-gray-800 overflow-hidden"><RichTextEditor content={articleForm.content || ''} onChange={c => setArticleForm({...articleForm, content: c})} /></div>
                    </div>
                    <div className="col-span-3 bg-[#1e293b] p-4 rounded border border-gray-800 h-fit space-y-4">
                        <h4 className="font-bold text-white">Publish</h4>
                        <select className="w-full bg-gray-900 p-2 rounded" value={articleForm.status} onChange={e => setArticleForm({...articleForm, status: e.target.value as any})}><option value="draft">Draft</option><option value="published">Published</option></select>
                        <button onClick={saveArticle} className="w-full bg-primary text-black font-bold py-2 rounded">Save</button>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
