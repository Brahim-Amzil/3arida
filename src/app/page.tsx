'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/HeaderWrapper';
import PetitionCard from '@/components/petitions/PetitionCard';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const [featuredPetitions, setFeaturedPetitions] = useState<Petition[]>([]);
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { t, locale } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Load featured petitions (most signed) - with error handling
        try {
          const featuredResult = await getPetitions(
            { sortBy: 'signatures', sortOrder: 'desc' },
            { page: 1, limit: 3, total: 0, hasMore: false },
          );
          setFeaturedPetitions(featuredResult.petitions || []);
        } catch (err) {
          console.error('Error loading featured petitions:', err);
          setFeaturedPetitions([]);
        }

        // Load recent petitions - with error handling
        try {
          const recentResult = await getPetitions(
            { sortBy: 'recent', sortOrder: 'desc' },
            { page: 1, limit: 6, total: 0, hasMore: false },
          );
          setRecentPetitions(recentResult.petitions || []);
        } catch (err) {
          console.error('Error loading recent petitions:', err);
          setRecentPetitions([]);
        }

        // Load categories - with error handling
        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData.slice(0, 8)); // Show first 8 categories
        } catch (err) {
          console.error('Error loading categories:', err);
          setCategories([]); // Continue without categories
        }
      } catch (err) {
        console.error('Error loading home page data:', err);
        setError('Failed to load petitions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto whitespace-pre-line">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/petitions/create">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  {t('petitions.startPetition')}
                </Button>
              </Link>
              <Link href="/petitions">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white font-semibold px-8 py-3"
                >
                  {t('petitions.discoverPetitions')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Commented out until we have enough real data */}
      {/*
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">{t('home.stats.signatures')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">{t('home.stats.petitions')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">{t('home.stats.changes')}</div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Featured Petitions */}
      {!loading && featuredPetitions.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.featured.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('home.featured.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPetitions.map((petition) => (
                <PetitionCard
                  key={petition.id}
                  petition={petition}
                  variant="featured"
                  showProgress={true}
                  showCreator={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('home.categories.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('home.categories.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/petitions?category=${encodeURIComponent(
                    category.name,
                  )}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.petitionCount} {t('categories.petitions')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Petitions */}
      {!loading && recentPetitions.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('home.recent.title')}
                </h2>
                <p className="text-lg text-gray-600">
                  {t('home.recent.subtitle')}
                </p>
              </div>
              <Link href="/petitions">
                <Button variant="outline">
                  {t('petitions.viewAllPetitions')}
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPetitions.map((petition) => (
                <PetitionCard
                  key={petition.id}
                  petition={petition}
                  variant="grid"
                  showProgress={true}
                  showCreator={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  {t('common.tryAgain')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.cta.title')}</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link href="/petitions/create">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">#</span>
                </div>
                <span className="text-xl font-bold">
                  {locale === 'ar' ? 'عريضة' : '3arida'}
                </span>
              </div>
              <p className="text-gray-400">{t('footer.description')}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.platform')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/petitions" className="hover:text-white">
                    {t('petitions.discoverPetitions')}
                  </Link>
                </li>
                <li>
                  <Link href="/petitions/create" className="hover:text-white">
                    {t('petitions.startPetition')}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    {t('nav.about')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    {t('footer.helpCenter')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    {t('footer.contactUs')}
                  </Link>
                </li>
                <li>
                  <Link href="/guidelines" className="hover:text-white">
                    {t('footer.communityGuidelines')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    {t('footer.privacyPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    {t('footer.termsOfService')}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    {t('footer.cookiePolicy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2026 3arida. All rights reserved. Operated by{' '}
              <a
                href="https://baskomedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 font-medium"
              >
                BASKO•MEDIA
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
