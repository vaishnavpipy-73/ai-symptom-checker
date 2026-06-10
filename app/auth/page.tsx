'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { currentUser, loginUser, registerUser } = useApp();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Simulated password
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (activeTab === 'register' && !name) {
      setError('Full name is required');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const res = await loginUser(email);
        if (res.success) {
          router.push('/dashboard');
        } else {
          setError(res.error || 'Failed to sign in');
        }
      } else {
        const res = await registerUser(name, email);
        if (res.success) {
          router.push('/dashboard');
        } else {
          setError(res.error || 'Failed to register');
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('••••••••');
    setError('');
    setLoading(true);
    const res = await loginUser(quickEmail);
    setLoading(false);
    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.error || 'Failed to sign in');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative min-h-[calc(100vh-4rem)]">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl overflow-hidden border border-border/40 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Banner header */}
        <div className="bg-primary/10 dark:bg-primary/20 p-6 text-center border-b border-border/20">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-600 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Welcome to MediPredict AI
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your healthcare statistics, predictions, and reports
          </p>
        </div>

        {/* Form Tabs */}
        <div className="flex border-b border-border/40">
          <button
            onClick={() => { setActiveTab('signin'); setError(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-colors duration-200 ${
              activeTab === 'signin'
                ? 'border-b-2 border-primary text-primary bg-card/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-colors duration-200 ${
              activeTab === 'register'
                ? 'border-b-2 border-primary text-primary bg-card/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="p-4 mb-5 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {activeTab === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border/60 rounded-xl focus:border-primary focus:outline-none text-sm transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-transform duration-100 mt-6"
            >
              <span>{loading ? 'Please wait...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Quick Login Section for Testing */}
          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
              ⚡ Sandbox Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('user@healthcare.com')}
                className="p-3 bg-secondary/40 hover:bg-secondary/70 border border-border/50 hover:border-primary/30 rounded-2xl flex flex-col items-center justify-center transition-all group"
              >
                <User className="h-4 w-4 text-teal-600 dark:text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Standard Patient</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">user@healthcare.com</span>
              </button>
              <button
                onClick={() => handleQuickLogin('admin@healthcare.com')}
                className="p-3 bg-secondary/40 hover:bg-secondary/70 border border-border/50 hover:border-primary/30 rounded-2xl flex flex-col items-center justify-center transition-all group"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Medical Admin</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">admin@healthcare.com</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
