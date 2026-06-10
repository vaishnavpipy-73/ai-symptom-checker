'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Lock, Mail, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { currentUser, loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect to admin panel
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      router.push('/admin');
    }
  }, [currentUser, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);

    try {
      // Execute standard login
      const res = await loginUser(email);
      if (res.success) {
        // Double check if the logged in account is indeed an admin
        const checkUser = await fetch('/api/analytics').then(() => {
          // Dynamic import safety check, we can check role directly in context state
          if (email.toLowerCase() === 'admin@healthcare.com') {
            return 'admin';
          }
          return 'user';
        });

        if (checkUser === 'admin') {
          router.push('/admin');
        } else {
          setError('Access Denied. Standard patient accounts cannot access the admin panel.');
        }
      } else {
        setError(res.error || 'User validation failed.');
      }
    } catch (err) {
      setError('System validation error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@healthcare.com');
    setPassword('••••••••');
    setError('');
    setLoading(true);
    const res = await loginUser('admin@healthcare.com');
    setLoading(false);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Admin sign in failed.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative min-h-[calc(100vh-4rem)] bg-background">
      
      <div className="w-full max-w-sm premium-card rounded-2xl overflow-hidden shadow-xl z-10 animate-fade-in bg-card">
        
        {/* Banner header */}
        <div className="bg-red-500/5 p-6 text-center border-b border-border/40">
          <div className="p-2.5 bg-red-500/10 rounded-xl w-fit mx-auto mb-2 text-red-500">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">
            Secure Admin Gateway
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Restricted operations access portal. Authorization required.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 text-xs text-red-600 dark:text-red-400 bg-red-500/10 rounded-xl border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@healthcare.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Secret Key / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 hover:opacity-95 disabled:opacity-50 transition-all mt-4"
            >
              <span>{loading ? 'Validating...' : 'Authorize Portal'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </form>

          {/* Quick Admin Credentials */}
          <div className="mt-6 pt-5 border-t border-border/40 text-center">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full py-2 bg-secondary/50 hover:bg-secondary border border-border hover:border-red-500/30 rounded-xl text-xs font-bold transition-all text-foreground"
            >
              ⚡ Bypass (Quick Admin Login)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
