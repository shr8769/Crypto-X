import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import Header from './components/Header';

export const metadata = {
  title: 'CryptoX',
  description: 'Modern Crypto Dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-binanceDark text-white min-h-screen">
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
          <footer className="text-center text-gray-400 py-8 bg-binanceGray mt-16">
            CryptoX &copy; 2025
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
