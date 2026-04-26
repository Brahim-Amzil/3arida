'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

// UI1 Design: Minimalist & Clean with Soft Gradients
// Color Palette: Deep Purple (#6366f1), Soft Indigo (#818cf8), Clean White, Subtle Gray

export default function UI1HomePage() {
  const [featuredPetitions, setFeaturedPetitions] = useState<Petition[]>([]);
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featuredResult, recentResult, categoriesData] =
          await Promise.all([
            getPetitions(
              { sortBy: 'signatures', sortOrder: 'desc' },
              { page: 1, limit: 3, total: 0, hasMore: false },
            ),
            getPetitions(
              { sortBy: 'recent', sortOrder: 'desc' },
              { page: 1, limit: 6, total: 0, hasMore: false },
            ),
            getCategories(),
          ]);
        setFeaturedPetitions(featuredResult.petitions || []);
        setRecentPetitions(recentResult.petitions || []);
        setCategories(categoriesData.slice(0, 8));
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-50"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                3arida
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/petitions"
                className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {t('nav.petitions')}
              </Link>
              <Link
                href="/pricing"
                className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                href="/about"
                className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {t('nav.about')}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:text-indigo-600"
                >
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/petitions/create">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-6 shadow-lg shadow-indigo-500/25">
                  {t('petitions.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-100/50 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                {locale === 'ar'
                  ? 'منصة العرائض الرقمية'
                  : 'Digital Petition Platform'}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                {locale === 'ar' ? (
                  <>
                    صوتك{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      مهم
                    </span>
                    <br />
                    لأجل التغيير
                  </>
                ) : (
                  <>
                    Your Voice{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Matters
                    </span>
                    <br />
                    for Change
                  </>
                )}
              </h1>

              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                {t('home.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/petitions/create">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-8 shadow-xl shadow-indigo-500/25 h-14 text-base"
                  >
                    {t('petitions.startPetition')}
                    <svg
                      className="w-5 h-5 ml-2 rtl:mr-2 rtl:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Button>
                </Link>
                <Link href="/petitions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 h-14 text-base border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    {t('petitions.discoverPetitions')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Floating Cards */}
                <div className="absolute top-10 right-10 bg-white rounded-2xl shadow-xl p-6 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">2,547</p>
                      <p className="text-sm text-slate-500">
                        {locale === 'ar' ? 'توقيع اليوم' : 'Signatures today'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-xl p-6 animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-indigo-600"
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
                    <div>
                      <p className="font-semibold text-slate-900">156</p>
                      <p className="text-sm text-slate-500">
                        {locale === 'ar' ? 'عريضة نشطة' : 'Active petitions'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-10" />
                  <div className="absolute w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20" />
                  <div className="absolute w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="text-center text-white">
                      <p className="text-5xl font-bold">50K+</p>
                      <p className="text-indigo-100">
                        {locale === 'ar' ? 'توقيع' : 'Signatures'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: '50,000+',
                label:
                  locale === 'ar' ? 'توقيع تم جمعه' : 'Signatures Collected',
                icon: '✍️',
              },
              {
                value: '1,200+',
                label: locale === 'ar' ? 'عريضة نشطة' : 'Active Petitions',
                icon: '📋',
              },
              {
                value: '15,000+',
                label: locale === 'ar' ? 'مستخدم نشط' : 'Active Users',
                icon: '👥',
              },
              {
                value: '45+',
                label: locale === 'ar' ? 'تغيير تم إحداثه' : 'Changes Made',
                icon: '🎯',
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {locale === 'ar' ? 'استكشف حسب الفئة' : 'Explore by Category'}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'اعثر على القضايا التي تهمك ودعمها بالتوقيع'
                : 'Find causes you care about and support them with your signature'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={`/petitions?category=${category.id}`}
                className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{category.icon || '📁'}</span>
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {category.petitionCount || 0}{' '}
                  {locale === 'ar' ? 'عريضة' : 'petitions'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {t('home.featured.title')}
              </h2>
              <p className="text-slate-600">
                {locale === 'ar'
                  ? 'العرائض الأكثر دعماً'
                  : 'Most supported petitions'}
              </p>
            </div>
            <Link
              href="/petitions"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              {t('common.viewAll')}
              <svg
                className="w-4 h-4 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPetitions.map((petition) => (
              <Link
                key={petition.id}
                href={`/petitions/${petition.id}`}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50">
                  {petition.mediaUrls?.[0] ? (
                    <Image
                      src={petition.mediaUrls[0]}
                      alt={petition.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600">
                      {petition.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {petition.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                    {petition.description
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .substring(0, 100)}
                    ...
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {petition.currentSignatures.toLocaleString()}{' '}
                        {locale === 'ar' ? 'توقيع' : 'signatures'}
                      </span>
                      <span className="text-indigo-600 font-medium">
                        {Math.round(
                          (petition.currentSignatures /
                            petition.targetSignatures) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((petition.currentSignatures / petition.targetSignatures) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {locale === 'ar' ? 'جاهز لبدء التغيير؟' : 'Ready to Make a Change?'}
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'أنشئ عريضتك اليوم وانضم إلى آلاف المواطنين الذين يصنعون الفرق'
              : 'Create your petition today and join thousands of citizens making a difference'}
          </p>
          <Link href="/petitions/create">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-10 h-14 text-base font-semibold shadow-xl"
            >
              {t('petitions.startPetition')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <span className="text-xl font-bold text-white">3arida</span>
              </div>
              <p className="text-sm">
                {locale === 'ar'
                  ? 'منصة العرائض الرقمية للمغرب'
                  : 'Digital petition platform for Morocco'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">
                {locale === 'ar' ? 'روابط' : 'Links'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/petitions"
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.petitions')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.pricing')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    {t('nav.about')}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">
                {locale === 'ar' ? 'قانوني' : 'Legal'}
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="hover:text-white transition-colors"
                  >
                    {locale === 'ar' ? 'الإرشادات' : 'Guidelines'}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">
                {locale === 'ar' ? 'اللغة' : 'Language'}
              </h4>
              <div className="flex gap-2">
                <Link
                  href="/ui1"
                  className="px-3 py-1 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                >
                  العربية
                </Link>
                <Link
                  href="/fr/ui1"
                  className="px-3 py-1 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                >
                  Français
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>
              © 2026 3arida.{' '}
              {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
