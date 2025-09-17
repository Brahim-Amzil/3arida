'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import PetitionCard from '@/components/petitions/PetitionCard';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions-mock';
import { Petition, Category, PetitionFilters } from '@/types/petition';

export default function PetitionsPage() {
  const searchParams = useSearchParams();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<PetitionFilters>({
    category: searchParams?.get('category') || '',
    search: searchParams?.get('search') || '',
    sortBy: 'recent',
    sortOrder: 'desc',
  });
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPetitions(true);
  }, [filters]);

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

      {/* Page Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Discover Petitions
              </h1>
              <p className="text-lg text-gray-600">
                Find and support causes that matter to you
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button asChild>
                <a href="/petitions/create">Start a Petition</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search petitions..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange({ category: '' })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      !filters.category
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        handleFilterChange({ category: category.name })
                      }
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filters.category === category.name
                          ? 'bg-green-100 text-green-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                      <span className="text-xs text-gray-500 ml-1">
                        ({category.petitionCount})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={filters.sortBy || 'recent'}
                  onChange={(e) =>
                    handleFilterChange({ sortBy: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="signatures">Most Signatures</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  {loading
                    ? 'Loading...'
                    : `${petitions.length} petitions found`}
                  {filters.category && (
                    <span className="ml-2">
                      in <span className="font-medium">{filters.category}</span>
                    </span>
                  )}
                  {filters.search && (
                    <span className="ml-2">
                      for{' '}
                      <span className="font-medium">"{filters.search}"</span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-600">{error}</p>
                <Button
                  onClick={() => loadPetitions(true)}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Petitions Grid */}
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

            {/* Empty State */}
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

            {/* Loading State */}
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

            {/* Load More Button */}
            {!loading && hasMore && (
              <div className="text-center">
                <Button onClick={handleLoadMore} variant="outline" size="lg">
                  Load More Petitions
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
