import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Icons } from './Icon';
import { Product, NewsItem } from '../types';

interface AdminDashboardProps {
  onExit: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'popular' | 'news' | 'hindi'>('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { 
    upcomingPhones, deleteUpcomingPhone, addUpcomingPhone,
    popularPhones, deletePopularPhone, addPopularPhone,
    latestNews, deleteLatestNews, addLatestNews,
    hindiNews, deleteHindiNews, addHindiNews
  } = useData();

  const [isAdding, setIsAdding] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '', // Price or TimeAgo
    image: '',
    score: '', // For products
  });

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setIsAdding(false);
  };

  const handleAdd = () => {
    const id = Date.now().toString();
    
    if (activeTab === 'upcoming') {
      addUpcomingPhone({
        id,
        name: formData.title,
        price: formData.subtitle || '₹0',
        image: formData.image || 'https://placehold.co/200x250',
        specScore: formData.score ? parseInt(formData.score) : undefined
      });
    } else if (activeTab === 'popular') {
      addPopularPhone({
        id,
        name: formData.title,
        price: formData.subtitle || '₹0',
        image: formData.image || 'https://placehold.co/200x250',
        specScore: formData.score ? parseInt(formData.score) : undefined
      });
    } else if (activeTab === 'news') {
      addLatestNews({
        id,
        title: formData.title,
        timeAgo: formData.subtitle || 'Just Now',
        image: formData.image || 'https://placehold.co/800x400'
      });
    } else if (activeTab === 'hindi') {
      addHindiNews({
        id,
        title: formData.title,
        timeAgo: formData.subtitle || 'अभी',
        image: formData.image || 'https://placehold.co/800x400'
      });
    }

    setIsAdding(false);
    setFormData({ title: '', subtitle: '', image: '', score: '' });
  };

  // Determine current list based on tab
  let currentList: any[] = [];
  let deleteFn: (id: string) => void = () => {};

  if (activeTab === 'upcoming') {
    currentList = upcomingPhones;
    deleteFn = deleteUpcomingPhone;
  } else if (activeTab === 'popular') {
    currentList = popularPhones;
    deleteFn = deletePopularPhone;
  } else if (activeTab === 'news') {
    currentList = latestNews;
    deleteFn = deleteLatestNews;
  } else if (activeTab === 'hindi') {
    currentList = hindiNews;
    deleteFn = deleteHindiNews;
  }

  // Pagination Logic
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedList = currentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderProductList = (items: Product[], deleteFn: (id: string) => void) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-start gap-4">
          <img src={item.image} alt={item.name} className="w-16 h-20 object-contain bg-gray-50 rounded" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 line-clamp-2">{item.name}</h4>
            <div className="text-primary font-bold text-xs mt-1">{item.price}</div>
            {item.specScore && <div className="text-[10px] bg-green-100 text-green-700 inline-block px-1 rounded mt-1">Score: {item.specScore}%</div>}
          </div>
          <button onClick={() => deleteFn(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <Icons.Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderNewsList = (items: NewsItem[], deleteFn: (id: string) => void) => (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center gap-4">
          <img src={item.image} alt={item.title} className="w-20 h-14 object-cover rounded bg-gray-50" />
          <div className="flex-1">
            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{item.title}</h4>
            <div className="text-gray-500 text-xs mt-1">{item.timeAgo}</div>
          </div>
          <button onClick={() => deleteFn(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <Icons.Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-100 z-[100] flex font-sans text-secondary">
      {/* Sidebar */}
      <div className="w-64 bg-[#2c3e50] text-white flex flex-col">
        <div className="p-6 border-b border-gray-700 flex items-center gap-2 text-xl font-bold text-primary">
          <Icons.LayoutDashboard />
          <span>Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Content Management</div>
          <button 
            onClick={() => handleTabChange('upcoming')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${activeTab === 'upcoming' ? 'bg-primary text-gray-900' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <Icons.Smartphone size={18} /> Upcoming Mobiles
          </button>
          <button 
            onClick={() => handleTabChange('popular')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${activeTab === 'popular' ? 'bg-primary text-gray-900' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <Icons.Smartphone size={18} /> Popular Mobiles
          </button>
          <button 
            onClick={() => handleTabChange('news')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${activeTab === 'news' ? 'bg-primary text-gray-900' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <Icons.FileText size={18} /> Latest News
          </button>
          <button 
            onClick={() => handleTabChange('hindi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${activeTab === 'hindi' ? 'bg-primary text-gray-900' : 'hover:bg-gray-700 text-gray-300'}`}
          >
            <Icons.FileText size={18} /> Hindi News
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
           <button onClick={onExit} className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors text-sm font-bold w-full px-4 py-2">
             <Icons.LogOut size={16} /> Exit to Website
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab.replace('-', ' ')} Manager
          </h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary hover:opacity-90 text-gray-900 px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-all shadow-md"
          >
            <Icons.Plus size={18} /> Add New
          </button>
        </header>

        <div className="p-8">
           {(activeTab === 'upcoming' || activeTab === 'popular') && renderProductList(paginatedList, deleteFn)}
           {(activeTab === 'news' || activeTab === 'hindi') && renderNewsList(paginatedList, deleteFn)}

           {paginatedList.length === 0 && (
             <div className="text-center py-10 text-gray-400">No items found.</div>
           )}

           {/* Pagination Controls */}
           {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4 select-none">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Icons.ChevronLeft size={20} />
              </button>
              
              <span className="text-xs font-bold text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Icons.ChevronRight size={20} />
              </button>
            </div>
           )}
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Add New Item</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><Icons.X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                   {(activeTab === 'upcoming' || activeTab === 'popular') ? 'Product Name' : 'Headline'}
                 </label>
                 <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter title..."
                 />
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                   {(activeTab === 'upcoming' || activeTab === 'popular') ? 'Price' : 'Time Ago / Author'}
                 </label>
                 <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    placeholder={(activeTab === 'upcoming' || activeTab === 'popular') ? '₹20,000' : '2 Hours Ago'}
                 />
               </div>

               {(activeTab === 'upcoming' || activeTab === 'popular') && (
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Spec Score (0-100)</label>
                   <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={formData.score}
                      onChange={(e) => setFormData({...formData, score: e.target.value})}
                      placeholder="85"
                   />
                 </div>
               )}

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                 <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                 />
               </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleAdd} className="px-6 py-2 bg-primary text-gray-900 text-sm font-bold rounded shadow hover:opacity-90 transition-colors">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;