"use client";
import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function PostCard({ post }) {
  const { mockTranslate, language } = useLanguage();
  const { token } = useAuth();
  
  const [likes, setLikes] = useState(post.upvotes.length - post.downvotes.length);
  const [liked, setLiked] = useState(false); // Simplified like state
  const [saved, setSaved] = useState(false);

  const handleLike = async () => {
    if(!token) return alert('Login required to like.');
    try {
      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
      
      // We simulate an upvote if liked, downvote if unliked for the existing backend
      const type = liked ? 'downvote' : 'upvote'; 
      await api.post(`/posts/${post._id}/vote`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
      // Revert on error
      setLiked(!liked);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    }
  };

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 sm:rounded-xl mb-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
            <div className="bg-white dark:bg-black rounded-full w-full h-full flex items-center justify-center">
              <UserIcon size={16} className="text-slate-600 dark:text-slate-400" />
            </div>
          </div>
          <div>
             <span className="font-semibold text-sm text-black dark:text-white hover:text-slate-600 cursor-pointer">
               {post.author.username}
             </span>
             {post.community && (
               <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                 c/{post.community.name}
               </span>
             )}
          </div>
        </div>
        <button className="text-slate-800 dark:text-white p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content Area (Simulating an image post but with text) */}
      <div className="bg-slate-50 dark:bg-slate-900/50 min-h-[300px] flex items-center justify-center p-6 border-b border-slate-100 dark:border-white/5">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white break-words">
          {mockTranslate(post.title, language)}
        </h2>
      </div>

      {/* Action Bar */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={`${liked ? 'text-red-500' : 'text-black dark:text-white hover:text-slate-500'} transition-colors`}>
              <Heart size={24} className={liked ? "fill-current" : ""} />
            </button>
            <button className="text-black dark:text-white hover:text-slate-500 transition-colors">
              <MessageCircle size={24} />
            </button>
            <button className="text-black dark:text-white hover:text-slate-500 transition-colors">
              <Send size={24} />
            </button>
          </div>
          <button onClick={() => setSaved(!saved)} className="text-black dark:text-white hover:text-slate-500 transition-colors">
            <Bookmark size={24} className={saved ? "fill-current" : ""} />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm text-black dark:text-white mb-2">
          {likes} {likes === 1 ? 'like' : 'likes'}
        </div>

        {/* Caption */}
        <div className="text-sm text-black dark:text-white">
          <span className="font-semibold mr-2 cursor-pointer">{post.author.username}</span>
          <span className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
            {mockTranslate(post.content, language)}
          </span>
        </div>
        
        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
