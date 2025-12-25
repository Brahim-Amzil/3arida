'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

// Profile Dropdown Component
function ProfileDropdown({ user, userProfile, onLogout }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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

  return (
    <div className="relative flex items-center gap-4" ref={dropdownRef}>
      <NotificationCenter />

      {/* Admin Badge - Only show for admins */}
      {userProfile?.role === 'admin' && (
        <Link
          href="/admin"
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">Admin</span>
        </Link>
      )}

      {/* Moderator Badge - Only show for moderators */}
      {userProfile?.role === 'moderator' && (
        <Link
          href="/admin/petitions"
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold">Moderator</span>
        </Link>
      )}

      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
      >
        {userProfile?.photoURL || user?.photoURL ? (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={userProfile?.photoURL || user?.photoURL || ''}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm text-gray-700 font-medium">
          {user?.displayName || user?.email?.split('@')[0]}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
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
        <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{t('profile.dashboard')}</div>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{t('profile.myCampaigns')}</div>
          </Link>

          {userProfile?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <div className="font-medium">👑 {t('profile.admin')}</div>
            </Link>
          )}

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{t('profile.settings')}</div>
          </Link>

          <div className="border-t border-gray-200 my-2"></div>

          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">{t('profile.signOut')}</div>
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
  const { t, locale } = useTranslation();

  useEffect(() => {
    // Small delay to ensure hydration is complete
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

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  {locale === 'ar' ? 'عريضة' : '3arida'}
                </span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/petitions"
                className="text-gray-800 hover:text-gray-900 font-medium transition-colors"
              >
                {t('petitions.discoverPetitions')}
              </Link>
              <Link
                href="/petitions/create"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {t('petitions.startAPetition')}
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                About
              </Link>
            </nav>
            {/* Loading placeholder */}
            <div className="hidden md:flex items-center gap-4">
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">#</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                {locale === 'ar' ? 'عريضة' : '3arida'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/petitions"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {t('petitions.browse')}
            </Link>
            <Link
              href="/petitions/create"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {t('petitions.startPetition')}
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              {t('nav.about')}
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
            ) : isAuthenticated ? (
              <ProfileDropdown
                user={user}
                userProfile={userProfile}
                onLogout={handleLogout}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">{t('nav.register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/petitions"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('petitions.browse')}
              </Link>
              <Link
                href="/petitions/create"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('petitions.startPetition')}
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </Link>

              {/* Mobile Language Switcher */}
              <div className="pt-2">
                <LanguageSwitcher />
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-gray-200">
                {loading ? (
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        {t('nav.dashboard')}
                      </Button>
                    </Link>
                    {userProfile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-purple-600 hover:text-purple-700"
                        >
                          👑 {t('nav.admin')}
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      {t('nav.logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full">
                        {t('nav.register')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Default export - just use HeaderInner directly
// The 'use client' directive at the top handles client-side rendering
export default HeaderInner;
