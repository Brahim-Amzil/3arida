'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

// UI2 Design: Bold & Modern with Vibrant Colors
// Color Palette: Emerald Green (#10b981), Teal (#14b8a6), Dark Slate, Warm Accents

export default function UI2HomePage() {
  const [featuredPetitions, setFeaturedPetitions] = useState<Petition[]>([]);
  const [recentPetitions, setRecentPetitions] = useState<Petition[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [featuredResult, recentResult, categoriesData] = await Promise.all([
          getPetitions({ sortBy: 'signatures', sortOrder: 'desc' }, { page: 1, limit: 3, total: 0, hasMore: false }),
          getPetitions({ sortBy: 'recent', sortOrder: 'desc' }, { page: 1, limit: 6, total: 0, hasMore: false }),
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
    <div className="min-h-screen bg-slate-950 text-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold text-white">
                3arida
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1 bg-slate-900 rounded-full px-2 py-1">
              <Link href="/petitions" className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all font-medium">
                {t('nav.petitions')}
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all font-medium">
                {t('nav.pricing')}
              </Link>
              <Link href="/about" className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all font-medium">
                {t('nav.about')}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/petitions/create">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-emerald-500/25">
                  {t('petitions.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,slate-950_70%)]" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {locale === 'ar' ? 'منصة مغربية للعرائض الرقمية' : 'Moroccan Digital Petition Platform'}
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {locale === 'ar' ? (
                <>
                  {' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    صوتك
                  </span>
                  <br />
                  قوة للتغيير
                </>
              ) : (
                <>
                  Your Voice is
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Power for Change
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/petitions/create">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-10 h-14 text-base font-semibold shadow-xl shadow-emerald-500/25 group">
                  {t('petitions.startPetition')}
                  <svg className="w-5 h-5 ml-2 rtl:mr-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/petitions">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base border-slate-700 hover:bg-slate-800 hover:border-slate-600">
                  {t('petitions.discoverPetitions')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero Stats Cards */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { 
                value: '50,000+', 
                label: locale === 'ar' ? 'توقيع تم جمعه' : 'Signatures Collected',
                gradient: 'from-emerald-500 to-teal-500'
              },
              { 
                value: '1,200+', 
                label: locale === 'ar' ? 'عريضة نشطة' : 'Active Petitions',
                gradient: 'from-teal-500 to-cyan-500'
              },
              { 
                value: '45+', 
                label: locale === 'ar' ? 'تغيير محقق' : 'Changes Achieved',
                gradient: 'from-cyan-500 to-blue-500'
              },
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center hover:border-slate-700 transition-colors">
                  <p className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </p>
                  <p className="text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {locale === 'ar' ? 'تصفح حسب الفئة' : 'Browse by Category'}
              </h2>
              <p className="text-slate-400">
                {locale === 'ar' ? 'اعثر على القضايا التي تهمك' : 'Find causes that matter to you'}
              </p>
            </div>
            <Link href="/petitions" className="hidden md:flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium">
              {t('common.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={`/petitions?category=${category.id}`}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <div className="relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">
                      {category.icon || '📁'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {category.petitionCount || 0} {locale === 'ar' ? 'عريضة' : 'petitions'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-4">
              {t('home.featured.title')}
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              {locale === 'ar' ? 'العرائض الأكثر دعماً' : 'Trending Petitions'}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {locale === 'ar' ? 'انضم إلى آلاف المواطنين في دعم هذه القضايا' : 'Join thousands of citizens supporting these causes'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPetitions.map((petition, index) => (
              <Link
                key={petition.id}
                href={`/petitions/${petition.id}`}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all">
                  {/* Image */}
                  <div className="relative h-52 bg-slate-800">
                    {petition.mediaUrls?.[0] ? (
                      <Image
                        src={petition.mediaUrls[0]}
                        alt={petition.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center">
                          <span className="text-3xl">📋</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-300 border border-slate-700">
                        {petition.category}
                      </span>
                    </div>
                    
                    {/* Progress Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-sm rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30">
                        {Math.round((petition.currentSignatures / petition.targetSignatures) * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                      {petition.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {petition.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 100)}...
                    </p>
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((petition.currentSignatures / petition.targetSignatures) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          {petition.currentSignatures.toLocaleString()} {locale === 'ar' ? 'توقيع' : 'signed'}
                        </span>
                        <span className="text-slate-500">
                          {petition.targetSignatures.toLocaleString()} {locale === 'ar' ? 'هدف' : 'goal'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/petitions">
              <Button variant="outline" className="rounded-full px-8 border-slate-700 hover:bg-slate-800 hover:border-slate-600">
                {locale === 'ar' ? 'عرض جميع العرائض' : 'View All Petitions'}
                <svg className="w-4 h-4 ml-2 rtl:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              {locale === 'ar' ? 'كيف تعمل المنصة؟' : 'How It Works'}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              {locale === 'ar' ? 'ثلاث خطوات بسيطة لبدء التغيير' : 'Three simple steps to start making change'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: locale === 'ar' ? 'أنشئ عريضتك' : 'Create Your Petition',
                description: locale === 'ar' ? 'اكتب قضيتك وحدد أهدافك بوضوح' : 'Write your cause and set clear goals',
                icon: '✍️',
              },
              {
                step: '02',
                title: locale === 'ar' ? 'شاركها' : 'Share It',
                description: locale === 'ar' ? 'انشر عريضتك واجمع التوقيعات' : 'Spread your petition and gather signatures',
                icon: '📢',
              },
              {
                step: '03',
                title: locale === 'ar' ? 'حقق التغيير' : 'Make Change',
                description: locale === 'ar' ? 'قدم عريضتك للجهات المعنية' : 'Submit your petition to relevant authorities',
                icon: '🎯',
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                <div className="relative bg-slate-900/50 border border-slate-800 rounded-3xl p-8 text-center hover:border-emerald-500/30 transition-all">
                  <div className="text-5xl font-bold bg-gradient-to-r from-emerald-500/20 to-teal-500/20 bg-clip-text text-transparent mb-4">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {locale === 'ar' ? 'ابدأ رحلة التغيير اليوم' : 'Start Your Journey for Change Today'}
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'انضم إلى آلاف المواطنين الذين يصنعون الفرق في مجتمعاتهم'
              : 'Join thousands of citizens making a difference in their communities'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/petitions/create">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 rounded-full px-10 h-14 text-base font-semibold shadow-xl">
                {t('petitions.startPetition')}
              </Button>
            </Link>
            <Link href="/petitions">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 rounded-full px-10 h-14 text-base font-semibold">
                {t('petitions.discoverPetitions')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <span className="text-xl font-bold text-white">3arida</span>
              </div>
              <p className="text-sm text-slate-500">
                {locale === 'ar' ? 'منصة العرائض الرقمية للمغرب' : 'Digital petition platform for Morocco'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">{locale === 'ar' ? 'روابط' : 'Links'}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/petitions" className="hover:text-emerald-400 transition-colors">{t('nav.petitions')}</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">{t('nav.pricing')}</Link></li>
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">{t('nav.about')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">{locale === 'ar' ? 'قانوني' : 'Legal'}</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                <li><Link href="/guidelines" className="hover:text-emerald-400 transition-colors">{locale === 'ar' ? 'الإرشادات' : 'Guidelines'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">{locale === 'ar' ? 'اللغة' : 'Language'}</h4>
              <div className="flex gap-2">
                <Link href="/ui2" className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  العربية
                </Link>
                <Link href="/fr/ui2" className="px-3 py-1 bg-slate-800 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  Français
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-600">
            <p>© 2025 3arida. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
