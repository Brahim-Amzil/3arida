'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import PetitionCard from '@/components/petitions/PetitionCard';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category, PetitionFilters } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

function PetitionsPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<PetitionFilters>({
    category: '',
    search: '',
    sortBy: 'recent',
    sortOrder: 'desc',
  });
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setMounted(true);
    setFilters({
      category: searchParams?.get('category') || '',
      search: searchParams?.get('search') || '',
      sortBy: 'recent',
      sortOrder: 'desc',
    });
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (mounted) {
      loadPetitions(true);
    }
  }, [filters, mounted]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPetitions = async (reset = false) => {
    try {
      setLoading(true);
      setError('');

      const currentPage = reset ? 1 : page;
      const result = await getPetitions(filters, {
        page: currentPage,
        limit: 12,
        total: 0,
        hasMore: false,
      });

      if (reset) {
        setPetitions(result.petitions);
        setPage(1);
      } else {
        setPetitions((prev) => [...prev, ...result.petitions]);
      }

      setHasMore(result.pagination.hasMore);
    } catch (err) {
      console.error('Error loading petitions:', err);
      setError('Failed to load petitions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<PetitionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    loadPetitions(false);
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange({ search: searchTerm });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('petitions.discoverPetitions')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('petitions.findAndSupport')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <a href="/petitions/create">{t('petitions.startAPetition')}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 md:max-w-md">
              <input
                type="text"
                placeholder={t('petitions.searchPetitions')}
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="w-full md:w-64">
              <select
                value={filters.category || ''}
                onChange={(e) =>
                  handleFilterChange({ category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">{t('petitions.allCategories')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name} ({category.petitionCount})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <select
                value={filters.sortBy || 'recent'}
                onChange={(e) =>
                  handleFilterChange({ sortBy: e.target.value as any })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="recent">{t('petitions.mostRecent')}</option>
                <option value="popular">{t('petitions.mostPopular')}</option>
                <option value="signatures">
                  {t('petitions.mostSignatures')}
                </option>
              </select>
            </div>

            <div className="w-full md:w-auto md:ml-4">
              <p className="text-blue-600 font-bold text-lg whitespace-nowrap">
                {loading
                  ? t('petitions.loading')
                  : t('petitions.petitionsFound', { count: petitions.length })}
              </p>
            </div>
          </div>
        </div>

        <main>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-600">{error}</p>
              <Button
                onClick={() => loadPetitions(true)}
                className="mt-4"
                variant="outline"
              >
                {t('petitions.tryAgain')}
              </Button>
            </div>
          )}

          {!loading && petitions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {petitions.map((petition) => (
                <PetitionCard
                  key={petition.id}
                  petition={petition}
                  variant="grid"
                  showProgress={true}
                  showCreator={true}
                />
              ))}
            </div>
          )}

          {!loading && petitions.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No petitions found
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.search || filters.category
                  ? 'Try adjusting your search or filters to find more petitions.'
                  : 'Be the first to create a petition in this category!'}
              </p>
              <Button asChild>
                <a href="/petitions/create">Start a Petition</a>
              </Button>
            </div>
          )}

          {loading && petitions.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && hasMore && (
            <div className="text-center">
              <Button onClick={handleLoadMore} variant="outline" size="lg">
                Load More Petitions
              </Button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default dynamic(() => Promise.resolve(PetitionsPage), {
  ssr: false,
});
