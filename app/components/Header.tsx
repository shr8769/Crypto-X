"use client";
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { TrendingUp, Menu, X, BarChart3, Newspaper, Home } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analysis', href: '/analysis' },
    { icon: <Newspaper className="w-5 h-5" />, label: 'News', href: '/news' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-binanceGray/90 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4">
        <a href="/" className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-binanceYellow" />
          <span className="text-2xl font-bold text-binanceYellow">CryptoX</span>
        </a>
        
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <SignedIn>
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-binanceYellow transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </SignedIn>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-binanceDark hover:bg-binanceGray transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Auth Buttons */}
          <SignedOut>
            <a
              href="/sign-in"
              className="bg-binanceYellow text-binanceDark px-6 py-2 rounded-full font-medium hover:bg-yellow-400 transition-all duration-200"
            >
              Sign In
            </a>
          </SignedOut>

          <SignedIn>
            <UserButton 
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonPopoverCard: "bg-binanceGray border-gray-700",
                  userButtonPopoverActionButton: "text-white hover:bg-gray-700",
                }
              }}
            />
          </SignedIn>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-binanceGray/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <SignedIn>
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-binanceDark text-white hover:text-binanceYellow transition-all"
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
