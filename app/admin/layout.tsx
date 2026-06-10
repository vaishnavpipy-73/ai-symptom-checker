'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Activity } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // If not at the login page, verify admin role
    if (pathname !== '/admin/login') {
      if (!currentUser) {
        router.push('/admin/login');
      } else if (currentUser.role !== 'admin') {
        router.push('/dashboard');
      } else {
        setCheckingAuth(false);
      }
    } else {
      setCheckingAuth(false);
    }
  }, [currentUser, pathname, router]);

  if (checkingAuth) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center space-y-3">
          <Activity className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Verifying access authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col">
      {/* We can nest layout grids or sidebars here */}
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
