'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPetitions, getCategories } from '@/lib/petitions';
import { Petition, Category } from '@/types/petition';
import { useTranslation } from '@/hooks/useTranslation';

// UI3 Design: Trust & Authority - Government/Civic Style
// Color Palette: Navy Blue (#1e3a5f), Gold (#c9a227), White, Slate Gray
// Inspired by official government portals and civic engagement platforms

export default function UI3HomePage() {
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
    <div className="min-h-screen bg-white" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="bg-[#1e3a5f] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +212 5XX-XXXXXX
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contact@3arida.org
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/ui3" className="hover:text-[#c9a227] transition-colors">العربية</Link>
            <span className="text-[#c9a227]">|</span>
            <Link href="/fr/ui3" className="hover:text-[#c9a227] transition-colors">Français</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b-4 border-[#c9a227] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-4">
              {/* Official-looking emblem */}
              <div className="relative">
                <div className="w-14 h-14 bg-[#1e3a5f] rounded-full flex items-center justify-center border-2 border-[#c9a227]">
                  <span className="text-[#c9a227] font-bold text-xl">3</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#c9a227] rotate-45" />
              </div>
              <div>
                <span className="text-2xl font-bold text-[#1e3a5f] tracking-wide">3ARIDA</span>
                <p className="text-xs text-slate-500 tracking-widest uppercase">
                  {locale === 'ar' ? 'منصة العرائض الوطنية' : 'National Petition Platform'}
                </p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/petitions" className="text-[#1e3a5f] hover:text-[#c9a227] font-semibold transition-colors uppercase text-sm tracking-wide">
                {t('nav.petitions')}
              </Link>
              <Link href="/pricing" className="text-[#1e3a5f] hover:text-[#c9a227] font-semibold transition-colors uppercase text-sm tracking-wide">
                {t('nav.pricing')}
              </Link>
              <Link href="/about" className="text-[#1e3a5f] hover:text-[#c9a227] font-semibold transition-colors uppercase text-sm tracking-wide">
                {t('nav.about')}
              </Link>
              <Link href="/help" className="text-[#1e3a5f] hover:text-[#c9a227] font-semibold transition-colors uppercase text-sm tracking-wide">
                {locale === 'ar' ? 'المساعدة' : 'Help'}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="outline" className="border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white font-semibold px-6">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/petitions/create">
                <Button className="bg-[#c9a227] hover:bg-[#b8922a] text-white font-semibold px-6 shadow-lg">
                  {t('petitions.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#1e3a5f] overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Official badge */}
              <div className="inline-flex items-center gap-3 bg-white/10 border border-[#c9a227]/30 px-5 py-2 mb-8">
                <svg className="w-5 h-5 text-[#c9a227]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider">
                  {locale === 'ar' ? 'منصة رسمية معتمدة' : 'Official Verified Platform'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {locale === 'ar' ? (
                  <>
                    {' '}
                    <span className="text-[#c9a227]">صوتك</span> حق
                    <br />
                    والمطالبة واجب
                  </>
                ) : (
                  <>
                    Your <span className="text-[#c9a227]">Voice</span> is a Right
                    <br />
                    Demanding is a Duty
                  </>
                )}
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                {locale === 'ar' 
                  ? 'منصة وطنية لإنشاء وتقديم العرائض الرسمية. صوتك مسموع ومطالبك محترمة.'
                  : 'A national platform for creating and submitting official petitions. Your voice is heard and your demands are respected.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/petitions/create">
                  <Button size="lg" className="bg-[#c9a227] hover:bg-[#b8922a] text-white font-bold px-10 h-14 text-base shadow-xl">
                    {t('petitions.startPetition')}
                  </Button>
                </Link>
                <Link href="/petitions">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#1e3a5f] font-bold px-10 h-14 text-base">
                    {t('petitions.discoverPetitions')}
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-slate-400 text-sm mb-4 uppercase tracking-wider">
                  {locale === 'ar' ? 'مدعوم من' : 'Trusted by'}
                </p>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">50K+</p>
                    <p className="text-slate-400 text-sm">{locale === 'ar' ? 'مواطن' : 'Citizens'}</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">1,200+</p>
                    <p className="text-slate-400 text-sm">{locale === 'ar' ? 'عريضة' : 'Petitions'}</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">45+</p>
                    <p className="text-slate-400 text-sm">{locale === 'ar' ? 'قرار' : 'Decisions'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual - Document/Seal Style */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main document card */}
                <div className="bg-white rounded-lg shadow-2xl p-8 transform rotate-2">
                  <div className="border-4 border-[#1e3a5f] p-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-slate-200">
                      <div className="w-16 h-16 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                        <span className="text-[#c9a227] font-bold text-2xl">3</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1e3a5f] text-lg">عريضة رسمية</h3>
                        <p className="text-slate-500 text-sm">Official Petition</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-4/5" />
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                    </div>
                    <div className="mt-6 pt-6 border-t-2 border-slate-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-slate-600">{locale === 'ar' ? 'تم التحقق' : 'Verified'}</span>
                      </div>
                      <div className="w-12 h-12 bg-[#c9a227] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative seal */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#c9a227] rounded-full flex items-center justify-center shadow-xl transform -rotate-12">
                  <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs text-center">
                      {locale === 'ar' ? 'رسمي' : 'OFFICIAL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#c9a227] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: locale === 'ar' ? 'توقيع موثق' : 'Verified Signatures' },
              { value: '1,200+', label: locale === 'ar' ? 'عريضة نشطة' : 'Active Petitions' },
              { value: '15,000+', label: locale === 'ar' ? 'مستخدم مسجل' : 'Registered Users' },
              { value: '45+', label: locale === 'ar' ? 'قرار تم تحقيقه' : 'Achieved Decisions' },
            ].map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold text-[#1e3a5f]">{stat.value}</p>
                <p className="text-[#1e3a5f]/70 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-[#1e3a5f] text-[#c9a227] text-sm font-semibold uppercase tracking-wider mb-4">
              {locale === 'ar' ? 'الفئات' : 'Categories'}
            </span>
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">
              {locale === 'ar' ? 'اختر مجال اهتمامك' : 'Choose Your Area of Interest'}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {locale === 'ar' 
                ? 'تصفح العرائض حسب الفئة وشارك في القضايا التي تهمك'
                : 'Browse petitions by category and participate in causes that matter to you'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.id || index}
                href={`/petitions?category=${category.id}`}
                className="group bg-white border-2 border-slate-200 p-6 hover:border-[#c9a227] hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#1e3a5f] flex items-center justify-center mb-4 group-hover:bg-[#c9a227] transition-colors">
                  <span className="text-2xl">{category.icon || '📋'}</span>
                </div>
                <h3 className="font-bold text-[#1e3a5f] mb-1 group-hover:text-[#c9a227] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {category.petitionCount || 0} {locale === 'ar' ? 'عريضة' : 'petitions'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b-2 border-slate-200 pb-6">
            <div>
              <span className="inline-block px-4 py-1 bg-[#c9a227] text-white text-sm font-semibold uppercase tracking-wider mb-4">
                {locale === 'ar' ? 'مميزة' : 'Featured'}
              </span>
              <h2 className="text-3xl font-bold text-[#1e3a5f]">
                {locale === 'ar' ? 'العرائض الأكثر دعماً' : 'Most Supported Petitions'}
              </h2>
            </div>
            <Link href="/petitions" className="hidden md:flex items-center gap-2 text-[#1e3a5f] hover:text-[#c9a227] font-semibold transition-colors">
              {t('common.viewAll')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPetitions.map((petition, index) => (
              <Link
                key={petition.id}
                href={`/petitions/${petition.id}`}
                className="group bg-white border-2 border-slate-200 hover:border-[#c9a227] hover:shadow-xl transition-all"
              >
                <div className="relative h-48 bg-slate-100">
                  {petition.mediaUrls?.[0] ? (
                    <Image
                      src={petition.mediaUrls[0]}
                      alt={petition.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1e3a5f]">
                      <span className="text-4xl text-[#c9a227]">📋</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#1e3a5f] px-3 py-1">
                    <span className="text-white text-xs font-semibold uppercase">
                      {petition.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-[#1e3a5f] text-lg mb-2 line-clamp-2 group-hover:text-[#c9a227] transition-colors">
                    {petition.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {petition.description.replace(/\*\*(.*?)\*\*/g, '$1').substring(0, 100)}...
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-[#1e3a5f]">
                        {petition.currentSignatures.toLocaleString()} {locale === 'ar' ? 'توقيع' : 'signatures'}
                      </span>
                      <span className="text-[#c9a227]">
                        {Math.round((petition.currentSignatures / petition.targetSignatures) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-[#c9a227] transition-all duration-500"
                        style={{ width: `${Math.min((petition.currentSignatures / petition.targetSignatures) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#1e3a5f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#c9a227] text-white text-sm font-semibold uppercase tracking-wider mb-4">
              {locale === 'ar' ? 'الخطوات' : 'Steps'}
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              {locale === 'ar' ? 'كيف تعمل المنصة؟' : 'How It Works'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: locale === 'ar' ? 'أنشئ عريضتك' : 'Create Your Petition',
                description: locale === 'ar' ? 'اكتب قضيتك بوضوح وحدد المطالب المحددة' : 'Write your cause clearly and define specific demands',
              },
              {
                step: '02',
                title: locale === 'ar' ? 'اجمع التوقيعات' : 'Gather Signatures',
                description: locale === 'ar' ? 'شارك عريضتك واجمع دعم المواطنين' : 'Share your petition and gather citizen support',
              },
              {
                step: '03',
                title: locale === 'ar' ? 'قدمها للجهات المعنية' : 'Submit to Authorities',
                description: locale === 'ar' ? 'نقدم عريضتك رسمياً للجهات المختصة' : 'We officially submit your petition to relevant authorities',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 border-l-4 border-[#c9a227]">
                  <span className="text-6xl font-bold text-[#c9a227]/20 absolute top-4 right-4">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#c9a227]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-6">
            {locale === 'ar' ? 'مستعد لبدء التغيير؟' : 'Ready to Start Making Change?'}
          </h2>
          <p className="text-lg text-[#1e3a5f]/80 mb-8 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'أنشئ عريضتك اليوم وانضم إلى آلاف المواطنين الذين يصنعون الفرق'
              : 'Create your petition today and join thousands of citizens making a difference'}
          </p>
          <Link href="/petitions/create">
            <Button size="lg" className="bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white font-bold px-12 h-16 text-lg shadow-xl">
              {t('petitions.startPetition')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#c9a227] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <span className="text-xl font-bold">3ARIDA</span>
              </div>
              <p className="text-slate-400 text-sm">
                {locale === 'ar' ? 'منصة العرائض الوطنية للمغرب' : 'National Petition Platform for Morocco'}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-[#c9a227] mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/petitions" className="hover:text-[#c9a227] transition-colors">{t('nav.petitions')}</Link></li>
                <li><Link href="/pricing" className="hover:text-[#c9a227] transition-colors">{t('nav.pricing')}</Link></li>
                <li><Link href="/about" className="hover:text-[#c9a227] transition-colors">{t('nav.about')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[#c9a227] mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'قانوني' : 'Legal'}
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/privacy" className="hover:text-[#c9a227] transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                <li><Link href="/guidelines" className="hover:text-[#c9a227] transition-colors">{locale === 'ar' ? 'الإرشادات' : 'Guidelines'}</Link></li>
                <li><Link href="/cookies" className="hover:text-[#c9a227] transition-colors">{locale === 'ar' ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[#c9a227] mb-4 uppercase text-sm tracking-wider">
                {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@3arida.org
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +212 5XX-XXXXXX
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 3arida. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">
                {locale === 'ar' ? 'مدعوم بـ' : 'Powered by'} 
              </span>
              <span className="text-[#c9a227] font-semibold">3arida Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
