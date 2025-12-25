'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button-modern';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { Menu, X, LogOut, Settings, BarChart3, Shield } from 'lucide-react';

// Profile Dropdown Component
function ProfileDropdown({ user, userProfile, onLogout }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className="relative flex items-center space-x-3" ref={dropdownRef}>
      <NotificationCenter />

      {/* Admin Badge */}
      {userProfile?.role === 'admin' && (
        <Link
          href="/admin"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
        >
          <Shield className="w-4 h-4" />
          <span>Admin</span>
        </Link>
      )}

      {/* Moderator Badge */}
      {userProfile?.role === 'moderator' && (
        <Link
          href="/admin/petitions"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Moderator</span>
        </Link>
      )}

      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 py-1.5 transition-colors"
      >
        {userProfile?.photoURL || user?.photoURL ? (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
            <img
              src={userProfile?.photoURL || user?.photoURL || ''}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {getInitials(user?.displayName, user?.email)}
            </span>
          </div>
        )}
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-scale-in">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Profile Settings</span>
          </Link>

          {userProfile?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}

          <div className="border-t border-neutral-200 dark:border-neutral-800 my-2"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

function HeaderInner() {
  const { user, userProfile, isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <span className="text-xl font-bold text-neutral-900 dark:text-white hidden sm:inline">3arida</span>
              </Link>
            </div>
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-neutral-950/95" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <span className="text-xl font-bold text-neutral-900 dark:text-white hidden sm:inline">3arida</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/petitions"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t('petitions.browse')}
            </Link>
            <Link
              href="/petitions/create"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {t('petitions.startPetition')}
            </Link>
            <Link
              href="/about"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              About
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            {!loading && isAuthenticated ? (
              <ProfileDropdown user={user} userProfile={userProfile} onLogout={handleLogout} />
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-in-from-top">
            <Link
              href="/petitions"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {t('petitions.browse')}
            </Link>
            <Link
              href="/petitions/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {t('petitions.startPetition')}
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              About
            </Link>
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default HeaderInner;
