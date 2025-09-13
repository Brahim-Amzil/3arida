import { useState } from 'react';
import { Loading } from '@/components/shared';
import { useAuth } from '@/lib/firebase/AuthContext';
import React from 'react';
import Header from './Header';
import Drawer from './Drawer';
import { useRouter } from 'next/router';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    router.replace('/auth/firebase-login');
    return null;
  }

  return (
    <div>
      <Drawer sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        <Header setSidebarOpen={setSidebarOpen} />
        <EmailVerificationBanner />
        <main className="py-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
