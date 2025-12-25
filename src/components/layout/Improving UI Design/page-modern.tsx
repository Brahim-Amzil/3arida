'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import HeaderModern from '@/components/layout/Improving UI Design/HeaderModern';
import PetitionCardModern from '@/components/petitions/PetitionCardModern';
import { Button } from '@/components/ui/button-modern';
import { Badge } from '@/components/ui/badge-modern';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight, Zap, Users, Target } from 'lucide-react';

export default function HomePageModern() {
  const [featuredPetitions, setFeaturedPetitions] = useState<Petition[]>([]);
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        try {
          const featuredResult = await getPetitions(
            { sortBy: 'signatures', sortOrder: 'desc' },
            { page: 1, limit: 3, total: 0, hasMore: false }
          );
          setFeaturedPetitions(featuredResult.petitions || []);
        } catch (err) {
          console.error('Error loading featured petitions:', err);
          setFeaturedPetitions([]);
        }

        try {
          const recentResult = await getPetitions(
            { sortBy: 'recent', sortOrder: 'desc' },
            { page: 1, limit: 6, total: 0, hasMore: false }
          );
          setRecentPetitions(recentResult.petitions || []);
        } catch (err) {
          console.error('Error loading recent petitions:', err);
          setRecentPetitions([]);
        }

        try {
          const categoriesData = await getCategories();
          setCategories(categoriesData.slice(0, 8));
        } catch (err) {
          console.error('Error loading categories:', err);
          setCategories([]);
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
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <HeaderModern />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-neutral-950 dark:to-primary/10 pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="info" className="mx-auto">
                <Zap className="w-3 h-3 mr-1" />
                Empowering Change in Morocco
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 dark:text-white leading-tight">
                Your Voice{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                  Matters
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                Create and sign petitions to drive real change. Join thousands
                of Moroccan citizens making their voices heard on issues that
                matter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/petitions/create">
                <Button size="lg" className="group">
                  Start a Petition
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/petitions">
                <Button size="lg" variant="outline">
                  Explore Petitions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, label: 'Active Supporters', value: '10,000+' },
              { icon: Target, label: 'Petitions Created', value: '500+' },
              { icon: Zap, label: 'Changes Made', value: '50+' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      {!loading && featuredPetitions.length > 0 && (
        <section className="py-20 bg-white dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="default" className="mx-auto mb-4">
                Trending Now
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Featured Petitions
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Discover the petitions gaining the most momentum and support
                from our community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPetitions.map((petition) => (
                <PetitionCardModern
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
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mx-auto mb-4">
                Browse by Category
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                Find Your Cause
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Explore petitions across different categories and find issues
                that matter to you.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/petitions?category=${encodeURIComponent(category.name)}`}
                  className="group"
                >
                  <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-neutral-200 dark:border-neutral-700 hover:border-primary/50">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {category.petitionCount} petitions
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
        <section className="py-20 bg-white dark:bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16">
              <div>
                <Badge variant="default" className="mb-4">
                  Latest
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  Recent Petitions
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  Newly created petitions from our community
                </p>
              </div>
              <Link href="/petitions">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPetitions.map((petition) => (
                <PetitionCardModern
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
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Loading petitions...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Every great change starts with a single voice. Start your petition
            today and rally support for the causes that matter to you.
          </p>
          <Link href="/petitions/create">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-neutral-100"
            >
              Start Your Petition Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <span className="text-xl font-bold">3arida</span>
              </div>
              <p className="text-neutral-400">
                Empowering Moroccan citizens to create change through petitions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Platform</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/petitions"
                    className="hover:text-white transition-colors"
                  >
                    Discover Petitions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/petitions/create"
                    className="hover:text-white transition-colors"
                  >
                    Start a Petition
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="hover:text-white transition-colors"
                  >
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <p className="text-center text-neutral-400">
              © 2024 3arida. All rights reserved. Made with care for Morocco.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
