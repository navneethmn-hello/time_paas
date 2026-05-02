import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'itna vibe',
  description: 'Exclusively for University Students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
               {/* Ambient liquid glass background effects */}
               <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-blob pointer-events-none"></div>
               <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
               <div className="absolute bottom-[-20%] left-[20%] w-[400px] h-[400px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-4000 pointer-events-none"></div>
               
               <Navbar />
               <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 relative z-10">
                {children}
               </main>
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
