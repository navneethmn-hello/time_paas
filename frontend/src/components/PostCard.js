"use client";
import { useState } from 'react';
import { ArrowUp, ArrowDown, MessageSquare, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function PostCard({ post }) {
  const { mockTranslate, language } = useLanguage();
  const { token } = useAuth();
  
  const [upvotes, setUpvotes] = useState(post.upvotes.length);
  const [downvotes, setDownvotes] = useState(post.downvotes.length);

  const handleVote = async (type) => {
    if(!token) return alert('Login required to vote.');
    try {
      if(type === 'upvote') setUpvotes(prev => prev + 1);
      if(type === 'downvote') setDownvotes(prev => prev + 1);

      await api.post(`/posts/${post._id}/vote`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="glass rounded-xl p-4 md:p-6 mb-6 hover:border-purple-500/30 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row gap-4 h-full">
         {/* Voting Column */}
         <div className="flex md:flex-col items-center justify-start gap-2 bg-white/5 border border-white/5 rounded-lg p-2 md:w-16 h-fit shrink-0">
            <button onClick={() => handleVote('upvote')} className="hover:text-emerald-400 transition-colors p-1"><ArrowUp size={20}/></button>
            <span className="font-bold text-lg">{upvotes - downvotes}</span>
            <button onClick={() => handleVote('downvote')} className="hover:text-red-400 transition-colors p-1"><ArrowDown size={20}/></button>
         </div>

         {/* Content Column */}
         <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center text-xs text-slate-400 mb-2 gap-2">
               {post.community && <span className="font-bold text-purple-400 hover:underline cursor-pointer">c/{post.community.name}</span>}
               {post.community && <span>•</span>}
               <span>Posted by <span className="text-white font-medium hover:underline cursor-pointer">{post.author.username}</span></span>
               <span className="hidden sm:inline">•</span>
               <span className="hidden sm:inline">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            
            <h2 className="text-xl font-bold mb-3 group-hover:text-blue-200 transition-colors break-words">{mockTranslate(post.title, language)}</h2>
            
            <p className="text-slate-300 text-sm mb-4 line-clamp-3 whitespace-pre-wrap break-words">
              {mockTranslate(post.content, language)}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-400 mt-4 border-t border-white/5 pt-3">
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare size={16}/>
                <span>{mockTranslate("Comments", language)}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <Share2 size={16}/>
                <span>{mockTranslate("Share", language)}</span>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
