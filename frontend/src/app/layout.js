import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'itna vibe',
  description: 'Exclusively for University Students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script src="https://js.puter.com/v2/" strategy="beforeInteractive" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen relative overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
                 <Navbar />
                 <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 relative z-10 max-w-xl">
                  {children}
                 </main>
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
