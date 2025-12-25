'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/HeaderWrapper';
import Footer from '@/components/layout/Footer';
import PetitionCardModern from '@/components/petitions/PetitionCardModern';
import { Button } from '@/components/ui/button-modern';
import { Card, CardContent } from '@/components/ui/card-modern';
import { Badge } from '@/components/ui/badge-modern';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category, PetitionFilters } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, Filter, TrendingUp, Clock, Users, Plus } from 'lucide-react';

function PetitionsModernPage() {
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const getSortIcon = (sortBy: string) => {
    switch (sortBy) {
      case 'recent':
        return <Clock className="w-4 h-4" />;
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      case 'signatures':
        return <Users className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Header />

      {/* Modern Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="success" className="animate-pulse">
                  {petitions.length} Active Petitions
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
                {t('petitions.discoverPetitions')}
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl">
                {t('petitions.findAndSupport')}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button size="lg" className="gap-2" asChild>
                <a href="/petitions/create">
                  <Plus className="w-5 h-5" />
                  {t('petitions.startAPetition')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Filters Card */}
        <Card className="mb-8 backdrop-blur-sm bg-white/80">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('petitions.searchPetitions')}
                    value={filters.search || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                  <select
                    value={filters.category || ''}
                    onChange={(e) =>
                      handleFilterChange({ category: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                  >
                    <option value="">{t('petitions.allCategories')}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name} (
                        {category.petitionCount})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="w-full lg:w-48">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                    {getSortIcon(filters.sortBy || 'recent')}
                  </div>
                  <select
                    value={filters.sortBy || 'recent'}
                    onChange={(e) =>
                      handleFilterChange({ sortBy: e.target.value as any })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                  >
                    <option value="recent">{t('petitions.mostRecent')}</option>
                    <option value="popular">
                      {t('petitions.mostPopular')}
                    </option>
                    <option value="signatures">
                      {t('petitions.mostSignatures')}
                    </option>
                  </select>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>

              {/* Results Counter */}
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="text-primary border-primary/20 bg-primary/5"
                >
                  {loading
                    ? t('petitions.loading')
                    : t('petitions.petitionsFound', {
                        count: petitions.length,
                      })}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <main>
          {/* Error State */}
          {error && (
            <Card className="mb-8 border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-destructive"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-destructive">
                      Error Loading Petitions
                    </h3>
                    <p className="text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={() => loadPetitions(true)}
                  variant="outline"
                  className="border-destructive/20 text-destructive hover:bg-destructive/5"
                >
                  {t('petitions.tryAgain')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Petitions Grid/List */}
          {!loading && petitions.length > 0 && (
            <div
              className={`mb-8 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }`}
            >
              {petitions.map((petition) => (
                <div key={petition.id} className="animate-fade-in">
                  <PetitionCardModern
                    petition={petition}
                    variant={viewMode === 'grid' ? 'grid' : 'list'}
                    showProgress={true}
                    showCreator={true}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && petitions.length === 0 && !error && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-primary/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                  No petitions found
                </h3>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  {filters.search || filters.category
                    ? 'Try adjusting your search or filters to find more petitions.'
                    : 'Be the first to create a petition in this category!'}
                </p>
                <Button size="lg" className="gap-2" asChild>
                  <a href="/petitions/create">
                    <Plus className="w-5 h-5" />
                    Start a Petition
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && petitions.length === 0 && (
            <div
              className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-neutral-200 to-neutral-100"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-neutral-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-neutral-200 rounded-lg w-3/4 mb-4"></div>
                    <div className="h-2 bg-neutral-200 rounded-full mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-neutral-200 rounded-lg w-1/4"></div>
                      <div className="h-4 bg-neutral-200 rounded-lg w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasMore && (
            <div className="text-center">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                className="gap-2 hover:shadow-lg transition-all duration-200"
              >
                <TrendingUp className="w-5 h-5" />
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

export default dynamic(() => Promise.resolve(PetitionsModernPage), {
  ssr: false,
});
