'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Activity, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Stethoscope, 
  BookOpen, 
  Info,
  Mail,
  User as UserIcon, 
  LogOut, 
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme, currentUser, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Activity },
    { href: '/checker', label: 'Symptom Checker', icon: Stethoscope },
    { href: '/diseases', label: 'Disease Library', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <Activity className="h-5 w-5 text-primary animate-pulse-subtle" />
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-teal-600 to-primary bg-clip-text text-transparent">
                MediPredict<span className="text-foreground font-medium">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                  isActive(link.href)
                    ? 'bg-secondary text-primary font-bold'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Admin Panel Link - Always Visible */}
            <Link
              href="/admin"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 ${
                isActive('/admin')
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Admin Panel</span>
            </Link>
          </nav>

          {/* Settings & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-xl transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-400" />
              )}
            </button>

            {/* Auth Dropdown/Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2.5 pl-2.5 border-l border-border/40">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-foreground">{currentUser.name}</span>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-extrabold">
                    {currentUser.role}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary border border-border font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <button
                  onClick={logoutUser}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu controls */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-xl"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-xl"
              aria-label="Toggle main menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-b border-border/40 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive(link.href)
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
            
            {/* Mobile Admin Link */}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
              }`}
            >
              <span>Admin Panel</span>
            </Link>
            
            {/* User Row for Mobile */}
            {currentUser ? (
              <div className="pt-3 pb-1 border-t border-border/40 px-4">
                <div className="flex items-center space-x-2.5 mb-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-semibold transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-border/40 px-2">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
