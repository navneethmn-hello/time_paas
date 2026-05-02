"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LogIn, LogOut, User, Menu, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import GoogleLoginButton from './GoogleLoginButton';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const { language, setLanguage, mockTranslate } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (credential) => {
    const idToken = credential || 'mock_' + Math.floor(Math.random() * 1000000);
    await login({ idToken });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center h-14">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold font-serif tracking-wide text-black dark:text-white">
          itna vibe
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          )}

          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 outline-none text-sm text-slate-800 dark:text-slate-200 focus:border-slate-400 dark:focus:border-slate-500"
          >
            <option value="en">EN</option>
            <option value="kn">KN</option>
            <option value="hi">HI</option>
            <option value="fr">FR</option>
            <option value="zh">ZH</option>
          </select>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white transition">
                <User size={24} />
              </Link>
              <button onClick={logout} className="text-red-500 hover:text-red-600 transition">
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <GoogleLoginButton
              onCredential={handleLogin}
              fallbackLabel={mockTranslate("Login", language)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm transition"
            />
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center space-x-3">
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-slate-800 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          )}
          <button className="text-slate-800 dark:text-slate-200" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={28} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-black px-4 py-4 flex flex-col space-y-4 border-b border-slate-200 dark:border-white/10 text-black dark:text-white transition-colors duration-300">
           {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 font-medium" onClick={() => setMenuOpen(false)}><User size={20}/> Profile</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-500 flex items-center gap-2 font-medium"><LogOut size={20}/> Logout</button>
            </>
           ) : (
             <div className="flex flex-col gap-3">
               <GoogleLoginButton
                onCredential={async (credential) => {
                  await handleLogin(credential);
                  setMenuOpen(false);
                }}
                fallbackLabel={mockTranslate("Login", language)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition text-center"
              />
             </div>
           )}
           <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-2 outline-none text-sm text-slate-800 dark:text-slate-200 w-full"
            >
              <option value="en">English (EN)</option>
              <option value="kn">Kannada (KN)</option>
              <option value="hi">Hindi (HI)</option>
              <option value="fr">French (FR)</option>
              <option value="zh">Chinese (ZH)</option>
            </select>
        </div>
      )}
    </nav>
  );
}
