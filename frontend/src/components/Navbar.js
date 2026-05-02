"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogIn, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import GoogleLoginButton from './GoogleLoginButton';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { language, setLanguage, mockTranslate } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = async (credential) => {
    const idToken = credential || 'mock_' + Math.floor(Math.random() * 1000000);
    await login({ idToken });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          itna vibe
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-md px-2 py-1 outline-none text-sm focus:border-purple-500"
          >
            <option value="en" className="bg-slate-800">EN</option>
            <option value="kn" className="bg-slate-800">KN (ಕನ್ನಡ)</option>
            <option value="hi" className="bg-slate-800">HI (हिंदी)</option>
            <option value="fr" className="bg-slate-800">FR</option>
            <option value="zh" className="bg-slate-800">ZH</option>
          </select>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-2 hover:text-purple-400 transition bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <User size={16} />
                <span className="text-sm font-medium">{user.username}</span>
              </Link>
              <button onClick={logout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <GoogleLoginButton
              onCredential={handleLogin}
              fallbackLabel={mockTranslate("Student Login", language)}
              className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-full hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all text-sm font-bold min-h-11"
            />
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass px-4 py-4 flex flex-col space-y-4 border-b border-white/10">
           {user ? (
            <>
              <Link href="/profile" className="hover:text-purple-400 transition flex items-center gap-2" onClick={() => setMenuOpen(false)}><User size={18}/> Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-400 hover:text-red-300 flex items-center gap-2"><LogOut size={18}/> Logout</button>
            </>
           ) : (
             <div className="flex flex-col gap-2">
              <span className="text-left text-purple-400 flex items-center gap-2"><LogIn size={18}/> {mockTranslate("Student Login", language)}</span>
              <GoogleLoginButton
                onCredential={async (credential) => {
                  await handleLogin(credential);
                  setMenuOpen(false);
                }}
                fallbackLabel={mockTranslate("Student Login", language)}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-bold text-white min-h-11"
              />
             </div>
           )}
        </div>
      )}
    </nav>
  );
}
