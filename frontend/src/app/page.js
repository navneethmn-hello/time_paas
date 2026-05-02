"use client";
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import { useLanguage } from '@/context/LanguageContext';
import { Rocket } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, prefetch, language } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      prefetch(posts.flatMap((p) => [p.title, p.content]));
    }
  }, [language, posts, prefetch]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?sort=new`); // Fetching new posts like a feed
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto pb-20">
      {loading ? (
         <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white"></div>
         </div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl">
              <Rocket size={48} className="mx-auto text-slate-400 mb-4 animate-bounce" />
              <h2 className="text-xl font-semibold mb-2">{t("No posts found")}</h2>
              <p className="text-slate-500 dark:text-slate-400">{t("Be the first to post something!")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
