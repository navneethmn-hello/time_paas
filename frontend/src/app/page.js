"use client";
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import { useLanguage } from '@/context/LanguageContext';
import { Rocket, TrendingUp, Clock } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('anti-gravity');
  const [loading, setLoading] = useState(true);
  const { mockTranslate, language } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?sort=${sort}`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'anti-gravity', icon: Rocket, label: 'Anti-Gravity' },
    { id: 'top', icon: TrendingUp, label: 'Top' },
    { id: 'new', icon: Clock, label: 'New' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          {mockTranslate("University Feed", language)}
        </h1>
        
        {/* Sort Tabs */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 w-full sm:w-auto overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSort(tab.id)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                sort === tab.id 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{mockTranslate(tab.label, language)}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
         <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
         </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center py-20 glass rounded-xl border border-white/5">
              <Rocket size={48} className="mx-auto text-slate-500 mb-4 animate-bounce" />
              <h2 className="text-xl font-semibold mb-2">{mockTranslate("No posts found", language)}</h2>
              <p className="text-slate-400">{mockTranslate("Be the first to post something!", language)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
